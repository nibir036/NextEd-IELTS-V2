import React from 'react';
import { LandingNav } from '../components/landing/LandingNav';
import { HeroScoreCard } from '../components/landing/HeroScoreCard';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { SkillTag } from '../components/ui/SkillTag';
import { Reveal } from '../components/ui/Reveal';
import { skillModules, siteStats } from '../lib/data';
import {
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  BrainCircuit,
  Shield,
  Check,
  BookOpen,
  PenTool,
  Mic,
  Headphones,
  Trophy,
  UserPlus,
  LogIn,
} from '../components/ui/icons';

interface LandingViewProps {
  onLaunchApp: (route?: string) => void;
  isLoggedIn?: boolean;
  id?: string;
}

export const LandingView: React.FC<LandingViewProps> = ({ onLaunchApp, isLoggedIn = false, id }) => {
  const handleCta = (defaultTarget: string = 'signup') => {
    if (isLoggedIn) {
      onLaunchApp('dashboard');
    } else {
      onLaunchApp(defaultTarget);
    }
  };

  return (
    <div id={id} className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative overflow-hidden">
      {/* Background ambient glow layer */}
      <div className="bg-layer">
        <div className="bg-pattern" />
      </div>

      <LandingNav onNavigate={(route) => onLaunchApp(route)} isLoggedIn={isLoggedIn} />

      {/* 1. HOME SECTION */}
      <section id="home" className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 pt-10 pb-16 md:pt-16 md:pb-24 page-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-a)]/15 border border-[var(--accent-a)]/30 text-xs font-mono text-[var(--accent-a)]">
              <Sparkles size={14} />
              <span>Official IELTS Descriptor Aligned Evaluator</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-[var(--text)] tracking-tight leading-[1.1]">
              Master IELTS with <br />
              <span className="text-gradient">Real-Time AI Precision</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-dim)] max-w-2xl leading-relaxed">
              Diagnostic scoring across Reading, Listening, Writing, and Speaking. Receive instant band criterion breakdowns, sentence-level rewrites, and official IELTS rounded score calculations.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={<UserPlus size={18} />}
                onClick={() => handleCta('signup')}
              >
                {isLoggedIn ? 'Go to Exam Dashboard' : 'Get Started with Phone'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={<LogIn size={18} />}
                onClick={() => handleCta('login')}
              >
                {isLoggedIn ? 'Practice Writing Module' : 'Log In to Candidate Account'}
              </Button>
            </div>

            <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-6 text-xs text-[var(--text-faint)] font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[var(--success)]" />
                <span>Instant Diagnostic Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[var(--success)]" />
                <span>0.5 Band Precision Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[var(--success)]" />
                <span>Phone SMS Login Support</span>
              </div>
            </div>
          </div>

          {/* Hero Right Animated Score Card */}
          <div className="lg:col-span-6 flex justify-center relative">
            <HeroScoreCard />
          </div>
        </div>
      </section>

      {/* Site Highlights / Factual Stats Bar */}
      <section className="relative z-10 border-y border-[var(--border)] bg-[var(--bg-elevated)]/50 backdrop-blur-lg py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {siteStats.map((stat, idx) => (
            <Reveal key={idx} delayMs={idx * 160} className="text-center md:text-left">
              <div className="font-display font-bold text-2xl sm:text-3xl text-gradient">
                {stat.value}
              </div>
              <div className="text-xs font-mono font-semibold text-[var(--text)] uppercase tracking-wider mt-1">
                {stat.label}
              </div>
              <div className="text-xs text-[var(--text-faint)] mt-1">
                {stat.description}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-20">
        <Reveal>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-a)] mb-2 uppercase tracking-widest font-semibold">
            <BrainCircuit size={15} />
            <span>Methodology & Standards</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
            About AI IELTS Pro
          </h2>
          <p className="text-sm md:text-base text-[var(--text-dim)] mt-3 leading-relaxed">
            AI IELTS Pro is an intelligent exam preparation framework engineered to align strictly with official Cambridge 9-Band descriptors. We provide objective, verifiable feedback without exaggerated guarantees.
          </p>
        </div>
        </Reveal>

        <Reveal delayMs={200} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassPanel className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-a)]/15 border border-[var(--accent-a)]/30 text-[var(--accent-a)] flex items-center justify-center font-bold">
              <Shield size={20} />
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">
              4-Criteria Assessment
            </h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              Every essay and speaking attempt is evaluated across Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Accuracy.
            </p>
          </GlassPanel>

          <GlassPanel className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-b)]/15 border border-[var(--accent-b)]/30 text-[var(--accent-b)] flex items-center justify-center font-bold">
              <Trophy size={20} />
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">
              Official Band Rounding
            </h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              Overall scores adhere to standard IELTS rules: component averages ending in .25 or .75 automatically round up to the nearest 0.5 or integer band.
            </p>
          </GlassPanel>

          <GlassPanel className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-c)]/15 border border-[var(--accent-c)]/30 text-[var(--accent-c)] flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">
              Sentence Rewrites
            </h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              Instead of generic scores, get line-by-line collocations, discourse marker suggestions, and grammar rewrites targeting Band 7.5+.
            </p>
          </GlassPanel>
        </Reveal>

        {/* 4 Core Practice Modules Overview */}
        <div className="pt-8 border-t border-[var(--border)]">
          <Reveal className="text-center mb-8">
            <h3 className="font-display text-xl font-bold text-[var(--text)]">
              Comprehensive 4-Skill Practice Coverage
            </h3>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillModules.map((module, idx) => (
              <Reveal key={module.id} delayMs={idx * 140}>
              <GlassPanel
                onClick={() => onLaunchApp(module.id)}
                interactive
                className="p-5 relative group"
              >
                <div className="flex items-center justify-between mb-3">
                  <SkillTag skill={module.id} size="sm" />
                  <span className="text-[10px] font-mono text-[var(--text-faint)]">
                    {module.activeModulesCount} Sets
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors mb-1">
                  {module.name}
                </h4>
                <p className="text-xs text-[var(--text-dim)] line-clamp-3 leading-relaxed">
                  {module.description}
                </p>
              </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="relative z-10 bg-[var(--bg-elevated)]/40 border-y border-[var(--border)] py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <Reveal className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-a)] mb-2 uppercase tracking-widest font-semibold">
              <CheckCircle2 size={15} />
              <span>Step-By-Step Workflow</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
              How AI IELTS Pro Works
            </h2>
            <p className="text-sm md:text-base text-[var(--text-dim)] mt-3">
              A structured, transparent diagnostic workflow designed for daily practice.
            </p>
          </Reveal>

          <Reveal delayMs={200} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassPanel className="p-6 relative">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-a)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                01
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                Select Skill Module
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Choose Writing Task 1 or 2, Speaking cue cards, Reading passages, or Listening section sprints.
              </p>
            </GlassPanel>

            <GlassPanel className="p-6 relative">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-b)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                02
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                Timed Practice
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Type your essay, record speaking audio, or complete passage questions under realistic exam time constraints.
              </p>
            </GlassPanel>

            <GlassPanel className="p-6 relative">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-c)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                03
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                Instant Diagnostic
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Receive instant band scores across all 4 criteria along with sentence-level grammatical corrections.
              </p>
            </GlassPanel>

            <GlassPanel className="p-6 relative">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-d)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                04
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                Track & Refine
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Monitor overall rounded band trends and complete targeted remedial exercises on weak sub-skills.
              </p>
            </GlassPanel>
          </Reveal>
        </div>
      </section>

      {/* 4. PRICING SECTION -- commented out for now (see {false && (...)}
          wrapper below). Not deleted; flip back on by removing that
          wrapper once pricing is ready to show. */}
      {false && (
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-20">
        <Reveal className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-a)] mb-2 uppercase tracking-widest font-semibold">
            <Sparkles size={15} />
            <span>Transparent Plans</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
            Simple, Honest Pricing
          </h2>
          <p className="text-sm text-[var(--text-dim)] mt-3">
            Choose the plan that matches your exam date and study schedule. No hidden recurring traps.
          </p>
        </Reveal>

        <Reveal delayMs={200} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plan 1: Candidate Pro */}
          <GlassPanel className="p-7 flex flex-col justify-between relative border border-[var(--border)]">
            <div>
              <div className="text-xs font-mono font-semibold uppercase text-[var(--text-faint)] tracking-wider mb-2">
                Monthly Pro
              </div>
              <div className="font-display text-3xl font-extrabold text-[var(--text)] mb-1">
                $19 <span className="text-sm font-normal text-[var(--text-dim)]">/ month</span>
              </div>
              <p className="text-xs text-[var(--text-dim)] mb-6">
                Flexible month-to-month access for steady IELTS preparation.
              </p>

              <div className="space-y-3 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-dim)]">
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-[var(--success)] shrink-0" />
                  <span>Unlimited AI Writing & Speaking evaluations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-[var(--success)] shrink-0" />
                  <span>Sentence-level rewrites & collocations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-[var(--success)] shrink-0" />
                  <span>Full reading & listening passage practice</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-[var(--success)] shrink-0" />
                  <span>Official 0.5 IELTS band rounding</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => handleCta('signup')}
              >
                Enroll Monthly Pro
              </Button>
            </div>
          </GlassPanel>

          {/* Plan 2: 30-Day Sprint Pass (Most Popular) */}
          <GlassPanel className="p-7 flex flex-col justify-between relative border-2 border-[var(--accent-a)] shadow-xl bg-[var(--bg-elevated)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--accent-a)] text-[var(--bg)] font-mono font-bold text-[10px] uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="text-xs font-mono font-semibold uppercase text-[var(--accent-a)] tracking-wider mb-2">
                30-Day Sprint Pass
              </div>
              <div className="font-display text-4xl font-extrabold text-[var(--text)] mb-1">
                $39 <span className="text-sm font-normal text-[var(--text-dim)]">/ one-time</span>
              </div>
              <p className="text-xs text-[var(--text-dim)] mb-6">
                One-time payment. Full high-intensity access for candidates testing this month.
              </p>

              <div className="space-y-3 pt-4 border-t border-[var(--border)] text-xs text-[var(--text)]">
                <div className="flex items-center gap-2.5 font-medium">
                  <Check size={16} className="text-[var(--accent-a)] shrink-0" />
                  <span>30 Days of unlimited AI evaluations</span>
                </div>
                <div className="flex items-center gap-2.5 font-medium">
                  <Check size={16} className="text-[var(--accent-a)] shrink-0" />
                  <span>Priority AI evaluation processing queue</span>
                </div>
                <div className="flex items-center gap-2.5 font-medium">
                  <Check size={16} className="text-[var(--accent-a)] shrink-0" />
                  <span>Audio pronunciation & fluency analysis</span>
                </div>
                <div className="flex items-center gap-2.5 font-medium">
                  <Check size={16} className="text-[var(--accent-a)] shrink-0" />
                  <span>Full 2hr 45min exam simulations</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                icon={<ArrowUpRight size={16} />}
                onClick={() => handleCta('signup')}
              >
                Get 30-Day Sprint Pass
              </Button>
            </div>
          </GlassPanel>

          {/* Plan 3: 90-Day Intensive Pass */}
          <GlassPanel className="p-7 flex flex-col justify-between relative border border-[var(--border)]">
            <div>
              <div className="text-xs font-mono font-semibold uppercase text-[var(--text-faint)] tracking-wider mb-2">
                90-Day Academic Pass
              </div>
              <div className="font-display text-3xl font-extrabold text-[var(--text)] mb-1">
                $69 <span className="text-sm font-normal text-[var(--text-dim)]">/ one-time</span>
              </div>
              <p className="text-xs text-[var(--text-dim)] mb-6">
                Single payment for a complete 3-month band score transformation.
              </p>

              <div className="space-y-3 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-dim)]">
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-[var(--success)] shrink-0" />
                  <span>90 Days of full Candidate Pro access</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-[var(--success)] shrink-0" />
                  <span>Downloadable PDF diagnostic summary reports</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-[var(--success)] shrink-0" />
                  <span>1-on-1 AI strategy recommendations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-[var(--success)] shrink-0" />
                  <span>No auto-recurring subscription</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => handleCta('signup')}
              >
                Get 90-Day Pass
              </Button>
            </div>
          </GlassPanel>
        </Reveal>
      </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border)] py-10 px-4 md:px-10 text-center text-xs text-[var(--text-faint)]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={16} className="text-[var(--accent-a)]" />
          <span className="font-display font-bold text-sm text-[var(--text)]">AI IELTS Pro</span>
        </div>
        <p>© 2026 AI IELTS Pro · Official Descriptor Aligned Evaluator · IELTS is a registered trademark of University of Cambridge, British Council and IDP Education.</p>
      </footer>
    </div>
  );
};
