import Cookies from 'js-cookie';
import api from '../utils/middleware/axiosInterceptor';

export const login = async (data) => {
  console.log('Login request data:', data);
  return await api.post('/auth/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const register = async (formData) => {
  console.log('Register request data:', Object.fromEntries(formData));
  return await api.post('/auth/register', formData);
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    window.dispatchEvent(new Event('auth:logout'));
  } catch (err) {
    console.error('Logout failed:', err.response?.data || err.message);
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    window.dispatchEvent(new Event('auth:logout'));
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh-token', {}, {
      withCredentials: true,
    });
    const { accessToken } = response.data;
    if (!accessToken) {
      throw new Error('No access token returned from refresh endpoint');
    }
    console.log('New accessToken received:', accessToken ? 'Present' : 'Missing');
    Cookies.set('accessToken', accessToken, {
      expires: 1 / 96, // 15 minutes
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return accessToken;
  } catch (err) {
    console.error('Refresh token failed:', err.response?.data || err.message);
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    window.dispatchEvent(new Event('auth:logout'));
    return null;
  }
};