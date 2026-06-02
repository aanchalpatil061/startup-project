import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const state = await Network.getNetworkStateAsync();
      if (mounted) setIsOnline(!!state.isConnected && !!state.isInternetReachable);
    };

    check();
    const interval = setInterval(check, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { isOnline };
};
