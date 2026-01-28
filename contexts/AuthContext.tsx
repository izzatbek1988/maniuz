'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Customer } from '@/types';

interface AuthContextType {
  user: User | null;
  customer: Customer | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch customer data from Firestore
        const customerDoc = await getDoc(doc(db, 'customers', user.uid));
        if (customerDoc.exists()) {
          setCustomer({ id: customerDoc.id, ...customerDoc.data() } as Customer);
        }
      } else {
        setCustomer(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Get default price type
    const defaultPriceTypeId = await getDefaultPriceTypeId();
    
    // Check if user is admin
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@maniuz.com';
    const isAdmin = email.toLowerCase() === adminEmail.toLowerCase();
    
    // Create customer document in Firestore
    await setDoc(doc(db, 'customers', userCredential.user.uid), {
      email,
      name,
      priceTypeId: defaultPriceTypeId,
      role: isAdmin ? 'admin' : 'customer',
      createdAt: serverTimestamp(),
    });
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, customer, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

async function getDefaultPriceTypeId(): Promise<string> {
  // This will be implemented to fetch the first price type
  // For now, return a default value
  return 'default-price-type';
}
