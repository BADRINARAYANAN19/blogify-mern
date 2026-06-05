// src/pages/CreateBlogPage.js
import React, { useState } from 'react';
import API from '../config';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import './CreateBlogPage.css';

function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and Content cannot be empty.');
      return;
    }

    setLoading(true);

    console.log('SENDING DATA - Title:', title.trim());
    console.log('SENDING DATA - Content:', content.trim());

    const token = localStorage.getItem('blogify-token');

    if (!token) {
      setError('Session missing. Please log in.');
      setTimeout(() => navigate('/login'), 1500);
      setLoading(false);
      return;
    }

    try {
      await API.post(
        '/blogs',
        { title: title.trim(), content: content.trim() },
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Blog created successfully! Redirecting...');
      navigate('/dashboard');
    } catch (err) {
      console.error('Create blog error:', err.response?.data);
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        setError('Session expired/Unauthorized. Please log in again.');
        localStorage.removeItem('blogify-token');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const backendError =
          err.response?.data?.msg ||
          `Failed to create blog. Status: ${status || 'Unknown'}`;
        setError(backendError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" className="create-blog-container">
      <Paper elevation={12} className="create-blog-card">
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          className="card-header"
        >
          Write a New Blog Post
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} className="error-alert">
            ⚠️ {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          className="blog-form"
        >
          <div className="form-group">
            <label>Blog Title *</label>
            <input
              type="text"
              placeholder="Enter an engaging title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Blog Content *</label>
            <textarea
              placeholder="Write your blog content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="publish-btn"
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              '🚀 PUBLISH BLOG'
            )}
          </button>
        </Box>
      </Paper>
    </Container>
  );
}
export default CreateBlogPage;
