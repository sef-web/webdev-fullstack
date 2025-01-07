import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewOrder = () => {
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const buyer_id = user.user_id;

    useEffect(() => {
        const fetchAllPurchases = async () => {
            try {
                const res = await axios.get("http://localhost:8800/orders", {
                    params: { buyer_id },
                });
                setPurchases(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllPurchases();
    }, [buyer_id]);

    return (
        <div className="buyer-cart-container">
            <button className="go-back-button" onClick={() => navigate(-1)}>
                ←
            </button>
            <h1>Order List</h1>
            <table className="purchases-details">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Purchase Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((order) => (
                        <tr key={order.id}>
                            <td>{order.prod_name}</td>
                            <td>{order.quantity}</td>
                            <td>{order.total_price}</td>
                            <td>
                                {new Date(order.purchase_date).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewOrder;
