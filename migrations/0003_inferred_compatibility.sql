-- Additional inferred names read by source member/label forms. Historical data remains absent.
ALTER TABLE membership ADD COLUMN mem_newsgroup TEXT;
ALTER TABLE newsgroup ADD COLUMN newsgroup_code TEXT;
ALTER TABLE newsgroup ADD COLUMN newsgroup TEXT;
