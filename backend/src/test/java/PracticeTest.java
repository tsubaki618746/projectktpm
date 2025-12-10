package com.flogin.service;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Login service Unit test")
class PracticeTest {
    private AuthService authService;
    
    @BeforeEach
    void setup(){
        authService = new AuthService();
        //Them user thu cong
        authService.addUserForTesting("testuser", "test123");
        authService.addUserForTesting("user123", "user123");
    }
    
    @Test
    @DisplayName("Test dang nhap thanh cong")
    void testLoginSuccess(){
        //Given
        LoginRequest lrq = new LoginRequest("testuser", "test123");
        
        //When
        LoginResponse lrp = authService.authenticate(lrq);
        
        //Then
        //Kiem tra trang thai dang nhap
        assertTrue(lrp.isSuccess());
        //Kiem tra thong bao tra ve
        assertEquals("Dang nhap thanh cong",lrp.getMessage());
        //Kiem tra token tra ve khi dang nhap thanh cong
        assertNotNull(lrp.getToken());
    }
   
   @Test
   @DisplayName("Test dang nhap that bai")
   void testLoginFail(){
       //Given
       LoginRequest request = new LoginRequest("testuser", null);
       //When
       LoginResponse response = authService.authenticate(request);
       //Then
       assertFalse(response.isSuccess());
       assertEquals("Password phai co it nhat mot chu cai va mot so",response.getMessage());
   }
   
}
