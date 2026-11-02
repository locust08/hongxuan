CREATE TABLE app_form_drafts (session_id TEXT NOT NULL, form_kind TEXT NOT NULL, fields TEXT NOT NULL, expires INTEGER NOT NULL, PRIMARY KEY(session_id,form_kind));
CREATE INDEX app_form_drafts_expiry ON app_form_drafts(expires);
ALTER TABLE app_outbox ADD COLUMN lease_until INTEGER NOT NULL DEFAULT 0;
ALTER TABLE app_outbox ADD COLUMN delivery_key TEXT;
