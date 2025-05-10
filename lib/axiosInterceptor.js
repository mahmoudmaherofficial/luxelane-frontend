// lib/axiosInterceptor.js
import axios from "axios";
import Cookies from 'js-cookie';
import refreshAccessToken from "./refreshToken";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    try {
      const newAccessToken = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return config;
    } catch (error) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }
  }
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

export default api;
