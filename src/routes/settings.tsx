import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/dp/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings, type DpSettings } from "@/lib/dp-settings";
import { useTheme } from "@/components/dp/use-theme";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — DesignPulse" },
      {
        name: "description",
        content:
          "Configure allowed colors and fonts, spacing rules, border radius, button style, theme and notification alerts.",
      },
      { property: "og:title", content: "Settings — DesignPulse" },
      {
        property: "og:description",
        content: "Define the design system rules DesignPulse validates against.",
      },
    ],
  }),
  component: SettingsPage,
});

const NOTIFICATIONS: { key: keyof DpSettings; label: string }[] = [
  { key: "notifyDrift", label: "UI drift detected" },
  { key: "notifyLowScore", label: "Consistency below 80%" },
  { key: "notifyNewColors", label: "New colors added" },
  { key: "notifyTypography", label: "Typography changed" },
  { key: "notifyLayout", label: "Layout changed" },
  { key: "notifyReport", label: "Report completed" },
];

function SettingsPage() {
  const { settings, update, reset } = useSettings();
  const { dark, toggle } = useTheme();

  return (
    <AppShell
      title="Settings"
      description="These rules define what DesignPulse treats as compliant during a scan."
      actions={
        <>
          <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
          <Button
            variant="outline"
            onClick={() => {
              reset();
              toast.success("Restored defaults");
            }}
          >
            Restore defaults
          </Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-surface space-y-5 p-5">
          <h3 className="text-base font-semibold">Design system rules</h3>
          <div className="space-y-2">
            <Label htmlFor="colors">Allowed colors</Label>
            <Input
              id="colors"
              value={settings.allowedColors}
              onChange={(e) => update("allowedColors", e.target.value)}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fonts">Allowed fonts</Label>
            <Input
              id="fonts"
              value={settings.allowedFonts}
              onChange={(e) => update("allowedFonts", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Spacing baseline: {settings.spacingRule}px</Label>
            <Slider
              value={[settings.spacingRule]}
              min={2}
              max={16}
              step={2}
              onValueChange={([v]) => update("spacingRule", v ?? 4)}
            />
          </div>
          <div className="space-y-2">
            <Label>Border radius: {settings.borderRadius}px</Label>
            <Slider
              value={[settings.borderRadius]}
              min={0}
              max={24}
              step={2}
              onValueChange={([v]) => update("borderRadius", v ?? 12)}
            />
          </div>
          <div className="space-y-2">
            <Label>Button style</Label>
            <Select
              value={settings.buttonStyle}
              onValueChange={(v) => update("buttonStyle", v as DpSettings["buttonStyle"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="soft">Soft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-surface space-y-4 p-5">
            <h3 className="text-base font-semibold">Theme</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark mode</p>
                <p className="text-xs text-muted-foreground">Applies across the whole app.</p>
              </div>
              <Switch checked={dark} onCheckedChange={toggle} aria-label="Dark mode" />
            </div>
          </div>

          <div className="card-surface space-y-4 p-5">
            <h3 className="text-base font-semibold">Notification settings</h3>
            {NOTIFICATIONS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <Switch
                  checked={Boolean(settings[key])}
                  onCheckedChange={(v) => update(key, v as never)}
                  aria-label={label}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
