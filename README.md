# E-Commerce CRUD Web Application (SERN Stack)

A full-stack e-commerce platform built to simulate real-world online shopping operations. This application demonstrates complete **CRUD (Create, Read, Update, Delete)** functionality for managing products, users, orders, and more, deployed on modern cloud infrastructure.

## Live Demo

**[https://marketly-x382.onrender.com]**

*(Note: The application is hosted on Render's free tier. Please allow 30-50 seconds for the server to "wake up" on the initial load.)*

## Tech Stack & Infrastructure

This project uses the **SERN Stack** (SQL, Express, React, Node.js) and leverages cloud services for a production-grade environment.

### **Core Stack**
* **Frontend:** React.js, HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MySQL (Hosted on **Aiven**)

### **Cloud & DevOps**
* **Deployment:** **Render** (Web Services & Static Site Hosting)
* **Database Cloud:** **Aiven** (Managed MySQL)
* **Media Storage:** **Cloudinary** (For product image optimization and hosting)
* **Tools:** VS Code, Git, Postman

## Key Features

### 1. Product Management
* **Complete CRUD:** Admins can Create, Read, Update, and Delete products.
* **Details:** Manages product Name, Price, Description, Quantity, and Images via Cloudinary.
* **Inventory Control:** Automated notifications for low-stock items.
* **Advanced Filtering:** Users can filter products by Price, Rating, and Category.

### 2. User & Authentication System
* **Secure Access:** User registration and login with hashed passwords.
* **Profile Management:** Users can update their profile details (Address, Phone) and delete accounts.
* **Role-Based Access:** Distinction between `Customer` and `Admin` roles.

### 3. Shopping Cart & Orders
* **Dynamic Cart:** Users can add items, update quantities, view totals, and clear the cart.
* **State Persistence:** Cart state is saved in the database, allowing users to log out and return later.
* **Promotions:** Support for discount codes during checkout.
* **Order Tracking:** Users can place orders and track status (Pending, Shipped).

## Installation & Setup

If you want to run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/sef-web/webdev-fullstack.git](https://github.com/sef-web/webdev-fullstack.git)
    cd webdev-fullstack
    ```

2.  **Install Dependencies:**
    ```bash
    # Install Backend
    cd server
    npm install

    # Install Frontend
    cd ../client
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `server` folder with the following credentials:
    ```env
    # Database (Aiven or Local MySQL)
    DB_HOST=your-aiven-mysql-host
    DB_USER=your-aiven-user
    DB_PASSWORD=your-aiven-password
    DB_NAME=defaultdb
    DB_PORT=your-aiven-port

    # Cloudinary (Image Uploads)
    CLOUDINARY_CLOUD_NAME=your-cloud-name
    CLOUDINARY_API_KEY=your-api-key
    CLOUDINARY_API_SECRET=your-api-secret
    ```

4.  **Run the App:**
    ```bash
    # Run Backend
    cd server
    npm start

    # Run Frontend
    cd client
    npm start
    ```

## License

This project was created for educational purposes as part of a Full-Stack Web Development course.
