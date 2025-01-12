import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewOrder = () => {
    const [purchases, setPurchases] = useState([]);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

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

    const handleAddReview = async () => {
        try {
            const res = await axios.post("http://localhost:8800/addreview", {
                prod_id: selectedOrder.prod_id,
                buyer_id: selectedOrder.buyer_id,
                rating: rating,
                comment: comment,
                purchase_id: selectedOrder.id,
            });
            window.location.reload();
            alert(res.data.message);
            setSelectedOrder(null); // Close modal
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="buyer-cart-container">
          <h1>Order List</h1>
          {purchases.length > 0 ? (
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
                    <td>{order.status}</td>
                    <div>
                      {order.status === "Shipped" && (
                        <button onClick={() => setSelectedOrder(order)}>Add Review</button>
                      )}
                    </div>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No orders yet.</p>
          )}
          {selectedOrder && (
            <div className="modal">
              <h2>Add Review on {selectedOrder.prod_name}</h2>
              <label>Rating (1-5):</label>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="1"
                max="5"
              />
              <label>Comment:</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
              <button onClick={handleAddReview}>Submit</button>
              <button onClick={() => setSelectedOrder(null)}>Cancel</button>
            </div>
          )}
        </div>
      );      
};

export default ViewOrder;
