import React, { useState, useEffect } from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Button } from '../ui/Button';
import {
  Calendar as CalendarIcon,
  Bell,
  Mail,
  Smartphone,
  Plus,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Award,
} from '../ui/icons';


export interface ReminderItem {
  id: string;
  dateStr: string; // YYYY-MM-DD
  title: string;
  category: 'Practice Test' | 'Writing Task' | 'Speaking Mock' | 'Official Exam' | 'Vocabulary';
  time: string;
  leadTime: string;
  emailNotify: boolean;
  phoneNotify: boolean;
  completed?: boolean;
}

const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    dateStr: '2026-11-14',
    title: 'Official Academic IELTS Exam (IDP Center)',
    category: 'Official Exam',
    time: '08:30 AM',
    leadTime: '1 day before',
    emailNotify: true,
    phoneNotify: true,
  },
  {
    id: 'rem-2',
    dateStr: '2026-08-10',
    title: 'Full Timed Mock Exam - Listening & Reading',
    category: 'Practice Test',
    time: '10:00 AM',
    leadTime: '1 hour before',
    emailNotify: true,
    phoneNotify: true,
  },
  {
    id: 'rem-3',
    dateStr: '2026-08-12',
    title: 'Task 2 Essay Review with AI Examiner',
    category: 'Writing Task',
    time: '03:00 PM',
    leadTime: '15 mins before',
    emailNotify: true,
    phoneNotify: false,
  },
  {
    id: 'rem-4',
    dateStr: '2026-08-15',
    title: 'Live Speaking Part 2 Cue Card Diagnostic',
    category: 'Speaking Mock',
    time: '07:00 PM',
    leadTime: '1 hour before',
    emailNotify: false,
    phoneNotify: true,
  },
];

export const StudyCalendar: React.FC<{ userEmail?: string }> = ({ userEmail }) => {
  // Calendar Navigation state (defaults to current month: August 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 = August

  // Today date format
  const todayStr = '2026-08-07';
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  // Reminders state with localStorage persistence
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem('ielts_study_reminders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_REMINDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ielts_study_reminders', JSON.stringify(reminders));
    } catch {
      // ignore
    }
  }, [reminders]);

  // Modal / Add Form State
  const [isAddingModalOpen, setIsAddingModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ReminderItem['category']>('Practice Test');
  const [newTime, setNewTime] = useState<string>('10:00 AM');
  const [newLeadTime, setNewLeadTime] = useState<string>('1 hour before');
  const [newEmailNotify, setNewEmailNotify] = useState<boolean>(true);
  const [newPhoneNotify, setNewPhoneNotify] = useState<boolean>(true);

  // Feedback Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Month navigation helpers
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Generate calendar days for current month/year
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const calendarDays = [];
  // Empty slots for padding
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedDay = String(d).padStart(2, '0');
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    calendarDays.push({ dayNumber: d, dateStr });
  }

  // Filter reminders
  const remindersForSelectedDate = reminders.filter((r) => r.dateStr === selectedDateStr);

  const handleAddReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRem: ReminderItem = {
      id: `rem-${Date.now()}`,
      dateStr: selectedDateStr,
      title: newTitle.trim(),
      category: newCategory,
      time: newTime,
      leadTime: newLeadTime,
      emailNotify: newEmailNotify,
      phoneNotify: newPhoneNotify,
    };

    setReminders((prev) => [newRem, ...prev]);
    setIsAddingModalOpen(false);

    // Clear form
    setNewTitle('');

    // Construct toast notification channels text
    const channels = [];
    if (newEmailNotify) channels.push(`Email (${userEmail || 'your registered email'})`);
    if (newPhoneNotify) channels.push('Phone SMS Push');

    showToast(
      `Reminder scheduled for ${selectedDateStr}! ${
        channels.length > 0 ? `Alerts activated via ${channels.join(' & ')}.` : 'Saved to calendar.'
      }`
    );
  };

  const toggleNotify = (id: string, type: 'email' | 'phone') => {
    setReminders((prev) =>
      prev.map((rem) => {
        if (rem.id === id) {
          const updated = {
            ...rem,
            [type === 'email' ? 'emailNotify' : 'phoneNotify']:
              !rem[type === 'email' ? 'emailNotify' : 'phoneNotify'],
          };

          const status = updated[type === 'email' ? 'emailNotify' : 'phoneNotify'] ? 'enabled' : 'disabled';
          showToast(`${type === 'email' ? 'Email' : 'Phone SMS'} notification ${status} for "${rem.title}".`);
          return updated;
        }
        return rem;
      })
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showToast('Reminder removed from study schedule.');
  };

  const toggleCompleted = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const getCategoryBadgeClass = (category: ReminderItem['category']) => {
    switch (category) {
      case 'Official Exam':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Practice Test':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Writing Task':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Speaking Mock':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn bg-[image:var(--accent-gradient)] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 max-w-md">
          <Bell size={20} className="animate-bounce shrink-0" />
          <div className="text-xs font-semibold leading-relaxed">{toastMessage}</div>
        </div>
      )}

      {/* Main Grid: Calendar on Left, Selected Day Reminders & Add Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Month Calendar Grid */}
        <GlassPanel className="lg:col-span-7 p-6 md:p-8 border border-[var(--border)] shadow-xl space-y-6">
          {/* Calendar Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-a)]/15 text-[var(--accent-a)] flex items-center justify-center font-bold">
                <CalendarIcon size={22} />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--text)]">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <p className="text-xs text-[var(--text-faint)]">
                  Click any date to set email & phone alerts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setCurrentYear(2026);
                  setCurrentMonth(7);
                  setSelectedDateStr(todayStr);
                }}
                className="text-xs"
              >
                Today
              </Button>

              <div className="flex items-center gap-1 bg-[var(--panel-2)] p-1 rounded-xl border border-[var(--border)]">
                <button
                  onClick={handlePrevMonth}
                  title="Previous Month"
                  className="p-1.5 rounded-lg text-[var(--text)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextMonth}
                  title="Next Month"
                  className="p-1.5 rounded-lg text-[var(--text)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Days of Week Row */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono font-bold uppercase text-[var(--text-faint)]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item, idx) => {
              if (!item) {
                return <div key={`empty-${idx}`} className="h-14 rounded-xl bg-transparent" />;
              }

              const { dayNumber, dateStr } = item;
              const isSelected = selectedDateStr === dateStr;
              const isToday = dateStr === todayStr;

              // Find reminders on this day
              const dayReminders = reminders.filter((r) => r.dateStr === dateStr);
              const hasOfficialExam = dayReminders.some((r) => r.category === 'Official Exam');

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-16 md:h-20 p-2 rounded-2xl border transition-all flex flex-col justify-between items-start text-left cursor-pointer group relative overflow-hidden ${
                    isSelected
                      ? 'bg-[var(--accent-a)]/20 border-[var(--accent-a)] ring-2 ring-[var(--accent-a)]/40 shadow-lg'
                      : isToday
                      ? 'bg-[var(--panel-2)] border-[var(--accent-a)]/50'
                      : 'bg-[var(--bg)]/80 border-[var(--border)] hover:border-[var(--accent-a)]/60 hover:bg-[var(--panel-2)]'
                  }`}
                >
                  {/* Top Day Number & Today indicator */}
                  <div className="w-full flex items-center justify-between text-xs font-bold font-mono">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-[image:var(--accent-gradient)] text-white font-extrabold shadow'
                          : 'text-[var(--text)]'
                      }`}
                    >
                      {dayNumber}
                    </span>

                    {hasOfficialExam && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>

                  {/* Reminder Indicators */}
                  <div className="w-full space-y-1">
                    {dayReminders.slice(0, 2).map((r) => (
                      <div
                        key={r.id}
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded truncate font-medium border ${getCategoryBadgeClass(
                          r.category
                        )}`}
                      >
                        {r.title}
                      </div>
                    ))}
                    {dayReminders.length > 2 && (
                      <div className="text-[9px] font-mono text-[var(--accent-a)] font-semibold">
                        +{dayReminders.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Exam Milestone Callout */}
          <div className="p-4 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Award size={20} className="text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-[var(--text)]">Official IELTS Exam: </span>
                <span className="text-[var(--text-dim)]">November 14, 2026 (Academic Module)</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedDateStr('2026-11-14')}
              className="text-[var(--accent-a)] hover:underline font-mono text-[11px] font-bold cursor-pointer"
            >
              View Day
            </button>
          </div>
        </GlassPanel>

        {/* RIGHT COLUMN: Reminders Panel for Selected Date */}
        <div className="lg:col-span-5 space-y-6">
          <GlassPanel className="p-6 md:p-8 border border-[var(--border)] shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <div className="text-xs font-mono font-bold uppercase text-[var(--accent-a)]">
                  Selected Date
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--text)] mt-0.5">
                  {selectedDateStr}
                </h3>
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddingModalOpen(true)}
                className="flex items-center gap-1.5"
              >
                <Plus size={16} />
                <span>Add Reminder</span>
              </Button>
            </div>

            {/* List of Reminders for Selected Date */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-[var(--text-faint)] font-bold flex justify-between">
                <span>Reminders on {selectedDateStr}:</span>
                <span>{remindersForSelectedDate.length} Active</span>
              </div>

              {remindersForSelectedDate.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--border)] space-y-3">
                  <Bell size={28} className="mx-auto text-[var(--text-faint)] opacity-60" />
                  <div className="text-sm text-[var(--text-dim)] font-medium">
                    No study reminders set for this date yet.
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsAddingModalOpen(true)}
                    className="text-xs"
                  >
                    + Schedule Practice Alert
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {remindersForSelectedDate.map((rem) => (
                    <div
                      key={rem.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        rem.completed
                          ? 'bg-[var(--bg)]/50 border-[var(--border)] opacity-60'
                          : 'bg-[var(--panel-2)]/90 border-[var(--border)] hover:border-[var(--accent-a)]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            onClick={() => toggleCompleted(rem.id)}
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                              rem.completed
                                ? 'bg-[var(--success)] border-[var(--success)] text-white'
                                : 'border-[var(--text-faint)] hover:border-[var(--accent-a)]'
                            }`}
                          >
                            {rem.completed && <Check size={14} />}
                          </button>

                          <div className="min-w-0">
                            <span
                              className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold border mb-1.5 ${getCategoryBadgeClass(
                                rem.category
                              )}`}
                            >
                              {rem.category}
                            </span>
                            <h4
                              className={`text-sm font-bold leading-snug text-[var(--text)] truncate ${
                                rem.completed ? 'line-through text-[var(--text-faint)]' : ''
                              }`}
                            >
                              {rem.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-[var(--text-dim)] mt-1 font-mono">
                              <span className="flex items-center gap-1">
                                <Clock size={12} /> {rem.time}
                              </span>
                              <span>• {rem.leadTime}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteReminder(rem.id)}
                          title="Delete Reminder"
                          className="text-[var(--text-faint)] hover:text-[var(--danger)] p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Interactive Notification Toggles */}
                      <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-mono text-[var(--text-faint)]">
                          Alert Channels:
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Email Toggle */}
                          <button
                            onClick={() => toggleNotify(rem.id, 'email')}
                            title={
                              rem.emailNotify
                                ? `Email alerts enabled (${userEmail || 'your registered email'})`
                                : 'Enable Email Alert'
                            }
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                              rem.emailNotify
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-[var(--bg)] text-[var(--text-faint)] border-[var(--border)] hover:text-[var(--text)]'
                            }`}
                          >
                            <Mail size={12} />
                            <span>Email</span>
                            {rem.emailNotify && <Check size={10} />}
                          </button>

                          {/* Phone Push Toggle */}
                          <button
                            onClick={() => toggleNotify(rem.id, 'phone')}
                            title={
                              rem.phoneNotify
                                ? 'Phone SMS alerts enabled (+1 555-019-2834)'
                                : 'Enable Phone Alert'
                            }
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                              rem.phoneNotify
                                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                : 'bg-[var(--bg)] text-[var(--text-faint)] border-[var(--border)] hover:text-[var(--text)]'
                            }`}
                          >
                            <Smartphone size={12} />
                            <span>Phone SMS</span>
                            {rem.phoneNotify && <Check size={10} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Overview of All Upcoming Schedules */}
            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              <div className="text-xs font-mono uppercase text-[var(--text-faint)] font-bold">
                All Upcoming Study Reminders ({reminders.length}):
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                {reminders.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedDateStr(r.dateStr)}
                    className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent-a)]/50 transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-[var(--text)] truncate">{r.title}</div>
                      <div className="text-[10px] font-mono text-[var(--text-faint)]">
                        {r.dateStr} at {r.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {r.emailNotify && <Mail size={12} className="text-emerald-400" />}
                      {r.phoneNotify && <Smartphone size={12} className="text-purple-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <GlassPanel className="w-full max-w-lg p-6 md:p-8 border border-[var(--border)] shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--text)]">
                    Schedule IELTS Reminder
                  </h3>
                  <p className="text-xs text-[var(--text-faint)] font-mono">
                    Target Date: {selectedDateStr}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddingModalOpen(false)}
                className="text-[var(--text-faint)] hover:text-[var(--text)] text-lg p-1 font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReminderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Reminder Title / Event Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cambridge 18 Reading Practice Set 2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
                  >
                    <option value="Practice Test">Practice Test</option>
                    <option value="Writing Task">Writing Task</option>
                    <option value="Speaking Mock">Speaking Mock</option>
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Official Exam">Official Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                    Target Time
                  </label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
                  >
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Pre-Notification Trigger
                </label>
                <select
                  value={newLeadTime}
                  onChange={(e) => setNewLeadTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
                >
                  <option value="15 mins before">15 minutes before</option>
                  <option value="1 hour before">1 hour before</option>
                  <option value="1 day before">1 day before</option>
                  <option value="2 days before">2 days before</option>
                </select>
              </div>

              {/* Notification Channel Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <div className="text-xs font-mono uppercase text-[var(--text-faint)] font-bold">
                  Notification Delivery Methods:
                </div>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] cursor-pointer hover:border-[var(--accent-a)]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={newEmailNotify}
                    onChange={(e) => setNewEmailNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--accent-a)] focus:ring-0 cursor-pointer"
                  />
                  <Mail size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[var(--text)]">Email Notification</div>
                    <div className="text-[10px] text-[var(--text-dim)]">
                      Sends detailed study agenda to user email
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] cursor-pointer hover:border-[var(--accent-a)]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={newPhoneNotify}
                    onChange={(e) => setNewPhoneNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--accent-a)] focus:ring-0 cursor-pointer"
                  />
                  <Smartphone size={18} className="text-purple-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[var(--text)]">Phone SMS / App Push Alert</div>
                    <div className="text-[10px] text-[var(--text-dim)]">
                      Sends mobile push alert to registered phone (+1 555-019-2834)
                    </div>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddingModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <Bell size={16} />
                  <span>Set Practice Reminder</span>
                </Button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
