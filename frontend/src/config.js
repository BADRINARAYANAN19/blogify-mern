import axios from 'axios';

// Final Production fix: 
// Direct-ah production URL-a use pannuvom, illana local URL-a use pannuvom.
const API_URL = process.env.REACT_APP_API_URL || 'https://blogify-mern-ozvw.onrender.com';

const API = axios.create({
    baseURL: API_URL
});

export default API;