// SingleBlogPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './SingleBlogPage.css';

// Change this line:
const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://blogify-mern-ozvw.onrender.com/api/blogs';

function SingleBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const fetchBlog = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('blogify-token');

    try {
      const res = await axios.get(`${BACKEND_URL}/${id}`, {
        headers: token ? { 'x-auth-token': token } : {},
      });

      setBlog(res.data);

      // Ownership check
      if (token && res.data.user) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.user?.id || payload.id;
          if (userId) {
            setIsOwner(res.data.user._id === userId);
          } else {
            setIsOwner(false);
          }
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          setIsOwner(false);
        }
      } else {
        setIsOwner(false);
      }
    } catch (err) {
      console.error('Fetch error:', err.response?.data);
      const backendError =
        err.response?.data?.msg || 'Failed to fetch post. Check server console.';
      setError(backendError);

      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('blogify-token');
        setError('Session expired. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you absolutely sure you want to delete the blog post titled: "${blog?.title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    const token = localStorage.getItem('blogify-token');

    try {
      await axios.delete(`${BACKEND_URL}/${id}`, {
        headers: { 'x-auth-token': token },
      });
      alert(`Blog "${blog.title}" deleted successfully.`);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete blog:', err.response?.data);
      const backendError =
        err.response?.data?.msg || 'Error deleting post. Please check permissions.';
      setError(backendError);

      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('blogify-token');
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Render states
  if (loading) {
    return (
      <Container maxWidth="md" className="single-blog-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !blog) {
    return (
      <Container maxWidth="md" className="single-blog-container">
        <Box mt={4}>
          <Alert severity="error">{error || 'Could not retrieve post.'}</Alert>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/')}>
              Go to Dashboard
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="single-blog-container">
      <Box mt={2} mb={2}>
        <Button
          variant="text"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to All Posts
        </Button>
      </Box>

      <Paper elevation={3} className="blog-content-card">
        <Box p={3}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h4" className="blog-title">
                {blog.title}
              </Typography>
              <Typography variant="subtitle2" className="blog-metadata">
                By: {blog.user ? blog.user.name : 'Unknown'} | Published on:{' '}
                {new Date(blog.date).toLocaleDateString()}
              </Typography>
            </Grid>

            {isOwner && (
              <Grid item className="action-buttons-group">
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/edit/${blog._id}`)}
                  disabled={isDeleting}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </Grid>
            )}
          </Grid>

          <Box mt={3}>
            <Typography variant="body1" className="blog-body">
              {blog.content}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default SingleBlogPage;
