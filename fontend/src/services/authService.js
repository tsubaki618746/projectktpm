/**
 * Login API service
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise} Response with token
 */
export async function loginAPI(username, password) {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Invalid credentials');
  }

  return response.json();
}
