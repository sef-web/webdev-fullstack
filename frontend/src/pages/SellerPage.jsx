import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import UpdateProduct from './UpdateProduct';

const SellerPage = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]); 
    const [selectedCategory, setSelectedCategory] = useState('');

    const [editProduct, setEditProduct] = useState(null); 

    const [lowStockAlerts, setLowStockAlerts] = useState([]); // Low-stock notifications
    const [showNotifications, setShowNotifications] = useState(false); // Toggle notification list

    const user = JSON.parse(localStorage.getItem('user'));
    const seller_Id = user.user_id;
    const user_name = user.name;

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/products?seller_id=${seller_Id}`);
                setProducts(res.data);

                const catRes = await axios.get("http://localhost:8800/category");
                setCategory(catRes.data);

                // Calculate low stock alerts
                const lowStock = res.data.filter(product => product.quantity < 10); // Threshold: 10
                const alerts = lowStock.map(product => ({
                    name: product.prod_name,
                    currentStock: product.quantity,
                    recommendedReorder: Math.max(10, 2 * product.quantity),
                }));
                setLowStockAlerts(alerts);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllProducts();
    }, [seller_Id]);  

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const handleEditClick = (product) => {
        setEditProduct(product); 
    };
    
    const handleSave = async (updatedProduct) => {
        try {
            await axios.put(`http://localhost:8800/products/${updatedProduct.id}`, updatedProduct);
            setEditProduct(null); 
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };
    
    const handleClosePopup = () => {
        setEditProduct(null); 
    };
    
    const handleDelete = async (id) => {
        try {
            await axios.delete("http://localhost:8800/products/" + id);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    const [product, setProduct] = useState({
        prod_name: "",
        prod_description: "",
        image: "",
        price: "",
        quantity: "",
        cat_id: "",
        seller_id:""
    });

    const handleChange = (e) => {
        setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const newProduct = {...product, cat_id: selectedCategory, seller_id: seller_Id};
            await axios.post("http://localhost:8800/products", newProduct);
            setProducts((prev) => [...prev, newProduct]);
            alert("Product added successfully.");
        } catch (err) {
            console.log(err);
        }
    };

    const handleClear = () => {
        setProduct({
            prod_name: "",
            prod_description: "",
            image: "",
            price: "",
            quantity: "",
            cat_id: "",
            seller_id: ""
        });
        setSelectedCategory('');
    };
    
    return (
        <div className='row'>
            <h3>Good day! {user_name}</h3>
            <h1>Products</h1>

            {/* Notification Section */}
            <div className="notification-container">
            <button className="notification-button" onClick={toggleNotifications}>
                Notifications ({lowStockAlerts.length})
            </button>
            {showNotifications && (
                <div className="notification-popup">
                {lowStockAlerts.length > 0 ? (
                    lowStockAlerts.map((alert, index) => (
                    <div key={index} className="notification-item">
                        <h4>Low Stock Alert!</h4>
                        <p>
                        <strong>{alert.name}</strong> is running low on stock.<br />
                        Current Stock: {alert.currentStock}<br />
                        Recommended Reorder: {alert.recommendedReorder}
                        </p>
                    </div>
                    ))
                ) : (
                    <p className="no-notifications">No notifications.</p>
                )}
                </div>
            )}
            </div>


            <div className='column1'>
                <table>
                    <thead>
                        <tr>
                            <th>Add Product</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input type="text" placeholder='Product Name' onChange={handleChange} name="prod_name" value={product.prod_name}/>
                                <input type="text" placeholder='Product Description' onChange={handleChange} name="prod_description" value={product.prod_description}/>
                                <input type="text" placeholder='Image URL' onChange={handleChange} name="image" value={product.image}/>
                                <input type="number" placeholder='Price' onChange={handleChange} name="price" value={product.price}/>
                                <div>
                                    <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}> 
                                        <option value="">Select a Category</option> 
                                        {category.map(cat => (
                                            <option key={cat.id} value={cat.id}> 
                                                {cat.cat_name} 
                                            </option> 
                                        ))} 
                                    </select>
                                </div> 
                                <input type="number" placeholder='Quantity' onChange={handleChange} name="quantity" value={product.quantity}/>
                                <button onClick={handleClick}>Submit</button>
                                <button onClick={handleClear}>Clear</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='column2'>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>prod_name</th>
                            <th>prod_description</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>cat_id</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.prod_name}</td>
                                <td>{product.prod_description}</td>
                                <td>{product.image}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>{product.cat_id}</td>
                                <td><button className='edit' onClick={() => handleEditClick(product)}>Edit</button></td>
                                <td><button className='delete' onClick={() => handleDelete(product.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editProduct && (
                <UpdateProduct
                    product={editProduct}
                    onClose={handleClosePopup}
                    onSave={handleSave}
                    category={category}
                />
            )}

            <button className="View-Order Button">
                <Link to="/monitorOrder"> View Orders </Link>
            </button>

            <button className="View-Review-Details Button">
                <Link to="/reviewdetails"> Review Details </Link>
            </button>

            <button className="View-Income-Details Button">
                <Link to="/incomedetails"> Income Details </Link>
            </button>
        </div>
    );
};

export default SellerPage;
