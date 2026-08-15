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
  const filePath = "data/vocab/chapter2_data/Chapter2.json";

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const chapter = JSON.parse(raw);

  console.log("Loaded Chapter 2 JSON");

  const result = await prisma.lessons.upsert({
    where: {
      id: "11111111-1111-1111-1111-111111111002",
    },

    update: {
      section: "vocab",
      title: chapter.title ?? "Chapter 2: The Band Upgrade Matrix",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 2,
      is_published: true,
      updated_at: new Date(),
    },

    create: {
      id: "11111111-1111-1111-1111-111111111002",
      section: "vocab",
      title: chapter.title ?? "Chapter 2: The Band Upgrade Matrix",
      body: JSON.stringify(chapter),
      difficulty: 9,
      position: 2,
      is_published: true,
    },
  });

  console.log("=================================");
  console.log("Chapter 2 imported successfully");
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