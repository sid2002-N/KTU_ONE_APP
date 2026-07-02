"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, User, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SketchNotebook, SketchPencil } from "@/components/ui-custom/sketch-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavStore } from "@/store/nav-store";
import { useAuthStore } from "@/store/auth-store";
import { getStudentService } from "@/lib/providers/student";
import { getAnalyticsProvider } from "@/lib/providers/analytics";
import { getNotificationProvider } from "@/lib/providers/notification";
import { APP_NAME, UNIVERSITY_NAME } from "@/lib/constants";
import type { StudentProfile } from "@/lib/types";

export function LoginDialog() {
  const open = useNavStore((s) => s.loginOpen);
  const setOpen = useNavStore((s) => s.setLoginOpen);
  const setSession = useAuthStore((s) => s.setSession);
  const setProfile = useAuthStore((s) => s.setProfile);
  const prefersReduced = useReducedMotion();

  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await getStudentService().login({
        registerNumber,
        password,
      });
      const session = {
        studentId: res.student.id,
        registerNumber: res.student.registerNumber,
        name: res.student.name,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        expiresAt: Date.now() + res.expiresIn * 1000,
        issuedAt: Date.now(),
      };
      setSession(session);
      // Fetch full profile via StudentService (mock returns MOCK_STUDENT)
      const profile = await getStudentService().getProfile();
      setProfile(profile satisfies StudentProfile);
      getAnalyticsProvider().track({
        name: "login_succeeded",
        props: { registerNumber },
      });
      getNotificationProvider().show({
        kind: "success",
        title: `Welcome, ${res.student.name.split(" ")[0]}!`,
        message: "You're signed in.",
      });
      setOpen(false);
      setPassword("");
    } catch (err) {
      // Branch on the BFF error code to show actionable messages
      const code =
        err && typeof err === "object" && "code" in err
          ? (err as { code: string }).code
          : "UNKNOWN";
      const rawMessage =
        err instanceof Error ? err.message : "Login failed. Try again.";

      let friendlyMessage: string;
      let friendlyHint: string | undefined;

      switch (code) {
        case "AUTH_FAILED":
          friendlyMessage = "Invalid register number or password.";
          friendlyHint = "Double-check your KTU portal credentials and try again.";
          break;
        case "SCRAPE_FAILED":
          friendlyMessage = "KTU's portal is unavailable right now.";
          friendlyHint =
            "We couldn't reach app.ktu.edu.in. This is usually temporary — try again in a few minutes.";
          break;
        case "SCRAPER_UNAVAILABLE":
          friendlyMessage = "Our backend couldn't be reached.";
          friendlyHint = "Network issue between KTU One and the scraper. Try again shortly.";
          break;
        case "VALIDATION_FAILED":
          friendlyMessage = rawMessage;
          break;
        default:
          friendlyMessage = rawMessage;
      }

      setError(friendlyHint ? `${friendlyMessage}\n${friendlyHint}` : friendlyMessage);
      getAnalyticsProvider().track({
        name: "login_failed",
        props: { reason: code },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && setOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-md glass-strong rounded-3xl shadow-floating overflow-hidden"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <button
              onClick={() => !loading && setOpen(false)}
              className="absolute top-4 right-4 size-9 rounded-xl hover:bg-secondary flex items-center justify-center z-10"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            <div className="p-8 pt-10">
              {/* Hero — editorial illustration */}
              <div className="flex flex-col items-center text-center mb-6">
                <Logo size={48} />
                <div className="flex items-end gap-1 mt-5">
                  <SketchNotebook size={72} color="plum" />
                  <div className="-ml-2 -mb-1">
                    <SketchPencil size={32} color="amber" />
                  </div>
                </div>
                <h2 className="font-serif-display text-2xl tracking-tight mt-4">
                  Welcome to {APP_NAME}
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xs italic">
                  Sign in with your KTU credentials to sync your CGPA, results and attendance.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="reg-no" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Register Number
                  </Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="reg-no"
                      value={registerNumber}
                      onChange={(e) => setRegisterNumber(e.target.value)}
                      placeholder="e.g. TVE21CS001"
                      autoCapitalize="characters"
                      autoCorrect="off"
                      required
                      className="pl-10 h-12 bg-background"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pwd" className="text-xs uppercase tracking-wider text-muted-foreground">
                    KTU Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="pwd"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your KTU portal password"
                      required
                      className="pl-10 pr-10 h-12 bg-background"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"
                  >
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      {error.split("\n").map((line, i) => (
                        <span key={i} className={i === 1 ? "text-xs opacity-80" : ""}>
                          {line}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !registerNumber || password.length < 3}
                  className="w-full h-12 rounded-full shadow-soft text-base font-semibold"
                >
                  {loading ? (
                    <>
                      <span className="size-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="size-4 mr-2" />
                      Sign in
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-5 p-3 rounded-xl bg-secondary/40 text-[11px] text-muted-foreground text-center leading-relaxed">
                We never store your KTU password. Credentials are sent securely to our
                backend, exchanged for a session token, then discarded.
              </div>

              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                Not affiliated with {UNIVERSITY_NAME}.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
