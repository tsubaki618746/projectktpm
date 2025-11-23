import { useState, useEffect } from 'react';
import { getProductByIdAPI } from '../services/productService';

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProductByIdAPI(productId);
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div data-testid="loading">Đang tải...</div>;
  }

  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  if (!product) {
    return <div data-testid="no-product">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div data-testid="product-detail">
      <h2 data-testid="product-name">{product.name}</h2>
      <div data-testid="product-price">Giá: {product.price}</div>
      <div data-testid="product-quantity">Số lượng: {product.quantity}</div>
      <div data-testid="product-category">Danh mục: {product.category}</div>
      {product.description && (
        <div data-testid="product-description">Mô tả: {product.description}</div>
      )}
    </div>
  );
}
