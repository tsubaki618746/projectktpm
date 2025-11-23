package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@DisplayName("Product API Integration Tests")
class ProductControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private ProductService productService;
    
    // === TEST POST /api/products (Create) ===
    
    @Test
    @DisplayName("TC1: POST /api/products - Tao san pham moi thanh cong")
    void testCreateProduct() throws Exception {
        // Given
        ProductDto requestDto = new ProductDto(null, "Laptop", 15000000.0, 10, "Electronics");
        ProductDto responseDto = new ProductDto(1L, "Laptop", 15000000.0, 10, "Electronics");
        
        when(productService.createProduct(any(ProductDto.class)))
            .thenReturn(responseDto);
        
        // When & Then
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop"))
                .andExpect(jsonPath("$.price").value(15000000.0));
    }
    
    @Test
    @DisplayName("TC2: POST /api/products - That bai voi du lieu khong hop le")
    void testCreateProduct_InvalidData() throws Exception {
        // Given
        ProductDto requestDto = new ProductDto(null, "", -100.0, 10, "Electronics");
        
        when(productService.createProduct(any(ProductDto.class)))
            .thenThrow(new IllegalArgumentException("Invalid data"));
        
        // When & Then
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isBadRequest());
    }
    
    // === TEST GET /api/products (Read all) ===
    
    @Test
    @DisplayName("TC3: GET /api/products - Lay danh sach san pham")
    void testGetAllProducts() throws Exception {
        // Given
        List<ProductDto> products = Arrays.asList(
            new ProductDto(1L, "Laptop", 15000000.0, 10, "Electronics"),
            new ProductDto(2L, "Mouse", 200000.0, 50, "Electronics")
        );
        Page<ProductDto> productPage = new PageImpl<>(products);
        
        when(productService.getAllProducts(anyInt(), anyInt()))
            .thenReturn(productPage);
        
        // When & Then - API trả về Array trực tiếp khi không có pagination params
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("Laptop"))
                .andExpect(jsonPath("$[1].name").value("Mouse"));
    }
    
    @Test
    @DisplayName("TC4: GET /api/products - Lay danh sach voi pagination")
    void testGetAllProducts_WithPagination() throws Exception {
        // Given
        List<ProductDto> products = Arrays.asList(
            new ProductDto(1L, "Laptop", 15000000.0, 10, "Electronics")
        );
        Page<ProductDto> productPage = new PageImpl<>(products);
        
        when(productService.getAllProducts(0, 5))
            .thenReturn(productPage);
        
        // When & Then
        mockMvc.perform(get("/api/products")
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }
    
    // === TEST GET /api/products/{id} (Read one) ===
    
    @Test
    @DisplayName("TC5: GET /api/products/{id} - Lay san pham theo ID")
    void testGetProduct() throws Exception {
        // Given
        ProductDto product = new ProductDto(1L, "Laptop", 15000000.0, 10, "Electronics");
        
        when(productService.getProduct(1L))
            .thenReturn(product);
        
        // When & Then
        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop"))
                .andExpect(jsonPath("$.price").value(15000000.0));
    }
    
    @Test
    @DisplayName("TC6: GET /api/products/{id} - San pham khong ton tai")
    void testGetProduct_NotFound() throws Exception {
        // Given
        when(productService.getProduct(999L))
            .thenReturn(null);
        
        // When & Then
        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound());
    }
    
    // === TEST PUT /api/products/{id} (Update) ===
    
    @Test
    @DisplayName("TC7: PUT /api/products/{id} - Cap nhat san pham thanh cong")
    void testUpdateProduct() throws Exception {
        // Given
        ProductDto requestDto = new ProductDto(1L, "Laptop Pro", 20000000.0, 5, "Electronics");
        ProductDto responseDto = new ProductDto(1L, "Laptop Pro", 20000000.0, 5, "Electronics");
        
        when(productService.updateProduct(eq(1L), any(ProductDto.class)))
            .thenReturn(responseDto);
        
        // When & Then
        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Laptop Pro"))
                .andExpect(jsonPath("$.price").value(20000000.0));
    }
    
    @Test
    @DisplayName("TC8: PUT /api/products/{id} - Cap nhat san pham khong ton tai")
    void testUpdateProduct_NotFound() throws Exception {
        // Given
        ProductDto requestDto = new ProductDto(999L, "Laptop", 15000000.0, 10, "Electronics");
        
        when(productService.updateProduct(eq(999L), any(ProductDto.class)))
            .thenReturn(null);
        
        // When & Then
        mockMvc.perform(put("/api/products/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isNotFound());
    }
    
    // === TEST DELETE /api/products/{id} (Delete) ===
    
    @Test
    @DisplayName("TC9: DELETE /api/products/{id} - Xoa san pham thanh cong")
    void testDeleteProduct() throws Exception {
        // Given
        when(productService.deleteProduct(1L))
            .thenReturn(true);
        
        // When & Then
        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());
    }
    
    @Test
    @DisplayName("TC10: DELETE /api/products/{id} - Xoa san pham khong ton tai")
    void testDeleteProduct_NotFound() throws Exception {
        // Given
        when(productService.deleteProduct(999L))
            .thenReturn(false);
        
        // When & Then
        mockMvc.perform(delete("/api/products/999"))
                .andExpect(status().isNotFound());
    }
    
    // === TEST ADDITIONAL SCENARIOS ===
    
    @Test
    @DisplayName("TC11: POST /api/products - Kiem tra response status 201")
    void testCreateProduct_Status201() throws Exception {
        // Given
        ProductDto requestDto = new ProductDto(null, "Mouse", 200000.0, 50, "Electronics");
        ProductDto responseDto = new ProductDto(2L, "Mouse", 200000.0, 50, "Electronics");
        
        when(productService.createProduct(any(ProductDto.class)))
            .thenReturn(responseDto);
        
        // When & Then
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated());
    }
    
    @Test
    @DisplayName("TC12: GET /api/products - Kiem tra CORS headers")
    void testGetAllProducts_CorsHeaders() throws Exception {
        // Given
        List<ProductDto> products = Arrays.asList(
            new ProductDto(1L, "Laptop", 15000000.0, 10, "Electronics")
        );
        Page<ProductDto> productPage = new PageImpl<>(products);
        
        when(productService.getAllProducts(anyInt(), anyInt()))
            .thenReturn(productPage);
        
        // When & Then
        mockMvc.perform(get("/api/products")
                .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }
}
