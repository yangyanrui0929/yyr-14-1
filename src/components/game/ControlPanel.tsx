import { useGameStore } from '@/store/gameStore';
import {
  Undo2,
  RotateCcw,
  Eye,
  EyeOff,
  Home,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LEVELS } from '@/data/levels';
import { cn } from '@/lib/utils';

export function ControlPanel() {
  const navigate = useNavigate();
  const {
    level,
    currentStep,
    moveHistory,
    showReflectionPath,
    isCompleted,
    undo,
    reset,
    setShowReflectionPath,
  } = useGameStore();

  if (!level) return null;

  const currentIndex = LEVELS.findIndex((l) => l.id === level.id);
  const nextLevel = LEVELS[currentIndex + 1];

  const handleNextLevel = () => {
    if (nextLevel) {
      navigate(`/game/${nextLevel.id}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
        <div className="text-sm text-white/60 mb-1">当前关卡</div>
        <div className="text-xl font-bold text-white mb-1">{level.name}</div>
        <div
          className={cn(
            'inline-block px-2 py-0.5 rounded-full text-xs font-medium',
            level.difficulty === 'easy' && 'bg-green-500/20 text-green-300',
            level.difficulty === 'medium' && 'bg-yellow-500/20 text-yellow-300',
            level.difficulty === 'hard' && 'bg-red-500/20 text-red-300'
          )}
        >
          {level.difficulty === 'easy' && '初级'}
          {level.difficulty === 'medium' && '中级'}
          {level.difficulty === 'hard' && '高级'}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
        <div className="text-sm text-white/60 mb-2">步数</div>
        <div className="text-4xl font-bold text-amber-300 font-mono">
          {currentStep}
        </div>
        {level.minSteps && (
          <div className="text-sm text-white/40 mt-1">
            最佳参考: {level.minSteps} 步
          </div>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3">
        <button
          onClick={undo}
          disabled={moveHistory.length === 0 || isCompleted}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 font-medium',
            moveHistory.length > 0 && !isCompleted
              ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          )}
        >
          <Undo2 size={18} />
          <span>撤销一步</span>
        </button>

        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 font-medium"
        >
          <RotateCcw size={18} />
          <span>重置关卡</span>
        </button>

        <button
          onClick={() => setShowReflectionPath(!showReflectionPath)}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 font-medium',
            showReflectionPath
              ? 'bg-amber-500/30 text-amber-200 hover:bg-amber-500/40'
              : 'bg-white/10 hover:bg-white/20 text-white'
          )}
        >
          {showReflectionPath ? <Eye size={18} /> : <EyeOff size={18} />}
          <span>倒影预览</span>
        </button>

        <div className="h-px bg-white/10 my-2" />

        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200"
        >
          <Home size={18} />
          <span>返回选关</span>
        </button>

        {isCompleted && nextLevel && (
          <button
            onClick={handleNextLevel}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-500/30"
          >
            <span>下一关</span>
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        <div className="text-sm text-white/50 leading-relaxed">
          <div className="font-medium text-white/70 mb-2">玩法说明</div>
          <p>• 拖动湖面实体棋子移动</p>
          <p>• 倒影会按镜像规则同步移动</p>
          <p>• 实体和倒影同时压住印记即通关</p>
        </div>
      </div>
    </div>
  );
}
