// Query per la home page
export const homePageQuery = `
  {
    "recentRecipes": *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...4] {
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
      excerpt
    },
    "author": *[_type == "author"] | order(_createdAt asc)[0] {
      name,
      bio,
      image
    },
    "recentDiary": *[_type == "post" && categories[]->title == "Diario" && defined(slug.current)] | order(publishedAt desc)[0...2] {
      _id,
      title,
      slug,
      mainImage,
      categories[]->{title},
      excerpt
    },
    "recentTechniques": *[_type == "post" && categories[]->title == "Tecniche" && defined(slug.current)] | order(publishedAt desc)[0...2] {
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
export const recipeQuery = `
  *[_type == "post" && slug.current == $slug][0]{
    title,
    mainImage,
    categories[]->{title},
    excerpt,
    body,
    publishedAt,
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
    author->{name}
  }
`;

// Query per altre ricette (esclusa quella corrente)
export const otherRecipesQuery = `
  *[_type == "post" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...4]{
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

// Query per tutte le ricette (pagina ricette)
export const allRecipesQuery = `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt
  }
`;

// Query per ricette per categoria
export const recipesByCategoryQuery = `
  *[_type == "post" && defined(slug.current) && $category in categories[]->title] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt
  }
`;

// Query per ricerca ricette
export const searchRecipesQuery = `
  *[_type == "post" && defined(slug.current) && (
    title match $searchTerm + "*" ||
    excerpt match "*" + $searchTerm + "*"
  )] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt
  }
`;

// Query per categorie
export const categoriesQuery = `
  *[_type == "category"] | order(title asc){
    _id,
    title,
    description
  }
`;

// Query per post diario
export const diaryPostsQuery = `
  *[_type == "post" && categories[]->title == "Diario" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt,
    publishedAt
  }
`;

// Query per post tecniche
export const techniquesPostsQuery = `
  *[_type == "post" && categories[]->title == "Tecniche" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage,
    categories[]->{title},
    excerpt,
    publishedAt
  }
`;

// Query per contare post totali
export const countPostsQuery = `count(*[_type == "post"])`;

// Query per post pubblicati recentemente
export const recentPostsQuery = `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...$limit]{
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
export const sitemapQuery = `
  *[_type == "post" && defined(slug.current)]{
    slug,
    publishedAt,
    _updatedAt
  }
`; 