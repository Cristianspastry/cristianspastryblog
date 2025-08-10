import React from 'react';
import { getPageMetadata } from '@/app/seo/seoUtils';
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
    '@type': 'Article',
    headline: 'Diario da commis | Cristian’s Pastry',
    description: 'Appunti, storie e riflessioni dal percorso di Cristian in pasticceria. Esperienze, emozioni e crescita professionale.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/diario`,
    publisher: {
      '@type': 'Organization',
      name: 'Cristian’s Pastry',
    },
  };
  return (
    <>
      <Script id="diario-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-blue-900 mb-8 text-center">Diario da commis</h1>
        <p className="text-center text-gray-700">Appunti, storie e riflessioni dal mio percorso. (Coming soon)</p>
      </div>
    </>
  );
} 