import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';

// RevenueCat public SDK keys. Configure in Expo/EAS environment for production.
const API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
});
let configured = false;

export const ENTITLEMENT_ID = 'EntrepeneuerAI Pro';

export function initializePurchases(userId?: string): void {
  if (configured) return;
  if (!API_KEY) {
    console.warn('[RevenueCat] Missing platform SDK key');
    return;
  }
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);

  Purchases.configure({ apiKey: API_KEY });
  configured = true;

  if (userId) {
    Purchases.logIn(userId).catch(() => {});
  }
}

export async function loginUser(userId: string): Promise<void> {
  if (!configured) return;
  await Purchases.logIn(userId);
}

export async function logoutUser(): Promise<void> {
  if (!configured) return;
  await Purchases.logOut().catch(() => {});
}

export async function getOfferings(): Promise<PurchasesOffering | null> {
  if (!configured) return null;
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

export async function purchasePackage(
  pkg: PurchasesPackage,
): Promise<{ customerInfo: CustomerInfo; success: boolean }> {
  if (!configured) throw new Error('RevenueCat is not configured');
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return { customerInfo, success: true };
}

export async function restorePurchases(): Promise<CustomerInfo> {
  if (!configured) throw new Error('RevenueCat is not configured');
  return Purchases.restorePurchases();
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  if (!configured) throw new Error('RevenueCat is not configured');
  return Purchases.getCustomerInfo();
}

export function checkEntitlement(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

export function addCustomerInfoUpdateListener(
  callback: (info: CustomerInfo) => void,
): () => void {
  if (!configured) return () => {};
  Purchases.addCustomerInfoUpdateListener(callback);
  return () => Purchases.removeCustomerInfoUpdateListener(callback);
}
