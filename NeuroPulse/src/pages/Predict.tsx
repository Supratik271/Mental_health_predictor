import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { ApiError, predict } from "../api";
import { addEntry } from "../history";
import {
  ACADEMIC_LEVELS, GENDERS, KNOWN_COUNTRIES, PLATFORMS, PURPOSES, STRESS_LEVELS,
  studentSchema, type StudentData,
} from "../schema";
import { ErrorBanner } from "../components/ui";

const EMPTY = {
  Age: undefined, Gender: "", Country: "", Academic_Level: "", Most_Used_Platform: "", Purpose_Of_Use: "",
  Avg_Daily_Usage_Hours: undefined, Daily_Unlocks: undefined, Study_Hours: undefined,
  Physical_Activity_Hours: undefined, Sleep_Hours_Per_Night: undefined, Stress_Level: "",
} as unknown as StudentData;

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <fieldset className="card p-6 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <p className="muted mb-6 mt-1">{hint}</p>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({ name, label, hint, error, children }: { name: keyof StudentData; label: string; hint?: string; error?: string; children: (p: object) => ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      {children({ id: name, "aria-invalid": !!error, "aria-describedby": error ? `${name}-err` : hint ? `${name}-hint` : undefined })}
      {hint && !error && <p id={`${name}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      {error && <p id={`${name}-err`} className="mt-1.5 text-xs text-rose-300">{error}</p>}
    </div>
  );
}

export default function Predict() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state as { prefill?: StudentData } | null)?.prefill;
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<StudentData>({
    resolver: zodResolver(studentSchema),
    defaultValues: prefill ?? EMPTY,
    mode: "onBlur",
  });

  const onSubmit = async (values: StudentData) => {
    if (isSubmitting) return;
    setApiError(null);
    try {
      const res = await predict(values);
      const entry = addEntry(values, res.predicted_mental_health_score);
      navigate(`/results/${entry.id}`, { state: { fresh: true } });
    } catch (e) {
      const err = e instanceof ApiError ? e : new ApiError("unknown", "Something unexpected went wrong.");
      setApiError(err);
      for (const [field, message] of Object.entries(err.fieldErrors)) {
        setError(field as FieldPath<StudentData>, { message });
      }
    }
  };

  const select = (name: keyof StudentData, label: string, options: readonly string[], hint?: string) => (
    <Field name={name} label={label} hint={hint} error={errors[name]?.message}>
      {(p) => (
        <select className="input" {...p} {...register(name)}>
          <option value="">Select…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
    </Field>
  );

  const number = (name: keyof StudentData, label: string, opts: { step?: string; min?: number; max?: number; hint?: string }) => (
    <Field name={name} label={label} hint={opts.hint} error={errors[name]?.message}>
      {(p) => (
        <input type="number" inputMode="decimal" className="input" step={opts.step ?? "1"} min={opts.min} max={opts.max}
          {...p} {...register(name, { setValueAs: (v) => (v === "" || v === null ? NaN : Number(v)) })} />
      )}
    </Field>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="h1">New prediction</h1>
      <p className="muted mt-2 max-w-xl">Answer all 12 questions. Your values are sent to the model API and the returned score is saved to this browser's history.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-6" aria-busy={isSubmitting}>
        <Section title="Student profile" hint="Basic background details.">
          {number("Age", "Age", { min: 0, max: 120, hint: "Whole number, 0–120" })}
          {select("Gender", "Gender", GENDERS)}
          {select("Country", "Country", KNOWN_COUNTRIES, "Choose a country. Select Other if yours is not listed; the API groups it as Other.")}
          {select("Academic_Level", "Academic level", ACADEMIC_LEVELS)}
        </Section>

        <Section title="Social media habits" hint="How the student uses social media day to day.">
          {select("Most_Used_Platform", "Most used platform", PLATFORMS)}
          {select("Purpose_Of_Use", "Main purpose of use", PURPOSES)}
          {number("Avg_Daily_Usage_Hours", "Average daily usage (hours)", { step: "0.1", min: 0, max: 24, hint: "0–24 hours" })}
          {number("Daily_Unlocks", "Phone unlocks per day", { min: 0, hint: "Whole number, 0 or more" })}
        </Section>

        <Section title="Lifestyle & well-being" hint="Routine, rest, and stress.">
          {number("Study_Hours", "Study hours per day", { step: "0.1", min: 0, max: 24, hint: "0–24 hours" })}
          {number("Physical_Activity_Hours", "Physical activity (hours per day)", { step: "0.1", min: 0, max: 24, hint: "0–24 hours" })}
          {number("Sleep_Hours_Per_Night", "Sleep (hours per night)", { step: "0.1", min: 0, max: 24, hint: "0–24 hours" })}
          {select("Stress_Level", "Stress level", STRESS_LEVELS)}
        </Section>

        {apiError && <ErrorBanner error={apiError} busy={isSubmitting} onRetry={() => void handleSubmit(onSubmit)()} />}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="btn-ghost" disabled={isSubmitting} onClick={() => { reset(EMPTY); setApiError(null); }}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Clear form
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Running model…</> : <><Sparkles className="h-4 w-4" aria-hidden /> Get prediction</>}
          </button>
        </div>
      </form>
    </div>
  );
}
