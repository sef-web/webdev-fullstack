# E-Commerce CRUD Web Application (SERN Stack)

A full-stack e-commerce platform built to simulate real-world online shopping operations. This application demonstrates complete **CRUD (Create, Read, Update, Delete)** functionality for managing products, users, orders, and more.

## Project Overview

The purpose of this project was to develop a robust, data-driven web application using the **SERN Stack** (SQL, Express, React, Node.js). It serves as a comprehensive platform where admins can manage inventory and users can browse products, manage carts, and place orders.

**Live Demo:** [Insert Your Render Link Here]

## Tech Stack

* **Frontend:** React.js, HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Tools:** VS Code, Git, Postman

## Key Features

### 1. Product Management
* **Complete CRUD:** Admins can Create, Read, Update, and Delete products.
* **Details:** Manages product Name, Price, Description, Quantity, and Images.
* **Inventory Control:** Automated notifications for low-stock items.
* **Advanced Filtering:** Users can filter products by Price, Rating, and Category.

### 2. User & Authentication System
* **Secure Access:** User registration and login with hashed passwords.
* **Profile Management:** Users can update their profile details (Address, Phone) and delete accounts.
* **Role-Based Access:** Distinction between `Customer` and `Admin` roles.
* **Security:** Implemented Two-Factor Authentication (2FA) for login and Password Reset functionality.

### 3. Shopping Cart & Orders
* **Dynamic Cart:** Users can add items, update quantities, view totals, and clear the cart.
* **State Persistence:** Cart state is saved, allowing users to log out and return later without losing items.
* **Promotions:** Support for discount codes during checkout.
* **Order Tracking:** Users can place orders and track status (Pending, Shipped).

### 4. Categories & Reviews
* **Organization:** Products are organized into a hierarchy with subcategories.
* **Analytics:** System tracks and displays "Popular Categories" based on user activity.
* **Social Proof:** Users can leave, edit, and delete product reviews with ratings.

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/sef-web/webdev-fullstack.git](https://github.com/sef-web/webdev-fullstack.git)
    cd webdev-fullstack
    ```

2.  **Install Dependencies (Backend & Frontend):**
    ```bash
    cd server
    npm install
    cd ../client
    npm install
    ```

3.  **Setup Database:**
    * Import the provided SQL schema into your MySQL database.
    * Configure your `.env` file with your database credentials.

4.  **Run the App:**
    ```bash
    # Run Backend
    cd server
    npm start

    # Run Frontend
    cd client
    npm start
    ```

## 📜 License

This project was created for educational purposes as part of a Full-Stack Web Development course.
