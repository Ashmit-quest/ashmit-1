import { useState } from 'react';
import { Search, Bell, Plus, Calendar as CalendarIcon, Tag as TagIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useContentStore } from '@/store/useContentStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const availableTags = ['Blog', 'Instagram', 'Newsletter', 'Website', 'YouTube', 'Email', 'Twitter'];
const platforms = ['YouTube', 'Instagram', 'Email', 'Twitter', 'Website'];

export function Header() {
  const { 
    searchQuery, 
    setSearchQuery, 
    setActiveTab, 
    addPost, 
    notifications, 
    markAllNotificationsRead 
  } = useContentStore();

  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Blog');
  const [platform, setPlatform] = useState('Instagram');
  const [status, setStatus] = useState<'Draft' | 'Review' | 'Ready' | 'Published'>('Draft');
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCreatePost = () => {
    if (!title.trim()) {
      toast.error('Post title is required');
      return;
    }

    // Map status to corresponding Kanban column
    const columnIdMap: Record<string, 'ideas' | 'drafting' | 'review' | 'published'> = {
      Draft: 'ideas',
      Review: 'drafting',
      Ready: 'review',
      Published: 'published'
    };

    addPost({
      title,
      tag,
      platform,
      status,
      columnId: columnIdMap[status],
      date: new Date()
    });

    setIsNewPostOpen(false);
    setTitle('');
    toast.success('New content post scheduled successfully!');
  };

  return (
    <header className="h-20 border-b border-white/10 bg-black/10 backdrop-blur-md flex items-center justify-between px-8 z-20">
      <div className="relative group w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search campaigns, posts..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <DropdownMenu onOpenChange={(open) => {
          if (open && unreadCount > 0) {
            markAllNotificationsRead();
          }
        }}>
          <DropdownMenuTrigger asChild>
            <button className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold px-1 text-white ring-2 ring-background">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-[#111115] border border-white/10 text-white p-2">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
              <span className="font-bold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs text-purple-400 font-medium">Marked all read</span>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar pt-1">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-xs font-medium">
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className={`p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer mb-1 ${!n.read ? 'bg-purple-500/5' : ''}`}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="text-xs font-bold text-white">{n.title}</h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">{n.desc}</p>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          onClick={() => setIsNewPostOpen(true)}
          className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-glow border-0"
        >
          <Plus size={18} className="mr-2" /> New Post
        </Button>
        <div className="h-8 w-px bg-white/10 mx-2" />
        <Avatar 
          onClick={() => {
            setActiveTab('settings');
            toast.info('Navigating to settings...');
          }}
          className="h-10 w-10 border-2 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-colors"
        >
          <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>

      {/* New Post Dialog */}
      <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
        <DialogContent className="bg-[#111115] border border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon size={20} className="text-purple-400" />
              Schedule New Post
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Post Title</label>
              <input 
                type="text" 
                placeholder="e.g. Q4 Marketing Strategy" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Category / Tag</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(t => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      tag === t 
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Platform</label>
                <select 
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {platforms.map(p => (
                    <option key={p} value={p} className="bg-[#111115]">{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Initial Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="Draft" className="bg-[#111115]">Draft</option>
                  <option value="Review" className="bg-[#111115]">Review</option>
                  <option value="Ready" className="bg-[#111115]">Ready</option>
                  <option value="Published" className="bg-[#111115]">Published</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-white/10 pt-4">
            <Button variant="ghost" onClick={() => setIsNewPostOpen(false)} className="text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleCreatePost} className="bg-purple-600 hover:bg-purple-500 text-white">
              Schedule Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
