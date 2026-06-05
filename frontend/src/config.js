import axios from 'axios';

// Resolve the API base URL reliably for local and deployed environments.
const rawUrl = process.env.REACT_APP_API_URL || 'https://blogify-mern-1.onrender.com';
const normalizedUrl = rawUrl.replace(/\/+$/, '');
const API_BASE = normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`;

const API = axios.create({
  baseURL: API_BASE,
});

export default API;