import express from "express"
import mysql from "mysql2"
import cors from "cors"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const app = express()

// Global process-level error logging
process.on('uncaughtException', (err) => {
    console.error('[FATAL] Uncaught Exception:', err.stack || err.message);
});
process.on('unhandledRejection', (reason) => {
    console.error('[FATAL] Unhandled Rejection:', reason);
});

// Database configuration with SSL for Aiven
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
        ca: process.env.CA_CERT,
        rejectUnauthorized: true
    }
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.code, err.message);
        return;
    }
    console.log('Successfully connected to Aiven MySQL database');
});

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.json("Hello, this is the backend")
});

// Helper to safely run queries and standardize errors
function runQuery(sql, params, res, okCallback) {
    db.query(sql, params, (err, data) => {
        if (err) {
            console.error('[DB ERROR]', sql, err.code, err.sqlMessage);
            return res.status(500).json({ message: 'Database error', code: err.code || null });
        }
        okCallback(data);
    });
}

// Fetch all products with seller-based filtering, category, and sorting options
app.get("/products", (req, res) => {
    const { seller_id, cat_id, sort_by, order } = req.query;
  
    let query = `SELECT p.id, p.prod_name, p.prod_description, p.image, p.price, p.quantity, p.cat_id, p.seller_id,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(r.id) AS total_reviews
        FROM products p
        LEFT JOIN reviews r ON p.id = r.prod_id`;
  
    const params = [];
    const conditions = [];
    
    if (seller_id) {
      conditions.push("p.seller_id = ?");
      params.push(seller_id);
    }
    if (cat_id) {
      conditions.push("p.cat_id = ?");
      params.push(cat_id);
    }
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
  
    query += ` GROUP BY p.id`;
  
    if (sort_by) {
      const validSortFields = ["price", "avg_rating"];
      if (validSortFields.includes(sort_by)) {
        const sortOrder = order === "desc" ? "DESC" : "ASC";
        query += ` ORDER BY ${sort_by} ${sortOrder}`;
      }
    }
  
        runQuery(query, params, res, (data) => res.status(200).json(data));
});

  app.get("/notifications", async (req, res) => {
    const { buyer_id } = req.query;

    if (!buyer_id) {
        return res.status(400).json({ message: "buyer ID is required." });
    }

    let query = `SELECT purchases.id, purchases.prod_id, products.prod_name, products.prod_description, status
                 FROM purchases
                 JOIN products ON purchases.prod_id = products.id
                 JOIN users ON purchases.buyer_id = users.id
                 WHERE purchases.buyer_id = ? AND status = 'Shipped'`;


    db.query(query, [buyer_id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(data);
    });
});



// Fetch user contacts
app.get("/users", (req, res) => {
    const {buyer_id} =req.query;

    if (!buyer_id){
        return console.log("no user ID")
    }
    const q = "SELECT name, contact, address FROM users WHERE id = ?"

    db.query(q, [buyer_id], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(data);
    });
});

// Add to order purchase
app.post("/orders", (req, res) => {
    const order = req.body; // Directly fetch the body as an object
    
    if (!order || !Array.isArray(order)) {
        console.log(order); // Log the received order object
        return res.status(400).json({ message: "Valid order data is required." });
    }

    const purchasesQuery =
        "INSERT INTO purchases (prod_id, buyer_id, seller_id, quantity, total_price) VALUES ?";
    const updateStockQuery =
        "UPDATE products SET quantity = quantity - ? WHERE id = ?";

    // Extract purchase and stock update values
    const purchaseValues = order.map((item) => [
        item.prod_id,
        item.buyer_id,
        item.seller_id,
        item.quantity,
        item.total_price,
    ]);
    const stockUpdateValues = order.map((item) => [item.quantity, item.prod_id]);

    // Insert purchases
    db.query(purchasesQuery, [purchaseValues], (err) => {
        if (err) {
            console.error("Error while inserting purchases:", err);
            return res.status(500).json({ message: "Error while inserting purchases." });
        }

        // Update product stock
        const stockUpdatePromises = stockUpdateValues.map(([quantity, prod_id]) =>
            new Promise((resolve, reject) => {
                db.query(updateStockQuery, [quantity, prod_id], (err) => {
                    if (err) {
                        console.error("Error while updating stock:", err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            })
        );

        Promise.all(stockUpdatePromises)
            .then(() => {
                res.status(200).json({ message: "Order Successful" });
            })
            .catch((err) => {
                res.status(500).json({ message: "Error while updating stock." });
            });
    });
});

//get order purchases from a specific user
app.get("/orders", (req, res) => {
    const { buyer_id, seller_id } = req.query;

    if (!buyer_id && !seller_id) {
        return res.status(400).json({ message: "At least one ID (buyer or seller) is required." });
    }

    let query = `SELECT purchases.id, purchases.prod_id, products.prod_name, purchases.buyer_id, users.name, purchases.seller_id, purchases.quantity, total_price, purchase_date, users.address, status
                 FROM purchases
                 JOIN products ON purchases.prod_id = products.id
                 JOIN users ON purchases.buyer_id = users.id`;
    const params = [];

    if (buyer_id) {
        query += " WHERE purchases.buyer_id = ? AND (status = 'Pending' OR status = 'Shipped')";
        params.push(buyer_id);
    } else if (seller_id) {
        query += " WHERE purchases.seller_id = ?";
        params.push(seller_id);
    }

    db.query(query, params, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(data);
    });
});

// purchase history for completed status
app.get("/orderhistory", (req, res) => {
    const { buyer_id } = req.query;

    if (!buyer_id) {
        return res.status(400).json({ message: "Buyer ID is required." });
    }

    let query = `SELECT purchases.id, purchases.prod_id, products.prod_name, products.image, purchases.buyer_id, 
                seller.username AS seller_name, purchases.quantity, products.price, purchases.total_price, purchases.purchase_date, purchases.status
                FROM purchases
                JOIN products ON purchases.prod_id = products.id
                JOIN users AS seller ON purchases.seller_id = seller.id`;
    const params = [];

    if (buyer_id) {
        query += " WHERE purchases.buyer_id = ? AND status = 'Completed'";
        params.push(buyer_id);
    }

    db.query(query, params, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(data);
    });
});

// total sold per item
app.get("/totalsold", (req, res) => {
    const query = `SELECT prod_id, SUM(quantity) AS total_sold 
                FROM purchases 
                WHERE status = 'Completed' 
                GROUP BY prod_id;`;

    db.query(query, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(data);
    });
});


//add reviews for products
app.post("/addreview", (req, res) => {
    const { prod_id, buyer_id, rating, comment, purchase_id } = req.body;

    if (!prod_id || !buyer_id || !rating || !purchase_id) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const insertReviewQuery = `INSERT INTO reviews (prod_id, buyer_id, rating, comment) VALUES (?, ?, ?, ?)`;
    const updatePurchaseQuery = `UPDATE purchases SET status = 'Completed' WHERE id = ?`;

    db.query(insertReviewQuery, [prod_id, buyer_id, rating, comment], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(updatePurchaseQuery, [purchase_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            return res.status(200).json({ message: "Review added successfully and status updated to Completed." });
        });
    });
});

//see reviews for seller side
app.get("/reviewdetails", (req, res) => {
    const { seller_id } = req.query;

    if (!seller_id) {
        return res.status(400).json({ message: "Seller ID is required." });
    }

    const query = `
        SELECT reviews.id, reviews.rating, reviews.comment, reviews.created_at, products.prod_name, users.name AS buyer_name
        FROM reviews
        JOIN products ON reviews.prod_id = products.id
        JOIN users ON reviews.buyer_id = users.id
        WHERE products.seller_id = ?`;

    db.query(query, [seller_id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(data);
    });
});

// Fetch income details with an overview 
app.get("/incomedetails", (req, res) => { 
    const { seller_id } = req.query; 
    if (!seller_id) {
     return res.status(400).json({ message: "Seller ID is required." }); 
    } 
    const overviewQuery = ` SELECT SUM(CASE WHEN ps.status = 'Pending' THEN ps.total_price ELSE 0 END) AS pending_total, 
                            SUM(CASE WHEN ps.status = 'Completed' THEN ps.total_price ELSE 0 END) AS released_total, 
                            SUM(CASE WHEN ps.status = 'Pending' AND WEEK(ps.purchase_date) = WEEK(CURDATE()) 
                            THEN ps.total_price ELSE 0 END) AS pending_week, 
                            SUM(CASE WHEN ps.status = 'Completed' AND WEEK(ps.purchase_date) = WEEK(CURDATE()) 
                            THEN ps.total_price ELSE 0 END) AS released_week, 
                            SUM(CASE WHEN ps.status = 'Pending' AND MONTH(ps.purchase_date) = MONTH(CURDATE()) 
                            THEN ps.total_price ELSE 0 END) AS pending_month, 
                            SUM(CASE WHEN ps.status = 'Completed' AND MONTH(ps.purchase_date) = MONTH(CURDATE()) 
                            THEN ps.total_price ELSE 0 END) AS released_month 
                            FROM purchases ps 
                            WHERE ps.seller_id = ?`; 
    
    const detailsQuery = ` SELECT u.name AS buyer_name, p.prod_name, ps.total_price AS release_amount 
                            FROM purchases ps 
                            JOIN users u ON ps.buyer_id = u.id 
                            JOIN products p ON ps.prod_id = p.id 
                            WHERE ps.seller_id = ? AND ps.status = 'Completed'`; 
    
    const params = [seller_id]; 
    
    db.query(overviewQuery, params, (err, overviewData) => { 
        if (err) return res.status(500).json({ error: err.message }); 
        
        db.query(detailsQuery, params, (err, detailsData) => { 
            if (err) return res.status(500).json({ error: err.message }); 
            return res.status(200).json({ overview: overviewData[0], details: detailsData }); 
        }); 
    }); 
});
    
// Update order status
app.put("/update-status", (req, res) => {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
        return res.status(400).json({ error: "Missing orderId or status" });
    }

    const query = "UPDATE purchases SET status = ? WHERE id = ?";
    const params = [status, orderId];

    db.query(query, params, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json({ message: "Order status updated successfully!" });
    });
});


// Add to cart products 
app.post("/addtocart", (req, res) => {
    const { prod_id, user_id, quantity } = req.body;

    // Validate input
    if (!prod_id || !user_id || !quantity) {
        console.error("Missing required fields");
        return res.status(400).json({ message: "Missing required fields" });
    }

    const checkQuery = "SELECT * FROM cart WHERE prod_id = ? AND user_id = ?";
    db.query(checkQuery, [prod_id, user_id], (err, data) => {
        if (err) {
            console.error("Error checking cart:", err); // Log SQL error
            return res.status(500).json({ message: "Server error while checking cart." });
        }

        if (data.length > 0) {
            const updateQuery = "UPDATE cart SET quantity = quantity + ? WHERE prod_id = ? AND user_id = ?";
            db.query(updateQuery, [quantity, prod_id, user_id], (err) => {
                if (err) {
                    console.error("Error updating cart:", err); // Log SQL error
                    return res.status(500).json({ message: "Server error while updating cart." });
                }
                return res.status(200).json({ message: "Product quantity updated in cart." });
            });
        } else {
            const insertQuery = "INSERT INTO cart (prod_id, user_id, quantity) VALUES (?, ?, ?)";
            db.query(insertQuery, [prod_id, user_id, quantity], (err) => {
                if (err) {
                    console.error("Error adding to cart:", err); // Log SQL error
                    return res.status(500).json({ message: "Server error while adding to cart." });
                }
                return res.status(200).json({ message: "Product added to cart successfully." });
            });
        }
    });
});

// Get buyer's cart items
app.get("/cart", (req, res) => {
    const buyer_id = req.query.buyer_id; // Get buyer_id from query parameters
    if (!buyer_id) return res.status(400).json({ message: "Buyer ID is required." });

    const q = `
        SELECT cart.id AS cart_id, cart.prod_id, cart.quantity, products.prod_name, products.price, products.image, products.seller_id 
        FROM cart 
        JOIN products ON cart.prod_id = products.id 
        WHERE cart.user_id = ?`;

    db.query(q, [buyer_id], (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(data);
    });
});

// Update cart item quantity
app.put("/cart/update", (req, res) => {
    const { cart_id, quantity } = req.body;
    if (!cart_id || quantity == null)
        return res.status(400).json({ message: "Cart ID and quantity are required." });

    const q = "UPDATE cart SET quantity = ? WHERE id = ?";
    db.query(q, [quantity, cart_id], (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: "Cart item updated." });
    });
});

// Delete cart item
app.delete("/cart/delete/:cartId", (req, res) => {
    const cartId = req.params.cartId; // Fix param reference
    const q = "DELETE FROM cart WHERE id = ?";
    db.query(q, [cartId], (err) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: "Cart item deleted." });
    });
});

// Checkout items
app.post("/cart/checkout", (req, res) => {
    const { buyer_id, cartItems } = req.body;

    if (!buyer_id || !cartItems || !Array.isArray(cartItems)) {
        return res.status(400).json({ message: "Buyer ID and valid cart items are required." });
    }

    const purchasesQuery =
        "INSERT INTO purchases (prod_id, buyer_id, seller_id, quantity, total_price) VALUES ?";
    const updateStockQuery = "UPDATE products SET quantity = quantity - ? WHERE id = ?";
    const deleteCartQuery = "DELETE FROM cart WHERE id IN (?)";

    const purchasesData = cartItems.map((item) => [
        item.prod_id,
        buyer_id,
        item.seller_id,
        item.quantity,
        item.price * item.quantity,
    ]);
    const cartIds = cartItems.map((item) => item.cart_id);

    db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);

        db.query(purchasesQuery, [purchasesData], (err) => {
            if (err) {
                db.rollback();
                return res.status(500).json(err);
            }

            const stockUpdates = cartItems.map((item) =>
                db.query(updateStockQuery, [item.quantity, item.prod_id])
            );

            Promise.all(stockUpdates)
                .then(() => {
                    db.query(deleteCartQuery, [cartIds], (err) => {
                        if (err) {
                            db.rollback();
                            return res.status(500).json(err);
                        }

                        db.commit((err) => {
                            if (err) {
                                db.rollback();
                                return res.status(500).json(err);
                            }
                            res.status(200).json({ message: "Checkout successful." });
                        });
                    });
                })
                .catch((err) => {
                    db.rollback();
                    res.status(500).json(err);
                });
        });
    });
});

// Fetch all category
app.get("/category", (req, res) => {
    const q = "SELECT * FROM category";
    runQuery(q, [], res, (data) => res.json(data));
});

// Login endpoint
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }
    const q = "SELECT id, name, user_type, password FROM users WHERE email = ?";
    runQuery(q, [email], res, (rows) => {
        if (!rows.length) return res.status(401).json({ message: "Invalid email or password." });
        const user = rows[0];
        if (user.password !== password) return res.status(401).json({ message: "Invalid email or password." });
        return res.status(200).json({
            message: "Login successful.",
            user_id: user.id,
            name: user.name,
            role: user.user_type
        });
    });
});

// Basic health check to verify DB connectivity explicitly
app.get("/health", (req, res) => {
    runQuery("SELECT 1 AS ok", [], res, (rows) => {
        res.json({ status: "up", db: rows[0]?.ok === 1 });
    });
});

// Debug endpoint to list tables in current database
app.get("/debug/tables", (req, res) => {
    const currentDb = db.config.database;
    runQuery("SHOW TABLES", [], res, (rows) => res.json({ database: currentDb, tables: rows }));
});

// Start server and enumerate registered routes for debugging (moved near end to avoid duplicate PORT)
// NOTE: final listen is defined at bottom of file.

//sign up 
app.post("/Signup", (req, res) => {
    const q = "INSERT INTO users (`username`, `password`, `name`, `email`, `contact`, `address`, `user_type`) VALUES (?)"
    const values = [
        req.body.username,
        req.body.password,
        req.body.name,
        req.body.email,
        req.body.contact,
        req.body.address,
        req.body.user_type
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("User successfully added")
    });
    
});
// Add a product
app.post("/products", (req, res) => {
    const q = "INSERT INTO products (`prod_name`, `prod_description`, `image`, `price`, `quantity`, `cat_id`, `seller_id`) VALUES (?)";
    const values = [
        req.body.prod_name,
        req.body.prod_description,
        req.body.image,
        req.body.price,
        req.body.quantity,
        req.body.cat_id,
        req.body.seller_id
    ];

    db.query(q, [values], (err, data) => {
        if (err) {
            console.error("Error inserting product:", err); // Log error to console
            return res.status(500).json(err); // Return a 500 status with error message
        }
        return res.json("Product successfully added");
    });
});


// Delete a product
app.delete("/products/:id", (req, res) => {
    const productId = req.params.id;
    const q = "DELETE FROM products WHERE id = ?"

    db.query(q, [productId], (err, data) => {
        if (err) return res.json(err)
        return res.json("Product successfully deleted")
    });
});

// Update a product
app.put("/products/:id", (req, res) => {
    const productId = req.params.id;
    const q = "UPDATE products SET `prod_name` = ?, `prod_description` = ?, `image` = ?, `price` = ?, `quantity` = ? , `cat_id` = ? WHERE id = ?"
    const values = [
        req.body.prod_name,
        req.body.prod_description,
        req.body.image,
        req.body.price,
        req.body.quantity,
        req.body.cat_id
    ];

    db.query(q, [...values, productId], (err, data) => {
        if (err) return res.json(err)
        return res.json("Product successfully updated")
    });
});

// Deduct stock on purchase
app.post("/purchase", (req, res) => {
    const { product_id, quantity } = req.body;

    const checkStockQuery = "SELECT stock_quantity FROM products WHERE id = ?";
    const updateStockQuery = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?";

    db.query(checkStockQuery, [product_id], (err, data) => {
        if (err) return res.json(err);

        const currentStock = data[0]?.stock_quantity;
        if (currentStock < quantity) {
            return res.status(400).json("Not enough stock available");
        }

        db.query(updateStockQuery, [quantity, product_id], (err, data) => {
            if (err) return res.json(err);
            return res.json("Stock successfully updated after purchase");
        });
    });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Connected to backend on port ${PORT}`)
});
