import React from 'react'
import { Link } from 'react-router-dom'

const WelcomePage = () => {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Welcome</h1>
                <p className="welcome-description">
                    This is an E-commerce website where you can find quality products.
                </p>
                <div className="welcome-buttons">
                    <Link to="/Login" className="welcome-btn">Login</Link>
                    <Link to="/Signup" className="welcome-btn">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;