import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

// Authentication Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Blog Pages
import DashboardPage from './pages/DashboardPage';
import CreateBlogPage from './pages/CreateBlogPage';
import SingleBlogPage from './pages/SingleBlogPage';
import EditBlogPage from './pages/EditBlogPage';

// 🔒 Protected Route Wrapper: Checks for token in localStorage
function PrivateRoute({ children }) {
  const token = localStorage.getItem("blogify-token");
  // If no token, redirect to login page
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes: Only accessible if logged in */}
        <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/create" element={<PrivateRoute><CreateBlogPage /></PrivateRoute>} />
        <Route path="/blog/:id" element={<PrivateRoute><SingleBlogPage /></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute><EditBlogPage /></PrivateRoute>} />

        {/* Catch-all: Redirects to home/login if path doesn't exist */}
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;