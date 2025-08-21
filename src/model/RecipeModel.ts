import Author from "./AuthorModel";
import { Slug } from "./Slug";

export default interface Recipe {
    _id: string;
    title: string;
    slug?: string | { current: string };
    mainImage?: {
      asset: {
        _ref: string;
        _type: string;
      };
      alt?: string;
    };
    categories?: { title: string }[];
    excerpt?: string;
    publishedAt?: string;
    _updatedAt? : string;
    difficulty?: string;
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    cakePan?: string;
    ingredients?: { amount?: string; unit?: string; ingredient: string }[];
    instructions?: { instruction: string }[];
    tips?: string[];
    rating?: number;
    reviews?: number;
    author : Author;
    seo: {
      title: string;
      description: string;
      image?: {
        asset: {
          _ref: string;
          _type: string;
        };
        alt?: string;
      };
      keywords?: string[];
      noIndex: boolean;
      canonicalUrl?: string;
    };
  }


  // Utility function to extract slug value , 
  // funzione per dare lo slug 
export function getSlugValue(slug?: string | Slug): string | null {
  if (!slug) return null;
  return typeof slug === 'string' ? slug : slug.current;
}