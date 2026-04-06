// Auto-detect backend URL based on current environment
export const getBackendUrl = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }

  // DevTunnels or remote environment
  if (hostname.includes('devtunnels.ms')) {
    // Replace port 3000 with 8000 in the hostname
    const remoteUrl = hostname.replace('-3000.', '-8000.');
    return `${protocol}//${remoteUrl}`;
  }

  // Fallback to localhost for unknown environments
  return 'http://localhost:8000';
};

export const API_BASE_URL = getBackendUrl();

export default {
  API_BASE_URL
};
