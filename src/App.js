import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AfterLoginPage from './components/AfterLoginPage';
import TicTacToe from './components/tic-tac-toe';
import { AuthProvider } from './components/Context';
// import NotificationPopover from './components/NotificationBar';

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/afterlogin" element={<AfterLoginPage />} />
          <Route path="/TicTacToe" element={<TicTacToe />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
