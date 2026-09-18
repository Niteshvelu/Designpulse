import { useCallback, useEffect, useState } from "react";

export type DpSettings = {
  allowedColors: string;
  allowedFonts: string;
  spacingRule: number;
  borderRadius: number;
  buttonStyle: "solid" | "outline" | "soft";
  notifyDrift: boolean;
  notifyLowScore: boolean;
  notifyNewColors: boolean;
  notifyTypography: boolean;
  notifyLayout: boolean;
  notifyReport: boolean;
};

export const DEFAULT_SETTINGS: DpSettings = {
  allowedColors: "#2563EB, #1E293B, #16A34A, #F59E0B, #DC2626, #F8FAFC",
  allowedFonts: "Space Grotesk, Plus Jakarta Sans, JetBrains Mono",
  spacingRule: 4,
  borderRadius: 12,
  buttonStyle: "solid",
  notifyDrift: true,
  notifyLowScore: true,
  notifyNewColors: true,
  notifyTypography: true,
  notifyLayout: false,
  notifyReport: true,
};

const KEY = "designpulse:settings";

export function useSettings() {
  const [settings, setSettings] = useState<DpSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as DpSettings) });
    } catch {
      /* ignore */
    }
  }, []);

  const update = useCallback(<K extends keyof DpSettings>(key: K, value: DpSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      window.localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    window.localStorage.setItem(KEY, JSON.stringify(DEFAULT_SETTINGS));
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, update, reset };
}
