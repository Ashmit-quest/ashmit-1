import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, CreditCard, LayoutGrid, 
  Check, Key, Smartphone, Laptop, Palette,
  Github, Slack, Trello, Twitter
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useContentStore } from '@/store/useContentStore';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: LayoutGrid },
];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('profile');

  const [firstName, setFirstName] = useState('Jessica');
  const [lastName, setLastName] = useState('Smith');
  const [email, setEmail] = useState('jessica.smith@example.com');
  const [bio, setBio] = useState('Content creator & strategist. Building beautiful things on the internet.');

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleChangeAvatar = () => {
    toast.info('Avatar upload dialog opened');
  };

  const handleRemoveAvatar = () => {
    toast.success('Avatar removed');
  };

  const handlePasswordChange = () => {
    toast.info('Password reset email sent');
  };

  const handle2FA = () => {
    toast.success('Two-factor authentication setup initialized');
  };

  return (
    <div className="h-full pb-8 flex gap-8">
      <div className="w-64 flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-6 animate-fade-in">Settings</h1>
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative z-30 ${
                  isActive 
                    ? 'text-white font-medium border border-white/5 shadow-sm bg-white/10' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="settings-active"
                    className="absolute inset-0 bg-white/5 rounded-xl border border-white/5 -z-10"
                    transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                  />
                )}
                {/* Dynamically style the icon using primary color when active */}
                <Icon size={18} className="relative z-10" style={{ color: isActive ? 'hsl(var(--primary))' : undefined }} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="glass-card rounded-2xl p-8 border-white/5 max-w-3xl shadow-elegant"
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
                    <button 
                      onClick={handleChangeAvatar}
                      className="absolute bottom-0 right-0 bg-white text-black p-1.5 rounded-full hover:bg-gray-200 transition-colors shadow-lg"
                    >
                      <Palette size={14} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Profile Picture</h3>
                    <div className="flex gap-3">
                      <button onClick={handleChangeAvatar} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/5">Change</button>
                      <button onClick={handleRemoveAvatar} className="text-red-400 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">First Name</label>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-white">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-white">Bio</label>
                    <textarea 
                      rows={4} 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none font-medium" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSaveProfile} 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-glow transition-all flex items-center gap-2"
                  >
                    <Check size={18} /> Save Changes
                  </motion.button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Security</h2>
                  <p className="text-muted-foreground text-sm">Manage your password and account security.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                        <Key size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Password</h4>
                        <p className="text-muted-foreground text-sm">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <Button onClick={handlePasswordChange} variant="outline" className="bg-transparent border-white/10 hover:bg-white/10 text-white">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                        <p className="text-muted-foreground text-sm">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button onClick={handle2FA} className="bg-purple-600 hover:bg-purple-500 text-white">
                      Enable 2FA
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-purple-500/30">
                      <div className="flex items-center gap-4">
                        <Laptop size={20} className="text-muted-foreground" />
                        <div>
                          <h4 className="text-white font-medium text-sm">MacBook Pro - Safari</h4>
                          <p className="text-muted-foreground text-xs">San Francisco, US • Current Session</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded">Active Now</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-4">
                        <Smartphone size={20} className="text-muted-foreground" />
                        <div>
                          <h4 className="text-white font-medium text-sm">iPhone 13 Pro - Chrome</h4>
                          <p className="text-muted-foreground text-xs">San Francisco, US • 2 hours ago</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toast.success('Session revoked')}
                        className="text-xs font-medium text-red-400 hover:text-red-300"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Billing & Plan</h2>
                  <p className="text-muted-foreground text-sm">Manage your subscription and payment methods.</p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full" />
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
                      Current Plan
                    </span>
                    <div className="flex items-end gap-2 mb-2">
                      <h3 className="text-4xl font-bold text-white">$29</h3>
                      <span className="text-white/60 mb-1">/month</span>
                    </div>
                    <p className="text-white/80 text-sm mb-6">Pro Plan - Billed monthly. Next charge on Nov 1, 2023.</p>
                    
                    <div className="flex gap-4">
                      <Button onClick={() => toast.success('Redirecting to upgrade page')} className="bg-white text-black hover:bg-gray-200">
                        Upgrade Plan
                      </Button>
                      <Button onClick={() => toast.info('Subscription cancelation policy opened')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Payment Method</h3>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                        <CreditCard size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">Visa ending in 4242</h4>
                        <p className="text-muted-foreground text-xs">Expires 12/2024</p>
                      </div>
                    </div>
                    <Button onClick={() => toast.success('Update payment method dialog opened')} variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Integrations</h2>
                  <p className="text-muted-foreground text-sm">Connect your favorite tools and platforms.</p>
                </div>

                <div className="grid gap-4">
                  {[
                    { name: 'GitHub', icon: Github, desc: 'Sync your repositories and commits.', connected: true },
                    { name: 'Slack', icon: Slack, desc: 'Receive notifications in your channels.', connected: false },
                    { name: 'Trello', icon: Trello, desc: 'Link cards and boards automatically.', connected: false },
                    { name: 'Twitter', icon: Twitter, desc: 'Auto-publish approved social posts.', connected: true },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/5">
                          <integration.icon size={24} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{integration.name}</h4>
                          <p className="text-muted-foreground text-sm">{integration.desc}</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => toast.success(integration.connected ? `Disconnected ${integration.name}` : `Connected to ${integration.name}`)}
                        variant={integration.connected ? "outline" : "default"}
                        className={integration.connected ? "border-white/10 text-white hover:bg-white/5" : "bg-white text-black hover:bg-gray-200"}
                      >
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
