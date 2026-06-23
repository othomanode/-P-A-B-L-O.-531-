import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Compass, Truck, RotateCcw, ShieldCheck, Heart, Sparkles, Star } from 'lucide-react';

interface AboutAndPolicyProps {
  lang: 'ar' | 'he';
}

export default function AboutAndPolicy({ lang }: AboutAndPolicyProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'policy'>('about');

  const content = {
    ar: {
      aboutTab: 'قِصّتنا وريادتنا • من نحن',
      policyTab: 'قوانين واشتراطات • الشحن والاسترجاع',
      
      aboutTitle: 'SAMUEL LUXURY',
      aboutSubtitle: 'تتويج الأناقة في قارورة عطرية خالدة تليق بحضور الملوك والنخبة.',
      aboutText1: 'تأسست علامتنا النخبوية لتلبية تطلعات مجالس الرفاهية والوجاهة حول العالم. نحن لا نبيع مجرد زجاجات عطرية، بل نكثف الشغف، التقاليد، والجرأة في نفحات فواحة تسلب القلوب وترسم حضوراً لا ينسى فور المرور.',
      aboutText2: 'نتعاون مع أعرق بيوت العطور الفرنسية والشرقية العتيقة لننسج لك مزيجاً استثنائياً يجمع دهن العود المعتق، الورد الطائفي النقي المقطف عند الفجر، والمسك الإيطالي الفاخر. كل قطرة تخضع لفحوصات نقاء صارمة لضمان بقائها وثباتها الفائق على القماش لأيام متواصلة.',
      
      value1_title: 'النقاوة والحرفية',
      value1_desc: 'عطور экстра نقيّة بمكوّنات طبيعية خالية تماماً من المذيبات الصناعية الرخيصة.',
      value2_title: 'أصالة معتمدة',
      value2_desc: 'نضمن لك أصالة العطور 100% مع هولوغرام ورقم كود تفويض خاص بكل زجاجة.',
      value3_title: 'مقتنيات حصرية',
      value3_desc: 'إصدارات سنوية محدودة مرقمة بشكل فردي مخصصة لأبناء الصفوة والباحثين عن الندرة.',

      policyTitle: 'الاسترجاع المرن',
      policySubtitle: '',
      
      shipTitle: 'سياسة الشحن الملكي السريع:',
      shipText1: '• نوفر شحناً سريعاً لكافة المناطق .',
      shipText2: '• يتم نقل العبوات مجهزة بحقائب عازلة وتحت درجة حرارة معتدلة للمحافظة على جزيئات وإكسير العطور.',
      shipText3: '• يستغرق التوصيل عادة من 24 إلى 48 ساعة فقط، ويتم تسليم الطرد هاتفياً عبر مناديب.',

      returnTitle: 'سياسة الاسترجاع والاستبدال المرن:',
      returnText1: '• سلامة وصحة عملائنا هي أولويتنا العظمى؛ لذلك نقبل استرجاع العطور خلال 14 يوماً من تاريخ الحيازة بشرط بقاء السلوفان والغلاف الخارجي سليماً وغير مفتوح.',
      returnText2: '',
      returnText3: '• في حال الاسترجاع، نقوم بإعادة كامل القيمة المالية هاتفياً أو بتحويل بنكي فوري دون أي خصومات إضافية احتراماً لثقتكم.'
    },
    he: {
      aboutTab: 'המורשת שלנו • מי אנחנו',
      policyTab: 'שילוח והחזרות • מדיניות הבוטיק',
      
      aboutTitle: 'SAMUEL LUXURY',
      aboutSubtitle: 'התגלמות הסטייל באליקסיר ריחני על זמני התואם את אצולת הממון.',
      aboutText1: 'המותג שלנו נוסד על מנת לענות על הצרכים המחמירים ביותר של אנשי מפתח ודמויות מובילות. אנו מאמינים כי בושם אינו רק מוצר אלא הצהרת נוכחות אצילית המשפיעה על המרחב ומנציחה את אישיותכם.',
      aboutText2: 'אנו משתפים פעולה עם בתי הזיקוק העתיקים ביותר בצרפת ובמזרח, על מנת לרקוח ניחוחות הכוללים עוד מיושן, וורד טאיף הררי שנאסף ידנית עם זריחה, ומאסק לבן נקי. כל טיפה בריכוז המרבי נבדקת בקפידה על מנת להבטיח עמידות של ימים רצופים על הבגד.',
      
      value1_title: 'חומרי פרימיום טהורים',
      value1_desc: 'בשמי Extrait de Parfum טהורים לחלוטין ללא חומרים תעשייתיים זולים.',
      value2_title: '100% מקוריות מאושרת',
      value2_desc: 'אחריות מלאה למקוריות הבושם עם קוד אימות והולוגרמת כסף ייחודית לכל בקבוק.',
      value3_title: 'קולקציות מוגבלות',
      value3_desc: 'ייצור שנתי מוגבל וממוספר בנפרד המיועד לאספנים ולחובבי בידול מוחלט.',

      policyTitle: 'מדיניות החזרות גמישה',
      policySubtitle: 'מערך לוגיסטי ייעודי להגנה מושלמת על בקבוקי הקריסטל היקרים.',
      
      shipTitle: 'מדיניות שילוח מהיר מלכותי:',
      shipText1: '• אנו מספקים משלוחי אקספרס מהירים וללא עלות לכל רחבי הארץ.',
      shipText2: '• הבקבוקים נארזים בצידניות מבודדות תרמית על מנת לשמור על יציבות המולקולות והריח ברמת מושלמות.',
      shipText3: '• השילוח אורך בדרך כלל בין 24 ל-48 שעות ישירות למיקום הלקוח בדיסקרטיות ובכבוד המרבי.',

      returnTitle: 'מדיניות החזרות והחלפות גמישה:',
      returnText1: '• אנו מאפשרים החזרה או החלפה של הבושם תוך 14 יום ממועד הרכישה, בתנאי שהמוצר באריזתו המקורית ולא נפתח כלל.',
      returnText2: '• לכל בושם מצורפת דוגמית קטנה לנסיון חינם, המאפשרת לכם להתיז ולחוות את הניחוח מבלי לפתוח את הבקבוק המרכזי.',
      returnText3: '• במקרה של ביטול עסקה, אנו מעבירים זיכוי כספי מלא ומהיר לחשבון הלקוח ללא עמלות מיותרות מתוך הערכה לאמונכם.'
    },
    en: {
      aboutTab: 'Our Heritage • About Us',
      policyTab: 'Shipping & Returns • Boutique Policies',
      
      aboutTitle: 'SAMUEL LUXURY',
      aboutSubtitle: 'Crowning elegance in a timeless fragrance bottle fitting for royals and elite guests.',
      aboutText1: 'Our legendary brand was established to meet the aspirations of luxury and high-prestige communities worldwide. We do not merely offer fragrance decanters, but rather capture passion, traditions, and pride in enchanting breeze notes that charm everyone.',
      aboutText2: 'We collaborate with the most ancient French and traditional oriental perfumeries to curate an exceptional blend of aged Oud oil, pure Taif rose harvested with dawn dew, and Italian premium musk. Every drop undergoes rigorous testing to guarantee extreme longevity of several days on garments.',
      
      value1_title: 'Pure Craftsmanship',
      value1_desc: 'Highly concentrated pure extrait perfumes with natural ingredients completely free from cheap industrial solvents.',
      value2_title: 'Certified Authenticity',
      value2_desc: 'We guarantee 100% authentic fragrances, each containing a silver hologram and unique verification code.',
      value3_title: 'Limited Collections',
      value3_desc: 'Yearly limited editions, individually numbered, dedicated to collectors who appreciate complete distinctiveness.',

      policyTitle: 'Flexible Returns & Logistics',
      policySubtitle: 'A dedicated logistics system to secure and protect valuable luxury pieces.',
      
      shipTitle: 'Sovereign Express Shipping Policy:',
      shipText1: '• We provide fast, complimentary secure express shipping to all destinations.',
      shipText2: '• Fragrances and items are dispatched in insulated thermal bags to safeguard active ingredients.',
      shipText3: '• Shipping usually takes 24 to 48 hours directly to the client\'s physical coordinates with utmost dignity.',

      returnTitle: 'Flexible Return & Exchange Guidelines:',
      returnText1: '• The safety of our elite clients is our utmost priority; we accept product returns within 14 days of acquisition provided the cellophane and outer box remain completely sealed and unopened.',
      returnText2: '• A complimentary mini tester is attached to every premium purchase so you can experience the aroma without opening the main secure bottle.',
      returnText3: '• Upon return approval, we process a direct and full monetary refund to the client\'s designated account without arbitrary fees out of respect for your trust.'
    }
  };

  const t = lang === 'he' ? content.he : content.ar;

  return (
    <section 
      id="about-policies" 
      className="relative py-20 bg-gradient-to-b from-black via-zinc-950/90 to-black text-white overflow-hidden"
      dir="rtl"
    >
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Switch Tabs Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 md:mb-16" id="about-tabs-row">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === 'about'
                ? 'text-black bg-gradient-to-l from-amber-500 via-yellow-300 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-950'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t.aboutTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === 'policy'
                ? 'text-black bg-gradient-to-l from-amber-500 via-yellow-300 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-950'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t.policyTab}</span>
          </button>
        </div>

        {/* Dynamic Display Area with AnimatePresence */}
        <AnimatePresence mode="wait">
          {activeTab === 'about' ? (
            <motion.div
              key="about-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
              id="about-us-container"
            >
              {/* Core Heritage Heading */}
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-[10px] font-bold tracking-[0.25em] font-mono text-amber-500 uppercase block mb-3">🎖️ OUR BRAND HERITAGE</span>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">
                  {t.aboutTitle}
                </h3>
                <p className="text-amber-400 font-sans text-xs md:text-sm tracking-wide">
                  {t.aboutSubtitle}
                </p>
                <div className="h-0.5 w-16 bg-amber-500/40 mx-auto mt-6" />
              </div>

              {/* Texts setup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-300 text-xs md:text-sm leading-relaxed max-w-4xl mx-auto font-light">
                <p className="p-6 rounded-2xl bg-zinc-950/50 border border-zinc-900">
                  {t.aboutText1}
                </p>
                <p className="p-6 rounded-2xl bg-zinc-950/50 border border-zinc-900">
                  {t.aboutText2}
                </p>
              </div>

              {/* Three Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6" id="about-pillars">
                
                <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-900 text-center flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs md:text-sm font-extrabold text-white">{t.value1_title}</h4>
                  <p className="text-zinc-500 text-[11px] leading-relaxed font-light">{t.value1_desc}</p>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-900 text-center flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs md:text-sm font-extrabold text-white">{t.value2_title}</h4>
                  <p className="text-zinc-500 text-[11px] leading-relaxed font-light">{t.value2_desc}</p>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-900 text-center flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs md:text-sm font-extrabold text-white">{t.value3_title}</h4>
                  <p className="text-zinc-500 text-[11px] leading-relaxed font-light">{t.value3_desc}</p>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div
              key="policy-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
              id="boutique-policies-container"
            >
              {/* Logistics Heading */}
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-[10px] font-bold tracking-[0.25em] font-mono text-amber-500 uppercase block mb-3">🛡️ GLOBAL LOGISTICS PLEDGE</span>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">
                  {t.policyTitle}
                </h3>
                {t.policySubtitle && (
                  <p className="text-amber-400 font-sans text-xs md:text-sm tracking-wide">
                    {t.policySubtitle}
                  </p>
                )}
                <div className="h-0.5 w-16 bg-amber-500/40 mx-auto mt-6" />
              </div>

              {/* Shipments Info and returns guidelines details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto font-light text-zinc-300 text-xs md:text-sm leading-relaxed">
                
                {/* Ship rules */}
                <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-900 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm md:text-base font-black text-white flex items-center gap-2 mb-4">
                      <Truck className="w-4 h-4 text-amber-500" />
                      <span>{t.shipTitle}</span>
                    </h4>
                    <div className="space-y-3">
                      {t.shipText1 && <p>{t.shipText1}</p>}
                      {t.shipText2 && <p>{t.shipText2}</p>}
                      {t.shipText3 && <p>{t.shipText3}</p>}
                    </div>
                  </div>
                  {lang === 'he' ? (
                    <div className="mt-6 p-3 rounded bg-amber-500/5 text-amber-400 text-[11px] border border-amber-500/15 font-sans">
                      💡 שימו לב: מעקב משלוחים זמין דרך קישורי WhatsApp.
                    </div>
                  ) : (
                    <div className="mt-6 p-3 rounded bg-amber-500/5 text-amber-400 text-[11px] border border-amber-500/15 font-sans">
                      💡 ملاحظة: تتبع الشحنات متاح عبر روابط الواتساب.
                    </div>
                  )}
                </div>

                {/* Return window Rules */}
                <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-900 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm md:text-base font-black text-white flex items-center gap-2 mb-4">
                      <RotateCcw className="w-4 h-4 text-amber-500 animate-spin" />
                      <span>{t.returnTitle}</span>
                    </h4>
                    <div className="space-y-3">
                      {t.returnText1 && <p>{t.returnText1}</p>}
                      {t.returnText2 && <p>{t.returnText2}</p>}
                      {t.returnText3 && <p>{t.returnText3}</p>}
                    </div>
                  </div>
                  {lang === 'he' ? (
                    <div className="mt-6 p-3 rounded bg-emerald-500/5 text-emerald-400 text-[11px] border border-emerald-500/15 font-sans">
                      🎁 דוגמיות ההתנסות הן מתנה מלאה עבורכם ומצורפות לכל הזמנה.
                    </div>
                  ) : (
                    <div className="mt-6 p-3 rounded bg-emerald-500/5 text-emerald-400 text-[11px] border border-emerald-500/15 font-sans">
                      🎁 عينات التجربة المجانية هي هدية بالكامل لك ومرفقة مع كل طلب.
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
