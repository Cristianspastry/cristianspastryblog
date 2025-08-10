import React from "react";
import { siteConfig } from "@/config/site";
import SocialIcons from "@/components/ui/SocialIcons";

const Footer: React.FC = () => (
  <footer className="bg-white text-blue-900 py-12 mt-12 border-t">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
      {/* Info blog */}
      <div className="mb-8 md:mb-0">
        <span className="font-bold text-lg">{siteConfig.name}</span><br />
        <span className="text-sm">Tutti i diritti riservati &copy; {new Date().getFullYear()}</span>
        <p className="mt-2 text-xs text-blue-700">{siteConfig.tagline}</p>
      </div>
      {/* Newsletter */}
      <div className="mb-8 md:mb-0">
        <span className="font-semibold">Newsletter</span>
        <form className="mt-2 flex flex-col gap-2">
          <input type="email" placeholder="La tua email" className="rounded px-3 py-2 text-sm text-blue-900 border border-blue-200 focus:outline-none" disabled />
          <button type="button" className="bg-orange-400 text-blue-900 font-semibold rounded px-3 py-2 text-sm cursor-not-allowed opacity-70" disabled>Iscriviti</button>
          <span className="text-xs text-blue-700">(Funzione in arrivo!)</span>
        </form>
      </div>
      {/* Social */}
      <div className="mb-8 md:mb-0">
        <span className="font-semibold">Seguimi</span>
        <div className="mt-2">
          <SocialIcons />
        </div>
      </div>
      {/* Link utili */}
      <div>
        <span className="font-semibold">Link utili</span>
        <div className="flex flex-col gap-2 mt-2 text-sm">
          <a href={siteConfig.links.home} className="hover:underline">Home</a>
          <a href={siteConfig.links.ricette} className="hover:underline">Ricette</a>
          <a href={siteConfig.links.contatti} className="hover:underline">Contatti</a>
          <a href={siteConfig.links.privacy} className="hover:underline">Privacy Policy</a>
          <a href={siteConfig.links.cookie} className="hover:underline">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
