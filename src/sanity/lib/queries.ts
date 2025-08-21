



///      §[X] => FUNZIONA ACCERTATA ED IMPLEMENTATA 

import buildFilter from "@/help/buildFilter";


// Query per la home page
// §[X]
export const homePageQuery = `
  {
    "recentRecipes": *[_type == "recipe" && defined(slug.current)] | order(_createdAt desc)[0...4] {
      _id,
      title,
      slug,
      prepTime,
      cookTime,
      difficulty,
      servings,
      rating,
      mainImage,
      categories[]->{title},
      excerpt,
      publishedAt,
      author->{name}
    },
    "author": *[_type == "author"] | order(_createdAt asc)[0] {
      name,
      bio,
      image
    },
    "recentDiary": *[_type == "diary" && defined(slug.current)] | order(_createdAt desc)[0...2] {
      _id,
      title,
      slug,
      mainImage,
      categories[]->{title},
      excerpt
    },
    "recentTechniques": *[_type == "techniques" && defined(slug.current)] | order(_createdAt desc)[0...2] {
      _id,
      title,
      slug,
      mainImage,
      categories[]->{title},
      excerpt
    }
  }
`;

// Query per singola ricetta
// §[X]
export const recipeBySlug = `
  *[_type == "recipe" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt,
    body,
    publishedAt,
    _updatedAt,
    difficulty,
    prepTime,
    cookTime,
    servings,
    cakePan,
    ingredients,
    instructions,
    tips,
    nutritionInfo,
    rating,
    reviews,
    author->{name},
    
    // SEO con fallback intelligenti
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description, excerpt, ""),
      "image": coalesce(seo.image, mainImage),
      "keywords": coalesce(seo.keywords, categories[]->title),
      "noIndex": seo.noIndex == true
    }
  }
`;

// Query per altre ricette (esclusa quella corrente)
// §[X]
export const otherRecipesQuery = `
  *[_type == "recipe" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...4]{
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt,
    prepTime,
    cookTime,
    difficulty,
    rating
  }
`;


// Query template per costruire query dinamiche delle ricette
// implementata nell componente filterRecipeBar 
// §[X]
export const buildRecipesQuery = (baseFilter: string, offset: number, limit: number): string => `
  *[${baseFilter}] | order(publishedAt desc)[${offset}...${offset + limit}] {
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt,
    author->{name},
    publishedAt,
    difficulty,
    prepTime,
    cookTime,
    servings,
    rating
  }
`;

// Query che ritorna tutte le categorie nel DB SAnity
// §[X]
export const allCategories = `
      *[_type == "category" && defined(title)] {
        "title": title,
        "count": count(*[_type == "recipe" && references(^._id) && defined(slug.current)])
      }[count >= 0] | order(title asc)
    `


// Query template per contare ricette
// §[X]
export const buildCountQuery = (baseFilter: string): string => `count(*[${baseFilter}])`;


// Query per tutte le ricette (pagina ricette)
export const allRecipesQuery = `
  *[_type == "recipe" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt,
    prepTime,
    cookTime,
    difficulty,
    servings,
    rating,
    publishedAt,
    author->{name}
  }
`;


// query che da l'autore 
// §[X]
export const author = `*[_type == "author"]|order(_createdAt asc)[0]{
    name,
    image,
    bio,
    quote,
    experience,
    recipesCount,
    location,
    social,
    philosophy,
    story
  }`


// query che da ricette o articolo tecniche o diario nella search bar del header 
// §[X]
export const searchRecipeNavBar = `*[_type == "recipe" && defined(slug.current) && (
          title match $q || excerpt match $q || pt::text(body) match $q
        )]{
          _id,
          title,
          slug,
          mainImage,
          excerpt,
          _type,
          "categories": categories[]->title
        }`


// Query per ottenere dati SEO delle ricette
// §[X]
export const recipesForSEOQuery = `
{
  "recipes": *[_type == "recipe" && defined(slug.current)] 
    ${buildFilter('$categoria', '$difficolta', '$search')} 
    | order(_createdAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    categories[]->{title},
    prepTime,
    cookTime,
    difficulty,
    servings,
    rating,
    publishedAt,
    author->{name}
  },
  "totalCount": count(*[_type == "recipe" && defined(slug.current)] ${buildFilter('$categoria', '$difficolta', '$search')}),
  "categories": array::unique(*[_type == "recipe" && defined(slug.current)].categories[]->title),
  "difficulties": array::unique(*[_type == "recipe" && defined(slug.current) && defined(difficulty)].difficulty)
}`;




// Query per ricette diario
//   DA IMPLEMENTARE 
export const diaryPostsQuery = `
  *[_type == "recipe" && categories[]->title == "Diario" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt,
    publishedAt
  }
`;

// Query per ricette tecniche
// DA IMPLEMENTARE 
export const techniquesPostsQuery = `
  *[_type == "recipe" && categories[]->title == "Tecniche" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt,
    publishedAt
  }
`;

// Query per contare ricette totali
// §[X]
export const countPostsQuery = `count(*[_type == "recipe"])`;

// Query per ricette pubblicate recentemente
//  DA IMPLEMENTARE ? 
export const recentPostsQuery = `
  *[_type == "recipe" && defined(slug.current)] | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt,
    publishedAt
  }
`;

// Query per sitemap
// DA IMPLEMENTARE
export const sitemapQuery = `
  *[_type == "recipe" && defined(slug.current)]{
    slug,
    publishedAt,
    _updatedAt
  }
`; 