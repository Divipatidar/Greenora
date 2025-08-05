import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    token: null,
    user: null,
    isLoading: true, // Added isLoading state, initialized to true
  });

  // Restore auth from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        setAuth({ isLoggedIn: true, token, user: JSON.parse(user), isLoading: false });
      } else {
        setAuth({ isLoggedIn: false, token: null, user: null, isLoading: false });
      }
    };

    initializeAuth();
  }, []); // Run only once on component mount

  // Save auth to localStorage on login
  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ isLoggedIn: true, token, user, isLoading: false }); // Ensure isLoading is false on login
  };

  // Clear auth from localStorage on logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ isLoggedIn: false, token: null, user: null, isLoading: false }); // Ensure isLoading is false on logout
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
