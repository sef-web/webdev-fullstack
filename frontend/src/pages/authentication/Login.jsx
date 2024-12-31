import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8800/login", credentials);
            localStorage.removeItem('user');
            const userRole = res.data.role;
            localStorage.setItem('user', JSON.stringify(res.data));
            if (userRole === "buyer") navigate("/buyerpage");
            else if (userRole === "seller") {
                navigate("/products");
            }
        } catch (err) {
            console.log(err);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <div className="auth-form">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;