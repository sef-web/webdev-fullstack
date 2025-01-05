import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useLocation } from "react-router-dom";
//import { Link } from 'react-router-dom';
import UpdateProduct from './UpdateProduct';

const SellerPage = () => {
    const [products, setProducts] = useState([]);
    //products value is setProduct and setProduct value comes from the fetchAllProduct function that fetches data from products table
    const [category, setCategory] = useState([]); 
    //setCategory will have a value from the fetch data, category will then be used for mapping holds also the value of setCategory
    const [selectedCategory, setSelectedCategory] = useState('');

    const [editProduct, setEditProduct] = useState(null); // State for the product to edit

    //const location = useLocation();
    //const sellerId = location.pathname.split("/")[2]; // Extract seller_id from URL

    const user = JSON.parse(localStorage.getItem('user'));
    const seller_Id = (user.user_id);

    useEffect(() => {
        // Fetch all products for the logged-in seller

        const fetchAllProducts = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/products?seller_id=${seller_Id}`);
                setProducts(res.data);

                const catRes = await axios.get("http://localhost:8800/category");
                setCategory(catRes.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllProducts();
    }, [seller_Id]);  //immediately invoked functions

    const handleEditClick = (product) => {
        setEditProduct(product); // Set the selected product for editing
    };
    
    const handleSave = async (updatedProduct) => {
        try {
            await axios.put(`http://localhost:8800/products/${updatedProduct.id}`, updatedProduct);
            setEditProduct(null); // Close popup
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };
    
    const handleClosePopup = () => {
        setEditProduct(null); // Close popup without saving
    };
    
    //delete the product using id
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
            const newProduct = {...product, cat_id: selectedCategory, seller_id: seller_Id // Explicitly add the category ID
                };
            await axios.post("http://localhost:8800/products", newProduct);
            setProducts((prev) => [...prev, newProduct]);
            alert("Product added successfully.");
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };
    
    //return a display of data from the database 
    return (
        <div className='row'>
            <h1>Products</h1>
            <div className = 'column1'>
                <table>
                    <th>Add Product</th>
                    <tr>
                        <td>
                            <input type="text" placeholder='Product Name' onChange={handleChange} name="prod_name"/>
                            <input type="text" placeholder='Product Description' onChange={handleChange} name="prod_description"/>
                            <input type="text" placeholder='Image URL' onChange={handleChange} name="image"/>
                            <input type="number" placeholder='Price' onChange={handleChange} name="price"/>

                            <div>
                                <select onChange={(e) => setSelectedCategory(e.target.value)}> 
                                    <option value="">Select a Category</option> 
                                    {category.map(cat => (
                                        <option key={cat.cat_id} value={cat.cat_id}> 
                                            {cat.cat_name} 
                                        </option> ))} 
                                </select>
                            </div> 
                            <input type="number" placeholder='Quantity' onChange={handleChange} name="quantity"/>
                            <button onClick={handleClick}>Submit</button>
                            <button>Clear</button>
                        </td>
                    </tr>
                </table>
            </div>
                    <div className='column2'>
                        <table>
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
                    />
                    )}

        </div>
    );
};
export default SellerPage;