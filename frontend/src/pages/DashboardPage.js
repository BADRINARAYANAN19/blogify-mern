import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Typography, Button, Box, Grid, Card, CardContent, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const BACKEND_URL = 'http://localhost:5000/api/blogs';

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
            const res = await axios.get(BACKEND_URL, {
                // 🚀 Using the correct x-auth-token header
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
    
    // 🔥 LOGOUT FUNCTION ADDED 🔥
    const handleLogout = () => {
        // 1. Token-a remove pannu
        localStorage.removeItem('blogify-token'); 
        // 2. Login page-ku redirect pannu
        navigate('/login'); 
    };
    // ----------------------------

    const truncateContent = (text, limit) => {
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    if (loading) {
        return (
            <Box className="page-container" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress color="primary" size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading your Dashboard...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }} className="page-container">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
                    My Blog Posts ({blogs.length})
                </Typography>
                
                {/* 🔥 BUTTONS GROUP ADDED 🔥 */}
                <Box display="flex" gap={2}> 
                    <Button 
                        variant="outlined" // Logout button style
                        onClick={handleLogout}
                        color="error" // Red color for exit action
                        sx={{ borderRadius: '25px', padding: '10px 25px', fontWeight: 'bold' }}
                    >
                        Logout
                    </Button>
                    
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => navigate('/create')}
                        color="secondary" // Create button style
                        sx={{ borderRadius: '25px', padding: '10px 25px', fontWeight: 'bold' }}
                    >
                        Create New Post
                    </Button>
                </Box>
                {/* ---------------------------- */}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {blogs.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 10 }}>
                    <Typography variant="h5" color="text.secondary">
                        You haven't published any blogs yet.
                    </Typography>
                    <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => navigate('/create')}>
                        Start Writing Now!
                    </Button>
                </Box>
            )}

            <Grid container spacing={4}>
                {blogs.map((blog) => (
                    <Grid item key={blog._id} xs={12} sm={6} md={4}>
                        <Card elevation={5} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 600 }}>
                                    {truncateContent(blog.title, 50)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                    {new Date(blog.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1">
                                    {truncateContent(blog.content, 120)}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee' }}>
                                <Button size="small" startIcon={<VisibilityIcon />} onClick={() => navigate(`/blog/${blog._id}`)}>
                                    View
                                </Button>
                                <Button size="small" color="warning" startIcon={<EditIcon />} onClick={() => navigate(`/edit/${blog._id}`)}>
                                    Edit
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default DashboardPage;