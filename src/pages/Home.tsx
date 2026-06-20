import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEVELS } from '@/data/levels';
import { getStepRecords, getReplays, getCustomPuzzles } from '@/utils/storage';
import type { Difficulty, CustomPuzzle } from '@/types';
import {
  Play,
  Edit3,
  Film,
  Star,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'levels' | 'custom' | 'replays'>('levels');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  const stepRecords = getStepRecords();
  const replays = getReplays();
  const customPuzzles = getCustomPuzzles();

  const filteredLevels = LEVELS.filter(
    (l) => selectedDifficulty === 'all' || l.difficulty === selectedDifficulty
  );

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'from-green-500 to-emerald-600';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      case 'hard':
        return 'from-red-500 to-rose-600';
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return '初级';
      case 'medium':
        return '中级';
      case 'hard':
        return '高级';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: '#2d5a4a' }}
        />
        <div
          className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: '#0a2540' }}
        />

        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, white 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, white 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="text-amber-400" size={28} />
            <h1
              className="text-5xl font-bold bg-gradient-to-r from-teal-200 via-amber-200 to-teal-200 bg-clip-text text-transparent"
              style={{ fontFamily: '"Ma Shan Zheng", cursive' }}
            >
              镜湖倒影棋
            </h1>
            <Sparkles className="text-amber-400" size={28} />
          </div>
          <p className="text-white/60 text-lg max-w-md mx-auto">
            湖光潋滟，倒影成趣。移动实体棋子，让倒影与印记共鸣
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('levels')}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300',
              activeTab === 'levels'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            )}
          >
            <Trophy size={18} />
            <span>关卡挑战</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300',
              activeTab === 'custom'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            )}
          >
            <Edit3 size={18} />
            <span>自制谜题</span>
          </button>
          <button
            onClick={() => setActiveTab('replays')}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300',
              activeTab === 'replays'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            )}
          >
            <Film size={18} />
            <span>通关录像</span>
          </button>
        </div>

        {activeTab === 'levels' && (
          <>
            <div className="flex justify-center gap-2 mb-6">
              {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                    selectedDifficulty === diff
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  )}
                >
                  {diff === 'all' && '全部'}
                  {diff === 'easy' && '初级'}
                  {diff === 'medium' && '中级'}
                  {diff === 'hard' && '高级'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLevels.map((level, index) => {
                const record = stepRecords[level.id];
                const isCompleted = record?.completed;

                return (
                  <div
                    key={level.id}
                    onClick={() => navigate(`/game/${level.id}`)}
                    className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div
                      className={cn(
                        'absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-20 blur-sm group-hover:opacity-30 transition-opacity',
                        getDifficultyColor(level.difficulty)
                      )}
                    />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white/20">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                              {level.name}
                            </h3>
                            <span
                              className={cn(
                                'inline-block text-xs px-2 py-0.5 rounded-full',
                                level.difficulty === 'easy' &&
                                  'bg-green-500/20 text-green-300',
                                level.difficulty === 'medium' &&
                                  'bg-yellow-500/20 text-yellow-300',
                                level.difficulty === 'hard' &&
                                  'bg-red-500/20 text-red-300'
                              )}
                            >
                              {getDifficultyLabel(level.difficulty)}
                            </span>
                          </div>
                        </div>

                        {isCompleted && (
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star size={16} fill="currentColor" />
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-white/50 mb-4 line-clamp-2">
                        {level.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-white/40">
                          {level.boardConfig.width}×{level.boardConfig.height} 棋盘
                        </div>

                        <div className="flex items-center gap-2">
                          {record && (
                            <span className="text-sm text-amber-300">
                              {record.bestSteps}步
                            </span>
                          )}
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={14} className="text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/editor')}
              className="w-full p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-amber-400/50 hover:bg-amber-500/5 transition-all duration-300 group"
            >
              <div className="flex items-center justify-center gap-3 text-white/60 group-hover:text-amber-300 transition-colors">
                <Edit3 size={24} />
                <span className="text-lg font-medium">创建新谜题</span>
              </div>
            </button>

            {customPuzzles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customPuzzles.map((puzzle: CustomPuzzle) => (
                  <div
                    key={puzzle.id}
                    onClick={() => navigate(`/game/custom-${puzzle.id}`)}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <h3 className="text-lg font-bold text-white mb-2">
                      {puzzle.name}
                    </h3>
                    <div className="text-sm text-white/50">
                      {puzzle.boardConfig.width}×{puzzle.boardConfig.height} 棋盘 ·{' '}
                      {puzzle.pieces.filter((p) => p.isEntity).length} 枚棋子
                    </div>
                    <div className="text-xs text-white/30 mt-2">
                      {new Date(puzzle.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-white/40">
                暂无自制谜题，点击上方创建
              </div>
            )}
          </div>
        )}

        {activeTab === 'replays' && (
          <div className="space-y-3">
            {replays.length > 0 ? (
              replays.map((replay) => (
                <div
                  key={replay.id}
                  onClick={() => navigate(`/replay/${replay.id}`)}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Film size={18} className="text-purple-300" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{replay.levelName}</div>
                      <div className="text-sm text-white/40">
                        {new Date(replay.completedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-300">
                      {replay.steps} 步
                    </div>
                    <div className="text-xs text-white/40">点击回放</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-white/40">
                暂无通关记录
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 text-center pb-8 text-white/30 text-sm">
        拖动棋子 · 镜像对称 · 解谜通关
      </div>
    </div>
  );
}
