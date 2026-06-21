import { useEditorStore } from '@/store/editorStore';
import type { Piece, Seal, MirrorAxis, ReflectionRuleType } from '@/types';
import { PIECE_TYPES } from '@/data/levels';
import { cn } from '@/lib/utils';
import { Settings, Grid3X3, Layers, RotateCcw } from 'lucide-react';

interface PropertyPanelProps {
  selectedPiece: Piece | null;
  selectedSeal: Seal | null;
  onUpdatePiece: (piece: Piece) => void;
  onUpdateSeal: (seal: Seal) => void;
  onClose: () => void;
}

export function PropertyPanel({
  selectedPiece,
  selectedSeal,
  onUpdatePiece,
  onUpdateSeal,
  onClose,
}: PropertyPanelProps) {
  const {
    boardConfig,
    reflectionRule,
    puzzleName,
    setBoardConfig,
    setReflectionRule,
    setPuzzleName,
    movePiece,
    moveSeal,
    updatePieceType,
    updateSealRequiredSide,
    clearBoard,
  } = useEditorStore();

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val >= 3 && val <= 12) {
      setBoardConfig({ width: val });
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val >= 3 && val <= 12) {
      setBoardConfig({ height: val });
    }
  };

  const handleAxisChange = (axis: MirrorAxis) => {
    setReflectionRule({ mirrorAxis: axis });
  };

  const handleRuleTypeChange = (type: ReflectionRuleType) => {
    setReflectionRule({ type });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-white/80 font-medium mb-3">
          <Settings size={16} />
          <span>谜题名称</span>
        </div>
        <input
          type="text"
          value={puzzleName}
          onChange={(e) => setPuzzleName(e.target.value)}
          placeholder="输入谜题名称"
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-teal-400/50 transition-colors"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 text-white/80 font-medium mb-3">
          <Grid3X3 size={16} />
          <span>棋盘设置</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/50 block mb-1">宽度</label>
            <input
              type="number"
              value={boardConfig.width}
              onChange={handleWidthChange}
              min={3}
              max={12}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:border-teal-400/50"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 block mb-1">高度</label>
            <input
              type="number"
              value={boardConfig.height}
              onChange={handleHeightChange}
              min={3}
              max={12}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:border-teal-400/50"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-white/80 font-medium mb-3">
          <Layers size={16} />
          <span>倒影规则</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/50 block mb-2">镜像轴</label>
            <div className="grid grid-cols-3 gap-2">
              {(['horizontal', 'vertical', 'both'] as MirrorAxis[]).map(
                (axis) => (
                  <button
                    key={axis}
                    onClick={() => handleAxisChange(axis)}
                    className={cn(
                      'py-2 px-2 rounded-lg text-xs font-medium transition-all',
                      reflectionRule.mirrorAxis === axis
                        ? 'bg-teal-500/30 text-teal-200 border border-teal-400/50'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    )}
                  >
                    {axis === 'horizontal' && '水平'}
                    {axis === 'vertical' && '垂直'}
                    {axis === 'both' && '双轴'}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-white/50 block mb-2">规则类型</label>
            <div className="grid grid-cols-3 gap-2">
              {(['mirror', 'opposite', 'custom'] as ReflectionRuleType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => handleRuleTypeChange(type)}
                    className={cn(
                      'py-2 px-2 rounded-lg text-xs font-medium transition-all',
                      reflectionRule.type === type
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    )}
                  >
                    {type === 'mirror' && '镜像'}
                    {type === 'opposite' && '反向'}
                    {type === 'custom' && '自定义'}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedPiece && (
        <div className="border-t border-white/10 pt-4">
          <div className="text-white/80 font-medium mb-3">棋子属性</div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/50 block mb-1">棋子类型</label>
              <div className="flex gap-2">
                {PIECE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      updatePieceType(selectedPiece.id, type.id);
                      onUpdatePiece({ ...selectedPiece, type: type.id });
                    }}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 transition-all',
                      selectedPiece.type === type.id
                        ? 'border-amber-400 scale-110'
                        : 'border-transparent hover:border-white/30'
                    )}
                    style={{ backgroundColor: type.color }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-white/50 block mb-1">X 坐标</label>
                <input
                  type="number"
                  value={selectedPiece.x}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 0 && val < boardConfig.width) {
                      movePiece(selectedPiece.id, val, selectedPiece.y);
                    }
                  }}
                  className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded-lg text-white text-sm text-center"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">Y 坐标</label>
                <input
                  type="number"
                  value={selectedPiece.y}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 0 && val < boardConfig.height) {
                      movePiece(selectedPiece.id, selectedPiece.x, val);
                    }
                  }}
                  className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded-lg text-white text-sm text-center"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSeal && (
        <div className="border-t border-white/10 pt-4">
          <div className="text-white/80 font-medium mb-3">印记属性</div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/50 block mb-1">要求条件</label>
              <div className="grid grid-cols-3 gap-2">
                {(['entity', 'reflection', 'both'] as const).map((side) => (
                  <button
                    key={side}
                    onClick={() => {
                      updateSealRequiredSide(selectedSeal.id, side);
                      onUpdateSeal({ ...selectedSeal, requiredSide: side });
                    }}
                    className={cn(
                      'py-1.5 px-2 rounded-lg text-xs font-medium transition-all',
                      selectedSeal.requiredSide === side
                        ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    )}
                  >
                    {side === 'entity' && '实体'}
                    {side === 'reflection' && '倒影'}
                    {side === 'both' && '都要'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-white/50 block mb-1">X 坐标</label>
                <input
                  type="number"
                  value={selectedSeal.x}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 0 && val < boardConfig.width) {
                      moveSeal(selectedSeal.id, val, selectedSeal.y);
                    }
                  }}
                  className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded-lg text-white text-sm text-center"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">Y 坐标</label>
                <input
                  type="number"
                  value={selectedSeal.y}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 0 && val < boardConfig.height) {
                      moveSeal(selectedSeal.id, selectedSeal.x, val);
                    }
                  }}
                  className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded-lg text-white text-sm text-center"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-white/10 pt-4">
        <button
          onClick={clearBoard}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all text-sm"
        >
          <RotateCcw size={16} />
          <span>清空棋盘</span>
        </button>
      </div>
    </div>
  );
}
