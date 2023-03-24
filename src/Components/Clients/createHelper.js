import { postBackend } from '../../DataProvider/backendHelpers';

export const createClient = async (body) => {
  const { email: adminEmail } = JSON.parse(localStorage.getItem('gUser'));

  return await postBackend('/clients', { ...body, adminEmail });
};
