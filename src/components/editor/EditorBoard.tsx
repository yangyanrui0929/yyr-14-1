import { useRef, useCallback, memo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { Piece as PieceComponent } from '../game/Piece';
import { Seal as SealComponent } from '../game/Seal';
import { WaterSurface } from '../game/WaterSurface';
import type { Piece as PieceType, Seal as SealType } from '@/types';
import { cn } from '@/lib/utils';

interface EditorBoardProps {
  onSelectPiece?: (piece: PieceType | null) => void;
  onSelectSeal?: (seal: SealType | null) => void;
  selectedPieceId?: string | null;
  selectedSealId?: string | null;
}

export const EditorBoard = memo(function EditorBoard({
  onSelectPiece,
  onSelectSeal,
  selectedPieceId,
  selectedSealId,
}: EditorBoardProps) {
  const {
    boardConfig,
    pieces,
    seals,
    reflectionRule,
    selectedTool,
    addPiece,
    addSeal,
    removePiece,
    removeSeal,
    movePiece,
    moveSeal,
  } = useEditorStore();

  const boardRef = useRef<HTMLDivElement>(null);
  const { width, height, cellSize } = boardConfig;
  const boardWidth = width * cellSize;
  const boardHeight = height * cellSize;

  const getGridPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!boardRef.current) return null;
      const rect = boardRef.current.getBoundingClientRect();
      const x = Math.floor((clientX - rect.left) / cellSize);
      const y = Math.floor((clientY - rect.top) / cellSize);
      if (x < 0 || x >= width || y < 0 || y >= height) return null;
      return { x, y };
    },
    [cellSize, width, height]
  );

  const handleBoardClick = useCallback(
    (e: React.MouseEvent) => {
      const pos = getGridPosition(e.clientX, e.clientY);
      if (!pos) return;

      const clickedPiece = pieces.find(
        (p) => p.x === pos.x && p.y === pos.y && p.isEntity
      );
      const clickedSeal = seals.find((s) => s.x === pos.x && s.y === pos.y);

      if (selectedTool === 'select') {
        if (clickedPiece) {
          onSelectPiece?.(clickedPiece);
          onSelectSeal?.(null);
        } else if (clickedSeal) {
          onSelectSeal?.(clickedSeal);
          onSelectPiece?.(null);
        } else {
          onSelectPiece?.(null);
          onSelectSeal?.(null);
        }
      } else if (selectedTool === 'entity') {
        if (!clickedPiece) {
          addPiece(pos.x, pos.y);
        }
      } else if (selectedTool === 'seal') {
        if (!clickedSeal) {
          const entityPieces = pieces.filter((p) => p.isEntity);
          if (entityPieces.length > 0) {
            const nearestPiece = entityPieces.reduce((nearest, p) => {
              const dist = Math.abs(p.x - pos.x) + Math.abs(p.y - pos.y);
              const nearestDist = Math.abs(nearest.x - pos.x) + Math.abs(nearest.y - pos.y);
              return dist < nearestDist ? p : nearest;
            });
            addSeal(pos.x, pos.y, nearestPiece.id);
          }
        }
      } else if (selectedTool === 'erase') {
        if (clickedPiece) {
          removePiece(clickedPiece.id);
        } else if (clickedSeal) {
          removeSeal(clickedSeal.id);
        }
      }
    },
    [
      selectedTool,
      pieces,
      seals,
      getGridPosition,
      addPiece,
      addSeal,
      removePiece,
      removeSeal,
      onSelectPiece,
      onSelectSeal,
    ]
  );

  const waterY = height / 2 * cellSize;

  return (
    <div
      ref={boardRef}
      className={cn(
        'relative rounded-2xl overflow-hidden shadow-2xl cursor-crosshair',
        selectedTool === 'erase' && 'cursor-not-allowed'
      )}
      style={{
        width: boardWidth,
        height: boardHeight,
        background: 'linear-gradient(180deg, #1a3a4a 0%, #0a2540 50%, #051520 100%)',
      }}
      onClick={handleBoardClick}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />

      {seals.map((seal) => (
        <div
          key={`seal-wrapper-${seal.id}`}
          onClick={(e) => {
            e.stopPropagation();
            if (selectedTool === 'select') {
              onSelectSeal?.(seal);
              onSelectPiece?.(null);
            } else if (selectedTool === 'erase') {
              removeSeal(seal.id);
            }
          }}
          className={cn(
            'cursor-pointer transition-all',
            selectedSealId === seal.id && 'ring-2 ring-amber-400 rounded-lg'
          )}
        >
          <SealComponent seal={seal} cellSize={cellSize} isActive={false} />
        </div>
      ))}

      {pieces.map((piece) => (
        <div
          key={`piece-wrapper-${piece.id}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!piece.isEntity) return;
            if (selectedTool === 'select') {
              onSelectPiece?.(piece);
              onSelectSeal?.(null);
            } else if (selectedTool === 'erase') {
              removePiece(piece.id);
            }
          }}
        >
          <PieceComponent
            piece={piece}
            cellSize={cellSize}
            isSelected={selectedPieceId === piece.id}
          />
        </div>
      ))}

      {reflectionRule.mirrorAxis === 'horizontal' ||
      reflectionRule.mirrorAxis === 'both' ? (
        <WaterSurface width={boardWidth} y={waterY} />
      ) : null}

      <div className="absolute inset-0 pointer-events-none border-2 border-amber-400/20 rounded-2xl" />
    </div>
  );
});
