import { Metadata } from "next";

interface SEOMetadata {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | string;
  publishedTime?: string;
  author?: string;
  tags?: string[];
  // Nuovi campi aggiunti
  keywords?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    locale?: string;
    siteName?: string;
    type?: 'website' | 'article' | 'profile';
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    title?: string;
    description?: string;
    images?: string[];
    creator?: string;
    site?: string;
  };
}


// src/app/seo/seoUtils.ts
export function getPageMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  author,
  tags,
  keywords,
  openGraph,
  twitter,
}: SEOMetadata): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = url || siteUrl;
  const ogImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : null;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    
    // Basic metadata
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
    },
    
    // Open Graph
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      url: fullUrl,
      siteName: openGraph?.siteName || "Cristian's Pastry",
      locale: openGraph?.locale || 'it_IT',
      type: (openGraph?.type || type) as 'website' | 'article' | 'profile',
      images: openGraph?.images || (ogImage ? [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      }] : undefined),
      ...(publishedTime && type === 'article' && {
        publishedTime,
        authors: author ? [author] : undefined,
        tags,
      }),
    },
    
    // Twitter Card
    twitter: {
      card: twitter?.card || 'summary_large_image',
      title: twitter?.title || title,
      description: twitter?.description || description,
      images: twitter?.images || (ogImage ? [ogImage] : undefined),
      creator: twitter?.creator,
      site: twitter?.site,
    },
    
    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Language and regional
    other: {
      'DC.language': 'it',
      'DC.subject': keywords || '',
    },
  };

  return metadata;
}


// Helper per metadata di ricette
export function getRecipeMetadata({
  recipe,
  category,
  author,
}: {
  recipe: {
    title: string;
    excerpt?: string;
    slug: { current: string };
    mainImage?: {
      asset: {
        _ref: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    prepTime?: number;
    cookTime?: number;
    difficulty?: string;
    servings?: number;
  };
  category?: string;
  author?: string;
}): Metadata {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const timeText = totalTime > 0 ? `⏱️ ${totalTime}min` : '';
  const difficultyText = recipe.difficulty ? `📊 ${recipe.difficulty}` : '';
  const servingsText = recipe.servings ? `👥 ${recipe.servings} porzioni` : '';
  
  const metaInfo = [timeText, difficultyText, servingsText].filter(Boolean).join(' • ');
  
  return getPageMetadata({
    title: `${recipe.title} - Ricetta ${recipe.difficulty || 'Facile'} | Cristian's Pastry`,
    description: `🍰 ${recipe.excerpt} ${metaInfo}. Ricetta testata e spiegata passo dopo passo con foto e consigli del pasticcere.`,
    keywords: `${recipe.title}, ricetta ${category?.toLowerCase()}, pasticceria italiana, ${recipe.difficulty}, dolci fatti in casa`,
    type: 'article',
    url: `/ricette/${recipe.slug.current}`,
    image: recipe.mainImage ? `/api/sanity-image?id=${recipe.mainImage.asset._ref}` : '/chef-portrait.jpg',
    author,
    openGraph: {
      title: `🍰 ${recipe.title} - Ricetta ${category || 'Pasticceria'}`,
      description: `${recipe.excerpt} ${metaInfo}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `🍰 ${recipe.title}`,
      description: `${recipe.excerpt} ${metaInfo}`,
    },
  });
}

// Helper per pagine di categoria
export function getCategoryMetadata({
  category,
  description,
  recipesCount,
}: {
  category: string;
  description?: string;
  recipesCount?: number;
}): Metadata {
  const countText = recipesCount ? `${recipesCount} ricette` : 'Tante ricette';
  
  return getPageMetadata({
    title: `Ricette ${category} - ${countText} | Cristian's Pastry`,
    description: description || `Scopri le migliori ricette di ${category.toLowerCase()}. ${countText} testate e spiegate nel dettaglio con foto, tempi e difficoltà.`,
    keywords: `ricette ${category.toLowerCase()}, ${category} pasticceria, dolci ${category.toLowerCase()}, ricette italiane`,
    url: `/ricette?categoria=${encodeURIComponent(category.toLowerCase())}`,
    openGraph: {
      title: `🍰 Ricette ${category} - ${countText}`,
      description: `Le migliori ricette di ${category.toLowerCase()} spiegate passo dopo passo`,
    },
  });
}

