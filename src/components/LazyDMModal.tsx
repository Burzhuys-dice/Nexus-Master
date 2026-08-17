import React from 'react';
import { LazyPrep } from '../types';

export default function LazyDMModal({
  isOpen,
  onClose,
  lazyPrep,
  setLazyPrep
}: {
  isOpen: boolean;
  onClose: () => void;
  lazyPrep: LazyPrep;
  setLazyPrep: React.Dispatch<React.SetStateAction<LazyPrep>>;
}) {
  if (!isOpen) return null;

  const handleChange = (field: keyof LazyPrep, value: string) => {
    setLazyPrep(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    { id: 'characters', label: '1. Огляд персонажів' },
    { id: 'strongStart', label: '2. Сильна зав\'язка' },
    { id: 'scenes', label: '3. Можливі сцени' },
    { id: 'secrets', label: '4. Таємниці та підказки' },
    { id: 'locations', label: '5. Фантастичні локації' },
    { id: 'npcs', label: '6. Важливі NPC' },
    { id: 'monsters', label: '7. Відповідні монстри' },
    { id: 'rewards', label: '8. Нагороди та предмети' },
  ];

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#12141a] border border-amber-500/30 rounded-xl w-full max-w-3xl h-[85vh] shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-[#161920] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-amber-500/20 border border-amber-500/50 rounded flex items-center justify-center">
              <span className="text-amber-500 font-bold text-xs">8</span>
            </div>
            <h3 className="text-lg font-serif italic text-amber-100">Чек-лист Lazy DM</h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-[radial-gradient(ellipse_at_top,_#1a1d24_0%,_#12141a_100%)] space-y-8">
          {steps.map(step => (
            <div key={step.id} className="bg-[#161920]/80 p-4 rounded-lg border border-white/5 shadow-inner">
              <label className="block text-[11px] uppercase tracking-[0.15em] text-amber-500/80 font-bold mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full"></div>
                {step.label}
              </label>
              <textarea
                value={lazyPrep[step.id as keyof LazyPrep]}
                onChange={(e) => handleChange(step.id as keyof LazyPrep, e.target.value)}
                rows={3}
                className="w-full bg-[#0c0d10] border border-white/10 rounded-md p-3 text-sm text-white/90 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 focus:outline-none resize-y placeholder:text-white/20 placeholder:italic"
                placeholder={`Ваші нотатки для кроку: ${step.label.split('. ')[1]}...`}
              />
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 bg-[#161920] flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-md bg-amber-600 text-black text-xs font-bold hover:bg-amber-500 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            ЗБЕРЕГТИ ТА ЗАКРИТИ
          </button>
        </div>
      </div>
    </div>
  );
}
