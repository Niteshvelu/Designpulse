import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Scan } from "@/lib/designpulse";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
};

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  color: "var(--popover-foreground)",
  fontSize: 12,
};

export function ChartCard({
  title,
  children,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-surface p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ConsistencyTrend({ scan }: { scan: Scan }) {
  return (
    <ChartCard title="Consistency Trend" subtitle="Score across recent scans">
      <AreaChart data={scan.trend}>
        <defs>
          <linearGradient id="dpScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="label" {...axis} />
        <YAxis domain={[40, 100]} {...axis} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey="score"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#dpScore)"
        />
      </AreaChart>
    </ChartCard>
  );
}

export function DriftTrend({ scan }: { scan: Scan }) {
  return (
    <ChartCard title="UI Drift Trend" subtitle="Detected changes per scan">
      <LineChart data={scan.trend}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="drift" stroke="var(--chart-3)" strokeWidth={2} />
      </LineChart>
    </ChartCard>
  );
}

export function IssueDistribution({ scan }: { scan: Scan }) {
  const data = ["high", "medium", "low"].map((sev) => ({
    name: sev,
    value: scan.issues.filter((i) => i.severity === sev).length,
  }));
  return (
    <ChartCard title="Issue Distribution" subtitle="By severity">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[(i + 3) % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ChartCard>
  );
}

export function TypographyUsage({ scan }: { scan: Scan }) {
  const data = scan.typography.sizes.map((s) => ({
    name: `${s}px`,
    count: 1 + ((s * 7) % 9),
  }));
  return (
    <ChartCard title="Typography Usage" subtitle="Occurrences per font size">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" {...axis} />
        <YAxis {...axis} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartCard>
  );
}

export function ColorDistribution({ scan }: { scan: Scan }) {
  const data = scan.colors.palette.map((c, i) => ({
    name: `Color ${i + 1}`,
    value: 5 + ((i * 13) % 25),
    fill: c,
  }));
  return (
    <ChartCard title="Color Distribution" subtitle="Usage share per palette color">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ChartCard>
  );
}

export function LayoutIssues({ scan }: { scan: Scan }) {
  const data = scan.viewports.map((vp) => ({
    name: vp.name,
    issues:
      Number(vp.overflow) + Number(vp.brokenLayout) + Number(vp.overlapping) + Number(vp.misaligned),
  }));
  return (
    <ChartCard title="Layout Issues" subtitle="Per viewport">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" {...axis} />
        <YAxis allowDecimals={false} {...axis} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="issues" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartCard>
  );
}

export function ComponentUsage({ scan }: { scan: Scan }) {
  const c = scan.components;
  const data = [
    { name: "Cards", value: c.cards },
    { name: "Forms", value: c.forms },
    { name: "Nav", value: c.navigation },
    { name: "Tables", value: c.tables },
    { name: "Icons", value: c.icons },
  ];
  return (
    <ChartCard title="Component Usage" subtitle="Detected instances">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" {...axis} />
        <YAxis type="category" dataKey="name" width={60} {...axis} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" fill="var(--chart-2)" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ChartCard>
  );
}
