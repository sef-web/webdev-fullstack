import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Buyerpage = () => {
    const [items, setItems] = useState([]); // To store fetched products
    const [categories, setCategories] = useState([]); // To store categories
    const [selectedCategoryId, setSelectedCategoryId] = useState(""); // Selected category filter
    const [selectedSortBy, setSelectedSortBy] = useState(""); // Selected sort option (price or rating)
    const [sortOrder, setSortOrder] = useState("asc"); // Sorting order (asc/desc)

    // Fetch products and apply filters/sorting
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const res = await axios.get("http://localhost:8800/products", {
                    params: {
                        cat_id: selectedCategoryId, // Filter by category
                        sort_by: selectedSortBy, // Sort field (price/rating)
                        order: sortOrder, // Sorting order (asc/desc)
                    },
                });
                setItems(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllData();
    }, [selectedCategoryId, selectedSortBy, sortOrder]); // Re-run when filters change

    // Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:8800/category");
                setCategories(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCategories();
    }, []);

    // Handle category filter change
    const handleCategoryChange = (e) => {
        setSelectedCategoryId(e.target.value);
    };

    // Handle sorting change
    const handleSortChange = (e) => {
        setSelectedSortBy(e.target.value);
    };

    // Handle sorting order toggle
    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    return (
        <div className="buyer-container">
            <h1 className="page-title">Marketplace</h1>

            {/* Filters and Sorting */}
            <div className="filter-sort-container">
                <select value={selectedCategoryId} onChange={handleCategoryChange}>
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.cat_id} value={category.cat_id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>

                <select value={selectedSortBy} onChange={handleSortChange}>
                    <option value="">Sort By</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                </select>

                <button onClick={toggleSortOrder}>
                    Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
                </button>
            </div>

            {/* Display Products */}
            <div className="card-container">
                {items.map((item) => (
                    <div className="card" key={item.id}>
                        {item.image && <img src={item.image} alt={item.prod_name} />}
                        <h2>{item.prod_name}</h2>
                        <p>{item.prod_description}</p>
                        <span className="price">${item.price}</span>
                        <span className="rating">Rating: {item.rating}/5</span>
                        <div className="card-buttons">
                            <button className="btn">Buy Now</button>
                            <button className="btn">Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>

            <button className="cart-button">
                <Link to="/BuyerCart">Shopping Cart</Link>
            </button>
        </div>
    );
};

export default Buyerpage;
