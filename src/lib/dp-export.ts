import type { Scan } from "./designpulse";

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slug(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-");
}

export function exportJson(scan: Scan) {
  download(`designpulse-${slug(scan.url)}.json`, JSON.stringify(scan, null, 2), "application/json");
}

export function exportCsv(scan: Scan) {
  const rows = [
    ["Website", scan.url],
    ["Scan date", new Date(scan.date).toISOString()],
    ["Consistency score", String(scan.score)],
    ["UI drift", scan.driftLevel],
    ["Color score", String(scan.colors.score)],
    ["Typography score", String(scan.typography.score)],
    ["Layout score", String(scan.layout.score)],
    ["Button score", String(scan.buttons.score)],
    [],
    ["Issue", "Category", "Severity", "Recommendation"],
    ...scan.issues.map((i) => [i.title, i.category, i.severity, i.recommendation]),
  ];
  const csv = rows
    .map((r) => r.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  download(`designpulse-${slug(scan.url)}.csv`, csv, "text/csv");
}

export function printReport() {
  window.print();
}
