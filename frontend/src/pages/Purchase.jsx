import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Purchase = () => {
    const [product, setProduct] = useState(null); // Holds the product to be purchased
    const [quantity, setQuantity] = useState(1); // Default purchase quantity is 1
    const navigate = useNavigate();
    const location = useLocation();
    const productId = location.pathname.split("/")[2]; // Extract product ID from URL

    useEffect(() => {
        // Fetch the product details
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/products/${productId}`);
                setProduct(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProduct();
    }, [productId]);

    const handlePurchase = async (e) => {
        e.preventDefault();
        try {
            // Send purchase request
            await axios.post("http://localhost:8800/purchase", {
                product_id: productId,
                quantity,
            });
            alert("Purchase successful!");
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="purchase-page">
            {product ? (
                <div>
                    <h1>Purchase {product.prod_name}</h1>
                    <p>Description: {product.prod_description}</p>
                    <p>Price: ${product.price}</p>
                    <p>Stock Available: {product.stock_quantity}</p>
                    <input
                        type="number"
                        min="1"
                        max={product.stock_quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <button onClick={handlePurchase}>Confirm Purchase</button>
                </div>
            ) : (
                <p>Loading product details...</p>
            )}
        </div>
    );
};

export default Purchase;
