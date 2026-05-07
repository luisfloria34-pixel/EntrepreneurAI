import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';

// Same key used for both platforms in sandbox/test mode.
// Replace with platform-specific keys (appl_... / goog_...) for production.
const API_KEY = 'test_RarQPRrNCiDruOkdjkKvsSfqxLe';

export const ENTITLEMENT_ID = 'EntrepeneuerAI Pro';

export function initializePurchases(userId?: string): void {
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);

  Purchases.configure({ apiKey: API_KEY });

  if (userId) {
    Purchases.logIn(userId).catch(() => {});
  }
}

export async function loginUser(userId: string): Promise<void> {
  await Purchases.logIn(userId);
}

export async function logoutUser(): Promise<void> {
  await Purchases.logOut().catch(() => {});
}

export async function getOfferings(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

export async function purchasePackage(
  pkg: PurchasesPackage,
): Promise<{ customerInfo: CustomerInfo; success: boolean }> {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return { customerInfo, success: true };
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

export function checkEntitlement(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

export function addCustomerInfoUpdateListener(
  callback: (info: CustomerInfo) => void,
): () => void {
  Purchases.addCustomerInfoUpdateListener(callback);
  return () => Purchases.removeCustomerInfoUpdateListener(callback);
}
