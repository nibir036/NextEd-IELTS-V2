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
  const filePath = "data/vocab/chapter6_data/Chapter6.json";

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const chapter = JSON.parse(raw);

  console.log("Loaded Chapter 6 JSON");

  /*
   * Validate the normalized Chapter 6 structure
   * before saving it to Prisma.
   */

  if (chapter.chapter?.number !== 6) {
    throw new Error(
      "Invalid Chapter 6 JSON: chapter number must be 6"
    );
  }

  if (!Array.isArray(chapter.blocks)) {
    throw new Error(
      "Invalid Chapter 6 JSON: blocks array not found"
    );
  }

  const exercises = chapter.blocks.filter(
    (block: any) => block.type === "exercise"
  );

  const speakingSimulations = chapter.blocks.filter(
    (block: any) => block.type === "speaking_simulation"
  );

  if (speakingSimulations.length !== 5) {
    throw new Error(
      `Invalid Chapter 6 JSON: expected 5 speaking simulations, found ${speakingSimulations.length}`
    );
  }

  /*
   * Chapter 6 contains:
   * - 20 sentence transformation questions
   * - 5 full essay rewrites
   * - 5 speaking simulations
   */

  const sentenceExercise = exercises.find(
    (block: any) =>
      block.section === "sentence_transformations" ||
      block.title?.toLowerCase().includes("sentence transformation")
  );

  if (!sentenceExercise) {
    throw new Error(
      "Invalid Chapter 6 JSON: sentence transformation exercise not found"
    );
  }

  if (sentenceExercise.questions?.length !== 20) {
    throw new Error(
      `Invalid Chapter 6 JSON: expected 20 sentence transformations, found ${
        sentenceExercise.questions?.length ?? 0
      }`
    );
  }

  const essayExercise = exercises.find(
    (block: any) =>
      block.section === "full_essay_rewrites" ||
      block.title?.toLowerCase().includes("full essay")
  );

  if (!essayExercise) {
    throw new Error(
      "Invalid Chapter 6 JSON: full essay rewrite block not found"
    );
  }

  if (essayExercise.essays?.length !== 5) {
    throw new Error(
      `Invalid Chapter 6 JSON: expected 5 essays, found ${
        essayExercise.essays?.length ?? 0
      }`
    );
  }

  console.log("✅ Chapter 6 validation passed");
  console.log(
    `   Sentence transformations: ${sentenceExercise.questions.length}`
  );
  console.log(`   Essays: ${essayExercise.essays.length}`);
  console.log(
    `   Speaking simulations: ${speakingSimulations.length}`
  );

  /*
   * Store the complete normalized JSON inside lessons.body.
   *
   * JSON.stringify preserves the entire Chapter 6 structure.
   */

  const result = await prisma.lessons.upsert({
    where: {
      id: "11111111-1111-1111-1111-111111111006",
    },

    update: {
      section: "vocab",
      title:
        chapter.chapter?.title ??
        "Chapter 6: Full Practice and Mock Tests",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 6,
      is_published: true,
      updated_at: new Date(),
    },

    create: {
      id: "11111111-1111-1111-1111-111111111006",
      section: "vocab",
      title:
        chapter.chapter?.title ??
        "Chapter 6: Full Practice and Mock Tests",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 6,
      is_published: true,
    },
  });

  console.log("=================================");
  console.log("Chapter 6 imported successfully");
  console.log("Lesson ID:", result.id);
  console.log("Title:", result.title);
  console.log("Section:", result.section);
  console.log("Position:", result.position);
  console.log("=================================");
}

main()
  .catch((error) => {
    console.error("Import failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });