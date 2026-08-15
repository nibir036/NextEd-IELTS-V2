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
  const filePath = "data/vocab/chapter4_data/Chapter4.json";

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const chapter = JSON.parse(raw);

  console.log("Loaded Chapter 4 JSON");

  /*
   * ============================================================
   * Validate the normalized Chapter 4 structure
   * before saving it to Prisma.
   * ============================================================
   */

  if (chapter.chapter?.number !== 4) {
    throw new Error(
      "Invalid Chapter 4 JSON: chapter number must be 4"
    );
  }

  if (!chapter.chapter?.title) {
    throw new Error(
      "Invalid Chapter 4 JSON: chapter title is missing"
    );
  }

  /*
   * ------------------------------------------------------------
   * Validate topics
   * ------------------------------------------------------------
   */

  const topicBlocks = chapter.blocks?.filter(
    (block: any) => block.type === "topic_bundle"
  );

  if (!topicBlocks) {
    throw new Error(
      "Invalid Chapter 4 JSON: topic_bundle blocks not found"
    );
  }

  if (topicBlocks.length !== 15) {
    throw new Error(
      `Invalid Chapter 4 JSON: expected 15 topics, found ${topicBlocks.length}`
    );
  }

  /*
   * Make sure topics are actually 1 -> 15.
   */

  const topicNumbers = topicBlocks
    .map((topic: any) => topic.topic_number)
    .sort((a: number, b: number) => a - b);

  const expectedTopicNumbers = Array.from(
    { length: 15 },
    (_, index) => index + 1
  );

  if (
    JSON.stringify(topicNumbers) !==
    JSON.stringify(expectedTopicNumbers)
  ) {
    throw new Error(
      "Invalid Chapter 4 JSON: topic numbers must contain 1 through 15"
    );
  }

  /*
   * ------------------------------------------------------------
   * Validate sections inside every topic
   * ------------------------------------------------------------
   */

  const requiredSectionTypes = [
    "academic_nouns",
    "precise_verbs",
    "collocations_and_adjectives",
    "formal_task2_collocations",
    "speaking_idioms",
    "exercises",
  ];

  for (const topic of topicBlocks) {
    if (!topic.sections) {
      throw new Error(
        `Invalid Chapter 4 JSON: sections missing from Topic ${topic.topic_number}`
      );
    }

    for (const sectionType of requiredSectionTypes) {
      const section = topic.sections.find(
        (section: any) => section.type === sectionType
      );

      if (!section) {
        throw new Error(
          `Invalid Chapter 4 JSON: ${sectionType} section missing from Topic ${topic.topic_number}`
        );
      }
    }
  }

  /*
   * ------------------------------------------------------------
   * Validate exercises
   * ------------------------------------------------------------
   *
   * Chapter 4:
   *
   * 15 topics × 3 exercises = 45 exercises
   */

  let totalExercises = 0;

  for (const topic of topicBlocks) {
    const exerciseSection = topic.sections.find(
      (section: any) => section.type === "exercises"
    );

    if (!exerciseSection) {
      throw new Error(
        `Exercise section missing from Topic ${topic.topic_number}`
      );
    }

    /*
     * We validate that the exercise section actually contains
     * all three exercise labels.
     */
    const exerciseContent = exerciseSection.content ?? "";

    for (let exerciseNumber = 1; exerciseNumber <= 3; exerciseNumber++) {
      const exercisePattern = `Exercise 4.${topic.topic_number}.${exerciseNumber}`;

      if (!exerciseContent.includes(exercisePattern)) {
        throw new Error(
          `Invalid Chapter 4 JSON: ${exercisePattern} not found`
        );
      }

      totalExercises++;
    }
  }

  if (totalExercises !== 45) {
    throw new Error(
      `Invalid Chapter 4 JSON: expected 45 exercises, found ${totalExercises}`
    );
  }

  /*
   * ------------------------------------------------------------
   * Validate batch answer keys
   * ------------------------------------------------------------
   */

  const answerKeys = chapter.blocks?.filter(
    (block: any) => block.type === "answer_key"
  );

  if (!answerKeys) {
    throw new Error(
      "Invalid Chapter 4 JSON: answer_key blocks not found"
    );
  }

  if (answerKeys.length !== 3) {
    throw new Error(
      `Invalid Chapter 4 JSON: expected 3 answer keys, found ${answerKeys.length}`
    );
  }

  /*
   * ------------------------------------------------------------
   * Validate complete source text
   * ------------------------------------------------------------
   *
   * This is important because we deliberately retained the
   * complete Chapter 4 source text in the normalized JSON.
   */

  if (
    !chapter.source_text ||
    typeof chapter.source_text !== "string"
  ) {
    throw new Error(
      "Invalid Chapter 4 JSON: complete source_text is missing"
    );
  }

  if (
    !chapter.source_text.includes(
      "End of Chapter 4. All fifteen domains complete."
    )
  ) {
    throw new Error(
      "Invalid Chapter 4 JSON: source_text appears incomplete"
    );
  }

  /*
   * ============================================================
   * Validation successful
   * ============================================================
   */

  console.log("=================================");
  console.log("✅ Chapter 4 validation passed");
  console.log("=================================");

  console.log(`Topics: ${topicBlocks.length}`);
  console.log(`Exercises: ${totalExercises}`);
  console.log(`Answer keys: ${answerKeys.length}`);
  console.log(
    `Source text characters: ${chapter.source_text.length.toLocaleString()}`
  );

  /*
   * ------------------------------------------------------------
   * Store the complete normalized JSON inside lessons.body.
   *
   * JSON.stringify preserves the entire Chapter 4 structure:
   *
   * - chapter metadata
   * - 3 batch introductions
   * - all 15 topic bundles
   * - academic nouns
   * - precise verbs
   * - collocations/adjectives
   * - formal Task 2 collocations
   * - Speaking idioms/expressions
   * - all 45 exercises
   * - all 3 batch answer keys
   * - topic raw_text
   * - complete source_text
   * - source metadata
   * ------------------------------------------------------------
   */

  const result = await prisma.lessons.upsert({
    where: {
      id: "11111111-1111-1111-1111-111111111004",
    },

    update: {
      section: "vocab",

      title:
        chapter.chapter?.title ??
        "Chapter 4: Topic-Based Lexical Mastery",

      body: JSON.stringify(chapter),

      difficulty: 9,

      position: 4,

      is_published: true,

      updated_at: new Date(),
    },

    create: {
      id: "11111111-1111-1111-1111-111111111004",

      section: "vocab",

      title:
        chapter.chapter?.title ??
        "Chapter 4: Topic-Based Lexical Mastery",

      body: JSON.stringify(chapter),

      difficulty: 9,

      position: 4,

      is_published: true,
    },
  });

  /*
   * ============================================================
   * Success
   * ============================================================
   */

  console.log("=================================");
  console.log("Chapter 4 imported successfully");
  console.log("Lesson ID:", result.id);
  console.log("Title:", result.title);
  console.log("Section:", result.section);
  console.log("Position:", result.position);
  console.log("Published:", result.is_published);
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