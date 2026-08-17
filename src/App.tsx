import { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, Node, Edge } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import ScenarioMap from './components/ScenarioMap';
import LazyDMModal from './components/LazyDMModal';
import PlayersAndNPCsModal from './components/PlayersAndNPCsModal';
import TimelineModal from './components/TimelineModal';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { useGoogleDrive } from './hooks/useGoogleDrive';
import { LazyPrep, Scenario } from './types';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 250, y: 150 },
    data: { 
      title: 'Тиха Карета', 
      nodeType: 'Зав\'язка',
      description: 'Покинута на Північному Шляху. Вкрита дивним біолюмінесцентним слизом.',
      notes: '',
      atmosphere: ['Запах озону', 'Холодний вітер', 'Ритмічний стукіт'],
      clues: [
        { id: 'c1', description: 'Розірваний транспортний маніфест зі згадкою Доку 7 у Блеквуді.', targetNodeId: '2' },
        { id: 'c2', description: 'Сліди специфічних дорогих чобіт, що ведуть до Маєтку Міллера.', targetNodeId: '3' },
      ]
    },
  },
  {
    id: '2',
    type: 'customNode',
    position: { x: 500, y: 50 },
    data: { 
      title: 'Доки Блеквуда', 
      nodeType: 'Локація',
      description: 'Журнал, знайдений у кареті, веде гравців сюди.',
      notes: '',
      atmosphere: ['Вогкість', 'Скрип дерева', 'Віддалений шум хвиль'],
      clues: [
        { id: 'c3', description: 'Контрабандисти обговорюють Затоплену Крипту.', targetNodeId: '4' }
      ]
    },
  },
  {
    id: '3',
    type: 'customNode',
    position: { x: 500, y: 300 },
    data: { 
      title: 'Маєток Міллера', 
      nodeType: 'Локація',
      description: 'Хтось, хто вижив у кареті, втік до цього маєтку.',
      notes: '',
      atmosphere: ['Пилюка', 'Повний безлад', 'Криваві сліди'],
      clues: [
        { id: 'c4', description: 'Міллер зізнається про Затоплену Крипту.', targetNodeId: '4' }
      ]
    },
  },
  {
    id: '4',
    type: 'customNode',
    position: { x: 800, y: 150 },
    data: { 
      title: 'Затоплена Крипта', 
      nodeType: 'Фінал',
      description: 'Остаточне викриття впливу культу.',
      notes: '',
      atmosphere: ['Ехо води', 'Темнота', 'Відчуття страху'],
      clues: []
    },
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', target: '4', style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' } },
  { id: 'e3-4', source: '3', target: '4', style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' } },
];

const defaultScenario: Scenario = {
  id: 'default-1',
  title: 'Тінь Блеквуда',
  nodes: initialNodes,
  edges: initialEdges,
  lazyPrep: {
    characters: '',
    strongStart: '',
    scenes: '',
    secrets: '',
    locations: '',
    npcs: '',
    monsters: '',
    rewards: ''
  },
  playersNotes: '',
  npcsNotes: '',
  timelineNotes: '',
  updatedAt: Date.now()
};

export default function App() {
  const { isAuthorized, accessToken, login, logout } = useGoogleAuth();
  const { saveScenarios, loadScenarios, isSaving, isLoading } = useGoogleDrive(accessToken);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  // Scenarios State
  const [scenarios, setScenarios] = useState<Scenario[]>([defaultScenario]);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(defaultScenario.id);

  // Active Scenario Content State
  const [currentTitle, setCurrentTitle] = useState(defaultScenario.title);
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultScenario.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultScenario.edges);
  const [lazyPrep, setLazyPrep] = useState<LazyPrep>(defaultScenario.lazyPrep);
  const [playersNotes, setPlayersNotes] = useState(defaultScenario.playersNotes);
  const [npcsNotes, setNpcsNotes] = useState(defaultScenario.npcsNotes);
  const [timelineNotes, setTimelineNotes] = useState(defaultScenario.timelineNotes);

  // Auto-sync current active states back to the scenarios array
  useEffect(() => {
    setScenarios(prev => prev.map(s => s.id === activeScenarioId ? {
      ...s,
      title: currentTitle,
      nodes,
      edges,
      lazyPrep,
      playersNotes,
      npcsNotes,
      timelineNotes,
      updatedAt: Date.now()
    } : s));
  }, [currentTitle, nodes, edges, lazyPrep, playersNotes, npcsNotes, timelineNotes, activeScenarioId]);

  // Load from Drive on init auth
  useEffect(() => {
    if (isAuthorized) {
      loadScenarios().then(data => {
        if (data && data.length > 0) {
          setScenarios(data);
          const target = data[0];
          setActiveScenarioId(target.id);
          setCurrentTitle(target.title);
          setNodes(target.nodes);
          setEdges(target.edges);
          setLazyPrep(target.lazyPrep);
          setPlayersNotes(target.playersNotes);
          setNpcsNotes(target.npcsNotes);
          setTimelineNotes(target.timelineNotes);
          setSelectedNode(null);
          setLastSynced(new Date());
        }
      });
    }
  }, [isAuthorized, loadScenarios]);

  // Auto-sync every 60 seconds
  useEffect(() => {
    if (!isAuthorized || scenarios.length === 0) return;
    const intervalId = setInterval(() => {
      saveScenarios(scenarios).then((success) => {
        if (success) setLastSynced(new Date());
      });
    }, 60000);
    return () => clearInterval(intervalId);
  }, [isAuthorized, scenarios, saveScenarios]);

  const handleSwitchScenario = (id: string) => {
    if (id === 'NEW') {
      const newId = uuidv4();
      const newScenario: Scenario = {
        id: newId,
        title: 'Новий Сценарій',
        nodes: [],
        edges: [],
        lazyPrep: { characters: '', strongStart: '', scenes: '', secrets: '', locations: '', npcs: '', monsters: '', rewards: '' },
        playersNotes: '',
        npcsNotes: '',
        timelineNotes: '',
        updatedAt: Date.now()
      };
      setScenarios(prev => [...prev, newScenario]);
      setActiveScenarioId(newId);
      setCurrentTitle(newScenario.title);
      setNodes(newScenario.nodes);
      setEdges(newScenario.edges);
      setLazyPrep(newScenario.lazyPrep);
      setPlayersNotes(newScenario.playersNotes);
      setNpcsNotes(newScenario.npcsNotes);
      setTimelineNotes(newScenario.timelineNotes);
      setSelectedNode(null);
    } else {
      const target = scenarios.find(s => s.id === id);
      if (target) {
        setActiveScenarioId(target.id);
        setCurrentTitle(target.title);
        setNodes(target.nodes);
        setEdges(target.edges);
        setLazyPrep(target.lazyPrep);
        setPlayersNotes(target.playersNotes);
        setNpcsNotes(target.npcsNotes);
        setTimelineNotes(target.timelineNotes);
        setSelectedNode(null);
      }
    }
  };
  
  // UI Panels State
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  // Modals State
  const [isLazyDMOpen, setIsLazyDMOpen] = useState(false);
  const [isPlayersModalOpen, setIsPlayersModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  const updateNodeData = useCallback((nodeId: string, field: string, value: any) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedData = { ...node.data, [field]: value };
          const updatedNode = { ...node, data: updatedData };
          if (selectedNode?.id === nodeId) setSelectedNode(updatedNode);
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes, selectedNode]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#0c0d10] text-[#d1d5db] font-sans overflow-hidden relative">
      <header className="h-16 border-b border-white/10 bg-[#12141a] flex items-center justify-between px-6 shrink-0 z-10 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)} 
            className="text-white/50 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded hover:bg-white/5"
            title="Перемкнути ліву панель"
          >
            <span className="material-symbols-outlined text-[20px]">{isLeftPanelOpen ? 'menu_open' : 'menu'}</span>
          </button>
          <div className="w-8 h-8 bg-amber-500/20 border border-amber-500/50 rounded rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]"></div>
          </div>
          <h1 className="text-lg font-medium tracking-tight text-white hidden md:flex items-center">
            Nexus Master <span className="text-white/30 mx-2">/</span> 
            <input 
              type="text" 
              value={currentTitle} 
              onChange={e => setCurrentTitle(e.target.value)} 
              className="bg-transparent text-amber-200/80 font-medium outline-none border-b border-transparent focus:border-amber-500/50 hover:border-amber-500/30 transition-colors w-48"
            />
          </h1>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-md px-2 py-1 ml-2">
            <select 
              value={activeScenarioId}
              onChange={(e) => handleSwitchScenario(e.target.value)}
              className="bg-transparent text-xs text-white/70 outline-none cursor-pointer border-none appearance-none pr-2"
            >
              {scenarios.map(s => <option key={s.id} value={s.id} className="bg-[#12141a] text-white">{s.title}</option>)}
              <option value="NEW" className="bg-[#12141a] text-amber-400 font-bold">+ Новий Сценарій</option>
            </select>
            <span className="material-symbols-outlined text-[14px] text-white/40 pointer-events-none">expand_more</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAuthorized ? (
            <button onClick={logout} className="px-4 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-colors">
              ВИЙТИ З DRIVE
            </button>
          ) : (
            <button onClick={login} className="px-4 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">workspace_drive</span>
              УВІЙТИ В DRIVE
            </button>
          )}
          <button className="px-4 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-colors hidden sm:block">
            ЕКСПОРТ PDF
          </button>
          <button 
            onClick={() => {
              if (isAuthorized) {
                saveScenarios(scenarios).then(success => {
                  if (success) setLastSynced(new Date());
                });
              } else {
                login();
              }
            }}
            className="px-4 py-1.5 rounded-md bg-amber-600 text-black text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:bg-amber-500 flex items-center gap-1"
          >
            {isSaving ? (
              <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
            ) : (
              <span className="material-symbols-outlined text-[14px]">cloud_upload</span>
            )}
            СИНХРОНІЗУВАТИ
          </button>
          <button 
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} 
            className="text-white/50 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded hover:bg-white/5 ml-2"
            title="Перемкнути праву панель"
          >
            <span className="material-symbols-outlined text-[20px]">{isRightPanelOpen ? 'right_panel_close' : 'right_panel_open'}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {isLeftPanelOpen && (
          <aside className="w-64 border-r border-white/5 bg-[#0e1014] flex flex-col p-4 shrink-0 z-10 relative">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-4">
              Вузли Сценарію
            </div>
            <div className="space-y-1 overflow-y-auto">
              {nodes.map((node, i) => (
                <div 
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    if (!isRightPanelOpen) setIsRightPanelOpen(true);
                  }}
                  className={`p-2 border-l-2 cursor-pointer transition-colors ${selectedNode?.id === node.id ? 'bg-amber-500/10 border-amber-500 rounded-r-md' : 'hover:bg-white/5 border-transparent'}`}
                >
                  <div className={`text-sm font-medium truncate ${selectedNode?.id === node.id ? 'text-white' : 'text-white/70'}`}>
                    {String(i + 1).padStart(2, '0')}. {node.data.title}
                  </div>
                  <div className={`text-[10px] mt-0.5 ${selectedNode?.id === node.id ? 'text-amber-200/50' : 'text-white/30'}`}>
                    {node.data.nodeType || 'Вузол'} • {node.data.clues?.length || 0} Підказок
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                Інструменти Майстра
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button 
                  onClick={() => setIsPlayersModalOpen(true)}
                  className="p-2 bg-[#161920] rounded border border-white/5 text-center text-[10px] hover:bg-white/5 transition-colors leading-tight"
                >
                  Гравці та НПС
                </button>
                <button 
                  onClick={() => setIsTimelineModalOpen(true)}
                  className="p-2 bg-[#161920] rounded border border-white/5 text-center text-[10px] hover:bg-white/5 transition-colors leading-tight"
                >
                  Хронологія
                </button>
              </div>
              <button 
                onClick={() => setIsLazyDMOpen(true)}
                className="w-full p-2 bg-amber-500/10 text-amber-500/80 rounded border border-amber-500/20 text-center text-[10px] font-bold tracking-wider hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                LAZY DM ЧЕК-ЛИСТ
              </button>
            </div>
          </aside>
        )}

        <main className="flex-1 relative bg-[radial-gradient(circle_at_center,_#1a1d24_0%,_#0c0d10_100%)] overflow-hidden z-0">
          <ScenarioMap 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setNodes={setNodes}
            setEdges={setEdges}
            onNodeSelect={(node: any) => {
              setSelectedNode(node);
              if (!isRightPanelOpen) setIsRightPanelOpen(true);
            }} 
          />
        </main>

        {isRightPanelOpen && (
          <aside className="w-80 border-l border-white/5 bg-[#0e1014] flex flex-col p-6 shrink-0 overflow-y-auto z-10 relative shadow-[-10px_0_20px_rgba(0,0,0,0.2)]">
            {selectedNode ? (
              <>
                <div className="mb-6">
                  <input
                    type="text"
                    className="w-full bg-transparent text-xl font-serif italic text-amber-100 mb-1 focus:outline-none focus:bg-white/5 rounded px-1 -mx-1"
                    value={selectedNode.data.title}
                    onChange={(e) => updateNodeData(selectedNode.id, 'title', e.target.value)}
                  />
                  <div className="h-px w-full bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-white/30">
                      Тип Вузла
                    </div>
                    <select 
                      value={selectedNode.data.nodeType || "Локація"}
                      onChange={(e) => updateNodeData(selectedNode.id, 'nodeType', e.target.value)}
                      className="bg-[#161920] border border-white/10 rounded px-2 py-1 text-xs text-white/80 focus:border-amber-500/50 outline-none"
                    >
                      <option value="Зав'язка">Зав'язка</option>
                      <option value="Локація">Локація</option>
                      <option value="Персонаж">Персонаж</option>
                      <option value="Подія">Подія</option>
                      <option value="Фінал">Фінал</option>
                    </select>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                      Опис
                    </div>
                    <textarea
                      className="w-full bg-[#161920] border border-white/10 rounded-md p-3 text-sm text-white/80 leading-relaxed focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 focus:outline-none resize-y min-h-[80px]"
                      value={selectedNode.data.description}
                      onChange={(e) => updateNodeData(selectedNode.id, 'description', e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-[10px] uppercase tracking-widest text-white/30">
                        Основні Підказки
                      </div>
                      <button 
                        onClick={() => {
                          const newClues = [...(selectedNode.data.clues || []), { id: Date.now().toString(), description: '', targetNodeId: null }];
                          updateNodeData(selectedNode.id, 'clues', newClues);
                        }}
                        className="text-[10px] text-amber-500/80 hover:text-amber-400 font-bold"
                      >
                        + ДОДАТИ
                      </button>
                    </div>
                    
                    {selectedNode.data.clues && selectedNode.data.clues.length > 0 ? (
                      <ul className="space-y-3">
                        {selectedNode.data.clues.map((clue: any, i: number) => (
                          <li key={clue.id || i} className="flex gap-2 items-start">
                            <div className="w-5 h-5 mt-1 rounded bg-white/5 flex items-center justify-center text-[10px] text-amber-500 font-bold border border-white/10 shrink-0">
                              {i + 1}
                            </div>
                            <div className="flex-1 flex flex-col gap-1.5">
                              <textarea 
                                className="w-full bg-[#161920] border border-white/10 rounded p-2 text-xs text-white/80 leading-tight focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 focus:outline-none resize-y min-h-[40px]"
                                value={clue.description}
                                onChange={(e) => {
                                  const newClues = [...selectedNode.data.clues];
                                  newClues[i] = { ...clue, description: e.target.value };
                                  updateNodeData(selectedNode.id, 'clues', newClues);
                                }}
                              />
                              {clue.targetNodeId && <span className="text-[10px] text-amber-500/50 px-1">Веде до: Вузол {clue.targetNodeId}</span>}
                            </div>
                            <button 
                              onClick={() => {
                                const newClues = selectedNode.data.clues.filter((_: any, idx: number) => idx !== i);
                                updateNodeData(selectedNode.id, 'clues', newClues);
                              }}
                              className="mt-1 text-white/30 hover:text-red-400 p-1"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-xs text-white/30 italic">Підказок поки немає...</div>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
                      Ігрові Нотатки
                    </div>
                    <textarea
                      className="w-full bg-[#161920] border border-white/10 rounded-md p-3 text-sm text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 focus:outline-none resize-y min-h-[100px] placeholder:text-white/20"
                      placeholder="Записуйте дії гравців або нові ідеї прямо під час гри..."
                      value={selectedNode.data.notes || ''}
                      onChange={(e) => updateNodeData(selectedNode.id, 'notes', e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
                      Атмосфера та Відчуття
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(selectedNode.data.atmosphere || []).map((tag: string, i: number) => (
                        <span key={i} className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px]">
                          {tag}
                          <button 
                            onClick={() => {
                              const newAtmo = [...selectedNode.data.atmosphere];
                              newAtmo.splice(i, 1);
                              updateNodeData(selectedNode.id, 'atmosphere', newAtmo);
                            }} 
                            className="text-white/30 hover:text-red-400 ml-1 leading-none pb-0.5"
                          >×</button>
                        </span>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      placeholder="+ Додати тег (натисніть Enter)"
                      className="w-full bg-[#161920] border border-white/10 rounded p-2 text-xs text-white/80 focus:border-amber-500/50 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const newAtmo = [...(selectedNode.data.atmosphere || []), e.currentTarget.value.trim()];
                          updateNodeData(selectedNode.id, 'atmosphere', newAtmo);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>

                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                Оберіть вузол для перегляду деталей
              </div>
            )}
          </aside>
        )}
      </div>

      <footer className="h-8 bg-[#08090c] border-t border-white/5 px-6 flex items-center justify-between text-[10px] text-white/20 uppercase tracking-[0.2em] shrink-0 z-10 relative">
        <div className="flex items-center gap-6">
          <div className="hidden sm:block">
            Стан Сценарію: <span className="text-green-500/50">Надійний (Зв'язна структура)</span>
          </div>
          {isAuthorized && (
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[14px] ${isSaving ? 'text-amber-500 animate-spin' : 'text-green-500/50'}`}>
                {isSaving ? 'sync' : 'cloud_done'}
              </span>
              <span className={isSaving ? 'text-amber-500' : 'text-green-500/50'}>
                {isSaving ? 'Синхронізація...' : lastSynced ? `Збережено о ${lastSynced.toLocaleTimeString('uk-UA', { hour: '2-digit', minute:'2-digit' })}` : 'Синхронізовано'}
              </span>
            </div>
          )}
        </div>
        <div>Alexandrian Protocol v2.4</div>
      </footer>

      <LazyDMModal 
        isOpen={isLazyDMOpen} 
        onClose={() => setIsLazyDMOpen(false)} 
        lazyPrep={lazyPrep}
        setLazyPrep={setLazyPrep}
      />

      <PlayersAndNPCsModal
        isOpen={isPlayersModalOpen}
        onClose={() => setIsPlayersModalOpen(false)}
        playersNotes={playersNotes}
        setPlayersNotes={setPlayersNotes}
        npcsNotes={npcsNotes}
        setNpcsNotes={setNpcsNotes}
      />

      <TimelineModal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        timelineNotes={timelineNotes}
        setTimelineNotes={setTimelineNotes}
      />
    </div>
  );
}
