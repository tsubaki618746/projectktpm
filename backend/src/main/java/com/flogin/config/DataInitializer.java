package com.flogin.config;

import com.flogin.entity.User;
import com.flogin.entity.Product;
import com.flogin.repository.UserRepository;
import com.flogin.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Tạo users
        if (!userRepository.existsByUsername("testuser")) {
            userRepository.save(new User("testuser", "Test123", "test@example.com", "Test User"));
            System.out.println("Created user: testuser");
        }
        
        if (!userRepository.existsByUsername("user123")) {
            userRepository.save(new User("user123", "Password123", "user123@example.com", "User 123"));
            System.out.println("Created user: user123");
        }
        
        // Tạo products mẫu
        long productCount = productRepository.count();
        System.out.println("Current product count: " + productCount);
        
        if (productCount == 0) {
            productRepository.save(new Product(null, "Laptop Dell XPS", 25000000.0, 10, "Electronics", "Laptop cao cấp"));
            productRepository.save(new Product(null, "iPhone 15 Pro", 30000000.0, 5, "Electronics", "Điện thoại Apple"));
            productRepository.save(new Product(null, "Bàn phím cơ", 1500000.0, 20, "Accessories", "Bàn phím gaming"));
            System.out.println("Created 3 sample products");
        } else {
            System.out.println("Products already exist, skipping initialization");
        }
    }
}
