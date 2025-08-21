import Image from 'next/image';
import SectionTitle from '@/components/layout/SectionTitle';
import Button from '@/components/ui/Button';
import { 
  Heart, 
  ChefHat, 
  BookOpen, 
  Award,
  MapPin,
  Utensils,
  Star,
  Quote
} from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { getPageMetadata } from '@/seo/seoUtils';
import Script from 'next/script';
import { getAuthor } from '@/sanity/lib/data';

export async function generateMetadata() {
  return getPageMetadata({
    title: 'Chi sono | Cristian’s Pastry',
    description: 'Scopri chi è Cristian: storia, filosofia, esperienza e passione per la pasticceria. Bio, valori e percorso professionale.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/chi-sono`,
    type: 'profile',
  });
}

export default async function ChiSonoPage() {
  const author = await getAuthor();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author?.name,
    description: author?.bio && Array.isArray(author.bio) ? author.bio[0]?.children?.[0]?.text : undefined,
    image: author?.image ? urlFor(author.image).width(400).height(400).url() : undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/chi-sono`,
  };

  return (
    <>
      <Script id="person-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-8">
        <Button 
          href="/" 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Torna al blog
        </Button>
      </div>

      {/* Hero Section */}
      <section className="mb-16 animate-fade-in-up">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-blue-900 mb-4">
            {author?.name || 'Chi Sono'}
          </h1>
          {author?.bio && (
            <div className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <PortableText value={author.bio} />
            </div>
          )}
        </div>

        {/* Profile Image & Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl">
              {author?.image ? (
                <Image
                  src={urlFor(author.image).width(600).height(600).url()}
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl text-blue-400">?</div>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-500 text-white p-4 rounded-2xl shadow-lg">
              <ChefHat className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-6">
            {author?.quote && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <Quote className="w-8 h-8 text-blue-500 mb-4" />
                <blockquote className="text-lg italic text-blue-900 leading-relaxed">
                  {author.quote}
                </blockquote>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 text-center">
                <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Esperienza</div>
                <div className="text-lg font-bold text-blue-900">{author?.experience || '-'}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 text-center">
                <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Ricette</div>
                <div className="text-lg font-bold text-green-900">{author?.recipesCount || '-'}</div>
              </div>
            </div>
            {author?.location && (
              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <MapPin className="w-5 h-5" />
                <span>{author.location}</span>
              </div>
            )}
            {author?.social && author.social.length > 0 && (
              <div className="flex gap-4 mt-4">
                {(author.social as {label: string; url: string; icon?: string}[]).map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-2">
                    {/* Puoi mappare l'icona in base a s.icon se vuoi */}
                    <span className="font-semibold">{s.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* La Mia Storia */}
      <section className="mb-16 animate-fade-in-up">
        <SectionTitle>
          <span className="inline-flex items-center gap-3">
            <Heart className="text-red-500 w-6 h-6" />
            La Mia Storia
          </span>
        </SectionTitle>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="prose prose-lg max-w-none">
            {author?.story ? (
              <PortableText value={author.story} />
            ) : (
              <p className="text-gray-700 leading-relaxed">Storia non disponibile.</p>
            )}
          </div>
        </div>
      </section>

      {/* La Mia Filosofia */}
      <section className="mb-16 animate-fade-in-up">
        <SectionTitle>
          <span className="inline-flex items-center gap-3">
            <Utensils className="text-orange-500 w-6 h-6" />
            La Mia Filosofia Culinaria
          </span>
        </SectionTitle>
        {author?.philosophy && author.philosophy.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(author.philosophy as {title: string; description: string; icon?: string}[]).map((item, i) => (
              <div key={i} className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    {/* Puoi mappare l'icona in base a item.icon se vuoi */}
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">{item.title}</h3>
                </div>
                <p className="text-blue-800 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">Filosofia non disponibile.</p>
        )}
      </section>

      {/* Cosa Troverai (statico) */}
      <section className="mb-16 animate-fade-in-up">
        <SectionTitle>
          <span className="inline-flex items-center gap-3">
            <Star className="text-yellow-500 w-6 h-6" />
            Cosa Troverai nel Blog
          </span>
        </SectionTitle>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Ricette Tradizionali</h4>
                  <p className="text-gray-600 text-sm">
                    Piatti della tradizione italiana, dalle nonne alle tavole moderne
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Tecniche Culinarie</h4>
                  <p className="text-gray-600 text-sm">
                    Consigli pratici e segreti per migliorare le tue abilità in cucina
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">Stagionalità</h4>
                  <p className="text-gray-600 text-sm">
                    Ricette che seguono il ritmo delle stagioni e dei prodotti freschi
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">Storie & Aneddoti</h4>
                  <p className="text-gray-600 text-sm">
                    Racconti legati ai piatti e alle tradizioni culinarie italiane
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Consigli Pratici</h4>
                  <p className="text-gray-600 text-sm">
                    Suggerimenti per organizzare al meglio la tua cucina
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Menu Stagionali</h4>
                  <p className="text-gray-600 text-sm">
                    Proposte complete per ogni occasione e stagione
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center animate-fade-in-up">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Iniziamo a Cucinare Insieme!</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Esplora le mie ricette, lasciati ispirare dai miei consigli e scopri 
            come trasformare ingredienti semplici in piatti straordinari.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              href="/ricette" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Scopri le Ricette
            </Button>
            <Button 
              href="/contatti" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Contattami
            </Button>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}