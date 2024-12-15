import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AfterLoginPage from './components/AfterLoginPage';
import ProtectedRoute from './components/PrivateRoute';

// App.js
import React, { useState, useEffect } from 'react';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated (e.g., by checking the presence of a token in localStorage)
    const token = localStorage.getItem('jwtToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/afterlogin" element={<AfterLoginPage />} />
        {/* <ProtectedRoute
          path="/afterlogin"
          element={<AfterLoginPage />}
          isAuthenticated={isAuthenticated}
        /> */}
        {/* Add more protected routes as needed */}
        {/* Redirect to login if route not found */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
