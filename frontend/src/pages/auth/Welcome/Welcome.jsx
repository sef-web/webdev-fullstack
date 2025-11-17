import React from 'react'
import { Link } from 'react-router-dom'
import './Welcome.css'

const WelcomePage = () => {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Welcome</h1>
                <p className="welcome-description">
                    This is an E-commerce website where you can find quality products.
                </p>
                <div className="welcome-buttons">
                    <Link to="/login" className="welcome-btn">Login</Link>
                    <Link to="/signup" className="welcome-btn">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;