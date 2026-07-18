import { useState } from 'react';
import { motion } from 'framer-motion';
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

  // Dynamic calculations based on store posts
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
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back, Jessica</h1>
        <p className="text-muted-foreground text-lg">Here's what's happening with your content today.</p>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="text-center p-3">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Ideas / Drafts</p>
          <span className="text-2xl font-bold text-white">{draftCount}</span>
        </div>
        <div className="text-center p-3 border-l border-white/10">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">In Review</p>
          <span className="text-2xl font-bold text-white">{reviewCount}</span>
        </div>
        <div className="text-center p-3 border-l border-white/10">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Ready to Post</p>
          <span className="text-2xl font-bold text-white">{readyCount}</span>
        </div>
        <div className="text-center p-3 border-l border-white/10">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Published</p>
          <span className="text-2xl font-bold text-emerald-400">{publishedCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsBase.map((stat, idx) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleStatClick(stat)}
              className="cursor-pointer"
            >
              <div className="glass-card p-6 rounded-2xl border-white/5 hover:border-white/20 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change}
                    <ArrowUpRight size={16} className={`ml-1 ${!isPositive && 'rotate-90'}`} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{stat.value}</h3>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6 border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Performance Overview</h2>
            <select 
              value={timeframe}
              onChange={(e) => {
                setTimeframe(e.target.value);
                toast.success(`Timeframe updated to ${e.target.options[e.target.selectedIndex].text}`);
              }}
              className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="7days" className="bg-[#111115]">Last 7 days</option>
              <option value="30days" className="bg-[#111115]">Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full flex items-end justify-between gap-3 pt-4">
            {currentChartData.map((h, i) => (
              <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.05, type: 'spring' }}
                  onClick={() => handleChartClick(h)}
                  className="w-full bg-gradient-to-t from-purple-600/20 to-purple-500/80 rounded-t-lg group-hover:to-pink-500/80 transition-colors relative cursor-pointer"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold py-1.5 px-3 rounded-md transition-opacity shadow-lg">
                    {h}k
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 border-white/5 flex flex-col"
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
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm font-medium">
                No matching posts found.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => handlePostClick(post)}
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
              ))
            )}
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
