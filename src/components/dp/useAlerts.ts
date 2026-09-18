import { useEffect, useState } from "react";
import { loadScans, type Scan } from "@/lib/designpulse";

export type Alert = {
  id: string;
  message: string;
  tone: "error" | "warning" | "success" | "info";
};

export function buildAlerts(scans: Scan[]): Alert[] {
  const latest = scans[0];
  if (!latest) return [];
  const alerts: Alert[] = [
    { id: `${latest.id}-report`, message: `Report completed for ${latest.url}`, tone: "success" },
  ];
  if (latest.driftLevel !== "none")
    alerts.push({
      id: `${latest.id}-drift`,
      message: `UI drift detected (${latest.driftLevel}) on ${latest.url}`,
      tone: "warning",
    });
  if (latest.score < 80)
    alerts.push({
      id: `${latest.id}-score`,
      message: `Consistency score below 80% (${latest.score}%)`,
      tone: "error",
    });
  if (latest.drift.newColors.length)
    alerts.push({
      id: `${latest.id}-colors`,
      message: `${latest.drift.newColors.length} new colors added since last scan`,
      tone: "warning",
    });
  if (latest.drift.fontsChanged.length)
    alerts.push({ id: `${latest.id}-fonts`, message: "Typography changed since last scan", tone: "warning" });
  if (latest.drift.layoutChanged.length)
    alerts.push({ id: `${latest.id}-layout`, message: "Layout changed since last scan", tone: "info" });
  return alerts;
}

export function useScans() {
  const [scans, setScans] = useState<Scan[]>([]);
  useEffect(() => {
    const sync = () => setScans(loadScans());
    sync();
    window.addEventListener("designpulse:scans", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("designpulse:scans", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return scans;
}

export function useAlerts() {
  const scans = useScans();
  return buildAlerts(scans);
}