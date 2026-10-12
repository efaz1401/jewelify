import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, apiError } from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('jewelify_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      localStorage.removeItem('jewelify_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('jewelify_token', data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: apiError(err) };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('jewelify_token', data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: apiError(err) };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    localStorage.removeItem('jewelify_token');
    setUser(null);
  };

  const updateProfile = async (payload) => {
    try {
      const { data } = await api.put('/auth/me', payload);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: apiError(err) };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refresh: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
