"use client";
import { Copy, Printer, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { FacebookIcon, WhatsAppIcon, XIcon } from "@/components/ui/SocialBrandIcons";

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
        <FacebookIcon  />
      </a>
      
      <a href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" rel="noopener noreferrer" title="Condividi su WhatsApp" className="bg-white/80 hover:bg-green-100 p-2 rounded-full transition">
        <WhatsAppIcon  />
      </a>
      
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" title="Condividi su X/Twitter" className="bg-white/80 hover:bg-blue-100 p-2 rounded-full transition">
        <XIcon  />
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




export default function RecipeActions() {



  // Commenti mock
  const [comments, setComments] = useState([
    { name: 'Anna', text: 'Ricetta fantastica, l’ho provata ieri!' },
    { name: 'Luca', text: 'Molto chiara la spiegazione, grazie!' },
  ]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  /*function handlePrint() {
    window.print();
  }*/


 /* function handleCopy() {
    navigator.clipboard.writeText(url);
    alert('Link copiato!');
  }*/

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