import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true
});

instance.interceptors.request.use(function (config) {
    const token = document.cookie.split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];;
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

export default instance;