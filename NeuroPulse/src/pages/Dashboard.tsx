import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BrainCircuit,
  CheckCircle2, Clock3, Database, Fingerprint, HeartPulse, Layers3,
  LockKeyhole, Plus, Sparkles, Waypoints, Zap,
} from "lucide-react";
import { loadHistory } from "../history";

const FEATURES = [
  { icon: BrainCircuit, title: "Live model inference", body: "Every result comes from your trained model through the FastAPI endpoint. No simulated scores." },
  { icon: Fingerprint, title: "A clear input trail", body: "Review the exact student profile and lifestyle inputs used for each saved prediction." },
  { icon: LockKeyhole, title: "Local-first history", body: "Your assessment history stays in this browser. Clear it whenever you want." },
];
const STEPS = [
  { n: "01", title: "Describe the context", body: "Enter the student profile, platform habits and daily routine." },
  { n: "02", title: "Run the model", body: "Validated data is sent to your FastAPI service for inference." },
  { n: "03", title: "Review the output", body: "See the returned score and inspect the inputs behind it." },
];
const entrance = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

function OrbitVisual() {
  return <div className="orbit-scene" aria-hidden="true">
    <div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-ring ring-three" />
    <div className="orbit-center"><BrainCircuit size={43} strokeWidth={1.4} /></div>
    <span className="orbit-node node-a"><Activity size={17} /></span>
    <span className="orbit-node node-b"><Layers3 size={17} /></span>
    <span className="orbit-node node-c"><HeartPulse size={17} /></span>
    <span className="orbit-node node-d"><Waypoints size={17} /></span>
    <div className="orbit-caption"><span className="caption-dot" /><span><strong>Inference pipeline</strong><small>Form → API → model output</small></span></div>
  </div>;
}

export default function Dashboard() {
  const history = loadHistory();
  const latest = history[0];
  const previous = history[1];
  const scoreDelta = latest && previous ? latest.score - previous.score : null;
  const uniquePlatforms = new Set(history.map((entry) => entry.input.Most_Used_Platform)).size;

  return <div className="space-y-8">
    <motion.section className="hero-panel" initial="hidden" animate="visible" variants={entrance} transition={{ duration: .55, ease: [0.22, 1, .36, 1] }}>
      <div className="hero-copy">
        <span className="eyebrow">Student wellbeing · ML workspace</span>
        <h1 className="hero-title">Look beyond the <em>numbers.</em><br />Understand the pattern.</h1>
        <p className="hero-description">A thoughtful interface for exploring how student routines and social media habits map to a model-generated score.</p>
        <div className="hero-actions">
          <Link to="/predict" className="btn btn-primary"><Plus size={16} /> Run an assessment <ArrowUpRight size={15} /></Link>
          <Link to="/about" className="btn btn-ghost">Explore the model <ArrowRight size={15} /></Link>
        </div>
        <div className="hero-meta"><span className="meta-icon"><ShieldIcon /></span><span>Transparent by design</span><span style={{ opacity: .4 }}>·</span><span>No clinical claims</span></div>
      </div>
      <div className="hero-visual"><OrbitVisual /></div>
    </motion.section>

    <motion.section initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: .08 } } }} aria-label="Workspace metrics">
      <div className="section-heading"><div><h2>Your workspace</h2><p>Real activity from this browser, not sample analytics.</p></div><span className="eyebrow">LIVE SUMMARY</span></div>
      <div className="metric-grid">
        <motion.article variants={entrance} className="card card-hover metric-card">
          <div className="metric-top"><span>Assessments run</span><span className="metric-icon"><Activity size={16} /></span></div>
          <div className="metric-value">{history.length}<small>{history.length === 1 ? "saved result" : "saved results"}</small></div>
          <div className="metric-foot"><Database size={12} /> Stored locally on this device</div>
        </motion.article>
        <motion.article variants={entrance} className="card card-hover metric-card">
          <div className="metric-top"><span>Latest model output</span><span className="metric-icon"><Sparkles size={16} /></span></div>
          <div className="metric-value">{latest ? latest.score : "—"}<small>{latest ? "returned score" : "no result yet"}</small></div>
          <div className="metric-foot"><Clock3 size={12} /> {latest ? new Date(latest.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Run your first assessment"}</div>
        </motion.article>
        <motion.article variants={entrance} className="card card-hover metric-card">
          <div className="metric-top"><span>Platforms explored</span><span className="metric-icon"><Layers3 size={16} /></span></div>
          <div className="metric-value">{uniquePlatforms}<small>{uniquePlatforms === 1 ? "platform" : "platforms"}</small></div>
          <div className="metric-foot">{scoreDelta === null ? <><Zap size={12} /> Your activity summary</> : <>{scoreDelta > 0 ? <ArrowUpRight size={12} /> : scoreDelta < 0 ? <ArrowDownRight size={12} /> : <Activity size={12} />}{`Latest score change: ${scoreDelta > 0 ? "+" : ""}${scoreDelta}`}</>}</div>
        </motion.article>
      </div>
    </motion.section>

    <section className="dashboard-grid">
      <motion.div className="card panel-pad" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16, duration: .4 }}>
        <div className="flex items-start justify-between gap-4"><div><h2 className="panel-title">From input to insight</h2><p className="panel-subtitle">A simple, traceable path through your machine learning stack.</p></div><span className="metric-icon"><Waypoints size={17} /></span></div>
        <div className="workflow-list">{STEPS.map((step) => <div className="workflow-row" key={step.n}><span className="workflow-number">{step.n}</span><span><strong>{step.title}</strong><small>{step.body}</small></span><ArrowRight size={15} className="workflow-arrow" /></div>)}</div>
        <Link to="/about" className="inline-flex items-center gap-2 pt-3 text-xs font-semibold text-violet-200 transition hover:text-white">View architecture <ArrowUpRight size={14} /></Link>
      </motion.div>
      <motion.div className="card panel-pad" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24, duration: .4 }}>
        <div className="flex items-start justify-between gap-3"><div><h2 className="panel-title">Recent assessments</h2><p className="panel-subtitle">Your latest locally saved model responses.</p></div><span className="metric-icon"><Clock3 size={16} /></span></div>
        <div className="mt-4">
          {history.length === 0 ? <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center"><span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white/[.04] text-violet-200"><Activity size={18} /></span><p className="mt-3 text-xs font-semibold text-slate-200">Nothing here yet</p><p className="mt-1 text-[11px] leading-relaxed text-slate-500">Run an assessment to populate your real history.</p><Link to="/predict" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-violet-200">Start now <ArrowRight size={13} /></Link></div> : <>
            {history.slice(0, 3).map((entry) => <Link to={`/results/${entry.id}`} className="recent-row group" key={entry.id}><span className="recent-score">{entry.score}</span><span className="recent-copy"><strong>{entry.input.Academic_Level} · age {entry.input.Age}</strong><small>{entry.input.Most_Used_Platform} · {new Date(entry.createdAt).toLocaleDateString()}</small></span><ArrowUpRight size={15} className="recent-link transition group-hover:text-violet-200" /></Link>)}
            <Link to="/history" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-violet-200">View full history <ArrowRight size={13} /></Link>
          </>}
        </div>
      </motion.div>
    </section>

    <section>
      <div className="section-heading"><div><h2>Designed for confidence</h2><p>Useful product details, without pretending the model knows more than it does.</p></div></div>
      <motion.div className="feature-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .15 }} variants={{ visible: { transition: { staggerChildren: .08 } } }}>
        {FEATURES.map(({ icon: Icon, title, body }) => <motion.article key={title} variants={entrance} className="card card-hover feature-card"><span className="feature-icon"><Icon size={18} /></span><h3>{title}</h3><p>{body}</p></motion.article>)}
      </motion.div>
    </section>

    <motion.section className="featured-cta" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .4 }}>
      <div><h2>Ready to explore a new assessment?</h2><p>Use the live API, review the output and keep a clear record of the inputs.</p></div>
      <Link to="/predict" className="btn btn-primary">Start assessment <ArrowRight size={15} /></Link>
    </motion.section>
    <p className="text-center text-[10px] leading-relaxed text-slate-600">NeuroPulse is an educational portfolio project. Scores are model-generated estimates; their clinical meaning is not established.</p>
  </div>;
}

function ShieldIcon() {
  return <CheckCircle2 size={13} />;
}
