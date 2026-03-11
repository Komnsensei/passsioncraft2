// Simplified app params for standalone mode
// No Base44-specific configuration needed

const isNode = typeof window === 'undefined';

export const appParams = {
  // Standalone mode - no app ID needed
  appId: 'passioncraft-square-local',
  // No token required for local storage mode
  token: null,
  // Current URL
  fromUrl: isNode ? '' : window.location.href,
  // No functions version needed
  functionsVersion: 'local',
  // Base URL for the app
  appBaseUrl: isNode ? '' : window.location.origin,
};

export default appParams;
