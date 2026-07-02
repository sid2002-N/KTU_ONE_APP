"use client";

import { create } from "zustand";
import type { AuthSession, StudentProfile } from "@/lib/types";

interface AuthState {
  session: AuthSession | null;
  profile: StudentProfile | null;
  isInitializing: boolean;
  isAuthenticated: boolean;

  setSession: (session: AuthSession | null) => void;
  setProfile: (profile: StudentProfile | null) => void;
  setInitializing: (v: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  isInitializing: false,
  isAuthenticated: false,

  setSession: (session) =>
    set({
      session,
      isAuthenticated: !!session && session.expiresAt > Date.now(),
    }),
  setProfile: (profile) => set({ profile }),
  setInitializing: (isInitializing) => set({ isInitializing }),
  clear: () =>
    set({
      session: null,
      profile: null,
      isAuthenticated: false,
      isInitializing: false,
    }),
}));
