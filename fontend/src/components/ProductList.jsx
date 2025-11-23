import { useState, useEffect } from 'react';
import { getProductsAPI, deleteProductAPI } from '../services/productService';

export default function ProductList({ onEdit, onViewDetail, onRefresh }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProductsAPI();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    try {
      await deleteProductAPI(id);
      alert('Xóa thành công!');
      setProducts(products.filter(p => p.id !== id));
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message);
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) {
    return <div data-testid="loading">Đang tải...</div>;
  }

  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  return (
    <div data-testid="product-list">
      {products.length === 0 ? (
        <div data-testid="empty-message">Không có sản phẩm nào</div>
      ) : (
        <table data-testid="product-table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} data-testid={`product-row-${product.id}`}>
                <td data-testid={`product-name-${product.id}`}>{product.name}</td>
                <td data-testid={`product-price-${product.id}`}>{product.price.toLocaleString('vi-VN')} đ</td>
                <td data-testid={`product-quantity-${product.id}`}>{product.quantity}</td>
                <td data-testid={`product-category-${product.id}`}>{product.category}</td>
                <td>
                  <button
                    onClick={() => onViewDetail(product)}
                    data-testid={`detail-button-${product.id}`}
                    style={{
                      backgroundColor: '#2196F3',
                      color: 'white',
                      padding: '6px 12px',
                      marginRight: '5px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => onEdit(product)}
                    data-testid={`edit-button-${product.id}`}
                    style={{
                      backgroundColor: '#FF9800',
                      color: 'white',
                      padding: '6px 12px',
                      marginRight: '5px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    data-testid={`delete-button-${product.id}`}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
