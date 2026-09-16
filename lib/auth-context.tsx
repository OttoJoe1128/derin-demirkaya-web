'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { soundFx } from './sound-fx';

export interface UserReservation {
  id: string;
  workshopId: string;
  workshopTitle: string;
  workshopDate: string;
  workshopTime: string;
  location: string;
  instructor: string;
  seatCount: number;
  totalPrice: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  ticketCode: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  memberSince: string;
  membershipTier: 'Koleksiyoner Üye' | 'Usta Çırağı' | 'Küratör';
  reservations: UserReservation[];
  savedArtworkIds: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string, phone: string) => Promise<{ success: boolean; message?: string }>;
  demoLogin: () => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  cancelReservation: (reservationId: string) => void;
  addReservation: (reservation: Omit<UserReservation, 'id' | 'createdAt' | 'ticketCode' | 'status'>) => UserReservation;
  toggleSaveArtwork: (artworkId: string) => void;
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-col-892',
  name: 'Sırça Koleksiyoner',
  email: 'sircaedebiyat@gmail.com',
  phone: '+90 532 892 44 10',
  city: 'İstanbul, TR',
  memberSince: '2024 / Q2',
  membershipTier: 'Koleksiyoner Üye',
  savedArtworkIds: ['selflove', 'uncut', 'tension'],
  reservations: [
    {
      id: 'res-88219',
      workshopId: 'ws-1',
      workshopTitle: 'Kayıp Mum Tekniği ile Heykelsi Takı Dökümü',
      workshopDate: '24 Ekim 2026',
      workshopTime: '13:00 - 17:30',
      location: 'Karaköy Zanaat Loft, Kat 3, İstanbul',
      instructor: 'Derin Buse Demirkaya',
      seatCount: 1,
      totalPrice: '₺3.850',
      status: 'confirmed',
      ticketCode: 'DM-LOFT-2410-A1',
      createdAt: '2026-09-10',
    },
    {
      id: 'res-77104',
      workshopId: 'ws-3',
      workshopTitle: 'Gümüş Dokulandırma ve Organik Form Şekillendirme',
      workshopDate: '12 Ağustos 2026',
      workshopTime: '11:00 - 15:00',
      location: 'Moda Sanat Stüdyosu, Kadıköy',
      instructor: 'Derin Buse Demirkaya',
      seatCount: 2,
      totalPrice: '₺7.000',
      status: 'completed',
      ticketCode: 'DM-MODA-1208-B4',
      createdAt: '2026-07-20',
    },
  ],
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  demoLogin: () => {},
  logout: () => {},
  updateProfile: () => {},
  cancelReservation: () => {},
  addReservation: () => ({} as UserReservation),
  toggleSaveArtwork: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('derin_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const isLoading = false;

  const saveUserToStorage = (userData: UserProfile | null) => {
    if (userData) {
      localStorage.setItem('derin_auth_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('derin_auth_user');
    }
    setUser(userData);
  };

  const login = async (email: string): Promise<{ success: boolean; message?: string }> => {
    soundFx.playClick();
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Lütfen geçerli bir e-posta adresi giriniz.' };
    }

    // Eğer demo e-posta veya kayıtlıysa
    const loggedUser: UserProfile = {
      ...DEFAULT_DEMO_USER,
      email: email,
      name: email.split('@')[0].toUpperCase(),
    };

    saveUserToStorage(loggedUser);
    soundFx.playSuccess();
    return { success: true };
  };

  const register = async (name: string, email: string, _pass: string, phone: string) => {
    soundFx.playClick();
    if (!name.trim() || !email.includes('@')) {
      return { success: false, message: 'Lütfen tüm alanları eksiksiz doldurunuz.' };
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+90 5XX XXX XX XX',
      city: 'İstanbul, TR',
      memberSince: '2026 / Q3',
      membershipTier: 'Koleksiyoner Üye',
      reservations: [],
      savedArtworkIds: ['selflove'],
    };

    saveUserToStorage(newUser);
    soundFx.playSuccess();
    return { success: true };
  };

  const demoLogin = () => {
    soundFx.playClick();
    saveUserToStorage(DEFAULT_DEMO_USER);
    soundFx.playSuccess();
  };

  const logout = () => {
    soundFx.playClick();
    saveUserToStorage(null);
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    soundFx.playClick();
    if (!user) return;
    const updated = { ...user, ...updatedData };
    saveUserToStorage(updated);
    soundFx.playSuccess();
  };

  const cancelReservation = (reservationId: string) => {
    soundFx.playClick();
    if (!user) return;
    const updatedReservations = user.reservations.map((res) => {
      if (res.id === reservationId) {
        return { ...res, status: 'cancelled' as const };
      }
      return res;
    });
    const updatedUser = { ...user, reservations: updatedReservations };
    saveUserToStorage(updatedUser);
  };

  const addReservation = useCallback((
    reservationData: Omit<UserReservation, 'id' | 'createdAt' | 'ticketCode' | 'status'>
  ): UserReservation => {
    soundFx.playSuccess();
    const newRes: UserReservation = {
      ...reservationData,
      id: `res-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'confirmed',
      ticketCode: `DM-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUser((prev) => {
      const targetUser = prev || DEFAULT_DEMO_USER;
      const updatedUser: UserProfile = {
        ...targetUser,
        reservations: [newRes, ...targetUser.reservations],
      };
      localStorage.setItem('derin_auth_user', JSON.stringify(updatedUser));
      return updatedUser;
    });

    return newRes;
  }, []);

  const toggleSaveArtwork = (artworkId: string) => {
    soundFx.playClick();
    if (!user) return;
    const isSaved = user.savedArtworkIds.includes(artworkId);
    const updatedSaved = isSaved
      ? user.savedArtworkIds.filter((id) => id !== artworkId)
      : [...user.savedArtworkIds, artworkId];
    
    const updatedUser = { ...user, savedArtworkIds: updatedSaved };
    saveUserToStorage(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
        cancelReservation,
        addReservation,
        toggleSaveArtwork,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
