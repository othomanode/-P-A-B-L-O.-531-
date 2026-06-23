/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Crown, ArrowLeft, ArrowRight, MessageCircle, Instagram, MapPin } from 'lucide-react';
import { translations } from '../translations';

interface HeroProps {
  onDiscoverProducts: () => void;
  onContactConcierge: () => void;
  lang: 'ar' | 'he';
}

const BACKGROUND_VIDEOS = [
  {
    id: 'spray',
    nameAr: 'رذاذ عطر نيش',
    nameHe: 'רסיסי בושם ניש',
    nameEn: 'Niche spray bottle',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-spray-bottle-43180-large.mp4'
  },
  {
    id: 'essence',
    nameAr: 'إكسير وعطر ملكي',
    nameHe: 'תמצית בושם מלכותית',
    nameEn: 'Royal perfume essence',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-oil-essence-droplet-falling-into-liquid-43103-large.mp4'
  },
  {
    id: 'gold-shimmer',
    nameAr: 'بريق الذهب العطري',
    nameHe: 'זהב מנצנץ יוקרתי',
    nameEn: 'Luxurious gold shimmer',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-gold-particles-42220-large.mp4'
  }
];

export default function Hero({ onDiscoverProducts, onContactConcierge, lang }: HeroProps) {
  const t = translations[lang];
  const [activeVideo, setActiveVideo] = useState(BACKGROUND_VIDEOS[2].url); // Gold Shimmer video default for luxurious black and gold aesthetic
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle classes for luxury scent mist & floating sparkles
    interface ScentParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;
      wiggleSpeed: number;
      wiggleRange: number;
    }

    interface Sparkle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      fadeSpeed: number;
      color: string;
    }

    let mists: ScentParticle[] = [];
    let sparkles: Sparkle[] = [];
    const maxMists = 35;
    const maxSparkles = 60;

    // Track mouse coordinates for interactive swirl effect
    const mouse = { x: -1000, y: -1000, radius: 150 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const goldColors = [
      'rgba(245, 158, 11, ',   // amber
      'rgba(217, 119, 6, ',    // dark gold
      'rgba(252, 211, 77, ',   // light gold
      'rgba(251, 191, 36, ',   // yellow-amber
    ];

    // Initialize sparkles
    for (let i = 0; i < maxSparkles; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
      });
    }

    const createMist = (fromBottom = true) => {
      const maxLifeValue = Math.random() * 300 + 200;
      return {
        x: Math.random() * width,
        y: fromBottom ? height + 20 : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.8 + 0.3),
        radius: Math.random() * 60 + 30,
        alpha: 0,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        life: 0,
        maxLife: maxLifeValue,
        wiggleSpeed: Math.random() * 0.01 + 0.002,
        wiggleRange: Math.random() * 0.8 + 0.2,
      };
    };

    // Initialize mists
    for (let i = 0; i < maxMists; i++) {
      mists.push(createMist(false));
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Create a gentle dark radiant luxury background
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height));
      bgGrad.addColorStop(0, '#0a090e');
      bgGrad.addColorStop(0.5, '#050407');
      bgGrad.addColorStop(1, '#020103');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw and Update Golden Scent Mists (smoky vapor)
      mists.forEach((mist, index) => {
        mist.life++;
        mist.y += mist.vy;
        mist.x += mist.vx + Math.sin(mist.life * mist.wiggleSpeed) * mist.wiggleRange;

        // Apply mouse interaction (mist drifts away from cursor gently)
        if (mouse.x !== -1000) {
          const dx = mist.x - mouse.x;
          const dy = mist.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            mist.vx += (dx / dist) * force * 0.15;
            mist.vy += (dy / dist) * force * 0.05;
          }
        }

        // Fade in and out life cycle
        if (mist.life < mist.maxLife * 0.2) {
          mist.alpha = (mist.life / (mist.maxLife * 0.2)) * 0.15; // low opacity for mist feel
        } else if (mist.life > mist.maxLife * 0.7) {
          mist.alpha = (1 - (mist.life - mist.maxLife * 0.7) / (mist.maxLife * 0.3)) * 0.15;
        } else {
          mist.alpha = 0.15;
        }

        if (mist.alpha < 0) mist.alpha = 0;

        // Draw soft glowing mist plume
        const radialGrad = ctx.createRadialGradient(
          mist.x,
          mist.y,
          0,
          mist.x,
          mist.y,
          mist.radius
        );
        radialGrad.addColorStop(0, mist.color + mist.alpha + ')');
        radialGrad.addColorStop(0.5, mist.color + (mist.alpha * 0.4) + ')');
        radialGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(mist.x, mist.y, mist.radius, 0, Math.PI * 2);
        ctx.fillStyle = radialGrad;
        ctx.fill();

        // Recycle dead mists
        if (mist.life >= mist.maxLife || mist.y < -100 || mist.x < -100 || mist.x > width + 100) {
          mists[index] = createMist(true);
        }
      });

      // 2. Draw and Update Floating Gold Glitters
      sparkles.forEach((sparkle) => {
        sparkle.y += sparkle.speedY;
        sparkle.x += sparkle.speedX;

        // Interactive gravity/wind towards mouse direction
        if (mouse.x !== -1000) {
          const dx = sparkle.x - mouse.x;
          const dy = sparkle.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // particles swirl around mouse
            sparkle.x += (dy / dist) * force * 1.5;
            sparkle.y -= (dx / dist) * force * 1.5;
          }
        }

        // Shimmering amplitude
        sparkle.alpha += (Math.random() - 0.5) * 0.04;
        if (sparkle.alpha > 0.95) sparkle.alpha = 0.95;
        if (sparkle.alpha < 0.15) sparkle.alpha = 0.15;

        // Draw sparkle
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        ctx.fillStyle = sparkle.color + sparkle.alpha + ')';
        ctx.shadowBlur = sparkle.size * 3;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
        ctx.fill();

        // Standardized shadow reset for performance
        ctx.shadowBlur = 0;

        // Recycle sparkles if off-screen
        if (sparkle.y < -10 || sparkle.x < -10 || sparkle.x > width + 10) {
          sparkle.y = height + Math.random() * 20;
          sparkle.x = Math.random() * width;
          sparkle.alpha = Math.random() * 0.7 + 0.2;
        }
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white"
      dir="rtl"
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <video
          key={activeVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-75"
          src={activeVideo}
        />
      </div>

      {/* Background Interactive Gold Particle & Mist Canvas Loop */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{ mixBlendMode: 'screen' }}
        />
        
        {/* Sleek Golden-hued overlay and black vignette gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />
        
        {/* Absolute Subtle golden glow lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[180px] mix-blend-screen pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 pt-32 pb-12 text-center flex flex-col items-center justify-center min-h-[80vh]">
        {/* Beautiful Handcrafted Gold Embossed Royal Logo (مطابق للتصميم المرفق بالكامل) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-64 h-64 md:w-72 md:h-72 mb-8 flex items-center justify-center select-none"
          id="hero-royal-logo"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]">
            <defs>
              <linearGradient id="hero-gold-primary-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b27a22" />
                <stop offset="25%" stopColor="#fdf0aa" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="75%" stopColor="#fdf0aa" />
                <stop offset="100%" stopColor="#8c5a17" />
              </linearGradient>
              <linearGradient id="hero-gold-text-grad-detailed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8c5a17" />
                <stop offset="20%" stopColor="#d97706" />
                <stop offset="40%" stopColor="#fbbf24" />
                <stop offset="60%" stopColor="#fef08a" />
                <stop offset="80%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#8c5a17" />
              </linearGradient>
              <filter id="hero-luxury-shadow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.85" />
              </filter>
            </defs>

            {/* Central circle ornamental lines */}
            <circle cx="200" cy="180" r="74" fill="none" stroke="url(#hero-gold-primary-grad)" strokeWidth="3" filter="url(#hero-luxury-shadow-filter)" />
            <circle cx="200" cy="180" r="66" fill="none" stroke="url(#hero-gold-primary-grad)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" strokeLinecap="round" />
            <circle cx="200" cy="180" r="78" fill="none" stroke="url(#hero-gold-primary-grad)" strokeWidth="1" opacity="0.3" />

            {/* Leafy branches at the bottom-left and bottom-right of the circle */}
            <g filter="url(#hero-luxury-shadow-filter)">
              {/* Left Branch */}
              <path 
                d="M 136,218 Q 112,223 117,242 Q 126,248 146,233" 
                fill="none" 
                stroke="url(#hero-gold-primary-grad)" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
              <path d="M 117,242 C 111,244 105,237 107,232 C 112,227 122,232 117,242 Z" fill="url(#hero-gold-primary-grad)" />
              <path d="M 127,247 C 119,252 115,244 119,240 C 124,235 130,240 127,247 Z" fill="url(#hero-gold-primary-grad)" />
              <path d="M 112,227 C 105,230 102,222 107,218 C 112,214 117,220 112,227 Z" fill="url(#hero-gold-primary-grad)" />

              {/* Right Branch */}
              <path 
                d="M 264,218 Q 288,223 283,242 Q 274,248 254,233" 
                fill="none" 
                stroke="url(#hero-gold-primary-grad)" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
              <path d="M 283,242 C 289,244 295,237 293,232 C 288,227 278,232 283,242 Z" fill="url(#hero-gold-primary-grad)" />
              <path d="M 273,247 C 281,252 285,244 281,240 C 276,235 270,240 273,247 Z" fill="url(#gold-primary-grad)" />
              <path d="M 288,227 C 295,230 298,222 293,218 C 288,214 283,220 288,227 Z" fill="url(#gold-primary-grad)" />
            </g>

            {/* Premium detailed Crown at the top of the circle */}
            <g filter="url(#hero-luxury-shadow-filter)">
              {/* Crown Base */}
              <path 
                d="M 164,103 C 180,108 220,108 236,103" 
                fill="none" 
                stroke="url(#hero-gold-primary-grad)" 
                strokeWidth="5" 
                strokeLinecap="round"
              />
              <path 
                d="M 170,108 C 185,112 215,112 230,108" 
                fill="none" 
                stroke="url(#hero-gold-primary-grad)" 
                strokeWidth="1.5"
              />
              {/* Crown Spikes */}
              <path 
                d="M 165,102 L 174,86 C 180,92 186,92 190,78 L 200,63 L 210,78 C 214,92 220,92 226,86 L 235,102 Z" 
                fill="url(#hero-gold-primary-grad)" 
              />
              {/* Crown Pearls */}
              <circle cx="200" cy="60" r="5" fill="url(#hero-gold-primary-grad)" />
              <circle cx="190" cy="75" r="4" fill="url(#hero-gold-primary-grad)" />
              <circle cx="210" cy="75" r="4" fill="url(#hero-gold-primary-grad)" />
              <circle cx="172" cy="83" r="3" fill="url(#hero-gold-primary-grad)" />
              <circle cx="228" cy="83" r="3" fill="url(#hero-gold-primary-grad)" />
            </g>

            {/* Grand luxury Serif Letter "S" */}
            <text 
              x="200" 
              y="215" 
              fontFamily="Cinzel, 'Playfair Display', Georgia, serif" 
              fontWeight="900" 
              fontSize="108" 
              textAnchor="middle" 
              fill="url(#hero-gold-primary-grad)"
              filter="url(#hero-luxury-shadow-filter)"
            >
              S
            </text>

            {/* "Samuel" serif Display name */}
            <text 
              x="200" 
              y="306" 
              fontFamily="'Playfair Display', 'Cinzel', Georgia, serif" 
              fontWeight="600" 
              fontSize="52" 
              textAnchor="middle" 
              fill="url(#hero-gold-text-grad-detailed)"
              filter="url(#hero-luxury-shadow-filter)"
              letterSpacing="1px"
            >
              Samuel
            </text>

            {/* Ornate Divider lines with Diamond Star */}
            <g filter="url(#hero-luxury-shadow-filter)">
              <line x1="90" y1="334" x2="182" y2="334" stroke="url(#hero-gold-primary-grad)" strokeWidth="1.5" />
              {/* Center Diamond */}
              <path d="M 200,326 L 205,334 L 200,342 L 195,334 Z" fill="url(#hero-gold-primary-grad)" />
              <line x1="218" y1="334" x2="310" y2="334" stroke="url(#hero-gold-primary-grad)" strokeWidth="1.5" />
              {/* Dots at endpoints */}
              <circle cx="90" cy="334" r="1.5" fill="url(#hero-gold-primary-grad)" />
              <circle cx="310" cy="334" r="1.5" fill="url(#hero-gold-primary-grad)" />
            </g>

            {/* Spanned Subheading */}
            <text 
              x="200" 
              y="361" 
              fontFamily="Cinzel, Georgia, serif" 
              fontWeight="700" 
              fontSize="14" 
              textAnchor="middle" 
              fill="url(#hero-gold-text-grad-detailed)"
              letterSpacing="7px"
              filter="url(#hero-luxury-shadow-filter)"
              opacity="0.95"
            >
              SAMUEL&EM LUXURY
            </text>
          </svg>
        </motion.div>

        {/* Call to Actions with luxury feedback */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
          id="hero-actions-container"
        >
          <button
            onClick={onDiscoverProducts}
            className="group px-7 py-3.5 rounded-full text-black font-semibold bg-gradient-to-l from-amber-600 via-amber-400 to-yellow-300 hover:from-amber-500 hover:to-amber-200 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs md:text-sm tracking-wide shadow-lg"
          >
            <span>{t.hero.ctaCatalog}</span>
            {lang === 'he' ? (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-350" />
            ) : (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-350" />
            )}
          </button>
        </motion.div>

        {/* Exclusive Luxury Quick Social Connection Rows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-8"
          id="hero-social-prompts"
        >
          {/* Direct Waze Location Button - HIGHLIGHTED DEMAND */}
          <a
            href="https://waze.com/ul/hsvc4583vs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:text-blue-200 text-xs font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer"
            id="hero-waze-button"
          >
            <MapPin className="w-4.5 h-4.5 text-blue-400 animate-bounce" />
            <span>{t.hero.wazeButton}</span>
          </a>

          <a
            href={`https://wa.me/972535667856?text=${encodeURIComponent(
              lang === 'ar'
                ? 'مرحباً، أود الاستفسار عن مقتنيات SAMUEL LUXURY'
                : lang === 'he'
                ? 'שלום, אשמח לקבל מידע על פריטי SAMUEL LUXURY'
                : 'Hello, I would like to inquire about SAMUEL LUXURY collection'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <MessageCircle className="w-4.5 h-4.5 text-emerald-400 fill-current" />
            <span>{t.hero.whatsappPrompt}</span>
          </a>

          <a
            href="https://www.instagram.com/samuel.em.luxury"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
          >
            <Instagram className="w-4.5 h-4.5 text-amber-400" />
            <span>{t.hero.instagramPrompt}</span>
          </a>
        </motion.div>
      </div>

      {/* Decorative Golden Bottom Divider Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </section>
  );
}
