import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/dp/AppShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Documentation & Help — DesignPulse" },
      {
        name: "description",
        content:
          "Learn how DesignPulse scores UI consistency, detects design drift and turns findings into actionable recommendations.",
      },
      { property: "og:title", content: "Documentation & Help — DesignPulse" },
      {
        property: "og:description",
        content: "How scoring, drift detection and report exports work in DesignPulse.",
      },
    ],
  }),
  component: Help,
});

const FAQ = [
  {
    q: "How is the UI Consistency Score calculated?",
    a: "It averages four sub-scores — color, typography, layout and buttons. 90+ is Excellent, 80+ Good, 65+ Average, below that Needs Improvement.",
  },
  {
    q: "How does UI drift detection work?",
    a: "When you scan a URL you have scanned before, the current result is diffed against the previous one: new colors, font swaps, button changes, spacing shifts, layout changes and new components.",
  },
  {
    q: "Where are my scans stored?",
    a: "Scans and settings are auto-saved in this browser's local storage, so history stays on your device.",
  },
  {
    q: "How do exports work?",
    a: "Any report can be exported as JSON or CSV, or printed to PDF through your browser's print dialog.",
  },
  {
    q: "What triggers alerts?",
    a: "Drift detection, a score under 80%, new colors, typography or layout changes, and completed reports. Toggle each in Settings.",
  },
];

function Help() {
  return (
    <AppShell title="Help & Documentation" description="Everything you need to read a report well.">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="card-surface p-5">
          <h3 className="text-base font-semibold">Frequently asked</h3>
          <Accordion type="single" collapsible className="mt-2">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="card-surface space-y-3 p-5">
          <h3 className="text-base font-semibold">Contact</h3>
          <p className="text-sm text-muted-foreground">
            Questions, feature requests or a false positive to report? Reach the team at
            support@designpulse.dev.
          </p>
          <Button asChild variant="outline">
            <Link to="/analyze">Run a scan</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
