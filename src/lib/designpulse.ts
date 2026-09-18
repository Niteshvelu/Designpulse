export type Severity = "high" | "medium" | "low";

export type Issue = {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  recommendation: string;
};

export type Viewport = {
  name: "Desktop" | "Tablet" | "Mobile";
  status: "pass" | "warning" | "fail";
  overflow: boolean;
  brokenLayout: boolean;
  overlapping: boolean;
  misaligned: boolean;
};

export type Scan = {
  id: string;
  url: string;
  date: string;
  score: number;
  issuesCount: number;
  driftLevel: "none" | "minor" | "major";
  status: "completed";
  colors: {
    total: number;
    duplicates: number;
    invalid: number;
    palette: string[];
    score: number;
  };
  typography: {
    families: string[];
    sizes: number[];
    headingConsistency: number;
    lineHeights: string[];
    letterSpacing: string[];
    score: number;
  };
  layout: {
    margins: number;
    padding: number;
    alignment: number;
    gridStructure: string;
    containers: number;
    responsive: number;
    score: number;
  };
  buttons: {
    primary: number;
    secondary: number;
    radii: string[];
    hoverEffects: number;
    score: number;
  };
  components: {
    cards: number;
    forms: number;
    navigation: number;
    tables: number;
    icons: number;
    reusable: number;
  };
  viewports: Viewport[];
  issues: Issue[];
  drift: DriftReport;
  trend: { label: string; score: number; drift: number }[];
};

export type DriftReport = {
  newColors: string[];
  fontsChanged: { from: string; to: string }[];
  buttonsModified: string[];
  spacingChanged: string[];
  layoutChanged: string[];
  newComponents: string[];
};

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const HUES = [221, 217, 262, 199, 160, 32, 12, 280];

export function scoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 65) return "Average";
  return "Needs Improvement";
}

export const ANALYSIS_STEPS = [
  "Extracting HTML...",
  "Loading CSS...",
  "Checking Colors...",
  "Checking Typography...",
  "Checking Layout...",
  "Checking Components...",
  "Detecting UI Drift...",
  "Generating Report...",
];

const FONTS = [
  "Plus Jakarta Sans",
  "Inter",
  "Roboto",
  "Georgia",
  "system-ui",
  "Helvetica Neue",
  "Poppins",
];

const ISSUE_POOL: Omit<Issue, "id">[] = [
  {
    title: "Duplicate color values across components",
    category: "Color",
    severity: "medium",
    recommendation: "Consolidate near-identical hex values into semantic design tokens.",
  },
  {
    title: "Hard-coded hex colors outside the design system",
    category: "Color",
    severity: "high",
    recommendation: "Replace raw hex values with tokens such as --primary or --muted.",
  },
  {
    title: "Too many distinct font sizes in use",
    category: "Typography",
    severity: "medium",
    recommendation: "Reduce to a modular type scale of 6–8 steps.",
  },
  {
    title: "Heading hierarchy skips levels (h2 → h4)",
    category: "Typography",
    severity: "high",
    recommendation: "Keep heading levels sequential for accessibility and rhythm.",
  },
  {
    title: "Inconsistent border radius on buttons",
    category: "Buttons",
    severity: "low",
    recommendation: "Standardise on a single radius token (12px).",
  },
  {
    title: "Buttons missing hover / focus states",
    category: "Buttons",
    severity: "medium",
    recommendation: "Add visible hover and focus-visible states to all interactive elements.",
  },
  {
    title: "Horizontal overflow detected at 375px",
    category: "Responsive",
    severity: "high",
    recommendation: "Constrain fixed-width elements and allow content to wrap.",
  },
  {
    title: "Non-standard spacing values (13px, 27px)",
    category: "Layout",
    severity: "low",
    recommendation: "Snap spacing to a 4px baseline grid.",
  },
  {
    title: "Card components duplicated instead of reused",
    category: "Components",
    severity: "medium",
    recommendation: "Extract a shared Card component with variants.",
  },
  {
    title: "Low text contrast on muted surfaces",
    category: "Accessibility",
    severity: "high",
    recommendation: "Raise contrast to at least 4.5:1 for body copy.",
  },
  {
    title: "Grid columns misaligned between sections",
    category: "Layout",
    severity: "medium",
    recommendation: "Use one container width and grid definition across sections.",
  },
];

export function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function analyze(url: string, previous?: Scan): Scan {
  const seed = hash(url + (previous ? previous.id : ""));
  const r = rng(seed);
  const pick = <T,>(arr: T[], n: number) =>
    [...arr].sort(() => r() - 0.5).slice(0, Math.max(1, n));

  const colorScore = 62 + Math.floor(r() * 36);
  const typoScore = 60 + Math.floor(r() * 38);
  const layoutScore = 64 + Math.floor(r() * 34);
  const buttonScore = 66 + Math.floor(r() * 32);
  const score = Math.round((colorScore + typoScore + layoutScore + buttonScore) / 4);

  const palette = pick(HUES, 5 + Math.floor(r() * 3)).map(
    (h) => `oklch(${(0.5 + r() * 0.35).toFixed(3)} ${(0.05 + r() * 0.16).toFixed(3)} ${h})`,
  );

  const issues: Issue[] = pick(ISSUE_POOL, 4 + Math.floor(r() * 5)).map((i, idx) => ({
    ...i,
    id: `${seed}-${idx}`,
  }));

  const statuses: Viewport["status"][] = ["pass", "warning", "fail"];
  const viewports: Viewport[] = (["Desktop", "Tablet", "Mobile"] as const).map((name, i) => {
    const status = statuses[Math.min(2, Math.floor(r() * (i + 1.6)))] ?? "pass";
    return {
      name,
      status,
      overflow: status !== "pass" && r() > 0.4,
      brokenLayout: status === "fail" && r() > 0.5,
      overlapping: status !== "pass" && r() > 0.6,
      misaligned: r() > 0.55,
    };
  });

  const drift: DriftReport = previous
    ? {
        newColors: pick(palette, 1 + Math.floor(r() * 2)),
        fontsChanged:
          r() > 0.5
            ? [
                {
                  from: previous.typography.families[0] ?? "Inter",
                  to: FONTS[Math.floor(r() * FONTS.length)] ?? "Inter",
                },
              ]
            : [],
        buttonsModified: r() > 0.4 ? ["Primary radius 8px → 12px", "Secondary border removed"] : [],
        spacingChanged: r() > 0.5 ? ["Section padding 64px → 80px"] : [],
        layoutChanged: r() > 0.6 ? ["Hero switched to 2-column grid"] : [],
        newComponents: r() > 0.5 ? ["Toast", "Stat card"] : [],
      }
    : {
        newColors: [],
        fontsChanged: [],
        buttonsModified: [],
        spacingChanged: [],
        layoutChanged: [],
        newComponents: [],
      };

  const driftCount =
    drift.newColors.length +
    drift.fontsChanged.length +
    drift.buttonsModified.length +
    drift.spacingChanged.length +
    drift.layoutChanged.length +
    drift.newComponents.length;

  const trend = Array.from({ length: 7 }).map((_, i) => ({
    label: `Scan ${i + 1}`,
    score: Math.max(45, Math.min(99, score - 12 + Math.floor(r() * 20) + i)),
    drift: Math.floor(r() * 9),
  }));

  return {
    id: `${Date.now()}-${seed}`,
    url,
    date: new Date().toISOString(),
    score,
    issuesCount: issues.length,
    driftLevel: (driftCount === 0 ? "none" : driftCount > 4 ? "major" : "minor") as Scan["driftLevel"],
    status: "completed",
    colors: {
      total: palette.length + 6 + Math.floor(r() * 20),
      duplicates: Math.floor(r() * 7),
      invalid: Math.floor(r() * 3),
      palette,
      score: colorScore,
    },
    typography: {
      families: pick(FONTS, 2 + Math.floor(r() * 3)),
      sizes: pick([12, 13, 14, 16, 18, 20, 24, 30, 36, 48, 60], 5 + Math.floor(r() * 4)).sort(
        (a, b) => a - b,
      ),
      headingConsistency: 55 + Math.floor(r() * 45),
      lineHeights: pick(["1.2", "1.35", "1.5", "1.65", "normal"], 3),
      letterSpacing: pick(["-0.02em", "0", "0.01em", "0.05em"], 2),
      score: typoScore,
    },
    layout: {
      margins: 4 + Math.floor(r() * 8),
      padding: 5 + Math.floor(r() * 9),
      alignment: 60 + Math.floor(r() * 40),
      gridStructure: r() > 0.5 ? "12-column grid" : "Flex + ad-hoc grid",
      containers: 2 + Math.floor(r() * 4),
      responsive: 60 + Math.floor(r() * 40),
      score: layoutScore,
    },
    buttons: {
      primary: 1 + Math.floor(r() * 4),
      secondary: 1 + Math.floor(r() * 5),
      radii: pick(["4px", "8px", "12px", "9999px"], 2),
      hoverEffects: 40 + Math.floor(r() * 60),
      score: buttonScore,
    },
    components: {
      cards: 3 + Math.floor(r() * 14),
      forms: Math.floor(r() * 6),
      navigation: 1 + Math.floor(r() * 3),
      tables: Math.floor(r() * 4),
      icons: 6 + Math.floor(r() * 30),
      reusable: 40 + Math.floor(r() * 55),
    },
    viewports,
    issues,
    drift,
    trend,
  };
}

const KEY = "designpulse:scans";

export function loadScans(): Scan[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Scan[];
  } catch {
    return [];
  }
}

export function saveScan(scan: Scan) {
  const scans = [scan, ...loadScans()].slice(0, 40);
  window.localStorage.setItem(KEY, JSON.stringify(scans));
  window.dispatchEvent(new Event("designpulse:scans"));
  return scans;
}

export function deleteScan(id: string) {
  const scans = loadScans().filter((s) => s.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(scans));
  window.dispatchEvent(new Event("designpulse:scans"));
  return scans;
}

export function severityWeight(s: Severity) {
  return s === "high" ? 3 : s === "medium" ? 2 : 1;
}