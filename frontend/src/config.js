// API Configuration
// Uses environment variable in production, falls back to localhost in development
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8800";

export default API_URL;
