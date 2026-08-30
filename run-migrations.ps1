$env:PGPASSWORD = "1234"

$files = @(
    "0001_init.sql",
    "0002_add_phone_auth.sql",
    "0003_user_profile_fields.sql",
    "0004_profile_details.sql",
    "0005_writing_tests.sql",
    "0006_test_description.sql",
    "0007_allow_adhoc_submissions.sql",
    "0008_test_engine.sql",
    "0009_fix_listening_test_77_ordering.sql",
    "0010_grammar_engine.sql",
    "0011_writing_tips_engine.sql",
    "0012_remove_dummy_writing_test.sql",
    "0013_seed_writing_test_bank.sql",
    "0014_remove_dummy_reading_test.sql",
    "0015_seed_reading_test_bank.sql",
    "seed_grammar_module_1_ch1.sql",
    "seed_grammar_ch2.sql",
    "seed_grammar_ch3.sql",
    "seed_grammar_ch4.sql",
    "seed_grammar_ch5.sql",
    "seed_grammar_ch6.sql",
    "seed_grammar_ch7.sql",
    "seed_grammar_ch8.sql",
    "seed_grammar_ch9.sql",
    "seed_grammar_ch10.sql",
    "seed_grammar_ch11.sql",
    "seed_grammar_modules_all.sql",
    "seed_listening_test_77.sql",
    "seed_listening_test_77_part1.sql",
    "seed_listening_test_77_part1_q8_10.sql",
    "seed_listening_test_77_part2.sql",
    "seed_listening_test_77_part3_mc.sql",
    "seed_listening_test_77_part3_multi.sql",
    "seed_writing_test_1.sql",
    "seed_writing_test_1_description.sql",
    "seed_speaking_tests.sql",
    "backfill_speaking_skill_bands.sql"
)

foreach ($f in $files) {
    Write-Host "Applying $f..." -ForegroundColor Cyan
    psql -U postgres -d nexted_ielts -f "migrations\$f"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "FAILED at $f - stopping." -ForegroundColor Red
        break
    }
}
