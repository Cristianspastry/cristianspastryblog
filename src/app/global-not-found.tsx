// Import global styles and fonts
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'
 
const inter = Inter({ subsets: ['latin'] })
 
export const metadata: Metadata = {
  title: '404 - Pagina non trovata',
  description: 'La pagina che stai cercando non esiste più o è stata spostata.',
}
 
export default function GlobalNotFound() {
  return (
    <html lang="it" className={inter.className}>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .floating { animation: float 3s ease-in-out infinite; }
          .glow { animation: glow 2s ease-in-out infinite; }
          .fade-in { animation: fadeInUp 0.8s ease-out forwards; }
          .fade-in-delayed { animation: fadeInUp 0.8s ease-out 0.3s forwards; opacity: 0; }
          .fade-in-delayed-2 { animation: fadeInUp 0.8s ease-out 0.6s forwards; opacity: 0; }
          `
        }} />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-[#0A1F45] via-[#0D2858] to-[#0A1F45] flex items-center justify-center p-4 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className="fade-in mb-8">
            <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 leading-none floating">
              404
            </h1>
          </div>

          {/* Main message */}
          <div className="fade-in-delayed space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Pagina non trovata
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              La pagina che stai cercando sembra essere andata in vacanza 🏖️<br/>
              Potrebbe essere stata spostata, rinominata o semplicemente non esistere più.
            </p>
          </div>

          {/* Action buttons */}
          <div className="fade-in-delayed-2 space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center md:items-center">
            <Link 
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#0D2858] to-blue-700 text-white font-semibold rounded-full hover:from-blue-700 hover:to-[#0D2858] transition-all duration-300 transform hover:scale-105 hover:shadow-xl glow"
            >
              🏠 Torna alla Home
            </Link>
            
          </div>

          {/* Fun suggestions */}
          <div className="mt-16 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">💡 Cosa puoi fare:</h3>
            <div className="text-gray-300 space-y-2 text-left md:text-center">
              <p>🔍 Controlla che l&apos;URL sia corretto</p>
              <p>🔄 Prova a ricaricare la pagina</p>
              <p>🏠 Torna alla homepage per ricominciare</p>
              <p>📖 Scopri i nostri articoli più recenti</p>
            </div>
          </div>

          
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 text-6xl opacity-10 floating">💫</div>
        <div className="absolute bottom-20 right-20 text-4xl opacity-10 floating" style={{animationDelay: '1s'}}>🚀</div>
        <div className="absolute top-1/2 left-10 text-5xl opacity-10 floating" style={{animationDelay: '2s'}}>⭐</div>
        <div className="absolute bottom-1/3 left-1/4 text-3xl opacity-10 floating" style={{animationDelay: '3s'}}>✨</div>
      </body>
    </html>
  )
}