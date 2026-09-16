import React from 'react';
import { LandingNav } from '../components/landing/LandingNav';
import { HeroFlightBackground } from '../components/landing/HeroFlightBackground';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
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

// Short, muted, looping preview clips for each practice module -- shown as
// a framed thumbnail above the card's name/description rather than as a
// full-card background, since the source clips already carry their own
// baked-in text (posters, captions) that would clash with an overlaid label.
const moduleVideos: Record<string, string> = {
  reading: '/videos/modules/reading.mp4',
  listening: '/videos/modules/listening.mp4',
  writing: '/videos/modules/writing.mp4',
  speaking: '/videos/modules/speaking.mp4',
};

// Journey-framed marketing copy for the landing page's 4-skill cards --
// kept separate from `skillModules` in lib/data.ts so the official skill
// names/descriptions used elsewhere in the app (dashboard, badges) stay
// untouched; this only overrides what the landing page displays.
const moduleMarketingCopy: Record<string, { title: string; description: string }> = {
  reading: {
    title: 'Read Beyond the Test',
    description: 'Train with realistic passages, discover new vocabulary, and learn to find answers with confidence.',
  },
  listening: {
    title: 'Learn to Listen Anywhere',
    description: 'Practice with realistic audio and train yourself to catch the details that matter.',
  },
  writing: {
    title: 'Turn Your Ideas Into Band Scores',
    description: 'Write. Get instant feedback. Understand your mistakes. Write better next time.',
  },
  speaking: {
    title: 'Find Your Voice',
    description: 'Practice speaking naturally, improve fluency and pronunciation, and become comfortable answering under pressure.',
  },
};

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

      {/* 1. HOME SECTION -- the looping flight-route Lottie animation
          (public/lottie/hero-flight.json, recolored to the app's own
          --accent-a/--accent-b/--accent-d/--text tokens) fills the
          section as a full-bleed background. A gradient fades it into
          the page background at the edges so it doesn't read as a
          hard-edged video box, and the headline sits centered on top
          inside a frosted (backdrop-blur) glass panel so it stays
          legible over the moving illustration. */}
      <section id="home" className="relative z-10 overflow-hidden page-fade-in">
        <HeroFlightBackground className="absolute inset-0 w-full h-full opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/35 to-[var(--bg)]" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-10 pt-16 pb-16 md:pt-24 md:pb-24">
          <div className="backdrop-blur-md bg-[var(--bg)]/15 border border-[var(--border)] rounded-3xl px-6 py-10 md:px-14 md:py-14 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left: headline, copy & CTAs. Ordered *after* the mascot
                video on mobile (order-2, below lg:order-1 on desktop) so
                phone-width visitors see the waving mascot first, then the
                headline -- desktop keeps the original text-left/video-right
                arrangement via the lg: overrides. */}
            <div className="order-2 lg:order-1 space-y-6 text-center lg:text-left">
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-[var(--text)] tracking-tight leading-[1.1]">
                Your Future Abroad <br />
                <span className="text-gradient">Starts With IELTS.</span><br />
                <span className="text-gradient">Get Ready for What's Next.</span>
              </h1>

              <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
                <p className="text-base sm:text-lg text-[var(--text-dim)] leading-relaxed">
                  Imagine studying somewhere new. Exploring a new city. Meeting people from around the world. Building the future you've been working toward.
                </p>
                <p className="text-base sm:text-lg text-[var(--text-dim)] leading-relaxed">
                  IELTS AI helps you turn that goal into a plan—with realistic practice, instant AI feedback, and the confidence to take the next step.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<UserPlus size={18} />}
                  onClick={() => handleCta('signup')}
                >
                  {isLoggedIn ? 'Start My Journey →' : 'Register now to start free'}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<LogIn size={18} />}
                  onClick={() => handleCta('login')}
                >
                  {isLoggedIn ? 'Explore IELTS Practice' : 'Log In to Explore'}
                </Button>
              </div>

              <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[var(--text-faint)] font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[var(--success)]" />
                  <span>Know Where You Stand</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[var(--success)]" />
                  <span>Know What You're Working Toward</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[var(--success)]" />
                  <span>Practice with AI from Wherever You Are</span>
                </div>
              </div>
            </div>

            {/* Right: continuously looping mascot-waving product demo
                video, framed in the app's own purple accent gradient
                rather than a plain white/black panel. order-1 puts it
                first on mobile (above the headline); lg:order-2 restores
                it to the right column on desktop. */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-3xl overflow-hidden border border-[var(--border)] shadow-xl bg-[image:var(--accent-gradient)]">
                <video
                  className="w-full h-full object-cover"
                  src="/videos/hero-demo.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-label="IELTS AI product walkthrough"
                />
              </div>
            </div>
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
            <span>Your Journey Starts Here</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
            Your Destination Is Bigger Than a Test
          </h2>
          <div className="mt-3 space-y-3">
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
              IELTS isn't the destination. It's one of the steps that can take you closer to the university, country, career, and life you've been imagining.
            </p>
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
              IELTS AI is an intelligent exam preparation framework engineered to align strictly with official Cambridge 9-Band descriptors. We provide objective, verifiable feedback without exaggerated guarantees.
            </p>
          </div>
        </div>
        </Reveal>

        <Reveal delayMs={200} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassPanel className="space-y-3 border border-[var(--border)] shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center font-bold shadow-md">
              <Shield size={20} />
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">
              Know Where You Stand
            </h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              Take realistic IELTS practice and discover your strengths and weaknesses across all four skills.
            </p>
          </GlassPanel>

          <GlassPanel className="space-y-3 border border-[var(--border)] shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center font-bold shadow-md">
              <Trophy size={20} />
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">
              Know What To Improve
            </h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              Get clear feedback on your performance so you know what needs more work before exam day.
            </p>
          </GlassPanel>

          <GlassPanel className="space-y-3 border border-[var(--border)] shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center font-bold shadow-md">
              <Sparkles size={20} />
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">
              Turn Mistakes Into Progress
            </h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              See how your sentences can improve and use the feedback to write with greater clarity and confidence.
            </p>
          </GlassPanel>
        </Reveal>

        {/* 4 Core Practice Modules Overview */}
        <div className="pt-8 border-t border-[var(--border)]">
          <Reveal className="text-center mb-8">
            <h3 className="font-display text-xl font-bold text-[var(--text)]">
              Build the Skills That Take You There
            </h3>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillModules.map((module, idx) => (
              <Reveal key={module.id} delayMs={idx * 140}>
                <div
                  onClick={() => onLaunchApp(module.id)}
                  className="glass glass-interactive cursor-pointer relative overflow-hidden group shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
                >
                  {/* Framed video thumbnail -- muted, looping, cropped to a
                      consistent ratio so the four differently-shot source
                      clips sit evenly in the grid. */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                    <video
                      className="w-full h-full object-cover"
                      src={moduleVideos[module.id]}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)]">
                        {module.name.replace('IELTS ', '')}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--text-faint)] bg-[var(--panel-2)] border border-[var(--border)] px-2 py-0.5 rounded-full">
                        {module.activeModulesCount} Sets
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-[var(--text)] transition-colors mb-1">
                      {moduleMarketingCopy[module.id]?.title ?? module.name}
                    </h4>
                    <p className="text-xs text-[var(--text-dim)] line-clamp-3 leading-relaxed">
                      {moduleMarketingCopy[module.id]?.description ?? module.description}
                    </p>
                  </div>
                </div>
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
              <span>One Step Closer, Every Day</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
              One Step Closer, Every Day
            </h2>
            <p className="text-sm md:text-base text-[var(--text-dim)] mt-3">
              Big dreams can feel far away. Break them down into small steps—and keep moving.
            </p>
          </Reveal>

          <Reveal delayMs={200} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassPanel className="border border-[var(--border)] shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[image:var(--accent-gradient)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                01
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                Choose Your Goal
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Pick a skill, practice type, or target score and decide what you want to improve today.
              </p>
            </GlassPanel>

            <GlassPanel className="border border-[var(--border)] shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[image:var(--accent-gradient)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                02
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                Practice Like It's Real
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Take timed exercises designed to feel closer to the real IELTS experience.
              </p>
            </GlassPanel>

            <GlassPanel className="border border-[var(--border)] shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[image:var(--accent-gradient)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                03
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                See Where You Stand
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Get instant feedback that shows what's working—and what needs more work.
              </p>
            </GlassPanel>

            <GlassPanel className="border border-[var(--border)] shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[image:var(--accent-gradient)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                04
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                Come Back Stronger
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Track your progress, strengthen your weak areas, and keep moving toward your target.
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
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--accent-a)] text-[var(--bg)] font-mono font-bold text-[11px] uppercase tracking-wider">
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
      <footer className="font-michroma relative z-10 border-t border-[var(--border)] py-10 px-4 md:px-10 text-center text-xs tracking-wide text-[var(--text-faint)]">
        <p className="mb-4 text-[var(--text-dim)]">Prepare for what's next.</p>
        <div className="flex items-center justify-center mb-3">
          <img src="/branding/ielts-ai-wordmark-dark.png" alt="IELTS AI by nextED." className="brand-wordmark-dark h-10 w-auto object-contain" />
          <img src="/branding/ielts-ai-wordmark-light.png" alt="IELTS AI by nextED." className="brand-wordmark-light h-10 w-auto object-contain" />
        </div>
        <p className="leading-relaxed">© 2026 IELTS AI · IELTS is a registered trademark of University of Cambridge, British Council and IDP Education.</p>
      </footer>
    </div>
  );
};
