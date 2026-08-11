'use client';

import React, { useEffect, useState } from 'react';
import { db, DbUser, type DashboardData } from '../lib/db';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { DashboardCarousel } from '../components/dashboard/DashboardCarousel';
import { StudyCalendar } from '../components/dashboard/StudyCalendar';
import {
  Sparkles,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  FileCheck,
  ChevronRight,
  Shield,
  Clock,
  Award,
  Bell,
} from '../components/ui/icons';

interface DashboardViewProps {
  onNavigateAction: (route: string) => void;
  id?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateAction, id }) => {
  const [user, setUser] = useState<DbUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [diagnosticDone, setDiagnosticDone] = useState(true); // assume done until known, avoids flash
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      db.getCurrentUser(),
      db.getDashboard().catch(() => null),
      db.getDiagnosticStatus().catch(() => true),
    ]).then(
      ([u, d, done]) => {
        if (!cancelled) {
          setUser(u);
          setDashboard(d);
          setDiagnosticDone(done);
          setLoading(false);
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !user) {
    return (
      <div id={id} className="w-full py-20 text-center text-sm text-[var(--text-dim)] font-mono">
        Loading dashboard...
      </div>
    );
  }

  const daysRemaining = user.examDate
    ? Math.max(
        0,
        Math.ceil((new Date(user.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      )
    : null;

  return (
    <div id={id} className="space-y-10 w-full">
      {!diagnosticDone && (
        <GlassPanel className="p-5 border border-[var(--accent-a)]/30 bg-[var(--accent-a)]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[var(--text)]">
                Estimate your starting band
              </h3>
              <p className="text-xs text-[var(--text-dim)] mt-0.5">
                Take the 2-minute placement diagnostic to personalise your practice. You haven&apos;t done it yet.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<ChevronRight size={16} />}
            onClick={() => onNavigateAction('diagnostic')}
            className="shrink-0"
          >
            Take Diagnostic
          </Button>
        </GlassPanel>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between space-y-6">
          <GlassPanel className="p-6 md:p-8 border border-[var(--border)] shadow-lg space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-a)]/15 border border-[var(--accent-a)]/30 text-[var(--accent-a)] font-mono text-xs font-semibold">
                <Sparkles size={14} />
                <span>IELTS Preparation Hub</span>
              </div>

              <h1 className="font-display text-2xl md:text-3xl xl:text-4xl font-extrabold text-[var(--text)] tracking-tight leading-snug">
                Welcome back, <br />
                <span className="text-[var(--accent-a)]">{user.name}</span>
              </h1>

              <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                {user.examDate
                  ? `Your official IELTS exam is scheduled for ${new Date(user.examDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. Keep practicing consistently to achieve your Target Band score.`
                  : 'Set your official exam date in Settings to track your countdown. Keep practicing consistently to achieve your Target Band score.'}
              </p>
            </div>

            {/* Target Goal Summary Card */}
            <div className="p-5 rounded-2xl bg-[var(--panel-2)]/90 border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-[var(--text-faint)]">
                <span>Official Goal</span>
                <span className="text-[var(--accent-a)] font-bold">
                  {user.examType === 'general_training'
                    ? 'General Training'
                    : user.examType === 'academic'
                      ? 'Academic Module'
                      : 'Module Not Set'}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-[var(--text-dim)]">Current Evaluated</div>
                  <div className="font-display font-extrabold text-2xl xl:text-3xl text-[var(--text)]">
                    {user.currentBand > 0 ? `Band ${user.currentBand}` : 'Not yet assessed'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-[var(--text-dim)]">Target Band</div>
                  <div className="font-display font-extrabold text-2xl xl:text-3xl text-[var(--accent-a)]">
                    Band {user.targetBand}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-faint)]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock size={14} />
                  {daysRemaining !== null ? `${daysRemaining} Days Remaining` : 'No exam date set'}
                </span>
                {user.currentBand > 0 && (
                  <span className="flex items-center gap-1.5 text-[var(--success)] font-semibold">
                    <Shield size={14} />
                    {user.currentBand >= user.targetBand ? 'Target Reached' : 'On Track'}
                  </span>
                )}
              </div>
            </div>

            {/* Recommended Action of the Day */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-[var(--text-faint)] font-bold">
                Today's Recommended Diagnostic:
              </div>

              <div className="p-4 rounded-2xl bg-[var(--accent-a)]/10 border border-[var(--accent-a)]/30 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text)]">
                      Academic Writing Task 2 Evaluation
                    </h4>
                    <p className="text-xs text-[var(--text-dim)] mt-1">
                      Practice cohesive paragraphing to raise your Writing Band.
                    </p>
                  </div>
                  <Award size={20} className="text-[var(--accent-a)] shrink-0" />
                </div>

                <Button
                  onClick={() => onNavigateAction('writing')}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <span>Start Essay Evaluation</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </GlassPanel>
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <DashboardCarousel onNavigateAction={onNavigateAction} user={user} data={dashboard} loading={loading} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-a)]">
              <Bell size={16} />
              <span>Study Planner & Notifications</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-1">
              Study Calendar & Exam Reminders
            </h2>
          </div>
          <span className="text-xs font-mono text-[var(--text-faint)] bg-[var(--panel-2)] px-3 py-1.5 rounded-xl border border-[var(--border)]">
            ✉️ Email & 📱 Phone Push Sync Active
          </span>
        </div>

        <StudyCalendar userEmail={user.email} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-[var(--text)]">
            Explore IELTS Practice Modules
          </h3>
          <span className="text-xs font-mono text-[var(--text-faint)]">
            Official British Council & IDP Format
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {[
            { id: 'writing', name: 'Writing Task 1 & 2', icon: PenTool, badge: 'AI Feedback' },
            { id: 'reading', name: 'Academic Reading', icon: BookOpen, badge: 'Passages' },
            { id: 'listening', name: 'Audio Listening', icon: Headphones, badge: 'Audio Play' },
            { id: 'speaking', name: 'Speaking Simulator', icon: Mic, badge: 'Voice AI' },
            { id: 'mock-tests', name: 'Full Mock Exam', icon: FileCheck, badge: 'Timed' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <GlassPanel
                key={item.id}
                onClick={() => onNavigateAction(item.id)}
                className="p-6 border border-[var(--border)] hover:border-[var(--accent-a)] transition-all cursor-pointer group flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent-a)]/15 text-[var(--accent-a)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[var(--panel-2)] text-[var(--text-faint)] border border-[var(--border)]">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-base text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors">
                    {item.name}
                  </div>
                  <div className="text-xs text-[var(--text-faint)] mt-1 flex items-center gap-1">
                    <span>Practice Now</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </div>
  );
};
