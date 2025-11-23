// 6.1.2 E2E Test Scenarios cho Login (2.5 điểm)
// Viết automated tests cho toàn bộ login flow

describe('Login E2E Tests', () => {

    beforeEach(() => {
        // Visit trang login trước mỗi test
        cy.visit('http://localhost:3000');
    });

    // a) Test complete login flow (1 điểm)
    it('Nên hiển thị form login', () => {
        cy.get('[data-testid="username-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');
        cy.get('[data-testid="login-button"]').should('be.visible');
    });

    it('Nên login thành công với credentials hợp lệ', () => {
        // Nhập username và password hợp lệ
        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type('Test123');
        cy.get('[data-testid="login-button"]').click();

        // Kiểm tra thông báo thành công
        cy.get('[data-testid="login-message"]')
            .should('contain', 'thành công');

        // Kiểm tra redirect hoặc token được lưu
        cy.url().should('include', '/dashboard');
    });

    // b) Test validation messages (0.5 điểm)
    it('Nên hiển thị lỗi với credentials không hợp lệ', () => {
        cy.get('[data-testid="username-input"]').type('ab');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="username-error"]')
            .should('be.visible');
    });

    // c) Test success/error flows (0.5 điểm)
    it('Nên hiển thị lỗi khi username không tồn tại', () => {
        cy.get('[data-testid="username-input"]').type('wronguser');
        cy.get('[data-testid="password-input"]').type('Test123');
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="login-message"]')
            .should('contain', 'Ten dang nhap hoac mat khau khong dung');
    });

    it('Nên hiển thị lỗi khi password sai', () => {
        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type('WrongPass123');
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="login-message"]')
            .should('contain', 'Ten dang nhap hoac mat khau khong dung');
    });

    // d) Test UI elements interactions (0.5 điểm)
    it('Nên disable button khi đang xử lý', () => {
        // Intercept API và delay response 500ms
        cy.intercept('POST', '**/api/auth/login', {
            delay: 500,
            statusCode: 200,
            body: {
                token: 'fake-token',
                username: 'testuser'
            }
        });

        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type('Test123');
        cy.get('[data-testid="login-button"]').click();

        // Button nên bị disable ngay sau khi click
        cy.get('[data-testid="login-button"]').should('be.disabled');
    });

    it('Nên clear error messages khi nhập lại', () => {
        // Tạo lỗi trước
        cy.get('[data-testid="username-input"]').type('ab');
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="username-error"]').should('be.visible');

        // Nhập lại username hợp lệ
        cy.get('[data-testid="username-input"]').clear().type('testuser');
        cy.get('[data-testid="password-input"]').type('Test123');
        cy.get('[data-testid="login-button"]').click();

        // Error nên biến mất
        cy.get('[data-testid="username-error"]').should('not.exist');
    });

    it('Nên focus vào username input khi load trang', () => {
        cy.get('[data-testid="username-input"]').should('have.focus');
    });

    it('Nên submit form khi nhấn Enter', () => {
        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type('Test123{enter}');

        cy.get('[data-testid="login-message"]')
            .should('contain', 'thành công');
    });

});
