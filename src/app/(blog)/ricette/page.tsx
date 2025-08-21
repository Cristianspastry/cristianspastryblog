// app/ricette/page.tsx - Fixed version with proper error handling
import { getPageMetadata } from '@/seo/seoUtils';
import Script from 'next/script';
import Link from 'next/link';
import {getRecipesWhitFilters } from '@/sanity/lib/data';
import { urlFor } from '@/sanity/lib/image';
import Recipe, { getSlugValue } from '@/model/RecipeModel';
import RecipeFilterBar from '@/components/feature/RecipeFilterBar';
import Breadcrumbs from '@/components/feature/Breadcrumbs';
import { buildRecipeBreadcrumbs } from '@/lib/buildRecipeBreadcrumbs';
import { buildRecipePaginationHref } from '@/lib/buildRecipePaginationHref';
import Pagination from '@/components/feature/Pagination';
import RecipeCard from '@/components/feature/card/RecipeCard';

interface PageProps {
  searchParams: {
    categoria?: string;
    difficolta?: string;
    q?: string;
    page?: string;
  };
}

const RECIPES_PER_PAGE = 12;

export async function generateMetadata({ searchParams }: PageProps) {
  try {
    const { totalCount} = await getRecipesWhitFilters(searchParams);

    let title = 'Ricette di Pasticceria';
    let description = 'Scopri le migliori ricette di pasticceria moderna italiana';
    let keywords = 'ricette pasticceria, dolci italiani, pasticceria moderna, tutorial dolci';

    if (searchParams.categoria) {
      const categoryName = searchParams.categoria.charAt(0).toUpperCase() + searchParams.categoria.slice(1);
      title = `${totalCount} Ricette ${categoryName} | Cristian's Pastry`;
      description = `${totalCount} ricette di ${categoryName.toLowerCase()} testate dal pasticcere.`;
      keywords = `ricette ${categoryName.toLowerCase()}, ${categoryName} pasticceria`;
    } else if (searchParams.difficolta) {
      const difficultyText = searchParams.difficolta === 'facile' ? 'Facili' :
        searchParams.difficolta === 'medio' ? 'Medie' : 'Difficili';
      title = `${totalCount} Ricette ${difficultyText} | Cristian's Pastry`;
      description = `${totalCount} ricette di difficoltà ${searchParams.difficolta}`;
    } else if (searchParams.q) {
      title = `"${searchParams.q}" - ${totalCount} Ricette | Cristian's Pastry`;
      description = `${totalCount} ricette trovate per "${searchParams.q}"`;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    let canonicalUrl = `${baseUrl}/ricette`;
    const params = new URLSearchParams();
    if (searchParams.categoria) params.set('categoria', searchParams.categoria);
    if (searchParams.difficolta) params.set('difficolta', searchParams.difficolta);
    if (searchParams.q) params.set('q', searchParams.q);
    if (searchParams.page && searchParams.page !== '1') params.set('page', searchParams.page);
    if (params.toString()) canonicalUrl += `?${params.toString()}`;

    return getPageMetadata({
      title,
      description,
      keywords,
      url: canonicalUrl,
      type: 'website',
      openGraph: {
        title: `🍰 ${title}`,
        description: `${description} ⭐ Ricette testate con foto step-by-step`,
        type: 'website',
        siteName: 'Cristian\'s Pastry',
        locale: 'it_IT',
      },
      twitter: {
        card: 'summary_large_image',
        title: `🍰 ${title.split('|')[0].trim()}`,
        description: description.length > 150 ? description.substring(0, 147) + '...' : description,
      }
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return getPageMetadata({
      title: 'Ricette di Pasticceria | Cristian\'s Pastry',
      description: 'Scopri le migliori ricette di pasticceria moderna italiana',
      keywords: 'ricette pasticceria, dolci italiani'
    });
  }
}

function generateCollectionSchema(
  recipes: Recipe[],
  searchParams: PageProps['searchParams'],
  totalCount: number,
  categories: string[]
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  let name = 'Ricette di Pasticceria - Cristian\'s Pastry';
  let description = 'Collezione completa di ricette di pasticceria moderna italiana';
  let url = `${baseUrl}/ricette`;

  if (searchParams.categoria) {
    name = `Ricette ${searchParams.categoria} - Cristian's Pastry`;
    description = `Collezione di ${totalCount} ricette di ${searchParams.categoria}`;
    url += `?categoria=${searchParams.categoria}`;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    inLanguage: 'it-IT',
    numberOfItems: totalCount,
    hasPart: recipes
      .filter(recipe => recipe && getSlugValue(recipe.slug))
      .slice(0, 10)
      .map(recipe => {
        const slugValue = getSlugValue(recipe.slug);
        return {
          '@type': 'Recipe',
          name: recipe.title || 'Ricetta',
          url: `${baseUrl}/ricette/${slugValue}`,
        image: recipe.mainImage ? urlFor(recipe.mainImage).width(400).height(300).url() : undefined,
        description: recipe.excerpt,
        recipeCategory: recipe.categories?.[0]?.title,
        prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
        cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
        totalTime: recipe.prepTime && recipe.cookTime ? `PT${recipe.prepTime + recipe.cookTime}M` : undefined,
        recipeYield: recipe.servings?.toString(),
        author: {
          '@type': 'Person',
          name: recipe.author?.name || 'Cristian'
        },
          aggregateRating: recipe.rating ? {
            '@type': 'AggregateRating',
            ratingValue: recipe.rating,
            ratingCount: 1,
            bestRating: 5,
            worstRating: 1
          } : undefined
        };
      }),
    author: {
      '@type': 'Person',
      name: 'Cristian',
      url: `${baseUrl}/chi-sono`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cristian\'s Pastry',
      url: baseUrl
    },
    about: categories.map(category => ({
      '@type': 'Thing',
      name: category,
      url: `${baseUrl}/ricette?categoria=${encodeURIComponent(category.toLowerCase())}`
    }))
  };
}

export default async function Ricette({ searchParams }: PageProps) {
  try {
    const currentPage = parseInt(searchParams.page || '1', 10);

    const {
      recipes,
      totalCount,
      categories,
    } = await getRecipesWhitFilters(searchParams, {
      page: currentPage,
      limit: RECIPES_PER_PAGE
    });

    // Debug log
    console.log('Recipes data:', {
      recipesLength: recipes?.length,
      totalCount,
      hasNullRecipes: recipes?.some(r => !r),
      firstRecipe: recipes?.[0]
    });

    // Filter out null/undefined recipes
    const validRecipes = recipes?.filter((recipe): recipe is Recipe => 
      recipe !== null && recipe !== undefined && typeof recipe === 'object'
    ) || [];

    if (validRecipes.length !== recipes?.length) {
      console.warn(`Filtered out ${(recipes?.length || 0) - validRecipes.length} invalid recipes`);
    }

    const totalPages = Math.ceil(totalCount / RECIPES_PER_PAGE);

    const categoryFilters = [
      { name: 'Tutte', count: totalCount },
      ...categories.map(cat => ({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: 0
      }))
    ];

    const collectionSchema = generateCollectionSchema(validRecipes, searchParams, totalCount, categories);

   
    const items = buildRecipeBreadcrumbs(searchParams);

    return (
      <>
        <Script
          id="ricette-collection-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(collectionSchema)}
        </Script>

        <Breadcrumbs items={items} />

        

        <RecipeFilterBar
          categories={categoryFilters}
          searchParams={searchParams}
          
        />

        <main className="max-w-6xl mx-auto px-4 py-12">
          {validRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {validRecipes.map((recipe, index) => {
                // Additional safety check
                if (!recipe || !recipe._id) {
                  console.warn(`Invalid recipe at index ${index}:`, recipe);
                  return null;
                }

                return (
                  <RecipeCard
                    key={recipe._id || `recipe-${index}`}
                    recipeProps={recipe}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center text-blue-400 py-16 text-lg font-semibold">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Nessun risultato trovato
              </h2>
              <p className="text-gray-600 mb-6">
                Prova a modificare i filtri o la ricerca
              </p>
              <Link
                href="/ricette"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Visualizza tutte le ricette
              </Link>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={(page) => buildRecipePaginationHref(page, searchParams)}
          />
        </main>
      </>
    );
  } catch (error) {
    console.error('Error in Ricette page:', error);
    
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Errore nel caricamento delle ricette
          </h1>
          <p className="text-gray-600 mb-6">
            Si è verificato un errore durante il caricamento. Riprova più tardi.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Torna alla homepage
          </Link>
        </div>
      </main>
    );
  }
}