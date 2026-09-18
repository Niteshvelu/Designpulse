import { useEffect, useState } from "react";
import { scoreLabel } from "@/lib/designpulse";
import { cn } from "@/lib/utils";

export function ScoreRing({
  score,
  size = 200,
  label = true,
  className,
}: {
  score: number;
  size?: number;
  label?: boolean;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);
  const stroke = size / 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  const tone =
    score >= 90
      ? "text-success"
      : score >= 80
        ? "text-primary"
        : score >= 65
          ? "text-warning"
          : "text-destructive";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="stroke-muted"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            className={cn("transition-[stroke-dashoffset] duration-1000 ease-out", tone)}
            stroke="currentColor"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-display font-semibold", tone)} style={{ fontSize: size / 4 }}>
            {score}%
          </span>
          {label && (
            <span className="text-xs font-medium text-muted-foreground">{scoreLabel(score)}</span>
          )}
        </div>
      </div>
    </div>
  );
}