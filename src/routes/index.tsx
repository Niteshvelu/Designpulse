import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Blocks,
  CalendarClock,
  FileBarChart,
  Gauge,
  Github,
  LayoutGrid,
  Palette,
  Ruler,
  ShieldCheck,
  Smartphone,
  Type,
  Waves,
  GitCompareArrows,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dashboard.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DesignPulse — UI Consistency Checker with Drift Detection" },
      {
        name: "description",
        content:
          "Analyze any website for UI consistency, validate design system compliance, detect UI drift between versions and export rich reports.",
      },
      { property: "og:title", content: "DesignPulse — UI Consistency Checker" },
      {
        property: "og:description",
        content:
          "Automated UI consistency analysis, design system validation, drift detection and consistency scoring for web apps.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Gauge, title: "UI Consistency Analysis", body: "Score every page against your system." },
  { icon: GitCompareArrows, title: "UI Drift Detection", body: "See what changed between versions." },
  { icon: ShieldCheck, title: "Design System Validation", body: "Flag colors and fonts off-token." },
  { icon: Smartphone, title: "Responsive Layout Testing", body: "Desktop, tablet and mobile checks." },
  { icon: Type, title: "Typography Validation", body: "Scales, line heights, heading order." },
  { icon: Palette, title: "Color Consistency Check", body: "Duplicates, invalids, palette sprawl." },
  { icon: LayoutGrid, title: "Layout Analysis", body: "Grid, containers, spacing rhythm." },
  { icon: CalendarClock, title: "Historical Comparison", body: "Track every scan over time." },
  { icon: Ruler, title: "UI Consistency Score", body: "One number your team can act on." },
  { icon: FileBarChart, title: "Report Generation", body: "Export PDF, JSON or CSV." },
];

const STEPS = [
  "Website URL",
  "HTML & CSS Extraction",
  "UI Analysis",
  "Consistency Validation",
  "UI Drift Detection",
  "Generate Report",
];

function Landing() {
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
            <Waves className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold">DesignPulse</span>
        </div>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <Link to="/help" className="transition-colors hover:text-foreground">
            Docs
          </Link>
        </nav>
        <Button asChild size="sm">
          <Link to="/analyze">Analyze Website</Link>
        </Button>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1fr_1.05fr] lg:pt-16">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            <span className="size-1.5 rounded-full bg-success" />
            UI drift detection, version over version
          </span>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] sm:text-6xl">DesignPulse</h1>
          <p className="mt-4 text-lg font-medium text-foreground/80">
            A UI Consistency Checker with UI Drift Detection for Web Applications
          </p>
          <p className="mt-4 max-w-xl text-muted-foreground">
            DesignPulse automatically analyzes websites, validates UI consistency, detects design
            drift, and helps developers maintain modern, scalable, and visually consistent user
            interfaces.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/analyze">
                Analyze Website <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
        <div className="relative animate-rise">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-primary opacity-10 blur-2xl" />
          <img
            src={heroImage}
            alt="DesignPulse dashboard showing a 92% UI consistency score, trend charts and palette analysis"
            width={1280}
            height={960}
            className="relative rounded-2xl border border-border shadow-lift"
          />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-semibold">Everything you need to keep a UI honest</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Ten analyses run on every scan, from raw color usage to component reuse and drift against
          your previous release.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="card-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-semibold">How it works</h2>
        <ol className="mt-10 flex flex-col gap-3 lg:flex-row lg:items-stretch">
          {STEPS.map((step, i) => (
            <li key={step} className="flex flex-1 items-center gap-3">
              <div className="card-surface flex-1 px-4 py-5">
                <span className="font-mono text-xs text-primary">0{i + 1}</span>
                <p className="mt-1 text-sm font-semibold">{step}</p>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight className="size-4 shrink-0 rotate-90 text-muted-foreground lg:rotate-0" />
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="card-surface flex flex-wrap items-center justify-between gap-6 bg-gradient-primary p-8">
          <div>
            <h2 className="text-2xl font-semibold text-primary-foreground">
              Run your first consistency scan
            </h2>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Paste a URL and get a scored report in seconds.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link to="/analyze">
              <Blocks className="size-4" /> Analyze Website
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground">
          <span className="font-display font-semibold text-foreground">DesignPulse</span>
          <nav className="flex flex-wrap items-center gap-6">
            <a href="#features" className="hover:text-foreground">
              About
            </a>
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <Link to="/help" className="hover:text-foreground">
              Documentation
            </Link>
            <Link to="/help" className="hover:text-foreground">
              Contact
            </Link>
            <a
              href="https://github.com"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="size-4" /> GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
