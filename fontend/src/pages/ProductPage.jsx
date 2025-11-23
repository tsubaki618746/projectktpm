import { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import ProductDetail from '../components/ProductDetail';
import { createProductAPI, updateProductAPI } from '../services/productService';

function ProductPage() {
  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    console.log('handleAdd clicked - changing view to form');
    setEditingProduct(null);
    setView('form');
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setView('form');
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setView('detail');
  };

  const handleFormSubmit = async (product) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (editingProduct) {
        await updateProductAPI(editingProduct.id, product);
        setSuccessMessage('Cập nhật thành công!');
      } else {
        await createProductAPI(product);
        setSuccessMessage('Thêm sản phẩm thành công!');
      }

      // Chuyển về list ngay lập tức
      setView('list');
      setEditingProduct(null);
      setRefreshKey(prev => prev + 1);
      
      // Xóa message sau 3 giây
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedProduct(null);
    setEditingProduct(null);
  };

  console.log('ProductPage render - current view:', view);

  return (
    <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
      {view === 'list' && (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2>Danh sách sản phẩm</h2>
            <button
              onClick={handleAdd}
              data-testid="add-product-btn"
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              + Thêm sản phẩm
            </button>
          </div>
          {successMessage && (
            <div data-testid="success-message" style={{
              color: 'green', 
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {successMessage}
            </div>
          )}
          <ProductList
            key={refreshKey}
            onEdit={handleEdit}
            onViewDetail={handleViewDetail}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        </div>
      )}

      {view === 'form' && (
        <div>
          <button
            onClick={handleBackToList}
            disabled={loading}
            style={{
              padding: '8px 16px',
              marginBottom: '20px',
              backgroundColor: loading ? '#ccc' : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            ← Quay lại
          </button>
          <h2>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
          {successMessage && <div data-testid="success-message" style={{color: 'green', marginBottom: '10px'}}>{successMessage}</div>}
          {loading && <div style={{color: '#666', marginBottom: '10px'}}>Đang lưu...</div>}
          <ProductForm
            onSubmit={handleFormSubmit}
            initialProduct={editingProduct}
          />
        </div>
      )}

      {view === 'detail' && (
        <div>
          <button
            onClick={handleBackToList}
            style={{
              padding: '8px 16px',
              marginBottom: '20px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Quay lại
          </button>
          <ProductDetail productId={selectedProduct?.id} />
        </div>
      )}
    </div>
  );
}

export default ProductPage;
