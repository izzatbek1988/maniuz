'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface NicknameCheckResult {
  checking: boolean;
  available: boolean | null;
  error?: string;
}

/**
 * Hook to check nickname availability in Firestore with debouncing
 * @param nickname - The nickname to check
 * @param debounceMs - Debounce delay in milliseconds (default: 500ms)
 * @returns Object with checking status and availability result
 */
export function useNicknameCheck(nickname: string, debounceMs: number = 500): NicknameCheckResult {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    // Reset state if nickname is too short or empty
    if (!nickname || nickname.length < 3) {
      setChecking(false);
      setAvailable(null);
      setError(undefined);
      return;
    }

    // Set checking state immediately
    setChecking(true);
    setError(undefined);

    // Debounce the check
    const timeoutId = setTimeout(async () => {
      try {
        // Query Firestore for existing nickname
        const usersRef = collection(db, 'customers');
        const q = query(usersRef, where('nickname', '==', nickname));
        const querySnapshot = await getDocs(q);

        // If query returns any documents, nickname is taken
        setAvailable(querySnapshot.empty);
      } catch (err) {
        console.error('Error checking nickname:', err);
        setError('error_checking_nickname');
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, debounceMs);

    // Cleanup function to cancel pending checks
    return () => {
      clearTimeout(timeoutId);
    };
  }, [nickname, debounceMs]);

  return { checking, available, error };
}
