"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Tag, Search, X } from 'lucide-react';
import TechniqueCard from '../card/TechniqueCard';
import DiaryCard from '../card/DiaryCard';

type Variant = 'ricette' | 'tecniche' | 'diario';

interface PostItem {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: { _ref: string; _type: string };
    [key: string]: unknown;
  };
  categories?: { title: string }[];
  excerpt?: string;
  author?: { name?: string };
  publishedAt?: string;
  difficulty?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  rating?: number;
}

export default function PostsClient({ title, variant }: { title: string; variant: Variant }) {
  const [items, setItems] = useState<PostItem[]>([]);
  const [filtered, setFiltered] = useState<PostItem[]>([]);
  const [category, setCategory] = useState('Tutte');
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([{ name: 'Tutte', count: 0 }]);
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      const query = `*[_type == "recipe" && defined(slug.current)]|order(publishedAt desc){
        _id,
        title,
        slug,
        mainImage,
        categories[]->{title},
        excerpt,
        author->{name},
        publishedAt,
        prepTime,
        cookTime,
        difficulty,
        servings,
        rating
      }`;
      const data = await client.fetch(query);
      setItems(data);
      setFiltered(data);
      const catMap = new Map<string, number>();
      data.forEach((p: PostItem) => {
        p.categories?.forEach((c) => {
          const t = typeof c.title === 'string' ? c.title : String(c.title);
          catMap.set(t, (catMap.get(t) || 0) + 1);
        });
      });
      const cats = Array.from(catMap.entries()).map(([name, count]) => ({ name, count }));
      setCategories([{ name: 'Tutte', count: data.length }, ...cats]);
    }
    fetchPosts();
  }, []);

  // Sync category from URL on mount and when it changes
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  // Keep URL in sync when category changes manually
  useEffect(() => {
    const current = searchParams.get('category');
    if ((category === 'Tutte' && current !== null) || (category !== 'Tutte' && current !== category)) {
      const params = new URLSearchParams(searchParams.toString());
      if (category === 'Tutte') {
        params.delete('category');
      } else {
        params.set('category', category);
      }
      router.replace(`?${params.toString()}`);
    }
  }, [category, router, searchParams]);

  useEffect(() => {
    let next = items;
    if (category !== 'Tutte') {
      next = next.filter((p) => p.categories?.some((c) => c.title === category));
    }
    if (search) {
      next = next.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(search.toLowerCase()))
      );
    }
    setFiltered(next);
  }, [category, search, items]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-blue-900 mb-8 text-center">{title}</h1>
      {/* Search */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Cerca per titolo o descrizione..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-full border border-blue-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600"
              title="Reset"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 justify-center min-w-fit pb-2">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition whitespace-nowrap ${
                cat.name === category
                  ? 'bg-blue-900 text-white border-blue-900 shadow'
                  : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-blue-50'
              }`}
            >
              <Tag className="w-4 h-4" />
              {cat.name}
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  cat.name === category ? 'bg-white text-blue-900' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Count */}
      <div className="mb-4 text-center text-gray-500 text-sm">
        {filtered.length > 0 ? `${filtered.length} risultati` : 'Nessun risultato trovato.'}
      </div>
      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => {
            const commonProps = {
              title: item.title,
              image: item.mainImage ? urlFor(item.mainImage).width(400).height(250).url() : '/placeholder.jpg',
              category: item.categories?.[0]?.title?.toString() ||
                (variant === 'tecniche' ? 'Tecnica' : variant === 'diario' ? 'Diario' : 'Ricetta'),
              description: item.excerpt || '',
              slug: item.slug.current,
              prepTime: item.prepTime,
              cookTime: item.cookTime,
              difficulty: item.difficulty,
              servings: item.servings,
              rating: item.rating,
              publishedAt: item.publishedAt,
              author: item.author?.name
            } as const;
            if (variant === 'diario') {
              return (
                <DiaryCard
                  {...commonProps}
                  author={item.author?.name}
                  publishedAt={item.publishedAt}
                  key={item._id}
                />
              );
            }
            if (variant === 'tecniche') {
              return <TechniqueCard key={item._id} {...commonProps} />;
            }
            return null;
          })}
        </div>
      ) : (
        <div className="text-center text-blue-400 py-16 text-lg font-semibold animate-fade-in-up">
          Nessun risultato trovato con questi filtri.
        </div>
      )}
    </div>
  );
}


