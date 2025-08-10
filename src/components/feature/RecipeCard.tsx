// components/RecipeCard.tsx
import Image from 'next/image';
import Link from 'next/link';

export type RecipeCardProps = {
  title: string;
  image: string;
  category: string;
  description?: string;
  slug?: string;
};

export default function RecipeCard({ title, image, category, description, slug }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image 
          src={image}
          alt={title}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {slug ? (
          <Link href={`/ricette/${slug}`}>
            <h3 className="text-xl font-bold text-blue-900 hover:text-blue-800 transition-colors mb-2 font-serif">
              {title}
            </h3>
          </Link>
        ) : (
          <h3 className="text-xl font-bold text-blue-900 mb-2 font-serif">{title}</h3>
        )}
        <span className="text-gray-600 text-sm mb-2">{category}</span>
        {description && <p className="text-gray-700 text-sm flex-1">{description}</p>}
      </div>
    </div>
  );
}