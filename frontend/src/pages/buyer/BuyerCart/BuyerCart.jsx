import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from '../../../config/api';
import './BuyerCart.css';

// Helper function to fix image URLs
const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.includes('/uploads/')) {
        const filename = imageUrl.split('/uploads/').pop();
        return `${API_URL}/uploads/${filename}`;
    }
    if (!imageUrl.startsWith('http')) {
        return `${API_URL}/uploads/${imageUrl}`;
    }
    return imageUrl;
};

const BuyerCart = () => {
    const [cartItems, setCartItems] = useState([]); 
    const [selectedItems, setSelectedItems] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const buyer_id = user.user_id;

    // use to fetch data from cart table 
    //passing buyer_id as a parameter
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const res = await axios.get(`${API_URL}/cart`, {
                    params: { buyer_id: buyer_id },
                });
                setCartItems(res.data);
            } catch (err) {
                console.error("Error fetching cart items:", err);
            }
        };
        fetchCartItems();
    }, [buyer_id]);

    //function to update quantity and total price
    const updateQuantity = async (cartId, quantity) => {
        if (quantity <= 0) return;
        try {
            await axios.put(`${API_URL}/cart/update`, {
                cart_id: cartId,
                quantity,
            });

            setCartItems((prev) =>
                prev.map((item) =>
                    item.cart_id === cartId
                        ? { ...item, quantity, total_price: item.price * quantity } // Update total price
                        : item
                )
            );
        } catch (err) {
            console.error("Error updating quantity:", err);
        }
    };

    const deleteCartItem = async (cartId) => {
        try {
            await axios.delete(`${API_URL}/cart/delete/${cartId}`);
            setCartItems((prev) => prev.filter((item) => item.cart_id !== cartId)); // Optimistic update
        } catch (err) {
            console.error("Error deleting cart item:", err);
        }
    };

    const handleCheckout = async () => {
        if (selectedItems.length === 0) {
            alert("No items selected for checkout.");
            return;
        }

        const cartData = selectedItems.map((item) => ({
            cart_id: item.cart_id,
            prod_id: item.prod_id,
            seller_id: item.seller_id,
            quantity: item.quantity,
            price: item.price,
        }));

        try {
            await axios.post(`${API_URL}/cart/checkout`, {
                buyer_id: buyer_id,
                cartItems: cartData,
            });
            setCartItems((prev) =>
                prev.filter((item) => !selectedItems.some((s) => s.cart_id === item.cart_id))
            );
            setSelectedItems([]);
            alert("Checkout successful!");
        } catch (err) {
            console.error("Error during checkout:", err);
        }
    };

    const toggleItemSelection = (item) => {
        if (selectedItems.some((selected) => selected.cart_id === item.cart_id)) {
            setSelectedItems((prev) =>
                prev.filter((selected) => selected.cart_id !== item.cart_id)
            );
        } else {
            setSelectedItems((prev) => [...prev, item]);
        }
    };

    return (
        <div className="buyer-cart-container">

            <h3>Your Cart</h3>
            <div className="buyer-cart-items">
                {cartItems.map((item) => (
                    <div key={item.cart_id} className="cart-item">
                        <div className="cart-item-header">
                            <input
                                type="checkbox"
                                className="cart-item-check"
                                checked={selectedItems.some(
                                    (selected) => selected.cart_id === item.cart_id
                                )}
                                onChange={() => toggleItemSelection(item)}
                            />
                            <img src={getImageUrl(item.image)} alt={item.prod_name} />
                            <div className="cart-item-details">
                                <h2 className="cart-item-name">{item.prod_name}</h2>
                                <p className="cart-item-description">
                                    {item.prod_description}
                                </p>
                            </div>

                            <button
                                className="cart-item-delete"
                                onClick={() => deleteCartItem(item.cart_id)}
                            >
                                Remove
                            </button>
                        </div>
                        <div className="cart-item-footer">
                            <button
                                className="cart-item-decrease"
                                onClick={() =>
                                    updateQuantity(item.cart_id, item.quantity - 1)
                                }
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                                className="cart-item-increase"
                                onClick={() =>
                                    updateQuantity(item.cart_id, item.quantity + 1)
                                }
                            >
                                +
                            </button>

                            <span className="totalprice"> 
                                ${item.price * item.quantity} 
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {cartItems.length > 0 && (
                <button className="checkout-all" onClick={handleCheckout}>
                    Place Order on selected Item
                </button>
            )}
        </div>
    );
};

export default BuyerCart;
