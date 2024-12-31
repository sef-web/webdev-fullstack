import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "marketplace"
})

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.json("Hello, this is the backend")
})

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


// Fetch all users
app.get("/users", (req, res) => {
    const q = "SELECT * FROM users"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})
// Fetch all category
app.get("/category", (req, res) => {
    const q = "SELECT * FROM category"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

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
            user_id: user.user_id,
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
    })
    
})
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
    })
})

// Delete a product
app.delete("/products/:id", (req, res) => {
    const productId = req.params.id;
    const q = "DELETE FROM products WHERE id = ?"

    db.query(q, [productId], (err, data) => {
        if (err) return res.json(err)
        return res.json("Product successfully deleted")
    })
})

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
    })
})

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
})
