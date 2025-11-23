import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../components/ProductList';
import { getProductsAPI, deleteProductAPI } from '../services/productService';

// Mock API services
jest.mock('../services/productService');

// a) Test ProductList component với API (2 điểm)
describe('ProductList Component Integration Tests', () => {

  const mockProducts = [
    { id: 1, name: 'Laptop Dell', price: 15000000, quantity: 10, category: 'Electronics' },
    { id: 2, name: 'iPhone 15', price: 25000000, quantity: 5, category: 'Electronics' },
    { id: 3, name: 'Samsung TV', price: 12000000, quantity: 8, category: 'Electronics' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TC1: Load và hiển thị danh sách sản phẩm từ API', async () => {
    getProductsAPI.mockResolvedValue(mockProducts);

    render(<ProductList onEdit={() => { }} onViewDetail={() => { }} />);

    // Kiểm tra loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Đợi dữ liệu load xong
    await waitFor(() => {
      expect(screen.getByTestId('product-table')).toBeInTheDocument();
    });

    // Kiểm tra API được gọi
    expect(getProductsAPI).toHaveBeenCalledTimes(1);

    // Kiểm tra hiển thị đúng số lượng sản phẩm
    expect(screen.getByTestId('product-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-row-3')).toBeInTheDocument();
  });

  test('TC2: Hiển thị thông tin chi tiết của từng sản phẩm', async () => {
    getProductsAPI.mockResolvedValue(mockProducts);

    render(<ProductList onEdit={() => { }} onViewDetail={() => { }} />);

    await waitFor(() => {
      expect(screen.getByTestId('product-name-1')).toHaveTextContent('Laptop Dell');
      expect(screen.getByTestId('product-price-1')).toHaveTextContent('15');
      expect(screen.getByTestId('product-quantity-1')).toHaveTextContent('10');
      expect(screen.getByTestId('product-category-1')).toHaveTextContent('Electronics');
    });
  });

  test('TC3: Hiển thị thông báo khi danh sách rỗng', async () => {
    getProductsAPI.mockResolvedValue([]);

    render(<ProductList onEdit={() => { }} onViewDetail={() => { }} />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-message')).toHaveTextContent('Không có sản phẩm nào');
    });
  });

  test('TC4: Hiển thị lỗi khi API thất bại', async () => {
    getProductsAPI.mockRejectedValue(new Error('Không thể tải danh sách sản phẩm'));

    render(<ProductList onEdit={() => { }} onViewDetail={() => { }} />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Không thể tải danh sách sản phẩm');
    });
  });

  test('TC5: Xóa sản phẩm thành công', async () => {
    getProductsAPI.mockResolvedValue(mockProducts);
    deleteProductAPI.mockResolvedValue(undefined);

    // Mock window.confirm và window.alert
    global.confirm = jest.fn(() => true);
    global.alert = jest.fn();

    render(<ProductList onEdit={() => { }} onViewDetail={() => { }} />);

    await waitFor(() => {
      expect(screen.getByTestId('product-row-1')).toBeInTheDocument();
    });

    // Click nút xóa
    fireEvent.click(screen.getByTestId('delete-button-1'));

    await waitFor(() => {
      expect(deleteProductAPI).toHaveBeenCalledWith(1);
      expect(screen.queryByTestId('product-row-1')).not.toBeInTheDocument();
    });
  });

  test('TC6: Gọi callback onEdit khi click nút sửa', async () => {
    getProductsAPI.mockResolvedValue(mockProducts);
    const mockOnEdit = jest.fn();

    render(<ProductList onEdit={mockOnEdit} onViewDetail={() => { }} />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-button-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('edit-button-1'));

    expect(mockOnEdit).toHaveBeenCalledWith(mockProducts[0]);
  });

  test('TC7: Gọi callback onViewDetail khi click nút xem chi tiết', async () => {
    getProductsAPI.mockResolvedValue(mockProducts);
    const mockOnViewDetail = jest.fn();

    render(<ProductList onEdit={() => { }} onViewDetail={mockOnViewDetail} />);

    await waitFor(() => {
      expect(screen.getByTestId('detail-button-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('detail-button-1'));

    expect(mockOnViewDetail).toHaveBeenCalledWith(mockProducts[0]);
  });

});
