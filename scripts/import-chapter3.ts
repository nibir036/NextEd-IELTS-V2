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
  const filePath = "data/vocab/chapter3_data/Chapter3.json";

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const chapter = JSON.parse(raw);

  console.log("Loaded Chapter 3 JSON");

  /*
   * Validate the normalized Chapter 3 structure
   * before saving it to Prisma.
   */

  if (chapter.chapter?.number !== 3) {
    throw new Error("Invalid Chapter 3 JSON: chapter number must be 3");
  }

  const verbMatrix = chapter.blocks?.find(
    (block: any) => block.type === "verb_matrix"
  );

  if (!verbMatrix) {
    throw new Error(
      "Invalid Chapter 3 JSON: verb_matrix block not found"
    );
  }

  if (verbMatrix.items?.length !== 100) {
    throw new Error(
      `Invalid Chapter 3 JSON: expected 100 verbs, found ${verbMatrix.items?.length}`
    );
  }

  const linkingGuide = chapter.blocks?.find(
    (block: any) => block.type === "linking_guide"
  );

  if (!linkingGuide) {
    throw new Error(
      "Invalid Chapter 3 JSON: linking_guide block not found"
    );
  }

  const exercises = chapter.blocks?.filter(
    (block: any) => block.type === "exercise"
  );

  if (exercises?.length !== 2) {
    throw new Error(
      `Invalid Chapter 3 JSON: expected 2 exercises, found ${exercises?.length}`
    );
  }

  console.log("✅ Chapter 3 validation passed");
  console.log(`   Verbs: ${verbMatrix.items.length}`);
  console.log(`   Exercises: ${exercises.length}`);

  /*
   * Store the complete normalized JSON inside lessons.body.
   *
   * JSON.stringify preserves the entire Chapter 3 structure:
   *
   * - chapter metadata
   * - learning objectives
   * - 100 verb conjugation entries
   * - noun/adjective forms
   * - verb prepositions
   * - linking word upgrade guide
   * - cohesion traps
   * - Exercise 3.1
   * - Exercise 3.2
   * - answer key metadata
   * - source metadata
   */

  const result = await prisma.lessons.upsert({
    where: {
      id: "11111111-1111-1111-1111-111111111003",
    },

    update: {
      section: "vocab",
      title:
        chapter.chapter?.title ??
        "Chapter 3: Complete Verb Conjugations and Formal Transitions",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 3,
      is_published: true,
      updated_at: new Date(),
    },

    create: {
      id: "11111111-1111-1111-1111-111111111003",
      section: "vocab",
      title:
        chapter.chapter?.title ??
        "Chapter 3: Complete Verb Conjugations and Formal Transitions",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 3,
      is_published: true,
    },
  });

  console.log("=================================");
  console.log("Chapter 3 imported successfully");
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