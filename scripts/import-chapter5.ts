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
  const filePath = "data/vocab/chapter5_data/Chapter5.json";

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const chapter = JSON.parse(raw);

  console.log("Loaded Chapter 5 JSON");

  /*
   * ============================================
   * VALIDATE NORMALIZED CHAPTER 5 STRUCTURE
   * ============================================
   */

  // Validate chapter number
  if (chapter.chapter?.number !== 5) {
    throw new Error(
      "Invalid Chapter 5 JSON: chapter number must be 5"
    );
  }

  // Validate register rule block
  const registerRule = chapter.blocks?.find(
    (block: any) => block.type === "register_rule"
  );

  if (!registerRule) {
    throw new Error(
      "Invalid Chapter 5 JSON: register_rule block not found"
    );
  }

  // Validate Speaking idioms
  const speakingIdioms = chapter.blocks?.find(
    (block: any) =>
      block.type === "idiom_list" &&
      block.id === "ch5-speaking-idioms"
  );

  if (!speakingIdioms) {
    throw new Error(
      "Invalid Chapter 5 JSON: Speaking idioms block not found"
    );
  }

  if (speakingIdioms.items?.length !== 50) {
    throw new Error(
      `Invalid Chapter 5 JSON: expected 50 Speaking idioms, found ${speakingIdioms.items?.length}`
    );
  }

  // Validate Writing collocations
  const writingCollocations = chapter.blocks?.find(
    (block: any) =>
      block.type === "collocation_list" &&
      block.id === "ch5-writing-collocations"
  );

  if (!writingCollocations) {
    throw new Error(
      "Invalid Chapter 5 JSON: Writing collocations block not found"
    );
  }

  if (writingCollocations.items?.length !== 50) {
    throw new Error(
      `Invalid Chapter 5 JSON: expected 50 Writing collocations, found ${writingCollocations.items?.length}`
    );
  }

  // Validate exercises
  const exercises = chapter.blocks?.filter(
    (block: any) => block.type === "exercise"
  );

  if (exercises?.length !== 2) {
    throw new Error(
      `Invalid Chapter 5 JSON: expected 2 exercises, found ${exercises?.length}`
    );
  }

  // Find Exercise 5.1
  const exercise51 = exercises.find(
    (exercise: any) =>
      exercise.id === "ch5-exercise-5-1"
  );

  if (!exercise51) {
    throw new Error(
      "Invalid Chapter 5 JSON: Exercise 5.1 not found"
    );
  }

  if (exercise51.questions?.length !== 20) {
    throw new Error(
      `Invalid Chapter 5 JSON: Exercise 5.1 expected 20 questions, found ${exercise51.questions?.length}`
    );
  }

  // Find Exercise 5.2
  const exercise52 = exercises.find(
    (exercise: any) =>
      exercise.id === "ch5-exercise-5-2"
  );

  if (!exercise52) {
    throw new Error(
      "Invalid Chapter 5 JSON: Exercise 5.2 not found"
    );
  }

  if (exercise52.questions?.length !== 8) {
    throw new Error(
      `Invalid Chapter 5 JSON: Exercise 5.2 expected 8 questions, found ${exercise52.questions?.length}`
    );
  }

  /*
   * Validate source text
   *
   * The normalized JSON also contains the complete
   * Chapter 5 source_text for audit/completeness checking.
   */

  if (
    typeof chapter.source_text !== "string" ||
    chapter.source_text.trim().length === 0
  ) {
    throw new Error(
      "Invalid Chapter 5 JSON: source_text is missing or empty"
    );
  }

  if (!chapter.source_text.includes("End of Chapter 5")) {
    throw new Error(
      "Invalid Chapter 5 JSON: source_text does not contain the end of Chapter 5 marker"
    );
  }

  /*
   * ============================================
   * VALIDATION PASSED
   * ============================================
   */

  console.log("=================================");
  console.log("✅ Chapter 5 validation passed");
  console.log(`   Speaking idioms: ${speakingIdioms.items.length}`);
  console.log(
    `   Writing collocations: ${writingCollocations.items.length}`
  );
  console.log(`   Exercise 5.1 questions: ${exercise51.questions.length}`);
  console.log(`   Exercise 5.2 questions: ${exercise52.questions.length}`);
  console.log(
    `   Source text: ${chapter.source_text.length.toLocaleString()} characters`
  );
  console.log("=================================");

  /*
   * ============================================
   * STORE COMPLETE NORMALIZED JSON
   * ============================================
   *
   * JSON.stringify preserves the complete
   * Chapter 5 structure inside lessons.body.
   *
   * Stored content includes:
   *
   * - chapter metadata
   * - learning objectives
   * - strict separation / register rule
   * - phrasal verb note
   * - 50 Speaking idioms
   * - meanings
   * - Bangla meanings
   * - Speaking examples
   * - Part 1 / Part 2 / Part 3 labels
   * - 50 Writing collocations and phrases
   * - meanings
   * - Bangla meanings
   * - Writing examples
   * - writing categories
   * - Exercise 5.1
   * - all 20 questions
   * - Exercise 5.2
   * - all 8 questions
   * - answer-key metadata
   * - source metadata
   * - complete source_text audit copy
   */

  const result = await prisma.lessons.upsert({
    where: {
      id: "11111111-1111-1111-1111-111111111005",
    },

    update: {
      section: "vocab",
      title:
        chapter.chapter?.title ??
        "Chapter 5: Idioms and Phrasal Verbs (The Strict Separation Rule)",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 5,
      is_published: true,
      updated_at: new Date(),
    },

    create: {
      id: "11111111-1111-1111-1111-111111111005",
      section: "vocab",
      title:
        chapter.chapter?.title ??
        "Chapter 5: Idioms and Phrasal Verbs (The Strict Separation Rule)",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 5,
      is_published: true,
    },
  });

  console.log("=================================");
  console.log("Chapter 5 imported successfully");
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