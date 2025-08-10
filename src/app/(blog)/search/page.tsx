"use client";
import { useState, useEffect } from "react";
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Search, X, BookOpen, List, FileText } from 'lucide-react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any;
  categories?: any[];
  excerpt?: string;
  body?: any;
  _type: string;
  // projections we will use:
  categoryTitlesRef?: string[]; // categorie come titles da reference
  categoriesRaw?: any[]; // categorie raw (stringhe o oggetti)
}

const RECIPE_CATEGORIES = [
  'Signature Cristian',
  'Ricetta del mese', 
  'Occasioni speciali',
  'Ricette veloci',
  'Ricette della tradizione',
  'Torte moderne',
  'Dolci freddi',
  'Cioccolato',
  'Lievitati dolci',
  'Pasticcini & Mignon',
  'Dolci al cucchiaio',
  'Crostate & Pie',
  'Biscotti',
  'Masse montate'
];

const SECTIONS = [
  { label: 'Ricette', key: 'ricette', icon: BookOpen },
  { label: 'Tecniche', key: 'tecniche', icon: List },
  { label: 'Diario', key: 'diario', icon: FileText },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, Post[]>>({
    ricette: [],
    tecniche: [],
    diario: []
  });

  useEffect(() => {
    if (!query) {
      setResults({ ricette: [], tecniche: [], diario: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const trimmed = query.trim();
    const qParam = `*${trimmed}*`;

    const fetchResults = async () => {
      console.log('🔎 Avvio ricerca per:', trimmed);

      // GROQ: prova con ricerca nel body (pt::text) — se fallisce, riproviamo senza
      const groqWithBody = `*[
        _type == "post" &&
        defined(slug.current) &&
        (
          title match $q ||
          excerpt match $q ||
          pt::text(body) match $q
        )
      ]{
        _id,
        title,
        slug,
        mainImage,
        excerpt,
        _type,
        "categoryTitlesRef": categories[]->title,
        "categoriesRaw": categories[]
      }`;

      const groqNoBody = `*[
        _type == "post" &&
        defined(slug.current) &&
        (
          title match $q ||
          excerpt match $q
        )
      ]{
        _id,
        title,
        slug,
        mainImage,
        excerpt,
        _type,
        "categoryTitlesRef": categories[]->title,
        "categoriesRaw": categories[]
      }`;

      let allResults: Post[] = [];
      let triedWithBody = false;

      try {
        triedWithBody = true;
        allResults = await client.fetch(groqWithBody, { q: qParam });
        console.log(`✅ Query con body eseguita. Trovati ${allResults.length} risultati.`);
      } catch (err) {
        console.warn('⚠️ Query con pt::text(body) fallita, ritento senza body. Errore:', err);
        try {
          allResults = await client.fetch(groqNoBody, { q: qParam });
          console.log(`✅ Query senza body eseguita. Trovati ${allResults.length} risultati.`);
        } catch (err2) {
          console.error('❌ Anche la query senza body è fallita:', err2);
          setResults({ ricette: [], tecniche: [], diario: [] });
          setLoading(false);
          return;
        }
      }

      // Se non trovi nulla, facciamo un test rapido per vedere se il client ritorna documenti
      if (allResults.length === 0) {
        try {
          const testAll = await client.fetch('*[_type == "post" && defined(slug.current)]{_id, title, slug, categories}');
          console.log('🧪 Test fetch tutti i post (senza filtri). Trovati:', testAll.length);
          if (testAll.length === 0) {
            console.warn('🔴 ATTENZIONE: il client non restituisce post. Verifica projectId/dataset/CORS/slug in Sanity.');
          } else {
            console.log('ℹ️ Ci sono post, ma la ricerca non ha trovato corrispondenze con la query attuale.');
          }
        } catch (testErr) {
          console.error('❌ Errore nel test fetch all posts:', testErr);
        }
      }

      // Organizza i risultati nelle sezioni
      const bySection: Record<string, Post[]> = { ricette: [], tecniche: [], diario: [] };
      const recipeCatsLower = RECIPE_CATEGORIES.map(v => v.toLowerCase());

      allResults.forEach((post, i) => {
        // Normalizza le categorie: unisci references e raw
        const refs: string[] = Array.isArray(post.categoryTitlesRef) ? post.categoryTitlesRef.filter(Boolean) : [];
        const raw = Array.isArray(post.categoriesRaw) ? post.categoriesRaw : [];
        const rawTitles: string[] = raw.map((c: any) => {
          if (!c) return '';
          if (typeof c === 'string') return c;
          if (typeof c === 'object' && c.title) return c.title;
          if (typeof c === 'object' && c._ref) return ''; // reference non dereferenziato
          return '';
        }).filter(Boolean);

        const combined = [...refs, ...rawTitles].map(s => (s || '').toString());
        const combinedLower = combined.map(s => s.toLowerCase());

        console.log(`\n📄 Post ${i+1}: "${post.title}"`);
        console.log('   refs:', refs);
        console.log('   raw:', raw);
        console.log('   combined titles:', combined);

        // Matching categorie principali
        const isRecipeCat = combinedLower.some(ct => recipeCatsLower.includes(ct));
        const isTecnicaCat = combinedLower.some(ct => ct.includes('tecnic') || ct === 'tecniche' || ct === 'tecnica');
        const isDiarioCat = combinedLower.some(ct => ct === 'diario' || ct.includes('diario'));

        if (isRecipeCat) {
          bySection.ricette.push(post);
          return;
        }
        if (isTecnicaCat) {
          bySection.tecniche.push(post);
          return;
        }
        if (isDiarioCat) {
          bySection.diario.push(post);
          return;
        }

        // Heuristics fallback: cerca parole chiave nel titolo/excerpt
        const text = `${post.title ?? ''} ${post.excerpt ?? ''}`.toLowerCase();
        if (/(ricett|dolc|tort|biscott|cioccol|pasticc)/.test(text)) {
          bySection.ricette.push(post);
        } else if (/(tecnic|metod|procedura|tutorial|passo)/.test(text)) {
          bySection.tecniche.push(post);
        } else if (/(diario|oggi|raccont|storia|giorno)/.test(text)) {
          bySection.diario.push(post);
        } else {
          // default: metti nelle ricette per non perdere il post (opzionale)
          bySection.ricette.push(post);
        }
      });

      console.log('\n📊 Risultati organizzati: ', {
        ricette: bySection.ricette.length,
        tecniche: bySection.tecniche.length,
        diario: bySection.diario.length
      });

      setResults(bySection);
      setLoading(false);
    };

    const timeout = setTimeout(fetchResults, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  const totalResults = Object.values(results).flat().length;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 text-center mb-8">
        Cerca nel Blog
      </h1>
      <div className="mb-10 flex justify-center">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Cerca ricette, tecniche, diario..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-full border border-blue-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600"
              title="Cancella ricerca"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center text-blue-400 py-8">
          <div className="animate-pulse">Cercando...</div>
        </div>
      )}

      {!loading && query && totalResults > 0 && (
        <div className="mb-6 text-center text-blue-700">
          Trovati {totalResults} risultati per "{query}"
        </div>
      )}

      {!loading && query && (
        <div className="space-y-12">
          {SECTIONS.map(section => {
            const sectionResults = results[section.key] || [];
            const IconComponent = section.icon;
            return (
              <div key={section.key}>
                <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <IconComponent className="w-5 h-5" />
                  {section.label}
                  {sectionResults.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm ml-2">
                      {sectionResults.length}
                    </span>
                  )}
                </h2>

                {sectionResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sectionResults.map(post => (
                      <Link
                        key={post._id}
                        href={`/${section.key}/${post.slug.current}`}
                        className="block bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100"
                      >
                        {post.mainImage && (
                          <div className="relative h-40 w-full">
                            <img
                              src={urlFor(post.mainImage).width(400).height(250).url()}
                              alt={post.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-blue-900 mb-1 font-serif line-clamp-2">
                            {post.title}
                          </h3>
                          <span className="text-blue-600 text-xs mb-2 block font-medium">
                            {section.label}
                          </span>
                          {post.excerpt && (
                            <p className="text-gray-700 text-sm line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : query && (
                  <div className="text-gray-400 italic text-sm py-4">
                    Nessuna {section.label.toLowerCase().slice(0, -1)}a trovata.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && query && totalResults === 0 && (
        <div className="text-center text-gray-500 py-12">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">Nessun risultato trovato</p>
          <p className="text-sm">Prova con parole chiave diverse o controlla l'ortografia</p>
        </div>
      )}

      {!loading && !query && (
        <div className="text-center text-gray-400 py-12">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p className="text-lg">Inizia a digitare per cercare nel blog...</p>
          <p className="text-sm mt-2">Puoi cercare ricette, tecniche culinarie e voci del diario</p>
        </div>
      )}
    </main>
  );
}
