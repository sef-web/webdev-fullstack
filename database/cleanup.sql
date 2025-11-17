-- ============================================
-- Database Cleanup Script for Fresh Start
-- Purpose: Remove all data but keep table structures
-- ============================================

-- IMPORTANT: This will DELETE ALL DATA!
-- Make sure you have a backup if needed

-- Step 1: Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Step 2: Clear all tables in correct order (respecting dependencies)
-- Clear reviews first (depends on purchases and products)
TRUNCATE TABLE reviews;

-- Clear purchases (depends on products and users)
TRUNCATE TABLE purchases;

-- Clear cart items (depends on products and users)
TRUNCATE TABLE cart;

-- Clear products (depends on users and category)
TRUNCATE TABLE products;

-- Clear users (no dependencies, but others depend on it)
TRUNCATE TABLE users;

-- Note: We keep the category table - it has your product categories
-- If you want to clear categories too, uncomment below:
-- TRUNCATE TABLE category;

-- Step 3: Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Step 4: Verify all tables are empty
SELECT 'reviews' as table_name, COUNT(*) as row_count FROM reviews
UNION ALL
SELECT 'purchases', COUNT(*) FROM purchases
UNION ALL
SELECT 'cart', COUNT(*) FROM cart
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'category', COUNT(*) FROM category;

-- ============================================
-- Script Complete!
-- All user data has been cleared.
-- Table structures remain intact.
-- You can now add fresh test data.
-- ============================================
