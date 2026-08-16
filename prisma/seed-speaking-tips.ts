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
// MODULE 4 · IELTS SPEAKING · Tips & Tricks  (VERBATIM)
// ------------------------------------------------------------
// এই seed script Speaking মডিউলের ৬টি File (24–29) কে
// section: "tips" এর অধীনে lessons টেবিলে বসায়।
// ইংরেজি লেখা PDF থেকে হুবহু (verbatim), কিছুই সংক্ষেপ করা হয়নি।
// Bangla অনুবাদ clean রাখা হয়েছে।
//
// প্রতিটি lesson.body-তে:
//   intro / introBn   → PDF-এর হুবহু ভূমিকা
//   sections[]        → { code, title, titleBn, content }
//   exercises[]       → পড়ার drill (প্রশ্ন verbatim)
//   answerKey         → verbatim answer key ও reasoning
// ============================================================

// ────────────────────────────────────────────────────────────
// FILE 24 · Understanding the Speaking Test & the Speaking Mindset
// ────────────────────────────────────────────────────────────
async function seedFile24() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 24 · Understanding the Speaking Test & the Speaking Mindset",
      titleBn: "ফাইল ২৪ · Speaking টেস্ট বোঝা ও Speaking মানসিকতা",
      position: 24,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Module 4: IELTS Speaking",
        intro:
          "Speaking is the module with nowhere to hide. There is no page to plan on, no recording to re-hear, no minutes at the end to check your work. It is you, a real examiner, and the words as they come, live. That frightens many candidates, and their fear does more damage than their English ever would.\n\nThis module removes the fear by replacing it with knowledge. You will learn exactly what the examiner is listening for, exactly how to answer each part, exactly how to keep talking when your mind goes blank, and exactly how to recover from the small mistakes everyone makes. Speaking is, in truth, one of the most trainable modules, because so much of the score comes from habits you can build in advance.\n\nWe begin by understanding what the test actually is.",
        introBn:
          "ফাইল ২৪-এর মূল কথা: Speaking-এ লুকানোর জায়গা নেই — পরিকল্পনার পাতা নেই, রেকর্ডিং আবার শোনা নেই, শেষে যাচাইয়ের সময় নেই। শুধু আপনি, একজন সত্যিকারের পরীক্ষক আর সরাসরি বলা কথা। ভয়ই ইংরেজির চেয়ে বেশি ক্ষতি করে। এই মডিউল ভয় সরিয়ে জ্ঞান দেয়। Speaking সবচেয়ে অনুশীলনযোগ্য মডিউলগুলোর একটি, কারণ স্কোরের অনেকটাই আগে থেকে গড়া অভ্যাস থেকে আসে।",

        sections: [
          {
            code: "P1",
            title: "PART 1 · Understanding the Speaking Test — What it is",
            titleBn: "Speaking টেস্ট বোঝা · এটি কী",
            content: {
              coreFact:
                "The Speaking test is a live interview with a real examiner, lasting about eleven to fourteen minutes. It may be face to face in a room or by video call, but either way it is a real person, in real time, not a recording and not a machine. That single fact should reassure you: it is a conversation, and you already know how to have a conversation.\n\nThe examiner has two jobs: to guide you through the three parts, and to assess you against four criteria. They are not your opponent. They want you to speak, because they cannot score silence.",
              bn: "Speaking হলো সত্যিকারের পরীক্ষকের সঙ্গে ১১-১৪ মিনিটের সরাসরি সাক্ষাৎকার। এটা কথোপকথন — পরীক্ষক প্রতিপক্ষ নন, তিনি চান আপনি কথা বলুন, কারণ নীরবতায় নম্বর দেওয়া যায় না।",
            },
          },
          {
            code: "P1.parts",
            title: "The three parts",
            titleBn: "তিন অংশ",
            content: {
              points: [
                { term: "Part 1: Introduction and interview (about four to five minutes)", en: "The examiner introduces themselves, checks your identity, then asks questions about familiar topics: your home, work or studies, hobbies, daily routines, food, travel. The questions are short and personal, and so are the answers, though not one word long. This part is a warm-up, and it should feel like easy small talk.", bn: "পরিচিত টপিকে ছোট ব্যক্তিগত প্রশ্ন; উত্তর ছোট (কিন্তু এক শব্দ নয়)। সহজ small talk।" },
                { term: "Part 2: The long turn (about three to four minutes)", en: "The examiner gives you a task card with a topic and some points to cover. You get one minute to prepare, with paper and pencil to make notes, then you speak on your own for one to two minutes, without interruption. Afterwards the examiner may ask one or two quick rounding-off questions. This is the only part where you speak at length alone.", bn: "task card, ১ মিনিট প্রস্তুতি, ১-২ মিনিট একা বলা; একমাত্র দীর্ঘ একক অংশ।" },
                { term: "Part 3: Discussion (about four to five minutes)", en: "The examiner asks broader, more abstract questions connected to the Part 2 topic. Here you discuss ideas, give opinions, compare, speculate, and explain. It is the most demanding part, because it asks you to think, not just describe.", bn: "বিস্তৃত, বিমূর্ত প্রশ্ন; মত, তুলনা, অনুমান, ব্যাখ্যা। সবচেয়ে চ্যালেঞ্জিং — ভাবতে হয়।" },
              ],
            },
          },
          {
            code: "P1.criteria",
            title: "The four criteria, in practical terms",
            titleBn: "চারটি মাপকাঠি, ব্যবহারিক অর্থে",
            content: {
              coreFact: "Each criterion is a quarter of your score. Here is what the examiner is actually listening for.",
              points: [
                { term: "Fluency and Coherence", en: "Can you keep talking smoothly, without long unnatural pauses, staying on the question and connecting your ideas so they are easy to follow. This is not about speed; it is about flow and staying on track.", bn: "মসৃণ প্রবাহ, অপ্রয়োজনীয় বিরতি ছাড়া, প্রশ্নে থেকে ভাব যুক্ত করা। গতি নয় — প্রবাহ।" },
                { term: "Lexical Resource", en: "The range and precision of your vocabulary, and whether you can paraphrase your way around a word you do not know rather than stopping dead.", bn: "শব্দভাণ্ডারের পরিসর ও নির্ভুলতা; অজানা শব্দ ঘুরিয়ে বলার ক্ষমতা।" },
                { term: "Grammatical Range and Accuracy", en: "The variety of sentence structures you use and how accurately. This is the domain of the separate grammar book; here we treat it only where a speaking decision touches it.", bn: "বাক্যগঠনের বৈচিত্র্য ও নির্ভুলতা।" },
                { term: "Pronunciation", en: "Whether you are easy to understand, with clear sounds, word and sentence stress, and natural intonation. Note carefully: this is about being intelligible, not about having a British or American accent.", bn: "সহজে বোঝা যায় কিনা — স্পষ্ট উচ্চারণ, stress, intonation। British/American accent লাগে না।" },
              ],
            },
          },
          {
            code: "P1.notjudging",
            title: "What the examiner is NOT judging",
            titleBn: "পরীক্ষক যা বিচার করছেন না",
            content: {
              coreFact: "Knowing this removes half the pressure.",
              bullets: [
                "Your opinions. There are no right or wrong answers. You can say anything, as long as you say it well.",
                "Your knowledge. It is a language test, not a general-knowledge quiz. You are never expected to be an expert on the topic.",
                "Your accent. A clear accent of any origin is fine. You do not need to sound British or American.",
                "Whether your stories are true. You may invent details freely. The examiner is assessing your English, not fact-checking your life.",
              ],
              tutorTip:
                "The examiner cannot give marks for silence, so your first duty is simply to keep speaking. A candidate who talks naturally, even with small mistakes, always outscores one who says little for fear of being wrong. There is no wrong opinion and no wrong story, only too few words.",
              tutorTipBn:
                "পরীক্ষক নীরবতায় নম্বর দিতে পারেন না, তাই আপনার প্রথম কাজ কেবল কথা বলে যাওয়া। ছোটখাটো ভুল করেও যে স্বাভাবিকভাবে কথা বলে, সে সবসময় ভয়ে চুপ থাকা প্রার্থীর চেয়ে বেশি নম্বর পায়। কোনো মত ভুল নয়, কোনো গল্প ভুল নয়।",
            },
          },
          {
            code: "P2",
            title: "PART 2 · The Speaking Mindset — The reframe: it is a conversation",
            titleBn: "Speaking মানসিকতা · পুনর্বিবেচনা: এটি একটি কথোপকথন",
            content: {
              coreFact:
                "Most candidates walk in treating Speaking as an exam where they must produce correct, impressive answers. That mindset makes them stiff, slow, and afraid. The high scorer treats it as what it is: a conversation with an interested stranger. You are not reciting; you are talking. Everything below follows from that reframe.",
              points: [
                { term: "Natural communication", en: "Talk the way you would to a friendly person who is genuinely interested in your answer. Use everyday spoken English, react naturally, and let your personality show. Examiners reward natural communication and can hear the difference instantly between a person speaking and a person performing a memorised script.", bn: "বন্ধুর মতো স্বাভাবিক কথা; প্রাত্যহিক ইংরেজি, ব্যক্তিত্ব দেখান।" },
                { term: "Confidence", en: "Nervousness is normal and the examiner expects it. They are not trying to trip you up; their questions are ordinary and their manner is neutral, not hostile. Because there are no wrong opinions and no knowledge being tested, there is genuinely little to fear. Confidence here is not a personality trait; it is the calm that comes from knowing the examiner is on your side and there is no trap.", bn: "নার্ভাসনেস স্বাভাবিক; পরীক্ষক আপনার পক্ষে, কোনো ফাঁদ নেই।" },
              ],
              principle:
                "Speaking fast is not the same as speaking fluently. Fluency is smooth, connected, comfortable flow, and you can be perfectly fluent at a moderate pace. Speaking too fast usually causes more errors, unclear pronunciation, and a breathless, anxious sound. Slow down to a natural conversational speed, and your fluency and pronunciation both improve.",
              principleBn:
                "নীতি: দ্রুত বলা মানে সাবলীল বলা নয়। Fluency হলো মসৃণ, সংযুক্ত, স্বচ্ছন্দ প্রবাহ — মাঝারি গতিতেও পুরোপুরি সাবলীল হওয়া যায়। বেশি দ্রুত বললে বেশি ভুল, অস্পষ্ট উচ্চারণ, উদ্বিগ্ন শোনায়। স্বাভাবিক গতিতে ধীর হন — fluency ও pronunciation দুটোই উন্নত হয়।",
              coreFact2:
                "Many candidates believe they must speak quickly to sound fluent, and it backfires. A steady, relaxed pace with clear words and natural pauses scores higher than a rushed torrent. Aim to sound comfortable, not fast.",
            },
          },
          {
            code: "P2.mindset",
            title: "Thinking while speaking, recovering, extending",
            titleBn: "বলতে বলতে ভাবা, পুনরুদ্ধার, সম্প্রসারণ",
            content: {
              points: [
                { term: "Thinking while speaking", en: "You do not need the perfect answer fully formed before you open your mouth. Fluent speakers of any language think as they talk. Start with a general response to the question, then develop it as you go. Beginning is more important than beginning perfectly, and the act of speaking usually brings the next idea with it.", bn: "নিখুঁত উত্তর আগে থেকে দরকার নেই; বলতে বলতেই ভাবুন। শুরু করাই বড়, নিখুঁত শুরু নয়।" },
                { term: "Recovering from mistakes", en: "You will make small errors, and they matter far less than you think. The damage is not the error; it is stopping, apologising, and restarting, which breaks your fluency, the thing actually being scored. When you slip, keep going. A tiny self-correction in passing is fine; a full stop and restart is not.", bn: "ছোট ভুল কম গুরুত্বপূর্ণ; থামা-ক্ষমা-পুনরায় শুরুই ক্ষতি। পিছলে গেলে চালিয়ে যান।" },
                { term: "Extending answers", en: "Do not give bare one-word or one-sentence answers, which starve the examiner of language to assess. But do not over-talk either, rambling until you lose the point. The target is a natural extended answer: enough to show your range, then a natural stop. The next files teach exactly how to extend.", bn: "এক-শব্দের উত্তর নয়, আবার অতিরিক্তও নয়; স্বাভাবিক সম্প্রসারিত উত্তর।" },
              ],
              key: "The Expert Speaking Mindset. Watch what a confident candidate is doing throughout the test. They treat it as a chat, not an interrogation. They listen to the actual question and answer that question, not a memorised topic near it. They extend each answer naturally with a reason or an example, then stop. They speak at a comfortable pace, clearly, without racing. When they make a small mistake, they carry on as if it were nothing, because to a fluent speaker it is nothing. They never recite a rehearsed speech, because they know a natural simple answer beats a memorised impressive one. Underneath it all, they are relaxed, because they understand there is no wrong answer to give.",
              keyBn: "বিশেষজ্ঞ মানসিকতা: জেরা নয়, আড্ডা; আসল প্রশ্নের উত্তর; কারণ/উদাহরণ দিয়ে স্বাভাবিক সম্প্রসারণ; স্বচ্ছন্দ গতি; ছোট ভুলে থামে না; মুখস্থ নয়; শিথিল, কারণ কোনো ভুল উত্তর নেই।",
            },
          },
          {
            code: "P2.expert",
            title: "EXPERT THINKING: a simple Part 1 question",
            titleBn: "বিশেষজ্ঞ চিন্তা: একটি সহজ Part 1 প্রশ্ন",
            content: {
              coreFact: "The examiner asks: “Do you enjoy cooking?”",
              examples: [
                { wrong: "WHAT A BEGINNER THINKS: “Yes.” Then silence, waiting for the next question, having given the examiner almost nothing to assess.", why: "One word gives the examiner almost nothing to assess." },
                { wrong: "WHAT AN EXPERIENCED STUDENT THINKS: “Yes, I like cooking.” A complete sentence, but it stops too soon, offering little range.", why: "A complete sentence, but it stops too soon, offering little range." },
                { right: "WHAT AN EXPERT CANDIDATE NOTICES: They answer the actual question and extend it naturally: “Yes, I really enjoy it, especially at weekends when I have time to try new recipes. Cooking relaxes me after a busy week, though I have to admit I am much better at desserts than main meals.” Answered, with a reason, a detail, and a touch of personality, then a natural stop. Not memorised, not rushed, just a person talking.", why: "The gap between these three is not vocabulary or grammar. It is the habit of answering naturally and extending, which is the whole of the Speaking mindset, and the subject of the next file." },
              ],
            },
          },
        ],

        exercises: [
          {
            code: "Drill 24.1",
            title: "Natural or unnatural? (Level 1)",
            instruction: "Which response sounds like natural conversation, and which like a memorised script? a) “Well, I suppose my favourite season is winter, mainly because I love the cold weather and staying in with a book.” b) “My favourite season is winter. Winter is a season that has many advantages. Firstly, the weather is cold. Secondly, one can read books.”",
            instructionBn: "কোনটি স্বাভাবিক কথোপকথন, কোনটি মুখস্থ স্ক্রিপ্ট?",
          },
          {
            code: "Drill 24.2",
            title: "Extend the answer (Level 2)",
            instruction: "Turn each bare answer into a natural extended one (answer, reason, detail). 1. “Do you like your hometown?” Bare: “Yes.” 2. “Do you use public transport?” Bare: “Sometimes.” 3. “What do you do in your free time?” Bare: “I watch films.”",
            instructionBn: "প্রতিটি সংক্ষিপ্ত উত্তরকে স্বাভাবিক সম্প্রসারিত উত্তরে পরিণত করুন (answer, reason, detail)।",
          },
          {
            code: "Drill 24.3",
            title: "Fluency or speed? (Level 1)",
            instruction: "A candidate speaks very fast, running words together and making several slips, then another speaks at a calm, steady pace with clear words and a couple of natural pauses. Which is more fluent, and why?",
            instructionBn: "কে বেশি সাবলীল, আর কেন?",
          },
        ],

        answerKey: {
          "Drill 24.1 — Natural or unnatural?": [
            { q: "a vs b", answer: "a is natural; b is a memorised script.", why: "Response a uses everyday spoken markers (“Well, I suppose”), gives a genuine reason, and sounds like a person talking. Response b uses essay-style connectors (“Firstly, Secondly”) and the stiff, impersonal “one can,” which no one says in conversation. Examiners are trained to hear the difference, and b would score lower on Fluency and Lexical Resource despite sounding “structured.” Speak, do not recite." },
          ],
          "Drill 24.2 — Extend the answer (samples)": [
            { q: "1. “Do you like your hometown?” (bare: “Yes.”)", answer: "“Yes, I do. It is a small, quiet town, and although there is not much to do, I love how peaceful it is and how everyone knows each other.”", why: "Follows answer, reason, detail, and stops naturally." },
            { q: "2. “Do you use public transport?” (bare: “Sometimes.”)", answer: "“Yes, sometimes, mostly the bus to work. It is cheaper than driving and I can read on the way, though it can get crowded in the mornings.”", why: "Follows answer, reason, detail, and stops naturally." },
            { q: "3. “What do you do in your free time?” (bare: “I watch films.”)", answer: "“In my free time I usually watch films, especially thrillers. It is how I unwind, and I like discussing them with friends afterwards.”", why: "Each follows answer, reason, detail, and stops naturally. That shape is the backbone of Part 1." },
          ],
          "Drill 24.3 — Fluency or speed?": [
            { q: "Fast with slips vs calm and steady", answer: "The calm, steady speaker is more fluent.", why: "Fluency is smooth, comfortable flow and being easy to follow, not raw speed. The fast speaker’s running-together and slips actually reduce fluency and hurt pronunciation. A moderate, clear pace with natural pauses sounds more fluent and is easier to score well. Slow down to speed up your band." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 24 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 25 · Speaking Part 1 and How to Extend an Answer
// ────────────────────────────────────────────────────────────
async function seedFile25() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 25 · Speaking Part 1 and How to Extend an Answer",
      titleBn: "ফাইল ২৫ · Speaking Part 1 ও উত্তর সম্প্রসারণ",
      position: 25,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Module 4: IELTS Speaking",
        intro:
          "Part 1 is the easiest part of the Speaking test and the one most candidates handle worst, either by saying too little or by reciting too much. This file gives you a simple, flexible framework for Part 1 answers, then a toolkit for extending any answer naturally. Together they solve the two biggest Part 1 problems: the one-word answer and the memorised speech.",
        introBn:
          "ফাইল ২৫-এর মূল কথা: Part 1 সবচেয়ে সহজ, তবু বেশিরভাগ প্রার্থী এখানে খারাপ করে — হয় খুব কম বলে, নয় মুখস্থ বেশি বলে। এই ফাইল একটি নমনীয় কাঠামো ও যেকোনো উত্তর স্বাভাবিকভাবে বাড়ানোর টুলকিট দেয়। দুই বড় সমস্যা সমাধান: এক-শব্দের উত্তর ও মুখস্থ বক্তৃতা।",

        sections: [
          {
            code: "P3",
            title: "PART 3 · Speaking Part 1 — What Part 1 is & the goal",
            titleBn: "Speaking Part 1 · এটি কী ও লক্ষ্য",
            content: {
              coreFact:
                "Part 1 lasts about four to five minutes. The examiner asks short questions on familiar, personal topics: your home, your work or studies, your hobbies, food, travel, technology, family, and daily routines. It is designed to feel like relaxed small talk, a warm-up before the harder parts.\n\nThe goal. Give answers that are natural and extended, but not long. Two to four sentences is the sweet spot. One word is too little; a one-minute monologue is too much and out of place here. You are having a friendly exchange, not delivering a talk.",
              bn: "Part 1 প্রায় ৪-৫ মিনিট। পরিচিত ব্যক্তিগত টপিকে ছোট প্রশ্ন। লক্ষ্য: স্বাভাবিক ও সম্প্রসারিত উত্তর, কিন্তু দীর্ঘ নয়। ২-৪ বাক্যই আদর্শ। এক শব্দ কম; এক মিনিটের একক ভাষণ বেশি ও বেমানান।",
            },
          },
          {
            code: "P3.framework",
            title: "The core framework: Answer, Reason, Detail",
            titleBn: "মূল কাঠামো: Answer, Reason, Detail",
            content: {
              coreFact: "For most Part 1 questions, a reliable shape is:",
              steps: [
                { term: "Answer", en: "Respond to the question directly, first." },
                { term: "Reason", en: "Say why, briefly." },
                { term: "Detail", en: "Add an example, a specific, or a bit of personal colour." },
              ],
              key: "For “Do you prefer tea or coffee?”: “I much prefer coffee, actually. (Answer.) It is mainly the caffeine, since I need it to wake up properly in the mornings. (Reason.) I usually have a strong cup before work, and I have become a bit fussy about how it is made. (Detail.)” Three sentences, natural, complete. That is a strong Part 1 answer.",
              keyBn: "'চা না কফি?': 'কফিই বেশি পছন্দ। (Answer) মূলত ক্যাফেইনের জন্য, সকালে জাগতে লাগে। (Reason) কাজের আগে এক কাপ শক্ত কফি খাই, বানানো নিয়ে একটু খুঁতখুঁতে হয়ে গেছি। (Detail)' তিন বাক্য, স্বাভাবিক, সম্পূর্ণ।",
            },
          },
          {
            code: "P3.topics",
            title: "The framework across topics",
            titleBn: "বিভিন্ন টপিকে কাঠামো",
            content: {
              coreFact: "The same shape flexes to any Part 1 topic. A few models:",
              examples: [
                { right: "Home: “I live in a small flat near the city centre. I like it because everything is within walking distance, which suits me since I do not drive. The only downside is that it can get a little noisy at weekends.”" },
                { right: "Work or study: “I am studying business at university. I chose it because I have always been interested in how companies are run, and I am hoping it leads to a marketing career. My favourite part is the group projects.”" },
                { right: "Hobbies: “I love photography, mostly landscapes. It started as a way to get outdoors more, and now I plan whole weekend trips around finding good spots. I am not professional, but it relaxes me.”" },
                { right: "Food: “I really enjoy cooking, especially spicy food. Growing up, my family always ate together, so it feels natural to me. These days I like trying dishes from other countries.”" },
                { right: "Travel: “I love travelling whenever I can. It is the best way to see how differently people live, which fascinates me. My favourite trip so far was to the mountains, for the quiet.”" },
              ],
              coreFact2: "Notice each is Answer, Reason, Detail, but none sounds mechanical, because the wording and rhythm change every time.",
            },
          },
          {
            code: "P3.formulaic",
            title: "The crucial rule: do not sound formulaic",
            titleBn: "জরুরি নিয়ম: ছকবাঁধা শোনাবেন না",
            content: {
              principle:
                "Answer, Reason, Detail is a shape to lean on, not a rigid template to repeat identically. If every answer sounds like the same three-step machine, it becomes robotic, and robotic scores lower on Fluency. Vary how you start, sometimes lead with a preference or a contrast, and let the shape bend to the question.",
              principleBn:
                "নীতি: Answer-Reason-Detail একটি ভরসার আকৃতি, হুবহু পুনরাবৃত্তির অনমনীয় টেমপ্লেট নয়। প্রতিটি উত্তর একই তিন-ধাপের মেশিনের মতো হলে রোবটিক শোনায়, আর Fluency কমে। শুরু বদলান; কখনো পছন্দ বা বৈপরীত্য দিয়ে শুরু করুন।",
              coreFact2:
                "Sometimes you will answer, give a contrast, and stop. Sometimes you will start with an example. The framework is training wheels; as you improve, the shape becomes invisible and you simply talk naturally, which is the goal.",
            },
          },
          {
            code: "P3.mistakes",
            title: "Common Part 1 mistakes",
            titleBn: "সাধারণ Part 1 ভুল",
            content: {
              bullets: [
                "One-word answers (“Yes.” “No.” “Sometimes.”), which give the examiner nothing to assess.",
                "Memorised speeches, which sound rehearsed and are penalised.",
                "Turning Part 1 into Part 2, delivering a long monologue when a short natural answer was wanted.",
                "Misunderstanding the question and answering a slightly different one. If you do not catch it, it is fine to ask the examiner to repeat.",
              ],
              tutorTip:
                "In Part 1, answer the question you were actually asked, then add a little. Do not launch into a prepared speech about the topic. “Do you like your job?” wants your feeling about your job and a reason, not a two-minute history of your career. Match the size of your answer to the size of the question.",
              tutorTipBn:
                "Part 1-এ ঠিক যে প্রশ্ন করা হয়েছে তার উত্তর দিন, তারপর একটু যোগ করুন। প্রস্তুত করা বক্তৃতা শুরু করবেন না। 'আপনি কি আপনার কাজ পছন্দ করেন?' — এখানে কাজ নিয়ে আপনার অনুভূতি আর একটা কারণ চায়, ক্যারিয়ারের দুই মিনিটের ইতিহাস নয়। প্রশ্নের আকারের সঙ্গে উত্তরের আকার মেলান।",
            },
          },
          {
            code: "P4",
            title: "PART 4 · How to Extend an Answer — Why extension is the whole game",
            titleBn: "উত্তর সম্প্রসারণ · কেন সম্প্রসারণই আসল খেলা",
            content: {
              coreFact:
                "A bare answer gives the examiner almost no language to score. Extension is how you show your range of vocabulary and grammar, your fluency, and your ability to develop an idea. Learning to extend any answer naturally is perhaps the single most useful Speaking skill, and it applies across all three parts.",
              bn: "সংক্ষিপ্ত উত্তরে পরীক্ষক মূল্যায়নের ভাষা প্রায় পায় না। সম্প্রসারণেই আপনার শব্দভাণ্ডার, ব্যাকরণ, fluency ও ভাব বিকাশের ক্ষমতা দেখা যায় — তিন অংশেই কাজে লাগে।",
            },
          },
          {
            code: "P4.toolkit",
            title: "The extension toolkit",
            titleBn: "সম্প্রসারণ টুলকিট",
            content: {
              coreFact: "Here are the moves you can use to add more, naturally. You do not use all of them at once; you pick one or two that fit.",
              bullets: [
                "Reason: why. “because,” “the reason is,” “mainly because.”",
                "Example: a specific instance. “for example,” “like when,” “such as.”",
                "Contrast: the other side. “but,” “although,” “on the other hand,” “that said.”",
                "Personal experience: a moment from your life. “I remember once,” “there was a time when.”",
                "Consequence: the result. “so,” “which means,” “as a result.”",
                "Explanation: elaborate on how or why something is so.",
                "Preference or comparison: “I prefer X to Y because.”",
                "Hypothetical or future: “I would love to,” “if I could,” “one day I hope to.”",
              ],
              keyBn: "সম্প্রসারণ টুলকিট (এক-দুটি বেছে নিন): কারণ, উদাহরণ, বৈপরীত্য, ব্যক্তিগত অভিজ্ঞতা, ফলাফল, ব্যাখ্যা, পছন্দ/তুলনা, কাল্পনিক/ভবিষ্যৎ।",
            },
          },
          {
            code: "P4.transformation",
            title: "The worked transformation",
            titleBn: "কাজ-করা রূপান্তর",
            content: {
              coreFact: "Take the bare answer: “Yes, I like travelling.” Now extend it with different tools:",
              examples: [
                { right: "With reason and example: “Yes, I love travelling, mainly because it lets me experience completely different ways of life. Last year, for instance, I visited a small fishing village and the pace of life there amazed me.”" },
                { right: "With contrast: “Yes, I enjoy travelling a lot, although I have to admit I find the airports and packing quite stressful. It is the being-there that I love, not the getting-there.”" },
                { right: "With personal experience and consequence: “Yes, very much. I remember my first trip abroad completely changed how I saw the world, and ever since then I have tried to travel at least once a year.”" },
                { right: "With preference and hypothetical: “Yes, I do, especially to mountains rather than beaches. If I could, I would spend every holiday hiking somewhere remote and quiet.”" },
              ],
              coreFact2: "Same three-word starting point, four natural, extended answers. That is the extension toolkit in action.",
            },
          },
          {
            code: "P4.howmuch",
            title: "How much is enough",
            titleBn: "কতটা যথেষ্ট",
            content: {
              coreFact:
                "For Part 1, two to four sentences, one or two extension moves. For Part 3, more, because those questions invite discussion. The skill is not maximum length; it is adding enough to show range, then stopping naturally before you ramble. An answer that goes on too long, losing its point, hurts Coherence as much as one that is too short.",
              tutorTip:
                "When you are stuck for how to extend, silently ask “why?” or “for example?” of your own answer, and say the reply out loud. Those two questions, reason and example, will extend almost any answer naturally, and they are always available when your mind goes blank. Answer, then ask yourself why, then answer that too.",
              tutorTipBn:
                "কীভাবে বাড়াবেন বুঝতে না পারলে, নিজের উত্তরকে চুপচাপ জিজ্ঞেস করুন 'কেন?' বা 'উদাহরণ?' — আর উত্তরটা বলে ফেলুন। এই দুই প্রশ্ন (কারণ ও উদাহরণ) প্রায় যেকোনো উত্তর স্বাভাবিকভাবে বাড়িয়ে দেয়, আর মন ফাঁকা হলেও সবসময় হাতের কাছে থাকে।",
            },
          },
        ],

        exercises: [
          {
            code: "Drill 25.1",
            title: "Answer, Reason, Detail (Level 2)",
            instruction: "Answer each Part 1 question using the framework, in two or three sentences. 1. “Do you enjoy your work or studies?” 2. “What kind of food do you like?” 3. “Do you use social media much?”",
            instructionBn: "কাঠামো দিয়ে প্রতিটি প্রশ্নের উত্তর দিন, দুই-তিন বাক্যে।",
          },
          {
            code: "Drill 25.2",
            title: "Extend with a named tool (Level 3)",
            instruction: "Extend each bare answer using the tool in brackets. 1. “Yes, I like music.” (reason and example) 2. “No, I do not read much.” (contrast) 3. “I usually get up early.” (consequence) 4. “I would like to visit Japan.” (hypothetical)",
            instructionBn: "বন্ধনীর টুল দিয়ে প্রতিটি উত্তর বাড়ান।",
          },
          {
            code: "Drill 25.3",
            title: "Name the tool (Level 2)",
            instruction: "For each extended answer, name the extension tool used. 1. “I love the countryside, although the lack of shops can be inconvenient.” 2. “I enjoy cooking, for example I made a whole three-course meal last weekend.” 3. “I drink a lot of water, so I rarely feel tired during the day.”",
            instructionBn: "প্রতিটি উত্তরে কোন টুল ব্যবহৃত হয়েছে লিখুন।",
          },
        ],

        answerKey: {
          "Drill 25.1 — Answer, Reason, Detail (samples)": [
            { q: "1. “Do you enjoy your work or studies?”", answer: "“Yes, I really enjoy my studies. I am doing engineering, which I chose because I love solving practical problems, and the lab work in particular keeps it interesting.”", why: "Answer, Reason, Detail, kept short and natural." },
            { q: "2. “What kind of food do you like?”", answer: "“I like most food, but especially anything spicy. I grew up eating a lot of it, so mild food feels a bit boring to me now. Thai curry is probably my favourite.”", why: "Note the varied opening, which stops it sounding mechanical." },
            { q: "3. “Do you use social media much?”", answer: "“Yes, quite a lot, mainly to keep in touch with friends who live abroad. I try not to overuse it, though, since it can eat up the whole evening.”", why: "Each is Answer, Reason, Detail, kept short and natural. Note the varied openings, which stop it sounding mechanical." },
          ],
          "Drill 25.2 — Extend with a named tool (samples)": [
            { q: "1. “Yes, I like music.” (reason and example)", answer: "“Yes, I love music, mainly because it lifts my mood. For example, I always play something upbeat when I am cooking or cleaning.”", why: "reason and example" },
            { q: "2. “No, I do not read much.” (contrast)", answer: "“No, I do not read much these days, although I used to read constantly as a child. I just find I have less time now.”", why: "contrast" },
            { q: "3. “I usually get up early.” (consequence)", answer: "“I usually get up early, so I have plenty of quiet time to myself before the day gets busy.”", why: "consequence" },
            { q: "4. “I would like to visit Japan.” (hypothetical)", answer: "“I would love to visit Japan. If I could, I would go in spring to see the cherry blossom, which I have always dreamed of.”", why: "hypothetical" },
          ],
          "Drill 25.3 — Name the tool": [
            { q: "1. “I love the countryside, although the lack of shops can be inconvenient.”", answer: "Contrast (“although”).", why: "Acknowledges the other side." },
            { q: "2. “I enjoy cooking, for example I made a whole three-course meal last weekend.”", answer: "Example (“for example”).", why: "A specific instance." },
            { q: "3. “I drink a lot of water, so I rarely feel tired during the day.”", answer: "Consequence (“so”).", why: "Lesson across both parts: a bare answer becomes a strong one with a single, natural extension move. Keep Answer, Reason, Detail as your default shape, reach for the toolkit when you need more, and when your mind blanks, just ask yourself “why?” or “for example?” and answer that." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 25 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 26 · Part 2 Cue Cards, Unfamiliar Topics & How to Keep Talking
// ────────────────────────────────────────────────────────────
async function seedFile26() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 26 · Part 2 Cue Cards, Unfamiliar Topics & How to Keep Talking",
      titleBn: "ফাইল ২৬ · Part 2 Cue Card, অচেনা টপিক ও কথা চালিয়ে যাওয়া",
      position: 26,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Module 4: IELTS Speaking",
        intro:
          "Part 2 is the part candidates fear most: one to two minutes speaking alone, no examiner to help you along. This file removes that fear with three things: a universal system for tackling any cue card, a method for cards on topics you know nothing about, and a rescue system for when you run dry with time still on the clock.",
        introBn:
          "ফাইল ২৬-এর মূল কথা: Part 2-কে সবচেয়ে বেশি ভয় পায় — ১-২ মিনিট একা বলা, সাহায্য নেই। এই ফাইল তিন জিনিস দেয়: যেকোনো cue card-এর সর্বজনীন সিস্টেম, অচেনা টপিকের পদ্ধতি, আর সময় বাকি থাকতে শুকিয়ে গেলে rescue সিস্টেম।",

        sections: [
          {
            code: "P5",
            title: "PART 5 · Part 2 Cue Cards: The Universal System — What Part 2 is",
            titleBn: "Part 2 Cue Card · এটি কী",
            content: {
              coreFact:
                "The examiner hands you a card with a topic and a few prompts, gives you one minute to prepare with paper and pencil, then asks you to speak for one to two minutes on your own. Afterwards they ask one or two short follow-up questions.\n\nA typical card looks like this:\n\nDescribe a place you have visited that you found peaceful. You should say: - where it is - when you went there - what you did there and explain why you found it peaceful.",
              key: "Notice the last line, the “explain” prompt. It is the most important part of the card, because it asks for reasons and feelings, which is where development and higher marks live. Many candidates rush the facts and neglect the explanation; do the opposite.",
              keyBn: "শেষ লাইন ('explain') সবচেয়ে গুরুত্বপূর্ণ — কারণ ও অনুভূতি চায়, এখানেই বিকাশ ও বেশি নম্বর। বেশিরভাগ তথ্যে তাড়াহুড়ো করে ব্যাখ্যা অবহেলা করে; উল্টোটা করুন।",
              coreFact2:
                "Using the one minute. Do not write sentences in your minute; you will not have time, and reading them aloud sounds unnatural. Jot keywords, a few for each prompt, plus any extra ideas that come to mind. You are preparing a story to tell, not a script to read.",
            },
          },
          {
            code: "P5.system",
            title: "The Universal Cue Card System",
            titleBn: "সর্বজনীন Cue Card সিস্টেম",
            content: {
              coreFact: "Here is a flexible five-part skeleton that works for almost any card. It is not a template to memorise word for word; it is a running order for your thoughts.",
              steps: [
                { term: "1. Introduce", en: "Say what you are going to talk about, with a quick frame. “I’d like to tell you about…”" },
                { term: "2. The facts", en: "Cover the who, what, where, and when prompts, setting the scene." },
                { term: "3. The story or description", en: "Tell what happened, in order, or describe what it is like in detail. This is the body of your turn." },
                { term: "4. Feelings and reasons", en: "Answer the “explain” prompt: why it matters, why it is memorable, how you felt. Spend real time here." },
                { term: "5. Reflection or result", en: "Wrap up: what it means to you now, what came of it, why you still remember it." },
              ],
              key: "Use the card’s prompts as a map, but add beyond them. The prompts are the minimum; the marks come from what you build on top.",
              keyBn: "প্রম্পটগুলো মানচিত্র, কিন্তু তার বাইরে যোগ করুন। প্রম্পট সর্বনিম্ন; নম্বর আসে উপরে যা গড়েন তা থেকে।",
            },
          },
          {
            code: "P5.story",
            title: "Creating a story",
            titleBn: "গল্প তৈরি করা",
            content: {
              coreFact: "A description becomes far more engaging as a mini-story. Two ways to shape it:",
              bullets: [
                "Chronology: before, during, after. “I had been meaning to go for years… when I finally arrived… and afterwards…”",
                "Description: bring in the senses and specifics. What you saw, heard, smelled; the small details that make it real.",
              ],
              coreFact2:
                "Your tenses will shift naturally as you do this: past for the events, present for how you feel about it now. You do not need to think about that consciously; telling the story properly makes the grammar happen.",
            },
          },
          {
            code: "P5.adapt",
            title: "Adapt, do not memorise",
            titleBn: "মানিয়ে নিন, মুখস্থ নয়",
            content: {
              principle:
                "You cannot memorise an answer for every possible cue card, and memorised answers sound rehearsed and score lower. What you can do is internalise the system and practise applying it to random cards until it is automatic. The skill is not a stock of prepared speeches; it is the ability to build a good turn on the spot, every time.",
              principleBn:
                "নীতি: প্রতিটি সম্ভাব্য cue card-এর জন্য উত্তর মুখস্থ করা যায় না, আর মুখস্থ উত্তর মহড়া-দেওয়া শোনায় ও কম নম্বর পায়। যা পারেন: সিস্টেমটি আত্মস্থ করে এলোমেলো কার্ডে প্রয়োগের অনুশীলন করা যতক্ষণ না স্বয়ংক্রিয় হয়।",
            },
          },
          {
            code: "P5.worked",
            title: "Worked example",
            titleBn: "কাজ-করা উদাহরণ",
            content: {
              coreFact: "Card: the peaceful place card above.\n\nOne-minute notes (keywords only): “mountain lake / near hometown / last summer, family / walked, sat by water, no phone signal / silence, nature, no city noise, felt calm, forgot my worries”",
              examples: [
                { right: "Model long turn: “I’d like to tell you about a mountain lake I visited that I found incredibly peaceful. (Introduce.) It is a couple of hours from my hometown, high up in the hills, and I went there last summer with my family for a long weekend. (Facts.) We spent the days walking around the shore, and in the afternoons we would just sit by the water with a picnic. What struck me most was that there was no phone signal at all, so for once nobody was staring at a screen. (Story.) The reason it felt so peaceful was the silence, a kind of silence you never get in the city, just birds and the water. Being surrounded by nature like that, with none of the usual noise and rush, made me feel completely calm, and I genuinely forgot all my worries for a few days. (Feelings and reasons.) Even now, when I am stressed, I think back to that lake, and I have promised myself I will go again this year. (Reflection.)”", why: "That is a full, natural, well-developed long turn, built from keyword notes using the system, not memorised." },
              ],
              tutorTip:
                "Spend most of your minute preparing the “explain” prompt, not the facts. Anyone can say where and when; the marks are in why and how you felt. If you run short on ideas, it should be for the facts, never for the feelings.",
              tutorTipBn:
                "আপনার এক মিনিটের বেশিরভাগ সময় 'explain' অংশের প্রস্তুতিতে দিন, তথ্যে নয়। কোথায় আর কখন যে কেউ বলতে পারে; নম্বর থাকে কেন আর কেমন লেগেছিল তাতে। ধারণা কম পড়লে তথ্যে পড়ুক, অনুভূতিতে কখনো নয়।",
            },
          },
          {
            code: "P6",
            title: "PART 6 · What if I don’t know the topic?",
            titleBn: "টপিক না জানলে?",
            content: {
              coreFact:
                "Sometimes you get a card for which you have no real experience: a person you cannot think of, a place you have never been, an object you do not own, an experience you have never had. This is not a problem, because the examiner is testing your English, not fact-checking your life.",
              points: [
                { term: "Invent plausibly", en: "Build a believable example from general knowledge. If the card asks about a historical building you have visited and you cannot think of one, describe a famous one you have seen in photos or films as if you had been. It only needs to be plausible and describable.", bn: "সাধারণ জ্ঞান থেকে বিশ্বাসযোগ্য উদাহরণ গড়ুন।" },
                { term: "Adapt a real memory", en: "Bend a real experience to fit the card. A card about “a gift you gave someone” can borrow the details of any gift you remember, reshaped to fit.", bn: "সত্যি অভিজ্ঞতা কার্ডের সঙ্গে মানিয়ে নিন।" },
                { term: "Generalise, then commit", en: "If you truly have no instance, start general and then settle on one. “I have not travelled abroad much, but if I had to choose a memorable trip, it would be a visit to the coast near my city, which…” Then treat that as your answer.", bn: "সাধারণ দিয়ে শুরু করে একটিতে স্থির হন।" },
              ],
            },
          },
          {
            code: "P6.tactics",
            title: "Quick tactics by card type & what not to do",
            titleBn: "কার্ড-ধরন অনুযায়ী কৌশল ও যা করবেন না",
            content: {
              coreFact: "Quick tactics by card type:",
              bullets: [
                "Unfamiliar person: base them on someone you actually know, adjusting details to fit the prompt.",
                "Unfamiliar place: use a place you have seen in media or heard about, and describe it confidently.",
                "Unfamiliar object: almost any object can be described; pick one you can say a lot about, even loosely related.",
                "Unfamiliar experience: adapt a similar experience, or imagine a plausible one and narrate it as if real.",
              ],
              coreFact2:
                "What not to do. Do not say “I don’t know” and stop. Do not fall silent. Do not announce that you are making it up. Simply construct your answer naturally and speak as though it is yours. Confidence in delivery matters more than the truth of the content, because content is not what is being scored.",
              tutorTip:
                "You are allowed to invent. A vivid, well-told imaginary answer scores far higher than an honest “I can’t think of one.” The examiner will never know, and it is not their concern. Treat every cue card as a chance to tell a good story, true or not.",
              tutorTipBn:
                "আপনি বানাতে পারেন — এটা অনুমোদিত। একটি প্রাণবন্ত, ভালোভাবে বলা কাল্পনিক উত্তর সৎ 'ভাবতে পারছি না'-এর চেয়ে অনেক বেশি নম্বর পায়। পরীক্ষক কখনো জানবেন না, আর এটা তাঁর বিষয়ও নয়। প্রতিটি cue card-কে ভালো গল্প বলার সুযোগ ভাবুন, সত্য হোক বা না হোক।",
            },
          },
          {
            code: "P7",
            title: "PART 7 · How to Keep Talking: The Rescue System",
            titleBn: "কথা চালিয়ে যাওয়া: rescue সিস্টেম",
            content: {
              coreFact:
                "You are halfway through Part 2, or deep in a Part 3 answer, and your mind empties with time still to fill. This happens to everyone. Here is how to generate more, on demand.\n\nThe “I have nothing else to say” rescue system. When you run dry, run silently through these moves. Each one generates another sentence or two.",
              bullets: [
                "Add detail. Describe more: what it looked like, sounded like, the specifics.",
                "Explain. Say why, or how, something is so.",
                "Give an example. A specific instance of what you just said.",
                "Compare. To something else, or before versus now.",
                "Reflect. What it means to you, what you learned from it.",
                "Feelings. How you felt then, or feel now.",
                "Consequence. What happened as a result.",
                "Speculate. What might happen, or what you would do.",
              ],
              coreFact2:
                "You do not use all eight. You reach for whichever fits, and it restarts your flow. With practice, this becomes automatic, and you will never truly run out, because there is always another angle.",
            },
          },
          {
            code: "P7.worked",
            title: "Worked rescue & do not fill with empty filler",
            titleBn: "কাজ-করা rescue ও খালি filler নয়",
            content: {
              coreFact: "Suppose you have said: “My favourite gadget is my phone. I use it all the time.” You have run dry. Apply the moves:",
              examples: [
                { right: "Explain: “I rely on it because it does almost everything, from my alarm to my banking.”" },
                { right: "Example: “For instance, I planned my whole last holiday on it, from the flights to the restaurants.”" },
                { right: "Compare: “It is strange to think that a few years ago I needed a separate camera, map, and diary, and now it is all in one device.”" },
                { right: "Reflect: “In a way it worries me how dependent I have become, but I honestly could not manage my day without it.”" },
              ],
              coreFact2:
                "Four moves turned two dead sentences into a full, developing answer.\n\nDo not fill with empty filler. Rescuing is about adding real content, not noise. Avoid strings of “um, yeah, so, I don’t know,” which lower your Fluency score. The rescue moves give you something genuine to say; use them instead of empty sounds.",
              tutorTip:
                "Memorise the rescue moves as a short mental list you can run through under pressure: explain, example, compare, feel, reflect. When you freeze, silently walk the list and pick one. Having a fixed set to reach for is what turns a panic into a pause. You are never truly stuck; you have simply not asked yourself the next question yet.",
              tutorTipBn:
                "rescue move-গুলো একটি ছোট তালিকা হিসেবে মুখস্থ রাখুন: explain, example, compare, feel, reflect. আটকে গেলে নিজে নিজে তালিকাটা মনে করে একটা বেছে নিন। একটি নির্দিষ্ট সেট হাতে থাকলে আতঙ্ক শুধু একটি বিরতিতে পরিণত হয়। আপনি সত্যিই আটকে নেই; কেবল পরের প্রশ্নটা নিজেকে করেননি।",
            },
          },
        ],

        exercises: [
          {
            code: "Drill 26.1",
            title: "Plan a cue card (Level 2)",
            instruction: "Take this card and write keyword notes (not sentences) using the five-part system: “Describe a skill you would like to learn. You should say: what it is, why you want to learn it, how you would learn it, and explain how it would help you.”",
            instructionBn: "পাঁচ-অংশ সিস্টেম দিয়ে keyword নোট লিখুন (বাক্য নয়)।",
          },
          {
            code: "Drill 26.2",
            title: "Construct an unknown topic (Level 3)",
            instruction: "You get: “Describe a famous person from your country you admire.” You cannot think of one you genuinely admire. Describe your strategy in one or two sentences, then give the opening lines of your answer.",
            instructionBn: "কৌশল এক-দুই বাক্যে বলুন, তারপর উত্তরের শুরুর লাইন দিন।",
          },
          {
            code: "Drill 26.3",
            title: "Rescue a dying answer (Level 3)",
            instruction: "You have said only: “I enjoy going to the beach.” Using three rescue moves, extend it into a fuller answer, and name the moves you used.",
            instructionBn: "তিনটি rescue move দিয়ে উত্তরটি বাড়ান, আর কোন move ব্যবহার করলেন লিখুন।",
          },
        ],

        answerKey: {
          "Drill 26.1 — Plan a cue card (sample notes)": [
            { q: "Keyword notes (five-part)", answer: "Introduce: skill = playing the guitar. Facts: always loved music, never had lessons. Story/how: online videos + a cheap second-hand guitar + practise evenings. Feelings/reasons: why = relaxation, express myself, play at gatherings. Reflection: would boost confidence, make social events more fun.", why: "These keywords are enough to speak from for two minutes; you would never write full sentences in the minute." },
          ],
          "Drill 26.2 — Construct an unknown topic (sample)": [
            { q: "“Describe a famous person from your country you admire.” — you cannot think of one", answer: "Strategy: adapt or invent plausibly, choosing a well-known figure I can say a lot about and treating them as someone I admire. Opening: “I’d like to talk about a scientist from my country who is widely respected for her work in public health. I may not know her personally, of course, but from everything I have read, she is someone I genuinely look up to…” Then continue with plausible detail.", why: "The key is to commit and speak confidently, not to stall over whether it is your truest choice." },
          ],
          "Drill 26.3 — Rescue a dying answer (sample)": [
            { q: "You have said only: “I enjoy going to the beach.” Use three rescue moves.", answer: "“I enjoy going to the beach, mainly because it is the one place I feel completely relaxed. (explain) For example, last month I spent a whole day there just swimming and reading, and I came home feeling refreshed. (example) Compared to a city break, which I find tiring, the beach genuinely recharges me. (compare)”", why: "Three moves, explain, example, compare, turned one flat sentence into a developed answer. The lesson across all three: Part 2 is not about having the perfect memory or the right topic. It is about a system you can apply to anything, a willingness to construct when you must, and a set of rescue moves that guarantee you never run dry." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 26 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 27 · Speaking Part 3 and Thinking Time
// ────────────────────────────────────────────────────────────
async function seedFile27() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 27 · Speaking Part 3 and Thinking Time",
      titleBn: "ফাইল ২৭ · Speaking Part 3 ও চিন্তার সময়",
      position: 27,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Module 4: IELTS Speaking",
        intro:
          "Part 3 is where the test asks you to think, not just describe. The questions are broader, more abstract, and more demanding, and the answers need real reasoning. This file gives you a framework for developing Part 3 answers, and then a set of natural ways to buy yourself a moment to think when a hard question lands.",
        introBn:
          "ফাইল ২৭-এর মূল কথা: Part 3-এ ভাবতে হয়, শুধু বর্ণনা নয়। প্রশ্ন বিস্তৃত, বিমূর্ত, কঠিন — উত্তরে সত্যিকারের যুক্তি লাগে। এই ফাইল Part 3 উত্তর গড়ার কাঠামো দেয়, আর কঠিন প্রশ্নে ভাবার মুহূর্ত স্বাভাবিকভাবে কেনার উপায়।",

        sections: [
          {
            code: "P8",
            title: "PART 8 · Speaking Part 3 — What Part 3 is & the shift from Part 1",
            titleBn: "Speaking Part 3 · এটি কী ও Part 1 থেকে পার্থক্য",
            content: {
              coreFact:
                "Part 3 lasts about four to five minutes. The examiner asks broader, more abstract questions connected to the Part 2 topic. If Part 2 was about a peaceful place, Part 3 might ask why people need quiet in modern life, or how cities have changed. The questions are no longer about you personally; they are about society, ideas, and general trends.\n\nThe shift from Part 1. Part 1 asked for personal facts in short answers. Part 3 asks for opinions, analysis, and speculation, in longer, more developed answers. This is the part that most tests your Fluency and Coherence, because you must organise a genuine argument on the spot. Treat each answer as a short spoken essay, natural but reasoned.",
              bn: "Part 3 প্রায় ৪-৫ মিনিট। Part 2 টপিকের সঙ্গে যুক্ত বিস্তৃত, বিমূর্ত প্রশ্ন — সমাজ, ধারণা, সাধারণ প্রবণতা নিয়ে। মত, বিশ্লেষণ, অনুমান দীর্ঘ উত্তরে। প্রতিটি উত্তর যেন ছোট মৌখিক রচনা — স্বাভাবিক কিন্তু যুক্তিপূর্ণ।",
            },
          },
          {
            code: "P8.types",
            title: "The question types, and how to handle each",
            titleBn: "প্রশ্নের ধরন ও প্রতিটির মোকাবিলা",
            content: {
              points: [
                { term: "Opinion", en: "“Do you think…?” State your view and defend it." },
                { term: "Cause", en: "“Why do people…?” Give reasons." },
                { term: "Effect", en: "“What effect does X have?” Give consequences." },
                { term: "Comparison", en: "“What is the difference between X and Y?” Contrast them." },
                { term: "Change over time", en: "“How has X changed?” Compare past, present, and perhaps future." },
                { term: "Prediction", en: "“Will X happen in the future?” Speculate with “might,” “could,” “is likely to.”" },
                { term: "Advantages and disadvantages, or problem and solution", en: "Cover both sides, or identify problems and suggest solutions." },
              ],
              key: "Recognising the type tells you the shape of the answer, exactly as in Writing Task 2.",
              keyBn: "ধরন চিনলেই উত্তরের আকৃতি বোঝা যায়, ঠিক Writing Task 2-এর মতো।",
            },
          },
          {
            code: "P8.framework",
            title: "The core framework: Answer, Explain, Example, Consequence or Contrast",
            titleBn: "মূল কাঠামো: Answer, Explain, Example, Consequence/Contrast",
            content: {
              coreFact: "For most Part 3 questions, develop your answer in four moves:",
              steps: [
                { term: "Answer", en: "Give your response or position directly." },
                { term: "Explain", en: "Say why, the reasoning behind it." },
                { term: "Example", en: "Illustrate it with a specific instance." },
                { term: "Consequence or Contrast", en: "State the result, or acknowledge the other side." },
              ],
              key: "For “Why do you think people need peaceful places in modern life?”: “I think peaceful places have become almost essential nowadays. (Answer.) Modern life, especially in cities, is so fast and noisy that people are constantly stimulated, which is genuinely exhausting over time. (Explain.) Someone who commutes through heavy traffic and then works in a noisy open-plan office, for example, may go a whole day without a single quiet moment. (Example.) So having somewhere calm to retreat to, even just a local park, helps them recover and protects their mental health. (Consequence.)” That is a developed, well-reasoned Part 3 answer, and it is a mini spoken essay, not a memorised speech.",
              keyBn: "উদাহরণ উত্তরটি একটি ছোট মৌখিক রচনা — Answer, Explain, Example, Consequence — মুখস্থ বক্তৃতা নয়।",
            },
          },
          {
            code: "P8.language",
            title: "Language that adds range and buys time · Handling “it depends”",
            titleBn: "পরিসর বাড়ায় ও সময় কেনে এমন ভাষা · 'it depends' সামলানো",
            content: {
              coreFact:
                "Part 3 rewards the language of nuanced opinion, which also gives you thinking space: “I suppose,” “generally speaking,” “it depends,” “some might argue,” “on balance,” “to some extent.” These phrases signal a sophisticated speaker and let you begin an answer while your main idea forms.",
              coreFact2:
                "Handling “it depends”. “It depends” is a legitimate and sophisticated Part 3 answer, but only if you then explain the conditions. “It depends on the age group, really. For younger people… whereas for older people…” Do not stop at “it depends”; use it as the opening of a nuanced answer, not an escape from one.\n\nThere is no correct answer. As everywhere in Speaking, your opinion is never marked right or wrong. A balanced, nuanced answer that sees more than one side often shows the most sophisticated English, and Part 3 is the ideal place to display that.",
              tutorTip:
                "In Part 3, always say why. The examiner is listening for reasoning, so an answer that gives an opinion and then explains and illustrates it scores far higher than a longer answer that just asserts several opinions. One well-developed reason beats three bare ones, exactly as in the Writing essay.",
              tutorTipBn:
                "Part 3-এ সবসময় কারণ বলুন। পরীক্ষক যুক্তি শুনতে চান, তাই যে উত্তর একটি মত দিয়ে সেটা ব্যাখ্যা ও উদাহরণ দেয়, সেটা কেবল কয়েকটা মত বলা লম্বা উত্তরের চেয়ে অনেক বেশি নম্বর পায়। একটি ভালোভাবে গড়া কারণ তিনটি খালি মতের চেয়ে ভালো।",
            },
          },
          {
            code: "P9",
            title: "PART 9 · Thinking Time — How to buy time naturally",
            titleBn: "চিন্তার সময় · স্বাভাবিকভাবে সময় কেনা",
            content: {
              coreFact:
                "Part 3 questions often need a moment’s thought, and you must take that moment without an awkward silence or a string of “ums.” The good news is that fluent speakers of every language buy thinking time constantly, and they do it with natural moves you can learn.",
              points: [
                { term: "A brief pause", en: "A short, natural pause before answering is completely fine, and even sounds thoughtful. Silence for one second is not a problem; silence for six is. Take the small pause without fear." },
                { term: "A general opener or comment on the question", en: "Begin with a natural remark: “That’s an interesting question.” “I’ve never really thought about that, but…” “Well, that’s a tricky one.” These buy a second or two and sound entirely natural, because they are what real speakers say." },
                { term: "Reformulate the question", en: "Restate it in your own words as you begin: “So, whether technology has made us less social… I’d say…” This buys time and, as a bonus, shows the examiner you understood the question and gives a small display of vocabulary." },
                { term: "Natural fillers, used sparingly", en: "“Well,” “I suppose,” “to be honest,” “actually,” “you know” are natural in small doses. They oil ordinary speech. Used constantly, they become a distracting tic, so sprinkle, do not pour." },
                { term: "Start general, then narrow", en: "Open with a broad statement while your specific idea forms: “There are probably several reasons for that. The main one, I think, is…” The general opener holds the floor while you assemble the detail." },
                { term: "Hedge as thinking space", en: "“It’s hard to say, but generally…” gives you a moment and sounds sophisticated at the same time." },
              ],
            },
          },
          {
            code: "P9.balance",
            title: "The balance: natural, not stalling",
            titleBn: "ভারসাম্য: স্বাভাবিক, সময়ক্ষেপণ নয়",
            content: {
              principle:
                "These are natural spoken behaviours, not stalling tactics, and the difference is quantity. One brief opener and a short pause sound thoughtful; a five-second “ummmm,” or repeating the whole question every single time, or stacking “well, you know, I mean, actually, basically” sounds like stalling and lowers your Fluency. Buy a moment, then speak.",
              principleBn:
                "নীতি: এগুলো স্বাভাবিক মৌখিক আচরণ, সময়ক্ষেপণ নয় — পার্থক্য পরিমাণে। একটি সংক্ষিপ্ত opener ও ছোট বিরতি চিন্তাশীল শোনায়; পাঁচ সেকেন্ডের 'ummmm', বা প্রতিবার পুরো প্রশ্ন পুনরাবৃত্তি, বা filler স্তূপ করা সময়ক্ষেপণ শোনায় ও Fluency কমায়।",
              bullets: [
                "What to avoid: Long silences while you visibly search for an idea.",
                "Excessive “um” and “er.”",
                "Repeating the entire question back word for word every time; occasional reformulation is good, robotic repetition is not.",
                "Stacking empty phrases with no content behind them.",
              ],
            },
          },
          {
            code: "P9.worked",
            title: "Worked example",
            titleBn: "কাজ-করা উদাহরণ",
            content: {
              coreFact: "A hard question: “Do you think people will work fewer hours in the future?” A natural response with time-buying built in:",
              examples: [
                { right: "“That’s a really interesting question, and honestly it’s quite hard to predict. (Opener, buys time.) But on balance, I think we probably will, at least in some jobs. (Answer.) As technology and automation take over more routine tasks, the same work can be done in less time, so it seems likely that working weeks will gradually shorten. (Explain.) We have already seen some companies trialling four-day weeks, for instance. (Example.) That said, it may not happen evenly, since some industries will resist it. (Contrast.)”", why: "The opener bought a moment naturally, and then the answer developed cleanly. No awkward silence, no pile of fillers." },
              ],
              tutorTip:
                "Have two or three natural openers ready, such as “That’s an interesting question” and “I’ve not thought about that before, but…”, and let them become automatic. They are not memorised answers, so they are not penalised; they are the natural connective tissue of speech, and they give your brain the half-second it needs. The goal is to pause like a fluent speaker, not to fill silence like a nervous one.",
              tutorTipBn:
                "দুই-তিনটি স্বাভাবিক opener তৈরি রাখুন, যেমন 'That's an interesting question' আর 'I've not thought about that before, but…', আর সেগুলো স্বয়ংক্রিয় করে তুলুন। এগুলো মুখস্থ উত্তর নয়, তাই penalise হয় না; এগুলো কথার স্বাভাবিক অংশ, আর মস্তিষ্ককে দরকারি আধা সেকেন্ড দেয়। লক্ষ্য: সাবলীল বক্তার মতো থামা, নার্ভাসের মতো নীরবতা ভরাট নয়।",
            },
          },
        ],

        exercises: [
          {
            code: "Drill 27.1",
            title: "Identify the question type (Level 2)",
            instruction: "Name the Part 3 question type and the shape of a good answer. 1. “Why do you think fewer young people read books these days?” 2. “How has the way people communicate changed over the last twenty years?” 3. “Do the benefits of remote work outweigh the drawbacks?”",
            instructionBn: "প্রতিটির Part 3 প্রশ্নের ধরন ও ভালো উত্তরের আকৃতি লিখুন।",
          },
          {
            code: "Drill 27.2",
            title: "Answer with the framework (Level 3)",
            instruction: "Answer this using Answer, Explain, Example, Consequence or Contrast: “Do you think technology has made people less social?”",
            instructionBn: "কাঠামো দিয়ে উত্তর দিন।",
          },
          {
            code: "Drill 27.3",
            title: "Natural or stalling? (Level 2)",
            instruction: "Which opening buys time naturally, and which sounds like stalling? a) “Um… er… well… um… the thing is… um…” b) “That’s a good question. I suppose it depends, but on the whole…”",
            instructionBn: "কোন শুরুটা স্বাভাবিকভাবে সময় কেনে, কোনটা সময়ক্ষেপণ?",
          },
        ],

        answerKey: {
          "Drill 27.1 — Identify the question type": [
            { q: "1. “Why do you think fewer young people read books these days?”", answer: "Cause.", why: "Give reasons (distraction of screens, less free time, changing habits), explained." },
            { q: "2. “How has the way people communicate changed over the last twenty years?”", answer: "Change over time.", why: "Contrast the past with the present, perhaps touching the future." },
            { q: "3. “Do the benefits of remote work outweigh the drawbacks?”", answer: "Advantages outweigh disadvantages.", why: "Weigh both sides and give a verdict, just like the Writing task of the same name." },
          ],
          "Drill 27.2 — Answer with the framework (sample)": [
            { q: "“Do you think technology has made people less social?”", answer: "“To some extent, yes, though it’s complicated. (Answer.) On one hand, people now spend hours on their phones even when they’re together, which can reduce real conversation. (Explain.) You often see a group of friends in a café all looking at their own screens, for example. (Example.) On the other hand, technology also connects people who would otherwise never speak, like family living abroad, so it has arguably made us more social in a different way. (Contrast.)”", why: "A balanced, developed answer that sees both sides scores highly." },
          ],
          "Drill 27.3 — Natural or stalling?": [
            { q: "a vs b", answer: "b buys time naturally; a is stalling.", why: "Response b uses a short opener and a hedge, sounds thoughtful, and moves quickly into an answer. Response a is a pile of empty fillers with no content and no progress, which lowers Fluency. A brief natural opener is good; a string of “ums” is not." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 27 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 28 · Recovery Strategies, Pronunciation Strategy & Memorisation Traps
// ────────────────────────────────────────────────────────────
async function seedFile28() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 28 · Recovery Strategies, Pronunciation Strategy & Memorisation Traps",
      titleBn: "ফাইল ২৮ · পুনরুদ্ধার কৌশল, Pronunciation কৌশল ও মুখস্থের ফাঁদ",
      position: 28,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Module 4: IELTS Speaking",
        intro:
          "Three shorter chapters that handle what goes wrong and how candidates misprepare. First, how to recover smoothly from the slips everyone makes. Then, how to think about pronunciation without turning it into a phonetics course. Finally, why memorised answers hurt, and what to do instead.",
        introBn:
          "ফাইল ২৮-এর মূল কথা: তিনটি ছোট অধ্যায় — কী ভুল হয় ও প্রার্থীরা কীভাবে ভুল প্রস্তুতি নেয়। প্রথমে সবার হওয়া ভুল থেকে মসৃণ পুনরুদ্ধার; তারপর phonetics কোর্সে না গিয়ে pronunciation ভাবা; শেষে মুখস্থ উত্তর কেন ক্ষতি করে ও তার বদলে কী।",

        sections: [
          {
            code: "P10",
            title: "PART 10 · Recovery Strategies",
            titleBn: "পুনরুদ্ধার কৌশল",
            content: {
              coreFact:
                "Everyone makes mistakes when speaking, including fluent native speakers. What separates a high band from a low one is not the absence of slips; it is how smoothly you carry on after them.",
              principle:
                "Recovery beats perfection. A small mistake, smoothly passed over, costs almost nothing. The same mistake, followed by a full stop, an apology, and a restart, costs your Fluency, which is the thing actually being scored. Keep the flow, and most errors become invisible.",
              principleBn:
                "নীতি: পুনরুদ্ধার নিখুঁততাকে হারায়। ছোট ভুল মসৃণভাবে পার হলে প্রায় কিছুই কাটে না। একই ভুল থামা-ক্ষমা-পুনরায় শুরু করলে Fluency কাটে — যেটাই আসলে মাপা হয়। প্রবাহ ধরে রাখুন, বেশিরভাগ ভুল অদৃশ্য হয়ে যাবে।",
            },
          },
          {
            code: "P10.cases",
            title: "Here is what to do in each situation",
            titleBn: "প্রতিটি পরিস্থিতিতে যা করবেন",
            content: {
              points: [
                { term: "After a grammar mistake", en: "Usually, just carry on. Examiners expect some grammatical errors and do not mark down a single slip. If it is easy to fix in passing, a quick natural self-correction is fine (“she go, sorry, she goes”), but do not stop to obsess over it or repeat it." },
                { term: "After a wrong word", en: "Correct it briefly and naturally: “the, sorry, I mean the manager,” then continue. One clean correction, then move on." },
                { term: "When you forget a word", en: "Do not freeze. Paraphrase around it: describe the thing you cannot name. “The, you know, the machine you use to make coffee.” This is not a failure; it actively demonstrates Lexical Resource, because working around a missing word is a real language skill. Freezing loses marks; paraphrasing gains them." },
                { term: "When you misunderstand the question", en: "Ask for repetition or clarification, politely. “Sorry, could you say that again?” or “Do you mean…?” This is allowed and is far better than confidently answering the wrong question, which hurts Coherence. In Part 1 and Part 3 the examiner can repeat; in Part 2 you work with the card as given." },
                { term: "When you lose your train of thought", en: "Buy a brief moment, or move on gracefully. “Anyway, my main point is…” or “Sorry, where was I, yes…” These are natural and let you rejoin your flow. Do not panic and restart the whole answer." },
                { term: "When you speak too much", en: "It is fine if the examiner interrupts you; managing the time is their job, not a sign you did badly. Stop naturally when they move on, and do not be thrown by it." },
                { term: "When you speak too little", en: "Extend, using the toolkit from File 25 and the rescue moves from File 26. A too-short answer is fixed by adding a reason, an example, or a consequence." },
              ],
              tutorTip:
                "Do not apologise for small mistakes. Stopping to say “sorry, sorry” draws the examiner’s attention to an error they might have barely noticed, and it breaks your fluency far more than the error did. Fix it in a word if it is easy, otherwise let it go and keep talking. Confident continuation is itself a mark of fluency.",
              tutorTipBn:
                "ছোট ভুলের জন্য ক্ষমা চাইবেন না। থেমে 'sorry, sorry' বলা পরীক্ষকের মনোযোগ এমন ভুলে টানে যা তিনি হয়তো খেয়ালই করেননি, আর এটা ভুলের চেয়ে বেশি fluency নষ্ট করে। সহজ হলে এক শব্দে ঠিক করুন, নাহলে ছেড়ে দিয়ে কথা চালিয়ে যান। আত্মবিশ্বাসী ধারাবাহিকতাই fluency-র চিহ্ন।",
            },
          },
          {
            code: "P11",
            title: "PART 11 · Pronunciation Strategy",
            titleBn: "Pronunciation কৌশল",
            content: {
              coreFact: "This is not a phonetics course, and it is not about your accent. Let us be clear about what the Pronunciation criterion actually measures.",
              principle:
                "Pronunciation is scored on intelligibility, how easy you are to understand, plus features like stress, rhythm, and intonation. You do NOT need a British or American accent. A clear accent of any origin scores well. The goal is to be understood easily and to sound natural, not to sound foreign or native.",
              principleBn:
                "নীতি: Pronunciation মাপা হয় বোধগম্যতায় — কতটা সহজে বোঝা যায় — সঙ্গে stress, rhythm, intonation। British/American accent লাগে না। যেকোনো উৎসের স্পষ্ট accent ভালো নম্বর পায়। লক্ষ্য: সহজে বোঝা যাওয়া ও স্বাভাবিক শোনানো।",
            },
          },
          {
            code: "P11.features",
            title: "The features worth working on",
            titleBn: "যেসব দিকে কাজ করা দরকার",
            content: {
              points: [
                { term: "Clarity", en: "Pronounce full words and do not swallow the endings. Being clear enough to be understood without effort is the foundation of the whole criterion." },
                { term: "Word stress", en: "Stress the correct syllable: comFORTable, phoTOGraphy, deVELop. Wrong word stress can genuinely obscure meaning and make a word hard to recognise, so it is worth getting right on common words." },
                { term: "Sentence stress", en: "Stress the important content words in a sentence, not every word. “I REALLY enjoyed the FILM” sounds natural; stressing everything sounds robotic. Sentence stress is what gives English its rhythm." },
                { term: "Rhythm", en: "English is stress-timed, riding on the stressed words. A natural rhythm sounds fluent; a flat, evenly-hammered delivery sounds mechanical." },
                { term: "Intonation", en: "Let your voice rise and fall, for questions, for emphasis, for interest. This is the single biggest win, because the opposite, a monotone, is what most damages an otherwise good speaker." },
                { term: "Pausing", en: "Pause at natural boundaries, between thought groups, not in the middle of a phrase. Natural pausing makes you easier to follow." },
              ],
            },
          },
          {
            code: "P11.monotone",
            title: "The biggest single win: avoid monotone · speed · how to practise",
            titleBn: "সবচেয়ে বড় লাভ: monotone এড়ানো · গতি · অনুশীলন",
            content: {
              coreFact:
                "If you fix only one thing, fix flatness. A monotone voice makes even good English sound dull and can obscure your meaning, because English carries a lot of information in its intonation. Speaking with natural variation and a little energy makes you sound engaged and is easier to understand. You do not need perfect individual sounds; you need to not be flat.",
              coreFact2:
                "The speed connection. As File 24 noted, slowing slightly improves clarity. Rushed speech blurs sounds and endings; a steady pace lets each word land. Slowing down is often the quickest pronunciation improvement available.\n\nHow to practise. Read aloud and record yourself, then listen for clarity, stress, and flatness. Do not chase individual sounds you cannot easily change; focus on being clear, stressing the right words, and varying your intonation. Those three lift the score far more than perfecting a single tricky consonant.",
              tutorTip:
                "Do not waste effort trying to erase your accent; it is not assessed and cannot be changed quickly. Spend that effort on being clear and not flat. A candidate with a strong regional accent who speaks clearly, stresses the right words, and uses lively intonation will outscore a candidate with a “neutral” accent who mumbles in a monotone.",
              tutorTipBn:
                "accent মোছার চেষ্টায় শ্রম নষ্ট করবেন না; এটা মূল্যায়ন হয় না আর দ্রুত বদলানোও যায় না। সেই শ্রম দিন স্পষ্ট হওয়া আর একঘেয়ে না হওয়ায়। স্পষ্ট, সঠিক stress আর প্রাণবন্ত intonation-ওয়ালা শক্ত accent 'neutral' accent-এর একঘেয়ে বিড়বিড়ের চেয়ে বেশি নম্বর পায়।",
            },
          },
          {
            code: "P12",
            title: "PART 12 · Memorisation Traps: why memorised answers can hurt",
            titleBn: "মুখস্থের ফাঁদ: কেন মুখস্থ উত্তর ক্ষতি করে",
            content: {
              coreFact:
                "It is tempting to memorise answers and stories so you feel safe walking in. Resist it. Memorised answers usually lower your score, for several reasons.",
              bullets: [
                "Examiners are trained to detect it. Memorised speech has a giveaway rhythm, a change of pace, an upward glance of recall, and a shift into unnaturally polished vocabulary. When an examiner hears it, they discount it, and your Fluency mark drops, because reciting is not spontaneous speech.",
                "It rarely fits the exact question. A pre-learned answer is built for a general topic, not the specific question asked, so it drifts off-target and hurts Coherence and relevance.",
                "The vocabulary sounds forced. Memorised answers are usually stuffed with rehearsed “advanced” phrases that sit awkwardly in real speech, lowering Lexical Resource rather than raising it.",
                "Over-prepared stories get forced onto the wrong cards. A candidate who memorised a story about “a memorable journey” may force it onto a card about “a memorable meal,” and the mismatch is obvious.",
                "The delivery turns robotic. Recited text lacks the natural hesitations, self-corrections, and warmth of real talk, and it sounds it.",
              ],
            },
          },
          {
            code: "P12.instead",
            title: "What to do instead: prepare flexibly",
            titleBn: "বদলে যা করবেন: নমনীয় প্রস্তুতি",
            content: {
              coreFact: "Preparation is good; it is memorising whole answers that is the trap. Prepare like this:",
              bullets: [
                "Prepare ideas and vocabulary for common topics, not scripts. Know the kinds of things you could say about family, work, technology, the environment, and have some useful words ready, then build a fresh answer on the day.",
                "Practise the frameworks until they are automatic. Answer-Reason-Detail, the cue card system, Answer-Explain-Example-Consequence. These are flexible tools, not memorised text, and making them automatic is exactly the right kind of preparation.",
                "Build a bank of personal examples you can adapt. A few flexible experiences that can be bent to many questions beat a set of rigid, pre-written stories.",
                "Practise speaking spontaneously on random questions, so that building an answer on the spot becomes normal and comfortable.",
              ],
              principle:
                "The line is simple: preparing topic ideas and vocabulary is good; memorising whole answers is bad. Walk in with tools and material you can shape to any question, not speeches you will try to force onto whatever you are asked.",
              principleBn:
                "নীতি সহজ: টপিক-আইডিয়া ও শব্দভাণ্ডার প্রস্তুত করা ভালো; পুরো উত্তর মুখস্থ করা খারাপ। যেকোনো প্রশ্নে আকার দেওয়া যায় এমন টুল ও উপকরণ নিয়ে ঢুকুন, চাপিয়ে দেওয়ার মতো বক্তৃতা নয়।",
              tutorTip:
                "A natural, simple answer is almost always stronger than an impressive memorised one. The examiner would rather hear you think, hesitate slightly, and build a real answer than hear a flawless speech that clearly is not yours. Authenticity scores; recitation does not. Prepare to speak, not to perform.",
              tutorTipBn:
                "স্বাভাবিক সহজ উত্তর প্রায় সবসময় মুখস্থ চমকপ্রদ উত্তরের চেয়ে ভালো। পরীক্ষক বরং শুনতে চান আপনি ভাবছেন, একটু থামছেন, আর সত্যিকারের উত্তর গড়ছেন — নিখুঁত কিন্তু স্পষ্টতই আপনার-নয় এমন বক্তৃতা নয়। সততা নম্বর পায়, মুখস্থ নয়। বলার প্রস্তুতি নিন, পারফর্ম করার নয়।",
            },
          },
        ],

        exercises: [
          {
            code: "Drill 28.1",
            title: "Recover naturally (Level 2)",
            instruction: "What is the best recovery in each case? 1. You cannot remember the word “microwave” mid-sentence. 2. You did not understand the examiner’s Part 3 question. 3. You made a small verb-tense slip two words ago.",
            instructionBn: "প্রতিটিতে সেরা পুনরুদ্ধার কী?",
          },
          {
            code: "Drill 28.2",
            title: "Pronunciation priorities (Level 1)",
            instruction: "A candidate is worried about their accent. What should they focus on instead, and why?",
            instructionBn: "accent নিয়ে চিন্তিত প্রার্থীর বদলে কীসে মন দেওয়া উচিত, আর কেন?",
          },
          {
            code: "Drill 28.3",
            title: "Spot the memorisation trap (Level 2)",
            instruction: "A candidate answers “Describe a book you enjoyed” with a fluent, polished two-minute speech full of rare idioms, delivered without a single pause, that only loosely relates to the book. What is likely happening, and how will it affect the score?",
            instructionBn: "কী ঘটছে, আর স্কোরে কী প্রভাব পড়বে?",
          },
        ],

        answerKey: {
          "Drill 28.1 — Recover naturally": [
            { q: "1. You cannot remember the word “microwave” mid-sentence.", answer: "Paraphrase around it: “the, you know, the thing you use to heat food quickly in the kitchen.”", why: "This keeps you talking and actually shows lexical skill. Freezing or falling silent is the only wrong choice." },
            { q: "2. You did not understand the examiner’s Part 3 question.", answer: "Ask for clarification: “Sorry, could you rephrase that?”", why: "Answering the wrong question hurts more than a polite request to repeat." },
            { q: "3. You made a small verb-tense slip two words ago.", answer: "Carry on.", why: "A tiny tense slip two words back is not worth stopping for; examiners expect occasional errors, and interrupting your flow to fix it costs more than the slip." },
          ],
          "Drill 28.2 — Pronunciation priorities": [
            { q: "A candidate is worried about their accent. What should they focus on instead?", answer: "Focus on clarity, correct stress, and lively intonation, especially not being monotone.", why: "The accent is not assessed and cannot be changed quickly, so effort spent erasing it is wasted. Being easy to understand and sounding natural is what the Pronunciation criterion rewards, and those are trainable." },
          ],
          "Drill 28.3 — Spot the memorisation trap": [
            { q: "A fluent, polished two-minute speech full of rare idioms, no pauses, only loosely related to the book. What is happening?", answer: "This is almost certainly a memorised answer.", why: "The polish, the rare idioms, the lack of any natural pause, and the loose fit to the actual card are the classic signs. The effect: the examiner is trained to recognise it and will discount it, lowering Fluency (it is not spontaneous), Lexical Resource (the idioms are forced), and Coherence (it does not quite answer the card). A simpler, genuine answer that actually described the book would score higher." },
          ],
        },
      },
    },
  });
  console.log("\u2705 File 28 seeded");
}

// ────────────────────────────────────────────────────────────
// FILE 29 · Speaking Insider Tips, Practice & the Close of Module 4
// ────────────────────────────────────────────────────────────
async function seedFile29() {
  await prisma.lessons.create({
    data: {
      section: "tips",
      title: "File 29 · Speaking Insider Tips, Practice & Module 4 Close",
      titleBn: "ফাইল ২৯ · Speaking ইনসাইডার টিপস, অনুশীলন ও মডিউল ৪ সমাপ্তি",
      position: 29,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Module 4: IELTS Speaking",
        intro:
          "The last Speaking chapter. First, a consolidated set of insider tips, the things experienced tutors find themselves saying to student after student. Then a progressive practice programme with an examiner-style self-assessment rubric, so you can train and score yourself. Then we close the module, and with it the four skills.",
        introBn:
          "ফাইল ২৯-এর মূল কথা: শেষ Speaking অধ্যায়। প্রথমে একগুচ্ছ ইনসাইডার টিপস — অভিজ্ঞ টিউটররা যা বারবার বলেন। তারপর ধাপে ধাপে অনুশীলন কর্মসূচি ও পরীক্ষক-ধাঁচের self-assessment rubric, যাতে নিজে অনুশীলন ও নম্বর দিতে পারেন। তারপর মডিউল ও চার দক্ষতার সমাপ্তি।",

        sections: [
          {
            code: "P13",
            title: "PART 13 · Speaking Insider Tips",
            titleBn: "Speaking ইনসাইডার টিপস",
            content: {
              coreFact:
                "These are not secret tricks; they are the honest observations a tutor makes after watching hundreds of candidates succeed and stumble. Each is a habit that separates a natural, high-scoring speaker from an anxious one.",
              bullets: [
                "Answer the actual question. Listen to what was really asked and respond to that, not to a nearby topic you prepared. Answering a slightly different question hurts Coherence even when the English is good.",
                "Do not turn Part 1 into a speech. Part 1 wants short, natural answers, two to four sentences. A one-minute monologue there is out of place. Match the size of your answer to the size of the question.",
                "Do not stop after one sentence. The opposite failure. A bare one-line answer starves the examiner of language to score. Extend with a reason or an example, then stop naturally.",
                "Do not panic over small mistakes. Everyone slips. Keep the flow going; a smoothly passed error costs almost nothing, while stopping to fix it breaks the fluency that is actually scored.",
                "Do not restart every sentence. Constantly abandoning and rebuilding sentences (“I think that, no, what I mean is, actually…”) wrecks fluency. Commit to a sentence and finish it, even imperfectly.",
                "Do not force idioms. A well-placed natural idiom is good; a forced one, dropped in to impress, sounds worse than plain speech and lowers Lexical Resource. Use idioms only when they come naturally.",
                "Do not speak unnaturally slowly. Over-slow speech sounds hesitant and robotic and suggests you are struggling. Aim for a comfortable conversational pace.",
                "Do not speak unnaturally fast. Racing blurs your words, causes errors, and hurts pronunciation. A steady pace sounds more fluent than a fast one.",
                "Do not memorise entire cue-card answers. Examiners detect recited text and discount it. Prepare flexible ideas and frameworks, not scripts.",
                "A natural simple answer beats an impressive memorised one. The examiner would rather hear you genuinely think and build an answer than deliver a flawless speech that clearly is not yours.",
                "In Part 3, always say why. Reasoning is what Part 3 rewards. An opinion explained and illustrated beats several opinions merely stated.",
                "Treat it as a conversation. Engage, react, and let a little personality show. Natural communication scores higher than stiff performance.",
                "Remember there are no wrong opinions or stories. You can say anything and invent anything. This freedom should remove most of your fear.",
                "Keep talking; the examiner cannot score silence. When in doubt, add another sentence using the extension toolkit or a rescue move. Words on the table can be scored; silence cannot.",
                "Ask for repetition if you are unsure. A polite “could you say that again?” is far better than confidently answering the wrong question.",
              ],
              tutorTip:
                "If you internalise only one thing from this module, make it this: relax and talk. Almost every Speaking problem, the freezing, the memorised speeches, the racing, the one-word answers, comes from fear. A candidate who treats the test as a real conversation, answers honestly, extends naturally, and shrugs off small mistakes will usually score close to their true level. Fear, not weak English, is what holds most people below it.",
              tutorTipBn:
                "এই মডিউল থেকে যদি একটাই জিনিস মনে রাখেন, সেটা হোক: শান্ত থাকুন আর কথা বলুন। প্রায় সব Speaking সমস্যা — জমে যাওয়া, মুখস্থ বক্তৃতা, দ্রুত বলা, এক-শব্দের উত্তর — আসে ভয় থেকে। যে সত্যিকারের কথোপকথনের মতো আচরণ করে, সৎভাবে উত্তর দেয়, স্বাভাবিকভাবে বাড়ায় আর ছোট ভুল উড়িয়ে দেয়, সে সাধারণত তার আসল স্তরের কাছাকাছি নম্বর পায়। ভয়ই বেশিরভাগ মানুষকে আটকে রাখে, দুর্বল ইংরেজি নয়।",
            },
          },
          {
            code: "P14",
            title: "PART 14 · Speaking Practice — The drills",
            titleBn: "Speaking অনুশীলন · ড্রিলগুলো",
            content: {
              coreFact:
                "Practise across all the skills of the module. Speaking practice needs to be spoken, so do these aloud, ideally recording yourself or working with a partner who can play the examiner.",
              points: [
                { term: "Part 1 drills (Answer, Reason, Detail)", en: "Answer these aloud in two to three sentences each: Do you work or study? What do you do in your free time? Do you enjoy cooking? Where are you from? Do you use public transport?" },
                { term: "Extension drills", en: "Take each bare answer and extend it with one tool: “Yes, I like sport.” “No, I do not travel much.” “I usually get up early.” “My favourite season is winter.”" },
                { term: "Cue-card and one-minute-prep drills", en: "Give yourself exactly one minute of keyword notes, then speak for one to two minutes on: Describe a person who has influenced you. Describe a place you would like to visit. Describe a skill you would like to learn. Describe a memorable meal." },
                { term: "Part 3 reasoning drills (Answer, Explain, Example, Consequence)", en: "Discuss aloud: Why do people move to cities? How has technology changed the way we work? Do you think people are happier now than in the past? Should governments fund the arts?" },
                { term: "Unfamiliar-topic drills", en: "Force yourself to answer cards on topics you have no real experience of, constructing plausible answers: Describe a piece of traditional clothing. Describe a historical event you find interesting." },
                { term: "Recovery drills", en: "Practise paraphrasing around a “forgotten” word (choose a word, then describe it without naming it), and practise asking for clarification naturally." },
                { term: "Pronunciation drills", en: "Read a short paragraph aloud and record it. Listen for three things only: are your words clear, do you stress the right syllables, and is your intonation lively rather than flat. Re-record, improving one at a time." },
                { term: "Timed mock interview", en: "Self-administer a full test: Part 1 (four to five minutes of familiar questions), Part 2 (one cue card with a minute’s prep and up to two minutes speaking), Part 3 (four to five minutes of discussion on the same theme). Record the whole thing." },
              ],
            },
          },
          {
            code: "P14.rubric",
            title: "Examiner-style self-assessment rubric",
            titleBn: "পরীক্ষক-ধাঁচের self-assessment rubric",
            content: {
              coreFact:
                "After a mock, score yourself against the four criteria. These checkpoints are written in plain language to help you self-assess; they are not the official band descriptors, but they capture what each criterion rewards.",
              points: [
                { term: "Fluency and Coherence", en: "Did I keep talking without long, awkward pauses? Did I extend my answers rather than stopping short? Did I stay on the question? Did I connect ideas so they were easy to follow, without a pile of mechanical linkers? Did I avoid constantly restarting sentences?" },
                { term: "Lexical Resource", en: "Did I use a good range of vocabulary, mostly accurately? Did I use natural word partnerships? When I did not know a word, did I paraphrase around it rather than freezing? Did I avoid forced, unnatural “advanced” words and memorised phrases?" },
                { term: "Grammatical Range and Accuracy", en: "Did I use a mix of simple and more complex sentence structures? Were most of my sentences accurate, with errors that did not usually obscure meaning? (For building this, use the separate grammar book.)" },
                { term: "Pronunciation", en: "Was I easy to understand throughout? Did I stress the right syllables in words and the important words in sentences? Was my intonation varied rather than monotone? Did I avoid rushing?" },
              ],
              key: "Rate each criterion honestly as a rough band, note your single weakest point, and target it in your next practice. As with the Error Log elsewhere in this book, the improvement comes from knowing precisely what to fix, not from practice alone.",
              keyBn: "প্রতিটি মাপকাঠি সৎভাবে মোটামুটি band হিসেবে দিন, সবচেয়ে দুর্বল দিকটা চিহ্নিত করুন, পরের অনুশীলনে সেটাই লক্ষ্য করুন। উন্নতি আসে ঠিক কী ঠিক করতে হবে তা জানা থেকে, কেবল অনুশীলন থেকে নয়।",
              tutorTip:
                "Record yourself and listen back, however uncomfortable it feels. Almost every speaker is surprised by what they hear: the long pauses they did not notice, the sentences they restarted, the flatness of their voice. You cannot fix what you cannot hear, and the recording is the fastest, cheapest examiner you will ever have.",
              tutorTipBn:
                "নিজের কথা রেকর্ড করে শুনুন, যতই অস্বস্তিকর লাগুক। প্রায় সবাই শুনে অবাক হয়: লম্বা বিরতি, বারবার শুরু করা বাক্য, কণ্ঠের একঘেয়েমি — যা খেয়ালই করেননি। শুনতে না পেলে ঠিক করতে পারবেন না, আর রেকর্ডিং হলো সবচেয়ে দ্রুত ও সস্তা পরীক্ষক।",
            },
          },
          {
            code: "wrapup",
            title: "MODULE 4 WRAP-UP: Speaking in one breath",
            titleBn: "মডিউল ৪ সারসংক্ষেপ: এক নিঃশ্বাসে Speaking",
            content: {
              coreFact:
                "Compressed to its core, Speaking is this:\n\nTreat the test as a real conversation, because that is what it is. In Part 1, answer naturally and extend a little with Answer, Reason, Detail. In Part 2, use your minute for keyword notes and build a story with the universal system, spending most of your effort on the “why” and the feelings. In Part 3, answer, explain, illustrate, and add the other side, always giving your reasoning. When you need a moment, buy it like a fluent speaker, with a short pause and a natural opener, not a pile of fillers. When you slip, keep going. When you forget a word, talk around it. Speak clearly and with lively intonation, at a comfortable pace, in your own accent. And never memorise whole answers, because a natural, thinking speaker always beats a reciting one.\n\nThat is the whole module. Not “speak well,” but a precise set of habits for answering, extending, recovering, and staying calm, that you can now run in any interview. When you can do it without thinking, the examiner stops being frightening and becomes what they always were: a person having a conversation with you.",
              bn: "সারসংক্ষেপ: টেস্টকে সত্যিকারের কথোপকথন ভাবুন। Part 1 — Answer, Reason, Detail দিয়ে স্বাভাবিক ও একটু বাড়ানো। Part 2 — এক মিনিটে keyword নোট, সর্বজনীন সিস্টেমে গল্প, বেশিরভাগ শ্রম 'কেন' ও অনুভূতিতে। Part 3 — উত্তর, ব্যাখ্যা, উদাহরণ, অন্য পক্ষ, সবসময় যুক্তি। মুহূর্ত দরকার হলে সাবলীল বক্তার মতো কিনুন। পিছলে গেলে চালিয়ে যান। শব্দ ভুলে গেলে ঘুরিয়ে বলুন। স্পষ্ট ও প্রাণবন্ত intonation-এ, স্বচ্ছন্দ গতিতে, নিজের accent-এ বলুন। পুরো উত্তর কখনো মুখস্থ নয়।",
              key: "You should now be able to say, of any Speaking question in any part: “I know how to think, extend, and recover while speaking.” Four modules down. You have now worked through Listening, Reading, Writing, and Speaking as four complete strategy books. One thing remains: the Master Playbook, which distils all four into a single emergency reference for the days before your test.",
              keyBn: "এখন যেকোনো Speaking প্রশ্নে বলতে পারবেন: 'আমি জানি কীভাবে বলতে বলতে ভাবতে, বাড়াতে ও পুনরুদ্ধার করতে হয়।' চার মডিউল শেষ — Listening, Reading, Writing, Speaking। বাকি: Master Playbook (File 30)।",
            },
          },
        ],

        exercises: [],
        answerKey: {},
      },
    },
  });
  console.log("\u2705 File 29 seeded");
}

// ============================================================
// RUNNER · পুরনো Speaking File মুছে, তারপর ৬টি fresh seed
// ------------------------------------------------------------
// idempotent: যতবার খুশি চালান — প্রতিবার হুবহু ৬টি Speaking file থাকবে।
// অন্য section (grammar) বা Writing file (16–23) অক্ষত থাকবে।
// ============================================================

async function main() {
  const speakingTitles = [
    "File 24 · Understanding the Speaking Test & the Speaking Mindset",
    "File 25 · Speaking Part 1 and How to Extend an Answer",
    "File 26 · Part 2 Cue Cards, Unfamiliar Topics & How to Keep Talking",
    "File 27 · Speaking Part 3 and Thinking Time",
    "File 28 · Recovery Strategies, Pronunciation Strategy & Memorisation Traps",
    "File 29 · Speaking Insider Tips, Practice & Module 4 Close",
  ];

  const deleted = await prisma.lessons.deleteMany({
    where: { section: "tips", title: { in: speakingTitles } },
  });
  console.log(`\uD83E\uDDF9 Cleared ${deleted.count} old Speaking file row(s).`);

  const seeders: [string, () => Promise<void>][] = [
    ["File 24", seedFile24],
    ["File 25", seedFile25],
    ["File 26", seedFile26],
    ["File 27", seedFile27],
    ["File 28", seedFile28],
    ["File 29", seedFile29],
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
    where: { section: "tips", title: { in: speakingTitles } },
  });

  console.log("\n----------------------------------------");
  console.log(`\u2705 Seeded OK : ${ok} / 6`);
  if (failed.length) console.log(`\u274C Failed   : ${failed.join(", ")}`);
  console.log(`\uD83D\uDCCA In DB now : ${total} Speaking file row(s)`);
  if (total === 6 && failed.length === 0) {
    console.log("\uD83C\uDF89 All Speaking files (24\u201329) present. Nothing is missing.");
  } else {
    console.log("\u26A0\uFE0F  Not all 6 present. Check the errors above.");
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