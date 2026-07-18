import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, AlignLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  isSameMonth, isSameDay, addDays, addWeeks, subWeeks, subDays
} from 'date-fns';

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  color: string;
  allDay: boolean;
  time?: string;
};

const colors = [
  'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 
  'bg-emerald-500', 'bg-amber-500', 'bg-red-500'
];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  
  // Initial mock events
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'Weekly Sync', date: new Date(), color: 'bg-purple-500', allDay: false, time: '10:00' },
    { id: '2', title: 'Product Launch', date: addDays(new Date(), 2), color: 'bg-pink-500', allDay: true },
    { id: '3', title: 'Review Designs', date: addDays(new Date(), -1), color: 'bg-blue-500', allDay: false, time: '14:00' },
  ]);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventColor, setNewEventColor] = useState('bg-purple-500');
  const [newEventIsAllDay, setNewEventIsAllDay] = useState(true);
  const [newEventTime, setNewEventTime] = useState('10:00');

  const next = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const prev = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
    toast.success('Returned to today');
  };

  const handleAddClick = (date: Date, time?: string) => {
    setSelectedDate(date);
    if (time) {
      setNewEventIsAllDay(false);
      setNewEventTime(time);
    } else {
      setNewEventIsAllDay(true);
    }
    setNewEventTitle('');
    setIsDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!newEventTitle.trim()) {
      toast.error('Event title is required');
      return;
    }
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEventTitle,
      date: selectedDate,
      color: newEventColor,
      allDay: newEventIsAllDay,
      time: newEventIsAllDay ? undefined : newEventTime
    };
    setEvents([...events, newEvent]);
    setIsDialogOpen(false);
    toast.success('Event added successfully');
  };

  const handleEventClick = (e: React.MouseEvent, evt: CalendarEvent) => {
    e.stopPropagation();
    toast.success(`Event: ${evt.title}`, {
      description: `${format(evt.date, 'MMMM d, yyyy')}${evt.allDay ? ' (All Day)' : ` at ${evt.time}`}`
    });
  };

  // --- MONTH VIEW ---
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentDate]);

  const renderMonth = () => {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-[#111115]/50">
        <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
          {monthDays.map((d, i) => {
            const isCurrentMonth = isSameMonth(d, currentDate);
            const isDayToday = isSameDay(d, new Date());
            const dayEvents = events.filter(e => isSameDay(e.date, d));

            return (
              <div
                key={i}
                onClick={() => handleAddClick(d)}
                className={`border-b border-r border-white/5 p-2 transition-colors hover:bg-white/[0.08] cursor-pointer group flex flex-col ${!isCurrentMonth ? 'opacity-40 bg-black/20' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-medium p-1.5 rounded-full inline-flex w-7 h-7 items-center justify-center ${isDayToday ? 'bg-purple-500 text-white shadow-glow' : 'text-white/80 group-hover:text-white'}`}>
                    {format(d, 'd')}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                  {dayEvents.map(evt => (
                    <div
                      key={evt.id}
                      onClick={(e) => handleEventClick(e, evt)}
                      className={`${evt.color} bg-opacity-20 border border-white/10 text-white text-xs px-2 py-1 rounded truncate hover:bg-opacity-40 transition-colors font-medium flex items-center gap-1.5`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${evt.color}`} />
                      {evt.time && <span className="opacity-70">{evt.time}</span>}
                      <span className="truncate">{evt.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- WEEK/DAY VIEW HELPERS ---
  const hours = Array.from({ length: 24 }).map((_, i) => i);
  const getHourEvents = (date: Date, hour: number) => {
    return events.filter(e => {
      if (!isSameDay(e.date, date) || e.allDay || !e.time) return false;
      const eventHour = parseInt(e.time.split(':')[0], 10);
      return eventHour === hour;
    });
  };
  const getAllDayEvents = (date: Date) => {
    return events.filter(e => isSameDay(e.date, date) && (e.allDay || !e.time));
  };

  // --- WEEK VIEW ---
  const renderWeek = () => {
    const weekStart = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    return (
      <div className="flex-1 flex flex-col min-h-0 bg-[#111115]/50">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-white/10 bg-white/5 z-10">
          <div className="w-16 border-r border-white/5 flex flex-col justify-end p-2 text-[10px] text-muted-foreground text-right border-b border-white/5">
            GMT
          </div>
          {weekDays.map(d => (
            <div key={d.toString()} className="border-r border-white/5 flex flex-col border-b border-white/5">
              <div className="py-2 text-center border-b border-white/5">
                <div className="text-xs font-bold text-muted-foreground uppercase">{format(d, 'EEE')}</div>
                <div className={`mt-1 mx-auto inline-flex w-8 h-8 items-center justify-center rounded-full text-lg ${isSameDay(d, new Date()) ? 'bg-purple-500 text-white shadow-glow' : 'text-white'}`}>
                  {format(d, 'd')}
                </div>
              </div>
              <div className="p-1 min-h-[40px] space-y-1 bg-black/10">
                {getAllDayEvents(d).map(evt => (
                  <div key={evt.id} onClick={(e) => handleEventClick(e, evt)} className={`${evt.color} bg-opacity-20 border border-white/10 text-white text-xs px-2 py-1 rounded truncate cursor-pointer hover:bg-opacity-40`}>
                    {evt.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {hours.map(h => (
            <div key={h} className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-white/5 min-h-[60px] group">
              <div className="w-16 border-r border-white/5 text-xs text-muted-foreground text-right pr-2 py-2 relative -top-3">
                {h === 0 ? '' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
              </div>
              {weekDays.map(d => (
                <div
                  key={d.toString()}
                  onClick={() => handleAddClick(d, `${h.toString().padStart(2, '0')}:00`)}
                  className="border-r border-white/5 relative p-1 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  {getHourEvents(d, h).map(evt => (
                    <div key={evt.id} onClick={(e) => handleEventClick(e, evt)} className={`${evt.color} bg-opacity-30 border border-white/20 text-white text-xs p-1.5 rounded shadow-sm mb-1 cursor-pointer hover:bg-opacity-50`}>
                      <div className="font-bold opacity-80 mb-0.5">{evt.time}</div>
                      <div className="truncate font-medium">{evt.title}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- DAY VIEW ---
  const renderDay = () => {
    const d = currentDate;
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-[#111115]/50">
        <div className="grid grid-cols-[auto_1fr] border-b border-white/10 bg-white/5 z-10">
          <div className="w-16 border-r border-white/5 flex flex-col justify-end p-2 text-[10px] text-muted-foreground text-right border-b border-white/5">
            GMT
          </div>
          <div className="border-r border-white/5 flex flex-col border-b border-white/5">
            <div className="py-2 text-center border-b border-white/5">
              <div className="text-xs font-bold text-muted-foreground uppercase">{format(d, 'EEEE')}</div>
              <div className={`mt-1 mx-auto inline-flex w-10 h-10 items-center justify-center rounded-full text-xl ${isSameDay(d, new Date()) ? 'bg-purple-500 text-white shadow-glow' : 'text-white'}`}>
                {format(d, 'd')}
              </div>
            </div>
            <div className="p-2 min-h-[50px] space-y-1 bg-black/10 flex flex-wrap gap-2">
              {getAllDayEvents(d).map(evt => (
                <div key={evt.id} onClick={(e) => handleEventClick(e, evt)} className={`${evt.color} bg-opacity-20 border border-white/10 text-white text-sm px-3 py-1.5 rounded truncate cursor-pointer hover:bg-opacity-40`}>
                  {evt.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {hours.map(h => (
            <div key={h} className="grid grid-cols-[auto_1fr] border-b border-white/5 min-h-[80px] group">
              <div className="w-16 border-r border-white/5 text-xs text-muted-foreground text-right pr-2 py-2 relative -top-3">
                {h === 0 ? '' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
              </div>
              <div
                onClick={() => handleAddClick(d, `${h.toString().padStart(2, '0')}:00`)}
                className="border-r border-white/5 relative p-2 cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                {getHourEvents(d, h).map(evt => (
                  <div key={evt.id} onClick={(e) => handleEventClick(e, evt)} className={`${evt.color} bg-opacity-30 border border-white/20 text-white text-sm p-2 rounded shadow-sm mb-2 cursor-pointer hover:bg-opacity-50`}>
                    <div className="font-bold opacity-80 mb-1">{evt.time}</div>
                    <div className="font-medium">{evt.title}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col pb-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white w-64">
            {view === 'day' 
              ? format(currentDate, 'MMMM d, yyyy')
              : format(currentDate, 'MMMM yyyy')}
          </h1>
          <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
            <button onClick={prev} className="p-1.5 hover:bg-white/10 rounded-md text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={today} className="px-4 text-sm font-medium text-white hover:text-purple-400 transition-colors">
              Today
            </button>
            <button onClick={next} className="p-1.5 hover:bg-white/10 rounded-md text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={view}
            onChange={(e) => setView(e.target.value as any)}
            className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer font-medium"
          >
            <option value="month" className="bg-[#111115]">Month</option>
            <option value="week" className="bg-[#111115]">Week</option>
            <option value="day" className="bg-[#111115]">Day</option>
          </select>
          <Button 
            onClick={() => handleAddClick(new Date())}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-glow border-0 rounded-lg"
          >
            <Plus size={18} className="mr-2" /> Add Event
          </Button>
        </div>
      </div>

      {/* CALENDAR BODY */}
      <div className="flex-1 glass-card rounded-2xl border-white/5 overflow-hidden flex flex-col shadow-lg">
        {view === 'month' && renderMonth()}
        {view === 'week' && renderWeek()}
        {view === 'day' && renderDay()}
      </div>

      {/* ADD EVENT DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#111115] border border-white/10 text-white sm:max-w-[425px] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon size={20} className="text-purple-400" />
              Add Event
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Event Title" 
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-0 border-b-2 border-white/10 px-0 py-2 text-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-4 text-sm text-white/80">
              <Clock size={16} className="text-muted-foreground" />
              <span>{format(selectedDate, 'EEEE, MMMM d')}</span>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer text-white/80 hover:text-white">
                <input 
                  type="checkbox" 
                  checked={newEventIsAllDay}
                  onChange={(e) => setNewEventIsAllDay(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                />
                All day
              </label>
              
              {!newEventIsAllDay && (
                <input 
                  type="time" 
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 [color-scheme:dark]"
                />
              )}
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Color</div>
              <div className="flex gap-3">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewEventColor(c)}
                    className={`w-8 h-8 rounded-full ${c} flex items-center justify-center transition-transform hover:scale-110 ${newEventColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111115]' : ''}`}
                  >
                    {newEventColor === c && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-white/10 pt-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleSaveEvent} className="bg-purple-600 hover:bg-purple-500 text-white">
              Save Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
