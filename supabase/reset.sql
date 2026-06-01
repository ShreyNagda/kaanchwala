-- ===========================================
-- Kaanchwala v2 — FULL RESET SCRIPT
-- Run this in Supabase SQL Editor to wipe
-- all app objects, then re-run:
--   001_init.sql
--   002_admin_features.sql
-- ===========================================

-- ========== DROP TRIGGERS ==========

DROP TRIGGER IF EXISTS on_auth_user_created          ON auth.users;
DROP TRIGGER IF EXISTS on_variant_stock_change       ON variants;
DROP TRIGGER IF EXISTS update_profiles_updated_at    ON profiles;
DROP TRIGGER IF EXISTS update_products_updated_at    ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at      ON orders;
DROP TRIGGER IF EXISTS update_prescriptions_updated_at ON prescriptions;

-- ========== DROP FUNCTIONS ==========

DROP FUNCTION IF EXISTS public.handle_new_user()     CASCADE;
DROP FUNCTION IF EXISTS public.sync_stock_status()   CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at()   CASCADE;

-- ========== DROP TABLES (reverse dependency order) ==========

DROP TABLE IF EXISTS admin_logs        CASCADE;
DROP TABLE IF EXISTS admin_sessions    CASCADE;
DROP TABLE IF EXISTS prescriptions     CASCADE;
DROP TABLE IF EXISTS order_items       CASCADE;
DROP TABLE IF EXISTS orders            CASCADE;
DROP TABLE IF EXISTS discounts         CASCADE;
DROP TABLE IF EXISTS variants          CASCADE;
DROP TABLE IF EXISTS products          CASCADE;
DROP TABLE IF EXISTS profiles          CASCADE;

-- ========== DROP ENUMS ==========

DROP TYPE IF EXISTS payment_method      CASCADE;
DROP TYPE IF EXISTS return_status       CASCADE;
DROP TYPE IF EXISTS discount_type       CASCADE;
DROP TYPE IF EXISTS prescription_status CASCADE;
DROP TYPE IF EXISTS order_status        CASCADE;
DROP TYPE IF EXISTS product_category    CASCADE;
DROP TYPE IF EXISTS user_role           CASCADE;

-- ===========================================
-- Done. Now run 001_init.sql then 002_admin_features.sql
-- ===========================================
