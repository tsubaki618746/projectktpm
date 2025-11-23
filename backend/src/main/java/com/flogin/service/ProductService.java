package com.flogin.service;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    // Create Product
    public ProductDto createProduct(ProductDto productDto) {
        if (productDto == null) {
            throw new IllegalArgumentException("Product data cannot be null");
        }
        
        if (productDto.getName() == null || productDto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name is required");
        }
        
        if (productDto.getPrice() == null || productDto.getPrice() <= 0) {
            throw new IllegalArgumentException("Product price must be greater than 0");
        }
        
        Product product = new Product(
            null,
            productDto.getName(),
            productDto.getPrice(),
            productDto.getQuantity(),
            productDto.getCategory(),
            productDto.getDescription()
        );
        
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }
    
    // Get Product by ID
    public ProductDto getProduct(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid product ID");
        }
        
        Optional<Product> product = productRepository.findById(id);
        return product.map(this::convertToDto).orElse(null);
    }
    
    // Update Product
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid product ID");
        }
        
        if (productDto == null) {
            throw new IllegalArgumentException("Product data cannot be null");
        }
        
        Optional<Product> existingProduct = productRepository.findById(id);
        if (existingProduct.isEmpty()) {
            return null;
        }
        
        Product product = existingProduct.get();
        if (productDto.getName() != null) {
            product.setName(productDto.getName());
        }
        if (productDto.getPrice() != null) {
            product.setPrice(productDto.getPrice());
        }
        if (productDto.getQuantity() != null) {
            product.setQuantity(productDto.getQuantity());
        }
        if (productDto.getCategory() != null) {
            product.setCategory(productDto.getCategory());
        }
        if (productDto.getDescription() != null) {
            product.setDescription(productDto.getDescription());
        }
        
        Product updatedProduct = productRepository.save(product);
        return convertToDto(updatedProduct);
    }
    
    // Delete Product
    public boolean deleteProduct(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid product ID");
        }
        
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Get All Products with Pagination
    public Page<ProductDto> getAllProducts(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }
        
        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be greater than 0");
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(this::convertToDto);
    }
    
    // Helper method to convert Entity to DTO
    private ProductDto convertToDto(Product product) {
        return new ProductDto(
            product.getId(),
            product.getName(),
            product.getPrice(),
            product.getQuantity(),
            product.getCategory(),
            product.getDescription()
        );
    }
}
