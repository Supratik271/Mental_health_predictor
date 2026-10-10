import { Link } from "react-router-dom";
import { Disclaimer } from "../components/ui";

const STACK = [
  ["Frontend", "React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide"],
  ["Forms", "React Hook Form with Zod validation mirroring the API schema"],
  ["Backend", "FastAPI with Pydantic request validation"],
  ["Model", "A scikit-learn style pipeline loaded with joblib (Mental_health_Model.pkl)"],
];

const FLOW = [
  "The form validates all 12 fields in the browser.",
  "The client sends a JSON POST to /api/predict. In development, Vite proxies it to http://127.0.0.1:8000/predict.",
  "FastAPI validates the body against its Pydantic model and groups countries outside its top list into “Other”.",
  "The backend builds a one-row DataFrame, runs model.predict, rounds the result to one decimal place, and returns {\"predicted_mental_health_score\": n}.",
  "The frontend displays that value and saves it to local history.",
];

const LIMITS = [
  "The score is a model-generated estimate. It is not a diagnosis, screening result, or clinical measure.",
  "The meaning and range of the score are not defined by the API, so the gauge uses a 0–10 display scale for visualization only.",
  "This project doesn't report model accuracy, feature importance, or confidence, because the API doesn't provide them.",
  "Results depend on the data the model was trained on, which this interface doesn't describe. Treat them as a demonstration.",
  "History is stored in your browser's local storage and disappears if you clear site data.",
  "Don't use this tool for decisions about any person's health, education, or welfare.",
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="h1">About the model</h1>
        <p className="muted mt-2">How NeuroPulse turns a form into a prediction, what it's built with, and where its limits are.</p>
      </div>

      <Block title="How a prediction is made">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300 marker:text-violet-300">{FLOW.map((s) => <li key={s}>{s}</li>)}</ol>
      </Block>

      <Block title="Technology">
        <dl className="divide-y divide-white/5">
          {STACK.map(([k, v]) => (
            <div key={k} className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]">
              <dt className="font-medium text-white">{k}</dt>
              <dd className="text-slate-400">{v}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block title="API integration">
        <p className="muted">Endpoint: <code className="rounded bg-white/10 px-1.5 py-0.5 text-slate-200">POST /predict</code>. Errors are mapped as follows: network failures and timeouts show a retry banner, HTTP 422 responses highlight the offending fields, and other statuses show a server error. Entries are never cleared on failure.</p>
      </Block>

      <Block title="Limitations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300 marker:text-violet-300">{LIMITS.map((s) => <li key={s}>{s}</li>)}</ul>
      </Block>

      <Disclaimer />
      <Link to="/predict" className="btn-primary">Start a prediction</Link>
    </div>
  );
}
