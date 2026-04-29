import React from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'motion/react';

export const Header: React.FC = () => {
  return (
    <header className="bg-lab-black text-white px-8 py-3 flex justify-between items-center shadow-2xl relative z-50 border-b border-white/5">
      <div className="flex items-center gap-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-12 h-10 flex items-center justify-center font-display font-black text-white relative group"
        >
          <div className="lab-bracket-tl group-hover:scale-110 transition-transform" />
          <div className="lab-bracket-tr group-hover:scale-110 transition-transform" />
          <div className="lab-bracket-bl group-hover:scale-110 transition-transform" />
          <div className="lab-bracket-br group-hover:scale-110 transition-transform" />
          <span className="relative z-10 text-[18px] tracking-tight leading-none">THE<br/>LAB</span>
        </motion.div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-display font-black tracking-tighter leading-none flex items-center gap-2 uppercase">
              Brand <span className="text-lab-red italic">Guidelines</span>
            </h1>
            <div className="flex items-center gap-1 bg-lab-red/10 px-2 py-0.5 rounded border border-lab-red/20">
              <Activity size={10} className="text-lab-red animate-medical-pulse" />
              <span className="text-[8px] font-black text-lab-red uppercase tracking-tighter">BUREAU D'AUDIT</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden md:flex flex-col text-right">
          <p className="text-[9px] text-lab-red font-black uppercase tracking-widest leading-none mb-1">STRATEGIC DATA SECTOR</p>
          <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">Aswan Metropolitan Area</p>
        </div>
        <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>
        <button className="hidden sm:flex bg-white/5 hover:bg-white/10 text-white px-4 py-1.5 rounded-sm border border-white/10 font-black text-[9px] uppercase tracking-[0.2em] transition-all items-center gap-2">
          <span className="w-1.5 h-1.5 bg-lab-red rounded-full" />
          Secure Access
        </button>
      </div>
    </header>
  );
};
