import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewOrder = () => {
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const seller_id = user.user_id;

    useEffect(() => {
        const fetchAllPurchases = async () => {
            try {
                const res = await axios.get("http://localhost:8800/orders", {
                    params: { seller_id },
                });
                setPurchases(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllPurchases();
    }, [seller_id]);

    // Handle status update
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put("http://localhost:8800/update-status", {
                orderId,
                status: newStatus,
            });
            alert("Status updated successfully!");
            setPurchases((prevPurchases) =>
                prevPurchases.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (err) {
            console.log(err);
            alert("Failed to update status.");
        }
    };
    

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
                        <th>Buyer Name</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Edit Status</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((order) => (
                        <tr key={order.id}>
                            <td>{order.prod_name}</td>
                            <td>{order.quantity}</td>
                            <td>$ {order.total_price}</td>
                            <td>
                                {new Date(order.purchase_date).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </td>
                            <td>{order.name}</td>
                            <td>{order.address}</td>
                            <td>{order.status}</td>
                            <td>
                                <select
                                    onChange={(e) =>
                                        handleStatusChange(order.id, e.target.value)
                                    }
                                    value={order.status} // Show the current status in the dropdown
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewOrder;
