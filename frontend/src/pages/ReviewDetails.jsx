import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewOrder = () => {
    const [reviews, setReviews] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const seller_id = user.user_id;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get("http://localhost:8800/reviewdetails", {
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
        <div className="Review-Details">
            <h3>Shop Ratings</h3>
            <div className="see-review-details">
                    {reviews.map((review) => (
                        <div key={review.id}>
                            <span>{new Date(review.created_at).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
    
                            <span>{review.buyer_name}</span>
                            <span>{review.prod_name}</span>
                            <span>Rating: </span><span className="Star"> &#9733; </span> <span>{review.rating}</span>
                            <span>Comment: {review.comment}</span>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ViewOrder;
