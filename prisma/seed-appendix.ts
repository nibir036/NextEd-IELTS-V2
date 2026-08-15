import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================================
// APPENDIX A · High-Frequency Irregular Verbs
// ============================================================

async function seedAppendixA() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Appendix A · High-Frequency Irregular Verbs",
      titleBn: "পরিশিষ্ট ক · উচ্চ-প্রয়োজনীয় Irregular Verb তালিকা",
      position: 12,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Back Matter & Toolkit",
        intro:
          "Regular verbs simply add -ed for the past and the past participle (work, worked, worked). Irregular verbs do not follow that rule, and there is no shortcut: you memorise them as fixed items, the way you learned vocabulary. The list below covers the verbs that appear most often in IELTS Speaking stories, Task 1 descriptions, and Task 2 essays. The past participle is the form you need for the present perfect (has risen) and the passive (was written), so it is the one Bangladeshi candidates most often get wrong.",
        introBn:
          "পরিশিষ্ট ক-এর মূল কথা: regular verb-এ past ও past participle-এ শুধু -ed যোগ হয়; irregular verb-এর কোনো নিয়ম নেই, মুখস্থ করতে হয়। তৃতীয় রূপ (past participle) present perfect (has risen) ও passive (was written)-এ লাগে, এবং এটিই সবচেয়ে বেশি ভুল হয়।",

        sections: [
          {
            code: "A.1",
            title: "The irregular verb list (base · past simple · past participle)",
            titleBn: "irregular verb তালিকা (base · past simple · past participle)",
            content: {
              coreFact:
                "Learn these as fixed three-part items. Read each row aloud until the third form comes automatically.",
              bn: "প্রতিটি row জোরে পড়ুন যতক্ষণ না তৃতীয় রূপ আপনাআপনি চলে আসে।",
              verbs: [
                { base: "be", past: "was / were", pp: "been" },
                { base: "become", past: "became", pp: "become" },
                { base: "begin", past: "began", pp: "begun" },
                { base: "bend", past: "bent", pp: "bent" },
                { base: "bet", past: "bet", pp: "bet" },
                { base: "bind", past: "bound", pp: "bound" },
                { base: "bite", past: "bit", pp: "bitten" },
                { base: "bleed", past: "bled", pp: "bled" },
                { base: "blow", past: "blew", pp: "blown" },
                { base: "break", past: "broke", pp: "broken" },
                { base: "bring", past: "brought", pp: "brought" },
                { base: "build", past: "built", pp: "built" },
                { base: "burn", past: "burnt / burned", pp: "burnt / burned" },
                { base: "buy", past: "bought", pp: "bought" },
                { base: "catch", past: "caught", pp: "caught" },
                { base: "choose", past: "chose", pp: "chosen" },
                { base: "come", past: "came", pp: "come" },
                { base: "cost", past: "cost", pp: "cost" },
                { base: "cut", past: "cut", pp: "cut" },
                { base: "deal", past: "dealt", pp: "dealt" },
                { base: "dig", past: "dug", pp: "dug" },
                { base: "do", past: "did", pp: "done" },
                { base: "draw", past: "drew", pp: "drawn" },
                { base: "dream", past: "dreamt / dreamed", pp: "dreamt / dreamed" },
                { base: "drink", past: "drank", pp: "drunk" },
                { base: "drive", past: "drove", pp: "driven" },
                { base: "eat", past: "ate", pp: "eaten" },
                { base: "fall", past: "fell", pp: "fallen" },
                { base: "feed", past: "fed", pp: "fed" },
                { base: "feel", past: "felt", pp: "felt" },
                { base: "fight", past: "fought", pp: "fought" },
                { base: "find", past: "found", pp: "found" },
                { base: "flee", past: "fled", pp: "fled" },
                { base: "fly", past: "flew", pp: "flown" },
                { base: "forbid", past: "forbade", pp: "forbidden" },
                { base: "forget", past: "forgot", pp: "forgotten" },
                { base: "forgive", past: "forgave", pp: "forgiven" },
                { base: "freeze", past: "froze", pp: "frozen" },
                { base: "get", past: "got", pp: "got / gotten" },
                { base: "give", past: "gave", pp: "given" },
                { base: "go", past: "went", pp: "gone" },
                { base: "grow", past: "grew", pp: "grown" },
                { base: "hang", past: "hung", pp: "hung" },
                { base: "have", past: "had", pp: "had" },
                { base: "hear", past: "heard", pp: "heard" },
                { base: "hide", past: "hid", pp: "hidden" },
                { base: "hit", past: "hit", pp: "hit" },
                { base: "hold", past: "held", pp: "held" },
                { base: "hurt", past: "hurt", pp: "hurt" },
                { base: "keep", past: "kept", pp: "kept" },
                { base: "know", past: "knew", pp: "known" },
                { base: "lay (put)", past: "laid", pp: "laid" },
                { base: "lead", past: "led", pp: "led" },
                { base: "learn", past: "learnt / learned", pp: "learnt / learned" },
                { base: "leave", past: "left", pp: "left" },
                { base: "lend", past: "lent", pp: "lent" },
                { base: "let", past: "let", pp: "let" },
                { base: "lie (recline)", past: "lay", pp: "lain" },
                { base: "light", past: "lit", pp: "lit" },
                { base: "lose", past: "lost", pp: "lost" },
                { base: "make", past: "made", pp: "made" },
                { base: "mean", past: "meant", pp: "meant" },
                { base: "meet", past: "met", pp: "met" },
                { base: "pay", past: "paid", pp: "paid" },
                { base: "put", past: "put", pp: "put" },
                { base: "read", past: "read", pp: "read" },
                { base: "ride", past: "rode", pp: "ridden" },
                { base: "ring", past: "rang", pp: "rung" },
                { base: "rise", past: "rose", pp: "risen" },
                { base: "run", past: "ran", pp: "run" },
                { base: "say", past: "said", pp: "said" },
                { base: "see", past: "saw", pp: "seen" },
                { base: "seek", past: "sought", pp: "sought" },
                { base: "sell", past: "sold", pp: "sold" },
                { base: "send", past: "sent", pp: "sent" },
                { base: "set", past: "set", pp: "set" },
                { base: "shake", past: "shook", pp: "shaken" },
                { base: "shine", past: "shone", pp: "shone" },
                { base: "shoot", past: "shot", pp: "shot" },
                { base: "show", past: "showed", pp: "shown" },
                { base: "shrink", past: "shrank", pp: "shrunk" },
                { base: "shut", past: "shut", pp: "shut" },
                { base: "sing", past: "sang", pp: "sung" },
                { base: "sink", past: "sank", pp: "sunk" },
                { base: "sit", past: "sat", pp: "sat" },
                { base: "sleep", past: "slept", pp: "slept" },
                { base: "speak", past: "spoke", pp: "spoken" },
                { base: "spend", past: "spent", pp: "spent" },
                { base: "spread", past: "spread", pp: "spread" },
                { base: "stand", past: "stood", pp: "stood" },
                { base: "steal", past: "stole", pp: "stolen" },
                { base: "stick", past: "stuck", pp: "stuck" },
                { base: "strike", past: "struck", pp: "struck" },
                { base: "swear", past: "swore", pp: "sworn" },
                { base: "sweep", past: "swept", pp: "swept" },
                { base: "swim", past: "swam", pp: "swum" },
                { base: "take", past: "took", pp: "taken" },
                { base: "teach", past: "taught", pp: "taught" },
                { base: "tear", past: "tore", pp: "torn" },
                { base: "tell", past: "told", pp: "told" },
                { base: "think", past: "thought", pp: "thought" },
                { base: "throw", past: "threw", pp: "thrown" },
                { base: "understand", past: "understood", pp: "understood" },
                { base: "wake", past: "woke", pp: "woken" },
                { base: "wear", past: "wore", pp: "worn" },
                { base: "weep", past: "wept", pp: "wept" },
                { base: "win", past: "won", pp: "won" },
                { base: "write", past: "wrote", pp: "written" },
              ],
            },
          },
          {
            code: "A.2",
            title: "Three that trap almost everyone",
            titleBn: "যে তিনটি প্রায় সবাইকে ফাঁদে ফেলে",
            content: {
              points: [
                {
                  term: "rise / raise",
                  en: "rise / rose / risen (goes up by itself, no object) versus raise / raised / raised (to lift something, takes an object). Prices rose. / The bank raised rates.",
                  bn: "rise নিজে থেকে ওঠে (object নেই); raise কিছু তোলে (object নেয়)।",
                },
                {
                  term: "lie / lay",
                  en: "lie / lay / lain (to recline) versus lay / laid / laid (to put down). He lay down. / She laid the book on the table.",
                  bn: "lie = শোয়া (object নেই); lay = রাখা (object নেয়)।",
                },
                {
                  term: "been / gone",
                  en: "been versus gone: has been (went and came back) versus has gone (went and is still there).",
                  bn: "has been = গিয়ে ফিরে এসেছে; has gone = গিয়ে এখনো সেখানে আছে।",
                },
              ],
              closing: "This list covers the verbs that appear most often in IELTS Speaking stories, Task 1 descriptions, and Task 2 essays. Learn each as a fixed three-part item.",
            },
          },
        ],
        exercises: [],
        answerKey: {},
      },
    },
  });

  console.log("\u2705 Appendix A seeded successfully");
}

// ============================================================
// APPENDIX B · The 8-Week Study Plan
// ============================================================

async function seedAppendixB() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Appendix B · The 8-Week Study Plan",
      titleBn: "পরিশিষ্ট খ · ৮-সপ্তাহের অধ্যয়ন পরিকল্পনা",
      position: 13,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Back Matter & Toolkit",
        intro:
          "A book only works if you finish it, and self-study fails on discipline, not on content. This plan removes the daily 'what do I do now?' question. Follow it in order, and adjust the pace to your diagnostic band using the routing note in each phase.",
        introBn:
          "পরিশিষ্ট খ-এর মূল কথা: বই কাজ করে তখনই যখন আপনি শেষ করেন, আর self-study ব্যর্থ হয় শৃঙ্খলার অভাবে, কন্টেন্টের নয়। এই পরিকল্পনা প্রতিদিনের 'এখন কী করবো?' প্রশ্ন দূর করে। ক্রম মেনে চলুন এবং নিজের band অনুযায়ী গতি ঠিক করুন।",

        sections: [
          {
            code: "B.1",
            title: "Before you start: the daily rhythm",
            titleBn: "শুরুর আগে: দৈনিক রুটিন",
            content: {
              coreFact:
                "Aim for 40 to 60 minutes a day, six days a week. One rest day is fine and helps memory. Each session has the same shape.",
              steps: [
                { min: "10 min review", en: "re-read yesterday's errors from your personal error log (Appendix C)." },
                { min: "15 min learn", en: "read one lesson section, slowly, out loud where you can." },
                { min: "25 min do", en: "complete the exercises for that section with a pen, then check the key and log every mistake." },
                { min: "5 min close", en: "write the one rule you most want to remember tomorrow." },
              ],
              key: "The 25 minutes of doing matters more than the 15 of reading. Grammar you only read is not yet grammar you can produce.",
              bn: "দিনে ৪০-৬০ মিনিট, সপ্তাহে ৬ দিন। প্রতিটি সেশন: ১০ মিনিট রিভিউ, ১৫ মিনিট পড়া, ২৫ মিনিট কলম দিয়ে অনুশীলন + ভুল লেখা, ৫ মিনিট আজকের মূল নিয়ম। পড়ার চেয়ে অনুশীলনই বেশি জরুরি।",
            },
          },
          {
            code: "B.2",
            title: "The plan (week by week)",
            titleBn: "সপ্তাহভিত্তিক পরিকল্পনা",
            content: {
              plan: [
                { week: "0 (start)", focus: "Diagnosis", todo: "Take the Diagnostic Test. Record your total and your six section scores. Start your error log.", goal: "You know your band and your two weakest sections." },
                { week: "1", focus: "Accuracy base", todo: "Chapter 1 (agreement) and Chapter 2 (tenses). Do every exercise.", goal: "No more missing -s; correct past simple vs present perfect." },
                { week: "2", focus: "Accuracy base", todo: "Chapter 3 (articles) and Chapter 4 (prepositions).", goal: "Article errors and 'discuss about / according to me' fixed." },
                { week: "3", focus: "Range", todo: "Chapter 5 (complex sentences) and Chapter 6 (passive).", goal: "You can write varied complex sentences and a passive process." },
                { week: "4", focus: "Range + review", todo: "Chapter 7 (conditionals and hedging). Then re-do your worst Module 1 exercises.", goal: "Conditionals correct; claims hedged, not absolute." },
                { week: "5", focus: "Band 9 structures", todo: "Chapter 8 (inversion and cleft) and Chapter 9 (nominalisation). Use each sparingly.", goal: "One accurate inversion and one nominalised sentence you trust." },
                { week: "6", focus: "Self-correction", todo: "Chapter 10 all ten drills. Edit each essay and speaking transcript before checking.", goal: "You can find your own errors by category." },
                { week: "7", focus: "Vocabulary + full answers", todo: "Learn a Word Bank letter a day plus one topic set. Write three full timed answers (Task 1, Task 2, Speaking Part 3).", goal: "Real answers under time, using new vocabulary." },
                { week: "8", focus: "Revision + measure", todo: "Read the top-50 mistakes list. Re-do the checklist on old work. Re-take the Diagnostic Test.", goal: "A higher diagnostic score, and a short list of remaining weak spots." },
              ],
            },
          },
          {
            code: "B.3",
            title: "Route the plan to your band",
            titleBn: "নিজের band অনুযায়ী পরিকল্পনা সাজান",
            content: {
              points: [
                { term: "Diagnostic below 37 (Band 5 to 6)", en: "Do not rush. Spend two weeks each on Weeks 1 and 2 (four weeks on Module 1 alone), because accuracy is where your marks are. Treat Module 3 lightly; you reach Band 6.5 to 7 on accuracy, not rare structures." },
                { term: "Diagnostic 37 to 45 (Band 6 to 6.5)", en: "Follow the plan as written, but give extra days to whichever two sections your diagnostic flagged." },
                { term: "Diagnostic 46 and above (Band 7+)", en: "Compress Weeks 1 to 2 into one week of targeted review, and spend the extra time on Modules 3 and 4, where your remaining marks are." },
              ],
            },
          },
          {
            code: "B.4",
            title: "If you have less time",
            titleBn: "সময় কম হলে",
            content: {
              points: [
                { term: "4 weeks", en: "Weeks 1 to 2 (Module 1), Week 3 (Chapters 5 and 7), Week 4 (Chapter 10 drills + the checklist). Skip Module 3." },
                { term: "2 weeks (emergency)", en: "Chapters 1 and 3 (your biggest error sources), then Chapter 10 essay drills and the exam-day checklist. Accuracy first, always." },
              ],
            },
          },
        ],
        exercises: [],
        answerKey: {},
      },
    },
  });

  console.log("\u2705 Appendix B seeded successfully");
}

// ============================================================
// APPENDIX C · The Exam-Day Toolkit
// ============================================================

async function seedAppendixC() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Appendix C · The Exam-Day Toolkit",
      titleBn: "পরিশিষ্ট গ · পরীক্ষার দিনের টুলকিট",
      position: 14,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Back Matter & Toolkit",
        intro:
          "The exam-day toolkit gives you three practical tools: a two-minute proofreading routine, a personal error log, and a last-hour checklist. Proofread by category, not by vague rereading, and fix the most marks for the least effort.",
        introBn:
          "পরিশিষ্ট গ-এর মূল কথা: তিনটি ব্যবহারিক টুল—২ মিনিটের প্রুফরিডিং রুটিন, ব্যক্তিগত error log, আর শেষ-ঘণ্টার চেকলিস্ট। অস্পষ্টভাবে বারবার না পড়ে category ধরে প্রুফরিড করুন।",

        sections: [
          {
            code: "C1",
            title: "The two-minute proofreading routine",
            titleBn: "২ মিনিটের প্রুফরিডিং রুটিন",
            content: {
              coreFact:
                "In the real test, leave two to three minutes at the end of each writing task to proofread by category, not by vague rereading. Run one pass per code. You will catch far more this way than by reading for 'mistakes' in general.",
              passes: [
                { pass: "1", code: "SVA", question: "Does every verb match its true subject? (Delete the words in between and check.)" },
                { pass: "2", code: "T", question: "Is the timeline right? Finished time = past simple; 'since / for' = present perfect." },
                { pass: "3", code: "A", question: "Does every singular noun have an article? Any uncountable with a wrong plural or 'a'?" },
                { pass: "4", code: "P", question: "Any 'discuss about', 'according to me', wrong data preposition (by / from / to)?" },
                { pass: "5", code: "C", question: "Any comma splice, run-on, or fragment? Two full clauses joined by only a comma?" },
                { pass: "6", code: "WF / WW", question: "Double comparatives ('more better'), adjective used for adverb, wrong word choice?" },
                { pass: "7", code: "COND", question: "Any 'will / would' sitting right after 'if'?" },
              ],
              key: "Do the passes in this order because SVA and articles are where most marks are lost. If you only have time for two passes, do SVA and A.",
              bn: "পরীক্ষার শেষে ২-৩ মিনিট রেখে প্রতিটি code আলাদা করে চেক করুন, সব একসাথে নয়। সময় কম হলে শুধু SVA আর Article, এই দুটোই বেশি নম্বর কাটে।",
            },
          },
          {
            code: "C2",
            title: "Your personal error log",
            titleBn: "আপনার ব্যক্তিগত error log",
            content: {
              coreFact:
                "This is the single most powerful tool in the book. Every time you get an exercise wrong, or an error is found in your writing, add one line. After two weeks, three or four codes will appear again and again: those are your marks. Drill them first, and re-read this log before every practice session and before the exam. Copy this table onto a page (or into a notebook) and keep filling it in.",
              columns: ["Date", "What I wrote (the error)", "Code", "The correction", "The rule in my own words"],
              examples: [
                { date: "12 Mar", error: "The number of cars are rising", code: "SVA", correction: "The number of cars is rising", rule: "'The number of' is singular; subject is 'number', not 'cars'" },
                { date: "12 Mar", error: "According to me, the plan is good", code: "WW", correction: "In my opinion, the plan is good", rule: "'According to' is for other sources, never myself" },
                { date: "13 Mar", error: "Since 2010 pollution is increasing", code: "T", correction: "Since 2010 pollution has increased", rule: "'since' reaches to now, so present perfect, not present continuous" },
              ],
              bn: "এটি বইয়ের সবচেয়ে শক্তিশালী টুল। প্রতিবার ভুল করলে এক লাইন যোগ করুন। দুই সপ্তাহ পরে তিন-চারটি code বারবার আসবে—সেগুলোই আপনার নম্বর। আগে সেগুলো অনুশীলন করুন।",
            },
          },
          {
            code: "C3",
            title: "The last-hour checklist",
            titleBn: "শেষ-ঘণ্টার চেকলিস্ট",
            content: {
              coreFact:
                "The night before, and one last time before you enter, remind yourself of these seven, which fix the most marks for the least effort.",
              checklist: [
                "Add the -s to present-tense verbs with he / she / it and singular subjects.",
                "Put the before specific and unique nouns; no a / an with uncountables.",
                "Match the tense to the time word (finished = past; since / for = present perfect).",
                "No will / would after if.",
                "Join two clauses correctly: full stop, semicolon, comma + and/but/so, or make one dependent. Never a lone comma.",
                "Hedge big claims: may, tend to, in many cases, not always / everyone / will definitely.",
                "Leave two minutes to run the SVA and article passes.",
              ],
              bn: "পরীক্ষার আগে শেষবার এই সাতটি মনে করুন—এগুলোই সবচেয়ে কম পরিশ্রমে সবচেয়ে বেশি নম্বর বাঁচায়।",
              closing: "End of Appendices A to C. The annotated model answers and the top-50 mistakes list follow.",
            },
          },
        ],
        exercises: [],
        answerKey: {},
      },
    },
  });

  console.log("\u2705 Appendix C seeded successfully");
}

// ============================================================
// APPENDIX D · Annotated Model Answers
// ============================================================

async function seedAppendixD() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Appendix D · Annotated Model Answers",
      titleBn: "পরিশিষ্ট ঘ · টীকা-সহ মডেল উত্তর",
      position: 15,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Back Matter & Toolkit",
        intro:
          "The chapters taught the parts. This appendix shows the finished machine. Below are three model answers, one for Writing Task 1, one for Writing Task 2, and one for Speaking Part 3, each written at Band 8 to 9. After each answer, a table points to the exact structures from this book and where they appear, so you can see how accuracy and range combine on the page. Read the answer first, then study the annotations, then try to write your own version of the same task using the same structures.",
        introBn:
          "পরিশিষ্ট ঘ-এর মূল কথা: তিনটি মডেল উত্তর (Task 1, Task 2, Speaking Part 3) ব্যান্ড ৮-৯ মানে দেওয়া হয়েছে। প্রতিটির পরে একটি সারণি দেখায় বইয়ের কোন কাঠামো কোথায় ব্যবহার হয়েছে, যাতে accuracy ও range কীভাবে একসাথে কাজ করে বোঝা যায়।",

        sections: [
          {
            code: "D1",
            title: "Writing Task 1 (Model Answer)",
            titleBn: "Writing Task 1 (মডেল উত্তর)",
            content: {
              task:
                "The line graph below shows the number of international visitors to three museums (A, B, and C) in one city between 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
              model:
                "The line graph illustrates how many international visitors came to three museums, A, B, and C, in a single city between 2010 and 2020. Overall, visitor numbers rose at all three museums over the period, although Museum A, which began as the least popular, saw by far the sharpest growth. In 2010, Museum A received around 20,000 visitors, the lowest of the three, whereas Museum B and Museum C stood at roughly 40,000 and 50,000 respectively. Over the following decade, the number of visitors to Museum A increased steadily, reaching 70,000 by 2020. Museum C, by contrast, experienced only a modest rise, from 50,000 to 60,000. Museum B fluctuated: its figures climbed to a peak of 55,000 in 2015 before falling back to 45,000 by 2020. A notable feature is that, by the end of the period, Museum A had overtaken both of its rivals, a reversal that few would have predicted at the start.",
              annotations: [
                { structure: "Past simple for a finished period (Ch 2)", where: "'rose', 'received', 'increased', 'climbed', 'fell'" },
                { structure: "Past perfect for an earlier past action (Ch 2)", where: "'Museum A had overtaken both of its rivals'" },
                { structure: "Data prepositions (Ch 4)", where: "'from 50,000 to 60,000', 'a peak of 55,000', 'stood at 40,000', 'by 2020'" },
                { structure: "Subject-verb agreement, tricky subject (Ch 1)", where: "'the number of visitors … increased' (singular 'number')" },
                { structure: "Relative clause (Ch 5)", where: "'Museum A, which began as the least popular'" },
                { structure: "Nominalisation for density (Ch 9)", where: "'the sharpest growth', 'a modest rise', 'a reversal'" },
                { structure: "Contrast linkers (Ch 5)", where: "'whereas', 'by contrast', 'although'" },
                { structure: "Cleft for emphasis (Ch 8)", where: "'A notable feature is that … A had overtaken both'" },
                { structure: "Articles (Ch 3)", where: "'the line graph', 'a single city', 'the lowest of the three'" },
              ],
            },
          },
          {
            code: "D2",
            title: "Writing Task 2 (Model Answer)",
            titleBn: "Writing Task 2 (মডেল উত্তর)",
            content: {
              task:
                "Some people believe that university education should be free for all students, while others think students should pay their own tuition fees. Discuss both views and give your own opinion. Write at least 250 words.",
              model:
                "It is often argued that higher education should be provided free of charge, whereas others insist that students ought to fund their own studies. Both positions have merit, though on balance I believe that a mixed approach is the fairest solution. Those who support free education point out that it widens access. If tuition were entirely free, talented students from poorer backgrounds would no longer be excluded by cost, and society as a whole would benefit from a better-educated workforce. Moreover, because an educated population tends to earn more and pay more tax, much of the public expenditure would eventually return to the state. On the other hand, opponents argue that free education places an enormous burden on taxpayers. If governments were to fund every place, they might be forced to cut spending on equally vital services such as healthcare. There is also a risk that some students, having paid nothing, would take their studies less seriously. What is needed, in my view, is a balance between these two extremes. Rather than making university either wholly free or wholly paid, governments could offer generous scholarships to those who genuinely cannot afford the fees, while asking wealthier families to contribute. Not only would this widen participation, but it would also keep the system financially sustainable. In conclusion, although free education is an admirable goal, it is not without serious drawbacks. A targeted system, which supports the poorest students without overburdening the state, is likely to serve society best in the long run.",
              annotations: [
                { structure: "Impersonal passive for academic tone (Ch 6)", where: "'It is often argued that …'" },
                { structure: "Second conditional for hypotheticals (Ch 7)", where: "'If tuition were free, students would no longer be excluded'" },
                { structure: "Hedging, no absolute claims (Ch 7)", where: "'tends to', 'might be forced', 'is likely to', 'on balance'" },
                { structure: "Relative clauses (Ch 5)", where: "'A targeted system, which supports the poorest students'" },
                { structure: "What-cleft for emphasis (Ch 8)", where: "'What is needed … is a balance'" },
                { structure: "Inversion for emphasis (Ch 8)", where: "'Not only would this widen participation, but it would also …'" },
                { structure: "Concession and contrast (Ch 5)", where: "'whereas', 'On the other hand', 'although'" },
                { structure: "Nominalisation (Ch 9)", where: "'public expenditure', 'participation', 'access'" },
                { structure: "Reduced participle clause (Ch 5, 8)", where: "'some students, having paid nothing, would …'" },
                { structure: "High-value phrases (Word Bank)", where: "'in the long run', 'not without serious drawbacks'" },
                { structure: "Subject-verb agreement and articles throughout (Ch 1, 3)", where: "'an educated population tends', 'the state', 'a balance'" },
              ],
            },
          },
          {
            code: "D3",
            title: "Speaking Part 3 (Model Answer)",
            titleBn: "Speaking Part 3 (মডেল উত্তর)",
            content: {
              task: "Examiner's question: Do you think technology has made people's lives better?",
              model:
                "On the whole, yes, I'd say technology has improved our lives in a lot of ways, though it's definitely a double-edged sword. On the positive side, things that used to take hours, like sending a letter or looking something up, can now be done in seconds, which has made both work and study far more efficient. Having said that, I do think we've become a bit too dependent on it. If people spent less time staring at screens, they'd probably communicate better face to face. So while I wouldn't want to go back to how things were, I think the key is striking a balance, using technology as a tool without letting it take over.",
              annotations: [
                { structure: "Present perfect for change up to now (Ch 2)", where: "'technology has improved our lives', 'we've become'" },
                { structure: "'used to' for past habit (Ch 2)", where: "'things that used to take hours'" },
                { structure: "Relative clause, naturally placed (Ch 5)", where: "'which has made both work and study far more efficient'" },
                { structure: "Second conditional for speculation (Ch 7)", where: "'If people spent less time …, they'd probably communicate better'" },
                { structure: "Hedging (Ch 7)", where: "'On the whole', 'a bit too dependent', 'probably'" },
                { structure: "Contrast markers (Ch 5)", where: "'though', 'Having said that', 'while'" },
                { structure: "Gerund after a preposition (Ch 4)", where: "'without letting it take over', 'the key is striking a balance'" },
                { structure: "High-value idioms (Word Bank)", where: "'a double-edged sword', 'striking a balance'" },
                { structure: "Natural spoken flow (Ch 10, Part 2)", where: "contractions ('I'd', 'we've', 'they'd') and discourse markers kept" },
              ],
              lesson:
                "The lesson: notice that the Speaking answer is not more formal than the writing, it is more natural. It keeps its contractions and its relaxed rhythm, and folds the advanced grammar in so smoothly that it still sounds like a real person talking. That combination, accuracy plus natural range, is exactly what the top of the band descriptor describes.",
              bn: "লক্ষ্য করুন, speaking উত্তরটি লেখার চেয়ে বেশি আনুষ্ঠানিক নয়, বরং বেশি স্বাভাবিক। contraction ও কথ্য ছন্দ রেখে উন্নত grammar এমনভাবে মেশানো হয়েছে যে এটি এখনও সত্যিকারের কথা বলার মতো শোনায়। এই নির্ভুলতা + স্বাভাবিক বৈচিত্র্যই সর্বোচ্চ ব্যান্ডের বৈশিষ্ট্য।",
            },
          },
        ],
        exercises: [],
        answerKey: {},
      },
    },
  });

  console.log("\u2705 Appendix D seeded successfully");
}

// ============================================================
// APPENDIX E · The 50 Mistakes That Cap Bangladeshi Students at Band 6
// ============================================================

async function seedAppendixE() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Appendix E · The 50 Mistakes That Cap Bangladeshi Students at Band 6",
      titleBn: "পরিশিষ্ট ঙ · যে ৫০টি ভুল বাংলাদেশি শিক্ষার্থীদের ব্যান্ড ৬-এ আটকে রাখে",
      position: 16,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Back Matter & Toolkit",
        intro:
          "Almost every error that caps a strong candidate at Band 6 comes from one of two facts about Bangla: it has no articles, and its verb does not change to agree with a singular or plural subject. This appendix gathers the fifty highest-frequency errors from across the book into one fast-scan list for last-week revision. Read it the night before a practice test and again before the exam. If you can spot and fix all fifty, you have removed the great majority of the accuracy errors that hold Bangladeshi candidates back. Each item shows the wrong version, the correct version, and the reason with its error code.",
        introBn:
          "পরিশিষ্ট ঙ-এর মূল কথা: ব্যান্ড ৬-এ আটকে রাখা প্রায় সব ভুল আসে দুটি কারণে: বাংলায় article নেই, আর verb subject অনুযায়ী বদলায় না। এই ৫০টি ভুল শেষ সপ্তাহের রিভিশনের জন্য এক জায়গায় দেওয়া হলো। পঞ্চাশটাই ধরতে ও ঠিক করতে পারলে আপনার accuracy ইতিমধ্যেই ব্যান্ড ৭।",

        sections: [
          {
            code: "E.1",
            title: "Subject-verb agreement (SVA)",
            titleBn: "Subject-verb agreement (SVA)",
            content: {
              mistakes: [
                { n: 1, wrong: "He go to school.", right: "He goes to school.", why: "third-person -s" },
                { n: 2, wrong: "The graph show a rise.", right: "The graph shows a rise.", why: "third-person -s" },
                { n: 3, wrong: "The number of cars are rising.", right: "The number of cars is rising.", why: "'the number of' is singular" },
                { n: 4, wrong: "Each of the students have a laptop.", right: "Each of the students has a laptop.", why: "'each of' is singular" },
                { n: 5, wrong: "Everyone were present.", right: "Everyone was present.", why: "'everyone' is singular" },
                { n: 6, wrong: "The government are planning.", right: "The government is planning.", why: "collective noun, academic" },
                { n: 7, wrong: "Many people is using it.", right: "Many people are using it.", why: "'people' is plural" },
                { n: 8, wrong: "Neither of them are correct.", right: "Neither of them is correct.", why: "'neither of' is singular" },
              ],
            },
          },
          {
            code: "E.2",
            title: "Tense (T)",
            titleBn: "Tense (T)",
            content: {
              mistakes: [
                { n: 9, wrong: "I am knowing the answer.", right: "I know the answer.", why: "stative verb" },
                { n: 10, wrong: "It is increasing since 2010.", right: "It has increased since 2010.", why: "'since' needs present perfect" },
                { n: 11, wrong: "I have visited London in 2019.", right: "I visited London in 2019.", why: "finished year = past simple" },
                { n: 12, wrong: "Since 2015 he became rich.", right: "Since 2015 he has become rich.", why: "'since' needs present perfect" },
                { n: 13, wrong: "He is having two cars.", right: "He has two cars.", why: "possession is stative" },
                { n: 14, wrong: "Last year the price is rising.", right: "Last year the price rose.", why: "finished time = past simple" },
                { n: 15, wrong: "I am understanding now.", right: "I understand now.", why: "stative verb" },
                { n: 16, wrong: "She works here since 2018.", right: "She has worked here since 2018.", why: "'since' needs present perfect" },
              ],
            },
          },
          {
            code: "E.3",
            title: "Articles and nouns (A)",
            titleBn: "Articles and nouns (A)",
            content: {
              mistakes: [
                { n: 17, wrong: "He gave me an advice.", right: "He gave me some advice / a piece of advice.", why: "uncountable" },
                { n: 18, wrong: "I need an information.", right: "I need some information.", why: "uncountable" },
                { n: 19, wrong: "She did a research.", right: "She did research / a study.", why: "uncountable" },
                { n: 20, wrong: "Government should take step.", right: "The government should take steps.", why: "specific noun needs 'the'; plural" },
                { n: 21, wrong: "Internet has changed our lives.", right: "The internet has changed our lives.", why: "unique noun needs 'the'" },
                { n: 22, wrong: "many informations", right: "much information", why: "uncountable" },
                { n: 23, wrong: "new furnitures", right: "new furniture", why: "uncountable, no plural" },
                { n: 24, wrong: "He is engineer.", right: "He is an engineer.", why: "singular countable needs an article" },
              ],
            },
          },
          {
            code: "E.4",
            title: "Prepositions (P)",
            titleBn: "Prepositions (P)",
            content: {
              mistakes: [
                { n: 25, wrong: "discuss about the topic", right: "discuss the topic", why: "'discuss' takes no preposition" },
                { n: 26, wrong: "According to me, …", right: "In my opinion, …", why: "'according to' is for other sources" },
                { n: 27, wrong: "enter into the room", right: "enter the room", why: "'enter' takes a direct object" },
                { n: 28, wrong: "It depends of funding.", right: "It depends on funding.", why: "fixed phrase 'depend on'" },
                { n: 29, wrong: "increased with 10 per cent", right: "increased by 10 per cent", why: "change of quantity takes 'by'" },
                { n: 30, wrong: "reached to a peak", right: "reached a peak", why: "'reach' takes no preposition" },
                { n: 31, wrong: "He married with her.", right: "He married her.", why: "'marry' takes a direct object" },
                { n: 32, wrong: "return back home", right: "return home", why: "'return' already means 'go back'" },
              ],
            },
          },
          {
            code: "E.5",
            title: "Clauses and punctuation (C)",
            titleBn: "Clauses and punctuation (C)",
            content: {
              mistakes: [
                { n: 33, wrong: "Internet use rose rapidly, people spent more time online.", right: "Internet use rose rapidly, so people spent more time online.", why: "comma splice" },
                { n: 34, wrong: "Because it was raining.", right: "Because it was raining, the match was cancelled.", why: "fragment" },
                { n: 35, wrong: "People which live in cities", right: "People who live in cities", why: "'who' for people" },
                { n: 36, wrong: "My school, that is old, is famous.", right: "My school, which is old, is famous.", why: "non-defining uses 'which'" },
                { n: 37, wrong: "Students who cheat they are expelled.", right: "Students who cheat are expelled.", why: "no repeated subject" },
                { n: 38, wrong: "Despite he worked hard, he failed.", right: "Despite working hard / Although he worked hard, he failed.", why: "'despite' cannot take a full clause" },
              ],
            },
          },
          {
            code: "E.6",
            title: "Word form (WF)",
            titleBn: "Word form (WF)",
            content: {
              mistakes: [
                { n: 39, wrong: "more better", right: "better", why: "no double comparative" },
                { n: 40, wrong: "most biggest", right: "biggest", why: "no double superlative" },
                { n: 41, wrong: "He explained it very simple.", right: "He explained it very simply.", why: "adverb" },
                { n: 42, wrong: "They cannot focuses.", right: "They cannot focus.", why: "base verb after modal" },
                { n: 43, wrong: "We should to create jobs.", right: "We should create jobs.", why: "no 'to' after modal" },
                { n: 44, wrong: "An educated population is benefit for the economy.", right: "An educated population benefits the economy.", why: "verb, not noun" },
              ],
            },
          },
          {
            code: "E.7",
            title: "Conditionals (COND)",
            titleBn: "Conditionals (COND)",
            content: {
              mistakes: [
                { n: 45, wrong: "If governments will invest more, …", right: "If governments invest more, …", why: "no 'will' after 'if'" },
                { n: 46, wrong: "If she studied harder, she will pass.", right: "If she studied harder, she would pass.", why: "match the halves: second conditional" },
                { n: 47, wrong: "If I would have money, …", right: "If I had money, …", why: "no 'would' in the if-clause" },
                { n: 48, wrong: "If people will recycle more, waste would fall.", right: "If people recycle more, waste will fall.", why: "first conditional, no 'will' after 'if'" },
              ],
            },
          },
          {
            code: "E.8",
            title: "Over-generalisation (hedging)",
            titleBn: "অতি-সাধারণীকরণ (hedging)",
            content: {
              mistakes: [
                { n: 49, wrong: "Everyone knows that studying abroad is better.", right: "It is widely believed that studying abroad has advantages.", why: "hedge the absolute claim" },
                { n: 50, wrong: "This will destroy every person.", right: "This may cause serious harm to many people.", why: "hedge the absolute claim" },
              ],
              key: "Final word: if you internalise nothing else from this book in your last week, internalise these fifty. They are not difficult grammar. They are habits, and habits can be retrained. Fix them, and you remove the invisible ceiling that keeps so many capable Bangladeshi candidates one band below the score their ideas deserve.",
              bn: "শেষ সপ্তাহে যদি আর কিছুই মনে না রাখেন, এই ৫০টি মনে রাখুন। এগুলো কঠিন grammar নয়, অভ্যাস—আর অভ্যাস বদলানো যায়। এগুলো ঠিক করলেই সেই অদৃশ্য সীমা সরে যাবে যা অনেক যোগ্য শিক্ষার্থীকে প্রাপ্য ব্যান্ডের এক ধাপ নিচে আটকে রাখে।",
            },
          },
        ],
        exercises: [],
        answerKey: {},
      },
    },
  });

  console.log("\u2705 Appendix E seeded successfully");
}

// ============================================================
// APPENDIX F · Punctuation & Mechanics
// ============================================================

async function seedAppendixF() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Appendix F · Punctuation & Mechanics",
      titleBn: "পরিশিষ্ট চ · Punctuation ও Mechanics",
      position: 17,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Back Matter & Toolkit",
        intro:
          "Punctuation is silent grammar. Examiners rarely comment on it, but a missing apostrophe, a comma splice, or a lower-case proper noun quietly signals that your control is inconsistent, and that keeps you off Band 7. This appendix covers the marks that matter in IELTS Writing, with the errors Bangla speakers most often make flagged as you go.",
        introBn:
          "পরিশিষ্ট চ-এর মূল কথা: যতিচিহ্ন হলো নীরব grammar। একটি হারানো apostrophe, comma splice, বা ছোট হাতের proper noun চুপচাপ বোঝায় নিয়ন্ত্রণ অসম্পূর্ণ, যা ব্যান্ড ৭-এ পৌঁছতে বাধা দেয়।",

        sections: [
          {
            code: "F.1",
            title: "The full stop (.)",
            titleBn: "full stop (.)",
            content: {
              coreFact:
                "Ends a complete sentence. The most common error is using a comma where a full stop is needed (a comma splice). Two complete thoughts need a full stop, a semicolon, or a joining word, never a lone comma.",
              example: "Wrong: The plan was popular, it was cancelled. → Right: The plan was popular. It was cancelled. (or use 'but')",
            },
          },
          {
            code: "F.2",
            title: "The comma (,)",
            titleBn: "comma (,)",
            content: {
              coreFact: "Four uses cover almost everything in IELTS.",
              uses: [
                "After a fronted dependent clause or phrase: Although it is costly, it works.",
                "Around a non-defining relative clause (extra information): Dhaka, which is the capital, is crowded.",
                "Before a coordinating conjunction joining two independent clauses: Fees rose, so enrolment fell.",
                "Between items in a list: The scheme is cheap, simple, and effective.",
              ],
              key: "Do not use a comma to join two full sentences on its own (the comma splice), and do not put a comma between a subject and its verb. Wrong: The number of tourists, has risen. → Right: The number of tourists has risen.",
            },
          },
          {
            code: "F.3",
            title: "The semicolon (;)",
            titleBn: "semicolon (;)",
            content: {
              coreFact:
                "Joins two closely related complete sentences without a joining word. Think of it as a soft full stop. Fees rose; enrolment fell. Prices are climbing; consequently, demand has weakened. Do not use it before a joining word like 'and' or 'but', and do not use it to introduce a list (that is the colon's job).",
            },
          },
          {
            code: "F.4",
            title: "The colon (:)",
            titleBn: "colon (:)",
            content: {
              coreFact:
                "Introduces a list, an explanation, or an example after a complete sentence. The plan has three aims: to cut costs, to save time, and to reduce waste. There is one clear problem: the city has no money.",
            },
          },
          {
            code: "F.5",
            title: "The apostrophe (')",
            titleBn: "apostrophe (')",
            content: {
              coreFact: "Two jobs only, and Bangla speakers routinely confuse them.",
              uses: [
                "Possession: the student's book (one student); the students' books (many students).",
                "Contraction (a missing letter): it's = it is; they're = they are; don't = do not.",
              ],
              key: "The classic trap: its (belonging to it) has no apostrophe; it's (it is) does. Wrong: The company lost it's market share. → Right: its market share. Never use an apostrophe to make a plural: apple's for sale → apples for sale.",
              bn: "apostrophe-এর দুটি কাজ: মালিকানা (student's) ও সংক্ষেপ (it's = it is)। its (এর) apostrophe নেয় না; it's (it is) নেয়। বহুবচন বানাতে apostrophe বসে না।",
            },
          },
          {
            code: "F.6",
            title: "Capital letters",
            titleBn: "বড় হাতের অক্ষর",
            content: {
              coreFact:
                "Capitalise the first word of a sentence, the pronoun I (always), and all proper nouns: names of people, countries, cities, languages, nationalities, months, days, and organisations. Wrong: i live in bangladesh and speak bengali. → Right: I live in Bangladesh and speak Bengali. Do not capitalise common nouns for emphasis.",
            },
          },
          {
            code: "F.7",
            title: "The hyphen (-) and quotation marks",
            titleBn: "hyphen (-) ও quotation marks",
            content: {
              coreFact:
                "The hyphen joins words acting as a single adjective before a noun: a well-known author; a five-year plan; a long-term solution. No hyphen when the words come after the noun: The author is well known. Quotation marks are rarely needed in IELTS essays. If you quote a phrase, keep it short and use double marks. Do not put whole sentences of your own in quotation marks for emphasis.",
            },
          },
        ],
        exercises: [],
        answerKey: {},
      },
    },
  });

  console.log("\u2705 Appendix F seeded successfully");
}

// ============================================================
// APPENDIX G · Commonly Confused Words
// ============================================================

async function seedAppendixG() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Appendix G · Commonly Confused Words",
      titleBn: "পরিশিষ্ট ছ · সচরাচর গুলিয়ে ফেলা শব্দ",
      position: 18,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Back Matter & Toolkit",
        intro:
          "These pairs cause errors that a spell-checker will never catch, because both words are real. They are worth learning as fixed contrasts. The ones marked (grammar) affect your Grammatical Range and Accuracy directly; the rest protect your Lexical Resource and your credibility.",
        introBn:
          "পরিশিষ্ট ছ-এর মূল কথা: এই জোড়াগুলোর ভুল spell-checker ধরতে পারে না, কারণ দুটোই আসল শব্দ। (grammar) চিহ্নিতগুলো সরাসরি GRA নম্বরে প্রভাব ফেলে: its/it's, then/than, fewer/less, number/amount, many/much, rise/raise, lie/lay, hard/hardly। এগুলো fixed contrast হিসেবে শিখুন।",

        sections: [
          {
            code: "G.1",
            title: "The confused pairs",
            titleBn: "গুলিয়ে ফেলা জোড়া",
            content: {
              pairs: [
                { pair: "its / it's (grammar)", difference: "its = belonging to it; it's = it is", examples: "The dog wagged its tail. It's raining." },
                { pair: "their / there / they're (grammar)", difference: "possession / place / they are", examples: "Their house is over there. They're late." },
                { pair: "your / you're (grammar)", difference: "possession / you are", examples: "Your essay is good. You're improving." },
                { pair: "then / than (grammar)", difference: "then = next / at that time; than = comparison", examples: "First study, then rest. Cheaper than before." },
                { pair: "affect / effect", difference: "affect (verb) = to influence; effect (noun) = a result", examples: "Pollution affects health. It has a bad effect." },
                { pair: "advice / advise", difference: "advice (noun) / advise (verb)", examples: "She gave me advice. I advise you to wait." },
                { pair: "practice / practise", difference: "practice (noun) / practise (verb) in British English", examples: "Daily practice helps. You should practise daily." },
                { pair: "principal / principle", difference: "principal = head / main; principle = a rule or belief", examples: "The school principal; a basic principle." },
                { pair: "to / too / two (grammar)", difference: "direction / also or excessive / the number", examples: "I went to town. It is too costly. Two options." },
                { pair: "lose / loose", difference: "lose = to not keep; loose = not tight", examples: "Do not lose hope. The screw is loose." },
                { pair: "accept / except", difference: "accept = to receive; except = apart from", examples: "I accept the offer. Everyone except him." },
                { pair: "weather / whether", difference: "the climate / an 'if' choice", examples: "The weather is cold. I wonder whether to go." },
                { pair: "quiet / quite", difference: "quiet = silent; quite = fairly", examples: "A quiet room. It is quite difficult." },
                { pair: "economic / economical", difference: "economic = about the economy; economical = cheap to run", examples: "economic growth; an economical car." },
                { pair: "complement / compliment", difference: "complement = to complete; compliment = praise", examples: "The wine complements the meal. A kind compliment." },
                { pair: "stationary / stationery", difference: "stationary = not moving; stationery = writing materials", examples: "The car was stationary. She bought stationery." },
                { pair: "fewer / less (grammar)", difference: "fewer for countable; less for uncountable", examples: "fewer cars; less traffic." },
                { pair: "number / amount (grammar)", difference: "number for countable; amount for uncountable", examples: "a large number of people; a large amount of money." },
                { pair: "many / much (grammar)", difference: "many for countable; much for uncountable", examples: "many books; much information." },
                { pair: "between / among (grammar)", difference: "between two; among three or more", examples: "between you and me; among the students." },
                { pair: "rise / raise (grammar)", difference: "rise has no object; raise takes an object", examples: "Prices rose. The bank raised rates." },
                { pair: "lie / lay (grammar)", difference: "lie = to recline (no object); lay = to put (object)", examples: "He lay down. She laid the book down." },
                { pair: "lend / borrow", difference: "lend = to give temporarily; borrow = to take temporarily", examples: "I will lend you money. May I borrow a pen?" },
                { pair: "bring / take", difference: "bring = towards; take = away", examples: "Bring it here. Take it there." },
                { pair: "beside / besides", difference: "beside = next to; besides = in addition", examples: "Sit beside me. Besides, it is cheap." },
                { pair: "later / latter", difference: "later = afterwards; latter = the second of two", examples: "See you later. Of the two, I prefer the latter." },
                { pair: "personal / personnel", difference: "personal = private; personnel = staff", examples: "a personal matter; the company's personnel." },
                { pair: "sensible / sensitive", difference: "sensible = wise; sensitive = easily affected", examples: "a sensible choice; a sensitive topic." },
                { pair: "hard / hardly (grammar)", difference: "hard = with effort; hardly = almost not", examples: "She works hard. He hardly works." },
                { pair: "cost / price", difference: "cost = expense to make or run; price = amount charged", examples: "The cost of living; the price of a ticket." },
                { pair: "learn / teach", difference: "learn = to gain knowledge; teach = to give it", examples: "Students learn; teachers teach." },
                { pair: "remind / remember", difference: "remind = to make someone recall; remember = to recall", examples: "Remind me tomorrow. I remember it well." },
                { pair: "elicit / illicit", difference: "elicit = to draw out; illicit = illegal", examples: "The survey elicited replies. illicit trade." },
                { pair: "everyday / every day", difference: "everyday (adj) = ordinary; every day = each day", examples: "an everyday task; I study every day." },
              ],
            },
          },
        ],
        exercises: [],
        answerKey: {},
      },
    },
  });

  console.log("\u2705 Appendix G seeded successfully");
}

// ============================================================
// APPENDIX H · Diagnostic Test B (Progress Check)
// ============================================================

async function seedAppendixH() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Appendix H · Diagnostic Test B (Progress Check)",
      titleBn: "পরিশিষ্ট জ · Diagnostic Test B (অগ্রগতি যাচাই)",
      position: 19,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Back Matter & Toolkit",
        intro:
          "The Introduction promised that you would re-measure your grammar after finishing the book. This is that test. It has the same structure and difficulty as the Diagnostic Test in the front matter (six sections of ten questions, covering the same six areas), but every question is different. Take it in Week 8 of the study plan, under the same conditions: a pen, no dictionary, about forty minutes. Then compare your total and your six section scores with your very first attempt. The gap between them is the progress this book has given you.",
        introBn:
          "পরিশিষ্ট জ-এর মূল কথা: ভূমিকা প্রতিশ্রুতি দিয়েছিল বই শেষ করে আবার নিজের grammar মাপবেন। এই টেস্টটি সেই কাজের জন্য: গঠন ও কঠিনতা একই, কিন্তু প্রশ্নগুলো ভিন্ন। প্রথম টেস্টের ফলের সঙ্গে মিলিয়ে দেখুন, পার্থক্যটাই আপনার অগ্রগতি।",

        sections: [
          {
            code: "H.A",
            title: "Section A · Subject-Verb Agreement (Q1–Q10)",
            titleBn: "সেকশন A · Subject-Verb Agreement",
            content: {
              questions: [
                { q: 1, text: "Mathematics ______ often considered a difficult subject.", options: "a) are b) is c) were d) have been" },
                { q: 2, text: "The quality of the products ______ improved this year.", options: "a) have b) has c) are d) were" },
                { q: 3, text: "A number of factories ______ closed down recently.", options: "a) has b) is c) have d) was" },
                { q: 4, text: "Every student and teacher ______ invited to the ceremony.", options: "a) are b) were c) is d) have" },
                { q: 5, text: "Physics and chemistry ______ taught in this school.", options: "a) is b) was c) are d) has" },
                { q: 6, text: "There ______ a variety of options available to consumers.", options: "a) are b) is c) were d) have" },
                { q: 7, text: "Neither the committee members nor the chair ______ satisfied.", options: "a) are b) were c) is d) have been" },
                { q: 8, text: "Five hundred dollars ______ a large sum for most families.", options: "a) are b) were c) is d) have" },
                { q: 9, text: "The news ______ surprising to everyone.", options: "a) are b) were c) is d) have been" },
                { q: 10, text: "Each of the countries ______ its own flag.", options: "a) have b) has c) are d) were" },
              ],
            },
          },
          {
            code: "H.B",
            title: "Section B · Tenses (Q11–Q20)",
            titleBn: "সেকশন B · Tenses",
            content: {
              questions: [
                { q: 11, text: "In 2012, the factory ______ over a thousand workers.", options: "a) has employed b) employed c) employs d) is employing" },
                { q: 12, text: "Over the past five years, exports ______ steadily.", options: "a) grew b) grow c) have grown d) were growing" },
                { q: 13, text: "By 2019, the company ______ already expanded overseas.", options: "a) has b) had c) was d) is" },
                { q: 14, text: "If the trend continues, prices ______ even further.", options: "a) rise b) rose c) will rise d) would rise" },
                { q: 15, text: "Ice ______ when the temperature rises above zero.", options: "a) is melting b) melts c) melted d) has melted" },
                { q: 16, text: "She ______ for this firm since 2016.", options: "a) works b) worked c) has worked d) is working" },
                { q: 17, text: "Currently, the government ______ a new education policy.", options: "a) considers b) considered c) is considering d) has considered" },
                { q: 18, text: "Choose the error: 'The population is growing rapidly last decade.'", options: "a) is growing should be grew b) rapidly should be rapid c) last should be the last d) no error" },
                { q: 19, text: "Two years ago, they ______ their first branch abroad.", options: "a) open b) have opened c) opened d) had opened" },
                { q: 20, text: "Choose the error: 'I have finished my degree in 2020.'", options: "a) have finished should be finished b) degree should be degrees c) in should be at d) no error" },
              ],
            },
          },
          {
            code: "H.C",
            title: "Section C · Articles and Nouns (Q21–Q30)",
            titleBn: "সেকশন C · Articles and Nouns",
            content: {
              questions: [
                { q: 21, text: "______ sun provides energy for all life on Earth.", options: "a) A b) An c) The d) (no article)" },
                { q: 22, text: "He hopes to become ______ university lecturer.", options: "a) a b) an c) the d) (no article)" },
                { q: 23, text: "______ is the key to reducing poverty.", options: "a) The education b) An education c) Education d) A education" },
                { q: 24, text: "Can you give me some ______ on this matter?", options: "a) an advice b) advice c) advices d) a advice" },
                { q: 25, text: "The graph shows ______ number of road accidents each year.", options: "a) a b) an c) the d) (no article)" },
                { q: 26, text: "______ honesty is an important quality in a leader.", options: "a) The b) An c) A d) (no article)" },
                { q: 27, text: "She was ______ first woman to lead the company.", options: "a) a b) an c) the d) (no article)" },
                { q: 28, text: "The scientists gathered a great deal of ______.", options: "a) datas b) data c) a data d) informations" },
                { q: 29, text: "Choose the error: 'Poverty is serious problem in rural areas.'", options: "a) serious problem should be a serious problem b) Poverty should be The poverty c) areas should be area d) no error" },
                { q: 30, text: "I bought ______ umbrella yesterday; ______ umbrella was expensive.", options: "a) the / an b) an / the c) a / a d) an / an" },
              ],
            },
          },
          {
            code: "H.D",
            title: "Section D · Prepositions (Q31–Q40)",
            titleBn: "সেকশন D · Prepositions",
            content: {
              questions: [
                { q: 31, text: "Profits increased ______ 12 per cent last quarter.", options: "a) with b) of c) by d) to" },
                { q: 32, text: "The figure fell ______ 80 ______ 60 over the year.", options: "a) from / to b) between / and c) of / to d) by / to" },
                { q: 33, text: "The temperature dropped ______ a low of minus five degrees.", options: "a) at b) to c) of d) by" },
                { q: 34, text: "Success depends largely ______ hard work and discipline.", options: "a) of b) on c) to d) from" },
                { q: 35, text: "Deforestation contributes ______ climate change.", options: "a) into b) at c) to d) on" },
                { q: 36, text: "Choose the correct sentence.", options: "a) We must discuss about the problem. b) We must discuss the problem. c) We must discuss on the problem. d) We must discuss of the problem." },
                { q: 37, text: "She is responsible ______ the whole team.", options: "a) of b) to c) for d) about" },
                { q: 38, text: "The library opens ______ 9 a.m. ______ weekdays.", options: "a) in / on b) at / on c) on / at d) at / in" },
                { q: 39, text: "Unemployment stood ______ eight per cent ______ 2015.", options: "a) at / in b) on / at c) in / on d) at / at" },
                { q: 40, text: "Choose the error: 'According to me, taxes should be lower.'", options: "a) According to me should be In my opinion b) should should be should be c) lower should be low d) no error" },
              ],
            },
          },
          {
            code: "H.E",
            title: "Section E · Clause Structure and Punctuation (Q41–Q50)",
            titleBn: "সেকশন E · Clause Structure and Punctuation",
            content: {
              questions: [
                { q: 41, text: "Which sentence is punctuated correctly?", options: "a) Fees rose, enrolment fell. b) Fees rose enrolment fell. c) Fees rose, so enrolment fell. d) Fees rose so, enrolment fell." },
                { q: 42, text: "Which is a complete sentence (not a fragment)?", options: "a) Although the plan was cheap. b) Because demand increased sharply. c) The plan succeeded despite the cost. d) Which surprised everyone." },
                { q: 43, text: "Choose the correctly punctuated sentence.", options: "a) When it rains the roads flood. b) When it rains, the roads flood. c) When, it rains the roads flood. d) The roads flood, when it rains." },
                { q: 44, text: "Which sentence contains a comma splice (an error)?", options: "a) The data was clear; it showed a rise. b) The data was clear, and it showed a rise. c) The data was clear, it showed a rise. d) The data, which was clear, showed a rise." },
                { q: 45, text: "Choose the correct use of the semicolon.", options: "a) There are two issues; time and money. b) Costs rose; profits fell. c) Although costs rose; profits fell. d) Costs rose; and profits fell." },
                { q: 46, text: "Choose the correct sentence.", options: "a) Its obvious the firm lost it's way. b) It's obvious the firm lost its way. c) Its obvious the firm lost its way. d) It's obvious the firm lost it's way." },
                { q: 47, text: "Join to show cause and effect: 'The soil is poor. Farming is difficult.'", options: "a) The soil is poor, farming is difficult. b) The soil is poor so farming is difficult. c) The soil is poor, so farming is difficult. d) The soil is poor. So farming is difficult." },
                { q: 48, text: "Choose the correct sentence.", options: "a) Despite he tried hard, he failed. b) Despite trying hard, he failed. c) Despite of trying hard, he failed. d) Although trying hard, he failed." },
                { q: 49, text: "Where does the comma belong?", options: "a) If prices fall demand, will rise. b) If prices fall, demand will rise. c) If, prices fall demand will rise. d) If prices, fall demand will rise." },
                { q: 50, text: "Choose the error: 'She neither called, nor she emailed.'", options: "a) neither should be either b) nor she emailed should be nor did she email c) called should be calls d) no error" },
              ],
            },
          },
          {
            code: "H.F",
            title: "Section F · Complex and Advanced Sentences (Q51–Q60)",
            titleBn: "সেকশন F · Complex and Advanced Sentences",
            content: {
              questions: [
                { q: 51, text: "Choose the correct relative pronoun: 'Firms ______ pollute rivers should be fined.'", options: "a) who b) whom c) that d) whose" },
                { q: 52, text: "Choose the correctly formed non-defining clause.", options: "a) My car that is new is fast. b) My car, which is new, is fast. c) My car, that is new, is fast. d) My car which is new, is fast." },
                { q: 53, text: "Complete the second conditional: 'If I ______ rich, I would travel the world.'", options: "a) am b) will be c) were d) would be" },
                { q: 54, text: "Complete the first conditional: 'If it ______ tomorrow, we will cancel the trip.'", options: "a) rains b) rained c) will rain d) would rain" },
                { q: 55, text: "Choose the correct comparative.", options: "a) This method is more easier. b) This method is easier. c) This method is more easy. d) This method is easiest than that." },
                { q: 56, text: "Choose the correct passive form: 'The bridge ______ in 1995.'", options: "a) was build b) was built c) were built d) is built" },
                { q: 57, text: "Choose the sentence with no dangling modifier.", options: "a) Running fast, the bus was missed. b) Running fast, I still missed the bus. c) Running fast, the door closed. d) Running fast, my bag fell." },
                { q: 58, text: "Choose the correctly formed inverted sentence.", options: "a) Not only she sings, but also dances. b) Not only does she sing, but she also dances. c) Not only sings she, but also dances. d) Not only she does sing, but dances." },
                { q: 59, text: "Choose the best nominalised version of 'The economy grew quickly, which pleased investors.'", options: "a) The economy grew quickly and it pleased investors. b) The rapid growth of the economy pleased investors. c) The economy was grown quickly, pleasing investors. d) Quickly the economy grew, pleasing investors." },
                { q: 60, text: "Choose the correct cleft sentence.", options: "a) What matters is quality, not quantity. b) What matter is quality, not quantity. c) What is matter is quality. d) That matters is quality, not quantity." },
              ],
            },
          },
          {
            code: "H.predictor",
            title: "Band Score Predictor (same scale as Test A)",
            titleBn: "Band Score Predictor",
            content: {
              scale: [
                { total: "54 to 60", band: "Band 8.0 to 9.0" },
                { total: "46 to 53", band: "Band 7.0 to 7.5" },
                { total: "37 to 45", band: "Band 6.0 to 6.5" },
                { total: "28 to 36", band: "Band 5.0 to 5.5" },
                { total: "Below 28", band: "Band 4.5 or lower" },
              ],
              key: "Now compare with Test A, total and by section. Any section that is still below 7 out of 10 is where your final week of revision should go: re-read that chapter, re-do its exercises, and check that its errors are logged in your personal error log (Appendix C). Real, measured progress on this table is the proof that the method has worked.",
              bn: "Test A-এর সঙ্গে মিলিয়ে দেখুন। কোনো section এখনো ১০-এ ৭-এর নিচে হলে, সেটাই শেষ সপ্তাহের রিভিশন নেবে। এই সারণিতে মাপা অগ্রগতিই প্রমাণ যে পদ্ধতিটি কাজ করেছে।",
            },
          },
        ],

        exercises: [],

        answerKey: {
          "Section A · Subject-Verb Agreement": [
            { q: 1, answer: "b) is", why: "'mathematics' as a subject name is singular." },
            { q: 2, answer: "b) has", why: "the subject is 'quality' (singular), not 'products.'" },
            { q: 3, answer: "c) have", why: "'a number of' means 'several' and takes a plural verb." },
            { q: 4, answer: "c) is", why: "'every … and …' is treated as singular." },
            { q: 5, answer: "c) are", why: "two subjects joined by 'and' are plural." },
            { q: 6, answer: "b) is", why: "the subject is 'variety' (singular)." },
            { q: 7, answer: "c) is", why: "with 'neither … nor,' the verb agrees with the nearer subject, 'chair' (singular)." },
            { q: 8, answer: "c) is", why: "a sum of money is a single quantity: singular." },
            { q: 9, answer: "c) is", why: "'news' is uncountable and singular despite the final -s.", bn: "news uncountable।" },
            { q: 10, answer: "b) has", why: "'each of' is always singular." },
          ],
          "Section B · Tenses": [
            { q: 11, answer: "b) employed", why: "finished year (2012): past simple." },
            { q: 12, answer: "c) have grown", why: "'over the past five years' reaches to now: present perfect." },
            { q: 13, answer: "b) had", why: "an action completed before another past point: past perfect." },
            { q: 14, answer: "c) will rise", why: "a real future prediction: first conditional." },
            { q: 15, answer: "b) melts", why: "a general scientific truth: present simple." },
            { q: 16, answer: "c) has worked", why: "'since 2016' reaches to now: present perfect.", bn: "since + present perfect।" },
            { q: 17, answer: "c) is considering", why: "'currently': present continuous." },
            { q: 18, answer: "a) is growing should be grew", why: "'last decade' is finished time." },
            { q: 19, answer: "c) opened", why: "'two years ago' is finished time: past simple." },
            { q: 20, answer: "a) have finished should be finished", why: "a stated year (2020) forces the simple past.", bn: "নির্দিষ্ট বছর থাকলে past simple।" },
          ],
          "Section C · Articles and Nouns": [
            { q: 21, answer: "c) The", why: "'the sun' is unique." },
            { q: 22, answer: "a) a", why: "'university' begins with a 'y' consonant sound, so 'a.'", bn: "a university।" },
            { q: 23, answer: "c) Education", why: "a general uncountable idea takes the zero article." },
            { q: 24, answer: "b) advice", why: "'advice' is uncountable: no 'a,' no plural.", bn: "advice uncountable।" },
            { q: 25, answer: "c) the", why: "'the number of' is specific." },
            { q: 26, answer: "d) (no article)", why: "a general abstract noun ('honesty') takes the zero article." },
            { q: 27, answer: "c) the", why: "ordinals ('first') take 'the.'" },
            { q: 28, answer: "b) data", why: "'datas' is never correct; treat as a mass noun here." },
            { q: 29, answer: "a) a serious problem", why: "a singular countable noun needs an article.", bn: "article বাদ পড়েছে, বাংলা প্রভাব।" },
            { q: 30, answer: "b) an / the", why: "first mention 'an umbrella,' then the known 'the umbrella.'" },
          ],
          "Section D · Prepositions": [
            { q: 31, answer: "c) by", why: "a change of quantity: 'increase by.'" },
            { q: 32, answer: "a) from / to", why: "a range of change: 'from X to Y.'" },
            { q: 33, answer: "b) to", why: "'fell/dropped to' a destination value." },
            { q: 34, answer: "b) on", why: "'depend on.'" },
            { q: 35, answer: "c) to", why: "'contribute to.'" },
            { q: 36, answer: "b)", why: "'discuss' takes a direct object, no preposition.", bn: "discuss about ভুল।" },
            { q: 37, answer: "c) for", why: "'responsible for.'" },
            { q: 38, answer: "b) at / on", why: "'at 9 a.m.,' 'on weekdays.'" },
            { q: 39, answer: "a) at / in", why: "'stood at' a value, 'in' a year." },
            { q: 40, answer: "a) In my opinion", why: "'according to' is never used for yourself.", bn: "'আমার মতে' = in my opinion।" },
          ],
          "Section E · Clause Structure and Punctuation": [
            { q: 41, answer: "c)", why: "two independent clauses need a comma plus a conjunction ('so')." },
            { q: 42, answer: "c)", why: "the only option with an independent clause; the rest are fragments." },
            { q: 43, answer: "b)", why: "a fronted 'when' clause takes a comma after it." },
            { q: 44, answer: "c)", why: "a lone comma joining two clauses is a comma splice." },
            { q: 45, answer: "b)", why: "a semicolon joins two related independent clauses." },
            { q: 46, answer: "b)", why: "'It's' = it is; 'its' = belonging to it." },
            { q: 47, answer: "c)", why: "cause and effect with a comma plus 'so.'" },
            { q: 48, answer: "b)", why: "'despite' takes an -ing form, not a full clause.", bn: "despite + verb+ing।" },
            { q: 49, answer: "b)", why: "the comma follows the fronted 'if' clause." },
            { q: 50, answer: "b)", why: "after 'nor,' the word order inverts: 'nor did she email.'" },
          ],
          "Section F · Complex and Advanced Sentences": [
            { q: 51, answer: "c) that", why: "'that' is standard in a defining clause ('which' also acceptable)." },
            { q: 52, answer: "b)", why: "a non-defining clause uses 'which' with commas on both sides." },
            { q: 53, answer: "c) were", why: "the second conditional uses 'were' for all subjects.", bn: "if I were।" },
            { q: 54, answer: "a) rains", why: "the first conditional uses the present tense in the 'if' clause." },
            { q: 55, answer: "b) easier", why: "never combine 'more' with '-er.'" },
            { q: 56, answer: "b) was built", why: "singular subject, past passive: 'was' + past participle." },
            { q: 57, answer: "b)", why: "the -ing phrase must describe the subject; only in (b) is 'I' doing the running." },
            { q: 58, answer: "b)", why: "after fronted 'not only,' the auxiliary inverts: 'not only does she sing.'" },
            { q: 59, answer: "b)", why: "the nominalised version turns 'grew' into the noun 'growth.'" },
            { q: 60, answer: "a)", why: "a correct what-cleft with a singular verb: 'What matters is …'." },
          ],
        },
      },
    },
  });

  console.log("\u2705 Appendix H seeded successfully");
}

// ============================================================
// APPENDIX I · Glossary of Grammar Terms
// ============================================================

async function seedAppendixI() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Appendix I · Glossary of Grammar Terms",
      titleBn: "পরিশিষ্ট ঝ · ব্যাকরণ পরিভাষার শব্দকোষ",
      position: 20,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Back Matter & Toolkit",
        intro:
          "This book assumes you know nothing, so every technical word is explained here in plain English, with a short Bangla gloss. Whenever a chapter uses a term you are unsure of, look it up here. The terms are in alphabetical order.",
        introBn:
          "পরিশিষ্ট ঝ-এর মূল কথা: এই বই ধরে নেয় আপনি কিছুই জানেন না, তাই প্রতিটি পারিভাষিক শব্দ এখানে সহজ ভাষা ও বাংলায় ব্যাখ্যা করা হলো। কোনো অধ্যায়ে অচেনা শব্দ পেলে এখানে দেখে নিন। বর্ণানুক্রমে সাজানো।",

        sections: [
          {
            code: "I.1",
            title: "The glossary (A to Z)",
            titleBn: "শব্দকোষ (A থেকে Z)",
            content: {
              terms: [
                { term: "active voice", en: "the subject does the action: 'Workers built the bridge'", bn: "কর্তা কাজটি করে" },
                { term: "adjective", en: "a word that describes a noun: tall, useful, difficult", bn: "বিশেষণ" },
                { term: "adverb", en: "a word that describes a verb, often ending in -ly: quickly, carefully", bn: "ক্রিয়া বিশেষণ" },
                { term: "adverbial clause", en: "a dependent clause of time, reason, contrast, etc.: 'although it rained …'", bn: "ক্রিয়া-বিশেষণ উপবাক্য" },
                { term: "agreement", en: "matching the verb to its subject in number: 'he goes / they go'", bn: "কর্তা-ক্রিয়ার মিল" },
                { term: "article", en: "a, an, the, or none (zero article)", bn: "article (a/an/the)" },
                { term: "aspect", en: "whether an action is simple, in progress, or completed (simple, continuous, perfect)", bn: "ক্রিয়ার ধারা" },
                { term: "auxiliary verb", en: "a helping verb: be, have, do, and modals", bn: "সহায়ক ক্রিয়া" },
                { term: "base verb", en: "the plain form of a verb, with no ending: go, work, rise", bn: "ক্রিয়ার মূল রূপ" },
                { term: "clause", en: "a group of words with a subject and a verb", bn: "উপবাক্য (subject+verb)" },
                { term: "cleft sentence", en: "a sentence split for emphasis: 'What is needed is …'", bn: "জোর দেওয়ার জন্য ভাঙা বাক্য" },
                { term: "collective noun", en: "a word for a group: team, government, family", bn: "সমষ্টিবাচক বিশেষ্য" },
                { term: "collocation", en: "words that naturally go together: make a decision, heavy rain", bn: "স্বাভাবিক শব্দজোড়" },
                { term: "comma splice", en: "wrongly joining two full sentences with only a comma", bn: "শুধু কমা দিয়ে দুই বাক্য জোড়ার ভুল" },
                { term: "comparative", en: "the -er / more form: cheaper, more useful", bn: "তুলনামূলক রূপ" },
                { term: "complex sentence", en: "one independent clause plus a dependent clause", bn: "জটিল বাক্য" },
                { term: "compound sentence", en: "two independent clauses joined by and, but, so, etc.", bn: "যৌগিক বাক্য" },
                { term: "conditional", en: "an 'if … then' sentence (zero, first, second, third, mixed)", bn: "শর্তবাচক বাক্য" },
                { term: "conjunction", en: "a joining word: and, but, because, although", bn: "সংযোজক শব্দ" },
                { term: "coordinating conjunction", en: "joins equal parts: for, and, nor, but, or, yet, so (FANBOYS)", bn: "সমমানের সংযোজক" },
                { term: "countable noun", en: "a noun you can count, with a plural: book, books", bn: "গণনাযোগ্য বিশেষ্য" },
                { term: "defining relative clause", en: "a clause that identifies which one, no commas: 'students who cheat'", bn: "নির্দিষ্টকারী relative clause" },
                { term: "dependent clause", en: "a clause that cannot stand alone: 'because it was late'", bn: "পরাধীন উপবাক্য" },
                { term: "dependent preposition", en: "a fixed preposition after a word: depend on, interested in", bn: "নির্দিষ্ট preposition" },
                { term: "fragment", en: "an incomplete sentence punctuated as if complete", bn: "অসম্পূর্ণ বাক্য" },
                { term: "fronting", en: "moving a phrase to the front for emphasis", bn: "সামনে আনা" },
                { term: "gerund", en: "the -ing form used as a noun: 'Reading is useful'", bn: "ক্রিয়া থেকে তৈরি বিশেষ্য (-ing)" },
                { term: "GRA", en: "Grammatical Range and Accuracy, an IELTS scoring criterion", bn: "গ্রামারের পরিসর ও নির্ভুলতা" },
                { term: "hedging", en: "making a claim cautiously: may, tend to, is likely to", bn: "সতর্ক ভাষা" },
                { term: "independent clause", en: "a clause that can stand alone as a sentence", bn: "স্বাধীন উপবাক্য" },
                { term: "indefinite pronoun", en: "each, every, everyone, neither (usually singular)", bn: "অনির্দিষ্ট সর্বনাম" },
                { term: "infinitive", en: "the 'to' form of a verb: to go, to study", bn: "to-যুক্ত ক্রিয়া" },
                { term: "inversion", en: "reversing subject and auxiliary for emphasis: 'Rarely does he …'", bn: "কর্তা-ক্রিয়ার উল্টো ক্রম" },
                { term: "modal verb", en: "can, could, may, might, will, would, should, must", bn: "মোডাল ক্রিয়া" },
                { term: "nominalisation", en: "turning a verb or adjective into a noun: 'increase, importance'", bn: "ক্রিয়া/বিশেষণকে বিশেষ্যে রূপান্তর" },
                { term: "non-defining relative clause", en: "a clause adding extra information, with commas", bn: "অতিরিক্ত-তথ্য relative clause" },
                { term: "noun", en: "a word for a person, place, thing, or idea", bn: "বিশেষ্য" },
                { term: "object", en: "the person or thing receiving the action: 'She read the book'", bn: "কর্ম" },
                { term: "participle", en: "a verb form used as an adjective or in tenses: broken, rising", bn: "কৃদন্ত" },
                { term: "passive voice", en: "the subject receives the action: 'The bridge was built'", bn: "কর্মবাচ্য" },
                { term: "past participle", en: "the third verb form: gone, written, risen", bn: "ক্রিয়ার তৃতীয় রূপ" },
                { term: "preposition", en: "a small word showing relationship: in, on, at, by, for", bn: "পদান্বয়ী অব্যয়" },
                { term: "pronoun", en: "a word replacing a noun: he, she, it, they, who", bn: "সর্বনাম" },
                { term: "relative clause", en: "a clause describing a noun with who, which, that", bn: "সম্বন্ধবাচক উপবাক্য" },
                { term: "relative pronoun", en: "who, which, that, where, whose", bn: "সম্বন্ধবাচক সর্বনাম" },
                { term: "run-on sentence", en: "two sentences joined with no punctuation or conjunction", bn: "যতিচিহ্নহীন জোড়া বাক্য" },
                { term: "simple sentence", en: "one independent clause: 'Cities offer jobs'", bn: "সরল বাক্য" },
                { term: "stative verb", en: "a verb of state, not action: know, want, believe (no -ing)", bn: "অবস্থাবাচক ক্রিয়া" },
                { term: "subject", en: "the doer of the action: 'Students study'", bn: "কর্তা" },
                { term: "subordinating conjunction", en: "begins a dependent clause: because, although, if, when", bn: "পরাধীন-উপবাক্যের সংযোজক" },
                { term: "superlative", en: "the -est / most form: cheapest, most useful", bn: "সর্বোচ্চ রূপ" },
                { term: "tense", en: "the time of a verb: past, present, or future", bn: "কাল" },
                { term: "uncountable noun", en: "a noun with no plural: information, advice, water", bn: "অগণনাযোগ্য বিশেষ্য" },
                { term: "verb", en: "an action or state word: go, build, is", bn: "ক্রিয়া" },
                { term: "zero article", en: "using no article before a general or uncountable noun", bn: "article না বসানো" },
              ],
            },
          },
        ],
        exercises: [],
        answerKey: {},
      },
    },
  });

  console.log("\u2705 Appendix I seeded successfully");
}

// ============================================================
// APPENDIX J · Module Cheat Sheets
// ============================================================

async function seedAppendixJ() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Appendix J · Module Cheat Sheets",
      titleBn: "পরিশিষ্ট ঞ · মডিউল চিট শিট",
      position: 21,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Back Matter & Toolkit",
        intro:
          "One page per module, condensing every rule into scannable reminders. Photocopy these, stick them above your desk, and glance at them before every practice session and on the morning of the exam. They are memory triggers, not teaching; if a line does not make sense, go back to the chapter.",
        introBn:
          "পরিশিষ্ট ঞ-এর মূল কথা: প্রতি মডিউলের এক পৃষ্ঠা সারসংক্ষেপ। ডেস্কের উপর টাঙিয়ে রাখুন, প্রতিটি অনুশীলনের আগে ও পরীক্ষার সকালে চোখ বুলিয়ে নিন। এগুলো শেখানো নয়, স্মৃতির ট্রিগার; কোনো লাইন না বুঝলে অধ্যায়ে ফিরে যান।",

        sections: [
          {
            code: "J.1",
            title: "Cheat Sheet · Module 1 (Accuracy)",
            titleBn: "চিট শিট · মডিউল ১ (Accuracy)",
            content: {
              blocks: [
                { heading: "Subject-verb agreement (Ch 1)", lines: [
                  "He / she / it and singular subjects: verb takes -s (he goes). Plural: no -s (they go).",
                  "Find the true subject; delete the words in between: 'The list of items is …'.",
                  "Singular: the number of, each of, every, everyone, neither, information, ten years (an amount), the government (as a unit).",
                  "Plural: a number of, both, the students.",
                ] },
                { heading: "Tenses (Ch 2)", lines: [
                  "Finished time (in 2010, last year, ago) = past simple.",
                  "Reaches now (since, for, over the past decade) = present perfect.",
                  "Happening now (currently, nowadays) = present continuous.",
                  "General truth or habit = present simple.",
                  "Stative verbs (know, want, believe, have) never take -ing.",
                ] },
                { heading: "Articles (Ch 3)", lines: [
                  "Specific / unique / already mentioned = the.",
                  "New, singular, countable = a / an (by sound: an hour, a university).",
                  "General plural or general uncountable = no article.",
                  "Never a / an with uncountables: some advice, a piece of information.",
                ] },
                { heading: "Prepositions (Ch 4)", lines: [
                  "Data: rise by 10%, from X to Y, a peak of, stood at.",
                  "Fixed: depend on, lead to, result in, responsible for, interested in, solution to.",
                  "Never: discuss about, according to me, enter into, return back.",
                ] },
              ],
            },
          },
          {
            code: "J.2",
            title: "Cheat Sheet · Module 2 (Range)",
            titleBn: "চিট শিট · মডিউল ২ (Range)",
            content: {
              blocks: [
                { heading: "Complex sentences (Ch 5)", lines: [
                  "Fronted dependent clause takes a comma: 'Although it is costly, it works.'",
                  "Defining clause: no commas ('students who cheat'). Non-defining: commas both sides ('Dhaka, which is the capital,').",
                  "Use that only in defining clauses; use which / who in non-defining.",
                  "Never repeat the subject: People who live in cities they pay more.",
                  "Join two full clauses only by: full stop, semicolon, comma + FANBOYS, or a subordinator. Never a lone comma.",
                ] },
                { heading: "Passive (Ch 6)", lines: [
                  "Form: be + past participle. Tense sits in be; the participle stays the same.",
                  "Use for processes (the beans are dried) and impersonal claims (It is argued that …).",
                  "Get the participle right: was built, was written, are transported.",
                ] },
                { heading: "Conditionals and hedging (Ch 7)", lines: [
                  "Zero: if + present, present. First: if + present, will. Second: if + past (were), would. Third: if + had + p.p., would have + p.p.",
                  "Never will / would directly after if.",
                  "Hedge big claims: may, tend to, is likely to, in many cases, not always / everyone / will definitely.",
                ] },
              ],
            },
          },
          {
            code: "J.3",
            title: "Cheat Sheet · Module 3 (Band 8.5 to 9)",
            titleBn: "চিট শিট · মডিউল ৩ (ব্যান্ড ৮.৫–৯)",
            content: {
              blocks: [
                { heading: "Inversion (Ch 8)", lines: [
                  "After a fronted negative adverbial, invert like a question: 'Rarely does a policy satisfy everyone.'",
                  "If no auxiliary, add do / does / did and return the main verb to its base.",
                  "Triggers: not only … but also, never, rarely, hardly ever, only after, under no circumstances.",
                ] },
                { heading: "Cleft sentences (Ch 8)", lines: [
                  "It-cleft (spotlight a noun / time): 'It is education that drives development.'",
                  "What-cleft (spotlight a need / action): 'What is needed is stronger regulation.' (singular verb is).",
                ] },
                { heading: "Nominalisation (Ch 9)", lines: [
                  "Turn a verb / adjective into a noun and build around it: 'The population increased' → 'an increase in the population'.",
                  "Collapse two clauses into one dense one: 'Because cities expanded, traffic worsened' → 'Urban expansion led to worse traffic.'",
                ] },
              ],
              key: "Golden rule for Module 3: use each of these sparingly and accurately. One correct inversion and one cleft per essay is plenty. A broken one is worse than a plain correct sentence.",
              bn: "মডিউল ৩-এর সোনালি নিয়ম: পরিমিত ও নির্ভুলভাবে ব্যবহার করুন। রচনায় একটি inversion ও একটি cleft-ই যথেষ্ট। ভুল একটি সঠিক সাধারণ বাক্যের চেয়েও খারাপ।",
            },
          },
          {
            code: "J.4",
            title: "Cheat Sheet · Module 4 (Self-correction)",
            titleBn: "চিট শিট · মডিউল ৪ (Self-correction)",
            content: {
              coreFact: "The proofreading audit (run one pass per code, in this order):",
              audit: [
                "SVA: every verb matches its true subject?",
                "A: every singular noun has an article? no a / plural on uncountables?",
                "T: timeline right? finished = past; since / for = present perfect?",
                "P: data prepositions and dependent prepositions correct? no discuss about / according to me?",
                "C: no comma splice, run-on, or fragment?",
                "WF / WW: no more better, adjective-for-adverb, wrong word?",
                "COND: no will / would after if?",
              ],
              key: "If you have time for only two passes: do SVA and A. That is where most Bangladeshi candidates lose the most marks. The seven that fix the most for the least effort (last-hour list): 1. Add -s for he / she / it. 2. The before specific nouns; no a / an with uncountables. 3. Match tense to the time word. 4. No will / would after if. 5. Join clauses legally; never a lone comma. 6. Hedge big claims. 7. Keep two minutes for the SVA and article passes.",
              bn: "সময় কম হলে শুধু SVA আর A করুন—এখানেই বেশিরভাগ নম্বর কাটে।",
            },
          },
        ],
        exercises: [],
        answerKey: {},
      },
    },
  });

  console.log("\u2705 Appendix J seeded successfully");
}

// ============================================================
// RUNNER · clean out old appendices, then re-seed all 10 fresh
// ------------------------------------------------------------
// এই runner নিরাপদ ও পুনরাবৃত্তিযোগ্য (idempotent):
//   1) আগে সব পুরনো Appendix row মুছে দেয় (ডুপ্লিকেট রোধ)
//   2) তারপর এক এক করে ১০টা appendix বসায়
//   3) কোনো একটায় সমস্যা হলেও থেমে না গিয়ে বাকিগুলো চেষ্টা করে
//   4) শেষে গুনে দেখায় ঠিক ১০টা ঢুকেছে কিনা
// যতবার খুশি চালান — প্রতিবার হুবহু ১০টা সম্পূর্ণ appendix থাকবে।
// ============================================================

async function main() {
  // ---- ধাপ ১: পুরনো সব Appendix মুছে ফেলা ----
  // Chapter (position 2–11) অক্ষত থাকবে; শুধু Appendix (title 'Appendix%') মুছবে।
  const deleted = await prisma.lessons.deleteMany({
    where: {
      section: "grammar",
      title: { startsWith: "Appendix" },
    },
  });
  console.log(`\uD83E\uDDF9 Cleared ${deleted.count} old appendix row(s).`);

  // ---- ধাপ ২: সব appendix এক এক করে বসানো (error-resilient) ----
  const seeders: Array<[string, () => Promise<void>]> = [
    ["Appendix A", seedAppendixA],
    ["Appendix B", seedAppendixB],
    ["Appendix C", seedAppendixC],
    ["Appendix D", seedAppendixD],
    ["Appendix E", seedAppendixE],
    ["Appendix F", seedAppendixF],
    ["Appendix G", seedAppendixG],
    ["Appendix H", seedAppendixH],
    ["Appendix I", seedAppendixI],
    ["Appendix J", seedAppendixJ],
  ];

  let ok = 0;
  const failed: string[] = [];
  for (const [name, fn] of seeders) {
    try {
      await fn();
      ok++;
    } catch (e) {
      failed.push(name);
      console.error(`\u274C ${name} failed:`, e);
    }
  }

  // ---- ধাপ ৩: যাচাই ----
  const total = await prisma.lessons.count({
    where: { section: "grammar", title: { startsWith: "Appendix" } },
  });

  console.log("\n----------------------------------------");
  console.log(`\u2705 Seeded OK : ${ok} / 10`);
  if (failed.length) {
    console.log(`\u274C Failed   : ${failed.join(", ")}`);
  }
  console.log(`\uD83D\uDCCA In DB now : ${total} appendix row(s)`);
  if (total === 10 && failed.length === 0) {
    console.log("\uD83C\uDF89 All appendices (A\u2013J) present. Nothing is missing.");
  } else {
    console.log("\u26A0\uFE0F  Not all 10 are present. Check the errors above.");
  }
  console.log("----------------------------------------");
}

main()
  .catch((e) => {
    console.error("\u274C Seeding crashed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });