import { getAccount } from '@/api/account';
import { useAuth } from '@/context/authContext';

export const checkUser = async () => {
  try {
    const res = await getAccount()
    if (res.data) return window.location.replace('/')
  } catch (err) {
    if (err.response?.status !== 401 || err.response?.status !== 404) console.error(err)
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('refreshToken');
  cookieStore.delete('accessToken'); // Clear accessToken for consistency
}