import { useState } from 'react';
import { validateUsername, validatePassword } from '../utils/validation';
import { loginAPI } from '../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setErrors({
        username: usernameError,
        password: passwordError
      });
      return;
    }

    // Clear errors
    setErrors({});
    setLoading(true);

    try {
      // Call API
      const response = await loginAPI(username, password);
      setMessage('Đăng nhập thành công!');
      setLoading(false);

      // Handle success (e.g., redirect, save token)
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // Redirect to dashboard/products after successful login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      setMessage(error.message || 'Đăng nhập thất bại!');
      setLoading(false);
    }
  };

  return (
    <div data-testid="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit} data-testid="login-form">
        <div>
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-testid="username-input"
            autoFocus
          />
          {errors.username && (
            <span data-testid="username-error">{errors.username}</span>
          )}
        </div>

        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
          />
          {errors.password && (
            <span data-testid="password-error">{errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          data-testid="login-button"
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>

      {message && (
        <div data-testid="login-message">{message}</div>
      )}
    </div>
  );
}
