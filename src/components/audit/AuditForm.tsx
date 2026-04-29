import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader2, Activity } from 'lucide-react';

interface AuditFormProps {
  onStartAudit: (name: string, specialty: string, clinic: string) => void;
  isLoading: boolean;
}

export const AuditForm: React.FC<AuditFormProps> = ({ onStartAudit, isLoading }) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && specialty) {
      onStartAudit(name, specialty, phone);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white p-10 rounded-sm shadow-2xl relative overflow-hidden group"
      dir="rtl"
    >
      <div className="lab-bracket-tl" />
      <div className="lab-bracket-tr" />
      <div className="lab-bracket-bl" />
      <div className="lab-bracket-br" />

      <div className="mb-10 flex items-center justify-between border-b border-lab-gray-100 pb-5">
        <div>
          <h2 className="text-[12px] font-display font-black text-lab-black uppercase tracking-[0.35em]">BUREAU D'AUDIT MEDICAL</h2>
          <p className="text-[8px] text-lab-gray-300 uppercase tracking-widest font-bold">ASWAN REGIONAL UNIT v2.0</p>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-lab-red rounded-full shadow-sm shadow-lab-red/20" />
          <div className="w-2 h-2 bg-lab-gray-100 rounded-full" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="relative">
          <label className="input-label-float right-2 left-auto font-display">
            اسم الطبيب بالكامل
          </label>
          <input
            id="doctor-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            placeholder="د. محمود حسن..."
            className="w-full px-6 py-5 bg-lab-off border border-lab-gray-100 rounded-sm text-sm font-black focus:border-lab-red focus:bg-white focus:ring-0 outline-none transition-all disabled:opacity-50 tracking-tighter placeholder:text-lab-gray-200 text-right font-arabic"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <label className="input-label-float right-2 left-auto font-display">
              رقم الهاتف المباشر
            </label>
            <input
              id="clinic-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              placeholder="01xxxxxxxxx"
              className="w-full px-6 py-5 bg-lab-off border border-lab-gray-100 rounded-sm text-sm font-black focus:border-lab-red focus:bg-white focus:ring-0 outline-none transition-all disabled:opacity-50 tracking-tighter placeholder:text-lab-gray-200 text-right font-mono"
            />
          </div>
          <div className="relative">
            <label className="input-label-float right-2 left-auto font-display">
              التخصص المهني
            </label>
            <input
              id="specialty"
              type="text"
              required
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              disabled={isLoading}
              placeholder="مثال: جراحة القلب"
              className="w-full px-6 py-5 bg-lab-off border border-lab-gray-100 rounded-sm text-sm font-black focus:border-lab-red focus:bg-white focus:ring-0 outline-none transition-all disabled:opacity-50 tracking-tighter placeholder:text-lab-gray-200 text-right font-arabic"
            />
          </div>
        </div>

        <div className="bg-lab-black p-6 rounded-sm border-r-4 border-lab-red shadow-inner text-right relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="lab-grid-bg h-full w-full" />
          </div>
          <div className="flex items-center gap-3 justify-end mb-3 relative z-10">
            <p className="text-[11px] font-display font-black text-white uppercase tracking-[0.25em]">بروتوكول الفحص نشط</p>
            <div className="w-2.5 h-2.5 bg-lab-red animate-pulse rounded-full shadow-lg shadow-lab-red/50" />
          </div>
          <p className="text-[12px] leading-relaxed text-white/50 font-medium tracking-tight font-arabic relative z-10">
            سيقوم النظام بفهرسة السجلات الرقمية المحلية، ومداخل خرائط جوجل، وقواعد بيانات الرعاية الصحية الإقليمية في مدينة أسوان.
          </p>
        </div>

        <button
          id="start-audit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full bg-lab-red text-white py-6 rounded-sm font-display font-black text-sm tracking-[0.4em] uppercase flex items-center justify-center gap-4 hover:bg-lab-red-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-lab-red/30 group/btn"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري فحص البيانات...
            </div>
          ) : (
            <>
              بدء عملية التدقيق
              <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform rotate-180" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};
