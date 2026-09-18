import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Clock,
  FileText,
  Gauge,
  GitCompareArrows,
  Smartphone,
} from "lucide-react";
import { AppShell } from "@/components/dp/AppShell";
import { CountUp } from "@/components/dp/CountUp";
import { ScoreRing } from "@/components/dp/ScoreRing";
import { useScans } from "@/components/dp/useAlerts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ColorDistribution,
  ComponentUsage,
  ConsistencyTrend,
  DriftTrend,
  IssueDistribution,
  LayoutIssues,
  TypographyUsage,
} from "@/components/dp/Charts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — DesignPulse" },
      {
        name: "description",
        content:
          "Track UI consistency scores, design violations, responsive issues and UI drift across all analyzed pages.",
      },
      { property: "og:title", content: "Dashboard — DesignPulse" },
      {
        property: "og:description",
        content: "Live overview of consistency scores, violations and UI drift status.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const scans = useScans();
  const latest = scans[0];

  const stats = [
    {
      label: "Total Pages Analyzed",
      value: scans.length,
      icon: FileText,
      suffix: "",
    },
    {
      label: "UI Consistency Score",
      value: latest?.score ?? 0,
      icon: Gauge,
      suffix: "%",
    },
    {
      label: "Design Violations",
      value: scans.reduce((sum, s) => sum + s.issuesCount, 0),
      icon: AlertTriangle,
      suffix: "",
    },
    {
      label: "Responsive Issues",
      value:
        latest?.viewports.filter((v) => v.status !== "pass").length ?? 0,
      icon: Smartphone,
      suffix: "",
    },
  ];

  return (
    <AppShell
      title="Dashboard"
      description="A live pulse on UI consistency across every page you have scanned."
      actions={
        <>
          <Button asChild>
            <Link to="/analyze">
              <Activity className="size-4" /> New analysis
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/reports">View latest report</Link>
          </Button>
        </>
      }
    >
      {!latest ? (
        <div className="card-surface p-10 text-center">
          <h2 className="text-lg font-semibold">No scans yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Run your first analysis to populate the dashboard with consistency scores, drift status
            and charts.
          </p>
          <Button asChild className="mt-5">
            <Link to="/analyze">Analyze a website</Link>
          </Button>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, suffix }) => (
              <div key={label} className="card-surface animate-rise p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <Icon className="size-4 text-primary" />
                </div>
                <p className="mt-3 font-display text-3xl font-semibold">
                  <CountUp value={value} suffix={suffix} />
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="card-surface flex items-center justify-center p-6">
              <ScoreRing score={latest.score} size={180} />
            </div>
            <div className="card-surface p-5">
              <div className="flex items-center gap-2">
                <GitCompareArrows className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">UI Drift Status</h3>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "mt-4 uppercase",
                  latest.driftLevel === "none" && "border-success/40 bg-success/10 text-success",
                  latest.driftLevel === "minor" && "border-warning/40 bg-warning/10 text-warning",
                  latest.driftLevel === "major" &&
                    "border-destructive/40 bg-destructive/10 text-destructive",
                )}
              >
                {latest.driftLevel} drift
              </Badge>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <li>{latest.drift.newColors.length} new colors</li>
                <li>{latest.drift.fontsChanged.length} font changes</li>
                <li>{latest.drift.buttonsModified.length} button changes</li>
                <li>{latest.drift.newComponents.length} new components</li>
              </ul>
            </div>
            <div className="card-surface p-5">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Last Scan</h3>
              </div>
              <p className="mt-4 font-mono text-sm">{latest.url}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(latest.date).toLocaleString()}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/reports">Open report</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ConsistencyTrend scan={latest} />
            <DriftTrend scan={latest} />
            <IssueDistribution scan={latest} />
            <TypographyUsage scan={latest} />
            <ColorDistribution scan={latest} />
            <LayoutIssues scan={latest} />
            <div className="lg:col-span-2">
              <ComponentUsage scan={latest} />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
