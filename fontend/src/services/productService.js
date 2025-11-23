/**
 * Product API services
 */

// Get all products
export async function getProductsAPI() {
  const response = await fetch('/api/products', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Không thể tải danh sách sản phẩm');
  }

  return response.json();
}

// Get product by ID
export async function getProductByIdAPI(id) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Không thể tải thông tin sản phẩm');
  }

  return response.json();
}

// Create new product
export async function createProductAPI(product) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Không thể tạo sản phẩm');
  }

  return response.json();
}

// Update product
export async function updateProductAPI(id, product) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Không thể cập nhật sản phẩm');
  }

  return response.json();
}

// Delete product
export async function deleteProductAPI(id) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Không thể xóa sản phẩm');
  }

  // DELETE returns 204 No Content, no need to parse JSON
  return;
}
