import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

import CustomNode from './CustomNode';

const nodeTypes = {
  customNode: CustomNode,
};

export default function ScenarioMap({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  setEdges, 
  setNodes, 
  onNodeSelect 
}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeDesc, setNewNodeDesc] = useState('');
  const [newNodeType, setNewNodeType] = useState('Локація');
  const [newClues, setNewClues] = useState<string[]>(['']);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds: any) => addEdge({ ...params, animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } } as Edge, eds)),
    [setEdges],
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    onNodeSelect(node);
  }, [onNodeSelect]);

  const handleSaveNode = () => {
    const newNode: Node = {
      id: uuidv4(),
      type: 'customNode',
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: { 
        title: newNodeTitle || 'Новий Вузол', 
        nodeType: newNodeType,
        description: newNodeDesc,
        clues: newClues.filter(c => c.trim() !== '').map(c => ({ id: uuidv4(), description: c, targetNodeId: null }))
      }
    };
    setNodes((ns: any) => [...ns, newNode]);
    setIsModalOpen(false);
    // Reset form
    setNewNodeTitle('');
    setNewNodeDesc('');
    setNewNodeType('Локація');
    setNewClues(['']);
  };

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#333" gap={16} />
        <Controls className="bg-[#1a1d24] border border-white/10 fill-white" />
        <Panel position="top-right">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-amber-600 text-black text-xs font-bold rounded shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:bg-amber-500 transition-colors"
          >
            + Додати Вузол
          </button>
        </Panel>
      </ReactFlow>

      {isModalOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12141a] border border-amber-500/30 rounded-xl w-full max-w-md shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-[#161920]">
              <h3 className="text-lg font-serif italic text-amber-100">Створити Новий Вузол</h3>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Назва</label>
                <input 
                  type="text" 
                  value={newNodeTitle}
                  onChange={e => setNewNodeTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-white focus:border-amber-500/50 focus:outline-none"
                  placeholder="Напр., Покинута Шахта"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Тип Вузла</label>
                <select 
                  value={newNodeType}
                  onChange={e => setNewNodeType(e.target.value)}
                  className="w-full bg-[#161920] border border-white/10 rounded p-2 text-sm text-white focus:border-amber-500/50 focus:outline-none appearance-none"
                >
                  <option value="Зав'язка">Зав'язка</option>
                  <option value="Локація">Локація</option>
                  <option value="Персонаж">Персонаж</option>
                  <option value="Подія">Подія</option>
                  <option value="Фінал">Фінал</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Опис</label>
                <textarea 
                  value={newNodeDesc}
                  onChange={e => setNewNodeDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-white focus:border-amber-500/50 focus:outline-none resize-none"
                  placeholder="Деталі вузла..."
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Підказки (Правило Трьох)</label>
                <div className="space-y-2">
                  {newClues.map((clue, idx) => (
                    <div key={idx} className="flex gap-2">
                      <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] text-amber-500 font-bold border border-white/10 shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <input 
                        type="text" 
                        value={clue}
                        onChange={e => {
                          const updated = [...newClues];
                          updated[idx] = e.target.value;
                          setNewClues(updated);
                        }}
                        className="flex-1 bg-white/5 border border-white/10 rounded p-1.5 text-sm text-white focus:border-amber-500/50 focus:outline-none"
                        placeholder="Підказка..."
                      />
                      <button 
                        onClick={() => setNewClues(newClues.filter((_, i) => i !== idx))}
                        className="text-white/30 hover:text-red-400 px-2"
                      >×</button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setNewClues([...newClues, ''])}
                    className="text-[10px] text-amber-500/70 hover:text-amber-400 font-bold uppercase tracking-wider"
                  >
                    + Додати Підказку
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#161920] flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded bg-white/5 text-white/70 text-xs font-medium hover:bg-white/10 transition-colors"
              >
                СКАСУВАТИ
              </button>
              <button 
                onClick={handleSaveNode}
                className="px-4 py-1.5 rounded bg-amber-600 text-black text-xs font-bold hover:bg-amber-500 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                ЗБЕРЕГТИ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
