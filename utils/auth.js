import { getAccount } from '@/api/account';
import Cookies from 'js-cookie';

export const checkUser = async () => {
  try {
    const res = await getAccount();
    return res.data ? true : false;
  } catch (err) {
    if (err.response?.status !== 401 && err.response?.status !== 404) {
      console.error('Error checking user:', err.response?.data || err.message);
    }
    return false;
  }
};

export const logout = async () => {
  try {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    window.dispatchEvent(new Event('auth:logout'));
  } catch (err) {
    console.error('Logout failed:', err);
  }
};