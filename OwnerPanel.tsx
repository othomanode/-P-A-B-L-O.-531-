import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, MapPin, Phone, User, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { translations } from '../translations';

interface CartDrawerProps {
  lang: 'ar' | 'he';
}

export default function CartDrawer({ lang }: CartDrawerProps) {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    clearCart 
  } = useCart();

  // Checkout info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'paypal'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    const dProd = cartItems.find(item => item.product.id === productId)?.product;
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

  // Cart specific translations built right in for maximum fidelity & translation accuracy
  const cartT = {
    ar: {
      title: 'سلة المقتنيات الفاخرة',
      empty: 'لم تختر أي قطع فريدة بعد في سلتك.',
      total: 'المجموع الإجمالي للحيازة',
      deliveryInfo: 'تفاصيل التسليم ومواقع التوصيل الآمنة',
      formName: 'الاسم الكريم المعتمد',
      formPhone: 'رقم الهاتف المباشر (أو WhatsApp)',
      formLocation: 'الموقع أو العنوان المفضل للتوصيل الآمن',
      btnWhatsApp: 'تأكيد الحيازة الفورية عبر WhatsApp',
      successTitle: 'تم إرسال طلبك المالي الفاخر بنجاح!',
      successDesc: 'سيقوم مستشار السلال الشخصي لـ SAMUEL LUXURY بالاتصال الهاتفي الفوري معكم لتأكيد تفاصيل الحيازة والتنسيق السري.',
      totalItems: 'عدد القطع:',
      quantity: 'الكمية:',
      submitting: 'جاري تنسيق طلب السلة وتأمين الإرسال...',
    },
    he: {
      title: 'סל הפריטים היוקרתי',
      empty: 'טרם בחרת פריטים ייחודיים לסל שלך.',
      total: 'סך הכל לרכישה',
      deliveryInfo: 'פרטי משלוח ויעד מסירה מאובטח',
      formName: 'שם מלא של הלקוח המכובד',
      formPhone: 'מספר טלפון תקף (עם WhatsApp)',
      formLocation: 'כתובת או מיקום מועדף למסירה דיסקרטית',
      btnWhatsApp: 'אישור רכישה מיידית ב-WhatsApp',
      successTitle: 'בקשת הרכישה נשלחה בהצלחה!',
      successDesc: 'יועץ הבוטיק האישי של SAMUEL LUXURY יתקשר אליכם באופן מיידי לתאום המסירה והתשלום הדיסקרטי.',
      totalItems: 'פריטים:',
      quantity: 'כמות:',
      submitting: 'מתבצע רישום הזמנה ואבטחת נתונים...',
    }
  }[lang];

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !location.trim()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Craft WhatsApp Message with exquisite premium layout
      const whatsappNumber = '972535667856';
      
      const header = lang === 'ar' 
        ? `*👑 طلب حيازة جماعي من سلة SAMUEL LUXURY*` 
        : `*👑 בקשת רכישה מרוכזת מסל SAMUEL LUXURY VIP*`;
        
      const itemsList = cartItems.map((item, index) => {
        const itemPrice = parseFloat(item.product.price.replace(/[^\d.]/g, '')) || 0;
        const subtotal = itemPrice * item.quantity;
        const itemName = getProductTranslation(item.product.id)?.name || item.product.name;
        return `${index + 1}. *${itemName}*\n` +
               `   ${lang === 'ar' ? '• الكمية:' : '• כמות:'} ${item.quantity}\n` +
               `   ${lang === 'ar' ? '• السعر الفردي:' : '• מחיר יחידה:'} ${item.product.price}\n` +
               `   ${lang === 'ar' ? '• السعر الإجمالي:' : '• סה"כ לפריט:'} ₪${subtotal.toLocaleString()}\n` +
               `   ${lang === 'ar' ? '• صورة المنتج:' : '• תמונת המוצר:'} ${item.product.imageUrl}`;
      }).join('\n\n');

      const clientInfo = lang === 'ar'
        ? `*👤 تفاصيل العميل والوجهة:*\n` +
          `• *الاسم الملكي:* ${name}\n` +
          `• *رقم التواصل المعتمد:* ${phone}\n` +
          `• *الموقع للتوصيل:* ${location}\n` +
          `• *طريقة الدفع:* ${paymentMethod === 'cash' ? 'كاش عند الاستلام' : 'باي بال - PayPal'}`
        : `*👤 פרטי הלקוח ויעד המשלוח:*\n` +
          `• *שם הלקוח:* ${name}\n` +
          `• *טלפון לתקשורת:* ${phone}\n` +
          `• *מיקום למסירה:* ${location}\n` +
          `• *אמצעי תשלום:* ${paymentMethod === 'cash' ? 'מזומן בעת המסירה' : 'PayPal'}`;

      const totalSummary = lang === 'ar'
        ? `*💰 المجموع النهائي للحيازة الفاخرة:* ₪${getCartTotal().toLocaleString()}`
        : `*💰 סך הכל לתשלום יוקרתי:* ₪${getCartTotal().toLocaleString()}`;

      const footerMsg = lang === 'ar'
        ? `_تم التشفير والتقديم عبر واجهة SAMUEL LUXURY الرقمية_`
        : `_נשלח ואובטח דרך ממשק SAMUEL LUXURY הדיגיטלי_`;

      const fullMessage = `${header}\n\n${itemsList}\n\n${totalSummary}\n\n${clientInfo}\n\n${footerMsg}`;

      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Clear cart
      clearCart();

      // Open whatsapp
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMessage)}`, '_blank');
    }, 1500);
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    setIsCartOpen(false);
    setName('');
    setPhone('');
    setLocation('');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Cart Slider Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full max-w-md bg-[#09080d]/95 border-r border-[#ffffff08] shadow-[0_0_50px_rgba(0,0,0,0.85)] z-50 flex flex-col"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 text-amber-500">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold tracking-wider text-zinc-100 uppercase">
                  {cartT.title}
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg border border-zinc-900 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {isSuccess ? (
                /* Success Screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10 space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    ✓
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-emerald-400">
                      {cartT.successTitle}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed px-4">
                      {cartT.successDesc}
                    </p>
                  </div>
                  <button
                    onClick={handleSuccessClose}
                    className="px-6 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    {t.products.formBtnClose}
                  </button>
                </motion.div>
              ) : cartItems.length === 0 ? (
                /* Empty Cart Status */
                <div className="flex flex-col items-center justify-center text-center py-24 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 border-dashed">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-zinc-400">
                    {cartT.empty}
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer transition-all"
                  >
                    {lang === 'ar' ? 'استكشف المقتنيات الآن' : 'גלה פריטים כעת'}
                  </button>
                </div>
              ) : (
                /* Items List and checkout form */
                <>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.product.id}
                        className="flex items-center gap-4 p-3.5 rounded-2xl bg-zinc-950/40 border border-[#ffffff05] hover:border-amber-500/20 transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-zinc-900 relative">
                          <img
                            src={item.product.imageUrl}
                            alt={getProductTranslation(item.product.id)?.name || item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Text and controls */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          <h4 className="text-xs font-bold text-zinc-200 truncate pr-1">
                            {getProductTranslation(item.product.id)?.name || item.product.name}
                          </h4>
                          <span className="text-xs text-amber-400 font-bold font-mono">
                            {item.product.price}
                          </span>

                          {/* Count & Delete toggles */}
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/60 rounded-lg px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="text-zinc-400 hover:text-white cursor-pointer transition-all p-0.5"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-bold text-zinc-300 font-mono min-w-[12px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="text-zinc-400 hover:text-white cursor-pointer transition-all p-0.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-zinc-600 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary & Checkout Form */}
                  <div className="pt-6 border-t border-zinc-900 space-y-6">
                    {/* Grand Total */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/[0.04] to-yellow-500/[0.04] border border-amber-500/15 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                          {cartT.total}
                        </span>
                        <span className="text-[10px] text-amber-500/80 font-semibold">
                          {cartT.totalItems} {cartItems.reduce((acc, current) => acc + current.quantity, 0)}
                        </span>
                      </div>
                      <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-200 font-mono">
                        ₪{getCartTotal().toLocaleString()}
                      </span>
                    </div>

                    {/* Delivery Form */}
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest block border-b border-zinc-900 pb-2 mb-1">
                        {cartT.deliveryInfo}
                      </div>

                      {/* Name */}
                      <div className="relative">
                        <User className="absolute right-3 top-3.5 w-4 h-4 text-zinc-600" />
                        <input
                          type="text"
                          placeholder={cartT.formName}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-zinc-900 bg-zinc-950/60 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-zinc-600 transition-all font-sans"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative">
                        <Phone className="absolute right-3 top-3.5 w-4 h-4 text-zinc-600" />
                        <input
                          type="tel"
                          placeholder={cartT.formPhone}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-zinc-900 bg-zinc-950/60 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-zinc-600 transition-all font-mono"
                          required
                        />
                      </div>

                      {/* Location */}
                      <div className="relative">
                        <MapPin className="absolute right-3 top-3.5 w-4 h-4 text-zinc-600" />
                        <input
                          type="text"
                          placeholder={cartT.formLocation}
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-zinc-900 bg-zinc-950/60 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-zinc-600 transition-all font-sans"
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
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border transition-all cursor-pointer ${
                              paymentMethod === 'cash'
                                ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-bold'
                                : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800'
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
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border transition-all cursor-pointer ${
                              paymentMethod === 'paypal'
                                ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-bold'
                                : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800'
                            }`}
                          >
                            <span className="text-xs">💳</span>
                            <span className="text-[11px] font-sans">
                              {lang === 'ar' ? 'باي بال - PayPal' : 'PayPal (פייפאל)'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-500 hover:to-yellow-300 disabled:from-zinc-800 disabled:to-zinc-900 text-black font-extrabold text-xs tracking-wider cursor-pointer shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-black border-r-transparent animate-spin" />
                            <span>{cartT.submitting}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>{cartT.btnWhatsApp}</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
