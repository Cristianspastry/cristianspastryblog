import SectionTitle from '../../components/layout/SectionTitle';
import RecipeCard from '../../components/feature/card/RecipeCard';
import DiaryCard from '../../components/feature/card/DiaryCard';
import TechniqueCard from '../../components/feature/card/TechniqueCard';
import HeroSection from '../../components/feature/HeroSection';
import { urlFor } from '../../sanity/lib/image';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { getPageMetadata } from '@/seo/seoUtils';
import Script from 'next/script';
import { getHomePageData,  } from '@/sanity/lib/data';
import { siteConfig } from '@/config/site';
import Recipe from '@/model/RecipeModel';


export async function generateMetadata() {
  // get le ricette da sanity
  const { recentRecipes } = await getHomePageData();
  
  // Meta description dinamica basata sulle ricette recenti
  const recipeTitles = recentRecipes?.slice(0, 3).map(r => r.title).join(', ') || 'dolci moderni e tradizionali';
  const recipesCount = recentRecipes?.length || 50;
  
  return getPageMetadata({
    title: 'Cristian\'s Pastry | Ricette di Pasticceria Italiana Moderne 2025',
    description: `🍰 Scopri ${recipesCount}+ ricette di pasticceria moderna italiana: ${recipeTitles}. Tecniche professionali, tutorial step-by-step e segreti del mestiere spiegati dal pasticcere.`,
    keywords: 'ricette pasticceria, dolci italiani, tecniche pasticceria, blog cucina, ricette moderne, pasticceria professionale, dolci fatti in casa, tutorial dolci',
    image: '/chef-portrait.jpg', // ✅ Corretto senza /public/
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    type: 'website',
    
    // Open Graph ottimizzato
    openGraph: {
      title: '🍰 Cristian\'s Pastry - Le Migliori Ricette di Pasticceria Italiana',
      description: `${recipesCount}+ ricette testate: ${recipeTitles}. Tecniche professionali spiegate passo dopo passo con foto e video!`,
      siteName: 'Cristian\'s Pastry',
      locale: 'it_IT',
      type: 'website',
      images: [{
        url: '/chef-portrait.jpg',
        width: 1200,
        height: 630,
        alt: 'Cristian\'s Pastry - Blog di Pasticceria Moderna Italiana'
      }],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: '🍰 Cristian\'s Pastry',
      description: `${recipesCount}+ ricette di pasticceria italiana moderne e tecniche professionali`,
      creator: '@cristianspastry', // Sostituisci se hai un account Twitter
    }
  });
}







export default async function HomePage() {
  
  
  const combinedSchema = [
    // Organization Schema
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.name,
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      logo: '/logo2.svg', // ✅ Corretto senza /public/
      sameAs: siteConfig.social,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        availableLanguage: 'Italian'
      }
    },
    
    // Website Schema per Search Action
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      url: process.env.NEXT_PUBLIC_SITE_URL,
      description: 'Blog di pasticceria moderna italiana con ricette, tecniche e tutorial professionali',
      inLanguage: 'it-IT',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/ricette?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  ];


  // Fetch tutti i dati usando la funzione centralizzata
  const { recentRecipes, author, recentDiary, recentTechniques } = await getHomePageData();

  return (
    <>
      <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(combinedSchema)}
      </Script>
      <main>
        <HeroSection />
        <section className="py-16 bg-gray-50 animate-fade-in-up">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTitle> Ricette recenti </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentRecipes && recentRecipes.length > 0 ? (
                recentRecipes.map((recipe: Recipe, index: number) => (
                  // REMOVED the Link wrapper - RecipeCard handles its own Link internally
                  <RecipeCard
                    key={recipe._id}
                    recipeProps={recipe}
                    priority={index < 3} // Priorità per le prime 3 immagini
                  />
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
              {recentDiary.length > 0 ? recentDiary.map((recipe: Recipe) => (
                <DiaryCard
                  key={recipe._id}
                  title={recipe.title}
                  image={recipe.mainImage ? urlFor(recipe.mainImage).width(400).height(250).quality(80).url() : '/placeholder.jpg'}
                  category={recipe.categories?.[0]?.title || 'Diario'}
                  description={recipe.excerpt || ''}
                  slug={'recipe.slug.current'}
                  publishedAt={recipe.publishedAt}
                  author={recipe.author?.name}
                />
              )) : <p className="text-gray-500">Nessuna ricetta ancora!</p>}
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
              {recentTechniques.length > 0 ? recentTechniques.map((recipe: Recipe) => (
                <TechniqueCard
                  key={recipe._id}
                  title={recipe.title}
                  image={recipe.mainImage ? urlFor(recipe.mainImage).width(400).height(250).quality(80).url() : '/placeholder.jpg'}
                  category={recipe.categories?.[0]?.title || 'Tecniche'}
                  description={recipe.excerpt || ''}
                  slug={'recipe.slug.current'}
                />
              )) : <p className="text-gray-500">Nessuna tecnica ancora!</p>}
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