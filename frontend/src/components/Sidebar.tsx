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
      <div className="p-6 flex items-center gap-3 group cursor-pointer mt-2">
        {/* Rotating Icon Box */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          whileHover={{ 
            scale: 1.15, 
            borderRadius: "50%",
            boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)"
          }}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-teal-400 flex items-center justify-center shadow-glow relative overflow-hidden flex-shrink-0"
        >
          {/* Counter-Rotation to keep the PenTool icon upright while the box spins */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="relative z-10 flex items-center justify-center w-full h-full"
          >
            <PenTool className="text-white drop-shadow-md" size={20} />
          </motion.div>
        </motion.div>
        
        {/* Animated Typography */}
        <div className="flex font-bold text-2xl tracking-tight text-white overflow-hidden pb-1">
          {["C", "o", "n", "t", "e", "n", "t", "O", "S"].map((letter, index) => {
            const isO = letter === "O";
            return (
              <motion.span 
                key={index}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 10 }}
                className="inline-block"
              >
                {isO ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    whileHover={{ scale: 1.2, color: "#f472b6", transition: { duration: 0.2 } }}
                    className="inline-block text-purple-400 origin-center"
                  >
                    {letter}
                  </motion.span>
                ) : (
                  <motion.span 
                    whileHover={{ y: -4, color: "#d8b4fe", transition: { duration: 0.2 } }} 
                    className="inline-block transition-colors"
                  >
                    {letter}
                  </motion.span>
                )}
              </motion.span>
            );
          })}
        </div>
      </div>

      <motion.nav 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-4 py-6 space-y-2 mt-4"
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
