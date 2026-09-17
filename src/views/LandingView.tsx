import React, { useState } from 'react';
import { LandingNav } from '../components/landing/LandingNav';
import { HeroFlightBackground } from '../components/landing/HeroFlightBackground';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { skillModules, siteStats } from '../lib/data';
import {
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  GraduationCap,
  BookOpen,
  PenTool,
  Mic,
  FileCheck,
  UserPlus,
  LogIn,
  ChevronDown,
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

// "Four Skills" marketing copy for the landing page's 4-skill cards --
// kept separate from `skillModules` in lib/data.ts so the official skill
// names/descriptions used elsewhere in the app (dashboard, badges) stay
// untouched; this only overrides what the landing page displays.
const moduleMarketingCopy: Record<string, { title: string; description: string }> = {
  reading: {
    title: 'Reading',
    description: 'Read faster. Find answers with confidence.',
  },
  listening: {
    title: 'Listening',
    description: 'Every accent. Every speed. A trained ear.',
  },
  writing: {
    title: 'Writing',
    description: 'Turn your ideas into band scores.',
  },
  speaking: {
    title: 'Speaking',
    description: 'Find your voice. Speak like it is natural.',
  },
};

// "The Toolkit" -- six things the platform covers, each with its own
// short line rather than a paragraph. Icon-badge-card pattern reused
// from the app's existing feature-card convention (see the old 3-card
// row this replaces).
const toolkitItems = [
  {
    icon: GraduationCap,
    title: 'Grammar, from zero',
    description: 'The foundation the test is built on. We start at the beginning.',
  },
  {
    icon: BookOpen,
    title: 'A vocabulary that scores',
    description: 'Thousands of IELTS words, phrases, and idioms that lift your band.',
  },
  {
    icon: PenTool,
    title: 'Writing feedback, line by line',
    description: 'Every sentence checked. Every fix shown. In seconds.',
  },
  {
    icon: Mic,
    title: 'Speaking, without the pressure',
    description: 'Practice out loud. Get real feedback on fluency and pronunciation.',
  },
  {
    icon: FileCheck,
    title: 'Mock tests that feel real',
    description: 'Timed. Complete. Exactly like the day that counts.',
  },
  {
    icon: Sparkles,
    title: 'The techniques tutors teach',
    description: 'The strategies and shortcuts for every question type.',
  },
];

const faqItems = [
  {
    q: 'Can a complete beginner start here?',
    a: 'Yes. That is exactly who we built this for.',
  },
  {
    q: 'How does the AI feedback work?',
    a: 'It checks your writing and speaking against IELTS criteria and shows you what to fix.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. Start with no card and no commitment.',
  },
  {
    q: 'Does it cover all four skills?',
    a: 'Reading, Listening, Writing, and Speaking. All of it.',
  },
  {
    q: 'Can I practice on my phone?',
    a: 'Anywhere, anytime, at your pace.',
  },
  {
    q: 'How is this different?',
    a: 'Most tools assume you are already good. We start before that.',
  },
];

export const LandingView: React.FC<LandingViewProps> = ({ onLaunchApp, isLoggedIn = false, id }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCta = (defaultTarget: string = 'signup') => {
    if (isLoggedIn) {
      onLaunchApp('dashboard');
    } else {
      onLaunchApp(defaultTarget);
    }
  };

  // FAQPage structured data -- built straight from faqItems above (single
  // source of truth with the rendered accordion, so it can't drift out of
  // sync) and rendered as SSR'd JSON-LD, same pattern as the Organization/
  // WebSite schema in layout.tsx. This is what lets Google show these
  // Q&As as an expandable rich result in search instead of just a plain
  // blue link.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Beta announcement strip -- a sibling BEFORE LandingNav (not sticky
          itself), so it scrolls away with the page while the nav below it
          keeps sticking once it reaches the top. Persistent for every
          visitor; there's no dismiss/localStorage flag because this is
          meant to stay visible for the whole beta period, not just once. */}
      <div className="relative z-20 bg-[image:var(--accent-gradient)] text-white text-center px-4 py-2">
        <p className="text-xs md:text-sm font-mono font-semibold flex items-center justify-center gap-2 flex-wrap">
          <Sparkles size={14} className="shrink-0" />
          <span>You&apos;re using the Beta release of IELTS AI — features are still being polished, and things may change.</span>
        </p>
      </div>

      {/* LandingNav renders here, as a sibling BEFORE the overflow-hidden
          content wrapper below, not inside it. Per the CSS spec, any
          ancestor with a non-visible `overflow` breaks `position: sticky`
          for its descendants -- even one that never actually clips
          anything, like this wrapper (it only exists to contain the
          decorative background layers). That's why the nav wasn't
          actually sticking on scroll despite having `sticky` set. */}
      <LandingNav onNavigate={(route) => onLaunchApp(route)} isLoggedIn={isLoggedIn} />

      <div id={id} className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative overflow-hidden">
        {/* Background ambient glow layer */}
        <div className="bg-layer">
          <div className="bg-pattern" />
        </div>

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
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-a)] uppercase tracking-widest font-semibold">
                <span>IELTS AI by NextED</span>
              </div>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-[var(--text)] tracking-tight leading-[1.1]">
                Your target band. <br />
                <span className="text-gradient">From day one.</span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-dim)] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The most complete way to prepare for IELTS. Built for beginners. Guided by AI.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<UserPlus size={18} />}
                  onClick={() => handleCta('signup')}
                >
                  {isLoggedIn ? 'Continue My Journey →' : 'Start free →'}
                </Button>
                {!isLoggedIn && (
                  <Button
                    variant="secondary"
                    size="lg"
                    icon={<LogIn size={18} />}
                    onClick={() => handleCta('login')}
                  >
                    Log in
                  </Button>
                )}
              </div>

              <p className="text-xs text-[var(--text-faint)] font-mono pt-1">
                No credit card. No level too low.
              </p>
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
            <Reveal key={idx} delayMs={idx * 160} className="text-center">
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

      {/* 2. THE PROMISE -- a plain, confident text block. No card grid
          here on purpose: the promise is the opening statement, the
          toolkit/skills sections right after carry the visual weight. */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 md:px-10 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
            You don&rsquo;t have to be ready. You just have to begin.
          </h2>
          <div className="mt-5 space-y-3">
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
              Maybe your grammar is weak. Maybe you have never seen an IELTS question. Maybe you tried before and the score was not enough.
            </p>
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
              None of that stops you here.
            </p>
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
              We start from wherever you are. And take you to where you need to be.
            </p>
          </div>
        </Reveal>
      </section>

      {/* 3. THE TOOLKIT */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-20">
        <Reveal className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-a)] mb-2 uppercase tracking-widest font-semibold">
            <BrainCircuit size={15} />
            <span>Everything You Need</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
            Everything you need. Nothing left out.
          </h2>
          <p className="text-sm md:text-base text-[var(--text-dim)] mt-3">
            A complete path, built around how IELTS is scored.
          </p>
        </Reveal>

        <Reveal delayMs={200} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolkitItems.map((item, idx) => (
            <GlassPanel key={idx} className="space-y-3 border border-[var(--border)] shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center font-bold shadow-md">
                <item.icon size={20} />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--text)]">
                {item.title}
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                {item.description}
              </p>
            </GlassPanel>
          ))}
        </Reveal>
      </section>

      {/* 4. FOUR SKILLS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 pb-20">
        <Reveal className="text-center mb-8">
          <h3 className="font-display text-xl font-bold text-[var(--text)]">
            Four skills. One journey.
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
      </section>

      {/* 5. THE FEEDBACK */}
      <section className="relative z-10 bg-[var(--bg-elevated)]/40 border-y border-[var(--border)] py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-10 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
              Feedback no classroom can give.
            </h2>
            <div className="mt-5 space-y-3 max-w-2xl mx-auto">
              <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
                One teacher. Forty students. Your essay waits days.
              </p>
              <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
                Here, it is only you.
              </p>
              <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
                Ask again tomorrow. The AI never runs out of patience.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={200} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 max-w-2xl mx-auto">
            <GlassPanel className="border border-[var(--border)] shadow-lg text-left">
              <div className="w-9 h-9 rounded-xl bg-[image:var(--accent-gradient)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                01
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                Writing, with instant feedback
              </h3>
              <p className="text-sm text-[var(--text)] leading-relaxed">
                Write, and see what to fix the moment you finish.
              </p>
            </GlassPanel>
            <GlassPanel className="border border-[var(--border)] shadow-lg text-left">
              <div className="w-9 h-9 rounded-xl bg-[image:var(--accent-gradient)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                02
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                Speaking, with real-time correction
              </h3>
              <p className="text-sm text-[var(--text)] leading-relaxed">
                Speak, and hear exactly how to improve.
              </p>
            </GlassPanel>
          </Reveal>
        </div>
      </section>

      {/* 6. ANYWHERE */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 md:px-10 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
            No classroom. No commute. No schedule.
          </h2>
          <div className="mt-5 space-y-3">
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
              Prepare from your room. On the bus. Between classes. At midnight.
            </p>
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
              Ten minutes is enough to begin. No coaching center. No fixed batch. No one waiting on you.
            </p>
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
              Your preparation is always with you. It waits until you are ready.
            </p>
          </div>
        </Reveal>
      </section>

      {/* 7. HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 bg-[var(--bg-elevated)]/40 border-y border-[var(--border)] py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <Reveal className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-a)] mb-2 uppercase tracking-widest font-semibold">
              <CheckCircle2 size={15} />
              <span>Three Steps</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
              Three steps. You always know the next one.
            </h2>
          </Reveal>

          <Reveal delayMs={200} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <GlassPanel className="border border-[var(--border)] shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[image:var(--accent-gradient)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                01
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                See where you stand
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                A short diagnostic across all four skills.
              </p>
            </GlassPanel>

            <GlassPanel className="border border-[var(--border)] shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[image:var(--accent-gradient)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                02
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                Follow your plan
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                A daily plan built around your target band.
              </p>
            </GlassPanel>

            <GlassPanel className="border border-[var(--border)] shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[image:var(--accent-gradient)] text-white font-bold font-mono text-sm flex items-center justify-center mb-4 shadow-md">
                03
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">
                Practice and rise
              </h3>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Practice with feedback. Then mock. Then watch your score move.
              </p>
            </GlassPanel>
          </Reveal>
        </div>
      </section>

      {/* 8. THE DESTINATION */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 md:px-10 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
            This was never about a test.
          </h2>
          <div className="mt-5 space-y-3">
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
              A university offer. A scholarship. A new country. A life you have been working toward.
            </p>
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed">
              IELTS is one step. We help you take it.
            </p>
          </div>
        </Reveal>
      </section>

      {/* 9. FAQ */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 md:px-10 py-20">
        <Reveal className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
            Good to know.
          </h2>
        </Reveal>

        <Reveal delayMs={200} className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <GlassPanel key={idx} className="border border-[var(--border)] shadow-lg !p-0 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                >
                  <span className="font-display font-semibold text-sm text-[var(--text)]">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-[var(--text-faint)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-[var(--text-dim)] leading-relaxed">{item.a}</p>
                  </div>
                )}
              </GlassPanel>
            );
          })}
        </Reveal>
      </section>

      {/* 10. FINAL CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 md:px-10 pb-20">
        <Reveal>
          <div className="text-center rounded-3xl border border-[var(--border)] bg-[image:var(--accent-gradient)] px-6 py-14 md:px-14 md:py-16 shadow-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Begin today. Your band is closer than it looks.
            </h2>
            <div className="flex items-center justify-center pt-8">
              <Button
                variant="secondary"
                size="lg"
                icon={<UserPlus size={18} />}
                onClick={() => handleCta('signup')}
                className="!bg-white !text-[var(--accent-a)] hover:!bg-white/90 !border-transparent hover:!border-transparent"
              >
                {isLoggedIn ? 'Continue My Journey →' : 'Start free →'}
              </Button>
            </div>
            <p className="text-xs text-white/80 font-mono pt-4">
              No credit card. No level too low. Just your first step.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="font-michroma relative z-10 border-t border-[var(--border)] py-10 px-4 md:px-10 text-center text-xs tracking-wide text-[var(--text-faint)]">
        <p className="mb-4 text-[var(--text-dim)]">Prepare for what&rsquo;s next.</p>
        <div className="flex items-center justify-center mb-3">
          <img src="/branding/ielts-ai-wordmark-dark.png" alt="IELTS AI by nextED." className="brand-wordmark-dark h-10 w-auto object-contain" />
          <img src="/branding/ielts-ai-wordmark-light.png" alt="IELTS AI by nextED." className="brand-wordmark-light h-10 w-auto object-contain" />
        </div>
        <p className="leading-relaxed">© 2026 IELTS AI · IELTS is a registered trademark of University of Cambridge, British Council and IDP Education.</p>
        <div className="flex items-center justify-center gap-4 mt-3 font-sans normal-case tracking-normal">
          <button
            type="button"
            onClick={() => onLaunchApp('terms')}
            className="text-[var(--text-faint)] hover:text-[var(--accent-a)] hover:underline cursor-pointer transition-colors"
          >
            Terms &amp; Conditions
          </button>
          <span className="text-[var(--border)]">·</span>
          <button
            type="button"
            onClick={() => onLaunchApp('privacy')}
            className="text-[var(--text-faint)] hover:text-[var(--accent-a)] hover:underline cursor-pointer transition-colors"
          >
            Privacy Policy
          </button>
        </div>
      </footer>
      </div>
    </>
  );
};
