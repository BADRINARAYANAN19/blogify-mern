import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, CircularProgress, Alert } from '@mui/material';

// 🔥 REMOVED NEON COLOR DEFINITIONS (Using standard MUI colors now)

const BACKEND_URL = 'http://localhost:5000/api/blogs';

function EditBlogPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- 1. Fetch existing blog data --- (Logic is correct)
    useEffect(() => {
        const token = localStorage.getItem('blogify-token');
        if (!token) { navigate('/login'); return; }

        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/${id}`, { headers: { 'x-auth-token': token } });
                setTitle(res.data.title);
                setContent(res.data.content);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch blog for editing:", err.response?.data);
                setError("Failed to load blog. You might not own it or it may not exist.");
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id, navigate]);

    // --- 2. Handle form submission (Update) --- (Logic is correct)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const token = localStorage.getItem('blogify-token');
        if (!token) { navigate('/login'); return; }

        try {
            const updatedBlog = { title: title.trim(), content: content.trim() };
            
            await axios.put(`${BACKEND_URL}/${id}`, updatedBlog, {
                headers: { 'x-auth-token': token },
            });

            alert('✅ Blog updated successfully!');
            navigate(`/blog/${id}`); 
        } catch (err) {
            console.error("Failed to update blog:", err.response?.data);
            
            if (err.response?.status === 401 || err.response?.status === 403) {
                 setError('Authorization failed. Please check permissions or log in again.');
            } else {
                 setError('Update failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        // Simple loading state
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }} className="page-container">
            <CircularProgress color="primary" />
            <Typography variant="h6" sx={{ ml: 2, color: 'text.primary' }}>Loading Post Data...</Typography>
        </Box>
    );

    if (error && !loading) return (
        // Simple error state
        <Container maxWidth="sm" sx={{ mt: 5 }} className="page-container">
            <Alert severity="error">{error}</Alert>
            <Box textAlign="center" mt={3}><Button variant="contained" onClick={() => navigate('/')}>Go Home</Button></Box>
        </Container>
    );

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }} className="page-container">
            <Paper 
                elevation={6} // Reduced elevation for cleaner look
                sx={{ 
                    p: { xs: 3, md: 5 }, 
                    borderRadius: '12px', 
                    bgcolor: 'white', // White Card Background
                    border: '1px solid #ddd', // Subtle Border
                    // 🔥 REMOVED NEON GLOW STYLES
                }}
            >
                <Typography 
                    variant="h3" component="h1" gutterBottom align="center"
                    sx={{ 
                        fontWeight: 700, 
                        color: 'primary.main', // Standard Primary color for accent
                        // 🔥 REMOVED TEXT SHADOW/NEON STYLES
                        mb: 4 
                    }}
                >
                    Editing: {title.substring(0, 30)}...
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Blog Title" variant="outlined" fullWidth required
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        // 🔥 Using default Material UI styles (no custom sx overrides here)
                    />
                    <TextField
                        label="Blog Content" variant="outlined" fullWidth required
                        multiline rows={15}
                        value={content} onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        // 🔥 Using default Material UI styles
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                        <Button 
                            variant="outlined" 
                            color="secondary" // Using standard secondary color
                            onClick={() => navigate(`/blog/${id}`)} disabled={isSubmitting}
                            // Simplified styling
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit" 
                            variant="contained" 
                            color="primary" // Using standard primary color
                            disabled={isSubmitting || !title.trim() || !content.trim()}
                            sx={{ 
                                // Standard button styling
                                borderRadius: '8px', 
                                padding: '10px 30px', 
                                fontWeight: 'bold',
                                // 🔥 REMOVED NEON BOX SHADOW/COLORS
                            }}
                        >
                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Update Blog'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default EditBlogPage;