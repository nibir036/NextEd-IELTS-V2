import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import fs from "fs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});


async function main() {
  const raw = fs.readFileSync(
    "data/vocab/word-bank-test.json",
    "utf-8"
  );

  const data = JSON.parse(raw);

  for (const [index, item] of data.vocabulary.entries()) {
    await prisma.vocabulary.create({
      data: {
        word: item.word,
        part_of_speech: item.part_of_speech,
        meaning: item.meaning,
        translation_bn: item.translation_bn,

        example: item.example,
        ielts_usage: item.ielts_usage,

        past: item.past,
        past_participle: item.past_participle,
        ing_form: item.ing_form,

        noun_form: item.noun_form,
        adjective_form: item.adjective_form,
        adverb_form: item.adverb_form,

        synonyms: item.synonyms ?? [],
        antonyms: item.antonyms ?? [],
        collocations: item.collocations ?? [],

        topic: item.topic,

        lesson_id: null,
        position: index + 1
      }
    });

    console.log(`Imported: ${item.word}`);
  }

  console.log("Done");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });