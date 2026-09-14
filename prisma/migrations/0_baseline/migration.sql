-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- Enable the extensions backing uuid_generate_v4() and the `vector` type
-- used by knowledge.embedding -- the real dev database already has both
-- enabled (never tracked by a migration until now), but Prisma's throwaway
-- shadow database used to validate this migration chain does not, so they
-- must be created here before anything references them.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "public"."academic_background" AS ENUM ('ssc_olevels', 'hsc_alevels', 'diploma', 'bachelors', 'masters', 'phd', 'other');

-- CreateEnum
CREATE TYPE "public"."exam_type" AS ENUM ('academic', 'general_training');

-- CreateEnum
CREATE TYPE "public"."grammar_exercise_kind" AS ENUM ('identification', 'correction', 'essay_edit', 'mcq', 'production', 'gap_fill');

-- CreateEnum
CREATE TYPE "public"."lesson_section" AS ENUM ('grammar', 'vocab', 'tips');

-- CreateEnum
CREATE TYPE "public"."question_type" AS ENUM ('text_input', 'single_choice', 'multi_choice', 'matching', 'map_label');

-- CreateEnum
CREATE TYPE "public"."skill_type" AS ENUM ('listening', 'reading', 'writing', 'speaking');

-- CreateEnum
CREATE TYPE "public"."submission_kind" AS ENUM ('single_test', 'full_mock');

-- CreateEnum
CREATE TYPE "public"."submission_status" AS ENUM ('pending', 'scoring', 'scored', 'failed');

-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('student', 'admin');

-- CreateTable
CREATE TABLE "public"."grammar_chapters" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "module_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "estimated_min" INTEGER,
    "difficulty" SMALLINT,
    "band_target" TEXT,
    "summary" TEXT,
    "content" JSONB NOT NULL DEFAULT '{"blocks": [], "version": 1}',
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grammar_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."grammar_exercises" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "chapter_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" "public"."grammar_exercise_kind" NOT NULL,
    "instructions" TEXT,
    "items" JSONB NOT NULL DEFAULT '[]',
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grammar_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."grammar_lessons" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "module_id" UUID NOT NULL,
    "chapter_id" UUID,
    "exercise_id" UUID,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "source_label" TEXT,
    "collection_slug" TEXT,
    "collection_label" TEXT,
    "bite" TEXT NOT NULL,
    "detail_md" TEXT NOT NULL,
    "read_more_anchor_block_id" TEXT,
    "estimated_min" INTEGER,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grammar_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."grammar_modules" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "band_unlock" TEXT,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grammar_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."knowledge" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "content" TEXT NOT NULL,
    "embedding" vector(1536),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."learning_paths" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "plan" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lesson_resources" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "lesson_id" UUID NOT NULL,
    "kind" TEXT,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lessons" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "section" "public"."lesson_section" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "difficulty" SMALLINT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mock_test_sections" (
    "mock_test_id" UUID NOT NULL,
    "test_id" UUID NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "mock_test_sections_pkey" PRIMARY KEY ("mock_test_id","test_id")
);

-- CreateTable
CREATE TABLE "public"."mock_tests" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mock_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."phone_otps" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "phone" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "otp_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "consumed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phone_otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submissions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" TEXT NOT NULL,
    "kind" "public"."submission_kind" NOT NULL DEFAULT 'single_test',
    "test_id" UUID,
    "mock_test_id" UUID,
    "skill" "public"."skill_type",
    "status" "public"."submission_status" NOT NULL DEFAULT 'pending',
    "band_score" DECIMAL(2,1),
    "feedback" JSONB,
    "answers" JSONB,
    "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scored_at" TIMESTAMPTZ(6),

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."test_answers" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "question_id" UUID NOT NULL,
    "accepted" JSONB NOT NULL DEFAULT '[]',
    "points" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "test_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."test_attempts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" TEXT NOT NULL,
    "test_id" UUID NOT NULL,
    "raw_score" INTEGER,
    "total" INTEGER,
    "band" DECIMAL(2,1),
    "answers" JSONB NOT NULL DEFAULT '{}',
    "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."test_questions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "section_id" UUID NOT NULL,
    "qnumber" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "type" "public"."question_type" NOT NULL,
    "prompt" TEXT,
    "options" JSONB,
    "max_words" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."test_resources" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "test_id" UUID NOT NULL,
    "kind" TEXT,
    "url" TEXT,
    "content" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "test_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."test_sections" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "test_id" UUID NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT,
    "instructions" TEXT,
    "audio_url" TEXT,
    "image_url" TEXT,
    "passage_text" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tests" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "skill" "public"."skill_type" NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT,
    "band_target" DECIMAL(2,1),
    "duration_seconds" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tips_chapters" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "module_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "estimated_min" INTEGER,
    "summary" TEXT,
    "content" JSONB NOT NULL DEFAULT '{"blocks": [], "version": 1}',
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tips_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tips_lessons" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "module_id" UUID NOT NULL,
    "chapter_id" UUID,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "source_label" TEXT,
    "bite" TEXT NOT NULL,
    "detail_md" TEXT NOT NULL,
    "read_more_anchor_block_id" TEXT,
    "estimated_min" INTEGER,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collection_slug" TEXT,
    "collection_label" TEXT,

    CONSTRAINT "tips_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tips_modules" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "skill" TEXT NOT NULL DEFAULT 'writing',
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tips_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."uploads" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "storage_path" TEXT NOT NULL,
    "file_name" TEXT,
    "mime_type" TEXT,
    "size_bytes" BIGINT,
    "uploaded_by" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_grammar_attempts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" TEXT NOT NULL,
    "exercise_id" UUID NOT NULL,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "score" INTEGER,
    "max_score" INTEGER,
    "feedback" JSONB,
    "completed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_grammar_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_grammar_progress" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" TEXT NOT NULL,
    "chapter_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "last_position" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_grammar_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_skill_bands" (
    "user_id" TEXT NOT NULL,
    "skill" "public"."skill_type" NOT NULL,
    "band" DECIMAL(2,1),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_skill_bands_pkey" PRIMARY KEY ("user_id","skill")
);

-- CreateTable
CREATE TABLE "public"."user_tips_progress" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" TEXT NOT NULL,
    "chapter_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "last_position" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_tips_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "display_name" TEXT,
    "photo_url" TEXT,
    "native_language" TEXT,
    "role" "public"."user_role" NOT NULL DEFAULT 'student',
    "target_band" DECIMAL(2,1),
    "overall_band" DECIMAL(2,1),
    "total_practice_time" INTEGER NOT NULL DEFAULT 0,
    "onboarding_complete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active_at" TIMESTAMPTZ(6),
    "phone" TEXT,
    "password_hash" TEXT,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "exam_date" DATE,
    "avatar" TEXT,
    "legal_full_name" TEXT,
    "country" TEXT,
    "date_of_birth" DATE,
    "exam_type" "public"."exam_type",
    "academic_background" "public"."academic_background",
    "has_taken_ielts" BOOLEAN NOT NULL DEFAULT false,
    "previous_ielts_year" SMALLINT,
    "previous_ielts_band" DECIMAL(2,1),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vocab_lessons" (
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

-- CreateTable
CREATE TABLE "public"."vocabulary" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "word" TEXT NOT NULL,
    "part_of_speech" TEXT,
    "meaning" TEXT,
    "translation_bn" TEXT,
    "example" TEXT,
    "ielts_usage" TEXT,
    "past" TEXT,
    "past_participle" TEXT,
    "ing_form" TEXT,
    "noun_form" TEXT,
    "adjective_form" TEXT,
    "adverb_form" TEXT,
    "synonyms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "antonyms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "collocations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "topic" TEXT,
    "lesson_id" UUID,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grammar_chapters_module_id_slug_key" ON "public"."grammar_chapters"("module_id" ASC, "slug" ASC);

-- CreateIndex
CREATE INDEX "idx_grammar_chapters_module" ON "public"."grammar_chapters"("module_id" ASC, "position" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "grammar_exercises_chapter_id_slug_key" ON "public"."grammar_exercises"("chapter_id" ASC, "slug" ASC);

-- CreateIndex
CREATE INDEX "idx_grammar_exercises_chapter" ON "public"."grammar_exercises"("chapter_id" ASC, "position" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "grammar_lessons_module_id_slug_key" ON "public"."grammar_lessons"("module_id" ASC, "slug" ASC);

-- CreateIndex
CREATE INDEX "idx_grammar_lessons_collection" ON "public"."grammar_lessons"("module_id" ASC, "collection_slug" ASC);

-- CreateIndex
CREATE INDEX "idx_grammar_lessons_module" ON "public"."grammar_lessons"("module_id" ASC, "position" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "grammar_modules_slug_key" ON "public"."grammar_modules"("slug" ASC);

-- CreateIndex
CREATE INDEX "idx_knowledge_embedding" ON "public"."knowledge"("embedding" ASC);

-- CreateIndex
CREATE INDEX "idx_learning_paths_user" ON "public"."learning_paths"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_lesson_resources_lesson" ON "public"."lesson_resources"("lesson_id" ASC);

-- CreateIndex
CREATE INDEX "idx_lessons_section" ON "public"."lessons"("section" ASC);

-- CreateIndex
CREATE INDEX "idx_mock_sections_mock" ON "public"."mock_test_sections"("mock_test_id" ASC);

-- CreateIndex
CREATE INDEX "phone_otps_phone_purpose_idx" ON "public"."phone_otps"("phone" ASC, "purpose" ASC);

-- CreateIndex
CREATE INDEX "idx_submissions_mock" ON "public"."submissions"("mock_test_id" ASC);

-- CreateIndex
CREATE INDEX "idx_submissions_test" ON "public"."submissions"("test_id" ASC);

-- CreateIndex
CREATE INDEX "idx_submissions_user" ON "public"."submissions"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uniq_test_answer_question" ON "public"."test_answers"("question_id" ASC);

-- CreateIndex
CREATE INDEX "idx_test_attempts_test" ON "public"."test_attempts"("test_id" ASC);

-- CreateIndex
CREATE INDEX "idx_test_attempts_user" ON "public"."test_attempts"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_test_questions_section" ON "public"."test_questions"("section_id" ASC);

-- CreateIndex
CREATE INDEX "idx_test_resources_test" ON "public"."test_resources"("test_id" ASC);

-- CreateIndex
CREATE INDEX "idx_test_sections_test" ON "public"."test_sections"("test_id" ASC);

-- CreateIndex
CREATE INDEX "idx_tests_skill" ON "public"."tests"("skill" ASC);

-- CreateIndex
CREATE INDEX "idx_tips_chapters_module" ON "public"."tips_chapters"("module_id" ASC, "position" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "tips_chapters_module_id_slug_key" ON "public"."tips_chapters"("module_id" ASC, "slug" ASC);

-- CreateIndex
CREATE INDEX "idx_tips_lessons_collection" ON "public"."tips_lessons"("module_id" ASC, "collection_slug" ASC);

-- CreateIndex
CREATE INDEX "idx_tips_lessons_module" ON "public"."tips_lessons"("module_id" ASC, "position" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "tips_lessons_module_id_slug_key" ON "public"."tips_lessons"("module_id" ASC, "slug" ASC);

-- CreateIndex
CREATE INDEX "idx_tips_modules_skill" ON "public"."tips_modules"("skill" ASC, "position" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "tips_modules_slug_key" ON "public"."tips_modules"("slug" ASC);

-- CreateIndex
CREATE INDEX "idx_user_grammar_attempts_user_ex" ON "public"."user_grammar_attempts"("user_id" ASC, "exercise_id" ASC);

-- CreateIndex
CREATE INDEX "idx_user_grammar_progress_user" ON "public"."user_grammar_progress"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_grammar_progress_user_id_chapter_id_key" ON "public"."user_grammar_progress"("user_id" ASC, "chapter_id" ASC);

-- CreateIndex
CREATE INDEX "idx_user_tips_progress_user" ON "public"."user_tips_progress"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_tips_progress_user_id_chapter_id_key" ON "public"."user_tips_progress"("user_id" ASC, "chapter_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uniq_users_phone" ON "public"."users"("phone" ASC) WHERE (phone IS NOT NULL);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email" ASC);

-- CreateIndex
CREATE INDEX "idx_vocab_lessons_lesson" ON "public"."vocab_lessons"("lesson_id" ASC, "position" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "vocab_lessons_lesson_id_slug_key" ON "public"."vocab_lessons"("lesson_id" ASC, "slug" ASC);

-- CreateIndex
CREATE INDEX "vocabulary_lesson_id_idx" ON "public"."vocabulary"("lesson_id" ASC);

-- CreateIndex
CREATE INDEX "vocabulary_topic_idx" ON "public"."vocabulary"("topic" ASC);

-- CreateIndex
CREATE INDEX "vocabulary_word_idx" ON "public"."vocabulary"("word" ASC);

-- AddForeignKey
ALTER TABLE "public"."grammar_chapters" ADD CONSTRAINT "grammar_chapters_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."grammar_modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."grammar_exercises" ADD CONSTRAINT "grammar_exercises_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."grammar_chapters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."learning_paths" ADD CONSTRAINT "learning_paths_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."lesson_resources" ADD CONSTRAINT "lesson_resources_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mock_test_sections" ADD CONSTRAINT "mock_test_sections_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "public"."mock_tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mock_test_sections" ADD CONSTRAINT "mock_test_sections_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."submissions" ADD CONSTRAINT "submissions_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "public"."mock_tests"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."submissions" ADD CONSTRAINT "submissions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."test_answers" ADD CONSTRAINT "test_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."test_questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."test_attempts" ADD CONSTRAINT "test_attempts_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."test_attempts" ADD CONSTRAINT "test_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."test_questions" ADD CONSTRAINT "test_questions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."test_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."test_resources" ADD CONSTRAINT "test_resources_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."test_sections" ADD CONSTRAINT "test_sections_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tips_chapters" ADD CONSTRAINT "tips_chapters_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."tips_modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tips_lessons" ADD CONSTRAINT "tips_lessons_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."tips_chapters"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tips_lessons" ADD CONSTRAINT "tips_lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."tips_modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."uploads" ADD CONSTRAINT "uploads_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_grammar_attempts" ADD CONSTRAINT "user_grammar_attempts_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."grammar_exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_grammar_attempts" ADD CONSTRAINT "user_grammar_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_grammar_progress" ADD CONSTRAINT "user_grammar_progress_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."grammar_chapters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_grammar_progress" ADD CONSTRAINT "user_grammar_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_skill_bands" ADD CONSTRAINT "user_skill_bands_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_tips_progress" ADD CONSTRAINT "user_tips_progress_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."tips_chapters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_tips_progress" ADD CONSTRAINT "user_tips_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."vocab_lessons" ADD CONSTRAINT "vocab_lessons_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
