import React from 'react';
import { useRedirect, useNotify } from 'react-admin';
import { useGoogleLogin } from '@react-oauth/google';

const CustomLoginPage = (props) => {
  const redirect = useRedirect();
  const notify = useNotify();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const accessToken = tokenResponse.access_token;
      try {
        const result = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/google/callback?access_token=${accessToken}`
        );
        result
          .json()
          .then(async ({ jwt, user }) => {
            localStorage.setItem('gUser', JSON.stringify(user));
            const isAdmin = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/api/admins/check?email=${user.email}`
            );
            if (isAdmin.ok) {
              localStorage.setItem('token', jwt);
              localStorage.setItem('accessToken', accessToken);
            }
            redirect(process.env.REACT_APP_FRONTEND_URL);
          })
          .catch((e) => console.log(e));
        if (result.status !== 200)
          throw new Error('UNAUTHORISED', result.message);
      } catch (err) {
        notify(err);
      }
    },
    prompt: 'consent',
  });

  return <button onClick={() => login()}>Sign in with Google 🚀 </button>;
};

export default CustomLoginPage;
