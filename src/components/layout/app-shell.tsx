"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Home,
  Calculator,
  FileText,
  BookOpen,
  CalendarDays,
  Bell,
  Settings,
  Search,
  Heart,
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavStore } from "@/store/nav-store";
import { useThemeStore } from "@/store/theme-store";
import { useSupporterStore } from "@/store/supporter-store";
import { useAuthStore } from "@/store/auth-store";
import { NAV_ITEMS, PRIMARY_NAV_KEYS, APP_NAME } from "@/lib/constants";
import type { NavKey } from "@/lib/constants";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { getAnalyticsProvider } from "@/lib/providers/analytics";
import { getStudentService } from "@/lib/providers/student";
import { getNotificationProvider } from "@/lib/providers/notification";
import { ScrollToTop } from "@/components/ui-custom/scroll-to-top";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Calculator,
  FileText,
  BookOpen,
  CalendarDays,
  Bell,
  Settings,
};

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const active = useNavStore((s) => s.active);
  const setActive = useNavStore((s) => s.set);
  const setSearchOpen = useNavStore((s) => s.setSearchOpen);
  const setSupportOpen = useNavStore((s) => s.setSupportOpen);
  const setLoginOpen = useNavStore((s) => s.setLoginOpen);
  const resolved = useThemeStore((s) => s.resolved);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const isSupporter = useSupporterStore((s) => s.isSupporter);
  const profile = useAuthStore((s) => s.profile);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const navigate = (key: NavKey) => {
    setActive(key);
    setMobileMenu(false);
    getAnalyticsProvider().track({
      name: "page_view",
      props: { path: key },
    });
  };

  // Close the profile dropdown on outside pointer / Escape presses.
  useEffect(() => {
    if (!profileMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileMenuOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    try {
      await getStudentService().logout();
    } catch {
      // Swallow — we clear local state regardless.
    }
    useAuthStore.getState().clear();
    getNotificationProvider().show({
      kind: "success",
      title: "Signed out",
      message: "See you soon!",
    });
    navigate("dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top navbar — opaque enough to prevent text bleed-through when scrolling */}
      <header className="sticky top-0 z-40 safe-top">
        <div className="navbar-glass border-b border-border/40">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenu(true)}
                className="lg:hidden size-10 rounded-xl hover:bg-secondary flex items-center justify-center"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
              <button
                onClick={() => navigate("dashboard")}
                className="flex items-center gap-2.5 no-tap-highlight"
              >
                <Logo size={32} withWordmark />
              </button>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = ICONS[item.icon] ?? Home;
                const isActive = active === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.key)}
                    className={cn(
                      "btn-tactile relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              <kbd
                className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-mono"
                aria-hidden="true"
              >
                ⌘K
              </kbd>
              <button
                onClick={() => setSearchOpen(true)}
                className="size-10 rounded-xl hover:bg-secondary flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="size-5" />
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                  getAnalyticsProvider().track({
                    name: "theme_changed",
                    props: { theme: resolved === "light" ? "dark" : "light" },
                  });
                }}
                className="size-10 rounded-xl hover:bg-secondary flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {resolved === "light" ? (
                  <Moon className="size-5" />
                ) : (
                  <Sun className="size-5" />
                )}
              </button>

              {isSupporter ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Heart className="size-3.5" fill="currentColor" />
                  Supporter
                </div>
              ) : (
                <button
                  onClick={() => setSupportOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition shadow-soft"
                >
                  <Heart className="size-3.5" fill="currentColor" />
                  Support
                </button>
              )}

              {profile ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen((v) => !v)}
                    className="size-9 rounded-full bg-gradient-plum flex items-center justify-center text-white text-xs font-semibold transition hover:opacity-90"
                    aria-label="Open profile menu"
                    aria-haspopup="menu"
                    aria-expanded={profileMenuOpen}
                  >
                    {profile.avatarInitials}
                  </button>
                  {profileMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-60 navbar-glass rounded-2xl shadow-floating border border-border/40 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border/40">
                        <p className="text-sm font-medium truncate">
                          {profile.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {profile.registerNumber}
                        </p>
                      </div>
                      <button
                        role="menuitem"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate("settings");
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary/60 transition text-left"
                      >
                        <Settings className="size-4" />
                        Settings
                      </button>
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary/60 transition text-left text-destructive"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="size-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition"
                  aria-label="Login"
                >
                  <User className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body — sidebar + main */}
      <div className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 flex gap-6 py-6">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = ICONS[item.icon] ?? Home;
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-border/60">
              {!isSupporter && (
                <button
                  onClick={() => setSupportOpen(true)}
                  className="w-full p-3 rounded-2xl bg-gradient-plum text-white text-left hover:opacity-95 transition shadow-soft"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="size-4" fill="currentColor" />
                    <span className="text-sm font-semibold">Support KTU One</span>
                  </div>
                  <p className="text-xs opacity-90">Remove ads · ₹99 lifetime</p>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-6">{children}</main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 safe-bottom">
        <div className="navbar-glass border-t border-border/40 px-2 py-2">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {PRIMARY_NAV_KEYS.map((key) => {
              const item = NAV_ITEMS.find((i) => i.key === key)!;
              const Icon = ICONS[item.icon] ?? Home;
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => navigate(key)}
                  className={cn(
                    "btn-tactile relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-full text-[10px] font-medium transition-colors min-w-[64px]",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {/* Shared-element pill background — slides between tabs */}
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="size-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {mobileMenu && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
            />
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-72 glass-strong p-5 flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-between mb-6">
                <Logo size={32} withWordmark />
                <button
                  onClick={() => setMobileMenu(false)}
                  className="size-9 rounded-xl hover:bg-secondary flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = ICONS[item.icon] ?? Home;
                  const isActive = active === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => navigate(item.key)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary/60",
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              {!isSupporter && (
                <button
                  onClick={() => {
                    setMobileMenu(false);
                    setSupportOpen(true);
                  }}
                  className="mt-auto p-4 rounded-2xl bg-gradient-plum text-white text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="size-4" fill="currentColor" />
                    <span className="text-sm font-semibold">Support KTU One</span>
                  </div>
                  <p className="text-xs opacity-90">Remove ads · ₹99 lifetime</p>
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ScrollToTop />
    </div>
  );
}
