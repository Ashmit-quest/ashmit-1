import { create } from 'zustand';

export interface Post {
  id: string;
  title: string;
  tag: string; // e.g. 'Blog', 'Instagram', 'YouTube', 'Newsletter'
  platform: string; // e.g. 'YouTube', 'Instagram', 'Email', 'Twitter'
  status: 'Draft' | 'Review' | 'Ready' | 'Published';
  columnId: 'ideas' | 'drafting' | 'review' | 'published';
  date: Date;
  comments: number;
  attachments: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

interface ContentStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'comments' | 'attachments'>) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  duplicatePost: (id: string) => void;
  clearColumnPosts: (columnId: string) => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  addNotification: (title: string, desc: string) => void;
  // Theme & Accent customized states
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export const useContentStore = create<ContentStore>((set) => ({
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Theme and accent defaults
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
  accentColor: 'purple',
  setAccentColor: (accentColor) => set({ accentColor }),

  posts: [
    { id: 't1', title: 'Top 10 UI Trends 2024', tag: 'Blog', platform: 'Website', comments: 3, attachments: 1, columnId: 'ideas', status: 'Draft', date: new Date() },
    { id: 't2', title: 'Behind the scenes reel', tag: 'Instagram', platform: 'Instagram', comments: 0, attachments: 2, columnId: 'ideas', status: 'Draft', date: new Date() },
    { id: 't3', title: 'Q3 Feature Announcement', tag: 'Newsletter', platform: 'Email', comments: 5, attachments: 0, columnId: 'drafting', status: 'Review', date: new Date() },
    { id: 't4', title: 'Case Study: Acme Corp', tag: 'Website', platform: 'Website', comments: 2, attachments: 4, columnId: 'review', status: 'Review', date: new Date() },
    { id: 't5', title: 'Founder Interview Video', tag: 'YouTube', platform: 'YouTube', comments: 8, attachments: 1, columnId: 'review', status: 'Ready', date: new Date() },
    { id: 't6', title: 'September Update', tag: 'Email', platform: 'Email', comments: 1, attachments: 0, columnId: 'published', status: 'Published', date: new Date() },
  ],

  addPost: (postData) => set((state) => {
    const newPost: Post = {
      ...postData,
      id: Math.random().toString(36).substr(2, 9),
      comments: 0,
      attachments: 0,
    };
    return { 
      posts: [newPost, ...state.posts],
      notifications: [
        {
          id: Math.random().toString(),
          title: 'New Post Created',
          desc: `"${newPost.title}" was added to ${newPost.columnId}`,
          time: 'Just now',
          read: false
        },
        ...state.notifications
      ]
    };
  }),

  updatePost: (id, updates) => set((state) => ({
    posts: state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),

  deletePost: (id) => set((state) => ({
    posts: state.posts.filter((p) => p.id !== id),
  })),

  duplicatePost: (id) => set((state) => {
    const original = state.posts.find(p => p.id === id);
    if (!original) return {};
    const duplicate: Post = {
      ...original,
      id: Math.random().toString(36).substr(2, 9),
      title: `${original.title} (Copy)`,
    };
    return { posts: [...state.posts, duplicate] };
  }),

  clearColumnPosts: (columnId) => set((state) => ({
    posts: state.posts.filter(p => p.columnId !== columnId)
  })),

  notifications: [
    { id: 'n1', title: 'Campaign Approved', desc: 'Acme Case Study has been approved by client.', time: '10m ago', read: false },
    { id: 'n2', title: 'Comment on Reel', desc: 'New feedback on "Behind the scenes reel".', time: '1h ago', read: false },
    { id: 'n3', title: 'Performance Milestone', desc: 'YouTube reach crossed 100k views this week!', time: '1d ago', read: true },
  ],

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  addNotification: (title, desc) => set((state) => ({
    notifications: [
      { id: Math.random().toString(), title, desc, time: 'Just now', read: false },
      ...state.notifications
    ]
  }))
}));
