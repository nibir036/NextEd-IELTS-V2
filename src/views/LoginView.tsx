import React, { useEffect, useState } from "react";

import { GlassPanel } from "../components/ui/GlassPanel";
import { Button } from "../components/ui/Button";

import {
  Sparkles,
  PhoneCall,
  KeyRound,
  LogIn,
  ArrowRight,
  GraduationCap,
  BookOpen,
  ChevronRight,
} from "../components/ui/icons";

import { db } from "../lib/db";

/* =========================================================
   TYPES
========================================================= */

type Lesson = {
  id: string;
  title: string;
  titleBn: string | null;
  body: any;
  position: number;
  difficulty: number | null;
};

/* =========================================================
   COUNTRY CODES
========================================================= */

const COUNTRY_CODES = [
  { code: "+1", name: "USA / Canada" },
  { code: "+44", name: "United Kingdom" },
  { code: "+880", name: "Bangladesh" },
  { code: "+91", name: "India" },
  { code: "+61", name: "Australia" },
  { code: "+971", name: "UAE" },
  { code: "+86", name: "China" },
  { code: "+60", name: "Malaysia" },
  { code: "+92", name: "Pakistan" },
  { code: "+234", name: "Nigeria" },
];

/* =========================================================
   LOGIN VIEW
========================================================= */

interface LoginViewProps {
  onLoginSuccess: () => void;
  onNavigateToSignup: () => void;
  onNavigateToLanding: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateToSignup,
  onNavigateToLanding,
}) => {
  const [countryCode, setCountryCode] = useState<string>("+1");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fullPhone = `${countryCode} ${phoneNumber.trim()}`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);

    if (!phoneNumber.trim() || phoneNumber.trim().length < 6) {
      setErrorMessage("Please enter a valid mobile phone number.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await db.loginUserByPhone(
        fullPhone,
        password
      );

      if (user) {
        /*
         * Login successful.
         *
         * এখানে কোনো Grammar logic নেই।
         * শুধু parent/app-কে জানানো হচ্ছে login successful.
         */
        onLoginSuccess();
      } else {
        setErrorMessage(
          "Invalid phone number or password."
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between relative overflow-hidden">

      {/* Background */}
      <div className="bg-layer">
        <div className="bg-pattern" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">

        <div
          onClick={onNavigateToLanding}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-[image:var(--accent-gradient)] flex items-center justify-center text-white font-bold shadow-md">
            <Sparkles size={18} />
          </div>

          <span className="font-display font-bold text-lg tracking-tight">
            AI IELTS Pro
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateToLanding}
        >
          ← Back to Home
        </Button>

      </header>

      {/* Login */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">

        <div className="w-full max-w-md space-y-6">

          <GlassPanel className="p-6 md:p-8 border border-[var(--border)] shadow-2xl space-y-6 relative">

            {/* Login Header */}
            <div className="text-center space-y-2">

              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-a)]/15 text-[var(--accent-a)] flex items-center justify-center mx-auto shadow-inner">
                <LogIn size={24} />
              </div>

              <h1 className="font-display text-2xl font-extrabold text-[var(--text)]">
                Log In to Your Account
              </h1>

              <p className="text-xs text-[var(--text-dim)]">
                Phone & Password Authentication for IELTS Candidates
              </p>

            </div>

            {/* Error */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium text-center animate-fadeIn">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >

              {/* Country */}
              <div>

                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Select Country Code
                </label>

                <select
                  value={countryCode}
                  onChange={(e) =>
                    setCountryCode(e.target.value)
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
                >

                  {COUNTRY_CODES.map((country) => (
                    <option
                      key={country.code}
                      value={country.code}
                    >
                      {country.code} ({country.name})
                    </option>
                  ))}

                </select>

              </div>

              {/* Phone */}
              <div>

                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Mobile Phone Number
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                    <PhoneCall size={16} />
                  </div>

                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors font-mono"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Password
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                    <KeyRound size={16} />
                  </div>

                  <input
                    type="password"
                    required
                    placeholder="Your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors"
                  />

                </div>

              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 flex items-center justify-center gap-2 mt-2"
              >

                <LogIn size={16} />

                <span>
                  {isSubmitting
                    ? "Logging in..."
                    : "Log In"}
                </span>

              </Button>

            </form>

            {/* Signup */}
            <div className="text-center pt-4 border-t border-[var(--border)]">

              <span className="text-xs text-[var(--text-dim)]">
                Don't have an account yet?{" "}
              </span>

              <button
                type="button"
                onClick={onNavigateToSignup}
                className="text-xs font-bold text-[var(--accent-a)] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Sign Up</span>
                <ArrowRight size={12} />
              </button>

            </div>

          </GlassPanel>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-[var(--text-faint)] font-mono border-t border-[var(--border)]">
        AI IELTS Pro • Phone Authentication • Powered by PostgreSQL
      </footer>

    </div>
  );
};


/* =========================================================
   LMS VIEW
========================================================= */

interface LmsViewProps {
  initialTab?: string;
  id?: string;
}

export const LmsView: React.FC<LmsViewProps> = ({
  initialTab = "grammar",
  id,
}) => {

  const [activeTab, setActiveTab] = useState<
    "grammar" | "vocab"
  >(
    initialTab.includes("vocab")
      ? "vocab"
      : "grammar"
  );

  const [grammarLessons, setGrammarLessons] =
    useState<Lesson[]>([]);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  /* -----------------------------------------
     Tab Change
  ----------------------------------------- */

  useEffect(() => {
    setActiveTab(
      initialTab.includes("vocab")
        ? "vocab"
        : "grammar"
    );
  }, [initialTab]);

  /* -----------------------------------------
     Load Grammar From PostgreSQL API
  ----------------------------------------- */

  useEffect(() => {

    if (activeTab !== "grammar") {
      return;
    }

    const loadLessons = async () => {

      setLoading(true);
      setError(null);

      try {

        const response = await fetch(
          "/api/lessons?section=grammar"
        );

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status}`
          );
        }

        const data = await response.json();

        /*
         * API can return:
         *
         * [
         *   {...},
         *   {...}
         * ]
         *
         * অথবা
         *
         * {
         *   lessons: [...]
         * }
         */

        if (Array.isArray(data)) {

          setGrammarLessons(data);

        } else if (
          Array.isArray(data?.lessons)
        ) {

          setGrammarLessons(data.lessons);

        } else {

          setGrammarLessons([]);

        }

      } catch (error) {

        console.error(
          "Grammar API Error:",
          error
        );

        setError(
          "Unable to load grammar lessons."
        );

        setGrammarLessons([]);

      } finally {

        setLoading(false);

      }
    };

    loadLessons();

  }, [activeTab]);

  /* -----------------------------------------
     Vocabulary
  ----------------------------------------- */

  const vocabCategories = [
    {
      category:
        "Topic: Environment & Sustainability",

      bandScore:
        "Band 8.0 Level",

      words: [
        {
          word: "Mitigate",
          POS: "verb",
          def:
            "Make less severe or serious.",
          collocation:
            "mitigate climate risks",
        },

        {
          word: "Precipitous",
          POS: "adj",
          def:
            "Dangerously high or steep / sudden.",
          collocation:
            "precipitous decline in biodiversity",
        },

        {
          word: "Detrimental",
          POS: "adj",
          def:
            "Tending to cause harm.",
          collocation:
            "detrimental impacts on ecosystem",
        },
      ],
    },
  ];

  /* -----------------------------------------
     Difficulty
  ----------------------------------------- */

  const getLevel = (
    difficulty: number | null
  ) => {

    if (
      difficulty === null ||
      difficulty === undefined
    ) {
      return "Band 6.0+";
    }

    if (difficulty <= 1) {
      return "Band 6.0+";
    }

    if (difficulty === 2) {
      return "Band 7.0+";
    }

    return "Band 8.0+";
  };

  /* -----------------------------------------
     Body Intro
  ----------------------------------------- */

  const getIntro = (body: any) => {

    if (!body) {
      return "No description available.";
    }

    if (typeof body === "string") {
      return body;
    }

    return (
      body.intro ||
      "No description available."
    );
  };

  /* -----------------------------------------
     Bangla Intro
  ----------------------------------------- */

  const getIntroBn = (body: any) => {

    if (
      !body ||
      typeof body === "string"
    ) {
      return null;
    }

    return body.introBn || null;
  };

  /* -----------------------------------------
     UI
  ----------------------------------------- */

  return (
    <div
      id={id}
      className="space-y-6"
    >

      {/* Header */}
      <GlassPanel className="p-6 md:p-8 relative overflow-hidden border border-[var(--border)]">

        <div className="relative z-10">

          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--accent-a)] tracking-wider mb-2">

            <GraduationCap size={18} />

            <span>
              LMS • Learning Management System
            </span>

          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">

            {activeTab === "grammar"
              ? "Grammar Masterclass"
              : "IELTS Vocabulary Bank"}

          </h1>

          <p className="text-sm text-[var(--text-dim)] mt-1 max-w-2xl">

            {activeTab === "grammar"
              ? "Curated grammar rules designed specifically to elevate your Grammatical Range & Accuracy score."
              : "Band 8.0+ vocabulary banks organized by topic, with collocations examiners look for."}

          </p>

        </div>

      </GlassPanel>

      {/* =====================================
          GRAMMAR
      ====================================== */}

      {activeTab === "grammar" && (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Loading */}

          {loading && (

            <div className="col-span-3 text-center text-[var(--text-dim)] py-10">

              Loading grammar lessons...

            </div>

          )}

          {/* Error */}

          {!loading && error && (

            <div className="col-span-3 text-center py-10">

              <p className="text-rose-400 text-sm mb-4">
                {error}
              </p>

              <Button
                variant="secondary"
                onClick={() => {

                  setActiveTab("vocab");

                  setTimeout(() => {
                    setActiveTab("grammar");
                  }, 50);

                }}
              >
                Try Again
              </Button>

            </div>

          )}

          {/* Empty */}

          {!loading &&
            !error &&
            grammarLessons.length === 0 && (

              <div className="col-span-3 text-center text-[var(--text-dim)] py-10">

                No grammar lessons found.

              </div>

            )}

          {/* Grammar Cards */}

          {!loading &&
            !error &&
            grammarLessons.map((lesson) => (

              <GlassPanel
                key={lesson.id}
                className="p-6 flex flex-col justify-between border border-[var(--border)] hover:border-[var(--accent-a)]/40 transition-colors"
              >

                <div>

                  {/* Level */}

                  <div className="flex items-center justify-between mb-3">

                    <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">

                      {getLevel(
                        lesson.difficulty
                      )}

                    </span>

                    <span className="text-xs text-[var(--text-faint)] font-mono">

                      Chapter {lesson.position}

                    </span>

                  </div>

                  {/* Title */}

                  <h3 className="font-display text-lg font-bold text-[var(--text)] mb-1">

                    {lesson.title}

                  </h3>

                  {/* Bangla title */}

                  {lesson.titleBn && (

                    <p className="text-xs text-[var(--text-dim)] mb-3">

                      {lesson.titleBn}

                    </p>

                  )}

                  {/* Description */}

                  <p className="text-xs text-[var(--text-dim)] mb-4 line-clamp-3">

                    {getIntro(
                      lesson.body
                    )}

                  </p>

                  {/* Bangla description */}

                  {getIntroBn(
                    lesson.body
                  ) && (

                    <p className="text-[11px] text-[var(--text-faint)] mb-4 italic line-clamp-2">

                      {getIntroBn(
                        lesson.body
                      )}

                    </p>

                  )}

                </div>

                {/* Exercise */}

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1.5"

                  onClick={() => {

                    console.log(
                      "Selected Grammar Lesson:",
                      lesson
                    );

                  }}
                >

                  <span>
                    Start Grammar Exercise
                  </span>

                  <ChevronRight size={16} />

                </Button>

              </GlassPanel>

            ))}

        </div>

      )}

      {/* =====================================
          VOCABULARY
      ====================================== */}

      {activeTab === "vocab" && (

        <div className="space-y-6">

          {vocabCategories.map(
            (cat, catIdx) => (

              <GlassPanel
                key={catIdx}
                className="p-6 border border-[var(--border)]"
              >

                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">

                  <h3 className="font-display text-lg font-bold text-[var(--text)] flex items-center gap-2">

                    <BookOpen
                      size={18}
                      className="text-[var(--accent-a)]"
                    />

                    <span>
                      {cat.category}
                    </span>

                  </h3>

                  <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">

                    {cat.bandScore}

                  </span>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {cat.words.map(
                    (word, wordIdx) => (

                      <div
                        key={wordIdx}
                        className="p-4 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] space-y-2"
                      >

                        <div className="flex items-baseline justify-between">

                          <span className="font-display font-bold text-base text-[var(--text)]">

                            {word.word}

                          </span>

                          <span className="text-[11px] font-mono text-[var(--text-faint)] italic">

                            {word.POS}

                          </span>

                        </div>

                        <p className="text-xs text-[var(--text-dim)]">

                          {word.def}

                        </p>

                        <div className="pt-2 border-t border-[var(--border)]/60 text-[11px] font-mono text-[var(--accent-a)]">

                          Collocation: "{word.collocation}"

                        </div>

                      </div>

                    )
                  )}

                </div>

              </GlassPanel>

            )
          )}

        </div>

      )}

    </div>
  );
};