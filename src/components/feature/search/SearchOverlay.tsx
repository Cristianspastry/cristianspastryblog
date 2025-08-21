"use client";
import { useState, useEffect } from "react";
import { urlFor } from '@/sanity/lib/image';
import { Search, X, BookOpen, List, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getSearchRecipeNavBar } from "@/sanity/lib/data";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

interface Recipe {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
    [key: string]: unknown;
  };
  categories?: string[];
  excerpt?: string;
  body?: unknown;
  _type: string;
}

// Categorie specifiche delle ricette
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

// Funzione per determinare la sezione di una ricetta
function categorizeRecipe(recipe: Recipe): string {
  if (!recipe.categories || recipe.categories.length === 0) {
    return 'diario'; // Default per ricette senza categorie
  }

  // Estrae i titoli delle categorie
  const categoryTitles = recipe.categories.map(cat => 
    typeof cat === 'string'
      ? cat
      : (cat && typeof cat === 'object' && 'title' in cat
          ? (cat as { title: string }).title
          : undefined)
  ).filter((title): title is string => Boolean(title));

  // Controlla se ha categorie di ricette
  const hasRecipeCategory = categoryTitles.some(cat => 
    RECIPE_CATEGORIES.includes(cat)
  );
  
  if (hasRecipeCategory) {
    return 'ricette';
  }
  
  // Controlla se ha categorie di tecniche
  const hasTechniqueCategory = categoryTitles.some(cat => 
    cat.toLowerCase().includes('tecnica') || 
    cat.toLowerCase().includes('tecniche') ||
    cat.toLowerCase().includes('tutorial') ||
    cat.toLowerCase().includes('guida')
  );
  
  if (hasTechniqueCategory) {
    return 'tecniche';
  }
  
  // Default: diario
  return 'diario';
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, Recipe[]>>({});

  // Reset quando l'overlay si chiude
  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults({});
    }
  }, [open]);

  useEffect(() => {
    if (!query) {
      setResults({});
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    const fetchResults = async () => {
      try {
        // Query GROQ corretta
        const allResults = await getSearchRecipeNavBar(query);
        
        console.log('🔍 Risultati totali trovati:', allResults.length);
        
        // Organizza i risultati per sezione
        const bySection: Record<string, Recipe[]> = {
          ricette: [],
          tecniche: [],
          diario: []
        };
        
        allResults.forEach((recipe: Recipe, index: number) => {
          // Since recipe.categories is already an array of strings (titles), just use it directly
          const categoryTitles = recipe.categories || [];
        
          console.log(`\n📄 Ricetta ${index + 1}: "${recipe.title}"`);
          console.log('📁 Categorie grezze:', recipe.categories);
          console.log('📁 Titoli:', categoryTitles);
          
          // Determina la sezione e assegna la ricetta
          const section = categorizeRecipe(recipe);
          bySection[section].push(recipe);
          
          console.log('🏷️ Assegnato a sezione:', section);
        });
        
        console.log('\n📊 Risultati finali:');
        console.log('🍰 Ricette:', bySection.ricette.length);
        console.log('🔧 Tecniche:', bySection.tecniche.length);
        console.log('📖 Diario:', bySection.diario.length);
        
        setResults(bySection);
      } catch (error) {
        console.error('❌ Errore nella ricerca:', error);
        setResults({});
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchResults, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  const totalResults = Object.values(results).flat().length;

  // Gestisci ESC per chiudere
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Blocca scroll del body
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center py-8">
      {/* Overlay background - cliccare per chiudere */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-label="Close search"
      />
      
      {/* Search modal - dimensioni ridotte */}
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl max-h-[80vh] overflow-hidden">
        {/* Header con close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h1 className="text-xl font-serif font-bold text-blue-900">
            Cerca nel Blog
          </h1>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search input */}
        <div className="p-6 border-b border-gray-50">
          <div className="relative">
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

        {/* Content area with scroll */}
        <div className="overflow-y-auto max-h-[50vh]">
          {/* Loading state */}
          {loading && (
            <div className="text-center text-blue-400 py-8">
              <div className="animate-pulse">Cercando...</div>
            </div>
          )}

          {/* Results count */}
          {!loading && query && totalResults > 0 && (
            <div className="px-6 py-3 text-center text-blue-700 text-sm border-b border-gray-50">
              Trovati {totalResults} risultati per &quot;{query}&quot;
            </div>
          )}

          {/* Results sections */}
          {!loading && query && (
            <div className="p-6 space-y-8">
              {SECTIONS.map(section => {
                const sectionResults = results[section.key] || [];
                const IconComponent = section.icon;
                
                return (
                  <div key={section.key}>
                    <h2 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      {section.label}
                      {sectionResults.length > 0 && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs ml-2">
                          {sectionResults.length}
                        </span>
                      )}
                    </h2>
                    
                    {sectionResults.length > 0 ? (
                      <div className="space-y-2">
                        {sectionResults.map(post => (
                          <Link
                            key={post._id}
                            href={`/${section.key}/${post.slug.current}`}
                            className="flex bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors duration-200 overflow-hidden group"
                            onClick={onClose} // Chiudi overlay quando clicchi su un risultato
                          >
                            {post.mainImage && (
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={urlFor(post.mainImage).width(150).height(150).url()}
                                  alt={post.title}
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full rounded-l-lg"
                                />
                              </div>
                            )}
                            <div className="p-3 flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-blue-900 mb-1 line-clamp-1 group-hover:text-blue-700">
                                {post.title}
                              </h3>
                              <span className="text-blue-600 text-xs mb-1 block font-medium">
                                {section.label}
                              </span>
                              {post.excerpt && (
                                <p className="text-gray-600 text-xs line-clamp-2">
                                  {post.excerpt}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : query && (
                      <div className="text-gray-400 italic text-sm py-2">
                        Nessuna {section.label.toLowerCase().slice(0, -1)}a trovata.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* No results */}
          {!loading && query && totalResults === 0 && (
            <div className="text-center text-gray-500 py-8 px-6">
              <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-base mb-1">Nessun risultato trovato</p>
              <p className="text-sm">Prova con parole chiave diverse</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !query && (
            <div className="text-center text-gray-400 py-8 px-6">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              <p className="text-base">Inizia a digitare per cercare...</p>
              <p className="text-sm mt-1">Ricette, tecniche e diario</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}