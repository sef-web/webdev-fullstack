import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewOrder = () => {
    const [orderHistory, setOrderHistory] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const buyer_id = user.user_id;

    useEffect(() => {
        const fetchAllComplete = async () => {
            try {
                const res = await axios.get("http://localhost:8800/orderhistory", {
                    params: { buyer_id },
                });
                setOrderHistory(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllComplete();
    }, [buyer_id]);

    return (
        <div className="buyer-history-container">
            <h3 className="history-title">Purchase History</h3>
            <div className="purchases-history">
                {orderHistory.map((history) => (
                    <div key={history.id} className="order-card">
                        <div className="order-header">
                            <h4 className="seller-name">{history.seller_name} SHOP</h4>
                            <span className={`status ${history.status.toLowerCase()}`}>
                                {history.status}
                            </span>
                        </div>
                        <div className="order-body">
                            <div className="image-container">
                                {history.image && (
                                    <img src={history.image} alt={history.prod_name} />
                                )}
                            </div>
                            <div className="product-details">
                                <h5 className="product-name">{history.prod_name}</h5>
                                <p className="product-quantity">Quantity: x{history.quantity}</p>
                                <p className="product-price">$ {history.price}</p>
                                <p className="total-price">
                                    Total ({history.quantity} item):
                                    <strong> $ {history.total_price}</strong>
                                </p>
                            </div>
                        </div>
                        <div className="order-footer">
                            <p className="purchase-date">
                                Purchase Date:{" "}
                                {new Date(history.purchase_date).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewOrder;
