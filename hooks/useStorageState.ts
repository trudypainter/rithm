import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UseStorageStateResult = [
  [boolean, string | null],
  (value: string | null) => Promise<void>
];

export function useStorageState(key: string): UseStorageStateResult {
  const [state, setState] = useState<[boolean, string | null]>([true, null]);

  useEffect(() => {
    AsyncStorage.getItem(key).then(value => {
      setState([false, value]);
    });
  }, [key]);

  const setValue = useCallback(
    (value: string | null) => {
      setState([true, null]);
      return AsyncStorage.setItem(key, value || '').then(() => {
        setState([false, value]);
      });
    },
    [key]
  );

  return [state, setValue];
}
