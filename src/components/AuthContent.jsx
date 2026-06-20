import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showSignupWarning, setShowSignupWarning] = useState(false);

  // login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setShowSignupWarning(false);
  };

  // logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // restore from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // only if no user, after 30 sec show signup warning
      const timer = setTimeout(() => {
        setShowSignupWarning(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, showSignupWarning }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
