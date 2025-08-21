import Recipe from "@/model/RecipeModel";
import { Metadata } from "next";
import { urlFor } from "./image";


// Genera metadata Next.js usando i tuoi dati esistenti + SEO
export function generateRecipeMetadata(recipe: Recipe): Metadata {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const metadata: Metadata = {
      title: recipe.seo.title, // Usa il titolo SEO (con fallback al titolo normale)
      description: recipe.seo.description, // Usa descrizione SEO (con fallback all'excerpt)
    };
  
    // Open Graph ottimizzato
    if (recipe.seo.image) {
      const imageUrl = urlFor(recipe.seo.image).width(1200).height(630).url();
      
      metadata.openGraph = {
        title: recipe.seo.title,
        description: recipe.seo.description,
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: recipe.seo.image.alt || recipe.seo.title
        }],
        type: 'article',
        publishedTime: recipe.publishedAt,
        authors: recipe.author ? [recipe.author.name] : undefined,
        tags: recipe.categories?.map(c => c.title)
      };
  
      // Twitter Card
      metadata.twitter = {
        card: 'summary_large_image',
        title: recipe.seo.title,
        description: recipe.seo.description,
        images: [imageUrl]
      };
    }
  
    // Keywords
    if (recipe.seo.keywords?.length) {
      metadata.keywords = recipe.seo.keywords.join(", ");
    }
  
    // No Index
    if (recipe.seo.noIndex) {
      metadata.robots = "noindex, nofollow";
    }
  
    // Canonical URL
    metadata.alternates = {
      canonical: `${baseUrl}/ricette/${recipe.slug}`
    };
  
    return metadata;
  }

  
  // Genera JSON-LD ottimizzato usando i tuoi dati esistenti
  export function generateRecipeJsonLd(recipe: Recipe): Record<string, unknown> {
   // const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Recipe",
      "name": recipe.seo.title, // Usa il titolo SEO
      "description": recipe.seo.description, // Usa la descrizione SEO
    };
  
    // Immagini (multiple per rich snippets)
    if (recipe.seo.image) {
      jsonLd.image = [
        urlFor(recipe.seo.image).width(1200).height(630).url(),
        urlFor(recipe.seo.image).width(800).height(600).url(),
        urlFor(recipe.seo.image).width(480).height(360).url()
      ];
    }
  
    // Autore
    if (recipe.author?.name) {
      jsonLd.author = {
        "@type": "Person",
        "name": recipe.author.name
      };
    }
  
    // Date
    if (recipe.publishedAt) {
      jsonLd.datePublished = recipe.publishedAt;
    }
    if (recipe._updatedAt) {
      jsonLd.dateModified = recipe._updatedAt;
    }
  
    // Tempi di preparazione/cottura
    if (recipe.prepTime) {
      jsonLd.prepTime = `PT${recipe.prepTime}M`;
    }
    if (recipe.cookTime) {
      jsonLd.cookTime = `PT${recipe.cookTime}M`;
    }
    if (recipe.prepTime && recipe.cookTime) {
      jsonLd.totalTime = `PT${recipe.prepTime + recipe.cookTime}M`;
    }
  
    // Porzioni
    if (recipe.servings) {
      jsonLd.recipeYield = recipe.servings;
    }
  
    // Categorie
    if (recipe.categories?.length) {
      jsonLd.recipeCategory = recipe.categories.map(c => c.title);
    }
  
    // Ingredienti (stesso formato che usi già)
    if (recipe.ingredients?.length) {
      jsonLd.recipeIngredient = recipe.ingredients.map(i => 
        `${i.amount ? i.amount + ' ' : ''}${i.unit ? i.unit + ' ' : ''}${i.ingredient}`
      );
    }
  
    // Istruzioni (migliorate con HowToStep)
    if (recipe.instructions?.length) {
      jsonLd.recipeInstructions = recipe.instructions.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "text": step.instruction
      }));
    }
  
    // Rating
    if (recipe.rating) {
      jsonLd.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": recipe.rating,
        "ratingCount": 1,
        "bestRating": 5,
        "worstRating": 1
      };
    }
  
    // Keywords SEO
    if (recipe.seo.keywords?.length) {
      jsonLd.keywords = recipe.seo.keywords.join(", ");
    }
  
    return jsonLd;
  }
  