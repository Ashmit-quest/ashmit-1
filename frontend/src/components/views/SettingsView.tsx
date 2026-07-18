import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, CreditCard, LayoutGrid, Check } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: LayoutGrid },
];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="h-full pb-8 flex gap-8">
      <div className="w-64 flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Settings</h1>
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/10 text-white font-medium border border-white/5 shadow-sm' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-purple-400' : ''} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl p-8 border-white/5 max-w-3xl"
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Profile Details</h2>
                <p className="text-muted-foreground text-sm">Manage your personal information and how you appear on the platform.</p>
              </div>

              <div className="flex items-center gap-6 py-4 border-y border-white/10">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Avatar" className="w-full h-full rounded-full border-2 border-background object-cover" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white text-black p-1.5 rounded-full hover:bg-gray-200 transition-colors shadow-lg">
                    <Palette size={14} />
                  </button>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Profile Picture</h3>
                  <div className="flex gap-3">
                    <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/5">Change</button>
                    <button className="text-red-400 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Remove</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">First Name</label>
                  <input type="text" defaultValue="Jessica" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Last Name</label>
                  <input type="text" defaultValue="Smith" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-white">Email Address</label>
                  <input type="email" defaultValue="jessica.smith@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-white">Bio</label>
                  <textarea rows={4} defaultValue="Content creator & strategist. Building beautiful things on the internet." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-glow transition-all flex items-center gap-2">
                  <Check size={18} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
               <div>
                <h2 className="text-2xl font-bold text-white mb-1">Notifications</h2>
                <p className="text-muted-foreground text-sm">Choose what updates you want to receive.</p>
              </div>
              <div className="space-y-4 pt-4">
                {[
                  { title: "Campaign Updates", desc: "Get notified when a campaign state changes." },
                  { title: "Comments", desc: "Receive an alert when someone comments on your post." },
                  { title: "Weekly Digest", desc: "A weekly summary of your content performance." },
                  { title: "Product Updates", desc: "News about new features and updates." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div>
                      <h4 className="text-white font-medium">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'profile' && activeTab !== 'notifications' && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/50">
                <LayoutGrid size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-sm">
                This settings module is currently under development. Check back later for updates.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
