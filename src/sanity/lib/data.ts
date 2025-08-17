import { client } from './client';
import {
  homePageQuery,
  recipeQuery,
  otherRecipesQuery,
  allRecipesQuery,
  recipesByCategoryQuery,
  searchRecipesQuery,
  categoriesQuery,
  diaryPostsQuery,
  techniquesPostsQuery,
  countPostsQuery,
  recentPostsQuery,
  sitemapQuery
} from './queries';

// Tipi per i dati
export interface Recipe {
  _id: string;
  title: string;
  slug: { current: string };
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
  difficulty?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  cakePan?: string;
  ingredients?: { amount?: string; unit?: string; ingredient: string }[];
  instructions?: { instruction: string }[];
  tips?: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  rating?: number;
  reviews?: number;
  author?: { name: string };
}

export interface Author {
  name: string;
  bio?: unknown;
  image?: unknown;
}

export interface Category {
  _id: string;
  title: string;
  description?: string;
}

export interface HomePageData {
  recentRecipes: Recipe[];
  author: Author | null;
  recentDiary: Recipe[];
  recentTechniques: Recipe[];
}

// Funzioni per fetchare i dati
export async function getHomePageData(): Promise<HomePageData> {
  try {
    // Debug: conta totale post
    const allPosts = await client.fetch(countPostsQuery);
    console.log('Total posts in database:', allPosts);
    
    const data = await client.fetch(homePageQuery, {}, { 
      next: { revalidate: 3600 } 
    });
    
   // console.log('Fetched home page data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      recentRecipes: [],
      author: null,
      recentDiary: [],
      recentTechniques: []
    };
  }
}

export async function getRecipe(slug: string): Promise<Recipe | null> {
  try {
    return await client.fetch(recipeQuery, { slug });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

export async function getOtherRecipes(slug: string): Promise<Recipe[]> {
  try {
    return await client.fetch(otherRecipesQuery, { slug });
  } catch (error) {
    console.error('Error fetching other recipes:', error);
    return [];
  }
}

export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    return await client.fetch(allRecipesQuery);
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    return [];
  }
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  try {
    return await client.fetch(recipesByCategoryQuery, { category });
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    return [];
  }
}

export async function searchRecipes(searchTerm: string): Promise<Recipe[]> {
  try {
    return await client.fetch(searchRecipesQuery, { searchTerm });
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    return await client.fetch(categoriesQuery);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getDiaryPosts(): Promise<Recipe[]> {
  try {
    return await client.fetch(diaryPostsQuery);
  } catch (error) {
    console.error('Error fetching diary posts:', error);
    return [];
  }
}

export async function getTechniquesPosts(): Promise<Recipe[]> {
  try {
    return await client.fetch(techniquesPostsQuery);
  } catch (error) {
    console.error('Error fetching techniques posts:', error);
    return [];
  }
}

export async function getRecentPosts(limit: number = 10): Promise<Recipe[]> {
  try {
    return await client.fetch(recentPostsQuery, { limit });
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
}

export async function getSitemapData(): Promise<{ slug: { current: string }; publishedAt: string; _updatedAt: string }[]> {
  try {
    return await client.fetch(sitemapQuery);
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
    return [];
  }
}

export async function getTotalPostsCount(): Promise<number> {
  try {
    return await client.fetch(countPostsQuery);
  } catch (error) {
    console.error('Error fetching posts count:', error);
    return 0;
  }
} 