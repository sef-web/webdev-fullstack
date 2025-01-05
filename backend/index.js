import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "marketplace"
});

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.json("Hello, this is the backend")
});

// Fetch all products with seller-based filtering, category, and sorting options
app.get("/products", (req, res) => {
    const { seller_id, cat_id, sort_by, order } = req.query;

    // Start building the query
    let query = "SELECT * FROM products";
    const params = [];

    // Filter by seller_id
    if (seller_id) {
        query += " WHERE seller_id = ?";
        params.push(seller_id);
    }

    // Filter by category (cat_id)
    if (cat_id) {
        query += seller_id ? " AND cat_id = ?" : " WHERE cat_id = ?";
        params.push(cat_id);
    }

    // Add sorting options
    if (sort_by) {
        const validSortFields = ["price", "rating"];
        if (validSortFields.includes(sort_by)) {
            const sortOrder = order === "desc" ? "DESC" : "ASC"; // Default to ASC
            query += ` ORDER BY ${sort_by} ${sortOrder}`;
        }
    }

    // Execute the query
    db.query(query, params, (err, data) => {
        if (err) return res.status(500).json(err);
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
                console.log("Product added to cart successfully");
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
    const q = "SELECT * FROM category"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    });
});

// Login endpoint
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Query to check if the user exists
    const q = "SELECT * FROM users WHERE email = ?";
    db.query(q, [email], (err, data) => {
        if (err) return res.status(500).json({ message: "Server error." });

        if (data.length === 0) {
            // If no user is found
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const user = data[0];

        // Check if the password matches
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Respond with user information (excluding sensitive data)
        return res.status(200).json({
            message: "Login successful.",
            user_id: user.id,
            name: user.name,
            role: user.user_type, // 'buyer' or 'seller'
        });
    });
});

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
    const q = "INSERT INTO products (`prod_name`, `prod_description`, `image`, `price`, `quantity`, `cat_id`, `seller_id`) VALUES (?)"
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
        if (err) return res.json(err)
        return res.json("Product successfully added")
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

app.listen(8800, () => {
    console.log("Connected to backend")
});
