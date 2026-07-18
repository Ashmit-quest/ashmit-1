import { LayoutDashboard, CalendarDays, KanbanSquare, Settings, PieChart, PenTool } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useContentStore } from '@/store/useContentStore';

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'kanban', label: 'Board', icon: KanbanSquare },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { activeTab, setActiveTab } = useContentStore();

  return (
    <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-glow">
          <PenTool className="text-white" size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">ContentOS</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group",
                isActive ? "text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={20} className="relative z-10" />
              <span className="font-medium relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="glass-card p-4 rounded-2xl">
          <p className="text-sm text-white/80 font-medium mb-2">Pro Plan</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full w-3/4 shadow-glow" />
          </div>
          <p className="text-xs text-muted-foreground">75% storage used</p>
        </div>
      </div>
    </aside>
  );
}
