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

CREATE INDEX "vocabulary_lesson_id_idx" ON "vocabulary"("lesson_id");
CREATE INDEX "vocabulary_word_idx" ON "vocabulary"("word");
CREATE INDEX "vocabulary_topic_idx" ON "vocabulary"("topic");
