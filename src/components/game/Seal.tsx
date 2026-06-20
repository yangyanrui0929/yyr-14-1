import { memo } from 'react';
import type { Seal as SealType } from '@/types';
import { cn } from '@/lib/utils';

interface SealProps {
  seal: SealType;
  cellSize: number;
  isActive: boolean;
}

export const Seal = memo(function Seal({ seal, cellSize, isActive }: SealProps) {
  const size = cellSize * 0.6;

  return (
    <div
      className={cn(
        'absolute flex items-center justify-center pointer-events-none transition-all duration-300',
        isActive && 'animate-pulse'
      )}
      style={{
        width: size,
        height: size,
        left: seal.x * cellSize + (cellSize - size) / 2,
        top: seal.y * cellSize + (cellSize - size) / 2,
      }}
    >
      <div
        className={cn(
          'w-full h-full rounded-lg flex items-center justify-center transition-all duration-300',
          isActive
            ? 'bg-rose-500/80 scale-110'
            : 'bg-rose-500/30 border-2 border-rose-400/50 border-dashed'
        )}
        style={{
          boxShadow: isActive
            ? '0 0 20px rgba(201, 74, 74, 0.6), 0 0 40px rgba(201, 74, 74, 0.3)'
            : 'none',
        }}
      >
        <span
          className={cn(
            'text-xs font-bold transition-all duration-300',
            isActive ? 'text-white scale-110' : 'text-rose-300/70'
          )}
        >
          {seal.requiredSide === 'entity' && '实'}
          {seal.requiredSide === 'reflection' && '影'}
          {seal.requiredSide === 'both' && '印'}
        </span>
      </div>

      {isActive && (
        <div
          className="absolute inset-0 rounded-lg animate-ping opacity-30"
          style={{ backgroundColor: '#c94a4a' }}
        />
      )}
    </div>
  );
});
