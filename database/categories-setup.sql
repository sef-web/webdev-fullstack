-- ============================================
-- Basic Categories Setup (Optional)
-- Purpose: Add common product categories if needed
-- ============================================

-- Check if you already have categories
SELECT * FROM category;

-- If the table is empty, add these basic categories:
-- Uncomment and run the lines below if you need to add categories

/*
INSERT INTO category (cat_name) VALUES 
('Electronics'),
('Clothing'),
('Home & Garden'),
('Sports & Outdoors'),
('Books'),
('Toys & Games'),
('Health & Beauty'),
('Food & Beverages');
*/

-- Check categories again
SELECT * FROM category;
