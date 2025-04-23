import { getAccount } from '@/api/account';

export const checkUser = async () => {
  try {
    const user = await getAccount()
    if (user) return window.location.replace('/')
  } catch (err) {
    if (err.response?.status === 401) return
    console.error(err)
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('refreshToken');
  cookieStore.delete('accessToken'); // Clear accessToken for consistency
}