import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_URL from '../../config';

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

  const [notifications, setNotifications] = useState([]); // Notifications
  const [isNotifVisible, setIsNotifVisible] = useState(false); // Toggle Notification Visibility

  const [totalSold, setTotalSold] = useState([]);

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const buyer_Id = user.user_id;
  const user_name = user.name;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`, {
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
        const res = await axios.get(`${API_URL}/users?buyer_id=${buyer_Id}`)
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
        const res = await axios.get(`${API_URL}/category`);
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
      const res = await axios.post(`${API_URL}/addtocart`, cartItem);
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
      const res = await axios.post(`${API_URL}/orders`, order);
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

    // Fetch notifications
    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const res = await axios.get(`${API_URL}/notifications`, {
            params: { buyer_id: buyer_Id },
          });
          setNotifications(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchNotifications();
    }, [buyer_Id]);
    
    //fetch total sold per item
    useEffect(() => {
      const soldItems = async () => {
        try {
          const res = await axios.get(`${API_URL}/totalsold`);
          setTotalSold(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      soldItems();
    }, []);

  const toggleProfilePopup = () => {
      setShowProfilePopup(!showProfilePopup);
  };
  
  const toggleLogoutPopup = () => {
      setShowLogoutPopup(!showLogoutPopup);
      setShowProfilePopup(false); // Close profile popup when opening logout confirmation
  };
  
  const handleLogout = () => {
      console.log("User logged out");
      localStorage.removeItem('user'); // Clear user data
      window.location.href = "/Login";
  };

  return (
    <div className="marketplace">
    {/*Header Section */}
    <nav className="navbar">
          <div className="navbar-left">
            <a className="navbar-title">Marketplace</a>
          </div>
          
          <div className="navbar-right">
            {/* Notification Section */}
              <div className="notification-container">
                  <button className="notification-button" onClick={() => setIsNotifVisible(!isNotifVisible)}>
                    <img src="/images/notification.png" alt="Notification Icon" />
                    <span>({notifications.length})</span>
                  </button>

                    {isNotifVisible && (
                      <div className="notif-list">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div key={notif.prod_id} className="notif-item">
                              <h4>Your order is {notif.status}</h4>
                              <p>
                                Order of <strong>{notif.prod_name} ({notif.prod_description})</strong> product is
                                shipped. Your feedback matters to others! Please rate the
                                product to complete your purchase.
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="no-notifications">No notifications.</p>
                        )}
                      </div>
                    )}
              </div>

              {/* Profile Section */}
              <div className="profile">
                  <button className="profile-button" onClick={toggleProfilePopup}>
                      <img src="/images/profile-user.png" alt="profile-pic" />
                      <h3 className="profile-name">{user_name}</h3>
                  </button>

                  {showProfilePopup && (
                      <div className="profile-popup">
                          <button className="logout-option" onClick={toggleLogoutPopup}>
                              Logout
                          </button>
                      </div>
                  )}

                  {showLogoutPopup && (
                      <div className="logout-popup">
                          <p>Are you sure you want to logout?</p>
                          <button className="confirm-logout" onClick={handleLogout}>Confirm</button>
                          <button className="cancel-logout" onClick={toggleLogoutPopup}>Cancel</button>
                      </div>
                  )}
              </div>
            </div>
      </nav>

        {/* Filters and Sorting */}
        <div className="sorting-container">
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
        </div>

    <div className="buyer-container">
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
                <span className="Star"> &#9733; </span>
                {item.avg_rating.toFixed(1)} / 5 |{" "}
                {totalSold.find((sold) => sold.prod_id === item.id)?.total_sold || 0} Sold
              </span>
              
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

      <div className="action-buttons">
        <button className="btn action-btn">
          <Link to="/BuyerCart">
            <img src="/images/cart-icon.png" alt="Cart Icon" className="btn-icon" />
            <p>Shopping Cart</p>
          </Link>
        </button>

        <button className="btn action-btn">
          <Link to="/viewOrder">
            <img src="/images/order-icon.png" alt="Order Icon" className="btn-icon" />
            <p>My Order</p>
          </Link>
        </button>

        <button className="btn action-btn">
          <Link to="/orderhistory">
            <img src="/images/history-icon.png" alt="History Icon" className="btn-icon" />
            <p>Purchase History</p> 
          </Link>
        </button>
      </div>


        
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

    <footer class="footer">
            <p>&copy; 2025 Marketplace. All Rights Reserved.</p>
    </footer>

  </div>
  );
};

export default BuyerPage;
