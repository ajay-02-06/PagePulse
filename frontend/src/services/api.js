import axios from "axios";

const api = axios.create({
    baseURL: "https://pagepulse-backend-0mmk.onrender.com/api"
});

export default api;