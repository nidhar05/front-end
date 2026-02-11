// src/auth/AuthUtils.jsx

// Save token
export function setToken(token) {
  localStorage.setItem("token", token);
}

// Get token
export function getToken() {
  return localStorage.getItem("token");
}

// Check login status
export function isLoggedIn() {
  return !!getToken();
}

// Decode user from JWT
export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

// Logout
export function logout() {
  localStorage.removeItem("token");
}
