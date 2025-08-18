import Image from 'next/image';
import Link from 'next/link';

export type DiaryCardProps = {
  title: string;
  image: string;
  category?: string;
  description?: string;
  slug?: string;
  author?: string;
  publishedAt?: string;
  priority?: boolean;
  noLink?: boolean;
};

export default function DiaryCard({
  title,
  image,
  category = 'Diario',
  description,
  slug,
  author,
  publishedAt,
  priority = false,
  noLink = false,
}: DiaryCardProps) {
  const href = slug ? `/diario/${slug}` : '#';

  const structuredData = slug
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        image,
        description,
        author: author ? { "@type": "Person", name: author } : undefined,
        datePublished: publishedAt,
      }
    : null;

  const Card = () => (
    <article className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100 group" itemScope itemType="https://schema.org/Article">
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
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0D2858] transition-colors mb-2 font-serif leading-tight" itemProp="headline">
          {title}
        </h3>
        {author && <meta itemProp="author" content={author} />}
        {publishedAt && <meta itemProp="datePublished" content={publishedAt} />}
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3" itemProp="description">
            {description}
          </p>
        )}
        <div className="mt-auto pt-2">
          <span className="text-[#0D2858] font-medium text-sm group-hover:text-blue-600 transition-colors">
            Leggi il diario →
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
      title={`Leggi il diario: ${title}`}
      aria-label={`Vai al diario ${title}`}
    >
      <Card />
    </Link>
  );
}


