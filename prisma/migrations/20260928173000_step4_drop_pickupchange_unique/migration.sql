-- Allow multiple resolved (CANCELLED/REJECTED) pickup-change rows per order.
DROP INDEX IF EXISTS "pickup_changes_orderId_status_key";