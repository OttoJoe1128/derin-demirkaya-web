'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { soundFx } from './sound-fx';
import { getSupabase, isSupabaseConfigured } from './supabase';

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
  isCloudSynced: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string, phone: string) => Promise<{ success: boolean; message?: string }>;
  demoLogin: () => void;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  cancelReservation: (reservationId: string) => Promise<void>;
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
      workshopTitle: 'Kayıp Mum Tekniği ile Heykelsi Yüzük',
      workshopDate: '28 Ekim 2026',
      workshopTime: '13:00 - 18:00',
      location: 'Tozman Bazaar Sanat Alanı, Eskişehir',
      instructor: 'Derin Buse Demirkaya',
      seatCount: 1,
      totalPrice: '₺4.200',
      status: 'confirmed',
      ticketCode: 'DM-W24-8821',
      createdAt: '2026-09-12',
    },
    {
      id: 'res-88204',
      workshopId: 'ws-2',
      workshopTitle: 'Ateşle Şekillenen Yüzeyler & Gümüş Döküm',
      workshopDate: '15 Kasım 2026',
      workshopTime: '11:00 - 17:00',
      location: 'nonvalue studio, Karaköy / İstanbul',
      instructor: 'Derin Buse Demirkaya',
      seatCount: 2,
      totalPrice: '₺9.600',
      status: 'confirmed',
      ticketCode: 'DM-W24-8820',
      createdAt: '2026-09-08',
    },
  ],
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCloudSynced: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  demoLogin: () => {},
  logout: async () => {},
  updateProfile: async () => {},
  cancelReservation: async () => {},
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  const saveUserToStorage = useCallback((userData: UserProfile | null) => {
    if (typeof window === 'undefined') return;
    if (userData) {
      localStorage.setItem('derin_auth_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('derin_auth_user');
    }
    setUser(userData);
  }, []);

  // Supabase'den kullanıcı profilini ve rezervasyonlarını çekme yardımcısı
  const syncSupabaseUser = useCallback(async (userId: string, email: string, fallbackName?: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const { data: reservations } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const syncedUser: UserProfile = {
        id: userId,
        name: profile?.name || fallbackName || email.split('@')[0] || 'Koleksiyoner',
        email: email || profile?.email || '',
        phone: profile?.phone || '',
        city: profile?.city || 'İstanbul, TR',
        memberSince: profile?.member_since || '2026',
        membershipTier: (profile?.membership_tier as UserProfile['membershipTier']) || 'Koleksiyoner Üye',
        savedArtworkIds: profile?.saved_artworks || ['selflove'],
        reservations: (reservations || []).map((r) => ({
          id: r.id,
          workshopId: r.workshop_id,
          workshopTitle: r.workshop_title,
          workshopDate: r.workshop_date,
          workshopTime: r.workshop_time,
          location: r.location,
          instructor: r.instructor,
          seatCount: r.seat_count || 1,
          totalPrice: r.total_price || '₺0',
          status: r.status || 'confirmed',
          ticketCode: r.ticket_code,
          createdAt: r.created_at ? r.created_at.split('T')[0] : '2026',
        })),
      };

      setIsCloudSynced(true);
      saveUserToStorage(syncedUser);
    } catch (err) {
      console.warn('Supabase sync error:', err);
    }
  }, [saveUserToStorage]);

  // Supabase Oturum Denetimi & Canlı Dinleyici (onAuthStateChange)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabase();
    if (!supabase) return;

    let isMounted = true;

    // İlk yüklemede mevcut oturumu denetle
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && isMounted) {
        setIsCloudSynced(true);
        syncSupabaseUser(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.name
        );
      }
    }).catch((err) => {
      console.warn('Initial session check error:', err);
    });

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && isMounted) {
        setIsCloudSynced(true);
        syncSupabaseUser(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.name
        );
      } else if (!session && isMounted) {
        setIsCloudSynced(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [syncSupabaseUser]);

  // KULLANICI GİRİŞİ (SUPABASE AUTH BAĞLANTISI)
  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    soundFx.playClick();
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Lütfen geçerli bir e-posta adresi giriniz.' };
    }
    if (!pass) {
      return { success: false, message: 'Lütfen parolanızı giriniz.' };
    }

    setIsLoading(true);

    // 1. Supabase Yapılandırılmışsa Gerçek Supabase Auth ile Giriş
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: pass,
          });

          if (error) {
            setIsLoading(false);
            return {
              success: false,
              message: error.message === 'Invalid login credentials'
                ? 'Geçersiz e-posta veya parola. Lütfen bilgilerinizi kontrol ediniz.'
                : error.message,
            };
          }

          if (data.user) {
            await syncSupabaseUser(
              data.user.id,
              data.user.email || email,
              data.user.user_metadata?.name
            );
            soundFx.playSuccess();
            setIsLoading(false);
            return { success: true };
          }
        } catch (e: unknown) {
          console.warn('Supabase sign-in exception:', e);
          setIsLoading(false);
          const msg = e instanceof Error ? e.message : 'Bağlantı sırasında bir hata oluştu.';
          return { success: false, message: msg };
        }
      }
    }

    // 2. Yedekleme (Fallback): Supabase anahtarları henüz tanımlanmadıysa yerel oturum aç
    const loggedUser: UserProfile = {
      ...DEFAULT_DEMO_USER,
      email: email.trim(),
      name: email.split('@')[0].toUpperCase(),
    };

    saveUserToStorage(loggedUser);
    soundFx.playSuccess();
    setIsLoading(false);
    return { success: true };
  };

  // KULLANICI KAYDI (SUPABASE AUTH & PROFILES BAĞLANTISI)
  const register = async (name: string, email: string, pass: string, phone: string) => {
    soundFx.playClick();
    if (!name.trim() || !email.includes('@') || !pass) {
      return { success: false, message: 'Lütfen tüm zorunlu alanları doldurunuz.' };
    }
    if (pass.length < 6) {
      return { success: false, message: 'Parolanız en az 6 karakter olmalıdır.' };
    }

    setIsLoading(true);

    // 1. Supabase Yapılandırılmışsa Gerçek Supabase Auth & Tablo Kaydı
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: pass,
            options: {
              data: {
                name: name.trim(),
                phone: phone.trim(),
              },
            },
          });

          if (error) {
            setIsLoading(false);
            return { success: false, message: error.message };
          }

          if (data.user) {
            setIsCloudSynced(true);

            // Supabase 'profiles' tablosuna koleksiyoner kaydını ekle
            try {
              await supabase.from('profiles').upsert({
                id: data.user.id,
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                city: 'İstanbul, TR',
                member_since: '2026',
                membership_tier: 'Koleksiyoner Üye',
                saved_artworks: ['selflove'],
              });
            } catch (profileErr) {
              console.warn('Profile upsert warning:', profileErr);
            }

            const newUser: UserProfile = {
              id: data.user.id,
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
            setIsLoading(false);
            return { success: true };
          }
        } catch (e: unknown) {
          console.warn('Supabase registration exception:', e);
          setIsLoading(false);
          const msg = e instanceof Error ? e.message : 'Kayıt sırasında bir hata oluştu.';
          return { success: false, message: msg };
        }
      }
    }

    // 2. Yedekleme (Fallback): Yerel profil kaydı
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
    setIsLoading(false);
    return { success: true };
  };

  const demoLogin = () => {
    soundFx.playClick();
    saveUserToStorage(DEFAULT_DEMO_USER);
    soundFx.playSuccess();
  };

  const logout = async () => {
    soundFx.playClick();
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn('Supabase signOut error:', e);
        }
      }
    }
    setIsCloudSynced(false);
    saveUserToStorage(null);
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    soundFx.playClick();
    if (!user) return;
    const updated = { ...user, ...updatedData };
    saveUserToStorage(updated);

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('profiles').update({
            name: updated.name,
            phone: updated.phone,
            city: updated.city,
          }).eq('id', user.id);
        } catch (err) {
          console.warn('Supabase profile update failed:', err);
        }
      }
    }
    soundFx.playSuccess();
  };

  const cancelReservation = async (reservationId: string) => {
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

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', reservationId);
        } catch (err) {
          console.warn('Supabase reservation cancellation failed:', err);
        }
      }
    }
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
      saveUserToStorage(updatedUser);

      // Supabase rezervasyon senkronizasyonu
      if (isSupabaseConfigured()) {
        const supabase = getSupabase();
        if (supabase) {
          supabase.from('reservations').insert({
            id: newRes.id,
            user_id: targetUser.id,
            workshop_id: newRes.workshopId,
            workshop_title: newRes.workshopTitle,
            workshop_date: newRes.workshopDate,
            workshop_time: newRes.workshopTime,
            location: newRes.location,
            instructor: newRes.instructor,
            seat_count: newRes.seatCount,
            total_price: newRes.totalPrice,
            ticket_code: newRes.ticketCode,
            status: 'confirmed',
          }).then(({ error }) => {
            if (error) console.warn('Supabase reservation insert error:', error);
          });
        }
      }

      return updatedUser;
    });

    return newRes;
  }, [saveUserToStorage]);

  const toggleSaveArtwork = (artworkId: string) => {
    soundFx.playClick();
    if (!user) return;
    const isSaved = user.savedArtworkIds.includes(artworkId);
    const updatedSaved = isSaved
      ? user.savedArtworkIds.filter((id) => id !== artworkId)
      : [...user.savedArtworkIds, artworkId];

    const updatedUser = { ...user, savedArtworkIds: updatedSaved };
    saveUserToStorage(updatedUser);

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('profiles').update({
          saved_artworks: updatedSaved,
        }).eq('id', user.id).then(({ error }) => {
          if (error) console.warn('Supabase save artwork error:', error);
        });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isCloudSynced,
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
