import React from 'react';

const fantasyNames = [
  "Торін", "Елара", "Сайлас", "Морвен", "Брам", "Лайра", "Дрейго", "Зейн", "Каелія", 
  "Гаррік", "Фіор", "Талон", "Ваня", "Оріон", "Серафіна", "Шум", "Агтос", "Едберт", 
  "Джозіан", "Олаф", "Розалін", "Кірсе", "Мінерва", "Трістан", "Стюарт", "Ланос", 
  "Дауд", "Рен", "Зефір", "Ізольда", "Каель", "Брайс", "Люміна", "Ворік", "Каллум"
];

export default function PlayersAndNPCsModal({
  isOpen,
  onClose,
  playersNotes,
  setPlayersNotes,
  npcsNotes,
  setNpcsNotes
}: {
  isOpen: boolean;
  onClose: () => void;
  playersNotes: string;
  setPlayersNotes: (v: string) => void;
  npcsNotes: string;
  setNpcsNotes: (v: string) => void;
}) {
  if (!isOpen) return null;

  const handleGenerateNPC = () => {
    const randomName = fantasyNames[Math.floor(Math.random() * fantasyNames.length)];
    const addition = npcsNotes ? `\n${randomName} - ` : `${randomName} - `;
    setNpcsNotes(npcsNotes + addition);
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#12141a] border border-amber-500/30 rounded-xl w-full max-w-4xl h-[80vh] shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-[#161920] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-500">groups</span>
            <h3 className="text-lg font-serif italic text-amber-100">Гравці та НПС</h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[radial-gradient(ellipse_at_top,_#1a1d24_0%,_#12141a_100%)]">
          <div className="flex-1 p-6 flex flex-col border-b md:border-b-0 md:border-r border-white/10">
            <label className="block text-[11px] uppercase tracking-[0.15em] text-amber-500/80 font-bold mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full"></div>
              Персонажі Гравців
            </label>
            <textarea
              value={playersNotes}
              onChange={(e) => setPlayersNotes(e.target.value)}
              className="flex-1 w-full bg-[#0c0d10] border border-white/10 rounded-md p-4 text-sm text-white/90 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 focus:outline-none resize-none placeholder:text-white/20"
              placeholder="Імена персонажів, їх цілі, зв'язки, інвентар..."
            />
          </div>
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] uppercase tracking-[0.15em] text-amber-500/80 font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full"></div>
                НПС (Неігрові Персонажі)
              </label>
              <button 
                onClick={handleGenerateNPC}
                className="text-[10px] bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-1 rounded transition-colors font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[12px]">casino</span>
                ЗГЕНЕРУВАТИ ІМ'Я
              </button>
            </div>
            <textarea
              value={npcsNotes}
              onChange={(e) => setNpcsNotes(e.target.value)}
              className="flex-1 w-full bg-[#0c0d10] border border-white/10 rounded-md p-4 text-sm text-white/90 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 focus:outline-none resize-none placeholder:text-white/20"
              placeholder="Імена НПС, фракції, мотиви, секрети, місцезнаходження..."
            />
          </div>
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
