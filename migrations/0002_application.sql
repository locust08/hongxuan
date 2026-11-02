-- Application tables are additive. Original 24 tables are imported separately from private-data/active-seed.sql.
CREATE TABLE app_sessions (id TEXT PRIMARY KEY, csrf TEXT NOT NULL, userid INTEGER, groupid INTEGER, username TEXT NOT NULL DEFAULT '', cartid TEXT NOT NULL, expires INTEGER NOT NULL);
CREATE INDEX app_sessions_expiry ON app_sessions(expires);
CREATE TABLE app_captcha (session_id TEXT PRIMARY KEY, code TEXT NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE app_submissions (token TEXT PRIMARY KEY, session_id TEXT NOT NULL, cartid TEXT NOT NULL UNIQUE, order_id TEXT UNIQUE);
CREATE TABLE app_outbox (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, order_id TEXT, recipient TEXT NOT NULL, subject TEXT NOT NULL, payload TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'queued', attempts INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, sent_at TEXT, last_error TEXT);
CREATE TABLE app_uploads (path TEXT PRIMARY KEY, r2_key TEXT NOT NULL, content_type TEXT NOT NULL, size INTEGER NOT NULL, created_by INTEGER, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE UNIQUE INDEX app_cart_item ON order_products_tmp(tmp_order_id,prod_id) WHERE tmp_order_id LIKE 'modern-%';
-- Inferred from source-visible membership forms. No historical data was supplied.
CREATE TABLE membership (mem_id INTEGER PRIMARY KEY AUTOINCREMENT, mem_login TEXT COLLATE NOCASE,mem_password TEXT,mem_pwd TEXT,mem_compname TEXT,mem_add TEXT,mem_tel TEXT,mem_fax TEXT,mem_email TEXT,mem_name TEXT,mem_remarks TEXT,mem_status INTEGER DEFAULT 0,mem_creation_date TEXT,mem_modified_date TEXT,mem_created_by INTEGER,mem_modified_by INTEGER);
CREATE TABLE company (rec_id INTEGER PRIMARY KEY AUTOINCREMENT,comp_name TEXT,add1 TEXT,add2 TEXT,add3 TEXT,country TEXT,cont_no TEXT,fax_no TEXT,email TEXT,cont_name TEXT,newsgroup TEXT,remarks TEXT,modified_by INTEGER,modified_date TEXT);
CREATE TABLE newsgroup (grp_id TEXT PRIMARY KEY,grp_desc TEXT);
