// Auth state shared by the whole app (React Context API)
// Session = JWT in localStorage (sent by the Axios interceptor) + the user profile for display

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_EXPIRED_EVENT, authAPI } from '../utils/api';
import { clearStoredUser, clearToken, getStoredUser, getToken, storeToken, storeUser } from '../utils/storage';

const AuthContext = createContext(null);

// A stored user without a token is an old (pre-JWT) session: treat it as logged out
const hasSession = () => Boolean(getStoredUser() && getToken());

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (hasSession() ? getStoredUser() : null));
  // While a stored session is being re-checked with the server, protected pages wait
  const [checking, setChecking] = useState(hasSession);

  // Logout = forget the token (nothing to invalidate on the server: JWTs are stateless)
  const logout = useCallback(() => {
    clearToken();
    clearStoredUser();
    setUser(null);
  }, []);

  // The Axios interceptor fires this when the server answers 401 (expired / invalid token)
  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, logout);
  }, [logout]);

  // On first load, make sure the stored token is still accepted by the server
  useEffect(() => {
    if (!hasSession()) {
      clearToken();
      clearStoredUser();
      return;
    }
    authAPI
      .me()
      .then((res) => {
        // /auth/me does not carry the previous-login time, so keep the one from the login response
        const refreshed = { ...res.data.user, lastLogin: getStoredUser()?.lastLogin };
        storeUser(refreshed);
        setUser(refreshed);
      })
      .catch((err) => {
        if (err.response?.status === 401) logout(); // stale session
      })
      .finally(() => setChecking(false));
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    storeToken(res.data.token);
    storeUser(res.data.user);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback((data) => authAPI.register(data), []);

  const value = useMemo(
    () => ({ user, checking, login, register, logout }),
    [user, checking, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
