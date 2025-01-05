import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [product, setProduct] = useState({
        prod_name: "",
        prod_description: "",
        price: null,
        image: "",
        stock_quantity: null,
        seller_id: "" // Replace with actual seller ID if available
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8800/products", product);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    console.log(product);

    return (
        <div className='form'>
            <h1>Add New Product</h1>
            <td>
                
            </td><input type="text" placeholder='Product Name' onChange={handleChange} name="prod_name" />
            <input type="text" placeholder='Product Description' onChange={handleChange} name="prod_description" />
            <input type="text" placeholder='Price' onChange={handleChange} name="price" />
            <input type="text" placeholder='Image URL' onChange={handleChange} name="image" />
            <input type="number" placeholder='Stock Quantity' onChange={handleChange} name="stock_quantity" />
            <input type="text" placeholder='Seller ID' onChange={handleChange} name="seller_id" />

            <button onClick={handleClick}>Add Product</button>
        </div>
    );
};

export default AddProduct;
