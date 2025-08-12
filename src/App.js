import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Home from './Home';

function App() {
  const [user, setUser] = useState(null); // {username, role}

  // Persist login in localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUser(savedUser);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/home" />
          ) : (
            <Login onLogin={login} />
          )
        }
      />
      <Route
  path="/register"
  element={<Register />}
/>

      <Route
        path="/home"
        element={
          user && user.role === 'admin' ? (
            <Home user={user} onLogout={logout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
