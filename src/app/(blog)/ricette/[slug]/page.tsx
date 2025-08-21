import { urlFor } from '../../../../sanity/lib/image';
import SectionTitle from '../../../../components/layout/SectionTitle';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
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
import { getRecipeBySlug, getOtherRecipes } from '@/sanity/lib/data';
import RecipeSkeleton from '@/components/feature/RecipeSkeleton';
import getDifficultyRecipe from '@/help/getDifficultyConfig';
import RecipeCard from '@/components/feature/card/RecipeCard';
import CategoryChip from '@/components/ui/CategoryChip';
import Recipe from '@/model/RecipeModel';
import { generateRecipeMetadata, generateRecipeJsonLd } from '@/sanity/lib/seoHelpers';

interface Props {
  params: Promise<{ slug: string }>;
}

// Helper per ottenere ricetta (riutilizzabile)
const getRecipe = async (slug: string) => {
  return await getRecipeBySlug(slug);
};

// ========================================
// METADATA GENERATION (SEO-Ottimizzata)
// ========================================
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  
  if (!recipe) {
    return { 
      title: "Ricetta non trovata",
      description: "La ricetta che stai cercando non esiste."
    };
  }

  // Usa il nuovo helper SEO invece del vecchio getPageMetadata
  return generateRecipeMetadata(recipe);
}

// ========================================
// COMPONENTE PRINCIPALE (La tua struttura mantenuta)
// ========================================
export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  const otherRecipes = await getOtherRecipes(slug);
  
  if (!recipe) return notFound();

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ricette/${slug}`;

  // JSON-LD ottimizzato usando il nuovo helper
  const jsonLd = generateRecipeJsonLd(recipe);

  return (
    <>
      {/* JSON-LD Schema ottimizzato */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero section - USO i dati SEO ottimizzati */}
        <div className="relative mb-10 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
          {recipe.seo.image && (
            <div className="relative h-64 md:h-[32rem] w-full">
              <Image
                src={urlFor(recipe.seo.image).width(1200).height(600).url()}
                alt={recipe.seo.image.alt || recipe.seo.title}
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
                  <div key={cat.title}>
                    <CategoryChip 
                      key={cat.title}
                      cat={cat}
                      category={cat.title}
                    />
                  </div>
                ))}
              </div>
              {/* USA il titolo SEO ottimizzato */}
              <h1 className="text-3xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                {recipe.seo.title}
              </h1>
              <SocialShareActions title={recipe.seo.title} url={currentUrl} />
            </div>
          </div>
        </div>

        {/* Recipe info cards - INVARIATA la tua struttura */}
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

        {/* Excerpt - USA la descrizione SEO ottimizzata */}
        {recipe.seo.description && (
          <div className="mb-10 animate-fade-in-up">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-blue-100">
              <p className="text-lg leading-relaxed text-blue-900 italic">{recipe.seo.description}</p>
            </div>
          </div>
        )}

        {/* Layout a due colonne - INVARIATO il tuo design */}
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

        {/* Consigli dello chef - INVARIATI */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div className="mb-12 animate-fade-in-up">
            <SectionTitle>
              <span className="inline-flex items-center gap-3">
                <Lightbulb className="text-yellow-500 w-6 h-6" />
                Consigli
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

        {/* Divider elegante - INVARIATO */}
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

        {/* Altre ricette - CORREGGI il bug nel RecipeCard */}
        <Suspense fallback={<RecipeSkeleton />}>
          <section className="animate-fade-in-up">
            <SectionTitle>
              <span className="inline-flex items-center gap-3">
                <BookOpen className="text-indigo-500 w-6 h-6" />
                Altre ricette che potrebbero piacerti
              </span>
            </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {otherRecipes
                .filter((r: Recipe) => !r.seo?.noIndex) // Filtra ricette nascoste
                .map((r: Recipe, index: number) => (
                  <RecipeCard
                    key={r._id}
                    recipeProps={r} // CORRETTO: era `recipe` ora è `r`
                    priority={index < 2}
                    variant="large"
                  />
                ))}
            </div>
          </section>
        </Suspense>

        {/* Sezione commenti - INVARIATA */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <RecipeActions />
        </section>

        {/* Keywords nascoste per SEO */}
        {recipe.seo.keywords && recipe.seo.keywords.length > 0 && (
          <div className="sr-only">
            <span>Keywords: {recipe.seo.keywords.join(', ')}</span>
          </div>
        )}
      </main>
    </>
  );
}