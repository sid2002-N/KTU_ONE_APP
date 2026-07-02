"use client";

import { create } from "zustand";
import type { NavKey } from "@/lib/constants";

interface NavState {
  active: NavKey;
  searchOpen: boolean;
  supportOpen: boolean;
  loginOpen: boolean;
  set: (key: NavKey) => void;
  setSearchOpen: (open: boolean) => void;
  setSupportOpen: (open: boolean) => void;
  setLoginOpen: (open: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
  active: "dashboard",
  searchOpen: false,
  supportOpen: false,
  loginOpen: false,
  set: (active) => set({ active }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setSupportOpen: (supportOpen) => set({ supportOpen }),
  setLoginOpen: (loginOpen) => set({ loginOpen }),
}));
