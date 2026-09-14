-- Additive-only DDL for the new vocab_lessons table (bite-lesson browsing
-- layer for the "Zero to Band 9" vocab chapters, mirroring grammar_lessons /
-- tips_lessons). Written by hand and run directly via psql -- NOT through
-- `prisma db push` or `prisma migrate dev` -- specifically so this cannot
-- touch, drop, or drift-check any other table in the database. It only
-- creates one new table and its indexes/FK; nothing else in the schema is
-- read or modified.
--
-- Run it with:
--   psql "$DATABASE_URL" -f scripts/add-vocab-lessons-table.sql
--
-- (DATABASE_URL is the same connection string already in your .env.)
-- Safe to re-run: every statement is guarded with IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS "vocab_lessons" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "lesson_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "source_label" TEXT,
    "collection_slug" TEXT,
    "collection_label" TEXT,
    "bite" TEXT NOT NULL,
    "detail_md" TEXT NOT NULL,
    "read_more_anchor_block_id" TEXT,
    "exercise_anchor_block_id" TEXT,
    "estimated_min" INTEGER,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vocab_lessons_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "vocab_lessons_lesson_id_slug_key" ON "vocab_lessons"("lesson_id", "slug");

CREATE INDEX IF NOT EXISTS "idx_vocab_lessons_lesson" ON "vocab_lessons"("lesson_id", "position");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vocab_lessons_lesson_id_fkey'
  ) THEN
    ALTER TABLE "vocab_lessons"
      ADD CONSTRAINT "vocab_lessons_lesson_id_fkey"
      FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  END IF;
END $$;
