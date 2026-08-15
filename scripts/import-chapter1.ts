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
  const filePath = "data/vocab/chapter1_data/Chapter1.json";

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const chapter = JSON.parse(raw);

  console.log("Loaded Chapter 1 JSON");

  /*
   * Store the complete JSON inside lessons.body.
   *
   * JSON.stringify preserves the entire chapter structure:
   * - chapter metadata
   * - all 30 L1 errors
   * - Exercise 1.1
   * - Exercise 1.2
   */

  const result = await prisma.lessons.upsert({
    where: {
      id: "11111111-1111-1111-1111-111111111001",
    },

    update: {
      section: "vocab",
      title: chapter.title ?? "Chapter 1",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 1,
      is_published: true,
      updated_at: new Date(),
    },

    create: {
      id: "11111111-1111-1111-1111-111111111001",
      section: "vocab",
      title: chapter.title ?? "Chapter 1",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 1,
      is_published: true,
    },
  });

  console.log("=================================");
  console.log("Chapter 1 imported successfully");
  console.log("Lesson ID:", result.id);
  console.log("Title:", result.title);
  console.log("Section:", result.section);
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