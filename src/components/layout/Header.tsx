'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { siteConfig } from "@/config/site";
import Image from "next/image";
const SearchOverlay = dynamic(() => import('../feature/SearchOverlay'), { ssr: false });

const navLinks = [
  { label: "Home", href: siteConfig.links.home },
  { label: "Ricette", href: siteConfig.links.ricette },
  { label: "Tecniche", href: siteConfig.links.tecniche },
  { label: "Diario da commis", href: siteConfig.links.diario },
  { label: "Chi sono", href: siteConfig.links.chiSono },
  { label: "Contatti", href: siteConfig.links.contatti },
];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="py-6 border-b relative bg-white z-30">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo e navigazione desktop */}
          <div className="flex items-center space-x-8">
            <Image src="/logo2.svg" alt="Logo" width={50} height={50} />
            
            <Link href={siteConfig.links.home} className="text-blue-900 font-serif text-2xl font-bold">
              {siteConfig.name}
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-gray-800 hover:text-blue-900">
                  {link.label}
                </a>
              ))}
            </div>
            
            {/* Search button - solo su desktop */}
            <button
              onClick={() => setSearchOpen(true)}
              className="ml-4 hidden md:flex items-center gap-1 text-blue-900 hover:text-blue-600 transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-blue-900 menu-button z-50 relative"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen && isClient ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* SearchOverlay component */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Elementi renderizzati solo lato client */}
      {isClient && (
        <>
          {/* Overlay trasparente */}
          {menuOpen && (
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
          )}
          {/* Mobile slide-out menu */}
          <div
            className={`fixed top-0 right-0 h-full bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-50 mobile-menu ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-6">
                <span className="font-serif text-2xl font-bold text-blue-900 text-center">{siteConfig.name}</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-500 justify-center hover:text-blue-900"
                  aria-label="Close menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-2 px-6 py-4">
                {/* Search in cima al menu mobile */}
                <button
                  className="flex items-center gap-2 text-blue-900 hover:text-blue-600 font-semibold py-2 border-b border-blue-50 mb-2"
                  onClick={() => { 
                    setMenuOpen(false); 
                    setTimeout(() => setSearchOpen(true), 300); 
                  }}
                  type="button"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
                {/* Altre voci di menu mobile */}
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-2 text-blue-900 hover:text-blue-600 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
