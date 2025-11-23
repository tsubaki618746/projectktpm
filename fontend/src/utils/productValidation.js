/**
 * Validate product data
 * @param {Object} product - Product object to validate
 * @returns {Object} Object containing validation errors
 */
export function validateProduct(product) {
  const errors = {};

  // Validate product name
  if (!product.name || product.name.trim() === '') {
    errors.name = 'Tên sản phẩm không được để trống';
  } else if (product.name.length < 3 || product.name.length > 100) {
    errors.name = 'Tên sản phẩm phải từ 3-100 ký tự';
  }

  // Validate price
  if (product.price === undefined || product.price === null || product.price === '') {
    errors.price = 'Giá sản phẩm không được để trống';
  } else if (typeof product.price !== 'number' || product.price <= 0) {
    errors.price = 'Giá sản phẩm phải lớn hơn 0';
  } else if (product.price > 999999999) {
    errors.price = 'Giá sản phẩm không được vượt quá 999,999,999';
  }

  // Validate quantity
  if (product.quantity === undefined || product.quantity === null || product.quantity === '') {
    errors.quantity = 'Số lượng không được để trống';
  } else if (typeof product.quantity !== 'number' || product.quantity < 0) {
    errors.quantity = 'Số lượng phải lớn hơn hoặc bằng 0';
  } else if (product.quantity > 99999) {
    errors.quantity = 'Số lượng không được vượt quá 99,999';
  }

  // Validate description
  if (product.description && product.description.length > 500) {
    errors.description = 'Mô tả không được vượt quá 500 ký tự';
  }

  // Validate category
  if (!product.category || product.category.trim() === '') {
    errors.category = 'Danh mục không được để trống';
  }

  return errors;
}
