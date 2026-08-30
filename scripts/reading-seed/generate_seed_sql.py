#!/usr/bin/env python3
"""
Generates migrations/0015_seed_reading_test_bank.sql from:
  - scripts/reading-seed/manifest.json  (70 full reading tests: 3 passages,
    40 questions each, with answer keys)

Follows the same model as the original seed_reading_test_1.sql:
  * 1 row in `tests`         -> the reading set (skill='reading')
  * `test_sections`   rows   -> one per passage (passage_text + instructions)
  * `test_questions`  rows   -> one per question, ordered by qnumber
  * `test_answers`    rows   -> one per question (accepted variants)

Question-type mapping (manifest type -> schema `question_type`):
  true_false_not_given, yes_no_not_given, multiple_choice -> single_choice
  matching_headings, matching_information,
    summary_completion_wordlist                            -> matching
  note_completion, sentence_completion                      -> text_input

Run from repo root:
    python3 scripts/reading-seed/generate_seed_sql.py
"""
import json
import re
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SEED_DIR = Path(__file__).resolve().parent
OUT_PATH = ROOT / "migrations" / "0015_seed_reading_test_bank.sql"


class DataQualityError(Exception):
    """Raised when a test's manifest data can't be trusted enough to seed."""

# Fixed namespace so re-running this script regenerates the SAME UUIDs
# every time (idempotent — ON CONFLICT DO UPDATE keys off these ids).
NAMESPACE = uuid.UUID("66666666-6666-6666-6666-666666666666")

TF_OPTIONS = [
    {"letter": "TRUE", "text": "True"},
    {"letter": "FALSE", "text": "False"},
    {"letter": "NOT GIVEN", "text": "Not Given"},
]
YN_OPTIONS = [
    {"letter": "YES", "text": "Yes"},
    {"letter": "NO", "text": "No"},
    {"letter": "NOT GIVEN", "text": "Not Given"},
]

SECTION_INSTRUCTIONS = {
    "true_false_not_given": lambda f, t: (
        f"Questions {f}-{t}: Do the following statements agree with the "
        "information given in the passage? Write TRUE, FALSE, or NOT GIVEN."
    ),
    "yes_no_not_given": lambda f, t: (
        f"Questions {f}-{t}: Do the following statements agree with the "
        "claims of the writer? Write YES, NO, or NOT GIVEN."
    ),
    "note_completion": lambda f, t: (
        f"Questions {f}-{t}: Complete the notes below. Choose NO MORE THAN "
        "TWO WORDS AND/OR A NUMBER from the passage for each answer."
    ),
    "sentence_completion": lambda f, t: (
        f"Questions {f}-{t}: Complete the sentences below. Choose NO MORE "
        "THAN TWO WORDS from the passage for each answer."
    ),
    "matching_headings": lambda f, t: (
        f"Questions {f}-{t}: Choose the correct heading for each paragraph "
        "from the list of headings."
    ),
    "matching_information": lambda f, t: (
        f"Questions {f}-{t}: Which paragraph contains the following information?"
    ),
    "multiple_choice": lambda f, t: (
        f"Questions {f}-{t}: Choose the correct letter."
    ),
    "summary_completion_wordlist": lambda f, t: (
        f"Questions {f}-{t}: Complete the summary below. Choose ONE WORD OR "
        "PHRASE from the box for each answer."
    ),
}


def test_uuid(n: int) -> str:
    return str(uuid.uuid5(NAMESPACE, f"reading-test-{n}"))


def question_uuid(n: int, qnumber: int) -> str:
    return str(uuid.uuid5(NAMESPACE, f"reading-test-{n}-q{qnumber}"))


def section_uuid(n: int, passage_number: int) -> str:
    return str(uuid.uuid5(NAMESPACE, f"reading-test-{n}-passage{passage_number}"))


def sql_quote(s: str) -> str:
    return "'" + str(s).replace("'", "''") + "'"


def sql_jsonb(obj) -> str:
    return sql_quote(json.dumps(obj, ensure_ascii=False)) + "::jsonb"


def sql_null_or(val, wrap=sql_quote):
    return "NULL" if val is None else wrap(val)


def normalize_blank(text: str) -> str:
    return re.sub(r"_{3,}", "____", text).strip()


def split_accepted(answer: str) -> list[str]:
    parts = re.split(r"\s*/\s*", answer)
    return [p.strip() for p in parts if p.strip()]


def build_passage_text(paragraphs: dict) -> str:
    lines = []
    for letter in sorted(paragraphs.keys()):
        lines.append(f"{letter}. {paragraphs[letter]}")
    return "\n\n".join(lines)


def extract_summary_body(raw: str) -> str:
    """The 'summary_text' field in the source data is truncated (only the
    first blank's sentence, in ~69/70 tests) — but the group's 'raw' field
    has the full cloze paragraph. Slice out just the summary body: after the
    'on your answer sheet.' instruction line, up to (not including) the
    'A. word / B. word / ...' word-bank list that follows it."""
    m = re.search(r"on your answer sheet\.\s*\n+", raw)
    body_start = m.end() if m else 0
    tail = raw[body_start:]
    blank_matches = list(re.finditer(r"\d+\s*_{2,}", tail))
    if not blank_matches:
        return tail
    last_blank_end = blank_matches[-1].end()
    wl_match = re.search(r"\n\s*A\.\s", tail[last_blank_end:])
    body_end = last_blank_end + wl_match.start() if wl_match else len(tail)
    return tail[:body_end].strip()


def extract_summary_contexts(summary_text: str) -> dict[str, tuple[str, str]]:
    """For 'NN __________' blanks in a cloze summary, return {number: (before, after)}
    windows of nearby text (trimmed to ~15 words each side) for use as a
    standalone question prompt."""
    pattern = re.compile(r"(\d+)\s*_{2,}")
    matches = list(pattern.finditer(summary_text))
    contexts: dict[str, tuple[str, str]] = {}
    for i, m in enumerate(matches):
        start_prev = matches[i - 1].end() if i > 0 else 0
        end_next = matches[i + 1].start() if i + 1 < len(matches) else len(summary_text)
        before = summary_text[start_prev : m.start()].strip()
        after = summary_text[m.end() : end_next].strip()
        before_words = before.split()
        after_words = after.split()
        before_trim = (("…" if len(before_words) > 15 else "") + " " + " ".join(before_words[-15:])).strip()
        after_trim = (" ".join(after_words[:15]) + ("…" if len(after_words) > 15 else "")).strip()
        contexts[m.group(1)] = (before_trim, after_trim)
    return contexts


def fix_word_options(word_options: list) -> list:
    """The source data has a parsing bug in ~15/70 tests where the word bank
    (meant to be 10 separate {key,text} entries, A-J) got merged into fewer
    entries with the later letters embedded inline in the text field, e.g.
    entry 'A' has text 'credibility deficit B. impartial facilitation C. ...'.
    Reconstruct the full A-J blob and re-split on the letter markers."""
    if len(word_options) >= 10:
        return word_options
    blob = " ".join(f"{o['key']}. {o['text']}" for o in word_options)
    pattern = re.compile(r"(?:^|\s)([A-J])\.\s+")
    matches = list(pattern.finditer(blob))
    if not matches:
        return word_options
    fixed = []
    for i, m in enumerate(matches):
        key = m.group(1)
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(blob)
        text = blob[start:end].strip()
        fixed.append({"key": key, "text": text})
    return fixed


def build_question(qg: dict, item: dict, passage: dict, summary_contexts, test_number: int):
    """Returns (qtype, prompt, options_or_None, max_words_or_None, accepted_list)."""
    gtype = qg["type"]

    if gtype in ("true_false_not_given", "yes_no_not_given", "multiple_choice"):
        answer = item.get("answer")
        if not answer:
            raise DataQualityError(f"question {item.get('number')}: missing '{gtype}' answer")

    if gtype == "true_false_not_given":
        return "single_choice", item["prompt"], TF_OPTIONS, None, [item["answer"]]

    if gtype == "yes_no_not_given":
        return "single_choice", item["prompt"], YN_OPTIONS, None, [item["answer"]]

    if gtype == "multiple_choice":
        options = [{"letter": o["key"], "text": o["text"]} for o in item["options"]]
        return "single_choice", item["prompt"], options, None, [item["answer"]]

    if gtype == "matching_headings":
        options = [{"letter": o["key"], "text": o["text"]} for o in qg["heading_options"]]
        answer = item.get("answer")
        if test_number == 30 and item["number"] in TEST_30_HEADING_OVERRIDES:
            answer = TEST_30_HEADING_OVERRIDES[item["number"]]
        valid_keys = {o["key"].lower() for o in qg["heading_options"]}
        if not answer or answer.strip().lower() not in valid_keys:
            raise DataQualityError(
                f"question {item.get('number')}: missing/invalid matching_headings answer "
                f"({answer!r})"
            )
        return "matching", item["prompt"], options, None, [answer]

    if gtype == "matching_information":
        options = [{"letter": k, "text": f"Paragraph {k}"} for k in sorted(passage["paragraphs"].keys())]
        answer = item.get("answer")
        valid_keys = set(passage["paragraphs"].keys())
        if not answer or answer.strip().upper() not in valid_keys:
            raise DataQualityError(
                f"question {item.get('number')}: missing/invalid matching_information answer ({answer!r})"
            )
        return "matching", item["prompt"], options, None, [answer]

    if gtype == "summary_completion_wordlist":
        word_options = qg["word_options"]
        if test_number == 27:
            word_options = TEST_27_WORD_OPTIONS
        word_options = fix_word_options(word_options)
        if len(word_options) < 10:
            raise DataQualityError(
                f"question group {qg['from']}-{qg['to']}: word_options list is incomplete "
                f"({len(word_options)}/10 entries, unrecoverable)"
            )
        options = [{"letter": o["key"], "text": o["text"]} for o in word_options]
        before, after = summary_contexts.get(str(item["number"]), ("", ""))
        prompt = normalize_blank(f"{before} ____ {after}".strip())
        answer = item.get("answer")
        m = re.match(r"^([A-Za-z]+)", answer) if answer else None
        if not m or m.group(1).upper() not in {o["key"].upper() for o in word_options}:
            raise DataQualityError(
                f"question {item.get('number')}: missing/invalid summary_completion_wordlist answer ({answer!r})"
            )
        accepted = [m.group(1)]
        return "matching", prompt, options, None, accepted

    if gtype == "note_completion":
        answer = item.get("answer")
        if not answer:
            raise DataQualityError(f"question {item.get('number')}: missing note_completion answer")
        before = item.get("context_before", "").strip()
        after = item.get("context_after", "").strip()
        prompt = normalize_blank(f"{before} ____ {after}".strip())
        return "text_input", prompt, None, 2, split_accepted(answer)

    if gtype == "sentence_completion":
        answer = item.get("answer")
        if not answer:
            raise DataQualityError(f"question {item.get('number')}: missing sentence_completion answer")
        prompt = normalize_blank(item["prompt"])
        return "text_input", prompt, None, 2, split_accepted(answer)

    raise ValueError(f"Unhandled question group type: {gtype}")


def short_description(test: dict) -> str:
    titles = [p["title"] for p in test["passages"]]
    return (
        "Three passages: " + "; ".join(titles) + ". "
        "40 questions covering True/False/Not Given, note completion, "
        "matching headings, matching information, sentence completion, "
        "multiple choice, Yes/No/Not Given, and summary completion."
    )


def main():
    manifest = json.loads((SEED_DIR / "manifest.json").read_text(encoding="utf-8"))

    lines = []
    lines.append("-- =====================================================================")
    lines.append("-- Migration 0015 — Seed the full IELTS Academic Reading test bank (70 sets)")
    lines.append("-- Generated by scripts/reading-seed/generate_seed_sql.py — do not")
    lines.append("-- hand-edit; re-run the generator instead if the source data changes.")
    lines.append("--")
    lines.append("-- Model (same as the original seed_reading_test_1.sql):")
    lines.append("--   * 1 row in `tests`         -> the reading set (skill='reading')")
    lines.append("--   * `test_sections` rows     -> one per passage")
    lines.append("--   * `test_questions` rows    -> one per question (40 per test)")
    lines.append("--   * `test_answers` rows      -> answer key per question")
    lines.append("--")
    lines.append("-- Run AFTER 0014_remove_dummy_reading_test.sql:")
    lines.append('--   psql "$DATABASE_URL" -f migrations/0015_seed_reading_test_bank.sql')
    lines.append("-- Idempotent: re-running rebuilds each test's sections/questions cleanly.")
    lines.append("-- =====================================================================")
    lines.append("")
    lines.append("BEGIN;")
    lines.append("")

    skipped = []

    for test in manifest:
        n = test["test_number"]
        try:
            test_lines = build_test_sql(test)
        except DataQualityError as e:
            skipped.append((n, str(e)))
            continue
        lines.extend(test_lines)

    lines.append("COMMIT;")

    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT_PATH} ({len(manifest) - len(skipped)}/{len(manifest)} tests)")
    if skipped:
        print("\nSKIPPED (data quality issues — fix source data and re-run):")
        for n, reason in skipped:
            print(f"  - Test {n}: {reason}")


def fix_split_paragraph_markers(paragraphs: dict) -> dict:
    """One passage (test 65, passage 2) has a leftover generation artifact:
    a literal '[F2 / G]' marker embedded mid-paragraph where the source
    should have split into paragraphs F and G but didn't. Detect any
    '[<label> / <letter>]' marker and split the paragraph there."""
    pattern = re.compile(r"\s*\[\s*[A-Za-z0-9]+\s*/\s*([A-Z])\s*\]\s*")
    fixed = dict(paragraphs)
    for key, text in list(paragraphs.items()):
        m = pattern.search(text)
        if not m:
            continue
        new_key = m.group(1)
        before = text[: m.start()].strip()
        after = text[m.end() :].strip()
        fixed[key] = before
        fixed[new_key] = after
    return fixed


# --------------------------------------------------------------------------
# Manual data-quality overrides, sourced directly from the original test
# documents (the generator/scraper corrupted these specific fields).
# --------------------------------------------------------------------------

# Test 27, Passage 3, Q37-40 (summary_completion_wordlist): word bank was
# empty in the source JSON. Supplied word list, in order A-J.
TEST_27_WORD_OPTIONS = [
    {"key": "A", "text": "Extended Mind thesis"},
    {"key": "B", "text": "physical externalism"},
    {"key": "C", "text": "internal psychological states"},
    {"key": "D", "text": "social linguistic conventions"},
    {"key": "E", "text": "Two-Dimensional Semantics"},
    {"key": "F", "text": "narrow content"},
    {"key": "G", "text": "Cartesian mentalism"},
    {"key": "H", "text": "chemical composition"},
    {"key": "I", "text": "psychological behavior"},
    {"key": "J", "text": "atomic theory"},
]

# Test 30, Passage 2, Q18-19 (matching_headings): answer field was corrupted
# for Q18 and missing for Q19. The corrupted text itself explicitly stated
# these two mappings twice (once in prose, once in a shifted list), so both
# are corroborated: Paragraph E -> heading viii, Paragraph F -> heading vi.
TEST_30_HEADING_OVERRIDES = {18: "viii", 19: "vi"}


def build_test_sql(test: dict) -> list[str]:
    lines = []
    n = test["test_number"]
    tid = test_uuid(n)
    title = f"IELTS Reading Mock Test {n}"
    description = short_description(test)
    instructions = (
        "You should spend about 20 minutes on each passage. "
        "Answer all 40 questions."
    )

    lines.append(f"-- ---- Reading Mock Test {n} " + "-" * max(0, 45 - len(str(n))))
    lines.append("INSERT INTO tests (id, skill, title, description, instructions, duration_seconds, position, is_published)")
    lines.append("VALUES (")
    lines.append(f"    {sql_quote(tid)},")
    lines.append("    'reading',")
    lines.append(f"    {sql_quote(title)},")
    lines.append(f"    {sql_quote(description)},")
    lines.append(f"    {sql_quote(instructions)},")
    lines.append("    3600,")
    lines.append(f"    {n},")
    lines.append("    TRUE")
    lines.append(")")
    lines.append("ON CONFLICT (id) DO UPDATE")
    lines.append("    SET title = EXCLUDED.title,")
    lines.append("        description = EXCLUDED.description,")
    lines.append("        instructions = EXCLUDED.instructions,")
    lines.append("        duration_seconds = EXCLUDED.duration_seconds,")
    lines.append("        position = EXCLUDED.position,")
    lines.append("        is_published = EXCLUDED.is_published,")
    lines.append("        updated_at = now();")
    lines.append("")
    lines.append(f"DELETE FROM test_sections WHERE test_id = {sql_quote(tid)};")
    lines.append("")

    for passage in test["passages"]:
        pnum = passage["passage_number"]
        sid = section_uuid(n, pnum)
        passage["paragraphs"] = fix_split_paragraph_markers(passage["paragraphs"])
        passage_text = build_passage_text(passage["paragraphs"])
        instr_parts = [
            SECTION_INSTRUCTIONS[qg["type"]](qg["from"], qg["to"])
            for qg in passage["question_groups"]
        ]
        section_instructions = "\n\n".join(instr_parts)

        lines.append(f"-- Passage {pnum}: {passage['title']}")
        lines.append("INSERT INTO test_sections (id, test_id, position, title, instructions, passage_text)")
        lines.append("VALUES (")
        lines.append(f"    {sql_quote(sid)}, {sql_quote(tid)}, {pnum}, {sql_quote(passage['title'])},")
        lines.append(f"    {sql_quote(section_instructions)},")
        lines.append(f"    {sql_quote(passage_text)}")
        lines.append(");")
        lines.append("")

        # Pre-compute summary-cloze contexts once per passage, if present.
        summary_contexts = {}
        for qg in passage["question_groups"]:
            if qg["type"] == "summary_completion_wordlist":
                summary_contexts = extract_summary_contexts(extract_summary_body(qg["raw"]))

        position = 0
        for qg in passage["question_groups"]:
            for item in qg["items"]:
                position += 1
                qtype, prompt, options, max_words, accepted = build_question(
                    qg, item, passage, summary_contexts, n
                )
                qid = question_uuid(n, item["number"])

                cols = ["id", "section_id", "qnumber", "position", "type", "prompt"]
                vals = [
                    sql_quote(qid), sql_quote(sid), str(item["number"]), str(position),
                    sql_quote(qtype), sql_quote(prompt),
                ]
                if options is not None:
                    cols.append("options")
                    vals.append(sql_jsonb(options))
                if max_words is not None:
                    cols.append("max_words")
                    vals.append(str(max_words))

                lines.append(f"INSERT INTO test_questions ({', '.join(cols)})")
                lines.append(f"  VALUES ({', '.join(vals)});")
                lines.append(f"INSERT INTO test_answers (question_id, accepted) VALUES ({sql_quote(qid)}, {sql_jsonb(accepted)});")

        lines.append("")

    lines.append("")
    return lines


if __name__ == "__main__":
    main()
    