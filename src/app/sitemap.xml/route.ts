import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function GET() {
  // Fetch all slugs for ricette, tecniche, diario
  const recipes = await client.fetch(`*[_type == "recipe" && defined(slug.current)]{
    slug,
    categories[]->{title}
  }`);

  // Helper per categoria
  function getSection(categories: { title: string }[] = []) {
    const cats = categories.map(c => c.title?.toLowerCase());
    if (cats.some(cat => ["ricetta", "ricette"].includes(cat))) return 'ricette';
    if (cats.some(cat => ["tecnica", "tecniche"].includes(cat))) return 'tecniche';
    if (cats.some(cat => ["diario"].includes(cat))) return 'diario';
    return null;
  }

  // Static pages
  const staticPages = [
    '', // homepage
    'chi-sono',
    'contatti',
    'ricette',
    'tecniche',
    'diario',
  ];

  // Dynamic pages
  const dynamicUrls: string[] = [];
  recipes.forEach((recipe: { slug?: { current?: string }, categories?: { title: string }[] }) => {
    const section = getSection(recipe.categories);
    if (section && recipe.slug?.current) {
      dynamicUrls.push(`${siteUrl}/${section}/${recipe.slug.current}`);
    }
  });
  
  // Build sitemap
  const urls = [
    ...staticPages.map(path => `${siteUrl}/${path}`.replace(/\/\/$/, '/')),
    ...dynamicUrls,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      url => `<url><loc>${url}</loc></url>`
    )
    .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 