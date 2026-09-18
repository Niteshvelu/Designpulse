import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/dp/AppShell";
import { ScanResults } from "@/components/dp/ScanResults";
import { useScans } from "@/components/dp/useAlerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ANALYSIS_STEPS, analyze, normalizeUrl, saveScan, type Scan } from "@/lib/designpulse";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze a Website — DesignPulse" },
      {
        name: "description",
        content:
          "Paste a URL to extract HTML and CSS, validate colors, typography, layout and components, then detect UI drift.",
      },
      { property: "og:title", content: "Analyze a Website — DesignPulse" },
      {
        property: "og:description",
        content: "Run a full UI consistency and drift analysis on any website URL.",
      },
    ],
  }),
  component: Analyze,
});

function Analyze() {
  const scans = useScans();
  const [url, setUrl] = useState("");
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState<Scan | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const running = step >= 0 && step < ANALYSIS_STEPS.length;
  const progress = running ? ((step + 1) / ANALYSIS_STEPS.length) * 100 : result ? 100 : 0;

  const run = () => {
    const target = normalizeUrl(url);
    if (!target) {
      toast.error("Enter a website URL to analyze.");
      return;
    }
    setResult(null);
    setStep(0);
    const previous = scans.find((s) => s.url === target);
    timers.current.forEach(clearTimeout);
    timers.current = ANALYSIS_STEPS.map((_, i) =>
      setTimeout(() => {
        if (i < ANALYSIS_STEPS.length - 1) {
          setStep(i + 1);
        } else {
          const scan = analyze(target, previous);
          saveScan(scan);
          setResult(scan);
          setStep(ANALYSIS_STEPS.length);
          toast.success(`Report ready — consistency score ${scan.score}%`);
          if (scan.driftLevel !== "none") toast.warning(`UI drift detected (${scan.driftLevel}).`);
          if (scan.score < 80) toast.error(`Consistency below 80% (${scan.score}%).`);
        }
      }, 500 * (i + 1)),
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setUrl("");
    setStep(-1);
    setResult(null);
  };

  return (
    <AppShell
      title="Analyze"
      description="Extract HTML and CSS, validate the design system, and compare against the previous scan."
    >
      <div className="space-y-6">
        <div className="card-surface p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="https://example.com"
              className="font-mono text-sm"
              aria-label="Website URL"
            />
            <div className="flex gap-2">
              <Button onClick={run} disabled={running}>
                {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
                Analyze
              </Button>
              <Button variant="outline" onClick={reset} disabled={running}>
                <RotateCcw className="size-4" /> Reset
              </Button>
            </div>
          </div>

          {(running || result) && (
            <div className="mt-5">
              <Progress value={progress} className="h-2" />
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {ANALYSIS_STEPS.map((label, i) => {
                  const done = step > i || Boolean(result);
                  const active = step === i && running;
                  return (
                    <li
                      key={label}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors",
                        done
                          ? "border-success/40 bg-success/10 text-success"
                          : active
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border text-muted-foreground",
                      )}
                    >
                      {active && <Loader2 className="size-3 animate-spin" />}
                      {label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {running && (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        )}

        {result && (
          <>
            <ScanResults scan={result} />
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/reports">Open full report</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/history">View history</Link>
              </Button>
            </div>
          </>
        )}

        {!running && !result && (
          <div className="card-surface p-6 text-sm text-muted-foreground">
            Tip: analyze the same URL twice to see UI drift detection compare the current scan
            against the previous one.
          </div>
        )}
      </div>
    </AppShell>
  );
}
