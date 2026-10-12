import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { ApiError, predict } from "../api";
import { addEntry } from "../history";

import {
  ACADEMIC_LEVELS,
  GENDERS,
  KNOWN_COUNTRIES,
  PLATFORMS,
  PURPOSES,
  STRESS_LEVELS,
  studentSchema,
  type StudentData,
} from "../schema";

import { ErrorBanner } from "../components/ui";

const EMPTY = {
  Age: undefined,
  Gender: "",
  Country: "",
  Academic_Level: "",
  Most_Used_Platform: "",
  Purpose_Of_Use: "",
  Avg_Daily_Usage_Hours: undefined,
  Daily_Unlocks: undefined,
  Study_Hours: undefined,
  Physical_Activity_Hours: undefined,
  Sleep_Hours_Per_Night: undefined,
  Stress_Level: "",
} as unknown as StudentData;

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="card p-6 sm:p-8">
      <legend className="sr-only">{title}</legend>

      <h2 className="font-display text-xl font-semibold text-white">
        {title}
      </h2>

      <p className="muted mb-6 mt-1">{hint}</p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {children}
      </div>
    </fieldset>
  );
}

function Field({
  name,
  label,
  hint,
  error,
  children,
}: {
  name: keyof StudentData;
  label: string;
  hint?: string;
  error?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
}) {
  const describedBy = error
    ? `${name}-err`
    : hint
      ? `${name}-hint`
      : undefined;

  return (
    <div className="min-w-0">
      <label htmlFor={name} className="label">
        {label}
      </label>

      {children({
        id: name,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
      })}

      {hint && !error && (
        <p
          id={`${name}-hint`}
          className="mt-1.5 text-xs leading-5 text-slate-500"
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${name}-err`}
          role="alert"
          className="mt-1.5 text-sm text-rose-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function Predict() {
  const navigate = useNavigate();
  const location = useLocation();

  const prefill = (
    location.state as { prefill?: StudentData } | null
  )?.prefill;

  const [apiError, setApiError] = useState<ApiError | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StudentData>({
    resolver: zodResolver(studentSchema),
    defaultValues: prefill ?? EMPTY,
    mode: "onBlur",
  });

  const onSubmit = async (values: StudentData) => {
    if (isSubmitting) return;

    setApiError(null);

    try {
      const response = await predict(values);

      const entry = addEntry(
        values,
        response.predicted_mental_health_score
      );

      navigate(`/results/${entry.id}`, {
        state: { fresh: true },
      });
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError(
              "unknown",
              "Something unexpected went wrong. Please try again."
            );

      setApiError(apiError);

      for (const [field, message] of Object.entries(
        apiError.fieldErrors
      )) {
        setError(field as FieldPath<StudentData>, {
          message,
        });
      }
    }
  };

  const select = (
    name: keyof StudentData,
    label: string,
    options: readonly string[],
    hint?: string
  ) => (
    <Field
      name={name}
      label={label}
      hint={hint}
      error={errors[name]?.message}
    >
      {(props) => (
        <select
          className="input w-full"
          {...props}
          {...register(name)}
        >
          <option value="">Select...</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </Field>
  );

  const number = (
    name: keyof StudentData,
    label: string,
    options: {
      step?: string;
      min?: number;
      max?: number;
      hint?: string;
    }
  ) => (
    <Field
      name={name}
      label={label}
      hint={options.hint}
      error={errors[name]?.message}
    >
      {(props) => (
        <input
          type="number"
          inputMode="decimal"
          className="input w-full"
          step={options.step ?? "1"}
          min={options.min}
          max={options.max}
          {...props}
          {...register(name, {
            setValueAs: (value) =>
              value === "" || value === null
                ? NaN
                : Number(value),
          })}
        />
      )}
    </Field>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <h1 className="h1">New prediction</h1>

        <p className="muted mt-2 max-w-xl">
          Answer all 12 questions. Your values are sent to the
          prediction API, and the returned score is saved to
          this browser's history.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-6"
        aria-busy={isSubmitting}
      >
        <Section
          title="Student profile"
          hint="Basic background details."
        >
          {number("Age", "Age", {
            min: 0,
            max: 120,
            hint: "Whole number, 0–120.",
          })}

          {select("Gender", "Gender", GENDERS)}

          {select(
            "Country",
            "Country",
            KNOWN_COUNTRIES,
            "Choose a country. Select Other if yours is not listed."
          )}

          {select(
            "Academic_Level",
            "Academic level",
            ACADEMIC_LEVELS
          )}
        </Section>

        <Section
          title="Social media habits"
          hint="How the student uses social media day to day."
        >
          {select(
            "Most_Used_Platform",
            "Most used platform",
            PLATFORMS
          )}

          {select(
            "Purpose_Of_Use",
            "Main purpose of use",
            PURPOSES
          )}

          {number(
            "Avg_Daily_Usage_Hours",
            "Average daily usage (hours)",
            {
              step: "0.1",
              min: 0,
              max: 24,
              hint: "Enter a value from 0 to 24 hours.",
            }
          )}

          {number(
            "Daily_Unlocks",
            "Phone unlocks per day",
            {
              min: 0,
              hint: "Enter a whole number, 0 or greater.",
            }
          )}
        </Section>

        <Section
          title="Lifestyle & well-being"
          hint="Routine, rest, and stress."
        >
          {number("Study_Hours", "Study hours per day", {
            step: "0.1",
            min: 0,
            max: 24,
            hint: "Enter a value from 0 to 24 hours.",
          })}

          {number(
            "Physical_Activity_Hours",
            "Physical activity (hours per day)",
            {
              step: "0.1",
              min: 0,
              max: 24,
              hint: "Enter a value from 0 to 24 hours.",
            }
          )}

          {number(
            "Sleep_Hours_Per_Night",
            "Sleep (hours per night)",
            {
              step: "0.1",
              min: 0,
              max: 24,
              hint: "Enter a value from 0 to 24 hours.",
            }
          )}

          {select(
            "Stress_Level",
            "Stress level",
            STRESS_LEVELS
          )}
        </Section>

        {apiError && (
          <ErrorBanner
            error={apiError}
            busy={isSubmitting}
            onRetry={() => {
              void handleSubmit(onSubmit)();
            }}
          />
        )}

      <div className="flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row sm:items-center">
  <button
    type="button"
    className="btn btn-ghost min-h-12 whitespace-nowrap"
    disabled={isSubmitting}
    onClick={() => {
      reset(EMPTY);
      setApiError(null);
    }}
  >
    <RotateCcw
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    />
    <span>Clear form</span>
  </button>

  <button
    type="submit"
    className="btn btn-primary min-h-12 whitespace-nowrap"
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      <>
        <Loader2
          className="h-4 w-4 shrink-0 animate-spin"
          aria-hidden="true"
        />
        <span>Running model...</span>
      </>
    ) : (
      <>
        <Sparkles
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        />
        <span>Get prediction</span>
      </>
    )}
  </button>
</div>
</form>
</div>
);
}

