import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { loginAPI } from '../services/authService';

// Mock API service
jest.mock('../services/authService');

// 4.1.1 Frontend Component Integration Tests (5 điểm)
describe('Login Component Integration Tests', () => {
  
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  // a) Test rendering và user interactions (2 điểm)
  describe('Rendering và User Interactions', () => {
    
    test('TC1: Render Login component với tất cả elements', () => {
      render(<Login />);
      
      expect(screen.getByTestId('login-container')).toBeInTheDocument();
      expect(screen.getByTestId('username-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });
    
    test('TC2: User có thể nhập username và password', () => {
      render(<Login />);
      
      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      
      expect(usernameInput.value).toBe('testuser');
      expect(passwordInput.value).toBe('Test123');
    });
    
    test('TC3: Hiển thị lỗi khi submit form rỗng', async () => {
      render(<Login />);
      
      const submitButton = screen.getByTestId('login-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toBeInTheDocument();
        expect(screen.getByTestId('username-error')).toHaveTextContent(
          'Tên đăng nhập không được để trống'
        );
      });
    });
    
    test('TC4: Hiển thị lỗi validation cho username không hợp lệ', async () => {
      render(<Login />);
      
      fireEvent.change(screen.getByTestId('username-input'), { 
        target: { value: 'ab' } 
      });
      fireEvent.change(screen.getByTestId('password-input'), { 
        target: { value: 'Test123' } 
      });
      fireEvent.click(screen.getByTestId('login-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toHaveTextContent(
          'Tên đăng nhập phải từ 3-50 ký tự'
        );
      });
    });
  });

  // b) Test form submission và API calls (2 điểm)
  describe('Form Submission và API Calls', () => {
    
    test('TC1: Gọi API khi submit form hợp lệ', async () => {
      loginAPI.mockResolvedValue({ 
        token: 'fake-token-123',
        user: { id: 1, username: 'testuser' }
      });
      
      render(<Login />);
      
      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(loginAPI).toHaveBeenCalledWith('testuser', 'Test123');
        expect(loginAPI).toHaveBeenCalledTimes(1);
      });
    });
    
    test('TC2: Hiển thị loading state khi đang gọi API', async () => {
      loginAPI.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ token: 'fake-token' }), 100))
      );
      
      render(<Login />);
      
      fireEvent.change(screen.getByTestId('username-input'), { 
        target: { value: 'testuser' } 
      });
      fireEvent.change(screen.getByTestId('password-input'), { 
        target: { value: 'Test123' } 
      });
      fireEvent.click(screen.getByTestId('login-button'));
      
      expect(screen.getByTestId('login-button')).toHaveTextContent('Đang xử lý...');
      expect(screen.getByTestId('login-button')).toBeDisabled();
    });
    
    test('TC3: Lưu token vào localStorage khi login thành công', async () => {
      loginAPI.mockResolvedValue({ 
        token: 'fake-token-123',
        user: { id: 1, username: 'testuser' }
      });
      
      render(<Login />);
      
      fireEvent.change(screen.getByTestId('username-input'), { 
        target: { value: 'testuser' } 
      });
      fireEvent.change(screen.getByTestId('password-input'), { 
        target: { value: 'Test123' } 
      });
      fireEvent.click(screen.getByTestId('login-button'));
      
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('fake-token-123');
      });
    });
  });

  // c) Test error handling và success messages (1 điểm)
  describe('Error Handling và Success Messages', () => {
    
    test('TC1: Hiển thị thông báo thành công khi login thành công', async () => {
      loginAPI.mockResolvedValue({ 
        token: 'fake-token-123',
        user: { id: 1, username: 'testuser' }
      });
      
      render(<Login />);
      
      fireEvent.change(screen.getByTestId('username-input'), { 
        target: { value: 'testuser' } 
      });
      fireEvent.change(screen.getByTestId('password-input'), { 
        target: { value: 'Test123' } 
      });
      fireEvent.click(screen.getByTestId('login-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveTextContent(
          'Đăng nhập thành công!'
        );
      });
    });
    
    test('TC2: Hiển thị thông báo lỗi khi API trả về lỗi', async () => {
      loginAPI.mockRejectedValue(new Error('Tên đăng nhập hoặc mật khẩu không đúng'));
      
      render(<Login />);
      
      fireEvent.change(screen.getByTestId('username-input'), { 
        target: { value: 'testuser' } 
      });
      fireEvent.change(screen.getByTestId('password-input'), { 
        target: { value: 'WrongPass123' } 
      });
      fireEvent.click(screen.getByTestId('login-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveTextContent(
          'Tên đăng nhập hoặc mật khẩu không đúng'
        );
      });
    });
    
    test('TC3: Hiển thị thông báo lỗi mặc định khi API lỗi không rõ', async () => {
      loginAPI.mockRejectedValue(new Error());
      
      render(<Login />);
      
      fireEvent.change(screen.getByTestId('username-input'), { 
        target: { value: 'testuser' } 
      });
      fireEvent.change(screen.getByTestId('password-input'), { 
        target: { value: 'Test123' } 
      });
      fireEvent.click(screen.getByTestId('login-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveTextContent(
          'Đăng nhập thất bại!'
        );
      });
    });
    
    test('TC4: Không gọi API khi form có lỗi validation', async () => {
      render(<Login />);
      
      fireEvent.change(screen.getByTestId('username-input'), { 
        target: { value: 'ab' } // Quá ngắn
      });
      fireEvent.change(screen.getByTestId('password-input'), { 
        target: { value: 'Test123' } 
      });
      fireEvent.click(screen.getByTestId('login-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toBeInTheDocument();
      });
      
      expect(loginAPI).not.toHaveBeenCalled();
    });
  });
  
});
