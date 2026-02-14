// utils/getCurrentUser.ts

export type User = {
  _id: string;
  name: string;
  email: string;
};

export function getCurrentUser(): User {
  if (typeof window === 'undefined') {
    return { _id: '', name: '', email: '' };
  }

  const tokenString = localStorage.getItem('user');

  if (!tokenString) {
    return { _id: '', name: '', email: '' };
  }

  try {
    const userData = JSON.parse(tokenString);
    return {
      _id: userData?._id?.toString() || '',
      name: userData?.name || '',
      email: userData?.email || '',
    };
  } catch (error) {
    console.error('Invalid token format:', error);
    return { _id: '', name: '', email: '' };
  }
}
