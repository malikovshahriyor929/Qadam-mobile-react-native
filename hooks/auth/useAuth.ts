import axios from "axios";
import { useCallback, useEffect, useState } from "react";

// Example API endpoints
const LOGIN_URL = "/api/auth/login";
const LOGOUT_URL = "/api/auth/logout";
const PROFILE_URL = "/api/auth/profile";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(PROFILE_URL, { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        LOGIN_URL,
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await axios.post(LOGOUT_URL, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      // handle error if needed
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
  };
}
