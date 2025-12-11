package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import com.flogin.service.AuthService;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("Login Service Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
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
     // === BOUNDARY TESTS - Bổ sung để đạt 100% coverage ===
    
    @Test
    @DisplayName("TC14: Test validateUsername voi username = 50 ky tu (MAX boundary)")
    void testValidateUsername_MaxLength() {
        // Given
        String maxUsername = "a".repeat(50);
        
        // When
        boolean result = authService.validateUsername(maxUsername);
        
        // Then
        assertTrue(result, "Username 50 ký tự phải hợp lệ");
    }

    @Test
    @DisplayName("TC15: Test validateUsername voi username > 50 ky tu (Above MAX)")
    void testValidateUsername_AboveMaxLength() {
        // Given
        String tooLongUsername = "a".repeat(51);
        
        // When
        boolean result = authService.validateUsername(tooLongUsername);
        
        // Then
        assertFalse(result, "Username > 50 ký tự phải không hợp lệ");
    }

    @Test
    @DisplayName("TC16: Test validatePassword voi password = 100 ky tu (MAX boundary)")
    void testValidatePassword_MaxLength() {
        // Given - Password 100 ký tự có cả chữ và số
        String maxPassword = "a1" + "b".repeat(98);
        
        // When
        boolean result = authService.validatePassword(maxPassword);
        
        // Then
        assertTrue(result, "Password 100 ký tự phải hợp lệ");
    }

    @Test
    @DisplayName("TC17: Test validatePassword voi password > 100 ky tu (Above MAX)")
    void testValidatePassword_AboveMaxLength() {
        // Given - Password 101 ký tự
        String tooLongPassword = "a1" + "b".repeat(99);
        
        // When
        boolean result = authService.validatePassword(tooLongPassword);
        
        // Then
        assertFalse(result, "Password > 100 ký tự phải không hợp lệ");
    }

    @Test
    @DisplayName("TC18: Test validatePassword voi password co ky tu dac biet")
    void testValidatePassword_WithSpecialCharacters() {
        // Given - Password có ký tự đặc biệt, chữ và số
        String passwordWithSpecialChars = "P@ssw0rd!#$";
        
        // When
        boolean result = authService.validatePassword(passwordWithSpecialChars);
        
        // Then
        assertTrue(result, "Password có ký tự đặc biệt nhưng đủ chữ và số phải hợp lệ");
    }

    @Test
    @DisplayName("TC19: Test validateUsername voi username null")
    void testValidateUsername_Null() {
        // Given
String nullUsername = null;
        
        // When
        boolean result = authService.validateUsername(nullUsername);
        
        // Then
        assertFalse(result, "Username null phải không hợp lệ");
    }

    @Test
    @DisplayName("TC20: Test validatePassword voi password null")
    void testValidatePassword_Null() {
        // Given
        String nullPassword = null;
        
        // When
        boolean result = authService.validatePassword(nullPassword);
        
        // Then
        assertFalse(result, "Password null phải không hợp lệ");
    }

    @Test
    @DisplayName("TC21: Test authenticate voi username null")
    void testAuthenticate_NullUsername() {
        // Given
        LoginRequest request = new LoginRequest(null, "Test123");
        
        // When
        LoginResponse response = authService.authenticate(request);
        
        // Then
        assertFalse(response.isSuccess());
        assertEquals("Username phai co tu 3-50 ky tu", response.getMessage());
    }

    @Test
    @DisplayName("TC22: Test authenticate voi password null")
    void testAuthenticate_NullPassword() {
        // Given
        LoginRequest request = new LoginRequest("testuser", null);
        
        // When
        LoginResponse response = authService.authenticate(request);
        
        // Then
        assertFalse(response.isSuccess());
        assertEquals("Password phai co it nhat mot chu cai va mot so", response.getMessage());
    }

    @Test
    @DisplayName("TC23: Test authenticate voi password qua dai")
    void testAuthenticate_PasswordTooLong() {
        // Given
        String tooLongPassword = "a1" + "b".repeat(99); // 101 ký tự
        LoginRequest request = new LoginRequest("testuser", tooLongPassword);
        
        // When
        LoginResponse response = authService.authenticate(request);
        
        // Then
        assertFalse(response.isSuccess());
        assertEquals("Password phai co it nhat mot chu cai va mot so", response.getMessage());
    }

    // === TEST LOADUSERSFROMDATABASE() METHOD - 
    
    @Test
    @DisplayName("TC24: Test loadUsersFromDatabase - Load users thanh cong")
    void testLoadUsersFromDatabase_Success() {
        // Given - Mock UserRepository trả về danh sách users
        User user1 = new User("dbuser1", "DbPass123");
        User user2 = new User("dbuser2", "DbPass456");
        List<User> mockUsers = Arrays.asList(user1, user2);
        
        when(userRepository.findAll()).thenReturn(mockUsers);
        
        // When - Gọi method loadUsersFromDatabase
        authService.loadUsersFromDatabase();
        
        // Then - Verify rằng userRepository.findAll() được gọi
        verify(userRepository, times(1)).findAll();
        
        // Test login với user từ database
        LoginRequest request = new LoginRequest("dbuser1", "DbPass123");
        LoginResponse response = authService.authenticate(request);
assertTrue(response.isSuccess(), "Nên login thành công với user từ database");
        assertEquals("Dang nhap thanh cong", response.getMessage());
    }

    @Test
    @DisplayName("TC25: Test loadUsersFromDatabase - Load empty list")
    void testLoadUsersFromDatabase_EmptyList() {
        // Given - Mock UserRepository trả về danh sách rỗng
        List<User> emptyList = Arrays.asList();
        
        when(userRepository.findAll()).thenReturn(emptyList);
        
        // When - Gọi method loadUsersFromDatabase
        authService.loadUsersFromDatabase();
        
        // Then - Verify rằng userRepository.findAll() được gọi
        verify(userRepository, times(1)).findAll();
        
        // Không có user nào được load
        LoginRequest request = new LoginRequest("anyuser", "AnyPass123");
        LoginResponse response = authService.authenticate(request);
        
        // Chỉ có thể login với users đã add manually trong setup
        assertFalse(response.isSuccess());
    }

    @Test
    @DisplayName("TC26: Test loadUsersFromDatabase - Load multiple users")
    void testLoadUsersFromDatabase_MultipleUsers() {
        // Given - Mock UserRepository trả về nhiều users
        User user1 = new User("admin", "Admin123");
        User user2 = new User("manager", "Manager456");
        User user3 = new User("employee", "Employee789");
        List<User> mockUsers = Arrays.asList(user1, user2, user3);
        
        when(userRepository.findAll()).thenReturn(mockUsers);
        
        // When
        authService.loadUsersFromDatabase();
        
        // Then - Verify
        verify(userRepository, times(1)).findAll();
        
        // Test login với tất cả users từ database
        LoginRequest request1 = new LoginRequest("admin", "Admin123");
        assertTrue(authService.authenticate(request1).isSuccess());
        
        LoginRequest request2 = new LoginRequest("manager", "Manager456");
        assertTrue(authService.authenticate(request2).isSuccess());
        
        LoginRequest request3 = new LoginRequest("employee", "Employee789");
        assertTrue(authService.authenticate(request3).isSuccess());
    }
}