import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
let headers = {}

if (localStorage.token) {
    headers.Authorization = `Bearer ${localStorage.token}`;
}

const axiosClient = axios.create({
    baseURL: '/api',
    headers
});

export default axiosClient;``