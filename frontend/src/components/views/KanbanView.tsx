import { motion } from 'framer-motion';
import { MoreHorizontal, Plus, MessageSquare, Paperclip } from 'lucide-react';

const columns = [
  { id: 'ideas', title: 'Ideas', color: 'border-blue-500' },
  { id: 'drafting', title: 'Drafting', color: 'border-amber-500' },
  { id: 'review', title: 'In Review', color: 'border-purple-500' },
  { id: 'published', title: 'Published', color: 'border-emerald-500' },
];

const mockTasks: Record<string, any[]> = {
  ideas: [
    { title: 'Top 10 UI Trends 2024', tag: 'Blog', comments: 3, attachments: 1 },
    { title: 'Behind the scenes reel', tag: 'Instagram', comments: 0, attachments: 2 },
  ],
  drafting: [
    { title: 'Q3 Feature Announcement', tag: 'Newsletter', comments: 5, attachments: 0 },
  ],
  review: [
    { title: 'Case Study: Acme Corp', tag: 'Website', comments: 2, attachments: 4 },
    { title: 'Founder Interview Video', tag: 'YouTube', comments: 8, attachments: 1 },
  ],
  published: [
    { title: 'September Update', tag: 'Email', comments: 1, attachments: 0 },
  ]
};

export function KanbanView() {
  return (
    <div className="h-full flex flex-col pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Content Board</h1>
          <p className="text-muted-foreground text-lg">Track your content pipeline</p>
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-white/10 flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Add Column
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((col, colIdx) => (
            <div key={col.id} className="w-80 flex flex-col bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 h-full">
              <div className={`p-4 border-t-2 ${col.color} rounded-t-2xl flex items-center justify-between bg-white/[0.02]`}>
                <h3 className="font-bold text-white flex items-center gap-2">
                  {col.title}
                  <span className="bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded-full">
                    {mockTasks[col.id].length}
                  </span>
                </h3>
                <button className="text-white/50 hover:text-white transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                {mockTasks[col.id].map((task, i) => (
                  <motion.div
                    key={i}
                    layoutId={`task-${col.id}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: colIdx * 0.1 + i * 0.1 }}
                    className="glass-card p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-white/10 text-white">
                        {task.tag}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-white mb-4 leading-snug">{task.title}</p>
                    <div className="flex items-center gap-4 text-muted-foreground text-xs font-medium">
                      {task.comments > 0 && (
                        <div className="flex items-center gap-1 hover:text-white transition-colors">
                          <MessageSquare size={14} /> {task.comments}
                        </div>
                      )}
                      {task.attachments > 0 && (
                        <div className="flex items-center gap-1 hover:text-white transition-colors">
                          <Paperclip size={14} /> {task.attachments}
                        </div>
                      )}
                      <div className="ml-auto w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-background shadow-sm" />
                    </div>
                  </motion.div>
                ))}

                <button className="w-full py-3 border border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-semibold">
                  <Plus size={16} /> Add Card
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
