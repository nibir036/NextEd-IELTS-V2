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
// CHAPTER 2 · Tense Mastery & Time Precision
// ============================================================

async function seedChapter2() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Chapter 2 · Tense Mastery & Time Precision",
      titleBn: "অধ্যায় ২ · Tense Mastery ও সময়ের নির্ভুলতা",
      position: 2,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Module 1 · The Foundational Zero-to-Hero Grammar Engine",
        intro:
          "Subject-verb agreement made your verbs match. Tense makes them sit in the right time. In IELTS this is not a small point of grammar; it is a matter of meaning. Writing Task 1 describes data that already happened or is happening now, Task 2 predicts and generalises, and Speaking moves constantly between past stories and future plans. Put a verb in the wrong time and you have said something untrue about when it happened.",
        introBn:
          "অধ্যায় ২-এর মূল কথা: tense মানে verb-কে সঠিক সময়ে বসানো। ভুল tense মানে শুধু grammar ভুল নয়, ঘটনাটা কখন ঘটেছে সেটাই ভুল বলা। IELTS-এ এটি নম্বর কাটার বড় কারণ।",

        sections: [
          {
            code: "2.1",
            title: "What a tense actually is (zero assumption)",
            titleBn: "tense আসলে কী",
            content: {
              points: [
                {
                  term: "Time",
                  en: "Past, present, or future. When did it happen?",
                  bn: "সময় — অতীত, বর্তমান, নাকি ভবিষ্যৎ।",
                },
                {
                  term: "Aspect",
                  en: "Simple, continuous, perfect, or perfect continuous. Is it a whole finished event, an action in progress, an action linked to another time, or a mix?",
                  bn: "aspect — কাজটা সম্পূর্ণ, চলমান, নাকি অন্য সময়ের সাথে যুক্ত।",
                },
              ],
              key: "Three times multiplied by four aspects gives the twelve tenses. But five of them do about 90 per cent of the work in IELTS.",
              bn: "তিন সময় গুণ চার aspect = বারো tense। তবে পাঁচটি tense-ই IELTS-এর ৯০% কাজ করে।",
            },
          },

          {
            code: "2.2",
            title: "The complete map of the twelve tenses",
            titleBn: "বারোটি tense-এর সম্পূর্ণ মানচিত্র",
            content: {
              coreFact:
                "Study the whole table once so you can recognise every form. Then move to 2.3, where we foreground the five that matter most.",
              bn: "একবার পুরো টেবিলটা দেখে নিন যাতে প্রতিটি form চিনতে পারেন। তারপর 2.3-এ যান যেখানে IELTS-এ সবচেয়ে গুরুত্বপূর্ণ পাঁচটি tense আলাদা করে শেখানো হয়েছে।",
              table: [
                { tense: "Present simple", form: "base (+s)", coreUse: "facts, habits, general truths", example: "Governments spend heavily on defence." },
                { tense: "Present continuous", form: "am/is/are + -ing", coreUse: "happening now; current trend", example: "The population is growing steadily." },
                { tense: "Present perfect", form: "have/has + p.p.", coreUse: "past action still relevant; trend up to now", example: "The population has grown since 1990." },
                { tense: "Present perfect continuous", form: "have/has been + -ing", coreUse: "duration of an action continuing to now", example: "Prices have been rising for a decade." },
                { tense: "Past simple", form: "verb + ed / irregular", coreUse: "finished event at a finished time", example: "In 2010, consumption dropped sharply." },
                { tense: "Past continuous", form: "was/were + -ing", coreUse: "action in progress at a past moment", example: "Sales were falling when the law changed." },
                { tense: "Past perfect", form: "had + p.p.", coreUse: "an earlier past action before another past action", example: "By 2000, the factory had closed." },
                { tense: "Past perfect continuous", form: "had been + -ing", coreUse: "duration up to a point in the past", example: "It had been raining for hours before it stopped." },
                { tense: "Future simple (will)", form: "will + base", coreUse: "prediction; spontaneous decision; future fact", example: "Demand will rise over the next decade." },
                { tense: "Future continuous", form: "will be + -ing", coreUse: "action in progress at a future moment", example: "By 2030, most cars will be running on electricity." },
                { tense: "Future perfect", form: "will have + p.p.", coreUse: "an action completed before a future point", example: "By 2040, the city will have doubled in size." },
                { tense: "Future perfect continuous", form: "will have been + -ing", coreUse: "duration up to a future point", example: "By June she will have been working here for ten years." },
              ],
              note: "p.p. = past participle (the third form: go / went / gone; rise / rose / risen). The high-frequency irregular list is in Appendix A. Learn it as fixed items.",
              bnNote: "p.p. মানে past participle (তৃতীয় রূপ)। উচ্চ-ব্যবহৃত irregular verb-এর তালিকা Appendix A-তে আছে।",
            },
          },
          {
            code: "2.3",
            title: "The five tenses IELTS actually rewards",
            titleBn: "যে পাঁচটি tense IELTS-এ নম্বর দেয়",
            content: {
              points: [
                {
                  term: "Present simple",
                  en: "For facts, habits, general truths, and Task 2 positions. Governments spend heavily on defence.",
                  bn: "সাধারণ সত্য, অভ্যাস, Task 2 মতামত।",
                },
                {
                  term: "Present continuous",
                  en: "For what is happening now and for current trends. The population is growing steadily.",
                  bn: "এখন চলছে, বর্তমান trend।",
                },
                {
                  term: "Past simple",
                  en: "For finished events and historical graph data. In 2010, consumption dropped sharply.",
                  bn: "শেষ হওয়া ঘটনা, পুরনো graph data।",
                },
                {
                  term: "Present perfect",
                  en: "For actions and trends that reach up to the present. The population has grown since 1990.",
                  bn: "অতীত থেকে এখন পর্যন্ত চলা কাজ/trend।",
                },
                {
                  term: "Future (will / going to)",
                  en: "For predictions and plans. Demand will rise over the next decade.",
                  bn: "পূর্বাভাস ও পরিকল্পনা।",
                },
              ],
            },
          },
          {
            code: "2.4",
            title: "Critical pair 1 · Past simple versus present perfect",
            titleBn: "গুরুত্বপূর্ণ জোড়া ১",
            cases: [
              {
                title: "Use past simple for finished, often stated time",
                rule: "in 2010, last year, two decades ago, between 2000 and 2010.",
                examples: [
                  {
                    wrong: "The company has launched its first product in 2009.",
                    right: "The company launched its first product in 2009.",
                    why: "Finished year (2009) forces the past simple.",
                  },
                ],
              },
              {
                title: "Use present perfect when the action reaches up to now",
                rule: "signalled by since, for, over the past decade, recently, so far, already.",
                examples: [
                  {
                    wrong: "Since 2020, remote work became far more common.",
                    right: "Since 2020, remote work has become far more common.",
                    why: "\u201Csince\u201D reaches to now, so present perfect.",
                  },
                ],
              },
            ],
          },
          {
            code: "2.5",
            title: "Critical pair 2 · Present simple versus present continuous",
            titleBn: "গুরুত্বপূর্ণ জোড়া ২",
            content: {
              coreFact:
                "Use present simple for a permanent fact, a habit, or a general truth (Water boils at 100\u00B0C). Use present continuous for something happening right now or a temporary current trend, especially with currently, at the moment, these days, nowadays.",
              bn: "সাধারণ সত্য বা অভ্যাস হলে present simple; এখন চলছে বা সাময়িক হলে present continuous। currently, nowadays, at the moment থাকলে সাধারণত continuous।",
            },
          },
          {
            code: "L2",
            title: "L1 Error Fixer · The continuous-tense trap",
            titleBn: "continuous-tense ফাঁদ",
            content: {
              coreFact:
                "Two continuous-tense errors dominate Bangladeshi scripts, both from over-using the -ing form.",
              errorTypes: [
                {
                  type: "Stative verbs cannot be continuous",
                  wrong: ["I am knowing the answer.", "He is having two cars."],
                  right: ["I know the answer.", "He has two cars."],
                },
                {
                  type: "\u201CSince\u201D and \u201Cfor\u201D take the perfect, not the present continuous",
                  wrong: [
                    "The population is increasing since 2010.",
                    "Prices are rising for the last five years.",
                  ],
                  right: [
                    "The population has increased since 2010.",
                    "Prices have been rising for the last five years.",
                  ],
                },
              ],
              bn: "know, want, understand, believe, have (মালিকানা), belong — এসব stative verb কখনো continuous হয় না। since/for থাকলে present perfect বা present perfect continuous বসে, plain present continuous নয়।",
            },
          },
          {
            code: "Impact",
            title: "IELTS Impact · Time frames win or lose Task 1",
            titleBn: "Task 1-এ tense-ই মূল",
            content: {
              key: "A chart with a past date range must stay in the past simple throughout. A trend that reaches the present takes the present perfect. A graph with a future projection takes will or is expected to.",
              examples: [
                "Task 1: Car sales peaked in 2015, have fallen every year since, and are expected to stabilise after 2025.",
                "Task 2: Because cities continue to expand, housing shortages will worsen unless governments act now.",
                "Speaking Part 3: Attitudes have changed a great deal recently, and I think they will keep changing.",
              ],
            },
          },
        ],

        exercises: [
          {
            code: "2.1",
            title: "Tense Selection",
            instruction:
              "Put the verb in brackets into the correct tense. Each item has one best answer determined by its time signal or meaning.",
            instructionBn:
              "বন্ধনীর verb সঠিক tense-এ বসাও। প্রতিটির একটি সঠিক উত্তর আছে, time signal বা অর্থ অনুযায়ী।",
            items: [
              { q: 1, sentence: "In 2008, the company (open) ______ its first overseas office.", answer: "opened", explanation: "Finished year (2008), past simple." },
              { q: 2, sentence: "Since 2015, the government (invest) ______ heavily in renewable energy.", answer: "has invested", explanation: "\u201Csince 2015\u201D reaches to now, present perfect." },
              { q: 3, sentence: "At the moment, the number of tourists (rise) ______ rapidly.", answer: "is rising", explanation: "\u201Cat the moment\u201D, present continuous." },
              { q: 4, sentence: "Water (freeze) ______ at zero degrees Celsius.", answer: "freezes", explanation: "General scientific truth, present simple." },
              { q: 5, sentence: "By the time the survey ended, attitudes (already / change) ______.", answer: "had already changed", explanation: "Action completed before another past event, past perfect." },
              { q: 6, sentence: "I (know) ______ the answer to that question.", answer: "know", explanation: "\u201CI am knowing\u201D is wrong; know is stative, stays simple present." },
              { q: 7, sentence: "House prices (increase) ______ steadily for the last ten years.", answer: ["have been increasing", "have increased"], explanation: "\u201Cfor the last ten years\u201D reaches to now; present perfect continuous stresses duration." },
              { q: 8, sentence: "If this trend continues, the population (double) ______ by 2050.", answer: "will double", explanation: "A real future prediction, first-conditional future with \u201Cwill\u201D." },
              { q: 9, sentence: "Last summer, the temperature (rise) ______ by three degrees.", answer: "rose", explanation: "\u201Clast summer\u201D is finished time, past simple." },
              { q: 10, sentence: "Nowadays, more and more people (work) ______ from home.", answer: "are working", explanation: "\u201Cnowadays\u201D plus a current trend, present continuous." },
              { q: 11, sentence: "The factory (close) ______ down in 1998 and has never reopened.", answer: "closed", explanation: "A finished event (1998), past simple." },
              { q: 12, sentence: "Over the past decade, technology (transform) ______ the way we communicate.", answer: "has transformed", explanation: "\u201Cover the past decade\u201D reaches to now, present perfect." },
              { q: 13, sentence: "He (have) ______ two brothers and one sister.", answer: "has", explanation: "Possession is stative; \u201Cis having\u201D would be wrong." },
              { q: 14, sentence: "Between 2000 and 2010, unemployment (fall) ______ gradually.", answer: "fell", explanation: "A finished past range, past simple." },
              { q: 15, sentence: "Currently, the government (consider) ______ three new proposals.", answer: "is considering", explanation: "\u201Ccurrently\u201D, present continuous." },
              { q: 16, sentence: "She (understand) ______ the problem now, after the explanation.", answer: "understands", explanation: "\u201Cis understanding\u201D is wrong; understand is stative, present simple." },
              { q: 17, sentence: "By 2030, most new cars (be) ______ electric, experts predict.", answer: "will be", explanation: "A future prediction for a future point, future simple." },
              { q: 18, sentence: "The graph shows that consumption (drop) ______ sharply in 2012.", answer: "dropped", explanation: "Tied to a finished year (2012), past simple." },
              { q: 19, sentence: "So far this year, exports (grow) ______ by twelve per cent.", answer: "have grown", explanation: "\u201Cso far this year\u201D reaches to now, present perfect." },
              { q: 20, sentence: "Governments (spend) ______ large sums on defence every year.", answer: "spend", explanation: "A repeated general truth (\u201Cevery year\u201D), present simple." },
            ],
          },
          {
            code: "2.2",
            title: "Task 1 Trend Description",
            instruction:
              "Below is a set of rough notes for a line graph titled \u201CCoffee consumption per person in Country X, 1990 to 2030 (projected).\u201D Write one accurate paragraph describing the trend, using the past simple for finished data, the present perfect for the change up to the present (assume \u201Cnow\u201D is 2025), and a future form for the projection.",
            instructionBn:
              "নিচের নোট থেকে একটি অনুচ্ছেদে trend বর্ণনা করো: শেষ হওয়া data-য় past simple, ২০২৫ পর্যন্ত পরিবর্তনে present perfect, ভবিষ্যতের পূর্বাভাসে future form।",
            paragraph:
              "Notes: 1990: consumption was low, about 2 kg per person; rose steadily through the 1990s; 2000: reached 5 kg; fell slightly between 2005 and 2010; has risen again every year since 2010; 2025 (now): stands at about 8 kg; projected to reach 10 kg by 2030.",
            model:
              "In 1990, coffee consumption in Country X was low, at roughly 2 kilograms per person. It then rose steadily throughout the 1990s, reaching 5 kilograms by 2000. Consumption fell slightly between 2005 and 2010, but it has risen every year since, and it now stands at about 8 kilograms per person. Looking ahead, the figure is projected to reach 10 kilograms by 2030.",
          },
        ],

        answerKey: {
          "2.1": [
            { q: 1, answer: "opened", why: "Finished year (2008), past simple." },
            { q: 2, answer: "has invested", why: "\u201Csince 2015\u201D reaches to now, present perfect." },
            { q: 3, answer: "is rising", why: "\u201Cat the moment\u201D, present continuous.", bn: "at the moment মানে এখন চলছে।" },
            { q: 4, answer: "freezes", why: "General scientific truth, present simple." },
            { q: 5, answer: "had already changed", why: "Action completed before another past event, past perfect." },
            { q: 6, answer: "know", why: "know is stative and stays simple present.", bn: "stative verb, continuous হয় না।" },
            { q: 7, answer: "have been increasing / have increased", why: "\u201Cfor the last ten years\u201D reaches to now; present perfect continuous stresses duration." },
            { q: 8, answer: "will double", why: "A real future prediction with \u201Cwill\u201D." },
            { q: 9, answer: "rose", why: "\u201Clast summer\u201D is finished time, past simple." },
            { q: 10, answer: "are working", why: "\u201Cnowadays\u201D plus a current trend, present continuous." },
            { q: 11, answer: "closed", why: "A finished event (1998), past simple." },
            { q: 12, answer: "has transformed", why: "\u201Cover the past decade\u201D reaches to now, present perfect." },
            { q: 13, answer: "has", why: "Possession is stative; \u201Cis having\u201D would be wrong.", bn: "মালিকানা বোঝাতে have, continuous নয়।" },
            { q: 14, answer: "fell", why: "A finished past range (2000 to 2010), past simple." },
            { q: 15, answer: "is considering", why: "\u201Ccurrently\u201D, present continuous." },
            { q: 16, answer: "understands", why: "understand is stative, present simple.", bn: "stative verb।" },
            { q: 17, answer: "will be", why: "A future prediction for a future point, future simple." },
            { q: 18, answer: "dropped", why: "Tied to a finished year (2012), past simple." },
            { q: 19, answer: "have grown", why: "\u201Cso far this year\u201D reaches to now, present perfect." },
            { q: 20, answer: "spend", why: "A repeated general truth (\u201Cevery year\u201D), present simple." },
          ],
          "2.2": {
            corrected:
              "In 1990, coffee consumption in Country X was low, at roughly 2 kilograms per person. It then rose steadily throughout the 1990s, reaching 5 kilograms by 2000. Consumption fell slightly between 2005 and 2010, but it has risen every year since, and it now stands at about 8 kilograms per person. Looking ahead, the figure is projected to reach 10 kilograms by 2030.",
            bn: "এই অনুচ্ছেদে তিনটি সময় আলাদা tense-এ: শেষ হওয়া data past simple, ২০১০ থেকে এখন পর্যন্ত পরিবর্তন present perfect, ভবিষ্যতের পূর্বাভাস future form (\u201Cis projected to\u201D)। একই অনুচ্ছেদে সময় বদলালে tense-ও বদলাবে, এটাই Task 1-এর মূল দক্ষতা।",
          },
        },
      },
    },
  });

  console.log("\u2705 Chapter 2 seeded successfully");
}

// ============================================================
// CHAPTER 3 · Articles (A, An, The) & Noun Types
// ============================================================

async function seedChapter3() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Chapter 3 · Articles (A, An, The) & Noun Types",
      titleBn: "অধ্যায় ৩ · Articles (A, An, The) ও Noun-এর প্রকার",
      position: 3,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Module 1 · The Foundational Zero-to-Hero Grammar Engine",
        intro:
          "If you fix only one chapter in this whole book, fix this one. Articles are the single highest-error area for learners whose first language does not have them, and Bangla lacks a direct equivalent of a / an / the. Article errors are the number one reason that otherwise strong Band 7 candidates stay stuck at Band 6.0, because the mistakes are frequent, they appear in almost every sentence, and your ear cannot catch them.",
        introBn:
          "অধ্যায় ৩-এর মূল কথা: article-ই সবচেয়ে বেশি ভুল হওয়া বিষয়, কারণ বাংলায় a / an / the-এর সরাসরি কোনো রূপ নেই। এই ভুলগুলোই ব্যান্ড ৬-এ আটকে রাখে। কান দিয়ে ধরা যায় না, তাই নিয়ম বুঝে সচেতনভাবে বসাতে হয়।",

        sections: [
          {
            code: "3.1",
            title: "First, countable versus uncountable nouns",
            titleBn: "গণনাযোগ্য বনাম অগণনাযোগ্য noun",
            content: {
              points: [
                {
                  term: "Countable nouns",
                  en: "Can be counted and have a plural form: one book, two books; a student, five students. They can take a / an in the singular.",
                  bn: "গোনা যায়, plural হয়, singular-এ a/an বসে।",
                },
                {
                  term: "Uncountable nouns",
                  en: "Treated as a single mass, no plural form and no a / an: information (never informations), water, advice.",
                  bn: "গোনা যায় না, plural নেই, a/an বসে না।",
                },
              ],
              coreFact:
                "High-frequency uncountable nouns to memorise as a block: information, advice, knowledge, research, equipment, furniture, accommodation, traffic, progress, news, money, water, work, luggage, baggage, software, staff, homework, feedback. To count them, use a partitive: a piece of advice, an item of furniture, a study.",
              bn: "কিছু noun ইংরেজিতে uncountable যদিও বাংলায় গোনা যায় মনে হয়: information, advice, furniture, equipment, research। এদের plural হয় না এবং a/an বসে না। গুনতে হলে a piece of advice, an item of furniture বলতে হয়।",
            },
          },
          {
            code: "3.2",
            title: "The three articles and the zero article",
            titleBn: "তিনটি article ও zero article",
            cases: [
              {
                title: "a / an (the indefinite article)",
                rule: "For one, non-specific, singular, countable thing, usually first mention. Choice depends on sound: an before a vowel sound, a before a consonant sound.",
                examples: [
                  { right: "I saw a documentary last night. (first mention)" },
                  { right: "She wants to become an engineer. (one, non-specific)" },
                  { right: "a university, an hour, an MBA (sound, not spelling)" },
                ],
              },
              {
                title: "the (the definite article)",
                rule: "When the noun is specific: already mentioned, only one of it (the sun, the government), made specific by surrounding words, or with superlatives and ordinals.",
                examples: [
                  { right: "The chart shows the number of visitors. (both specific)" },
                  { right: "Solar power is the cleanest option available. (superlative)" },
                ],
              },
              {
                title: "the zero article (no article)",
                rule: "For plural countable nouns in general (Cars cause pollution), uncountable nouns in general (Water is essential), and most proper nouns (Bangladesh, Dhaka, English).",
                examples: [
                  { right: "Education is a basic right. (general uncountable)" },
                  { right: "Cars contribute to pollution. (general plural + general uncountable)" },
                ],
              },
            ],
          },
          {
            code: "3.3",
            title: "The decision process (use this when you proofread)",
            titleBn: "সিদ্ধান্তের ধাপ",
            content: {
              coreFact:
                "For any singular noun: (1) Is it countable? If no, choose the (if specific) or zero article (if general), stop. (2) If yes, is it specific/known/unique? If yes, use the. (3) If not specific and singular, use a / an by sound. (4) If a general plural, use the zero article.",
              bn: "proofread করার সময় প্রতিটা singular noun-এ ক্রমে প্রশ্ন করো: (১) গোনা যায় কি না, (২) নির্দিষ্ট → the, (৩) নতুন ও একবচন হলে a/an, (৪) সাধারণ বহুবচন হলে কিছুই না।",
            },
          },
          {
            code: "L3",
            title: "L1 Error Fixer · Why Bangla speakers misuse articles",
            titleBn: "কেন বাংলাভাষীরা article ভুল করে",
            content: {
              coreFact:
                "Because Bangla has no articles at all, the category does not exist in your mental grammar, so it must be learned as an English-only system rather than translated.",
              errorTypes: [
                {
                  type: "Omitting \u201Cthe\u201D for specific and unique things",
                  wrong: ["Internet has changed our lives.", "Government should fund school."],
                  right: ["The internet has changed our lives.", "The government should fund schools."],
                },
                {
                  type: "Using \u201Ca / an\u201D with uncountable nouns",
                  wrong: ["He gave me an advice.", "She did a research on it."],
                  right: ["He gave me some advice / a piece of advice.", "She did research / a study on it."],
                },
                {
                  type: "Dropping the article before a singular countable noun",
                  wrong: ["Government should take step to reduce pollution."],
                  right: ["The government should take steps to reduce pollution."],
                },
              ],
              bn: "বাংলায় article নেই, তাই ইংরেজিতে এটি অনুবাদ নয়, আলাদা সিস্টেম হিসেবে শিখতে হবে। uncountable noun-এর আগে a/an বসে না (an advice ভুল); নির্দিষ্ট জিনিসে the লাগে (the internet, the government)।",
            },
          },
          {
            code: "Impact",
            title: "IELTS Impact · The number one Band 6 ceiling",
            titleBn: "ব্যান্ড ৬-এর প্রধান বাধা",
            content: {
              key: "Article control is audited densely across every task. In Task 1 a single sentence can require three separate article decisions. Consistent article control is one of the clearest Band 6.5-plus signals you can send.",
              examples: [
                "Task 1: The graph illustrates the proportion of households with an internet connection.",
                "Task 2: Education is widely seen as the key to development, and governments should therefore fund schools properly.",
                "Speaking Part 2: The person who influenced me most was a teacher at my primary school.",
              ],
            },
          },
        ],

        exercises: [
          {
            code: "3.1",
            title: "Article Insertion",
            instruction:
              "The articles have been removed. Rewrite each sentence inserting a, an, or the where needed. Some blanks need the zero article (no word); mark those with (0).",
            instructionBn:
              "article তুলে দেওয়া হয়েছে। প্রয়োজনমতো a, an, বা the বসাও। কিছু জায়গায় zero article (0) লাগবে।",
            items: [
              { q: 1, sentence: "___ education is ___ key to ___ economic development.", answer: "(0) Education is the key to (0) economic development.", explanation: "General uncountables take zero article; \u201Cthe key\u201D is specific." },
              { q: 2, sentence: "She is ___ most hard-working student in ___ class.", answer: "She is the most hard-working student in the class.", explanation: "Superlative and a specific class both take \u201Cthe\u201D." },
              { q: 3, sentence: "___ chart shows ___ number of tourists visiting ___ museum.", answer: "The chart shows the number of tourists visiting a museum.", explanation: "\u201Cthe chart,\u201D \u201Cthe number of,\u201D first-mention \u201Ca museum.\u201D" },
              { q: 4, sentence: "___ internet has transformed ___ way people communicate.", answer: "The internet has transformed the way people communicate.", explanation: "\u201Cthe internet\u201D is unique; \u201Cthe way\u201D is specified by the clause." },
              { q: 5, sentence: "He wants to become ___ honest lawyer after ___ university.", answer: "He wants to become an honest lawyer after (0) university.", explanation: "\u201Can\u201D before the vowel sound of \u201Chonest\u201D; \u201Cuniversity\u201D as an institution takes zero article." },
              { q: 6, sentence: "___ pollution is ___ serious problem in ___ major cities.", answer: "(0) Pollution is a serious problem in (0) major cities.", explanation: "General uncountable; \u201Ca problem\u201D first mention; general plural." },
              { q: 7, sentence: "I read ___ interesting article yesterday. ___ article was about ___ climate change.", answer: "I read an interesting article yesterday. The article was about (0) climate change.", explanation: "First mention \u201Can,\u201D second mention \u201Cthe,\u201D general \u201Cclimate change.\u201D" },
              { q: 8, sentence: "___ government should invest more in ___ public transport.", answer: "The government should invest more in (0) public transport.", explanation: "\u201Cthe government\u201D is specific; \u201Cpublic transport\u201D general uncountable." },
              { q: 9, sentence: "___ United States and ___ United Kingdom signed ___ agreement.", answer: "The United States and the United Kingdom signed an agreement.", explanation: "These country names take \u201Cthe\u201D; \u201Can agreement\u201D first mention." },
              { q: 10, sentence: "___ sun rises in ___ east.", answer: "The sun rises in the east.", explanation: "Both unique." },
              { q: 11, sentence: "___ poverty remains ___ obstacle to ___ progress in ___ developing world.", answer: "(0) Poverty remains an obstacle to (0) progress in the developing world.", explanation: "General \u201Cpoverty\u201D and \u201Cprogress\u201D; \u201Can obstacle\u201D first mention; \u201Cthe developing world\u201D specific." },
              { q: 12, sentence: "She gave me ___ useful advice about ___ visa process.", answer: "She gave me (0) useful advice about the visa process.", explanation: "\u201Cadvice\u201D is uncountable (no \u201Ca\u201D); \u201Cthe visa process\u201D is specific." },
              { q: 13, sentence: "___ number of ___ students who fail ___ exam is rising.", answer: "The number of (0) students who fail the exam is rising.", explanation: "\u201Cthe number of,\u201D general \u201Cstudents,\u201D specific \u201Cexam.\u201D" },
              { q: 14, sentence: "My brother is ___ engineer, and he works for ___ large company.", answer: "My brother is an engineer, and he works for a large company.", explanation: "\u201Can engineer\u201D (vowel sound), \u201Ca company\u201D first mention." },
              { q: 15, sentence: "___ water is essential for ___ life on ___ Earth.", answer: "(0) Water is essential for (0) life on (0) Earth.", explanation: "General uncountables and the proper noun \u201CEarth\u201D take zero article." },
              { q: 16, sentence: "We stayed in ___ hotel near ___ airport; ___ hotel was cheap.", answer: "We stayed in a hotel near the airport; the hotel was cheap.", explanation: "First mention \u201Ca hotel,\u201D the known \u201Cthe airport,\u201D second mention \u201Cthe hotel.\u201D" },
              { q: 17, sentence: "___ research shows that ___ exercise improves ___ mental health.", answer: "(0) Research shows that (0) exercise improves (0) mental health.", explanation: "All general/uncountable, zero article." },
              { q: 18, sentence: "___ environment must be protected for ___ future generations.", answer: "The environment must be protected for (0) future generations.", explanation: "\u201Cthe environment\u201D is unique; \u201Cfuture generations\u201D general plural." },
              { q: 19, sentence: "He spent ___ hour reading ___ book about ___ history of ___ Bangladesh.", answer: "He spent an hour reading a book about the history of (0) Bangladesh.", explanation: "\u201Can hour\u201D (silent h), \u201Ca book\u201D first mention, \u201Cthe history of X\u201D specific, proper noun zero." },
              { q: 20, sentence: "___ traffic in ___ capital is ___ major source of ___ air pollution.", answer: "The traffic in the capital is a major source of (0) air pollution.", explanation: "\u201Cthe traffic\u201D specific, \u201Cthe capital\u201D specific, \u201Ca source\u201D first mention, general \u201Cair pollution.\u201D" },
              { q: 21, sentence: "___ knowledge is power, but ___ information alone is not ___ knowledge.", answer: "(0) Knowledge is power, but (0) information alone is not (0) knowledge.", explanation: "All general uncountables." },
              { q: 22, sentence: "She is ___ best doctor in ___ hospital where I work.", answer: "She is the best doctor in the hospital where I work.", explanation: "Superlative and a specified hospital." },
              { q: 23, sentence: "___ children in ___ rural areas often lack access to ___ good schools.", answer: "(0) Children in (0) rural areas often lack access to (0) good schools.", explanation: "General plurals throughout." },
              { q: 24, sentence: "___ economy grew by ___ five per cent in ___ first quarter.", answer: "The economy grew by (0) five per cent in the first quarter.", explanation: "\u201Cthe economy\u201D unique, \u201Cfive per cent\u201D no article, \u201Cthe first quarter\u201D ordinal." },
              { q: 25, sentence: "___ solar power is ___ cleaner alternative to ___ fossil fuels.", answer: "(0) Solar power is a cleaner alternative to (0) fossil fuels.", explanation: "General uncountable, \u201Ca cleaner alternative\u201D first mention, general plural." },
            ],
          },
          {
            code: "3.2",
            title: "Countable versus Uncountable Error Spotting",
            instruction:
              "Each sentence misuses a noun, usually by giving an uncountable noun a plural -s or an a / an. Rewrite each sentence correctly.",
            instructionBn:
              "প্রতিটি বাক্যে noun-এর ভুল ব্যবহার আছে (uncountable-এ plural বা a/an)। সঠিক করে লেখো।",
            items: [
              { q: 1, sentence: "The teacher gave us many useful advices before the exam.", answer: "The teacher gave us much useful advice before the exam.", explanation: "\u201Cadvice\u201D is uncountable: no plural, use \u201Cmuch\u201D not \u201Cmany.\u201D" },
              { q: 2, sentence: "I need some informations about the application process.", answer: "I need some information about the application process.", explanation: "\u201Cinformation\u201D is uncountable." },
              { q: 3, sentence: "She bought new furnitures for her apartment.", answer: "She bought new furniture for her apartment.", explanation: "\u201Cfurniture\u201D has no plural; use \u201Cpieces of furniture\u201D if counting." },
              { q: 4, sentence: "The laboratory does not have enough equipments.", answer: "The laboratory does not have enough equipment.", explanation: "\u201Cequipment\u201D is uncountable." },
              { q: 5, sentence: "He has made a good progress in his studies this year.", answer: "He has made good progress in his studies this year.", explanation: "\u201Cprogress\u201D is uncountable: no \u201Ca.\u201D" },
              { q: 6, sentence: "The researchers published several important researches last year.", answer: "The researchers published several important studies last year.", explanation: "\u201Cresearch\u201D is uncountable; the countable word is \u201Cstudies.\u201D" },
              { q: 7, sentence: "We had a lot of homeworks during the holidays.", answer: "We had a lot of homework during the holidays.", explanation: "\u201Chomework\u201D is uncountable." },
              { q: 8, sentence: "The company installed new softwares on every computer.", answer: "The company installed new software on every computer.", explanation: "\u201Csoftware\u201D is uncountable." },
              { q: 9, sentence: "There were many traffics on the road this morning.", answer: "There was heavy traffic on the road this morning.", explanation: "\u201Ctraffic\u201D is uncountable: no plural, and \u201Cwas,\u201D not \u201Cwere.\u201D" },
              { q: 10, sentence: "The hotel provides free accommodations for its staffs.", answer: "The hotel provides free accommodation for its staff.", explanation: "Both uncountable: no plural." },
              { q: 11, sentence: "My knowledges of physics are quite limited.", answer: "My knowledge of physics is quite limited.", explanation: "\u201Cknowledge\u201D is uncountable and singular." },
              { q: 12, sentence: "The government spent a huge money on the project.", answer: "The government spent a huge amount of money on the project.", explanation: "\u201Cmoney\u201D is uncountable: no \u201Ca\u201D directly." },
              { q: 13, sentence: "She gave me two good news yesterday.", answer: "She gave me two pieces of good news / some good news yesterday.", explanation: "\u201Cnews\u201D is uncountable despite the final -s." },
              { q: 14, sentence: "The students carried heavy luggages to the airport.", answer: "The students carried heavy luggage to the airport.", explanation: "\u201Cluggage\u201D is uncountable; count with \u201Cpieces of luggage.\u201D" },
              { q: 15, sentence: "The report contains many useful datas about the economy.", answer: "The report contains much useful data about the economy.", explanation: "\u201Cdata\u201D is treated as uncountable/mass here; \u201Cdatas\u201D is never correct." },
            ],
          },
        ],

        answerKey: {
          "3.1": [
            { q: 1, answer: "(0) Education is the key to (0) economic development.", why: "General uncountables take zero article; \u201Cthe key\u201D is specific." },
            { q: 2, answer: "She is the most hard-working student in the class.", why: "Superlative and specific class take \u201Cthe.\u201D" },
            { q: 3, answer: "The chart shows the number of tourists visiting a museum.", why: "\u201Cthe chart,\u201D \u201Cthe number of,\u201D first-mention \u201Ca museum.\u201D" },
            { q: 4, answer: "The internet has transformed the way people communicate.", why: "\u201Cthe internet\u201D unique; \u201Cthe way\u201D specified by the clause." },
            { q: 5, answer: "He wants to become an honest lawyer after (0) university.", why: "\u201Can\u201D before vowel sound; \u201Cuniversity\u201D as institution takes zero article.", bn: "honest-এর h উচ্চারিত হয় না, তাই an।" },
            { q: 6, answer: "(0) Pollution is a serious problem in (0) major cities.", why: "General uncountable; \u201Ca problem\u201D first mention; general plural." },
            { q: 7, answer: "I read an interesting article yesterday. The article was about (0) climate change.", why: "First mention \u201Can,\u201D second mention \u201Cthe,\u201D general." },
            { q: 8, answer: "The government should invest more in (0) public transport.", why: "\u201Cthe government\u201D specific; \u201Cpublic transport\u201D general uncountable." },
            { q: 9, answer: "The United States and the United Kingdom signed an agreement.", why: "These names take \u201Cthe\u201D; \u201Can agreement\u201D first mention.", bn: "the United States, the United Kingdom সবসময় the নেয়।" },
            { q: 10, answer: "The sun rises in the east.", why: "Both unique." },
            { q: 11, answer: "(0) Poverty remains an obstacle to (0) progress in the developing world.", why: "General nouns; \u201Can obstacle\u201D first mention; \u201Cthe developing world\u201D specific." },
            { q: 12, answer: "She gave me (0) useful advice about the visa process.", why: "\u201Cadvice\u201D uncountable; \u201Cthe visa process\u201D specific.", bn: "advice uncountable, তাই a বসে না।" },
            { q: 13, answer: "The number of (0) students who fail the exam is rising.", why: "\u201Cthe number of,\u201D general \u201Cstudents,\u201D specific \u201Cexam.\u201D" },
            { q: 14, answer: "My brother is an engineer, and he works for a large company.", why: "\u201Can engineer\u201D (vowel sound), \u201Ca company\u201D first mention." },
            { q: 15, answer: "(0) Water is essential for (0) life on (0) Earth.", why: "General uncountables and proper noun take zero article." },
            { q: 16, answer: "We stayed in a hotel near the airport; the hotel was cheap.", why: "First mention \u201Ca hotel,\u201D known \u201Cthe airport,\u201D second mention \u201Cthe hotel.\u201D" },
            { q: 17, answer: "(0) Research shows that (0) exercise improves (0) mental health.", why: "All general/uncountable, zero article.", bn: "research uncountable।" },
            { q: 18, answer: "The environment must be protected for (0) future generations.", why: "\u201Cthe environment\u201D unique; \u201Cfuture generations\u201D general plural." },
            { q: 19, answer: "He spent an hour reading a book about the history of (0) Bangladesh.", why: "\u201Can hour\u201D (silent h), \u201Ca book,\u201D \u201Cthe history of X,\u201D proper noun zero." },
            { q: 20, answer: "The traffic in the capital is a major source of (0) air pollution.", why: "Specific, specific, first mention, general." },
            { q: 21, answer: "(0) Knowledge is power, but (0) information alone is not (0) knowledge.", why: "All general uncountables." },
            { q: 22, answer: "She is the best doctor in the hospital where I work.", why: "Superlative and specified hospital." },
            { q: 23, answer: "(0) Children in (0) rural areas often lack access to (0) good schools.", why: "General plurals throughout." },
            { q: 24, answer: "The economy grew by (0) five per cent in the first quarter.", why: "\u201Cthe economy\u201D unique, no article on percent, \u201Cthe first quarter\u201D ordinal." },
            { q: 25, answer: "(0) Solar power is a cleaner alternative to (0) fossil fuels.", why: "General uncountable, first mention, general plural." },
          ],
          "3.2": [
            { q: 1, answer: "The teacher gave us much useful advice before the exam.", why: "\u201Cadvice\u201D uncountable: no plural, use \u201Cmuch.\u201D", bn: "advice এর plural হয় না।" },
            { q: 2, answer: "I need some information about the application process.", why: "\u201Cinformation\u201D is uncountable." },
            { q: 3, answer: "She bought new furniture for her apartment.", why: "\u201Cfurniture\u201D has no plural." },
            { q: 4, answer: "The laboratory does not have enough equipment.", why: "\u201Cequipment\u201D is uncountable." },
            { q: 5, answer: "He has made good progress in his studies this year.", why: "\u201Cprogress\u201D is uncountable: no \u201Ca.\u201D" },
            { q: 6, answer: "The researchers published several important studies last year.", why: "\u201Cresearch\u201D uncountable; countable is \u201Cstudies.\u201D", bn: "research uncountable, গুনতে হলে studies।" },
            { q: 7, answer: "We had a lot of homework during the holidays.", why: "\u201Chomework\u201D is uncountable." },
            { q: 8, answer: "The company installed new software on every computer.", why: "\u201Csoftware\u201D is uncountable." },
            { q: 9, answer: "There was heavy traffic on the road this morning.", why: "\u201Ctraffic\u201D uncountable: no plural, \u201Cwas.\u201D" },
            { q: 10, answer: "The hotel provides free accommodation for its staff.", why: "Both uncountable: no plural." },
            { q: 11, answer: "My knowledge of physics is quite limited.", why: "\u201Cknowledge\u201D uncountable and singular." },
            { q: 12, answer: "The government spent a huge amount of money on the project.", why: "\u201Cmoney\u201D uncountable: no \u201Ca\u201D directly." },
            { q: 13, answer: "She gave me two pieces of good news / some good news yesterday.", why: "\u201Cnews\u201D uncountable despite final -s.", bn: "news শেষে -s থাকলেও uncountable।" },
            { q: 14, answer: "The students carried heavy luggage to the airport.", why: "\u201Cluggage\u201D uncountable; count with \u201Cpieces of luggage.\u201D" },
            { q: 15, answer: "The report contains much useful data about the economy.", why: "\u201Cdata\u201D treated as uncountable/mass; \u201Cdatas\u201D never correct." },
          ],
        },
      },
    },
  });

  console.log("\u2705 Chapter 3 seeded successfully");
}

// ============================================================
// CHAPTER 4 · Prepositions & Dependency Rules
// ============================================================

async function seedChapter4() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Chapter 4 · Prepositions & Dependency Rules",
      titleBn: "অধ্যায় ৪ · Prepositions ও Dependency নিয়ম",
      position: 4,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Module 1 · The Foundational Zero-to-Hero Grammar Engine",
        intro:
          "Prepositions are the small words (in, on, at, by, for, to, of, from, with) that show how other words relate in time, place, and direction. They carry a large share of errors, because prepositions are memorised by pattern, not by logic. There is no rule that explains why English says interested in but good at and afraid of. These are fixed collocations.",
        introBn:
          "অধ্যায় ৪-এর মূল কথা: preposition যুক্তি দিয়ে নয়, প্যাটার্ন মুখস্থ করে শিখতে হয়। বাংলা থেকে সরাসরি অনুবাদ করলে ভুল হয় (যেমন \u201Cdiscuss about\u201D, \u201Caccording to me\u201D)। এই অধ্যায় সেই fixed collocation আর অনুবাদজনিত ভুলগুলো ঠিক করে।",

        sections: [
          {
            code: "4.2",
            title: "Prepositions of time · in, on, at",
            titleBn: "সময়ের preposition",
            content: {
              points: [
                { term: "in", en: "months, years, seasons, centuries, long periods: in July, in 2020, in winter, in the 1990s.", bn: "মাস, বছর, ঋতু, দীর্ঘ সময়।" },
                { term: "on", en: "days and dates: on Monday, on 5 May, on weekdays.", bn: "দিন ও তারিখ।" },
                { term: "at", en: "clock times and fixed points: at 5 p.m., at night, at the weekend, at the start.", bn: "নির্দিষ্ট সময় ও বিন্দু।" },
                { term: "since / for / by", en: "since + a starting point; for + a length of time; by + a deadline.", bn: "since = শুরুর বিন্দু; for = সময়ের দৈর্ঘ্য; by = সময়সীমা।" },
              ],
            },
          },
          {
            code: "4.3",
            title: "Prepositions of place and direction",
            titleBn: "স্থান ও দিকের preposition",
            content: {
              points: [
                { term: "in", en: "inside a space or area: in the room, in Dhaka, in the world.", bn: "কোনো স্থান বা এলাকার ভিতরে।" },
                { term: "on", en: "on a surface or line: on the wall, on the coast, on the second floor.", bn: "পৃষ্ঠ বা লাইনের উপর।" },
                { term: "at", en: "at a specific point or place: at the station, at the top, at home.", bn: "নির্দিষ্ট বিন্দু বা স্থানে।" },
                { term: "into / onto / to", en: "show movement or direction: walk into the room, climb onto the roof, go to work.", bn: "গতি বা দিক নির্দেশ করে।" },
              ],
              example: "The figures are shown in the chart, on the vertical axis, at the top of the page.",
              bn: "in = ভিতরে, on = উপরে, at = নির্দিষ্ট স্থানে, into/onto/to = গতি।",
            },
          },
          {
            code: "4.4",
            title: "The Task 1 data prepositions (memorise as fixed phrases)",
            titleBn: "Task 1-এর data preposition",
            cases: [
              {
                title: "Fixed data-movement phrases",
                rule: "increase/rise by (the size of a change); from X to Y (start and end); a rise/increase of; reach a peak / stand at (a value); fall/drop to (destination); between X and Y (range or span).",
                examples: [
                  {
                    wrong: "Sales increased with 20 per cent and reached to a peak in June.",
                    right: "Sales increased by 20 per cent and reached a peak in June.",
                    why: "\u201Cincrease by\u201D a percentage; \u201Creach a peak\u201D takes no preposition.",
                  },
                  { right: "The price rose by five dollars, from 20 to 25, reaching a peak of 25 in March." },
                ],
              },
            ],
          },
          {
            code: "4.5",
            title: "Dependent prepositions",
            titleBn: "নির্ভরশীল preposition",
            content: {
              coreFact:
                "Verbs: depend on, lead to, result in, result from, contribute to, consist of, deal with, focus on, rely on, suffer from, benefit from, apply for, participate in, invest in, cope with. Adjectives: responsible for, interested in, aware of, capable of, similar to, different from, good/bad at, dependent on, related to, suitable for. Nouns: an increase in, a reason for, a solution to, an effect/impact on, a demand for, a lack of, the cause of.",
              bn: "এই collocation-গুলো যুক্তি নয়, মুখস্থ। block আকারে শেখো: depend on, lead to, result in, responsible for, interested in, increase in, solution to। ব্যবহার করতে করতে স্বয়ংক্রিয় হয়ে যাবে।",
            },
          },
          {
            code: "L4",
            title: "L1 Error Fixer · Direct-translation preposition errors",
            titleBn: "অনুবাদজনিত ভুল",
            cases: [
              {
                title: "Common direct-translation errors",
                rule: "These come from translating a Bangla structure word for word and are instantly recognisable to an examiner.",
                examples: [
                  { wrong: "discuss about the topic", right: "discuss the topic", why: "discuss takes a direct object, no preposition." },
                  { wrong: "enter into the room", right: "enter the room", why: "enter takes a direct object." },
                  { wrong: "according to me", right: "in my opinion", why: "according to is for other sources, never yourself." },
                  { wrong: "reach to the destination", right: "reach the destination", why: "reach takes no preposition." },
                  { wrong: "emphasise on the point", right: "emphasise the point / place emphasis on", why: "emphasise takes a direct object." },
                  { wrong: "marry with her", right: "marry her", why: "marry takes a direct object." },
                  { wrong: "comprise of three parts", right: "comprise three parts / be composed of", why: "comprise takes no of." },
                  { wrong: "return back home", right: "return home", why: "return already means \u201Cgo back.\u201D" },
                  { wrong: "cope up with", right: "cope with", why: "no \u201Cup.\u201D" },
                ],
              },
            ],
            content: {
              bn: "এই ভুলগুলো সরাসরি বাংলা অনুবাদ থেকে আসে। \u201Cনিয়ে আলোচনা\u201D → discuss about (ভুল), সঠিক discuss। \u201Cআমার মতে\u201D → according to me (ভুল), সঠিক in my opinion। \u201Cফিরে আসা\u201D → return back (ভুল), সঠিক return।",
            },
          },
          {
            code: "Impact",
            title: "IELTS Impact · Small words, real marks",
            titleBn: "ছোট শব্দ, আসল নম্বর",
            content: {
              key: "In Task 1, the data prepositions (by, from, to, of, at) stand out immediately if wrong. In Task 2 and Speaking, the dependent prepositions and direct-translation errors separate controlled from uncontrolled English. Correct collocations also lift Lexical Resource, so the payoff is double.",
              examples: [
                "Task 1: Unemployment rose by four points, from six to ten per cent, before falling to eight in 2015.",
                "Task 2: A lack of investment in public transport contributes to congestion and leads to higher emissions.",
                "Speaking Part 3: It really depends on the situation, but on balance I think education is the solution to most of these problems.",
              ],
            },
          },
        ],

        exercises: [
          {
            code: "4.1",
            title: "Preposition Fill-in",
            instruction:
              "Fill each gap with the correct preposition. Some gaps take no preposition; write (0) for those.",
            instructionBn:
              "প্রতিটি ফাঁকে সঠিক preposition বসাও। কিছু ফাঁকে কোনো preposition বসবে না; সেক্ষেত্রে (0) লেখো।",
            items: [
              { q: 1, sentence: "The number of tourists rose ______ 20 per cent last year.", answer: "by", explanation: "The size of a change." },
              { q: 2, sentence: "The figure grew ______ 5 million ______ 8 million ______ 2015.", answer: "from / to / in", explanation: "Start, end, and the year." },
              { q: 3, sentence: "Air pollution largely results ______ vehicle emissions.", answer: "from", explanation: "\u201Cresult from\u201D a cause." },
              { q: 4, sentence: "The government should invest more ______ renewable energy.", answer: "in", explanation: "\u201Cinvest in.\u201D" },
              { q: 5, sentence: "She is very interested ______ studying abroad.", answer: "in", explanation: "\u201Cinterested in\u201D (+ -ing)." },
              { q: 6, sentence: "Rapid urbanisation has led ______ a housing shortage.", answer: "to", explanation: "\u201Clead to.\u201D" },
              { q: 7, sentence: "Unemployment peaked ______ 12 per cent ______ 2009.", answer: "at / in", explanation: "Peak \u201Cat\u201D a value, \u201Cin\u201D a year." },
              { q: 8, sentence: "The success of the plan depends ______ adequate funding.", answer: "on", explanation: "\u201Cdepend on.\u201D" },
              { q: 9, sentence: "Many students suffer ______ a lack ______ confidence.", answer: "from / of", explanation: "\u201Csuffer from\u201D a \u201Clack of.\u201D" },
              { q: 10, sentence: "He is responsible ______ managing the entire department.", answer: "for", explanation: "\u201Cresponsible for\u201D (+ -ing)." },
              { q: 11, sentence: "This problem is closely related ______ poverty.", answer: "to", explanation: "\u201Crelated to.\u201D" },
              { q: 12, sentence: "We must discuss ______ the main causes of the issue.", answer: "(0)", explanation: "\u201Cdiscuss\u201D takes a direct object, no preposition." },
              { q: 13, sentence: "There has been a sharp increase ______ demand ______ housing.", answer: "in / for", explanation: "An \u201Cincrease in,\u201D a \u201Cdemand for.\u201D" },
              { q: 14, sentence: "The committee consists ______ seven members.", answer: "of", explanation: "\u201Cconsist of.\u201D" },
              { q: 15, sentence: "The shop is closed ______ Fridays but open ______ the weekend.", answer: "on / at", explanation: "\u201Con Fridays,\u201D \u201Cat the weekend.\u201D" },
              { q: 16, sentence: "Consumption fell ______ a low ______ five units in 2012.", answer: "to / of", explanation: "\u201Cfell to a low of.\u201D" },
              { q: 17, sentence: "Cities in the region rely heavily ______ agriculture.", answer: "on", explanation: "\u201Crely on.\u201D" },
              { q: 18, sentence: "The report focuses ______ the effects ______ climate change.", answer: "on / of", explanation: "\u201Cfocus on,\u201D \u201Ceffects of.\u201D" },
              { q: 19, sentence: "Please enter ______ the hall quietly.", answer: "(0)", explanation: "\u201Center\u201D takes a direct object." },
              { q: 20, sentence: "The two graphs are similar ______ each other.", answer: "to", explanation: "\u201Csimilar to.\u201D" },
              { q: 21, sentence: "Students benefit greatly ______ regular feedback.", answer: "from", explanation: "\u201Cbenefit from.\u201D" },
              { q: 22, sentence: "She applied ______ a scholarship ______ a British university.", answer: "for / to", explanation: "\u201Capply for\u201D a scholarship, \u201Cto\u201D an institution." },
              { q: 23, sentence: "A good education is the solution ______ many social problems.", answer: "to", explanation: "\u201Csolution to.\u201D" },
              { q: 24, sentence: "The population has been rising steadily ______ 2000.", answer: "since", explanation: "\u201Csince 2000\u201D (a starting point, with present perfect)." },
              { q: 25, sentence: "According ______ the chart, spending increased sharply.", answer: "to", explanation: "\u201Caccording to the chart\u201D (a source, correct here)." },
            ],
          },
          {
            code: "4.2",
            title: "L1 Direct-Translation Fix",
            instruction:
              "Each sentence contains a preposition error caused by direct translation from Bangla. Rewrite each one correctly.",
            instructionBn:
              "প্রতিটি বাক্যে বাংলা থেকে সরাসরি অনুবাদজনিত preposition ভুল আছে। সঠিক করে লেখো।",
            items: [
              { q: 1, sentence: "According to me, the government should act quickly.", answer: "In my opinion, the government should act quickly.", explanation: "\u201Caccording to me\u201D is wrong for your own view." },
              { q: 2, sentence: "We discussed about the new policy for an hour.", answer: "We discussed the new policy for an hour.", explanation: "\u201Cdiscuss\u201D needs no \u201Cabout.\u201D" },
              { q: 3, sentence: "He entered into the classroom without knocking.", answer: "He entered the classroom without knocking.", explanation: "\u201Center\u201D needs no \u201Cinto.\u201D" },
              { q: 4, sentence: "The teacher emphasised on the importance of grammar.", answer: "The teacher emphasised the importance of grammar.", explanation: "\u201Cemphasise\u201D takes a direct object." },
              { q: 5, sentence: "After the trip, they returned back to their village.", answer: "After the trip, they returned to their village.", explanation: "\u201Creturn\u201D already means \u201Cgo back.\u201D" },
              { q: 6, sentence: "The report comprises of five main sections.", answer: "The report comprises five main sections.", explanation: "\u201Ccomprise\u201D takes no \u201Cof.\u201D" },
              { q: 7, sentence: "She married with a doctor last year.", answer: "She married a doctor last year.", explanation: "\u201Cmarry\u201D takes a direct object." },
              { q: 8, sentence: "I want to request to you for some help.", answer: "I want to ask you for some help / make a request to you for some help.", explanation: "\u201Crequest to you\u201D is wrong." },
              { q: 9, sentence: "The essay mentioned about three possible solutions.", answer: "The essay mentioned three possible solutions.", explanation: "\u201Cmention\u201D needs no \u201Cabout.\u201D" },
              { q: 10, sentence: "The researchers investigated about the causes of pollution.", answer: "The researchers investigated the causes of pollution.", explanation: "\u201Cinvestigate\u201D takes a direct object." },
              { q: 11, sentence: "We must cope up with the rising cost of living.", answer: "We must cope with the rising cost of living.", explanation: "No \u201Cup.\u201D" },
              { q: 12, sentence: "The minister reached to the venue an hour late.", answer: "The minister reached the venue an hour late.", explanation: "\u201Creach\u201D takes no \u201Cto.\u201D" },
              { q: 13, sentence: "My opinion is different than yours on this matter.", answer: "My opinion is different from yours on this matter.", explanation: "\u201Cdifferent from\u201D is the standard academic form." },
              { q: 14, sentence: "Students should concentrate in their studies.", answer: "Students should concentrate on their studies.", explanation: "\u201Cconcentrate on,\u201D not \u201Cin.\u201D" },
              { q: 15, sentence: "The country is suffering with severe traffic congestion.", answer: "The country is suffering from severe traffic congestion.", explanation: "\u201Csuffer from.\u201D" },
            ],
          },
        ],

        answerKey: {
          "4.1": [
            { q: 1, answer: "by", why: "The size of a change.", bn: "বাংলা \u201Cদিয়ে\u201D থেকে অনেকে with লেখে, যা ভুল।" },
            { q: 2, answer: "from / to / in", why: "Start, end, and the year." },
            { q: 3, answer: "from", why: "\u201Cresult from\u201D a cause." },
            { q: 4, answer: "in", why: "\u201Cinvest in.\u201D" },
            { q: 5, answer: "in", why: "\u201Cinterested in\u201D (+ -ing \u201Cstudying\u201D)." },
            { q: 6, answer: "to", why: "\u201Clead to.\u201D" },
            { q: 7, answer: "at / in", why: "Peak \u201Cat\u201D a value, \u201Cin\u201D a year." },
            { q: 8, answer: "on", why: "\u201Cdepend on.\u201D" },
            { q: 9, answer: "from / of", why: "\u201Csuffer from\u201D a \u201Clack of.\u201D" },
            { q: 10, answer: "for", why: "\u201Cresponsible for\u201D (+ -ing \u201Cmanaging\u201D)." },
            { q: 11, answer: "to", why: "\u201Crelated to.\u201D" },
            { q: 12, answer: "(0)", why: "\u201Cdiscuss\u201D takes a direct object.", bn: "discuss about ভুল।" },
            { q: 13, answer: "in / for", why: "An \u201Cincrease in,\u201D a \u201Cdemand for.\u201D" },
            { q: 14, answer: "of", why: "\u201Cconsist of.\u201D" },
            { q: 15, answer: "on / at", why: "\u201Con Fridays,\u201D \u201Cat the weekend.\u201D" },
            { q: 16, answer: "to / of", why: "\u201Cfell to a low of.\u201D" },
            { q: 17, answer: "on", why: "\u201Crely on.\u201D" },
            { q: 18, answer: "on / of", why: "\u201Cfocus on,\u201D \u201Ceffects of.\u201D" },
            { q: 19, answer: "(0)", why: "\u201Center\u201D takes a direct object.", bn: "enter into ভুল।" },
            { q: 20, answer: "to", why: "\u201Csimilar to.\u201D" },
            { q: 21, answer: "from", why: "\u201Cbenefit from.\u201D" },
            { q: 22, answer: "for / to", why: "\u201Capply for\u201D a scholarship, \u201Cto\u201D an institution." },
            { q: 23, answer: "to", why: "\u201Csolution to.\u201D" },
            { q: 24, answer: "since", why: "\u201Csince 2000\u201D with the present perfect." },
            { q: 25, answer: "to", why: "\u201Caccording to the chart\u201D (a source, correct here)." },
          ],
          "4.2": [
            { q: 1, answer: "In my opinion, the government should act quickly.", why: "\u201Caccording to me\u201D is wrong for your own view.", bn: "\u201Cআমার মতে\u201D = in my opinion।" },
            { q: 2, answer: "We discussed the new policy for an hour.", why: "\u201Cdiscuss\u201D needs no \u201Cabout.\u201D" },
            { q: 3, answer: "He entered the classroom without knocking.", why: "\u201Center\u201D needs no \u201Cinto.\u201D" },
            { q: 4, answer: "The teacher emphasised the importance of grammar.", why: "\u201Cemphasise\u201D takes a direct object.", bn: "emphasise on ভুল।" },
            { q: 5, answer: "After the trip, they returned to their village.", why: "\u201Creturn\u201D already means \u201Cgo back.\u201D" },
            { q: 6, answer: "The report comprises five main sections.", why: "\u201Ccomprise\u201D takes no \u201Cof.\u201D" },
            { q: 7, answer: "She married a doctor last year.", why: "\u201Cmarry\u201D takes a direct object." },
            { q: 8, answer: "I want to ask you for some help.", why: "\u201Crequest to you\u201D is wrong." },
            { q: 9, answer: "The essay mentioned three possible solutions.", why: "\u201Cmention\u201D needs no \u201Cabout.\u201D" },
            { q: 10, answer: "The researchers investigated the causes of pollution.", why: "\u201Cinvestigate\u201D takes a direct object." },
            { q: 11, answer: "We must cope with the rising cost of living.", why: "No \u201Cup.\u201D", bn: "cope up with ভুল, সঠিক cope with।" },
            { q: 12, answer: "The minister reached the venue an hour late.", why: "\u201Creach\u201D takes no \u201Cto.\u201D" },
            { q: 13, answer: "My opinion is different from yours on this matter.", why: "\u201Cdifferent from\u201D is standard academic form." },
            { q: 14, answer: "Students should concentrate on their studies.", why: "\u201Cconcentrate on,\u201D not \u201Cin.\u201D" },
            { q: 15, answer: "The country is suffering from severe traffic congestion.", why: "\u201Csuffer from.\u201D" },
          ],
        },
      },
    },
  });

  console.log("\u2705 Chapter 4 seeded successfully");
}

// ============================================================
// CHAPTER 5 · Complex Sentences & Subordinate Clauses
// ============================================================

async function seedChapter5() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Chapter 5 · Complex Sentences & Subordinate Clauses",
      titleBn: "অধ্যায় ৫ · Complex Sentence ও Subordinate Clause",
      position: 5,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Module 2 · Band 7.0+ Complex Structures & Range Booster",
        intro:
          "The complex sentence is the single most important structure for reaching Band 7, because it is the clearest signal of range. It lets you show a logical relationship between two ideas (contrast, reason, condition, time) inside one controlled sentence, instead of two short disconnected ones.",
        introBn:
          "অধ্যায় ৫-এর মূল কথা: complex sentence-ই ব্যান্ড ৭-এ পৌঁছার সবচেয়ে গুরুত্বপূর্ণ কাঠামো, কারণ এটি range দেখায় এবং দুটি ধারণার মধ্যে যুক্তিসংগত সম্পর্ক (বৈপরীত্য, কারণ, শর্ত, সময়) একটি বাক্যে বাঁধে।",

        sections: [
          {
            code: "5.1",
            title: "Clause basics (start here)",
            titleBn: "clause-এর মূল",
            content: {
              points: [
                { term: "Independent clause", en: "Expresses a complete thought and can stand alone: \u201CCities offer jobs.\u201D", bn: "সম্পূর্ণ অর্থ দেয়, একা দাঁড়াতে পারে।" },
                { term: "Dependent (subordinate) clause", en: "Has a subject and a verb but cannot stand alone because a subordinating word leaves it unfinished: \u201CAlthough cities offer jobs \u2026\u201D", bn: "একা দাঁড়াতে পারে না, subordinating শব্দ থাকে।" },
              ],
              key: "A complex sentence joins one independent clause with at least one dependent clause: Although cities offer jobs, they are crowded.",
              bn: "complex sentence = একটি independent + অন্তত একটি dependent clause।",
            },
          },
          {
            code: "5.2",
            title: "The three sentence types, and why complex wins marks",
            titleBn: "তিন ধরনের sentence এবং complex কেন নম্বর আনে",
            content: {
              points: [
                { term: "Simple", en: "one independent clause. Example: Cities offer jobs.", bn: "একটি independent clause।" },
                { term: "Compound", en: "two independent clauses + FANBOYS. Example: Cities offer jobs, but they are crowded.", bn: "দুইটি independent clause + FANBOYS।" },
                { term: "Complex", en: "independent + dependent clause. Example: Although cities offer jobs, they are crowded.", bn: "independent + dependent clause।" },
              ],
              key: "A Band 5 script is mostly simple sentences. A Band 6 script mixes simple and compound. A Band 7 script controls complex sentences and uses a variety of them. That is the jump this chapter delivers.",
              bn: "Band 5 = বেশিরভাগ simple। Band 6 = simple + compound। Band 7 = complex নিয়ন্ত্রণ করতে পারে। এই অধ্যায় সেই লাফ দেয়।",
            },
          },
          {
            code: "5.3",
            title: "Adverbial (subordinate) clauses",
            titleBn: "adverbial clause",
            content: {
              coreFact:
                "Subordinators by relationship: Contrast (although, even though, whereas, while); Reason (because, since, as); Condition (if, unless, provided that, as long as); Time (when, after, before, once, while); Purpose (so that, in order that, in order to); Result (so \u2026 that, such \u2026 that).",
              key: "The comma rule: if the dependent clause comes first, put a comma after it. If it comes second, usually no comma. \u201CAlthough it is costly, it works.\u201D vs \u201CIt works although it is costly.\u201D",
              bn: "dependent clause আগে বসলে পরে কমা দাও; পরে বসলে সাধারণত কমা লাগে না।",
            },
          },
          {
            code: "5.4",
            title: "Relative clauses",
            titleBn: "relative clause",
            cases: [
              {
                title: "Relative pronouns",
                rule: "who (people), which (things), that (people or things, defining only), where (places), whose (possession).",
                examples: [
                  { right: "Students who study abroad gain independence." },
                  { right: "Solar power, which is clean, is expanding." },
                ],
              },
              {
                title: "Defining versus non-defining: the comma changes the meaning",
                rule: "A defining clause identifies which one and takes no commas. A non-defining clause adds extra information and is fenced with commas. Use that only in defining clauses. Do not repeat the subject with a pronoun.",
                examples: [
                  { wrong: "My school, that is very old, is famous.", right: "My school, which is very old, is famous.", why: "Non-defining uses which, not that." },
                  { wrong: "People which live in cities they pay more rent.", right: "People who live in cities pay more rent.", why: "who for people; no repeated subject \u201Cthey.\u201D" },
                ],
              },
            ],
            content: {
              bn: "কমা থাকলে অতিরিক্ত তথ্য (non-defining), কমা না থাকলে কোনটি নির্দিষ্ট করে (defining)। that শুধু defining-এ; non-defining-এ which/who। relative clause-এর পরে আবার they/it দিয়ে subject পুনরাবৃত্তি করবে না।",
            },
          },
          {
            code: "L5",
            title: "L1 Error Fixer · Fragments, run-ons, and comma splices",
            titleBn: "fragment, run-on, comma splice",
            content: {
              coreFact:
                "Three punctuation faults appear when learners attempt complex sentences. The four legal ways to join two independent clauses: a full stop, a semicolon, a comma plus a coordinating conjunction (FANBOYS), or turning one clause into a dependent clause. A lone comma is never one of them.",
              errorTypes: [
                {
                  type: "The fragment (a dependent clause left alone)",
                  wrong: ["Because the weather was bad. The event was cancelled."],
                  right: ["Because the weather was bad, the event was cancelled."],
                },
                {
                  type: "The run-on (two clauses with no join)",
                  wrong: ["I studied hard I failed the exam."],
                  right: ["I studied hard, but I failed the exam."],
                },
                {
                  type: "The comma splice (two clauses joined by only a comma)",
                  wrong: ["Internet use rose rapidly, people spent more time online."],
                  right: ["Internet use rose rapidly, so people spent more time online."],
                },
              ],
              bn: "তিনটি ভুল: (১) fragment: dependent clause একা বসানো; (২) run-on: দুই clause কোনো যোগ ছাড়াই; (৩) comma splice: শুধু কমা দিয়ে দুই clause জোড়া। দুই independent clause জোড়ার বৈধ উপায়: full stop, semicolon, comma + FANBOYS, অথবা একটিকে dependent বানানো।",
            },
          },
          {
            code: "Impact",
            title: "IELTS Impact · The Band 7 range requirement",
            titleBn: "ব্যান্ড ৭-এর range চাহিদা",
            content: {
              key: "The Band 7 descriptor asks for \u201Ca variety of complex structures.\u201D An essay that uses only because clauses does not show range. Aim to deploy a spread: a contrast clause, a reason clause, a conditional, and a relative clause.",
              examples: [
                "Task 2: While online learning widens access, it cannot fully replace the discipline that a classroom provides.",
                "Task 2: Because demand continues to rise, prices will keep climbing unless supply increases.",
                "Speaking Part 3: People who grow up in cities often value convenience, whereas those from rural areas tend to prioritise community.",
              ],
            },
          },
        ],

        exercises: [
          {
            code: "5.1",
            title: "Sentence Combining",
            instruction:
              "Combine each pair of simple sentences into one complex sentence, using the relationship in brackets and either a relative clause or an adverbial clause. There is more than one good answer.",
            instructionBn:
              "প্রতিটি জোড়া বাক্যকে একটি complex sentence-এ যুক্ত করো, বন্ধনীর সম্পর্ক অনুযায়ী। একাধিক সঠিক উত্তর সম্ভব।",
            items: [
              { q: 1, sentence: "Public transport is cheap. Many people still drive. (contrast)", answer: "Although public transport is cheap, many people still drive.", explanation: "Contrast with \u201Calthough\u201D + comma." },
              { q: 2, sentence: "The lake dried up. Rainfall had declined for years. (reason)", answer: "The lake dried up because rainfall had declined for years.", explanation: "Reason clause second, no comma." },
              { q: 3, sentence: "The company hired a manager. She had ten years of experience. (relative)", answer: "The company hired a manager who had ten years of experience.", explanation: "\u201Cwho\u201D for a person." },
              { q: 4, sentence: "Governments invest in education. Their economies tend to grow faster. (relative / condition)", answer: "Governments that invest in education tend to see their economies grow faster.", explanation: "Defining relative clause." },
              { q: 5, sentence: "Fees rose sharply. Enrolment dropped. (time)", answer: "Once fees rose sharply, enrolment dropped.", explanation: "Time clause with \u201Conce.\u201D" },
              { q: 6, sentence: "The city built new cycle lanes. It wanted to cut congestion. (purpose)", answer: "The city built new cycle lanes in order to cut congestion.", explanation: "Purpose with \u201Cin order to.\u201D" },
              { q: 7, sentence: "Renewable energy is expensive at first. It becomes cheaper over time. (contrast)", answer: "Although renewable energy is expensive at first, it becomes cheaper over time.", explanation: "Contrast clause." },
              { q: 8, sentence: "The report was published last year. It highlighted the housing crisis. (relative, non-defining)", answer: "The report, which was published last year, highlighted the housing crisis.", explanation: "Non-defining: commas." },
              { q: 9, sentence: "Action is not taken soon. The situation will worsen. (condition)", answer: "Unless action is taken soon, the situation will worsen.", explanation: "Condition with \u201Cunless.\u201D" },
              { q: 10, sentence: "Many families live in rural areas. They lack access to good hospitals. (relative)", answer: "Many families who live in rural areas lack access to good hospitals.", explanation: "Defining relative clause." },
              { q: 11, sentence: "The policy was popular. It was eventually withdrawn. (contrast)", answer: "Although the policy was popular, it was eventually withdrawn.", explanation: "Contrast clause." },
              { q: 12, sentence: "Solar power is clean. It is expanding rapidly. (relative, non-defining)", answer: "Solar power, which is clean, is expanding rapidly.", explanation: "Non-defining: commas." },
              { q: 13, sentence: "Demand outstripped supply. Prices rose sharply. (reason)", answer: "Prices rose sharply because demand outstripped supply.", explanation: "Reason clause." },
              { q: 14, sentence: "Students study abroad. They gain independence and confidence. (relative)", answer: "Students who study abroad gain independence and confidence.", explanation: "Defining relative clause." },
              { q: 15, sentence: "The factory closed in 1998. Hundreds of workers lost their jobs. (time / result)", answer: "When the factory closed in 1998, hundreds of workers lost their jobs.", explanation: "Time clause with \u201Cwhen.\u201D" },
              { q: 16, sentence: "Cities are crowded and expensive. Young workers often leave them. (reason)", answer: "Because cities are crowded and expensive, young workers often leave them.", explanation: "Reason clause fronted, comma." },
              { q: 17, sentence: "The government raises taxes. Public services can be funded properly. (purpose)", answer: "The government raises taxes so that public services can be funded properly.", explanation: "Purpose with \u201Cso that.\u201D" },
              { q: 18, sentence: "This is the town. I grew up there. (relative, place)", answer: "This is the town where I grew up.", explanation: "\u201Cwhere\u201D for place." },
              { q: 19, sentence: "Technology keeps advancing. Many traditional jobs are disappearing. (concession)", answer: "Even though technology keeps advancing, many traditional jobs are disappearing.", explanation: "Concession clause." },
              { q: 20, sentence: "Some countries recycle most of their waste. Others send it to landfill. (contrast)", answer: "While some countries recycle most of their waste, others send it to landfill.", explanation: "Contrast with \u201Cwhile.\u201D" },
            ],
          },
          {
            code: "5.2",
            title: "Punctuation and Relative-Clause Polish",
            instruction:
              "Each sentence is missing commas, missing a relative pronoun, or contains a punctuation fault. Rewrite each one correctly.",
            instructionBn:
              "প্রতিটি বাক্যে কমা, relative pronoun বা punctuation ভুল আছে। সঠিক করে লেখো।",
            items: [
              { q: 1, sentence: "The city which is famous for its food attracts many tourists.", answer: "The city that is famous for its food attracts many tourists.", explanation: "Defining clause: no commas. \u201Cwhich\u201D also acceptable." },
              { q: 2, sentence: "My brother who lives in Canada is an engineer. (I have only one brother.)", answer: "My brother, who lives in Canada, is an engineer.", explanation: "Only one brother, so non-defining: commas." },
              { q: 3, sentence: "Students who cheat in exams they are usually expelled.", answer: "Students who cheat in exams are usually expelled.", explanation: "Remove the repeated subject \u201Cthey.\u201D" },
              { q: 4, sentence: "The report was clear, it recommended three changes.", answer: "The report was clear; it recommended three changes.", explanation: "Fix the comma splice with a semicolon or full stop." },
              { q: 5, sentence: "Although the policy was expensive. It reduced accidents significantly.", answer: "Although the policy was expensive, it reduced accidents significantly.", explanation: "Join the fragment to the main clause with a comma." },
              { q: 6, sentence: "Solar power which is renewable is becoming cheaper.", answer: "Solar power, which is renewable, is becoming cheaper.", explanation: "Non-defining: commas on both sides." },
              { q: 7, sentence: "People which live near factories often suffer from poor air quality.", answer: "People who live near factories often suffer from poor air quality.", explanation: "\u201Cwho\u201D for people, not \u201Cwhich.\u201D" },
              { q: 8, sentence: "Governments that invest in transport, tend to see lower long-term costs.", answer: "Governments that invest in transport tend to see lower long-term costs.", explanation: "Defining clause: remove the stray comma." },
              { q: 9, sentence: "The scheme was popular, however it was cancelled after two years.", answer: "The scheme was popular; however, it was cancelled after two years.", explanation: "\u201Chowever\u201D cannot join two clauses with only a comma; use a semicolon." },
              { q: 10, sentence: "The teacher whose class I attended last year has now retired.", answer: "Correct.", explanation: "\u201Cwhose\u201D for possession; the sentence is already well formed." },
              { q: 11, sentence: "Because the weather was extremely bad. The outdoor event was postponed.", answer: "Because the weather was extremely bad, the outdoor event was postponed.", explanation: "Join the fragment." },
              { q: 12, sentence: "Dhaka which is the capital of Bangladesh is extremely crowded.", answer: "Dhaka, which is the capital of Bangladesh, is extremely crowded.", explanation: "Non-defining: a unique place, so commas." },
              { q: 13, sentence: "The students were tired they left the lecture early.", answer: "The students were tired, so they left the lecture early.", explanation: "Fix the comma splice / run-on with \u201Cso.\u201D" },
              { q: 14, sentence: "This is the hospital where my mother she works.", answer: "This is the hospital where my mother works.", explanation: "Remove the repeated subject \u201Cshe.\u201D" },
              { q: 15, sentence: "The company hired a candidate that qualifications were outstanding.", answer: "The company hired a candidate whose qualifications were outstanding.", explanation: "Possession needs \u201Cwhose,\u201D not \u201Cthat.\u201D" },
            ],
          },
        ],

        answerKey: {
          "5.1": [
            { q: 1, answer: "Although public transport is cheap, many people still drive.", why: "Contrast + comma." },
            { q: 2, answer: "The lake dried up because rainfall had declined for years.", why: "Reason clause second." },
            { q: 3, answer: "The company hired a manager who had ten years of experience.", why: "\u201Cwho\u201D for a person." },
            { q: 4, answer: "Governments that invest in education tend to see their economies grow faster.", why: "Defining relative clause." },
            { q: 5, answer: "Once fees rose sharply, enrolment dropped. (or \u201CWhen fees rose \u2026\u201D)", why: "Time clause." },
            { q: 6, answer: "The city built new cycle lanes in order to cut congestion.", why: "Purpose." },
            { q: 7, answer: "Although renewable energy is expensive at first, it becomes cheaper over time.", why: "Contrast." },
            { q: 8, answer: "The report, which was published last year, highlighted the housing crisis.", why: "Non-defining: commas." },
            { q: 9, answer: "Unless action is taken soon, the situation will worsen.", why: "Condition." },
            { q: 10, answer: "Many families who live in rural areas lack access to good hospitals.", why: "Defining relative clause." },
            { q: 11, answer: "Although the policy was popular, it was eventually withdrawn.", why: "Contrast." },
            { q: 12, answer: "Solar power, which is clean, is expanding rapidly.", why: "Non-defining: commas." },
            { q: 13, answer: "Prices rose sharply because demand outstripped supply.", why: "Reason." },
            { q: 14, answer: "Students who study abroad gain independence and confidence.", why: "Defining relative clause." },
            { q: 15, answer: "When the factory closed in 1998, hundreds of workers lost their jobs.", why: "Time clause." },
            { q: 16, answer: "Because cities are crowded and expensive, young workers often leave them.", why: "Reason clause fronted." },
            { q: 17, answer: "The government raises taxes so that public services can be funded properly.", why: "Purpose." },
            { q: 18, answer: "This is the town where I grew up.", why: "\u201Cwhere\u201D for place." },
            { q: 19, answer: "Even though technology keeps advancing, many traditional jobs are disappearing.", why: "Concession." },
            { q: 20, answer: "While some countries recycle most of their waste, others send it to landfill.", why: "Contrast." },
          ],
          "5.2": [
            { q: 1, answer: "The city that is famous for its food attracts many tourists.", why: "Defining clause: no commas." },
            { q: 2, answer: "My brother, who lives in Canada, is an engineer.", why: "Only one brother, so non-defining: commas.", bn: "একটাই ভাই, তাই non-defining, কমা দাও।" },
            { q: 3, answer: "Students who cheat in exams are usually expelled.", why: "Remove the repeated subject \u201Cthey.\u201D", bn: "relative clause-এর পরে আবার they বসবে না।" },
            { q: 4, answer: "The report was clear; it recommended three changes.", why: "Fix the comma splice." },
            { q: 5, answer: "Although the policy was expensive, it reduced accidents significantly.", why: "Join the fragment." },
            { q: 6, answer: "Solar power, which is renewable, is becoming cheaper.", why: "Non-defining: commas on both sides." },
            { q: 7, answer: "People who live near factories often suffer from poor air quality.", why: "\u201Cwho\u201D for people.", bn: "মানুষের জন্য who, which নয়।" },
            { q: 8, answer: "Governments that invest in transport tend to see lower long-term costs.", why: "Defining clause: remove the stray comma." },
            { q: 9, answer: "The scheme was popular; however, it was cancelled after two years.", why: "\u201Chowever\u201D needs a semicolon." },
            { q: 10, answer: "Correct.", why: "\u201Cwhose\u201D for possession; already well formed." },
            { q: 11, answer: "Because the weather was extremely bad, the outdoor event was postponed.", why: "Join the fragment." },
            { q: 12, answer: "Dhaka, which is the capital of Bangladesh, is extremely crowded.", why: "Non-defining: unique place, commas." },
            { q: 13, answer: "The students were tired, so they left the lecture early.", why: "Fix the comma splice with \u201Cso.\u201D" },
            { q: 14, answer: "This is the hospital where my mother works.", why: "Remove the repeated subject \u201Cshe.\u201D" },
            { q: 15, answer: "The company hired a candidate whose qualifications were outstanding.", why: "Possession needs \u201Cwhose.\u201D", bn: "মালিকানা বোঝাতে whose।" },
          ],
        },
      },
    },
  });

  console.log("\u2705 Chapter 5 seeded successfully");
}

// ============================================================
// CHAPTER 6 · Passive Voice & Academic Detachment
// ============================================================

async function seedChapter6() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Chapter 6 · Passive Voice & Academic Detachment",
      titleBn: "অধ্যায় ৬ · Passive Voice ও Academic Detachment",
      position: 6,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Module 2 · Band 7.0+ Complex Structures & Range Booster",
        intro:
          "The passive voice turns the object of an action into the subject of the sentence, so the focus falls on what happens rather than who does it. It is essential in two IELTS places: the Task 1 process diagram, which is written almost entirely in the passive, and the Task 2 essay, where an impersonal register sounds more objective.",
        introBn:
          "অধ্যায় ৬-এর মূল কথা: passive voice-এ কাজের object বাক্যের subject হয়, ফোকাস পড়ে কী ঘটল তার উপর, কে করল তার উপর নয়। Task 1 process diagram প্রায় পুরোটাই passive, আর Task 2-তে passive নৈর্ব্যক্তিক academic সুর দেয়।",

        sections: [
          {
            code: "6.1",
            title: "What the passive is (zero assumption)",
            titleBn: "passive কী",
            content: {
              points: [
                { term: "Active", en: "Workers transport the materials. (subject = workers, the doer)", bn: "কর্তা কাজ করে।" },
                { term: "Passive", en: "The materials are transported (by workers). (subject = materials, the receiver)", bn: "কর্ম কাজ গ্রহণ করে।" },
              ],
              key: "The formula never changes: Object of the active sentence + a form of be + past participle (+ by + doer). The two moving parts are the correct form of be (which carries the tense) and the past participle.",
              bn: "সূত্র: active-এর object + be-এর রূপ + past participle (+ by + কর্তা)। be tense বহন করে, past participle স্থির থাকে।",
            },
          },
          {
            code: "6.2",
            title: "The passive across the tenses",
            titleBn: "বিভিন্ন tense-এ passive",
            content: {
              coreFact:
                "The tense lives in the be part; the past participle stays the same. Present simple: are transported. Past simple: were transported. Present perfect: have been transported. Future: will be transported. Modal: should be transported. Present continuous: are being transported.",
              bn: "tense থাকে be-এর মধ্যে, শেষে সবসময় past participle বসে। are transported / were transported / have been transported / will be transported, শেষটা সবসময় transported।",
            },
          },
          {
            code: "6.3",
            title: "When to choose the passive",
            titleBn: "কখন passive ব্যবহার করবে",
            content: {
              coreFact:
                "Use the passive when: the doer is unknown, obvious, or unimportant (New traffic laws were introduced in 2019); you want an objective, impersonal tone (It is widely believed that education reduces poverty); you are describing a process (First, the raw beans are harvested).",
              bn: "passive ব্যবহার করো যখন: কর্তা অজানা/স্পষ্ট/গুরুত্বহীন; নৈর্ব্যক্তিক সুর চাও; process বর্ণনা করছ।",
            },
          },
          {
            code: "6.4",
            title: "Academic detachment: the impersonal \u201CIt is \u2026\u201D structures",
            titleBn: "নৈর্ব্যক্তিক \u201CIt is \u2026\u201D কাঠামো",
            content: {
              coreFact:
                "Remove \u201CI\u201D and \u201Cpeople\u201D from a general claim: Many people think that \u2192 It is thought that; People often argue that \u2192 It is often argued that; Everyone knows that \u2192 It is widely known that; We can see that \u2192 It can be seen that.",
              bn: "\u201CI / people / everyone\u201D বাদ দিয়ে It is argued that\u2026, It is widely believed that\u2026 ব্যবহার করলে লেখা বেশি নৈর্ব্যক্তিক ও academic দেখায়, বিশেষত Task 2-এর ভূমিকায়।",
            },
          },
          {
            code: "L6",
            title: "L1 Error Fixer · Get the past participle right, and do not overuse",
            titleBn: "past participle ঠিক করো, অতিরিক্ত ব্যবহার নয়",
            content: {
              coreFact:
                "The passive needs the third form of the verb, not the base form or the past simple. Bangladeshi learners often drop the participle ending.",
              errorTypes: [
                {
                  type: "A missing or wrong past participle",
                  wrong: ["The materials are transport to the site.", "The bridge was build in 1990.", "The report was wrote by the committee."],
                  right: ["The materials are transported to the site.", "The bridge was built in 1990.", "The report was written by the committee."],
                },
              ],
              bn: "(১) passive-এ verb-এর তৃতীয় রূপ (past participle) লাগে: are transported, was built, was written; base form বা past simple নয়। (২) পুরো Task 2 passive-এ লিখবে না; passive মূলত Task 1 process ও নৈর্ব্যক্তিক বিবৃতিতে, argument সাধারণত active-এ পরিষ্কার।",
            },
          },
          {
            code: "Impact",
            title: "IELTS Impact · Where the passive earns marks",
            titleBn: "কোথায় passive নম্বর দেয়",
            content: {
              key: "Task 1 process diagrams run almost entirely in the passive present simple. Task 2 uses the passive selectively for the impersonal tone of general statements. Combined with the active for your own arguments, it shows you can control register.",
              examples: [
                "Task 1 process: Once the cocoa pods have been harvested, the beans are removed, fermented, and left to dry in the sun.",
                "Task 2 impersonal: It is often argued that stricter regulation is needed, although the costs are frequently underestimated.",
                "Speaking Part 3: A lot is being done to improve recycling, but more could be achieved with better public awareness.",
              ],
            },
          },
        ],

        exercises: [
          {
            code: "6.1",
            title: "Active to Passive Transformation",
            instruction:
              "Rewrite each active sentence in the passive voice, keeping the same tense. Drop the doer where it is obvious, or keep it with \u201Cby\u201D where it adds meaning.",
            instructionBn:
              "প্রতিটি active বাক্যকে একই tense-এ passive-এ লেখো। কর্তা স্পষ্ট হলে বাদ দাও, অর্থ যোগ করলে \u201Cby\u201D দিয়ে রাখো।",
            items: [
              { q: 1, sentence: "Farmers harvest the crop in October.", answer: "The crop is harvested (by farmers) in October.", explanation: "Present simple." },
              { q: 2, sentence: "The council will build a new bridge next year.", answer: "A new bridge will be built next year.", explanation: "Future." },
              { q: 3, sentence: "The committee wrote the report.", answer: "The report was written by the committee.", explanation: "Past simple; participle \u201Cwritten.\u201D" },
              { q: 4, sentence: "Workers are repairing the road at the moment.", answer: "The road is being repaired at the moment.", explanation: "Present continuous." },
              { q: 5, sentence: "People have wasted a great deal of water.", answer: "A great deal of water has been wasted.", explanation: "Present perfect." },
              { q: 6, sentence: "The government introduced new laws in 2019.", answer: "New laws were introduced in 2019.", explanation: "Past simple." },
              { q: 7, sentence: "Someone must clean the equipment after every use.", answer: "The equipment must be cleaned after every use.", explanation: "Modal." },
              { q: 8, sentence: "Machines process the raw materials.", answer: "The raw materials are processed (by machines).", explanation: "Present simple." },
              { q: 9, sentence: "They had completed the survey before the deadline.", answer: "The survey had been completed before the deadline.", explanation: "Past perfect." },
              { q: 10, sentence: "Volunteers are planting thousands of trees this year.", answer: "Thousands of trees are being planted this year.", explanation: "Present continuous." },
              { q: 11, sentence: "The factory produces two thousand cars a day.", answer: "Two thousand cars are produced a day.", explanation: "Present simple." },
              { q: 12, sentence: "A famous architect designed the building.", answer: "The building was designed by a famous architect.", explanation: "The \u201Cby\u201D phrase adds real information, so keep it." },
              { q: 13, sentence: "The authorities should encourage recycling.", answer: "Recycling should be encouraged (by the authorities).", explanation: "Modal." },
              { q: 14, sentence: "Engineers are testing the new system.", answer: "The new system is being tested.", explanation: "Present continuous." },
              { q: 15, sentence: "People believe that tourism damages the environment.", answer: "It is believed that tourism damages the environment.", explanation: "Impersonal passive." },
            ],
          },
          {
            code: "6.2",
            title: "Process Diagram Writing",
            instruction:
              "Below are the stages of how glass bottles are recycled, given as rough notes. Write one paragraph of about 150 words describing the process, using the passive present simple throughout and appropriate sequencing words (first, then, next, after that, once, finally).",
            instructionBn:
              "কাচের বোতল পুনর্ব্যবহারের ধাপগুলো নিচে দেওয়া। প্রায় ১৫০ শব্দে একটি অনুচ্ছেদে passive present simple ও sequencing শব্দ দিয়ে বর্ণনা করো।",
            paragraph:
              "Stages: used glass bottles collected from homes and bins; transported to a recycling plant; sorted by colour (clear, green, brown); washed to remove labels and dirt; crushed into small pieces called cullet; melted in a furnace at very high temperature; moulded into new bottles; new bottles filled, labelled, and sent to shops.",
            model:
              "The diagram illustrates the process by which used glass bottles are recycled into new ones. First, used bottles are collected from homes and public bins, after which they are transported to a recycling plant. On arrival, the glass is sorted by colour into clear, green, and brown, and it is then washed thoroughly so that labels and dirt are removed. Next, the clean glass is crushed into small fragments known as cullet. Once this stage is complete, the cullet is melted in a furnace at an extremely high temperature until it becomes liquid. The molten glass is then moulded into the shape of new bottles. Finally, the finished bottles are filled, labelled, and sent to shops, where the cycle can begin again.",
          },
        ],

        answerKey: {
          "6.1": [
            { q: 1, answer: "The crop is harvested (by farmers) in October.", why: "Present simple." },
            { q: 2, answer: "A new bridge will be built next year.", why: "Future." },
            { q: 3, answer: "The report was written by the committee.", why: "Past simple; participle \u201Cwritten.\u201D", bn: "write-এর participle written।" },
            { q: 4, answer: "The road is being repaired at the moment.", why: "Present continuous." },
            { q: 5, answer: "A great deal of water has been wasted.", why: "Present perfect." },
            { q: 6, answer: "New laws were introduced in 2019.", why: "Past simple." },
            { q: 7, answer: "The equipment must be cleaned after every use.", why: "Modal." },
            { q: 8, answer: "The raw materials are processed (by machines).", why: "Present simple." },
            { q: 9, answer: "The survey had been completed before the deadline.", why: "Past perfect." },
            { q: 10, answer: "Thousands of trees are being planted this year.", why: "Present continuous." },
            { q: 11, answer: "Two thousand cars are produced a day.", why: "Present simple." },
            { q: 12, answer: "The building was designed by a famous architect.", why: "The \u201Cby\u201D phrase adds real information, so keep it." },
            { q: 13, answer: "Recycling should be encouraged (by the authorities).", why: "Modal." },
            { q: 14, answer: "The new system is being tested.", why: "Present continuous." },
            { q: 15, answer: "It is believed that tourism damages the environment.", why: "Impersonal passive.", bn: "নৈর্ব্যক্তিক গঠন।" },
          ],
          "6.2": {
            corrected:
              "The diagram illustrates the process by which used glass bottles are recycled into new ones. First, used bottles are collected from homes and public bins, after which they are transported to a recycling plant. On arrival, the glass is sorted by colour into clear, green, and brown, and it is then washed thoroughly so that labels and dirt are removed. Next, the clean glass is crushed into small fragments known as cullet. Once this stage is complete, the cullet is melted in a furnace at an extremely high temperature until it becomes liquid. The molten glass is then moulded into the shape of new bottles. Finally, the finished bottles are filled, labelled, and sent to shops, where the cycle can begin again.",
            bn: "পুরো বর্ণনা passive present simple-এ (are collected, is washed, is melted), কারণ কে করেছে গুরুত্বপূর্ণ নয়; ধাপগুলো first, then, next, once, finally দিয়ে সাজানো; এবং tense শুরু থেকে শেষ পর্যন্ত একই থাকে। এটাই Task 1 process-এর আদর্শ কাঠামো।",
          },
        },
      },
    },
  });

  console.log("\u2705 Chapter 6 seeded successfully");
}

// ============================================================
// CHAPTER 7 · Conditionals, Hedging & Hypothetical Reasoning
// ============================================================

async function seedChapter7() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Chapter 7 · Conditionals, Hedging & Hypothetical Reasoning",
      titleBn: "অধ্যায় ৭ · Conditional, Hedging ও Hypothetical Reasoning",
      position: 7,
      difficulty: 2,
      is_published: true,
      body: {
        module: "Module 2 · Band 7.0+ Complex Structures & Range Booster",
        intro:
          "Conditionals let you argue about situations that may or may not be real: if this happens, that will follow. They are the natural grammar of cause and effect, which is why Writing Task 2 and Speaking Part 3 depend on them heavily. Alongside conditionals sits hedging, the art of making a claim cautiously rather than absolutely.",
        introBn:
          "অধ্যায় ৭-এর মূল কথা: conditional দিয়ে সম্ভাব্য বা কাল্পনিক পরিস্থিতি নিয়ে যুক্তি দেওয়া যায় (if\u2026, then\u2026)। আর hedging মানে দাবিকে চরমভাবে না বলে সতর্কভাবে বলা। দুটো মিলে Task 2 ও Speaking Part 3-এর cause-and-effect যুক্তিকে academic সুর দেয়।",

        sections: [
          {
            code: "7.1",
            title: "What a conditional is (zero assumption)",
            titleBn: "conditional কী",
            content: {
              coreFact:
                "A conditional has two parts: the if-clause (the condition) and the result clause (the consequence). When the if-clause comes first, put a comma after it. The only thing that changes between the different conditionals is the verb forms in each half.",
              bn: "conditional-এর দুই অংশ: if-clause (শর্ত) ও result clause (ফল)। if-clause আগে এলে পরে কমা। বিভিন্ন conditional-এর মধ্যে শুধু verb form বদলায়।",
            },
          },
          {
            code: "7.2",
            title: "The five conditionals",
            titleBn: "পাঁচটি conditional",
            cases: [
              {
                title: "Zero, First, Second, Third, Mixed",
                rule: "Zero: If + present, present (general truth). First: If + present, will + base (real future). Second: If + past, would + base (hypothetical present/future). Third: If + had + p.p., would have + p.p. (past that did not happen). Mixed: If + had + p.p., would + base now.",
                examples: [
                  { right: "Zero: If you heat ice, it melts." },
                  { right: "First: If fees rise, fewer students will enrol." },
                  { right: "Second: If governments invested more, pollution would fall." },
                  { right: "Third: If she had studied, she would have passed." },
                  { right: "Mixed: If I had saved money, I would be wealthy now." },
                ],
              },
              {
                title: "The formal \u201Cwere\u201D",
                rule: "In the second conditional, formal English uses were for all subjects, including I, he, she, it.",
                examples: [
                  { right: "If I were the prime minister, I would reform the tax system." },
                  { right: "If public transport were free, more people would use it." },
                ],
              },
            ],
            content: {
              bn: "second conditional-এর if-clause দেখতে past-এর মতো (if governments invested), কিন্তু এটি কাল্পনিক বর্তমান/ভবিষ্যৎ বোঝায়। formal ইংরেজিতে সব subject-এর জন্য were বসে: if I were, if it were।",
            },
          },
          {
            code: "7.3",
            title: "The error that decides the mark: do not mix the halves",
            titleBn: "অর্ধেক মেলানোর ভুল",
            content: {
              coreFact:
                "Never put \u201Cwill\u201D or \u201Cwould\u201D directly after \u201Cif.\u201D The if-clause takes the present (first/zero), the past (second), or the past perfect (third); the will/would belongs in the result clause only.",
              bn: "সবচেয়ে সাধারণ ভুল: if-এর পরে will/would বসানো। মনে রাখো: if-clause-এ কখনো will/would বসে না; সেগুলো শুধু result clause-এ।",
            },
          },
          {
            code: "7.4",
            title: "Modals of possibility and academic hedging",
            titleBn: "সম্ভাবনার modal ও academic hedging",
            content: {
              coreFact:
                "Hedging means qualifying a claim so it is not absolute. Toolkit: Modals (may, might, could, would); Lexical verbs (tend to, appear to, seem to); Adverbs (often, generally, in many cases, to some extent, arguably); Quantity words (many, most, a significant number of); Full phrases (it is arguable that, it could be argued that, X is likely to).",
              bn: "hedging মানে দাবিকে চরমভাবে না বলে সতর্কভাবে বলা। may, might, could, tend to, likely to, in many cases, it could be argued that ব্যবহার করো। এটা দুর্বলতা নয়, academic পরিপক্বতার চিহ্ন।",
            },
          },
          {
            code: "L7",
            title: "L1 Error Fixer · Over-generalisation",
            titleBn: "অতি-সাধারণীকরণ",
            content: {
              coreFact:
                "A recurring feature of lower-band Task 2 writing is the absolute, over-generalised claim. Soften absolute words: always/never \u2192 often/rarely; all/every/everyone \u2192 most/many; will definitely \u2192 is likely to/may; completely destroy \u2192 significantly harm; the only reason \u2192 one of the main reasons; proves \u2192 suggests/indicates.",
              errorTypes: [
                {
                  type: "Absolute over-generalisation",
                  wrong: ["Social media always destroys the concentration of every student.", "If we do not act, every person will be destroyed."],
                  right: ["Social media can harm the concentration of many students.", "If we do not act, many communities may suffer serious harm."],
                },
              ],
              bn: "চরম শব্দ (always, never, all, everyone, will definitely, completely) দুইভাবে ক্ষতি করে: unacademic দেখায়, আর সহজে খণ্ডন করা যায়। বদলে often, most, may, likely to, one of the main reasons, suggests ব্যবহার করো।",
            },
          },
          {
            code: "Impact",
            title: "IELTS Impact · Conditionals and hedging in the exam",
            titleBn: "পরীক্ষায় conditional ও hedging",
            content: {
              key: "Second conditionals are the natural grammar of Task 2 solution paragraphs and Speaking Part 3 speculation. First conditionals carry real consequences in problem-and-solution essays. Hedging runs through the whole of Task 2 and Speaking Part 3, protecting every generalisation.",
              examples: [
                "Task 2: If governments fail to invest in flood defences, coastal cities will become increasingly vulnerable.",
                "Task 2: If education were genuinely free, participation would probably rise, although the effect might vary between regions.",
                "Speaking Part 3: If I were in charge of the city, I would prioritise public transport, because it tends to benefit the most people.",
              ],
            },
          },
        ],

        exercises: [
          {
            code: "7.1",
            title: "Conditional Rewrite",
            instruction:
              "Complete or rewrite each sentence in the conditional type shown in brackets. Watch the verb forms in both halves.",
            instructionBn:
              "বন্ধনীতে দেওয়া conditional অনুযায়ী প্রতিটি বাক্য সম্পূর্ণ করো বা পুনর্লিখন করো। দুই অর্ধেকের verb form খেয়াল রাখো।",
            items: [
              { q: 1, sentence: "(First) If the price of fuel ______ (fall), demand ______ (rise).", answer: "If the price of fuel falls, demand will rise.", explanation: "First: present + will." },
              { q: 2, sentence: "(Second) If I ______ (be) the education minister, I ______ (reform) the exam system.", answer: "If I were the education minister, I would reform the exam system.", explanation: "Second: \u201Cwere\u201D for all subjects." },
              { q: 3, sentence: "(Zero) If you ______ (heat) water to 100 degrees, it ______ (boil).", answer: "If you heat water to 100 degrees, it boils.", explanation: "Zero: present + present." },
              { q: 4, sentence: "(Third) If she ______ (study) harder, she ______ (pass) the test last year.", answer: "If she had studied harder, she would have passed the test last year.", explanation: "Third: past perfect + would have + p.p." },
              { q: 5, sentence: "Fix the error: \u201CIf governments will invest more, pollution will fall.\u201D", answer: "If governments invested more, pollution would fall.", explanation: "Remove \u201Cwill\u201D from the if-clause; clean second conditional." },
              { q: 6, sentence: "Fix the error: \u201CIf she studied harder, she will pass the exam.\u201D", answer: "If she studied harder, she would pass the exam.", explanation: "Match the halves: second conditional throughout." },
              { q: 7, sentence: "(First) Unless action ______ (be) taken soon, the situation ______ (worsen).", answer: "Unless action is taken soon, the situation will worsen.", explanation: "First conditional with \u201Cunless.\u201D" },
              { q: 8, sentence: "(Second) If public transport ______ (be) free, far more people ______ (use) it.", answer: "If public transport were free, far more people would use it.", explanation: "Second." },
              { q: 9, sentence: "(Third) If the company ______ (invest) in safety, the accident ______ (not / happen).", answer: "If the company had invested in safety, the accident would not have happened.", explanation: "Third." },
              { q: 10, sentence: "(Mixed) If I ______ (save) more money last year, I ______ (be) able to travel now.", answer: "If I had saved more money last year, I would be able to travel now.", explanation: "Mixed: past condition, present result." },
              { q: 11, sentence: "(Second) If cities ______ (have) better cycle lanes, air quality ______ (improve).", answer: "If cities had better cycle lanes, air quality would improve.", explanation: "Second." },
              { q: 12, sentence: "(First) If this trend ______ (continue), the city ______ (become) overcrowded.", answer: "If this trend continues, the city will become overcrowded.", explanation: "First." },
              { q: 13, sentence: "Fix the error: \u201CIf people would recycle more, less waste would be produced.\u201D", answer: "If people recycled more, less waste would be produced.", explanation: "Remove \u201Cwould\u201D from the if-clause." },
              { q: 14, sentence: "(Second) If the government ______ (raise) taxes on tobacco, consumption ______ (probably / decline).", answer: "If the government raised taxes on tobacco, consumption would probably decline.", explanation: "Second, with a hedge." },
              { q: 15, sentence: "(Third) If the warning ______ (be) issued earlier, many lives ______ (be) saved.", answer: "If the warning had been issued earlier, many lives would have been saved.", explanation: "Third, passive." },
            ],
          },
          {
            code: "7.2",
            title: "Hedging Upgrade Drill",
            instruction:
              "Each statement below is too absolute for academic writing. Rewrite each one as a cautious, qualified Band 8 sentence, using hedging language.",
            instructionBn:
              "প্রতিটি বিবৃতি academic লেখার জন্য বড় বেশি চরম। প্রতিটিকে hedging ভাষা দিয়ে সতর্ক, পরিমিত ব্যান্ড ৮ বাক্যে পুনর্লিখন করো।",
            items: [
              { q: 1, sentence: "Social media always destroys young people\u2019s concentration.", answer: "Social media can harm the concentration of many young people.", explanation: "always \u2192 can / many." },
              { q: 2, sentence: "Everyone knows that studying abroad is better than studying at home.", answer: "It is often argued that studying abroad may offer certain advantages over studying at home.", explanation: "Soften \u201Ceveryone knows\u201D and \u201Cbetter.\u201D" },
              { q: 3, sentence: "Immigration completely solves the problem of an ageing population.", answer: "Immigration may help to address the problem of an ageing population, at least in part.", explanation: "\u201Ccompletely solves\u201D \u2192 \u201Cmay help to address \u2026 in part.\u201D" },
              { q: 4, sentence: "If we do not act now, every city will be destroyed by flooding.", answer: "If we fail to act, many cities could face serious flooding.", explanation: "\u201Cevery \u2026 will be destroyed\u201D \u2192 \u201Cmany \u2026 could face.\u201D" },
              { q: 5, sentence: "Technology will definitely replace all human workers in the future.", answer: "Technology is likely to replace some human workers in the future, although the extent remains uncertain.", explanation: "\u201Cwill definitely \u2026 all\u201D \u2192 \u201Cis likely to \u2026 some.\u201D" },
              { q: 6, sentence: "Rich countries never help poor countries.", answer: "Rich countries do not always provide sufficient support to poorer ones.", explanation: "\u201Cnever\u201D \u2192 \u201Cdo not always.\u201D" },
              { q: 7, sentence: "Strict laws are the only way to reduce crime.", answer: "Stricter laws may be one effective way to reduce crime.", explanation: "\u201Cthe only way\u201D \u2192 \u201Cone effective way.\u201D" },
              { q: 8, sentence: "Online learning is always worse than classroom learning.", answer: "Online learning is, in some respects, less effective than classroom learning.", explanation: "\u201Calways worse\u201D \u2192 \u201Cin some respects, less effective.\u201D" },
              { q: 9, sentence: "Tourism completely ruins the environment of every coastal area.", answer: "Tourism can significantly damage the environment of many coastal areas.", explanation: "\u201Ccompletely ruins \u2026 every\u201D \u2192 \u201Ccan significantly damage \u2026 many.\u201D" },
              { q: 10, sentence: "This proves that government spending causes economic growth.", answer: "This suggests that government spending may contribute to economic growth.", explanation: "\u201Cproves \u2026 causes\u201D \u2192 \u201Csuggests \u2026 may contribute to.\u201D" },
            ],
          },
        ],

        answerKey: {
          "7.1": [
            { q: 1, answer: "If the price of fuel falls, demand will rise.", why: "First: present + will." },
            { q: 2, answer: "If I were the education minister, I would reform the exam system.", why: "Second: \u201Cwere\u201D for all subjects.", bn: "if I were।" },
            { q: 3, answer: "If you heat water to 100 degrees, it boils.", why: "Zero: present + present." },
            { q: 4, answer: "If she had studied harder, she would have passed the test last year.", why: "Third: past perfect + would have + p.p." },
            { q: 5, answer: "If governments invested more, pollution would fall.", why: "Remove \u201Cwill\u201D from the if-clause.", bn: "if-এ will বসে না।" },
            { q: 6, answer: "If she studied harder, she would pass the exam.", why: "Match the halves: second conditional throughout." },
            { q: 7, answer: "Unless action is taken soon, the situation will worsen.", why: "First conditional with \u201Cunless.\u201D" },
            { q: 8, answer: "If public transport were free, far more people would use it.", why: "Second." },
            { q: 9, answer: "If the company had invested in safety, the accident would not have happened.", why: "Third." },
            { q: 10, answer: "If I had saved more money last year, I would be able to travel now.", why: "Mixed: past condition, present result." },
            { q: 11, answer: "If cities had better cycle lanes, air quality would improve.", why: "Second." },
            { q: 12, answer: "If this trend continues, the city will become overcrowded.", why: "First." },
            { q: 13, answer: "If people recycled more, less waste would be produced.", why: "Remove \u201Cwould\u201D from the if-clause." },
            { q: 14, answer: "If the government raised taxes on tobacco, consumption would probably decline.", why: "Second, with a hedge." },
            { q: 15, answer: "If the warning had been issued earlier, many lives would have been saved.", why: "Third, passive." },
          ],
          "7.2": [
            { q: 1, answer: "Social media can harm the concentration of many young people.", why: "always \u2192 can / many.", bn: "always \u2192 can / many।" },
            { q: 2, answer: "It is often argued that studying abroad may offer certain advantages over studying at home.", why: "Soften \u201Ceveryone knows\u201D and \u201Cbetter.\u201D" },
            { q: 3, answer: "Immigration may help to address the problem of an ageing population, at least in part.", why: "\u201Ccompletely solves\u201D softened." },
            { q: 4, answer: "If we fail to act, many cities could face serious flooding.", why: "\u201Cevery \u2026 destroyed\u201D \u2192 \u201Cmany \u2026 could face.\u201D" },
            { q: 5, answer: "Technology is likely to replace some human workers in the future, although the extent remains uncertain.", why: "\u201Cwill definitely \u2026 all\u201D softened." },
            { q: 6, answer: "Rich countries do not always provide sufficient support to poorer ones.", why: "\u201Cnever\u201D \u2192 \u201Cdo not always.\u201D" },
            { q: 7, answer: "Stricter laws may be one effective way to reduce crime.", why: "\u201Cthe only way\u201D \u2192 \u201Cone effective way.\u201D" },
            { q: 8, answer: "Online learning is, in some respects, less effective than classroom learning.", why: "\u201Calways worse\u201D softened." },
            { q: 9, answer: "Tourism can significantly damage the environment of many coastal areas.", why: "\u201Ccompletely ruins \u2026 every\u201D softened." },
            { q: 10, answer: "This suggests that government spending may contribute to economic growth.", why: "\u201Cproves \u2026 causes\u201D \u2192 \u201Csuggests \u2026 may contribute to.\u201D" },
          ],
        },
      },
    },
  });

  console.log("\u2705 Chapter 7 seeded successfully");
}

// ============================================================
// CHAPTER 8 · Inversion, Cleft Sentences & Advanced Emphasis
// ============================================================

async function seedChapter8() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Chapter 8 · Inversion, Cleft Sentences & Advanced Emphasis",
      titleBn: "অধ্যায় ৮ · Inversion, Cleft Sentence ও Advanced Emphasis",
      position: 8,
      difficulty: 3,
      is_published: true,
      body: {
        module: "Module 3 · Band 9.0 Masterclass (Advanced Linguistic Precision)",
        intro:
          "Standard English puts the subject before the verb. Emphasis grammar deliberately breaks that order to throw weight onto one idea. Examiners recognise these structures instantly as markers of a very high band. This chapter gives you two reliable tools: inversion and cleft sentences. Learn a small number of fixed patterns, use each occasionally, and get it exactly right.",
        introBn:
          "অধ্যায় ৮-এর মূল কথা: সাধারণ ইংরেজিতে subject আগে, verb পরে। emphasis grammar ইচ্ছা করে সেই ক্রম ভাঙে বা বাক্য পুনর্গঠন করে কোনো একটি ধারণাকে জোর দেয়। inversion ও cleft, এই দুটি টুল অল্প কিন্তু নির্ভুলভাবে ব্যবহার করলে খুব উঁচু ব্যান্ডের সংকেত দেয়।",

        sections: [
          {
            code: "8.1",
            title: "Negative inversion",
            titleBn: "negative inversion",
            content: {
              coreFact:
                "When a sentence begins with a negative or limiting adverbial, English inverts the subject and the auxiliary verb, exactly as in a question. Form: negative adverbial + auxiliary + subject + main verb. Triggers: Not only\u2026but also, Never (before), Rarely/Seldom, Hardly ever, Little, No sooner\u2026than, Not until, Only after/when/then, Under no circumstances. If there is no auxiliary, add do/does/did and return the main verb to its base form.",
              bn: "বাক্যের শুরুতে negative/limiting adverbial (never, rarely, hardly ever, not only, only after, under no circumstances) থাকলে subject ও auxiliary উল্টে যায়, প্রশ্নের মতো। auxiliary না থাকলে do/does/did যোগ করো এবং মূল verb base form-এ ফিরিয়ে আনো: \u201CRarely does a policy satisfy everyone.\u201D",
            },
          },
          {
            code: "8.2",
            title: "Fronting (emphasis without full inversion)",
            titleBn: "fronting",
            content: {
              coreFact:
                "A gentler form of emphasis is fronting: moving a phrase to the start of the sentence for weight, without necessarily inverting subject and verb. \u201CCompared to rural areas, urban centres offer better healthcare.\u201D It is lower risk than inversion and still adds variety.",
              bn: "fronting মানে জোর দিতে একটি বাক্যাংশ সামনে আনা, subject-verb উল্টানো ছাড়াই। inversion-এর চেয়ে কম ঝুঁকিপূর্ণ, তবু বৈচিত্র্য যোগ করে।",
            },
          },
          {
            code: "8.3",
            title: "Cleft sentences",
            titleBn: "cleft sentence",
            cases: [
              {
                title: "The it-cleft: It is / was X that \u2026",
                rule: "Use it to spotlight a noun, a person, or a time.",
                examples: [
                  { right: "It is education that drives development. (spotlight: education)" },
                  { right: "It was in 2008 that the crisis began. (spotlight: the time)" },
                ],
              },
              {
                title: "The what-cleft: What \u2026 is \u2026",
                rule: "Use it to spotlight an action or a need, especially in Task 2 solution sentences. The linking verb is usually singular.",
                examples: [
                  { right: "What is needed is stronger regulation." },
                  { right: "What the city lacks is affordable housing." },
                ],
              },
            ],
            content: {
              bn: "cleft বাক্য একটি ধারণাকে দুই ভাগে ভেঙে গুরুত্বপূর্ণ অংশকে জোর দেয়। It is X that\u2026 (noun/সময়ে জোর) এবং What is needed is\u2026 (কাজ/প্রয়োজনে জোর)। what-cleft-এ verb সাধারণত singular।",
            },
          },
          {
            code: "L8",
            title: "Common Pitfall · Accuracy and restraint",
            titleBn: "নির্ভুলতা ও সংযম",
            content: {
              coreFact:
                "These are high-reward but high-risk structures. Accuracy first: a broken inversion is worse than a plain correct sentence. Use them sparingly: one inverted sentence and one cleft in a whole Task 2 essay is plenty. Introduce these only once your Module 1 and 2 grammar is already accurate.",
              bn: "এগুলো উচ্চ ঝুঁকির কাঠামো। (১) নির্ভুলতা আগে: ভুল inversion সঠিক সাধারণ বাক্যের চেয়েও খারাপ। (২) পরিমিতি: পুরো রচনায় একটি inversion ও একটি cleft-ই যথেষ্ট। Module 1-2 নির্ভুল হলে তবেই এগুলো ব্যবহার করো।",
            },
          },
          {
            code: "Impact",
            title: "IELTS Impact · The Band 8.5 to 9.0 signal",
            titleBn: "ব্যান্ড ৮.৫-৯-এর সংকেত",
            content: {
              key: "The Band 9 descriptor asks for \u201Ca wide range of structures used naturally.\u201D A single accurate inversion or cleft, placed where it genuinely adds emphasis, tells the examiner you operate at the top of the scale. They fit most naturally in the conclusion or key argument of a Task 2 essay.",
              examples: [
                "Task 2: Not only does renewable energy reduce emissions, but it also creates long-term employment.",
                "Task 2: What is ultimately required is a shift in public attitudes, not merely new legislation.",
                "Speaking Part 3: It is often the youngest generation that adapts most quickly to technological change.",
              ],
            },
          },
        ],

        exercises: [
          {
            code: "8.1",
            title: "Inversion Transformation",
            instruction:
              "Rewrite each sentence beginning with the word or phrase given, using correct inversion.",
            instructionBn:
              "প্রতিটি বাক্য দেওয়া শব্দ/বাক্যাংশ দিয়ে শুরু করে সঠিক inversion-এ পুনর্লিখন করো।",
            items: [
              { q: 1, sentence: "A single policy rarely satisfies everyone. \u2192 Rarely ______", answer: "Rarely does a single policy satisfy everyone.", explanation: "Add \u201Cdoes,\u201D base verb \u201Csatisfy.\u201D" },
              { q: 2, sentence: "The government hardly ever reverses such a decision. \u2192 Hardly ever ______", answer: "Hardly ever does the government reverse such a decision.", explanation: "Auxiliary \u201Cdoes\u201D + base verb." },
              { q: 3, sentence: "The internet has not only changed communication but also work. \u2192 Not only ______", answer: "Not only has the internet changed communication, but it has also changed work.", explanation: "Auxiliary inverts before the subject." },
              { q: 4, sentence: "Safety should never be compromised under any circumstances. \u2192 Under no circumstances ______", answer: "Under no circumstances should safety be compromised.", explanation: "Modal inverts before the subject." },
              { q: 5, sentence: "People had never faced such a challenge before. \u2192 Never before ______", answer: "Never before had people faced such a challenge.", explanation: "\u201Chad\u201D inverts." },
              { q: 6, sentence: "The public did not realise the danger until recently. \u2192 Not until recently ______", answer: "Not until recently did the public realise the danger.", explanation: "\u201Cdid\u201D + base verb." },
              { q: 7, sentence: "The government acted only after the crisis. \u2192 Only after the crisis ______", answer: "Only after the crisis did the government act.", explanation: "\u201Cdid\u201D + base verb." },
              { q: 8, sentence: "The law had no sooner passed than protests began. \u2192 No sooner ______", answer: "No sooner had the law passed than protests began.", explanation: "\u201Chad\u201D inverts, \u201Cthan\u201D follows." },
              { q: 9, sentence: "Prices seldom fall during a shortage. \u2192 Seldom ______", answer: "Seldom do prices fall during a shortage.", explanation: "\u201Cdo\u201D + base verb." },
              { q: 10, sentence: "People little understood how serious the problem was. \u2192 Little ______", answer: "Little did people understand how serious the problem was.", explanation: "\u201Cdid\u201D + base verb." },
              { q: 11, sentence: "The scheme not only failed but also wasted public money. \u2192 Not only ______", answer: "Not only did the scheme fail, but it also wasted public money.", explanation: "\u201Cdid\u201D + base verb." },
              { q: 12, sentence: "The minister rarely makes such a promise. \u2192 Rarely ______", answer: "Rarely does the minister make such a promise.", explanation: "\u201Cdoes\u201D + base verb." },
              { q: 13, sentence: "The full effects became clear only when the data was published. \u2192 Only when the data was published ______", answer: "Only when the data was published did the full effects become clear.", explanation: "\u201Cdid\u201D + base verb." },
              { q: 14, sentence: "The economy has never grown so quickly. \u2192 Never ______", answer: "Never has the economy grown so quickly.", explanation: "\u201Chas\u201D inverts." },
              { q: 15, sentence: "Students should not use phones during the exam under any circumstances. \u2192 Under no circumstances ______", answer: "Under no circumstances should students use phones during the exam.", explanation: "Modal inverts before the subject." },
            ],
          },
          {
            code: "8.2",
            title: "Cleft Sentence Construction",
            instruction:
              "Rewrite each argument as a cleft sentence, using the type suggested in brackets, to emphasise the key idea.",
            instructionBn:
              "প্রতিটি যুক্তিকে বন্ধনীর ধরন অনুযায়ী cleft sentence-এ লিখে মূল ধারণায় জোর দাও।",
            items: [
              { q: 1, sentence: "Education drives long-term development. (it-cleft)", answer: "It is education that drives long-term development.", explanation: "it-cleft spotlights the noun." },
              { q: 2, sentence: "We urgently need stronger environmental regulation. (what-cleft)", answer: "What is urgently needed is stronger environmental regulation.", explanation: "what-cleft spotlights the need." },
              { q: 3, sentence: "The crisis began in 2008. (it-cleft)", answer: "It was in 2008 that the crisis began.", explanation: "it-cleft spotlights the time." },
              { q: 4, sentence: "The city most lacks affordable housing. (what-cleft)", answer: "What the city most lacks is affordable housing.", explanation: "what-cleft spotlights the lack." },
              { q: 5, sentence: "Governments, not individuals, must lead the response. (it-cleft)", answer: "It is governments, not individuals, that must lead the response.", explanation: "it-cleft spotlights the actor." },
              { q: 6, sentence: "Society really needs a change in attitudes. (what-cleft)", answer: "What society really needs is a change in attitudes.", explanation: "what-cleft spotlights the need." },
              { q: 7, sentence: "Poverty is the root cause of most of these problems. (it-cleft)", answer: "It is poverty that lies at the root of most of these problems.", explanation: "it-cleft spotlights the cause." },
              { q: 8, sentence: "The plan mainly requires better funding. (what-cleft)", answer: "What the plan mainly requires is better funding.", explanation: "what-cleft spotlights the requirement." },
              { q: 9, sentence: "Rural areas suffer most from the lack of good hospitals. (what-cleft)", answer: "What rural areas suffer most from is the lack of good hospitals.", explanation: "what-cleft spotlights the problem." },
              { q: 10, sentence: "The younger generation adapts most quickly to technology. (it-cleft)", answer: "It is the younger generation that adapts most quickly to technology.", explanation: "it-cleft spotlights the group." },
            ],
          },
        ],

        answerKey: {
          "8.1": [
            { q: 1, answer: "Rarely does a single policy satisfy everyone.", why: "Add \u201Cdoes,\u201D base verb \u201Csatisfy.\u201D", bn: "auxiliary নেই, তাই does যোগ।" },
            { q: 2, answer: "Hardly ever does the government reverse such a decision.", why: "\u201Cdoes\u201D + base verb." },
            { q: 3, answer: "Not only has the internet changed communication, but it has also changed work.", why: "Auxiliary inverts before the subject." },
            { q: 4, answer: "Under no circumstances should safety be compromised.", why: "Modal inverts." },
            { q: 5, answer: "Never before had people faced such a challenge.", why: "\u201Chad\u201D inverts." },
            { q: 6, answer: "Not until recently did the public realise the danger.", why: "\u201Cdid\u201D + base verb." },
            { q: 7, answer: "Only after the crisis did the government act.", why: "\u201Cdid\u201D + base verb." },
            { q: 8, answer: "No sooner had the law passed than protests began.", why: "\u201Chad\u201D inverts, \u201Cthan\u201D follows." },
            { q: 9, answer: "Seldom do prices fall during a shortage.", why: "\u201Cdo\u201D + base verb." },
            { q: 10, answer: "Little did people understand how serious the problem was.", why: "\u201Cdid\u201D + base verb." },
            { q: 11, answer: "Not only did the scheme fail, but it also wasted public money.", why: "\u201Cdid\u201D + base verb." },
            { q: 12, answer: "Rarely does the minister make such a promise.", why: "\u201Cdoes\u201D + base verb." },
            { q: 13, answer: "Only when the data was published did the full effects become clear.", why: "\u201Cdid\u201D + base verb." },
            { q: 14, answer: "Never has the economy grown so quickly.", why: "\u201Chas\u201D inverts." },
            { q: 15, answer: "Under no circumstances should students use phones during the exam.", why: "Modal inverts before the subject." },
          ],
          "8.2": [
            { q: 1, answer: "It is education that drives long-term development.", why: "it-cleft spotlights the noun." },
            { q: 2, answer: "What is urgently needed is stronger environmental regulation.", why: "what-cleft spotlights the need." },
            { q: 3, answer: "It was in 2008 that the crisis began.", why: "it-cleft spotlights the time." },
            { q: 4, answer: "What the city most lacks is affordable housing.", why: "what-cleft spotlights the lack." },
            { q: 5, answer: "It is governments, not individuals, that must lead the response.", why: "it-cleft spotlights the actor." },
            { q: 6, answer: "What society really needs is a change in attitudes.", why: "what-cleft spotlights the need." },
            { q: 7, answer: "It is poverty that lies at the root of most of these problems.", why: "it-cleft spotlights the cause." },
            { q: 8, answer: "What the plan mainly requires is better funding.", why: "what-cleft spotlights the requirement." },
            { q: 9, answer: "What rural areas suffer most from is the lack of good hospitals.", why: "what-cleft spotlights the problem." },
            { q: 10, answer: "It is the younger generation that adapts most quickly to technology.", why: "it-cleft spotlights the group." },
          ],
        },
      },
    },
  });

  console.log("\u2705 Chapter 8 seeded successfully");
}

// ============================================================
// CHAPTER 9 · Nominalisation & Academic Density
// ============================================================

async function seedChapter9() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Chapter 9 · Nominalisation & Academic Density",
      titleBn: "অধ্যায় ৯ · Nominalisation ও Academic Density",
      position: 9,
      difficulty: 3,
      is_published: true,
      body: {
        module: "Module 3 · Band 9.0 Masterclass (Advanced Linguistic Precision)",
        intro:
          "Nominalisation is the habit of turning a verb or an adjective into a noun, and then building the sentence around that noun. \u201CThe population increased rapidly\u201D becomes \u201CThere was a rapid increase in the population.\u201D It makes a sentence denser, more formal, and more objective, and it is the engine of paraphrasing, which is why it matters so much in Task 1.",
        introBn:
          "অধ্যায় ৯-এর মূল কথা: nominalisation মানে verb বা adjective-কে noun-এ রূপান্তর করে সেই noun-কে ঘিরে বাক্য গড়া। \u201CThe population increased\u201D \u2192 \u201Can increase in the population\u201D; \u201CEducation is important\u201D \u2192 \u201Cthe importance of education\u201D। এটি লেখাকে ঘন, আনুষ্ঠানিক ও নৈর্ব্যক্তিক করে এবং paraphrasing-এর মূল হাতিয়ার।",

        sections: [
          {
            code: "9.1",
            title: "What nominalisation is (zero assumption)",
            titleBn: "nominalisation কী",
            content: {
              coreFact:
                "Every action verb and most descriptive adjectives have a noun form in the same word family. Verb to noun: increase \u2192 an increase; grow \u2192 growth; decide \u2192 a decision. Adjective to noun: important \u2192 importance; poor \u2192 poverty; scarce \u2192 scarcity. Once you have the noun, rebuild the sentence around it with a light verb (be, occur, lead to, result in) and a linking preposition (in or of).",
              bn: "প্রতিটি action verb ও বেশিরভাগ adjective-এর একই পরিবারে একটি noun রূপ আছে। noun পেলে সেটিকে ঘিরে বাক্য গড়ো light verb (be, lead to, result in) ও preposition (in/of) দিয়ে।",
            },
          },
          {
            code: "9.2",
            title: "The word families you need",
            titleBn: "যে word family-গুলো দরকার",
            content: {
              coreFact:
                "Build a mental store of these verb-to-noun and adjective-to-noun pairs. They recur endlessly in IELTS topics.",
              bn: "verb → noun এবং adjective → noun জোড়াগুলো মুখস্থ রাখুন। IELTS টপিকে এগুলো বারবার আসে।",
              verbToNoun: [
                { verb: "increase", noun: "an increase" },
                { verb: "grow", noun: "growth" },
                { verb: "develop", noun: "development" },
                { verb: "produce", noun: "production" },
                { verb: "pollute", noun: "pollution" },
                { verb: "expand", noun: "expansion" },
                { verb: "migrate", noun: "migration" },
                { verb: "analyse", noun: "analysis" },
                { verb: "introduce", noun: "the introduction" },
                { verb: "reduce", noun: "a reduction" },
                { verb: "improve", noun: "an improvement" },
                { verb: "decline", noun: "a decline" },
                { verb: "consume", noun: "consumption" },
                { verb: "decide", noun: "a decision" },
                { verb: "fail", noun: "a failure" },
                { verb: "invest", noun: "investment" },
                { verb: "contribute", noun: "a contribution" },
                { verb: "apply", noun: "an application" },
              ],
              adjectiveToNoun: [
                { adj: "important", noun: "importance" },
                { adj: "poor", noun: "poverty" },
                { adj: "scarce", noun: "scarcity" },
              ],
            },
          },
          {
            code: "9.3",
            title: "How to restructure a sentence around the noun",
            titleBn: "কীভাবে noun ঘিরে বাক্য গড়বে",
            content: {
              coreFact:
                "Move 1: \u201CThere was / occurred\u201D plus the noun. Move 2: Make the noun the subject and use a cause-and-effect verb (the densest version): \u201CPopulation growth led to housing scarcity.\u201D Move 3: Adjective to \u201Cthe X of\u201D phrase: \u201Cthe importance of education.\u201D",
              bn: "তিনটি কৌশল: (১) There was a \u2026 in \u2026 + noun; (২) noun-কে subject বানিয়ে cause-effect verb (led to, resulted in) দিয়ে দুই clause-কে এক ঘন clause-এ পরিণত করা; (৩) adjective \u2192 the \u2026 of \u2026। দ্বিতীয়টিই সবচেয়ে academic।",
            },
          },
          {
            code: "9.4",
            title: "Why it reads as academic, and the paraphrasing payoff",
            titleBn: "কেন academic, ও paraphrasing সুবিধা",
            content: {
              coreFact:
                "\u201CPopulation growth led to housing scarcity\u201D is denser, more objective, and sits in the register Task 2 rewards. Nominalisation is also the fastest way to reword a prompt without repeating it: \u201Cthe number of cars increased\u201D becomes \u201Cthere was a rise in the number of cars.\u201D",
              bn: "noun-ভিত্তিক বাক্য ঘন, নৈর্ব্যক্তিক ও academic। এটি prompt পুনর্লিখনেরও দ্রুততম উপায়: \u201Cthe number of cars increased\u201D \u2192 \u201Cthere was a rise in the number of cars\u201D।",
            },
          },
          {
            code: "L9",
            title: "Common Pitfall · Do not nominalise everything",
            titleBn: "সবকিছু nominalise করবে না",
            content: {
              coreFact:
                "Nominalisation is a seasoning, not the whole meal. Overuse makes writing heavy and lifeless; keep some strong verbs. It can also bury the doer (\u201CA decision was reached\u201D hides who decided). Use it for topic sentences, Task 1 openings, and cause-and-effect statements, and let ordinary verbs carry the rest.",
              bn: "nominalisation মসলা, পুরো খাবার নয়। (১) অতিরিক্ত ব্যবহার লেখাকে ভারী ও প্রাণহীন করে; কিছু শক্তিশালী verb রাখো। (২) এটি কর্তাকে লুকিয়ে ফেলতে পারে; কখনো কর্তা স্পষ্ট করা দরকার। topic sentence, Task 1-এর শুরু ও cause-effect বাক্যে ব্যবহার করো।",
            },
          },
          {
            code: "Impact",
            title: "IELTS Impact · The hallmark of native-level writing",
            titleBn: "নেটিভ-স্তরের লেখার চিহ্ন",
            content: {
              key: "In Task 1, nominalisation both paraphrases the prompt and packs the overview into fewer, denser words. In Task 2, nominalised topic sentences immediately raise the register. Because these noun phrases are also strong vocabulary, they lift Lexical Resource as well as Grammatical Range and Accuracy.",
              examples: [
                "Task 1: The chart reveals a steady rise in energy consumption and a corresponding decline in the use of coal.",
                "Task 2: The rapid expansion of cities has led to a shortage of affordable housing and a deterioration in air quality.",
                "Speaking Part 3: The introduction of stricter regulations would, in my view, bring a noticeable improvement in road safety.",
              ],
            },
          },
        ],

        exercises: [
          {
            code: "9.1",
            title: "Nominalisation Drill",
            instruction:
              "Rewrite each verb-heavy or adjective-heavy sentence into a denser, noun-based academic version. There is more than one good answer.",
            instructionBn:
              "প্রতিটি verb- বা adjective-নির্ভর বাক্যকে ঘন, noun-ভিত্তিক academic রূপে পুনর্লিখন করো। একাধিক সঠিক উত্তর সম্ভব।",
            items: [
              { q: 1, sentence: "The population increased rapidly, which surprised analysts.", answer: "The rapid increase in the population surprised analysts.", explanation: "increased \u2192 the increase in." },
              { q: 2, sentence: "Because the economy grew, unemployment fell.", answer: "Economic growth led to a fall in unemployment.", explanation: "grew \u2192 growth; led to." },
              { q: 3, sentence: "The company expanded quickly, and this created new jobs.", answer: "The company\u2019s rapid expansion created new jobs.", explanation: "expanded \u2192 expansion." },
              { q: 4, sentence: "Clean water is necessary for good health.", answer: "The necessity of clean water for good health is widely recognised.", explanation: "necessary \u2192 the necessity of." },
              { q: 5, sentence: "Education is important for economic development.", answer: "The importance of education for economic development is well established.", explanation: "important \u2192 importance." },
              { q: 6, sentence: "The government decided to raise taxes, and the public welcomed it.", answer: "The government\u2019s decision to raise taxes was welcomed by the public.", explanation: "decided \u2192 decision." },
              { q: 7, sentence: "Because cities expanded, traffic congestion became worse.", answer: "Urban expansion led to worse traffic congestion.", explanation: "expanded \u2192 expansion; led to." },
              { q: 8, sentence: "Prices rose sharply, and this reduced consumer spending.", answer: "The sharp rise in prices reduced consumer spending.", explanation: "rose \u2192 the rise in." },
              { q: 9, sentence: "The factory produced more goods, so pollution increased.", answer: "The increase in factory production led to a rise in pollution.", explanation: "produced \u2192 production; increased \u2192 a rise." },
              { q: 10, sentence: "The policy failed, and this cost the government a great deal.", answer: "The failure of the policy cost the government a great deal.", explanation: "failed \u2192 the failure of." },
              { q: 11, sentence: "Many people migrated to the cities, which put pressure on housing.", answer: "The migration of people to the cities put pressure on housing.", explanation: "migrated \u2192 the migration of." },
              { q: 12, sentence: "The new technology was introduced, and productivity improved.", answer: "The introduction of the new technology brought an improvement in productivity.", explanation: "introduced \u2192 the introduction of; improved \u2192 an improvement." },
              { q: 13, sentence: "Renewable energy is available more widely now, and this has cut emissions.", answer: "The wider availability of renewable energy has cut emissions.", explanation: "available \u2192 availability." },
              { q: 14, sentence: "The scientists analysed the data carefully before they published the results.", answer: "A careful analysis of the data preceded the publication of the results.", explanation: "analysed \u2192 analysis; published \u2192 publication." },
              { q: 15, sentence: "The two regions developed very differently, and this widened inequality.", answer: "The very different development of the two regions widened inequality.", explanation: "developed \u2192 development." },
            ],
          },
        ],

        answerKey: {
          "9.1": [
            { q: 1, answer: "The rapid increase in the population surprised analysts.", why: "increased \u2192 the increase in.", bn: "increased \u2192 the increase in।" },
            { q: 2, answer: "Economic growth led to a fall in unemployment.", why: "grew \u2192 growth; led to." },
            { q: 3, answer: "The company\u2019s rapid expansion created new jobs.", why: "expanded \u2192 expansion." },
            { q: 4, answer: "The necessity of clean water for good health is widely recognised.", why: "necessary \u2192 the necessity of." },
            { q: 5, answer: "The importance of education for economic development is well established.", why: "important \u2192 importance." },
            { q: 6, answer: "The government\u2019s decision to raise taxes was welcomed by the public.", why: "decided \u2192 decision." },
            { q: 7, answer: "Urban expansion led to worse traffic congestion.", why: "expanded \u2192 expansion; led to." },
            { q: 8, answer: "The sharp rise in prices reduced consumer spending.", why: "rose \u2192 the rise in." },
            { q: 9, answer: "The increase in factory production led to a rise in pollution.", why: "produced \u2192 production; increased \u2192 a rise." },
            { q: 10, answer: "The failure of the policy cost the government a great deal.", why: "failed \u2192 the failure of." },
            { q: 11, answer: "The migration of people to the cities put pressure on housing.", why: "migrated \u2192 the migration of." },
            { q: 12, answer: "The introduction of the new technology brought an improvement in productivity.", why: "introduced \u2192 the introduction of; improved \u2192 an improvement." },
            { q: 13, answer: "The wider availability of renewable energy has cut emissions.", why: "available \u2192 availability." },
            { q: 14, answer: "A careful analysis of the data preceded the publication of the results.", why: "analysed \u2192 analysis; published \u2192 publication." },
            { q: 15, answer: "The very different development of the two regions widened inequality.", why: "developed \u2192 development." },
          ],
        },
      },
    },
  });

  console.log("\u2705 Chapter 9 seeded successfully");
}

// ============================================================
// CHAPTER 10 · Full Essay Editing & Proofreading Drills
// ============================================================

async function seedChapter10() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Chapter 10 · Full Essay Editing & Proofreading Drills",
      titleBn: "অধ্যায় ১০ · Full Essay Editing ও Proofreading Drills",
      position: 10,
      difficulty: 3,
      is_published: true,
      body: {
        module: "Module 4 · The Full Workbook",
        intro:
          "In a real essay, every rule fires at once, and your job is to catch the errors yourself, under time pressure, with no answer options. The strongest candidates proofread by category: one focused pass hunting only for one type of error, then another pass for the next. Give each recurring error type a code (SVA, T, A, P, WF, C, WW, COND) and hunt one code per pass.",
        introBn:
          "অধ্যায় ১০-এর মূল কথা: পরীক্ষায় সব নিয়ম একসাথে লাগে; নিজের ভুল নিজে বের করে ঠিক করাই আসল দক্ষতা। সেরা পরীক্ষার্থীরা category ধরে proofread করে: এক পাসে এক ধরনের ভুল খোঁজে। প্রতিটি ভুলের একটি code দাও (SVA, T, A, P, WF, C, WW, COND) এবং প্রতি পাসে একটি code খোঁজো।",

        sections: [
          {
            code: "10.0",
            title: "The error-code system",
            titleBn: "error-code পদ্ধতি",
            content: {
              points: [
                { term: "SVA", en: "Subject-verb agreement: does every verb match its true subject?", bn: "verb কি তার প্রকৃত subject-এর সাথে মেলে?" },
                { term: "T", en: "Tense: is the timeline consistent and correct?", bn: "সময়রেখা সঠিক ও সামঞ্জস্যপূর্ণ কি?" },
                { term: "A", en: "Article / noun number: right article and singular/plural form?", bn: "সঠিক article ও একবচন/বহুবচন?" },
                { term: "P", en: "Preposition: time, place, data, and dependent prepositions correct?", bn: "preposition ঠিক আছে কি?" },
                { term: "WF", en: "Word form: adjective vs adverb, verb vs noun, double comparatives.", bn: "শব্দরূপ ঠিক আছে কি?" },
                { term: "C", en: "Clause / punctuation: fragments, run-ons, comma splices, missing commas.", bn: "clause ও যতিচিহ্ন ঠিক আছে কি?" },
                { term: "WW", en: "Wrong word / collocation: direct-translation errors, wrong linker.", bn: "ভুল শব্দ বা collocation?" },
                { term: "COND", en: "Conditional: are the two halves matched? No \u201Cwill/would\u201D after \u201Cif.\u201D", bn: "conditional-এর দুই অর্ধেক মেলে কি? if-এ will/would নেই তো?" },
              ],
              key: "For most Bangladeshi candidates, two or three codes account for most lost marks, usually A (articles) and SVA (the missing -s). Learn which codes catch you most and drill those first.",
              bn: "বেশিরভাগ বাংলাদেশি পরীক্ষার্থীর দুই-তিনটি code-ই বেশি নম্বর কাটে, সাধারণত A (article) ও SVA। কোন code তোমাকে বেশি ধরে সেটা শিখে আগে সেগুলো অনুশীলন করো।",
            },
          },
          {
            code: "How",
            title: "How to use these drills",
            titleBn: "কীভাবে ব্যবহার করবে",
            content: {
              coreFact:
                "Each drill gives a Band 5.5 essay with errors hidden throughout. (1) Read it once for meaning. (2) Run a separate pass for each code, marking every error. (3) Rewrite the whole essay correctly with a pen. (4) Only then compare with the corrected version. Do not read the key first.",
              bn: "প্রতিটি drill-এ একটি Band 5.5 রচনায় ভুল লুকানো থাকে। (১) একবার অর্থের জন্য পড়ো। (২) প্রতি code-এর জন্য আলাদা পাস দাও। (৩) পুরো রচনা কলমে সঠিক করে লেখো। (৪) তারপরই উত্তর মেলাও। আগে উত্তর দেখো না।",
            },
          },
        ],

        exercises: [
          {
            code: "10.1",
            title: "Passage Editing 1 · Social media",
            instruction:
              "The paragraph below is a Band 5.5 essay with about 12 subject-verb, tense, article, and clause errors. Rewrite the whole paragraph correctly.",
            instructionBn:
              "নিচের অনুচ্ছেদে প্রায় ১২টি ভুল আছে (SVA, tense, article, clause)। পুরো অনুচ্ছেদ সঠিক করে লেখো।",
            paragraph:
              "In these days, social media have become very popular among young people. Many people believes that it improve communication, but I am thinking it also cause many problems. Firstly, students spends too much time on the internet, so they cannot focuses on their study. Secondly, since 2010 the number of cyberbullying cases are increasing rapidly. Although social media connect people who are far away. It also make them isolated from their real family. According to me, government should take step to control this problem. If people will use social media carefully, the society would be more healthy.",
            model:
              "These days, social media has become very popular among young people. Many people believe that it improves communication, but I think it also causes many problems. Firstly, students spend too much time on the internet, so they cannot focus on their studies. Secondly, since 2010 the number of cyberbullying cases has increased rapidly. Although social media connects people who are far away, it also isolates them from their real families. In my opinion, the government should take steps to control this problem. If people use social media carefully, society will be healthier.",
          },
          {
            code: "10.2",
            title: "Passage Editing 2 · Free university education",
            instruction:
              "This Band 5.5 paragraph contains about 15 errors across agreement, article/number, word form, and word choice. Rewrite it correctly.",
            instructionBn:
              "এই Band 5.5 অনুচ্ছেদে প্রায় ১৫টি ভুল আছে (agreement, article/number, word form, word choice)। সঠিক করে লেখো।",
            paragraph:
              "Nowadays, education is play an important role in every society. Some people argues that university education should be free for all student. In my opinion, this idea have both advantage and disadvantage. On the one hand, free education give poor students a chance to improve their life. Moreover, a educated population is benefit for the economy. On the other hand, if government spend too much money on universities, they will not able to fund other important service like health. Also, many student may not take their study seriously if it is free. Therefore, I believe that the university education should be partly free, specially for students who comes from poor family.",
            model:
              "Nowadays, education plays an important role in every society. Some people argue that university education should be free for all students. In my opinion, this idea has both advantages and disadvantages. On the one hand, free education gives poor students a chance to improve their lives. Moreover, an educated population benefits the economy. On the other hand, if the government spends too much money on universities, it will not be able to fund other important services such as health. Also, many students may not take their studies seriously if it is free. Therefore, I believe that university education should be partly free, especially for students who come from poor families.",
          },
          {
            code: "10.3",
            title: "Passage Editing 3 · Environmental pollution",
            instruction:
              "This Band 5.5 paragraph contains about 13 errors including word-form, subject-verb, and number errors. Rewrite it correctly.",
            instructionBn:
              "এই Band 5.5 অনুচ্ছেদে প্রায় ১৩টি ভুল আছে (word-form, SVA, number)। সঠিক করে লেখো।",
            paragraph:
              "Environment pollution is one of the most biggest problem in the world today. In the past, factories was releasing harmful gases without any control. As a result, the air quality in many cities have become very poor. Nowadays, government are trying to reduce pollution, but the progress are slow. If we do not take action now, the future generation will suffers a lot. I think there is many solutions to this problem. For example, people can uses public transport instead of private car. Furthermore, planting more tree can improves the air. By taking these step, we can protect our environment for our children.",
            model:
              "Environmental pollution is one of the biggest problems in the world today. In the past, factories released harmful gases without any control. As a result, the air quality in many cities has become very poor. Nowadays, governments are trying to reduce pollution, but progress is slow. If we do not take action now, future generations will suffer a lot. I think there are many solutions to this problem. For example, people can use public transport instead of private cars. Furthermore, planting more trees can improve the air. By taking these steps, we can protect our environment for our children.",
          },
          {
            code: "10.4",
            title: "Passage Editing 4 · Urbanisation",
            instruction:
              "This Band 5.5 paragraph contains about 15 errors including a fragment, a double comparative, a conditional, and an inversion. Rewrite it correctly.",
            instructionBn:
              "এই Band 5.5 অনুচ্ছেদে প্রায় ১৫টি ভুল আছে (fragment, double comparative, conditional, inversion সহ)। সঠিক করে লেখো।",
            paragraph:
              "Every year, a large number of people moves from village to city for search of better job. This migration have created many problem in urban areas. Since many years, the population of big cities are growing very fast. Because of this. Housing has become expensive and traffic is more worse than before. In villages, on the other hand, there is not enough facility, that is why young people leaves. In my opinion, if the government would develop rural areas, less people will migrate. Also, we should to create more job in the countryside. Only by this way we can solve the problem.",
            model:
              "Every year, a large number of people move from villages to cities in search of a better job. This migration has created many problems in urban areas. For many years, the population of big cities has been growing very fast. Because of this, housing has become expensive and traffic is worse than before. In villages, on the other hand, there are not enough facilities, which is why young people leave. In my opinion, if the government developed rural areas, fewer people would migrate. Also, we should create more jobs in the countryside. Only in this way can we solve the problem.",
          },
          {
            code: "10.5",
            title: "Passage Editing 5 · Remote work",
            instruction:
              "This Band 5.5 paragraph contains about 15 errors including a participle, a \u201Cdespite\u201D clause fault, and a conditional. Rewrite it correctly.",
            instructionBn:
              "এই Band 5.5 অনুচ্ছেদে প্রায় ১৫টি ভুল আছে (participle, \u201Cdespite\u201D clause, conditional সহ)। সঠিক করে লেখো।",
            paragraph:
              "In recent years, more and more company are allowing their employee to work from home. This change has bring many benefits, but it also has some drawback. On the positive side, remote work save time because people does not need to travel. In addition, workers can spends more time with their family. However, some experts believes that working from home reduce productivity. They argue that employees gets distracted easily at home. Despite these challenges are real, I think the advantage outweigh the disadvantage. If companies will provide good support, remote work can be very successful in future.",
            model:
              "In recent years, more and more companies are allowing their employees to work from home. This change has brought many benefits, but it also has some drawbacks. On the positive side, remote work saves time because people do not need to travel. In addition, workers can spend more time with their families. However, some experts believe that working from home reduces productivity. They argue that employees get distracted easily at home. Although these challenges are real, I think the advantages outweigh the disadvantages. If companies provide good support, remote work can be very successful in the future.",
          },
        ],

        answerKey: {
          "10.1": {
            corrected:
              "These days, social media has become very popular among young people. Many people believe that it improves communication, but I think it also causes many problems. Firstly, students spend too much time on the internet, so they cannot focus on their studies. Secondly, since 2010 the number of cyberbullying cases has increased rapidly. Although social media connects people who are far away, it also isolates them from their real families. In my opinion, the government should take steps to control this problem. If people use social media carefully, society will be healthier.",
            corrections: [
              { from: "In these days", to: "These days", reason: "P/WW" },
              { from: "have become", to: "has become", reason: "SVA" },
              { from: "believes", to: "believe", reason: "SVA" },
              { from: "it improve", to: "improves", reason: "SVA" },
              { from: "I am thinking", to: "I think", reason: "T, stative verb" },
              { from: "cause", to: "causes", reason: "SVA" },
              { from: "students spends", to: "spend", reason: "SVA" },
              { from: "cannot focuses", to: "cannot focus", reason: "WF, base verb after modal" },
              { from: "their study", to: "their studies", reason: "A/number" },
              { from: "cases are increasing", to: "has increased", reason: "SVA + T" },
              { from: "far away. It also make", to: "far away, it also isolates", reason: "C fragment + SVA" },
              { from: "their real family", to: "families", reason: "A/number" },
              { from: "According to me", to: "In my opinion", reason: "WW" },
              { from: "government should take step", to: "the government should take steps", reason: "A + number" },
              { from: "If people will use \u2026 would be \u2026 more healthy", to: "If people use \u2026 will be \u2026 healthier", reason: "COND + WF" },
            ],
            bn: "এই অনুচ্ছেদের বেশিরভাগ ভুল SVA (verb-এ -s) ও number (single/plural), আর একটি conditional ও একটি fragment।",
          },
          "10.2": {
            corrected:
              "Nowadays, education plays an important role in every society. Some people argue that university education should be free for all students. In my opinion, this idea has both advantages and disadvantages. On the one hand, free education gives poor students a chance to improve their lives. Moreover, an educated population benefits the economy. On the other hand, if the government spends too much money on universities, it will not be able to fund other important services such as health. Also, many students may not take their studies seriously if it is free. Therefore, I believe that university education should be partly free, especially for students who come from poor families.",
            corrections: [
              { from: "is play", to: "plays", reason: "WF/T, double verb" },
              { from: "argues", to: "argue", reason: "SVA" },
              { from: "all student", to: "all students", reason: "A/number" },
              { from: "idea have", to: "has", reason: "SVA" },
              { from: "advantage and disadvantage", to: "advantages and disadvantages", reason: "A/number" },
              { from: "give", to: "gives", reason: "SVA" },
              { from: "their life", to: "their lives", reason: "A/number" },
              { from: "a educated", to: "an educated", reason: "A" },
              { from: "is benefit for", to: "benefits", reason: "WF, verb/noun" },
              { from: "if government spend \u2026 they will not able", to: "if the government spends \u2026 it will not be able", reason: "A + SVA + missing \u201Cbe\u201D" },
              { from: "service like health", to: "services such as health", reason: "A/number + WW" },
              { from: "many student", to: "students", reason: "A/number" },
              { from: "their study", to: "studies", reason: "A/number" },
              { from: "the university education", to: "university education", reason: "A, general zero article" },
              { from: "specially", to: "especially", reason: "WW" },
              { from: "who comes from poor family", to: "who come from poor families", reason: "SVA + A/number" },
            ],
            bn: "এখানে article/number ও SVA ভুলই প্রধান; specially\u2192especially এবং like\u2192such as শব্দচয়নের ভুল।",
          },
          "10.3": {
            corrected:
              "Environmental pollution is one of the biggest problems in the world today. In the past, factories released harmful gases without any control. As a result, the air quality in many cities has become very poor. Nowadays, governments are trying to reduce pollution, but progress is slow. If we do not take action now, future generations will suffer a lot. I think there are many solutions to this problem. For example, people can use public transport instead of private cars. Furthermore, planting more trees can improve the air. By taking these steps, we can protect our environment for our children.",
            corrections: [
              { from: "Environment pollution", to: "Environmental pollution", reason: "WF, adjective" },
              { from: "most biggest", to: "biggest", reason: "WF, double superlative" },
              { from: "problem", to: "problems", reason: "A/number, \u201Cone of the \u2026\u201D" },
              { from: "factories was releasing", to: "released", reason: "SVA + T" },
              { from: "have become", to: "has become", reason: "SVA" },
              { from: "government are", to: "governments are", reason: "A/number" },
              { from: "the progress are", to: "progress is", reason: "A uncountable + SVA" },
              { from: "the future generation will suffers", to: "future generations will suffer", reason: "A/number + WF base verb" },
              { from: "there is many", to: "there are many", reason: "SVA" },
              { from: "can uses", to: "use", reason: "WF" },
              { from: "private car", to: "cars", reason: "A/number" },
              { from: "more tree can improves", to: "trees can improve", reason: "A/number + WF" },
              { from: "these step", to: "steps", reason: "A/number" },
            ],
            bn: "Environment\u2192Environmental ও most biggest\u2192biggest word-form ভুল; বাকিগুলো SVA ও number।",
          },
          "10.4": {
            corrected:
              "Every year, a large number of people move from villages to cities in search of a better job. This migration has created many problems in urban areas. For many years, the population of big cities has been growing very fast. Because of this, housing has become expensive and traffic is worse than before. In villages, on the other hand, there are not enough facilities, which is why young people leave. In my opinion, if the government developed rural areas, fewer people would migrate. Also, we should create more jobs in the countryside. Only in this way can we solve the problem.",
            corrections: [
              { from: "a large number of people moves", to: "move", reason: "SVA, \u201Ca number of\u201D is plural" },
              { from: "from village to city", to: "villages to cities", reason: "A/number" },
              { from: "for search of", to: "in search of", reason: "P/WW" },
              { from: "better job", to: "a better job", reason: "A" },
              { from: "have created", to: "has created", reason: "SVA" },
              { from: "many problem", to: "problems", reason: "A/number" },
              { from: "Since many years", to: "For many years", reason: "P" },
              { from: "population \u2026 are growing", to: "has been growing", reason: "SVA + T" },
              { from: "Because of this. Housing", to: "Because of this, housing", reason: "C, fragment/punctuation" },
              { from: "more worse", to: "worse", reason: "WF, double comparative" },
              { from: "there is not enough facility", to: "there are not enough facilities", reason: "SVA + A/number" },
              { from: "that is why \u2026 leaves", to: "which is why \u2026 leave", reason: "WW relative + SVA" },
              { from: "if \u2026 would develop \u2026 less people will migrate", to: "if \u2026 developed \u2026 fewer people would migrate", reason: "COND + WW less/fewer" },
              { from: "should to create", to: "should create", reason: "WF, no \u201Cto\u201D after modal" },
              { from: "more job", to: "jobs", reason: "A/number" },
              { from: "Only by this way we can solve", to: "Only in this way can we solve", reason: "WW + inversion" },
            ],
            bn: "এই অনুচ্ছেদে একটি fragment, একটি double comparative, একটি conditional এবং শেষে একটি inversion আছে; বাকিগুলো number ও preposition।",
          },
          "10.5": {
            corrected:
              "In recent years, more and more companies are allowing their employees to work from home. This change has brought many benefits, but it also has some drawbacks. On the positive side, remote work saves time because people do not need to travel. In addition, workers can spend more time with their families. However, some experts believe that working from home reduces productivity. They argue that employees get distracted easily at home. Although these challenges are real, I think the advantages outweigh the disadvantages. If companies provide good support, remote work can be very successful in the future.",
            corrections: [
              { from: "more company are", to: "companies are", reason: "A/number" },
              { from: "their employee", to: "employees", reason: "A/number" },
              { from: "has bring", to: "has brought", reason: "T, participle" },
              { from: "some drawback", to: "drawbacks", reason: "A/number" },
              { from: "remote work save", to: "saves", reason: "SVA" },
              { from: "people does not need", to: "do not need", reason: "SVA" },
              { from: "can spends", to: "spend", reason: "WF, base verb after modal" },
              { from: "their family", to: "families", reason: "A/number" },
              { from: "some experts believes", to: "believe", reason: "SVA" },
              { from: "reduce", to: "reduces", reason: "SVA" },
              { from: "employees gets", to: "get", reason: "SVA" },
              { from: "Despite these challenges are real", to: "Although these challenges are real", reason: "C/WW, \u201Cdespite\u201D cannot take a clause" },
              { from: "the advantage outweigh the disadvantage", to: "the advantages outweigh the disadvantages", reason: "A/number + SVA" },
              { from: "If companies will provide", to: "If companies provide", reason: "COND" },
              { from: "in future", to: "in the future", reason: "A" },
            ],
            bn: "এখানে has bring\u2192has brought (participle), Despite+clause\u2192Although, এবং একটি conditional মূল দেখার বিষয়; বাকিগুলো number ও SVA।",
          },
        },
      },
    },
  });

  console.log("\u2705 Chapter 10 seeded successfully");
}

// ============================================================
// CHAPTER 11 · Exhaustive Answer Keys & Step-by-Step Explanations
// ============================================================

async function seedChapter11() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Chapter 11 · Exhaustive Answer Keys & Step-by-Step Explanations",
      titleBn: "অধ্যায় ১১ · সম্পূর্ণ উত্তরমালা ও ধাপে ধাপে ব্যাখ্যা",
      position: 11,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Module 4 · The Full Workbook",
        intro:
          "This chapter gathers the complete answer key for every exercise in Chapters 1 to 10 into one place, so you can check your work without flicking between chapters. Each answer gives the correct form, a short reason in clear English, and, where the error is one that Bangla speakers make often, a supporting Bangla (BN) note explaining why the correct answer works and why the common mistake fails.\n\nUse it honestly: attempt every exercise with a pen first, then check here. The reason matters more than the answer. If you got an item wrong, note its error code (SVA, T, A, P, WF, C, WW, COND) and add it to your personal audit list from Chapter 10. Two or three codes usually account for most of your lost marks; drill those.",
        introBn:
          "অধ্যায় ১১-এর মূল কথা: এখানে অধ্যায় ১ থেকে ১০-এর প্রতিটি অনুশীলনের সম্পূর্ণ উত্তর এক জায়গায় আছে, প্রতিটির সঙ্গে সংক্ষিপ্ত কারণ (ইংরেজিতে) ও দরকারে বাংলা টীকা। আগে কলম দিয়ে চেষ্টা করুন, তারপর মিলিয়ে দেখুন; ভুল হলে তার error code টুকে রাখুন।",
        sections: [
          {
            code: "11.0",
            title: "How to use this chapter",
            titleBn: "কীভাবে ব্যবহার করবে",
            content: {
              coreFact:
                "The reason matters more than the answer. If you got an item wrong, note its error code (SVA, T, A, P, WF, C, WW, COND) and add it to your personal audit list from Chapter 10. Two or three codes usually account for most of your lost marks; drill those first.",
              bn: "ভুল হলে error code টুকে রাখুন এবং Chapter 10-এর personal audit list-এ যোগ করুন। দুই-তিনটি code-ই বেশিরভাগ নম্বর কাটে।",
            },
          },
          {
            code: "Note",
            title: "Master index of all answer keys",
            titleBn: "সব উত্তরমালার মাস্টার ইনডেক্স",
            content: {
              coreFact:
                "In this database each individual chapter (2–10) already stores its complete answerKey object inside its own lesson body. This Chapter 11 lesson serves as the official consolidation point and reference so that the book structure matches the printed PDF exactly. Nothing from Chapters 2–10 is missing; every exercise, model answer, and BN note is already present inside the respective chapter records.",
              bn: "ডাটাবেসে প্রতিটি অধ্যায়ের (২–১০) নিজের body-তে সম্পূর্ণ answerKey আগে থেকেই আছে। অধ্যায় ১১ PDF-এর কাঠামোর সাথে মিল রাখতে এবং এক জায়গায় রেফারেন্স হিসেবে রাখা হয়েছে। কোনো কিছু বাদ যায়নি।",
            },
          },
        ],
        exercises: [],
        answerKey: {
          note:
            "All individual chapter answer keys from Chapters 2–10 are already embedded inside each chapter’s body.answerKey field. This Chapter 11 record completes the book structure so that nothing from the original PDF is missing.",
        },
      },
    },
  });

  console.log("\u2705 Chapter 11 seeded successfully");
}

// ============================================================
// RUNNER · seed all chapters in order, then disconnect
// ============================================================

async function main() {
  await seedChapter2();
  await seedChapter3();
  await seedChapter4();
  await seedChapter5();
  await seedChapter6();
  await seedChapter7();
  await seedChapter8();
  await seedChapter9();
  await seedChapter10();
  await seedChapter11();
  console.log("\n\uD83C\uDF89 All chapters (2\u201311) seeded successfully. Nothing is missing.");
}

main()
  .catch((e) => {
    console.error("\u274C Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });