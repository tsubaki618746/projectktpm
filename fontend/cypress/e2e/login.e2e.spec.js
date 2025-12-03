describe('Login E2E Tests', () => {

    beforeEach(() => {
        // Trước mỗi test, truy cập lại trang login để đảm bảo trạng thái sạch
        cy.visit('http://localhost:3000');
    });

    // a) Test complete login flow (1 điểm)
    it('Nên hiển thị form login', () => {
        // Kiểm tra các input username, password và nút login có hiển thị trên trang
        cy.get('[data-testid="username-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');
        cy.get('[data-testid="login-button"]').should('be.visible');
    });

    it('Nên login thành công với credentials hợp lệ', () => {
        // Nhập username và password đúng chuẩn hợp lệ
        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type('Test123');
        // Click nút login để gửi form
        cy.get('[data-testid="login-button"]').click();

        // Chờ thông báo thành công xuất hiện (timeout tăng do có thể server phản hồi chậm)
        cy.get('[data-testid="login-message"]', { timeout: 10000 })
            .should('contain', 'thành công');

        // Kiểm tra URL đã chuyển hướng tới trang dashboard sau khi login thành công
        cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });

    // b) Test validation messages (0.5 điểm)
    it('Nên hiển thị lỗi với credentials không hợp lệ', () => {
        // Nhập username và password không đủ điều kiện (quá ngắn)
        cy.get('[data-testid="username-input"]').type('ab');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="login-button"]').click();

        // Kiểm tra lỗi validation xuất hiện trên username input
        cy.get('[data-testid="username-error"]').should('be.visible');
    });

    // c) Test success/error flows (0.5 điểm)
    it('Nên hiển thị lỗi khi username không tồn tại', () => {
        // Nhập username không có trong hệ thống và password đúng định dạng
        cy.get('[data-testid="username-input"]').type('wronguser');
        cy.get('[data-testid="password-input"]').type('Test123');
        cy.get('[data-testid="login-button"]').click();

        // Kiểm tra thông báo lỗi chung khi username hoặc password sai
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Ten dang nhap hoac mat khau khong dung');
    });

    it('Nên hiển thị lỗi khi password sai', () => {
        // Nhập username đúng, password sai
        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type('WrongPass123');
        cy.get('[data-testid="login-button"]').click();

        // Kiểm tra thông báo lỗi chung khi username hoặc password sai
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Ten dang nhap hoac mat khau khong dung');
    });

    // d) Test UI elements interactions (0.5 điểm)
    it('Nên disable button khi đang xử lý', () => {
        // Chặn API login và delay 500ms để test trạng thái nút khi đang chờ phản hồi
        cy.intercept('POST', '**/api/auth/login', {
            delay: 500,
            statusCode: 200,
            body: {
                token: 'fake-token',
                username: 'testuser'
            }
        });

        // Nhập username, password hợp lệ
        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type('Test123');
        // Click login
        cy.get('[data-testid="login-button"]').click();

        // Kiểm tra nút login bị disable ngay khi đang gửi request (để tránh click liên tục)
        cy.get('[data-testid="login-button"]').should('be.disabled');
    });

    it('Nên clear error messages khi nhập lại', () => {
        // Tạo lỗi bằng cách nhập username quá ngắn rồi click login
        cy.get('[data-testid="username-input"]').type('ab');
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="username-error"]').should('be.visible');

        // Nhập lại username hợp lệ và password, rồi click login
        cy.get('[data-testid="username-input"]').clear().type('testuser');
        cy.get('[data-testid="password-input"]').type('Test123');
        cy.get('[data-testid="login-button"]').click();

        // Kiểm tra lỗi username đã được xoá khi nhập lại dữ liệu mới
        cy.get('[data-testid="username-error"]').should('not.exist');
    });

    it('Nên focus vào username input khi load trang', () => {
        // Kiểm tra input username được focus mặc định khi load trang login
        cy.get('[data-testid="username-input"]').should('have.focus');
    });

    it('Nên submit form khi nhấn Enter', () => {
        // Nhập username, password và nhấn phím Enter thay vì click nút
        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type('Test123{enter}');

        // Kiểm tra thông báo login thành công xuất hiện
        cy.get('[data-testid="login-message"]', { timeout: 10000 })
            .should('contain', 'thành công');
    });

});
