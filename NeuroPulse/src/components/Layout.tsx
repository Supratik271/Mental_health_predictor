import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, ArrowUpRight, BrainCircuit, ChevronRight, CircleHelp,
  Command, LayoutDashboard, Menu, Plus, ShieldCheck, Sparkles,
  Waypoints, X, History as HistoryIcon,
} from "lucide-react";
import { checkApi } from "../api";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/predict", label: "New assessment", icon: Plus },
  { to: "/results", label: "Latest result", icon: Activity },
  { to: "/history", label: "Assessment history", icon: HistoryIcon },
  { to: "/about", label: "Model & project", icon: Waypoints },
];

function ApiStatus() {
  const [up, setUp] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    const run = () => checkApi().then((ok) => alive && setUp(ok));
    void run();
    const t = window.setInterval(run, 30000);
    return () => { alive = false; window.clearInterval(t); };
  }, []);
  const label = up === null ? "Checking API" : up ? "Model API online" : "API offline";
  return <span className={`api-pill ${up ? "is-online" : up === false ? "is-offline" : "is-checking"}`} role="status"><span className="status-dot" />{label}</span>;
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }, [pathname]);
  const current = NAV.find((n) => n.end ? pathname === n.to : pathname.startsWith(n.to));

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <aside className="sidebar">
        <Link to="/" className="brand-lockup" aria-label="NeuroPulse home">
          <span className="brand-mark"><BrainCircuit size={22} strokeWidth={1.8} /></span>
          <span className="brand-copy"><strong>NeuroPulse<span>.</span></strong><small>STUDENT WELLBEING · ML WORKSPACE</small></span>
        </Link>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {NAV.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
            <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === "New assessment" && <span className="nav-plus">↗</span>}
          </NavLink>)}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-note">
          <div className="note-icon"><ShieldCheck size={17} /></div>
          <strong>Built for transparency</strong>
          <p>Model estimates, clear limitations, no clinical claims.</p>
          <Link to="/about">Read our approach <ArrowUpRight size={13} /></Link>
        </div>
        <div className="sidebar-bottom"><span className="mini-avatar">NP</span><div><strong>NeuroPulse workspace</strong><small>Personal demo environment</small></div><CircleHelp size={16} className="sidebar-help" /></div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Toggle navigation">{open ? <X size={20} /> : <Menu size={20} />}</button>
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{current?.label ?? "NeuroPulse"}</strong></div>
          <div className="topbar-right"><ApiStatus /><span className="topbar-divider" /><span className="topbar-tag"><Command size={13} /> ML PROJECT</span></div>
        </header>
        <AnimatePresence initial={false}>
          {open && <motion.nav className="mobile-nav" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} aria-label="Mobile navigation">
            {NAV.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}><Icon size={18} /><span>{label}</span></NavLink>)}
          </motion.nav>}
        </AnimatePresence>
        <motion.main key={pathname} id="main" className="page-content" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
          <Outlet />
        </motion.main>
        <footer className="app-footer"><span>© {new Date().getFullYear()} NeuroPulse</span><span><span className="footer-dot" /> Portfolio project · Educational use only</span><span>Designed for clarity <Sparkles size={12} /></span></footer>
      </div>
    </div>
  );
}
