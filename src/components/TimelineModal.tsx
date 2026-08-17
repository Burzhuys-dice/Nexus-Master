import React from 'react';

export default function TimelineModal({
  isOpen,
  onClose,
  timelineNotes,
  setTimelineNotes
}: {
  isOpen: boolean;
  onClose: () => void;
  timelineNotes: string;
  setTimelineNotes: (v: string) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#12141a] border border-amber-500/30 rounded-xl w-full max-w-2xl h-[80vh] shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-[#161920] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-500">history</span>
            <h3 className="text-lg font-serif italic text-amber-100">Хронологія</h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="flex-1 p-6 flex flex-col bg-[radial-gradient(ellipse_at_top,_#1a1d24_0%,_#12141a_100%)] overflow-hidden">
          <label className="block text-[11px] uppercase tracking-[0.15em] text-amber-500/80 font-bold mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full"></div>
            Події та Часова Шкала
          </label>
          <textarea
            value={timelineNotes}
            onChange={(e) => setTimelineNotes(e.target.value)}
            className="flex-1 w-full bg-[#0c0d10] border border-white/10 rounded-md p-4 text-sm text-white/90 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 focus:outline-none resize-none placeholder:text-white/20"
            placeholder="Записуйте хронологію подій, що відбуваються у світі (фронти, реакції ворогів, час виконання завдань гравцями)..."
          />
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
