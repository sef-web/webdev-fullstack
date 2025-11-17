// API Configuration
// Uses environment variable in production, falls back to localhost in development
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8800";

// Log the API URL being used (helps with debugging)
console.log("🔗 API URL configured:", API_URL);
console.log("📍 Environment:", process.env.NODE_ENV || "development");

export default API_URL;
