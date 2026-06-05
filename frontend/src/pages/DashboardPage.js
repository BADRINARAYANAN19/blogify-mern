import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './DashboardPage.css';

// Base URL points to /api
const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://blogify-mern-1.onrender.com/api';

function DashboardPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserBlogs();
    }, []);

    const fetchUserBlogs = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('blogify-token');

        if (!token) {
            navigate('/login'); 
            return;
        }

        try {
            // FIXED: URL is now correct (e.g., .../api/blogs)
            const res = await axios.get(`${BACKEND_URL}/blogs`, {
                headers: { 'x-auth-token': token },
            });
            setBlogs(res.data);
        } catch (err) {
            console.error("Failed to fetch blogs:", err.response?.data);
            
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('blogify-token');
                setError('Session expired. Redirecting to login.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError('Failed to load your blog posts.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('blogify-token'); 
        navigate('/login'); 
    };

    const truncateContent = (text, limit) => {
        return text && text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>My Blog Posts ({blogs?.length || 0})</h1>
                <p>Welcome back! Write, edit, and publish your blogs here.</p>
                
                <Box display="flex" justifyContent="center" gap={2} mt={3}>
                    <Button 
                        variant="outlined" 
                        onClick={handleLogout}
                        sx={{ 
                            borderRadius: '25px', padding: '10px 25px', fontWeight: 'bold', 
                            color: 'white', borderColor: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': { borderColor: 'white', background: 'rgba(255, 255, 255, 0.1)' }
                        }}
                    >
                        Logout
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => navigate('/create')}
                        color="success"
                        sx={{ borderRadius: '25px', padding: '10px 25px', fontWeight: 'bold' }}
                    >
                        Create New Post
                    </Button>
                </Box>
            </div>

            {error && (
                <Alert severity="error" sx={{ mb: 3, maxWidth: '600px', margin: '0 auto 20px', borderRadius: '10px' }}>
                    {error}
                </Alert>
            )}

            {blogs?.length === 0 ? (
                <div className="no-blogs">
                    <div className="no-blogs-card">
                        <h2>You haven't published any blogs yet.</h2>
                        <Button variant="contained" color="success" sx={{ mt: 2, borderRadius: '25px' }} onClick={() => navigate('/create')}>
                            Start Writing Now!
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="blogs-grid">
                    {blogs?.map((blog) => (
                        <div key={blog._id} className="blog-card" onClick={() => navigate(`/blog/${blog._id}`)}>
                            <h3>{truncateContent(blog.title, 50)}</h3>
                            <div className="blog-excerpt">
                                {truncateContent(blog.content, 120)}
                            </div>
                            <div className="blog-meta" onClick={(e) => e.stopPropagation()}>
                                <span className="blog-date">📅 {new Date(blog.date).toLocaleDateString()}</span>
                                <div className="blog-actions">
                                    <button 
                                        className="action-btn edit-btn" 
                                        onClick={(e) => { e.stopPropagation(); navigate(`/edit/${blog._id}`); }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DashboardPage;