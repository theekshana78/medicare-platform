import { useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./authContextDef";
import { loginApi, registerApi, logoutApi, updateProfileApi } from "../services/auth/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("medicore_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      localStorage.setItem("medicore_token", data.token);
      localStorage.setItem("medicore_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await registerApi(userData);
      localStorage.setItem("medicore_token", data.token);
      localStorage.setItem("medicore_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const data = await updateProfileApi(profileData);
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem("medicore_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignored if network disconnects
    } finally {
      localStorage.removeItem("medicore_token");
      localStorage.removeItem("medicore_user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};