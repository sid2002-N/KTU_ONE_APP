"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Heart,
  Info,
  MessageSquare,
  Shield,
  FileText,
  ChevronRight,
  Github,
  Sparkles,
  Languages,
  Vibrate,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui-custom/glass-card";
import { HandwrittenText } from "@/components/ui-custom/handwritten-text";
import { SketchHeart, SketchNotebook, SketchPencil } from "@/components/ui-custom/sketch-elements";
import { BannerAd } from "@/components/ui-custom/banner-ad";
import { useThemeStore } from "@/store/theme-store";
import { useSupporterStore } from "@/store/supporter-store";
import { useNavStore } from "@/store/nav-store";
import { getAnalyticsProvider } from "@/lib/providers/analytics";
import { getNotificationProvider } from "@/lib/providers/notification";
import { APP_VERSION, UNIVERSITY_NAME, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Settings() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const resolved = useThemeStore((s) => s.resolved);
  const isSupporter = useSupporterStore((s) => s.isSupporter);
  const setSupportOpen = useNavStore((s) => s.setSupportOpen);
  const prefersReduced = useReducedMotion();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Personalise KTU One, manage your account and find help."
        icon={<SettingsIcon className="size-5" />}
      />

      <div className="space-y-6">
        {/* Supporter status — kraft paper card (warm brown paper feel) */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isSupporter ? (
            <GlassCard variant="kraft" className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-soft">
                  <Sparkles className="size-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif-display text-base">You're a Lifetime Supporter</p>
                  <p className="text-xs text-foreground/70 mt-0.5 italic">
                    Ads are removed forever. Thank you 💜
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium shrink-0">
                  Active
                </span>
              </div>
            </GlassCard>
          ) : (
            <GlassCard variant="kraft" className="p-5 sm:p-6 relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <SketchHeart size={48} color="coral" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif-display text-base">Support KTU One</p>
                  <p className="text-xs text-foreground/70 mt-0.5 italic">
                    Remove ads · ₹99 lifetime · support development
                  </p>
                </div>
                <button
                  onClick={() => setSupportOpen(true)}
                  className="btn-tactile px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition shadow-soft flex items-center gap-1.5 shrink-0"
                >
                  <Heart className="size-3.5" fill="currentColor" />
                  Support
                </button>
              </div>
            </GlassCard>
          )}
        </motion.div>

        {/* Appearance */}
        <SettingsGroup title="Appearance" accent="make it yours">
          <SettingsRow label="Theme" description="Switch between light, dark, or system.">
            <PillToggle
              options={[
                { value: "light", label: "Light", icon: <Sun className="size-3.5" /> },
                { value: "dark", label: "Dark", icon: <Moon className="size-3.5" /> },
                { value: "system", label: "System", icon: <Monitor className="size-3.5" /> },
              ]}
              value={mode}
              onChange={(m) => {
                setMode(m as "light" | "dark" | "system");
                getAnalyticsProvider().track({
                  name: "theme_changed",
                  props: { theme: m },
                });
              }}
            />
          </SettingsRow>
          <SettingsRow label="Current" description={`Currently rendering as ${resolved}.`}>
            <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
              {resolved === "dark" ? "Dark" : "Light"}
            </span>
          </SettingsRow>
        </SettingsGroup>

        {/* Preferences */}
        <SettingsGroup title="Preferences" accent="tune it!">
          <SettingsRow label="Language" description="Currently English. Malayalam coming soon.">
            <Languages className="size-4 text-muted-foreground" />
          </SettingsRow>
          <SettingsRow label="Haptics" description="Vibrate on interactions (mobile only).">
            <PillToggle
              options={[
                { value: "on", label: "On" },
                { value: "off", label: "Off" },
              ]}
              defaultValue="on"
            />
          </SettingsRow>
          <SettingsRow label="Reduced motion" description="Respect system reduced-motion.">
            <PillToggle
              options={[
                { value: "on", label: "On" },
                { value: "off", label: "Off" },
              ]}
              defaultValue="on"
            />
          </SettingsRow>
        </SettingsGroup>

        {/* About */}
        <SettingsGroup title="About" accent="the details">
          <SettingsRow label="App version" description={`KTU One v${APP_VERSION}`}>
            <span className="text-xs text-muted-foreground font-mono">{APP_VERSION}</span>
          </SettingsRow>
          <SettingsRow label="University" description={UNIVERSITY_NAME}>
            <span className="text-xs text-muted-foreground">KTU</span>
          </SettingsRow>
          <button
            onClick={() =>
              getNotificationProvider().show({
                kind: "info",
                title: "KTU One",
                message: "An independent project. Not affiliated with KTU.",
              })
            }
            className="w-full"
          >
            <SettingsRow label="Disclaimer" description="KTU One is an independent student companion." chevron />
          </button>
        </SettingsGroup>

        {/* Help & feedback */}
        <SettingsGroup title="Help & feedback" accent="say hi!">
          <button
            onClick={() =>
              getNotificationProvider().show({
                kind: "info",
                title: "Feedback form",
                message: "Coming soon — for now, ping us at hello@ktuone.in",
              })
            }
            className="w-full"
          >
            <SettingsRow label="Send feedback" description="Suggest features or report issues." chevron />
          </button>
          <button className="w-full">
            <SettingsRow label="Rate KTU One" description="Help others discover the app." chevron />
          </button>
          <button className="w-full">
            <SettingsRow label="Share with friends" description="Spread the word." chevron />
          </button>
        </SettingsGroup>

        {/* Legal */}
        <SettingsGroup title="Legal" accent="the fine print">
          <button className="w-full">
            <SettingsRow label="Privacy policy" description="How we handle your data." chevron icon={<FileText className="size-4" />} />
          </button>
          <button className="w-full">
            <SettingsRow label="Terms of service" description="The rules of using KTU One." chevron icon={<FileText className="size-4" />} />
          </button>
          <a
            href="#"
            className="w-full"
            onClick={(e) => e.preventDefault()}
          >
            <SettingsRow label="Open source" description="Built with open-source tools." chevron icon={<Github className="size-4" />} />
          </a>
        </SettingsGroup>

        {!isSupporter && (
          <BannerAd slot="settings-top" />
        )}

        {/* Footer — notebook colophon with SketchNotebook illustration */}
        <div className="text-center py-8">
          <div className="flex items-end justify-center gap-1 mb-3">
            <SketchNotebook size={56} color="plum" />
            <div className="-ml-2 -mb-0.5">
              <SketchPencil size={30} color="amber" />
            </div>
          </div>
          <HandwrittenText as="p" color="amber" className="text-xl rotate-[-2deg] inline-block mb-1.5">
            made with 💜 for KTU students
          </HandwrittenText>
          <p className="text-[11px] text-muted-foreground/70 tracking-wide">
            {APP_NAME} · v{APP_VERSION}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * SettingsGroup — paper-card surface with a dashboard-style SectionHeader:
 * vertical margin-line accent + serif title + handwritten accent word.
 */
function SettingsGroup({
  title,
  accent,
  children,
}: {
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard variant="default" className="p-5 sm:p-6">
      {/* SectionHeader — same pattern as the dashboard */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary/50 via-primary/25 to-transparent mt-1" />
        <div>
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h2 className="font-serif-display text-lg tracking-tight">{title}</h2>
            {accent && (
              <HandwrittenText as="span" color="amber" className="text-lg rotate-[-3deg]">
                {accent}
              </HandwrittenText>
            )}
          </div>
        </div>
      </div>
      <div className="divide-y divide-border/40">{children}</div>
    </GlassCard>
  );
}

function SettingsRow({
  label,
  description,
  children,
  chevron,
  icon,
}: {
  label: string;
  description?: string;
  children?: React.ReactNode;
  chevron?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 hover:bg-primary/[0.03] transition rounded-xl px-2 -mx-2">
      <div className="flex items-start gap-3 min-w-0">
        {icon && <span className="text-muted-foreground mt-0.5">{icon}</span>}
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 italic">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {children}
        {chevron && <ChevronRight className="size-4 text-muted-foreground" />}
      </div>
    </div>
  );
}

/**
 * PillToggle — cleaner alternative to a switch. A pill-shaped segmented
 * control with a sliding active background (Framer Motion layoutId) —
 * matches the desktop nav pill animation, so the whole app feels cohesive.
 */
interface PillOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

function PillToggle({
  options,
  value,
  defaultValue,
  onChange,
}: {
  options: PillOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
}) {
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value);
  const selected = value ?? internal;

  const handleSelect = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-secondary/60">
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={cn(
              "btn-tactile relative px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {isActive && (
              <motion.span
                layoutId={`pill-${options.map((o) => o.value).join("-")}`}
                className="absolute inset-0 rounded-full bg-background shadow-soft -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
