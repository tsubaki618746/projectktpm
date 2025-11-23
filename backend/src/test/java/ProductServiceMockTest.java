package com.flogin.service;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Product Service Mock Repository Tests")
class ProductServiceMockTest {
    
    @Mock
    private ProductRepository productRepository;
    
    @InjectMocks
    private ProductService productService;
    
    // === MOCK PRODUCTREPOSITORY ===
    
    @Test
    @DisplayName("TC1: Mock ProductRepository thanh cong")
    void testProductRepositoryMocked() {
        // Given
        Product mockProduct = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
        
        when(productRepository.findById(1L))
            .thenReturn(Optional.of(mockProduct));
        
        // When
        ProductDto result = productService.getProduct(1L);
        
        // Then
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(1L, result.getId());
    }
    
    @Test
    @DisplayName("TC2: Mock repository tra ve Optional.empty()")
    void testRepositoryReturnsEmpty() {
        // Given
        when(productRepository.findById(999L))
            .thenReturn(Optional.empty());
        
        // When
        ProductDto result = productService.getProduct(999L);
        
        // Then
        assertNull(result);
    }
    
    @Test
    @DisplayName("TC3: Mock repository.save() tra ve product moi")
    void testRepositorySave() {
        // Given
        Product savedProduct = new Product(1L, "Mouse", 200000.0, 50, "Electronics");
        
        when(productRepository.save(any(Product.class)))
            .thenReturn(savedProduct);
        
        // When
        ProductDto requestDto = new ProductDto(null, "Mouse", 200000.0, 50, "Electronics");
        ProductDto result = productService.createProduct(requestDto);
        
        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Mouse", result.getName());
    }
    
    // === TEST SERVICE LAYER WITH MOCKED REPOSITORY ===
    
    @Test
    @DisplayName("TC4: Test getProduct voi mocked repository")
    void testGetProductWithMockedRepository() {
        // Given
        Product mockProduct = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
        when(productRepository.findById(1L))
            .thenReturn(Optional.of(mockProduct));
        
        // When
        ProductDto result = productService.getProduct(1L);
        
        // Then
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(15000000.0, result.getPrice());
        
        // Verify
        verify(productRepository, times(1)).findById(1L);
    }
    
    @Test
    @DisplayName("TC5: Test createProduct voi mocked repository")
    void testCreateProductWithMockedRepository() {
        // Given
        Product savedProduct = new Product(2L, "Keyboard", 500000.0, 20, "Electronics");
        when(productRepository.save(any(Product.class)))
            .thenReturn(savedProduct);
        
        // When
        ProductDto requestDto = new ProductDto(null, "Keyboard", 500000.0, 20, "Electronics");
        ProductDto result = productService.createProduct(requestDto);
        
        // Then
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Keyboard", result.getName());
        
        // Verify
        verify(productRepository, times(1)).save(any(Product.class));
    }
    
    @Test
    @DisplayName("TC6: Test updateProduct voi mocked repository")
    void testUpdateProductWithMockedRepository() {
        // Given
        Product existingProduct = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
        Product updatedProduct = new Product(1L, "Laptop Pro", 20000000.0, 5, "Electronics");
        
        when(productRepository.findById(1L))
            .thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class)))
            .thenReturn(updatedProduct);
        
        // When
        ProductDto updateDto = new ProductDto(1L, "Laptop Pro", 20000000.0, 5, "Electronics");
        ProductDto result = productService.updateProduct(1L, updateDto);
        
        // Then
        assertNotNull(result);
        assertEquals("Laptop Pro", result.getName());
        assertEquals(20000000.0, result.getPrice());
        
        // Verify
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }
    
    @Test
    @DisplayName("TC7: Test deleteProduct voi mocked repository")
    void testDeleteProductWithMockedRepository() {
        // Given
        when(productRepository.existsById(1L))
            .thenReturn(true);
        doNothing().when(productRepository).deleteById(1L);
        
        // When
        boolean result = productService.deleteProduct(1L);
        
        // Then
        assertTrue(result);
        
        // Verify
        verify(productRepository, times(1)).existsById(1L);
        verify(productRepository, times(1)).deleteById(1L);
    }
    
    @Test
    @DisplayName("TC8: Test getAllProducts voi mocked repository")
    void testGetAllProductsWithMockedRepository() {
        // Given
        Product product1 = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
        Product product2 = new Product(2L, "Mouse", 200000.0, 50, "Electronics");
        Page<Product> mockPage = new PageImpl<>(Arrays.asList(product1, product2));
        
        when(productRepository.findAll(any(Pageable.class)))
            .thenReturn(mockPage);
        
        // When
        Page<ProductDto> result = productService.getAllProducts(0, 10);
        
        // Then
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals("Laptop", result.getContent().get(0).getName());
        
        // Verify
        verify(productRepository, times(1)).findAll(any(Pageable.class));
    }
    
    // === VERIFY REPOSITORY INTERACTIONS ===
    
    @Test
    @DisplayName("TC9: Verify findById duoc goi dung tham so")
    void testVerifyFindByIdInteraction() {
        // Given
        Product mockProduct = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
        when(productRepository.findById(1L))
            .thenReturn(Optional.of(mockProduct));
        
        // When
        productService.getProduct(1L);
        
        // Then - Verify with exact parameter
        verify(productRepository, times(1)).findById(1L);
        verifyNoMoreInteractions(productRepository);
    }
    
    @Test
    @DisplayName("TC10: Verify save duoc goi 1 lan")
    void testVerifySaveInteraction() {
        // Given
        Product savedProduct = new Product(1L, "Mouse", 200000.0, 50, "Electronics");
        when(productRepository.save(any(Product.class)))
            .thenReturn(savedProduct);
        
        // When
        ProductDto requestDto = new ProductDto(null, "Mouse", 200000.0, 50, "Electronics");
        productService.createProduct(requestDto);
        
        // Then - Verify
        verify(productRepository, times(1)).save(any(Product.class));
        verifyNoMoreInteractions(productRepository);
    }
    
    @Test
    @DisplayName("TC11: Verify deleteById duoc goi sau existsById")
    void testVerifyDeleteInteraction() {
        // Given
        when(productRepository.existsById(1L)).thenReturn(true);
        doNothing().when(productRepository).deleteById(1L);
        
        // When
        productService.deleteProduct(1L);
        
        // Then - Verify order of calls
        verify(productRepository, times(1)).existsById(1L);
        verify(productRepository, times(1)).deleteById(1L);
        verifyNoMoreInteractions(productRepository);
    }
    
    @Test
    @DisplayName("TC12: Verify repository khong duoc goi khi validation loi")
    void testVerifyRepositoryNotCalledOnValidationError() {
        // When & Then - Invalid data should throw exception before calling repository
        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(null);
        });
        
        // Verify repository was never called
        verify(productRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("TC13: Verify findAll duoc goi voi Pageable")
    void testVerifyFindAllWithPageable() {
        // Given
        Page<Product> mockPage = new PageImpl<>(Arrays.asList());
        when(productRepository.findAll(any(Pageable.class)))
            .thenReturn(mockPage);
        
        // When
        productService.getAllProducts(0, 10);
        
        // Then - Verify with Pageable argument
        verify(productRepository, times(1)).findAll(any(Pageable.class));
    }
    
    @Test
    @DisplayName("TC14: Verify repository duoc goi nhieu lan")
    void testVerifyMultipleRepositoryCalls() {
        // Given
        Product product1 = new Product(1L, "Product1", 100000.0, 10, "Cat1");
        Product product2 = new Product(2L, "Product2", 200000.0, 20, "Cat2");
        
        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
        when(productRepository.findById(2L)).thenReturn(Optional.of(product2));
        
        // When - Call multiple times
        productService.getProduct(1L);
        productService.getProduct(2L);
        productService.getProduct(1L);
        
        // Then - Verify call counts
        verify(productRepository, times(2)).findById(1L);
        verify(productRepository, times(1)).findById(2L);
    }
    
    @Test
    @DisplayName("TC15: Verify update goi ca findById va save")
    void testVerifyUpdateCallsBothMethods() {
        // Given
        Product existingProduct = new Product(1L, "Old Name", 100000.0, 10, "Cat");
        Product updatedProduct = new Product(1L, "New Name", 150000.0, 10, "Cat");
        
        when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);
        
        // When
        ProductDto updateDto = new ProductDto(1L, "New Name", 150000.0, 10, "Cat");
        productService.updateProduct(1L, updateDto);
        
        // Then - Verify both methods called
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
        verifyNoMoreInteractions(productRepository);
    }
}
