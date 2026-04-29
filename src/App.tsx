/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/layout/Header';
import { AuditForm } from './components/audit/AuditForm';
import { AuditReportView } from './components/audit/AuditReportView';
import { performDigitalAudit, type AuditReport } from './services/AuditService';
import { Search, Loader2, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartAudit = async (name: string, specialty: string, clinic: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await performDigitalAudit(name, specialty, clinic);
      setReport(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during the audit.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-lab-off text-lab-ink font-sans flex flex-col selection:bg-lab-red selection:text-white">
      <Header />

      <main className="flex-1 p-6 md:p-10 lg:p-16 max-w-[1600px] mx-auto w-full relative">
        <div className="absolute inset-0 lab-grid-bg pointer-events-none opacity-20" />
        
        <AnimatePresence mode="wait">
          {!report ? (
            <motion.div
              key="hero-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10"
            >
              <div className="lg:col-span-6 space-y-12">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 bg-lab-black px-4 py-2 rounded-sm border border-white/10 shadow-xl">
                    <Activity size={14} className="text-lab-red animate-medical-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] leading-none">REGIONAL INTEL UNIT</span>
                  </div>
                  
                  <h2 className="text-7xl md:text-9xl font-display font-black text-lab-black leading-[0.85] tracking-tighter uppercase">
                    WE BUILD <br />
                    <span className="text-lab-red">DIGITAL</span> <br />
                    THAT WORKS
                  </h2>
                </div>
                
                <div className="max-w-md space-y-8">
                  <p className="text-lg text-lab-gray-400 font-medium leading-tight border-l-4 border-lab-red pl-6 italic">
                    "High-density intelligence for Upper Egypt's elite medical professionals. We map digital shadows to ensure total patient capture."
                  </p>

                  <div className="grid grid-cols-2 gap-px bg-lab-gray-200 border border-lab-gray-200 shadow-sm rounded-sm overflow-hidden">
                    {[
                      { icon: Search, label: 'GEO-CLUSTER', val: 'Aswan' },
                      { icon: Sparkles, label: 'SEO ANALYSIS', val: 'V.4' },
                      { icon: Activity, label: 'INTEL REPORT', val: 'Real-time' },
                      { icon: ShieldCheck, label: 'DATA SECURE', val: 'Encrypted' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-1 p-4 bg-white hover:bg-lab-off transition-colors">
                        <div className="flex items-center gap-2">
                          <item.icon size={14} className="text-lab-red" />
                          <span className="text-[9px] font-black text-lab-gray-300 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <span className="text-xs font-bold text-lab-ink">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-lab-red/5 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="relative">
                    <AuditForm onStartAudit={handleStartAudit} isLoading={isLoading} />
                  </div>
                </div>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-lab-black border-l-4 border-lab-red text-white flex items-center gap-3 shadow-2xl"
                  >
                    <Loader2 size={16} className="text-lab-red animate-spin" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-lab-red uppercase tracking-widest leading-none mb-1">SYSTEM ERROR</span>
                      <span className="text-[11px] font-bold opacity-60 uppercase tracking-tighter">{error}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="report-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AuditReportView report={report} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      {!report && (
        <footer className="p-8 mt-auto border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto flex justify-between items-center opacity-40">
            <span className="text-[10px] font-bold uppercase tracking-widest">© 2024 Aswan Medical Digital Systems</span>
            <div className="flex gap-4">
               <div className="w-2 h-2 bg-slate-300 rounded-full" />
               <div className="w-2 h-2 bg-slate-300 rounded-full" />
               <div className="w-2 h-2 bg-slate-300 rounded-full" />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
