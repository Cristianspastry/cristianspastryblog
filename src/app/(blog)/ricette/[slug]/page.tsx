import { urlFor } from '../../../../sanity/lib/image';
import SectionTitle from '../../../../components/layout/SectionTitle';
import { notFound } from 'next/navigation';
//import Button from '@/components/ui/Button';
import Image from 'next/image';
import {
  Clock,
  List,
  Lightbulb,
  ChefHat,
  BookOpen,
  Timer,
  Users,
  RectangleHorizontal,
} from 'lucide-react';
import RecipeActions, { SocialShareActions } from '../../../../components/feature/RecipeActions';
import { Suspense } from 'react';
import { getPageMetadata } from '@/seo/seoUtils';
import Script from 'next/script';
import { getRecipe, getOtherRecipes, type Recipe } from '@/sanity/lib/data';
import RecipeSkeleton from '@/components/feature/RecipeSkeleton';
import getDifficultyRecipe from '@/help/getDifficultyConfig';
import RecipeCard from '@/components/feature/card/RecipeCard';

interface Props {
  params: Promise<{ slug: string }>;
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
                    className="bg-[#0D2858] backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {cat.title}
                  </span>
                ))}
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

          {recipe.difficulty && (
            (() => {
              const difficultyConfig = getDifficultyRecipe(recipe.difficulty);
              if (!difficultyConfig) return null;

              return (
                <div className={`bg-white rounded-xl p-4 shadow-sm border ${difficultyConfig.borderColor} text-center`}>
                  <ChefHat className={`w-6 h-6 ${difficultyConfig.iconColor} mx-auto mb-2`} />
                  <div className="text-sm text-gray-600">Difficoltà</div>
                  <div className={`text-lg font-bold ${difficultyConfig.textColor}`}>
                    {difficultyConfig.label}
                  </div>

                </div>
              );
            })()
          )}

          {recipe.servings && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 text-center">
              <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Porzioni</div>
              <div className="text-lg font-bold text-green-900">{recipe.servings}</div>
            </div>
          )}
          {recipe.cakePan && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <RectangleHorizontal className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Teglia</div>
              <div className="text-xs font-bold text-gray-900">Ø {recipe.cakePan} cm</div>
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
        {/* Altre ricette migliorate */}
        <Suspense fallback={<RecipeSkeleton />}>
          <section className="animate-fade-in-up">
            <SectionTitle>
              <span className="inline-flex items-center gap-3">
                <BookOpen className="text-indigo-500 w-6 h-6" />
                Altre ricette che potrebbero piacerti
              </span>
            </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {otherRecipes.map((r: Recipe, index: number) => (
                <RecipeCard
                  key={r._id}
                  title={r.title}
                  image={r.mainImage ? urlFor(r.mainImage).width(600).height(400).url() : '/placeholder.jpg'}
                  category={r.categories?.[0]?.title || 'Ricetta'}
                  description={r.excerpt}
                  slug={r.slug.current}
                  prepTime={r.prepTime}
                  cookTime={r.cookTime}
                  difficulty={r.difficulty}
                  servings={r.servings}
                  rating={r.rating}
                  priority={index < 2}
                  variant="large" // Usa la variante grande per questa sezione
                />
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