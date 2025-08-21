"use client";
// components/RecipeCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Star, Users } from 'lucide-react';
import { getImageUrl } from '@/lib/getImageUrl';
import Recipe, { getSlugValue } from '@/model/RecipeModel';

export type RecipeCardProps = {
  recipeProps: Recipe | null | undefined;
  priority?: boolean;
  variant?: 'default' | 'large';
  noLink?: boolean;
};

export default function RecipeCard({
  recipeProps,
  priority = false,
  variant = 'default',
  noLink = false,
}: RecipeCardProps) {
  // Early return if recipeProps is null/undefined
  if (!recipeProps) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">Ricetta non disponibile</p>
      </div>
    );
  }

  const isLarge = variant === 'large';
  const totalTime = (recipeProps?.prepTime || 0) + (recipeProps?.cookTime || 0);
  
  // Handle Sanity slug object format with utility function
  const slugValue = getSlugValue(recipeProps?.slug);
  
  const imageUrl = getImageUrl(recipeProps?.mainImage, 600, 400);
  
  // Schema.org structured data per SEO
  const structuredData = slugValue ? {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": recipeProps.title,
    "image": recipeProps.mainImage,
    "description": recipeProps.excerpt,
    "recipeCategory": recipeProps.categories,
    "prepTime": recipeProps.prepTime ? `PT${recipeProps.prepTime}M` : undefined,
    "cookTime": recipeProps.cookTime ? `PT${recipeProps.cookTime}M` : undefined,
    "totalTime": totalTime ? `PT${totalTime}M` : undefined,
    "recipeYield": recipeProps.servings,
    "aggregateRating": recipeProps.rating ? {
      "@type": "AggregateRating",
      "ratingValue": recipeProps.rating,
      "ratingCount": 1
    } : undefined,
    "author": recipeProps.author ? {
      "@type": "Person",
      "name": recipeProps.author
    } : undefined,
    "datePublished": recipeProps.publishedAt
  } : null;

  const CardContent = () => (
    <article
      className={`bg-white ${isLarge ? 'rounded-3xl' : 'rounded-lg'} overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100 group`}
      itemScope
      itemType="https://schema.org/Recipe"
    >
      {/* Schema.org JSON-LD */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Immagine */}
      <div className={`relative ${isLarge ? 'h-72' : 'h-48'} w-full overflow-hidden`}>
        {imageUrl ? (
          <Image
            src={imageUrl || '/placeholder.png'}
            alt={`${recipeProps?.title || 'Ricetta'} - Ricetta ${recipeProps?.categories || ''}`}
            fill
            className={`object-cover ${isLarge ? '' : 'rounded-t-lg'} group-hover:scale-105 transition-transform duration-500`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
            priority={priority}
            itemProp="image"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
            Nessuna immagine
          </div>
        )}

        {/* Overlay gradient al hover */}
        {isLarge && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        {/* Rating badge */}
        {recipeProps?.rating && (
          <div className={`absolute ${isLarge ? 'top-6 right-6' : 'top-4 right-4'}`} itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
            <div className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-current text-yellow-400" aria-hidden="true" />
              <span itemProp="ratingValue">{recipeProps.rating.toFixed(1)}</span>
              <meta itemProp="ratingCount" content="1" />
            </div>
          </div>
        )}

        {/* Category badge */}
        <div className={`absolute ${isLarge ? 'top-6 left-6' : 'top-4 left-4'}`}>
          <span
            className="bg-[#0D2858]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium"
            itemProp="recipeCategory"
          >
            {Array.isArray(recipeProps?.categories)
              ? recipeProps.categories.map((cat, idx) => (
                  <span key={cat?.title || idx} className="mr-1">{cat?.title}</span>
                ))
              : recipeProps?.categories || 'Ricetta'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`${isLarge ? 'p-8' : 'p-4'} flex-1 flex flex-col`}>
        <h3
          className={`${isLarge ? 'text-2xl' : 'text-lg'} font-bold text-gray-900 group-hover:text-[#0D2858] transition-colors mb-3 font-serif leading-tight ${isLarge ? 'line-clamp-2' : 'line-clamp-2'}`}
          itemProp="name"
        >
          {recipeProps?.title || 'Ricetta senza titolo'}
        </h3>

        {/* Hidden meta data for SEO */}
        {recipeProps.author && <meta itemProp="author" content={recipeProps.author.name} />}
        {recipeProps.publishedAt && <meta itemProp="datePublished" content={recipeProps.publishedAt} />}
        {recipeProps?.prepTime && <meta itemProp="prepTime" content={`PT${recipeProps.prepTime}M`} />}
        {recipeProps?.cookTime && <meta itemProp="cookTime" content={`PT${recipeProps.cookTime}M`} />}
        {totalTime > 0 && <meta itemProp="totalTime" content={`PT${totalTime}M`} />}
        {recipeProps?.servings && <meta itemProp="recipeYield" content={recipeProps.servings.toString()} />}

        {/* Info badges */}
        {(totalTime > 0 || recipeProps?.difficulty || recipeProps?.servings) && (
          <div className={`flex items-center gap-2 flex-wrap ${isLarge ? 'mb-4' : 'mb-3'}`}>
            {totalTime > 0 && (
              <span className={`flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full ${isLarge ? 'text-sm' : 'text-xs'}`}>
                <Clock className={`${isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-[#0D2858]`} aria-hidden="true" />
                <span className="font-medium text-gray-700">
                  <time>{totalTime}min</time>
                </span>
              </span>
            )}

            {recipeProps?.difficulty && (
              <span className={`bg-blue-50 text-[#0D2858] px-2.5 py-1 rounded-full ${isLarge ? 'text-sm' : 'text-xs'} font-medium`}>
                {recipeProps.difficulty}
              </span>
            )}

            {recipeProps?.servings && (
              <span className={`flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full ${isLarge ? 'text-sm' : 'text-xs'}`}>
                <Users className={`${isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-[#0D2858]`} aria-hidden="true" />
                <span className="font-medium text-gray-700">{recipeProps.servings}</span>
              </span>
            )}
          </div>
        )}

        {/* Descrizione */}
        {recipeProps?.excerpt && (
          <p
            className={`text-gray-600 leading-relaxed flex-1 ${isLarge ? 'line-clamp-3 mb-6' : 'text-sm line-clamp-2 mb-3'}`}
            itemProp="description"
          >
            {recipeProps.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className={`flex items-center justify-between ${isLarge ? 'pt-4 border-t border-gray-100' : 'pt-2'} mt-auto`}>
          <span className={`text-[#0D2858] font-semibold group-hover:text-blue-600 transition-colors ${isLarge ? 'text-base' : 'text-sm'}`}>
            {isLarge ? 'Leggi la ricetta' : 'Vai alla ricetta'}
          </span>
          <div className={`${isLarge ? 'w-8 h-8' : 'w-6 h-6'} bg-[#0D2858] rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors`}>
            <svg className={`${isLarge ? 'w-4 h-4' : 'w-3 h-3'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );

  // If noLink is true or no slug, return just the card content
  if (noLink || !slugValue) {
    return <CardContent />;
  }

  // Otherwise, wrap in Link
  return (
    <Link
      href={`/ricette/${slugValue}`}
      className={`block transform hover:scale-[1.02] transition-all duration-300 ${isLarge ? '' : 'h-full'}`}
      title={`Leggi la ricetta: ${recipeProps?.title || 'Ricetta'}`}
      aria-label={`Vai alla ricetta ${recipeProps?.title || 'Ricetta'} nella categoria ${recipeProps?.categories || 'generale'}`}
    >
      <CardContent />
    </Link>
  );
}