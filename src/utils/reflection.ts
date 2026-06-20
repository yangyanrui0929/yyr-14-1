import type { ReflectionRule, Piece, BoardConfig } from '@/types';

export function calculateReflectionPosition(
  entityX: number,
  entityY: number,
  rule: ReflectionRule,
  boardConfig: BoardConfig
): { x: number; y: number } {
  let refX = entityX;
  let refY = entityY;
  const { width, height } = boardConfig;
  const offset = rule.axisOffset;

  if (rule.mirrorAxis === 'horizontal' || rule.mirrorAxis === 'both') {
    const midY = (height - 1) / 2 + offset;
    refY = Math.round(2 * midY - entityY);
  }

  if (rule.mirrorAxis === 'vertical' || rule.mirrorAxis === 'both') {
    const midX = (width - 1) / 2 + offset;
    refX = Math.round(2 * midX - entityX);
  }

  if (rule.type === 'opposite') {
    const centerX = (width - 1) / 2;
    const centerY = (height - 1) / 2;
    refX = Math.round(centerX * 2 - entityX);
    refY = Math.round(centerY * 2 - entityY);
  }

  return { x: refX, y: refY };
}

export function calculateReflectionMove(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  rule: ReflectionRule,
  boardConfig: BoardConfig
): { fromX: number; fromY: number; toX: number; toY: number } {
  const fromRef = calculateReflectionPosition(fromX, fromY, rule, boardConfig);
  const toRef = calculateReflectionPosition(toX, toY, rule, boardConfig);

  if (rule.reverseDirection) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    return {
      fromX: fromRef.x,
      fromY: fromRef.y,
      toX: fromRef.x - dx,
      toY: fromRef.y - dy,
    };
  }

  return {
    fromX: fromRef.x,
    fromY: fromRef.y,
    toX: toRef.x,
    toY: toRef.y,
  };
}

export function isValidPosition(
  x: number,
  y: number,
  boardConfig: BoardConfig
): boolean {
  return x >= 0 && x < boardConfig.width && y >= 0 && y < boardConfig.height;
}

export function isPositionOccupied(
  x: number,
  y: number,
  pieces: Piece[],
  excludeId?: string
): boolean {
  return pieces.some(
    (p) => p.x === x && p.y === y && p.id !== excludeId
  );
}

export function findReflectionPiece(
  entityPiece: Piece,
  pieces: Piece[]
): Piece | undefined {
  return pieces.find((p) => p.linkedId === entityPiece.id && !p.isEntity);
}

export function findEntityPiece(
  reflectionPiece: Piece,
  pieces: Piece[]
): Piece | undefined {
  return pieces.find((p) => p.id === reflectionPiece.linkedId && p.isEntity);
}
