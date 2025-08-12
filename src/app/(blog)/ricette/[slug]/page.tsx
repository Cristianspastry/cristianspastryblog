import { urlFor } from '../../../../sanity/lib/image';
import SectionTitle from '../../../../components/layout/SectionTitle';
import { notFound } from 'next/navigation';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { 
  Clock, 
  Calendar, 
  List, 
  Lightbulb, 
  ChefHat,
  BookOpen,
  Star,
  Timer,
  Users
} from 'lucide-react';
import RecipeActions, { SocialShareActions } from '../../../../components/feature/RecipeActions';
import { Suspense } from 'react';
import { getPageMetadata } from '@/app/seo/seoUtils';
import Script from 'next/script';
import Link from 'next/link';
import { getRecipe, getOtherRecipes, type Recipe } from '@/sanity/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

// Componente per il caricamento skeleton
function RecipeSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-gray-200 h-8 w-48 mb-4 rounded"></div>
      <div className="bg-gray-200 h-64 md:h-96 rounded-2xl mb-8"></div>
      <div className="space-y-4">
        <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
        <div className="bg-gray-200 h-4 w-full rounded"></div>
        <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
      </div>
    </div>
  );
}

// Componente per il rating
function RecipeRating({ rating, reviews }: { rating?: number; reviews?: number }) {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-yellow-800">
        {rating.toFixed(1)}
      </span>
      {reviews && (
        <span className="text-xs text-gray-600">({reviews} recensioni)</span>
      )}
    </div>
  );
}

// Componente per il tempo totale
function TotalTime({ prepTime, cookTime }: { prepTime?: number; cookTime?: number }) {
  const total = (prepTime || 0) + (cookTime || 0);
  if (!total) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
      <Timer className="w-4 h-4" />
      Tempo totale: {total} min
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) return {};
  return getPageMetadata({
    title: recipe.title,
    description: recipe.excerpt,
    image: recipe.mainImage ? urlFor(recipe.mainImage).width(1200).height(630).url() : undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ricette/${slug}`,
    type: 'article',
    publishedTime: recipe.publishedAt,
    author: recipe.author?.name,
    tags: recipe.categories?.map((c: { title: string }) => c.title),
  });
}

export default async function RicettaDettaglioPage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  const otherRecipes = await getOtherRecipes(slug);
  if (!recipe) return notFound();

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ricette/${slug}`;

  // JSON-LD Recipe schema
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.excerpt,
    image: recipe.mainImage ? urlFor(recipe.mainImage).width(1200).height(630).url() : undefined,
    author: recipe.author?.name ? { '@type': 'Person', name: recipe.author.name } : undefined,
    datePublished: recipe.publishedAt,
    recipeCategory: recipe.categories?.map((c: { title: string }) => c.title),
    recipeIngredient: recipe.ingredients?.map(
      (i: { amount?: string | number; unit?: string; ingredient: string }) =>
        `${i.amount ? i.amount + ' ' : ''}${i.unit ? i.unit + ' ' : ''}${i.ingredient}`
    ),
    recipeInstructions: recipe.instructions?.map(
      (step: { instruction: string }) => step.instruction
    ),
    prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
    cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
    totalTime: recipe.prepTime && recipe.cookTime ? `PT${recipe.prepTime + recipe.cookTime}M` : undefined,
    keywords: recipe.categories?.map((c: { title: string }) => c.title).join(', '),
  };

  return (
    <>
      <Script id="recipe-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Navigation sticky migliorata */}
      <div className="sticky top-4 z-30 mb-6">
        <div className="flex justify-between items-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-6 py-3 border border-white/20">
          <Button 
            href="/ricette" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Torna alle ricette
          </Button>
          <div className="flex items-center gap-2">
            <TotalTime prepTime={recipe.prepTime} cookTime={recipe.cookTime} />
            <RecipeRating rating={recipe.rating} reviews={recipe.reviews} />
          </div>
        </div>
      </div>

      {/* Hero section migliorata */}
      <div className="relative mb-10 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
        {recipe.mainImage && (
          <div className="relative h-64 md:h-[32rem] w-full">
            <Image
              src={urlFor(recipe.mainImage).width(1200).height(600).url()}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex flex-wrap gap-3 mb-4">
              {recipe.categories?.map((cat) => (
                <span 
                  key={cat.title} 
                  className="bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  {cat.title}
                </span>
              ))}
              {recipe.difficulty && (
                <span className="bg-orange-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  Difficoltà: {recipe.difficulty}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              {recipe.title}
            </h1>
            <SocialShareActions title={recipe.title} url={currentUrl} />
          </div>
        </div>
      </div>

      {/* Recipe info cards migliorata */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {recipe.prepTime && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 text-center">
            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Preparazione</div>
            <div className="text-lg font-bold text-blue-900">{recipe.prepTime} min</div>
          </div>
        )}
        {recipe.cookTime && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 text-center">
            <Timer className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Cottura</div>
            <div className="text-lg font-bold text-orange-900">{recipe.cookTime} min</div>
          </div>
        )}
        {recipe.servings && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 text-center">
            <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Porzioni</div>
            <div className="text-lg font-bold text-green-900">{recipe.servings}</div>
          </div>
        )}
        {recipe.author?.name && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100 text-center">
            <ChefHat className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Chef</div>
            <div className="text-sm font-bold text-purple-900">{recipe.author.name}</div>
          </div>
        )}
        {recipe.publishedAt && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Calendar className="w-6 h-6 text-gray-500 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Pubblicata</div>
            <div className="text-xs font-bold text-gray-900">
              {new Date(recipe.publishedAt).toLocaleDateString('it-IT')}
            </div>
          </div>
        )}
      </div>

      {/* Excerpt migliorata */}
      {recipe.excerpt && (
        <div className="mb-10 animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-blue-100">
            <p className="text-lg leading-relaxed text-blue-900 italic">{recipe.excerpt}</p>
          </div>
        </div>
      )}

      {/* Layout a due colonne per desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Ingredienti */}
        <div className="lg:col-span-1 animate-fade-in-up">
          <SectionTitle>
            <span className="inline-flex items-center gap-3">
              <List className="text-blue-500 w-6 h-6" />
              Ingredienti
            </span>
          </SectionTitle>
          <div className="sticky top-32">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <ul className="space-y-3">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3 text-blue-900">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <span className="leading-relaxed">
                      {ing.amount && (
                        <span className="font-semibold text-blue-700">{ing.amount}</span>
                      )}
                      {ing.unit && (
                        <span className="text-blue-600"> {ing.unit}</span>
                      )}
                      {(ing.amount || ing.unit) && <span> di </span>}
                      <span className="font-medium">{ing.ingredient}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Procedimento */}
        <div className="lg:col-span-2 animate-fade-in-up">
          <SectionTitle>
            <span className="inline-flex items-center gap-3">
              <ChefHat className="text-orange-500 w-6 h-6" />
              Procedimento
            </span>
          </SectionTitle>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <ol className="space-y-6">
              {recipe.instructions?.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-800 leading-relaxed">{step.instruction}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Consigli dello chef migliorati */}
      {recipe.tips && recipe.tips.length > 0 && (
        <div className="mb-12 animate-fade-in-up">
          <SectionTitle>
            <span className="inline-flex items-center gap-3">
              <Lightbulb className="text-yellow-500 w-6 h-6" />
              Consigli dello chef
            </span>
          </SectionTitle>
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-lg border border-yellow-200">
            <ul className="space-y-3">
              {recipe.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-yellow-900 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Divider elegante */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-px bg-gradient-to-r from-transparent to-blue-300"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
          <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div className="w-20 h-px bg-gradient-to-l from-transparent to-blue-300"></div>
        </div>
      </div>

      {/* Altre ricette migliorate */}
      <Suspense fallback={<RecipeSkeleton />}>
        <section className="animate-fade-in-up">
          <SectionTitle>
            <span className="inline-flex items-center gap-3">
              <BookOpen className="text-indigo-500 w-6 h-6" />
              Altre ricette che potrebbero piacerti
            </span>
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
            {otherRecipes.map((r: Recipe) => (
              <Link 
                key={r._id} 
                href={`/ricette/${r.slug.current}`} 
                className="group block transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={r.mainImage ? urlFor(r.mainImage).width(500).height(350).url() : '/placeholder.jpg'}
                      alt={r.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 right-4">
                      {r.rating && (
                        <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-current text-yellow-400" />
                          {r.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif group-hover:text-blue-600 transition-colors leading-tight">
                      {r.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span className="font-medium">{r.categories?.[0]?.title || 'Ricetta'}</span>
                      {r.difficulty && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                          {r.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      {r.prepTime && (
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {r.prepTime + (r.cookTime || 0)} min
                        </span>
                      )}
                    </div>
                    {r.excerpt && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {r.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Suspense>

      {/* Sezione commenti in fondo */}
      <section className="mt-12 pt-8 border-t border-gray-200">
        <RecipeActions />
      </section>
    </main>
    </>
  );
}