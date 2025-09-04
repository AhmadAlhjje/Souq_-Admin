"use client";
import React, { useState } from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import { User, Mail, Briefcase, Phone } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // التحقق من الاسم
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }

    // التحقق من البريد
    if (!formData.email.trim()) {
      newErrors.email = 'البريد مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'بريد غير صحيح';
    }

    // ✅ التحقق من رقم الجوال: فقط أنه ليس فارغًا
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الجوال مطلوب';
    }
    // ❌ لا نتحقق من التنسيق، لا نستخدم regex صارم

    // التحقق من الموضوع
    if (!formData.subject.trim()) {
      newErrors.subject = 'الموضوع مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // دوال التغيير
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
    if (errors.name) {
      setErrors(({ [e.target.id]: _, ...rest }) => rest);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
    if (errors.email) {
      setErrors(({ [e.target.id]: _, ...rest }) => rest);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, phone: e.target.value }));
    if (errors.phone) {
      setErrors(({ [e.target.id]: _, ...rest }) => rest);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, subject: e.target.value }));
    if (errors.subject) {
      setErrors(({ [e.target.id]: _, ...rest }) => rest);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert('تم الإرسال بنجاح!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* الصف الأول: الاسم + البريد + رقم الجوال */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          label="الاسم الكامل"
          id="name"
          type="text"
          placeholder="أدخل اسمك الكامل"
          value={formData.name}
          onChange={handleNameChange}
          icon={User}
          required
          error={errors.name}
        />

        <FormField
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="example@example.com"
          value={formData.email}
          onChange={handleEmailChange}
          icon={Mail}
          required
          error={errors.email}
        />

        <FormField
          label="رقم الجوال"
          id="phone"
          type="tel" // ✅ مهم: يفتح لوحة الأرقام على الموبايل
          placeholder="+966 5X XXX XXXX"
          value={formData.phone}
          onChange={handlePhoneChange}
          icon={Phone}
          required
          error={errors.phone}
        />
      </div>

      {/* الموضوع */}
      <FormField
        label="الموضوع"
        id="subject"
        type="text"
        placeholder="ما هو سبب التواصل؟"
        value={formData.subject}
        onChange={handleSubjectChange}
        icon={Briefcase}
        required
        error={errors.subject}
      />
      {/* القسم الأزرق: الرسالة + زر الإرسال */}
      <div
        className="rounded-lg p-6  space-y-6"
      >
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-right  ">
            الرسالة
          </label>
          <textarea 
  id="message"
  value={formData.message}
  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
  placeholder="اكتب رسالتك هنا..."
  className="
    w-full 
    px-4 py-3 
    pr-10 
    border-2
    border-teal-800 
    rounded-lg 
    focus:outline-none 
    focus:ring-2 
    text-right 
    text-sm 
    bg-white 
    placeholder-teal-800
    resize-y 
    min-h-28
  "
  style={{ direction: 'rtl' }}
/>
        </div>

        <div className="flex justify-center">
          <Button
            text="إرسال الرسالة"
            type="submit"
            variant="primary"
            size="lg"
            startIcon={<Icon name="chevron-right" />}
            className="bg-white text-teal-900 hover:bg-gray-100 px-8 py-3 text-base font-semibold rounded-lg transition"
          />
        </div>
      </div>
    </form>
  );
};

export default ContactForm;