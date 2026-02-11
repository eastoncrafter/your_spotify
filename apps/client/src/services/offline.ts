// Check if the app is running in offline mode
export const isOfflineMode = (): boolean => {
  return (window as any).OFFLINE_MODE === true;
};
