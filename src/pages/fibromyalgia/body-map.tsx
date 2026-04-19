"use client";

import { cn } from "@/lib/utils";
import {
  WPI_BODY_MAP_HOTSPOTS,
  WPI_PARTS,
  type BodyMapView,
} from "./logic";

interface FibroBodyMapProps {
  selected: boolean[];
  onToggle: (index: number) => void;
}

function BodyFigure({ view }: { view: BodyMapView }) {
  return (
    <svg viewBox="0 0 100 140" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`fibro-body-${view}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="11" r="7" fill={`url(#fibro-body-${view})`} stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="41" y="20" width="18" height="26" rx="8" fill={`url(#fibro-body-${view})`} stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="35" y="46" width="30" height="18" rx="8" fill={`url(#fibro-body-${view})`} stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="30" y="24" width="10" height="40" rx="5" fill={`url(#fibro-body-${view})`} stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="60" y="24" width="10" height="40" rx="5" fill={`url(#fibro-body-${view})`} stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="39" y="64" width="10" height="37" rx="5" fill={`url(#fibro-body-${view})`} stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="51" y="64" width="10" height="37" rx="5" fill={`url(#fibro-body-${view})`} stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="37" y="101" width="10" height="27" rx="5" fill={`url(#fibro-body-${view})`} stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="53" y="101" width="10" height="27" rx="5" fill={`url(#fibro-body-${view})`} stroke="#94a3b8" strokeWidth="1.5" />

      {view === "back" && (
        <>
          <path d="M44 25 L50 31 L56 25" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M43 50 Q50 56 57 50" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function FibroBodyMap({
  selected,
  onToggle,
}: FibroBodyMapProps) {
  const views: BodyMapView[] = ["front", "back"];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {views.map((view) => (
        <section
          key={view}
          className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">
              {view === "front" ? "正面" : "背面"}
            </h3>
            <span className="text-xs text-slate-500">
              點選疼痛部位切換
            </span>
          </div>

          <div className="relative mx-auto aspect-[5/7] max-w-[280px]">
            <BodyFigure view={view} />

            {WPI_BODY_MAP_HOTSPOTS.filter((spot) => spot.view === view).map((spot) => {
              const active = selected[spot.partIndex];

              return (
                <button
                  key={spot.partIndex}
                  type="button"
                  onClick={() => onToggle(spot.partIndex)}
                  className={cn(
                    "absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[11px] font-medium leading-tight shadow-sm transition",
                    active
                      ? "border-red-600 bg-red-600 text-white shadow-red-200"
                      : "border-slate-300 bg-white/92 text-slate-700 hover:border-blue-400 hover:text-blue-700",
                  )}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  aria-pressed={active}
                  aria-label={`${active ? "取消" : "選取"} ${WPI_PARTS[spot.partIndex].label}`}
                  title={WPI_PARTS[spot.partIndex].label}
                >
                  <span>{WPI_PARTS[spot.partIndex].label}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
