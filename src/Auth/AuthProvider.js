import { googleLogout } from '@react-oauth/google';

export const AuthProvider = {
  login() {
    return '/events';
  },
  checkAuth() {
    console.log('Checking Auth');
    return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
  },
  logout() {
    googleLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('gUser');
    return Promise.resolve();
  },
  checkError(params) {
    const status = params.status;
    if (status === 401 || status === 403) {
      if (process.NODE_ENV !== 'production') {
        alert("Auth provider would've logged you out if this was PROD!");
        return Promise.resolve();
      }
      localStorage.removeItem('token');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: async () => {
    const { email } = JSON.parse(localStorage.getItem('gUser'));

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/admins?filters[email][$eq]=${email}&populate=*`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const user = await response.json();
    if (user.data.length > 1) {
      throw new Error('More than one admin with this email');
    }
    const role = user.data[0].attributes.role;
    return role;
  },
};
