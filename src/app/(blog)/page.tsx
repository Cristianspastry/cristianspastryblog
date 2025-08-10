import SectionTitle from '../../components/layout/SectionTitle';
import RecipeCard from '../../components/feature/RecipeCard';
import HeroSection from '../../components/feature/HeroSection';
import { urlFor } from '../../sanity/lib/image';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { getPageMetadata } from '@/app/seo/seoUtils';
import Script from 'next/script';
import { getHomePageData, type Recipe } from '@/sanity/lib/data';

export async function generateMetadata() {
  return getPageMetadata({
    title: 'Cristian\'s Pastry | Blog di pasticceria moderna',
    description: 'Ricette, tecniche e storie di pasticceria italiana e internazionale. Scopri il blog di Cristian: dolci, basi, consigli e passione per la cucina.',
    image: '/public/chef-portrait.jpg',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    type: 'website',
  });
}

export default async function HomePage() {
  // JSON-LD Organization schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Cristian's Pastry",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    email: 'info@mariarossi.it',
    sameAs: [
      'https://instagram.com/mariarossi_chef',
      'https://facebook.com/mariarossi.chef',
      'https://youtube.com/mariarossi',
      'https://twitter.com/mariarossi_chef',
    ],
    logo: '/public/chef-portrait.jpg',
  };

  // Fetch tutti i dati usando la funzione centralizzata
  const { recentRecipes, author, recentDiary, recentTechniques } = await getHomePageData();

  return (
    <>
      <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      <main>
        <HeroSection />
        <section className="py-16 bg-gray-50 animate-fade-in-up">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTitle> Ricette recenti </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentRecipes && recentRecipes.length > 0 ? (
                recentRecipes.map((recipe: Recipe) => (
                  <a key={recipe._id} href={`/ricette/${recipe.slug.current}`}>
                    <RecipeCard
                      title={recipe.title}
                      image={recipe.mainImage ? urlFor(recipe.mainImage).width(400).height(250).quality(80).url() : '/placeholder.jpg'}
                      category={recipe.categories?.[0]?.title || 'Ricetta'}
                      description={recipe.excerpt || ''}
                    />
                  </a>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Nessuna ricetta ancora</h3>
                    <p className="text-gray-600 mb-6">Le ricette appariranno qui una volta pubblicate.</p>
                    <Button href="/ricette">Vai alle ricette</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        {/* Divider visivo */}
        <div className="w-full h-12 flex items-center justify-center animate-divider-fade-in">
          <div className="w-2/3 h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 transition-all duration-700" />
        </div>
        {/* Diario Preview */}
        <section className="py-16 bg-gradient-to-b from-white to-blue-50 animate-fade-in-up">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTitle> Diario da commis </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {recentDiary.length > 0 ? recentDiary.map((post: Recipe) => (
                <a key={post._id} href={`/diario/${post.slug.current}`}>
                  <RecipeCard
                    title={post.title}
                    image={post.mainImage ? urlFor(post.mainImage).width(400).height(250).quality(80).url() : '/placeholder.jpg'}
                    category={post.categories?.[0]?.title || 'Diario'}
                    description={post.excerpt || ''}
                  />
                </a>
              )) : <p className="text-gray-500">Nessun post ancora!</p>}
            </div>
            <div className="flex justify-center">
              <Button href="/diario">Vai al diario</Button>
            </div>
          </div>
        </section>
        {/* Divider visivo */}
        <div className="w-full h-12 flex items-center justify-center animate-divider-fade-in">
          <div className="w-2/3 h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 transition-all duration-700" />
        </div>
        {/* Tecniche Preview */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white animate-fade-in-up">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTitle> Tecniche di pasticceria </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {recentTechniques.length > 0 ? recentTechniques.map((post: Recipe) => (
                <a key={post._id} href={`/tecniche/${post.slug.current}`}>
                  <RecipeCard
                    title={post.title}
                    image={post.mainImage ? urlFor(post.mainImage).width(400).height(250).quality(80).url() : '/placeholder.jpg'}
                    category={post.categories?.[0]?.title || 'Tecniche'}
                    description={post.excerpt || ''}
                  />
                </a>
              )) : <p className="text-gray-500">Nessun post ancora!</p>}
            </div>
            <div className="flex justify-center">
              <Button href="/tecniche">Scopri tutte le tecniche</Button>
            </div>
          </div>
        </section>
        {/* Divider visivo finale */}
        <div className="w-full h-12 flex items-center justify-center animate-divider-fade-in">
          <div className="w-2/3 h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 transition-all duration-700" />
        </div>
        {/* Chi sono - layout coerente */}
        <section className="py-16 bg-white animate-fade-in-up">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTitle>Chi sono</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 flex justify-center">
                {author?.image ? (
                  <div className="w-48 h-48 relative">
                    <Image
                      src={urlFor(author.image).width(400).height(400).quality(85).url()}
                      alt={author.name || 'Autore'}
                      className="rounded-full object-cover border-4 border-blue-200 shadow-lg"
                      fill
                      priority
                      sizes="(max-width: 768px) 192px, 192px"
                    />
                  </div>
                ) : null}
              </div>
              <div className="md:col-span-2 flex flex-col justify-center">
                <p className="mb-6 text-gray-700 text-lg">
                  {author?.bio && Array.isArray(author.bio)
                    ? String(author.bio[0]?.children?.[0]?.text || '')
                    : 'Ciao! Sono il pasticcere autore di questo blog.'}
                </p>
                <div>
                  <Button href="/chi-sono">
                    Scopri di più
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}