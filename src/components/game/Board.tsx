import { useRef, useState, useEffect, useCallback, memo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Piece } from './Piece';
import { Seal } from './Seal';
import { WaterSurface } from './WaterSurface';
import { canMovePiece } from '@/utils/gameLogic';
import { calculateReflectionPosition } from '@/utils/reflection';
import type { Piece as PieceType } from '@/types';
import { cn } from '@/lib/utils';

interface BoardProps {
  editable?: boolean;
}

export const Board = memo(function Board({ editable = false }: BoardProps) {
  const {
    level,
    pieces,
    selectedPieceId,
    previewPosition,
    showReflectionPath,
    isCompleted,
    setSelectedPieceId,
    setPreviewPosition,
    movePiece,
    checkWin,
    completeLevel,
  } = useGameStore();

  const boardRef = useRef<HTMLDivElement>(null);
  const [draggingPiece, setDraggingPiece] = useState<PieceType | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!level) return null;

  const { boardConfig, seals, reflectionRule } = level;
  const { width, height, cellSize } = boardConfig;
  const boardWidth = width * cellSize;
  const boardHeight = height * cellSize;

  const getGridPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!boardRef.current) return null;
      const rect = boardRef.current.getBoundingClientRect();
      const x = Math.floor((clientX - rect.left) / cellSize);
      const y = Math.floor((clientY - rect.top) / cellSize);
      return { x, y };
    },
    [cellSize]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, piece: PieceType) => {
      if (isCompleted || !piece.isEntity) return;
      e.preventDefault();

      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;

      setDraggingPiece(piece);
      setIsDragging(true);
      setSelectedPieceId(piece.id);
      setDragOffset({
        x: e.clientX - rect.left - piece.x * cellSize - cellSize / 2,
        y: e.clientY - rect.top - piece.y * cellSize - cellSize / 2,
      });
      setDragPosition({ x: piece.x, y: piece.y });
    },
    [cellSize, isCompleted, setSelectedPieceId]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !draggingPiece) return;

      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;

      const pixelX = e.clientX - rect.left - dragOffset.x - cellSize / 2;
      const pixelY = e.clientY - rect.top - dragOffset.y - cellSize / 2;

      const gridX = Math.round(pixelX / cellSize);
      const gridY = Math.round(pixelY / cellSize);

      setDragPosition({
        x: Math.max(0, Math.min(width - 1, gridX)),
        y: Math.max(0, Math.min(height - 1, gridY)),
      });

      const previewX = Math.max(0, Math.min(width - 1, gridX));
      const previewY = Math.max(0, Math.min(height - 1, gridY));
      setPreviewPosition({ x: previewX, y: previewY });
    },
    [isDragging, draggingPiece, dragOffset, cellSize, width, height, setPreviewPosition]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !draggingPiece || !dragPosition) {
      setIsDragging(false);
      setDraggingPiece(null);
      setPreviewPosition(null);
      return;
    }

    const targetX = dragPosition.x;
    const targetY = dragPosition.y;

    const { valid } = canMovePiece(
      draggingPiece.id,
      targetX,
      targetY,
      pieces,
      boardConfig,
      reflectionRule
    );

    if (valid && (targetX !== draggingPiece.x || targetY !== draggingPiece.y)) {
      movePiece(draggingPiece.id, targetX, targetY);

      setTimeout(() => {
        if (checkWin()) {
          completeLevel();
        }
      }, 200);
    }

    setIsDragging(false);
    setDraggingPiece(null);
    setDragPosition(null);
    setPreviewPosition(null);
    setSelectedPieceId(null);
  }, [
    isDragging,
    draggingPiece,
    dragPosition,
    pieces,
    boardConfig,
    reflectionRule,
    movePiece,
    checkWin,
    completeLevel,
    setPreviewPosition,
    setSelectedPieceId,
  ]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, piece: PieceType) => {
      if (isCompleted || !piece.isEntity) return;
      const touch = e.touches[0];

      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;

      setDraggingPiece(piece);
      setIsDragging(true);
      setSelectedPieceId(piece.id);
      setDragOffset({
        x: touch.clientX - rect.left - piece.x * cellSize - cellSize / 2,
        y: touch.clientY - rect.top - piece.y * cellSize - cellSize / 2,
      });
      setDragPosition({ x: piece.x, y: piece.y });
    },
    [cellSize, isCompleted, setSelectedPieceId]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !draggingPiece) return;
      e.preventDefault();
      const touch = e.touches[0];

      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;

      const pixelX = touch.clientX - rect.left - dragOffset.x - cellSize / 2;
      const pixelY = touch.clientY - rect.top - dragOffset.y - cellSize / 2;

      const gridX = Math.round(pixelX / cellSize);
      const gridY = Math.round(pixelY / cellSize);

      setDragPosition({
        x: Math.max(0, Math.min(width - 1, gridX)),
        y: Math.max(0, Math.min(height - 1, gridY)),
      });

      const previewX = Math.max(0, Math.min(width - 1, gridX));
      const previewY = Math.max(0, Math.min(height - 1, gridY));
      setPreviewPosition({ x: previewX, y: previewY });
    },
    [isDragging, draggingPiece, dragOffset, cellSize, width, height, setPreviewPosition]
  );

  const handleTouchEnd = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const isSealActive = (seal: typeof seals[0]) => {
    const targetPiece = pieces.find((p) => p.id === seal.targetPieceId);
    if (!targetPiece) return false;

    const reflectionPiece = pieces.find(
      (p) => p.linkedId === seal.targetPieceId && !p.isEntity
    );

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
  };

  const getPreviewReflectionPosition = () => {
    if (!previewPosition || !draggingPiece) return null;
    return calculateReflectionPosition(
      previewPosition.x,
      previewPosition.y,
      reflectionRule,
      boardConfig
    );
  };

  const previewReflPos = getPreviewReflectionPosition();
  const waterY = height / 2 * cellSize;

  return (
    <div
      ref={boardRef}
      className={cn(
        'relative rounded-2xl overflow-hidden shadow-2xl',
        isCompleted && 'ring-4 ring-amber-400/50'
      )}
      style={{
        width: boardWidth,
        height: boardHeight,
        background: 'linear-gradient(180deg, #1a3a4a 0%, #0a2540 50%, #051520 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center top, rgba(255,255,255,0.1) 0%, transparent 60%)',
        }}
      />

      {seals.map((seal) => (
        <Seal
          key={seal.id}
          seal={seal}
          cellSize={cellSize}
          isActive={isSealActive(seal)}
        />
      ))}

      {previewPosition &&
        previewReflPos &&
        showReflectionPath &&
        draggingPiece && (
          <>
            <div
              className="absolute rounded-full border-2 border-dashed border-amber-400/50 pointer-events-none z-5"
              style={{
                width: cellSize * 0.7,
                height: cellSize * 0.7,
                left: previewPosition.x * cellSize + cellSize * 0.15,
                top: previewPosition.y * cellSize + cellSize * 0.15,
              }}
            />
            <div
              className="absolute rounded-full border-2 border-dashed border-blue-400/40 pointer-events-none z-5"
              style={{
                width: cellSize * 0.7,
                height: cellSize * 0.7,
                left: previewReflPos.x * cellSize + cellSize * 0.15,
                top: previewReflPos.y * cellSize + cellSize * 0.15,
              }}
            />
          </>
        )}

      {pieces.map((piece) => {
        const isDraggingThis = draggingPiece?.id === piece.id && isDragging;
        const showReal = !isDraggingThis || !piece.isEntity;

        if (isDraggingThis && piece.isEntity && dragPosition) {
          return (
            <div key={`drag-${piece.id}`}>
              <Piece
                piece={{ ...piece, x: dragPosition.x, y: dragPosition.y }}
                cellSize={cellSize}
                isDragging={true}
                isPreview={false}
              />
              <Piece piece={piece} cellSize={cellSize} isPreview={true} />
            </div>
          );
        }

        return showReal ? (
          <Piece
            key={piece.id}
            piece={piece}
            cellSize={cellSize}
            isSelected={selectedPieceId === piece.id}
            onMouseDown={(e) => handleMouseDown(e, piece)}
            onTouchStart={(e) => handleTouchStart(e, piece)}
          />
        ) : null;
      })}

      {reflectionRule.mirrorAxis === 'horizontal' ||
      reflectionRule.mirrorAxis === 'both' ? (
        <WaterSurface width={boardWidth} y={waterY} />
      ) : null}

      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎊</div>
            <div className="text-3xl font-bold text-amber-300 drop-shadow-lg">
              通关！
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
