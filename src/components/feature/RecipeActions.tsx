"use client";
import { Facebook, Twitter, Copy, Printer, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

// Icona WhatsApp SVG custom
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle cx="16" cy="16" r="16" fill="#25D366"/>
        <path d="M24.5 20.6c-.4-.2-2.3-1.1-2.6-1.2-.3-.1-.5-.2-.7.2-.2.4-.8 1.2-1 1.4-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.6.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7 0 1.6 1.2 3.1 1.4 3.3.2.2 2.3 3.6 5.7 4.9.8.3 1.4.5 1.9.6.8.2 1.5.2 2.1.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.7-.4z" fill="#fff"/>
      </g>
    </svg>
  );
}

export function SocialShareActions({ title, url }: { title: string; url: string }) {
  function handlePrint() {
    window.print();
  }
  function handleCopy() {
    navigator.clipboard.writeText(url);
    alert('Link copiato!');
  }
  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 transition"
        title="Stampa ricetta"
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Stampa</span>
      </button>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" title="Condividi su Facebook" className="bg-white/80 hover:bg-blue-100 p-2 rounded-full transition">
        <Facebook className="w-5 h-5 text-blue-700" />
      </a>
      <a href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" rel="noopener noreferrer" title="Condividi su WhatsApp" className="bg-white/80 hover:bg-green-100 p-2 rounded-full transition">
        <WhatsAppIcon className="w-5 h-5" />
      </a>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" title="Condividi su X/Twitter" className="bg-white/80 hover:bg-blue-100 p-2 rounded-full transition">
        <Twitter className="w-5 h-5 text-blue-500" />
      </a>
      <button
        onClick={handleCopy}
        title="Copia link"
        className="bg-white/80 hover:bg-blue-100 p-2 rounded-full transition"
      >
        <Copy className="w-5 h-5 text-blue-900" />
      </button>
    </div>
  );
}

export default function RecipeActions({ title, url }: { title: string; url: string }) {
  // Commenti mock
  const [comments, setComments] = useState([
    { name: 'Anna', text: 'Ricetta fantastica, l’ho provata ieri!' },
    { name: 'Luca', text: 'Molto chiara la spiegazione, grazie!' },
  ]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  function handlePrint() {
    window.print();
  }
  function handleCopy() {
    navigator.clipboard.writeText(url);
    alert('Link copiato!');
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name && text) {
      setComments([...comments, { name, text }]);
      setName('');
      setText('');
    }
  }

  return (
    <>
      {/* Pulsanti stampa e social */}
      {/* Sezione commenti */}
      <section className="py-8 animate-fade-in-up">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5 text-blue-400" /> Commenti</h3>
        <div className="mb-6 space-y-4">
          {comments.map((c, i) => (
            <div key={i} className="bg-blue-50 rounded-lg p-4 shadow flex flex-col">
              <span className="font-semibold text-blue-900">{c.name}</span>
              <span className="text-blue-800">{c.text}</span>
            </div>
          ))}
        </div>
        <form className="flex flex-col gap-3 max-w-md" onSubmit={handleSubmit}>
          <input type="text" placeholder="Il tuo nome" required className="px-4 py-2 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200" value={name} onChange={e => setName(e.target.value)} />
          <textarea placeholder="Scrivi un commento..." required className="px-4 py-2 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200" rows={3} value={text} onChange={e => setText(e.target.value)} />
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-900 text-white hover:bg-blue-800 transition self-end">
            <Send className="w-4 h-4" /> Invia
          </button>
        </form>
      </section>
    </>
  );
} 