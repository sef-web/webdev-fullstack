import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from '../../../config/api';
import './ViewOrder.css';

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
        const res = await axios.get(`${API_URL}/orders`, {
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
      const res = await axios.post(`${API_URL}/addreview`, {
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
    <div className="view-order-container">
      <h1 className="title">My Orders</h1>
      {purchases.length > 0 ? (
        <table className="order-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Purchase Date</th>
              <th>Status</th>
              <th>Action</th>
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
                <td>
                  {order.status === "Shipped" && (
                    <button
                      className="add-review-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Add Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-orders">You have no orders yet.</p>
      )}
      {selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Review for {selectedOrder.prod_name}</h2>
            <label>Rating (1-5):</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="5"
              className="modal-input"
            />
            <label>Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="modal-textarea"
            />
            <div className="modal-actions">
              <button className="modal-btn" onClick={handleAddReview}>
                Submit
              </button>
              <button
                className="modal-btn cancel"
                onClick={() => setSelectedOrder(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrder;
