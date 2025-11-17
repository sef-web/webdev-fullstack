import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';

const Signup = () => {
    const [user, setUser] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        contact: "",
        address: "",
        user_type: "buyer", // Default role is "buyer"
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Post the user data to your backend
            await axios.post(`${API_URL}/signup`, user);
            alert("Signup successful! Please login.");
            navigate("/login"); // Redirect to login after successful signup
        } catch (err) {
            console.error(err);
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <div className="auth-form">
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    placeholder="Contact Number"
                    name="contact"
                    value={user.contact}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={user.address}
                    onChange={handleChange}
                    required
                />
                <select name="user_type" value={user.user_type} onChange={handleChange}>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </select>
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
