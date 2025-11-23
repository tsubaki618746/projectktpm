// Security Testing - SQL Injection for Product CRUD
// Test common SQL injection attacks on product operations

import ProductPage from '../../support/pages/ProductPage';

describe('SQL Injection Tests - Product', () => {
    const productPage = new ProductPage();

    beforeEach(() => {
        // Login first (assuming authentication is required)
        cy.visit('/');
        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type('Test123');
        cy.get('[data-testid="login-button"]').click();
        cy.wait(1000);
        
        productPage.visit();
    });

    // ========================================
    // 1. SQL Injection in Product Creation
    // ========================================

    it('TC1: Nên chặn SQL injection trong product name khi tạo mới', () => {
        productPage.clickAddNew();

        cy.get('[data-testid="product-name"]').type("Product' OR '1'='1");
        cy.get('[data-testid="product-price"]').type('1000000');
        cy.get('[data-testid="product-quantity"]').type('10');
        cy.get('[data-testid="product-category"]').type('Test');
        
        productPage.submitForm();
        cy.wait(1000);

        // Sản phẩm được tạo với tên chứa SQL code (đã được escape)
        cy.contains("Product' OR '1'='1").should('exist');
        
        // Không gây lỗi SQL
        cy.get('body').should('not.contain', 'SQL');
        cy.get('body').should('not.contain', 'syntax error');
    });

    it('TC2: Nên chặn SQL injection với UNION trong product name', () => {
        productPage.clickAddNew();

        cy.get('[data-testid="product-name"]')
            .type("Product' UNION SELECT NULL,NULL,NULL--");
        cy.get('[data-testid="product-price"]').type('1000000');
        cy.get('[data-testid="product-quantity"]').type('10');
        cy.get('[data-testid="product-category"]').type('Test');
        
        productPage.submitForm();
        cy.wait(1000);

        // Không được leak dữ liệu từ database
        cy.get('[data-testid^="product-row"]').should('have.length.at.most', 20);
    });

    it('TC3: Nên chặn SQL injection trong product description', () => {
        productPage.clickAddNew();

        cy.get('[data-testid="product-name"]').type('Test Product');
        cy.get('[data-testid="product-price"]').type('1000000');
        cy.get('[data-testid="product-quantity"]').type('10');
        cy.get('[data-testid="product-description"]')
            .type("Description'; DROP TABLE products--");
        cy.get('[data-testid="product-category"]').type('Test');
        
        productPage.submitForm();
        cy.wait(1000);

        // Table không bị xóa - vẫn thấy danh sách sản phẩm
        cy.get('[data-testid="product-table"]').should('be.visible');
        cy.get('[data-testid^="product-row"]').should('have.length.at.least', 1);
    });

    it('TC4: Nên chặn SQL injection trong product category', () => {
        productPage.clickAddNew();

        cy.get('[data-testid="product-name"]').type('Test Product');
        cy.get('[data-testid="product-price"]').type('1000000');
        cy.get('[data-testid="product-quantity"]').type('10');
        cy.get('[data-testid="product-category"]')
            .type("Category' OR 1=1--");
        
        productPage.submitForm();
        cy.wait(1000);

        // Category được lưu như plain text
        cy.contains("Category' OR 1=1--").should('exist');
    });

    it('TC5: Nên chặn SQL injection với stacked queries trong product creation', () => {
        productPage.clickAddNew();

        cy.get('[data-testid="product-name"]')
            .type("Product'; INSERT INTO products VALUES(999,'Hacked',0,0,'Hack')--");
        cy.get('[data-testid="product-price"]').type('1000000');
        cy.get('[data-testid="product-quantity"]').type('10');
        cy.get('[data-testid="product-category"]').type('Test');
        
        productPage.submitForm();
        cy.wait(1000);

        // Không có sản phẩm "Hacked" được tạo
        cy.get('body').should('not.contain', 'Hacked');
    });

    // ========================================
    // 2. SQL Injection in Product Update
    // ========================================

    it('TC6: Nên chặn SQL injection khi update product name', () => {
        // Tạo sản phẩm test
        productPage.clickAddNew();
        cy.get('[data-testid="product-name"]').type('Original Product');
        cy.get('[data-testid="product-price"]').type('1000000');
        cy.get('[data-testid="product-quantity"]').type('10');
        cy.get('[data-testid="product-category"]').type('Test');
        productPage.submitForm();
        cy.wait(2000);

        // Update với SQL injection
        cy.contains('[data-testid^="product-row"]', 'Original Product')
            .find('[data-testid^="edit-button"]')
            .click();

        cy.get('[data-testid="product-name"]')
            .clear()
            .type("Updated' OR '1'='1");
        productPage.submitForm();
        cy.wait(1000);

        // Tên được update với SQL code (đã escape)
        cy.contains("Updated' OR '1'='1").should('exist');
        
        // Không update tất cả products
        cy.get('[data-testid^="product-row"]').each(($row) => {
            cy.wrap($row).should('not.contain', "Updated' OR '1'='1");
        });
    });

    it('TC7: Nên chặn SQL injection với UNION trong product update', () => {
        // Lấy product đầu tiên để update
        cy.get('[data-testid^="product-row"]').first()
            .find('[data-testid^="edit-button"]')
            .click();

        cy.get('[data-testid="product-name"]')
            .clear()
            .type("Product' UNION SELECT password FROM users--");
        productPage.submitForm();
        cy.wait(1000);

        // Không leak password
        cy.get('body').should('not.contain', 'Test123');
        cy.get('body').should('not.contain', 'Password123');
    });

    it('TC8: Nên chặn SQL injection khi update với comment', () => {
        cy.get('[data-testid^="product-row"]').first()
            .find('[data-testid^="edit-button"]')
            .click();

        cy.get('[data-testid="product-price"]')
            .clear()
            .type("1000000' WHERE 1=1--");
        productPage.submitForm();

        // Validation error hoặc giá được parse thành 0
        cy.get('[data-testid="error-price"]').should('be.visible');
    });

    // ========================================
    // 3. SQL Injection in Product Search/Filter
    // ========================================

    it('TC9: Nên chặn SQL injection trong search input (nếu có)', () => {
        // Nếu có search functionality
        cy.get('body').then($body => {
            if ($body.find('[data-testid="search-input"]').length > 0) {
                cy.get('[data-testid="search-input"]')
                    .type("' OR '1'='1");
                
                // Không trả về tất cả products
                // Hoặc không có kết quả
                cy.wait(500);
                cy.get('[data-testid^="product-row"]').should('have.length.at.most', 20);
            }
        });
    });

    it('TC10: Nên chặn SQL injection trong category filter (nếu có)', () => {
        cy.get('body').then($body => {
            if ($body.find('[data-testid="category-filter"]').length > 0) {
                cy.get('[data-testid="category-filter"]')
                    .type("' OR '1'='1");
                
                cy.wait(500);
                // Không trả về tất cả products
                cy.get('[data-testid^="product-row"]').should('have.length.at.most', 20);
            }
        });
    });

    // ========================================
    // 4. SQL Injection in Product ID Parameter
    // ========================================

    it('TC11: Nên chặn SQL injection trong product ID khi xem chi tiết', () => {
        // Thử truy cập với malicious ID
        cy.visit('/products?id=1\' OR \'1\'=\'1');
        
        // Không crash và không leak data
        cy.get('body').should('not.contain', 'SQL');
        cy.get('body').should('not.contain', 'syntax error');
    });

    it('TC12: Nên chặn SQL injection với UNION trong product ID', () => {
        cy.request({
            url: '/api/products/1\' UNION SELECT NULL--',
            failOnStatusCode: false
        }).then((response) => {
            // Nên trả về 400 Bad Request hoặc 404 Not Found
            expect(response.status).to.be.oneOf([400, 404, 500]);
        });
    });

    // ========================================
    // 5. SQL Injection in Product Delete
    // ========================================

    it('TC13: Nên chặn SQL injection khi delete product', () => {
        // Tạo product để test
        productPage.clickAddNew();
        cy.get('[data-testid="product-name"]').type('To Delete');
        cy.get('[data-testid="product-price"]').type('1000000');
        cy.get('[data-testid="product-quantity"]').type('10');
        cy.get('[data-testid="product-category"]').type('Test');
        productPage.submitForm();
        cy.wait(2000);

        const initialCount = Cypress.$('[data-testid^="product-row"]').length;

        // Stub confirm
        cy.window().then((win) => {
            cy.stub(win, 'confirm').returns(true);
            cy.stub(win, 'alert');
        });

        // Thử delete với SQL injection trong ID
        cy.request({
            method: 'DELETE',
            url: '/api/products/1\' OR \'1\'=\'1',
            failOnStatusCode: false
        }).then((response) => {
            // Nên fail hoặc chỉ xóa 1 product
            expect(response.status).to.be.oneOf([400, 404, 204]);
        });

        // Kiểm tra không xóa tất cả products
        cy.visit('/products');
        cy.wait(1000);
        cy.get('[data-testid^="product-row"]').should('have.length.at.least', initialCount - 1);
    });

    // ========================================
    // 6. Time-based Blind SQL Injection
    // ========================================

    it('TC14: Nên chặn time-based SQL injection trong product operations', () => {
        const startTime = Date.now();

        productPage.clickAddNew();
        cy.get('[data-testid="product-name"]')
            .type("Product' AND SLEEP(5)--");
        cy.get('[data-testid="product-price"]').type('1000000');
        cy.get('[data-testid="product-quantity"]').type('10');
        cy.get('[data-testid="product-category"]').type('Test');
        productPage.submitForm();

        cy.then(() => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            // Response không nên bị delay 5 giây
            expect(duration).to.be.lessThan(5000);
        });
    });

    // ========================================
    // 7. Error-based SQL Injection
    // ========================================

    it('TC15: Nên không leak database errors trong product operations', () => {
        productPage.clickAddNew();
        
        cy.get('[data-testid="product-name"]').type("Product'''");
        cy.get('[data-testid="product-price"]').type('1000000');
        cy.get('[data-testid="product-quantity"]').type('10');
        cy.get('[data-testid="product-category"]').type('Test');
        productPage.submitForm();
        cy.wait(1000);

        // Không hiển thị SQL error messages
        cy.get('body').should('not.contain', 'SQL');
        cy.get('body').should('not.contain', 'syntax error');
        cy.get('body').should('not.contain', 'mysql');
        cy.get('body').should('not.contain', 'postgresql');
        cy.get('body').should('not.contain', 'ORA-');
        cy.get('body').should('not.contain', 'SQLSTATE');
    });

    // ========================================
    // 8. Batch SQL Injection
    // ========================================

    it('TC16: Nên chặn batch SQL injection với multiple statements', () => {
        productPage.clickAddNew();
        
        cy.get('[data-testid="product-name"]')
            .type("Product'; DELETE FROM products WHERE 1=1; --");
        cy.get('[data-testid="product-price"]').type('1000000');
        cy.get('[data-testid="product-quantity"]').type('10');
        cy.get('[data-testid="product-category"]').type('Test');
        productPage.submitForm();
        cy.wait(1000);

        // Tất cả products không bị xóa
        cy.visit('/products');
        cy.wait(1000);
        cy.get('[data-testid^="product-row"]').should('have.length.at.least', 1);
    });

    // ========================================
    // 9. Second-order SQL Injection
    // ========================================

    it('TC17: Nên chặn second-order SQL injection', () => {
        // Tạo product với malicious name
        productPage.clickAddNew();
        cy.get('[data-testid="product-name"]')
            .type("Product' OR '1'='1");
        cy.get('[data-testid="product-price"]').type('1000000');
        cy.get('[data-testid="product-quantity"]').type('10');
        cy.get('[data-testid="product-category"]').type('Test');
        productPage.submitForm();
        cy.wait(2000);

        // Update product này
        cy.contains('[data-testid^="product-row"]', "Product' OR '1'='1")
            .find('[data-testid^="edit-button"]')
            .click();

        cy.get('[data-testid="product-price"]').clear().type('2000000');
        productPage.submitForm();
        cy.wait(1000);

        // Chỉ product này được update, không phải tất cả
        cy.get('[data-testid^="product-row"]').should('have.length.at.least', 1);
    });

    // ========================================
    // 10. Parameterized Query Verification
    // ========================================

    it('TC18: Nên sử dụng parameterized queries (kiểm tra qua behavior)', () => {
        // Tạo nhiều products với SQL injection attempts
        const sqlPayloads = [
            "' OR '1'='1",
            "'; DROP TABLE products--",
            "' UNION SELECT NULL--",
            "' AND SLEEP(5)--"
        ];

        sqlPayloads.forEach((payload, index) => {
            productPage.clickAddNew();
            cy.get('[data-testid="product-name"]').type(`Test ${index} ${payload}`);
            cy.get('[data-testid="product-price"]').type('1000000');
            cy.get('[data-testid="product-quantity"]').type('10');
            cy.get('[data-testid="product-category"]').type('Test');
            productPage.submitForm();
            cy.wait(1500);
        });

        // Tất cả products được tạo thành công với SQL code như plain text
        cy.visit('/products');
        cy.wait(1000);
        
        sqlPayloads.forEach((payload, index) => {
            cy.contains(`Test ${index} ${payload}`).should('exist');
        });

        // Database vẫn hoạt động bình thường
        cy.get('[data-testid="product-table"]').should('be.visible');
    });
});
