/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {string} Error message or empty string if valid
 */
export function validateUsername(username) {
  if (!username || username.trim() === '') {
    return 'Tên đăng nhập không được để trống';
  }
  
  if (username.length < 3 || username.length > 50) {
    return 'Tên đăng nhập phải từ 3-50 ký tự';
  }
  
  const specialCharRegex = /[^a-zA-Z0-9_]/;
  if (specialCharRegex.test(username)) {
    return 'Tên đăng nhập không được chứa ký tự đặc biệt';
  }
  
  return '';
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {string} Error message or empty string if valid
 */
export function validatePassword(password) {
  if (!password || password.trim() === '') {
    return 'Mật khẩu không được để trống';
  }
  
  if (password.length < 6 || password.length > 100) {
    return 'Mật khẩu phải từ 6-100 ký tự';
  }
  
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return 'Mật khẩu phải chứa cả chữ và số';
  }
  
  return '';
}
