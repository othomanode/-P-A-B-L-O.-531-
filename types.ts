import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Eye, Check, X, Phone, User, MapPin, ShoppingBag, 
  Search, SlidersHorizontal, Award, ShieldCheck, Heart, Sparkles, HelpCircle, Truck, Gift, Headphones,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Product } from '../types';
import { translations } from '../translations';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import PerfumeQuiz from './PerfumeQuiz';

interface ProductsSectionProps {
  lang: 'ar' | 'he';
}

export default function ProductsSection({ lang }: ProductsSectionProps) {
  const { products } = useProducts();
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'amerBuhadana' | 'perfumes' | 'bags'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women' | 'unisex'>('all');
  const [selectedScent, setSelectedScent] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [showOnlyDiscounts, setShowOnlyDiscounts] = useState<boolean>(false);
  const [showOnlyBestSellers, setShowOnlyBestSellers] = useState<boolean>(false);

  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  const { addToCart } = useCart();
  const t = translations[lang];

  const getProductTranslation = (productId: string) => {
    // 1. Prioritize static catalog translations if mapped
    const mapping: Record<string, string> = {
      'bag-guess-lumiere': 'p1',
      'perfume-oud-absolute': 'p2',
      'bag-guess-jade': 'p3',
      'bag-guess-travel': 'p4',
      'perfume-rose-gold': 'p5',
      'perfume-oud-oil': 'p6',
      'perfume-royal-superba-buhadana': 'p7',
      'perfume-mystic-samuel-buhadana': 'p8',
      'bag-guess-men-classic': 'p9',
      'bag-guess-men-monogram': 'p10',
      'bag-guess-men-triangle': 'p11',
      'bag-guess-crossbody-pouch': 'p12',
      'bag-guess-taupe-tote': 'p13',
      'bag-guess-monogram-satchel': 'p14',
      'bag-guess-white-clutch': 'p15',
    };
    const key = mapping[productId];
    if (key && t.products?.items?.[key as keyof typeof t.products.items]) {
      return t.products.items[key as keyof typeof t.products.items];
    }

    // 2. Fallback to dynamic custom products added via OwnerPanel
    const dProd = products.find(p => p.id === productId);
    if (dProd) {
      if (lang === 'he') {
        const specsHe = (dProd as any).specsHe || [];
        return {
          name: (dProd as any).nameHe || dProd.name,
          description: (dProd as any).descriptionHe || dProd.description,
          details: (dProd as any).detailsHe || dProd.details,
          specs: specsHe.length > 0 ? specsHe : dProd.specs
        };
      } else {
        return {
          name: dProd.name,
          description: dProd.description,
          details: dProd.details,
          specs: dProd.specs
        };
      }
    }
    return null;
  };

  // Inquiry Form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'paypal'>('cash');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Filter products based on search term, selected type, selected gender, selected scent family, price and filter-toggles
  const filteredProducts = products.filter((product) => {
    // Type matching (perfumes vs bags vs amerBuhadana)
    const isBagProduct = product.category === 'bags';
    const isBuhadanaProduct = product.category === 'amerBuhadana' || product.id.includes('buhadana');

    let matchesType = false;
    if (selectedType === 'all') {
      matchesType = true;
    } else if (selectedType === 'amerBuhadana') {
      matchesType = isBuhadanaProduct && !isBagProduct;
    } else if (selectedType === 'perfumes') {
      matchesType = !isBagProduct && !isBuhadanaProduct;
    } else if (selectedType === 'bags') {
      matchesType = isBagProduct;
    }

    if (!matchesType) return false;

    const translated = getProductTranslation(product.id);
    const prodName = translated?.name || product.name;
    const prodDesc = translated?.description || product.description;

    // Search matching
    const matchesSearch = prodName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prodDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.scentType && product.scentType.toLowerCase().includes(searchTerm.toLowerCase()));

    // Gender filter matching
    const matchesGender = selectedGender === 'all' || product.gender === selectedGender;

    // Scent match filtering
    const matchesScent = selectedScent === 'all' || 
                         (product.scentType && product.scentType.includes(selectedScent));

    // Price parsing
    const NumericPrice = parseInt(product.price.replace(/[^0-9]/g, ''), 10);
    const matchesPrice = NumericPrice <= maxPrice;

    // Toggle filters
    const matchesDiscount = !showOnlyDiscounts || !!product.originalPrice;
    const matchesBestSeller = !showOnlyBestSellers || !!product.isBestSeller;

    return matchesSearch && matchesGender && matchesScent && matchesPrice && matchesDiscount && matchesBestSeller;
  });

  const DEFAULT_LIMIT = 6;
  const visibleProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, DEFAULT_LIMIT);

  React.useEffect(() => {
    setShowAllProducts(false);
  }, [searchTerm, selectedType, selectedGender, selectedScent, maxPrice]);

  // Safe WhatsApp order hook
  const handleOpenProduct = (product: Product) => {
    setActiveModalProduct(product);
    setFormStatus('idle');
    setClientName('');
    setClientPhone('');
    setClientLocation('');
    setPaymentMethod('cash');
  };

  const handleOrderViaWhatsApp = (product: Product) => {
    const whatsappNumber = '972535667856';
    const translatedName = getProductTranslation(product.id)?.name || product.name;
    const message = product.isSoldOut
      ? (lang === 'ar'
        ? `*أهلاً بوتيك SAMUEL الفاخر* 👑\n\nأود الاستفسار عن إمكانية حجز طلب خاص أو موعد توفر هذا المنتج المنفذ:\n• *المنتج:* ${translatedName}\n• *السعر:* ${product.price}\n• *صورة المنتج:* ${product.imageUrl}`
        : lang === 'he'
        ? `*שלום לבוטיק הבשמים SAMUEL* 👑\n\nאשמח לברר לגבי הזמנה מיוחדת או מועד אספקה של המוצר שאזל מהמלאי:\n• *המוצר:* ${translatedName}\n• *המחיר:* ${product.price}\n• *תמונת המוצר:* ${product.imageUrl}`
        : `*Hello SAMUEL Boutique* 👑\n\nI would like to inquire about a special order or availability of the sold out item:\n• *Item:* ${translatedName}\n• *Price:* ${product.price}\n• *Product Image:* ${product.imageUrl}`)
      : (lang === 'ar'
        ? `*أهلاً بوتيك SAMUEL الفاخر* 👑\n\nأود طلب هذا المنتج الحصري المتميز:\n• *المنتج:* ${translatedName}\n• *السعر:* ${product.price}\n• *صورة المنتج:* ${product.imageUrl}\n\nالرجاء التواصل لتأكيد التجهيز والتوصيل السريع.`
        : lang === 'he'
        ? `*שלום לבוטיק הבשמים SAMUEL* 👑\n\nאני מעוניין להזמין את המוצר האקסקלוסיבי הזה:\n• *המוצר:* ${translatedName}\n• *המחיר:* ${product.price}\n• *תמונת המוצר:* ${product.imageUrl}\n\nאנא צרו קשר לתיאום משלוח מהיר.`
        : `*Hello SAMUEL Boutique* 👑\n\nI am interested in ordering this exclusive piece:\n• *Item:* ${translatedName}\n• *Price:* ${product.price}\n• *Product Image:* ${product.imageUrl}\n\nPlease contact me to confirm arrangements and express hand-delivery.`);

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handeSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !clientLocation.trim()) {
      setFormStatus('error');
      return;
    }

    setFormStatus(`submitting`);
    
    setTimeout(() => {
      setFormStatus(`success`);
      
      const whatsappNumber = '972535667856';
      const message = lang === 'ar'
        ? `*طلب حيازة مقتنى جديد من بوتيك SAMUEL* 👑\n\n` +
          `• *المقتنى الفاخر:* ${activeModalProduct?.name}\n` +
          `• *اسم العميل الكريم:* ${clientName}\n` +
          `• *رقم الهاتف الخاص:* ${clientPhone}\n` +
          `• *العنوان المفضل:* ${clientLocation}\n` +
          `• *طريقة الدفع:* ${paymentMethod === 'cash' ? 'كاش عند الاستلام' : 'باي بال - PayPal'}\n` +
          `• *السعر:* ${activeModalProduct?.price}\n` +
          `• *صورة المنتج:* ${activeModalProduct?.imageUrl}`
        : lang === 'he'
        ? `*הזמנת פריט חדשה מבוטיק SAMUEL* 👑\n\n` +
          `• *הפריט היוקרתי:* ${activeModalProduct?.name}\n` +
          `• *שם הלקוח המכובד:* ${clientName}\n` +
          `• *מספר טלפון:* ${clientPhone}\n` +
          `• *כתובת למשלוח:* ${clientLocation}\n` +
          `• *אמצעי תשלום:* ${paymentMethod === 'cash' ? 'מזומן בעת המסירה' : 'PayPal'}\n` +
          `• *מחיר:* ${activeModalProduct?.price}\n` +
          `• *תמונת המוצר:* ${activeModalProduct?.imageUrl}`
        : `*New Acquisition Request from SAMUEL Boutique* 👑\n\n` +
          `• *Luxury Masterpiece:* ${activeModalProduct?.name}\n` +
          `• *Client Name:* ${clientName}\n` +
          `• *Phone Number:* ${clientPhone}\n` +
          `• *Preferred Address:* ${clientLocation}\n` +
          `• *Payment Method:* ${paymentMethod === 'cash' ? 'Cash on Delivery' : 'PayPal'}\n` +
          `• *Price:* ${activeModalProduct?.price}\n` +
          `• *Product Image:* ${activeModalProduct?.imageUrl}`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }, 1200);
  };

  // Distinct scent families present in data
  const scentFamilies = selectedType === 'bags'
    ? (lang === 'ar'
        ? [
            { id: 'all', label: 'كل الموديلات والجلود' },
            { id: 'نعام', label: 'جلد النعام الفاخر' },
            { id: 'عجل', label: 'جلد العجل المعتق' },
            { id: 'سافيانو', label: 'جلد سافيانو الإيطالي' },
            { id: 'كلاسيك', label: 'جلد جيس الرياضي الكلاسيكي' }
          ]
        : [
            { id: 'all', label: 'כל הדגמים והסוגים' },
            { id: 'نعام', label: 'עור יען יוקרתי' },
            { id: 'עגל', label: 'עור עגל משובח' },
            { id: 'سافيانو', label: 'עור ספיאנו איטלקי' },
            { id: 'كلاسيك', label: 'עור גס קלאסי' }
          ])
    : (lang === 'ar'
        ? [
            { id: 'all', label: 'كل الروائح' },
            { id: 'عود', label: 'خلاصة دُرّة العود' },
            { id: 'أزهار', label: 'الزهور والورود الفرنسية' },
            { id: 'خشبي', label: 'الأخشاب والصلصال الحاد' },
            { id: 'أمبر', label: 'العنبر والمسك الغامض' },
            { id: 'فانيلا', label: 'الفانيلا المخملية' }
          ]
        : [
            { id: 'all', label: 'כל הניחוחות' },
            { id: 'عود', label: 'תמציות עוד משכר' },
            { id: 'أזهار', label: 'פרחים וורדים צרפתיים' },
            { id: 'خشبي', label: 'ניחוח עצי מלוטש' },
            { id: 'أمبر', label: 'ענבר ומאסק מסתורי' },
            { id: 'فانيلا', label: 'וניל מלכותי קטיפתי' }
          ]);

  // Micro-copy Arabic/Hebrew translations
  const labels = {
    ar: {
      searchPlaceholder: 'ابحث عن عطر أحلامك النادر...',
      priceHeader: 'الحد الأقصى للسعر:',
      g_all: 'كل العطور',
      g_men: 'عطور رجالية',
      g_women: 'عطور نسائية',
      g_unisex: 'عطور للجنسين (يونيسكس)',
      toggleDiscounts: 'عروض وخصومات حصريّة',
      toggleBestSellers: 'الأكثر طلباً ومبيعاً',
      resultsFound: 'الموديلات والمجموعات المطابقة:',
      noResults: 'عذراً، لم نجد عطوراً تطابق اختياراتك حالياً. جرب تعديل الفلاتر.',
      viewQuiz: 'مستشار المساعد الافتراضي',
      hideQuiz: 'عرض كتالوج العطور العام',
      quizPromoTitle: 'حائر في اختيار نفحتك العطرية؟',
      quizPromoDesc: 'دع نظام الفلترة الذكي الخاص بـ SAMUEL يساعدك في تحديد عطر هيبتك الفريد المطابق بدقة لأسلوب عيشك.',
      startQuizBtn: 'شغّل مستشار اختيار العطور الذكي',
      bestSellerBadge: 'الأكثر طلباً',
      saleBadge: 'عرض خاص',
      addToCartBtn: 'إضافة للسلة',
      buyWhatsapp: 'شراء سريع • واتساب',
      trustTitle: 'معايير وبنود الثقة بـ بوتيك SAMUEL',
      trustSubtitle: 'نلتزم بتقديم تجربة اقتناء تسلب الحواس وتحفظ هيبة عملائنا الكرام.',
      trust1_title: 'عطور أصلية 100%',
      trust1_desc: 'جميع زجاجتنا مرقّمة برمز أصالة ومستوردة من منشئها الأم ببلد التركيب الفرنسي والشرقي.',
      trust2_title: 'توصيل سريع',
      trust2_desc: 'يصل حتى باب منزلك عبر مناديب.',
      trust3_title: 'تغليف ملكي فاخر',
      trust3_desc: 'تأتي كل قارورة بداخل علبة خشبية مبطنة بالمخمل الأسود الناعم الملائم لتقديم الهدية المثالية.',
      trust4_title: 'مستشار كبار الشخصيات',
      trust4_desc: 'خدمة عملاء راقية حية على مدار الـ 24 ساعة عبر الهاتف والطلب الرقمي لمؤازرة أي متطلبات.',
    },
    he: {
      searchPlaceholder: 'חפשו את בושם החלומות שלכם...',
      priceHeader: 'מחיר מקסימלי:',
      g_all: 'כל הבשמים',
      g_men: 'בשמי גברים',
      g_women: 'בשמי נשים',
      g_unisex: 'יוניסקס (לשני המינים)',
      toggleDiscounts: 'מבצעים והנחות VIP',
      toggleBestSellers: 'הנמכרים והמבוקשים ביותר',
      resultsFound: 'בשמים שנמצאו להתאמה:',
      noResults: 'מצטערים, לא נמצאו בשמים התואמים את הבחירה שלך. אנא נסה לשנות את המסננים.',
      viewQuiz: 'מאתר בישום חכם',
      hideQuiz: 'חזרה לקטלוג הבשמים הראשי',
      quizPromoTitle: 'מתלבטים מהו הבושם המושלם עבורכם?',
      quizPromoDesc: 'תנו למערכת ההתאמה האקסקלוסיבית של בוטיק SAMUEL לנתח את אופי הנוכחות שלכם ולגלות את הריח המנצח.',
      startQuizBtn: 'הפעל יועץ בישום דיגיטלי חכם',
      bestSellerBadge: 'הכי מבוקש',
      saleBadge: 'מבצע VIP',
      addToCartBtn: 'הוסף לסל',
      buyWhatsapp: 'רכישה מהירה ב-WhatsApp',
      trustTitle: 'סטנדרט היושרה והאמון של SAMUEL',
      trustSubtitle: 'אנו מתחייבים לחוויית רכישה יוקרתית השומרת על דיסקרטיות ואיכות ללא פשרות.',
      trust1_title: '100% בשמים מקוריים',
      trust1_desc: 'כל הבקבוקים בבוטיק מיובאים ישירות ברמת ריכוז הגבוהה ביותר ונושאים חותם אמינות.',
      trust2_title: 'משלוח VIP מהיר',
      trust2_desc: 'משלוחים מהירים ומאובטחים ללא עלות המגיעים ישירות למיקום הלקוח בדיסקרטיות מושלמת.',
      trust3_title: 'אריזת מתנה מלכותית',
      trust3_desc: 'כל בושם מוגש בקופסת עץ שחורה יוקרתית מרופדת קטיפה התואמת להענקת מתנה מושלמת.',
      trust4_title: 'ליווי אישי 24/7',
      trust4_desc: 'שירות לקוחות יוקרתי ומנהל קונסיירז׳ אישי הזמינים בשיח ישיר ו-WhatsApp בכל שעות היממה.',
    }
  };

  const l = lang === 'he' ? labels.he : labels.ar;

  return (
    <section id="products" className="relative py-24 md:py-32 bg-transparent text-white" dir="rtl">
      {/* Light border split */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {lang === 'ar' ? 'العطور والحقائب' : 'בשמים ותיקים'}
          </h2>
          
          <div className="h-1 w-24 bg-gradient-to-l from-amber-500 via-yellow-400 to-amber-300 mx-auto rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          
          <p className="text-zinc-400 max-w-2xl mx-auto mt-6 text-xs md:text-sm font-light leading-relaxed">
            {lang === 'ar' 
              ? 'تصفح مجموعتنا الفريدة المصممة خصيصاً للشخصيات الملهمة وربات المجتمع لتعطيهن طابعاً يعكس أرفع درجات الفخامة والمظهر الملوكي.'
              : 'גלריית בשמי הבוטיק המבוקשים ביותר שלנו. תמציות ריח עמידות המעניקות נוכחות ממגנטת ונוקשות אצילית מרהיבה.'
            }
          </p>
        </div>

        <div id="products-control-anchor" />

        <div>
              
              {/* Primary Category Selector */}
              <div className="flex flex-wrap justify-center gap-3 mb-10" id="product-type-switcher">
                {[
                  { id: 'all', label: lang === 'ar' ? '✨ كل التشكيلة الفاخرة' : '✨ כל הקולקציה היוקרתית', count: products.length },
                  { id: 'amerBuhadana', label: `👑 ${t.products.categories.amerBuhadana}`, count: products.filter(p => p.category === 'amerBuhadana' || p.id.includes('buhadana')).length },
                  { id: 'perfumes', label: `⚜️ ${t.products.categories.perfumes}`, count: products.filter(p => p.category !== 'bags' && p.category !== 'amerBuhadana' && !p.id.includes('buhadana')).length },
                  { id: 'bags', label: `👜 ${t.products.categories.bags}`, count: products.filter(p => p.category === 'bags').length }
                ].map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id as any);
                        setSelectedScent('all'); // reset scent/style filter
                      }}
                      className={`px-6 py-3.5 rounded-2xl text-[11px] md:text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-gradient-to-l from-amber-500 via-yellow-400 to-amber-600 text-black shadow-[0_4px_25px_rgba(245,158,11,0.3)] scale-[1.03] border border-transparent'
                          : 'bg-zinc-950/70 border border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800'
                      }`}
                    >
                      <span>{type.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isSelected ? 'bg-black/25 text-black' : 'bg-zinc-900 text-zinc-500'}`}>
                        {type.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Luxury Control Panel: Filters, ranges and search bar */}
              <div className="p-6 md:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-900 shadow-2xl mb-12" id="products-filter-panel">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left part: Search input */}
                  <div className="lg:col-span-4 flex flex-col justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-amber-500" />
                      <span>{lang === 'ar' ? 'بحث سريع هجائي:' : 'חיפוש מהיר חופשי:'}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={selectedType === 'bags'
                          ? (lang === 'ar' ? 'ابحث عن حقيبة أحلامك النادرة...' : 'חפשו בין תיקי היוקרה הנדירים...')
                          : l.searchPlaceholder
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-800 bg-black/50 text-xs md:text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-sans"
                        id="perfume-search-input"
                      />
                      <Search className="w-4 h-4 text-zinc-600 absolute left-3.5 top-3.5" />
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')} 
                          className="absolute left-10 top-3 text-zinc-500 hover:text-white mr-1 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mid part: Gender category tabs */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                      <span>{selectedType === 'bags'
                        ? (lang === 'ar' ? 'الموديل المستهدف للحقيبة:' : 'קטגוריית מגדר לתיקים:')
                        : (lang === 'ar' ? 'الفئة المستهدفة للرائحة:' : 'סינון לפי קטגוריית מגדר:')
                      }</span>
                    </label>
                    
                    <div className="grid grid-cols-4 gap-1.5 bg-black/50 p-1 rounded-xl border border-zinc-800">
                      {[
                        { id: 'all', label: lang === 'ar' ? 'الكل' : 'הכל' },
                        { id: 'men', label: lang === 'ar' ? 'رجالي' : 'גברים' },
                        { id: 'women', label: lang === 'ar' ? 'نسائي' : 'נשים' },
                        { id: 'unisex', label: lang === 'ar' ? 'جنسين' : 'יוניסקס' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedGender(tab.id as any)}
                          className={`py-2 px-1 rounded-lg text-[10px] md:text-xs font-bold transition-all duration-300 cursor-pointer ${
                            selectedGender === tab.id
                              ? 'text-black bg-gradient-to-l from-amber-500 to-amber-300 shadow-[0_2px_8px_rgba(245,158,11,0.2)]'
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right part: Scent / Leather family profiles */}
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                      {selectedType === 'bags'
                        ? (lang === 'ar' ? 'نوع الجلد والنمط:' : 'סגנון העור והדגם:')
                        : (lang === 'ar' ? 'نوع الرائحة الأساسية:' : 'תווי ניחוחות עיקריים:')
                      }
                    </label>
                    
                    <select
                      value={selectedScent}
                      onChange={(e) => setSelectedScent(e.target.value)}
                      className="w-full py-3 px-3.5 rounded-xl border border-zinc-800 bg-black/50 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none transition-all cursor-pointer font-sans"
                    >
                      {scentFamilies.map((scent) => (
                        <option key={scent.id} value={scent.id} className="bg-zinc-950 text-white">
                          {scent.label}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Second row filters: Price Slider & toggles */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 pt-6 border-t border-zinc-900 items-center">
                  
                  {/* Price slider */}
                  <div className="md:col-span-6 flex flex-col md:flex-row md:items-center gap-3 justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-zinc-500">{l.priceHeader}</span>
                      <span className="text-xs md:text-sm font-black font-mono text-amber-400">₪{maxPrice}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="flex-grow h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Display discount & bestselling toggles */}
                  <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-3">
                    <button
                      onClick={() => setShowOnlyDiscounts(!showOnlyDiscounts)}
                      className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold border transition-all duration-300 cursor-pointer ${
                        showOnlyDiscounts
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {l.toggleDiscounts}
                    </button>

                    <button
                      onClick={() => setShowOnlyBestSellers(!showOnlyBestSellers)}
                      className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold border transition-all duration-300 cursor-pointer ${
                        showOnlyBestSellers
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {l.toggleBestSellers}
                    </button>
                  </div>

                </div>
              </div>

              {/* Total matching query notice */}
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-6 font-mono">
                <span>{l.resultsFound} {filteredProducts.length}</span>
                {searchTerm || selectedGender !== 'all' || selectedScent !== 'all' || showOnlyDiscounts || showOnlyBestSellers ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedGender('all');
                      setSelectedScent('all');
                      setMaxPrice(1000);
                      setShowOnlyDiscounts(false);
                      setShowOnlyBestSellers(false);
                    }}
                    className="text-amber-500 hover:text-white transition-colors cursor-pointer"
                  >
                    [ {lang === 'ar' ? 'إعادة تعيين الكل' : 'אפס הכל'} ]
                  </button>
                ) : null}
              </div>

              {/* Products Grid Showcase */}
              {filteredProducts.length === 0 ? (
                <div className="p-16 text-center rounded-3xl bg-zinc-950/40 border border-zinc-900/80">
                  <div className="w-16 h-16 rounded-full bg-zinc-900/60 flex items-center justify-center mx-auto mb-4 border border-zinc-800 text-zinc-600">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-sm mx-auto">
                    {l.noResults}
                  </p>
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="products-showcase-grid">
                  <AnimatePresence mode="popLayout">
                    {visibleProducts.map((product) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        key={product.id}
                        className="group relative rounded-2xl bg-zinc-950/70 backdrop-blur-md border border-zinc-800/80 hover:border-amber-500/60 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.7)] hover:shadow-[0_0_35px_rgba(245,158,11,0.25)] transition-all duration-500 flex flex-col h-full"
                        id={`product-card-${product.id}`}
                      >
                        {/* Image aspect frame */}
                        <div 
                          onClick={() => handleOpenProduct(product)}
                          className="relative aspect-square w-full overflow-hidden bg-zinc-900 cursor-pointer"
                        >
                          {/* Scent & Gender Badge tags */}
                          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-black/80 border border-amber-500/35 text-amber-400 font-mono uppercase tracking-wider">
                              {product.category === 'bags' ? (
                                product.gender === 'men' ? (lang === 'ar' ? 'حقيبة رجالية' : 'תיק גברים') :
                                product.gender === 'women' ? (lang === 'ar' ? 'حقيبة نسائية' : 'תיק נשים') :
                                (lang === 'ar' ? 'حقيبة للجنسين' : 'תיק יוניסקס')
                              ) : (
                                product.gender === 'men' ? (lang === 'ar' ? 'عطر رجالي' : 'בושם גברים') : 
                                product.gender === 'women' ? (lang === 'ar' ? 'عطر نسائي' : 'בושם נשים') : 
                                (lang === 'ar' ? 'عطر للجنسين' : 'בושם יוניסקס')
                              )}
                            </span>
                            
                            {product.isBestSeller && (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-600 to-yellow-400 text-black font-semibold text-center select-none shadow">
                                {l.bestSellerBadge}
                              </span>
                            )}
                          </div>

                          {/* Discount label */}
                          {product.originalPrice && !product.isSoldOut && (
                            <span className="absolute bottom-4 right-4 z-20 px-2 py-0.5 rounded text-[10px] bg-red-500/90 text-white font-bold leading-none select-none shadow animate-pulse">
                              {l.saleBadge}
                            </span>
                          )}

                          {/* Sold Out badge */}
                          {product.isSoldOut && (
                            <div className="absolute top-4 left-4 z-20 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-red-600 border border-red-500 text-white shadow-lg select-none">
                              {lang === 'ar' ? 'نفذت الكمية' : 'אזל מהמלאי'}
                            </div>
                          )}
                          
                          <img
                            src={product.imageUrl}
                            alt={getProductTranslation(product.id)?.name || product.name}
                            className={`w-full h-full object-cover object-center group-hover:scale-115 transition-transform duration-700 ${
                              product.isSoldOut 
                                ? 'grayscale brightness-[0.4] contrast-75' 
                                : 'brightness-90 group-hover:brightness-100'
                            }`}
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Smooth absolute black overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
                            <button
                              onClick={() => handleOpenProduct(product)}
                              className="px-5 py-2.5 rounded-full bg-gradient-to-l from-amber-600 via-amber-400 to-yellow-300 hover:from-amber-500 hover:to-amber-200 text-black font-extrabold text-xs transition-all duration-300 flex items-center gap-1 transform translate-y-3 group-hover:translate-y-0 shadow-lg cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{t.products.modalTitle}</span>
                            </button>
                          </div>
                        </div>

                        {/* Description context info */}
                        <div className="p-6 flex flex-col flex-grow">
                          
                          {/* Rating and type tag */}
                          <div className="flex items-center justify-between text-zinc-500 text-xs mb-3 font-mono">
                            <span className="text-[10px] tracking-wider uppercase text-zinc-500">
                              {product.category === 'bags' ? (lang === 'ar' ? 'حقيبة فاخرة' : 'תיק יוקרה') : (product.scentType || 'أرستقراطي')}
                            </span>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="font-bold text-zinc-200">{product.rating}</span>
                            </div>
                          </div>

                          {/* perfume Title and short desc */}
                          <h3 className="text-base md:text-lg font-bold text-white group-hover:text-amber-400 transition-colors duration-300 mb-2 font-sans line-clamp-1 leading-tight">
                            {getProductTranslation(product.id)?.name || product.name}
                          </h3>
                          
                          <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-6 font-light">
                            {getProductTranslation(product.id)?.description || product.description}
                          </p>

                          {/* Price segment & Shopping click row */}
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-900/60 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider mb-0.5">{t.products.priceLabel}</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-base md:text-lg font-bold font-mono text-amber-400">{product.price}</span>
                                {product.originalPrice && (
                                  <span className="text-xs text-zinc-600 line-through font-mono">{product.originalPrice}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Add to basket */}
                              <button
                                onClick={() => !product.isSoldOut && addToCart(product)}
                                title={product.isSoldOut ? (lang === 'ar' ? 'نفذت الكمية' : 'אזל מהמלאי') : l.addToCartBtn}
                                disabled={product.isSoldOut}
                                className={`p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center shadow ${
                                  product.isSoldOut
                                    ? 'border-zinc-850 bg-zinc-950/40 text-zinc-650 cursor-not-allowed opacity-40'
                                    : 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500 hover:border-transparent text-amber-400 hover:text-black cursor-pointer'
                                }`}
                                id={`card-add-cart-${product.id}`}
                              >
                                <ShoppingBag className="w-4 h-4" />
                              </button>

                              {/* Direct order button */}
                              <button
                                onClick={() => handleOrderViaWhatsApp(product)}
                                title={product.isSoldOut ? (lang === 'ar' ? 'استفسار طلب خاص' : 'בירור הזמנה מיוחדת') : l.buyWhatsapp}
                                className={`px-3 py-2 rounded-full text-[10px] font-extrabold border transition-all duration-300 cursor-pointer ${
                                  product.isSoldOut
                                    ? 'bg-amber-500/10 hover:bg-amber-500 border-amber-500/30 text-amber-500 hover:text-black shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-amber-500/40 text-zinc-300 hover:text-white'
                                }`}
                                id={`card-direct-whatsapp-${product.id}`}
                              >
                                {product.isSoldOut 
                                  ? (lang === 'ar' ? 'طلب خاص' : 'הזמנה מיוחדת')
                                  : l.buyWhatsapp.split(' • ')[0]}
                              </button>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Show All / Show Less button */}
              {filteredProducts.length > DEFAULT_LIMIT && (
                <div className="flex justify-center mt-12 mb-4" id="show-all-products-container">
                  <button
                    onClick={() => setShowAllProducts(!showAllProducts)}
                    className="relative group overflow-hidden px-8 py-4 rounded-full border border-amber-500/30 hover:border-amber-400 bg-zinc-950 hover:bg-amber-500/5 text-amber-500 hover:text-amber-400 font-extrabold text-xs uppercase tracking-widest cursor-pointer shadow-[0_4px_20px_rgba(245,158,11,0.1)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3"
                    id="toggle-all-products-btn"
                  >
                    <span className="font-sans">
                      {showAllProducts
                        ? (lang === 'ar' ? 'عرض عطور أقل' : 'הצג פחות מוצרים')
                        : (lang === 'ar' ? `عرض كل المقتنيات والعطور (${filteredProducts.length})` : `הצג את כל הפריטים והמוצרים (${filteredProducts.length})`)}
                    </span>
                    <span className="transition-transform duration-300">
                      {showAllProducts ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4 text-amber-500 animate-bounce" />}
                    </span>
                  </button>
                </div>
              )}

        </div>

        {/* TRUST ACCREDITATIONS & CREDIBILITY BADGES (طلب 6) */}
        <div className="mt-28 pt-16 border-t border-zinc-900/60" id="credibility-badges-section">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black tracking-[0.2em] font-mono text-amber-500 uppercase block mb-2">💎 SAMUEL GUARANTEES</span>
            <h3 className="text-xl md:text-3xl font-extrabold text-white mb-3">
              {l.trustTitle}
            </h3>
            <p className="text-zinc-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-light">
              {l.trustSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            
            {/* Badge 1: 100% Original proof */}
            <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900 flex flex-col gap-4 text-right shadow">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-white mb-2">{l.trust1_title}</h4>
                <p className="text-zinc-500 text-[11px] leading-relaxed font-light">{l.trust1_desc}</p>
              </div>
            </div>

            {/* Badge 2: Swift hand delivered shipping */}
            <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900 flex flex-col gap-4 text-right shadow">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Truck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-white mb-2">{l.trust2_title}</h4>
                <p className="text-zinc-500 text-[11px] leading-relaxed font-light">{l.trust2_desc}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Modal with Inquiry Desk Form */}
        <AnimatePresence>
          {activeModalProduct && (() => {
            return (
              <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-2 sm:p-4 overflow-y-auto" id="product-inquiry-modal">
                {/* Blur Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveModalProduct(null)}
                  className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
                />

                {/* Modal Card Frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="relative bg-zinc-950 border border-amber-500/30 rounded-3xl max-w-4xl w-full my-8 md:my-0 max-h-none md:max-h-[90vh] overflow-y-auto shadow-[0_15px_50px_rgba(0,0,0,0.9)] z-10"
                >
                  <button
                    onClick={() => setActiveModalProduct(null)}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden" dir="rtl">
                    
                    {/* Image side */}
                    <div className="md:col-span-5 relative h-64 sm:h-80 md:h-auto md:min-h-full bg-zinc-900 border-b md:border-b-0 md:border-l border-zinc-900">
                      <img
                        src={activeModalProduct.imageUrl}
                        alt={getProductTranslation(activeModalProduct.id)?.name || activeModalProduct.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
                      
                      <div className="absolute bottom-6 right-6 left-6 text-right">
                        <span className="px-2.5 py-1 text-[9px] tracking-widest font-black bg-amber-500 text-black rounded-md inline-block mb-2 font-mono uppercase">
                          {activeModalProduct.category === 'bags' ? (lang === 'ar' ? 'حقيبة' : 'תיק') : (lang === 'ar' ? 'عطر نيش' : 'בושם נישה')}
                        </span>
                        <h4 className="text-xl font-bold text-white drop-shadow-md leading-tight">
                          {getProductTranslation(activeModalProduct.id)?.name || activeModalProduct.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-amber-400 font-mono font-extrabold text-lg">
                            {activeModalProduct.price}
                          </span>
                          {activeModalProduct.originalPrice && (
                            <span className="text-xs text-zinc-500 line-through font-mono">{activeModalProduct.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Form/Description side */}
                    <div className="md:col-span-7 p-4 sm:p-6 md:p-10 flex flex-col gap-5 md:gap-6 bg-zinc-950/40 border-r border-zinc-900">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                          {getProductTranslation(activeModalProduct.id)?.name || activeModalProduct.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-amber-500 text-xs mb-4 font-mono">
                          <Star className="w-4 h-4 fill-current text-amber-500" />
                          <span className="font-extrabold text-zinc-200">{activeModalProduct.rating}</span>
                          <span className="text-zinc-600">|</span>
                          <span className="text-zinc-500">
                            {activeModalProduct.category === 'bags' ? (lang === 'ar' ? 'تصميم حصري' : 'עיצוב בלעדי') : (activeModalProduct.scentType)}
                          </span>
                        </div>
                        
                        <p className="text-zinc-300 text-xs md:text-sm leading-relaxed mb-6 font-light">
                          {getProductTranslation(activeModalProduct.id)?.details || getProductTranslation(activeModalProduct.id)?.description || activeModalProduct.details || activeModalProduct.description}
                        </p>

                        <fieldset className="p-4 border border-amber-500/15 rounded-xl bg-amber-500/5">
                          <legend className="text-[10px] font-black tracking-widest text-amber-500 px-2 uppercase font-sans mr-4">
                            {t.products.modalSpecsTitle}
                          </legend>
                          <ul className="space-y-2 mt-1">
                            {(getProductTranslation(activeModalProduct.id)?.specs || activeModalProduct.specs).map((spec: string, sidx: number) => (
                              <li key={sidx} className="flex items-start gap-2 text-xs text-zinc-400">
                                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span className="leading-snug">{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </fieldset>

                        <div className="mt-5">
                          <button
                            disabled={activeModalProduct.isSoldOut}
                            onClick={() => {
                              if (activeModalProduct.isSoldOut) return;
                              addToCart(activeModalProduct);
                              setActiveModalProduct(null);
                            }}
                            className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 ${
                              activeModalProduct.isSoldOut
                                ? 'border-zinc-850 bg-zinc-950/40 text-zinc-600 cursor-not-allowed opacity-40'
                                : 'border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/15 text-amber-400 hover:text-amber-300 font-bold text-xs cursor-pointer'
                            }`}
                          >
                            <ShoppingBag className={`w-4 h-4 ${activeModalProduct.isSoldOut ? 'text-zinc-650' : 'text-amber-500'}`} />
                            <span>
                              {activeModalProduct.isSoldOut
                                ? (lang === 'ar' ? 'غير متوفر مؤقتاً (نفذت الكمية)' : 'אזל זמנית מהמלאי')
                                : (lang === 'ar' ? 'إضافة القطعة الحالية مباشرة للسلة' : 'הוסף פריט זה ישירות לסל')}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* VIP Inquiry Reservation Form Block */}
                      <div className="border-t border-zinc-950 pt-6">
                        <h4 className="text-sm font-extrabold text-white mb-1">
                          {activeModalProduct.isSoldOut 
                            ? (lang === 'ar' ? '👑 طلب حجز حصرى وخاص (VIP)' : '👑 טופס הזמנה אישית ומיוחדת (VIP)')
                            : t.products.modalFormTitle}
                        </h4>
                        <p className="text-xs text-zinc-500 mb-4">
                          {activeModalProduct.isSoldOut
                            ? (lang === 'ar' ? 'هذه القطعة الفاخرة نفدت من صالة العرض السريعة، لكن بوتيك SAMUEL يوفرها بطلب خاص ومباشر لفرسان البوتيك النخبة. اترك بياناتك أدناه للتنسيق وتصميم طلبك.' : 'פריט יוקרה זה לא זמין כרגע לרכישה מיידית, אך בוטיק SAMUEL מאפשר הזמנות בהתאמה אישית ללקוחות ה-VIP שלנו. אנא השאר פרטים ונציג מוסמך יחזור אליך.')
                            : t.products.modalFormSubtitle}
                        </p>

                        {formStatus === 'success' ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center flex flex-col items-center gap-3"
                          >
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2">
                              <Check className="w-5 h-5 animate-bounce" />
                            </div>
                            <span className="text-sm font-bold text-emerald-400">{t.products.formSuccess}</span>
                            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                              {t.products.formSuccessDesc}
                            </p>
                            <button
                              onClick={() => setActiveModalProduct(null)}
                              className="mt-4 px-5 py-2 rounded-full border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition-colors cursor-pointer"
                            >
                              {t.products.formBtnClose}
                            </button>
                          </motion.div>
                        ) : (
                          <form onSubmit={handeSubmitInquiry} className="space-y-4">
                            {formStatus === 'error' && (
                              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/35 text-rose-400 text-xs flex items-center gap-2">
                                <X className="w-4 h-4" />
                                <span>{t.products.formError}</span>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="relative">
                                <User className="absolute right-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                                <input
                                  type="text"
                                  placeholder={t.products.formLabelName}
                                  value={clientName}
                                  onChange={(e) => setClientName(e.target.value)}
                                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-zinc-800 bg-zinc-900 focus:border-amber-500 focus:outline-none text-xs text-white placeholder-zinc-600 font-sans"
                                  required
                                />
                              </div>

                              <div className="relative">
                                <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                                <input
                                  type="tel"
                                  placeholder={t.products.formLabelPhone}
                                  value={clientPhone}
                                  onChange={(e) => setClientPhone(e.target.value)}
                                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-zinc-800 bg-zinc-900 focus:border-amber-500 focus:outline-none text-xs text-white placeholder-zinc-600 font-mono text-right"
                                  required
                                />
                              </div>
                            </div>

                            <div className="relative">
                              <MapPin className="absolute right-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                              <input
                                type="text"
                                placeholder={t.products.formLabelNotes}
                                value={clientLocation}
                                onChange={(e) => setClientLocation(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 rounded-xl border border-zinc-800 bg-zinc-900 focus:border-amber-500 focus:outline-none text-xs text-white placeholder-zinc-600 font-sans"
                                required
                              />
                            </div>

                            {/* Payment Method Selection */}
                            <div className="space-y-2 pt-2">
                              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                                {lang === 'ar' ? 'طريقة الدفع ومصادقة الاستلام' : 'אמצעי תשלום ואישור מסירה'}
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  type="button"
                                  onClick={() => setPaymentMethod('cash')}
                                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all cursor-pointer ${
                                    paymentMethod === 'cash'
                                      ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-bold'
                                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                                  }`}
                                >
                                  <span className="text-xs">💵</span>
                                  <span className="text-[11px] font-sans">
                                    {lang === 'ar' ? 'كاش عند الاستلام' : 'מזומן בעת המסירה'}
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setPaymentMethod('paypal')}
                                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all cursor-pointer ${
                                    paymentMethod === 'paypal'
                                      ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-bold'
                                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                                  }`}
                                >
                                  <span className="text-xs">💳</span>
                                  <span className="text-[11px] font-sans">
                                    {lang === 'ar' ? 'باي بال - PayPal' : 'PayPal (פייפאל)'}
                                  </span>
                                </button>
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={formStatus === 'submitting'}
                              className="w-full py-3.5 rounded-full text-black font-extrabold text-xs bg-gradient-to-l from-amber-600 via-amber-400 to-yellow-300 hover:from-amber-500 hover:to-amber-200 transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
                            >
                              {formStatus === 'submitting' ? (
                                <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-black" />
                              ) : (
                                <span>{t.products.formBtnSubmitActive}</span>
                              )}
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>
      </div>
    </section>
  );
}
