import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth status on mount
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (authStatus && userData) {
      setIsAuthenticated(true);
      setUser(userData);
    }
  }, []);

  const login = async (userData) => {
    return new Promise((resolve) => {
      // Update state and localStorage
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      resolve();
    });
  };

  const logout = () => {
    // Clear state and localStorage
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};