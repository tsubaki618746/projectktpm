import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from '../components/ProductForm';
import { createProductAPI, updateProductAPI } from '../services/productService';

// Mock API services
jest.mock('../services/productService');

// b) Test ProductForm component (create/edit) (2 điểm)
describe('ProductForm Component Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CREATE MODE
  describe('Create Product', () => {
    
    test('TC1: Tạo sản phẩm mới thành công', async () => {
      createProductAPI.mockResolvedValue({ 
        id: 1, 
        name: 'Laptop Dell',
        price: 15000000,
        quantity: 10,
        category: 'Electronics'
      });
      
      const mockOnSubmit = jest.fn();
      render(<ProductForm onSubmit={mockOnSubmit} />);
      
      // Nhập dữ liệu
      fireEvent.change(screen.getByTestId('product-name'), { 
        target: { value: 'Laptop Dell' } 
      });
      fireEvent.change(screen.getByTestId('product-price'), { 
        target: { value: '15000000' } 
      });
      fireEvent.change(screen.getByTestId('product-quantity'), { 
        target: { value: '10' } 
      });
      fireEvent.change(screen.getByTestId('product-category'), { 
        target: { value: 'Electronics' } 
      });
      
      // Submit form
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Laptop Dell',
          price: 15000000,
          quantity: 10,
          description: '',
          category: 'Electronics'
        });
      });
    });

    test('TC2: Hiển thị lỗi validation khi tạo sản phẩm', async () => {
      render(<ProductForm onSubmit={() => {}} />);
      
      // Submit form rỗng
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-name')).toBeInTheDocument();
        expect(screen.getByTestId('error-price')).toBeInTheDocument();
        expect(screen.getByTestId('error-category')).toBeInTheDocument();
      });
    });

    test('TC3: Không gọi onSubmit khi có lỗi validation', async () => {
      const mockOnSubmit = jest.fn();
      render(<ProductForm onSubmit={mockOnSubmit} />);
      
      // Nhập dữ liệu không hợp lệ
      fireEvent.change(screen.getByTestId('product-name'), { 
        target: { value: 'AB' } // Quá ngắn
      });
      
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-name')).toBeInTheDocument();
      });
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  // EDIT MODE
  describe('Edit Product', () => {
    
    const existingProduct = {
      id: 1,
      name: 'Laptop Dell',
      price: 15000000,
      quantity: 10,
      description: 'Laptop Dell XPS 13',
      category: 'Electronics'
    };

    test('TC4: Load dữ liệu sản phẩm khi edit', () => {
      render(<ProductForm onSubmit={() => {}} initialProduct={existingProduct} />);
      
      expect(screen.getByTestId('product-name').value).toBe('Laptop Dell');
      expect(screen.getByTestId('product-price').value).toBe('15000000');
      expect(screen.getByTestId('product-quantity').value).toBe('10');
      expect(screen.getByTestId('product-description').value).toBe('Laptop Dell XPS 13');
      expect(screen.getByTestId('product-category').value).toBe('Electronics');
    });

    test('TC5: Cập nhật sản phẩm thành công', async () => {
      const mockOnSubmit = jest.fn();
      render(<ProductForm onSubmit={mockOnSubmit} initialProduct={existingProduct} />);
      
      // Thay đổi giá
      fireEvent.change(screen.getByTestId('product-price'), { 
        target: { value: '18000000' } 
      });
      
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Laptop Dell',
          price: 18000000,
          quantity: 10,
          description: 'Laptop Dell XPS 13',
          category: 'Electronics'
        });
      });
    });

    test('TC6: Hiển thị lỗi khi cập nhật với dữ liệu không hợp lệ', async () => {
      render(<ProductForm onSubmit={() => {}} initialProduct={existingProduct} />);
      
      // Xóa tên sản phẩm
      fireEvent.change(screen.getByTestId('product-name'), { 
        target: { value: '' } 
      });
      
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-name')).toHaveTextContent('Tên sản phẩm không được để trống');
      });
    });
  });
  
});
