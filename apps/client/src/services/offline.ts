// Extend Window interface to include OFFLINE_MODE
declare global {
  interface Window {
    OFFLINE_MODE?: boolean;
    API_ENDPOINT?: string;
  }
}

// Check if the app is running in offline mode
export const isOfflineMode = (): boolean => {
  return window.OFFLINE_MODE === true;
};
