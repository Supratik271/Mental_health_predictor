import { useState } from "react";
import { Link } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Trash2 } from "lucide-react";
import { clearHistory, loadHistory, removeEntry, type HistoryEntry } from "../history";
import { Disclaimer, EmptyState } from "../components/ui";

export default function History() {
  const [list, setList] = useState<HistoryEntry[]>(loadHistory);

  if (list.length === 0) {
    return (
      <EmptyState title="No predictions yet" body="Predictions you run are saved in this browser and listed here."
        action={<Link to="/predict" className="btn-primary">Start a prediction</Link>} />
    );
  }

  const chartData = [...list].reverse().map((e, i) => ({ n: i + 1, score: e.score, when: new Date(e.createdAt).toLocaleString() }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h1">History</h1>
          <p className="muted mt-1">{list.length} saved on this device. Only you can see these; they are never uploaded.</p>
        </div>
        <button className="btn-danger" onClick={() => { if (window.confirm("Delete all saved predictions? This can't be undone.")) { clearHistory(); setList([]); } }}>
          <Trash2 className="h-4 w-4" aria-hidden /> Clear history
        </button>
      </div>

      {list.length > 1 && (
        <section className="card p-6" aria-labelledby="trend-h">
          <h2 id="trend-h" className="font-display text-lg font-semibold text-white">Your scores over time</h2>
          <p className="muted mb-4">Built only from predictions you ran here. Not a research finding.</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="n" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0f1a3a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#e2e8f0" }}
                  labelFormatter={(n) => `Prediction #${n}`} />
                <Line type="monotone" dataKey="score" name="Score" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <ul className="space-y-3">
        {list.map((e) => (
          <li key={e.id} className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-500/30 font-display text-2xl font-semibold text-white" aria-label={`Score ${e.score}`}>
              {e.score}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-100">{e.input.Academic_Level}, age {e.input.Age}, {e.input.Country}</p>
              <p className="muted">{new Date(e.createdAt).toLocaleString()} · {e.input.Most_Used_Platform} · stress {e.input.Stress_Level}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/results/${e.id}`} className="btn-ghost !py-2">View</Link>
              <button className="btn-danger !px-3 !py-2" aria-label={`Delete prediction from ${new Date(e.createdAt).toLocaleString()}`}
                onClick={() => setList(removeEntry(e.id))}>
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Disclaimer />
    </div>
  );
}
