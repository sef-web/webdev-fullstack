import React, { useEffect, useState } from "react";
import axios from "axios";

const IncomeDetails = () => {
    const [overview, setOverview] = useState({
        pending_total: 0,
        released_total: 0,
        pending_week: 0,
        released_week: 0,
        pending_month: 0,
        released_month: 0,
    });

    const [details, setDetails] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const seller_id = user.user_id;

    useEffect(() => {
        const fetchIncomeDetails = async () => {
            try {
                const res = await axios.get("http://localhost:8800/incomedetails", {
                    params: { seller_id },
                });
                setOverview(res.data.overview);
                setDetails(res.data.details);
            } catch (err) {
                console.log(err);
            }
        };
        fetchIncomeDetails();
    }, [seller_id]);

    return (
        <div className="income-details-container">
            <h3>Income Overview</h3>
            <table className="income-overview">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Week</th>
                        <th>This Month</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Pending</td>
                        <td>{overview.pending_week}</td>
                        <td>{overview.pending_month}</td>
                        <td>{overview.pending_total}</td>
                    </tr>
                    <tr>
                        <td>Released</td>
                        <td>{overview.released_week}</td>
                        <td>{overview.released_month}</td>
                        <td>{overview.released_total}</td>
                    </tr>
                </tbody>
            </table>
            <h3>Income Details</h3>
            <table className="income-details">
                <thead>
                    <tr>
                        <th>Buyer Name</th>
                        <th>Product Name</th>
                        <th>Release Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map((detail, index) => (
                        <tr key={index}>
                            <td>{detail.buyer_name}</td>
                            <td>{detail.prod_name}</td>
                            <td>{detail.release_amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IncomeDetails;
