import { useState } from 'react';
import { validateProduct } from '../utils/productValidation';

export default function ProductForm({ onSubmit, initialProduct }) {
  const [product, setProduct] = useState({
    name: initialProduct?.name || '',
    price: initialProduct?.price || '',
    quantity: initialProduct?.quantity || '',
    description: initialProduct?.description || '',
    category: initialProduct?.category || ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'price' || name === 'quantity') {
      // Keep empty string as is, convert to number only if has value
      processedValue = value === '' ? '' : Number(value);
    }
    
    setProduct(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateProduct(product);
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(product);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="product-form">
      <div>
        <label htmlFor="name">Tên sản phẩm:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={product.name}
          onChange={handleChange}
          data-testid="product-name"
        />
        {errors.name && <span data-testid="error-name">{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="price">Giá:</label>
        <input
          id="price"
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          data-testid="product-price"
        />
        {errors.price && <span data-testid="error-price">{errors.price}</span>}
      </div>

      <div>
        <label htmlFor="quantity">Số lượng:</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleChange}
          data-testid="product-quantity"
        />
        {errors.quantity && <span data-testid="error-quantity">{errors.quantity}</span>}
      </div>

      <div>
        <label htmlFor="description">Mô tả:</label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          data-testid="product-description"
        />
        {errors.description && <span data-testid="error-description">{errors.description}</span>}
      </div>

      <div>
        <label htmlFor="category">Danh mục:</label>
        <input
          id="category"
          name="category"
          type="text"
          value={product.category}
          onChange={handleChange}
          data-testid="product-category"
        />
        {errors.category && <span data-testid="error-category">{errors.category}</span>}
      </div>

      <button type="submit" data-testid="submit-button">
        Lưu sản phẩm
      </button>
    </form>
  );
}
