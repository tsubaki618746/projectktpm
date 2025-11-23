package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    private Map<String, String> userDatabase;
    
    public AuthService() {
        userDatabase = new HashMap<>();
    }
    
    // Load dữ liệu từ database vào HashMap sau khi Spring inject UserRepository
    @PostConstruct
    public void loadUsersFromDatabase() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            userDatabase.put(user.getUsername(), user.getPassword());
        }
        System.out.println("Loaded " + users.size() + " users from database into HashMap");
    }
    
    public LoginResponse authenticate(LoginRequest request) {
        // 1. Validate username
        if (!validateUsername(request.getUsername())) {
            return new LoginResponse(false, "Username phai co tu 3-50 ky tu", null);
        }
        
        // 2. Validate password
        if (!validatePassword(request.getPassword())) {
            return new LoginResponse(false, "Password phai co it nhat mot chu cai va mot so", null);
        }
        
        // 3. Kiểm tra user tồn tại trong HashMap (đã load từ database)
        String storedPassword = userDatabase.get(request.getUsername());
        if (storedPassword == null) {
            return new LoginResponse(false, "Ten dang nhap hoac mat khau khong dung", null);
        }
        
        // 4. Kiểm tra password
        if (!storedPassword.equals(request.getPassword())) {
            return new LoginResponse(false, "Ten dang nhap hoac mat khau khong dung", null);
        }
        
        // 5. Đăng nhập thành công
        String token = "token-" + System.currentTimeMillis();
        return new LoginResponse(true, "Dang nhap thanh cong", token);
    }
    
    public boolean validateUsername(String username) {
        if (username == null || username.length() < 3 || username.length() > 50) {
            return false;
        }
        // Chỉ cho phép: a-z, A-Z, 0-9, -, _
        return Pattern.matches("^[a-zA-Z0-9_-]+$", username);
    }
    
    public boolean validatePassword(String password) {
        if (password == null || password.length() < 6 || password.length() > 100) {
            return false;
        }
        
        boolean hasLetter = false;
        boolean hasDigit = false;
        
        for (char c : password.toCharArray()) {
            if (Character.isLetter(c)) {
                hasLetter = true;
            } else if (Character.isDigit(c)) {
                hasDigit = true;
            }
            
            if (hasLetter && hasDigit) {
                break;
            }
        }
        
        return hasLetter && hasDigit;
    }
    
    // Method cho test - cho phép thêm user thủ công vào HashMap
    public void addUserForTesting(String username, String password) {
        userDatabase.put(username, password);
    }
}
