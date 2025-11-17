# Database Cleanup Guide

## 🎯 Purpose
Clean all user data from the database to start fresh with proper Cloudinary image storage.

## ⚠️ WARNING
**This will DELETE ALL DATA!** Make sure you understand what you're doing.

## 📋 How to Run the Cleanup

### Option 1: Using Aiven Web Console (Recommended)

1. **Go to Aiven Console**
   - Visit: https://console.aiven.io
   - Navigate to your `marketly-db` service
   - Click on "Query" or "Console" tab

2. **Copy and Paste**
   - Open `cleanup.sql` file
   - Copy ALL the SQL commands
   - Paste into the query editor
   - Click "Execute" or "Run"

3. **Verify Results**
   - The last query will show row counts
   - All tables should show 0 rows (except category if you didn't truncate it)

### Option 2: Using MySQL Command Line

```bash
# Connect to your Aiven database
mysql -h marketly-db-marketly.e.aivencloud.com -P 12131 -u avnadmin -p --ssl-ca=/path/to/ca.pem defaultdb

# Then run the script
source /path/to/cleanup.sql

# Or paste the SQL directly
```

### Option 3: Using Backend API (We can create an endpoint)

If you prefer, I can create a special admin endpoint that runs this cleanup.

## 📊 What Gets Deleted

- ✅ All users (buyers and sellers)
- ✅ All products
- ✅ All cart items
- ✅ All purchases/orders
- ✅ All reviews
- ❌ Categories remain (unless you uncomment that line)

## 🔄 After Cleanup

1. Categories should still exist
2. All tables still exist (just empty)
3. Ready for fresh test data with Cloudinary images

## 🆘 Need Help?

If you need to:
- Backup data before cleanup
- Keep specific data
- Restore after cleanup

Let me know!

## ✅ Next Steps After Cleanup

1. Set up Cloudinary account
2. Integrate Cloudinary upload widget
3. Create 5 test seller accounts
4. Add products with proper Cloudinary images
5. Test the entire flow
