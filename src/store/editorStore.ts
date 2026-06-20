import { create } from 'zustand';
import type {
  EditorState,
  Piece,
  Seal,
  EditorTool,
  ReflectionRule,
  BoardConfig,
  CustomPuzzle,
} from '@/types';
import { generateId } from '@/utils/gameLogic';
import { saveCustomPuzzle, getCustomPuzzles } from '@/utils/storage';

interface EditorStore extends EditorState {
  setBoardConfig: (config: Partial<BoardConfig>) => void;
  setReflectionRule: (rule: Partial<ReflectionRule>) => void;
  setSelectedTool: (tool: EditorTool) => void;
  setPuzzleName: (name: string) => void;
  addPiece: (x: number, y: number) => void;
  addSeal: (x: number, y: number, targetPieceId: string) => void;
  removePiece: (id: string) => void;
  removeSeal: (id: string) => void;
  movePiece: (id: string, x: number, y: number) => void;
  moveSeal: (id: string, x: number, y: number) => void;
  clearBoard: () => void;
  savePuzzle: () => string | null;
  loadPuzzle: (puzzle: CustomPuzzle) => void;
  loadCustomPuzzles: () => CustomPuzzle[];
  reset: () => void;
}

const defaultBoardConfig: BoardConfig = {
  width: 6,
  height: 6,
  cellSize: 60,
  theme: 'default',
};

const defaultReflectionRule: ReflectionRule = {
  type: 'mirror',
  mirrorAxis: 'horizontal',
  axisOffset: 0,
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  boardConfig: defaultBoardConfig,
  pieces: [],
  seals: [],
  reflectionRule: defaultReflectionRule,
  selectedTool: 'entity',
  puzzleName: '',

  setBoardConfig: (config) => {
    set((state) => ({
      boardConfig: { ...state.boardConfig, ...config },
    }));
  },

  setReflectionRule: (rule) => {
    set((state) => ({
      reflectionRule: { ...state.reflectionRule, ...rule },
    }));
  },

  setSelectedTool: (tool) => {
    set({ selectedTool: tool });
  },

  setPuzzleName: (name) => {
    set({ puzzleName: name });
  },

  addPiece: (x, y) => {
    const { pieces, boardConfig, reflectionRule } = get();

    const existingEntity = pieces.find((p) => p.isEntity && p.x === x && p.y === y);
    if (existingEntity) return;

    const entityId = generateId();
    const reflectionId = generateId();

    let refX = x;
    let refY = y;

    if (reflectionRule.mirrorAxis === 'horizontal' || reflectionRule.mirrorAxis === 'both') {
      const midY = (boardConfig.height - 1) / 2 + reflectionRule.axisOffset;
      refY = Math.round(2 * midY - y);
    }
    if (reflectionRule.mirrorAxis === 'vertical' || reflectionRule.mirrorAxis === 'both') {
      const midX = (boardConfig.width - 1) / 2 + reflectionRule.axisOffset;
      refX = Math.round(2 * midX - x);
    }

    const entityPiece: Piece = {
      id: entityId,
      type: 'stone',
      x,
      y,
      isEntity: true,
      linkedId: reflectionId,
    };

    const reflectionPiece: Piece = {
      id: reflectionId,
      type: 'stone',
      x: refX,
      y: refY,
      isEntity: false,
      linkedId: entityId,
    };

    set((state) => ({
      pieces: [...state.pieces, entityPiece, reflectionPiece],
    }));
  },

  addSeal: (x, y, targetPieceId) => {
    const sealId = generateId();
    const seal: Seal = {
      id: sealId,
      x,
      y,
      targetPieceId,
      requiredSide: 'both',
    };

    set((state) => ({
      seals: [...state.seals, seal],
    }));
  },

  removePiece: (id) => {
    const { pieces } = get();
    const piece = pieces.find((p) => p.id === id);
    if (!piece) return;

    const linkedId = piece.linkedId;
    const seals = get().seals;
    const relatedSeals = seals.filter(
      (s) => s.targetPieceId === id || s.targetPieceId === linkedId
    );

    set((state) => ({
      pieces: state.pieces.filter((p) => p.id !== id && p.id !== linkedId),
      seals: state.seals.filter((s) => !relatedSeals.find((rs) => rs.id === s.id)),
    }));
  },

  removeSeal: (id) => {
    set((state) => ({
      seals: state.seals.filter((s) => s.id !== id),
    }));
  },

  movePiece: (id, x, y) => {
    const { pieces, boardConfig, reflectionRule } = get();
    const piece = pieces.find((p) => p.id === id);
    if (!piece || !piece.isEntity) return;

    let refX = x;
    let refY = y;

    if (reflectionRule.mirrorAxis === 'horizontal' || reflectionRule.mirrorAxis === 'both') {
      const midY = (boardConfig.height - 1) / 2 + reflectionRule.axisOffset;
      refY = Math.round(2 * midY - y);
    }
    if (reflectionRule.mirrorAxis === 'vertical' || reflectionRule.mirrorAxis === 'both') {
      const midX = (boardConfig.width - 1) / 2 + reflectionRule.axisOffset;
      refX = Math.round(2 * midX - x);
    }

    set((state) => ({
      pieces: state.pieces.map((p) => {
        if (p.id === id) {
          return { ...p, x, y };
        }
        if (p.id === piece.linkedId) {
          return { ...p, x: refX, y: refY };
        }
        return p;
      }),
    }));
  },

  moveSeal: (id, x, y) => {
    set((state) => ({
      seals: state.seals.map((s) =>
        s.id === id ? { ...s, x, y } : s
      ),
    }));
  },

  clearBoard: () => {
    set({ pieces: [], seals: [] });
  },

  savePuzzle: () => {
    const { boardConfig, pieces, seals, reflectionRule, puzzleName } = get();

    if (pieces.length === 0 || seals.length === 0) {
      return null;
    }

    const puzzle: CustomPuzzle = {
      id: generateId(),
      name: puzzleName || '自制谜题',
      boardConfig: { ...boardConfig },
      pieces: pieces.map((p) => ({ ...p })),
      seals: seals.map((s) => ({ ...s })),
      reflectionRule: { ...reflectionRule },
      createdAt: new Date().toISOString(),
    };

    saveCustomPuzzle(puzzle);
    return puzzle.id;
  },

  loadPuzzle: (puzzle) => {
    set({
      boardConfig: { ...puzzle.boardConfig },
      pieces: puzzle.pieces.map((p) => ({ ...p })),
      seals: puzzle.seals.map((s) => ({ ...s })),
      reflectionRule: { ...puzzle.reflectionRule },
      puzzleName: puzzle.name,
    });
  },

  loadCustomPuzzles: () => {
    return getCustomPuzzles();
  },

  reset: () => {
    set({
      boardConfig: defaultBoardConfig,
      pieces: [],
      seals: [],
      reflectionRule: defaultReflectionRule,
      selectedTool: 'entity',
      puzzleName: '',
    });
  },
}));
