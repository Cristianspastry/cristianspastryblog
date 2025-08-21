import Recipe from '@/model/RecipeModel';
import { client } from './client';
import {
  homePageQuery,
  recipeBySlug,
  otherRecipesQuery,
  diaryPostsQuery,
  techniquesPostsQuery,
  sitemapQuery,
  author,
  searchRecipeNavBar,
  buildRecipesQuery,
  buildCountQuery,
  allCategories
} from './queries';
import SearchParams from '@/model/SearchParamsModel';
import Author from '@/model/AuthorModel';
import calculateOffset from '@/help/calculateOffset';
import calculatePagination from '@/help/calculatePagination';


// Tipi per i dati
export interface HomePageData {
  recentRecipes: Recipe[];
  author: Author | null;
  recentDiary: Recipe[];
  recentTechniques: Recipe[];
}

interface PaginationOptions {
  page: number;
  limit: number;
}

interface RecipesResult {
  recipes: Recipe[];
  totalCount: number;
  categories: string[];
  currentPage: number;
  totalPages: number;
}

//      §[X] => FUNZIONA ACCERTATA ED IMPLEMENTATA 

// Funzioni per fetchare i dati della home page , ritorna i dati di tutte e tre le sezioni , 
///       §[X]

export async function getHomePageData(): Promise<HomePageData> {
  try {

    const data = await client.fetch(homePageQuery, {}, { 
      next: { revalidate: 3600 } 
    });
    console.log(data);
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


// funzione implementate /ricette/[slug] , ritorna una ricetta specifica tramite slug 
//      §[X] 
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    return await client.fetch(recipeBySlug, { slug });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}



// funzione implementate /ricette/slug , ritorna altre ricette infondo alla pagina 
// §[X]
export async function getOtherRecipes(slug: string): Promise<Recipe[]> {
  try {
    return await client.fetch(otherRecipesQuery, { slug });
  } catch (error) {
    console.error('Error fetching other recipes:', error);
    return [];
  }
}

// funzione implementata /chi-sono , ritorna autore 
// §[X]
export async function getAuthor() {
  try {
    return await client.fetch(author)
  }  catch (error) {
    console.error('error fetching author:',error)
    return null;
  }
}

// funzione implementata nella search bar del header che ritorna ricette , articolo tecniche o diario
//  §[X]
export async function getSearchRecipeNavBar(query : string) {
  try {
    return await client.fetch(searchRecipeNavBar,{q: `*${query}*`})
  }  catch (error) {
    console.error('error fetching author:',error)
    return null;
  }
}


// da implementare 
export async function getDiaryArticle(): Promise<Recipe[]> {
  try {
    return await client.fetch(diaryPostsQuery);
  } catch (error) {
    console.error('Error fetching diary recipes:', error);
    return [];
  }
}
// da implementare 
export async function getTechniquesArticle(): Promise<Recipe[]> {
  try {
    return await client.fetch(techniquesPostsQuery);
  } catch (error) {
    console.error('Error fetching techniques recipes:', error);
    return [];
  }
}
//   DA IMPLEMENTARE 
export async function getSitemapData(): Promise<{ slug: { current: string }; publishedAt: string; _updatedAt: string }[]> {
  try {
    return await client.fetch(sitemapQuery);
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
    return [];
  }
}




// 1. Costruisce il filtro base per le ricette
// § [X]
function buildRecipeFilter(searchParams: SearchParams): { filter: string; params: Record<string, unknown> } {
  const { categoria, q } = searchParams;
  let baseFilter = '_type == "recipe" && defined(slug.current)';
  const params: Record<string, unknown> = {};

  // Filtro categoria
  if (categoria && categoria.toLowerCase() !== 'tutte') {
    const decodedCategory = decodeURIComponent(categoria).trim();
    baseFilter += ` && $categoria in categories[]->title`;
    params.categoria = decodedCategory;
  }

  // Filtro ricerca testo
  if (q && q.trim().length > 0) {
    const searchTerm = q.trim();
    baseFilter += ` && (
      title match $searchTerm || 
      excerpt match $searchTerm ||
      categories[]->title match $searchTerm
    )`;
    params.searchTerm = `*${searchTerm}*`;
  }

  return { filter: baseFilter, params };
}


// Funzione principale per ottenere ricette nella pagina /ricette con filtri e paginazione
// ottimizato per SEO , 
// Funzione principale per ottenere ricette con filtri e paginazione
// §[x]
export async function getRecipesWhitFilters(
  searchParams: SearchParams = {},
  paginationOptions: PaginationOptions = { page: 1, limit: 12 }
): Promise<RecipesResult> {
  const { page, limit } = paginationOptions;
  
  try {
    // 1. Costruisce filtro e parametri
    const { filter, params } = buildRecipeFilter(searchParams);
    
    // 2. Costruisce le query usando i template
    const offset = calculateOffset(page, limit);
    const recipesQuery = buildRecipesQuery(filter, offset, limit);
    const countQuery = buildCountQuery(filter);
    
    // 3. Esegue tutte le query in parallelo
    const [recipes, totalCount, categoriesData] = await Promise.all([
      client.fetch<Recipe[]>(recipesQuery, params),
      client.fetch<number>(countQuery, params),
      getAllCategories()
    ]);
    
    // 4. Calcola paginazione
    const pagination = calculatePagination(totalCount, page, limit);

    return {
      recipes,
      totalCount,
      categories: categoriesData.map((cat) => cat.name),
      ...pagination
    };
    
  } catch (error) {
    console.error('Errore nel recupero ricette:', error);
    return {
      recipes: [],
      totalCount: 0,
      categories: [],
      currentPage: page,
      totalPages: 0
    };
  }
}


// ritorna tutte le categorie implementato nella FilterRecipeBar 
// §[X]
export async function getAllCategories(): Promise<{ name: string; count: number }[]> {
  try {
    const categories = await client.fetch<{ title: string; count: number }[]>(allCategories);
    
    
    return categories
      .filter(cat => cat.title && cat.title.trim().length > 0)
      .map(cat => ({ 
        name: cat.title.trim(), 
        count: cat.count || 0 
      }));
      
  } catch (error) {
    console.error('Errore nel fetch delle categorie:', error);
    
    // Fallback più semplice
    try {
      const simpleCategories = await client.fetch<string[]>(`
        array::unique(*[_type == "category"].title)[defined(@)]
      `);
      
      console.log('Categorie fallback:', simpleCategories);
      
      return simpleCategories
        .filter(name => name && name.trim().length > 0)
        .map(name => ({ name: name.trim(), count: 0 }));
        
    } catch (fallbackError) {
      console.error('Errore nel fallback categorie:', fallbackError);
      return [];
    }
  }
}



// DA IMPLEMENTARE ? 
// Ottieni ricette correlate per una categoria
//  DA IMPLEMENTERE FORSE NEL /RECIPE/[SLUG] IN FONDO ALLA PAGINA
export async function getRelatedRecipes(
  currentRecipeId: string, 
  category: string, 
  limit: number = 6
): Promise<Recipe[]> {
  try {
    const query = `*[
      _type == "recipe" && 
      defined(slug.current) && 
      _id != "${currentRecipeId}" && 
      "${category}" in categories[]->title
    ] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      mainImage,
      categories[]->{title},
      excerpt,
      difficulty,
      prepTime,
      cookTime,
      rating
    }`;

    return await client.fetch<Recipe[]>(query);
  } catch (error) {
    console.error('Errore nel fetch delle ricette correlate:', error);
    return [];
  }
}

