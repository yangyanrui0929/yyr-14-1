import { useEditorStore } from '@/store/editorStore';
import { MousePointer2, Circle, Target, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorTool } from '@/types';

const tools: { id: EditorTool; label: string; icon: typeof MousePointer2 }[] = [
  { id: 'select', label: '选择', icon: MousePointer2 },
  { id: 'entity', label: '棋子', icon: Circle },
  { id: 'seal', label: '印记', icon: Target },
  { id: 'erase', label: '擦除', icon: Trash2 },
];

export function EditorToolbar() {
  const { selectedTool, setSelectedTool } = useEditorStore();

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
      <div className="text-sm text-white/60 mb-3 px-2">工具栏</div>
      <div className="flex flex-col gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                selectedTool === tool.id
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                  : 'bg-white/5 text-white/70 hover:bg-white/15 hover:text-white'
              )}
            >
              <Icon size={18} />
              <span className="font-medium">{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
