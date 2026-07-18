import { useState } from 'react';
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

export default function Index() {
  const { activeTab } = useContentStore();

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
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <Toaster theme="dark" position="top-right" className="bg-[#111115] border-white/10 text-white" />
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none" />

      <Sidebar />
      
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
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
