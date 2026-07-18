import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowUpRight, Activity, Users, Share2, MousePointerClick } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/animated-number';

const performanceData = [
  { name: 'Mon', views: 4000, engagement: 2400 },
  { name: 'Tue', views: 3000, engagement: 1398 },
  { name: 'Wed', views: 5000, engagement: 3800 },
  { name: 'Thu', views: 2780, engagement: 3908 },
  { name: 'Fri', views: 6890, engagement: 4800 },
  { name: 'Sat', views: 4390, engagement: 3800 },
  { name: 'Sun', views: 5490, engagement: 4300 },
];

const platformData = [
  { name: 'Instagram', value: 45, color: '#ec4899' },
  { name: 'Twitter', value: 25, color: '#0ea5e9' },
  { name: 'LinkedIn', value: 20, color: '#3b82f6' },
  { name: 'YouTube', value: 10, color: '#ef4444' },
];

const stats = [
  { label: 'Audience Growth', value: '+12.5%', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Avg. Engagement', value: '8.4%', icon: Activity, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { label: 'Click-Through', value: '3.2%', icon: MousePointerClick, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Total Shares', value: '24.5K', icon: Share2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-lg border-white/10 text-sm">
        <p className="font-bold text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsView() {
  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold tracking-tight text-white mb-2"
          >
            Analytics
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Measure your content performance and audience growth.
          </motion.p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
          </select>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-xl font-medium shadow-glow transition-all"
          >
            Export Report
          </motion.button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-5 rounded-2xl border-white/5 hover:border-white/10 transition-all duration-300 group shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-muted-foreground font-medium text-sm">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-white">
                      <AnimatedNumber value={stat.value} />
                    </h3>
                    <ArrowUpRight size={16} className="text-emerald-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, type: 'spring' }}
          className="lg:col-span-2 glass-card rounded-2xl p-6 border-white/5 shadow-elegant"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white font-sans">Engagement vs Views</h2>
            <p className="text-sm text-muted-foreground">Correlation between content reach and audience interaction.</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="engagement" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="glass-card rounded-2xl p-6 border-white/5 flex flex-col shadow-elegant"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Platform Distribution</h2>
            <p className="text-sm text-muted-foreground">Where your audience engages most.</p>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {platformData.map((item, idx) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-white">{item.name}</span>
                  <span className="text-muted-foreground">
                    <AnimatedNumber value={item.value} />%
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.4 + idx * 0.1, duration: 1.2, type: "spring" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
