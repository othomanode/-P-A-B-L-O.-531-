/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Instagram } from 'lucide-react';

interface FloatingSocialsProps {
  lang: 'ar' | 'he';
}

export default function FloatingSocials({ lang }: FloatingSocialsProps) {
  const whatsappNumber = '972535667856'; // Global VIP premium number
  const whatsappText = lang === 'ar' 
    ? 'مرحباً بك في SAMUEL LUXURY، كيف يمكننا تلبية تطلعاتك اليوم؟' 
    : 'שלום רב ותודה שפנית ל-SAMUEL LUXURY, כיצד נוכל לעזור לך היום?';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
  const instagramUrl = 'https://www.instagram.com/samuel.em.luxury';

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3 sm:gap-4" id="floating-connect-buttons">
      {/* WhatsApp Floating Elegant Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 1.2, stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1, y: -4 }}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)] border border-emerald-400/20 cursor-pointer"
        id="whatsapp-floating-action"
        title={lang === 'ar' ? 'تواصل عبر الواتساب' : 'צור קשר ב-WhatsApp'}
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
        
        {/* Luxury Gold Pulsing Outer Glow */}
        <span className="absolute inset-0 rounded-full bg-emerald-400/30 -z-10 animate-ping" />
        
        {/* Hover Label */}
        {lang === 'he' ? (
          <span className="absolute right-16 pr-2 py-1 px-3 bg-black/90 border border-emerald-400/30 text-emerald-400 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-sans">
            יועץ זמין מיידית (WhatsApp)
          </span>
        ) : (
          <span className="absolute right-16 pr-2 py-1 px-3 bg-black/90 border border-emerald-400/30 text-emerald-400 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-sans">
            مستشار متاح فوراً (واتساب)
          </span>
        )}
      </motion.a>

      {/* Instagram Floating Elegant Button */}
      <motion.a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 1.4, stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1, y: -4 }}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-600 via-pink-600 to-purple-600 text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)] border border-amber-400/20 cursor-pointer"
        id="instagram-floating-action"
        title={lang === 'ar' ? 'تابعنا على إنستغرام' : 'עקבו אחרינו באינסטגרם'}
      >
        <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
        
        {/* Pulsing Glow */}
        <span className="absolute inset-0 rounded-full bg-amber-500/20 -z-10 animate-pulse" />
        
        {/* Hover Label */}
        <span className="absolute right-16 pr-2 py-1 px-3 bg-black/90 border border-amber-400/30 text-amber-400 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-sans">
          {lang === 'ar' ? 'المعرض الملكي (إنستغرام)' : 'הגלריה המלכותית (Instagram)'}
        </span>
      </motion.a>
    </div>
  );
}
