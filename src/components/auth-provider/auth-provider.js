import { createContext, useContext, useEffect, useState } from "react";
import {
  requestPasswordReset,
  resetPassword,
  useLoginUserMutation,
  useLogutUserMutation,
} from "../../utils/api";

export const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visitedForgotPassword, setVisitedForgotPassword] = useState(false);
  const [logoutUser] = useLogutUserMutation();
  const [loginUser] = useLoginUserMutation();
  const [authState, setAuthState] = useState({ user: null, token: null });

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password }).unwrap();

      if (!response || !response.success) {
        throw new Error("Статус ответа не определен");
      }

      const { accessToken, refreshToken, user } = response;
      if (!accessToken || !user) {
        throw new Error("Неверная структура ответа от API входа в систему");
      }

      setAuthState({ user: user, token: accessToken });
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setIsAuthenticated(true);

    } catch (error) {
      console.error("Ошибка входа:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const { success, error } = await logoutUser({
          token: refreshToken,
        }).unwrap();
        if (success) {
          setAuthState({ user: null, token: null });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
        } else {
          console.error("Произошла ошибка при выходе:", error.message);
        }
      }
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
    }
  }, []);

  const requestPasswordResetEmail = async (email) => {
    return await requestPasswordReset(email);
  };

  const resetPasswordWithToken = async (token, password) => {
    return await resetPassword(token, password);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authState,
        login,
        logout,
        requestPasswordResetEmail,
        resetPasswordWithToken,
        visitedForgotPassword,
        setVisitedForgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
