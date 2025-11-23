// Page Object Model cho Product Page
class ProductPage {
    // Visit product page
    visit() {
        cy.visit('/products');
    }

    // Click nút "Thêm sản phẩm"
    clickAddNew() {
        cy.get('[data-testid="add-product-btn"]').click();
    }

    // Fill form thêm/sửa sản phẩm
    fillProductForm(product) {
        cy.get('[data-testid="product-name"]').clear().type(product.name);
        cy.get('[data-testid="product-price"]').clear().type(product.price);
        cy.get('[data-testid="product-quantity"]').clear().type(product.quantity);
        if (product.description) {
            cy.get('[data-testid="product-description"]').clear().type(product.description);
        }
        cy.get('[data-testid="product-category"]').clear().type(product.category);
    }

    // Submit form
    submitForm() {
        cy.get('[data-testid="submit-button"]').click();
    }

    // Get success message
    getSuccessMessage() {
        return cy.get('[data-testid="success-message"]');
    }

    // Get product in list by name
    getProductInList(name) {
        return cy.contains('[data-testid^="product-row"]', name);
    }

    // Click edit button for a product
    clickEdit(productName) {
        this.getProductInList(productName)
            .find('[data-testid^="edit-button"]')
            .click();
    }

    // Click delete button for a product
    clickDelete(productName) {
        this.getProductInList(productName)
            .find('[data-testid^="delete-button"]')
            .click();
    }

    // Confirm delete dialog
    confirmDelete() {
        cy.on('window:confirm', () => true);
    }

    // Get product table
    getProductTable() {
        return cy.get('[data-testid="product-table"]');
    }

    // Check if product exists in list
    productShouldExist(name) {
        cy.contains('[data-testid^="product-row"]', name).should('exist');
    }

    // Check if product does not exist in list
    productShouldNotExist(name) {
        cy.get('[data-testid^="product-name"]').each(($el) => {
            expect($el.text()).not.to.contain(name);
        });
    }
}

export default ProductPage;
