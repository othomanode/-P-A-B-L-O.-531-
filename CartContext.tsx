/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Send, CheckCircle } from 'lucide-react';
import { translations } from '../translations';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  lang: 'ar' | 'he';
}

export default function Footer({ onNavigate, lang }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = translations[lang];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const navLinks = [
    { id: 'hero', label: t.nav.hero },
    { id: 'products', label: t.nav.products },
    { id: 'about-policies', label: lang === 'ar' ? 'من نحن والشحن والتوصيل' : 'מי אנחנו ומדיניות שילוח' },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <footer className="relative bg-[#050505] text-zinc-400 border-t border-amber-500/10" dir="rtl">
      {/* Decorative Golden Line Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Upper Column Stack */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-start" id="footer-upper">
          
          {/* Brand/Logo column */}
          <div className="md:col-span-4 flex flex-col gap-6" id="footer-col-brand">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-amber-500/40 bg-black/60 flex items-center justify-center text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <Crown className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-wider bg-gradient-to-l from-amber-400 via-yellow-200 to-amber-600 bg-clip-text text-transparent">
                  SAMUEL LUXURY
                </span>
                <span className="text-[8px] text-amber-500/60 font-mono tracking-widest uppercase">
                  SAMUEL LUXURY INC.
                </span>
              </div>
            </div>
            
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed font-light">
              {t.footer.desc}
            </p>
          </div>

          {/* Quick Links column */}
          <div className="md:col-span-3 flex flex-col gap-4" id="footer-col-links">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{t.footer.linksTitle}</span>
            <ul className="space-y-2 text-xs md:text-sm">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="hover:text-amber-400 text-zinc-500 transition-colors duration-300 text-right cursor-pointer"
                  >
                    • {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Protection charter column */}
          <div className="md:col-span-2 flex flex-col gap-4" id="footer-col-legal">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{t.footer.legalTitle}</span>
            <ul className="space-y-2 text-xs text-zinc-500">
              {t.footer.legalItems.map((item, idx) => (
                <li key={idx}>
                  <a href="#contact" className="hover:text-amber-400 transition-colors">• {item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Private Newsletter column */}
          <div className="md:col-span-3 flex flex-col gap-4" id="footer-col-news">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{t.footer.newsletterTitle}</span>
            <p className="text-zinc-500 text-xs leading-relaxed font-light">
              {t.footer.newsletterDesc}
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-400 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>{t.footer.newsletterSuccess}</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative mt-2 flex" id="newsletter-form">
                <input
                  type="email"
                  placeholder={t.footer.newsletterPlaceholder}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-r-xl border border-zinc-900 border-l-0 bg-black text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-right font-mono"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-gradient-to-l from-amber-600 to-amber-500 text-black rounded-l-xl hover:from-amber-500 hover:to-amber-300 transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5 transform rotate-180" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Lower Row / Copyright details */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6" id="footer-lower">
          <p className="text-xs text-zinc-600 font-sans text-center md:text-right">
            {t.footer.copyright}
          </p>
          
          <div className="flex gap-6 text-xs text-zinc-600">
            <span className="font-mono">{t.footer.locations}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
