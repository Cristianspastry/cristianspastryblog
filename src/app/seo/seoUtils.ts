// src/app/seo/seoUtils.ts
export function getPageMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  author,
  tags
}: {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | string;
  publishedTime?: string;
  author?: string;
  tags?: string[];
}) {
  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title,
      description,
      url,
      type,
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
      ...(publishedTime ? { publishedTime } : {}),
      ...(author ? { authors: [author] } : {}),
      ...(tags ? { tags } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
    ...(url ? { metadataBase: new URL(url) } : {}),
  };
} 