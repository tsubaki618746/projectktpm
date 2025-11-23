import * as productService from '../services/productService';

// Mock ProductService
jest.mock('../services/productService');

// 5.2.1 Frontend Mocking (2.5 điểm)
// Mock ProductService trong component tests
describe('Product Mock Tests', () => {

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    // a) Mock CRUD operations (1.5 điểm)
    describe('Mock CRUD operations', () => {

        test('Mock: Create product thành công', async () => {
            const mockProduct = {
                id: 1,
                name: 'Laptop',
                price: 15000000
            };

            productService.createProductAPI.mockResolvedValue(mockProduct);

            // Test implementation
            const result = await productService.createProductAPI({
                name: 'Laptop',
                price: 15000000
            });

            expect(productService.createProductAPI).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockProduct);
        });

        test('Mock: Get products with pagination', async () => {
            const mockProducts = {
                data: [
                    { id: 1, name: 'Laptop', price: 15000000 },
                    { id: 2, name: 'iPhone', price: 25000000 }
                ],
                page: 1,
                total: 100
            };

            productService.getProductsAPI.mockResolvedValue(mockProducts);

            // Test implementation
            const result = await productService.getProductsAPI();

            expect(productService.getProductsAPI).toHaveBeenCalledTimes(1);
            expect(result.data).toHaveLength(2);
            expect(result.page).toBe(1);
            expect(result.total).toBe(100);
        });

        test('Mock: Update product thành công', async () => {
            const mockUpdatedProduct = {
                id: 1,
                name: 'Laptop Dell Updated',
                price: 18000000
            };

            productService.updateProductAPI.mockResolvedValue(mockUpdatedProduct);

            // Test implementation
            const result = await productService.updateProductAPI(1, {
                name: 'Laptop Dell Updated',
                price: 18000000
            });

            expect(productService.updateProductAPI).toHaveBeenCalledTimes(1);
            expect(productService.updateProductAPI).toHaveBeenCalledWith(1, {
                name: 'Laptop Dell Updated',
                price: 18000000
            });
            expect(result.name).toBe('Laptop Dell Updated');
        });

        test('Mock: Delete product thành công', async () => {
            productService.deleteProductAPI.mockResolvedValue({ success: true });

            // Test implementation
            const result = await productService.deleteProductAPI(1);

            expect(productService.deleteProductAPI).toHaveBeenCalledTimes(1);
            expect(productService.deleteProductAPI).toHaveBeenCalledWith(1);
            expect(result.success).toBe(true);
        });

        test('Mock: Get product by ID thành công', async () => {
            const mockProduct = {
                id: 1,
                name: 'Laptop Dell',
                price: 15000000,
                quantity: 10,
                category: 'Electronics'
            };

            productService.getProductByIdAPI.mockResolvedValue(mockProduct);

            // Test implementation
            const result = await productService.getProductByIdAPI(1);

            expect(productService.getProductByIdAPI).toHaveBeenCalledTimes(1);
            expect(productService.getProductByIdAPI).toHaveBeenCalledWith(1);
            expect(result.id).toBe(1);
            expect(result.name).toBe('Laptop Dell');
        });
    });

    // b) Test success và failure scenarios (0.5 điểm)
    describe('Test success và failure scenarios', () => {

        test('Mock: Create product thành công', async () => {
            const mockProduct = {
                id: 1,
                name: 'Laptop',
                price: 15000000
            };

            productService.createProductAPI.mockResolvedValue(mockProduct);

            const result = await productService.createProductAPI({
                name: 'Laptop',
                price: 15000000
            });

            expect(result).toEqual(mockProduct);
            expect(productService.createProductAPI).toHaveBeenCalled();
        });

        test('Mock: Create product thất bại', async () => {
            productService.createProductAPI.mockRejectedValue(
                new Error('Failed to create product')
            );

            await expect(
                productService.createProductAPI({ name: 'Laptop' })
            ).rejects.toThrow('Failed to create product');

            expect(productService.createProductAPI).toHaveBeenCalled();
        });

        test('Mock: Get products thành công', async () => {
            const mockProducts = {
                data: [{ id: 1, name: 'Laptop' }],
                page: 1,
                total: 100
            };

            productService.getProductsAPI.mockResolvedValue(mockProducts);

            const result = await productService.getProductsAPI();

            expect(result.data).toHaveLength(1);
            expect(productService.getProductsAPI).toHaveBeenCalled();
        });

        test('Mock: Get products thất bại', async () => {
            productService.getProductsAPI.mockRejectedValue(
                new Error('Failed to fetch products')
            );

            await expect(
                productService.getProductsAPI()
            ).rejects.toThrow('Failed to fetch products');

            expect(productService.getProductsAPI).toHaveBeenCalled();
        });

        test('Mock: Update product thành công', async () => {
            const mockUpdatedProduct = {
                id: 1,
                name: 'Laptop Updated',
                price: 18000000
            };

            productService.updateProductAPI.mockResolvedValue(mockUpdatedProduct);

            const result = await productService.updateProductAPI(1, {
                name: 'Laptop Updated',
                price: 18000000
            });

            expect(result).toEqual(mockUpdatedProduct);
            expect(productService.updateProductAPI).toHaveBeenCalled();
        });

        test('Mock: Update product thất bại', async () => {
            productService.updateProductAPI.mockRejectedValue(
                new Error('Failed to update product')
            );

            await expect(
                productService.updateProductAPI(1, { name: 'Laptop' })
            ).rejects.toThrow('Failed to update product');

            expect(productService.updateProductAPI).toHaveBeenCalled();
        });

        test('Mock: Delete product thành công', async () => {
            productService.deleteProductAPI.mockResolvedValue({ success: true });

            const result = await productService.deleteProductAPI(1);

            expect(result.success).toBe(true);
            expect(productService.deleteProductAPI).toHaveBeenCalled();
        });

        test('Mock: Delete product thất bại', async () => {
            productService.deleteProductAPI.mockRejectedValue(
                new Error('Failed to delete product')
            );

            await expect(
                productService.deleteProductAPI(1)
            ).rejects.toThrow('Failed to delete product');

            expect(productService.deleteProductAPI).toHaveBeenCalled();
        });
    });

    // c) Verify all mock calls (0.5 điểm)
    describe('Verify all mock calls', () => {

        test('Verify createProductAPI được gọi với đúng tham số', async () => {
            const productData = {
                name: 'Laptop Dell',
                price: 15000000,
                quantity: 10,
                category: 'Electronics'
            };

            productService.createProductAPI.mockResolvedValue({
                id: 1,
                ...productData
            });

            await productService.createProductAPI(productData);

            expect(productService.createProductAPI).toHaveBeenCalledTimes(1);
            expect(productService.createProductAPI).toHaveBeenCalledWith(productData);
        });

        test('Verify updateProductAPI được gọi với đúng ID và data', async () => {
            const updateData = {
                name: 'Laptop Updated',
                price: 18000000
            };

            productService.updateProductAPI.mockResolvedValue({
                id: 1,
                ...updateData
            });

            await productService.updateProductAPI(1, updateData);

            expect(productService.updateProductAPI).toHaveBeenCalledTimes(1);
            expect(productService.updateProductAPI).toHaveBeenCalledWith(1, updateData);
        });

        test('Verify deleteProductAPI được gọi với đúng ID', async () => {
            productService.deleteProductAPI.mockResolvedValue({ success: true });

            await productService.deleteProductAPI(5);

            expect(productService.deleteProductAPI).toHaveBeenCalledTimes(1);
            expect(productService.deleteProductAPI).toHaveBeenCalledWith(5);
        });

        test('Verify getProductsAPI không được gọi nhiều lần', async () => {
            productService.getProductsAPI.mockResolvedValue({
                data: [],
                page: 1,
                total: 0
            });

            await productService.getProductsAPI();

            expect(productService.getProductsAPI).toHaveBeenCalledTimes(1);
            expect(productService.getProductsAPI).not.toHaveBeenCalledTimes(2);
        });

        test('Verify tất cả mock calls được clear sau mỗi test', () => {
            // Sau khi beforeEach chạy, tất cả mocks phải được clear
            expect(productService.createProductAPI).not.toHaveBeenCalled();
            expect(productService.getProductsAPI).not.toHaveBeenCalled();
            expect(productService.updateProductAPI).not.toHaveBeenCalled();
            expect(productService.deleteProductAPI).not.toHaveBeenCalled();
        });
    });

});
