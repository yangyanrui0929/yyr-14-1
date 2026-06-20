import { create } from 'zustand';
import type {
  Level,
  Piece,
  MoveRecord,
  GameState,
  ReplayRecord,
} from '@/types';
import {
  canMovePiece,
  executeMove,
  checkWinCondition,
  initializeLevelPieces,
  generateId,
  undoMove,
} from '@/utils/gameLogic';
import { saveReplay, saveStepRecord, getStepRecord } from '@/utils/storage';

interface GameStore extends GameState {
  loadLevel: (level: Level) => void;
  movePiece: (pieceId: string, targetX: number, targetY: number) => boolean;
  undo: () => void;
  reset: () => void;
  setShowReflectionPath: (show: boolean) => void;
  setSelectedPieceId: (id: string | null) => void;
  setPreviewPosition: (pos: { x: number; y: number } | null) => void;
  checkWin: () => boolean;
  completeLevel: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  level: null,
  pieces: [],
  currentStep: 0,
  moveHistory: [],
  isCompleted: false,
  showReflectionPath: true,
  selectedPieceId: null,
  previewPosition: null,

  loadLevel: (level: Level) => {
    const pieces = initializeLevelPieces(level);
    set({
      level,
      pieces,
      currentStep: 0,
      moveHistory: [],
      isCompleted: false,
      selectedPieceId: null,
      previewPosition: null,
    });
  },

  movePiece: (pieceId: string, targetX: number, targetY: number) => {
    const { level, pieces, isCompleted } = get();
    if (!level || isCompleted) return false;

    const { valid } = canMovePiece(
      pieceId,
      targetX,
      targetY,
      pieces,
      level.boardConfig,
      level.reflectionRule
    );

    if (!valid) return false;

    const result = executeMove(
      pieceId,
      targetX,
      targetY,
      pieces,
      level.boardConfig,
      level.reflectionRule
    );

    set((state) => ({
      pieces: result.pieces,
      currentStep: state.currentStep + 1,
      moveHistory: [...state.moveHistory, result.moveRecord],
      selectedPieceId: null,
      previewPosition: null,
    }));

    return true;
  },

  undo: () => {
    const { moveHistory, pieces, isCompleted } = get();
    if (moveHistory.length === 0 || isCompleted) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    const newPieces = undoMove(lastMove, pieces);

    set((state) => ({
      pieces: newPieces,
      currentStep: state.currentStep - 1,
      moveHistory: state.moveHistory.slice(0, -1),
      isCompleted: false,
    }));
  },

  reset: () => {
    const { level } = get();
    if (!level) return;

    const pieces = initializeLevelPieces(level);
    set({
      pieces,
      currentStep: 0,
      moveHistory: [],
      isCompleted: false,
      selectedPieceId: null,
      previewPosition: null,
    });
  },

  setShowReflectionPath: (show: boolean) => {
    set({ showReflectionPath: show });
  },

  setSelectedPieceId: (id: string | null) => {
    set({ selectedPieceId: id });
  },

  setPreviewPosition: (pos: { x: number; y: number } | null) => {
    set({ previewPosition: pos });
  },

  checkWin: () => {
    const { pieces, level } = get();
    if (!level) return false;
    return checkWinCondition(pieces, level.seals);
  },

  completeLevel: () => {
    const { level, currentStep, moveHistory } = get();
    if (!level) return;

    set({ isCompleted: true });

    const record = getStepRecord(level.id);
    if (!record || currentStep < record.bestSteps) {
      saveStepRecord({
        levelId: level.id,
        bestSteps: currentStep,
        completed: true,
      });
    }

    const replay: ReplayRecord = {
      id: generateId(),
      levelId: level.id,
      levelName: level.name,
      steps: currentStep,
      moveHistory: [...moveHistory],
      completedAt: new Date().toISOString(),
    };
    saveReplay(replay);
  },
}));
