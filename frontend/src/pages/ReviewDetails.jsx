import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from '../config';

const ViewOrder = () => {
    const [reviews, setReviews] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const seller_id = user.user_id;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${API_URL}/reviewdetails`, {
                    params: { seller_id },
                });
                setReviews(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchReviews();
    }, [seller_id]);

    return (
        <div>
            {reviews.length > 0 ? (
                <div className="Review-Details">

                    <h4>Shop Ratings</h4>
                    
                    <div className="see-review-details">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <span className="review-date">{new Date(review.created_at).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}</span>
                                    <span className="review-buyer">{review.buyer_name}</span>
                                </div>
                                <div className="review-body">
                                    <span className="review-product">{review.prod_name}</span>
                                    <span className="review-rating">Rating: <span className="Star">&#9733;</span> {review.rating}</span>
                                    <span className="review-comment">Comment: {review.comment}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : ( <div className="No-reviews-yet"><p>No reviews yet</p></div>)}

        </div>
    );
};

export default ViewOrder;
