-- Adds a browse-card description to the seeded IELTS Writing Test 1.
-- Run AFTER 0006_test_description.sql.
UPDATE tests
SET description = 'Maps + opinion essay. Task 1 compares two city-hospital road maps (2007 vs 2010); Task 2 argues about living with a foreign language.'
WHERE id = '11111111-1111-1111-1111-111111111111';