import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus, MessageSquare, Paperclip, X, Tag as TagIcon, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Task = {
  id: string;
  title: string;
  tag: string;
  comments: number;
  attachments: number;
  columnId: string;
};

type Column = {
  id: string;
  title: string;
  color: string;
};

const initialColumns: Column[] = [
  { id: 'ideas', title: 'Ideas', color: 'border-blue-500' },
  { id: 'drafting', title: 'Drafting', color: 'border-amber-500' },
  { id: 'review', title: 'In Review', color: 'border-purple-500' },
  { id: 'published', title: 'Published', color: 'border-emerald-500' },
];

const initialTasks: Task[] = [
  { id: 't1', title: 'Top 10 UI Trends 2024', tag: 'Blog', comments: 3, attachments: 1, columnId: 'ideas' },
  { id: 't2', title: 'Behind the scenes reel', tag: 'Instagram', comments: 0, attachments: 2, columnId: 'ideas' },
  { id: 't3', title: 'Q3 Feature Announcement', tag: 'Newsletter', comments: 5, attachments: 0, columnId: 'drafting' },
  { id: 't4', title: 'Case Study: Acme Corp', tag: 'Website', comments: 2, attachments: 4, columnId: 'review' },
  { id: 't5', title: 'Founder Interview Video', tag: 'YouTube', comments: 8, attachments: 1, columnId: 'review' },
  { id: 't6', title: 'September Update', tag: 'Email', comments: 1, attachments: 0, columnId: 'published' },
];

const availableTags = ['Blog', 'Instagram', 'Newsletter', 'Website', 'YouTube', 'Email', 'Twitter'];

export function KanbanView() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
  // Drag and Drop State
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // Dialog States
  const [isTaskDialog, setIsTaskDialog] = useState(false);
  const [isColDialog, setIsColDialog] = useState(false);
  
  // New Task State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('Blog');
  const [activeColumnId, setActiveColumnId] = useState<string>('');

  // New Col State
  const [newColTitle, setNewColTitle] = useState('');

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to allow the drag image to generate before adding opacity
    setTimeout(() => {
      const el = document.getElementById(`task-${task.id}`);
      if (el) el.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, task: Task) => {
    const el = document.getElementById(`task-${task.id}`);
    if (el) el.style.opacity = '1';
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    if (draggedTask.columnId !== targetColumnId) {
      setTasks(prev => prev.map(t => 
        t.id === draggedTask.id ? { ...t, columnId: targetColumnId } : t
      ));
      const colName = columns.find(c => c.id === targetColumnId)?.title;
      toast.success(`Moved to ${colName}`);
    }
  };

  // --- Actions ---
  const handleAddTaskClick = (columnId: string) => {
    setActiveColumnId(columnId);
    setNewTaskTitle('');
    setNewTaskTag('Blog');
    setIsTaskDialog(true);
  };

  const handleSaveTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error('Task title is required');
      return;
    }
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      tag: newTaskTag,
      comments: 0,
      attachments: 0,
      columnId: activeColumnId
    };
    setTasks([...tasks, newTask]);
    setIsTaskDialog(false);
    toast.success('Card added successfully');
  };

  const handleAddColClick = () => {
    setNewColTitle('');
    setIsColDialog(true);
  };

  const handleSaveCol = () => {
    if (!newColTitle.trim()) {
      toast.error('Column title is required');
      return;
    }
    const newCol: Column = {
      id: Math.random().toString(36).substr(2, 9),
      title: newColTitle,
      color: 'border-white/20' // default neutral color for new columns
    };
    setColumns([...columns, newCol]);
    setIsColDialog(false);
    toast.success('Column added');
  };

  const handleTaskClick = (task: Task) => {
    toast.info(`Opened: ${task.title}`, {
      description: `Tag: ${task.tag} | Comments: ${task.comments}`
    });
  };

  const handleColOptions = (colTitle: string) => {
    toast.info(`Options for ${colTitle}`);
  };

  return (
    <div className="h-full flex flex-col pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Content Board</h1>
          <p className="text-muted-foreground text-lg">Track your content pipeline</p>
        </div>
        <button 
          onClick={handleAddColClick}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-white/10 flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Add Column
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((col, colIdx) => {
            const colTasks = tasks.filter(t => t.columnId === col.id);
            
            return (
              <div 
                key={col.id} 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="w-80 flex flex-col bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 h-full"
              >
                <div className={`p-4 border-t-2 ${col.color} rounded-t-2xl flex items-center justify-between bg-white/[0.02]`}>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    {col.title}
                    <span className="bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded-full">
                      {colTasks.length}
                    </span>
                  </h3>
                  <button 
                    onClick={() => handleColOptions(col.title)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                  <AnimatePresence>
                    {colTasks.map((task, i) => (
                      <motion.div
                        key={task.id}
                        id={`task-${task.id}`}
                        layoutId={`task-${task.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        draggable
                        onDragStart={(e: any) => handleDragStart(e, task)}
                        onDragEnd={(e: any) => handleDragEnd(e, task)}
                        onClick={() => handleTaskClick(task)}
                        className="glass-card p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors group relative"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-bold px-2 py-1 rounded bg-white/10 text-white">
                            {task.tag}
                          </span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleTaskClick(task); }}
                            className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white transition-all"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-white mb-4 leading-snug pr-4">{task.title}</p>
                        
                        <div className="absolute top-1/2 -left-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white/30 cursor-grab">
                          <GripVertical size={16} />
                        </div>

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
                  </AnimatePresence>

                  <button 
                    onClick={() => handleAddTaskClick(col.id)}
                    className="w-full py-3 border border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <Plus size={16} /> Add Card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isTaskDialog} onOpenChange={setIsTaskDialog}>
        <DialogContent className="bg-[#111115] border border-white/10 text-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Add New Card
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Card Title</label>
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                <TagIcon size={14} /> Platform / Tag
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setNewTaskTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      newTaskTag === tag 
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="border-t border-white/10 pt-4">
            <Button variant="ghost" onClick={() => setIsTaskDialog(false)} className="text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleSaveTask} className="bg-purple-600 hover:bg-purple-500 text-white">
              Save Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Column Dialog */}
      <Dialog open={isColDialog} onOpenChange={setIsColDialog}>
        <DialogContent className="bg-[#111115] border border-white/10 text-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Add New Column
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Column Title</label>
              <input 
                type="text" 
                placeholder="e.g. Needs Revision" 
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
              />
            </div>
          </div>
          <DialogFooter className="border-t border-white/10 pt-4">
            <Button variant="ghost" onClick={() => setIsColDialog(false)} className="text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleSaveCol} className="bg-purple-600 hover:bg-purple-500 text-white">
              Save Column
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
