import type { Level, PieceType } from '@/types';

export const PIECE_TYPES: PieceType[] = [
  {
    id: 'stone',
    name: '石棋子',
    color: '#2d5a4a',
    symbol: '●',
  },
  {
    id: 'jade',
    name: '玉棋子',
    color: '#5a8f7b',
    symbol: '◉',
  },
  {
    id: 'gold',
    name: '金棋子',
    color: '#d4a853',
    symbol: '◆',
  },
];

export const LEVELS: Level[] = [
  {
    id: 'level-1',
    name: '初入镜湖',
    difficulty: 'easy',
    description: '初识倒影之妙，将棋子移至印记处',
    boardConfig: {
      width: 5,
      height: 6,
      cellSize: 64,
      theme: 'default',
    },
    reflectionRule: {
      type: 'mirror',
      mirrorAxis: 'horizontal',
      axisOffset: 0,
    },
    pieces: [
      { id: 'p1', type: 'stone', x: 0, y: 1, isEntity: true, linkedId: 'r1' },
      { id: 'r1', type: 'stone', x: 0, y: 4, isEntity: false, linkedId: 'p1' },
    ],
    seals: [
      { id: 's1', x: 4, y: 1, targetPieceId: 'p1', requiredSide: 'entity' },
      { id: 's2', x: 4, y: 4, targetPieceId: 'p1', requiredSide: 'reflection' },
    ],
    minSteps: 4,
  },
  {
    id: 'level-2',
    name: '双影同辉',
    difficulty: 'easy',
    description: '两枚棋子，两处印记，需同时归位',
    boardConfig: {
      width: 6,
      height: 6,
      cellSize: 60,
      theme: 'default',
    },
    reflectionRule: {
      type: 'mirror',
      mirrorAxis: 'horizontal',
      axisOffset: 0,
    },
    pieces: [
      { id: 'p1', type: 'stone', x: 0, y: 0, isEntity: true, linkedId: 'r1' },
      { id: 'r1', type: 'stone', x: 0, y: 5, isEntity: false, linkedId: 'p1' },
      { id: 'p2', type: 'jade', x: 5, y: 0, isEntity: true, linkedId: 'r2' },
      { id: 'r2', type: 'jade', x: 5, y: 5, isEntity: false, linkedId: 'p2' },
    ],
    seals: [
      { id: 's1', x: 2, y: 0, targetPieceId: 'p1', requiredSide: 'entity' },
      { id: 's2', x: 2, y: 5, targetPieceId: 'p1', requiredSide: 'reflection' },
      { id: 's3', x: 3, y: 0, targetPieceId: 'p2', requiredSide: 'entity' },
      { id: 's4', x: 3, y: 5, targetPieceId: 'p2', requiredSide: 'reflection' },
    ],
    minSteps: 4,
  },
  {
    id: 'level-3',
    name: '左右逢源',
    difficulty: 'medium',
    description: '垂直镜面，左右相映',
    boardConfig: {
      width: 7,
      height: 5,
      cellSize: 56,
      theme: 'default',
    },
    reflectionRule: {
      type: 'mirror',
      mirrorAxis: 'vertical',
      axisOffset: 0,
    },
    pieces: [
      { id: 'p1', type: 'stone', x: 0, y: 2, isEntity: true, linkedId: 'r1' },
      { id: 'r1', type: 'stone', x: 6, y: 2, isEntity: false, linkedId: 'p1' },
    ],
    seals: [
      { id: 's1', x: 1, y: 0, targetPieceId: 'p1', requiredSide: 'entity' },
      { id: 's2', x: 5, y: 0, targetPieceId: 'p1', requiredSide: 'reflection' },
      { id: 's3', x: 1, y: 4, targetPieceId: 'p1', requiredSide: 'entity' },
      { id: 's4', x: 5, y: 4, targetPieceId: 'p1', requiredSide: 'reflection' },
    ],
    minSteps: 6,
  },
  {
    id: 'level-4',
    name: '十字镜像',
    difficulty: 'medium',
    description: '双重镜像，上下左右皆相反',
    boardConfig: {
      width: 7,
      height: 7,
      cellSize: 52,
      theme: 'default',
    },
    reflectionRule: {
      type: 'mirror',
      mirrorAxis: 'both',
      axisOffset: 0,
    },
    pieces: [
      { id: 'p1', type: 'gold', x: 0, y: 0, isEntity: true, linkedId: 'r1' },
      { id: 'r1', type: 'gold', x: 6, y: 6, isEntity: false, linkedId: 'p1' },
    ],
    seals: [
      { id: 's1', x: 3, y: 0, targetPieceId: 'p1', requiredSide: 'entity' },
      { id: 's2', x: 3, y: 6, targetPieceId: 'p1', requiredSide: 'reflection' },
    ],
    minSteps: 3,
  },
  {
    id: 'level-5',
    name: '狭路相逢',
    difficulty: 'hard',
    description: '棋子不可相撞，智取通关',
    boardConfig: {
      width: 6,
      height: 7,
      cellSize: 56,
      theme: 'default',
    },
    reflectionRule: {
      type: 'mirror',
      mirrorAxis: 'horizontal',
      axisOffset: 0,
    },
    pieces: [
      { id: 'p1', type: 'stone', x: 0, y: 1, isEntity: true, linkedId: 'r1' },
      { id: 'r1', type: 'stone', x: 0, y: 5, isEntity: false, linkedId: 'p1' },
      { id: 'p2', type: 'jade', x: 5, y: 1, isEntity: true, linkedId: 'r2' },
      { id: 'r2', type: 'jade', x: 5, y: 5, isEntity: false, linkedId: 'p2' },
      { id: 'p3', type: 'gold', x: 2, y: 0, isEntity: true, linkedId: 'r3' },
      { id: 'r3', type: 'gold', x: 2, y: 6, isEntity: false, linkedId: 'p3' },
    ],
    seals: [
      { id: 's1', x: 2, y: 1, targetPieceId: 'p1', requiredSide: 'entity' },
      { id: 's2', x: 2, y: 5, targetPieceId: 'p1', requiredSide: 'reflection' },
      { id: 's3', x: 3, y: 1, targetPieceId: 'p2', requiredSide: 'entity' },
      { id: 's4', x: 3, y: 5, targetPieceId: 'p2', requiredSide: 'reflection' },
      { id: 's5', x: 0, y: 3, targetPieceId: 'p3', requiredSide: 'both' },
    ],
    minSteps: 8,
  },
  {
    id: 'level-6',
    name: '镜心之谜',
    difficulty: 'hard',
    description: '中心对称，步步为营',
    boardConfig: {
      width: 7,
      height: 7,
      cellSize: 52,
      theme: 'default',
    },
    reflectionRule: {
      type: 'opposite',
      mirrorAxis: 'both',
      axisOffset: 0,
    },
    pieces: [
      { id: 'p1', type: 'stone', x: 0, y: 0, isEntity: true, linkedId: 'r1' },
      { id: 'r1', type: 'stone', x: 6, y: 6, isEntity: false, linkedId: 'p1' },
      { id: 'p2', type: 'jade', x: 6, y: 0, isEntity: true, linkedId: 'r2' },
      { id: 'r2', type: 'jade', x: 0, y: 6, isEntity: false, linkedId: 'p2' },
    ],
    seals: [
      { id: 's1', x: 2, y: 2, targetPieceId: 'p1', requiredSide: 'entity' },
      { id: 's2', x: 4, y: 4, targetPieceId: 'p1', requiredSide: 'reflection' },
      { id: 's3', x: 4, y: 2, targetPieceId: 'p2', requiredSide: 'entity' },
      { id: 's4', x: 2, y: 4, targetPieceId: 'p2', requiredSide: 'reflection' },
    ],
    minSteps: 8,
  },
];

export function getLevelById(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getLevelsByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard'
): Level[] {
  return LEVELS.filter((l) => l.difficulty === difficulty);
}
