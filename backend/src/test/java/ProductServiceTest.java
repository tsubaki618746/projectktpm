package com.flogin.service;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("Product Service Unit Tests")
class ProductServiceTest {
    
    @Mock
    private ProductRepository productRepository;
    
    @InjectMocks
    private ProductService productService;
    
    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }
    
    // === TEST CREATE PRODUCT ===
    
    @Test
    @DisplayName("TC1: Tao san pham moi thanh cong")
    void testCreateProduct() {
        // Given
        ProductDto productDto = new ProductDto(null, "Laptop", 15000000.0, 10, "Electronics");
        Product product = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
        
        when(productRepository.save(any(Product.class))).thenReturn(product);
        
        // When
        ProductDto result = productService.createProduct(productDto);
        
        // Then
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(15000000.0, result.getPrice());
        verify(productRepository, times(1)).save(any(Product.class));
    }
    
    @Test
    @DisplayName("TC2: Tao san pham that bai khi du lieu null")
    void testCreateProduct_NullData() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(null);
        });
    }
    
    @Test
    @DisplayName("TC3: Tao san pham that bai khi ten trong")
    void testCreateProduct_EmptyName() {
        // Given
        ProductDto productDto = new ProductDto(null, "", 15000000.0, 10, "Electronics");
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(productDto);
        });
    }
    
    @Test
    @DisplayName("TC4: Tao san pham that bai khi gia <= 0")
    void testCreateProduct_InvalidPrice() {
        // Given
        ProductDto productDto = new ProductDto(null, "Laptop", -100.0, 10, "Electronics");
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(productDto);
        });
    }
    
    // === TEST GET PRODUCT ===
    
    @Test
    @DisplayName("TC5: Lay thong tin san pham thanh cong")
    void testGetProduct() {
        // Given
        Product product = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        
        // When
        ProductDto result = productService.getProduct(1L);
        
        // Then
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(1L, result.getId());
        verify(productRepository, times(1)).findById(1L);
    }
    
    @Test
    @DisplayName("TC6: Lay san pham khong ton tai")
    void testGetProduct_NotFound() {
        // Given
        when(productRepository.findById(999L)).thenReturn(Optional.empty());
        
        // When
        ProductDto result = productService.getProduct(999L);
        
        // Then
        assertNull(result);
    }
    
    @Test
    @DisplayName("TC7: Lay san pham voi ID khong hop le")
    void testGetProduct_InvalidId() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            productService.getProduct(-1L);
        });
    }
    
    // === TEST UPDATE PRODUCT ===
    
    @Test
    @DisplayName("TC8: Cap nhat san pham thanh cong")
    void testUpdateProduct() {
        // Given
        Product existingProduct = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
        ProductDto updateDto = new ProductDto(1L, "Laptop Pro", 20000000.0, 5, "Electronics");
        Product updatedProduct = new Product(1L, "Laptop Pro", 20000000.0, 5, "Electronics");
        
        when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);
        
        // When
        ProductDto result = productService.updateProduct(1L, updateDto);
        
        // Then
        assertNotNull(result);
        assertEquals("Laptop Pro", result.getName());
        assertEquals(20000000.0, result.getPrice());
        verify(productRepository, times(1)).save(any(Product.class));
    }
    
    @Test
    @DisplayName("TC9: Cap nhat san pham khong ton tai")
    void testUpdateProduct_NotFound() {
        // Given
        ProductDto updateDto = new ProductDto(999L, "Laptop", 15000000.0, 10, "Electronics");
        when(productRepository.findById(999L)).thenReturn(Optional.empty());
        
        // When
        ProductDto result = productService.updateProduct(999L, updateDto);
        
        // Then
        assertNull(result);
    }
    
    @Test
    @DisplayName("TC10: Cap nhat san pham voi du lieu null")
    void testUpdateProduct_NullData() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            productService.updateProduct(1L, null);
        });
    }
    
    // === TEST DELETE PRODUCT ===
    
    @Test
    @DisplayName("TC11: Xoa san pham thanh cong")
    void testDeleteProduct() {
        // Given
        when(productRepository.existsById(1L)).thenReturn(true);
        doNothing().when(productRepository).deleteById(1L);
        
        // When
        boolean result = productService.deleteProduct(1L);
        
        // Then
        assertTrue(result);
        verify(productRepository, times(1)).deleteById(1L);
    }
    
    @Test
    @DisplayName("TC12: Xoa san pham khong ton tai")
    void testDeleteProduct_NotFound() {
        // Given
        when(productRepository.existsById(999L)).thenReturn(false);
        
        // When
        boolean result = productService.deleteProduct(999L);
        
        // Then
        assertFalse(result);
        verify(productRepository, never()).deleteById(999L);
    }
    
    @Test
    @DisplayName("TC13: Xoa san pham voi ID khong hop le")
    void testDeleteProduct_InvalidId() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            productService.deleteProduct(null);
        });
    }
    
    // === TEST GET ALL WITH PAGINATION ===
    
    @Test
    @DisplayName("TC14: Lay danh sach san pham voi pagination")
    void testGetAllProducts_WithPagination() {
        // Given
        Product product1 = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
        Product product2 = new Product(2L, "Mouse", 200000.0, 50, "Electronics");
        Page<Product> productPage = new PageImpl<>(Arrays.asList(product1, product2));
        
        when(productRepository.findAll(any(Pageable.class))).thenReturn(productPage);
        
        // When
        Page<ProductDto> result = productService.getAllProducts(0, 10);
        
        // Then
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals("Laptop", result.getContent().get(0).getName());
        verify(productRepository, times(1)).findAll(any(Pageable.class));
    }
    
    @Test
    @DisplayName("TC15: Lay danh sach voi page number am")
    void testGetAllProducts_NegativePage() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            productService.getAllProducts(-1, 10);
        });
    }
    
    @Test
    @DisplayName("TC16: Lay danh sach voi page size <= 0")
    void testGetAllProducts_InvalidSize() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            productService.getAllProducts(0, 0);
        });
    }
}
