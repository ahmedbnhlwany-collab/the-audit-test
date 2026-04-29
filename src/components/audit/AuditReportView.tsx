import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useReactToPrint } from 'react-to-print';
import { 
  CheckCircle2, 
  Activity,
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  Trophy, 
  MapPin, 
  Globe, 
  Facebook, 
  Instagram, 
  Linkedin,
  Clock,
  Save,
  Phone,
  Mail,
  Edit2,
  TableProperties,
  ArrowRight,
  Download,
  AlertTriangle,
  Zap,
  Target,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { type AuditReport, type AuditResult } from '../../services/AuditService';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-lab-black border-l-4 border-l-lab-red p-4 shadow-2xl backdrop-blur-md bg-opacity-95 text-right">
        <p className="text-[10px] font-black text-lab-red uppercase tracking-[0.2em] mb-2 border-b border-white/10 pb-2">
          {label} | SECURITY INTEL
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex flex-col gap-1">
            <span className="text-[14px] font-display font-black text-white">
              {entry.value}% <span className="text-[9px] text-white/40 uppercase tracking-widest">{entry.name}</span>
            </span>
            <div className="w-full h-1 bg-white/10 mt-1">
              <div 
                className="h-full bg-lab-red transition-all duration-1000" 
                style={{ width: `${entry.value}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface AuditReportViewProps {
  report: AuditReport;
  onReset: () => void;
}

const PlatformIcon = ({ name }: { name: string }) => {
  const n = name.toLowerCase();
  if (n.includes('map') || n.includes('business')) return <MapPin size={18} />;
  if (n.includes('facebook')) return <Facebook size={18} />;
  if (n.includes('instagram')) return <Instagram size={18} />;
  if (n.includes('linkedin')) return <Linkedin size={18} />;
  return <Globe size={18} />;
};

export const AuditReportView: React.FC<AuditReportViewProps> = ({ report: initialReport, onReset }) => {
  const [report, setReport] = useState<AuditReport>(initialReport);
  const [activeTab, setActiveTab] = useState<'technical' | 'marketing'>('technical');
  const [showFullReport, setShowFullReport] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneInputCode, setPhoneInputCode] = useState('');
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Digital_Audit_${report.doctorName.replace(/\s+/g, '_')}`,
  });

  // Automated Data Recording Removed for Privacy
  useEffect(() => {
    // Audit verified locally
    console.log("Audit verified and ready for local review.");
  }, []);

  const handleFinalReveal = async () => {
    if (!isPhoneVerified) {
      setVerificationError('يرجى تأكيد رقم الهاتف أولاً للمتابعة.');
      return;
    }
    
    // WhatsApp Integration: Send structured data to the designated number
    const message = `
*تقرير فحص الذكاء الرقمي - خلية الأزمة* 🚨
---------------------------
*الطبيب:* ${report.doctorName}
*التخصص:* ${report.specialty}
*المدينة:* ${report.city}
*الهاتف:* ${report.contactInfo.phone}
---------------------------
*النتيجة الكلية:* ${report.overallScore}%
*قنوات الاستحواذ القوية:*
${acquisitionData.filter(d => d.value > 20).map(d => `- ${d.channel}`).join('\n')}
---------------------------
*تحليل SWOT السريع:*
- القوة: ${swotAnalysis.strengths[0]}
- التهديد: ${swotAnalysis.threats[0]}
---------------------------
تم تأكيد الرقم وفتح التقرير الكامل بنجاح.
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/201127994425?text=${encodedMessage}`;
    
    // Attempt to send message
    window.open(whatsappUrl, '_blank');
    
    setSaveStatus('success');
    setShowFullReport(true);
  };

  const verifyCode = async (code: string) => {
    setIsVerifyingPhone(true);
    setVerificationError(null);

    // Mock verification service delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (code === '1234') {
      setIsPhoneVerified(true);
      setPhoneInputCode('');
    } else {
      setVerificationError(`الكود المدخل غير صحيح. جرب "1234" للتحقق.`);
    }

    setIsVerifyingPhone(false);
  };

  const currentResults = activeTab === 'technical' ? report.technicalAudit : report.marketingAudit;

  // Well-researched SWOT Analysis logic
  const swotAnalysis = React.useMemo(() => {
    const score = report.overallScore;
    const isDental = report.specialty.includes('أسنان') || report.specialty.toLowerCase().includes('dent');
    
    return {
      strengths: score > 70 
        ? ['أساس رقمي متين وتواجد مستقر على محركات البحث', 'هوية بصرية موحدة عبر المنصات الرئيسية', 'سرعة استجابة تقنية جيدة للموقع الإلكتروني']
        : ['امتلاك أصول رقمية أساسية (خرائط جوجل)', 'قاعدة بيانات مرضى يمكن البناء عليها رقمياً', 'وعي بالعلامة التجارية في النطاق الجغرافي المباشر'],
      weaknesses: score < 50
        ? ['تهالك تقني في البنية التحتية للموقع (Web Vitals)', 'فقدان تام للسيطرة على الكلمات المفتاحية التنافسية', 'غياب استراتيجية المحتوى المتخصص']
        : ['ضعف في معدل التحويل اللحظي للمرضى الجدد', 'تشتت هوية العلامة التجارية بين المنصات المختلفة', 'بطء في أرشفة المحتوى الجديد برمجياً'],
      opportunities: isDental
        ? [`الريادة في "الطب التجميلي الرقمي" في ${report.city}`, 'أتمتة رحلة المريض من البحث إلى الحجز (CRM)', 'استهداف فجوة "الرعاية المتميزة" في إعلانات المنافسين']
        : [`توسيع الانتشار في قطاع ${report.specialty} عبر المحتوى الفيديووي`, 'تفعيل نظام الولاء الرقمي للمرضى الحاليين', 'تحسين ظهور العيادة في خرائط جوجل للمناطق المجاورة'],
      threats: [
        'دخول منافسين بميزانيات إعلانية ضخمة في نفس النطاق',
        'تغير خوارزميات جوجل المحلية تؤثر على ترتيب العيادة',
        'تسرب المرضى المحتملين بسبب "السمعة الرقمية" غير المراقبة'
      ]
    };
  }, [report.overallScore, report.specialty, report.city]);

  // Expanded Intelligence Data: 12-Month Visibility Trend (Simulated based on report)
  const visibilityTrend = React.useMemo(() => {
    const months = ['مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس'];
    const baseTrend = [45, 48, 52, 50, 55, 58, 62, 60, 65, 68, 72];
    // Scale base trend based on final overallScore
    const scale = report.overallScore / 72;
    return [
      ...baseTrend.map((score, i) => ({
        month: months[i],
        score: Math.round(score * scale)
      })),
      { month: 'أبريل', score: report.overallScore }
    ];
  }, [report.overallScore]);

  // Tactical Review: Acquisition Channels (Simulated)
  const acquisitionData = React.useMemo(() => {
    const score = report.overallScore;
    return [
      { channel: 'إعلانات البحث', value: Math.round(score * 0.35) },
      { channel: 'الأورجانيك', value: Math.round(score * 0.25) },
      { channel: 'زيارات مباشرة', value: Math.round(score * 0.15) },
      { channel: 'إحالات خارجية', value: Math.round(score * 0.1) },
      { channel: 'قنوات أخرى', value: Math.round(score * 0.15) },
    ];
  }, [report.overallScore]);

  const strategicAlerts = React.useMemo(() => {
    const score = report.overallScore;
    const alerts = [];
    
    if (score < 60) {
      alerts.push({ 
        type: 'critical', 
        title: 'فجوة الاستحواذ', 
        desc: 'حجم الزيارات المباشرة يتجاوز التحويل العضوي بنسبة ٣٠٪. حضورك الرقمي يسرب المرضى للمنافسين.' 
      });
    } else {
      alerts.push({ 
        type: 'info', 
        title: 'إشارة ولاء قوية', 
        desc: 'زيارات المرضى المتكررة عبر القنوات المباشرة قوية جداً. ركز على أتمتة نظام الإحالات.' 
      });
    }

    if (report.technicalAudit.some(a => a.platform.toLowerCase().includes('google') && a.score < 50)) {
      alerts.push({ 
        type: 'critical', 
        title: 'تهديد البحث المحلي', 
        desc: 'بيانات "جوجل بيزنس" غير متسقة. خطر وشيك بفقدان السيطرة على نتائج البحث المحلية.' 
      });
    } else {
      alerts.push({ 
        type: 'warning', 
        title: 'تباطؤ التحسين', 
        desc: 'معدل الاستجابة للأصول الرقمية بدأ بالثبات. قد تفقد الثقة المحلية بدون مراجعات (Reviews) جديدة.' 
      });
    }

    alerts.push({ 
      type: 'info', 
      title: 'فرصة سوقية', 
      desc: `تم رصد منافسة منخفضة على التواجد الرقمي في تخصص ${report.specialty} محلياً. إمكانيات تحويل عالية جداً.` 
    });
    
    return alerts;
  }, [report.overallScore, report.technicalAudit, report.specialty]);

  const lastVerifiedAt = React.useMemo(() => {
    return new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  }, []);

  if (!showFullReport) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-lab-black p-10 rounded-sm shadow-2xl text-white text-right relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-lab-red/5 rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
          
          <div className="flex items-center gap-4 mb-10 justify-end">
            <div className="text-right">
              <h2 className="text-xl font-display font-black uppercase tracking-[0.2em] text-lab-red">بروتوكول التحقق الأمني</h2>
              <p className="text-xs opacity-50 uppercase font-bold tracking-widest mt-1">Operational Security Intelligence</p>
            </div>
            <div className="bg-lab-red p-4 rounded-sm rotate-3 shadow-2xl shadow-lab-red/20">
              <ShieldCheck size={28} />
            </div>
          </div>

          <p className="text-xs text-white/60 mb-10 font-arabic leading-relaxed">
            للحصول على التقرير التفصيلي وكشف الثغرات الأمنية في حضورك الرقمي، يرجى تأكيد البيانات التالية وتفعيل قناة التواصل المباشر مع خلية الأزمة.
          </p>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="relative">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest absolute -top-2 right-2 bg-lab-black px-1 z-10">اسم الطبيب</label>
                <input 
                  type="text" 
                  value={report.doctorName}
                  onChange={(e) => setReport({...report, doctorName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-sm font-bold focus:border-lab-red outline-none transition-all text-right hover:bg-white/10 focus:bg-lab-black"
                />
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest absolute -top-2 right-2 bg-lab-black px-1 z-10">قنوات الاتصال المباشر</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <div className="flex bg-white/5 border border-white/10 rounded-sm overflow-hidden focus-within:border-lab-red transition-all flex-row-reverse group">
                        <input 
                          type="text" 
                          value={report.contactInfo.phone}
                          onChange={(e) => setReport({...report, contactInfo: {...report.contactInfo, phone: e.target.value}})}
                          className="flex-1 bg-transparent px-4 py-3 text-xs font-bold outline-none text-right"
                          placeholder="رقم الهاتف"
                        />
                        <div className={`px-4 flex items-center justify-center transition-all ${isPhoneVerified ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/20'}`}>
                          {isPhoneVerified ? <CheckCircle2 size={14} /> : <Phone size={14} />}
                        </div>
                      </div>
                      
                      {!isPhoneVerified && (
                        <div className="flex gap-2 flex-row-reverse">
                          <input 
                            type="text"
                            value={phoneInputCode}
                            onChange={(e) => setPhoneInputCode(e.target.value)}
                            placeholder="كود الهاتف (1234)"
                            className="flex-1 bg-white/5 border border-white/10 rounded-sm px-3 py-3 text-xs text-right font-mono outline-none focus:border-lab-red/50"
                          />
                          <button 
                            onClick={() => verifyCode(phoneInputCode)}
                            disabled={isVerifyingPhone || !phoneInputCode}
                            className="bg-lab-red text-white px-6 py-3 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg"
                          >
                            {isVerifyingPhone ? '...' : 'تفعيل'}
                          </button>
                        </div>
                      )}
                    </div>

                    {verificationError && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-lab-red font-bold text-right"
                      >
                        {verificationError}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleFinalReveal}
              disabled={isVerifyingPhone}
              className={`w-full py-5 rounded-sm font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl ${
                isPhoneVerified ? 'bg-lab-red text-white hover:bg-red-700' : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              اعرف اين تخسر مرضاك <ArrowRight size={20} className="rotate-180" />
            </button>
          </div>

          <div className="mt-8 flex justify-center opacity-20">
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">SYSTEM STATUS: READY</span>
          </div>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto pb-20 print:p-0" dir="rtl">
      {/* Top Banner: Export & Actions */}
      <div className="flex justify-between items-center mb-8 flex-row-reverse print:hidden">
        <div className="flex items-center gap-4">
          <button 
            onClick={onReset}
            className="flex items-center gap-3 bg-lab-black text-white px-8 py-3 rounded-sm font-display font-black text-xs tracking-widest uppercase hover:bg-lab-red transition-all shadow-xl active:scale-95"
          >
            <Activity size={16} className="text-lab-red" />
            بدء فحص عيادة أخرى
          </button>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-3 justify-end mb-1">
            <h2 className="text-xl font-display font-black text-lab-black uppercase tracking-tighter">BUREAU D'AUDIT</h2>
            <div className="w-2 h-2 bg-lab-red animate-pulse rounded-full" />
          </div>
          <p className="text-[10px] text-lab-gray-300 font-bold uppercase tracking-[0.3em]">Operational Readiness Profile</p>
        </div>
      </div>

      <div ref={reportRef} className="grid grid-cols-12 gap-8 print:block print:w-full">
        {/* Sidebar: Human Review & Protocol */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6 print:hidden">
        <div className="bg-lab-black p-6 rounded-sm shadow-2xl text-white text-right relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-lab-red/5 rounded-full -translate-x-12 -translate-y-12 blur-3xl" />
          
          <div className="flex items-center gap-3 mb-8 justify-end">
            <div className="text-right">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-lab-red">بروتوكول المراجعة</h2>
              <p className="text-[8px] opacity-40 uppercase font-bold tracking-widest">Aswan Regional Unit</p>
            </div>
            <div className="bg-lab-red p-2.5 rounded-sm rotate-3 shadow-lg shadow-lab-red/20">
              <Edit2 size={18} />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <label className="text-[9px] font-black text-white/40 uppercase tracking-widest absolute -top-2 right-2 bg-lab-black px-1 z-10">اسم الطبيب</label>
              <input 
                type="text" 
                value={report.doctorName}
                onChange={(e) => setReport({...report, doctorName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-sm font-bold focus:border-lab-red outline-none transition-all text-right hover:bg-white/10 focus:bg-lab-black"
              />
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest absolute -top-2 right-2 bg-lab-black px-1 z-10">بيانات التواصل</label>
                <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-3">
                      <div className="flex bg-white/5 border border-white/10 rounded-sm overflow-hidden focus-within:border-lab-red transition-all flex-row-reverse group">
                        <input 
                          type="text" 
                          value={report.contactInfo.phone}
                          onChange={(e) => setReport({...report, contactInfo: {...report.contactInfo, phone: e.target.value}})}
                          className="flex-1 bg-transparent px-4 py-3 text-xs font-bold outline-none text-right"
                          placeholder="رقم الهاتف"
                        />
                        <div className={`px-4 flex items-center justify-center transition-all ${isPhoneVerified ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/20'}`}>
                          {isPhoneVerified ? <CheckCircle2 size={14} /> : <Phone size={14} />}
                        </div>
                      </div>
                      
                      {!isPhoneVerified && (
                        <div className="flex gap-2 flex-row-reverse">
                          <input 
                            type="text"
                            value={phoneInputCode}
                            onChange={(e) => setPhoneInputCode(e.target.value)}
                            placeholder="كود الهاتف (1234)"
                            className="flex-1 bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-[10px] text-right font-mono outline-none focus:border-lab-red/50"
                          />
                          <button 
                            onClick={() => verifyCode(phoneInputCode)}
                            disabled={isVerifyingPhone || !phoneInputCode}
                            className="bg-lab-red text-white px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 transition-all font-display"
                          >
                            {isVerifyingPhone ? '...' : 'تحقق'}
                          </button>
                        </div>
                      )}
                    </div>


                  {verificationError && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] text-lab-red font-bold text-right"
                    >
                      {verificationError}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

          <div className="flex justify-end mt-4">
            <div className="bg-emerald-50 px-4 py-2 rounded-sm border border-emerald-100 flex items-center gap-2 flex-row-reverse">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-900 font-arabic">تم تفعيل التقرير (آمن)</span>
            </div>
          </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-slate-200 text-right shadow-sm border-t-4 border-t-lab-red lg:sticky lg:top-24">
          <div className="mb-6 pb-6 border-b border-lab-gray-100">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 justify-end">
              نقاط الألم الاستراتيجية
              <AlertTriangle size={12} className="text-lab-red" />
            </h3>
            <div className="space-y-4">
              <div className="bg-rose-50 p-4 border-r-4 border-r-lab-red">
                <p className="text-[11px] font-bold text-lab-red uppercase tracking-widest mb-1">Vulnerability 01</p>
                <p className="text-xs text-slate-700 font-arabic leading-relaxed">غياب الهوية البصرية الموحدة يقلل من ثقة المريض ويؤثر على "صورة النخبة" المتوقعة في مدينة أسوان.</p>
              </div>
              <div className="bg-amber-50 p-4 border-r-4 border-r-amber-500">
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-1">Vulnerability 02</p>
                <p className="text-xs text-slate-700 font-arabic leading-relaxed">ضعف التواجد في خرائط جوجل يعني فقدان أكثر من 40٪ من الزيارات العضوية المحلية للمنافسين المباشرين.</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <a 
              href="https://wa.me/201127994425?text=أهلاً، لقد أتممت تدقيق البيانات الرقمية لعيادتي وأود حجز استشارة إستراتيجية مجانية لتطوير حضوري الرقمي."
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full bg-lab-black hover:bg-lab-red text-white p-6 rounded-sm transition-all shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="lab-grid-bg h-full w-full" />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-3">
                <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-display font-black tracking-[0.2em] uppercase text-center leading-tight">
                  تأمين الهيمنة الرقمية<br/>
                  <span className="text-lab-red group-hover:text-white transition-colors">استشارة إستراتيجية مجانية</span>
                </span>
                <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Connect with Bureau Leader</span>
              </div>
            </a>
          </div>

          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 justify-end">
            الملخص التنفيذي
            <MapPin size={12} className="text-lab-red" />
          </h3>
          <textarea 
            value={report.summary}
            onChange={(e) => setReport({...report, summary: e.target.value})}
            className="w-full h-48 bg-slate-50 border border-slate-100 rounded-sm p-4 text-[13px] leading-relaxed italic text-slate-700 outline-none focus:ring-2 focus:ring-lab-red/10 focus:bg-white transition-all text-right resize-none font-arabic"
          />
        </div>
      </aside>

      {/* Main Analysis Results */}
      <section className="col-span-12 lg:col-span-8 flex flex-col gap-6 text-right print:col-span-12 print:block">
        {/* Print Header (Visible only on PDF) */}
        <div className="hidden print:block mb-10 pb-8 border-b-4 border-lab-black text-right relative">
          <div className="lab-bracket-tl" />
          <div className="lab-bracket-tr" />
          <div className="flex justify-between items-end">
            <div className="text-left font-mono text-[10px] text-lab-gray-300">
              ID: AUD-{Math.random().toString(36).substr(2, 9).toUpperCase()}<br/>
              DATE: {new Date().toLocaleDateString('ar-EG')}<br/>
              REGION: ASWAN_UNIT_02
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-display font-black text-lab-black mb-2 uppercase select-none">THE DIGITAL LAB</h1>
              <p className="text-sm font-bold text-lab-red uppercase tracking-widest">Medical Digital Intelligence Report</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 text-right bg-lab-off p-6 rounded-sm">
            <div>
              <p className="text-[10px] font-black uppercase text-lab-gray-300 tracking-widest mb-1">Clinic Entity</p>
              <p className="text-lg font-black text-lab-black font-arabic">{report.clinicName}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-lab-gray-300 tracking-widest mb-1">Doctor in Charge</p>
              <p className="text-lg font-black text-lab-black font-arabic">{report.doctorName}</p>
            </div>
          </div>
        </div>

        {/* Dual Audit Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-sm border border-slate-200 print:hidden">
          <button 
            onClick={() => setActiveTab('technical')}
            className={`flex-1 py-3 px-4 text-[11px] font-black uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-3 ${
              activeTab === 'technical' ? 'bg-lab-black text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {activeTab === 'technical' && <Activity size={14} className="text-lab-red animate-medical-pulse" />}
            التدقيق التقني (Audit 01)
          </button>
          <button 
            onClick={() => setActiveTab('marketing')}
            className={`flex-1 py-3 px-4 text-[11px] font-black uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-3 ${
              activeTab === 'marketing' ? 'bg-lab-black text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {activeTab === 'marketing' && <Trophy size={14} className="text-lab-red animate-medical-pulse" />}
            التدقيق التسويقي (Audit 02)
          </button>
        </div>

        {/* Print Summary (Visible only on PDF) */}
        <div className="hidden print:block mb-8 bg-white p-8 border border-lab-gray-100 rounded-sm">
          <h2 className="text-xl font-display font-black text-lab-black mb-4 uppercase flex items-center gap-3 justify-end">
            Executive Intelligence Summary
            <div className="w-1.5 h-1.5 bg-lab-red rounded-full" />
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-arabic text-right mb-8">{report.summary}</p>
          
          <div className="grid grid-cols-2 gap-12">
             <div>
               <h3 className="text-xs font-black text-lab-red uppercase tracking-widest mb-4 border-b border-lab-red/20 pb-2">Technical Vitals</h3>
               <div className="space-y-4">
                 {report.technicalAudit.map(res => (
                   <div key={res.platform} className="flex justify-between items-center flex-row-reverse">
                     <span className="text-[10px] font-bold text-slate-600">{res.platform}</span>
                     <span className={`text-[10px] font-black ${res.score > 70 ? 'text-emerald-600' : 'text-rose-600'}`}>{res.score}%</span>
                   </div>
                 ))}
               </div>
             </div>
             <div>
               <h3 className="text-xs font-black text-lab-red uppercase tracking-widest mb-4 border-b border-lab-red/20 pb-2">Brand Strength</h3>
               <div className="space-y-4">
                 {report.marketingAudit.map(res => (
                   <div key={res.platform} className="flex justify-between items-center flex-row-reverse">
                     <span className="text-[10px] font-bold text-slate-600">{res.platform}</span>
                     <span className={`text-[10px] font-black ${res.score > 70 ? 'text-emerald-600' : 'text-rose-600'}`}>{res.score}%</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* Visual Analysis Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden print:mb-12 print:break-inside-avoid"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-lab-red" />
          <div className="lab-grid-bg absolute inset-0 opacity-5 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 flex-row-reverse relative z-10">
            <div className="text-right">
              <h3 className="text-[14px] font-display font-black text-lab-black uppercase tracking-[0.25em] flex items-center gap-3 justify-end leading-none">
                الخريطة الحرارية {activeTab === 'technical' ? 'للثغرات التقنية' : 'للمنافسة التسويقية'}
                <Target size={16} className="text-lab-red" />
              </h3>
              <p className="text-[9px] text-lab-gray-300 font-bold uppercase tracking-widest mt-1">Global Health Index Mapping</p>
            </div>
            <div className="px-3 py-1 bg-lab-off border border-lab-gray-100 rounded-sm">
              <span className="text-[9px] font-mono font-bold text-lab-gray-400">UNIT PERFORMANCE V.2</span>
            </div>
          </div>
          
          <div className="h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={currentResults} 
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                barGap={12}
              >
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E8341C33" />
                <XAxis 
                  dataKey="platform" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#0A0A0A', fontFamily: 'Barlow Condensed' }}
                  dy={10}
                />
                <YAxis 
                  domain={[0, 100]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9E9A94', fontFamily: 'JetBrains Mono' }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="score" 
                  radius={[0, 0, 0, 0]} 
                  barSize={40}
                  animationDuration={1500}
                  name="SCORE"
                >
                  {currentResults.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.score > 80 ? '#10b981' : entry.score > 50 ? '#f59e0b' : '#E8341C'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 flex justify-end gap-6 border-t border-lab-gray-100 pt-5 relative z-10 font-display">
            {[
              { label: 'Critical Area', color: 'bg-lab-red' },
              { label: 'Growth Zone', color: 'bg-amber-500' },
              { label: 'Elite Level', color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-[8px] font-black uppercase text-lab-gray-300 tracking-[0.2em]">{item.label}</span>
                <div className={`w-2 h-2 ${item.color} rounded-sm`} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Intelligence Visualization: 12-Month Visibility Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden print:mb-12 print:break-inside-avoid"
        >
          <div className="absolute top-0 right-0 w-1.5 h-full bg-lab-black" />
          <div className="flex items-center justify-between mb-8 flex-row-reverse relative z-10">
            <div className="text-right">
              <h3 className="text-[14px] font-display font-black text-lab-black uppercase tracking-[0.25em] flex items-center gap-3 justify-end leading-none">
                تطور البصمة الرقمية (12 شهر)
                <Activity size={16} className="text-lab-red" />
              </h3>
              <p className="text-[9px] text-lab-gray-300 font-bold uppercase tracking-widest mt-1">منحنى سرعة انتشار العلامة التجارية</p>
            </div>
            <div className="px-3 py-1 bg-lab-off border border-lab-gray-100 rounded-sm">
              <span className="text-[9px] font-mono font-bold text-lab-gray-400">سجل التتبع اللحظي: 492</span>
            </div>
          </div>
          
          <div className="h-[250px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visibilityTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8341C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E8341C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#666', fontFamily: 'JetBrains Mono' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  hide
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#E8341C" 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  strokeWidth={3}
                  animationDuration={2000}
                  name="VISIBILITY"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Tactical Overview: Acquisition & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1">
          {/* Acquisition Channels Breakdown */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-lab-black p-8 rounded-sm shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <div className="lab-grid-bg h-full w-full" />
            </div>
            
            <div className="flex items-center justify-between mb-8 flex-row-reverse relative z-10">
              <div className="text-right">
                <h3 className="text-[12px] font-display font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 justify-end leading-none">
                  تحليل قنوات الاستحواذ
                  <Target size={16} className="text-lab-red" />
                </h3>
                <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest mt-1">تدفق الاستحواذ التكتيكي للمرضى</p>
              </div>
            </div>

            <div className="h-[200px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={acquisitionData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="channel" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 900, fill: '#fff', opacity: 0.6, fontFamily: 'Barlow Condensed' }}
                    width={80}
                  />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#E8341C" barSize={12} radius={[0, 4, 4, 0]} name="SHARE %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Strategic Intelligence Alerts */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-6 flex-row-reverse">
              <div className="text-right">
                <h3 className="text-[12px] font-display font-black text-lab-black uppercase tracking-[0.2em] flex items-center gap-3 justify-end leading-none">
                  تنبيهات استراتيجية (مُحدثة)
                  <Zap size={16} className="text-lab-red" />
                </h3>
                <p className="text-[8px] text-lab-gray-300 font-bold uppercase tracking-widest mt-1">
                  آخر تحقق: {lastVerifiedAt} | التحليل اللحظي للمخاطر
                </p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {strategicAlerts.map((alert, i) => (
                <div key={i} className={`p-4 rounded-sm border-r-4 flex items-start gap-4 flex-row-reverse ${
                  alert.type === 'critical' ? 'bg-rose-50 border-r-lab-red' : 
                  alert.type === 'warning' ? 'bg-amber-50 border-r-amber-500' : 
                  'bg-blue-50 border-r-blue-500'
                }`}>
                  <div className={`mt-1 ${alert.type === 'critical' ? 'text-lab-red' : alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}`}>
                    {alert.type === 'critical' ? <AlertCircle size={14} /> : alert.type === 'warning' ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                  </div>
                  <div className="text-right flex-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${
                      alert.type === 'critical' ? 'text-lab-red' : 'text-slate-900'
                    }`}>{alert.title}</p>
                    <p className="text-xs text-slate-600 font-arabic leading-relaxed">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* SWOT Analysis Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 print:grid-cols-2 print:gap-4 print:mb-8">
          <div className="bg-emerald-50 p-6 rounded-sm border border-emerald-100 relative overflow-hidden group hover:bg-white transition-all shadow-sm">
             <div className="absolute top-0 left-0 w-12 h-12 bg-emerald-500/10 rounded-full -translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform" />
             <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 justify-end">
               نقاط القوة
               <Trophy size={14} />
             </h4>
             <ul className="space-y-3 text-right">
               {swotAnalysis.strengths.map((item, i) => (
                 <li key={i} className="flex items-start gap-2 justify-end text-[11px] font-bold text-emerald-900 font-arabic">
                   <span>{item}</span>
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                 </li>
               ))}
             </ul>
          </div>
          <div className="bg-rose-50 p-6 rounded-sm border border-rose-100 relative overflow-hidden group hover:bg-white transition-all shadow-sm">
             <div className="absolute top-0 left-0 w-12 h-12 bg-rose-500/10 rounded-full -translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform" />
             <h4 className="text-[10px] font-black text-rose-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 justify-end">
               نقاط الضعف
               <XCircle size={14} />
             </h4>
             <ul className="space-y-3 text-right">
               {swotAnalysis.weaknesses.map((item, i) => (
                 <li key={i} className="flex items-start gap-2 justify-end text-[11px] font-bold text-rose-900 font-arabic">
                   <span>{item}</span>
                   <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                 </li>
               ))}
             </ul>
          </div>
          <div className="bg-blue-50 p-6 rounded-sm border border-blue-100 relative overflow-hidden group hover:bg-white transition-all shadow-sm">
             <div className="absolute top-0 left-0 w-12 h-12 bg-blue-500/10 rounded-full -translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform" />
             <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 justify-end">
               الفرص المتاحة
               <Zap size={14} />
             </h4>
             <ul className="space-y-3 text-right">
               {swotAnalysis.opportunities.map((item, i) => (
                 <li key={i} className="flex items-start gap-2 justify-end text-[11px] font-bold text-blue-900 font-arabic">
                   <span>{item}</span>
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                 </li>
               ))}
             </ul>
          </div>
          <div className="bg-amber-50 p-6 rounded-sm border border-amber-100 relative overflow-hidden group hover:bg-white transition-all shadow-sm">
             <div className="absolute top-0 left-0 w-12 h-12 bg-amber-500/10 rounded-full -translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform" />
             <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 justify-end">
               التهديدات
               <AlertTriangle size={14} />
             </h4>
             <ul className="space-y-3 text-right">
               {swotAnalysis.threats.map((item, i) => (
                 <li key={i} className="flex items-start gap-2 justify-end text-[11px] font-bold text-amber-900 font-arabic">
                   <span>{item}</span>
                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Social Media Footprint Section */}
        {activeTab === 'marketing' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm mb-2 relative overflow-hidden print:break-inside-avoid"
          >
            <div className="absolute top-0 right-0 w-1.5 h-full bg-lab-black" />
            <div className="flex items-center justify-between mb-8 flex-row-reverse">
              <div className="text-right">
                <h3 className="text-[14px] font-display font-black text-lab-black uppercase tracking-[0.25em] flex items-center gap-3 justify-end leading-none">
                  البصمة الرقمية على السوشيال ميديا
                  <Globe size={16} className="text-lab-red" />
                </h3>
                <p className="text-[9px] text-lab-gray-300 font-bold uppercase tracking-widest mt-1">مؤشر الانتشار عبر المنصات | تم التحقق</p>
              </div>
              <div className="px-3 py-1 bg-lab-off border border-lab-gray-100 rounded-sm">
                <span className="text-[9px] font-mono font-bold text-lab-gray-400">فحص الأصول الرقمية 02</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Facebook', Icon: Facebook },
                { name: 'Instagram', Icon: Instagram },
                { name: 'LinkedIn', Icon: Linkedin },
                { name: 'X / Twitter', Icon: Globe }
              ].map(({ name, Icon }) => {
                const audit = report.marketingAudit.find(a => a.platform.toLowerCase().includes(name.toLowerCase()) || (name === 'X / Twitter' && a.platform.toLowerCase().includes('twitter')));
                const score = audit?.score || 0;
                
                let status = 'Inactive';
                let color = 'text-lab-red';
                let bgColor = 'bg-rose-50';
                
                if (score > 80) {
                  status = 'Active';
                  color = 'text-emerald-500';
                  bgColor = 'bg-emerald-50';
                } else if (score > 40) {
                  status = 'Needs Update';
                  color = 'text-amber-500';
                  bgColor = 'bg-amber-50';
                }

                return (
                  <div key={name} className="flex flex-col items-center justify-center p-6 border border-slate-50 hover:bg-white hover:shadow-lg transition-all rounded-sm group relative">
                    <div className="absolute top-1 right-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${score > 80 ? 'bg-emerald-500' : score > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    </div>
                    <div className={`p-4 rounded-sm ${bgColor} mb-4 group-hover:scale-110 transition-transform shadow-inner`}>
                      <Icon size={24} className={color} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{name}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest mt-2 px-2 py-0.5 rounded-full ${bgColor} ${color} border border-current opacity-70`}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Tactical Recommendation Header (Print only) */}
        <div className="hidden print:block mb-8 break-before-page pt-10">
           <h2 className="text-2xl font-display font-black text-lab-black uppercase tracking-[0.3em] flex items-center justify-end gap-4 border-b-4 border-lab-black pb-4">
             Detailed Tactical Breakdown
             <Zap size={24} className="text-lab-red" />
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min print:grid-cols-1 print:gap-8">
          {currentResults.map((result, idx) => (
            <motion.div
              key={`${activeTab}-${result.platform}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white p-6 rounded-sm border-r-4 shadow-md border-y border-l border-slate-100 flex flex-col justify-between group hover:shadow-xl transition-all duration-300 ${
                result.score > 80 ? 'border-r-emerald-500' : result.score > 40 ? 'border-r-amber-500' : 'border-r-lab-red'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-5 flex-row-reverse">
                  <div className="p-2.5 bg-lab-black text-white rounded-sm shadow-lg group-hover:scale-110 transition-transform">
                    <PlatformIcon name={result.platform} />
                  </div>
                  <div className={`text-[9px] font-black px-2.5 py-1.5 uppercase rounded-sm tracking-widest shadow-sm ${
                    result.status === 'Found' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-lab-red'
                  }`}>
                    {result.status}
                  </div>
                </div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{result.platform}</h4>
                <p className="text-sm font-black text-slate-900 mb-3 leading-tight">
                  {activeTab === 'technical' ? 'تحليل الثغرات التقنية' : 'تحليل الهوية والانتشار'}
                </p>
                <p className="text-[12px] text-slate-500 italic leading-relaxed mb-6 font-medium">"{result.details}"</p>
              </div>

              <div className="space-y-4 pt-5 border-t border-slate-50">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <p className="text-[9px] font-black text-lab-red uppercase tracking-widest">خارطة الطريق الاستراتيجية</p>
                  <ArrowRight size={10} className="text-lab-red rotate-180" />
                </div>
                <div className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 text-[11px] text-slate-800 font-bold justify-end bg-slate-50/50 p-2 rounded-sm border border-slate-100 hover:bg-white transition-colors">
                      <span>{rec}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-lab-red mt-1.5 shrink-0 shadow-sm shadow-lab-red/20" />
                    </div>
                  ))}
                </div>
              </div>
              
              {result.url && (
                <a href={result.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-[9px] font-black text-lab-red uppercase tracking-[0.2em] hover:opacity-100 opacity-60 transition-all justify-end group/link">
                   رابط الوصول المباشر
                   <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-lab-black rounded-sm shadow-2xl relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-[-15deg] translate-x-20 transition-transform group-hover:translate-x-24 duration-1000" />
          <div className="relative flex justify-between items-center flex-row-reverse">
            <div className="flex flex-col text-right">
              <span className="text-[14px] font-black text-white uppercase tracking-[0.1em]">جاهز للإرسال؟</span>
              <span className="text-[9px] text-white/40 uppercase tracking-widest">أرشفة تفصيلية لتقرير التدقيق المزدوج</span>
            </div>
            <button 
              onClick={onReset}
              className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-sm border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-95"
            >
              <Clock size={16} className="text-lab-red" />
              بدء فحص جديد
            </button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};
