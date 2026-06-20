export interface PieceType {
  id: string;
  name: string;
  color: string;
  symbol: string;
}

export interface Piece {
  id: string;
  type: string;
  x: number;
  y: number;
  isEntity: boolean;
  linkedId?: string;
}

export interface Seal {
  id: string;
  x: number;
  y: number;
  targetPieceId: string;
  requiredSide: 'entity' | 'reflection' | 'both';
}

export type ReflectionRuleType = 'mirror' | 'opposite' | 'custom';
export type MirrorAxis = 'horizontal' | 'vertical' | 'both';

export interface ReflectionRule {
  type: ReflectionRuleType;
  mirrorAxis: MirrorAxis;
  axisOffset: number;
  reverseDirection?: boolean;
}

export interface BoardConfig {
  width: number;
  height: number;
  cellSize: number;
  theme: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Level {
  id: string;
  name: string;
  difficulty: Difficulty;
  description: string;
  boardConfig: BoardConfig;
  pieces: Piece[];
  seals: Seal[];
  reflectionRule: ReflectionRule;
  minSteps?: number;
}

export interface MoveRecord {
  pieceId: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  reflectionFrom?: { x: number; y: number };
  reflectionTo?: { x: number; y: number };
}

export interface ReplayRecord {
  id: string;
  levelId: string;
  levelName: string;
  steps: number;
  moveHistory: MoveRecord[];
  completedAt: string;
}

export interface CustomPuzzle {
  id: string;
  name: string;
  boardConfig: BoardConfig;
  pieces: Piece[];
  seals: Seal[];
  reflectionRule: ReflectionRule;
  createdAt: string;
}

export interface GameState {
  level: Level | null;
  pieces: Piece[];
  currentStep: number;
  moveHistory: MoveRecord[];
  isCompleted: boolean;
  showReflectionPath: boolean;
  selectedPieceId: string | null;
  previewPosition: { x: number; y: number } | null;
}

export type EditorTool = 'select' | 'entity' | 'seal' | 'erase';

export interface EditorState {
  boardConfig: BoardConfig;
  pieces: Piece[];
  seals: Seal[];
  reflectionRule: ReflectionRule;
  selectedTool: EditorTool;
  puzzleName: string;
}

export interface StepRecord {
  levelId: string;
  bestSteps: number;
  completed: boolean;
}
