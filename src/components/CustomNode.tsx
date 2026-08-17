import { Handle, Position } from '@xyflow/react';

export default function CustomNode({ data, isConnectable }: any) {
  const isFinale = data.nodeType === 'Фінал' || data.title === 'Затоплена Крипта'; 

  return (
    <div className={`w-48 p-4 ${isFinale ? 'bg-red-950/20 border-red-500/30' : 'bg-[#1a1d24]/90 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.1)]'} border rounded-lg backdrop-blur-md`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 bg-amber-500" />
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${isFinale ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
          {data.nodeType || 'ВУЗОЛ'}
        </span>
        {data.nodeType === 'Зав\'язка' && (
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
        )}
      </div>
      <div className={`text-sm font-bold ${isFinale ? 'text-red-200' : 'text-white'} mb-1`}>
        {data.title}
      </div>
      <div className={`text-[10px] ${isFinale ? 'text-red-200/40' : 'text-white/50'} leading-relaxed line-clamp-3`}>
        {data.description}
      </div>
      {data.clues && data.clues.length > 0 && (
        <div className="flex gap-1 mt-2">
          {data.clues.map((c: any, i: number) => (
             <div key={c.id || i} className="w-2 h-1 bg-amber-500/50 rounded" title={c.description}></div>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2 bg-amber-500" />
    </div>
  );
}
