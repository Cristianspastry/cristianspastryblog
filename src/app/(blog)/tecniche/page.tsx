import { getPageMetadata } from '@/seo/seoUtils';
import TecnicheClient from '@/components/feature/TecnicheClient';
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
    '@type': 'Article',
    headline: 'Tecniche di pasticceria | Cristian’s Pastry',
    description: 'Scopri tecniche, consigli e segreti di pasticceria moderna e tradizionale. Tutorial, step e trucchi per migliorare le tue abilità.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/tecniche`,
    publisher: {
      '@type': 'Organization',
      name: 'Cristian’s Pastry',
    },
  };
  return (
    <>
      <Script id="tecniche-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      <TecnicheClient />
    </>
  );
} 