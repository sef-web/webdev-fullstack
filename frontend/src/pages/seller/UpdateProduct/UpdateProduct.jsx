import React, { useState } from 'react';

const EditProduct = ({ product, onClose, onSave, category }) => {
    const [editedProduct, setEditedProduct] = useState(product);
    const [selectedCategory, setSelectedCategory] = useState(editedProduct.cat_id || "");

    const handleChange = (e) => {
        setEditedProduct((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = () => {
        const updatedProduct = { ...editedProduct, cat_id: selectedCategory };
        onSave(updatedProduct);
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
                            value={editedProduct.prod_description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="image">Image URL:</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={editedProduct.image}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="price">Price:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={editedProduct.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={editedProduct.quantity}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="cat_id">Category:</label>
                        <select
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={selectedCategory}
                        >
                            <option value="">Select a Category</option>
                            {category.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.cat_name}
                                </option>
                            ))}
                        </select>
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
