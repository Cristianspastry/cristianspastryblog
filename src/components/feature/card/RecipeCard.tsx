// components/RecipeCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Star, Users } from 'lucide-react';

export type RecipeCardProps = {
  title: string;
  image: string;
  category: string;
  description?: string;
  slug?: string;
  // Nuove props opzionali per più funzionalità
  prepTime?: number;
  cookTime?: number;
  difficulty?: string;
  servings?: number;
  rating?: number;
  priority?: boolean;
  variant?: 'default' | 'large'; // Variante per dimensioni diverse
  noLink?: boolean; // New prop to disable internal linking
  // SEO props
  publishedAt?: string;
  author?: string;
};

export default function RecipeCard({ 
  title, 
  image, 
  category, 
  description, 
  slug,
  prepTime,
  cookTime,
  difficulty,
  servings,
  rating,
  priority = false,
  variant = 'default',
  noLink = false, // Default to false to maintain existing behavior
  publishedAt,
  author,
}: RecipeCardProps) {
  const isLarge = variant === 'large';
  const totalTime = (prepTime || 0) + (cookTime || 0);
  const href = slug ? `/ricette/${slug}` : '#';

 // Schema.org structured data per SEO
 const structuredData = slug ? {
  "@context": "https://schema.org/",
  "@type": "Recipe",
  "name": title,
  "image": image,
  "description": description,
  "recipeCategory": category,
  "prepTime": prepTime ? `PT${prepTime}M` : undefined,
  "cookTime": cookTime ? `PT${cookTime}M` : undefined,
  "totalTime": totalTime ? `PT${totalTime}M` : undefined,
  "recipeYield": servings,
  "aggregateRating": rating ? {
    "@type": "AggregateRating",
    "ratingValue": rating,
    "ratingCount": 1
  } : undefined,
  "author": author ? {
    "@type": "Person",
    "name": author
  } : undefined,
  "datePublished": publishedAt
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
        <Image 
          src={image}
          alt={`${title} - Ricetta ${category}`} // Alt text più descrittivo
          fill
          className={`object-cover ${isLarge ? '' : 'rounded-t-lg'} group-hover:scale-105 transition-transform duration-500`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
          priority={priority}
          itemProp="image"
        />
        
        {/* Overlay gradient al hover */}
        {isLarge && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        
        {/* Rating badge - ora anche per default */}
        {rating && (
          <div className={`absolute ${isLarge ? 'top-6 right-6' : 'top-3 right-3'}`} itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
            <div className={`bg-white/95 backdrop-blur-sm text-gray-800 ${isLarge ? 'px-4 py-2' : 'px-3 py-1.5'} rounded-full ${isLarge ? 'text-sm' : 'text-xs'} font-semibold flex items-center gap-2 shadow-lg`}>
              <Star className={`${isLarge ? 'w-4 h-4' : 'w-3 h-3'} fill-current text-yellow-400`} aria-hidden="true" />
              <span itemProp="ratingValue">{rating.toFixed(1)}</span>
              <meta itemProp="ratingCount" content="1" />
            </div>
          </div>
        )}

        {/* Category badge */}
        <div className={`absolute ${isLarge ? 'top-6 left-6' : 'top-3 left-3'}`}>
          <span 
            className={`bg-[#0D2858]/90 backdrop-blur-sm text-white ${isLarge ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'} rounded-full font-medium`}
            itemProp="recipeCategory"
          >
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`${isLarge ? 'p-8' : 'p-4'} flex-1 flex flex-col`}>
        <h3 
          className={`${isLarge ? 'text-2xl' : 'text-lg'} font-bold text-gray-900 group-hover:text-[#0D2858] transition-colors mb-3 font-serif leading-tight ${isLarge ? 'line-clamp-2' : ''}`}
          itemProp="name"
        >
          {title}
        </h3>
        
        {/* Hidden meta data for SEO */}
        {author && <meta itemProp="author" content={author} />}
        {publishedAt && <meta itemProp="datePublished" content={publishedAt} />}
        {prepTime && <meta itemProp="prepTime" content={`PT${prepTime}M`} />}
        {cookTime && <meta itemProp="cookTime" content={`PT${cookTime}M`} />}
        {totalTime > 0 && <meta itemProp="totalTime" content={`PT${totalTime}M`} />}
        {servings && <meta itemProp="recipeYield" content={servings.toString()} />}
        
        {/* Info badges - ora per entrambe le varianti */}
        {(totalTime > 0 || difficulty || servings) && (
          <div className={`flex items-center gap-2 flex-wrap ${isLarge ? 'mb-4' : 'mb-3'}`}>
            {totalTime > 0 && (
              <span className={`flex items-center gap-1.5 bg-gray-50 ${isLarge ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs'} rounded-full`}>
                <Clock className={`${isLarge ? 'w-4 h-4' : 'w-3 h-3'} text-[#0D2858]`} aria-hidden="true" />
                <span className="font-medium text-gray-700">
                  <time>{totalTime}min</time>
                </span>
              </span>
            )}
            
            {difficulty && (
              <span className={`bg-blue-50 text-[#0D2858] ${isLarge ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs'} rounded-full font-medium`}>
                {difficulty}
              </span>
            )}
            
            {servings && (
              <span className={`flex items-center gap-1.5 bg-gray-50 ${isLarge ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs'} rounded-full`}>
                <Users className={`${isLarge ? 'w-4 h-4' : 'w-3 h-3'} text-[#0D2858]`} aria-hidden="true" />
                <span className="font-medium text-gray-700">{servings}</span>
              </span>
            )}
          </div>
        )}

        {/* Descrizione */}
        {description && (
          <p 
            className={`text-gray-600 leading-relaxed flex-1 ${isLarge ? 'line-clamp-3 mb-6' : 'text-sm mb-3 line-clamp-2'}`}
            itemProp="description"
          >
            {description}
          </p>
        )}

        {/* Footer - semplificato per default, completo per large */}
        {isLarge ? (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <span className="text-[#0D2858] font-semibold group-hover:text-blue-600 transition-colors">
              Leggi la ricetta
            </span>
            <div className="w-8 h-8 bg-[#0D2858] rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-2">
            <span className="text-[#0D2858] font-medium text-sm group-hover:text-blue-600 transition-colors">
              Leggi la ricetta →
            </span>
          </div>
        )}
      </div>
    </article>
  );

  // If noLink is true or no slug, return just the card content
  if (noLink || !slug) {
    return <CardContent />;
  }

  // Otherwise, wrap in Link
  return (
    <Link 
      href={href}
      className={`block transform hover:scale-[1.02] transition-all duration-300 ${isLarge ? '' : 'h-full'}`}
      title={`Leggi la ricetta: ${title}`} // Tooltip SEO-friendly
      aria-label={`Vai alla ricetta ${title} nella categoria ${category}`}
    >
      <CardContent />
    </Link>
  );
}