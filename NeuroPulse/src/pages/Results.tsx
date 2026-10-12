import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Clock, Plus, Repeat } from "lucide-react";
import { loadHistory } from "../history";
import { FIELD_LABELS, type StudentData } from "../schema";
import { Disclaimer, EmptyState, Gauge, GAUGE_MAX } from "../components/ui";

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fresh = (useLocation().state as { fresh?: boolean } | null)?.fresh;
  const list = loadHistory();
  const entry = id ? list.find((e) => e.id === id) : list[0];

  if (!entry) {
    return (
      <EmptyState
        title={id ? "That result isn't in your history" : "No results yet"}
        body={id ? "It may have been deleted. Run a new prediction to see a score." : "Run a prediction and your score will show up here."}
        action={<Link to="/predict" className="btn-primary">Start a prediction</Link>}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {fresh && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 className="h-4 w-4" aria-hidden /> Prediction received from the model and saved to your history.
        </div>
      )}
      <div>
        <h1 className="h1">Your result</h1>
        <p className="muted mt-1">Generated {new Date(entry.createdAt).toLocaleString()}</p>
      </div>

      <section className="card p-8 text-center" aria-labelledby="score-h">
        <h2 id="score-h" className="font-display text-lg font-semibold text-white">Predicted mental health score</h2>
        <div className="mt-4"><Gauge value={entry.score} /></div>
        <div className="mx-auto mt-4 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
          <h3 className="text-sm font-semibold text-white">How to read this result</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">Your model returned <strong className="text-white">{entry.score.toFixed(1)} / 10</strong> on this display. A higher number may indicate a higher value of the dataset's target, but the available project documentation does not verify the target's clinical interpretation or validated good/bad cut-offs. Treat this as an educational prediction—not a diagnosis or a definitive judgement about your well-being.</p>
          <p className="mt-2 text-xs text-slate-500">Display scale: 0–{GAUGE_MAX}. The colours are visual guidance only; they are not medically validated risk categories.</p>
        </div>
      </section>

      <Disclaimer />

      <section className="card p-6 sm:p-8" aria-labelledby="inputs-h">
        <h2 id="inputs-h" className="font-display text-lg font-semibold text-white">Inputs used</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(FIELD_LABELS) as (keyof StudentData)[]).map((k) => (
            <div key={k} className="border-b border-white/5 pb-3">
              <dt className="text-xs text-slate-500">{FIELD_LABELS[k]}</dt>
              <dd className="mt-0.5 font-medium text-slate-100">{String(entry.input[k])}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/predict"
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden />
          <span>Run another prediction</span>
        </Link>

        <button
          className="btn-ghost inline-flex items-center justify-center gap-2"
          onClick={() => navigate("/predict", { state: { prefill: entry.input } })}
        >
          <Repeat className="h-4 w-4 shrink-0" aria-hidden />
          <span>Edit these inputs</span>
        </button>

        <Link
          to="/history"
          className="btn-ghost inline-flex items-center justify-center gap-2"
        >
          <Clock className="h-4 w-4 shrink-0" aria-hidden />
          <span>View history</span>
        </Link>
      </div>
    </div>
  );
}

