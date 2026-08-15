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
  const filePath = "data/vocab/chapter7_data/chapter7.json";

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const chapter = JSON.parse(raw);

  console.log("Loaded Chapter 7 JSON");

  /*
   * ============================================
   * VALIDATE NORMALIZED CHAPTER 7 STRUCTURE
   * ============================================
   */

  // Validate chapter number
  if (chapter.chapter?.number !== 7) {
    throw new Error(
      "Invalid Chapter 7 JSON: chapter number must be 7"
    );
  }

  // Validate schema version
  if (chapter.schema_version !== "2.0") {
    throw new Error(
      `Invalid Chapter 7 JSON: expected schema_version 2.0, found ${chapter.schema_version}`
    );
  }

  // Validate blocks
  if (!Array.isArray(chapter.blocks)) {
    throw new Error(
      "Invalid Chapter 7 JSON: blocks array not found"
    );
  }

  /*
   * ============================================
   * VALIDATE CHAPTER 1–6 ANSWER SECTIONS
   * ============================================
   *
   * Chapter 7 is the consolidated answer key
   * for the entire book.
   *
   * Part 1:
   *   Chapter 1
   *   Chapter 2
   *   Chapter 3
   *
   * Part 2:
   *   Chapter 4
   *   Chapter 5
   *   Chapter 6
   */

  const answerKeySections = chapter.blocks.filter(
    (block: any) =>
      block.type === "answer_key_section"
  );

  if (answerKeySections.length !== 6) {
    throw new Error(
      `Invalid Chapter 7 JSON: expected 6 answer_key_section blocks for Chapters 1–6, found ${answerKeySections.length}`
    );
  }

  // Validate Chapter 1 section
  const chapter1Answers = answerKeySections.find(
    (block: any) =>
      block.source_chapter === 1
  );

  if (!chapter1Answers) {
    throw new Error(
      "Invalid Chapter 7 JSON: Chapter 1 answer key section not found"
    );
  }

  // Validate Chapter 2 section
  const chapter2Answers = answerKeySections.find(
    (block: any) =>
      block.source_chapter === 2
  );

  if (!chapter2Answers) {
    throw new Error(
      "Invalid Chapter 7 JSON: Chapter 2 answer key section not found"
    );
  }

  // Validate Chapter 3 section
  const chapter3Answers = answerKeySections.find(
    (block: any) =>
      block.source_chapter === 3
  );

  if (!chapter3Answers) {
    throw new Error(
      "Invalid Chapter 7 JSON: Chapter 3 answer key section not found"
    );
  }

  // Validate Chapter 4 section
  const chapter4Answers = answerKeySections.find(
    (block: any) =>
      block.source_chapter === 4
  );

  if (!chapter4Answers) {
    throw new Error(
      "Invalid Chapter 7 JSON: Chapter 4 answer key section not found"
    );
  }

  // Validate Chapter 5 section
  const chapter5Answers = answerKeySections.find(
    (block: any) =>
      block.source_chapter === 5
  );

  if (!chapter5Answers) {
    throw new Error(
      "Invalid Chapter 7 JSON: Chapter 5 answer key section not found"
    );
  }

  // Validate Chapter 6 section
  const chapter6Answers = answerKeySections.find(
    (block: any) =>
      block.source_chapter === 6
  );

  if (!chapter6Answers) {
    throw new Error(
      "Invalid Chapter 7 JSON: Chapter 6 answer key section not found"
    );
  }

  /*
   * ============================================
   * VALIDATE CONSOLIDATED ANSWER KEY METADATA
   * ============================================
   */

  if (!chapter.answer_key) {
    throw new Error(
      "Invalid Chapter 7 JSON: answer_key object not found"
    );
  }

  if (chapter.answer_key.available !== true) {
    throw new Error(
      "Invalid Chapter 7 JSON: answer_key.available must be true"
    );
  }

  if (chapter.answer_key.type !== "consolidated") {
    throw new Error(
      `Invalid Chapter 7 JSON: expected consolidated answer key, found ${chapter.answer_key.type}`
    );
  }

  if (chapter.answer_key.authoritative !== true) {
    throw new Error(
      "Invalid Chapter 7 JSON: answer_key.authoritative must be true"
    );
  }

  /*
   * Validate chapter coverage.
   *
   * Chapter 7 must cover Chapters 1–6.
   */

  const expectedChapters = [1, 2, 3, 4, 5, 6];

  const coveredChapters =
    chapter.answer_key.coverage?.chapters;

  if (
    !Array.isArray(coveredChapters) ||
    JSON.stringify(coveredChapters) !==
      JSON.stringify(expectedChapters)
  ) {
    throw new Error(
      "Invalid Chapter 7 JSON: answer key coverage must contain Chapters 1–6"
    );
  }

  /*
   * ============================================
   * VALIDATE PART 1 / PART 2 COVERAGE
   * ============================================
   */

  const part1 =
    chapter.answer_key.coverage?.part_1;

  const part2 =
    chapter.answer_key.coverage?.part_2;

  if (
    !Array.isArray(part1) ||
    JSON.stringify(part1) !==
      JSON.stringify([1, 2, 3])
  ) {
    throw new Error(
      "Invalid Chapter 7 JSON: Part 1 must contain Chapters 1, 2, and 3"
    );
  }

  if (
    !Array.isArray(part2) ||
    JSON.stringify(part2) !==
      JSON.stringify([4, 5, 6])
  ) {
    throw new Error(
      "Invalid Chapter 7 JSON: Part 2 must contain Chapters 4, 5, and 6"
    );
  }

  /*
   * ============================================
   * VALIDATE APPENDIX EXCLUSION
   * ============================================
   *
   * The user requested Chapter 7 WITHOUT
   * the Appendix.
   */

  if (chapter.answer_key.appendix_excluded !== true) {
    throw new Error(
      "Invalid Chapter 7 JSON: Appendix must be excluded"
    );
  }

  /*
   * Make sure the Appendix Word Bank has not
   * accidentally been included in source_text.
   */

  if (
    typeof chapter.source_text === "string" &&
    chapter.source_text.includes(
      "Appendix: Word Bank"
    )
  ) {
    throw new Error(
      "Invalid Chapter 7 JSON: Appendix content detected in source_text"
    );
  }

  /*
   * ============================================
   * VALIDATE SOURCE TEXT
   * ============================================
   */

  if (
    typeof chapter.source_text !== "string" ||
    chapter.source_text.trim().length === 0
  ) {
    throw new Error(
      "Invalid Chapter 7 JSON: source_text is missing or empty"
    );
  }

  /*
   * Chapter 7 should contain the definitive
   * answer-key introduction.
   */

  if (
    !chapter.source_text.includes(
      "single, definitive answer key for the whole book"
    )
  ) {
    throw new Error(
      "Invalid Chapter 7 JSON: definitive answer-key introduction not found in source_text"
    );
  }

  /*
   * Validate that Chapter 7 covers all
   * six chapters in the source text.
   */

  for (const chapterNumber of expectedChapters) {
    if (
      !chapter.source_text.includes(
        `Chapter ${chapterNumber}`
      )
    ) {
      throw new Error(
        `Invalid Chapter 7 JSON: Chapter ${chapterNumber} reference not found in source_text`
      );
    }
  }

  /*
   * ============================================
   * VALIDATION PASSED
   * ============================================
   */

  console.log("=================================");
  console.log("✅ Chapter 7 validation passed");

  console.log(
    `   Answer-key sections: ${answerKeySections.length}`
  );

  console.log(
    `   Chapters covered: ${coveredChapters.join(", ")}`
  );

  console.log(
    `   Part 1: Chapters ${part1.join(", ")}`
  );

  console.log(
    `   Part 2: Chapters ${part2.join(", ")}`
  );

  console.log(
    `   Consolidated: ${chapter.answer_key.type}`
  );

  console.log(
    `   Authoritative: ${chapter.answer_key.authoritative}`
  );

  console.log(
    `   Appendix excluded: ${chapter.answer_key.appendix_excluded}`
  );

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
   * Chapter 7 structure inside lessons.body.
   *
   * Stored content includes:
   *
   * - chapter metadata
   * - learning objectives
   * - Chapter 1 answer key
   * - Chapter 2 answer key
   * - Chapter 3 answer key
   * - Chapter 4 answer key
   * - Chapter 5 answer key
   * - Chapter 6 answer key
   * - English explanations
   * - Bangla explanations
   * - pedagogical explanations
   * - consolidated answer-key metadata
   * - Part 1 / Part 2 coverage
   * - source metadata
   * - complete Chapter 7 source_text
   *
   * The Appendix / Word Bank is NOT stored.
   */

  const result = await prisma.lessons.upsert({
    where: {
      id: "11111111-1111-1111-1111-111111111007",
    },

    update: {
      section: "vocab",
      title:
        chapter.chapter?.title ??
        "Chapter 7: Exhaustive Answer Keys and Pedagogical Explanations",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 7,
      is_published: true,
      updated_at: new Date(),
    },

    create: {
      id: "11111111-1111-1111-1111-111111111007",
      section: "vocab",
      title:
        chapter.chapter?.title ??
        "Chapter 7: Exhaustive Answer Keys and Pedagogical Explanations",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 7,
      is_published: true,
    },
  });

  console.log("=================================");
  console.log("Chapter 7 imported successfully");
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