import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BuyerPage = () => {
  const [items, setItems] = useState([]); // Products
  const [categories, setCategories] = useState([]); // Categories
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // Filter by category
  const [selectedSortBy, setSelectedSortBy] = useState(""); // Sort option
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order
  const [cartData, setCartData] = useState([]); // Cart data
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false); // Confirm Checkout visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // Product to buy now
  const [userContact, setUserContact] = useState([]);
  const [buyerDetails, setBuyerDetails] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const buyer_Id = user.user_id;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8800/products", {
          params: {
            cat_id: selectedCategoryId,
            sort_by: selectedSortBy,
            order: sortOrder,
          },
        });
        setItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [selectedCategoryId, selectedSortBy, sortOrder]);

    // Fetch user contacts
  useEffect(() => {
    const userContacts = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/users?buyer_id=${buyer_Id}`)
        setUserContact(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    userContacts();
  }, [buyer_Id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8800/category");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Add to cart
  const handleAddToCart = async (item) => {
    const cartItem = {
      prod_id: item.id,
      user_id: buyer_Id,
      quantity: 1,
    };

    try {
      const res = await axios.post("http://localhost:8800/addtocart", cartItem);
      setCartData((prevCartData) => [...prevCartData, cartItem]); // Update cart state
      alert(res.data.message);
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data || err.message);
    }
  };

  // Handle Buy Now click
  const handleBuyNow = (item) => {
    setSelectedProduct(item);
    setBuyerDetails({ ...buyerDetails, quantity: 1 }); // Reset quantity
    setShowCheckoutPopup(true);
  };

  // Confirm Checkout
  const handleConfirmCheckout = async (userContact) => {

    const order = [
      {
        prod_id: selectedProduct.id,
        buyer_id: buyer_Id,
        seller_id: selectedProduct.seller_id, // Ensure this field is populated in product data
        quantity: 1, // Default quantity for now
        total_price: selectedProduct.price, // Price of one item
        address: userContact.address,
        contact: userContact.contact,
      },
    ];
    try {
      const res = await axios.post("http://localhost:8800/orders", order);
      alert(res.data.message);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity - 1 } // Decrease stock locally
            : item
        )
      );
      setShowCheckoutPopup(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error during checkout:", err.response?.data || err.message);
    }
  };

  // Cancel Checkout
  const handleCancelCheckout = () => {
    setShowCheckoutPopup(false);
    setSelectedProduct(null);
  };

  return (
    <div className="buyer-container">
      <h1 className="page-title">Marketplace</h1>

      {/* Filters and Sorting */}
      <div className="filter-sort-container">
        <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.cat_name}
            </option>
          ))}
        </select>

        <select value={selectedSortBy} onChange={(e) => setSelectedSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="avg_rating">Rating</option>
        </select>

        <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      {/* Product Cards */}
      <div className="card-container">
        {items.map((item) => (
          <div className="card" key={item.id}>
            {item.image && <img src={item.image} alt={item.prod_name} />}
            <h2>{item.prod_name}</h2>
            <p>{item.prod_description}</p>
            <span className="stocks">stock: {item.quantity} <br /> </span> 
            <span className="price">${item.price}</span>
            <span className="rating">
            Rating: {item.avg_rating.toFixed(1)} / 5 
            ({item.total_reviews} reviews)</span>

            <div className="card-buttons">
              <button className="btn" onClick={() => handleBuyNow(item)}>
                Buy Now
              </button>
              <button className="btn" onClick={() => handleAddToCart(item)}>
                Add to Cart
              </button>
            </div>

          </div>
        ))}
      </div>

      <button className="cart-button">
        <Link to="/BuyerCart">Shopping Cart</Link>
      </button>

      <button className="My-Order Button">
        <Link to="/viewOrder"> My Order </Link>
      </button>
      
      {/* Confirm Checkout Popup */}
      {showCheckoutPopup && selectedProduct && (
        <div className="confirm-checkout-overlay">
          <div className="confirm-checkout-popup">
            <h2>Confirm Your Order</h2>
            <div>
                <p>{selectedProduct.prod_name}</p>
                <p>Quantity: 1
                </p>
                <p>Price: ${selectedProduct.price}</p>
            </div>
            <h3>Total: ${selectedProduct.price}</h3>
            <div className="buyer-details">
              <h4>Contact Info: </h4>
              {userContact.map((contact) => (
                  <div className="contact details" key={contact.name}>
                  <p> Name: {contact.name}</p>
                  <p> Address: {contact.address}</p>
                  <p> Number: {contact.contact}</p>                
                  </div>
            ))}

            </div>
            <div className="confirm-buttons">
              <button onClick={handleConfirmCheckout}>Confirm</button>
              <button onClick={handleCancelCheckout}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerPage;
