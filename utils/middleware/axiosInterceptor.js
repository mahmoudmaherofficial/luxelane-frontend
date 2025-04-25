import { BASE_URL } from '@/api/urls';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('Attempting to refresh token...');
        const response = await axios.post(
          `${BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data;
        if (!accessToken) {
          throw new Error('No access token returned from refresh endpoint');
        }
        Cookies.set('accessToken', accessToken, {
          expires: 1 / 96, // 15 minutes
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token error:', {
          message: refreshError.message,
          response: refreshError.response?.data,
          status: refreshError.response?.status,
          headers: refreshError.response?.headers,
        });
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;