import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================================
// CHAPTER 1 · Subject-Verb Agreement & Sentence Foundations
// ============================================================
async function seedChapter1() {
  await prisma.lessons.create({
    data: {
      section: "grammar",
      title: "Chapter 1 · Subject-Verb Agreement & Sentence Foundations",
      titleBn: "অধ্যায় ১ · Subject-Verb Agreement ও বাক্যের ভিত্তি",
      position: 1,
      difficulty: 1,
      is_published: true,
      body: {
        module: "Module 1 · The Foundational Zero-to-Hero Grammar Engine",
        intro:
          "Before any IELTS-specific technique, your sentences have to be mechanically sound. This module fixes the four faults that quietly lower your score on every single line: verbs that do not agree with their subjects, tenses that put events in the wrong time, missing or misused articles, and wrong prepositions. Chapter 1 starts with the most visible of them — subject-verb agreement.",
        introBn:
          "অধ্যায় ১-এর মূল কথা: subject-verb agreement মানে verb-কে তার প্রকৃত subject-এর সংখ্যা অনুযায়ী মেলানো। বাংলায় verb singular/plural অনুযায়ী বদলায় না, তাই ইংরেজিতে -s বাদ পড়া ও is/are ভুল হওয়া সবচেয়ে সাধারণ। এই অধ্যায় সেই অভ্যাস ভাঙে।",

        sections: [
          {
            code: "1.1",
            title: "First, the building blocks (start here even if you think you know)",
            titleBn: "বাক্যের মৌলিক অংশ",
            content: {
              points: [
                {
                  term: "Subject",
                  en: "The person or thing the sentence is about, the one that does the action. In “Students study hard,” the subject is students.",
                  bn: "বাক্য যার সম্পর্কে, যে কাজ করে।",
                },
                {
                  term: "Verb",
                  en: "The action or the state of being. In “Students study hard,” the verb is study. The verb be (is, am, are, was, were) shows a state.",
                  bn: "কাজ বা অবস্থা।",
                },
                {
                  term: "Object",
                  en: "The person or thing that receives the action. In “Students use the internet,” the object is the internet.",
                  bn: "যে কাজ গ্রহণ করে।",
                },
              ],
              key: "The normal English order is Subject + Verb + Object (S + V + O). Bangla is Subject-Object-Verb, so the verb often drifts to the end out of habit — check that first.",
              bn: "ইংরেজি: Subject + Verb + Object। বাংলা: Subject + Object + Verb। তাই verb শেষে চলে যাওয়ার প্রবণতা থাকে।",
            },
          },
          {
            code: "1.2",
            title: "The core rule",
            titleBn: "মূল নিয়ম",
            content: {
              points: [
                {
                  term: "Singular subject (he, she, it, one thing)",
                  en: "verb + s / es → The student works hard.",
                  bn: "একবচন subject → verb-এ -s/-es।",
                },
                {
                  term: "Plural subject (they, more than one) / I / you / we",
                  en: "base verb, no -s → The students work hard.",
                  bn: "বহুবচন → base verb, -s নেই।",
                },
              ],
              key: "The -s is reversed between nouns and verbs. On a noun -s means plural; on a verb -s means singular. A correct sentence often has an -s on either the noun or the verb, but not both.",
              bn: "noun-এ -s = বহুবচন, verb-এ -s = একবচন। এই উল্টো নিয়মই সবচেয়ে বেশি ভুলের কারণ।",
            },
          },
          {
            code: "1.3",
            title: "The eight cases that actually decide your mark",
            titleBn: "আটটি গুরুত্বপূর্ণ কেস",
            cases: [
              {
                title: "Case 1 · Words between the subject and the verb",
                rule: "The verb agrees with the true subject, never with the nearest noun. Mentally delete every word between subject and verb.",
                examples: [
                  {
                    wrong: "The list of items are on the table.",
                    right: "The list of items is on the table.",
                    why: "Subject is “list” (singular), not “items”.",
                  },
                ],
              },
              {
                title: "Case 2 · “The number of” versus “a number of”",
                rule: "“The number of + plural” → singular verb. “A number of + plural” → plural verb.",
                examples: [
                  {
                    wrong: "The number of tourists have increased.",
                    right: "The number of tourists has increased.",
                    why: "“The number” is the true subject (singular).",
                  },
                  {
                    right: "A number of tourists were waiting outside.",
                    why: "“A number of” = several → plural.",
                  },
                ],
              },
              {
                title: "Case 3 · Collective nouns",
                rule: "government, team, committee, family, company, public, staff → treat as singular unit in IELTS academic writing.",
                examples: [
                  {
                    right: "The government is planning three new policies.",
                    why: "Collective noun as one unit.",
                  },
                ],
              },
              {
                title: "Case 4 · Indefinite pronouns are singular",
                rule: "each, every, everyone, somebody, anyone, nobody, either, neither, one → always singular.",
                examples: [
                  {
                    wrong: "Each of the students have a laptop.",
                    right: "Each of the students has a laptop.",
                    why: "“Each of” is always singular.",
                  },
                ],
              },
              {
                title: "Case 5 · neither…nor / either…or / not only…but also",
                rule: "Verb agrees with the nearer subject (the one closest to the verb).",
                examples: [
                  {
                    right: "Neither the manager nor the employees were informed.",
                    why: "Nearer subject = employees (plural).",
                  },
                  {
                    right: "Not only the students but also the teacher was worried.",
                    why: "Nearer subject = teacher (singular).",
                  },
                ],
              },
              {
                title: "Case 6 · Compound subjects joined by “and”",
                rule: "Two subjects joined by and are almost always plural.",
                examples: [
                  {
                    right: "Poverty and unemployment remain serious problems.",
                    why: "Two subjects → plural verb.",
                  },
                ],
              },
              {
                title: "Case 7 · There is / There are",
                rule: "After “there”, the verb agrees with the real subject that comes after the verb.",
                examples: [
                  {
                    wrong: "There is several reasons for this decline.",
                    right: "There are several reasons for this decline.",
                    why: "Real subject = reasons (plural).",
                  },
                ],
              },
              {
                title: "Case 8 · Uncountable nouns, amounts, inverted structures",
                rule: "Uncountable nouns (information, advice, knowledge, research, equipment…) are singular. Amounts of time/money/distance take singular verbs.",
                examples: [
                  {
                    wrong: "A large amount of information were collected.",
                    right: "A large amount of information was collected.",
                    why: "Information is uncountable → singular.",
                  },
                  {
                    right: "Ten years is a long time to wait.",
                    why: "A period of time is treated as one quantity.",
                  },
                ],
              },
            ],
          },
          {
            code: "L1",
            title: "L1 Error Fixer · Why Bangla speakers make agreement mistakes",
            titleBn: "কেন বাংলাভাষীরা agreement ভুল করে",
            content: {
              coreFact:
                "The Bangla verb does not change its ending to match singular or plural subjects. সে বাজারে যায় / তারা বাজারে যায় — the verb form is identical. Because your first language never trained the singular-plural switch, your ear does not warn you when the English -s is missing.",
              errorTypes: [
                {
                  type: "The dropped third-person -s",
                  wrong: ["He go to the market every day.", "The population increase rapidly."],
                  right: ["He goes to the market every day.", "The population increases rapidly."],
                },
                {
                  type: "The dropped or wrong is / are",
                  wrong: ["Many people is using the internet.", "The graph show that pollution have increased."],
                  right: ["Many people are using the internet.", "The graph shows that pollution has increased."],
                },
              ],
              bn: "বাংলা verb singular/plural অনুযায়ী বদলায় না (সে যায় / তারা যায়, একই রূপ)। তাই ইংরেজিতে -s বাদ পড়া ও is/are ভুল হওয়া সবচেয়ে সাধারণ। কান দিয়ে ধরা যায় না, তাই লেখার পর ইচ্ছাকৃতভাবে প্রতিটি verb মিলিয়ে দেখতে হয়।",
            },
          },
          {
            code: "Impact",
            title: "IELTS Impact · Why this one rule caps your band",
            titleBn: "কেন এই নিয়ম ব্যান্ড আটকে রাখে",
            content: {
              key: "A script with recurring agreement errors cannot reach Band 7 in GRA, because Band 7 requires that the majority of sentences are error-free. The damage is heaviest in Task 1, which lives on subjects like “the number of”, “the proportion of”, “the figure for”.",
              examples: [
                "Task 1: The number of visitors has risen sharply, whereas the proportion of local tourists has fallen.",
                "Task 2: Although the government provides free healthcare, demand continues to outstrip supply.",
                "Speaking Part 2: My family lives in a small town, and each of my brothers has a different job.",
              ],
            },
          },
        ],

        exercises: [
          {
            code: "1.1",
            title: "Identification and Correction",
            instruction:
              "Each sentence below contains a subject-verb agreement error, except a few which are already correct. Rewrite each faulty sentence correctly, and for the correct ones write “Correct.”",
            instructionBn:
              "প্রতিটি বাক্যে subject-verb agreement ভুল আছে (কয়েকটি সঠিক)। ভুলগুলো ঠিক করে লেখো; সঠিকগুলোতে “Correct” লেখো।",
            items: [
              {
                q: 1,
                sentence: "The list of approved candidates are posted on the noticeboard.",
                answer: "The list of approved candidates is posted on the noticeboard.",
                explanation: "Subject is “list” (singular), not “candidates”.",
              },
              {
                q: 2,
                sentence: "Each of the students have submitted their assignment.",
                answer: "Each of the students has submitted his or her assignment.",
                explanation: "“Each of” is always singular.",
              },
              {
                q: 3,
                sentence: "The government are introducing a new tax next year.",
                answer: "The government is introducing a new tax next year.",
                explanation: "Collective noun as one unit → singular.",
              },
              {
                q: 4,
                sentence: "Neither the teacher nor the students was ready for the test.",
                answer: "Neither the teacher nor the students were ready for the test.",
                explanation: "Nearer subject = students (plural).",
              },
              {
                q: 5,
                sentence: "The number of accidents on this road have increased.",
                answer: "The number of accidents on this road has increased.",
                explanation: "“The number of” is singular.",
              },
              {
                q: 6,
                sentence: "There is several reasons for this decline.",
                answer: "There are several reasons for this decline.",
                explanation: "Real subject “reasons” is plural.",
              },
              {
                q: 7,
                sentence: "A large amount of information were collected during the survey.",
                answer: "A large amount of information was collected during the survey.",
                explanation: "Information is uncountable → singular.",
              },
              {
                q: 8,
                sentence: "Ten kilometres are a long way to walk in the heat.",
                answer: "Ten kilometres is a long way to walk in the heat.",
                explanation: "A single distance is treated as one quantity.",
              },
              {
                q: 9,
                sentence: "The committee has agreed on the final budget.",
                answer: "Correct",
                explanation: "Committee as one unit takes singular “has”.",
              },
              {
                q: 10,
                sentence: "The quality of the roads in rural areas are very poor.",
                answer: "The quality of the roads in rural areas is very poor.",
                explanation: "Subject is “quality” (singular).",
              },
              {
                q: 11,
                sentence: "Poverty and illiteracy remains major obstacles to development.",
                answer: "Poverty and illiteracy remain major obstacles to development.",
                explanation: "Two subjects joined by “and” → plural.",
              },
              {
                q: 12,
                sentence: "Everyone in the two classes were given a certificate.",
                answer: "Everyone in the two classes was given a certificate.",
                explanation: "“Everyone” is singular.",
              },
              {
                q: 13,
                sentence: "Not only the manager but also the workers is unhappy with the plan.",
                answer: "Not only the manager but also the workers are unhappy with the plan.",
                explanation: "Nearer subject = workers (plural).",
              },
              {
                q: 14,
                sentence: "The data collected over ten years show a clear pattern.",
                answer: "Correct",
                explanation: "“Data … show” is acceptable (plural/mass).",
              },
              {
                q: 15,
                sentence: "My knowledge of these topics are limited.",
                answer: "My knowledge of these topics is limited.",
                explanation: "“Knowledge” is uncountable and singular.",
              },
              {
                q: 16,
                sentence: "A number of students has failed to register on time.",
                answer: "A number of students have failed to register on time.",
                explanation: "“A number of” = several → plural.",
              },
              {
                q: 17,
                sentence: "The population of the coastal cities have grown rapidly.",
                answer: "The population of the coastal cities has grown rapidly.",
                explanation: "Subject is “population” (singular).",
              },
              {
                q: 18,
                sentence: "Neither of the two proposals seem practical.",
                answer: "Neither of the two proposals seems practical.",
                explanation: "“Neither” is singular.",
              },
              {
                q: 19,
                sentence: "Statistics is a subject that many students find difficult.",
                answer: "Correct",
                explanation: "“Statistics” as the name of a subject is singular.",
              },
              {
                q: 20,
                sentence: "The equipment in the laboratories need to be replaced.",
                answer: "The equipment in the laboratories needs to be replaced.",
                explanation: "“Equipment” is uncountable → singular.",
              },
            ],
          },
          {
            code: "1.2",
            title: "IELTS Essay Editing",
            instruction:
              "The paragraph below is from a Band 5.5 Task 2 essay. It contains ten subject-verb agreement errors. Find them, then rewrite the whole paragraph correctly.",
            instructionBn:
              "নিচের Band 5.5 অনুচ্ছেদে দশটি subject-verb agreement ভুল আছে। খুঁজে বের করে পুরো অনুচ্ছেদ সঠিক করে লেখো।",
            paragraph:
              "Nowadays, the number of people who works from home have increased dramatically. There is many reasons for this change. First, technology allow employees to stay connected from anywhere. Second, each of the major companies now offer flexible arrangements. However, some managers believes that productivity fall when staff is not in the office. In my opinion, the advantages of remote work outweighs the disadvantages, and this trend are likely to continue.",
            model:
              "Nowadays, the number of people who work from home has increased dramatically. There are many reasons for this change. First, technology allows employees to stay connected from anywhere. Second, each of the major companies now offers flexible arrangements. However, some managers believe that productivity falls when staff are not in the office. In my opinion, the advantages of remote work outweigh the disadvantages, and this trend is likely to continue.",
          },
        ],

        answerKey: {
          "1.1": [
            {
              q: 1,
              answer: "The list of approved candidates is posted on the noticeboard.",
              why: "Subject is “list” (singular), not “candidates”.",
              bn: "subject “list”, মাঝের “of candidates” বাদ দিলে বোঝা যায়।",
            },
            {
              q: 2,
              answer: "Each of the students has submitted his or her assignment.",
              why: "“Each of” is always singular.",
              bn: "each of সবসময় singular, তাই has।",
            },
            {
              q: 3,
              answer: "The government is introducing a new tax next year.",
              why: "Collective noun as one unit takes singular verb in academic writing.",
            },
            {
              q: 4,
              answer: "Neither the teacher nor the students were ready for the test.",
              why: "With neither…nor the verb agrees with the nearer subject (students = plural).",
            },
            {
              q: 5,
              answer: "The number of accidents on this road has increased.",
              why: "“The number of” is singular.",
              bn: "“the number of” সবসময় singular।",
            },
            {
              q: 6,
              answer: "There are several reasons for this decline.",
              why: "Real subject “reasons” is plural.",
            },
            {
              q: 7,
              answer: "A large amount of information was collected during the survey.",
              why: "Information is uncountable → singular.",
              bn: "information uncountable, singular।",
            },
            {
              q: 8,
              answer: "Ten kilometres is a long way to walk in the heat.",
              why: "A single distance is treated as one quantity → singular.",
            },
            {
              q: 9,
              answer: "Correct",
              why: "Committee as one unit takes singular “has”.",
            },
            {
              q: 10,
              answer: "The quality of the roads in rural areas is very poor.",
              why: "Subject is “quality” (singular).",
            },
            {
              q: 11,
              answer: "Poverty and illiteracy remain major obstacles to development.",
              why: "Two subjects joined by “and” → plural.",
            },
            {
              q: 12,
              answer: "Everyone in the two classes was given a certificate.",
              why: "“Everyone” is singular.",
              bn: "everyone singular, তাই was।",
            },
            {
              q: 13,
              answer: "Not only the manager but also the workers are unhappy with the plan.",
              why: "Nearer subject = workers (plural).",
            },
            {
              q: 14,
              answer: "Correct",
              why: "“Data … show” is acceptable (plural/mass treatment).",
            },
            {
              q: 15,
              answer: "My knowledge of these topics is limited.",
              why: "“Knowledge” is uncountable and singular.",
            },
            {
              q: 16,
              answer: "A number of students have failed to register on time.",
              why: "“A number of” means several → plural verb.",
            },
            {
              q: 17,
              answer: "The population of the coastal cities has grown rapidly.",
              why: "Subject is “population” (singular).",
            },
            {
              q: 18,
              answer: "Neither of the two proposals seems practical.",
              why: "“Neither” is singular.",
              bn: "neither singular, তাই seems।",
            },
            {
              q: 19,
              answer: "Correct",
              why: "“Statistics” as the name of a subject is singular.",
            },
            {
              q: 20,
              answer: "The equipment in the laboratories needs to be replaced.",
              why: "“Equipment” is uncountable → singular.",
              bn: "equipment uncountable, singular।",
            },
          ],
          "1.2": {
            corrected:
              "Nowadays, the number of people who work from home has increased dramatically. There are many reasons for this change. First, technology allows employees to stay connected from anywhere. Second, each of the major companies now offers flexible arrangements. However, some managers believe that productivity falls when staff are not in the office. In my opinion, the advantages of remote work outweigh the disadvantages, and this trend is likely to continue.",
            corrections: [
              { from: "who works", to: "who work", reason: "SVA – “who” refers to “people” (plural)" },
              { from: "have increased", to: "has increased", reason: "SVA – subject is “the number” (singular)" },
              { from: "There is many reasons", to: "There are many reasons", reason: "SVA – real subject “reasons” is plural" },
              { from: "technology allow", to: "technology allows", reason: "SVA – singular third person" },
              { from: "each of … offer", to: "offers", reason: "SVA – “each of” is singular" },
              { from: "managers believes", to: "believe", reason: "SVA – “managers” is plural" },
              { from: "productivity fall", to: "falls", reason: "SVA – “productivity” is singular" },
              { from: "staff is not", to: "staff are not", reason: "SVA – focus on individual workers" },
              { from: "outweighs", to: "outweigh", reason: "SVA – subject is “advantages” (plural)" },
              { from: "this trend are", to: "this trend is", reason: "SVA – “trend” is singular" },
            ],
            bn: "এই অনুচ্ছেদের দশটি ভুলই subject খুঁজে বের করে verb মেলানোর অভাবে হয়েছে। মূল কৌশল: subject ও verb-এর মাঝের সব শব্দ বাদ দিয়ে subject-টি বের করা, তারপর singular না plural সেই অনুযায়ী verb বসানো।",
          },
        },
      },
    },
  });

  console.log("✅ Chapter 1 seeded successfully");
}

// ============================================================
// RUNNER
// ============================================================
seedChapter1()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });