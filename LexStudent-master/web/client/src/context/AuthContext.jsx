import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabaseReady, setSupabaseReady] = useState(false);

  // Initialize: restore local session + Supabase session
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('auth_token');
          delete api.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Check if Supabase session exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseReady(!!session);
    });

    // Listen for Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseReady(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign into Supabase alongside local auth (fire-and-forget, non-blocking)
  const syncSupabaseAuth = useCallback(async (email, password, name) => {
    try {
      // Try to sign in first
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });

      if (signInErr) {
        // If sign-in fails, try to sign up (first time linking)
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || '' } },
        });
        if (signUpErr) {
          console.warn('[auth] Supabase sync failed:', signUpErr.message);
        }
      }
      setSupabaseReady(true);
    } catch (e) {
      console.warn('[auth] Supabase sync error:', e.message);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      // Local auth (Express server)
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      localStorage.setItem('auth_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      // Sync with Supabase (non-blocking)
      syncSupabaseAuth(email, password, user.name);

      return user;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, [syncSupabaseAuth]);

  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      // Local auth (Express server)
      const res = await api.post('/auth/register', { name, email, password });
      const { user, token } = res.data;
      localStorage.setItem('auth_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      // Create Supabase account (non-blocking)
      syncSupabaseAuth(email, password, name);

      return user;
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  }, [syncSupabaseAuth]);

  const logout = useCallback(async () => {
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);

    // Sign out of Supabase too
    try {
      await supabase.auth.signOut();
    } catch {}
    setSupabaseReady(false);
  }, []);

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAuthenticated, supabaseReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
