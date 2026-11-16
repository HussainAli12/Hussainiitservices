"use client";

import { useId, useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

export interface TrendSeries {
  label: string;
  color: string;
  values: number[];
}

const WIDTH = 720;
const HEIGHT = 248;
const PAD = { top: 18, right: 16, bottom: 28, left: 44 };

function compact(value: number) {
  return new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function niceMax(value: number) {
  if (value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  const step = value / power;
  const nice = step <= 1 ? 1 : step <= 2 ? 2 : step <= 5 ? 5 : 10;
  return nice * power;
}

function pointX(index: number, count: number) {
  const inner = WIDTH - PAD.left - PAD.right;
  if (count <= 1) return PAD.left + inner / 2;
  return PAD.left + (index / (count - 1)) * inner;
}

function pointY(value: number, max: number) {
  const inner = HEIGHT - PAD.top - PAD.bottom;
  return PAD.top + inner - (value / max) * inner;
}

function linePath(values: number[], max: number) {
  return values
    .map((value, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${pointX(index, values.length).toFixed(1)} ${pointY(value, max).toFixed(1)}`;
    })
    .join(" ");
}

function areaPath(values: number[], max: number) {
  const baseline = pointY(0, max).toFixed(1);
  const lastX = pointX(values.length - 1, values.length).toFixed(1);
  const firstX = pointX(0, values.length).toFixed(1);
  return `${linePath(values, max)} L ${lastX} ${baseline} L ${firstX} ${baseline} Z`;
}

export function TrendChart({
  dates,
  series,
  className,
}: {
  dates: string[];
  series: TrendSeries[];
  className?: string;
}) {
  const gradientId = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const count = dates.length;
  const max = niceMax(Math.max(...series.flatMap((item) => item.values), 0));
  const ticks = [max, max / 2, 0];
  const labelEvery = Math.max(1, Math.ceil(count / 6));

  function move(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const left = (PAD.left / WIDTH) * rect.width;
    const right = rect.width - (PAD.right / WIDTH) * rect.width;
    const ratio = (x - left) / Math.max(right - left, 1);
    const index = Math.round(ratio * (count - 1));
    setHover(Math.min(count - 1, Math.max(0, index)));
  }

  const hoverX = hover === null ? 0 : (pointX(hover, count) / WIDTH) * 100;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={cn("h-56 w-full touch-none sm:h-64", className)}
        role="img"
        aria-label={series.map((item) => item.label).join(" and ")}
        onPointerMove={move}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          {series.map((item, index) => (
            <linearGradient key={item.label} id={`${gradientId}-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: item.color, stopOpacity: index === 0 ? 0.28 : 0.12 }} />
              <stop offset="100%" style={{ stopColor: item.color, stopOpacity: 0 }} />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((tick) => {
          const y = pointY(tick, max);
          return (
            <g key={tick}>
              <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} style={{ stroke: "var(--border)" }} />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" style={{ fill: "var(--muted-foreground)" }} fontSize="11">
                {compact(tick)}
              </text>
            </g>
          );
        })}
        {dates.map((date, index) =>
          index % labelEvery === 0 || index === count - 1 ? (
            <text
              key={date}
              x={pointX(index, count)}
              y={HEIGHT - 8}
              textAnchor="middle"
              style={{ fill: "var(--muted-foreground)" }}
              fontSize="11"
            >
              {date}
            </text>
          ) : null,
        )}
        {series.map((item, index) => (
          <path key={`${item.label}-area`} d={areaPath(item.values, max)} fill={`url(#${gradientId}-${index})`} />
        ))}
        {series.map((item) => (
          <path
            key={`${item.label}-line`}
            d={linePath(item.values, max)}
            fill="none"
            style={{ stroke: item.color }}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        {hover !== null && (
          <g>
            <line
              x1={pointX(hover, count)}
              x2={pointX(hover, count)}
              y1={PAD.top}
              y2={HEIGHT - PAD.bottom}
              style={{ stroke: "var(--input)" }}
              strokeDasharray="3 3"
            />
            {series.map((item) => (
              <circle
                key={item.label}
                cx={pointX(hover, count)}
                cy={pointY(item.values[hover] ?? 0, max)}
                r="4"
                style={{ fill: "var(--card)", stroke: item.color }}
                strokeWidth="2"
              />
            ))}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-36 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 shadow-lg"
          style={{ left: `${Math.min(88, Math.max(12, hoverX))}%` }}
        >
          <p className="text-xs font-medium text-foreground">{dates[hover]}</p>
          <ul className="mt-1 space-y-1">
            {series.map((item) => (
              <li key={item.label} className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
                <span className="font-medium text-foreground">{compact(item.values[hover] ?? 0)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
