import { getPageMetadata } from '@/seo/seoUtils';
import PostsClient from '@/components/feature/client/PostsClient';
import Script from 'next/script';

export async function generateMetadata() {
  return getPageMetadata({
    title: 'Tecniche di pasticceria | Cristian’s Pastry',
    description: 'Scopri tecniche, consigli e segreti di pasticceria moderna e tradizionale. Tutorial, step e trucchi per migliorare le tue abilità.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/tecniche`,
    type: 'website',
  });
}

export default function Tecniche() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tecniche di pasticceria | Cristian’s Pastry',
    description: 'Scopri tecniche, consigli e segreti di pasticceria moderna e tradizionale. Tutorial, step e trucchi per migliorare le tue abilità.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/tecniche`,
  };
  return (
    <>
      <Script id="tecniche-collection-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      <PostsClient title="Tecniche" variant="tecniche" />
    </>
  );
} 