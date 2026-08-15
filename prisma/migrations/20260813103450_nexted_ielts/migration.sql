CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "lesson_section" AS ENUM ('grammar', 'vocab', 'tips');

-- CreateEnum
CREATE TYPE "exam_type" AS ENUM ('academic', 'general_training');

-- CreateEnum
CREATE TYPE "academic_background" AS ENUM ('ssc_olevels', 'hsc_alevels', 'diploma', 'bachelors', 'masters', 'phd', 'other');

-- CreateEnum
CREATE TYPE "skill_type" AS ENUM ('listening', 'reading', 'writing', 'speaking');

-- CreateEnum
CREATE TYPE "question_type" AS ENUM ('text_input', 'single_choice', 'multi_choice', 'matching', 'map_label');

-- CreateEnum
CREATE TYPE "submission_kind" AS ENUM ('single_test', 'full_mock');

-- CreateEnum
CREATE TYPE "submission_status" AS ENUM ('pending', 'scoring', 'scored', 'failed');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('student', 'admin');

-- CreateEnum
CREATE TYPE "grammar_exercise_kind" AS ENUM ('identification', 'correction', 'essay_edit', 'mcq', 'production');

-- CreateTable
CREATE TABLE "knowledge" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "content" TEXT NOT NULL,
    "embedding" vector,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_paths" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "plan" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_resources" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "lesson_id" UUID NOT NULL,
    "kind" TEXT,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "section" "lesson_section" NOT NULL,
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
CREATE TABLE "mock_test_sections" (
    "mock_test_id" UUID NOT NULL,
    "test_id" UUID NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "mock_test_sections_pkey" PRIMARY KEY ("mock_test_id","test_id")
);

-- CreateTable
CREATE TABLE "mock_tests" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mock_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" TEXT NOT NULL,
    "kind" "submission_kind" NOT NULL DEFAULT 'single_test',
    "test_id" UUID,
    "mock_test_id" UUID,
    "skill" "skill_type",
    "status" "submission_status" NOT NULL DEFAULT 'pending',
    "band_score" DECIMAL(2,1),
    "feedback" JSONB,
    "answers" JSONB,
    "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scored_at" TIMESTAMPTZ(6),

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_resources" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "test_id" UUID NOT NULL,
    "kind" TEXT,
    "url" TEXT,
    "content" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "test_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "skill" "skill_type" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "band_target" DECIMAL(2,1),
    "duration_seconds" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_sections" (
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
CREATE TABLE "test_questions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "section_id" UUID NOT NULL,
    "qnumber" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "type" "question_type" NOT NULL,
    "prompt" TEXT,
    "options" JSONB,
    "max_words" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_answers" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "question_id" UUID NOT NULL,
    "accepted" JSONB NOT NULL DEFAULT '[]',
    "points" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "test_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_attempts" (
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
CREATE TABLE "uploads" (
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
CREATE TABLE "user_skill_bands" (
    "user_id" TEXT NOT NULL,
    "skill" "skill_type" NOT NULL,
    "band" DECIMAL(2,1),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_skill_bands_pkey" PRIMARY KEY ("user_id","skill")
);

-- CreateTable
CREATE TABLE "grammar_modules" (
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
CREATE TABLE "grammar_chapters" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "module_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "estimated_min" INTEGER,
    "difficulty" SMALLINT,
    "band_target" TEXT,
    "summary" TEXT,
    "content" JSONB NOT NULL DEFAULT '{"version":1,"blocks":[]}',
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grammar_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grammar_exercises" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "chapter_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" "grammar_exercise_kind" NOT NULL,
    "instructions" TEXT,
    "items" JSONB NOT NULL DEFAULT '[]',
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grammar_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_grammar_progress" (
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
CREATE TABLE "user_grammar_attempts" (
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
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "display_name" TEXT,
    "photo_url" TEXT,
    "native_language" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'student',
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
    "exam_type" "exam_type",
    "academic_background" "academic_background",
    "has_taken_ielts" BOOLEAN NOT NULL DEFAULT false,
    "previous_ielts_year" SMALLINT,
    "previous_ielts_band" DECIMAL(2,1),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary" (
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
CREATE INDEX "idx_knowledge_embedding" ON "knowledge"("embedding");

-- CreateIndex
CREATE INDEX "idx_learning_paths_user" ON "learning_paths"("user_id");

-- CreateIndex
CREATE INDEX "idx_lesson_resources_lesson" ON "lesson_resources"("lesson_id");

-- CreateIndex
CREATE INDEX "idx_lessons_section" ON "lessons"("section");

-- CreateIndex
CREATE INDEX "idx_mock_sections_mock" ON "mock_test_sections"("mock_test_id");

-- CreateIndex
CREATE INDEX "idx_submissions_mock" ON "submissions"("mock_test_id");

-- CreateIndex
CREATE INDEX "idx_submissions_test" ON "submissions"("test_id");

-- CreateIndex
CREATE INDEX "idx_submissions_user" ON "submissions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_submission_user_test" ON "submissions"("user_id", "test_id") WHERE (test_id IS NOT NULL);

-- CreateIndex
CREATE INDEX "idx_test_resources_test" ON "test_resources"("test_id");

-- CreateIndex
CREATE INDEX "idx_tests_skill" ON "tests"("skill");

-- CreateIndex
CREATE INDEX "idx_test_sections_test" ON "test_sections"("test_id");

-- CreateIndex
CREATE INDEX "idx_test_questions_section" ON "test_questions"("section_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_answers_question_id_key" ON "test_answers"("question_id");

-- CreateIndex
CREATE INDEX "idx_test_attempts_user" ON "test_attempts"("user_id");

-- CreateIndex
CREATE INDEX "idx_test_attempts_test" ON "test_attempts"("test_id");

-- CreateIndex
CREATE UNIQUE INDEX "grammar_modules_slug_key" ON "grammar_modules"("slug");

-- CreateIndex
CREATE INDEX "idx_grammar_chapters_module" ON "grammar_chapters"("module_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "grammar_chapters_module_id_slug_key" ON "grammar_chapters"("module_id", "slug");

-- CreateIndex
CREATE INDEX "idx_grammar_exercises_chapter" ON "grammar_exercises"("chapter_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "grammar_exercises_chapter_id_slug_key" ON "grammar_exercises"("chapter_id", "slug");

-- CreateIndex
CREATE INDEX "idx_user_grammar_progress_user" ON "user_grammar_progress"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_grammar_progress_user_id_chapter_id_key" ON "user_grammar_progress"("user_id", "chapter_id");

-- CreateIndex
CREATE INDEX "idx_user_grammar_attempts_user_ex" ON "user_grammar_attempts"("user_id", "exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_users_phone" ON "users"("phone") WHERE (phone IS NOT NULL);

-- CreateIndex
CREATE INDEX "vocabulary_lesson_id_idx" ON "vocabulary"("lesson_id");

-- CreateIndex
CREATE INDEX "vocabulary_word_idx" ON "vocabulary"("word");

-- CreateIndex
CREATE INDEX "vocabulary_topic_idx" ON "vocabulary"("topic");

-- AddForeignKey
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lesson_resources" ADD CONSTRAINT "lesson_resources_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mock_test_sections" ADD CONSTRAINT "mock_test_sections_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "mock_tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mock_test_sections" ADD CONSTRAINT "mock_test_sections_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "mock_tests"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_resources" ADD CONSTRAINT "test_resources_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_sections" ADD CONSTRAINT "test_sections_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_questions" ADD CONSTRAINT "test_questions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "test_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_answers" ADD CONSTRAINT "test_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "test_questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_skill_bands" ADD CONSTRAINT "user_skill_bands_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grammar_chapters" ADD CONSTRAINT "grammar_chapters_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "grammar_modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grammar_exercises" ADD CONSTRAINT "grammar_exercises_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "grammar_chapters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_grammar_progress" ADD CONSTRAINT "user_grammar_progress_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "grammar_chapters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_grammar_progress" ADD CONSTRAINT "user_grammar_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_grammar_attempts" ADD CONSTRAINT "user_grammar_attempts_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "grammar_exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_grammar_attempts" ADD CONSTRAINT "user_grammar_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
