import AppID from 'ibmcloud-appid-js';

const appID = new AppID();
let initialized = false;

export const initAuth = async () => {
  if (initialized) return true;
  
  const clientId = import.meta.env.VITE_APPID_CLIENT_ID;
  const discoveryEndpoint = import.meta.env.VITE_APPID_DISCOVERY_ENDPOINT;

  if (!clientId || !discoveryEndpoint) {
    console.warn("AppID credentials (VITE_APPID_CLIENT_ID, VITE_APPID_DISCOVERY_ENDPOINT) are missing from .env.");
    return false;
  }

  try {
    await appID.init({
      clientId: clientId,
      discoveryEndpoint: discoveryEndpoint
    });
    initialized = true;
    return true;
  } catch (e) {
    console.error("Failed to initialize AppID", e);
    return false;
  }
};

export const loginWithAppId = async () => {
  try {
    await initAuth();
    if (!initialized) {
      alert("AppID is not configured yet. Please provide the credentials.");
      return null;
    }
    const tokens = await appID.signin();
    const userInfo = await appID.getUserInfo(tokens.accessToken);
    
    // Persist user info
    const user = {
      name: userInfo.name || userInfo.email.split('@')[0],
      email: userInfo.email,
      tokens: tokens
    };
    localStorage.setItem('rightspeak_user', JSON.stringify(user));
    
    return { tokens, userInfo };
  } catch (e) {
    console.error("Login failed", e);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('rightspeak_user');
  window.location.href = '/';
};

export const getUser = () => {
  const user = localStorage.getItem('rightspeak_user');
  return user ? JSON.parse(user) : null;
};
