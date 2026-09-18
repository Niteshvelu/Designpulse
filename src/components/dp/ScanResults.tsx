import {
  AlertTriangle,
  Check,
  Palette,
  Type,
  LayoutGrid,
  MousePointerClick,
  Blocks,
  Monitor,
  Tablet,
  Smartphone,
  ArrowRight,
  Minus,
} from "lucide-react";
import type { Scan, Severity, Viewport } from "@/lib/designpulse";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "./ScoreRing";
import { cn } from "@/lib/utils";

function Section({
  title,
  icon: Icon,
  score,
  children,
}: {
  title: string;
  icon: React.ElementType;
  score?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="card-surface animate-rise p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4" />
        </span>
        <h3 className="text-base font-semibold">{title}</h3>
        {score !== undefined && (
          <span className="ml-auto font-display text-sm font-semibold text-primary">{score}%</span>
        )}
      </div>
      {score !== undefined && <Progress value={score} className="mt-3 h-1.5" />}
      <div className="mt-4 space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

const VP_ICON = { Desktop: Monitor, Tablet: Tablet, Mobile: Smartphone } as const;

export function severityBadge(severity: Severity) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        severity === "high" && "border-destructive/40 bg-destructive/10 text-destructive",
        severity === "medium" && "border-warning/40 bg-warning/10 text-warning",
        severity === "low" && "border-border bg-muted text-muted-foreground",
      )}
    >
      {severity}
    </Badge>
  );
}

function ViewportCard({ vp }: { vp: Viewport }) {
  const Icon = VP_ICON[vp.name];
  const tone =
    vp.status === "pass"
      ? "border-success/40 bg-success/10 text-success"
      : vp.status === "warning"
        ? "border-warning/40 bg-warning/10 text-warning"
        : "border-destructive/40 bg-destructive/10 text-destructive";
  const checks = [
    ["Overflow", vp.overflow],
    ["Broken layout", vp.brokenLayout],
    ["Overlapping components", vp.overlapping],
    ["Misaligned elements", vp.misaligned],
  ] as const;

  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-3">
        <Icon className="size-4 text-muted-foreground" />
        <span className="font-semibold">{vp.name}</span>
        <Badge variant="outline" className={cn("ml-auto uppercase", tone)}>
          {vp.status}
        </Badge>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {checks.map(([label, bad]) => (
          <li key={label} className="flex items-center gap-2">
            {bad ? (
              <AlertTriangle className="size-4 text-destructive" />
            ) : (
              <Check className="size-4 text-success" />
            )}
            <span className={bad ? "text-foreground" : "text-muted-foreground"}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DriftPanel({ scan }: { scan: Scan }) {
  const d = scan.drift;
  const groups: { label: string; items: string[]; tone: "added" | "changed" }[] = [
    { label: "New colors added", items: d.newColors, tone: "added" },
    {
      label: "Fonts changed",
      items: d.fontsChanged.map((f) => `${f.from} -> ${f.to}`),
      tone: "changed",
    },
    { label: "Buttons modified", items: d.buttonsModified, tone: "changed" },
    { label: "Spacing changed", items: d.spacingChanged, tone: "changed" },
    { label: "Layout changed", items: d.layoutChanged, tone: "changed" },
    { label: "New components added", items: d.newComponents, tone: "added" },
  ];

  return (
    <div className="card-surface p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-base font-semibold">UI Drift Detection</h3>
        <Badge
          variant="outline"
          className={cn(
            "uppercase",
            scan.driftLevel === "none" && "border-success/40 bg-success/10 text-success",
            scan.driftLevel === "minor" && "border-warning/40 bg-warning/10 text-warning",
            scan.driftLevel === "major" &&
              "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          {scan.driftLevel} drift
        </Badge>
        <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          Previous scan <ArrowRight className="size-3" /> Current scan
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {groups.map((g) => (
          <div key={g.label} className="rounded-xl border border-border bg-muted/30 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {g.label}
            </p>
            {g.items.length === 0 ? (
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Minus className="size-3" /> No change
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1 text-sm",
                      g.tone === "added"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {g.label === "New colors added" && (
                      <span
                        className="size-3 rounded-full border border-border"
                        style={{ background: item }}
                      />
                    )}
                    <span className="font-mono text-xs">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScanResults({ scan }: { scan: Scan }) {
  return (
    <div className="space-y-6">
      <div className="card-surface flex flex-wrap items-center gap-8 p-6">
        <ScoreRing score={scan.score} size={168} />
        <div className="min-w-56 flex-1 space-y-2 text-sm">
          <Row label="Website" value={<span className="font-mono text-xs">{scan.url}</span>} />
          <Row label="Scan date" value={new Date(scan.date).toLocaleString()} />
          <Row label="Detected issues" value={scan.issuesCount} />
          <Row label="UI drift" value={<span className="capitalize">{scan.driftLevel}</span>} />
          <Row label="Reusable components" value={`${scan.components.reusable}%`} />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3 text-center">
          {(
            [
              ["Color", scan.colors.score],
              ["Typography", scan.typography.score],
              ["Layout", scan.layout.score],
              ["Buttons", scan.buttons.score],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-muted/30 p-3">
              <p className="font-display text-xl font-semibold">{value}%</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Color Analysis" icon={Palette} score={scan.colors.score}>
          <Row label="Total colors used" value={scan.colors.total} />
          <Row label="Duplicate colors" value={scan.colors.duplicates} />
          <Row label="Invalid colors" value={scan.colors.invalid} />
          <div className="flex flex-wrap gap-2 pt-1">
            {scan.colors.palette.map((c) => (
              <span
                key={c}
                title={c}
                className="size-8 rounded-lg border border-border shadow-soft"
                style={{ background: c }}
              />
            ))}
          </div>
        </Section>

        <Section title="Typography Analysis" icon={Type} score={scan.typography.score}>
          <Row label="Font families" value={scan.typography.families.join(", ")} />
          <Row label="Font sizes" value={scan.typography.sizes.map((s) => `${s}px`).join(" / ")} />
          <Row label="Heading consistency" value={`${scan.typography.headingConsistency}%`} />
          <Row label="Line heights" value={scan.typography.lineHeights.join(" / ")} />
          <Row label="Letter spacing" value={scan.typography.letterSpacing.join(" / ")} />
        </Section>

        <Section title="Layout Analysis" icon={LayoutGrid} score={scan.layout.score}>
          <Row label="Distinct margins" value={scan.layout.margins} />
          <Row label="Distinct paddings" value={scan.layout.padding} />
          <Row label="Alignment" value={`${scan.layout.alignment}%`} />
          <Row label="Grid structure" value={scan.layout.gridStructure} />
          <Row label="Containers" value={scan.layout.containers} />
          <Row label="Responsive layout" value={`${scan.layout.responsive}%`} />
        </Section>

        <Section title="Button Analysis" icon={MousePointerClick} score={scan.buttons.score}>
          <Row label="Primary buttons" value={scan.buttons.primary} />
          <Row label="Secondary buttons" value={scan.buttons.secondary} />
          <Row label="Border radius values" value={scan.buttons.radii.join(" / ")} />
          <Row label="With hover effects" value={`${scan.buttons.hoverEffects}%`} />
        </Section>

        <Section title="Component Analysis" icon={Blocks}>
          <Row label="Cards" value={scan.components.cards} />
          <Row label="Forms" value={scan.components.forms} />
          <Row label="Navigation" value={scan.components.navigation} />
          <Row label="Tables" value={scan.components.tables} />
          <Row label="Icons" value={scan.components.icons} />
          <Row label="Reusable components" value={`${scan.components.reusable}%`} />
        </Section>

        <Section title="Detected Issues" icon={AlertTriangle}>
          <ul className="space-y-3">
            {scan.issues.map((issue) => (
              <li key={issue.id} className="rounded-xl border border-border bg-muted/30 p-3">
                <div className="flex items-start gap-2">
                  {severityBadge(issue.severity)}
                  <p className="font-medium">{issue.title}</p>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{issue.recommendation}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold">Responsive Design Validation</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {scan.viewports.map((vp) => (
            <ViewportCard key={vp.name} vp={vp} />
          ))}
        </div>
      </div>

      <DriftPanel scan={scan} />
    </div>
  );
}
