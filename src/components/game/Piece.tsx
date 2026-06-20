import { memo } from 'react';
import { PIECE_TYPES } from '@/data/levels';
import type { Piece as PieceType } from '@/types';
import { cn } from '@/lib/utils';

interface PieceProps {
  piece: PieceType;
  cellSize: number;
  isSelected?: boolean;
  isPreview?: boolean;
  isDragging?: boolean;
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

export const Piece = memo(function Piece({
  piece,
  cellSize,
  isSelected = false,
  isPreview = false,
  isDragging = false,
  onClick,
  onMouseDown,
  onTouchStart,
}: PieceProps) {
  const pieceType = PIECE_TYPES.find((t) => t.id === piece.type);
  const color = pieceType?.color || '#2d5a4a';
  const size = cellSize * 0.7;

  return (
    <div
      className={cn(
        'absolute flex items-center justify-center transition-all duration-200 select-none',
        piece.isEntity ? 'z-20' : 'z-10',
        isSelected && 'z-30',
        isDragging && 'cursor-grabbing z-40',
        !isPreview && piece.isEntity && 'cursor-grab',
        isPreview && 'opacity-40 pointer-events-none'
      )}
      style={{
        width: size,
        height: size,
        left: piece.x * cellSize + (cellSize - size) / 2,
        top: piece.y * cellSize + (cellSize - size) / 2,
      }}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div
        className={cn(
          'w-full h-full rounded-full flex items-center justify-center text-white font-bold shadow-lg',
          piece.isEntity
            ? 'border-2 border-white/30'
            : 'opacity-60 border border-white/20 scale-95',
          isSelected && 'ring-4 ring-amber-300 ring-opacity-70'
        )}
        style={{
          backgroundColor: color,
          boxShadow: piece.isEntity
            ? `0 4px 12px ${color}66, inset 0 2px 4px rgba(255,255,255,0.3)`
            : `0 2px 8px ${color}33`,
          transform: piece.isEntity ? 'none' : 'scaleY(-1) rotate(180deg)',
          filter: piece.isEntity ? 'none' : 'blur(0.5px) brightness(0.8)',
        }}
      >
        <span
          className="text-lg"
          style={{
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          {pieceType?.symbol || '●'}
        </span>
      </div>

      {piece.isEntity && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full opacity-30 blur-sm"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  );
});
