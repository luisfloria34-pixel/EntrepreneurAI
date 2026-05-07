import { useRouter } from 'expo-router';
import { usePurchases } from '../context/PurchasesContext';

/**
 * Returns a gated action wrapper.
 * If the user is Pro, runs the action immediately.
 * If not, opens the paywall modal first.
 */
export function useProGate() {
  const { isPro } = usePurchases();
  const router = useRouter();

  function requirePro(action: () => void): void {
    if (isPro) {
      action();
    } else {
      router.push('/paywall');
    }
  }

  return { isPro, requirePro };
}
