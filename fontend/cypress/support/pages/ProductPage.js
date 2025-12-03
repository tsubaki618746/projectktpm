// Page Object Model cho trang Product (Quản lý sản phẩm)
class ProductPage {
    // Vào trang danh sách sản phẩm
    visit() {
        cy.visit('/products');
    }

    // Nhấn nút "Thêm sản phẩm" để mở form thêm mới
    clickAddNew() {
        cy.get('[data-testid="add-product-btn"]').click();
    }

    // Điền thông tin sản phẩm vào form thêm/sửa
    fillProductForm(product) {
        cy.get('[data-testid="product-name"]').clear().type(product.name);
        cy.get('[data-testid="product-price"]').clear().type(product.price);
        cy.get('[data-testid="product-quantity"]').clear().type(product.quantity);
        if (product.description) {
            cy.get('[data-testid="product-description"]').clear().type(product.description);
        }
        cy.get('[data-testid="product-category"]').clear().type(product.category);
    }

    // Nhấn nút gửi form (thêm/sửa)
    submitForm() {
        cy.get('[data-testid="submit-button"]').click();
    }

    // Lấy phần tử chứa thông báo thành công
    getSuccessMessage() {
        return cy.get('[data-testid="success-message"]');
    }

    // Tìm dòng sản phẩm trong danh sách theo tên sản phẩm
    getProductInList(name) {
        return cy.contains('[data-testid^="product-row"]', name);
    }

    // Nhấn nút sửa sản phẩm với tên sản phẩm cho trước
    clickEdit(productName) {
        this.getProductInList(productName)
            .find('[data-testid^="edit-button"]')
            .click();
    }

    // Nhấn nút xóa sản phẩm với tên sản phẩm cho trước
    clickDelete(productName) {
        this.getProductInList(productName)
            .find('[data-testid^="delete-button"]')
            .click();
    }

    // Xác nhận hộp thoại xác nhận xóa
    confirmDelete() {
        cy.on('window:confirm', () => true);
    }

    // Lấy bảng danh sách sản phẩm
    getProductTable() {
        return cy.get('[data-testid="product-table"]');
    }

    // Kiểm tra sản phẩm với tên cho trước có tồn tại trong danh sách
    productShouldExist(name) {
        cy.contains('[data-testid^="product-row"]', name).should('exist');
    }

    // Kiểm tra sản phẩm với tên cho trước không tồn tại trong danh sách
    productShouldNotExist(name) {
        cy.get('[data-testid^="product-name"]').each(($el) => {
            expect($el.text()).not.to.contain(name);
        });
    }
}

export default ProductPage;
