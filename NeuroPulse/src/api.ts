import type { StudentData } from "./schema";

export interface PredictionResponse {
  predicted_mental_health_score: number;
}

export type ApiErrorKind = "network" | "timeout" | "validation" | "server" | "unknown";

export class ApiError extends Error {
  kind: ApiErrorKind;
  fieldErrors: Record<string, string>;
  status?: number;
  constructor(kind: ApiErrorKind, message: string, fieldErrors: Record<string, string> = {}, status?: number) {
    super(message);
    this.kind = kind;
    this.fieldErrors = fieldErrors;
    this.status = status;
  }
}

const BASE: string = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";
const TIMEOUT_MS = 20000;

interface FastApiIssue { loc?: (string | number)[]; msg?: string }

export async function predict(data: StudentData): Promise<PredictionResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new ApiError("timeout", "The prediction service took too long to respond. Please try again.");
    }
    throw new ApiError(
      "network",
      "Can't reach the prediction API. Make sure your FastAPI server is running on http://127.0.0.1:8000."
    );
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 422) {
    const body = (await res.json().catch(() => null)) as { detail?: FastApiIssue[] } | null;
    const fieldErrors: Record<string, string> = {};
    if (Array.isArray(body?.detail)) {
      for (const issue of body.detail) {
        const field = issue.loc?.[issue.loc.length - 1];
        if (typeof field === "string") fieldErrors[field] = issue.msg ?? "Invalid value";
      }
    }
    throw new ApiError("validation", "The server rejected some values. Check the highlighted fields.", fieldErrors, 422);
  }
  if (!res.ok) {
    throw new ApiError("server", `The prediction service returned an error (HTTP ${res.status}). Check your backend terminal for details.`, {}, res.status);
  }

  const json = (await res.json().catch(() => null)) as Partial<PredictionResponse> | null;
  if (!json || typeof json.predicted_mental_health_score !== "number") {
    throw new ApiError("unknown", "The API replied with an unexpected response format.");
  }
  return { predicted_mental_health_score: json.predicted_mental_health_score };
}

/** Lightweight reachability check against GET / (used by the status indicator). */
export async function checkApi(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch {
    return false;
  }
}
