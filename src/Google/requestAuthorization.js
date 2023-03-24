import { hasGrantedAllScopesGoogle } from '@react-oauth/google';

export const sendAuthorizedApiRequest = async (requestDetails, scope) => {
  if (isAuthorized(scope)) {
    const response = await fetch(requestDetails.path, requestDetails);
    console.log('RESULT FROM SENDAUTHEDREQ: ', response);
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Request failed with status: ${response.status}`);
  }
  console.error(
    scope,
    ' not authorised by user, calling login to prompt authorisation'
  );
};

const isAuthorized = (requestScope) => {
  try {
    const json = localStorage.getItem('tokenResponse') || '';
    const tokenResponse = JSON.parse(json);
    const hasGrantedAllScopes = hasGrantedAllScopesGoogle(
      tokenResponse,
      requestScope
    );

    console.log('Result of hasGrantedAllScopesGoogle: ', hasGrantedAllScopes);

    if (!hasGrantedAllScopes) {
      throw new Error(
        `User has not granted the following scope ${requestScope}`
      );
    }
    return true;
  } catch (e) {
    console.error('Error verifying that user has authed google scopes', e);
    return false;
  }
};
