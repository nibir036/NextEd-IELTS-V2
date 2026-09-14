/**
 * Standalone seeder for the new `vocab_lessons` table only.
 *
 * Deliberately NOT folded into prisma/seed.ts's main() -- running this
 * touches exactly one table (vocab_lessons) and, read-only, the existing
 * `lessons` rows it needs to resolve chapter numbers to real UUIDs. It
 * never writes to `lessons` or anything else, so it can't repeat the
 * kind of blast radius the earlier `prisma db push` had.
 *
 * The seed data file stores each lesson's parent as `chapterNumber`
 * (1-7) rather than a lesson_id UUID, because those UUIDs live only in
 * the database and aren't known ahead of time -- this script looks each
 * one up at run time via `lessons.findFirst({ section: 'vocab', position })`,
 * the same lookup /api/vocab/[chapter] already uses.
 *
 *   npx tsx --env-file=.env scripts/seed-vocab-lessons.ts
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set. Put it in .env or export it.');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedVocabLesson = {
  id: string;
  chapterNumber: number;
  slug: string;
  position: number;
  title: string;
  sourceLabel?: string | null;
  collection?: { slug: string; label: string } | null;
  bite: string;
  detail_md: string;
  read_more_anchor_block_id?: string | null;
  exercise_anchor_block_id?: string | null;
  estimated_min?: number | null;
};

async function upsertVocabLesson(l: SeedVocabLesson, lessonId: string) {
  const byId = await prisma.vocab_lessons.findUnique({ where: { id: l.id } });
  const bySlug = await prisma.vocab_lessons.findUnique({
    where: { lesson_id_slug: { lesson_id: lessonId, slug: l.slug } },
  });

  const data = {
    title: l.title,
    source_label: l.sourceLabel ?? null,
    collection_slug: l.collection?.slug ?? null,
    collection_label: l.collection?.label ?? null,
    bite: l.bite,
    detail_md: l.detail_md,
    read_more_anchor_block_id: l.read_more_anchor_block_id ?? null,
    exercise_anchor_block_id: l.exercise_anchor_block_id ?? null,
    position: l.position,
    estimated_min: l.estimated_min ?? null,
    is_published: true,
    updated_at: new Date(),
  };

  if (byId) {
    await prisma.vocab_lessons.update({
      where: { id: l.id },
      data: { ...data, lesson_id: lessonId, slug: l.slug },
    });
    return;
  }
  if (bySlug) {
    await prisma.vocab_lessons.update({ where: { id: bySlug.id }, data });
    return;
  }
  await prisma.vocab_lessons.create({
    data: { id: l.id, lesson_id: lessonId, slug: l.slug, ...data },
  });
}

async function main() {
  const file = join(__dirname, '..', 'prisma', 'seed-data', 'vocab', 'all-chapters-lessons.json');
  const { lessons } = JSON.parse(readFileSync(file, 'utf8')) as { lessons: SeedVocabLesson[] };

  console.log(`Seeding ${lessons.length} vocab_lessons rows`);

  const lessonIdByChapter = new Map<number, string>();

  for (const l of lessons) {
    let lessonId = lessonIdByChapter.get(l.chapterNumber);
    if (!lessonId) {
      const parent = await prisma.lessons.findFirst({
        where: { section: 'vocab', position: l.chapterNumber },
        select: { id: true },
      });
      if (!parent) {
        console.error(
          `  SKIP ${l.slug}: no "lessons" row found for section=vocab position=${l.chapterNumber}. ` +
            `Nothing was written for this lesson.`,
        );
        continue;
      }
      lessonId = parent.id;
      lessonIdByChapter.set(l.chapterNumber, lessonId);
    }
    await upsertVocabLesson(l, lessonId);
    console.log(`  chapter ${l.chapterNumber} -> ${l.slug}`);
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
