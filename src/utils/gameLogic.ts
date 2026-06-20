import type {
  Piece,
  Seal,
  Level,
  MoveRecord,
  BoardConfig,
  ReflectionRule,
} from '@/types';
import {
  calculateReflectionPosition,
  isValidPosition,
  isPositionOccupied,
  findReflectionPiece,
} from './reflection';

export function checkWinCondition(
  pieces: Piece[],
  seals: Seal[]
): boolean {
  if (seals.length === 0) return false;

  return seals.every((seal) => {
    const targetPiece = pieces.find((p) => p.id === seal.targetPieceId);
    if (!targetPiece) return false;

    const reflectionPiece = findReflectionPiece(targetPiece, pieces);

    switch (seal.requiredSide) {
      case 'entity':
        return targetPiece.x === seal.x && targetPiece.y === seal.y;
      case 'reflection':
        return (
          reflectionPiece?.x === seal.x && reflectionPiece?.y === seal.y
        );
      case 'both':
        return (
          targetPiece.x === seal.x &&
          targetPiece.y === seal.y &&
          reflectionPiece?.x === seal.x &&
          reflectionPiece?.y === seal.y
        );
      default:
        return false;
    }
  });
}

export function canMovePiece(
  pieceId: string,
  targetX: number,
  targetY: number,
  pieces: Piece[],
  boardConfig: BoardConfig,
  reflectionRule: ReflectionRule
): { valid: boolean; reason?: string } {
  const piece = pieces.find((p) => p.id === pieceId);
  if (!piece) return { valid: false, reason: '棋子不存在' };
  if (!piece.isEntity) return { valid: false, reason: '只能移动实体棋子' };

  if (!isValidPosition(targetX, targetY, boardConfig)) {
    return { valid: false, reason: '超出棋盘范围' };
  }

  if (isPositionOccupied(targetX, targetY, pieces, pieceId)) {
    return { valid: false, reason: '目标位置已有棋子' };
  }

  const refPos = calculateReflectionPosition(
    targetX,
    targetY,
    reflectionRule,
    boardConfig
  );

  if (!isValidPosition(refPos.x, refPos.y, boardConfig)) {
    return { valid: false, reason: '倒影将超出棋盘范围' };
  }

  const reflectionPiece = findReflectionPiece(piece, pieces);
  const excludeRefId = reflectionPiece?.id;

  if (isPositionOccupied(refPos.x, refPos.y, pieces, excludeRefId)) {
    if (refPos.x !== targetX || refPos.y !== targetY) {
      return { valid: false, reason: '倒影目标位置已有棋子' };
    }
  }

  return { valid: true };
}

export function executeMove(
  pieceId: string,
  targetX: number,
  targetY: number,
  pieces: Piece[],
  boardConfig: BoardConfig,
  reflectionRule: ReflectionRule
): { pieces: Piece[]; moveRecord: MoveRecord } {
  const piece = pieces.find((p) => p.id === pieceId);
  if (!piece) return { pieces, moveRecord: {} as MoveRecord };

  const reflectionPiece = findReflectionPiece(piece, pieces);
  const refPos = calculateReflectionPosition(
    targetX,
    targetY,
    reflectionRule,
    boardConfig
  );

  const newPieces = pieces.map((p) => {
    if (p.id === pieceId) {
      return { ...p, x: targetX, y: targetY };
    }
    if (reflectionPiece && p.id === reflectionPiece.id) {
      return { ...p, x: refPos.x, y: refPos.y };
    }
    return p;
  });

  const moveRecord: MoveRecord = {
    pieceId,
    from: { x: piece.x, y: piece.y },
    to: { x: targetX, y: targetY },
    reflectionFrom: reflectionPiece
      ? { x: reflectionPiece.x, y: reflectionPiece.y }
      : undefined,
    reflectionTo: reflectionPiece
      ? { x: refPos.x, y: refPos.y }
      : undefined,
  };

  return { pieces: newPieces, moveRecord };
}

export function undoMove(
  moveRecord: MoveRecord,
  pieces: Piece[]
): Piece[] {
  return pieces.map((p) => {
    if (p.id === moveRecord.pieceId) {
      return { ...p, x: moveRecord.from.x, y: moveRecord.from.y };
    }
    const reflectionPiece = pieces.find(
      (piece) => piece.linkedId === moveRecord.pieceId && !piece.isEntity
    );
    if (reflectionPiece && p.id === reflectionPiece.id && moveRecord.reflectionFrom) {
      return {
        ...p,
        x: moveRecord.reflectionFrom.x,
        y: moveRecord.reflectionFrom.y,
      };
    }
    return p;
  });
}

export function initializeLevelPieces(level: Level): Piece[] {
  return level.pieces.map((p) => ({ ...p }));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
