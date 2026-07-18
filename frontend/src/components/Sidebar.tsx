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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } }
};

export function Sidebar() {
  const { activeTab, setActiveTab } = useContentStore();

  return (
    <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col z-20">
      <div className="p-6 flex items-center gap-3">
        <motion.div 
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-glow"
        >
          <PenTool className="text-white" size={20} />
        </motion.div>
        <span className="font-bold text-xl tracking-tight text-white">ContentOS</span>
      </div>

      <motion.nav 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-4 py-6 space-y-2"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              variants={itemVariants}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
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
            </motion.button>
          );
        })}
      </motion.nav>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: 'spring' }}
        className="p-4"
      >
        <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <p className="text-sm text-white/80 font-medium mb-2 relative z-10">Pro Plan</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden relative z-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full shadow-glow" 
            />
          </div>
          <p className="text-xs text-muted-foreground relative z-10">75% storage used</p>
        </div>
      </motion.div>
    </aside>
  );
}
