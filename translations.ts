import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, RefreshCw, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

interface PerfumeQuizProps {
  lang: 'ar' | 'he';
  onOrderProduct: (product: Product) => void;
}

export default function PerfumeQuiz({ lang, onOrderProduct }: PerfumeQuizProps) {
  const [step, setStep] = useState<number>(1);
  const [gender, setGender] = useState<string>('');
  const [scent, setScent] = useState<string>('');
  const [vibe, setVibe] = useState<string>('');
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
  
  const { addToCart, cartItems } = useCart();
  const { products } = useProducts();
  const [isAdded, setIsAdded] = useState(false);

  // Restart Quiz
  const handleReset = () => {
    setStep(1);
    setGender('');
    setScent('');
    setVibe('');
    setMatchedProduct(null);
    setIsAdded(false);
  };

  // Process and compute match
  const handleCalculateMatch = (vibeVal: string) => {
    setVibe(vibeVal);
    
    // Find matching logic on products list
    let candidates = products;
    
    // First, filter by gender if selected
    if (gender === 'men') {
      candidates = candidates.filter(p => p.gender === 'men' || p.gender === 'unisex');
    } else if (gender === 'women') {
      candidates = candidates.filter(p => p.gender === 'women' || p.gender === 'unisex');
    }

    // Filter by scent keyword matching
    if (scent === 'oud') {
      // Find elements containing 'عود' or 'بخور'
      const matches = candidates.filter(p => p.scentType?.includes('عود') || p.scentType?.includes('بخوري') || p.id.includes('oud') || p.id.includes('buhadana'));
      if (matches.length > 0) candidates = matches;
    } else if (scent === 'floral') {
      const matches = candidates.filter(p => p.scentType?.includes('أزهار') || p.scentType?.includes('زهور') || p.id.includes('femme') || p.id.includes('bell'));
      if (matches.length > 0) candidates = matches;
    } else if (scent === 'wood') {
      const matches = candidates.filter(p => p.scentType?.includes('خشبي') || p.scentType?.includes('جلود') || p.id.includes('cedar') || p.id.includes('leather'));
      if (matches.length > 0) candidates = matches;
    } else if (scent === 'fresh') {
      const matches = candidates.filter(p => p.scentType?.includes('منعش') || p.scentType?.includes('حمضيات') || p.id.includes('bell'));
      if (matches.length > 0) candidates = matches;
    }

    // Find best candidate
    const finalMatch = candidates[Math.floor(Math.random() * candidates.length)] || products[0];
    
    setMatchedProduct(finalMatch);
    setStep(4);
  };

  const text = {
    ar: {
      badge: 'مستشار العطور الذكي • PERSONAL SCENT WORKSHOP',
      title: 'اكتشف عبيراً يمثّل شخصيتك',
      desc: 'أجب عن 3 أسئلة سريعة لنطابق أسلوب حضورك مع التحفة العطرية التي تعبّر عن هيبتك وذوقك النخبوي.',
      restart: 'إعادة الاختبار',
      next: 'التالي',
      q1: '1. من هو العميل المستهدف لهذا العبير؟',
      q1_desc: 'حدد الهوية العطرية لتوجيه نغمات القارورة بدقة.',
      g_men: 'رجالي - عطور الهيبة والقيادة والعمق الخشبي',
      g_women: 'نسائي - نسمات الأرستقراطية والرقة والأزهار الناعمة',
      g_unisex: 'يونيسكس - توليفات التفرد للجنسين ومجالس النخبة',
      
      q2: '2. ما هي العائلة العطرية المفضلة لديك؟',
      q2_desc: 'اختر المكون الرئيسي الذي تفضل أن يدور حوله إكسيرك.',
      s_oud: 'العود وبخور الشرق الفاخر المعتق',
      s_floral: 'الأزهار الفرنسية والورد التركي والياسمين البري',
      s_wood: 'الأخشاب العتيقة والأرز والجلود والتوت والتبغ',
      s_fresh: 'الحمضيات المنعشة الصيفية واللافندر الباردة',

      q3: '3. ما هو الجو والغرض الأساسي من استخدام العطر؟',
      q3_desc: 'نطابق ثبات الفوحان وتركيز الإكسير مع وتيرة يومك ومناسبتك.',
      v_royal: 'المناسبات واللقاءات الرسمية والاجتماعات القيادية العظمى',
      v_daily: 'الاستخدام اليومي الراقي لإرساء هول غامض ومميز',
      v_romantic: 'الأمسيات الخاصة والتحرر والحضور الرومانسي الدافئ',

      match_title: 'التحفة العطرية المثالية الموصى بها لك',
      match_desc: 'بناءً على تفضيلاتك الفاخرة، صمم خبراؤنا هذا التوافق الاستثنائي ليرافق طابع حضورك الهيبوي:',
      add_cart: 'إضافة للسلة',
      ordered: 'تم الإضافة للسلة',
      order_now: 'طلب حيازة فوري عبر الـ WhatsApp',
      specs_title: 'لماذا هذا العطر مثالي لك؟',
      rating_label: 'تقييم النخبة',
      price_val: 'قيمة الحيازة المالية',
    },
    he: {
      badge: 'מאתר הבישום הדיגיטלי • PERSONAL SCENT WORKSHOP',
      title: 'גלו את ניחוח החתימה שלכם',
      desc: 'ענו על 3 שאלות קצרות ונתאים את סגנון הנוכחות שלכם ליצירת המופת המדויקת המביעה את סמכותכם וטעמכם האקסקלוסיבי.',
      restart: 'אפס והתחל מחדש',
      next: 'המשך',
      q1: '1. עבור מי מיועד הניחוח?',
      q1_desc: 'קבעו את אופי מגדר הבישום לקבלת דיוק מרבי בתרכובת.',
      g_men: 'גברים - ניחוחות של סמכות, מנהיגות ועומק עצי',
      g_women: 'נשים - ניחוחות אריסטוקרטיים, עדינות וורדים רכים',
      g_unisex: 'יוניסקס - שילובים אקסקלוסיביים המיועדים לשני המינים',

      q2: '2. מהי משפחת הריח המועדפת עליכם?',
      q2_desc: 'בחרו את המרכיב המרכזי שסביבו ייבנה האליקסיר המלכותי.',
      s_oud: 'עוד קלאסי, קטורת מזרחית אצילית ומיושנת',
      s_floral: 'פרחים צרפתיים, ורדים טורקיים ויסמין פראי משכר',
      s_wood: 'עצים עתיקים, ארז, עורות מיושנים, טבק ותבלינים קשוחים',
      s_fresh: 'הדרים מרעננים, לבנדר קריר וניחוח נקי של בוקר',

      q3: '3. מהו האירוע והייעוד העיקרי לבושם?',
      q3_desc: 'נתאים את ריכוז הבושם ועמידות הריח לקצב החיים שלכם.',
      v_royal: 'אירועים רשמיים, פגישות עסקים וקבלת פנים מלכותית',
      v_daily: 'לבוש יומיומי מתוחכם ויוקרתי המשאיר שובל מהפנט',
      v_romantic: 'ערבים רומנטיים דיסקרטיים חמים וחושניים במיוחד',

      match_title: 'יצירת המופת הריחנית המושלמת עבורכם',
      match_desc: 'בהתאם להעדפות היוקרתיות שלכם, מומחי הנישה שלנו קבעו את ההתאמה המושלמת לכם:',
      add_cart: 'הוסף לסל הקניות',
      ordered: 'נוסף לסל בהצלחה',
      order_now: 'הזמן עכשיו ישירות ב-WhatsApp',
      specs_title: 'מדוע בחירה זו מושלמת עבורכם?',
      rating_label: 'דירוג VIP',
      price_val: 'הערכת שווי הפריט',
    },
    en: {
      badge: 'Scent Diagnostic Wizard • PERSONAL SCENT WORKSHOP',
      title: 'Discover Your Signature Aura',
      desc: 'Answer 3 brief questions to instantly match your personality and presence with the perfect luxury fragrance that expresses your prestige.',
      restart: 'Reset Scent Quiz',
      next: 'Next Question',
      q1: '1. Who is the recipient/user of this fragrance?',
      q1_desc: 'Determine the target gender identity to direct the fragrance notes precisely.',
      g_men: 'Male - Notes of prestige, leadership and deep timber woods',
      g_women: 'Female - Aristocratic accents, gentleness and soft floral bouquets',
      g_unisex: 'Unisex - Distinctive signature blends matching both genders and elite crowds',

      q2: '2. What is your preferred olfactory scent family?',
      q2_desc: 'Select the key major note around which your royal elixir should revolve.',
      s_oud: 'Oud oil and ancient oriental premium incense notes',
      s_floral: 'French florals, absolute Turkish rose and absolute wild jasmine',
      s_wood: 'Aged cedarwood, vintage leather, wild forest berries and amber-tobacco',
      s_fresh: 'Refreshing summer citrus, cool lavender and clean water breeze',

      q3: '3. What is the main occasion and purpose of using the perfume?',
      q3_desc: 'We match sillage longevity and absolute concentration of perfume with your lifestyle.',
      v_royal: 'Grand scale VIP meetings, prestigious banquets and sovereign galas',
      v_daily: 'Daily refined usage to establish a state of mysterious royal presence',
      v_romantic: 'Private romantic evenings, warm, sensual and deeply cozy encounters',

      match_title: 'Sovereign Scent Recommendation Picked For You',
      match_desc: 'Based on your prestigious preferences, our boutique scent masters recommend this exceptional fragrance to crown your presence:',
      add_cart: 'Add to Collection',
      ordered: 'Successfully Added to Cart',
      order_now: 'Order Immediately via WhatsApp',
      specs_title: 'Why is this fragrance absolute perfection for you?',
      rating_label: 'Elite Guest Rating',
      price_val: 'Acquisition Value Token',
    }
  };

  const t = lang === 'he' ? text.he : text.ar;
  const isRtl = true;

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section 
      id="perfume-quiz" 
      className="relative py-20 px-6 max-w-5xl mx-auto my-12 rounded-3xl bg-gradient-to-br from-zinc-950/80 via-black to-zinc-900 border border-amber-500/30 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
      dir="rtl"
    >
      {/* Background Decorative golden glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center relative z-10 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>{t.badge}</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
          {t.title}
        </h2>
        <p className="text-zinc-400 text-xs md:text-sm max-w-xl mx-auto font-light leading-relaxed">
          {t.desc}
        </p>
      </div>

      {/* Quiz Wizard Content Area */}
      <div className="relative z-10 min-h-[300px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: GENDER */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: lang === 'he' ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: lang === 'he' ? 50 : -50 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-2 text-center">
                {t.q1}
              </h3>
              <p className="text-zinc-500 text-xs md:text-sm mb-8 text-center">
                {t.q1_desc}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                {[
                  { value: 'men', label: t.g_men, icon: '🤵‍♂️' },
                  { value: 'women', label: t.g_women, icon: '💃' },
                  { value: 'unisex', label: t.g_unisex, icon: '👑' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setGender(opt.value);
                      setStep(2);
                    }}
                    className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-950 transition-all duration-300 text-center flex flex-col items-center gap-4 group cursor-pointer shadow-md"
                  >
                    <span className="text-3xl filter drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform">{opt.icon}</span>
                    <span className="text-xs md:text-sm font-semibold text-zinc-300 group-hover:text-amber-300 transition-colors">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: SCENT PROFILE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: lang === 'he' ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: lang === 'he' ? 50 : -50 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-2 text-center">
                {t.q2}
              </h3>
              <p className="text-zinc-500 text-xs md:text-sm mb-8 text-center">
                {t.q2_desc}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {[
                  { value: 'oud', label: t.s_oud, icon: '🪵' },
                  { value: 'floral', label: t.s_floral, icon: '🌹' },
                  { value: 'wood', label: t.s_wood, icon: '🌲' },
                  { value: 'fresh', label: t.s_fresh, icon: '🍋' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setScent(opt.value);
                      setStep(3);
                    }}
                    className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-950 transition-all duration-300 flex items-center gap-4 group cursor-pointer shadow-md text-right"
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-xs md:text-sm font-semibold text-zinc-300 group-hover:text-amber-300 transition-colors">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setStep(1)} 
                className="mt-8 text-zinc-500 hover:text-amber-400 text-xs transition-colors cursor-pointer"
              >
                {lang === 'ar' ? '← العودة للسؤال السابق' : lang === 'he' ? '← חזור לשאלה הקודמת' : '← Back to previous question'}
              </button>
            </motion.div>
          )}

          {/* STEP 3: OCCASION / VIBE */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: lang === 'he' ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: lang === 'he' ? 50 : -50 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-2 text-center">
                {t.q3}
              </h3>
              <p className="text-zinc-500 text-xs md:text-sm mb-8 text-center">
                {t.q3_desc}
              </p>
              
              <div className="grid grid-cols-1 gap-3 w-full max-w-xl">
                {[
                  { value: 'royal', label: t.v_royal, icon: '🏛️' },
                  { value: 'daily', label: t.v_daily, icon: '✨' },
                  { value: 'romantic', label: t.v_romantic, icon: '🕯️' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleCalculateMatch(opt.value)}
                    className="p-4 px-6 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300 flex items-center justify-between group cursor-pointer shadow text-right"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-xs md:text-sm font-semibold text-zinc-300 group-hover:text-amber-300 transition-colors">
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-amber-500 text-xs transition-all opacity-0 group-hover:opacity-100 group-hover:-translate-x-1">
                      {lang === 'ar' ? 'تحليل وطرح النغمات ←' : 'נתח ניחוח ←'}
                    </span>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setStep(2)} 
                className="mt-8 text-zinc-500 hover:text-amber-400 text-xs transition-colors cursor-pointer"
              >
                {lang === 'ar' ? '← العودة للسؤال السابق' : lang === 'he' ? '← חזור לשאלה הקודמת' : '← Back to previous question'}
              </button>
            </motion.div>
          )}

          {/* STEP 4: RESULT MATCHED COMPONENT */}
          {step === 4 && matchedProduct && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex flex-col items-center"
            >
              <div className="text-center max-w-2xl mb-8">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-1.5 animate-pulse mb-3">
                  <Crown className="w-4 h-4 text-emerald-400" />
                  <span>{t.match_title}</span>
                </span>
                <p className="text-zinc-300 text-xs md:text-sm leading-relaxed">
                  {t.match_desc}
                </p>
              </div>

              {/* Recommendation Card */}
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch p-6 rounded-2xl bg-black/60 border border-amber-500/40 relative shadow-2xl">
                {/* Image side */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] md:aspect-auto bg-zinc-900 border border-zinc-800/80">
                  <img 
                    src={matchedProduct.imageUrl} 
                    alt={matchedProduct.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] font-extrabold bg-black/80 border border-amber-500/20 text-amber-400 uppercase tracking-widest font-mono">
                    {matchedProduct.scentType || 'الملكي'}
                  </div>
                </div>

                {/* Info side */}
                <div className="flex flex-col justify-between py-2 text-right">
                  <div>
                    {/* Header values */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-mono text-zinc-300 font-bold text-sm">{matchedProduct.rating}</span>
                        <span className="text-[10px] text-zinc-500">({t.rating_label})</span>
                      </div>
                      {matchedProduct.originalPrice && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">
                          {lang === 'ar' ? 'خصم ملوكي' : 'הנחת VIP'}
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg md:text-2xl font-black text-white mb-3">
                      {matchedProduct.name}
                    </h4>

                    <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6 font-light">
                      {matchedProduct.details}
                    </p>

                    {/* Features checklist */}
                    <div className="mb-6 space-y-2">
                      <span className="text-[10px] font-bold text-amber-500/70 tracking-wider block mb-2 uppercase font-mono">
                        {t.specs_title}
                      </span>
                      {matchedProduct.specs.slice(0, 3).map((spec, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                          <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions purchase row */}
                  <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 mb-0.5">{t.price_val}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black font-mono text-amber-400">{matchedProduct.price}</span>
                        {matchedProduct.originalPrice && (
                          <span className="text-xs text-zinc-600 line-through font-mono">{matchedProduct.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(matchedProduct)}
                        className={`flex-1 sm:flex-none py-3 px-6 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isAdded 
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                            : 'bg-zinc-900 border border-amber-500/30 hover:bg-amber-500/10 text-amber-300'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>{t.ordered}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>{t.add_cart}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onOrderProduct(matchedProduct)}
                        className="flex-1 sm:flex-none py-3 px-6 rounded-full bg-gradient-to-l from-amber-600 via-amber-400 to-yellow-300 hover:from-amber-500 hover:to-amber-200 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
                      >
                        {t.order_now}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset Control */}
              <button
                onClick={handleReset}
                className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-800 hover:border-amber-500/40 bg-zinc-950/40 hover:bg-zinc-950 text-zinc-400 hover:text-amber-400 text-xs transition-all duration-300 cursor-pointer shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.restart}</span>
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}
