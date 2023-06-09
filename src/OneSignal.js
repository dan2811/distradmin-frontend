import OneSignal from 'react-onesignal';

export default async function runOneSignal() {
  await OneSignal.init({
    appId: process.env.REACT_APP_ONE_SIGNAL_APP_ID,
    allowLocalhostAsSecureOrigin: true,
  });
}
