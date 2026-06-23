/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Instagram, Navigation } from 'lucide-react';
import { translations } from '../translations';

interface ContactSectionProps {
  lang: 'ar' | 'he';
}

export default function ContactSection({ lang }: ContactSectionProps) {
  const t = translations[lang];

  const contactInfos = [
    {
      icon: <Phone className="w-5 h-5 text-amber-500" />,
      label: t.contact.infoItems[0].label,
      value: t.contact.infoItems[0].value,
      subValue: t.contact.infoItems[0].subValue,
    },
    {
      icon: <Mail className="w-5 h-5 text-amber-500" />,
      label: t.contact.infoItems[1].label,
      value: t.contact.infoItems[1].value,
      subValue: t.contact.infoItems[1].subValue,
    },
    {
      icon: <MapPin className="w-5 h-5 text-amber-500" />,
      label: t.contact.infoItems[2].label,
      value: t.contact.infoItems[2].value,
      subValue: t.contact.infoItems[2].subValue,
    },
    {
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      label: t.contact.infoItems[3].label,
      value: t.contact.infoItems[3].value,
      subValue: t.contact.infoItems[3].subValue,
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 bg-transparent text-white"
      dir="rtl"
    >
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-xs font-semibold mb-4"
          >
            {t.contact.badge}
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {t.contact.title}
          </h2>
          
          <div className="h-1 w-20 bg-gradient-to-l from-amber-500 to-amber-300 mx-auto rounded-full" />
          
          {t.contact.subtitle && (
            <p className="text-zinc-400 max-w-2xl mx-auto mt-6 text-sm font-light animate-pulse">
              {t.contact.subtitle}
            </p>
          )}
        </div>

        {/* Contact Content Setup: Centered Elegant Card */}
        <div className="max-w-2xl mx-auto" id="contact-main-grid">
          
          {/* Details & Coordinates */}
          <div className="flex flex-col gap-8 p-8 md:p-10 rounded-3xl bg-zinc-950 border border-zinc-900 shadow-xl">
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono block mb-2">{t.contact.infoTitle}</span>
              <h3 className="text-2xl font-bold text-white mb-6">
                {lang === 'ar' ? 'للتواصل' : 'לפרטים ויצירת קשר'}
              </h3>
              
              <div className="space-y-8">
                {contactInfos.map((info, infoIdx) => (
                  <div key={infoIdx} className="flex gap-4 items-start" id={`contact-info-item-${infoIdx}`}>
                    <div className="p-3.5 rounded-xl border border-amber-500/10 bg-amber-500/5 text-amber-500 shadow-inner">
                      {info.icon}
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-500 font-sans block mb-0.5">{info.label}</span>
                      {infoIdx === 0 ? (
                        <a href="tel:+972535667856" className="text-base font-bold text-zinc-100 hover:text-amber-400 font-sans block transition-colors duration-300">
                          {info.value}
                        </a>
                      ) : infoIdx === 1 ? (
                        <a href="mailto:vip@samuel-luxury.vip" className="text-base font-bold text-zinc-100 hover:text-amber-400 font-sans block transition-colors duration-300">
                          {info.value}
                        </a>
                      ) : infoIdx === 2 ? (
                        <a href="https://waze.com/ul/hsvc4583vs" target="_blank" rel="noopener noreferrer" className="text-base font-bold text-zinc-100 hover:text-amber-400 font-sans block transition-colors duration-300">
                          {info.value}
                        </a>
                      ) : (
                        <span className="text-base font-bold text-zinc-100 font-sans block">{info.value}</span>
                      )}
                      <span className="text-xs text-amber-500/60 font-light block">{info.subValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HIGHLY INTERACTIVE WAZE PATH CARD - DEMAND FULFILLMENT */}
            <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-950/15 relative overflow-hidden flex flex-col gap-4 mt-2 shadow-[0_4px_20px_rgba(59,130,246,0.15)] hover:border-blue-400 transition-all duration-300">
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 animate-bounce">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-blue-400 font-bold tracking-wider font-mono uppercase">{t.contact.wazeSectionTitle}</span>
                  <span className="text-sm font-extrabold text-white">{lang === 'ar' ? 'كبسة تشغيل موقع المعرض مباشرة' : 'כפתור ניווט מהיר אל החנות'}</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal font-light">
                {t.contact.wazeSectionDesc}
              </p>
              
              <a
                href="https://waze.com/ul/hsvc4583vs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 border border-blue-400 text-white transition-all text-xs font-bold cursor-pointer text-center relative z-10 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t.contact.wazeActionBtn}</span>
              </a>
            </div>

            {/* Direct Instant Channels */}
            <div className="pt-4 border-t border-zinc-900 flex flex-col gap-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">{lang === 'ar' ? 'قنوات التواصل الفوري' : 'ערוצי תקשורת מהירה'}</span>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/972535667856?text=${encodeURIComponent(
                    lang === 'ar'
                      ? 'مرحباً، أود الاستفسار عن مقتنيات بوتيك SAMUEL الفاخرة'
                      : 'שלום, אשמח לקבל מידע על פריטי בוטיק SAMUEL'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 hover:text-emerald-300 transition-all text-xs font-semibold cursor-pointer text-center"
                >
                  <span>WhatsApp</span>
                </a>
                <a
                  href="https://www.instagram.com/samuel.em.luxury"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/35 text-amber-400 hover:text-amber-300 transition-all text-xs font-semibold cursor-pointer text-center"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Certification / Privacy stamp */}
            <div className="mt-2 pt-4 border-t border-zinc-900 flex items-center gap-3 text-zinc-400">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-[10px] leading-relaxed font-light">
                {t.contact.privacyStamp}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
