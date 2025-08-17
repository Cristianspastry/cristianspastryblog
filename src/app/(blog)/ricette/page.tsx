import { getPageMetadata } from '@/seo/seoUtils';
import RicetteClient from '../../../components/feature/RicetteClient';
import Script from 'next/script';

export async function generateMetadata() {
  return getPageMetadata({
    title: 'Ricette di pasticceria | Cristian’s Pastry',
    description: 'Scopri tutte le ricette di pasticceria moderna e tradizionale di Cristian: dolci, basi, torte, biscotti e molto altro.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ricette`,
    type: 'website',
  });
}

export default function Ricette() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Ricette di pasticceria | Cristian’s Pastry',
    description: 'Scopri tutte le ricette di pasticceria moderna e tradizionale di Cristian: dolci, basi, torte, biscotti e molto altro.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ricette`,
  };
  return (
    <>
      <Script id="ricette-collection-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      <RicetteClient />
    </>
  );
} 