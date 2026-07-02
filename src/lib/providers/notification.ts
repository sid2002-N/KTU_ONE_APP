/**
 * NotificationProvider — abstracts toasts/snackbars/push notifications.
 *
 * MVP: Uses shadcn/ui sonner toaster.
 * Future: Firebase Cloud Messaging (push), local scheduled notifications.
 */

import { toast } from "sonner";
import type { NotificationKind } from "@/lib/types";

export interface NotificationInput {
  kind?: NotificationKind;
  title: string;
  message?: string;
  duration?: number; // ms; 0 = sticky
  action?: { label: string; onClick: () => void };
}

export interface NotificationProvider {
  show(input: NotificationInput): void;
  dismissAll(): void;
}

class SonnerNotificationProvider implements NotificationProvider {
  show(input: NotificationInput) {
    const { kind = "info", title, message, duration = 4000, action } = input;
    const variant =
      kind === "success"
        ? "success"
        : kind === "warning"
          ? "warning"
          : kind === "error"
            ? "error"
            : "info";
    toast[variant === "info" ? "info" : variant](title, {
      description: message,
      duration: duration === 0 ? undefined : duration,
      action: action
        ? { label: action.label, onClick: action.onClick }
        : undefined,
    });
  }

  dismissAll() {
    toast.dismiss();
  }
}

let _instance: NotificationProvider | null = null;

export function getNotificationProvider(): NotificationProvider {
  if (!_instance) _instance = new SonnerNotificationProvider();
  return _instance;
}

export function __setNotificationProvider(p: NotificationProvider) {
  _instance = p;
}
