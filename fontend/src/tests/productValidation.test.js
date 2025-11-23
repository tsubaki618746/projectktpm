import { validateProduct } from '../utils/productValidation';

// 3.2.1 Product Validation Tests (5 điểm)
describe('Product Validation Tests', () => {
  
  // a) Unit tests cho validateProduct() (3 điểm)
  describe('validateProduct', () => {
    
    // Test product name validation
    test('TC1: Product name rỗng - nên trả về lỗi', () => {
      const product = {
        name: '',
        price: 1000,
        quantity: 10,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.name).toBe('Tên sản phẩm không được để trống');
    });
    
    test('TC2: Product name quá ngắn - nên trả về lỗi', () => {
      const product = {
        name: 'AB',
        price: 1000,
        quantity: 10,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.name).toBe('Tên sản phẩm phải từ 3-100 ký tự');
    });
    
    test('TC3: Product name quá dài - nên trả về lỗi', () => {
      const product = {
        name: 'A'.repeat(101),
        price: 1000,
        quantity: 10,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.name).toBe('Tên sản phẩm phải từ 3-100 ký tự');
    });
    
    test('TC4: Product name hợp lệ - không có lỗi', () => {
      const product = {
        name: 'Laptop Dell',
        price: 1000,
        quantity: 10,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.name).toBeUndefined();
    });
    
    // Test price validation (boundary tests)
    test('TC5: Price âm - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: -1000,
        quantity: 10,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.price).toBe('Giá sản phẩm phải lớn hơn 0');
    });
    
    test('TC6: Price bằng 0 - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 0,
        quantity: 10,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.price).toBe('Giá sản phẩm phải lớn hơn 0');
    });
    
    test('TC7: Price vượt quá giới hạn - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000000000,
        quantity: 10,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.price).toBe('Giá sản phẩm không được vượt quá 999,999,999');
    });
    
    test('TC8: Price hợp lệ - không có lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 15000000,
        quantity: 10,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.price).toBeUndefined();
    });
    
    // Test quantity validation
    test('TC9: Quantity âm - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: -5,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.quantity).toBe('Số lượng phải lớn hơn hoặc bằng 0');
    });
    
    test('TC10: Quantity vượt quá giới hạn - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 100000,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.quantity).toBe('Số lượng không được vượt quá 99,999');
    });
    
    test('TC11: Quantity hợp lệ (bằng 0) - không có lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 0,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.quantity).toBeUndefined();
    });
    
    test('TC12: Quantity hợp lệ - không có lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 50,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.quantity).toBeUndefined();
    });
    
    // Test description length
    test('TC13: Description quá dài - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 10,
        description: 'A'.repeat(501),
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.description).toBe('Mô tả không được vượt quá 500 ký tự');
    });
    
    test('TC14: Description hợp lệ - không có lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 10,
        description: 'Laptop chất lượng cao',
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.description).toBeUndefined();
    });
    
    // Test category validation
    test('TC15: Category rỗng - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 10,
        category: ''
      };
      const errors = validateProduct(product);
      
      expect(errors.category).toBe('Danh mục không được để trống');
    });
    
    test('TC16: Category hợp lệ - không có lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 10,
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(errors.category).toBeUndefined();
    });
    
    // Test product hợp lệ - không có lỗi
    test('TC17: Product hợp lệ - không có lỗi', () => {
      const product = {
        name: 'Laptop Dell',
        price: 15000000,
        quantity: 10,
        description: 'Laptop Dell XPS 13',
        category: 'Electronics'
      };
      const errors = validateProduct(product);
      
      expect(Object.keys(errors).length).toBe(0);
    });
  });
  
});
