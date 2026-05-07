import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@entrepreneurai_is_pro';

export async function getIsPro(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEY);
  return val === 'true';
}

export async function setIsPro(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY, value ? 'true' : 'false');
}

export async function activatePro(): Promise<void> {
  await setIsPro(true);
}

export async function deactivatePro(): Promise<void> {
  await setIsPro(false);
}
