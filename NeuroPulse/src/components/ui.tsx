import { useEffect, useState, type ReactNode } from "react";
import { animate, motion } from "framer-motion";
import { AlertTriangle, Info, WifiOff } from "lucide-react";
import type { ApiError } from "../api";

/** The API does not declare a score range. 0–10 is only the gauge's display scale. */
export const GAUGE_MAX = 10;

export function AnimatedNumber({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, { duration: 1.2, ease: "easeOut", onUpdate: (v) => setN(v) });
    return () => controls.stop();
  }, [value]);
  return <>{n.toFixed(1)}</>;
}

export function Gauge({ value, size = 300 }: { value: number | null; size?: number }) {
  const frac = value === null ? 0 : Math.min(Math.max(value / GAUGE_MAX, 0), 1);
  const angle = -180 + frac * 180;
  const needleX = 120 + 75 * Math.cos((angle * Math.PI) / 180);
  const needleY = 120 + 75 * Math.sin((angle * Math.PI) / 180);
  const arc = "M 20 120 A 100 100 0 0 1 220 120";
  const meaning = value === null ? "Awaiting prediction" : value < 4 ? "Lower displayed score" : value < 7 ? "Mid-range displayed score" : "Higher displayed score";
  return (
    <div style={{ width: size, maxWidth: "100%" }} className="mx-auto overflow-visible">
      <svg viewBox="0 0 240 160" role="img" aria-label={value === null ? "Empty score gauge" : `Gauge showing the model prediction ${value} on a 0 to ${GAUGE_MAX} display scale`} className="overflow-visible">
        <defs><linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fb4b55"/><stop offset="50%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#34d399"/></linearGradient></defs>
        <path d={arc} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="17" strokeLinecap="round" />
        <path d={arc} fill="none" stroke="url(#gaugeGrad)" strokeWidth="17" strokeLinecap="round" />
        <motion.line x1="120" y1="120" x2={needleX} y2={needleY} stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" initial={{ x2: 120, y2: 120 }} animate={{ x2: needleX, y2: needleY }} transition={{ type: "spring", stiffness: 45, damping: 12 }} />
        <circle cx="120" cy="120" r="8" fill="#f8fafc" stroke="#1b2029" strokeWidth="3" />
        <text x="20" y="145" fill="#92949d" fontSize="10" textAnchor="middle">0</text><text x="120" y="28" fill="#92949d" fontSize="10" textAnchor="middle">5</text><text x="220" y="145" fill="#92949d" fontSize="10" textAnchor="middle">{GAUGE_MAX}</text>
        <text x="120" y="103" fill="white" fontSize="36" fontWeight="700" textAnchor="middle" fontFamily="Manrope, sans-serif">{value === null ? "–" : <AnimatedNumber value={value} />}</text>
      </svg>
      <p className="-mt-1 text-center text-sm font-semibold text-slate-200">{meaning}</p>
    </div>
  );
}

export function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-sky-400/20 bg-sky-400/5 p-4 text-sm text-slate-300">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden />
      <p>{children ?? "This score is a model-generated estimate. It is not a diagnosis, and its clinical meaning has not been established. If you are worried about your well-being, talk to a qualified professional."}</p>
    </div>
  );
}

export function ErrorBanner({ error, onRetry, busy }: { error: ApiError; onRetry?: () => void; busy?: boolean }) {
  const Icon = error.kind === "network" ? WifiOff : AlertTriangle;
  const title = { network: "API unreachable", timeout: "Request timed out", validation: "Check your inputs", server: "Server error", unknown: "Unexpected response" }[error.kind];
  return (
    <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 sm:flex-row sm:items-center">
      <Icon className="h-5 w-5 shrink-0 text-rose-300" aria-hidden />
      <div className="flex-1">
        <p className="font-semibold text-rose-200">{title}</p>
        <p className="text-sm text-rose-100/80">{error.message} Your entries have been kept.</p>
      </div>
      {onRetry && error.kind !== "validation" && (
        <button type="button" className="btn-danger" onClick={onRetry} disabled={busy}>Try again</button>
      )}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <p className="muted mt-2 max-w-md">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
