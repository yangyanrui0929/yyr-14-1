import type {
  BoardConfig,
  ReplayRecord,
  CustomPuzzle,
  StepRecord,
  PieceType,
} from '@/types';

const STORAGE_KEYS = {
  BOARD_CONFIGS: 'mirror_chess_board_configs',
  PIECE_TYPES: 'mirror_chess_piece_types',
  REFLECTION_RULES: 'mirror_chess_reflection_rules',
  STEP_RECORDS: 'mirror_chess_step_records',
  CUSTOM_PUZZLES: 'mirror_chess_custom_puzzles',
  REPLAYS: 'mirror_chess_replays',
};

function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function saveBoardConfig(config: BoardConfig): void {
  const configs = getStorageItem<BoardConfig[]>(STORAGE_KEYS.BOARD_CONFIGS, []);
  const existingIndex = configs.findIndex((c) => c.theme === config.theme);
  if (existingIndex >= 0) {
    configs[existingIndex] = config;
  } else {
    configs.push(config);
  }
  setStorageItem(STORAGE_KEYS.BOARD_CONFIGS, configs);
}

export function getBoardConfigs(): BoardConfig[] {
  return getStorageItem<BoardConfig[]>(STORAGE_KEYS.BOARD_CONFIGS, []);
}

export function saveStepRecord(record: StepRecord): void {
  const records = getStorageItem<Record<string, StepRecord>>(
    STORAGE_KEYS.STEP_RECORDS,
    {}
  );
  const existing = records[record.levelId];
  if (!existing || record.bestSteps < existing.bestSteps) {
    records[record.levelId] = record;
  }
  setStorageItem(STORAGE_KEYS.STEP_RECORDS, records);
}

export function getStepRecords(): Record<string, StepRecord> {
  return getStorageItem<Record<string, StepRecord>>(
    STORAGE_KEYS.STEP_RECORDS,
    {}
  );
}

export function getStepRecord(levelId: string): StepRecord | null {
  const records = getStepRecords();
  return records[levelId] || null;
}

export function saveReplay(replay: ReplayRecord): void {
  const replays = getStorageItem<ReplayRecord[]>(STORAGE_KEYS.REPLAYS, []);
  replays.unshift(replay);
  if (replays.length > 50) {
    replays.pop();
  }
  setStorageItem(STORAGE_KEYS.REPLAYS, replays);
}

export function getReplays(): ReplayRecord[] {
  return getStorageItem<ReplayRecord[]>(STORAGE_KEYS.REPLAYS, []);
}

export function getReplay(id: string): ReplayRecord | null {
  const replays = getReplays();
  return replays.find((r) => r.id === id) || null;
}

export function deleteReplay(id: string): void {
  const replays = getReplays().filter((r) => r.id !== id);
  setStorageItem(STORAGE_KEYS.REPLAYS, replays);
}

export function saveCustomPuzzle(puzzle: CustomPuzzle): void {
  const puzzles = getStorageItem<CustomPuzzle[]>(
    STORAGE_KEYS.CUSTOM_PUZZLES,
    []
  );
  const existingIndex = puzzles.findIndex((p) => p.id === puzzle.id);
  if (existingIndex >= 0) {
    puzzles[existingIndex] = puzzle;
  } else {
    puzzles.push(puzzle);
  }
  setStorageItem(STORAGE_KEYS.CUSTOM_PUZZLES, puzzles);
}

export function getCustomPuzzles(): CustomPuzzle[] {
  return getStorageItem<CustomPuzzle[]>(STORAGE_KEYS.CUSTOM_PUZZLES, []);
}

export function getCustomPuzzle(id: string): CustomPuzzle | null {
  const puzzles = getCustomPuzzles();
  return puzzles.find((p) => p.id === id) || null;
}

export function deleteCustomPuzzle(id: string): void {
  const puzzles = getCustomPuzzles().filter((p) => p.id !== id);
  setStorageItem(STORAGE_KEYS.CUSTOM_PUZZLES, puzzles);
}

export function savePieceTypes(types: PieceType[]): void {
  setStorageItem(STORAGE_KEYS.PIECE_TYPES, types);
}

export function getPieceTypes(): PieceType[] {
  return getStorageItem<PieceType[]>(STORAGE_KEYS.PIECE_TYPES, []);
}
