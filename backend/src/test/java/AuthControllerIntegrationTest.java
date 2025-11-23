package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.dto.UserDto;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("Login API Integration Tests")
class AuthControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private AuthService authService;
    
    // === TEST POST /api/auth/login ENDPOINT ===
    
    @Test
    @DisplayName("TC1: POST /api/auth/login - Thanh cong")
    void testLoginSuccess() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            true, 
            "Dang nhap thanh cong", 
            "token123",
            new UserDto("testuser", "testuser@example.com")
        );
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Dang nhap thanh cong"))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.user.email").value("testuser@example.com"));
    }
    
    @Test
    @DisplayName("TC2: POST /api/auth/login - That bai voi sai thong tin")
    void testLoginFailure() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("wronguser", "WrongPass123");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Ten dang nhap hoac mat khau khong dung", 
            null
        );
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Ten dang nhap hoac mat khau khong dung"));
    }
    
    @Test
    @DisplayName("TC3: POST /api/auth/login - That bai voi du lieu khong hop le")
    void testLoginWithInvalidData() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("ab", "123");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Username phai co tu 3-50 ky tu", 
            null
        );
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
    
    // === TEST RESPONSE STRUCTURE AND STATUS CODES ===
    
    @Test
    @DisplayName("TC4: Kiem tra response structure dung format")
    void testResponseStructure() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            true, 
            "Dang nhap thanh cong", 
            "token123",
            new UserDto("testuser", "testuser@example.com")
        );
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").exists())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.username").exists())
                .andExpect(jsonPath("$.user.email").exists());
    }
    
    @Test
    @DisplayName("TC5: Kiem tra status code 200 khi thanh cong")
    void testStatusCode200() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            true, 
            "Dang nhap thanh cong", 
            "token123"
        );
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
    
    @Test
    @DisplayName("TC6: Kiem tra status code 400 khi that bai")
    void testStatusCode400() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("wronguser", "WrongPass");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Ten dang nhap hoac mat khau khong dung", 
            null
        );
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
    
    // === TEST CORS AND HEADERS ===
    
    @Test
    @DisplayName("TC7: Kiem tra CORS headers")
    void testCorsHeaders() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            true, 
            "Dang nhap thanh cong", 
            "token123"
        );
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }
    
    @Test
    @DisplayName("TC8: Kiem tra Content-Type header")
    void testContentTypeHeader() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            true, 
            "Dang nhap thanh cong", 
            "token123"
        );
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
