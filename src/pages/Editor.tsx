import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorBoard } from '@/components/editor/EditorBoard';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { PropertyPanel } from '@/components/editor/PropertyPanel';
import { useEditorStore } from '@/store/editorStore';
import type { Piece, Seal } from '@/types';
import { ArrowLeft, Save, Play, Trash2 } from 'lucide-react';
import { deleteCustomPuzzle } from '@/utils/storage';
import { cn } from '@/lib/utils';

export function Editor() {
  const navigate = useNavigate();
  const { savePuzzle, pieces, seals, puzzleName, loadCustomPuzzles } = useEditorStore();
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [selectedSeal, setSelectedSeal] = useState<Seal | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = () => {
    if (pieces.length === 0) {
      setSaveMessage('请至少放置一枚棋子');
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }
    if (seals.length === 0) {
      setSaveMessage('请至少放置一个印记');
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    const id = savePuzzle();
    if (id) {
      setSaveMessage('保存成功！');
      setTimeout(() => setSaveMessage(null), 2000);
    }
  };

  const handleTest = () => {
    if (pieces.length === 0 || seals.length === 0) return;
    const puzzles = loadCustomPuzzles();
    const lastPuzzle = puzzles[puzzles.length - 1];
    if (lastPuzzle) {
      navigate(`/game/custom-${lastPuzzle.id}`);
    }
  };

  const customPuzzles = loadCustomPuzzles();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: '#2d5a4a' }}
        />
        <div
          className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: '#0a2540' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>返回</span>
            </button>
            <h1 className="text-2xl font-bold text-white">棋局编辑器</h1>
          </div>

          <div className="flex items-center gap-3">
            {saveMessage && (
              <span className="text-sm text-amber-300 animate-pulse">
                {saveMessage}
              </span>
            )}
            <button
              onClick={handleTest}
              disabled={pieces.length === 0 || seals.length === 0}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
                pieces.length > 0 && seals.length > 0
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              )}
            >
              <Play size={16} />
              <span>测试谜题</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              <Save size={16} />
              <span>保存</span>
            </button>
          </div>
        </div>

        <div className="flex gap-6 items-start justify-center">
          <div className="w-40 flex-shrink-0">
            <EditorToolbar />

            <div className="mt-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-xs text-white/50 mb-2">统计</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>棋子数</span>
                  <span>{pieces.filter((p) => p.isEntity).length}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>印记数</span>
                  <span>{seals.length}</span>
                </div>
              </div>
            </div>

            {customPuzzles.length > 0 && (
              <div className="mt-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-xs text-white/50 mb-2">已保存谜题</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {customPuzzles.slice(0, 5).map((puzzle) => (
                    <div
                      key={puzzle.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-white/60 truncate flex-1">
                        {puzzle.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomPuzzle(puzzle.id);
                          window.location.reload();
                        }}
                        className="text-white/30 hover:text-red-400 transition-colors ml-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <EditorBoard
              selectedPieceId={selectedPiece?.id || null}
              selectedSealId={selectedSeal?.id || null}
              onSelectPiece={setSelectedPiece}
              onSelectSeal={setSelectedSeal}
            />
          </div>

          <div className="w-64 flex-shrink-0">
            <PropertyPanel
              selectedPiece={selectedPiece}
              selectedSeal={selectedSeal}
              onClose={() => {
                setSelectedPiece(null);
                setSelectedSeal(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
