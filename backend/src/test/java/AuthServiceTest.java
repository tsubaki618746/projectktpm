package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Login Service Unit Tests")
class AuthServiceTest {

    private AuthService authService;

    @BeforeEach
    void setup() {
        authService = new AuthService();
        // Thêm users thủ công cho test
        authService.addUserForTesting("testuser", "Test123");
        authService.addUserForTesting("user123", "Password123");
    }

    // === TEST AUTHENTICATE() METHOD ===
    
    @Test
    @DisplayName("TC1: Login thanh cong voi credentials hop le")
    void testLoginSuccess() {
        // Given
        LoginRequest request = new LoginRequest("testuser", "Test123");
        
        // When
        LoginResponse response = authService.authenticate(request);
        
        // Then
        //Kiểm tra trạng thái đăng nhập -> Thành công
        assertTrue(response.isSuccess());
        //Kiểm tra thông báo trả về -> Đăng nhập thành công
        assertEquals("Dang nhap thanh cong", response.getMessage());
        //Kiểm tra token trả về -> không null
        assertNotNull(response.getToken());
    }

    @Test
    @DisplayName("TC2: Login that bai voi username khong ton tai")
    void testLoginWithNonExistentUsername() {
        // Given
        LoginRequest request = new LoginRequest("wronguser", "Pass123");
        
        // When
        LoginResponse response = authService.authenticate(request);
        
        // Then
        //Kiểm tra trạng thái đăng nhập -> Thất bại
        assertFalse(response.isSuccess());
        //Kiểm tra thông báo trả về -> Tên đăng nhập hoặc mật khẩu không đúng
        assertEquals("Ten dang nhap hoac mat khau khong dung", response.getMessage());
    }

    @Test
    @DisplayName("TC3: Login that bai voi password sai")
    void testLoginWithWrongPassword() {
        // Given
        LoginRequest request = new LoginRequest("testuser", "WrongPass123");
        
        // When
        LoginResponse response = authService.authenticate(request);
        
        // Then
        assertFalse(response.isSuccess());
        assertEquals("Ten dang nhap hoac mat khau khong dung", response.getMessage());
    }

    @Test
    @DisplayName("TC4: Login that bai voi username qua ngan")
    void testLoginWithShortUsername() {
        // Given
        LoginRequest request = new LoginRequest("ab", "Test123");
        
        // When
        LoginResponse response = authService.authenticate(request);
        
        // Then
        assertFalse(response.isSuccess());
        //Kiểm tra thông báo trả về -> Username phải có từ 3-50 ký tự
        assertTrue(response.getMessage().contains("Username phai co tu 3-50 ky tu"));
    }

    @Test
    @DisplayName("TC5: Login that bai voi username qua dai")
    void testLoginWithLongUsername() {
        // Given
        String longUsername = "a".repeat(51);
        LoginRequest request = new LoginRequest(longUsername, "Test123");
        
        // When
        LoginResponse response = authService.authenticate(request);
        
        // Then
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Username phai co tu 3-50 ky tu"));
    }

    @Test
    @DisplayName("TC6: Login that bai voi password qua ngan")
    void testLoginWithShortPassword() {
        // Given
        LoginRequest request = new LoginRequest("testuser", "Abc12");
        
        // When
        LoginResponse response = authService.authenticate(request);
        
        // Then
        assertFalse(response.isSuccess());
    }

    @Test
    @DisplayName("TC7: Login that bai voi password khong co so")
    void testLoginWithPasswordNoNumber() {
        // Given
        LoginRequest request = new LoginRequest("testuser", "Password");
        
        // When
        LoginResponse response = authService.authenticate(request);
        
        // Then
        assertFalse(response.isSuccess());
        //Kiểm tra thông báo trả về -> Password phải có ít nhất một chữ cái và một số
        assertTrue(response.getMessage().contains("Password phai co it nhat mot chu cai va mot so"));
    }

    @Test
    @DisplayName("TC8: Login that bai voi password khong co chu")
    void testLoginWithPasswordNoLetter() {
        // Given
        LoginRequest request = new LoginRequest("testuser", "123456");
        
        // When
        LoginResponse response = authService.authenticate(request);
        
        // Then
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Password phai co it nhat mot chu cai va mot so"));
    }

    // === TEST VALIDATION METHODS RIÊNG LẺ ===
    
    @Test
    @DisplayName("TC9: Test validateUsername voi username hop le")
    void testValidateUsername_Valid() {
        // Given
        String validUsername = "user_123";
        
        // When
        boolean result = authService.validateUsername(validUsername);
        
        // Then
        //Kiểm tra kết quả validate -> True
        assertTrue(result);
    }

    @Test
    @DisplayName("TC10: Test validateUsername voi username chua ky tu dac biet")
    void testValidateUsername_Invalid() {
        // Given
        String invalidUsername = "user@123";
        
        // When
        boolean result = authService.validateUsername(invalidUsername);
        
        // Then
        //Kiểm tra kết quả validate -> False
        assertFalse(result);
    }

    @Test
    @DisplayName("TC11: Test validatePassword voi password hop le")
    void testValidatePassword_Valid() {
        // Given
        String validPassword = "Pass123";
        
        // When
        boolean result = authService.validatePassword(validPassword);
        
        // Then
        assertTrue(result);
    }

    @Test
    @DisplayName("TC12: Test validatePassword voi password chi co chu")
    void testValidatePassword_OnlyLetters() {
        // Given
        String invalidPassword = "Password";
        
        // When
        boolean result = authService.validatePassword(invalidPassword);
        
        // Then
        assertFalse(result);
    }

    @Test
    @DisplayName("TC13: Test validatePassword voi password chi co so")
    void testValidatePassword_OnlyNumbers() {
        // Given
        String invalidPassword = "123456";
        
        // When
        boolean result = authService.validatePassword(invalidPassword);
        
        // Then
        assertFalse(result);
    }
}