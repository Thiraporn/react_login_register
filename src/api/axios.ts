import axios from "axios";
 
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3500";
console.log("ENV:", import.meta.env.VITE_API_URL);
console.log("BASE_URL:", BASE_URL);

export default axios.create({ 
    baseURL: BASE_URL
});



export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});
 

