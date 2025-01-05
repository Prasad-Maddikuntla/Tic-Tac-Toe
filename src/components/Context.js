// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider component to provide authentication state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [targetUser, setTargetUser] = useState({});
  const [heads, setHeads] = useState();
  const [opponent, setOpponent] = useState({});
  const [user, setUser] = useState({});

  const login = (token) => {
    localStorage.setItem('jwtToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, 
      targetUser, setTargetUser, opponent, setOpponent,setUser,user,setHeads,heads
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
