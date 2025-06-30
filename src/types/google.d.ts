
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      auth2: {
        init: (config: any) => Promise<any>;
        getAuthInstance: () => {
          signIn: () => Promise<{
            getAuthResponse: () => { access_token: string };
          }>;
          signOut: () => Promise<void>;
          isSignedIn: {
            get: () => boolean;
          };
        };
      };
    };
  }
}

export {};
