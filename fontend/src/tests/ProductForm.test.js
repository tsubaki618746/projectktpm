import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from '../components/ProductForm';

// b) Viết tests cho Product form component (1 điểm)
describe('ProductForm Component Tests', () => {

    test('TC1: Render form với tất cả các fields', () => {
        render(<ProductForm onSubmit={() => { }} />);

        expect(screen.getByTestId('product-name')).toBeInTheDocument();
        expect(screen.getByTestId('product-price')).toBeInTheDocument();
        expect(screen.getByTestId('product-quantity')).toBeInTheDocument();
        expect(screen.getByTestId('product-description')).toBeInTheDocument();
        expect(screen.getByTestId('product-category')).toBeInTheDocument();
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    test('TC2: Nhập dữ liệu vào form fields', () => {
        render(<ProductForm onSubmit={() => { }} />);

        const nameInput = screen.getByTestId('product-name');
        const priceInput = screen.getByTestId('product-price');

        fireEvent.change(nameInput, { target: { value: 'Laptop Dell' } });
        fireEvent.change(priceInput, { target: { value: '15000000' } });

        expect(nameInput.value).toBe('Laptop Dell');
        expect(priceInput.value).toBe('15000000');
    });

    test('TC3: Submit form với dữ liệu hợp lệ', () => {
        const mockSubmit = jest.fn();
        render(<ProductForm onSubmit={mockSubmit} />);

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

        fireEvent.click(screen.getByTestId('submit-button'));

        expect(mockSubmit).toHaveBeenCalledWith({
            name: 'Laptop Dell',
            price: 15000000,
            quantity: 10,
            description: '',
            category: 'Electronics'
        });
    });

    test('TC4: Submit form với dữ liệu không hợp lệ - hiển thị lỗi', () => {
        const mockSubmit = jest.fn();
        render(<ProductForm onSubmit={mockSubmit} />);

        // Submit form rỗng
        fireEvent.click(screen.getByTestId('submit-button'));

        // Kiểm tra không gọi onSubmit
        expect(mockSubmit).not.toHaveBeenCalled();

        // Kiểm tra hiển thị lỗi
        expect(screen.getByTestId('error-name')).toHaveTextContent('Tên sản phẩm không được để trống');
    });

    test('TC5: Hiển thị nhiều lỗi validation cùng lúc', () => {
        render(<ProductForm onSubmit={() => { }} />);

        // Nhập dữ liệu không hợp lệ
        fireEvent.change(screen.getByTestId('product-name'), {
            target: { value: 'AB' } // Quá ngắn
        });
        fireEvent.change(screen.getByTestId('product-price'), {
            target: { value: '-1000' } // Âm
        });

        fireEvent.click(screen.getByTestId('submit-button'));

        expect(screen.getByTestId('error-name')).toBeInTheDocument();
        expect(screen.getByTestId('error-price')).toBeInTheDocument();
    });

    test('TC6: Load form với dữ liệu ban đầu (edit mode)', () => {
        const initialProduct = {
            name: 'Laptop Dell',
            price: 15000000,
            quantity: 10,
            description: 'Laptop XPS 13',
            category: 'Electronics'
        };

        render(<ProductForm onSubmit={() => { }} initialProduct={initialProduct} />);

        expect(screen.getByTestId('product-name').value).toBe('Laptop Dell');
        expect(screen.getByTestId('product-price').value).toBe('15000000');
        expect(screen.getByTestId('product-quantity').value).toBe('10');
        expect(screen.getByTestId('product-description').value).toBe('Laptop XPS 13');
        expect(screen.getByTestId('product-category').value).toBe('Electronics');
    });

});
