import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/utils/network/networkStatus';
import { useLanguage } from '@/contexts/language';

/**
 * OfflineIndicator Component
 * 
 * Displays a subtle banner when network is unavailable.
 * Auto-hides when connection is restored.
 */
export function OfflineIndicator() {
  const { isOnline } = useNetworkStatus();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
      <WifiOff className="w-4 h-4" />
      <span>{t('shared.offlineMessage')}</span>
    </div>
  );
}
