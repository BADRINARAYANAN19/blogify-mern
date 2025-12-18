import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

// REMOVED: import Navbar from './components/Navbar'; 

// Authentication Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Blog Pages
import DashboardPage from './pages/DashboardPage';
import CreateBlogPage from './pages/CreateBlogPage';
import SingleBlogPage from './pages/SingleBlogPage';
import EditBlogPage from './pages/EditBlogPage';

// 🔒 Protected Route Wrapper (No changes needed here)
function PrivateRoute({ children }) {
  const token = localStorage.getItem("blogify-token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      {/* 🛑 REMOVED: <Navbar /> */}

      <Routes>

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/create" element={<PrivateRoute><CreateBlogPage /></PrivateRoute>} />
        <Route path="/blog/:id" element={<PrivateRoute><SingleBlogPage /></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute><EditBlogPage /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;