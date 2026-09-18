import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, GitCompareArrows, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/dp/AppShell";
import { useScans } from "@/components/dp/useAlerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteScan } from "@/lib/designpulse";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan History — DesignPulse" },
      {
        name: "description",
        content:
          "Browse, search, sort and compare every previous DesignPulse scan with scores, issue counts and drift status.",
      },
      { property: "og:title", content: "Scan History — DesignPulse" },
      {
        property: "og:description",
        content: "Every previous scan with score, issues and UI drift, ready to compare.",
      },
    ],
  }),
  component: History,
});

function History() {
  const scans = useScans();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"date" | "score" | "issues">("date");
  const [drift, setDrift] = useState<"all" | "none" | "minor" | "major">("all");
  const [picked, setPicked] = useState<string[]>([]);

  const rows = useMemo(() => {
    const filtered = scans.filter(
      (s) =>
        s.url.toLowerCase().includes(query.toLowerCase()) &&
        (drift === "all" || s.driftLevel === drift),
    );
    return [...filtered].sort((a, b) => {
      if (sort === "score") return b.score - a.score;
      if (sort === "issues") return b.issuesCount - a.issuesCount;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [scans, query, sort, drift]);

  const compare = picked
    .map((id) => scans.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const toggle = (id: string) =>
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id].slice(-2),
    );

  return (
    <AppShell
      title="History"
      description="Every scan saved on this device. Pick two rows to compare reports."
    >
      <div className="space-y-6">
        <div className="card-surface flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by website"
              className="pl-9"
            />
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="w-40">
              <ArrowUpDown className="size-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Newest first</SelectItem>
              <SelectItem value="score">Highest score</SelectItem>
              <SelectItem value="issues">Most issues</SelectItem>
            </SelectContent>
          </Select>
          <Select value={drift} onValueChange={(v) => setDrift(v as typeof drift)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All drift levels</SelectItem>
              <SelectItem value="none">No drift</SelectItem>
              <SelectItem value="minor">Minor drift</SelectItem>
              <SelectItem value="major">Major drift</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="card-surface overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>Website</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>UI Drift</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    No scans match this filter.{" "}
                    <Link to="/analyze" className="text-primary underline">
                      Run an analysis
                    </Link>
                  </TableCell>
                </TableRow>
              )}
              {rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Checkbox
                      checked={picked.includes(s.id)}
                      onCheckedChange={() => toggle(s.id)}
                      aria-label={`Select ${s.url}`}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{s.url}</TableCell>
                  <TableCell>{new Date(s.date).toLocaleString()}</TableCell>
                  <TableCell
                    className={cn(
                      "font-semibold",
                      s.score >= 80 ? "text-success" : s.score >= 65 ? "text-warning" : "text-destructive",
                    )}
                  >
                    {s.score}%
                  </TableCell>
                  <TableCell>{s.issuesCount}</TableCell>
                  <TableCell className="capitalize">{s.driftLevel}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-success/40 bg-success/10 text-success">
                      completed
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete scan"
                      onClick={() => {
                        deleteScan(s.id);
                        setPicked((p) => p.filter((id) => id !== s.id));
                        toast.success("Scan deleted");
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-2">
            <GitCompareArrows className="size-4 text-primary" />
            <h3 className="text-base font-semibold">Compare reports</h3>
            <span className="ml-auto text-xs text-muted-foreground">
              {compare.length}/2 selected
            </span>
          </div>
          {compare.length < 2 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Select two scans above to compare their scores side by side.
            </p>
          ) : (
            <div className="mt-4 space-y-2 text-sm">
              {(
                [
                  ["Consistency score", (s: typeof compare[number]) => `${s.score}%`],
                  ["Issues", (s: typeof compare[number]) => `${s.issuesCount}`],
                  ["Color score", (s: typeof compare[number]) => `${s.colors.score}%`],
                  ["Typography score", (s: typeof compare[number]) => `${s.typography.score}%`],
                  ["Layout score", (s: typeof compare[number]) => `${s.layout.score}%`],
                  ["Button score", (s: typeof compare[number]) => `${s.buttons.score}%`],
                  ["UI drift", (s: typeof compare[number]) => s.driftLevel],
                ] as const
              ).map(([label, get]) => (
                <div
                  key={label}
                  className="grid grid-cols-3 gap-4 border-b border-border/60 pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{get(compare[0]!)}</span>
                  <span className="font-medium">{get(compare[1]!)}</span>
                </div>
              ))}
              <p className="pt-2 font-mono text-xs text-muted-foreground">
                {compare[0]!.url} vs {compare[1]!.url}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
