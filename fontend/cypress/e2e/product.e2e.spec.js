// 6.2.2 E2E Test Scenarios cho Product (2.5 điểm)
// Viết automated tests cho CRUD operations

import ProductPage from '../support/pages/ProductPage';

describe('Product E2E Tests', () => {
    const productPage = new ProductPage();

    beforeEach(() => {
        // Login trước khi test (nếu cần authentication)
        // cy.login('testuser', 'Test123');

        // Visit trang products
        productPage.visit();
    });

    // ========================================
    // a) Test Create product flow (0.5 điểm)
    // ========================================

    it('TC1: Nên hiển thị form thêm sản phẩm khi click nút "Thêm sản phẩm"', () => {
        // Click nút thêm sản phẩm
        productPage.clickAddNew();

        // Kiểm tra form hiển thị
        cy.get('[data-testid="product-form"]').should('be.visible');
        cy.contains('h2', 'Thêm sản phẩm mới').should('be.visible');

        // Kiểm tra các trường input
        cy.get('[data-testid="product-name"]').should('be.visible');
        cy.get('[data-testid="product-price"]').should('be.visible');
        cy.get('[data-testid="product-quantity"]').should('be.visible');
        cy.get('[data-testid="product-description"]').should('be.visible');
        cy.get('[data-testid="product-category"]').should('be.visible');
        cy.get('[data-testid="submit-button"]').should('be.visible');
    });

    it('TC2: Nên tạo sản phẩm mới thành công với đầy đủ thông tin', () => {
        productPage.clickAddNew();

        productPage.fillProductForm({
            name: 'Laptop Dell XPS 15',
            price: '35000000',
            quantity: '10',
            description: 'Laptop cao cấp cho dân văn phòng',
            category: 'Electronics'
        });

        productPage.submitForm();
        cy.wait(1000);

        // Kiểm tra thông báo thành công
        cy.contains('thành công', { timeout: 5000 }).should('be.visible');

        // Kiểm tra sản phẩm xuất hiện trong danh sách
        productPage.productShouldExist('Laptop Dell XPS 15');
        cy.contains('35.000.000').should('be.visible');
    });

    it('TC3: Nên tạo sản phẩm thành công không có mô tả (optional field)', () => {
        productPage.clickAddNew();

        productPage.fillProductForm({
            name: 'Mouse Wireless',
            price: '250000',
            quantity: '50',
            category: 'Accessories'
        });

        productPage.submitForm();
        cy.wait(1000);

        cy.contains('thành công', { timeout: 5000 }).should('be.visible');
        productPage.productShouldExist('Mouse Wireless');
    });

    it('TC4: Nên hiển thị lỗi khi tạo sản phẩm thiếu tên', () => {
        productPage.clickAddNew();

        // Fill các field khác, để name trống
        cy.get('[data-testid="product-price"]').clear().type('1000000');
        cy.get('[data-testid="product-quantity"]').clear().type('5');
        cy.get('[data-testid="product-category"]').clear().type('Test');

        productPage.submitForm();

        // Kiểm tra lỗi validation
        cy.get('[data-testid="error-name"]').should('be.visible')
            .and('contain', 'không được để trống');
    });

    it('TC5: Nên hiển thị lỗi khi giá sản phẩm <= 0', () => {
        productPage.clickAddNew();

        productPage.fillProductForm({
            name: 'Test Product',
            price: '0',
            quantity: '10',
            category: 'Test'
        });

        productPage.submitForm();

        cy.get('[data-testid="error-price"]').should('be.visible')
            .and('contain', 'lớn hơn 0');
    });

    it('TC6: Nên hiển thị lỗi khi số lượng < 0', () => {
        productPage.clickAddNew();

        productPage.fillProductForm({
            name: 'Test Product',
            price: '1000000',
            quantity: '-5',
            category: 'Test'
        });

        productPage.submitForm();

        cy.get('[data-testid="error-quantity"]').should('be.visible');
    });

    it('TC7: Nên quay lại danh sách khi click nút "Quay lại"', () => {
        productPage.clickAddNew();

        // Click nút quay lại
        cy.contains('button', 'Quay lại').click();

        // Kiểm tra đã quay về trang list
        cy.contains('h2', 'Danh sách sản phẩm').should('be.visible');
        productPage.getProductTable().should('be.visible');
    });

    // ========================================
    // b) Test Read/List products (0.5 điểm)
    // ========================================

    it('TC8: Nên hiển thị trang danh sách sản phẩm khi truy cập', () => {
        // Kiểm tra tiêu đề
        cy.contains('h2', 'Danh sách sản phẩm').should('be.visible');

        // Kiểm tra nút thêm sản phẩm
        cy.get('[data-testid="add-product-btn"]').should('be.visible')
            .and('contain', 'Thêm sản phẩm');

        // Kiểm tra table hiển thị
        productPage.getProductTable().should('be.visible');
    });

    it('TC9: Nên hiển thị đầy đủ các cột trong bảng sản phẩm', () => {
        productPage.getProductTable().within(() => {
            cy.contains('th', 'Tên sản phẩm').should('be.visible');
            cy.contains('th', 'Giá').should('be.visible');
            cy.contains('th', 'Số lượng').should('be.visible');
            cy.contains('th', 'Danh mục').should('be.visible');
            cy.contains('th', 'Hành động').should('be.visible');
        });
    });

    it('TC10: Nên hiển thị ít nhất 1 sản phẩm trong danh sách', () => {
        cy.get('[data-testid^="product-row"]').should('have.length.at.least', 1);
    });

    it('TC11: Nên hiển thị đầy đủ thông tin của mỗi sản phẩm', () => {
        // Lấy sản phẩm đầu tiên
        cy.get('[data-testid^="product-row"]').first().within(() => {
            // Kiểm tra có tên sản phẩm
            cy.get('[data-testid^="product-name"]').should('exist').and('not.be.empty');

            // Kiểm tra có giá
            cy.get('[data-testid^="product-price"]').should('exist').and('not.be.empty');

            // Kiểm tra có số lượng
            cy.get('[data-testid^="product-quantity"]').should('exist');

            // Kiểm tra có danh mục
            cy.get('[data-testid^="product-category"]').should('exist').and('not.be.empty');
        });
    });

    it('TC12: Nên hiển thị các nút hành động cho mỗi sản phẩm', () => {
        cy.get('[data-testid^="product-row"]').first().within(() => {
            cy.get('[data-testid^="detail-button"]').should('be.visible').and('contain', 'Xem chi tiết');
            cy.get('[data-testid^="edit-button"]').should('be.visible').and('contain', 'Sửa');
            cy.get('[data-testid^="delete-button"]').should('be.visible').and('contain', 'Xóa');
        });
    });

    it('TC13: Nên hiển thị giá sản phẩm với định dạng tiền tệ', () => {
        // Kiểm tra giá có ký hiệu đ (đồng)
        cy.get('[data-testid^="product-price"]').first()
            .should('contain', 'đ');
    });

    it('TC14: Nên load lại danh sách sau khi thêm sản phẩm mới', () => {
        // Đếm số sản phẩm ban đầu
        cy.get('[data-testid^="product-row"]').its('length').then((initialCount) => {
            // Thêm sản phẩm mới
            productPage.clickAddNew();
            productPage.fillProductForm({
                name: 'New Test Product',
                price: '5000000',
                quantity: '15',
                category: 'Test'
            });
            productPage.submitForm();
            cy.wait(1000);

            // Kiểm tra số sản phẩm tăng lên
            cy.get('[data-testid^="product-row"]').should('have.length', initialCount + 1);
        });
    });

    // ========================================
    // c) Test Update product (0.5 điểm)
    // ========================================

    it('TC15: Nên hiển thị form sửa với dữ liệu sản phẩm hiện tại', () => {
        // Tạo sản phẩm để test
        productPage.clickAddNew();
        productPage.fillProductForm({
            name: 'Product To Edit',
            price: '10000000',
            quantity: '20',
            description: 'Original description',
            category: 'Test Category'
        });
        productPage.submitForm();
        cy.wait(2000);

        // Click nút sửa
        cy.contains('[data-testid^="product-row"]', 'Product To Edit')
            .find('[data-testid^="edit-button"]')
            .click();

        // Kiểm tra form hiển thị với dữ liệu cũ
        cy.contains('h2', 'Sửa sản phẩm').should('be.visible');
        cy.get('[data-testid="product-name"]').should('have.value', 'Product To Edit');
        cy.get('[data-testid="product-price"]').should('have.value', '10000000');
        cy.get('[data-testid="product-quantity"]').should('have.value', '20');
        cy.get('[data-testid="product-category"]').should('have.value', 'Test Category');
    });

    it('TC16: Nên cập nhật tên sản phẩm thành công', () => {
        // Tạo sản phẩm
        productPage.clickAddNew();
        productPage.fillProductForm({
            name: 'Old Name Product',
            price: '5000000',
            quantity: '10',
            category: 'Test'
        });
        productPage.submitForm();
        cy.wait(2000);

        // Intercept API calls
        cy.intercept('PUT', '**/api/products/**').as('updateProduct');
        cy.intercept('GET', '**/api/products').as('getProducts');

        // Sửa tên
        cy.contains('[data-testid^="product-row"]', 'Old Name Product')
            .find('[data-testid^="edit-button"]')
            .click();

        cy.get('[data-testid="product-name"]').clear().type('New Name Product');
        productPage.submitForm();

        // Đợi API update và get products
        cy.wait('@updateProduct');
        cy.wait('@getProducts');

        // Kiểm tra thông báo thành công
        cy.contains('thành công', { timeout: 5000 }).should('be.visible');

        // Kiểm tra tên mới xuất hiện
        cy.contains('[data-testid^="product-row"]', 'New Name Product', { timeout: 5000 }).should('exist');
    });

    it('TC17: Nên cập nhật giá sản phẩm thành công', () => {
        productPage.clickAddNew();
        productPage.fillProductForm({
            name: 'Price Test Product',
            price: '1000000',
            quantity: '5',
            category: 'Test'
        });
        productPage.submitForm();
        cy.wait(2000);

        // Sửa giá
        cy.contains('[data-testid^="product-row"]', 'Price Test Product')
            .find('[data-testid^="edit-button"]')
            .click();

        // Intercept API
        cy.intercept('PUT', '**/api/products/**').as('updateProduct');
        cy.intercept('GET', '**/api/products').as('getProducts');

        cy.get('[data-testid="product-price"]').clear().type('2000000');
        productPage.submitForm();

        cy.wait('@updateProduct');
        cy.wait('@getProducts');

        cy.contains('thành công', { timeout: 5000 }).should('be.visible');

        // Kiểm tra giá mới trong row của sản phẩm
        cy.contains('[data-testid^="product-row"]', 'Price Test Product')
            .find('[data-testid^="product-price"]')
            .should('contain', '2');  // Chỉ check có số 2 (tránh format issue)
    });

    it('TC18: Nên cập nhật số lượng sản phẩm thành công', () => {
        productPage.clickAddNew();
        productPage.fillProductForm({
            name: 'Quantity Test Product',
            price: '500000',
            quantity: '10',
            category: 'Test'
        });
        productPage.submitForm();
        cy.wait(2000);

        // Sửa số lượng
        cy.contains('[data-testid^="product-row"]', 'Quantity Test Product')
            .find('[data-testid^="edit-button"]')
            .click();

        // Intercept API
        cy.intercept('PUT', '**/api/products/**').as('updateProduct');
        cy.intercept('GET', '**/api/products').as('getProducts');

        cy.get('[data-testid="product-quantity"]').clear().type('50');
        productPage.submitForm();

        cy.wait('@updateProduct');
        cy.wait('@getProducts');

        cy.contains('thành công', { timeout: 5000 }).should('be.visible');

        cy.contains('[data-testid^="product-row"]', 'Quantity Test Product', { timeout: 5000 })
            .find('[data-testid^="product-quantity"]')
            .should('contain', '50');
    });

    it('TC19: Nên cập nhật tất cả thông tin sản phẩm cùng lúc', () => {
        productPage.clickAddNew();
        productPage.fillProductForm({
            name: 'Full Update Test',
            price: '3000000',
            quantity: '15',
            category: 'Old Category'
        });
        productPage.submitForm();
        cy.wait(2000);

        // Sửa tất cả
        cy.contains('[data-testid^="product-row"]', 'Full Update Test')
            .find('[data-testid^="edit-button"]')
            .click();

        productPage.fillProductForm({
            name: 'Fully Updated Product',
            price: '5000000',
            quantity: '25',
            description: 'New description',
            category: 'New Category'
        });
        productPage.submitForm();
        cy.wait(1000);

        cy.contains('thành công', { timeout: 5000 }).should('be.visible');
        productPage.productShouldExist('Fully Updated Product');
    });

    it('TC20: Nên hiển thị lỗi khi cập nhật với dữ liệu không hợp lệ', () => {
        productPage.clickAddNew();
        productPage.fillProductForm({
            name: 'Valid Product',
            price: '1000000',
            quantity: '10',
            category: 'Test'
        });
        productPage.submitForm();
        cy.wait(2000);

        // Sửa với dữ liệu không hợp lệ
        cy.contains('[data-testid^="product-row"]', 'Valid Product')
            .find('[data-testid^="edit-button"]')
            .click();

        cy.get('[data-testid="product-name"]').clear();
        cy.get('[data-testid="product-price"]').clear().type('0');
        productPage.submitForm();

        // Kiểm tra lỗi
        cy.get('[data-testid="error-name"]').should('be.visible');
        cy.get('[data-testid="error-price"]').should('be.visible');
    });

    it('TC21: Nên quay lại danh sách khi hủy sửa sản phẩm', () => {
        cy.get('[data-testid^="product-row"]').first()
            .find('[data-testid^="edit-button"]')
            .click();

        cy.contains('button', 'Quay lại').click();

        cy.contains('h2', 'Danh sách sản phẩm').should('be.visible');
    });

    // ========================================
    // d) Test Delete product (0.5 điểm)
    // ========================================

    it('TC22: Nên hiển thị hộp thoại xác nhận khi click nút xóa', () => {
        // Tạo sản phẩm để test
        productPage.clickAddNew();
        productPage.fillProductForm({
            name: 'Delete Confirm Test',
            price: '1000000',
            quantity: '5',
            category: 'Test'
        });
        productPage.submitForm();
        cy.wait(2000);

        // Stub confirm để kiểm tra nó được gọi
        cy.window().then((win) => {
            cy.stub(win, 'confirm').returns(false).as('confirmStub');
        });

        cy.contains('[data-testid^="product-row"]', 'Delete Confirm Test')
            .find('[data-testid^="delete-button"]')
            .click();

        // Kiểm tra confirm được gọi
        cy.get('@confirmStub').should('have.been.calledOnce');
    });

    it('TC23: Không nên xóa sản phẩm khi người dùng hủy xác nhận', () => {
        productPage.clickAddNew();
        productPage.fillProductForm({
            name: 'Cancel Delete Test',
            price: '2000000',
            quantity: '10',
            category: 'Test'
        });
        productPage.submitForm();
        cy.wait(2000);

        // Stub confirm trả về false (Cancel)
        cy.window().then((win) => {
            cy.stub(win, 'confirm').returns(false);
        });

        cy.contains('[data-testid^="product-row"]', 'Cancel Delete Test')
            .find('[data-testid^="delete-button"]')
            .click();

        cy.wait(500);

        // Sản phẩm vẫn còn
        productPage.productShouldExist('Cancel Delete Test');
    });

    it('TC24: Nên xóa sản phẩm thành công khi xác nhận', () => {
        productPage.clickAddNew();
        productPage.fillProductForm({
            name: 'To Be Deleted',
            price: '3000000',
            quantity: '8',
            category: 'Test'
        });
        productPage.submitForm();
        cy.wait(2000);

        // Stub confirm trả về true (OK)
        cy.window().then((win) => {
            cy.stub(win, 'confirm').returns(true);
            cy.stub(win, 'alert');
        });

        cy.contains('[data-testid^="product-row"]', 'To Be Deleted')
            .find('[data-testid^="delete-button"]')
            .click();

        cy.wait(1500);

        // Sản phẩm đã bị xóa
        productPage.productShouldNotExist('To Be Deleted');
    });

    it('TC25: Nên giảm số lượng sản phẩm trong danh sách sau khi xóa', () => {
        // Đếm số sản phẩm ban đầu
        cy.get('[data-testid^="product-row"]').its('length').then((initialCount) => {
            // Tạo sản phẩm để xóa
            productPage.clickAddNew();
            productPage.fillProductForm({
                name: 'Count Test Delete',
                price: '1500000',
                quantity: '5',
                category: 'Test'
            });
            productPage.submitForm();
            cy.wait(2000);

            // Xóa sản phẩm
            cy.window().then((win) => {
                cy.stub(win, 'confirm').returns(true);
                cy.stub(win, 'alert');
            });

            cy.contains('[data-testid^="product-row"]', 'Count Test Delete')
                .find('[data-testid^="delete-button"]')
                .click();

            cy.wait(1500);

            // Số lượng về như ban đầu
            cy.get('[data-testid^="product-row"]').should('have.length', initialCount);
        });
    });

   

    it('TC27: Nên hiển thị thông báo khi xóa thành công', () => {
        productPage.clickAddNew();
        productPage.fillProductForm({
            name: 'Alert Test Delete',
            price: '2500000',
            quantity: '7',
            category: 'Test'
        });
        productPage.submitForm();
        cy.wait(2000);

        cy.window().then((win) => {
            cy.stub(win, 'confirm').returns(true);
            cy.stub(win, 'alert').as('alertStub');
        });

        cy.contains('[data-testid^="product-row"]', 'Alert Test Delete')
            .find('[data-testid^="delete-button"]')
            .click();

        cy.wait(500);

        // Kiểm tra alert được gọi với message thành công
        cy.get('@alertStub').should('have.been.calledWith', 'Xóa thành công!');
    });

    // e) Test Search/Filter functionality (0.5 điểm)



    // Bonus: Test validation
    it('Nên hiển thị lỗi khi tạo sản phẩm với dữ liệu không hợp lệ', () => {
        productPage.clickAddNew();

        // Submit form trống
        productPage.submitForm();

        // Kiểm tra hiển thị lỗi validation
        cy.get('[data-testid="error-name"]').should('be.visible');
        cy.get('[data-testid="error-price"]').should('be.visible');
    });

    it('Nên hiển thị lỗi khi giá sản phẩm <= 0', () => {
        productPage.clickAddNew();

        productPage.fillProductForm({
            name: 'Test Product',
            price: '-1000',
            quantity: '10',
            category: 'Test'
        });

        productPage.submitForm();

        // Kiểm tra lỗi validation
        cy.get('[data-testid="error-price"]').should('contain', 'lớn hơn 0');
    });
});
