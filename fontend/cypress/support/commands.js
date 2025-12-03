// Các lệnh tùy chỉnh (Custom commands) cho Cypress

// Lệnh đăng nhập (login)
Cypress.Commands.add('login', (username, password) => {
  // Mở trang chủ của ứng dụng (ví dụ: trang đăng nhập)
  cy.visit('/');

  // Nhập tên đăng nhập vào input có attribute data-testid="username-input"
  cy.get('[data-testid="username-input"]').type(username);

  // Nhập mật khẩu vào input có attribute data-testid="password-input"
  cy.get('[data-testid="password-input"]').type(password);

  // Nhấn nút đăng nhập có attribute data-testid="login-button"
  cy.get('[data-testid="login-button"]').click();
});

// Lệnh xóa sạch dữ liệu trong database (nếu cần dùng trong test)
Cypress.Commands.add('clearDatabase', () => {
  // Gửi request HTTP POST đến API endpoint để xóa dữ liệu test
  cy.request('POST', `${Cypress.env('apiUrl')}/test/clear-database`);
});

// Lệnh thêm dữ liệu mẫu vào database (seed) (nếu cần)
Cypress.Commands.add('seedDatabase', () => {
  // Gửi request HTTP POST đến API endpoint để thêm dữ liệu test mẫu
  cy.request('POST', `${Cypress.env('apiUrl')}/test/seed-database`);
});
