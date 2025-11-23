import { render, screen, waitFor } from '@testing-library/react';
import ProductDetail from '../components/ProductDetail';
import { getProductByIdAPI } from '../services/productService';

// Mock API service
jest.mock('../services/productService');

// c) Test ProductDetail component (1 điểm)
describe('ProductDetail Component Integration Tests', () => {
  
  const mockProduct = {
    id: 1,
    name: 'Laptop Dell',
    price: 15000000,
    quantity: 10,
    description: 'Laptop Dell XPS 13 - Core i7',
    category: 'Electronics'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TC1: Load và hiển thị chi tiết sản phẩm', async () => {
    getProductByIdAPI.mockResolvedValue(mockProduct);
    
    render(<ProductDetail productId={1} />);
    
    // Kiểm tra loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Đợi dữ liệu load xong
    await waitFor(() => {
      expect(screen.getByTestId('product-detail')).toBeInTheDocument();
    });
    
    // Kiểm tra API được gọi với đúng ID
    expect(getProductByIdAPI).toHaveBeenCalledWith(1);
    
    // Kiểm tra hiển thị đúng thông tin
    expect(screen.getByTestId('product-name')).toHaveTextContent('Laptop Dell');
    expect(screen.getByTestId('product-price')).toHaveTextContent('15000000');
    expect(screen.getByTestId('product-quantity')).toHaveTextContent('10');
    expect(screen.getByTestId('product-category')).toHaveTextContent('Electronics');
    expect(screen.getByTestId('product-description')).toHaveTextContent('Laptop Dell XPS 13 - Core i7');
  });

  test('TC2: Hiển thị lỗi khi không tải được sản phẩm', async () => {
    getProductByIdAPI.mockRejectedValue(new Error('Không thể tải thông tin sản phẩm'));
    
    render(<ProductDetail productId={1} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Không thể tải thông tin sản phẩm');
    });
  });

  test('TC3: Không load khi không có productId', () => {
    render(<ProductDetail productId={null} />);
    
    expect(screen.getByTestId('no-product')).toBeInTheDocument();
    expect(getProductByIdAPI).not.toHaveBeenCalled();
  });

  test('TC4: Load lại khi productId thay đổi', async () => {
    getProductByIdAPI.mockResolvedValue(mockProduct);
    
    const { rerender } = render(<ProductDetail productId={1} />);
    
    await waitFor(() => {
      expect(getProductByIdAPI).toHaveBeenCalledWith(1);
    });
    
    // Thay đổi productId
    rerender(<ProductDetail productId={2} />);
    
    await waitFor(() => {
      expect(getProductByIdAPI).toHaveBeenCalledWith(2);
      expect(getProductByIdAPI).toHaveBeenCalledTimes(2);
    });
  });
  
});
