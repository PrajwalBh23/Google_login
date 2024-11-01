import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Make sure to install this package

const AuthContext = createContext();

export const API = "https://google-login-lapn.onrender.com";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token here
        setUser({ token, ...decodedToken });
      } catch (error) {
        console.error("Invalid token", error);
        logout();
      }
    }
  }, []);

  const register = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token); // Decode the token here
    setUser({ token, ...decodedToken });
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token); // Decode the token here
    setUser({ token, ...decodedToken });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const loginOrNot = () => {
    return user;
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loginOrNot }}>
      {children}
    </AuthContext.Provider>
  );
};
