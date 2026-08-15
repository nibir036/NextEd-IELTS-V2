import { AppendixSectionContent } from "./AppendixContent";
import React, { useEffect, useState } from "react";

import { GlassPanel } from "../components/ui/GlassPanel";
import { Button } from "../components/ui/Button";

import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Check,
  ChevronRight,
} from "../components/ui/icons";

interface LmsViewProps {
  initialTab?: string;
  id?: string;
}

type Lesson = {
  id: string;
  title: string;
  titleBn: string | null;
  body: any;
  position: number;
  difficulty: number | null;
};

// ============================================================
// STATIC FALLBACK DATA — Chapters 1–10
// (API না থাকলেও কাজ করবে)
// ============================================================

const STATIC_GRAMMAR_LESSONS: Lesson[] = [
  // ─── Chapter 1 (already seeded normally) ───
  {
    id: "grammar-ch-1",
    title: "Subject-Verb Agreement & Sentence Foundations",
    titleBn: "Subject-Verb Agreement ও বাক্যের ভিত্তি",
    position: 1,
    difficulty: 1,
    body: {
      intro:
        "Subject-verb agreement is the rule that the verb must match its subject in number. A singular subject takes one form of the verb; a plural subject takes another. Most Band-6 errors come from this single rule.",
      introBn:
        "Subject-verb agreement মানে verb-কে subject-এর সংখ্যার সাথে মিলিয়ে ব্যবহার করা। ব্যান্ড ৬-এর বেশিরভাগ ভুল এখান থেকেই আসে।",
      sections: [
        {
          code: "1.1",
          title: "The core rule",
          titleBn: "মূল নিয়ম",
          content: {
            points: [
              {
                term: "Singular subject",
                en: "verb + s / es → The student works hard.",
                bn: "একবচন subject → verb-এ -s/-es",
              },
              {
                term: "Plural subject",
                en: "base verb, no -s → The students work hard.",
                bn: "বহুবচন subject → verb-এ -s নেই",
              },
            ],
            coreFact:
              "On a noun, -s means plural. On a verb, -s means singular. Correct sentences often have -s on either the noun or the verb, but not both.",
          },
          cases: [
            {
              title: "Words between subject and verb",
              rule: "The verb agrees with the true subject, never the nearest noun.",
              examples: [
                {
                  wrong: "The list of items are on the table.",
                  right: "The list of items is on the table.",
                  why: "subject = list (singular)",
                },
              ],
            },
            {
              title: "The number of vs A number of",
              rule: "The number of + plural → singular verb. A number of + plural → plural verb.",
              examples: [
                {
                  wrong: "The number of tourists have increased.",
                  right: "The number of tourists has increased.",
                  why: "subject = number (singular)",
                },
              ],
            },
          ],
        },
      ],
      exercises: [
        {
          code: "1.1",
          title: "Identification and Correction",
          instruction: "Rewrite each faulty sentence correctly.",
          items: [
            {
              q: 1,
              sentence: "The list of approved candidates are posted on the noticeboard.",
              answer: "The list of approved candidates is posted on the noticeboard.",
              explanation: "subject = list (singular)",
            },
            {
              q: 2,
              sentence: "Each of the students have submitted their assignment.",
              answer: "Each of the students has submitted their assignment.",
              explanation: "each of is always singular",
            },
            {
              q: 3,
              sentence: "The government are introducing a new tax next year.",
              answer: "The government is introducing a new tax next year.",
              explanation: "collective noun treated as singular in academic writing",
            },
          ],
        },
      ],
    },
  },

  // ─── Chapter 2 ───
  {
    id: "grammar-ch-2",
    title: "Tense Mastery & Time Precision",
    titleBn: "কাল নিপুণতা ও সময়ের নির্ভুলতা",
    position: 2,
    difficulty: 1,
    body: {
      intro:
        "Subject-verb agreement made your verbs match. Tense makes them sit in the right time. In IELTS this is not a small point of grammar; it is a matter of meaning.",
      introBn:
        "অধ্যায় ২-এর মূল কথা: tense মানে verb-কে সঠিক সময়ে বসানো। ভুল tense মানে শুধু grammar ভুল নয়, ঘটনাটা কখন ঘটেছে সেটাই ভুল বলা।",
      sections: [
        {
          code: "2.1",
          title: "What a tense actually is",
          titleBn: "Tense আসলে কী",
          content: {
            points: [
              {
                term: "Time",
                en: "Past, present, or future – when did it happen?",
                bn: "কখন ঘটেছে?",
              },
              {
                term: "Aspect",
                en: "Simple, continuous, perfect, or perfect continuous.",
                bn: "কাজটি শেষ, চলমান, নাকি অন্য সময়ের সাথে যুক্ত?",
              },
            ],
            coreFact:
              "Five tenses do about 90% of the work in IELTS: Present Simple, Present Continuous, Present Perfect, Past Simple, and Future (will).",
          },
        },
        {
          code: "2.2",
          title: "High-value tense contrasts",
          cases: [
            {
              title: "Present Perfect vs Past Simple",
              rule: "Present Perfect with since/for/already/yet. Past Simple with finished time (in 2019, last year).",
              examples: [
                {
                  wrong: "The population grew significantly since the factory opened.",
                  right: "The population has grown significantly since the factory opened.",
                  why: "since + Present Perfect",
                },
                {
                  wrong: "I have visited London in 2019.",
                  right: "I visited London in 2019.",
                  why: "finished year → Past Simple",
                },
              ],
            },
            {
              title: "Past Perfect",
              rule: "Action completed before another past action (by the time / before).",
              examples: [
                {
                  wrong: "By the time the report was published, the situation already changed.",
                  right: "By the time the report was published, the situation had already changed.",
                  why: "earlier past action needs had + past participle",
                },
              ],
            },
          ],
        },
      ],
      exercises: [
        {
          code: "2.1",
          title: "Tense Selection",
          instruction: "Choose the correct verb form.",
          instructionBn: "সঠিক verb form বেছে নিন।",
          items: [
            {
              q: 1,
              sentence: "Between 2000 and 2010, car ownership ______ steadily before it levelled off.",
              answer: "rose",
              explanation: "Finished past period → Past Simple.",
            },
            {
              q: 2,
              sentence: "The population of the city ______ significantly since the new factory opened.",
              answer: "has grown",
              explanation: "since → Present Perfect.",
            },
            {
              q: 3,
              sentence: "By the time the report was published, the situation ______ already changed.",
              answer: "had",
              explanation: "Past Perfect for earlier past action.",
            },
            {
              q: 4,
              sentence: "If current trends continue, sea levels ______ further over the next century.",
              answer: "will rise",
              explanation: "First conditional – real future.",
            },
            {
              q: 5,
              sentence: "I ______ in Dhaka for twelve years, and I still live there now.",
              answer: "have lived",
              explanation: "started in past + still true → Present Perfect.",
            },
          ],
        },
      ],
    },
  },

  // ─── Chapter 3 ───
  {
    id: "grammar-ch-3",
    title: "Articles (A, An, The) & Noun Types",
    titleBn: "Article (A, An, The) ও Noun-এর ধরন",
    position: 3,
    difficulty: 1,
    body: {
      intro:
        "Bangla has no articles. That single fact is the biggest source of Band-6 errors for Bangladeshi candidates.",
      introBn:
        "বাংলায় article নেই। এটিই বাংলাদেশি শিক্ষার্থীদের ব্যান্ড ৬-এ আটকে রাখার সবচেয়ে বড় কারণ।",
      sections: [
        {
          code: "3.1",
          title: "Zero article, a/an, the",
          content: {
            points: [
              {
                term: "Zero article",
                en: "General uncountable/plural: Education is essential. Poverty remains a problem.",
                bn: "সাধারণ abstract noun-এ article বসে না।",
              },
              {
                term: "a / an",
                en: "First mention of singular countable, or jobs: an engineer.",
                bn: "প্রথমবার উল্লেখ বা পেশার আগে a/an।",
              },
              {
                term: "the",
                en: "Unique things, second mention, superlatives: the internet, the most hard-working student.",
                bn: "নির্দিষ্ট বা unique জিনিসের আগে the।",
              },
            ],
          },
          cases: [
            {
              title: "Uncountable nouns",
              rule: "information, advice, research, equipment – never take a/an or plural -s.",
              examples: [
                {
                  wrong: "He gave me some useful advices.",
                  right: "He gave me some useful advice.",
                  why: "advice is uncountable",
                },
                {
                  wrong: "The researchers gathered many informations.",
                  right: "The researchers gathered a great deal of information.",
                  why: "information has no plural",
                },
              ],
            },
          ],
        },
      ],
      exercises: [
        {
          code: "3.1",
          title: "Article Insertion",
          instruction: "Fill in a / an / the / – (zero).",
          items: [
            {
              q: 1,
              sentence: "______ internet has transformed the way people communicate.",
              answer: "The",
              explanation: "the internet = unique system",
            },
            {
              q: 2,
              sentence: "She wants to become ______ engineer.",
              answer: "an",
              explanation: "vowel sound + job",
            },
            {
              q: 3,
              sentence: "______ education is essential for economic development.",
              answer: ["Education", "–", ""],
              explanation: "general uncountable → zero article",
            },
            {
              q: 4,
              sentence: "______ poverty remains a serious problem in many countries.",
              answer: ["–", ""],
              explanation: "abstract noun → zero article",
            },
            {
              q: 5,
              sentence: "We stayed at ______ hotel near the airport; ______ hotel was cheap.",
              answer: "a / the",
              explanation: "first mention a, second the",
            },
          ],
        },
      ],
    },
  },

  // ─── Chapter 4 ───
  {
    id: "grammar-ch-4",
    title: "Prepositions & Dependency Rules",
    titleBn: "Preposition ও নির্ভরশীল নিয়ম",
    position: 4,
    difficulty: 1,
    body: {
      intro:
        "Most preposition errors in IELTS come from direct translation from Bangla. This chapter lists the high-frequency fixed phrases and classic L1 traps.",
      introBn:
        "IELTS-এ বেশিরভাগ preposition ভুল বাংলা থেকে সরাসরি অনুবাদ করার কারণে হয়।",
      sections: [
        {
          code: "4.1",
          title: "Change & quantity prepositions (Task 1)",
          cases: [
            {
              title: "increase / rise / fall + by / from…to / of",
              rule: "increase by 15% (amount); rose from 20 to 35 (range); a peak of 90%.",
              examples: [
                {
                  wrong: "Sales increased with 15 per cent.",
                  right: "Sales increased by 15 per cent.",
                  why: "change of quantity uses by",
                },
                {
                  wrong: "The value rose of 20 million to 35 million.",
                  right: "The value rose from 20 million to 35 million.",
                  why: "from X to Y for range",
                },
              ],
            },
            {
              title: "Fixed dependent prepositions",
              rule: "depend on, lead to, responsible for, according to (never according to me).",
              examples: [
                {
                  wrong: "The success depends of adequate funding.",
                  right: "The success depends on adequate funding.",
                  why: "depend on",
                },
                {
                  wrong: "According to me, the government should invest more.",
                  right: "In my opinion, the government should invest more.",
                  why: "according to is for other sources only",
                },
              ],
            },
          ],
        },
      ],
      exercises: [
        {
          code: "4.1",
          title: "Preposition Fill-in",
          instruction: "Choose the correct preposition.",
          items: [
            {
              q: 1,
              sentence: "Sales increased ______ 15 per cent in the final quarter.",
              answer: "by",
            },
            {
              q: 2,
              sentence: "The success of the project depends largely ______ adequate funding.",
              answer: "on",
            },
            {
              q: 3,
              sentence: "Rapid industrialisation has led ______ a sharp rise in air pollution.",
              answer: "to",
            },
            {
              q: 4,
              sentence: "Governments should be responsible ______ protecting the environment.",
              answer: "for",
            },
            {
              q: 5,
              sentence: "Unemployment stood ______ six per cent ______ the start of the period.",
              answer: "at / at",
            },
          ],
        },
      ],
    },
  },

  // ─── Chapter 5 ───
  {
    id: "grammar-ch-5",
    title: "Complex Sentences & Subordinate Clauses",
    titleBn: "জটিল বাক্য ও অধীন ধারা",
    position: 5,
    difficulty: 2,
    body: {
      intro:
        "Module 1 made your sentences correct. Module 2 makes them varied. Band 7 demands a mix of simple and complex structures used with flexibility.",
      introBn:
        "মডিউল ১ বাক্য সঠিক করেছে। মডিউল ২ সেগুলোকে বৈচিত্র্যময় করে। ব্যান্ড ৭ চায় simple ও complex-এর মিশ্রণ।",
      sections: [
        {
          code: "5.1",
          title: "Dependent vs Independent clauses",
          content: {
            coreFact:
              "A dependent clause cannot stand alone. Starting with Because/Although/Which and stopping is a fragment – a Band-5 error.",
          },
          cases: [
            {
              title: "Comma after fronted dependent clause",
              rule: "When the dependent clause comes first, put a comma after it.",
              examples: [
                {
                  wrong: "Although it is expensive it works.",
                  right: "Although it is expensive, it works.",
                  why: "fronted dependent clause needs comma",
                },
              ],
            },
            {
              title: "Comma splice",
              rule: "Never join two independent clauses with only a comma.",
              examples: [
                {
                  wrong: "The report was clear, it recommended three changes.",
                  right: "The report was clear; it recommended three changes.",
                  why: "comma splice is an error",
                },
              ],
            },
          ],
        },
        {
          code: "5.2",
          title: "Relative clauses",
          cases: [
            {
              title: "Defining vs non-defining",
              rule: "Defining (no commas) uses that/which/who. Non-defining uses which/who + commas on both sides.",
              examples: [
                {
                  wrong: "My school that is very old is famous.",
                  right: "My school, which is very old, is famous.",
                  why: "non-defining needs which + commas",
                },
              ],
            },
          ],
        },
      ],
      exercises: [
        {
          code: "5.1",
          title: "Sentence Combining",
          instruction: "Combine into one correctly punctuated complex sentence.",
          items: [
            {
              q: 1,
              sentence: "The city is crowded. The rent is very high. (cause-effect)",
              answer: "The city is crowded, so the rent is very high.",
            },
            {
              q: 2,
              sentence: "Governments act quickly. Emissions can be reduced. (if)",
              answer: "If governments act quickly, emissions can be reduced.",
            },
          ],
        },
      ],
    },
  },

  // ─── Chapter 6 ───
  {
    id: "grammar-ch-6",
    title: "Passive Voice & Academic Detachment",
    titleBn: "Passive Voice ও একাডেমিক দূরত্ব",
    position: 6,
    difficulty: 2,
    body: {
      intro:
        "Passive voice is essential for Task 1 process diagrams and for academic style in Task 2 when the doer is unknown or unimportant.",
      introBn:
        "Passive Voice Task 1 process diagram এবং Task 2-এর academic tone-এর জন্য অপরিহার্য।",
      sections: [
        {
          code: "6.1",
          title: "Form and use",
          content: {
            key: "be + past participle. The subject receives the action. New traffic laws were introduced in 2019.",
          },
          cases: [
            {
              title: "When to prefer passive",
              rule: "Process descriptions, scientific results, and when the agent is obvious or irrelevant.",
              examples: [
                {
                  wrong: "They introduced new traffic laws in 2019.",
                  right: "New traffic laws were introduced in 2019.",
                  why: "focus on the laws, not the unknown ‘they’",
                },
              ],
            },
          ],
        },
      ],
      exercises: [
        {
          code: "6.1",
          title: "Active → Passive",
          instruction: "Rewrite in the passive.",
          items: [
            {
              q: 1,
              sentence: "Scientists discovered a new vaccine last year.",
              answer: "A new vaccine was discovered last year.",
            },
            {
              q: 2,
              sentence: "The government will introduce three new policies next year.",
              answer: "Three new policies will be introduced next year.",
            },
          ],
        },
      ],
    },
  },

  // ─── Chapter 7 ───
  {
    id: "grammar-ch-7",
    title: "Conditionals, Hedging & Hypothetical Reasoning",
    titleBn: "Conditional, Hedging ও অনুমানমূলক যুক্তি",
    position: 7,
    difficulty: 2,
    body: {
      intro:
        "Conditionals give you the language of prediction, recommendation and speculation – exactly what Speaking Part 3 and Task 2 demand.",
      introBn:
        "Conditional দিয়ে ভবিষ্যৎ পূর্বাভাস, পরামর্শ ও অনুমান প্রকাশ করা যায় – Speaking Part 3 ও Task 2-এর জন্য জরুরি।",
      sections: [
        {
          code: "7.1",
          title: "The main conditionals",
          cases: [
            {
              title: "First conditional (real future)",
              rule: "If + present, will + base.",
              examples: [
                {
                  wrong: "If this trend will continue, the city will become overcrowded.",
                  right: "If this trend continues, the city will become overcrowded.",
                  why: "if-clause takes present, not will",
                },
              ],
            },
            {
              title: "Second conditional (hypothetical)",
              rule: "If + past, would + base.",
              examples: [
                {
                  wrong: "If governments would invest more, emissions would fall.",
                  right: "If governments invested more, emissions would fall.",
                  why: "if-clause never takes would",
                },
              ],
            },
          ],
        },
      ],
      exercises: [
        {
          code: "7.1",
          title: "Conditional Rewrite",
          instruction: "Complete with the correct form.",
          items: [
            {
              q: 1,
              sentence: "If governments ______ more in solar energy, emissions would fall.",
              answer: "invested",
            },
            {
              q: 2,
              sentence: "If this trend ______, the city will become overcrowded.",
              answer: "continues",
            },
          ],
        },
      ],
    },
  },

  // ─── Chapter 8 ───
  {
    id: "grammar-ch-8",
    title: "Inversion, Cleft Sentences & Advanced Emphasis",
    titleBn: "Inversion, Cleft Sentence ও উন্নত জোর",
    position: 8,
    difficulty: 3,
    body: {
      intro:
        "These rare structures appear naturally in Band 8.5–9 writing. Use them for genuine emphasis, never for show.",
      introBn:
        "এই বিরল গঠনগুলো ব্যান্ড ৮.৫–৯-এ স্বাভাবিকভাবে আসে। শুধু জোর দেওয়ার জন্য ব্যবহার করুন।",
      sections: [
        {
          code: "8.1",
          title: "Negative inversion",
          cases: [
            {
              title: "Not only … but also",
              rule: "After fronted Not only the auxiliary inverts.",
              examples: [
                {
                  wrong: "Not only the internet has changed communication, but also it changed work.",
                  right: "Not only has the internet changed communication, but it has also changed work.",
                  why: "auxiliary before subject after Not only",
                },
              ],
            },
          ],
        },
        {
          code: "8.2",
          title: "Cleft sentences",
          content: {
            key: "What is needed is stronger regulation. It is the lack of funding that causes the delay.",
          },
        },
      ],
      exercises: [
        {
          code: "8.1",
          title: "Inversion & Cleft Practice",
          items: [
            {
              q: 1,
              sentence: "Rewrite with inversion: The internet has not only changed communication, it has also changed work.",
              answer: "Not only has the internet changed communication, but it has also changed work.",
            },
            {
              q: 2,
              sentence: "Make a what-cleft: Stronger regulation of the industry is needed.",
              answer: "What is needed is stronger regulation of the industry.",
            },
          ],
        },
      ],
    },
  },

  // ─── Chapter 9 ───
  {
    id: "grammar-ch-9",
    title: "Nominalisation & Academic Density",
    titleBn: "Nominalisation ও একাডেমিক ঘনত্ব",
    position: 9,
    difficulty: 3,
    body: {
      intro:
        "Nominalisation turns verbs and adjectives into nouns. It raises lexical density and is a hallmark of Band 8–9 academic writing.",
      introBn:
        "Nominalisation verb ও adjective-কে noun-এ রূপান্তর করে। এটি ব্যান্ড ৮–৯-এর academic writing-এর বৈশিষ্ট্য।",
      sections: [
        {
          code: "9.1",
          title: "How to nominalise",
          cases: [
            {
              title: "Verb → Noun",
              rule: "increase → the increase; pollute → pollution; decide → decision.",
              examples: [
                {
                  wrong: "The population increased rapidly, which surprised analysts.",
                  right: "The rapid increase in the population surprised analysts.",
                  why: "verb became the noun subject",
                },
              ],
            },
          ],
        },
      ],
      exercises: [
        {
          code: "9.1",
          title: "Nominalise the sentences",
          items: [
            {
              q: 1,
              sentence: "The government decided to raise taxes. This caused public anger.",
              answer: "The government’s decision to raise taxes caused public anger.",
            },
            {
              q: 2,
              sentence: "The population increased rapidly, which surprised analysts.",
              answer: "The rapid increase in the population surprised analysts.",
            },
          ],
        },
      ],
    },
  },

  // ─── Chapter 10 ───
  {
    id: "grammar-ch-10",
    title: "Full Essay Editing & Speaking Transcript Polish",
    titleBn: "পূর্ণ Essay সম্পাদনা ও Speaking Transcript পরিমার্জন",
    position: 10,
    difficulty: 2,
    body: {
      intro:
        "This chapter trains the exact skill you need on exam day: finding and fixing every accuracy error under time pressure. Do every drill with a pen first.",
      introBn:
        "পরীক্ষার দিনে সময়ের চাপে ভুল খুঁজে বের করে ঠিক করার দক্ষতা তৈরি করে এই অধ্যায়।",
      sections: [
        {
          code: "10.1",
          title: "The 60-second proofreading routine",
          content: {
            points: [
              {
                term: "Step 1",
                en: "Scan every verb for subject-verb agreement and tense.",
              },
              {
                term: "Step 2",
                en: "Check every singular countable noun for an article.",
              },
              {
                term: "Step 3",
                en: "Look at every comma – is it a splice or a missing comma after a fronted clause?",
              },
              {
                term: "Step 4",
                en: "Read the last word of each sentence – does the sentence actually finish?",
              },
            ],
          },
        },
      ],
      exercises: [
        {
          code: "10.1",
          title: "Essay Editing Drill 1",
          instruction: "Correct all grammar errors in the paragraph.",
          instructionBn: "অনুচ্ছেদের সব grammar ভুল ঠিক করুন।",
          paragraph:
            "Nowadays many people is using internet, it cause many problem in society and student cannot focus their study. The government should take step to reduce this. Although the internet has become central to modern life its overuse can undermine concentration.",
          items: [],
        },
        {
          code: "10.2",
          title: "Speaking Transcript Polish",
          instruction: "Rewrite so it would score Band 7+ on GRA.",
          paragraph:
            "Well, I think government need to do more for education because many student in village don’t have good teacher and the school is not enough facility. If they invest more money the situation will improve I guess.",
          items: [],
        },
      ],
    },
  },
];

// ============================================================
// COMPONENT
// ============================================================

export const LmsView: React.FC<LmsViewProps> = ({
  initialTab = "grammar",
  id,
}) => {
  const [activeTab, setActiveTab] = useState<"grammar" | "vocab" | "tips">(
    initialTab.includes("vocab")
      ? "vocab"
      : initialTab.includes("tips")
      ? "tips"
      : "grammar"
  );

  const [grammarLessons, setGrammarLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [openSections, setOpenSections] = useState<string[]>([]);
  const [openCases, setOpenCases] = useState<string[]>([]);
  const [openExercises, setOpenExercises] = useState<string[]>([]);

  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [submittedExercises, setSubmittedExercises] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveTab(
      initialTab.includes("vocab")
        ? "vocab"
        : initialTab.includes("tips")
        ? "tips"
        : "grammar"
    );
  }, [initialTab]);

  // ─── LOAD LESSONS (API + STATIC FALLBACK) ───
  useEffect(() => {
    if (activeTab !== "grammar") return;

    setLoading(true);

    fetch("/api/lessons?section=grammar")
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // API success → use API data (sorted by position)
          const sorted = [...data].sort(
            (a: Lesson, b: Lesson) => a.position - b.position
          );
          setGrammarLessons(sorted);
        } else {
          // empty API → fallback
          setGrammarLessons(STATIC_GRAMMAR_LESSONS);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("API failed, using static chapters 1–10:", err);
        setGrammarLessons(STATIC_GRAMMAR_LESSONS);
        setLoading(false);
      });
  }, [activeTab]);

  const getLevel = (difficulty: number | null) => {
    if (!difficulty || difficulty <= 1) return "Band 6.0+";
    if (difficulty === 2) return "Band 7.0+";
    return "Band 8.0+";
  };

  const toggleSection = (sid: string) => {
    setOpenSections((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  };

  const toggleCase = (cid: string) => {
    setOpenCases((prev) =>
      prev.includes(cid) ? prev.filter((x) => x !== cid) : [...prev, cid]
    );
  };

  const toggleExercise = (eid: string) => {
    setOpenExercises((prev) =>
      prev.includes(eid) ? prev.filter((x) => x !== eid) : [...prev, eid]
    );
  };

  const handleAnswerChange = (
    exerciseId: string,
    questionId: string,
    value: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {}),
        [questionId]: value,
      },
    }));
    setSubmittedQuestions((prev) => {
      const copy = { ...prev };
      delete copy[`${exerciseId}-${questionId}`];
      return copy;
    });
  };

  const normalizeAnswer = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[.!?,;:]+$/g, "");

  const checkAnswer = (
    exerciseId: string,
    questionId: string,
    item: any
  ) => {
    const studentAnswer = answers[exerciseId]?.[questionId] || "";
    let correctAnswer =
      item.answer ??
      item.correctAnswer ??
      item.correct ??
      item.expectedAnswer ??
      "";

    if (Array.isArray(correctAnswer)) {
      const normalizedStudent = normalizeAnswer(studentAnswer);
      return correctAnswer.some(
        (a: string) => normalizeAnswer(a) === normalizedStudent
      );
    }
    if (!correctAnswer) return false;
    return (
      normalizeAnswer(studentAnswer) ===
      normalizeAnswer(String(correctAnswer))
    );
  };

  const submitQuestion = (exerciseId: string, questionId: string) => {
    setSubmittedQuestions((prev) => ({
      ...prev,
      [`${exerciseId}-${questionId}`]: true,
    }));
  };

  const getExerciseScore = (exercise: any, exerciseId: string) => {
    if (!Array.isArray(exercise.items)) {
      return { correct: 0, total: 0, percentage: 0 };
    }
    let correct = 0;
    exercise.items.forEach((item: any, index: number) => {
      const questionId = String(item.q ?? index);
      const submitted = submittedQuestions[`${exerciseId}-${questionId}`];
      if (!submitted) return;
      if (checkAnswer(exerciseId, questionId, item)) correct++;
    });
    const total = exercise.items.length;
    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  };

  const submitExercise = (exercise: any, exerciseId: string) => {
    if (Array.isArray(exercise.items)) {
      const newSubmitted: Record<string, boolean> = {};
      exercise.items.forEach((item: any, index: number) => {
        const questionId = String(item.q ?? index);
        newSubmitted[`${exerciseId}-${questionId}`] = true;
      });
      setSubmittedQuestions((prev) => ({ ...prev, ...newSubmitted }));
    }
    setSubmittedExercises((prev) => ({ ...prev, [exerciseId]: true }));
  };

  const resetExercise = (exercise: any, exerciseId: string) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[exerciseId];
      return copy;
    });
    setSubmittedQuestions((prev) => {
      const copy = { ...prev };
      if (Array.isArray(exercise.items)) {
        exercise.items.forEach((item: any, index: number) => {
          const questionId = String(item.q ?? index);
          delete copy[`${exerciseId}-${questionId}`];
        });
      }
      return copy;
    });
    setSubmittedExercises((prev) => {
      const copy = { ...prev };
      delete copy[exerciseId];
      return copy;
    });
  };

  // ─── STATIC VOCAB & TIPS (unchanged) ───
  const vocabCategories = [
    {
      category: "Topic: Environment & Sustainability",
      bandScore: "Band 8.0 Level",
      words: [
        {
          word: "Mitigate",
          POS: "verb",
          def: "Make less severe or serious.",
          collocation: "mitigate climate risks",
        },
        {
          word: "Precipitous",
          POS: "adj",
          def: "Dangerously high or steep / sudden.",
          collocation: "precipitous decline in biodiversity",
        },
        {
          word: "Detrimental",
          POS: "adj",
          def: "Tending to cause harm.",
          collocation: "detrimental impacts on ecosystem",
        },
      ],
    },
    {
      category: "Topic: Education & Technology",
      bandScore: "Band 8.0 Level",
      words: [
        {
          word: "Ubiquitous",
          POS: "adj",
          def: "Present, appearing, or found everywhere.",
          collocation: "ubiquitous smartphone adoption",
        },
        {
          word: "Impediment",
          POS: "noun",
          def: "A hindrance or obstruction in doing something.",
          collocation: "major impediment to learning",
        },
        {
          word: "Foster",
          POS: "verb",
          def: "Encourage or promote the development of.",
          collocation: "foster critical thinking skills",
        },
      ],
    },
  ];

  const tipsList = [
    {
      title: "Task 2 Coherence Secret: The 1-Idea Paragraph Rule",
      author: "Former Senior IELTS Examiner",
      rule: "Each body paragraph MUST contain only ONE central topic sentence supported by 2 specific evidence points.",
      checklist: [
        "Clear Topic Sentence",
        "Explanation (Why / How)",
        "Concrete Example",
        "Concluding Link Sentence",
      ],
    },
    {
      title: "Speaking Part 2: The PPF Structure (Past, Present, Future)",
      author: "IELTS Band 9 Specialist",
      rule: "If you run out of ideas during the 2-minute card response, shift time frames smoothly to extend talk time.",
      checklist: [
        "Describe the core event",
        "Compare it to past experiences",
        "Project future developments",
      ],
    },
  ];

  // ─── RENDER ───
  return (
    <div id={id} className="space-y-6">
      {/* HEADER */}
      <GlassPanel className="p-6 md:p-8 relative overflow-hidden border border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--accent-a)] tracking-wider mb-2">
              <GraduationCap size={18} />
              <span>LMS • Learning Management System</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">
              IELTS Masterclass Modules
            </h1>
            <p className="text-sm text-[var(--text-dim)] mt-1 max-w-2xl">
              Curated grammar rules, Band 8.0+ vocabulary banks, and
              examiner-verified tips designed specifically to elevate your band
              scores.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[var(--panel-2)] p-1.5 rounded-xl border border-[var(--border)] self-start md:self-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab("grammar");
                setSelectedLesson(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "grammar"
                  ? "bg-[image:var(--accent-gradient)] text-white shadow-md font-semibold"
                  : "text-[var(--text-dim)] hover:text-[var(--text)]"
              }`}
            >
              Grammar
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("vocab");
                setSelectedLesson(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "vocab"
                  ? "bg-[image:var(--accent-gradient)] text-white shadow-md font-semibold"
                  : "text-[var(--text-dim)] hover:text-[var(--text)]"
              }`}
            >
              Vocabulary
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("tips");
                setSelectedLesson(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "tips"
                  ? "bg-[image:var(--accent-gradient)] text-white shadow-md font-semibold"
                  : "text-[var(--text-dim)] hover:text-[var(--text)]"
              }`}
            >
              Tips & Tricks
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* GRAMMAR */}
      {activeTab === "grammar" && (
        <>
          {selectedLesson ? (
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => {
                  setSelectedLesson(null);
                  setOpenSections([]);
                  setOpenCases([]);
                  setOpenExercises([]);
                  setAnswers({});
                  setSubmittedQuestions({});
                  setSubmittedExercises({});
                }}
                className="text-sm text-[var(--accent-a)] hover:underline cursor-pointer"
              >
                ← Back to lessons
              </button>

              <GlassPanel className="p-6 md:p-8 border border-[var(--border)] space-y-6">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                    {getLevel(selectedLesson.difficulty)}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-3">
                    {selectedLesson.title}
                  </h2>
                  {selectedLesson.titleBn && (
                    <p className="text-sm text-[var(--text-dim)] mt-1">
                      {selectedLesson.titleBn}
                    </p>
                  )}
                  <p className="text-xs text-[var(--text-faint)] font-mono mt-2">
                    Chapter {selectedLesson.position}
                  </p>
                </div>

                {selectedLesson.body?.intro && (
                  <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--border)]">
                    <p className="text-sm text-[var(--text)] leading-relaxed">
                      {selectedLesson.body.intro}
                    </p>
                    {selectedLesson.body.introBn && (
                      <p className="text-xs text-[var(--text-dim)] mt-3 italic">
                        {selectedLesson.body.introBn}
                      </p>
                    )}
                  </div>
                )}

                {Array.isArray(selectedLesson.body?.sections) &&
                  selectedLesson.body.sections.map(
                    (section: any, idx: number) => {
                      const sectionId = `${selectedLesson.id}-section-${idx}`;
                      const isOpen = openSections.includes(sectionId);

                      return (
                        <div
                          key={sectionId}
                          className="rounded-xl border border-[var(--border)] overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => toggleSection(sectionId)}
                            className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--panel-2)] transition-colors cursor-pointer"
                          >
                            <div>
                              <h3 className="font-display text-lg font-bold text-[var(--text)]">
                                {section.code && (
                                  <span className="text-[var(--accent-a)] mr-2">
                                    {section.code}
                                  </span>
                                )}
                                {section.title}
                              </h3>
                              {section.titleBn && (
                                <p className="text-xs text-[var(--text-dim)] mt-1">
                                  {section.titleBn}
                                </p>
                              )}
                            </div>
                            <ChevronRight
                              size={18}
                              className={`transition-transform ${
                                isOpen ? "rotate-90" : ""
                              }`}
                            />
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5 space-y-4">
                            <AppendixSectionContent content={section.content} />
                              {Array.isArray(section.content?.points) &&
                                section.content.points.map(
                                  (point: any, i: number) => (
                                    <div
                                      key={i}
                                      className="p-4 rounded-lg bg-[var(--panel-2)]/60 border border-[var(--border)]"
                                    >
                                      {point.term && (
                                        <div className="font-semibold text-sm text-[var(--accent-a)]">
                                          {point.term}
                                        </div>
                                      )}
                                      {point.en && (
                                        <p className="text-xs text-[var(--text)] mt-1 leading-relaxed">
                                          {point.en}
                                        </p>
                                      )}
                                      {point.bn && (
                                        <p className="text-[11px] text-[var(--text-dim)] mt-2 italic leading-relaxed">
                                          {point.bn}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}

                              {Array.isArray(section.cases) &&
                                section.cases.map((item: any, i: number) => {
                                  const caseId = `${sectionId}-case-${i}`;
                                  const caseOpen = openCases.includes(caseId);

                                  return (
                                    <div
                                      key={caseId}
                                      className="rounded-lg border border-[var(--border)] overflow-hidden"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => toggleCase(caseId)}
                                        className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--panel-2)] transition-colors cursor-pointer"
                                      >
                                        <div>
                                          <div className="font-semibold text-sm text-[var(--text)]">
                                            {item.title}
                                          </div>
                                          {item.rule && (
                                            <p className="text-xs text-[var(--text-dim)] mt-1">
                                              {item.rule}
                                            </p>
                                          )}
                                        </div>
                                        <ChevronRight
                                          size={16}
                                          className={`transition-transform ${
                                            caseOpen ? "rotate-90" : ""
                                          }`}
                                        />
                                      </button>

                                      {caseOpen && (
                                        <div className="p-4 pt-0 space-y-3">
                                          {Array.isArray(item.examples) &&
                                            item.examples.map(
                                              (example: any, j: number) => (
                                                <div
                                                  key={j}
                                                  className="text-xs space-y-1 pl-3 border-l-2 border-[var(--accent-a)]/40"
                                                >
                                                  {example.wrong && (
                                                    <p className="text-rose-400">
                                                      ✗ {example.wrong}
                                                    </p>
                                                  )}
                                                  {example.right && (
                                                    <p className="text-emerald-400">
                                                      ✓ {example.right}
                                                    </p>
                                                  )}
                                                  {example.why && (
                                                    <p className="text-[var(--text-faint)]">
                                                      {example.why}
                                                    </p>
                                                  )}
                                                </div>
                                              )
                                            )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}

                              {section.content?.coreFact && (
                                <div className="p-4 rounded-lg bg-[var(--panel-2)] border border-[var(--border)]">
                                  <p className="text-sm text-[var(--text)] leading-relaxed">
                                    {section.content.coreFact}
                                  </p>
                                </div>
                              )}

                              {section.content?.key && (
                                <div className="p-4 rounded-lg bg-[var(--panel-2)] border border-[var(--border)]">
                                  <p className="text-sm text-[var(--text)] leading-relaxed">
                                    {section.content.key}
                                  </p>
                                </div>
                              )}

                              {section.content?.bn && (
                                <div className="p-4 rounded-lg bg-[var(--panel-2)] border border-[var(--border)]">
                                  <p className="text-xs text-[var(--text-dim)] italic leading-relaxed">
                                    {section.content.bn}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}

                {/* EXERCISES */}
                {Array.isArray(selectedLesson.body?.exercises) &&
                  selectedLesson.body.exercises.map(
                    (exercise: any, idx: number) => {
                      const exerciseId = `${selectedLesson.id}-exercise-${idx}`;
                      const exerciseOpen = openExercises.includes(exerciseId);
                      const isSubmitted = submittedExercises[exerciseId];
                      const score = getExerciseScore(exercise, exerciseId);

                      return (
                        <div
                          key={exerciseId}
                          className="rounded-xl border border-[var(--border)] overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => toggleExercise(exerciseId)}
                            className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--panel-2)] transition-colors cursor-pointer"
                          >
                            <div>
                              <h3 className="font-display text-lg font-bold text-[var(--text)]">
                                Exercise {exercise.code}: {exercise.title}
                              </h3>
                              {exercise.instruction && (
                                <p className="text-xs text-[var(--text-dim)] mt-1">
                                  {exercise.instruction}
                                </p>
                              )}
                            </div>
                            <ChevronRight
                              size={18}
                              className={`transition-transform ${
                                exerciseOpen ? "rotate-90" : ""
                              }`}
                            />
                          </button>

                          {exerciseOpen && (
                            <div className="p-5 pt-0 space-y-5">
                              {exercise.instructionBn && (
                                <p className="text-[11px] text-[var(--text-faint)] italic">
                                  {exercise.instructionBn}
                                </p>
                              )}

                              {Array.isArray(exercise.items) &&
                                exercise.items.map(
                                  (item: any, itemIndex: number) => {
                                    const questionId = String(
                                      item.q ?? itemIndex
                                    );
                                    const questionKey = `${exerciseId}-${questionId}`;
                                    const submitted =
                                      submittedQuestions[questionKey];
                                    const studentAnswer =
                                      answers[exerciseId]?.[questionId] || "";
                                    const correct = submitted
                                      ? checkAnswer(
                                          exerciseId,
                                          questionId,
                                          item
                                        )
                                      : false;

                                    return (
                                      <div
                                        key={questionKey}
                                        className={`p-4 rounded-xl border ${
                                          submitted
                                            ? correct
                                              ? "border-emerald-500/40 bg-emerald-500/5"
                                              : "border-rose-500/40 bg-rose-500/5"
                                            : "border-[var(--border)] bg-[var(--panel-2)]/50"
                                        }`}
                                      >
                                        <div className="text-sm text-[var(--text)] leading-relaxed mb-3">
                                          {item.q && (
                                            <span className="font-mono text-[var(--accent-a)] mr-2">
                                              {item.q}.
                                            </span>
                                          )}
                                          {item.sentence && (
                                            <span>{item.sentence}</span>
                                          )}
                                          {item.question && (
                                            <span>{item.question}</span>
                                          )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2">
                                          <input
                                            type="text"
                                            value={studentAnswer}
                                            onChange={(e) =>
                                              handleAnswerChange(
                                                exerciseId,
                                                questionId,
                                                e.target.value
                                              )
                                            }
                                            placeholder="Type your answer..."
                                            className="flex-1 px-3 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] outline-none focus:border-[var(--accent-a)] transition-colors"
                                          />
                                          <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() =>
                                              submitQuestion(
                                                exerciseId,
                                                questionId
                                              )
                                            }
                                          >
                                            Check
                                          </Button>
                                        </div>

                                        {submitted && (
                                          <div className="mt-3">
                                            {correct ? (
                                              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                <p className="text-sm font-semibold text-emerald-400">
                                                  ✓ Correct!
                                                </p>
                                                {item.explanation && (
                                                  <p className="text-xs text-[var(--text-dim)] mt-1">
                                                    {item.explanation}
                                                  </p>
                                                )}
                                              </div>
                                            ) : (
                                              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                                <p className="text-sm font-semibold text-rose-400">
                                                  ✗ Incorrect
                                                </p>
                                                {(item.answer ??
                                                  item.correctAnswer ??
                                                  item.correct) && (
                                                  <p className="text-xs text-[var(--text-dim)] mt-1">
                                                    Correct answer:{" "}
                                                    <span className="font-semibold text-[var(--text)]">
                                                      {Array.isArray(
                                                        item.answer ??
                                                          item.correctAnswer ??
                                                          item.correct
                                                      )
                                                        ? (
                                                            item.answer ??
                                                            item.correctAnswer ??
                                                            item.correct
                                                          ).join(" / ")
                                                        : String(
                                                            item.answer ??
                                                              item.correctAnswer ??
                                                              item.correct
                                                          )}
                                                    </span>
                                                  </p>
                                                )}
                                                {item.explanation && (
                                                  <p className="text-xs text-[var(--text-dim)] mt-2">
                                                    {item.explanation}
                                                  </p>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                )}

                              {exercise.paragraph && (
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-xs font-mono uppercase text-[var(--text-faint)] mb-2">
                                      Paragraph
                                    </p>
                                    <div className="p-4 rounded-lg bg-[var(--panel-2)] border border-[var(--border)] text-sm text-[var(--text)] leading-relaxed">
                                      {exercise.paragraph}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-mono uppercase text-[var(--text-faint)] mb-2">
                                      Your corrected paragraph
                                    </p>
                                    <textarea
                                      value={
                                        answers[exerciseId]?.paragraph || ""
                                      }
                                      onChange={(e) =>
                                        handleAnswerChange(
                                          exerciseId,
                                          "paragraph",
                                          e.target.value
                                        )
                                      }
                                      rows={10}
                                      placeholder="Rewrite the paragraph correctly here..."
                                      className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] outline-none focus:border-[var(--accent-a)] transition-colors resize-y"
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
                                <div>
                                  {isSubmitted &&
                                    Array.isArray(exercise.items) && (
                                      <div className="text-sm">
                                        <span className="text-[var(--text-dim)]">
                                          Score:{" "}
                                        </span>
                                        <span
                                          className={`font-bold ${
                                            score.percentage >= 80
                                              ? "text-emerald-400"
                                              : score.percentage >= 50
                                              ? "text-yellow-400"
                                              : "text-rose-400"
                                          }`}
                                        >
                                          {score.correct} / {score.total}
                                        </span>
                                        <span className="text-[var(--text-faint)] ml-2">
                                          ({score.percentage}%)
                                        </span>
                                      </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                  {isSubmitted && (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() =>
                                        resetExercise(exercise, exerciseId)
                                      }
                                    >
                                      Try Again
                                    </Button>
                                  )}
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                      submitExercise(exercise, exerciseId)
                                    }
                                  >
                                    <span className="flex items-center gap-2">
                                      <Check size={15} />
                                      Submit Exercise
                                    </span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
              </GlassPanel>
            </div>
          ) : (
            /* LESSON CARDS */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-3 text-center text-[var(--text-dim)] py-10">
                  Loading lessons...
                </div>
              ) : grammarLessons.length === 0 ? (
                <div className="col-span-3 text-center text-[var(--text-dim)] py-10">
                  No grammar lessons found.
                </div>
              ) : (
                grammarLessons.map((lesson) => (
                  <GlassPanel
                    key={lesson.id}
                    className="p-6 flex flex-col justify-between border border-[var(--border)] hover:border-[var(--accent-a)]/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                          {getLevel(lesson.difficulty)}
                        </span>
                        <span className="text-xs text-[var(--text-faint)] font-mono">
                          Chapter {lesson.position}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-[var(--text)] mb-1">
                        {lesson.title}
                      </h3>
                      {lesson.titleBn && (
                        <p className="text-xs text-[var(--text-dim)] mb-3">
                          {lesson.titleBn}
                        </p>
                      )}
                      <p className="text-xs text-[var(--text-dim)] mb-4 line-clamp-3">
                        {lesson.body?.intro || "No description available."}
                      </p>
                      {lesson.body?.introBn && (
                        <p className="text-[11px] text-[var(--text-faint)] mb-4 italic line-clamp-2">
                          {lesson.body.introBn}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full flex items-center justify-center gap-1.5"
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setOpenSections([]);
                        setOpenCases([]);
                        setOpenExercises([]);
                        setAnswers({});
                        setSubmittedQuestions({});
                        setSubmittedExercises({});
                      }}
                    >
                      <span>Start Grammar Exercise</span>
                      <ChevronRight size={16} />
                    </Button>
                  </GlassPanel>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* VOCABULARY */}
      {activeTab === "vocab" && (
        <div className="space-y-6">
          {vocabCategories.map((category, categoryIndex) => (
            <GlassPanel
              key={categoryIndex}
              className="p-6 border border-[var(--border)]"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                <h3 className="font-display text-lg font-bold text-[var(--text)] flex items-center gap-2">
                  <BookOpen size={18} className="text-[var(--accent-a)]" />
                  <span>{category.category}</span>
                </h3>
                <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                  {category.bandScore}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {category.words.map((word, wordIndex) => (
                  <div
                    key={wordIndex}
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
                    <p className="text-xs text-[var(--text-dim)]">{word.def}</p>
                    <div className="pt-2 border-t border-[var(--border)]/60 text-[11px] font-mono text-[var(--accent-a)]">
                      Collocation: "{word.collocation}"
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* TIPS */}
      {activeTab === "tips" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tipsList.map((tip, tipIndex) => (
            <GlassPanel
              key={tipIndex}
              className="p-6 border border-[var(--border)] space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[var(--accent-a)] font-semibold flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>{tip.author}</span>
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--text)]">
                {tip.title}
              </h3>
              <div className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] text-xs text-[var(--text)] leading-relaxed">
                <span className="font-bold text-[var(--accent-a)]">
                  Core Principle:{" "}
                </span>
                {tip.rule}
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-[var(--text-faint)]">
                  Checklist Before Submission:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tip.checklist.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-2 text-xs text-[var(--text-dim)] p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)]"
                    >
                      <Check
                        size={14}
                        className="text-[var(--success)] shrink-0"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
};