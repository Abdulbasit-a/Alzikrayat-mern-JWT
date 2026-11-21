// Small wrapper around localStorage for the logged-in user and their JWT
// (safe if storage is unavailable). The token is the credential; the user object is only for display.
//
// Trade-off: localStorage survives reloads but can be read by any script running on the page (XSS).
// Keeping the token only in memory is safer but logs the user out on every refresh. The spec allows both.

const USER_KEY = 'alzikrayat_user';
const TOKEN_KEY = 'alzikrayat_token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const storeToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable: session lives in React state only */
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const storeUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable: session lives in React state only */
  }
};

export const clearStoredUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
};
