import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Eye, MessageSquare, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useContentStore } from '@/store/useContentStore';

const statsBase = [
  { label: 'Total Reach', value: '2.4M', change: '+12.5%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Engagement', value: '142K', change: '+8.2%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Impressions', value: '5.1M', change: '+24.1%', icon: Eye, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { label: 'Comments', value: '12.4K', change: '-2.4%', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
];

const chartData = {
  '7days': [40, 70, 45, 90, 65, 85, 100],
  '30days': [120, 150, 180, 140, 200, 170, 220]
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export function Overview() {
  const { posts, searchQuery } = useContentStore();
  const [timeframe, setTimeframe] = useState('7days');
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  const currentChartData = chartData[timeframe as keyof typeof chartData];

  // Filter posts based on header search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const draftCount = posts.filter(p => p.columnId === 'ideas' || p.status === 'Draft').length;
  const reviewCount = posts.filter(p => p.columnId === 'drafting' || p.status === 'Review').length;
  const readyCount = posts.filter(p => p.columnId === 'review' || p.status === 'Ready').length;
  const publishedCount = posts.filter(p => p.columnId === 'published' || p.status === 'Published').length;

  const handleStatClick = (stat: any) => {
    toast.success(`Viewing ${stat.label} analytics`, {
      description: `Navigating to detailed view with ${stat.value} total recorded.`
    });
  };

  const handleChartClick = (val: number) => {
    toast.info(`Performance Detail`, {
      description: `${val}k views recorded for this period.`
    });
  };

  const handlePostClick = (post: any) => {
    toast.success(`Opened: ${post.title}`, {
      description: `Platform: ${post.platform} | Status: ${post.status}`
    });
  };

  return (
    <div className="space-y-8 pb-8">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-tight text-white mb-2"
        >
          Welcome back, Jessica
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          Here's what's happening with your content today.
        </motion.p>
      </div>

      {/* Dynamic Summary Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-elegant overflow-hidden"
      >
        {[
          { label: 'Ideas / Drafts', count: draftCount, color: 'text-white' },
          { label: 'In Review', count: reviewCount, color: 'text-white' },
          { label: 'Ready to Post', count: readyCount, color: 'text-white' },
          { label: 'Published', count: publishedCount, color: 'text-emerald-400' }
        ].map((item, i) => (
          <motion.div 
            key={item.label}
            whileHover={{ scale: 1.02 }}
            className={`text-center p-3 ${i > 0 ? 'border-l border-white/10' : ''}`}
          >
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">{item.label}</p>
            <span className={`text-2xl font-bold ${item.color}`}>{item.count}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Cards Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsBase.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          return (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStatClick(stat)}
              className="cursor-pointer"
            >
              <div className="glass-card p-6 rounded-2xl border-white/5 hover:border-white/20 transition-all duration-300 group shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon size={24} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change}
                    <ArrowUpRight size={16} className={`ml-1 ${!isPositive && 'rotate-90'}`} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors relative z-10">{stat.value}</h3>
                <p className="text-muted-foreground font-medium relative z-10">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts & Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, type: 'spring' }}
          className="lg:col-span-2 glass-card rounded-2xl p-6 border-white/5 shadow-elegant"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Performance Overview</h2>
            <select 
              value={timeframe}
              onChange={(e) => {
                setTimeframe(e.target.value);
                toast.success(`Timeframe updated to ${e.target.options[e.target.selectedIndex].text}`);
              }}
              className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all"
            >
              <option value="7days" className="bg-[#111115]">Last 7 days</option>
              <option value="30days" className="bg-[#111115]">Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full flex items-end justify-between gap-3 pt-4">
            <AnimatePresence mode="popLayout">
              {currentChartData.map((h, i) => (
                <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    exit={{ height: 0 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 80 }}
                    onClick={() => handleChartClick(h)}
                    className="w-full bg-gradient-to-t from-purple-600/30 to-purple-500/90 rounded-t-lg group-hover:to-pink-500/90 transition-all duration-300 relative cursor-pointer shadow-glow"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold py-1.5 px-3 rounded-md transition-opacity duration-300 shadow-lg pointer-events-none">
                      {h}k
                    </div>
                  </motion.div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="glass-card rounded-2xl p-6 border-white/5 flex flex-col shadow-elegant"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Upcoming & Active</h2>
            <button 
              onClick={() => setIsViewAllOpen(true)}
              className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
            >
              View all
            </button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[350px]">
            <AnimatePresence mode="popLayout">
              {filteredPosts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-muted-foreground text-sm font-medium"
                >
                  No matching posts found.
                </motion.div>
              ) : (
                filteredPosts.map((post, index) => (
                  <motion.div 
                    key={post.id} 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handlePostClick(post)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{post.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                        ${post.status === 'Ready' ? 'bg-emerald-400/20 text-emerald-400' : 
                          post.status === 'Review' ? 'bg-amber-400/20 text-amber-400' : 
                          post.status === 'Published' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-white/10 text-white/60'}`}>
                        {post.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                      <span>{post.platform} • {post.tag}</span>
                      <span>Just now</span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <Dialog open={isViewAllOpen} onOpenChange={setIsViewAllOpen}>
        <DialogContent className="bg-[#111115] border border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">All Marketing Posts</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            {posts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => {
                  handlePostClick(post);
                  setIsViewAllOpen(false);
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{post.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                    ${post.status === 'Ready' ? 'bg-emerald-400/20 text-emerald-400' : 
                      post.status === 'Review' ? 'bg-amber-400/20 text-amber-400' : 
                      post.status === 'Published' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-white/10 text-white/60'}`}>
                    {post.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                  <span>{post.platform} • {post.tag}</span>
                  <span>Just now</span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
