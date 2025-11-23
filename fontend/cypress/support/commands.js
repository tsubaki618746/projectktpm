// Custom commands for Cypress

// Login command
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/');
  cy.get('[data-testid="username-input"]').type(username);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

// Clear database command (nếu cần)
Cypress.Commands.add('clearDatabase', () => {
  cy.request('POST', `${Cypress.env('apiUrl')}/test/clear-database`);
});

// Seed database command (nếu cần)
Cypress.Commands.add('seedDatabase', () => {
  cy.request('POST', `${Cypress.env('apiUrl')}/test/seed-database`);
});
