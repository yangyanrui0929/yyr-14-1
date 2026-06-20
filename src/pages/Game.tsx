import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Board } from '@/components/game/Board';
import { ControlPanel } from '@/components/game/ControlPanel';
import { useGameStore } from '@/store/gameStore';
import { LEVELS, getLevelById } from '@/data/levels';
import { getCustomPuzzle } from '@/utils/storage';
import type { Level } from '@/types';
import { ArrowLeft } from 'lucide-react';

export function Game() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { loadLevel, level } = useGameStore();

  const isCustomPuzzle = levelId?.startsWith('custom-');

  const puzzleLevel = useMemo<Level | null>(() => {
    if (!levelId) return null;

    if (isCustomPuzzle) {
      const puzzleId = levelId.replace('custom-', '');
      const puzzle = getCustomPuzzle(puzzleId);
      if (puzzle) {
        return {
          ...puzzle,
          difficulty: 'easy',
          description: '自制谜题',
        } as Level;
      }
      return null;
    }

    return getLevelById(levelId) || null;
  }, [levelId, isCustomPuzzle]);

  useEffect(() => {
    if (puzzleLevel) {
      loadLevel(puzzleLevel);
    } else if (levelId) {
      navigate('/');
    }
  }, [puzzleLevel, levelId, loadLevel, navigate]);

  const currentIndex = LEVELS.findIndex((l) => l.id === levelId);
  const prevLevel = !isCustomPuzzle ? LEVELS[currentIndex - 1] : null;
  const nextLevel = !isCustomPuzzle ? LEVELS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: '#2d5a4a' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: '#0a2540' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </button>

          <div className="flex gap-2">
            {prevLevel && (
              <button
                onClick={() => navigate(`/game/${prevLevel.id}`)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all text-sm"
              >
                上一关
              </button>
            )}
            {nextLevel && (
              <button
                onClick={() => navigate(`/game/${nextLevel.id}`)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all text-sm"
              >
                下一关
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          <div className="flex-shrink-0">
            {level && <Board />}
          </div>

          <div className="w-full lg:w-72 flex-shrink-0">
            <ControlPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
