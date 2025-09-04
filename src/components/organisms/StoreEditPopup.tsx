// "use client";

// import React, { useState, useEffect } from 'react';
// import { X, Save, Upload, Building2, User, Mail, Phone, Globe, Tag, Calendar } from 'lucide-react';
// import Avatar from '@/components/atoms/Avatar';
// import { SaveButton, CancelButton } from '@/components/common/ActionButtons';
// import useTheme from '@/hooks/useTheme';

// interface Store {
//   id: string;
//   name: string;
//   category: string;
//   owner: {
//     name: string;
//     email: string;
//     phone: string;
//     avatar?: string;
//   };
//   website?: string;
//   rating: number;
//   totalSales: number;
//   monthlySales: number;
//   totalOrders: number;
//   status: 'active' | 'suspended';
//   createdAt: string;
// }

// interface StoreEditPopupProps {
//   store: Store | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (updatedStore: Store) => void;
// }

// const StoreEditPopup: React.FC<StoreEditPopupProps> = ({
//   store,
//   isOpen,
//   onClose,
//   onSave
// }) => {
//   const { isDark } = useTheme();
//   const [formData, setFormData] = useState<Store | null>(null);
//   const [loading, setSaving] = useState(false);
//   const [errors, setErrors] = useState<{[key: string]: string}>({});

//   useEffect(() => {
//     if (store) {
//       setFormData({ ...store });
//       setErrors({});
//     }
//   }, [store]);

//   const handleInputChange = (field: string, value: any) => {
//     if (!formData) return;
    
//     // Clear error for this field when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
    
//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');
//       if (parent === 'owner') {
//         setFormData({
//           ...formData,
//           owner: {
//             ...formData.owner,
//             [child]: value
//           }
//         });
//       }
//     } else {
//       setFormData({
//         ...formData,
//         [field]: value
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors: {[key: string]: string} = {};
    
//     if (!formData?.name.trim()) {
//       newErrors.name = 'اسم المتجر مطلوب';
//     }
    
//     if (!formData?.category) {
//       newErrors.category = 'فئة المتجر مطلوبة';
//     }
    
//     if (!formData?.owner.name.trim()) {
//       newErrors.ownerName = 'اسم التاجر مطلوب';
//     }
    
//     if (!formData?.owner.email.trim()) {
//       newErrors.ownerEmail = 'البريد الإلكتروني مطلوب';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner.email)) {
//       newErrors.ownerEmail = 'البريد الإلكتروني غير صحيح';
//     }
    
//     if (!formData?.owner.phone.trim()) {
//       newErrors.ownerPhone = 'رقم الهاتف مطلوب';
//     } else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(formData.owner.phone)) {
//       newErrors.ownerPhone = 'رقم الهاتف غير صحيح';
//     }
    
//     if (formData?.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
//       newErrors.website = 'رابط الموقع غير صحيح';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData || !validateForm()) return;

//     setSaving(true);
//     try {
//       // محاكاة حفظ البيانات
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       onSave(formData);
//       onClose();
//     } catch (error) {
//       console.error('خطأ في حفظ البيانات:', error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const getInitials = (name: string) => {
//     return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
//   };

//   const categories = [
//     'إلكترونيات',
//     'أزياء',
//     'تقنية',
//     'تجميل',
//     'رياضة',
//     'مطبخ',
//     'كتب',
//     'ألعاب',
//     'أثاث',
//     'سيارات',
//     'صحة',
//     'أخرى'
//   ];

//   if (!isOpen || !formData) return null;

//   const inputClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
//     isDark 
//       ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
//       : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
//   }`;

//   const errorInputClasses = `w-full px-4 py-3 border-2 border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
//     isDark 
//       ? 'bg-gray-700 text-white placeholder-gray-400' 
//       : 'bg-white text-gray-900 placeholder-gray-500'
//   }`;

//   const labelClasses = `block text-sm font-medium mb-2 ${
//     isDark ? 'text-gray-200' : 'text-gray-700'
//   }`;

//   const sectionClasses = `p-6 rounded-lg border ${
//     isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
//   }`;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//         onClick={!loading ? onClose : undefined}
//       />

//       {/* Modal */}
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div className={`relative w-full max-w-4xl rounded-lg shadow-xl transition-all ${
//           isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
//         }`}>
//           {/* Header */}
//           <div className={`flex items-center justify-between p-6 border-b ${
//             isDark ? 'border-gray-700' : 'border-gray-200'
//           }`}>
//             <h2 className={`text-2xl font-bold ${
//               isDark ? 'text-white' : 'text-gray-900'
//             }`}>
//               تعديل المتجر
//             </h2>
//             {!loading && (
//               <button
//                 onClick={onClose}
//                 className={`p-2 rounded-lg transition-colors ${
//                   isDark 
//                     ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
//                     : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
//                 }`}
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             )}
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
//             <div className="space-y-8">
              
//               {/* Store Avatar and Basic Info */}
//               <div className={sectionClasses}>
//                 <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${
//                   isDark ? 'text-white' : 'text-gray-900'
//                 }`}>
//                   <Building2 className="w-5 h-5" />
//                   معلومات المتجر الأساسية
//                 </h3>
                
//                 <div className="flex flex-col lg:flex-row gap-6">
//                   <div className="flex flex-col items-center gap-4">
//                     <Avatar
//                       src={formData.owner.avatar}
//                       alt={formData.name}
//                       size="xl"
//                       initials={!formData.owner.avatar ? getInitials(formData.name) : undefined}
//                     />
//                     <button
//                       type="button"
//                       disabled={loading}
//                       className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors ${
//                         loading
//                           ? 'opacity-50 cursor-not-allowed'
//                           : isDark 
//                           ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
//                           : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                       }`}
//                     >
//                       <Upload className="w-4 h-4" />
//                       تغيير الصورة
//                     </button>
//                   </div>

//                   <div className="flex-1 space-y-4">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                       <div>
//                         <label className={labelClasses}>
//                           <span className="flex items-center gap-2">
//                             <Tag className="w-4 h-4" />
//                             اسم المتجر *
//                           </span>
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.name}
//                           onChange={(e) => handleInputChange('name', e.target.value)}
//                           className={errors.name ? errorInputClasses : inputClasses}
//                           placeholder="أدخل اسم المتجر"
//                           disabled={loading}
//                           required
//                         />
//                         {errors.name && (
//                           <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//                         )}
//                       </div>
                      
//                       <div>
//                         <label className={labelClasses}>الفئة *</label>
//                         <select
//                           value={formData.category}
//                           onChange={(e) => handleInputChange('category', e.target.value)}
//                           className={errors.category ? errorInputClasses : inputClasses}
//                           disabled={loading}
//                           required
//                         >
//                           <option value="">اختر الفئة</option>
//                           {categories.map(category => (
//                             <option key={category} value={category}>
//                               {category}
//                             </option>
//                           ))}
//                         </select>
//                         {errors.category && (
//                           <p className="text-red-500 text-sm mt-1">{errors.category}</p>
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <label className={labelClasses}>
//                         <span className="flex items-center gap-2">
//                           <Globe className="w-4 h-4" />
//                           الموقع الإلكتروني
//                         </span>
//                       </label>
//                       <input
//                         type="url"
//                         value={formData.website || ''}
//                         onChange={(e) => handleInputChange('website', e.target.value)}
//                         className={errors.website ? errorInputClasses : inputClasses}
//                         placeholder="https://example.com"
//                         disabled={loading}
//                       />
//                       {errors.website && (
//                         <p className="text-red-500 text-sm mt-1">{errors.website}</p>
//                       )}
//                     </div>

//                     <div>
//                       <label className={labelClasses}>حالة المتجر *</label>
//                       <select
//                         value={formData.status}
//                         onChange={(e) => handleInputChange('status', e.target.value)}
//                         className={inputClasses}
//                         disabled={loading}
//                         required
//                       >
//                         <option value="active">نشط</option>
//                         <option value="suspended">محظور</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Owner Information */}
//               <div className={sectionClasses}>
//                 <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${
//                   isDark ? 'text-white' : 'text-gray-900'
//                 }`}>
//                   <User className="w-5 h-5" />
//                   معلومات التاجر
//                 </h3>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div>
//                     <label className={labelClasses}>
//                       <span className="flex items-center gap-2">
//                         <User className="w-4 h-4" />
//                         اسم التاجر *
//                       </span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.owner.name}
//                       onChange={(e) => handleInputChange('owner.name', e.target.value)}
//                       className={errors.ownerName ? errorInputClasses : inputClasses}
//                       placeholder="أدخل اسم التاجر"
//                       disabled={loading}
//                       required
//                     />
//                     {errors.ownerName && (
//                       <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
//                     )}
//                   </div>
                  
//                   <div>
//                     <label className={labelClasses}>
//                       <span className="flex items-center gap-2">
//                         <Phone className="w-4 h-4" />
//                         رقم الهاتف *
//                       </span>
//                     </label>
//                     <input
//                       type="tel"
//                       value={formData.owner.phone}
//                       onChange={(e) => handleInputChange('owner.phone', e.target.value)}
//                       className={errors.ownerPhone ? errorInputClasses : inputClasses}
//                       placeholder="+966 50 123 4567"
//                       disabled={loading}
//                       required
//                     />
//                     {errors.ownerPhone && (
//                       <p className="text-red-500 text-sm mt-1">{errors.ownerPhone}</p>
//                     )}
//                   </div>
                  
//                   <div className="lg:col-span-2">
//                     <label className={labelClasses}>
//                       <span className="flex items-center gap-2">
//                         <Mail className="w-4 h-4" />
//                         البريد الإلكتروني *
//                       </span>
//                     </label>
//                     <input
//                       type="email"
//                       value={formData.owner.email}
//                       onChange={(e) => handleInputChange('owner.email', e.target.value)}
//                       className={errors.ownerEmail ? errorInputClasses : inputClasses}
//                       placeholder="example@domain.com"
//                       disabled={loading}
//                       required
//                     />
//                     {errors.ownerEmail && (
//                       <p className="text-red-500 text-sm mt-1">{errors.ownerEmail}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Sales Information (Read Only) */}
//               <div className={sectionClasses}>
//                 <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${
//                   isDark ? 'text-white' : 'text-gray-900'
//                 }`}>
//                   <Calendar className="w-5 h-5" />
//                   إحصائيات المبيعات (للعرض فقط)
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className={`text-center p-4 rounded-lg ${
//                     isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
//                   }`}>
//                     <div className={`text-2xl font-bold mb-1 ${
//                       isDark ? 'text-blue-400' : 'text-blue-600'
//                     }`}>
//                       {formData.totalSales.toLocaleString()} ر.س
//                     </div>
//                     <div className={`text-sm ${
//                       isDark ? 'text-blue-300' : 'text-blue-500'
//                     }`}>
//                       إجمالي المبيعات
//                     </div>
//                   </div>
                  
//                   <div className={`text-center p-4 rounded-lg ${
//                     isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
//                   }`}>
//                     <div className={`text-2xl font-bold mb-1 ${
//                       isDark ? 'text-green-400' : 'text-green-600'
//                     }`}>
//                       {formData.monthlySales.toLocaleString()} ر.س
//                     </div>
//                     <div className={`text-sm ${
//                       isDark ? 'text-green-300' : 'text-green-500'
//                     }`}>
//                       مبيعات الشهر
//                     </div>
//                   </div>
                  
//                   <div className={`text-center p-4 rounded-lg ${
//                     isDark ? 'bg-purple-900/20 border border-purple-800' : 'bg-purple-50 border border-purple-200'
//                   }`}>
//                     <div className={`text-2xl font-bold mb-1 ${
//                       isDark ? 'text-purple-400' : 'text-purple-600'
//                     }`}>
//                       {formData.totalOrders}
//                     </div>
//                     <div className={`text-sm ${
//                       isDark ? 'text-purple-300' : 'text-purple-500'
//                     }`}>
//                       إجمالي الطلبات
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className={`flex justify-end gap-4 mt-8 pt-6 border-t ${
//               isDark ? 'border-gray-700' : 'border-gray-200'
//             }`}>
//               <CancelButton
//                 text="إلغاء"
//                 onClick={onClose}
//                 disabled={loading}
//               />
//               <SaveButton
//                 text={loading ? "جاري الحفظ..." : "حفظ التغييرات"}
//                 type="submit"
//                 loading={loading}
//                 disabled={loading}
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StoreEditPopup;