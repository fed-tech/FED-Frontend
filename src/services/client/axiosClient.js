import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
let headers = {}

if (localStorage.token) {
    headers.Authorization = `Bearer ${localStorage.token}`;
}

const axiosClient = axios.create({
    baseURL: baseURL,
    headers,
});

export default axiosClient;