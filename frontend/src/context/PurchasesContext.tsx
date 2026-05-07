import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Alert } from 'react-native';
import { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import {
  getCustomerInfo,
  getOfferings,
  purchasePackage,
  restorePurchases,
  checkEntitlement,
  addCustomerInfoUpdateListener,
} from '../services/revenuecat';

interface PurchasesContextType {
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  offering: PurchasesOffering | null;
  loading: boolean;
  presentPaywall: () => Promise<boolean>;
  presentPaywallIfNeeded: () => Promise<boolean>;
  presentCustomerCenter: () => Promise<void>;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);

  const isPro = customerInfo ? checkEntitlement(customerInfo) : false;

  const refresh = useCallback(async () => {
    try {
      const [info, off] = await Promise.all([getCustomerInfo(), getOfferings()]);
      setCustomerInfo(info);
      setOffering(off);
    } catch {
      // Network failure — keep stale state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const remove = addCustomerInfoUpdateListener(info => {
      setCustomerInfo(info);
    });
    return remove;
  }, [refresh]);

  const presentPaywall = useCallback(async (): Promise<boolean> => {
    const result = await RevenueCatUI.presentPaywall({
      offering: offering ?? undefined,
    });
    if (result !== PAYWALL_RESULT.NOT_PRESENTED) await refresh();
    return (
      result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED
    );
  }, [offering, refresh]);

  const presentPaywallIfNeeded = useCallback(async (): Promise<boolean> => {
    const result = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: 'EntrepeneuerAI Pro',
      offering: offering ?? undefined,
    });
    if (result !== PAYWALL_RESULT.NOT_PRESENTED) await refresh();
    return (
      result === PAYWALL_RESULT.PURCHASED ||
      result === PAYWALL_RESULT.RESTORED ||
      result === PAYWALL_RESULT.NOT_PRESENTED
    );
  }, [offering, refresh]);

  const presentCustomerCenter = useCallback(async (): Promise<void> => {
    await RevenueCatUI.presentCustomerCenter();
  }, []);

  const purchase = useCallback(
    async (pkg: PurchasesPackage): Promise<boolean> => {
      try {
        const { customerInfo: info } = await purchasePackage(pkg);
        setCustomerInfo(info);
        return checkEntitlement(info);
      } catch (e: any) {
        if (!e?.userCancelled) {
          Alert.alert('Purchase failed', e?.message ?? 'Something went wrong.');
        }
        return false;
      }
    },
    [],
  );

  const restore = useCallback(async (): Promise<boolean> => {
    try {
      const info = await restorePurchases();
      setCustomerInfo(info);
      const active = checkEntitlement(info);
      Alert.alert(
        active ? 'Restored!' : 'Nothing to restore',
        active
          ? 'Your EntrepeneuerAI Pro subscription is active.'
          : 'No active subscription found for this account.',
      );
      return active;
    } catch (e: any) {
      Alert.alert('Restore failed', e?.message ?? 'Something went wrong.');
      return false;
    }
  }, []);

  return (
    <PurchasesContext.Provider
      value={{
        isPro,
        customerInfo,
        offering,
        loading,
        presentPaywall,
        presentPaywallIfNeeded,
        presentCustomerCenter,
        purchase,
        restore,
        refresh,
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
}

export function usePurchases(): PurchasesContextType {
  const ctx = useContext(PurchasesContext);
  if (!ctx) throw new Error('usePurchases must be used within PurchasesProvider');
  return ctx;
}
