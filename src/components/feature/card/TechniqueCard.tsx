import Image from 'next/image';
import Link from 'next/link';

export type TechniqueCardProps = {
  title: string;
  image: string;
  category?: string;
  description?: string;
  slug?: string;
  priority?: boolean;
  noLink?: boolean;
};

export default function TechniqueCard({
  title,
  image,
  category = 'Tecniche',
  description,
  slug,
  priority = false,
  noLink = false,
}: TechniqueCardProps) {
  const href = slug ? `/tecniche/${slug}` : '#';

  const structuredData = slug
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: title,
        image,
        description,
      }
    : null;

  const Card = () => (
    <article className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100 group" itemScope itemType="https://schema.org/HowTo">
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={`${title} - ${category}`}
          fill
          className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
          priority={priority}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-[#0D2858]/90 backdrop-blur-sm text-white px-2.5 py-1 text-xs rounded-full font-medium">
            {category}
          </span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0D2858] transition-colors mb-2 font-serif leading-tight" itemProp="name">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3" itemProp="description">
            {description}
          </p>
        )}
        <div className="mt-auto pt-2">
          <span className="text-[#0D2858] font-medium text-sm group-hover:text-blue-600 transition-colors">
            Leggi l&apos;articolo →
          </span>
        </div>
      </div>
    </article>
  );

  if (noLink || !slug) return <Card />;

  return (
    <Link
      href={href}
      className="block transform hover:scale-[1.02] transition-all duration-300 h-full"
      title={`Scopri la tecnica: ${title}`}
      aria-label={`Vai alla tecnica ${title}`}
    >
      <Card />
    </Link>
  );
}


