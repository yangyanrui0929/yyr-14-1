import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReplay } from '@/utils/storage';
import type { ReplayRecord, Piece, MoveRecord } from '@/types';
import { Piece as PieceComponent } from '@/components/game/Piece';
import { Seal as SealComponent } from '@/components/game/Seal';
import { WaterSurface } from '@/components/game/WaterSurface';
import { getLevelById, LEVELS } from '@/data/levels';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, FastForward } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Replay() {
  const { replayId } = useParams<{ replayId: string }>();
  const navigate = useNavigate();
  const [replay, setReplay] = useState<ReplayRecord | null>(null);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!replayId) return;

    const replayData = getReplay(replayId);
    if (!replayData) {
      navigate('/');
      return;
    }

    setReplay(replayData);

    let levelData = getLevelById(replayData.levelId);
    const isCustom = replayData.levelId.startsWith('custom-');

    if (!levelData && isCustom) {
      const customId = replayData.levelId.replace('custom-', '');
      const customPuzzles = JSON.parse(
        localStorage.getItem('mirror_chess_custom_puzzles') || '[]'
      );
      const puzzle = customPuzzles.find((p: any) => p.id === customId);
      if (puzzle) {
        levelData = {
          ...puzzle,
          difficulty: 'easy' as const,
          description: '自制谜题',
        };
      }
    }

    if (levelData) {
      setPieces(levelData.pieces.map((p) => ({ ...p })));
    }
  }, [replayId, navigate]);

  const applyMove = useCallback(
    (move: MoveRecord, forward: boolean) => {
      setPieces((prev) =>
        prev.map((p) => {
          if (p.id === move.pieceId) {
            return {
              ...p,
              x: forward ? move.to.x : move.from.x,
              y: forward ? move.to.y : move.from.y,
            };
          }
          const reflFrom = move.reflectionFrom;
          const reflTo = move.reflectionTo;
          if (
            reflFrom &&
            reflTo &&
            p.linkedId === move.pieceId &&
            !p.isEntity
          ) {
            return {
              ...p,
              x: forward ? reflTo.x : reflFrom.x,
              y: forward ? reflTo.y : reflFrom.y,
            };
          }
          return p;
        })
      );
    },
    []
  );

  const playNextStep = useCallback(() => {
    if (!replay) return;
    if (currentStepIndex >= replay.moveHistory.length - 1) {
      setIsPlaying(false);
      return;
    }
    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    applyMove(replay.moveHistory[nextIndex], true);
  }, [replay, currentStepIndex, applyMove]);

  useEffect(() => {
    if (isPlaying && replay) {
      timerRef.current = window.setInterval(() => {
        playNextStep();
      }, 800 / playbackSpeed);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, playbackSpeed, playNextStep, replay]);

  const handlePlay = () => {
    if (currentStepIndex >= (replay?.moveHistory.length || 0) - 1) {
      handleReset();
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    if (replay) {
      const level = getLevelById(replay.levelId);
      if (level) {
        setPieces(level.pieces.map((p) => ({ ...p })));
      }
    }
  };

  const handlePrevStep = () => {
    if (!replay || currentStepIndex < 0) return;
    setIsPlaying(false);
    applyMove(replay.moveHistory[currentStepIndex], false);
    setCurrentStepIndex(currentStepIndex - 1);
  };

  const handleNextStep = () => {
    if (!replay || currentStepIndex >= replay.moveHistory.length - 1) return;
    setIsPlaying(false);
    playNextStep();
  };

  const toggleSpeed = () => {
    const speeds = [0.5, 1, 2, 3];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  if (!replay) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        加载中...
      </div>
    );
  }

  const level = getLevelById(replay.levelId);
  const boardConfig = level?.boardConfig || {
    width: 6,
    height: 6,
    cellSize: 60,
  };
  const seals = level?.seals || [];
  const { width, height, cellSize } = boardConfig;
  const boardWidth = width * cellSize;
  const boardHeight = height * cellSize;
  const waterY = height / 2 * cellSize;

  const totalSteps = replay.moveHistory.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

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

  const isCompleted = currentStepIndex >= totalSteps - 1 && totalSteps > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: '#6b21a8' }}
        />
        <div
          className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: '#be185d' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </button>

          <h1 className="text-xl font-bold text-white">
            录像回放 - {replay.levelName}
          </h1>

          <div className="text-white/60">
            共 {replay.steps} 步
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: boardWidth,
              height: boardHeight,
              background:
                'linear-gradient(180deg, #1a3a4a 0%, #0a2540 50%, #051520 100%)',
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

            {seals.map((seal) => (
              <SealComponent
                key={seal.id}
                seal={seal}
                cellSize={cellSize}
                isActive={isSealActive(seal)}
              />
            ))}

            {pieces.map((piece) => (
              <PieceComponent
                key={piece.id}
                piece={piece}
                cellSize={cellSize}
              />
            ))}

            {level?.reflectionRule.mirrorAxis === 'horizontal' ||
            level?.reflectionRule.mirrorAxis === 'both' ? (
              <WaterSurface width={boardWidth} y={waterY} />
            ) : null}

            {isCompleted && (
              <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎊</div>
                  <div className="text-3xl font-bold text-amber-300 drop-shadow-lg">
                    通关！
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>进度</span>
                <span>
                  {Math.max(0, currentStepIndex + 1)} / {totalSteps} 步
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(0, progress)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="重置"
              >
                <SkipBack size={18} />
              </button>

              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex < 0}
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                  currentStepIndex >= 0
                    ? 'bg-white/15 hover:bg-white/25 text-white cursor-pointer'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                )}
                title="上一步"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex >= totalSteps - 1}
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                  currentStepIndex < totalSteps - 1
                    ? 'bg-white/15 hover:bg-white/25 text-white cursor-pointer'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                )}
                title="下一步"
              >
                <SkipForward size={20} />
              </button>

              <button
                onClick={toggleSpeed}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-medium transition-colors"
                title={`倍速 ${playbackSpeed}x`}
              >
                <FastForward size={16} className="mr-0.5" />
                {playbackSpeed}x
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-white/40">
              通关时间: {new Date(replay.completedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
