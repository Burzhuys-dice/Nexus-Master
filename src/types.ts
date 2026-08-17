export interface LazyPrep {
  characters: string;
  strongStart: string;
  scenes: string;
  secrets: string;
  locations: string;
  npcs: string;
  monsters: string;
  rewards: string;
}

export interface Scenario {
  id: string;
  title: string;
  nodes: any[];
  edges: any[];
  lazyPrep: LazyPrep;
  playersNotes: string;
  npcsNotes: string;
  timelineNotes: string;
  updatedAt: number;
}

export interface ScenarioNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: {
    title: string;
    description: string;
    nodeType: 'Location' | 'Person' | 'Event' | 'Proactive' | string;
    clues: Clue[];
    notes?: string;
    atmosphere?: string[];
    isEditing?: boolean;
    onChange?: (id: string, data: Partial<ScenarioNode['data']>) => void;
    onDelete?: (id: string) => void;
  };
}

export interface Clue {
  id: string;
  description: string;
  targetNodeId: string | null;
}

export interface ScenarioEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface AppState {
  campaigns: Campaign[];
}
