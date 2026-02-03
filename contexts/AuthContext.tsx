'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Customer } from '@/types';

interface Coordinates {
  lat: number;
  lng: number;
}

interface AuthContextType {
  user: User | null;
  customer: Customer | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string, storeCoordinates?: Coordinates) => Promise<void>;
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

  const signUp = async (email: string, password: string, name: string, phone: string, storeCoordinates?: Coordinates) => {
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
      phone,
      priceTypeId: defaultPriceTypeId,
      role: isAdmin ? 'admin' : 'customer',
      ...(storeCoordinates && { storeCoordinates }),
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
  try {
    // First, try to get default from settings
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    if (settingsDoc.exists() && settingsDoc.data().defaultPriceTypeId) {
      return settingsDoc.data().defaultPriceTypeId;
    }
    
    // Fallback: Get first price type
    const priceTypesSnapshot = await getDocs(collection(db, 'priceTypes'));
    if (!priceTypesSnapshot.empty) {
      return priceTypesSnapshot.docs[0].id;
    }
  } catch (error) {
    console.error('Error fetching default price type:', error);
  }
  // Return a placeholder if no price types exist yet
  return 'default-price-type';
}