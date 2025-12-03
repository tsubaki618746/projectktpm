import { useState, useEffect } from 'react';
import { getProductByIdAPI } from '../services/productService';

export default function ProductDetail({ productId }) {
  // State lưu dữ liệu sản phẩm lấy về từ API
  const [product, setProduct] = useState(null);
  // State để quản lý trạng thái loading khi gọi API
  const [loading, setLoading] = useState(false);
  // State lưu lỗi (nếu có) khi gọi API thất bại
  const [error, setError] = useState('');

  // useEffect sẽ chạy mỗi khi prop productId thay đổi
  useEffect(() => {
    // Nếu có productId thì gọi hàm loadProduct
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  // Hàm async gọi API lấy chi tiết sản phẩm theo id
  const loadProduct = async () => {
    setLoading(true);  // Bật trạng thái loading
    setError('');      // Reset lỗi trước khi gọi API
    try {
      // Gọi API lấy dữ liệu sản phẩm
      const data = await getProductByIdAPI(productId);
      setProduct(data);  // Lưu dữ liệu trả về vào state product
    } catch (err) {
      // Nếu lỗi xảy ra thì lưu lỗi vào state error
      setError(err.message);
    } finally {
      // Tắt loading dù thành công hay thất bại
      setLoading(false);
    }
  };

  // Nếu đang loading, hiển thị thông báo đang tải
  if (loading) {
    return <div data-testid="loading">Đang tải...</div>;
  }

  // Nếu có lỗi, hiển thị lỗi
  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  // Nếu không có dữ liệu product (ví dụ API trả về null) thì hiển thị không tìm thấy sản phẩm
  if (!product) {
    return <div data-testid="no-product">Không tìm thấy sản phẩm</div>;
  }

  // Nếu có dữ liệu, hiển thị chi tiết sản phẩm
  return (
    <div data-testid="product-detail">
      <h2 data-testid="product-name">{product.name}</h2>
      <div data-testid="product-price">Giá: {product.price}</div>
      <div data-testid="product-quantity">Số lượng: {product.quantity}</div>
      <div data-testid="product-category">Danh mục: {product.category}</div>
      {/* Nếu có mô tả thì hiển thị */}
      {product.description && (
        <div data-testid="product-description">Mô tả: {product.description}</div>
      )}
    </div>
  );
}
