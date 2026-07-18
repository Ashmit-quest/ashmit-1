import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Overview } from '@/components/views/Overview';
import { CalendarView } from '@/components/views/CalendarView';
import { KanbanView } from '@/components/views/KanbanView';
import { AnalyticsView } from '@/components/views/AnalyticsView';
import { SettingsView } from '@/components/views/SettingsView';
import { useContentStore } from '@/store/useContentStore';
import { Toaster } from 'sonner';
import { Starfield } from '@/components/ui/starfield';
import { PenTool } from 'lucide-react';

export default function Index() {
  const { activeTab } = useContentStore();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 3500); // Loader displays for ~3.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const renderView = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'calendar': return <CalendarView />;
      case 'kanban': return <KanbanView />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView />;
      default: return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <h2>Module in development</h2>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans relative">
      <Toaster theme="dark" position="top-right" className="bg-[#111115] border-white/10 text-white" />
      
      {/* Animated Starfield Background */}
      <Starfield />

      <AnimatePresence mode="wait">
        {appLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-[#060608] flex flex-col items-center justify-center z-50 overflow-hidden"
          >
            {/* Soft Ambient Aurora inside Loader */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute w-[400px] h-[400px] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none" />

            <div className="flex flex-col items-center gap-6">
              {/* Spinning Logo Frame */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                animate={{ scale: [0.5, 1.1, 1], opacity: 1, rotate: 360 }}
                transition={{ 
                  duration: 1.5, 
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-teal-400 flex items-center justify-center shadow-glow relative overflow-hidden"
              >
                {/* Internal counter-rotating icon to keep upright */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center"
                >
                  <PenTool className="text-white drop-shadow-lg" size={40} />
                </motion.div>
                
                {/* Shimmer overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"
                  initial={{ x: '-100%', y: '-100%' }}
                  animate={{ x: '100%', y: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                />
              </motion.div>

              {/* Staggered text letters reveal */}
              <div className="flex font-bold text-4xl tracking-wider text-white select-none">
                {["C", "o", "n", "t", "e", "n", "t", "O", "S"].map((letter, index) => {
                  const isO = letter === "O";
                  return (
                    <motion.span
                      key={index}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        delay: 0.6 + index * 0.08, 
                        type: "spring", 
                        stiffness: 120, 
                        damping: 12 
                      }}
                      className="inline-block"
                    >
                      {isO ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="inline-block text-purple-400 origin-center"
                        >
                          {letter}
                        </motion.span>
                      ) : (
                        <span className="inline-block">{letter}</span>
                      )}
                    </motion.span>
                  );
                })}
              </div>

              {/* Progress bar line */}
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-teal-400 shadow-glow"
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none z-0" />

      <Sidebar />
      
      <div className="flex-1 flex flex-col relative z-20 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full max-w-7xl mx-auto"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
