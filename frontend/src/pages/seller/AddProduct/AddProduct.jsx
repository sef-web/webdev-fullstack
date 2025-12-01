import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../config/api';
import { openUploadWidget } from '../../../config/cloudinary';

const AddProduct = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sellerId = user?.user_id;

    const [product, setProduct] = useState({
        prod_name: "",
        prod_description: "",
        price: null,
        image: "",
        stock_quantity: null,
        seller_id: sellerId || "" // prefill if available
    });
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/products`, product);
            navigate("/sellerpage");
        } catch (err) {
            console.log(err);
        }
    };

    const handleUploadImage = () => {
        if (isUploading) {
            alert("Upload already in progress. Please wait.");
            return;
        }
        
        setIsUploading(true);
        const folderPath = `products/seller_${sellerId || 'unknown'}`;
        
        openUploadWidget({
            folder: folderPath,
            onSuccess: (info) => {
                setProduct((prev) => ({ ...prev, image: info.secure_url }));
                setIsUploading(false);
                alert("Image uploaded successfully!");
            },
            onError: (err) => {
                console.error('Upload failed:', err);
                setIsUploading(false);
            },
        });
    };

    console.log(product);

    return (
        <div className='form'>
            <h1>Add New Product</h1>
            <td>
                
            </td><input type="text" placeholder='Product Name' onChange={handleChange} name="prod_name" />
            <input type="text" placeholder='Product Description' onChange={handleChange} name="prod_description" />
            <input type="text" placeholder='Price' onChange={handleChange} name="price" />
            <div className='image-input-row'>
                <input type="text" placeholder='Image URL' onChange={handleChange} name="image" value={product.image} />
                <button type="button" onClick={handleUploadImage} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
            </div>
            {product.image && (
                <img src={product.image} alt="Preview" style={{ maxWidth: '120px', display: 'block', marginTop: '8px' }} />
            )}
            <input type="number" placeholder='Stock Quantity' onChange={handleChange} name="stock_quantity" />
            <input type="text" placeholder='Seller ID' onChange={handleChange} name="seller_id" />

            <button onClick={handleClick}>Add Product</button>
        </div>
    );
};

export default AddProduct;
