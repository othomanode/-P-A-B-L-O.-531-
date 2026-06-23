import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Unlock, X, Plus, Trash2, Edit2, Check, RotateCcw, 
  Sparkles, ShieldCheck, ShoppingBag, Eye, EyeOff, DollarSign, Image as ImageIcon,
  Crown
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { Product } from '../types';

interface OwnerPanelProps {
  lang: 'ar' | 'he';
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

export default function OwnerPanel({ 
  lang,
  isOpen,
  onClose,
  isAuthenticated,
  setIsAuthenticated
}: OwnerPanelProps) {
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'manage' | 'add'>('manage');

  const { products, addProduct, updateProduct, deleteProduct, resetToDefault } = useProducts();

  // Custom confirmation state
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'reset';
    productId?: string;
    productName?: string;
    message: string;
  } | null>(null);

  // Custom toast notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'warning';
    message: string;
  } | null>(null);

  // New product form states
  const [newProduct, setNewProduct] = useState({
    nameAr: '',
    nameHe: '',
    descAr: '',
    descHe: '',
    detailsAr: '',
    detailsHe: '',
    price: '₪',
    originalPrice: '',
    category: 'perfumes' as any,
    gender: 'unisex' as any,
    scentType: 'عود',
    imageUrl: '',
    specsAr: '',
    specsHe: '',
    isBestSeller: false,
    isMostRequested: false,
  });

  // Edit existing product item states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    nameHe: string;
    description: string;
    descriptionHe: string;
    price: string;
    originalPrice: string;
    imageUrl: string;
    category: 'perfumes' | 'bags' | 'amerBuhadana';
    gender: 'unisex' | 'men' | 'women';
    scentType: string;
    detailsAr: string;
    detailsHe: string;
    specsAr: string;
    specsHe: string;
    isBestSeller: boolean;
    isMostRequested: boolean;
  } | null>(null);

  const startEditing = (product: Product) => {
    setEditingProductId(product.id);
    setEditForm({
      name: product.name,
      nameHe: (product as any).nameHe || '',
      description: product.description || '',
      descriptionHe: (product as any).descriptionHe || '',
      price: product.price,
      originalPrice: product.originalPrice || '',
      imageUrl: product.imageUrl,
      category: product.category || 'perfumes',
      gender: product.gender || 'unisex',
      scentType: product.scentType || 'عود',
      detailsAr: product.details || '',
      detailsHe: (product as any).detailsHe || '',
      specsAr: Array.isArray(product.specs) ? product.specs.join(', ') : '',
      specsHe: Array.isArray((product as any).specsHe) ? (product as any).specsHe.join(', ') : '',
      isBestSeller: !!product.isBestSeller,
      isMostRequested: !!product.isMostRequested,
    });
  };

  const handleEditFieldChange = (field: string, value: any) => {
    if (!editForm) return;
    setEditForm(prev => prev ? { ...prev, [field]: value } : null);
  };

  const saveProductEdit = (id: string) => {
    if (!editForm) return;
    updateProduct(id, {
      name: editForm.name,
      nameHe: editForm.nameHe || undefined,
      description: editForm.description,
      descriptionHe: editForm.descriptionHe || undefined,
      price: editForm.price.startsWith('₪') ? editForm.price : `₪${editForm.price}`,
      originalPrice: editForm.originalPrice ? (editForm.originalPrice.startsWith('₪') ? editForm.originalPrice : `₪${editForm.originalPrice}`) : undefined,
      imageUrl: editForm.imageUrl,
      category: editForm.category,
      gender: editForm.gender,
      scentType: editForm.scentType,
      isBestSeller: editForm.isBestSeller,
      isMostRequested: editForm.isMostRequested,
      details: editForm.detailsAr || undefined,
      detailsHe: editForm.detailsHe || undefined,
      specs: editForm.specsAr ? editForm.specsAr.split(',').map(s => s.trim()) : undefined,
      specsHe: editForm.specsHe ? editForm.specsHe.split(',').map(s => s.trim()) : undefined,
    } as any);
    setEditingProductId(null);
    setEditForm(null);
    setNotification({
      type: 'success',
      message: lang === 'ar' ? 'تم تعديل تفاصيل المنتج بنجاح!' : 'פרטי המוצר עודכנו בהצלחה!'
    });
    setTimeout(() => setNotification(null), 4000);
  };

  // Gorgeous stock image presets for easy client selection
  const imagePresets = [
    { nameAr: 'عطر كريستالي داكن', nameHe: 'בושם קריסטל כהה', url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800' },
    { nameAr: 'عطر فرنسي كلاسيكي', nameHe: 'בושם צרפתי קלאסי', url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800' },
    { nameAr: 'إكسير بوهادانا الفاخر', nameHe: 'אליקסיר בוהדנה יוקרתי', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800' },
    { nameAr: 'حقيبة جيس جلد عسلي', nameHe: 'תיק גס עור חום', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800' },
    { nameAr: 'حقيبة كلاسيك سوداء', nameHe: 'תיק קלאסי שחור', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800' },
    { nameAr: 'حقيبة زمردية الإمبراطورية', nameHe: 'תיק אמרלד קיסרי', url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'Oo221211') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError(lang === 'ar' ? 'رمز الدخول غير صحيح!' : 'קוד גישה שגוי!');
    }
  };

  const handleToggleSoldOut = (id: string, currentStatus?: boolean) => {
    updateProduct(id, { isSoldOut: !currentStatus });
  };

  const handlePriceChange = (id: string, newPrice: string) => {
    updateProduct(id, { price: newPrice });
  };

  const handleOriginalPriceChange = (id: string, newOriginal: string) => {
    updateProduct(id, { originalPrice: newOriginal || undefined });
  };

  const handleDelete = (id: string, name: string) => {
    const confirmMessage = lang === 'ar' 
      ? `هل أنت متأكد من حذف المنتج: "${name}" نهائياً من المعرض؟` 
      : `האם למחוק את המוצר: "${name}" לצמיתות?`;
    setConfirmAction({
      type: 'delete',
      productId: id,
      productName: name,
      message: confirmMessage
    });
  };

  const executeConfirmAction = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete' && confirmAction.productId) {
      deleteProduct(confirmAction.productId);
      setNotification({
        type: 'success',
        message: lang === 'ar' ? 'تم حذف المنتج بنجاح من المعرض!' : 'המוצר נמחק בהצלחה מהגלריה!'
      });
      setTimeout(() => setNotification(null), 4000);
    } else if (confirmAction.type === 'reset') {
      resetToDefault();
      setNotification({
        type: 'success',
        message: lang === 'ar' ? 'تم إعادة ضبط المعرض للحالة الأصلية بنجاح!' : 'הגלריה אופסה בהצלחה לברירת המחדל!'
      });
      setTimeout(() => setNotification(null), 4000);
    }
    setConfirmAction(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.nameAr || !newProduct.price || !newProduct.imageUrl) {
      setNotification({
        type: 'warning',
        message: lang === 'ar' ? 'يرجى إدخال اسم المنتج والسعر ورابط الصورة!' : 'אנא הזן שם מוצר, מחיר וקישור לתמונה!'
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    const newId = newProduct.category === 'bags'
      ? `bag-guess-${Date.now()}`
      : `${newProduct.category}-${Date.now()}`;
    const productToAdd: Product = {
      id: newId,
      name: newProduct.nameAr,
      description: newProduct.descAr || 'منتج فاخر حصرى',
      price: newProduct.price.startsWith('₪') ? newProduct.price : `₪${newProduct.price}`,
      originalPrice: newProduct.originalPrice ? (newProduct.originalPrice.startsWith('₪') ? newProduct.originalPrice : `₪${newProduct.originalPrice}`) : undefined,
      category: newProduct.category,
      gender: newProduct.gender,
      scentType: newProduct.scentType,
      isBestSeller: newProduct.isBestSeller,
      isMostRequested: newProduct.isMostRequested,
      imageUrl: newProduct.imageUrl,
      rating: 5.0,
      details: newProduct.detailsAr || newProduct.descAr || 'تفاصيل المنتج الفاخر',
      specs: newProduct.specsAr ? newProduct.specsAr.split(',').map(s => s.trim()) : ['تغليف ملكي فاخر', 'جودة استثنائية مضمونة'],
      isSoldOut: false,
    };

    // Attach dynamic Hebrew translation variables to the object for translation overlay
    if (newProduct.nameHe) {
      (productToAdd as any).nameHe = newProduct.nameHe;
    }
    if (newProduct.descHe) {
      (productToAdd as any).descriptionHe = newProduct.descHe;
    }
    if (newProduct.detailsHe) {
      (productToAdd as any).detailsHe = newProduct.detailsHe;
    }
    if (newProduct.specsHe) {
      (productToAdd as any).specsHe = newProduct.specsHe.split(',').map(s => s.trim());
    }

    addProduct(productToAdd);

    // Reset Form
    setNewProduct({
      nameAr: '',
      nameHe: '',
      descAr: '',
      descHe: '',
      detailsAr: '',
      detailsHe: '',
      price: '₪',
      originalPrice: '',
      category: 'perfumes',
      gender: 'unisex',
      scentType: 'عود',
      imageUrl: '',
      specsAr: '',
      specsHe: '',
      isBestSeller: false,
      isMostRequested: false,
    });

    setActiveTab('manage');
    setNotification({
      type: 'success',
      message: lang === 'ar' ? 'تم إضافة المنتج الفاخر بنجاح!' : 'המוצר היוקרתי נוסף בהצלחה!'
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleResetCatalog = () => {
    const confirmMsg = lang === 'ar'
      ? 'تحذير: هل تود إعادة تعيين المعرض إلى الوضع الأصلي وإلغاء جميع التعديلات والمنتجات المضافة؟'
      : 'אזהרה: האם ברצונך לאפס לחלוטין את רשימת המוצרים לברירת המחדל?';
    setConfirmAction({
      type: 'reset',
      message: confirmMsg
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Main Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-[#0c0a0f] border border-amber-500/30 rounded-2xl shadow-[0_20px_50px_rgba(245,158,11,0.15)] overflow-hidden flex flex-col z-10"
              id="owner-panel-modal-body"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-zinc-900/80 bg-zinc-950/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm md:text-base font-extrabold text-white tracking-wide">
                      {lang === 'ar' ? 'منصة المشتريات والأسعار للرئيس التنفيذي' : 'ממשק ניהול בעלי האתר והמחירים'}
                    </h2>
                    <p className="text-[10px] text-amber-500/70 font-mono">SAMUEL LUXURY PORTAL</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 px-2.5 rounded-lg border border-zinc-900 bg-zinc-900/30 hover:bg-zinc-900 hover:text-white text-zinc-400 transition-all cursor-pointer text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 text-zinc-200">
                {!isAuthenticated ? (
                  /* Passcode Login View */
                  <form onSubmit={handleLogin} className="max-w-md mx-auto py-12 text-center" id="owner-login-form">
                    <div className="w-16 h-16 rounded-full bg-amber-500/5 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                      <Lock className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {lang === 'ar' ? 'إثبات صلاحيات المالك' : 'אימות זהות מנהל'}
                    </h3>
                    <p className="text-xs text-zinc-400 mb-6">
                      {lang === 'ar' 
                        ? 'يرجى إدخال الرقم السري التنفيذي الخاص لإجراء التعديلات وتغيير الأسعار والتحكم بالمخازن.' 
                        : 'אנא הזן את קוד הגישה לניהול לשינוי מחירים, הוספת מוצרים וניהול מלאי.'}
                    </p>

                    <div className="relative mb-4">
                      <input
                        type="password"
                        placeholder="••••"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full text-center tracking-widest text-lg py-3 px-4 rounded-xl border border-zinc-800 bg-zinc-950/80 focus:border-amber-500/50 text-amber-400 outline-none transition-colors"
                        autoFocus
                      />
                    </div>

                    {loginError && (
                      <p className="text-xs text-red-500 mt-2 mb-4 font-bold">{loginError}</p>
                    )}

                    <div className="text-[10px] text-zinc-500 mb-6 font-mono p-2 border border-dashed border-zinc-900 rounded bg-zinc-950/20">
                      {lang === 'ar' ? 'رمز الدخول الافتراضي للتجربة: 2026' : 'קוד גישה זמני לבדיקה: 2026'}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-l from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-300 text-black font-extrabold text-xs transition-all duration-300 shadow cursor-pointer uppercase tracking-wider"
                    >
                      {lang === 'ar' ? 'تأكيد الحيازة والصلاحية' : 'פתח ממשק ניהול'}
                    </button>
                  </form>
                ) : (
                  /* Owner Control Tab Screen */
                  <div className="space-y-6">
                    {/* Navigation tabs */}
                    <div className="flex border-b border-zinc-900">
                      <button
                        type="button"
                        onClick={() => setActiveTab('manage')}
                        className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
                          activeTab === 'manage'
                            ? 'border-amber-500 text-amber-400 font-bold'
                            : 'border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        {lang === 'ar' ? '📦 إدارة المعروضات والأسعار' : '📦 ניהול פריטים ומחירים'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('add')}
                        className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
                          activeTab === 'add'
                            ? 'border-amber-500 text-amber-400 font-bold'
                            : 'border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        {lang === 'ar' ? '✨ إضافة معروض جديد' : '✨ הוספת מוצר חדש'}
                      </button>
                    </div>

                    {activeTab === 'manage' ? (
                      /* MANAGE TAB */
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/50 border border-zinc-900">
                          <p className="text-xs text-zinc-400">
                            {lang === 'ar' 
                              ? `إجمالي المعروضات حالياً: ${products.length} قطعة` 
                              : `סה״כ מוצרים בקולקציה: ${products.length} פריטים`}
                          </p>
                          
                          <button
                            type="button"
                            onClick={handleResetCatalog}
                            className="px-4 py-2 text-[10px] font-extrabold border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-colors rounded-xl flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{lang === 'ar' ? 'إعادة ضبط المعرض للحالة الأصلية' : 'איפוס קולקציה לברירת מחדל'}</span>
                          </button>
                        </div>

                        {/* List of products */}
                        <div className="grid grid-cols-1 gap-3">
                          {products.map((item) => (
                            <div 
                              key={item.id} 
                              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col gap-4 ${
                                item.isSoldOut 
                                  ? 'bg-[#12080d]/60 border-red-500/20 hover:border-red-500/40' 
                                  : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'
                              }`}
                            >
                              {editingProductId === item.id ? (
                                <div className="w-full space-y-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                      <Edit2 className="w-3.5 h-3.5" />
                                      <span>{lang === 'ar' ? 'تعديل بيانات المنتج الفاخر' : 'עריכת פרטי מוצר יוקרתי'}</span>
                                    </h4>
                                    <span className="text-[10px] text-zinc-600 font-mono">{item.id}</span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                                    {/* Name input */}
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'اسم المنتج (عربي) *' : 'שם המוצר (בערבית) *'}</span>
                                      <input 
                                        type="text"
                                        value={editForm?.name || ''}
                                        onChange={(e) => handleEditFieldChange('name', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40"
                                      />
                                    </div>

                                    {/* Name He input */}
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'اسم المنتج (عبري)' : 'שם המוצר (בעברית)'}</span>
                                      <input 
                                        type="text"
                                        value={editForm?.nameHe || ''}
                                        onChange={(e) => handleEditFieldChange('nameHe', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40"
                                      />
                                    </div>

                                    {/* Description input */}
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'وصف مختصر (عربي) *' : 'תיאור קצר (בערבית) *'}</span>
                                      <input 
                                        type="text"
                                        value={editForm?.description || ''}
                                        onChange={(e) => handleEditFieldChange('description', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40"
                                      />
                                    </div>

                                    {/* Description He input */}
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'وصف مختصر (عبري)' : 'תיאור קצר (בעברית)'}</span>
                                      <input 
                                        type="text"
                                        value={editForm?.descriptionHe || ''}
                                        onChange={(e) => handleEditFieldChange('descriptionHe', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40"
                                      />
                                    </div>

                                    {/* Price */}
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'السعر الحالي *' : 'מחיר נוכחי *'}</span>
                                      <input 
                                        type="text"
                                        value={editForm?.price || ''}
                                        onChange={(e) => handleEditFieldChange('price', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-amber-400 font-bold outline-none focus:border-amber-500/40"
                                      />
                                    </div>

                                    {/* Original Price */}
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'السعر الأصلي (قبل الخصم)' : 'מחיר מקורי (לפני הנחה)'}</span>
                                      <input 
                                        type="text"
                                        value={editForm?.originalPrice || ''}
                                        placeholder="—"
                                        onChange={(e) => handleEditFieldChange('originalPrice', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-zinc-400 outline-none focus:border-amber-500/40"
                                      />
                                    </div>

                                    {/* Image URL input */}
                                    <div className="flex flex-col md:col-span-2">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'رابط الصورة المباشر *' : 'קישור לתמונה *'}</span>
                                      <input 
                                        type="text"
                                        value={editForm?.imageUrl || ''}
                                        onChange={(e) => handleEditFieldChange('imageUrl', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40 font-mono"
                                      />
                                    </div>

                                    {/* Category Select */}
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'الفئة المعتمدة *' : 'קטגוריה *'}</span>
                                      <select
                                        value={editForm?.category || 'perfumes'}
                                        onChange={(e) => handleEditFieldChange('category', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40 cursor-pointer"
                                      >
                                        <option value="perfumes">{lang === 'ar' ? '⚜️ عطور النيش العالمية' : 'בושם נישה'}</option>
                                        <option value="bags">{lang === 'ar' ? '👜 حقائب جيس الفاخرة' : 'תיקי גס'}</option>
                                        <option value="amerBuhadana">{lang === 'ar' ? '👑 رويال عامر بوهادانا' : 'קולקציית עאמר בוהדנה'}</option>
                                      </select>
                                    </div>

                                    {/* Target Audience/Gender Select */}
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'الجمهور المستهدف *' : 'קהל יעד *'}</span>
                                      <select
                                        value={editForm?.gender || 'unisex'}
                                        onChange={(e) => handleEditFieldChange('gender', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40 cursor-pointer"
                                      >
                                        <option value="unisex">{lang === 'ar' ? 'أرستقراطي للجنسين' : 'יוניסקס'}</option>
                                        <option value="men">{lang === 'ar' ? 'للرجال فقط' : 'גברים'}</option>
                                        <option value="women">{lang === 'ar' ? 'للنساء فقط' : 'נשים'}</option>
                                      </select>
                                    </div>

                                    {/* Scent/Leather Style Type */}
                                    <div className="flex flex-col md:col-span-2">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'السمة / نمط العطور والجلود *' : 'תג ניחוח / סגנון *'}</span>
                                      <input 
                                        type="text"
                                        value={editForm?.scentType || ''}
                                        onChange={(e) => handleEditFieldChange('scentType', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40"
                                      />
                                    </div>

                                    {/* Details Description Ar & He */}
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'التفاصيل الكاملة باللغة العربية' : 'תיאור מפורט בערבית'}</span>
                                      <textarea 
                                        value={editForm?.detailsAr || ''}
                                        onChange={(e) => handleEditFieldChange('detailsAr', e.target.value)}
                                        rows={2}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40 resize-none"
                                      />
                                    </div>

                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'التفاصيل الكاملة باللغة العبرية' : 'תיאור מפורט בעברית'}</span>
                                      <textarea 
                                        value={editForm?.detailsHe || ''}
                                        onChange={(e) => handleEditFieldChange('detailsHe', e.target.value)}
                                        rows={2}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40 resize-none"
                                      />
                                    </div>

                                    {/* Specs Ar & He */}
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'المواصفات بالعربية (مفصولة بفاصلة)' : 'מפרט בערבית (מופרד בפסיק)'}</span>
                                      <input 
                                        type="text"
                                        value={editForm?.specsAr || ''}
                                        onChange={(e) => handleEditFieldChange('specsAr', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40"
                                      />
                                    </div>

                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-zinc-500 font-bold mb-1">{lang === 'ar' ? 'المواصفات بالعبرية (مفصولة بفاصلة)' : 'מפרט בעברית (מופרד בפסיק)'}</span>
                                      <input 
                                        type="text"
                                        value={editForm?.specsHe || ''}
                                        onChange={(e) => handleEditFieldChange('specsHe', e.target.value)}
                                        className="py-1.5 px-3 text-xs rounded border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40"
                                      />
                                    </div>

                                    {/* Best Seller & requested checkboxes */}
                                    <div className="flex items-center gap-6 py-2 md:col-span-2">
                                      <label className="flex items-center gap-1.5 text-xs text-zinc-300 font-bold cursor-pointer select-none">
                                        <input
                                          type="checkbox"
                                          checked={!!editForm?.isBestSeller}
                                          onChange={(e) => handleEditFieldChange('isBestSeller', e.target.checked)}
                                          className="accent-amber-500 rounded"
                                        />
                                        <span>{lang === 'ar' ? 'الأكثر مبيعاً' : 'הכי נמכר'}</span>
                                      </label>

                                      <label className="flex items-center gap-1.5 text-xs text-zinc-300 font-bold cursor-pointer select-none">
                                        <input
                                          type="checkbox"
                                          checked={!!editForm?.isMostRequested}
                                          onChange={(e) => handleEditFieldChange('isMostRequested', e.target.checked)}
                                          className="accent-amber-500 rounded"
                                        />
                                        <span>{lang === 'ar' ? 'الأكثر طلباً' : 'המבוקש ביותר'}</span>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900" dir="ltr">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProductId(null);
                                        setEditForm(null);
                                      }}
                                      className="px-3 py-1.5 text-[10px] font-bold border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors rounded-lg cursor-pointer"
                                    >
                                      {lang === 'ar' ? 'إلغاء' : 'ביטול'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => saveProductEdit(item.id)}
                                      className="px-4 py-1.5 text-[10px] font-bold bg-amber-500 hover:bg-amber-400 text-black transition-colors rounded-lg flex items-center gap-1 cursor-pointer"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>{lang === 'ar' ? 'حفظ التغييرات' : 'שמור שינויים'}</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                                  {/* Left side: Pic & info */}
                                  <div className="flex items-center gap-3">
                                    <img 
                                      src={item.imageUrl} 
                                      alt={item.name} 
                                      className={`w-12 h-12 rounded object-cover border border-zinc-800 shrink-0 ${item.isSoldOut ? 'grayscale text-opacity-50' : ''}`}
                                    />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                                          item.category === 'bags' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                        }`}>
                                          {lang === 'ar' 
                                            ? (item.category === 'bags' ? 'حقيبة' : item.category === 'amerBuhadana' ? 'بوهادانا' : 'عطر') 
                                            : (item.category === 'bags' ? 'תיק' : item.category === 'amerBuhadana' ? 'בוהدנה' : 'בושם')
                                          }
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.id}</p>
                                    </div>
                                  </div>

                                  {/* Right side: Controls */}
                                  <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
                                    {/* Price inputs */}
                                    <div className="flex items-center gap-1.5">
                                      <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-500 uppercase font-mono mb-0.5">{lang === 'ar' ? 'السعر الحالي' : 'מחיר נוכחי'}</span>
                                        <input 
                                          type="text" 
                                          value={item.price}
                                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                          className="py-1 px-2.5 w-20 text-xs rounded border border-zinc-800 bg-zinc-900 text-amber-400 font-bold font-mono text-center outline-none focus:border-amber-500/40"
                                        />
                                      </div>

                                      <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-500 uppercase font-mono mb-0.5">{lang === 'ar' ? 'السعر الأصلي (قبل الخصم)' : 'מחיר מקורי (לפני הנחה)'}</span>
                                        <input 
                                          type="text" 
                                          value={item.originalPrice || ''}
                                          placeholder="—"
                                          onChange={(e) => handleOriginalPriceChange(item.id, e.target.value)}
                                          className="py-1 px-2.5 w-20 text-xs rounded border border-zinc-800 bg-zinc-900 text-zinc-400 font-mono text-center outline-none focus:border-amber-500/40"
                                        />
                                      </div>
                                    </div>

                                    {/* Sold Out Status Switch */}
                                    <button
                                      type="button"
                                      onClick={() => handleToggleSoldOut(item.id, item.isSoldOut)}
                                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                                        item.isSoldOut
                                          ? 'border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                          : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10'
                                      }`}
                                    >
                                      {item.isSoldOut ? (
                                        <>
                                          <EyeOff className="w-3 h-3 text-red-500" />
                                          <span>{lang === 'ar' ? 'نفذت (Sold Out)' : 'אזל מהמלאי'}</span>
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="w-3 h-3 text-emerald-400" />
                                          <span>{lang === 'ar' ? 'متوفر (In Stock)' : 'במלאי'}</span>
                                        </>
                                      )}
                                    </button>

                                    {/* Edit Product Details */}
                                    <button
                                      type="button"
                                      onClick={() => startEditing(item)}
                                      className="p-2 rounded-lg border border-amber-500/25 hover:border-amber-500 hover:bg-amber-500/15 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer shrink-0"
                                      title={lang === 'ar' ? 'تعديل تفاصيل المنتج الفاخر' : 'עריכת פרטי מוצר'}
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete item */}
                                    <button
                                      onClick={() => handleDelete(item.id, item.name)}
                                      className="p-2 rounded-lg border border-red-500/10 hover:border-red-500 hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-colors cursor-pointer shrink-0"
                                      title={lang === 'ar' ? 'حذف من المعرض' : 'מחק פריט'}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* ADD PRODUCT TAB */
                      <form onSubmit={handleCreateProduct} className="space-y-5" id="owner-add-product-form">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Name AR */}
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'إسم القطعة باللغة العربية *' : 'שם הפריט בערבית *'}</label>
                            <input
                              type="text"
                              required
                              value={newProduct.nameAr}
                              onChange={(e) => setNewProduct({ ...newProduct, nameAr: e.target.value })}
                              placeholder="مثال: عطر مسك السلطان الملكي"
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-white transition-colors"
                            />
                          </div>

                          {/* Name HE */}
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'إسم القطعة باللغة العبرية (إختياري)' : 'שם הפריט בעברית (רשות)'}</label>
                            <input
                              type="text"
                              value={newProduct.nameHe}
                              onChange={(e) => setNewProduct({ ...newProduct, nameHe: e.target.value })}
                              placeholder="דוגמה: בושם מוסק סולטן מלכותי"
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-white transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Description Ar */}
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'وصف مختصر باللغة العربية *' : 'תיאור קצר בערבית *'}</label>
                            <input
                              type="text"
                              required
                              value={newProduct.descAr}
                              onChange={(e) => setNewProduct({ ...newProduct, descAr: e.target.value })}
                              placeholder="مثال: تجسيد عطري ساحر بمزيج من روح المسك الملكية العتيقة والزعفران."
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-white transition-colors"
                            />
                          </div>

                          {/* Description He */}
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'وصف مختصر بالعبرية (إختياري)' : 'תיאור קצר בעברית'}</label>
                            <input
                              type="text"
                              value={newProduct.descHe}
                              onChange={(e) => setNewProduct({ ...newProduct, descHe: e.target.value })}
                              placeholder="דוגמה: יצירת פאר ריחנית המשלבת מוסק טהור וזעפרן."
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-white transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Price */}
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'السعر الحالي (مثال: ₪450) *' : 'מחיר נוכחי (למשל: ₪450) *'}</label>
                            <input
                              type="text"
                              required
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-amber-400 font-bold font-mono transition-colors"
                            />
                          </div>

                          {/* Original Price */}
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'السعر الأصلي قبل الخصم (اختياري)' : 'מחיר מקורי לפני הנחה (רשות)'}</label>
                            <input
                              type="text"
                              value={newProduct.originalPrice}
                              onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                              placeholder="مثال: ₪550"
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-zinc-400 font-mono transition-colors"
                            />
                          </div>

                          {/* Tag scent family */}
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'السمة / نمط العطور والجلود *' : 'תג ניחוח / סגנון *'}</label>
                            <input
                              type="text"
                              required
                              value={newProduct.scentType}
                              onChange={(e) => setNewProduct({ ...newProduct, scentType: e.target.value })}
                              placeholder="مثال: عود، أزهار، مسك، جلود، سافيانو"
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-zinc-300 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Category select */}
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'الفئة الفاخرة المعتمدة *' : 'קטגוריה *'}</label>
                            <select
                              value={newProduct.category}
                              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 text-white outline-none focus:border-amber-500/40 cursor-pointer"
                            >
                              <option value="perfumes">{lang === 'ar' ? '⚜️ عطور النيش العالمية' : 'בושם נישה'}</option>
                              <option value="bags">{lang === 'ar' ? '👜 حقائب جيس الفاخرة' : 'תיקי גס'}</option>
                              <option value="amerBuhadana">{lang === 'ar' ? '👑 رويال عامر بوهادانا' : 'קולקציית עאמר בוהדנה'}</option>
                            </select>
                          </div>

                          {/* Gender Filter */}
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'الجمهور المستهدف *' : 'קהל יעד *'}</label>
                            <select
                              value={newProduct.gender}
                              onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value as any })}
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 text-white outline-none focus:border-amber-500/40 cursor-pointer"
                            >
                              <option value="unisex">{lang === 'ar' ? 'أرستقراطي للجنسين' : 'יוניסקס'}</option>
                              <option value="men">{lang === 'ar' ? 'للرجال فقط' : 'גברים'}</option>
                              <option value="women">{lang === 'ar' ? 'للنساء فقط' : 'נשים'}</option>
                            </select>
                          </div>

                          {/* Best seller toggles */}
                          <div className="flex items-center gap-4 py-2">
                            <label className="flex items-center gap-1.5 text-xs text-zinc-300 font-bold cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={newProduct.isBestSeller}
                                onChange={(e) => setNewProduct({ ...newProduct, isBestSeller: e.target.checked })}
                                className="accent-amber-500 rounded"
                              />
                              <span>{lang === 'ar' ? 'الأكثر مبيعاً' : 'הכי נמכר'}</span>
                            </label>

                            <label className="flex items-center gap-1.5 text-xs text-zinc-300 font-bold cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={newProduct.isMostRequested}
                                onChange={(e) => setNewProduct({ ...newProduct, isMostRequested: e.target.checked })}
                                className="accent-amber-500 rounded"
                              />
                              <span>{lang === 'ar' ? 'الأكثر طلباً' : 'המבוקש ביותר'}</span>
                            </label>
                          </div>
                        </div>

                        {/* Image preset choices and URL */}
                        <div className="p-4 border border-zinc-900 bg-zinc-950/40 rounded-xl space-y-3">
                          <div>
                            <label className="block text-[11px] text-amber-500 font-bold mb-1.5 flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>{lang === 'ar' ? 'صورة القطعة الفاخرة (رابط مباشر) *' : 'תמונת המוצר (קישור ישיר) *'}</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={newProduct.imageUrl}
                              onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                              placeholder="أدخل رابط صورة مباشر أو اختر من النماذج في الأسفل"
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-white transition-colors"
                            />
                          </div>

                          {/* Presets Row */}
                          <div className="space-y-1.5">
                            <span className="block text-[9px] text-zinc-400 tracking-wider uppercase font-bold">{lang === 'ar' ? 'قوالب صور جاهزة سريعة التحميل وتنبض بالفخامة:' : 'בחירה מהירה מתוך גלריית תמונות לדוגמה:'}</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                              {imagePresets.map((preset, pId) => (
                                <button
                                  type="button"
                                  key={pId}
                                  onClick={() => setNewProduct({ ...newProduct, imageUrl: preset.url })}
                                  className={`p-1.5 rounded-lg border bg-zinc-900/40 hover:bg-zinc-900 transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                                    newProduct.imageUrl === preset.url ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800'
                                  }`}
                                >
                                  <img 
                                    src={preset.url} 
                                    alt="Preset" 
                                    className="w-6 h-6 object-cover rounded shrink-0"
                                  />
                                  <span className="text-[9px] text-zinc-400 line-clamp-1">
                                    {lang === 'ar' ? preset.nameAr : preset.nameHe}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Extra Details fields (Optional) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Details AR */}
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'التفاصيل الكاملة باللغة العربية (اختياري)' : 'תיאור מפורט בראשי פרקים בערבית'}</label>
                            <textarea
                              rows={2}
                              value={newProduct.detailsAr}
                              onChange={(e) => setNewProduct({ ...newProduct, detailsAr: e.target.value })}
                              placeholder="مثال: زجاجة عطرية كريستالية استثنائية مرصعة لتعكس التفرد الملكي."
                              className="w-full text-xs py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-white transition-colors resize-none"
                            />
                          </div>

                          {/* Details HE */}
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'التفاصيل الكاملة باللغة العبرية (اختياري)' : 'תיאור מפורט בראשי פרקים בעברית'}</label>
                            <textarea
                              rows={2}
                              value={newProduct.detailsHe}
                              onChange={(e) => setNewProduct({ ...newProduct, detailsHe: e.target.value })}
                              placeholder="דוגמה: בקבוק בושם מהודר משובץ קריסטלים המיועד לנוכחות מלכותית."
                              className="w-full text-xs py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-white transition-colors resize-none"
                            />
                          </div>
                        </div>

                        {/* Product specs (Optional) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'المواصفات بالعربية (مفصولة بفاصلة) *' : 'מפרט טכני ותכונות בערבית *'}</label>
                            <input
                              type="text"
                              value={newProduct.specsAr}
                              onChange={(e) => setNewProduct({ ...newProduct, specsAr: e.target.value })}
                              placeholder="مثال: دهن العود المعتق، ثبات يتجاوز 48 ساعة، زجاجة مصقولة يدوياً"
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-white transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-zinc-400 font-bold mb-1.5">{lang === 'ar' ? 'المواصفات بالعبرية (مفصولة بفاصلة)' : 'מפרט טכני ותכונות בעברית'}</label>
                            <input
                              type="text"
                              value={newProduct.specsHe}
                              onChange={(e) => setNewProduct({ ...newProduct, specsHe: e.target.value })}
                              placeholder="למשל: תמציות מלכותיות, עמידות ל-48 שעות, אריזה מקורית"
                              className="w-full text-xs py-2.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 focus:border-amber-500/40 outline-none text-white transition-colors"
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl bg-gradient-to-l from-amber-600 via-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-200 text-black font-extrabold text-xs transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'حفظ القطعة الفاخرة وإدراجها بالكاتالوج' : 'שמור פריט והוסף אותו לקטלוג'}</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Custom Toasts */}
              <AnimatePresence>
                {notification && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className={`absolute top-4 left-4 right-4 z-[1000] p-4 rounded-xl shadow-2xl border flex items-center justify-between gap-3 ${
                      notification.type === 'success'
                        ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-200'
                        : 'bg-amber-950/95 border-amber-500/30 text-amber-200'
                    }`}
                  >
                    <span className="text-xs font-bold leading-relaxed">{notification.message}</span>
                    <button
                      type="button"
                      onClick={() => setNotification(null)}
                      className="text-zinc-400 hover:text-white text-xs cursor-pointer px-2 py-1 rounded bg-black/20 font-sans"
                    >
                      {lang === 'ar' ? 'إغلاق' : 'סגור'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Custom Confirmation Modal */}
              <AnimatePresence>
                {confirmAction && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/95 backdrop-blur-md z-[1010] flex items-center justify-center p-6 text-center animate-none"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 20 }}
                      className="max-w-md w-full bg-zinc-950 border border-red-500/30 p-6 rounded-2xl shadow-2xl flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      
                      <h3 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wider">
                        {lang === 'ar' ? 'تأكيد الإجراء النهائي' : 'אישור פעולה לצמיתות'}
                      </h3>
                      
                      <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                        {confirmAction.message}
                      </p>

                      <div className="flex gap-3 w-full">
                        <button
                          type="button"
                          onClick={executeConfirmAction}
                          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition-colors cursor-pointer"
                        >
                          {lang === 'ar' ? 'نعم، تأكيد' : 'כן, מחק'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmAction(null)}
                          className="flex-1 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white font-extrabold text-xs transition-colors cursor-pointer"
                        >
                          {lang === 'ar' ? 'تراجع' : 'ביטול'}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
