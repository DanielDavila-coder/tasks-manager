import { createContext, useState, useContext, useEffect } from "react";
import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  logoutRequest,
  updateUsernameRequest,
  updateEmailRequest,
  updatePasswordRequest,
  updateAvatarRequest,
  deleteAccountRequest,
} from "../api/auth";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider ");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const saveSession = (data) => {
    const { token, ...userData } = data;

    if (token) {
      localStorage.setItem("token", token);
    }

    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };
  const getErrorMessages = (error) => {
    const data = error.response?.data;

    if (Array.isArray(data)) return data;

    if (data?.message) return [data.message];

    return ["Something went wrong. Please try again."];
  };

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      saveSession(res.data);
    } catch (error) {
      setErrors(getErrorMessages(error));
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      saveSession(res.data);
    } catch (error) {
      setErrors(getErrorMessages(error));
    }
  };
  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Local auth state is still cleared below if the server is unavailable.
    } finally {
      clearSession();
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);
  useEffect(() => {
    async function checklogin() {
      try {
        const res = await verifyTokenRequest();
        if (!res.data) {
          clearSession();
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch {
        clearSession();
        setLoading(false);
      }
    }
    checklogin();
  }, []);
  const updateUsername = async (username) => {
    try {
      const res = await updateUsernameRequest(username);
      setUser(res.data);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        errors: getErrorMessages(error),
      };
    }
  };

  const updateEmail = async (email) => {
    try {
      const res = await updateEmailRequest(email);
      setUser(res.data);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        errors: getErrorMessages(error),
      };
    }
  };
  const updatePassword = async (password) => {
    try {
      await updatePasswordRequest(password);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        errors: getErrorMessages(error),
      };
    }
  };

  const deleteAccount = async () => {
    try {
      await deleteAccountRequest();
      clearSession();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        errors: getErrorMessages(error),
      };
    }
  };
  const updateAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await updateAvatarRequest(formData);
      setUser(res.data);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        errors: getErrorMessages(error),
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        updateUsername,
        updateEmail,
        updatePassword,
        deleteAccount,
        updateAvatar,
        loading,
        user,
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};