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
// MODULE 2 · IELTS READING · Tips & Tricks  (VERBATIM)
// ------------------------------------------------------------
// এই seed script Reading মডিউলের ৮টি File (08–15) কে
// section: "tips" এর অধীনে lessons টেবিলে বসায়, position 18–25.
// ইংরেজি লেখা PDF থেকে হুবহু (verbatim), কিছুই সংক্ষেপ করা হয়নি।
// Bangla অনুবাদ clean রাখা হয়েছে।
//
// প্রতিটি lesson.body-তে:
//   intro / introBn   → PDF-এর হুবহু ভূমিকা
//   sections[]        → { code, title, titleBn, content }
//   exercises[]       → পড়ার drill (প্রশ্ন verbatim)
//   answerKey         → verbatim answer key ও reasoning
//
// position ম্যাপিং (ReadingTipsList.tsx এর filter 18–23 হলেও,
// নিচে READING_TIP_END = 25 করলে সব ৮টা দেখাবে):
//   File 08 → 18   File 09 → 19   File 10 → 20   File 11 → 21
//   File 12 → 22   File 13 → 23   File 14 → 24   File 15 → 25
// ============================================================

// ────────────────────────────────────────────────────────────
// FILE 08 · Understanding IELTS Reading & the Reading Mindset
// ────────────────────────────────────────────────────────────
async function seedFile08() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 08 · Understanding IELTS Reading & the Reading Mindset",
      titleBn: "ফাইল ০৮ · IELTS Reading বোঝা ও Reading মানসিকতা",
      position: 18,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Module 2: IELTS Reading",
        intro:
          "Reading looks easier than Listening, because the text sits still and waits for you. That is exactly the trap. In Listening the recording controls the clock; in Reading, you do, and most candidates spend their sixty minutes badly, reading every word of the first passage in loving detail and then racing the last one in a panic.\n\nThis module retrains that instinct completely. IELTS Reading is not a test of whether you can read English. It is a test of whether you can find specific information fast, check that it truly answers the question, and move on before the clock beats you. Those are different skills from ordinary reading, and they can be learned precisely. That is what the next chapters do.\n\nWe begin, as always, by understanding how the test is actually built.",
        sections: [
          {
            code: "P1",
            title: "PART 1 · UNDERSTANDING IELTS READING — The shape of the test",
            titleBn: "IELTS Reading বোঝা · টেস্টের আকৃতি",
            content: {
              coreFact:
                "Three passages. Forty questions. Sixty minutes. That is the whole test, and every strategy in this module bends to those three numbers.\n\nThe passages get harder as you go. Passage 1 is the most approachable, Passage 3 the densest. The questions do not get points for difficulty: a hard question in Passage 3 is worth exactly one mark, the same as an easy question in Passage 1. Hold that thought, because it governs how you should spend your time.",
              bn: "তিনটি প্যাসেজ, ৪০টি প্রশ্ন, ৬০ মিনিট — এটাই পুরো টেস্ট। প্যাসেজ যত এগোয় তত কঠিন হয়। কঠিন প্রশ্নও সহজ প্রশ্নের সমান ১ নম্বর, তাই সময় ভাগ করা জরুরি।",
            },
          },
          {
            code: "P1.time",
            title: "The sixty-minute limitation, and why it is the real test",
            titleBn: "ষাট মিনিটের সীমা, ও কেন এটাই আসল পরীক্ষা",
            content: {
              principle:
                "There is no extra time to transfer or tidy your answers. The sixty minutes is everything. When it ends, your paper ends. Reading is not a reading test with a time limit; it is a time-management test that happens to use reading.",
              principleBn:
                "নীতি: উত্তর সরানো বা গোছানোর বাড়তি সময় নেই। ৬০ মিনিটই সব। Reading আসলে time-management টেস্ট, যা reading ব্যবহার করে।",
              coreFact:
                "Do the arithmetic. Three passages of roughly seven hundred to nine hundred words each, plus forty questions to locate, verify, and answer, all in sixty minutes. That is about twenty minutes per passage including its questions. Within twenty minutes you cannot read nine hundred words slowly, understand every sentence, and then answer thirteen questions carefully. It is not possible, and the test knows it is not possible. The test is designed to punish the candidate who tries to read everything.\n\nThis is why every high scorer reads selectively. Not because careful reading is bad, but because there is no time for it, and spending your minutes on words that hold no answer is how you lose the passage you never reach.",
            },
          },
          {
            code: "P1.passages",
            title: "The passages · How you answer",
            titleBn: "প্যাসেজগুলো · কীভাবে উত্তর দেবেন",
            content: {
              coreFact:
                "In the Academic test, the three passages are taken from books, journals, magazines, and newspapers, written for a general educated audience. The topics are academic in flavour but never require specialist knowledge; everything you need to answer is in the text. You are never expected to bring outside facts, and doing so is a trap we will name later.\n\nIf you are sitting the General Training test, your reading uses more everyday texts, notices, advertisements, handbooks, and workplace documents, and they start easier. The good news is that every strategy in this module works identically on both. The techniques do not change; only the texts do.",
              coreFact2:
                "How you answer. On the computer-delivered test, which is now the standard, you type answers or click options directly on screen as you work, and you can highlight text and make notes as you go. Spelling counts in every written answer, exactly as in Listening. There is no separate answer sheet to copy onto and no reward for neatness, only for being right and being finished.",
              bn: "Academic-এ প্যাসেজ বই/জার্নাল/পত্রিকা থেকে; বিশেষজ্ঞ জ্ঞান লাগে না, সব উত্তর টেক্সটেই আছে। General Training-এ দৈনন্দিন টেক্সট, শুরুতে সহজ। কৌশল দুটোতেই একই। বানান গোনা হয়; পরিপাটির নম্বর নেই, শুধু সঠিক ও শেষ করার।",
            },
          },
          {
            code: "P1.difficulty",
            title: "Passage difficulty · Why reading every word is inefficient",
            titleBn: "প্যাসেজের কাঠিন্য · কেন প্রতিটি শব্দ পড়া অদক্ষ",
            content: {
              coreFact:
                "Because difficulty rises across the three passages, the marks are not evenly easy. Passage 1 usually offers the quickest marks in the test. Passage 3 usually offers the slowest. A candidate who spends thirty minutes perfecting Passage 3 and leaves Passage 1 half-done has traded cheap marks for expensive ones. The battle plan in File 14 turns this into an exact time strategy for each band, but plant the principle now: secure the cheap marks first.",
              coreFact2:
                "Ordinary reading is linear: you start at the top and absorb everything in order. IELTS Reading rewards the opposite. Most questions ask about one specific place in the passage, and the other eighty per cent of the text is irrelevant to that question. Reading it all in advance means reading most of it for no reason, then reading the relevant part again when the question sends you back.\n\nThe efficient candidate does not read the passage to understand it. They read the passage to build a rough map of where things are, then let each question send them to the exact spot that answers it. Understanding is not the goal. Locating is the goal. This is the reframe the whole module is built on, and Part 2 develops it fully.",
              bn: "সস্তা নম্বর আগে নিন — Passage 1 দ্রুত নম্বর দেয়। প্রতিটি শব্দ পড়া অপচয়; বেশিরভাগ প্রশ্ন একটি নির্দিষ্ট জায়গা নিয়ে, বাকি ৮০% অপ্রাসঙ্গিক। লক্ষ্য বোঝা নয় — locate করা।",
            },
          },
          {
            code: "P1.band",
            title: "How the raw score becomes a band",
            titleBn: "raw score কীভাবে band হয়",
            content: {
              coreFact:
                "Forty questions, one mark each, no penalty for wrong answers, so you never leave a blank. The raw score converts to the nine-band scale. The table below is indicative for Academic Reading and shifts slightly between versions.",
              table: [
                { raw: "39 to 40", band: "9.0" },
                { raw: "37 to 38", band: "8.5" },
                { raw: "35 to 36", band: "8.0" },
                { raw: "33 to 34", band: "7.5" },
                { raw: "30 to 32", band: "7.0" },
                { raw: "27 to 29", band: "6.5" },
                { raw: "23 to 26", band: "6.0" },
                { raw: "19 to 22", band: "5.5" },
                { raw: "15 to 18", band: "5.0" },
              ],
              coreFact2:
                "General Training is marked on a stricter scale, because its texts are easier, so you need more correct answers for the same band. Read your own scale strategically: to reach Band 7 in Academic you can miss eight to ten questions. That means one genuinely hard question is never worth sacrificing three easy ones for.",
              bn: "৪০ প্রশ্ন, প্রতিটি ১ নম্বর, ভুলে জরিমানা নেই — কখনো ফাঁকা রাখবেন না। Academic-এ Band 7-এ ৮-১০টা ভুল করা যায়; একটা কঠিন প্রশ্নের জন্য তিনটা সহজ কখনো ছাড়বেন না।",
            },
          },
          {
            code: "P1.types",
            title: "The question types you will meet",
            titleBn: "যেসব প্রশ্নের ধরন পাবেন",
            content: {
              coreFact: "Each gets a full chapter later. Recognise the family now:",
              bullets: [
                "Multiple choice",
                "True / False / Not Given",
                "Yes / No / Not Given",
                "Matching Headings",
                "Matching Information",
                "Matching Features",
                "Matching Sentence Endings",
                "Sentence Completion",
                "Summary Completion",
                "Note Completion",
                "Table Completion",
                "Flow-chart Completion",
                "Diagram Labelling",
                "Short Answer",
              ],
              tutorTip:
                "The most dangerous passage is not Passage 3. It is Passage 1, because that is where over-confident candidates read too slowly and too fully, feeling relaxed, and quietly spend the minutes that Passage 3 will later beg for. Guard your clock hardest when the reading feels easy.",
              tutorTipBn:
                "সবচেয়ে বিপজ্জনক প্যাসেজ ৩ নয়, বরং ১ — কারণ সহজ মনে হওয়ায় অতিরিক্ত আত্মবিশ্বাসী শিক্ষার্থী ধীরে ও পুরোটা পড়ে সময় নষ্ট করে, আর সেই সময়টাই পরে প্যাসেজ ৩-এ দরকার হয়। পড়া সহজ লাগলেই ঘড়ি সবচেয়ে কড়া পাহারা দিন।",
            },
          },
          {
            code: "P2",
            title: "PART 2 · THE READING MINDSET",
            titleBn: "Reading মানসিকতা",
            content: {
              principle:
                "IELTS Reading is not a reading comprehension exercise. It is a location and verification task. You are not trying to understand the passage. You are trying to find the one place that answers each question, confirm it really does, and record the answer.",
              principleBn:
                "নীতি: IELTS Reading কোনো comprehension অনুশীলন নয় — এটি location ও verification-এর কাজ। প্যাসেজ বোঝা লক্ষ্য নয়; প্রতিটি প্রশ্নের উত্তরের একমাত্র জায়গা খুঁজে, নিশ্চিত করে, উত্তর লেখা লক্ষ্য।",
              coreFact:
                "A candidate who reads to understand runs out of time and still gets caught by traps, because understanding the general gist does not tell you whether a specific statement is True, False, or Not Given. A candidate who reads to locate and verify finishes on time and defeats the traps, because they check the exact evidence for every answer.",
            },
          },
          {
            code: "P2.loop",
            title: "The four-step loop: LOCATE, IDENTIFY, VERIFY, ANSWER",
            titleBn: "চার-ধাপের লুপ: LOCATE, IDENTIFY, VERIFY, ANSWER",
            content: {
              coreFact:
                "Every Reading question, of every type, is answered by the same four moves. Make this loop automatic.",
              steps: [
                { term: "LOCATE", en: "Find the region of the passage the question points to. You do this by scanning for the question’s anchors (names, numbers, dates, distinctive words) or for the paraphrase of its keywords. You are not reading yet; you are hunting for the right neighbourhood." },
                { term: "IDENTIFY", en: "Within that region, find the exact sentence or two that address the question. Now you slow down and read closely, but only these lines, not the whole passage." },
                { term: "VERIFY", en: "Check that these lines genuinely support your answer. This is the step beginners skip, and skipping it is why they fall for traps. A word matching is not enough; the meaning must match. Ask: does this sentence actually say what the question claims, or something subtly different?" },
                { term: "ANSWER", en: "Commit, in the exact form required, respecting any word limit and spelling." },
              ],
              key: "Locate, identify, verify, answer. Fast, then slow, then careful, then done. When you feel lost on a question, name which of the four steps you are stuck on, and the fix becomes obvious: cannot locate means scan wider; cannot verify means read the surrounding sentences more carefully.",
              keyBn: "Locate, identify, verify, answer — দ্রুত, তারপর ধীর, তারপর সাবধান, তারপর শেষ। আটকে গেলে কোন ধাপে আটকেছেন নাম দিন: locate না হলে wider scan; verify না হলে আশপাশের বাক্য আরও যত্নে পড়ুন।",
            },
          },
          {
            code: "P2.gears",
            title: "Strategic reading & the three gears",
            titleBn: "কৌশলী পঠন ও তিন গিয়ার",
            content: {
              coreFact:
                "Passive reading takes the passage on its own terms, start to finish, absorbing whatever comes. Strategic reading takes the passage on your terms, driven by the questions, visiting only the parts that pay.\n\nThe strategic reader does read the passage, but lightly and with purpose: a quick pass to learn the shape (what each paragraph is broadly about), so that when a question arrives they already know roughly which paragraph to visit. They never read a paragraph in full until a question sends them there. Everything is question-led.",
              points: [
                { term: "Skimming (fast gear)", en: "Eyes moving quickly to grasp the general idea and the shape of the text. Used to build the map.", bn: "দ্রুত গিয়ার — general idea ও আকৃতি ধরা; map তৈরি।" },
                { term: "Scanning (search gear)", en: "Eyes hunting for a specific target, a name, a date, a word, ignoring everything else. Used to locate.", bn: "সার্চ গিয়ার — নির্দিষ্ট target খোঁজা; locate করা।" },
                { term: "Close reading (slow gear)", en: "Careful reading of a small patch to identify and verify the answer. Used only on the few lines that matter.", bn: "ধীর গিয়ার — অল্প কয়েক লাইন যত্নে পড়ে identify ও verify।" },
              ],
              coreFact2:
                "The beginner has only one gear, close reading, and drives the whole test in it, and runs out of road. The expert shifts constantly: skim to map, scan to locate, close-read to verify, then back to scan for the next question.",
            },
          },
          {
            code: "P2.time",
            title: "Time is the opponent, not the text",
            titleBn: "প্রতিপক্ষ ঘড়ি, টেক্সট নয়",
            content: {
              coreFact:
                "In Listening, the recording was your opponent. In Reading, the clock is. The text will never speed up or slow down; only your minutes drain. This changes your emotional posture. You must be willing to leave a question, to guess and flag, to abandon a paragraph that is not paying, and above all to refuse to fall in love with a difficult question that is eating your time.",
              tutorTip:
                "Never spend more than a fixed budget on any single question. If you have located the region and still cannot verify the answer after a reasonable look, mark your best guess, flag it, and move on. One question is one mark. The three questions you did not reach because you were stuck on it are also marks, and you gave them away.",
              tutorTipBn:
                "কোনো একটি প্রশ্নে নির্দিষ্ট সময়ের বেশি ব্যয় করবেন না। region খুঁজে পাওয়ার পরও উত্তর নিশ্চিত করতে না পারলে, সেরা অনুমান দিয়ে চিহ্ন দিয়ে এগিয়ে যান। একটি প্রশ্ন একটি নম্বর; আটকে থেকে তিনটি হারাবেন না।",
            },
          },
          {
            code: "P2.expert",
            title: "EXPERT THINKING: the first ninety seconds with a passage",
            titleBn: "বিশেষজ্ঞ চিন্তা: প্যাসেজের প্রথম নব্বই সেকেন্ড",
            content: {
              coreFact: "A candidate turns to a new passage of thirteen questions.",
              examples: [
                { wrong: "WHAT A BEGINNER THINKS: “I should understand this passage before I answer anything.” Reads all nine hundred words slowly, top to bottom, twice for the hard parts. Twelve minutes gone, zero questions answered, and now rushing.", why: "Reading for understanding burns the clock and answers nothing." },
                { wrong: "WHAT AN EXPERIENCED STUDENT THINKS: “Let me skim first.” Skims in three minutes, gets the gist, then starts the questions, locating each one. Solid, and usually finishes, though sometimes tight on Passage 3.", why: "Better, but the skim is not yet shaped by the question types." },
                { right: "WHAT AN EXPERT CANDIDATE NOTICES: Before reading a word of the body, they glance at the question types. Seeing Matching Headings, they know they need each paragraph’s main idea, so their skim targets topic sentences. Seeing True/False/Not Given, they know those follow passage order and will send them to specific lines, so they do not over-skim. They spend ninety seconds building a paragraph map, then let the questions drive, shifting gears with each one, and finish with time to check. Their reading was shaped by the questions before it began.", why: "The difference is not reading speed. It is that the expert reads for the questions, and the beginner reads for understanding the test never asked them to demonstrate." },
              ],
            },
          },
        ],

        exercises: [
          {
            code: "Drill 8.1",
            title: "Gist (Level 1)",
            instruction:
              "Read this short passage once, quickly, as a skim (aim for twenty seconds), then answer in one phrase: what is this passage mainly about? Passage: “The tuatara, a reptile found only in New Zealand, is often called a living fossil. Though it resembles a lizard, it belongs to an older order that flourished over two hundred million years ago and has changed little since. Unusually, the tuatara remains active at low temperatures that would leave most reptiles sluggish, and it can live for more than a century. Females lay eggs only once every few years, and the eggs take over a year to hatch, one of the longest incubation periods of any reptile. Conservation efforts on predator-free islands have helped stabilise its numbers after mainland populations vanished.”",
            instructionBn: "প্যাসেজটি ২০ সেকেন্ডে skim করে এক বাক্যে মূল বিষয় লিখুন।",
          },
          {
            code: "Drill 8.2",
            title: "Locate (Level 2)",
            instruction:
              "For each question, write the first word or phrase you would scan for to find the answer’s region. Do not answer yet, just name your search target. 1. How long can a tuatara live? 2. Where do conservation efforts take place? 3. How often do females lay eggs?",
            instructionBn: "প্রতিটির জন্য কোন শব্দ scan করবেন লিখুন (উত্তর নয়)।",
          },
          {
            code: "Drill 8.3",
            title: "Locate, identify, verify, answer (Level 2)",
            instruction:
              "Answer these, and for each, name the sentence you verified against. 1. The tuatara is found in more than one country. (True / False / Not Given) 2. The tuatara’s eggs hatch quickly. (True / False / Not Given) 3. The tuatara can stay active in cold conditions. (True / False / Not Given)",
            instructionBn: "উত্তর দিন এবং কোন বাক্যে verify করলেন লিখুন।",
          },
        ],

        answerKey: {
          "Drill 8.1 — Gist": [
            { q: "Main idea in one phrase", answer: "Something like: “the tuatara, a rare, ancient New Zealand reptile with unusual biology and its conservation.”", why: "A good skim leaves you with the topic and shape, not the details. If you came away trying to remember the incubation figure, you skimmed too slowly; the figures are what you return for when a question asks." },
          ],
          "Drill 8.2 — Locate": [
            { q: "1. How long can a tuatara live?", answer: "Scan for live / century / years (a lifespan). The word “century” is a strong, unusual anchor.", why: "Choose a distinctive target and hunt only for it." },
            { q: "2. Where do conservation efforts take place?", answer: "Scan for conservation / islands. “Predator-free islands” is distinctive.", why: "Distinctive phrase, easy to spot." },
            { q: "3. How often do females lay eggs?", answer: "Scan for eggs / lay / every few years. “Lay eggs” is the target.", why: "The lesson: you locate by choosing a distinctive target and hunting only for it, ignoring the rest of the text. You are scanning, not reading." },
          ],
          "Drill 8.3 — Locate, identify, verify, answer": [
            { q: "1. The tuatara is found in more than one country.", answer: "False. Verify against: “found only in New Zealand.”", why: "The word “only” contradicts “more than one country.” This is a contradiction, not an absence, so False rather than Not Given." },
            { q: "2. The tuatara’s eggs hatch quickly.", answer: "False. Verify against: “the eggs take over a year to hatch, one of the longest incubation periods.”", why: "“Quickly” is contradicted by “over a year” and “longest.” A word from the question, “hatch,” appears in the passage, but the meaning is the opposite. This is exactly why verification matters." },
            { q: "3. The tuatara can stay active in cold conditions.", answer: "True. Verify against: “remains active at low temperatures that would leave most reptiles sluggish.”", why: "“Low temperatures” paraphrases “cold conditions,” and “remains active” matches “stay active.” The lesson across all three: never answer on a matching word alone." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 08 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 09 · Skimming, Scanning, and the Skim-Scan-Read Switch
// ────────────────────────────────────────────────────────────
async function seedFile09() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 09 · Skimming, Scanning, and the Skim-Scan-Read Switch",
      titleBn: "ফাইল ০৯ · Skimming, Scanning ও Skim-Scan-Read সুইচ",
      position: 19,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Module 2: IELTS Reading",
        intro:
          "The Reading Mindset gave you three gears: skim to map, scan to locate, close-read to verify. This file is the driving lesson. It teaches exactly what your eyes do in each gear and, crucially, the precise moments you shift between them. Vague advice like “skim the passage” is useless. By the end of this file you will know what to read, what to ignore, how long to spend, and when to stop.",
        introBn:
          "ফাইল ০৯-এর মূল কথা: তিন গিয়ার — skim দিয়ে map, scan দিয়ে locate, close-read দিয়ে verify। এই ফাইল ঠিক শেখায় প্রতিটি গিয়ারে চোখ কী করে আর কখন গিয়ার বদলাতে হয়। 'প্যাসেজ skim করো' এমন অস্পষ্ট উপদেশ অকেজো; এখানে জানবেন কী পড়বেন, কী বাদ দেবেন, কতক্ষণ ও কখন থামবেন।",

        sections: [
          {
            code: "P3",
            title: "PART 3 · THE SKIMMING MASTERCLASS — What skimming actually is",
            titleBn: "Skimming মাস্টারক্লাস · skimming আসলে কী",
            content: {
              coreFact:
                "Skimming is not reading fast. Reading fast still means reading every word, only quicker, and it still fails, because your eyes cannot absorb nine hundred words at speed and hold them. Skimming is selective sampling: you deliberately read a small fraction of the text, chosen because it carries the most meaning, and you deliberately ignore the rest.\n\nThe purpose of a skim is not to understand the passage. It is to build a paragraph map: a rough sense of what each paragraph is about and how the passage is shaped. With that map, when a question arrives, you already know which paragraph to visit. That is all a skim is for. If you finish a skim able to say “paragraph 2 is about causes, paragraph 3 is about one scientist’s objection, paragraph 4 is about the modern view,” your skim succeeded, even if you could not recall a single statistic.",
              bn: "Skimming দ্রুত পড়া নয় — নির্বাচিত নমুনা নেওয়া। উদ্দেশ্য প্যাসেজ বোঝা নয়, paragraph map তৈরি: কোন প্যারা কী নিয়ে। map থাকলে প্রশ্ন এলেই জানবেন কোন প্যারায় যেতে হবে।",
            },
          },
          {
            code: "P3.eyes",
            title: "Exactly what your eyes read during a skim",
            titleBn: "skim-এ চোখ ঠিক কী পড়ে",
            content: {
              coreFact: "Here is the granular routine. Follow it in order.",
              points: [
                { term: "The title", en: "Always read it, fully. It names the topic in a few words and primes everything else. Free information; never skip it." },
                { term: "Any subheadings or section labels", en: "If the passage has them, read every one. They hand you the structure for nothing." },
                { term: "The first paragraph, more fully than the rest", en: "The introduction frames the whole passage: the topic, often the writer’s angle, sometimes a preview of what is coming. Read most of it, not just the first line." },
                { term: "Each body paragraph’s first sentence", en: "The topic sentence usually announces what the paragraph is about, so read it. This is where most of your skim’s value comes from." },
              ],
              principle:
                "The opening line of a paragraph reveals its direction, but it is not automatically the complete main idea. Sometimes the first sentence is a hook, a question, an example, or a piece of background, and the real point arrives in the second sentence, or at the end.",
              principleBn:
                "নীতি: প্যারার প্রথম লাইন দিক দেখায়, কিন্তু সবসময় পূর্ণ main idea নয়। কখনো প্রথম বাক্য hook/প্রশ্ন/উদাহরণ/পটভূমি — আসল কথা দ্বিতীয় বাক্যে বা শেষে আসে।",
              coreFact2:
                "So if a paragraph opens with “Consider the humble bee,” or “In 1850, few would have predicted this,” or a rhetorical question, that is a lead-in, not the main idea. When the first sentence does not tell you what the paragraph is about, read the second sentence, and if needed glance at the last.\n\nThe last sentence, when a paragraph turns or concludes. Some paragraphs save their point for the end, or reverse direction late with “however” or “yet.” A quick look at the final sentence catches these.\n\nWhat you skip. Examples, lists, long descriptions, statistics, quotations, and supporting detail. You do not read these during a skim. You note only that they are there and roughly where, so you can return if a question needs them.",
            },
          },
          {
            code: "P3.snag",
            title: "What your eyes snag on while skimming",
            titleBn: "skim করতে করতে চোখে যা আটকায়",
            content: {
              coreFact:
                "Even as you sample topic sentences, let certain things catch your eye and register their location (not their content). These become your scanning anchors later:",
              bullets: [
                "Names of people, places, organisations (capital letters make them pop)",
                "Dates and numbers",
                "Technical or unusual terms, often the passage’s key concepts",
                "Words repeated across paragraphs (a repeated word signals a central theme)",
                "Contrast words (however, but, although, in contrast) that mark a turn in the argument",
              ],
              coreFact2:
                "You are not reading these; you are photographing where they sit, so that when a question mentions “1850” or “Professor Adeyemi,” your eye already knows which region to jump to.",
            },
          },
          {
            code: "P3.howlong",
            title: "How long, and when to stop · Beginner vs expert",
            titleBn: "কতক্ষণ ও কখন থামবেন · শিক্ষানবিশ বনাম বিশেষজ্ঞ",
            content: {
              coreFact:
                "A skim of one passage should take roughly two to three minutes, no more. The moment you have a paragraph map, stop. Skimming past that point is just slow reading in disguise, and it burns the minutes the questions need. You stop skimming when you can describe the shape of the passage in a sentence, or when you simply run out of your time budget for it, whichever comes first.",
              examples: [
                { wrong: "Beginner: reads every word at slightly higher speed, calls it skimming, finishes exhausted with no map and no time saved." },
                { right: "Expert: reads title, subheads, first paragraph, and topic sentences, drops to the second or last sentence only when the first fails, ignores all detail, and emerges in two minutes with a clear map and their anchors located." },
              ],
              tutorTip:
                "After a good skim you should be able to answer, for each paragraph, “what job does this paragraph do?” in three or four words: gives background, introduces a problem, offers a solution, raises an objection, gives an example. If you cannot, you skimmed for facts instead of for structure. Structure is what the map needs.",
              tutorTipBn:
                "ভালো skim-এর পর প্রতিটি প্যারা নিয়ে বলতে পারা উচিত, “এই প্যারার কাজ কী?” (পটভূমি দেয়, সমস্যা তোলে, সমাধান দেয়, আপত্তি জানায়)। না পারলে আপনি তথ্য খুঁজেছেন, কাঠামো নয়।",
            },
          },
          {
            code: "P4",
            title: "PART 4 · THE SCANNING MASTERCLASS — What scanning is & how",
            titleBn: "Scanning মাস্টারক্লাস · scanning কী ও কীভাবে",
            content: {
              coreFact:
                "Scanning is the opposite of skimming. In skimming you sample for general shape; in scanning you hunt for one specific target and ignore everything else, including meaning. Your eyes become a search tool set to a single pattern. When you scan a page for a phone number, you do not read the page; you let the shape of digits pop out. That is exactly the skill, applied to IELTS.",
              coreFact2:
                "How to scan, physically. Do not read line by line. Let your eyes move down and across the text in a loose sweep, holding your target in mind, waiting for it to jump out. Do not say the words in your head; subvocalising slows you to reading speed and defeats the purpose. You are pattern-matching, not reading. When the target appears, then you stop and slow down.\n\nWhen to use scanning. You scan after skimming, to perform the LOCATE step of the loop. Each question gives you something to hunt for; you scan the passage (guided by your map to the likely region) until you find it, then switch gears to close reading.",
              bn: "Scanning skimming-এর উল্টো — একটি নির্দিষ্ট target খোঁজা, অর্থসহ বাকি সব উপেক্ষা করে। লাইন ধরে পড়বেন না; চোখ আলগা করে বুলান, target লাফিয়ে উঠলে থামুন। মনে মনে শব্দ উচ্চারণ করবেন না।",
            },
          },
          {
            code: "P4.target",
            title: "What to scan for: choose the easiest target",
            titleBn: "কী scan করবেন: সবচেয়ে সহজ target",
            content: {
              coreFact: "Some targets are far easier to spot than others. Always choose the most distinctive thing the question gives you. Easiest to scan for (spot these first):",
              bullets: [
                "Names of people, places, organisations (capital letters)",
                "Numbers, dates, percentages, measurements",
                "Capitalised or italicised technical terms",
                "Unusual or distinctive words unlikely to repeat",
                "Specific locations",
              ],
              coreFact2:
                "These are the anchors from File 02, and the same principle carries into Reading: names, numbers, and dates are rarely paraphrased, so when a question contains one, scan for it and you will land almost on top of the answer.\n\nHarder to scan for (when there is no anchor): Some questions offer only common words, “the writer suggests that children benefit from routine.” There is no capital letter or number to hunt. Now you must scan for the paraphrase of the concept, “children” might appear as “the young,” “benefit” as “gain” or “thrive,” “routine” as “regular structure.” This is slower and needs the paraphrase skill from File 02. When a question has no hard anchor, slow your scan and hunt for meaning, not a word.",
              tutorTip:
                "When a question contains a number, a name, or a date, do not read towards the answer. Scan for that exact anchor and let it pull your eye to the spot. Reading from the top wastes the gift the question just handed you.",
              tutorTipBn:
                "প্রশ্নে সংখ্যা, নাম বা তারিখ থাকলে উপরের দিকে পড়া শুরু করবেন না। ঠিক সেই anchor scan করুন, চোখ নিজেই জায়গায় পৌঁছে যাবে।",
            },
          },
          {
            code: "P4.switch",
            title: "THE SWITCH: skim, then scan, then read deeply",
            titleBn: "সুইচ: skim, তারপর scan, তারপর গভীর পঠন",
            content: {
              coreFact: "Knowing the three gears is not enough. Bands are won by shifting between them at the right moments. Here is the exact sequence for a passage, with the trigger for each shift.",
              steps: [
                { term: "Gear 1, skim (about two to three minutes)", en: "Trigger to start: you turn to a new passage. Trigger to stop: you have a paragraph map. Then shift down." },
                { term: "Gear 2, scan (seconds per question)", en: "Trigger to start: you read a question and pick its anchor or concept. You scan the likely region for it. Trigger to stop: you find the region. Then shift down again." },
                { term: "Gear 3, close read (a small patch only)", en: "Trigger to start: you have located the region. Now read the two or three relevant sentences carefully to identify the exact answer and verify it. Trigger to stop: you have a verified answer. Then shift back up to Gear 2 for the next question." },
              ],
              key: "The rhythm of a whole passage is therefore: one skim, then for each question a scan-and-read, with your eyes constantly changing speed. The beginner drives the entire passage in Gear 3 and stalls. The expert is always shifting.",
              keyBn: "পুরো প্যাসেজের ছন্দ: একবার skim, তারপর প্রতিটি প্রশ্নে scan-and-read, চোখ সারাক্ষণ গতি বদলায়। শিক্ষানবিশ পুরোটা Gear 3-এ চালায় ও আটকে যায়; বিশেষজ্ঞ সবসময় গিয়ার বদলায়।",
            },
          },
          {
            code: "P4.expert",
            title: "EXPERT THINKING: choosing the gear",
            titleBn: "বিশেষজ্ঞ চিন্তা: গিয়ার বাছা",
            content: {
              coreFact: "A question reads: “In which year did cork production become industrialised?” but the passage never gives such a year.",
              examples: [
                { wrong: "WHAT A BEGINNER THINKS: Reads the whole passage again slowly looking for the year, twice, finding nothing, losing three minutes." },
                { wrong: "WHAT AN EXPERIENCED STUDENT THINKS: Scans for a date, finds only “twenty-five,” “nine,” “two hundred,” none about industrialisation, and starts to suspect the answer is not there." },
                { right: "WHAT AN EXPERT CANDIDATE NOTICES: Scans for a date in seconds, sees none fits industrialisation, and immediately concludes the information is absent, which for a True/False/Not Given item points straight to Not Given, and for a completion item means the anchor is wrong and the question is about a different region. Either way they spend fifteen seconds, not three minutes. Knowing the gear tells them how long to look before deciding the target is not there.", why: "The lesson: scanning does not only find answers. A fast scan that finds nothing is itself information, and the expert reads that silence correctly instead of re-reading in a panic." },
              ],
            },
          },
        ],

        exercises: [
          {
            code: "Drill 9.1",
            title: "Skim for structure (Level 1)",
            instruction:
              "Skim this passage in about thirty seconds, then write, in three or four words each, the job of the passage overall and what the final sentences add. Passage: “For centuries, the position of a ship at sea could be found north to south by measuring the stars, but its east-west position, or longitude, defeated the finest minds in Europe. The problem was really one of time: to know your longitude, you needed to compare local time with the time at a fixed reference point, and no clock of the era could keep accurate time on a rolling, damp, temperature-changing ship. In 1714, the British government offered a vast prize for a solution. Most experts expected it to come from astronomy. Instead it came from a self-taught carpenter, John Harrison, who spent decades building a series of remarkable sea clocks. His fourth design finally proved accurate enough, though he struggled for years to be paid the reward he was owed.”",
            instructionBn: "প্যাসেজটি ৩০ সেকেন্ডে skim করে সামগ্রিক কাজ ও শেষ বাক্যগুলো কী যোগ করে লিখুন।",
          },
          {
            code: "Drill 9.2",
            title: "Scan for anchors (Level 2)",
            instruction:
              "Find each as fast as you can and write it: 1. The year the prize was offered. 2. The name of the person who solved it. 3. What his profession had been.",
            instructionBn: "যত দ্রুত পারেন প্রতিটি খুঁজে লিখুন।",
          },
          {
            code: "Drill 9.3",
            title: "First sentence or deeper? (Level 2)",
            instruction:
              "Look at the opening: “For centuries, the position of a ship at sea could be found north to south by measuring the stars…” Is this first clause the main idea of the passage, or a lead-in? What tells you, and where is the real subject introduced?",
            instructionBn: "প্রথম clause কি main idea না lead-in? কীসে বোঝা যায় ও আসল বিষয় কোথায়?",
          },
          {
            code: "Drill 9.4",
            title: "The full switch (Level 3)",
            instruction:
              "Answer using skim, then scan, then close read. Name the sentence you verified against. 1. What was the real nature of the longitude problem? 2. Where did most experts expect the solution to come from?",
            instructionBn: "skim → scan → close read দিয়ে উত্তর দিন, verify-করা বাক্য লিখুন।",
          },
        ],

        answerKey: {
          "Drill 9.1 — Skim for structure": [
            { q: "Overall job + what the final sentences add", answer: "Overall job: “explains how longitude was solved,” or “a historical problem and its unexpected solver.” The final sentences add: “the solver was an outsider and was underpaid / struggled for the reward.”", why: "A good skim gives you this arc without the detail. If you came away reciting “1714” but unsure of the overall story, you scanned when you should have skimmed." },
          ],
          "Drill 9.2 — Scan for anchors": [
            { q: "1. Year the prize was offered", answer: "1714 (scan for digits).", why: "Hunt a distinctive target, not by reading." },
            { q: "2. Person who solved it", answer: "John Harrison (scan for a capitalised name).", why: "Capital letters pop out." },
            { q: "3. His profession", answer: "A (self-taught) carpenter (scan near the name).", why: "Each was found by hunting a distinctive target, not by reading." },
          ],
          "Drill 9.3 — First sentence or deeper?": [
            { q: "Main idea or lead-in?", answer: "It is a lead-in, not the main idea.", why: "The first clause is about the north-south position, which is the easy, already-solved part, used as a contrast to set up the real topic. The tell is the structure: “could be found north to south by the stars, but its east-west position, or longitude, defeated the finest minds.” The word “but” turns the sentence, and the real subject, longitude, arrives after it. You must read to the “but.”" },
          ],
          "Drill 9.4 — The full switch": [
            { q: "1. The real nature of the longitude problem", answer: "The longitude problem was really a problem of time / keeping accurate time at sea. Verify against: “The problem was really one of time… no clock of the era could keep accurate time on a rolling, damp, temperature-changing ship.”", why: "You scanned to the second sentence (the region about the nature of the problem) and close-read it to verify." },
            { q: "2. Where most experts expected the solution", answer: "Astronomy / the stars. Verify against: “Most experts expected it to come from astronomy.”", why: "A quick scan for “experts” or “expected” locates it; close reading confirms astronomy, and the “instead” that follows confirms the solution came from elsewhere. The lesson: skim once for the map, scan to the region, close-read the few lines to verify." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 09 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 10 · Keyword Strategy and Paraphrase Recognition in Reading
// ────────────────────────────────────────────────────────────
async function seedFile10() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 10 · Keyword Strategy and Paraphrase Recognition in Reading",
      titleBn: "ফাইল ১০ · Keyword কৌশল ও Paraphrase চেনা",
      position: 20,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Module 2: IELTS Reading",
        intro:
          "You met keywords and paraphrase in Listening. They matter just as much in Reading, but they behave differently, and the differences decide marks.\n\nTwo changes are central. First, the text stays still, so you can re-read, which removes any excuse for answering on a hunch: if you cannot point to the exact sentence that proves your answer, you have not finished. Second, and more importantly: the passage almost never uses the same words as the question.",
        introBn:
          "ফাইল ১০-এর মূল কথা: keyword ও paraphrase Reading-এও সমান গুরুত্বপূর্ণ, তবে আচরণ ভিন্ন। টেক্সট স্থির, তাই re-read করা যায় — hunch-এ উত্তর দেওয়ার অজুহাত নেই। আর সবচেয়ে বড় কথা: প্যাসেজ প্রায় কখনোই প্রশ্নের শব্দ হুবহু ব্যবহার করে না।",

        sections: [
          {
            code: "P0",
            title: "The central principle",
            titleBn: "মূল নীতি",
            content: {
              principle:
                "The passage almost never uses the same words as the question. Finding a question’s word sitting in the passage is usually a trap, not a discovery. The real answer is written in different language nearby.",
              principleBn:
                "নীতি: প্যাসেজ প্রায় কখনোই প্রশ্নের হুবহু শব্দ ব্যবহার করে না। প্রশ্নের শব্দ প্যাসেজে পাওয়া সাধারণত ফাঁদ, আবিষ্কার নয়। আসল উত্তর কাছেই ভিন্ন ভাষায় লেখা।",
              coreFact:
                "Keyword strategy tells you what to hunt for. Paraphrase recognition tells you what it will look like when you find it. Together they are how you locate and verify. Let us make each precise.",
            },
          },
          {
            code: "P5",
            title: "PART 5 · KEYWORD STRATEGY — The two jobs a keyword does",
            titleBn: "Keyword কৌশল · keyword-এর দুই কাজ",
            content: {
              coreFact: "Every question keyword does one of two jobs, and you must know which.",
              points: [
                { term: "Job one: the anchor you scan for", en: "If a keyword is a name, number, date, or distinctive term, it will appear in the passage almost unchanged, so you scan for it to locate the region. These are your fast, reliable keywords.", bn: "anchor — নাম/সংখ্যা/তারিখ প্রায় অপরিবর্তিত থাকে; scan করে region খোঁজেন।" },
                { term: "Job two: the concept you match by meaning", en: "If a keyword is an ordinary content word (benefit, decline, cause, difficult), it will be paraphrased in the passage, so you cannot scan for the word itself. Instead you hold its meaning and hunt for that meaning in different words. These keywords are slower and require the paraphrase skill.", bn: "concept — সাধারণ শব্দ paraphrase হয়; অর্থ ধরে খোঁজেন।" },
              ],
              coreFact2:
                "Before you scan, sort your keyword: is this an anchor I can hunt for directly, or a concept I must match by meaning? Choosing wrong wastes time. Scanning for the word “important” is useless, because it will not be there; scanning for “1714” or “Harrison” lands you on the spot.",
            },
          },
          {
            code: "P5.strong",
            title: "Selecting strong keywords, avoiding generic ones",
            titleBn: "শক্ত keyword বাছা, সাধারণ এড়ানো",
            content: {
              coreFact:
                "In each question, mark the one or two words that carry its specific meaning, and ignore the rest. Prefer the distinctive over the common.\n\nStrong keywords are specific and content-rich: a particular noun, a precise verb, a named thing. They point somewhere.\n\nGeneric keywords are broad and appear everywhere: problem, change, people, information, important, area, time, way. They point nowhere, because the whole passage is full of them. Never build your search on a generic word.",
              coreFact2:
                "Given the question “What problem did early clockmakers face at sea?”, the word “problem” is generic and useless to scan for. The strong keywords are “clockmakers” and “at sea,” and the concept is the difficulty itself, which the passage may word as “defeated the finest minds” or “no clock could keep accurate time.” Mark the strong words, hold the concept.",
              bn: "শক্ত keyword নির্দিষ্ট (particular noun/verb); সাধারণ keyword (problem, change, people) সবখানে থাকে, কখনো সেগুলোতে search গড়বেন না।",
            },
          },
          {
            code: "P5.trap",
            title: "The word-match trap · Predicting synonyms · Reading around the keyword",
            titleBn: "word-match ফাঁদ · synonym আন্দাজ · keyword ঘিরে পড়া",
            content: {
              tutorTip:
                "Finding the same word in the passage does not mean you have found the answer. The exam deliberately plants a question’s word in the wrong place, or in a sentence that means something different, precisely because tired candidates grab the first word-match and stop. Match the meaning, never just the word.",
              tutorTipBn:
                "প্যাসেজে প্রশ্নের একই শব্দ পাওয়া মানেই উত্তর পাওয়া নয়। পরীক্ষা ইচ্ছে করে সেই শব্দ ভুল জায়গায় বসিয়ে রাখে। শব্দ নয়, অর্থ মেলান।",
              coreFact:
                "The passage might use the word “expensive” in paragraph two while discussing something irrelevant to your question, and use the idea of expense, worded as “beyond the reach of ordinary families,” in paragraph four where your answer actually lives. The candidate who scanned for “expensive” answers from the wrong paragraph. The candidate who held the concept finds the right one.\n\nPredicting synonyms before you scan. For a concept keyword, spend a moment before scanning to predict how the passage might reword it, exactly as in Listening. If the keyword is “decline,” prepare: fall, drop, decrease, dwindle, shrink, go down. Now your eye recognises any of them.",
              coreFact2:
                "Reading around the keyword. When you locate a keyword, the answer is usually not the keyword itself but the words around it. So do not read only the keyword; read the whole sentence it sits in, and often the sentence before and after. Question: “Why was Harrison not paid promptly?” You scan to “Harrison” and “reward.” The keyword region is: “he struggled for years to be paid the reward he was owed.” The answer to “why” is in the surrounding idea. The keyword located the region; the neighbouring words held the answer.\n\nVerifying evidence. An answer is not finished until you can point to the specific sentence that proves it. If someone asked “how do you know?” you should be able to put your finger on the line. In Reading, unlike Listening, the evidence is right there on the page, so there is no excuse for an unverified answer, only impatience.",
            },
          },
          {
            code: "P6",
            title: "PART 6 · PARAPHRASE RECOGNITION — The forms of paraphrase",
            titleBn: "Paraphrase চেনা · paraphrase-এর রূপ",
            content: {
              principle:
                "Same meaning, different language. Your job on every question is to recognise that the passage sentence and the question say the same thing in different words, or to recognise that they do not quite.",
              principleBn:
                "নীতি: একই অর্থ, ভিন্ন ভাষা। প্রতিটি প্রশ্নে চিনতে হবে প্যাসেজ ও প্রশ্ন একই কথা ভিন্ন শব্দে বলছে কিনা — নাকি ঠিক বলছে না।",
              points: [
                { term: "1. Synonym", en: "One word swapped for a close equivalent. “expensive” becomes “costly,” “dear,” “beyond most budgets.”" },
                { term: "2. Word-family change", en: "The idea keeps, the part of speech changes. Reading loves this. “industrialise” → “industrialisation” → “industrial”; “the decline of the industry” → “as the industry declined”; “scientists disagreed” → “there was disagreement among scientists.”" },
                { term: "3. Active and passive", en: "The same fact from the other side. “the government funded the project” → “the project was funded by the government.”" },
                { term: "4. Noun and verb swaps", en: "“the invention of the clock” → “when the clock was invented.”" },
                { term: "5. Description or definition", en: "A single word replaced by its meaning spelled out. “longitude” → “a ship’s east-west position”; “nocturnal” → “active at night.”" },
                { term: "6. Numerical paraphrase", en: "Numbers reworded. “half” → “fifty per cent,” “one in two,” “around 50%”; “doubled” → “rose to twice its former level.”" },
                { term: "7. Comparative paraphrase", en: "Treated in full below, because it is the biggest single source of True/False/Not Given errors." },
                { term: "8. Conceptual paraphrase", en: "The whole idea rebuilt with no shared words at all. “the solution came from an unexpected source” → “instead it came from a self-taught carpenter.”" },
              ],
            },
          },
          {
            code: "P6.comparative",
            title: "Comparative paraphrase: read this section twice",
            titleBn: "তুলনামূলক paraphrase: দুবার পড়ুন",
            content: {
              coreFact: "Comparisons are reworded constantly, and small changes flip the meaning. Master three moves.",
              points: [
                { term: "Move A: the same comparison from the other direction", en: "These pairs mean the same thing: “A is more common than B” equals “B is less common than A”; “prices rose faster than wages” equals “wages rose more slowly than prices.” If a question reverses the direction but also reverses the comparison word, the meaning is unchanged, and the answer is True." },
                { term: "Move B: the direction that is NOT reversed (Danger)", en: "These do not mean the same: “prices rose faster than wages” is the opposite of “wages rose faster than prices.” If the question keeps the same comparison word but swaps which thing is greater, the meaning flips, and the answer is usually False." },
                { term: "Move C: comparative versus superlative", en: "A comparison is not a claim of being the most. “A is more common than B” does NOT mean “A is the most common of all.” Claiming the superlative from a mere comparative is a classic overreach, and the answer is often Not Given." },
              ],
              tutorTip:
                "On any comparison, ask two questions: which item is being claimed as greater, and how strong is the claim (more than one thing, or more than everything). Reverse the wrong item and the meaning flips; upgrade “more than some” into “more than all” and you have invented a claim the passage never made. Both are favourite traps.",
              tutorTipBn:
                "যেকোনো তুলনায় দুটি প্রশ্ন করুন: কোনটা বড় বলা হচ্ছে, আর দাবিটা কতটা শক্ত (একটার চেয়ে বেশি, নাকি সবার চেয়ে বেশি)। ভুল জিনিসটাকে বড় বানালে অর্থ উল্টে যায়; “কিছুর চেয়ে বেশি”-কে “সবার চেয়ে বেশি” বানালে নতুন দাবি তৈরি হয়।",
              coreFact2:
                "The near-paraphrase that shifts meaning. Not every reworded sentence is a true paraphrase. The exam’s sharpest trap is the near-paraphrase: a sentence that looks like a match but changes the meaning by a degree. “Many scientists believed” is not “all scientists believed.” “The plan might succeed” is not “the plan will succeed.” “It contributed to the problem” is not “it caused the problem.” These small shifts, some, many, all, might, will, contributed, caused, are where True quietly becomes False or Not Given.",
            },
          },
          {
            code: "P6.expert",
            title: "EXPERT THINKING: word-match versus meaning-match",
            titleBn: "বিশেষজ্ঞ চিন্তা: word-match বনাম meaning-match",
            content: {
              coreFact: "Question: “The cork oak is found across the whole Mediterranean.” The passage says: “native to the western Mediterranean, especially Portugal.”",
              examples: [
                { wrong: "WHAT A BEGINNER THINKS: Sees “Mediterranean” in both, matches the word, answers True. Trapped." },
                { wrong: "WHAT AN EXPERIENCED STUDENT THINKS: Notices “whole” versus “western,” hesitates, reads again, and gets it, but slowly." },
                { right: "WHAT AN EXPERT CANDIDATE NOTICES: Reads for meaning from the start. The question claims the whole Mediterranean; the passage says only the western part. That is a narrower area, so the question’s broader claim is contradicted. Answer: False. The shared word “Mediterranean” was the bait; the words “whole” and “western” carried the real meaning.", why: "Match the meaning, not the word, and watch the small words that quietly change the size of a claim." },
              ],
            },
          },
        ],

        exercises: [
          {
            code: "Drill 10.1",
            title: "Sort the keyword (Level 2)",
            instruction:
              "For each question keyword, write A if it is an anchor to scan for, or C if it is a concept to match by meaning. 1. 1714  2. difficult  3. Harrison  4. benefit  5. Portugal  6. decline",
            instructionBn: "প্রতিটি keyword-এর জন্য লিখুন A (anchor) না C (concept)।",
          },
          {
            code: "Drill 10.2",
            title: "Predict the paraphrase (Level 2)",
            instruction:
              "Write two rewordings the passage might use for each. 1. invented  2. rare  3. sustainable  4. lives a long time",
            instructionBn: "প্রতিটির দুটি সম্ভাব্য rewording লিখুন।",
          },
          {
            code: "Drill 10.3",
            title: "Match question to passage sentence (Level 3)",
            instruction:
              "Match each question sentence (1 to 4) to the passage sentence (A to D) with the same meaning, and name the paraphrase type. Questions: 1. The clock had to work in changing temperatures. 2. Harrison taught himself. 3. The solution surprised the experts. 4. Cork can be removed without killing the tree. Passage: A. “a self-taught carpenter” B. “stripped of its bark without being killed” C. “temperature-changing ship” D. “Most experts expected it to come from astronomy. Instead…”",
            instructionBn: "প্রতিটি প্রশ্ন-বাক্যকে সমান অর্থের প্যাসেজ-বাক্যের সঙ্গে মেলান ও paraphrase-ধরন লিখুন।",
          },
          {
            code: "Drill 10.4",
            title: "Comparative paraphrase (Level 4)",
            instruction:
              "Decide whether each question means the SAME as the passage sentence, the OPPOSITE, or MORE than the passage supports. Passage: “The cork oak produces around half of the world’s cork, more than any other single country’s output.” 1. “No country produces more cork than the region described.” 2. “The cork oak’s region is the world’s largest single producer of cork.” 3. “Other countries together produce less than the cork oak region.”",
            instructionBn: "প্রতিটি SAME / OPPOSITE / MORE কিনা ঠিক করুন।",
          },
        ],

        answerKey: {
          "Drill 10.1 — Sort the keyword": [
            { q: "1–6", answer: "1. A (a date, scan for it). 2. C (concept, will be reworded as “hard,” “defeated,” “no clock could”). 3. A (a name). 4. C (concept, “gain,” “help,” “advantage”). 5. A (a place name). 6. C (concept, “fall,” “drop,” “decrease”).", why: "Anchors you hunt for by shape; concepts you hunt for by meaning. Knowing which before you scan saves the time wasted hunting for a word that was always going to be paraphrased." },
          ],
          "Drill 10.2 — Predict the paraphrase (samples)": [
            { q: "1. invented", answer: "“was invented,” “the invention of,” “devised,” “created.”" },
            { q: "2. rare", answer: "“uncommon,” “seldom found,” “few remain,” “scarce.”" },
            { q: "3. sustainable", answer: "“managed without harm,” “able to continue for centuries,” “not depleting the resource.”" },
            { q: "4. lives a long time", answer: "“can exceed two hundred years,” “a long lifespan,” “survives for over a century.”", why: "Predicting rewordings primes your eye to recognise the concept when it appears dressed differently." },
          ],
          "Drill 10.3 — Match question to passage sentence": [
            { q: "Matches + type", answer: "1 to C (word-family change: “changing temperatures” becomes “temperature-changing”). 2 to A (description/word-family: “taught himself” becomes “self-taught”). 3 to D (conceptual paraphrase: “surprised the experts” becomes “experts expected… Instead”). 4 to B (description: “removed without killing” becomes “stripped of its bark without being killed”).", why: "In every match the meaning is identical while the words differ. Naming the paraphrase type trains you to expect that type next time." },
          ],
          "Drill 10.4 — Comparative paraphrase": [
            { q: "1. “No country produces more cork than the region described.”", answer: "Same. “No country produces more” equals “more than any other single country.” Same comparison, reversed direction with a reversed word (Move A). True." },
            { q: "2. “The cork oak’s region is the world’s largest single producer of cork.”", answer: "Same. “Largest single producer” equals “more than any other single country’s output,” i.e. the biggest single one." },
            { q: "3. “Other countries together produce less than the cork oak region.”", answer: "More than supported. The passage compares the cork oak region to each other single country, not to all others combined. “Other countries together” is a new, bigger claim the passage never makes. This is the comparative-to-superlative overreach (Move C). A TFNG item here would be Not Given.", why: "Comparisons turn on which items are compared and how strong the claim is. Number 3 quietly changes “any other single country” into “all others combined,” which the text never addresses." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 10 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 11 · Question Order and Reading Question Types, Part One
// ────────────────────────────────────────────────────────────
async function seedFile11() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 11 · Question Order and Reading Question Types, Part One",
      titleBn: "ফাইল ১১ · প্রশ্নক্রম ও Reading প্রশ্নের ধরন, পর্ব ১",
      position: 21,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Module 2: IELTS Reading",
        intro:
          "Before we open the question types one by one, you need to understand question order, because it changes how you hunt for every answer. Then we begin the type-by-type masterclasses with the four types where order matters most: multiple choice and the three matching types.",
        introBn:
          "ফাইল ১১-এর মূল কথা: প্রশ্নের ধরন খোলার আগে question order বুঝতে হবে — এটা প্রতিটি উত্তর খোঁজার পদ্ধতি বদলে দেয়। তারপর যে চারটি ধরনে order সবচেয়ে গুরুত্বপূর্ণ (multiple choice ও তিন matching) সেগুলো দিয়ে শুরু।",

        sections: [
          {
            code: "P7",
            title: "PART 7 · QUESTION ORDER — The general rule, and why it helps",
            titleBn: "প্রশ্নক্রম · সাধারণ নিয়ম ও কেন সাহায্য করে",
            content: {
              coreFact:
                "For many Reading question types, the questions follow the order of the passage. The answer to question 3 appears in the text before the answer to question 4, which appears before question 5, and so on. This is enormously useful, because it means you do not search the whole passage for every question. Once you have found the answer to question 3 at, say, paragraph two, you know question 4’s answer is after that point. Your search shrinks with every answer you place.\n\nUsed well, order turns the passage into a one-way street: you move forward through it as you move down the questions, never re-scanning ground you have already covered.",
              bn: "অনেক ধরনে প্রশ্ন প্যাসেজের ক্রম মেনে চলে — প্রশ্ন ৩-এর উত্তর ৪-এর আগে। তাই একটা উত্তর পেলে পরেরটার search এলাকা ছোট হয়ে যায়। order প্যাসেজকে one-way street বানায়।",
            },
          },
          {
            code: "P7.which",
            title: "Which types follow order, and which do not",
            titleBn: "কোন ধরন order মানে, কোনটা মানে না",
            content: {
              coreFact: "Generally follow passage order:",
              bullets: [
                "True / False / Not Given and Yes / No / Not Given",
                "Sentence completion",
                "Summary completion (when drawn from one section)",
                "Note, table, and flow-chart completion",
                "Short answer",
                "Multiple choice (usually)",
                "Matching sentence endings",
              ],
              coreFact2:
                "For these, work top to bottom and let each answer narrow the search for the next.\n\nDo NOT reliably follow order:\n• Matching Headings (you consider the whole passage, paragraph by paragraph)\n• Matching Information, the “which paragraph contains…” type (the detail can sit anywhere)\n• Matching Features (the items are scattered across the passage)\nFor these, order is no help, and assuming it will mislead you. They need a different approach.",
            },
          },
          {
            code: "P7.nuance",
            title: "The nuance: do not oversimplify",
            titleBn: "সূক্ষ্মতা: বেশি সরল করবেন না",
            content: {
              coreFact:
                "Weak books say “the answers are always in order.” That is not quite true, and trusting it blindly causes errors. Three cautions.",
              bullets: [
                "Order applies within a question set, not across different sets. A passage often has two or three sets of questions of different types. Each set may start again from the top of the passage. So question 8 (a new set) can point earlier in the text than question 7 (the previous set). Do not carry the order across a set boundary.",
                "Order is a hint, not a guarantee. Within a set, the order holds almost always, but your safeguard is verification, not faith. Use order to decide where to look first, then confirm the answer from the actual evidence. Never write an answer only because “it should be around here.”",
                "Some sets reset or interleave. When you finish one set and start the next, reset your eyes to the top and read the new instructions, because the type and the ordering behaviour may both change.",
              ],
              coreFact2:
                "How to recognise when order is unreliable. The instruction tells you. When you see “which paragraph contains,” “choose from the list of headings,” “match each statement to a researcher,” or a note that “you may use any letter more than once,” you are in a non-ordered type. Treat the whole passage as the search space.",
              tutorTip:
                "The best use of question order is not finding answers, it is skipping. When a type follows order and you are sure question 5 sat in paragraph three, you can ignore paragraphs one and two entirely for question 6. Half of Reading speed comes from knowing which text you are allowed to stop looking at.",
              tutorTipBn:
                "প্রশ্নক্রমের সবচেয়ে বড় লাভ উত্তর খোঁজা নয়, বরং বাদ দেওয়া। প্রশ্ন ৫ যদি প্যারা ৩-এ থাকে, প্রশ্ন ৬-এর জন্য প্যারা ১-২ পুরো বাদ। কোথায় খোঁজা বন্ধ করবেন, সেটাই অর্ধেক গতি।",
            },
          },
          {
            code: "MC",
            title: "1. MULTIPLE CHOICE",
            titleBn: "১. Multiple Choice",
            content: {
              points: [
                { term: "Recognise it", en: "A question or stem with three or four options, from which you pick one (occasionally more)." },
                { term: "What it tests", en: "Detailed understanding of a specific part of the passage." },
                { term: "Order", en: "Usually follows passage order." },
                { term: "Before you search", en: "Read the stem and understand what it asks, then read the options and note how they differ. The differences between options are what the passage will decide between." },
                { term: "Keyword and location", en: "Take an anchor from the stem (a name, term, or distinctive word) and scan to its region. Do not scan for the options’ words; scan for the stem’s subject, then read to decide between options." },
                { term: "Evidence and elimination", en: "The correct option is the one the passage supports in full. Eliminate options that are half-supported, unsupported, or contradicted. A common design: three options are each partly true, and only one is fully supported." },
                { term: "Traps", en: "An option may repeat words from the passage while distorting the meaning. An option may be true in the real world but not stated (outside-knowledge trap). An option may be true of the wrong part of the passage." },
                { term: "Beginner mistake", en: "Picks the option whose words appear in the passage." },
                { term: "Expert approach", en: "Picks the option whose meaning the passage fully supports, and can point to the sentence that proves it while ruling out the others." },
              ],
              key: "Worked example — Stem: “According to the passage, the main reason clocks failed at sea was…” Options: A) they were too expensive, B) they could not handle changing conditions, C) sailors misused them. The passage: “no clock of the era could keep accurate time on a rolling, damp, temperature-changing ship.” Answer: B. A and C are never stated, however plausible they sound.",
              keyBn: "উদাহরণ: উত্তর B — প্যাসেজ 'changing conditions'-কে কারণ বলেছে; A ও C কখনো বলা হয়নি যতই যুক্তিসঙ্গত শোনাক।",
            },
          },
          {
            code: "MInfo",
            title: "2. MATCHING INFORMATION (which paragraph contains…)",
            titleBn: "২. Matching Information (কোন প্যারায় আছে)",
            content: {
              points: [
                { term: "Recognise it", en: "A list of pieces of information, each to be matched to the paragraph (A, B, C…) that contains it. Often noted “you may use any letter more than once.”" },
                { term: "What it tests", en: "Locating specific detail anywhere in the passage. It is pure scanning across the whole text." },
                { term: "Order", en: "Does NOT follow order. The details are scattered, so never march top to bottom." },
                { term: "Before you search", en: "Understand each piece of information precisely. Note that it asks for specific information, a detail, an example, a reason, not the paragraph’s main idea." },
                { term: "Keyword and location", en: "For each item, take its most distinctive concept and scan every paragraph for a match. Because this type is slow, most experts do it last." },
                { term: "Evidence and elimination", en: "The matching paragraph must actually contain that information, not merely touch the topic. Confirm the detail is really there." },
                { term: "Traps", en: "The same topic may appear in two paragraphs, but only one contains the specific detail asked. A paragraph’s main idea may tempt you when the question wants a small buried detail elsewhere." },
                { term: "Beginner mistake", en: "Matches by topic rather than by the specific information." },
                { term: "Expert approach", en: "Hunts the exact detail, and having done the other questions first, often already knows which paragraph holds it." },
              ],
              tutorTip:
                "Do Matching Information last. It asks you to search the entire passage, which is painfully slow if done cold, but quick once the other questions have already walked you through most of the text. Order your question types by cost, and pay the expensive ones when you are richest in knowledge of the passage.",
              tutorTipBn:
                "Matching Information সবার শেষে করুন। এটি পুরো প্যাসেজ খুঁজতে বলে, ঠান্ডা মাথায় করলে ধীর; কিন্তু বাকি প্রশ্ন করার পর প্যাসেজ চেনা হয়ে গেলে দ্রুত হয়।",
            },
          },
          {
            code: "MFeat",
            title: "3. MATCHING FEATURES",
            titleBn: "৩. Matching Features",
            content: {
              points: [
                { term: "Recognise it", en: "A list of statements to be matched to a set of features, usually named people, things, theories, or categories (labelled A, B, C)." },
                { term: "What it tests", en: "Connecting claims to their source or category, tracking who said or did what." },
                { term: "Order", en: "Roughly follows the order of the statements, but the features themselves are scattered, so treat it as semi-ordered." },
                { term: "Before you search", en: "Read the list of features first. These named items are strong anchors, because names rarely change." },
                { term: "Keyword and location", en: "Either scan for each feature (name) and read what the passage attributes to it, or take each statement and find which feature the passage links it to. When there are few features and many statements, scanning by feature is usually faster." },
                { term: "Evidence and elimination", en: "The passage must actually attribute the statement to that feature. Watch for features used more than once, or not at all." },
                { term: "Traps", en: "A distractor feature is mentioned near the wrong statement to tempt a mismatch. A view held by one person may be contrasted with another’s, and you must attach it to the right one." },
                { term: "Beginner mistake", en: "Matches a statement to the nearest named person rather than the one the passage actually credits." },
                { term: "Expert approach", en: "Confirms the attribution by reading the sentence that links feature and claim, and does not rely on proximity." },
              ],
              key: "Worked example: see the migration passage in Practice below, where three researchers hold different views.",
            },
          },
          {
            code: "MSE",
            title: "4. MATCHING SENTENCE ENDINGS",
            titleBn: "৪. Matching Sentence Endings",
            content: {
              points: [
                { term: "Recognise it", en: "A set of sentence beginnings to be completed by choosing from a list of endings, with more endings than beginnings." },
                { term: "What it tests", en: "Understanding relationships and completing an idea accurately, with both meaning and grammar fitting." },
                { term: "Order", en: "Follows passage order (the beginnings track the text)." },
                { term: "Before you search", en: "Read each sentence beginning and treat it as a mini-question. Locate the beginning’s subject in the passage." },
                { term: "Keyword and location", en: "Take an anchor from the beginning, scan to its region, and read what the passage says. Then choose the ending whose meaning matches the passage, not merely whose grammar fits." },
                { term: "Evidence and elimination", en: "There are extra endings on purpose. Several will fit grammatically; only one fits the meaning the passage supports." },
                { term: "Traps", en: "An ending that is grammatically smooth and generally true, but not what the passage states about this subject. An ending that matches a different part of the passage." },
                { term: "Beginner mistake", en: "Chooses the ending that reads well as a sentence, ignoring whether the passage supports it." },
                { term: "Expert approach", en: "Matches the ending to the passage evidence first, and only then checks the grammar is clean." },
              ],
              key: "Worked example — Beginning: “The prize for solving longitude was eventually…” Passage: “he struggled for years to be paid the reward he was owed.” Correct ending: “…paid only after a long struggle.” A grammatically valid but wrong ending like “…never awarded to anyone” contradicts the passage. Match the meaning.",
              keyBn: "উদাহরণ: সঠিক ending 'paid only after a long struggle'; ব্যাকরণে মানানসই হলেও 'never awarded' প্যাসেজের বিরুদ্ধে যায়।",
            },
          },
        ],

        exercises: [
          {
            code: "PRACTICE",
            title: "Read this passage, then answer (Level 3)",
            instruction:
              "Passage: “Why do birds migrate thousands of kilometres each year? Researchers have long disagreed. Dr Feldman argues that migration is driven mainly by food: birds follow the seasons to wherever insects and seeds are most abundant, and everything else is secondary. Professor Osei takes a different view, proposing that breeding is the true driver, since many species travel to reach safe, predator-poor sites to raise their young, even where food is no better. A third researcher, Dr Nakamura, is sceptical of single explanations altogether, suggesting that migration usually results from several pressures acting together, and warns against tidy theories. What the three agree on is that migration is costly and dangerous, and that only strong survival advantages could sustain it.”",
            instructionBn: "নিচের প্যাসেজ পড়ে ড্রিল ১১.১–১১.৪ করুন।",
          },
          {
            code: "Drill 11.1",
            title: "Matching Features (Level 3)",
            instruction:
              "Match each view to a researcher (A = Feldman, B = Osei, C = Nakamura). 1. Migration is mainly about finding food. 2. Migration has no single cause. 3. Migration is driven by the need to breed safely.",
            instructionBn: "প্রতিটি মতকে গবেষকের সঙ্গে মেলান।",
          },
          {
            code: "Drill 11.2",
            title: "Matching Information (Level 3)",
            instruction:
              "Which sentence of the passage contains: 1. a point all three researchers accept? 2. a warning against simple explanations?",
            instructionBn: "কোন বাক্যে আছে: ১. সবাই মানে এমন পয়েন্ট ২. সরল ব্যাখ্যার বিরুদ্ধে সতর্কতা?",
          },
          {
            code: "Drill 11.3",
            title: "Multiple choice (Level 3)",
            instruction:
              "Which statement is best supported by the passage? A) The researchers agree on the main cause of migration. B) The researchers disagree on the cause but agree migration is risky. C) Migration has now been fully explained.",
            instructionBn: "কোন বিবৃতি প্যাসেজ সবচেয়ে সমর্থন করে?",
          },
          {
            code: "Drill 11.4",
            title: "Matching sentence endings (Level 4)",
            instruction:
              "Complete: “Professor Osei believes birds may migrate to breeding sites…” Endings: i) …because food is always better there. ii) …even when food is no better there. iii) …only when no predators exist anywhere.",
            instructionBn: "বাক্যটি সম্পূর্ণ করুন।",
          },
        ],

        answerKey: {
          "Drill 11.1 — Matching Features": [
            { q: "1. Migration is mainly about finding food.", answer: "A, Feldman. “Migration is driven mainly by food.” Direct attribution." },
            { q: "2. Migration has no single cause.", answer: "C, Nakamura. “Sceptical of single explanations… several pressures acting together.” Match the view to the named sceptic, not to whoever is nearest." },
            { q: "3. Migration is driven by the need to breed safely.", answer: "B, Osei. “Breeding is the true driver… to reach safe, predator-poor sites to raise their young.”", why: "Each view is tied to its researcher by the sentence that names them. You matched by attribution, not proximity. Note Nakamura sits last but her view is not “food” or “breeding”; a proximity guesser might mismatch." },
          ],
          "Drill 11.2 — Matching Information": [
            { q: "1. a point all three researchers accept", answer: "The final sentence: “What the three agree on is that migration is costly and dangerous, and that only strong survival advantages could sustain it.”" },
            { q: "2. a warning against simple explanations", answer: "Nakamura’s sentence: “warns against tidy theories.”", why: "Matching Information wants the sentence that contains the specific detail. You scanned for the concept (agreement; warning) and found the exact line, ignoring paragraph topic." },
          ],
          "Drill 11.3 — Multiple choice": [
            { q: "Best supported statement", answer: "B. The passage shows disagreement on the cause (three different views) but explicit agreement that migration is “costly and dangerous.” A is wrong (they disagree on cause). C is wrong (the passage never claims it is fully explained).", why: "The fully-supported option wins. C is an outside-knowledge or overreach trap; A distorts the agreement. Only B is provable from the text." },
          ],
          "Drill 11.4 — Matching sentence endings": [
            { q: "“Professor Osei believes birds may migrate to breeding sites…”", answer: "ii, even when food is no better there. Verify against: “even where food is no better.”", why: "Ending i contradicts the passage. Ending iii (“only when no predators exist anywhere”) overstates “predator-poor” into “no predators anywhere,” a strength-of-claim overreach. Only ii matches both meaning and grammar." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 11 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 12 · Reading Question Types, Part Two: Completion, Diagrams, Short Answer
// ────────────────────────────────────────────────────────────
async function seedFile12() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 12 · Reading Question Types, Part Two: Completion, Diagrams & Short Answer",
      titleBn: "ফাইল ১২ · Reading প্রশ্নের ধরন, পর্ব ২: Completion, Diagram ও Short Answer",
      position: 22,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Module 2: IELTS Reading",
        intro:
          "This file covers the completion family in Reading (sentence, summary, note, table, and flow-chart completion), plus diagram labelling and short answer. As in Listening, these share one engine, so we build it once and then show what changes for each type.",
        introBn:
          "ফাইল ১২-এর মূল কথা: Reading-এর completion পরিবার (sentence, summary, note, table, flow-chart), diagram labelling ও short answer। এগুলোর একই engine — একবার গড়ে তারপর প্রতিটির পার্থক্য দেখানো।",

        sections: [
          {
            code: "engine",
            title: "THE READING COMPLETION ENGINE",
            titleBn: "Reading Completion Engine",
            content: {
              principle:
                "In Reading completion, the answer is almost always a word or words taken directly from the passage, and you must usually copy it exactly as it appears, in the same form and spelling. You are not composing an answer; you are selecting the right words from the text.",
              principleBn:
                "নীতি: Reading completion-এ উত্তর প্রায় সবসময় প্যাসেজ থেকে সরাসরি নেওয়া শব্দ, হুবহু একই রূপে ও বানানে কপি করতে হয়। আপনি উত্তর রচনা করছেন না — টেক্সট থেকে সঠিক শব্দ বেছে নিচ্ছেন।",
              coreFact:
                "There are two flavours of completion, and you must know which you face.\n\nWords-from-passage. You supply the missing words yourself by taking them from the text. Copy them exactly, and obey the word limit. This is the common case.\n\nWord bank (a box of options). You choose from a supplied list, which has more options than gaps. Here the box words are often paraphrases, not the passage’s exact words, so the skill shifts to matching the box word’s meaning to the passage. The extra options are deliberate distractors.",
            },
          },
          {
            code: "routine",
            title: "The routine · The universal traps",
            titleBn: "রুটিন · সর্বজনীন ফাঁদ",
            content: {
              steps: [
                { term: "1. Predict the gap’s grammar", en: "Read around the gap. Noun, verb, adjective, number? Singular or plural? The words on both sides of the gap fix this." },
                { term: "2. Locate the region", en: "These types usually follow passage order, so move forward through the text. Scan for the gap’s anchor or the paraphrase of its surrounding words." },
                { term: "3. Read around the gap in the passage", en: "The answer lives in the sentence the region points to. Read the whole sentence, and its neighbours if needed." },
                { term: "4. Pick the exact word(s)", en: "Choose words that fit both the meaning and the grammar of the gap." },
                { term: "5. Obey the limit and spelling", en: "Trim to the word limit, copy spelling exactly." },
              ],
              bullets: [
                "Grammar fits, meaning does not. A word may slot in neatly yet say the wrong thing. Meaning first, grammar second.",
                "A word from the wrong sentence. The right-looking word sits in a nearby sentence that does not answer the gap.",
                "Changing the word’s form. You wrote “decision” but the passage says “decide” and the gap needs the passage’s exact word.",
                "Word limit and spelling. Too many words, or a misspelling, is a wrong answer.",
              ],
              tutorTip:
                "In words-from-passage completion, if your answer is a word that never appears in the passage, you are very likely wrong. These tasks pull the answer straight from the text. When you find yourself inventing a synonym, stop and look again for the actual word the passage used.",
              tutorTipBn:
                "Words-from-passage completion-এ যদি আপনার উত্তরটা প্যাসেজে না-ই থাকে, তাহলে প্রায় নিশ্চিত ভুল। উত্তর সরাসরি টেক্সট থেকে আসে। নিজের সমার্থক শব্দ বসাচ্ছেন মনে হলে থামুন, প্যাসেজের আসল শব্দটা খুঁজুন।",
            },
          },
          {
            code: "SC",
            title: "1. SENTENCE COMPLETION",
            titleBn: "১. Sentence Completion",
            content: {
              points: [
                { term: "Recognise it", en: "Standalone sentences each with a gap, filled with words from the passage." },
                { term: "What it tests", en: "Catching a specific detail that completes a single idea." },
                { term: "Order", en: "Follows passage order." },
                { term: "Before you search", en: "Read each sentence and predict the gap’s shape. The non-gap part is your keyword cluster, and it will appear in the passage, usually paraphrased, just before the answer." },
                { term: "Locate and evidence", en: "Scan for the sentence’s subject, read the passage sentence, and take the exact words that complete the meaning." },
                { term: "Traps", en: "The passage paraphrases the sentence heavily. Word-limit overreach is common because the passage phrase is longer than the limit." },
                { term: "Beginner vs expert", en: "The beginner copies a whole passage phrase and breaks the word limit; the expert takes only the exact words the gap needs." },
              ],
              key: "Worked example — Sentence: “Harrison’s fourth clock was finally accurate enough to solve the problem of ____.” Passage: “His fourth design finally proved accurate enough” and the topic is longitude. Answer: longitude. The sentence paraphrases “design” as “clock”; the answer word is taken exactly.",
              keyBn: "উদাহরণ: উত্তর 'longitude'; 'design'-কে 'clock' বলা হয়েছে, উত্তর হুবহু নেওয়া।",
            },
          },
          {
            code: "SummC",
            title: "2. SUMMARY COMPLETION",
            titleBn: "২. Summary Completion",
            content: {
              points: [
                { term: "Recognise it", en: "A paragraph that summarises a section of the passage, with gaps. Either words-from-passage or a word bank." },
                { term: "What it tests", en: "Understanding a section’s meaning and fitting words into coherent connected prose." },
                { term: "Order", en: "Follows the order of the section it summarises, not necessarily the whole passage. Identify which part of the passage the summary covers first." },
                { term: "Before you search", en: "Read the whole summary for sense, then predict each gap. Connected prose gives strong grammatical clues. If there is a word bank, read all options and note that several are distractors." },
                { term: "Locate and evidence", en: "Find the section the summary covers, then work gap by gap. For words-from-passage, take the exact word. For a word bank, match the box word’s meaning to the passage." },
                { term: "Traps", en: "With a bank, an option fits the grammar of a gap but not the meaning. Without a bank, the word-limit and exact-form traps apply." },
                { term: "Beginner vs expert", en: "The beginner picks a bank word that fits the grammar; the expert confirms the passage actually supports that meaning before choosing." },
              ],
              key: "Worked example (word bank) — Summary: “The cork oak is valuable because its bark can be harvested ____ without harming the tree.” Bank: repeatedly / permanently / accidentally / cheaply. Passage: “stripped of its bark without being killed… a dozen times across a lifespan.” Answer: repeatedly. The bank word is a paraphrase of “a dozen times,” not a passage word.",
              keyBn: "উদাহরণ: উত্তর 'repeatedly'; bank-শব্দ 'a dozen times'-এর paraphrase, প্যাসেজের হুবহু শব্দ নয়।",
            },
          },
          {
            code: "NC",
            title: "3. NOTE COMPLETION",
            titleBn: "৩. Note Completion",
            content: {
              points: [
                { term: "Recognise it", en: "Notes under headings or bullets, with gaps, words from the passage." },
                { term: "What it tests", en: "Pulling key points from a section into a structured note." },
                { term: "Order", en: "Follows passage order, guided by the headings." },
                { term: "Before you search", en: "Use the headings as your map; they mirror the passage’s structure and show where each answer sits. Predict each gap’s shape." },
                { term: "Locate and evidence", en: "Move through the section the notes cover, taking exact words for each gap." },
                { term: "Traps", en: "The surrounding detail tempts you to write more than the gap needs; take only the key word." },
              ],
              key: "Worked example — Note: “Tuatara incubation: eggs take over ____ to hatch.” Passage: “the eggs take over a year to hatch.” Answer: a year.",
              keyBn: "উদাহরণ: উত্তর 'a year'।",
            },
          },
          {
            code: "TC",
            title: "4. TABLE COMPLETION",
            titleBn: "৪. Table Completion",
            content: {
              points: [
                { term: "Recognise it", en: "A grid with row and column headings and blank cells, filled from the passage." },
                { term: "What it tests", en: "Slotting details into the right cell across two dimensions." },
                { term: "Order", en: "Follows the passage, often row by row." },
                { term: "Before you search", en: "Read the headings; they tell you exactly what each blank cell needs, doing your prediction for you." },
                { term: "Locate and evidence", en: "Anchor on the row’s subject, find the passage region, take the detail the column asks for." },
                { term: "Traps", en: "Writing a detail in the wrong cell; two similar values inviting confusion." },
              ],
              key: "Worked example — Table: Tree | First harvest age | Harvest interval. Row “Cork oak”: Passage: “first harvested at about twenty-five years old, and thereafter only once every nine years.” Answers: twenty-five (years) and (every) nine years.",
              keyBn: "উদাহরণ: উত্তর twenty-five (years) ও (every) nine years, প্রতিটি কক্ষে বসানো।",
            },
          },
          {
            code: "FC",
            title: "5. FLOW-CHART COMPLETION",
            titleBn: "৫. Flow-chart Completion",
            content: {
              points: [
                { term: "Recognise it", en: "Boxes joined by arrows showing a process, with gaps, filled from the passage." },
                { term: "What it tests", en: "Following a sequence and catching each stage." },
                { term: "Order", en: "Follows the logical order of the process, which usually but not always matches the passage order. Watch for a passage that describes steps out of sequence." },
                { term: "Before you search", en: "Read the filled boxes to understand the process, and predict each gap (often a verb or a noun for an action or material)." },
                { term: "Locate and evidence", en: "Find the passage description of the process and map each described step onto the correct box by meaning, using the arrows as the sequence." },
                { term: "Traps", en: "The passage may present steps in a different order than the chart, so match by logic, not by order of mention." },
              ],
              key: "Worked example — Chart: Bark regenerates from ____ → tree stripped again after nine years. Passage: “it regenerates a fresh layer from a living tissue called the cork cambium.” Answer: (the) cork cambium.",
              keyBn: "উদাহরণ: উত্তর (the) cork cambium।",
            },
          },
          {
            code: "DL",
            title: "6. DIAGRAM LABELLING",
            titleBn: "৬. Diagram Labelling",
            content: {
              points: [
                { term: "Recognise it", en: "A picture of an object or process with parts to label, filled from the passage." },
                { term: "What it tests", en: "Matching the passage’s description of positions and functions to parts of an image." },
                { term: "Order", en: "Follows the passage’s description of the object, which may run in a spatial order (top to bottom) rather than the passage’s overall order." },
                { term: "Before you search", en: "Study the diagram and understand the object. Note the labels and their positions, and predict the kind of word each needs (usually a noun for a part or material)." },
                { term: "Locate and evidence", en: "Find the passage that describes the object, and use its position and function language (“at the base,” “the layer that,” “which surrounds”) to place each label." },
                { term: "Traps", en: "The passage may describe a part by function rather than name; technical words may be unfamiliar. Use position and function to place a part even when the term is new." },
              ],
              key: "Worked example — Diagram of a cork oak trunk cross-section, label the regenerating layer. Passage: “regenerates a fresh layer from a living tissue called the cork cambium.” Answer: cork cambium.",
              keyBn: "উদাহরণ: উত্তর cork cambium, যে স্তর bark পুনর্গঠন করে সেখানে।",
            },
          },
          {
            code: "SA",
            title: "7. SHORT ANSWER",
            titleBn: "৭. Short Answer",
            content: {
              points: [
                { term: "Recognise it", en: "Direct questions answered in a few words from the passage, within a word limit." },
                { term: "What it tests", en: "Catching a specific fact and reporting it concisely." },
                { term: "Order", en: "Follows passage order." },
                { term: "Before you search", en: "The question word (what, where, how many, who) tells you the answer’s shape directly. Predict it, then note the word limit." },
                { term: "Locate and evidence", en: "Scan for the question’s anchor, read the passage sentence, take the exact words that answer the question word." },
                { term: "Traps", en: "Answering a related detail rather than the exact question; breaking the word limit by copying a whole phrase; a question that asks for two things." },
              ],
              key: "Worked example — Q: “Which country produces about half the world’s cork?” (ONE WORD) Passage: “native to the western Mediterranean, especially Portugal, which today produces around half of the world’s cork.” Answer: Portugal.",
              keyBn: "উদাহরণ: উত্তর Portugal, এক শব্দ।",
            },
          },
        ],

        exercises: [
          {
            code: "Drill 12.1",
            title: "Sentence completion (Level 2)",
            instruction:
              "Sentence: “The tuatara belongs to an order that flourished over ____ years ago.” (from the passage: “an older order that flourished over two hundred million years ago”)",
            instructionBn: "শূন্যস্থান পূরণ করুন (প্যাসেজ থেকে)।",
          },
          {
            code: "Drill 12.2",
            title: "Table completion (Level 3)",
            instruction:
              "Table row “Longitude problem”: Prize offered in ____; solved by ____; his profession ____. (longitude passage)",
            instructionBn: "টেবিলের সারি পূরণ করুন।",
          },
          {
            code: "Drill 12.3",
            title: "Summary completion with a word bank (Level 3)",
            instruction:
              "Summary: “Longitude was hard to find because no ____ of the time could stay accurate at sea; the answer came not from astronomy but from a self-taught ____.” Bank: clock / star / sailor / carpenter / map.",
            instructionBn: "word bank থেকে পূরণ করুন।",
          },
          {
            code: "Drill 12.4",
            title: "Short answer with a trap (Level 4)",
            instruction:
              "Q: “For how long can a tuatara remain active that would leave other reptiles sluggish?” Read carefully. What does this question actually ask, and what is the answer? (tuatara passage)",
            instructionBn: "প্রশ্নটি আসলে কী চায় ও উত্তর কী?",
          },
        ],

        answerKey: {
          "Drill 12.1 — Sentence completion": [
            { q: "The tuatara belongs to an order that flourished over ____ years ago.", answer: "two hundred million (from “over two hundred million years ago”), trimmed to fit before “years ago.”", why: "Take the passage’s exact figure; do not write “200,000,000” unless the limit favours it, and do not paraphrase to “a very long time.”" },
          ],
          "Drill 12.2 — Table completion": [
            { q: "Prize offered / solved by / profession", answer: "Prize offered in 1714; solved by (John) Harrison; profession (a) carpenter.", why: "Each is a passage word placed in its cell. The table headings predicted the shapes: a year, a name, a job." },
          ],
          "Drill 12.3 — Summary completion with a word bank": [
            { q: "no ____ … a self-taught ____", answer: "“no clock of the time could stay accurate at sea; … a self-taught carpenter.”", why: "Both are supported by the passage. “Star,” “sailor,” and “map” are distractors: they fit some grammar but not the meaning. In a bank task always confirm by meaning, not by spotting the word." },
          ],
          "Drill 12.4 — Short answer with a trap": [
            { q: "“For how long can a tuatara remain active…?”", answer: "The passage does not give a duration for cold-activity; it says the tuatara “remains active at low temperatures that would leave most reptiles sluggish.” The real, answerable fact is about conditions (low temperatures), not a length of time.", why: "This question has a trap in its wording. If it genuinely asked “at what temperatures does the tuatara stay active,” the answer is low temperatures. If it insisted on a duration, that information is not given. Read the question word precisely, and do not manufacture an answer of a shape the passage never provides." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 12 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 13 · The True/False/Not Given and Yes/No/Not Given Masterclass
// ────────────────────────────────────────────────────────────
async function seedFile13() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 13 · The True/False/Not Given and Yes/No/Not Given Masterclass",
      titleBn: "ফাইল ১৩ · True/False/Not Given ও Yes/No/Not Given মাস্টারক্লাস",
      position: 23,
      difficulty: 3,
      is_published: true,
      body: {
        module: "Module 2: IELTS Reading",
        intro:
          "No question type frightens candidates more than this one, and the fear has a single source: Not Given. True and False feel manageable. Not Given feels like guessing. It is not. Not Given is a precise verdict with precise rules, and by the end of this masterclass you will reach it with the same confidence as the other two.\n\nThe secret is that this is not really a reading task. It is a logic task. You are comparing a claim against evidence and naming the relationship between them.",
        introBn:
          "ফাইল ১৩-এর মূল কথা: এই ধরনটাই সবচেয়ে ভয় দেখায়, আর ভয়ের উৎস একটাই: Not Given। True/False সামলানো যায়, Not Given অনুমানের মতো লাগে — কিন্তু নয়। Not Given একটি নির্দিষ্ট নিয়মওয়ালা রায়। আসলে এটা reading নয়, logic-এর কাজ: দাবি ও প্রমাণের সম্পর্কের নাম দেওয়া।",

        sections: [
          {
            code: "verdicts",
            title: "THE THREE VERDICTS",
            titleBn: "তিন রায়",
            content: {
              coreFact: "Fix these definitions exactly. Most errors come from blurring them.",
              points: [
                { term: "TRUE", en: "The passage confirms the statement. It states the same thing, or says it in different words with the same meaning." },
                { term: "FALSE", en: "The passage contradicts the statement. It says the opposite, or something that cannot both be true with the statement." },
                { term: "NOT GIVEN", en: "The passage neither confirms nor contradicts the statement. The information is absent or insufficient. The topic may even appear, but this specific claim is not settled by the text." },
              ],
              principle:
                "False means the passage says the opposite. Not Given means the passage does not say. These are completely different. Confusing “the passage disagrees” with “the passage is silent” is the deepest TFNG error, and it costs marks in both directions.",
              principleBn:
                "নীতি: False মানে প্যাসেজ উল্টো বলে। Not Given মানে প্যাসেজ বলেই না। দুটো সম্পূর্ণ ভিন্ন। 'প্যাসেজ দ্বিমত' আর 'প্যাসেজ নীরব' গুলিয়ে ফেলাই সবচেয়ে গভীর ভুল।",
            },
          },
          {
            code: "method",
            title: "THE METHOD: CLAIM, EVIDENCE, RELATIONSHIP",
            titleBn: "পদ্ধতি: CLAIM, EVIDENCE, RELATIONSHIP",
            content: {
              coreFact: "Run these three steps on every statement, in order.",
              steps: [
                { term: "Step 1: CLAIM", en: "Read the statement and pin down exactly what it asserts. Break it into parts. What is the subject? What is being claimed about it? Are there any quantifiers (all, some, most), comparisons (more than, the largest), or qualifiers (only, always, sometimes)? Underline the precise words that carry the claim." },
                { term: "Step 2: EVIDENCE", en: "Locate the passage lines on the same subject. TFNG follows passage order, so move forward through the text. Read the relevant sentence and its neighbours carefully. This is close reading, not scanning." },
                { term: "Step 3: RELATIONSHIP", en: "Decide how the evidence relates to the claim: confirms in same or paraphrased words → TRUE; contradicts → FALSE; does not address the exact claim, or addresses only part → NOT GIVEN." },
              ],
              key: "Claim, evidence, relationship. Never skip to a verdict without naming the relationship. The verdict is the name of the relationship, nothing more.",
              keyBn: "Claim, evidence, relationship — সম্পর্কের নাম না দিয়ে রায়ে ঝাঁপাবেন না। রায় হলো সম্পর্কেরই নাম, আর কিছু নয়।",
            },
          },
          {
            code: "distinctions",
            title: "THE DISTINCTIONS THAT DECIDE THE HARD ONES",
            titleBn: "কঠিনগুলো যে পার্থক্যে ঠিক হয়",
            content: {
              coreFact: "The difficult items all turn on telling these five relationships apart.",
              points: [
                { term: "Contradiction (False)", en: "The passage states the opposite. This includes an opposite fact, a different number or date, a clashing quantifier (statement says “all,” passage says “some”), or a reversed comparison." },
                { term: "Absence (Not Given)", en: "The passage simply does not address the claim. The topic may be present, but this specific point is never made either way. Absence is Not Given, never False." },
                { term: "Partial information (usually Not Given)", en: "The statement makes a compound claim, and the passage supports only part of it. For True, every part must be supported. One part confirmed but another never addressed → Not Given. One part contradicted → False." },
                { term: "Inference and assumption (danger)", en: "You may accept a clear paraphrase or a meaning the passage necessarily carries. You may not accept something merely plausible, likely, or a reasonable guess. If you have to assume a fact to call the statement True, the honest verdict is Not Given." },
                { term: "Outside knowledge (trap)", en: "Judge only by the passage, never by what you know about the world. A statement can be factually true in reality and still be Not Given." },
              ],
            },
          },
          {
            code: "rules",
            title: "PRACTICAL DECISION RULES",
            titleBn: "ব্যবহারিক সিদ্ধান্ত-নিয়ম",
            content: {
              bullets: [
                "If the statement is stronger or more specific than the passage, it is usually False or Not Given. False if the passage contradicts it, Not Given if the passage simply never goes that far.",
                "Extreme words (all, only, never, always, none, every) deserve suspicion. Passages rarely support absolutes, so a statement with an extreme word is often False or Not Given.",
                "Absence is Not Given, not False. If you cannot find the claim addressed at all, that is Not Given.",
                "False needs a real contradiction. Before writing False, find the sentence that says the opposite. If you cannot point to it, you are probably looking at Not Given.",
              ],
              tutorTip:
                "When you feel yourself thinking “well, that’s probably true” or “that would make sense,” stop. Probably and would-make-sense are the exact feelings that signal Not Given. True is for what the passage confirms, not for what seems reasonable. Your own agreement with a statement is not evidence.",
              tutorTipBn:
                "যখন মনে হয় 'এটা তো সম্ভবত সত্যি' বা 'এটা যুক্তিসঙ্গত', তখনই থামুন। সম্ভবত আর যুক্তিসঙ্গত অনুভূতিটাই Not Given-এর ইঙ্গিত। প্যাসেজ নিশ্চিত করলে True, আপনার মনে হলে নয়।",
            },
          },
          {
            code: "YNNG",
            title: "YES / NO / NOT GIVEN",
            titleBn: "Yes / No / Not Given",
            content: {
              coreFact:
                "Yes/No/Not Given uses the identical logic, with one change of target. TFNG tests facts and information. YNNG tests the writer’s views, claims, and opinions.",
              points: [
                { term: "YES", en: "The writer holds or asserts this view." },
                { term: "NO", en: "The writer holds or asserts the opposite view." },
                { term: "NOT GIVEN", en: "The writer’s view on this is not given." },
              ],
              coreFact2:
                "The extra skill is spotting where the writer’s opinion lives. Look for opinion language: argues, believes, suggests, claims, contends, clearly, surely, unfortunately, worryingly, rightly, it is a mistake to. Neutral fact-reporting is not the writer’s opinion; a sentence that simply states what happened tells you nothing about what the writer thinks. In YNNG, you are tracking the writer’s stance, so read for judgement words, not just facts.",
            },
          },
          {
            code: "expert",
            title: "EXPERT THINKING: a Not Given that looks True",
            titleBn: "বিশেষজ্ঞ চিন্তা: True-এর মতো দেখানো Not Given",
            content: {
              coreFact: "Statement: “The waggle dance took von Frisch many years to decode.” Passage: “The dance was first decoded by Karl von Frisch in the mid-twentieth century, work for which he later received a Nobel Prize.”",
              examples: [
                { wrong: "WHAT A BEGINNER THINKS: “Decoding something that complex must have taken years. That sounds right. True.”" },
                { wrong: "WHAT AN EXPERIENCED STUDENT THINKS: “The passage talks about the decoding and von Frisch, so the answer is probably here. Leans True but feels unsure.”" },
                { right: "WHAT AN EXPERT CANDIDATE NOTICES: The claim is specifically about how long it took. The passage says who decoded it and when, and that he won a prize, but says nothing about the duration of the work. The topic is present; this exact claim is absent. To call it True, you would have to assume the timescale, which is inference, not evidence. Verdict: Not Given. The plausibility was the trap.", why: "A statement about a detail the passage never gives is Not Given, no matter how reasonable it sounds and no matter how much of its topic appears in the text." },
              ],
            },
          },
        ],

        exercises: [
          {
            code: "PASSAGE A",
            title: "Passage A — Honeybees (questions 1–10)",
            instruction:
              "Passage A: “Honeybees share the location of food through a behaviour known as the waggle dance. A returning forager runs in a figure-of-eight on the vertical honeycomb, waggling her abdomen during the straight central run. The angle of that run relative to vertical encodes the direction of the food relative to the sun, while the duration of the waggle indicates the distance: a longer waggle means a more distant source. The dance was first decoded by Karl von Frisch in the mid-twentieth century, work for which he later received a Nobel Prize. Other bees follow the dancer closely, and many fly out to the described location, though some ignore the dance entirely and forage where they please. The dance is less precise for very close food sources, for which bees use a simpler round dance instead.” TRUE / FALSE / NOT GIVEN: 1. The waggle dance tells other bees where food can be found. 2. The direction of the food is shown by how long the bee waggles. 3. Karl von Frisch received a Nobel Prize for work on the dance. 4. Von Frisch decoded the dance in the nineteenth century. 5. Every bee that watches the dance flies to the food. 6. The round dance is used for food sources that are very far away. 7. The waggle dance is performed on a horizontal surface. 8. Von Frisch’s findings were initially rejected by other scientists. 9. Bees can also communicate the quality of a food source through the dance. 10. The dance is more precise for distant sources than for very close ones.",
            instructionBn: "Passage A পড়ে প্রশ্ন ১–১০ TRUE/FALSE/NOT GIVEN দিন।",
          },
          {
            code: "PASSAGE B",
            title: "Passage B — Antikythera mechanism (questions 11–20)",
            instruction:
              "Passage B: “Recovered in 1901 from an ancient shipwreck off the Greek island of Antikythera, the corroded bronze device now known as the Antikythera mechanism has puzzled researchers for over a century. Roughly the size of a shoebox, it originally held at least thirty interlocking gears. Modern imaging has revealed that it modelled the movements of the sun and moon and could predict eclipses, functioning as a kind of astronomical calculator. Most scholars date its construction to the second century BCE. Nothing of comparable mechanical complexity is known from the following thousand years, which has led some to call it the first analogue computer. The identity of its maker remains unknown, though its sophistication suggests a long tradition of similar instruments that have not survived. Replicas built from the imaging data confirm that the surviving gear ratios reproduce genuine astronomical cycles.” TRUE / FALSE / NOT GIVEN: 11. The mechanism was found in the twentieth century. 12. The device contained fewer than twenty gears. 13. The mechanism could be used to predict eclipses. 14. The mechanism was considerably larger than a shoebox. 15. Most scholars agree on the identity of the mechanism’s maker. 16. Devices of similar complexity were common in the centuries that followed. 17. The mechanism was made of iron. 18. Replicas have shown that the gears reproduce real astronomical cycles. 19. Other astronomical instruments were found in the same shipwreck. 20. The mechanism took several years to construct.",
            instructionBn: "Passage B পড়ে প্রশ্ন ১১–২০ দিন।",
          },
          {
            code: "PASSAGE C",
            title: "Passage C — Handwriting (questions 21–27, Yes/No/Not Given)",
            instruction:
              "Passage C: “Some argue that teaching handwriting is a waste of classroom time in an age of keyboards. I find this view short-sighted. The research I have seen suggests that forming letters by hand supports early reading and memory in ways typing does not, and to abandon it would be to trade a proven benefit for mere convenience. Of course, children must also learn to type; no one sensible disputes that. But the two are not in competition, and framing them as either-or is a false choice. What worries me is not that schools teach typing, but that some now teach nothing else. Handwriting need not dominate the timetable; a few minutes a day would preserve its benefits. The claim that handwriting harms children by slowing them down strikes me as unpersuasive.” YES / NO / NOT GIVEN (the writer’s views): 21. The writer believes teaching handwriting wastes classroom time. 22. The writer thinks children should not learn to type. 23. The writer regards handwriting and typing as opposed alternatives. 24. The writer is concerned that some schools now teach only typing. 25. The writer believes handwriting improves children’s creativity. 26. The writer thinks handwriting should take up most of the timetable. 27. The writer finds the argument that handwriting slows children down convincing.",
            instructionBn: "Passage C পড়ে প্রশ্ন ২১–২৭ YES/NO/NOT GIVEN দিন।",
          },
        ],

        answerKey: {
          "Passage A (1–10)": [
            { q: "1", answer: "TRUE. Evidence: “share the location of food through… the waggle dance.” Confirmed, paraphrased." },
            { q: "2", answer: "FALSE. Angle encodes direction; duration indicates distance. Contradiction — direction and distance are swapped." },
            { q: "3", answer: "TRUE. Evidence: “work for which he later received a Nobel Prize.”" },
            { q: "4", answer: "FALSE. Evidence: “mid-twentieth century.” Contradiction (wrong century)." },
            { q: "5", answer: "FALSE. Evidence: “some ignore the dance entirely.” Contradiction via quantifier: “every” versus “some ignore.”" },
            { q: "6", answer: "FALSE. Round dance is for “very close food sources.” Contradiction." },
            { q: "7", answer: "FALSE. Evidence: “vertical honeycomb.” Contradiction." },
            { q: "8", answer: "NOT GIVEN. The passage covers the decoding and the prize but says nothing about how other scientists received the work. Absence, so Not Given, not False." },
            { q: "9", answer: "NOT GIVEN. The passage covers location, direction, and distance, but never quality. Absence — the classic Not Given shape." },
            { q: "10", answer: "TRUE. Evidence: “less precise for very close food sources.” Confirmed by necessary meaning: if less precise for very close, it is more precise for the rest, including distant ones." },
          ],
          "Passage B (11–20)": [
            { q: "11", answer: "TRUE. Evidence: “Recovered in 1901.” 1901 is the twentieth century." },
            { q: "12", answer: "FALSE. Evidence: “at least thirty interlocking gears.” Contradiction (number clash)." },
            { q: "13", answer: "TRUE. Evidence: “could predict eclipses.”" },
            { q: "14", answer: "FALSE. Evidence: “roughly the size of a shoebox.” “Larger than” conflicts with “roughly the size of.”" },
            { q: "15", answer: "FALSE. Evidence: “the identity of its maker remains unknown.” Contradiction." },
            { q: "16", answer: "FALSE. Evidence: “nothing of comparable mechanical complexity is known from the following thousand years.” Contradiction." },
            { q: "17", answer: "FALSE. Evidence: “bronze device.” Contradiction." },
            { q: "18", answer: "TRUE. Evidence: “Replicas… confirm that the surviving gear ratios reproduce genuine astronomical cycles.”" },
            { q: "19", answer: "NOT GIVEN. The passage mentions the shipwreck but says nothing about other instruments in it. Absence." },
            { q: "20", answer: "NOT GIVEN. The passage never states the construction time. Plausible, but not stated, so Not Given, not True." },
          ],
          "Passage C (21–27, Yes/No/Not Given)": [
            { q: "21", answer: "NO. The writer reports that “some argue” this, then says “I find this view short-sighted.” The writer’s own view is the opposite." },
            { q: "22", answer: "NO. Evidence: “children must also learn to type; no one sensible disputes that.”" },
            { q: "23", answer: "NO. Evidence: “the two are not in competition, and framing them as either-or is a false choice.”" },
            { q: "24", answer: "YES. Evidence: “What worries me is… that some now teach nothing else.”" },
            { q: "25", answer: "NOT GIVEN. The writer credits handwriting with supporting “early reading and memory,” but says nothing about creativity. Absence." },
            { q: "26", answer: "NO. Evidence: “Handwriting need not dominate the timetable.”" },
            { q: "27", answer: "NO. Evidence: the slowing-down argument “strikes me as unpersuasive.” The pattern: every False came with a sentence saying the opposite; every Not Given came from the passage being silent on the exact claim." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 13 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 14 · The Matching Headings Masterclass and the Reading Trap Library
// ────────────────────────────────────────────────────────────
async function seedFile14() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 14 · The Matching Headings Masterclass and the Reading Trap Library",
      titleBn: "ফাইল ১৪ · Matching Headings মাস্টারক্লাস ও Reading ফাঁদ-তালিকা",
      position: 24,
      difficulty: 3,
      is_published: true,
      body: {
        module: "Module 2: IELTS Reading",
        intro:
          "Two things in one file. First, Matching Headings, the type that most rewards reading for main idea rather than detail. Then the Reading Trap Library, a single reference gathering every trap in the module, so you can revise them in one place before the exam.",
        introBn:
          "ফাইল ১৪-এর মূল কথা: এক ফাইলে দুটি জিনিস। প্রথমে Matching Headings — যে ধরন detail নয়, main idea পড়াকে পুরস্কৃত করে। তারপর Reading ফাঁদ-তালিকা, মডিউলের সব ফাঁদ এক জায়গায়, পরীক্ষার আগে রিভিশনের জন্য।",

        sections: [
          {
            code: "P10",
            title: "PART 10 · THE MATCHING HEADINGS MASTERCLASS — What it is",
            titleBn: "Matching Headings মাস্টারক্লাস · এটি কী",
            content: {
              coreFact:
                "You are given a list of headings and asked to choose the correct heading for each paragraph or section. There are always more headings than paragraphs, so some headings are distractors that fit nothing.",
              principle:
                "Matching Headings tests one thing: can you identify the main idea, or the purpose, of a whole paragraph. It does not test details. A heading must capture what the entire paragraph is about, not one fact inside it.",
              principleBn:
                "নীতি: Matching Headings একটাই জিনিস পরীক্ষা করে — পুরো প্যারার main idea বা উদ্দেশ্য চিনতে পারা। detail পরীক্ষা করে না। heading-কে পুরো প্যারা কী নিয়ে তা ধরতে হবে, ভেতরের একটা তথ্য নয়।",
              coreFact2:
                "This is why the type feels different from the others. Everywhere else you hunt for a specific detail. Here you must step back and see the paragraph as a whole.",
            },
          },
          {
            code: "P10.oneword",
            title: "Why matching one keyword is never enough",
            titleBn: "কেন এক keyword মেলানো যথেষ্ট নয়",
            content: {
              coreFact:
                "The commonest failure is to spot a heading’s word inside a paragraph and match on that. It fails for two reasons. First, a heading’s keyword may appear in a paragraph that is mainly about something else, so the word is there but the main idea is not. Second, the paragraph’s real point may be expressed in completely different words from the heading, because headings are paraphrases. Matching a single word ignores both problems.\n\nThe correct unit of matching is the whole idea of the paragraph against the whole idea of the heading. One word is never the main idea.",
              bn: "সবচেয়ে সাধারণ ভুল: heading-এর একটা শব্দ প্যারায় দেখে মিলিয়ে ফেলা। শব্দ থাকতে পারে কিন্তু main idea না; আর আসল পয়েন্ট ভিন্ন শব্দে থাকে। পুরো ভাব বনাম পুরো ভাব মেলাতে হবে।",
            },
          },
          {
            code: "P10.mainidea",
            title: "How to find a paragraph’s main idea · Name the purpose",
            titleBn: "প্যারার main idea কীভাবে খোঁজেন · উদ্দেশ্যের নাম দিন",
            content: {
              coreFact:
                "Ask one question of the paragraph: “What is this paragraph mainly doing, or mainly about?” Answer it in a few words, in your own words, before you look at the headings.\n\nWhere the main idea sits varies: often in the first sentence (the topic sentence); sometimes in the last sentence, if the paragraph builds to its point; sometimes nowhere explicit, so you synthesise it from the whole paragraph.\n\nRemember the principle from File 09: the first sentence shows the paragraph’s direction but is not always its full main idea. Crucially, separate the main idea from the supporting material. A paragraph may contain an example, a statistic, a contrast, or a minor detail, and none of these is the main idea; they serve it.",
              bullets: [
                "giving background or context",
                "presenting a problem",
                "offering a solution",
                "describing a cause",
                "describing an effect or result",
                "giving an example",
                "making an argument or a claim",
                "reporting a research finding",
                "drawing a contrast",
                "summarising or concluding",
              ],
              coreFact2:
                "When you can say “this paragraph presents a problem” or “this paragraph reports a finding,” the right heading usually becomes obvious, because good headings often describe exactly these purposes.",
            },
          },
          {
            code: "P10.method",
            title: "The method, step by step · Heading-specific traps",
            titleBn: "ধাপে ধাপে পদ্ধতি · heading-নির্দিষ্ট ফাঁদ",
            content: {
              steps: [
                { term: "1", en: "Read the paragraph, leaning on the topic sentence but checking the arc of the whole." },
                { term: "2", en: "In your own words, state its main idea or purpose in a few words. Do this before reading the headings, so the headings cannot bias you." },
                { term: "3", en: "Find the heading that matches your summary." },
                { term: "4", en: "Check that no other paragraph fits that heading better, since each heading is used once." },
                { term: "5", en: "Cross off used headings, and remember the leftover headings are distractors that were never meant to fit." },
              ],
              coreFact:
                "Do the paragraphs you are confident about first, and cross off their headings, which narrows the choices for the harder paragraphs. If an example paragraph comes already matched in the instructions, use it: it removes one heading and shows you the level of paraphrase to expect.",
              bullets: [
                "A heading that matches a detail or example in the paragraph rather than its main idea.",
                "Two similar headings that differ by one important word; only one fits, so read both fully.",
                "A heading that matches the first sentence when that sentence was only a lead-in, not the paragraph’s point.",
              ],
              tutorTip:
                "Summarise each paragraph in your own words before you look at the headings. If you read the headings first, your eye starts hunting their words in the paragraph, and you match on words instead of meaning. Decide what the paragraph says, then go shopping for the heading that fits.",
              tutorTipBn:
                "হেডিং দেখার আগে প্রতিটি প্যারা নিজের ভাষায় সংক্ষেপে বলুন। আগে হেডিং পড়লে চোখ ওই শব্দগুলো প্যারায় খুঁজতে থাকে, অর্থ নয় শব্দ মেলায়। আগে ঠিক করুন প্যারা কী বলছে, পরে মানানসই হেডিং খুঁজুন।",
            },
          },
          {
            code: "P10.worked",
            title: "Worked example (urban trees)",
            titleBn: "কাজ-করা উদাহরণ (শহুরে গাছ)",
            content: {
              coreFact:
                "Passage: Paragraph A. Trees in cities do far more than decorate. They cool streets, filter pollutants, absorb rainfall, and have been linked to lower stress in residents. Paragraph B. Yet urban trees lead hard lives. Compacted soil, road salt, and construction harm them; many die within a decade. Paragraph C. Cities are now rethinking how they plant, using large shared soil trenches and species suited to local conditions. Paragraph D. Recent studies found that well-shaded streets can be several degrees cooler than bare ones during heatwaves.\n\nHeadings: i. The many benefits trees bring to cities ii. Why city trees struggle to survive iii. New ways of planting for longer life iv. Evidence that trees help cities cope with heat v. The cost of removing mature trees vi. How trees are planted in forests vii. The benefits of trees in the countryside.\n\nMatches: A to i, B to ii, C to iii, D to iv.",
              coreFact2:
                "The distractors teach the traps. Heading vii (“benefits… in the countryside”) is a similar-heading trap for i: same idea of benefits, wrong location, since paragraph A is about cities. Heading v (removing trees) and vi (forests) match single words that appear in the passage (“mature,” “forest”) but not any paragraph’s main idea. A keyword-matcher is pulled towards them; a main-idea reader is not.",
            },
          },
          {
            code: "P11",
            title: "PART 11 · THE READING TRAP LIBRARY",
            titleBn: "Reading ফাঁদ-তালিকা",
            content: {
              coreFact: "Here, in one place, are the traps that cost the most marks in Reading. For each: what it looks like, why students fall, how to recognise it, how to avoid it, and an example.",
              points: [
                { term: "Trap 1: Identical words, wrong meaning", en: "A question and a passage sentence share a distinctive word, but the sentences mean different things. Avoid it: match meaning, not words. Example: “western Mediterranean” vs “whole Mediterranean.”" },
                { term: "Trap 2: Right information, wrong paragraph", en: "The correct-sounding information appears, but in a paragraph that does not answer this question. Avoid it: use question order and the exact subject to confirm the right paragraph." },
                { term: "Trap 3: Partial truth", en: "Part of a statement is supported, part is not, or part is contradicted. Require every part to be supported for True. Example: “thirty gears and made of iron” — gears supported, iron contradicted → False." },
                { term: "Trap 4: Extreme wording", en: "A statement uses an absolute (all, only, never, always, none) the passage does not support. Example: “Every bee flies to the food,” when some ignore it → False." },
                { term: "Trap 5: Examples mistaken for main ideas", en: "A heading or answer matches an example the paragraph uses, not its point. Recognise the “for example,” “such as,” “for instance” marker. Example: a “road salt” heading for a paragraph about many threats." },
                { term: "Trap 6: Inference", en: "A statement not stated but seeming to follow from the passage. If you inferred it, it is Not Given. Example: “Decoding took von Frisch years,” when duration is never given." },
                { term: "Trap 7: Outside knowledge", en: "A statement true in the real world but not stated. Judge only by the passage. Example: “Bees are important pollinators” — true in life, but Not Given if unstated." },
                { term: "Trap 8: Similar headings", en: "Two headings almost the same, differing by one important word. Read both fully. Example: “benefits of trees in cities” vs “in the countryside.”" },
                { term: "Trap 9: Numerical traps", en: "A number differs from, or is reworded from, the passage figure. Check the exact value. “At least thirty” contradicts “fewer than twenty.”" },
                { term: "Trap 10: Comparison traps", en: "A comparison is reversed, or a mere comparison is inflated into a superlative. Reversed direction → False; comparative inflated to superlative → usually Not Given. Example: “more than all other countries combined” when the passage says “more than any other single country.”" },
              ],
              key: "The lesson of the whole library: nearly every Reading trap is a version of one mistake, matching a word, a part, or a topic instead of the whole, exact meaning. Verify meaning, check every part, confirm the location, and watch the small words, and the traps stop working.",
              keyBn: "পুরো তালিকার শিক্ষা: প্রায় প্রতিটি ফাঁদ একটাই ভুলের রূপ — পুরো সঠিক অর্থের বদলে একটা শব্দ, অংশ বা টপিক মেলানো। অর্থ যাচাই করুন, প্রতিটি অংশ দেখুন, অবস্থান নিশ্চিত করুন, ছোট শব্দে নজর দিন।",
            },
          },
        ],

        exercises: [
          {
            code: "PRACTICE",
            title: "Trap spotting (use the urban trees passage above)",
            instruction:
              "For each item, give the verdict and name the trap it is built on. 1. (TFNG) “Road salt is the main reason city trees die.” 2. (TFNG) “City trees never reach the lifespan they would in a forest.” 3. (TFNG) “Well-shaded streets can be cooler than bare streets in hot weather.” 4. (TFNG) “Trees improve residents’ mental health more than they reduce flooding.” 5. (Heading) A student matches Paragraph C to the heading “The problem of compacted soil.” Which trap is this?",
            instructionBn: "প্রতিটির রায় দিন ও কোন ফাঁদ লিখুন।",
          },
        ],

        answerKey: {
          "Trap spotting": [
            { q: "1. “Road salt is the main reason city trees die.”", answer: "NOT GIVEN. Trap: examples mistaken for main ideas (and extreme wording). The passage lists road salt as one of several threats, never as “the main reason.”" },
            { q: "2. “City trees never reach the lifespan they would in a forest.”", answer: "NOT GIVEN. Trap: extreme wording. The passage says a city tree “often survives only a fraction” and “many die within a decade.” “Often” and “many” are not “never.” The absolute “never reach” goes beyond what the passage supports." },
            { q: "3. “Well-shaded streets can be cooler than bare streets in hot weather.”", answer: "TRUE. Verify against: “well-shaded streets can be several degrees cooler than bare ones during heatwaves.” Confirmed, paraphrased (“hot weather” for “heatwaves”). No trap; a straight match — included so you do not start seeing traps everywhere." },
            { q: "4. “Trees improve residents’ mental health more than they reduce flooding.”", answer: "NOT GIVEN. Trap: comparison / inference. The passage says trees are “linked to lower stress” and “absorb rainfall,” but never compares the size of these two benefits. The comparison “more than” is invented." },
            { q: "5. Paragraph C → “The problem of compacted soil.”", answer: "Trap: right information, wrong paragraph (and example-as-main-idea). Compacted soil is mentioned in Paragraph B (the threats), not Paragraph C. Paragraph C’s main idea is better planting methods. The correct heading for C is “New ways of planting for longer life.”" },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 14 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 15 · The 60-Minute Reading Battle Plan and the Close of Module 2
// ────────────────────────────────────────────────────────────
async function seedFile15() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 15 · The 60-Minute Reading Battle Plan & Module 2 Close",
      titleBn: "ফাইল ১৫ · ৬০-মিনিটের Reading যুদ্ধ-পরিকল্পনা ও মডিউল ২ সমাপ্তি",
      position: 25,
      difficulty: 3,
      is_published: true,
      body: {
        module: "Module 2: IELTS Reading",
        intro:
          "You now have every reading skill and every question type. This final file turns them into a plan for the sixty minutes themselves, tuned to your target band, and then gives you a timed capstone to run it on.",
        introBn:
          "ফাইল ১৫-এর মূল কথা: এখন আপনার কাছে সব reading দক্ষতা ও প্রশ্নের ধরন আছে। এই শেষ ফাইল সেগুলোকে ৬০ মিনিটের পরিকল্পনায় রূপ দেয়, আপনার লক্ষ্য band অনুযায়ী, আর একটি timed capstone দেয়।",

        sections: [
          {
            code: "P12",
            title: "PART 12 · THE 60-MINUTE READING BATTLE PLAN — Universal rules",
            titleBn: "৬০-মিনিট যুদ্ধ-পরিকল্পনা · সর্বজনীন নিয়ম",
            content: {
              coreFact:
                "Three passages, forty questions, sixty minutes, no extra time. That is roughly twenty minutes per passage including its questions. The plan below wins that fight. The universal rules (every band obeys these):",
              steps: [
                { term: "1. Never read the whole passage first", en: "Skim to build a paragraph map (two to three minutes), then let the questions drive. Reading everything is the single biggest time sink." },
                { term: "2. Secure the cheap marks first", en: "Passage 1 is easiest and its marks are worth exactly as much as Passage 3’s. Get them before the clock tightens." },
                { term: "3. Keep a per-question budget", en: "If a question resists after a fair look, mark your best guess, flag it, and move on. One question is one mark; three unreached questions are three marks." },
                { term: "4. Never leave a blank", en: "No penalty for wrong answers, so every blank is a wasted chance. Fill all gaps before time ends, even with a guess." },
                { term: "5. Verify, do not agonise", en: "Back each answer with evidence, then move. Confidence comes from evidence, not from re-reading." },
              ],
            },
          },
          {
            code: "P12.split",
            title: "The default time split, and how to bend it",
            titleBn: "ডিফল্ট সময় ভাগ ও কীভাবে বদলাবেন",
            content: {
              coreFact:
                "A clean default is twenty minutes per passage. Because difficulty rises, many candidates use a graduated split instead:",
              table: [
                { passage: "Passage 1", time: "about 17 minutes", why: "easiest, so bank time here" },
                { passage: "Passage 2", time: "about 20 minutes", why: "medium" },
                { passage: "Passage 3", time: "about 20 minutes", why: "hardest, but capped so it cannot swallow the test" },
                { passage: "Check", time: "about 3 minutes", why: "fill blanks, review flags" },
              ],
              coreFact2:
                "The cap on Passage 3 is the point. A hard passage will happily eat forty minutes if you let it. Give it its share and no more.",
            },
          },
          {
            code: "P12.bands",
            title: "Band-specific plans",
            titleBn: "band-ভিত্তিক পরিকল্পনা",
            content: {
              points: [
                { term: "Targeting Band 5 (roughly 23 to 26 correct)", en: "Do not try to answer everything perfectly. Your marks live in Passage 1 and in the easier question types across all three: completion, short answer, and factual True/False. Give the hardest types a quick attempt, then guess and flag rather than grinding. Goal: harvest every cheap mark, lose only the expensive ones." },
                { term: "Targeting Band 6 (roughly 27 to 29)", en: "Do Passages 1 and 2 solidly, then give Passage 3 the time that remains. Attempt every question, but never get stuck: within a passage, skip a hard question and return after the easier ones. Guarantee no blanks." },
                { term: "Targeting Band 7 (roughly 30 to 32)", en: "Run a tight 17/20/20 split with a 3-minute check. Get every easy and medium question right, and on Passage 3 lean on question order, elimination, and evidence. The marks you are fighting for now are traps and Not Givens, so verify every answer you are unsure of." },
                { term: "Targeting Band 8 and above (35 or more)", en: "You are fighting for near-perfection, and the entire battle is traps, Not Givens, and fine distinctions. Budget about 17/19/21 with a firm 3-minute check. You can afford to miss around five. Every answer must be evidence-backed; the difference between Band 7 and Band 8 is ruthless verification." },
              ],
            },
          },
          {
            code: "P12.skip",
            title: "Skipping and returning · Prioritisation · Difficult questions",
            titleBn: "বাদ ও ফেরা · অগ্রাধিকার · কঠিন প্রশ্ন",
            content: {
              coreFact:
                "Flag any question you cannot settle within its budget. Do not carry its weight into the next question; a clean mind answers better than an anxious one. Return to flagged questions only after finishing the passage, and to the hardest ones only in the final check. Skipping is not failure; it is how you protect the marks you can still earn.",
              bullets: [
                "Do the ordered types top to bottom (TFNG, completion, sentence completion), letting each answer narrow the search.",
                "Do Matching Information and Matching Headings after these, when you already know the passage.",
                "Within any set, do the questions you can locate quickly first, and flag the stubborn ones for a second pass.",
              ],
              coreFact2:
                "Difficult questions. When a question resists: eliminate the options you can, then guess from what remains. For a stuck True/False/Not Given item, remember that if you cannot find a confirming or contradicting sentence, the answer is probably Not Given. Do not spend a fourth minute; a reasoned guess plus a flag is the correct trade.",
            },
          },
          {
            code: "P12.check",
            title: "Final checking (the last 3 minutes)",
            titleBn: "শেষ যাচাই (শেষ ৩ মিনিট)",
            content: {
              bullets: [
                "Fill every blank with your best guess.",
                "Revisit flagged questions once, briefly.",
                "On completion answers, check the word limit and spelling.",
                "Do NOT second-guess answers you backed with evidence. Changing an evidence-based answer under time pressure usually makes it worse. Trust the verification you already did.",
              ],
              tutorTip:
                "Most candidates lose Reading marks not to hard questions but to the clock, by over-reading Passage 1 and starving Passage 3. If you fix only one thing, fix your pacing: set a hard limit for each passage and obey it even mid-question. A flagged guess in Passage 3 beats a perfect Passage 1 you spent twenty-eight minutes on.",
              tutorTipBn:
                "বেশিরভাগ শিক্ষার্থী কঠিন প্রশ্নে নয়, ঘড়ির কাছে নম্বর হারায় — প্যাসেজ ১ বেশি পড়ে প্যাসেজ ৩ শেষ করতে পারে না। শুধু একটা জিনিস ঠিক করলে, গতি ঠিক করুন: প্রতিটি প্যাসেজের জন্য নির্দিষ্ট সময় বেঁধে দিন, প্রশ্নের মাঝখানেও সেটা মানুন।",
            },
          },
          {
            code: "wrapup",
            title: "MODULE 2 WRAP-UP: READING IN ONE BREATH",
            titleBn: "মডিউল ২ সারসংক্ষেপ: এক নিঃশ্বাসে Reading",
            content: {
              coreFact:
                "Compressed to its core, Reading is this: Skim each passage in two to three minutes to build a paragraph map, never reading it all. Let the questions drive: for each, locate the region by scanning for anchors or paraphrased concepts, then close-read the few lines to identify and verify the answer. Match meaning, never a bare word. On True/False/Not Given, name the relationship between claim and evidence, and remember that silence is Not Given, not False. Watch the small words: all, only, might, more than. Guard your clock ferociously, secure the cheap marks first, skip and flag the stubborn ones, never leave a blank, and in the final check trust the answers you backed with evidence.",
              bn: "সারসংক্ষেপ: প্রতিটি প্যাসেজ ২-৩ মিনিটে skim করে paragraph map, কখনো পুরোটা পড়বেন না। প্রশ্নই চালাক: anchor/paraphrase scan করে region locate, তারপর কয়েক লাইন close-read করে identify ও verify। শব্দ নয়, অর্থ মেলান। TFNG-তে claim ও evidence-এর সম্পর্কের নাম দিন; নীরবতা মানে Not Given, False নয়। ছোট শব্দে নজর: all, only, might, more than। ঘড়ি কড়া পাহারা, সস্তা নম্বর আগে, জেদি প্রশ্ন flag, কখনো ফাঁকা নয়।",
              key: "That is the whole module. When you can do it without thinking, the passage stops being a wall of text and becomes what it always was: a place where every answer is hidden in plain sight, waiting for a reader who knows exactly where to look. You should now be able to say, of any passage and any question type: “I know where to look and how to verify.”",
              keyBn: "এটাই পুরো মডিউল। ভাবনা ছাড়াই করতে পারলে প্যাসেজ আর দেয়াল থাকে না — হয়ে যায় এমন জায়গা যেখানে প্রতিটি উত্তর চোখের সামনেই লুকানো। এখন বলতে পারবেন: 'আমি জানি কোথায় দেখতে হবে ও কীভাবে যাচাই করতে হবে।'",
            },
          },
        ],

        exercises: [
          {
            code: "CAPSTONE",
            title: "Timed capstone — Octopus (twenty minutes)",
            instruction:
              "Passage: “Few animals disguise themselves as completely as the octopus. In under a second it can change the colour, pattern, and even the texture of its skin to melt into a reef or a patch of sand. This ability serves two ends at once: hiding from predators, and communicating with other octopuses. The mechanism is layered. Just beneath the surface sit thousands of tiny sacs of pigment called chromatophores, each ringed by muscles; when the muscles pull, the sac spreads and its colour shows. Below these lie reflecting cells that scatter and bounce light, adding blues, greens, and silvers that the pigments alone cannot make. The skin can also raise small bumps, known as papillae, to imitate the rough texture of rock or coral. A puzzle remains at the heart of this skill. Octopuses appear to be colourblind: their eyes contain only one kind of light-detecting cell, which should make distinguishing colours impossible. Yet they match the colours of their surroundings with startling accuracy. One leading hypothesis is that the skin itself senses light, using the same light-sensitive proteins found in eyes, allowing the animal to ‘see’ colour through its body. Beyond camouflage, researchers study these displays for other reasons. The same skin is used in courtship and threat, flashing patterns that other octopuses read as signals. Engineers, meanwhile, look to octopus skin as a model for soft, colour-changing materials, hoping to build surfaces that adapt the way living skin does.” QUESTIONS — Matching Headings (paragraphs 2 and 3, from: i. A contradiction scientists cannot yet explain; ii. How the colour change is produced; iii. The dangers octopuses face; iv. Why octopuses live alone): 1. Paragraph 2  2. Paragraph 3. TFNG: 3. The octopus can change its skin texture as well as its colour. 4. Octopuses have several types of light-detecting cell in their eyes. 5. Octopuses use camouflage mainly to catch prey. Summary completion (ONE WORD): 6. Colour is produced by pigment sacs called ____, each surrounded by muscles. 7. To copy rough surfaces, the skin raises small bumps called ____. Multiple choice: 8. The reflecting cells beneath the chromatophores: A) produce the pigments, B) add colours the pigments cannot make, C) control the muscles. 9. The ‘puzzle’ is that octopuses: A) cannot change colour quickly, B) match colours despite appearing colourblind, C) have no predators. Matching Information: 10. Which paragraph mentions a possible use of octopus skin in engineering?",
            instructionBn: "২০ মিনিটে capstone করুন। skim first, তারপর battle plan।",
          },
        ],

        answerKey: {
          "Capstone answers": [
            { q: "1. Paragraph 2", answer: "ii. Paragraph 2’s main idea is how the colour change works (chromatophores, reflecting cells, papillae). Not a detail; the whole paragraph explains the mechanism." },
            { q: "2. Paragraph 3", answer: "i. Paragraph 3 presents the contradiction: colourblind eyes yet accurate colour-matching, with a hypothesis but no settled answer. Headings iii and iv are distractors." },
            { q: "3", answer: "TRUE. Evidence: “change the colour, pattern, and even the texture.”" },
            { q: "4", answer: "FALSE. Evidence: “only one kind of light-detecting cell.” Contradiction (number clash)." },
            { q: "5", answer: "NOT GIVEN. The passage says camouflage serves “hiding from predators, and communicating,” but never ranks catching prey as the main purpose. The “mainly” is unsupported. Absence plus extreme wording." },
            { q: "6", answer: "chromatophores. Words-from-passage: “sacs of pigment called chromatophores, each ringed by muscles.”" },
            { q: "7", answer: "papillae. “raise small bumps, known as papillae.”" },
            { q: "8", answer: "B. Reflecting cells “add blues, greens, and silvers that the pigments alone cannot make.” A and C are contradicted or unsupported." },
            { q: "9", answer: "B. “appear to be colourblind… Yet they match the colours… with startling accuracy.” The puzzle is exactly this contradiction." },
            { q: "10", answer: "Paragraph 4. “Engineers… look to octopus skin as a model for soft, colour-changing materials.” Score yourself, then log the reason code for anything you missed, not just the mark." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 15 seeded");
}

// ============================================================
// RUNNER · পুরনো Reading File মুছে, তারপর ৮টি fresh seed
// ------------------------------------------------------------
// idempotent: যতবার খুশি চালান — প্রতিবার হুবহু ৮টি Reading file থাকবে।
// অন্য section (grammar) বা Speaking/Writing file অক্ষত থাকবে।
// ============================================================

async function main() {
  const readingTitles = [
    "File 08 · Understanding IELTS Reading & the Reading Mindset",
    "File 09 · Skimming, Scanning, and the Skim-Scan-Read Switch",
    "File 10 · Keyword Strategy and Paraphrase Recognition in Reading",
    "File 11 · Question Order and Reading Question Types, Part One",
    "File 12 · Reading Question Types, Part Two: Completion, Diagrams & Short Answer",
    "File 13 · The True/False/Not Given and Yes/No/Not Given Masterclass",
    "File 14 · The Matching Headings Masterclass and the Reading Trap Library",
    "File 15 · The 60-Minute Reading Battle Plan & Module 2 Close",
  ];

  const deleted = await prisma.lessons.deleteMany({
    where: { section: "tips", title: { in: readingTitles } },
  });
  console.log(`\uD83E\uDDF9 Cleared ${deleted.count} old Reading file row(s).`);

  const seeders: [string, () => Promise<void>][] = [
    ["File 08", seedFile08],
    ["File 09", seedFile09],
    ["File 10", seedFile10],
    ["File 11", seedFile11],
    ["File 12", seedFile12],
    ["File 13", seedFile13],
    ["File 14", seedFile14],
    ["File 15", seedFile15],
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

  const total = await prisma.lessons.count({
    where: { section: "tips", title: { in: readingTitles } },
  });

  console.log("\n----------------------------------------");
  console.log(`\u2705 Seeded OK : ${ok} / 8`);
  if (failed.length) console.log(`\u274C Failed   : ${failed.join(", ")}`);
  console.log(`\uD83D\uDCCA In DB now : ${total} Reading file row(s)`);
  if (total === 8 && failed.length === 0) {
    console.log("\uD83C\uDF89 All Reading files (08\u201315) present. Nothing is missing.");
  } else {
    console.log("\u26A0\uFE0F  Not all 8 present. Check the errors above.");
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