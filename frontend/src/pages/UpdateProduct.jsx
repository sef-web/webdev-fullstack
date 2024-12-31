import React, { useState } from 'react';

const EditProduct = ({ product, onClose, onSave }) => {
    const [editedProduct, setEditedProduct] = useState(product);

    const handleChange = (e) => {
        setEditedProduct((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = () => {
        onSave(editedProduct);
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2>Edit Product</h2>
                <div className="form-container">
                    <div className="form-row">
                        <label htmlFor="prod_name">Product Name:</label>
                        <input
                            type="text"
                            id="prod_name"
                            name="prod_name"
                            placeholder="Product Name"
                            value={editedProduct.prod_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="prod_description">Product Description:</label>
                        <input
                            type="text"
                            id="prod_description"
                            name="prod_description"
                            placeholder="Product Description"
                            value={editedProduct.prod_description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="image">Product Image:</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            placeholder="Image URL"
                            value={editedProduct.image}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="price">Product Price:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder="Price"
                            value={editedProduct.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="quantity">Product Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            placeholder="Quantity"
                            value={editedProduct.quantity}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-buttons">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
