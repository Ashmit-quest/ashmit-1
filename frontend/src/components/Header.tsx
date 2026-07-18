import { Search, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export function Header() {
  return (
    <header className="h-20 border-b border-white/10 bg-black/10 backdrop-blur-md flex items-center justify-between px-8 z-20">
      <div className="relative group w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search campaigns, posts..." 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              toast.success(`Searching for: ${e.currentTarget.value}`);
              e.currentTarget.value = '';
            }
          }}
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button 
          onClick={() => toast.info('No new notifications')}
          className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white" 
          size="icon" 
          variant="ghost"
        >
          <Bell size={18} />
        </Button>
        <Button 
          onClick={() => toast.success('Opening New Post Editor...')}
          className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-glow border-0"
        >
          <Plus size={18} className="mr-2" /> New Post
        </Button>
        <div className="h-8 w-px bg-white/10 mx-2" />
        <Avatar 
          onClick={() => toast.info('Opening profile settings...')}
          className="h-10 w-10 border-2 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-colors"
        >
          <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
