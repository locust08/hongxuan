-- Frozen cart JSON is validated under the same D1 transaction that creates the enquiry.
ALTER TABLE app_submissions ADD COLUMN snapshot TEXT NOT NULL DEFAULT '[]';
CREATE TRIGGER app_submission_snapshot_guard BEFORE INSERT ON app_submissions
BEGIN
 SELECT CASE WHEN json_valid(NEW.snapshot)=0 OR json_type(NEW.snapshot)<>'array' OR json_array_length(NEW.snapshot)=0 THEN RAISE(ABORT,'CART_CHANGED') END;
 SELECT CASE WHEN (SELECT count(*) FROM order_products_tmp WHERE tmp_order_id=NEW.cartid)<>json_array_length(NEW.snapshot) THEN RAISE(ABORT,'CART_CHANGED') END;
 SELECT CASE WHEN EXISTS(
  SELECT 1 FROM json_each(NEW.snapshot) s
  LEFT JOIN products p ON p.prod_id=json_extract(s.value,'$.prod_id')
  LEFT JOIN order_products_tmp t ON t.tmp_order_id=NEW.cartid AND t.prod_id=json_extract(s.value,'$.prod_id')
  WHERE p.prod_id IS NULL OR t.prod_id IS NULL OR t.prod_qty IS NOT json_extract(s.value,'$.prod_qty') OR p.prod_name IS NOT json_extract(s.value,'$.prod_name')
 ) THEN RAISE(ABORT,'CART_CHANGED') END;
END;
ALTER TABLE app_outbox ADD COLUMN next_attempt_at INTEGER NOT NULL DEFAULT 0;
CREATE INDEX app_outbox_due ON app_outbox(state,next_attempt_at,lease_until);
