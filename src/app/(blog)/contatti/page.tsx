import Image from 'next/image';
import SectionTitle from '@/components/layout/SectionTitle';
import Button from '@/components/ui/Button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  Youtube,
  Twitter,
  BookOpen,
  MessageCircle,
  Heart,
  Coffee,
  Camera,
  Users,
} from 'lucide-react';
import { getPageMetadata } from '@/app/seo/seoUtils';
import Script from 'next/script';

export async function generateMetadata() {
  return getPageMetadata({
    title: 'Contatti | Cristian’s Pastry',
    description: 'Contatta Cristian per domande, collaborazioni, corsi e consulenze di pasticceria. Email, telefono, social e servizi disponibili.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contatti`,
    type: 'website',
  });
}

export default function ContattiPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contatti | Cristian’s Pastry',
    description: 'Contatta Cristian per domande, collaborazioni, corsi e consulenze di pasticceria. Email, telefono, social e servizi disponibili.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contatti`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'info@mariarossi.it',
        telephone: '+39 350 123 4567',
        contactType: 'customer support',
        areaServed: 'IT',
        availableLanguage: ['Italian', 'English'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Garibaldi, 123',
      addressLocality: 'Napoli',
      postalCode: '80134',
      addressCountry: 'IT',
    },
  };
  return (
    <>
      <Script id="contatti-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-8">
        <Button 
          href="/" 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Torna al blog
        </Button>
      </div>

      {/* Hero Section */}
      <section className="mb-16 animate-fade-in-up">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-blue-900 mb-4">
            Contatti
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hai domande, suggerimenti o vuoi semplicemente condividere la tua esperienza? 
            Sarò felice di sentirti!
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold text-blue-900">Parliamo di Cucina!</h2>
          </div>
          <p className="text-blue-800 text-center leading-relaxed">
            Che tu sia un cuoco esperto o alle prime armi, sono sempre disponibile 
            per condividere consigli, ricette e la passione per la cucina italiana.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="mb-16 animate-fade-in-up">
        <SectionTitle>
          <span className="inline-flex items-center gap-3">
            <Mail className="text-blue-500 w-6 h-6" />
            Come Contattarmi
          </span>
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900">Email</h3>
                <p className="text-gray-600 text-sm">Per domande e collaborazioni</p>
              </div>
            </div>
            <div className="space-y-2">
              <a 
                href="mailto:info@mariarossi.it" 
                className="block text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                info@mariarossi.it
              </a>
              <p className="text-gray-600 text-sm">
                Rispondo entro 24 ore dal lunedì al venerdì
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900">Telefono</h3>
                <p className="text-gray-600 text-sm">Per consulenze culinarie</p>
              </div>
            </div>
            <div className="space-y-2">
              <a 
                href="tel:+393501234567" 
                className="block text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                +39 350 123 4567
              </a>
              <p className="text-gray-600 text-sm">
                Lun-Ven: 9:00-17:00
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900">Studio Culinario</h3>
                <p className="text-gray-600 text-sm">Per corsi e workshop</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">Via Garibaldi, 123</p>
              <p className="text-gray-700 font-medium">80134 Napoli, Italia</p>
              <p className="text-gray-600 text-sm">
                Su appuntamento
              </p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-900">Orari</h3>
                <p className="text-gray-600 text-sm">Quando sono disponibile</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Lun - Ven:</span>
                <span className="text-gray-900 font-medium">9:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Weekend:</span>
                <span className="text-gray-900 font-medium">Su appuntamento</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="mb-16 animate-fade-in-up">
        <SectionTitle>
          <span className="inline-flex items-center gap-3">
            <Heart className="text-red-500 w-6 h-6" />
            Seguimi sui Social
          </span>
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a 
            href="https://instagram.com/mariarossi_chef" 
            className="group bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-col items-center text-center">
              <Instagram className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2">Instagram</h3>
              <p className="text-pink-100 text-sm">Foto dei miei piatti quotidiani</p>
              <div className="mt-3 bg-white/20 rounded-full px-3 py-1">
                <span className="text-xs font-medium">15k follower</span>
              </div>
            </div>
          </a>

          <a 
            href="https://facebook.com/mariarossi.chef" 
            className="group bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-col items-center text-center">
              <Facebook className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2">Facebook</h3>
              <p className="text-blue-100 text-sm">Ricette e consigli dettagliati</p>
              <div className="mt-3 bg-white/20 rounded-full px-3 py-1">
                <span className="text-xs font-medium">8k follower</span>
              </div>
            </div>
          </a>

          <a 
            href="https://youtube.com/mariarossi" 
            className="group bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-col items-center text-center">
              <Youtube className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2">YouTube</h3>
              <p className="text-red-100 text-sm">Video tutorial step-by-step</p>
              <div className="mt-3 bg-white/20 rounded-full px-3 py-1">
                <span className="text-xs font-medium">12k iscritti</span>
              </div>
            </div>
          </a>

          <a 
            href="https://twitter.com/mariarossi_chef" 
            className="group bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-col items-center text-center">
              <Twitter className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2">Twitter</h3>
              <p className="text-sky-100 text-sm">Consigli rapidi e novità</p>
              <div className="mt-3 bg-white/20 rounded-full px-3 py-1">
                <span className="text-xs font-medium">5k follower</span>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Services */}
      <section className="mb-16 animate-fade-in-up">
        <SectionTitle>
          <span className="inline-flex items-center gap-3">
            <Users className="text-purple-500 w-6 h-6" />
            Servizi Disponibili
          </span>
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-purple-900">Corsi di Cucina</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Lezioni private e di gruppo per imparare le basi della cucina italiana
            </p>
            <div className="text-purple-600 font-medium text-sm">
              Da €50/persona
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-orange-900">Consulenze</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Aiuto per ristoranti, menu personalizzati e sviluppo ricette
            </p>
            <div className="text-orange-600 font-medium text-sm">
              Su preventivo
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-900">Food Photography</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Servizi fotografici per menu, blog e social media
            </p>
            <div className="text-green-600 font-medium text-sm">
              Da €150/sessione
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16 animate-fade-in-up">
        <SectionTitle>
          <span className="inline-flex items-center gap-3">
            <MessageCircle className="text-blue-500 w-6 h-6" />
            Domande Frequenti
          </span>
        </SectionTitle>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Come posso contattarti?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Hai domande, suggerimenti o vuoi semplicemente condividere la tua esperienza? 
              Sarò felice di sentirti!
            </p>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}