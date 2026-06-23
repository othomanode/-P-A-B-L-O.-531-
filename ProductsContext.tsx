/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Crown, Languages, ShoppingBag, Lock, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  lang: 'ar' | 'he';
  setLang: (lang: 'ar' | 'he') => void;
  onOpenOwner: () => void;
  isOwnerAuthenticated: boolean;
}

export default function Header({ 
  currentSection, 
  onNavigate, 
  lang, 
  setLang,
  onOpenOwner,
  isOwnerAuthenticated
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();
  const t = translations[lang];

  const totalItemsCount = cartItems.reduce((acc, current) => acc + current.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: t.nav.hero },
    { id: 'products', label: t.nav.products },
    { id: 'about-policies', label: lang === 'ar' ? 'من نحن والشحن' : lang === 'he' ? 'מי אנחנו ומשלוח' : 'About & Shipping' },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 border-b border-amber-500/20 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-gradient-to-b from-black/80 to-transparent py-6'
      }`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo Monogram */}
        <div 
          onClick={() => handleLinkClick('hero')} 
          className="flex items-center gap-3 cursor-pointer group"
          id="nav-logo-container"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-amber-500/40 bg-black/60 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-500">
            <Crown className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold tracking-wider bg-gradient-to-l from-amber-400 via-yellow-200 to-amber-600 bg-clip-text text-transparent font-sans">
              SAMUEL LUXURY
            </span>
            <span className="text-[9px] text-amber-500/60 uppercase tracking-[0.2em] font-mono leading-none">
              SAMUEL LUXURY
            </span>
          </div>
        </div>

        {/* Desktop Navigation Link Menu */}
        <nav className="hidden lg:flex items-center gap-6" id="desktop-navbar">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`relative py-2 text-sm font-medium transition-colors duration-300 cursor-pointer ${
                  isActive ? 'text-amber-400' : 'text-zinc-400 hover:text-white'
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-l from-amber-500 to-amber-300"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Translation Switcher & CTA */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full border border-amber-500/20 bg-black/60 hover:bg-amber-500/10 text-amber-400 hover:text-white transition-all duration-300 cursor-pointer shadow-md"
            title={lang === 'ar' ? 'سلة المقتنيات' : lang === 'he' ? 'סל הפריטים' : 'Shopping Cart'}
            id="header-cart-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 border border-black text-[9px] font-extrabold text-black flex items-center justify-center px-1 font-mono shadow-lg animate-pulse">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Executive Owner Button */}
          <button
            onClick={onOpenOwner}
            className="relative p-2.5 rounded-full border border-amber-500/20 bg-black/60 hover:bg-amber-500/10 text-amber-400 hover:text-white transition-all duration-300 cursor-pointer shadow-md group flex items-center justify-center"
            title={lang === 'ar' ? 'منصة المالك التنفيذية' : 'ממשק ניהול בעלי האתר'}
            id="header-owner-btn"
          >
            {isOwnerAuthenticated ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <Lock className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Elegant Language Pill Selector Button */}
          <div className="flex items-center gap-1 bg-black/60 border border-amber-500/20 p-1 rounded-full shadow-md" id="lang-switcher-group">
            {(['ar', 'he'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all duration-300 uppercase cursor-pointer ${
                  lang === l
                    ? 'bg-gradient-to-r from-amber-500 to-amber-300 text-black shadow font-extrabold'
                    : 'text-zinc-400 hover:text-amber-200 hover:bg-amber-500/10'
                }`}
                id={`lang-btn-${l}`}
              >
                {l === 'ar' ? 'عربي' : 'עברי'}
              </button>
            ))}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="lg:hidden p-2 text-amber-500/80 hover:text-amber-400 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            id="mobile-menu-toggler"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-zinc-950/98 border-b border-amber-500/20 backdrop-blur-lg overflow-hidden"
            id="mobile-nav-panel"
          >
            <div className="px-6 py-8 flex flex-col gap-6 text-right" dir="rtl">
              {navItems.map((item) => {
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className={`text-lg font-medium py-2 px-4 rounded-lg transition-all text-right ${
                      isActive
                        ? 'text-black bg-gradient-to-r from-amber-500 to-amber-300 font-bold'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              
              <div className="flex gap-2 w-full mt-2" id="mobile-lang-pills">
                {(['ar', 'he'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-2 text-center rounded-lg font-bold text-xs border ${
                      lang === l
                        ? 'bg-gradient-to-r from-amber-500 to-amber-300 text-black border-transparent'
                        : 'bg-zinc-900 border-amber-500/20 text-amber-400 hover:bg-zinc-800'
                    }`}
                  >
                    {l === 'ar' ? 'العربية' : 'עברית'}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
