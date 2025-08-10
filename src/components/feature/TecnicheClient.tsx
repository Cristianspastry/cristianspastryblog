"use client";
import { useEffect, useState } from "react";
import { client } from '../../sanity/lib/client';
import { urlFor } from '../../sanity/lib/image';
import RecipeCard from './RecipeCard';
import { Tag, Search, X } from 'lucide-react';

interface Technique {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: { _ref: string; _type: string };
    [key: string]: unknown;
  };
  categories?: { title: string }[];
  excerpt?: string;
}

export default function TecnicheClient() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [filtered, setFiltered] = useState<Technique[]>([]);
  const [category, setCategory] = useState('Tecniche');
  const [categories, setCategories] = useState<{name: string, count: number}[]>([{name: 'Tecniche', count: 0}]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchTechniques() {
      const query = `*[_type == "post" && defined(slug.current)]|order(publishedAt desc){
        _id,
        title,
        slug,
        mainImage,
        categories[]->{title},
        excerpt
      }`;
      const data = await client.fetch(query);
      setTechniques(data);
      // Estrai categorie uniche con count
      const catMap = new Map<string, number>();
      data.forEach((t: Technique) => {
        t.categories?.forEach(c => {
          const tcat = typeof c.title === "string" ? c.title : String(c.title);
          catMap.set(tcat, (catMap.get(tcat) || 0) + 1);
        });
      });
      const cats = Array.from(catMap.entries()).map(([name, count]) => ({ name, count }));
      setCategories(cats);
    }
    fetchTechniques();
  }, []);

  useEffect(() => {
    let filtered = techniques;
    if (category) {
      filtered = filtered.filter(t => t.categories?.some(c => c.title === category));
    }
    if (search) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.excerpt && t.excerpt.toLowerCase().includes(search.toLowerCase()))
      );
    }
    setFiltered(filtered);
  }, [category, search, techniques]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-blue-900 mb-8 text-center">Tecniche</h1>
      {/* Search bar migliorata */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Cerca tecnica o descrizione..."
            value={search}
            onChange={e => setSearch(e.target.value)}
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
      {/* Filtri categorie migliorati */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 justify-center min-w-fit pb-2">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition whitespace-nowrap ${cat.name === category ? 'bg-blue-900 text-white border-blue-900 shadow' : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-blue-50'}`}
            >
              <Tag className="w-4 h-4" />
              {cat.name}
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${cat.name === category ? 'bg-white text-blue-900' : 'bg-blue-100 text-blue-700'}`}>{cat.count}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Numero risultati */}
      <div className="mb-4 text-center text-gray-500 text-sm">
        {filtered.length > 0
          ? `${filtered.length} tecnica${filtered.length === 1 ? '' : 'he'} trovata${filtered.length === 1 ? '' : 'e'}`
          : 'Nessuna tecnica trovata.'}
      </div>
      {/* Griglia tecniche */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((technique) => (
            <RecipeCard
              key={technique._id}
              title={technique.title}
              image={technique.mainImage ? urlFor(technique.mainImage).width(400).height(250).url() : '/placeholder.jpg'}
              category={technique.categories?.[0]?.title?.toString() || 'Tecnica'}
              description={technique.excerpt || ''}
              slug={technique.slug.current}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-blue-400 py-16 text-lg font-semibold animate-fade-in-up">
          Nessuna tecnica trovata con questi filtri.
        </div>
      )}
    </div>
  );
} 