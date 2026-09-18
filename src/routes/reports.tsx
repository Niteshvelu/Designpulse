import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileJson, Printer, Table2 } from "lucide-react";
import { AppShell } from "@/components/dp/AppShell";
import { DriftPanel, severityBadge } from "@/components/dp/ScanResults";
import { ScoreRing } from "@/components/dp/ScoreRing";
import { useScans } from "@/components/dp/useAlerts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportCsv, exportJson, printReport } from "@/lib/dp-export";
import { ConsistencyTrend, IssueDistribution } from "@/components/dp/Charts";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — DesignPulse" },
      {
        name: "description",
        content:
          "Read and export DesignPulse reports with consistency scores, detected issues, severity, recommendations and drift summaries.",
      },
      { property: "og:title", content: "Reports — DesignPulse" },
      {
        property: "og:description",
        content: "Downloadable UI consistency reports in PDF, JSON and CSV.",
      },
    ],
  }),
  component: Reports,
});

function Reports() {
  const scans = useScans();
  const [selected, setSelected] = useState<string | null>(null);
  const scan = scans.find((s) => s.id === selected) ?? scans[0];

  if (!scan) {
    return (
      <AppShell title="Reports" description="Generated reports appear here after a scan.">
        <div className="card-surface p-10 text-center">
          <h2 className="text-lg font-semibold">No reports yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Run an analysis to generate one.</p>
          <Button asChild className="mt-5">
            <Link to="/analyze">Analyze a website</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Report"
      description="Full consistency report with issues, recommendations and drift summary."
      actions={
        <>
          <Select value={scan.id} onValueChange={setSelected}>
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scans.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.url} — {new Date(s.date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={printReport}>
            <Download className="size-4" /> PDF
          </Button>
          <Button variant="outline" onClick={() => exportJson(scan)}>
            <FileJson className="size-4" /> JSON
          </Button>
          <Button variant="outline" onClick={() => exportCsv(scan)}>
            <Table2 className="size-4" /> CSV
          </Button>
          <Button variant="ghost" onClick={printReport}>
            <Printer className="size-4" /> Print
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="card-surface flex flex-wrap items-center gap-8 p-6">
          <ScoreRing score={scan.score} size={168} />
          <dl className="grid flex-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Website URL</dt>
              <dd className="font-mono text-xs">{scan.url}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Scan date</dt>
              <dd className="font-medium">{new Date(scan.date).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Detected issues</dt>
              <dd className="font-medium">{scan.issuesCount}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">UI drift</dt>
              <dd className="font-medium capitalize">{scan.driftLevel}</dd>
            </div>
          </dl>
        </div>

        <div className="card-surface overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-base font-semibold">Detected issues & recommendations</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Recommendation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scan.issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">{issue.title}</TableCell>
                  <TableCell className="text-muted-foreground">{issue.category}</TableCell>
                  <TableCell>{severityBadge(issue.severity)}</TableCell>
                  <TableCell className="text-muted-foreground">{issue.recommendation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DriftPanel scan={scan} />

        <div className="grid gap-4 lg:grid-cols-2">
          <ConsistencyTrend scan={scan} />
          <IssueDistribution scan={scan} />
        </div>

        <div className="card-surface overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-base font-semibold">Historical comparison</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Website</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Drift</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.slice(0, 6).map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.url}</TableCell>
                  <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{s.score}%</TableCell>
                  <TableCell>{s.issuesCount}</TableCell>
                  <TableCell className="capitalize">{s.driftLevel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}
