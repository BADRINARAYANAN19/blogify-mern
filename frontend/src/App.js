import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreateBlogPage from './pages/CreateBlogPage';
import SingleBlogPage from './pages/SingleBlogPage';
import EditBlogPage from './pages/EditBlogPage';

// 🔒 Token irundha mattum access, illana login-kku anuppu
function PrivateRoute({ children }) {
  const token = localStorage.getItem("blogify-token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/create" element={<PrivateRoute><CreateBlogPage /></PrivateRoute>} />
        <Route path="/blog/:id" element={<PrivateRoute><SingleBlogPage /></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute><EditBlogPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;