import { getPageMetadata } from '@/seo/seoUtils';
import PostsClient from '@/components/feature/client/PostsClient';
import Script from 'next/script';

export async function generateMetadata() {
  return getPageMetadata({
    title: 'Diario da commis | Cristian’s Pastry',
    description: 'Appunti, storie e riflessioni dal percorso di Cristian in pasticceria. Esperienze, emozioni e crescita professionale.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/diario`,
    type: 'website',
  });
}

export default function Diario() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Diario da commis | Cristian’s Pastry',
    description: 'Appunti, storie e riflessioni dal percorso di Cristian in pasticceria. Esperienze, emozioni e crescita professionale.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/diario`,
  };
  return (
    <>
      <Script id="diario-collection-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      <PostsClient title="Diario da commis" variant="diario" />
    </>
  );
}