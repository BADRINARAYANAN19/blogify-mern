import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Typography, TextField, Button, Box, Paper, Alert, CircularProgress } from '@mui/material';

// Change this line (Line 9):
const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://blogify-mern-ozvw.onrender.com/api/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('blogify-token');
    // Light background set pannuvom
    document.body.style.backgroundColor = '#f0f2f5';
    document.body.style.margin = '0';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/login`, { email, password });
      localStorage.setItem('blogify-token', res.data.token);
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Server is offline. Check backend on port 5000.');
      } else {
        setError(err.response.data.msg || 'Login Failed.');
      }
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* --- INLINE LIGHT NEON CSS --- */}
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

        .signup-link-light {
          color: #9d50bb;
          font-weight: 600;
          text-decoration: none;
          transition: 0.3s;
        }

        .signup-link-light:hover {
          color: #00d2ff;
          text-shadow: 0 0 8px rgba(0, 210, 255, 0.3);
        }
      `}</style>

      <Paper className="light-neon-card" elevation={0} sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: '420px' }}>
        <Typography variant="h4" className="neon-text-gradient" align="center" sx={{ mb: 1 }}>
          Blogify
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: '#666', mb: 4, fontWeight: 500 }}>
          Welcome back! Please login.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', bgcolor: '#fff5f5' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField 
            className="light-input"
            label="Email Address" 
            fullWidth 
            required 
            variant="outlined"
            sx={{ mb: 2.5 }} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <TextField 
            className="light-input"
            label="Password" 
            type="password" 
            fullWidth 
            required 
            variant="outlined"
            sx={{ mb: 4 }} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button 
            type="submit" 
            variant="contained" 
            className="neon-btn-light"
            fullWidth 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'SIGN IN'}
          </Button>
        </form>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#888' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link-light">
              Create Account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;