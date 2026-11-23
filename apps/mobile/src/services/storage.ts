import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
let error: string | null = null;
const listeners = new Set<() => void>();
function report(value: string | null) {
  error = value;
  listeners.forEach((fn) => fn());
}
export const safeStorage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      report("Local storage is unavailable. Changes may not survive reload.");
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      report(null);
    } catch {
      report("Local storage is unavailable. Changes may not survive reload.");
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      report("Could not clear local data. Try again.");
    }
  },
};
export const useStorageError = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => error,
    () => null,
  );
