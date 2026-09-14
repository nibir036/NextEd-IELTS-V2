-- AddForeignKey
ALTER TABLE "grammar_lessons" ADD CONSTRAINT "grammar_lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "grammar_modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grammar_lessons" ADD CONSTRAINT "grammar_lessons_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "grammar_chapters"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grammar_lessons" ADD CONSTRAINT "grammar_lessons_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "grammar_exercises"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "uniq_test_answer_question" RENAME TO "test_answers_question_id_key";
