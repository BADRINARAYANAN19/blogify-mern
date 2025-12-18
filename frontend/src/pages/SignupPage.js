import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Note: We don't need './LoginPage.css' if we use the inline style method below.
// If you have common styles, keep it, but the theme is handled inline here.

const BACKEND_URL = 'http://localhost:5000/api/auth';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Applied the same body background effect as LoginPage
  useEffect(() => {
    document.body.style.backgroundColor = '#f0f2f5';
    document.body.style.margin = '0';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/signup`,
        {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        },
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.token) {
        localStorage.setItem('blogify-token', response.data.token);
      }

      alert('Signup successful! Welcome to Blogify.');
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      let errorMessage = 'Signup failed. Please try again.';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Server may be slow.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Email already exists. Please use a different email.';
      } else if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
       {/* --- INLINE LIGHT NEON CSS (Same as LoginPage) --- */}
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        
        .light-neon-card {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 210, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 210, 255, 0.15), 
                      0 0 15px rgba(0, 210, 255, 0.1);
          border-radius: 20px !important;
          font-family: 'Poppins', sans-serif !important;
        }

        .neon-text-gradient {
          background: linear-gradient(45deg, #00d2ff, #9d50bb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800 !important;
          letter-spacing: 1px;
          filter: drop-shadow(0 0 2px rgba(0, 210, 255, 0.3));
        }

        .light-input .MuiOutlinedInput-root {
          border-radius: 12px !important;
          background: #fff;
          transition: 0.3s;
        }

        .light-input .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
          border-color: #00d2ff !important;
        }

        .light-input .Mui-focused .MuiOutlinedInput-notchedOutline {
          border-color: #00d2ff !important;
          box-shadow: 0 0 10px rgba(0, 210, 255, 0.2);
        }

        .neon-btn-light {
          background: linear-gradient(45deg, #00d2ff, #3a7bd5) !important;
          color: white !important;
          font-weight: 600 !important;
          padding: 12px !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3) !important;
          transition: 0.4s !important;
          border: none !important;
        }

        .neon-btn-light:hover {
          box-shadow: 0 6px 20px rgba(0, 210, 255, 0.5) !important;
          transform: translateY(-2px);
        }

        .neon-btn-light.Mui-disabled {
          background: #ccc !important;
          color: #666 !important;
          box-shadow: none !important;
        }

        .neon-link-light {
          color: #9d50bb;
          font-weight: 600;
          text-decoration: none;
          transition: 0.3s;
        }

        .neon-link-light:hover {
          color: #00d2ff;
          text-shadow: 0 0 8px rgba(0, 210, 255, 0.3);
        }
      `}</style>

      <Paper
        elevation={0}
        className="light-neon-card"
        sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: '420px' }}
      >
        <Typography variant="h4" component="h1" align="center" className="neon-text-gradient" gutterBottom>
          Sign Up
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: '12px', bgcolor: '#fff5f5' }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          <TextField
            className="light-input"
            name="name"
            label="Full Name"
            type="text"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
            autoComplete="name"
          />

          <TextField
            className="light-input"
            name="email"
            label="Email Address"
            type="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
            autoComplete="email"
          />

          <TextField
            className="light-input"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                    // Added color to match theme
                    sx={{ color: showPassword ? '#00d2ff' : '#9d50bb' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            className="neon-btn-light"
            disabled={
              loading ||
              !formData.name.trim() ||
              !formData.email.trim() ||
              !formData.password.trim()
            }
            sx={{ mt: 1, py: 1.5 }}
            fullWidth
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: '#fff' }} />
                Signing up...
              </>
            ) : (
              'SIGN UP'
            )}
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Already have an account?{' '}
            {/* Changed from MUI Button to React Router Link for consistency */}
            <Link to="/login" className="neon-link-light">
              Log In Here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default SignupPage;