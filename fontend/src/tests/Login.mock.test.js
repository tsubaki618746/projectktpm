import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { loginAPI } from '../services/authService';

// Mock external dependencies cho Login component
jest.mock('../services/authService');

// 5.1 Câu 4.1: Login - Mock Testing (5 điểm)
// 5.1.1 Frontend Mocking (2.5 điểm)
describe('Login Mock Tests', () => {

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    // a) Mock authService.loginAPI() (1 điểm)
    describe('Mock authService.loginAPI()', () => {

        test('Mock login thành công', async () => {
            // Mock API trả về thành công
            loginAPI.mockResolvedValue({
                token: 'mock-token-123',
                user: { username: 'testuser' }
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
                expect(loginAPI).toHaveBeenCalledWith('testuser', 'Test123');
            });
        });
    });

    // b) Test với mocked successful/failed responses (1 điểm)
    describe('Test với mocked successful/failed responses', () => {

        test('Mock login thành công', async () => {
            loginAPI.mockResolvedValue({
                token: 'mock-token-123',
                user: { username: 'testuser' }
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

                expect(loginAPI).toHaveBeenCalledWith('testuser', 'Test123');
                expect(screen.getByText('Đăng nhập thành công!')).toBeInTheDocument();
            });
        });

        test('Mock login thất bại', async () => {
            loginAPI.mockRejectedValue(
                new Error('Invalid credentials')
            );

            render(<Login />);

            fireEvent.change(screen.getByTestId('username-input'), {
                target: { value: 'testuser' }
            });
            fireEvent.change(screen.getByTestId('password-input'), {
                target: { value: 'Wrong123' } // Phải có cả chữ và số để pass validation
            });

            fireEvent.click(screen.getByTestId('login-button'));

            await waitFor(() => {
                // Verify API được gọi với đúng tham số
                expect(loginAPI).toHaveBeenCalledWith('testuser', 'Wrong123');

                // Verify message lỗi hiển thị
                expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            });
        });
    });

    // c) Verify mock calls (0.5 điểm)
    describe('Verify mock calls', () => {

        test('Verify số lần gọi API', async () => {
            loginAPI.mockResolvedValue({
                token: 'mock-token-123',
                user: { username: 'testuser' }
            });

            render(<Login />);

            fireEvent.change(screen.getByTestId('username-input'), {
                target: { value: 'testuser' }
            });
            fireEvent.change(screen.getByTestId('password-input'), {
                target: { value: 'Test123' }
            });

            // Click login button
            fireEvent.click(screen.getByTestId('login-button'));

            await waitFor(() => {
                // Verify API được gọi đúng 1 lần
                expect(loginAPI).toHaveBeenCalledTimes(1);

                // Verify API được gọi với đúng tham số
                expect(loginAPI).toHaveBeenCalledWith('testuser', 'Test123');
            });
        });

        test('Verify không gọi API khi validation fail', async () => {
            render(<Login />);

            // Nhập username không hợp lệ
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

            // Verify API không được gọi
            expect(loginAPI).not.toHaveBeenCalled();
        });
    });

});
