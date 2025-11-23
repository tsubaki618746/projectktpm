package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("Auth Controller Mock Tests")
class AuthControllerMockTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private AuthService authService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // === TEST MOCK AUTHSERVICE WITH @MockBean ===
    
    @Test
    @DisplayName("TC1: Mock AuthService voi @MockBean thanh cong")
    void testAuthServiceMocked() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(true, "Success", "mock-token");
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Success"))
                .andExpect(jsonPath("$.token").value("mock-token"));
    }
    
    // === TEST CONTROLLER WITH MOCKED SERVICE ===
    
    @Test
    @DisplayName("TC2: Test controller voi mocked service")
    void testLoginWithMockedService() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("test", "Pass123");
        LoginResponse mockResponse = new LoginResponse(
            true, 
            "Success", 
            "mock-token"
        );
        
        when(authService.authenticate(any()))
            .thenReturn(mockResponse);
        
        // When
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"test\",\"password\":\"Pass123\"}"))
                .andExpect(status().isOk());
        
        // Then - Verify mock interaction
        verify(authService, times(1)).authenticate(any());
    }
    
    // === VERIFY MOCK INTERACTIONS ===
    
    @Test
    @DisplayName("TC3: Verify mock interactions - authenticate duoc goi 1 lan")
    void testVerifyMockInteractions() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("user", "Pass123");
        LoginResponse mockResponse = new LoginResponse(true, "Success", "token");
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
        
        // Then - Verify
        verify(authService, times(1)).authenticate(any(LoginRequest.class));
        verifyNoMoreInteractions(authService);
    }
    
    @Test
    @DisplayName("TC4: Verify mock interactions - kiem tra tham so truyen vao")
    void testVerifyMockInteractionsWithArguments() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(true, "Success", "token");
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
        
        // Then - Verify with argument matcher
        verify(authService).authenticate(any(LoginRequest.class));
    }
    
    @Test
    @DisplayName("TC5: Verify mock khong duoc goi khi request loi")
    void testVerifyMockNotCalledOnError() throws Exception {
        // When - Send invalid JSON
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid-json"))
                .andExpect(status().isBadRequest());
        
        // Then - Verify service was not called
        verify(authService, never()).authenticate(any());
    }
    
    @Test
    @DisplayName("TC6: Mock tra ve response khac nhau")
    void testMockDifferentResponses() throws Exception {
        // Given - First call returns success
        LoginResponse successResponse = new LoginResponse(true, "Success", "token1");
        LoginResponse failResponse = new LoginResponse(false, "Failed", null);
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(successResponse)
            .thenReturn(failResponse);
        
        // When & Then - First call
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"user1\",\"password\":\"Pass123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
        
        // When & Then - Second call
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"user2\",\"password\":\"Pass123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
        
        // Verify called twice
        verify(authService, times(2)).authenticate(any(LoginRequest.class));
    }
    
    @Test
    @DisplayName("TC7: Verify mock voi ArgumentCaptor")
    void testVerifyWithArgumentCaptor() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("captureTest", "Pass123");
        LoginResponse mockResponse = new LoginResponse(true, "Success", "token");
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);
        
        // When
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
        
        // Then - Verify the method was called
        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }
}
