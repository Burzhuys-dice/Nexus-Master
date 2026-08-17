import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '28841991490-502a5p0c9n7f6v09gikdihs21ib1e4q8.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export function useGoogleAuth() {
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            setAccessToken(tokenResponse.access_token);
            setIsAuthorized(true);
          }
        },
      });
      setTokenClient(client);
    }
  }, []);

  const login = useCallback(() => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  }, [tokenClient]);

  const logout = useCallback(() => {
    if (accessToken && window.google) {
      window.google.accounts.oauth2.revoke(accessToken, () => {
        setAccessToken(null);
        setIsAuthorized(false);
      });
    }
  }, [accessToken]);

  return { isAuthorized, accessToken, login, logout };
}
