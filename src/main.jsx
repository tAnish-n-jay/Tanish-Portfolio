import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Github, Linkedin, Mail,
  Menu, X, ExternalLink, Code2, Cpu, BrainCircuit, Trophy, GitCommitHorizontal,
  Download, FileText, Sparkles, ChevronDown, CircleDot, Terminal, Activity
} from "lucide-react";
import "./styles.css";

const USER = "tAnish-n-jay";
const LC = "tanish1917";
const email = "tanishnjay19@gmail.com";
const featured = [
  {
    name: "PhishPrint",
    category: "MACHINE LEARNING · CYBERSECURITY",
    description: "An ML-powered phishing URL detector that engineers lexical and domain features, compares classifiers, and turns model predictions into an interactive experience.",
    tech: ["Python", "Scikit-learn", "XGBoost", "Streamlit"],
    repo: `https://github.com/${USER}/Phish-Print-v1`,
    number: "01",
    visual: "phish",
    status: "Course project"
  },
  {
    name: "Badminton Shot Analyser",
    category: "IOT · DATA PIPELINE · ANALYTICS",
    description: "A connected sports-analytics pipeline combining motion sensing, data storage, and a dashboard to explore smash movement and consistency.",
    tech: ["ESP32", "MPU6050", "PostgreSQL", "React"],
    repo: `https://github.com/${USER}`,
    number: "02",
    visual: "court",
    status: "Hardware + software"
  },
  {
    name: "Real-Time Metro Coach Occupancy",
    category: "IOT · EMBEDDED SYSTEMS",
    description: "An ESP32-based occupancy monitoring concept designed to collect and transmit coach-level data for real-world crowd awareness.",
    tech: ["ESP32", "C++", "IoT"],
    repo: `https://github.com/${USER}`,
    number: "03",
    visual: "metro",
    status: "3rd prize · Project exhibition"
  },
  {
    name: "Placement Tracker",
    category: "FULL-STACK · PRODUCT BUILDING",
    description: "A placement-preparation tracker built around real student workflows, with a React interface, REST APIs, and a MySQL data layer.",
    tech: ["React", "Node.js", "MySQL", "Render"],
    repo: `https://github.com/${USER}`,
    number: "04",
    visual: "tracker",
    status: "15+ active users"
  }
];
const skillGroups = [
  { title: "Languages", items: ["C++", "Python", "C", "JavaScript", "SQL"], icon: Code2 },
  { title: "AI / ML", items: ["Scikit-learn", "XGBoost", "Feature Engineering", "Model Evaluation"], icon: BrainCircuit },
  { title: "Web & Data", items: ["React", "Node.js", "MySQL", "PostgreSQL", "Git"], icon: Terminal },
  { title: "Hardware", items: ["ESP32", "MPU6050", "Sensor Integration", "Arduino IDE"], icon: Cpu }
];
function fmt(n) { return Number.isFinite(Number(n)) ? new Intl.NumberFormat("en-US").format(Number(n)) : "—"; }
function safeNumber(...values) { for (const value of values) { const n = Number(value); if (Number.isFinite(n) && n >= 0) return n; } return null; }

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver((entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);
}
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => setProgress(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    window.addEventListener("scroll", update, { passive: true }); update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [repos, setRepos] = useState([]);
  const [ghUser, setGhUser] = useState(null);
  const [ghError, setGhError] = useState("");
  const [lc, setLc] = useState(null);
  const [lcError, setLcError] = useState("");
  const [cursor, setCursor] = useState({ x: -100, y: -100, visible: false, active: false });
  const progress = useScrollProgress();
  useReveal();

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer:fine)").matches;
    if (!isFinePointer) return;
    const move = e => setCursor(c => ({ ...c, x: e.clientX, y: e.clientY, visible: true }));
    const over = e => setCursor(c => ({ ...c, active: !!e.target.closest("a, button, [data-cursor]") }));
    const leave = () => setCursor(c => ({ ...c, visible: false }));
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerover", over); document.removeEventListener("pointerleave", leave); };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let raf;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        root.style.setProperty("--hero-shift", `${Math.min(y * 0.26, 190)}px`);
        root.style.setProperty("--title-shift", `${Math.min(y * 0.72, 600)}px`);
        root.style.setProperty("--hero-fade", `${Math.max(0, 1 - y / (window.innerHeight * 0.92))}`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${USER}`, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error("GitHub profile unavailable"); return r.json(); })
      .then(setGhUser).catch(e => { if (e.name !== "AbortError") setGhError("GitHub profile data is temporarily unavailable."); });
    fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=100`, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error("Repository data unavailable"); return r.json(); })
      .then(data => setRepos(Array.isArray(data) ? data.filter(r => !r.fork).sort((a,b) => new Date(b.updated_at)-new Date(a.updated_at)) : []))
      .catch(e => { if (e.name !== "AbortError") setGhError("Repository data is temporarily unavailable."); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/leetcode", { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error("LeetCode community API unavailable"); return r.json(); })
      .then(setLc).catch(e => { if (e.name !== "AbortError") setLcError("Live LeetCode stats will appear when the community data source is available."); });
    return () => controller.abort();
  }, []);

  const stats = useMemo(() => {
    const solved = lc?.solved || {};
    const profile = lc?.profile || {};
    const contest = lc?.contest || {};
    return {
      total: safeNumber(solved.solvedProblem, solved.totalSolved, profile.totalSolved, 366),
      easy: safeNumber(solved.easySolved, solved.easy, profile.easySolved),
      medium: safeNumber(solved.mediumSolved, solved.medium, profile.mediumSolved),
      hard: safeNumber(solved.hardSolved, solved.hard, profile.hardSolved),
      rating: safeNumber(contest.contestRating, contest.rating, profile.contestRating, 1489),
      rank: safeNumber(profile.ranking, profile.rank)
    };
  }, [lc]);

  const nav = [["About", "#about"], ["Projects", "#projects"], ["Activity", "#activity"], ["Resume", "#resume"], ["Contact", "#contact"]];
  const closeMenu = () => setMenuOpen(false);

  return <div className="site-shell">
    <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
    <div className={`custom-cursor ${cursor.visible ? "cursor-visible" : ""} ${cursor.active ? "cursor-active" : ""}`} style={{ left: cursor.x, top: cursor.y }} aria-hidden="true" />
    <header className="nav-wrap">
      <a className="wordmark" href="#top" aria-label="Tanish home"><span className="wordmark-mark">T.</span><span>TANISH N JAY</span></a>
      <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`} aria-label="Main navigation">
        {nav.map(([label, href]) => <a key={label} href={href} onClick={closeMenu}>{label}</a>)}
        <a className="nav-contact" href={`mailto:${email}`} onClick={closeMenu}>Let’s talk <ArrowUpRight size={14}/></a>
      </nav>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <section className="hero" id="top">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-topline"><span><i className="status-dot"/> AVAILABLE FOR COLLABORATION</span><span className="hero-location">BENGALURU, INDIA&nbsp; ↗</span></div>
        <div className="hero-title-wrap">
          <h1 className="hero-title"><span>EXPLORE MY</span><span className="title-muted">PORTFOLIO</span></h1>
        </div>
        <div className="hero-copy">
          <div className="hero-index mono">PORTFOLIO / 2026</div>
          <p>Curious by nature.<br/><strong>Building to understand.</strong></p>
        </div>
        <div className="hero-bottom">
          <a href="#projects" className="hero-cta">EXPLORE SELECTED WORK <ArrowDownRight size={17}/></a>
          <span className="scroll-note"><span className="scroll-line"/> SCROLL TO EXPLORE</span>
          <span className="hero-number mono">01 — 07</span>
        </div>
        <div className="hero-star" aria-hidden="true">✳</div>
      </section>

      <section className="intro section-pad" id="about">
        <div className="section-label" data-reveal><span>01 / ABOUT</span><span className="label-line"/></div>
        <div className="intro-grid">
          <h2 data-reveal>Learning loudly.<br/><span>Building quietly.</span></h2>
          <div className="intro-body" data-reveal>
            <p className="eyebrow">HELLO, I'M TANISH.</p>
            <p>I'm a Computer Science & Engineering student at RV University, Bengaluru, majoring in AI/ML. I enjoy turning ideas into working systems — from algorithms and machine learning experiments to full-stack apps and sensor-driven projects.</p>
            <p>I'm eager to learn new things, understand the why behind the code, and keep getting better through building. Right now, I'm growing at the intersection of software engineering, problem-solving, and applied machine learning.</p>
            <a className="text-link" href="https://github.com/tAnish-n-jay" target="_blank" rel="noreferrer">MORE ON GITHUB <ArrowUpRight size={16}/></a>
          </div>
        </div>
        <div className="intro-strip" data-reveal>
          <div><span className="strip-label">CURRENT FOCUS</span><strong>Algorithms · AI/ML · Systems</strong></div>
          <div><span className="strip-label">APPROACH</span><strong>Understand. Build. Iterate.</strong></div>
          <div><span className="strip-label">EDUCATION</span><strong>RV University · 2025—2029</strong></div>
        </div>
      </section>

      <section className="projects section-pad" id="projects">
        <div className="section-label" data-reveal><span>02 / SELECTED WORK</span><span className="label-line"/><span className="section-side">A FEW THINGS I'VE BUILT</span></div>
        <div className="section-heading" data-reveal><h2>Selected <span>projects.</span></h2><p>Four projects. Different problems.<br/>One habit: learn by building.</p></div>
        <div className="project-grid">
          {featured.map((p, i) => <article className={`project-card project-${p.visual}`} key={p.name} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
            <div className="project-art">
              <div className="project-art-top"><span className="mono">{p.number} / 04</span><span className="art-status"><i/> {p.status}</span></div>
              {p.visual === "phish" && <div className="phish-visual"><div className="scan-ring ring-one"/><div className="scan-ring ring-two"/><div className="scan-core"><BrainCircuit size={42}/><span>URL / SCAN</span></div><div className="scan-tag tag-a">FEATURE EXTRACTION</div><div className="scan-tag tag-b">CLASSIFIER: XGBOOST</div><div className="scan-tag tag-c">RISK ANALYSIS</div></div>}
              {p.visual === "court" && <div className="court-visual"><div className="court-lines"/><div className="court-ball"/><span className="court-readout">MOTION / 6-AXIS</span><span className="court-readout bottom">SENSOR → DATA → INSIGHT</span></div>}
              {p.visual === "metro" && <div className="metro-visual"><div className="metro-track"><span/><span/><span/><span/><span/></div><div className="metro-signal"><Activity size={42}/><b>LIVE SIGNAL</b><small>ESP32 / OCCUPANCY</small></div><div className="metro-pulse"/></div>}
              {p.visual === "tracker" && <div className="tracker-visual"><div className="tracker-window"><div className="window-dots"><i/><i/><i/></div><div className="tracker-head">PLACEMENT / TRACKER</div><div className="tracker-row"><span>DSA practice</span><b>78%</b></div><div className="tracker-bar"><i style={{width:"78%"}}/></div><div className="tracker-row"><span>Applications</span><b>12</b></div><div className="tracker-bar"><i style={{width:"54%"}}/></div><div className="tracker-row"><span>Interview prep</span><b>64%</b></div><div className="tracker-bar"><i style={{width:"64%"}}/></div></div></div>}
            </div>
            <div className="project-info">
              <div className="project-kicker">{p.category}</div><h3>{p.name}</h3><p>{p.description}</p>
              <div className="tech-tags">{p.tech.map(t=><span key={t}>{t}</span>)}</div>
              <div className="project-actions"><a href={p.repo} target="_blank" rel="noreferrer">SOURCE / PROFILE <ArrowUpRight size={15}/></a><span>{p.number}</span></div>
            </div>
          </article>)}
        </div>
        <div className="projects-foot" data-reveal><span>MORE EXPERIMENTS, REPOS & ITERATIONS</span><a className="text-link" href={`https://github.com/${USER}?tab=repositories`} target="_blank" rel="noreferrer">EXPLORE ALL REPOSITORIES <ArrowRight size={16}/></a></div>
      </section>

      <section className="skills section-pad" id="skills">
        <div className="section-label" data-reveal><span>03 / TOOLKIT</span><span className="label-line"/><span className="section-side">TOOLS ARE A MEANS, NOT THE POINT</span></div>
        <div className="section-heading" data-reveal><h2>My current <span>toolkit.</span></h2><p>Always learning. Never done.<br/>These are the tools I build with today.</p></div>
        <div className="skills-grid">
          {skillGroups.map((group, i) => {const Icon=group.icon;return <article className="skill-card" data-reveal key={group.title} style={{transitionDelay:`${i*80}ms`}}><div className="skill-card-top"><Icon size={21}/><span className="mono">0{i+1}</span></div><h3>{group.title}</h3><div className="skill-list">{group.items.map(item=><span key={item}>{item}</span>)}</div></article>})}
        </div>
      </section>

      <section className="activity section-pad" id="activity">
        <div className="section-label" data-reveal><span>04 / OPEN SOURCE & PRACTICE</span><span className="label-line"/></div>
        <div className="section-heading" data-reveal><h2>Consistency is a <span>practice.</span></h2><p>Real profile data where available.<br/>No made-up dashboards.</p></div>
        <div className="activity-grid">
          <article className="activity-card github-card" data-reveal>
            <div className="activity-card-head"><div className="activity-brand"><Github size={21}/><div><h3>GitHub</h3><span>@{USER}</span></div></div><a href={`https://github.com/${USER}`} target="_blank" rel="noreferrer" aria-label="Open GitHub profile"><ExternalLink size={16}/></a></div>
            <div className="github-stats">
              <div><strong>{ghUser ? fmt(ghUser.public_repos) : "—"}</strong><span>PUBLIC REPOS</span></div>
              <div><strong>{ghUser ? fmt(ghUser.followers) : "—"}</strong><span>FOLLOWERS</span></div>
              <div><strong>{repos.length ? fmt(repos.reduce((n,r)=>n+r.stargazers_count,0)) : "—"}</strong><span>REPO STARS</span></div>
            </div>
            <div className="heatmap-heading"><span>RECENT CONTRIBUTIONS</span><span className="live-label"><i/> LIVE</span></div>
            <GitHubHeatmap username={USER}/>
            <div className="recent-repos"><div className="mini-heading">RECENT PUBLIC REPOSITORIES</div>
              {repos.slice(0,4).map(r=><a className="repo-row" href={r.html_url} target="_blank" rel="noreferrer" key={r.id}><span><b>{r.name}</b><small>{r.description || "No description provided"}</small></span><span className="repo-meta">{r.language || "Code"} <i>★ {r.stargazers_count}</i><ArrowUpRight size={14}/></span></a>)}
              {!repos.length && <p className="muted-note">{ghError || "Loading public repositories…"}</p>}
            </div>
          </article>
          <article className="activity-card leetcode-card" data-reveal>
            <div className="activity-card-head"><div className="activity-brand"><div className="lc-mark">LC</div><div><h3>LeetCode</h3><span>@{LC}</span></div></div><a href={`https://leetcode.com/u/${LC}/`} target="_blank" rel="noreferrer" aria-label="Open LeetCode profile"><ExternalLink size={16}/></a></div>
            <div className="lc-total"><strong>{stats.total === null ? "366" : fmt(stats.total)}</strong><span>PROBLEMS SOLVED <i>{lc ? "LIVE DATA" : "CONFIRMED BASELINE"}</i></span></div>
            <div className="difficulty-list">
              {[["Easy",stats.easy,"easy"],["Medium",stats.medium,"medium"],["Hard",stats.hard,"hard"]].map(([name,val,cl])=><div className="difficulty-row" key={name}><span>{name}</span><div className="difficulty-track"><i className={cl} style={{width:val!==null && stats.total ? `${Math.min(100,val/stats.total*100)}%`:"0%"}}/></div><b>{val===null?"—":fmt(val)}</b></div>)}
            </div>
            <div className="lc-extra-stats"><div><span>CONTEST RATING</span><strong>{stats.rating === null ? "1489*" : fmt(stats.rating)}</strong></div><div><span>GLOBAL RANK</span><strong>{stats.rank===null?"—":fmt(stats.rank)}</strong></div></div>
            <LeetCodeHeatmap calendar={lc?.profile?.submissionCalendar || lc?.profile?.matchedUser?.userCalendar?.submissionCalendar}/>
            <p className="data-note">{lcError || (lc ? `Last fetched ${new Date(lc.fetchedAt).toLocaleString()}` : "*Rating from your resume; live data is being requested. LeetCode data depends on an unofficial community API.")}</p>
            <a className="card-footer-link" href={`https://leetcode.com/u/${LC}/`} target="_blank" rel="noreferrer">VIEW LEETCODE PROFILE <ArrowUpRight size={15}/></a>
          </article>
        </div>
      </section>

      <section className="achievements section-pad" id="achievements">
        <div className="section-label" data-reveal><span>05 / MILESTONES</span><span className="label-line"/></div>
        <div className="section-heading" data-reveal><h2>Small wins. <span>Real progress.</span></h2><p>Proof that the work is adding up.</p></div>
        <div className="achievement-list">
          <article data-reveal><div className="achievement-icon"><Trophy size={22}/></div><div className="achievement-main"><span>CODECON 2026 · RV UNIVERSITY</span><h3>2nd place among 350+ participants</h3><p>Intra-college coding competition</p></div><span className="achievement-year">2026</span></article>
          <article data-reveal><div className="achievement-icon"><Sparkles size={22}/></div><div className="achievement-main"><span>PROJECT EXHIBITION · RV UNIVERSITY</span><h3>3rd prize — Metro Coach Occupancy Monitor</h3><p>Recognition for an IoT-based engineering project</p></div><span className="achievement-year">2026</span></article>
          <article data-reveal><div className="achievement-icon"><GitCommitHorizontal size={22}/></div><div className="achievement-main"><span>CONSISTENT PRACTICE</span><h3>366 LeetCode problems solved</h3><p>A growing habit of approaching problems, learning patterns, and iterating on solutions.</p></div><span className="achievement-year">ONGOING</span></article>
        </div>
      </section>

      <section className="resume section-pad" id="resume">
        <div className="section-label" data-reveal><span>06 / RESUME</span><span className="label-line"/></div>
        <div className="resume-panel" data-reveal>
          <div className="resume-copy"><span className="eyebrow">THE ONE-PAGE OVERVIEW</span><h2>Want the<br/><span>details?</span></h2><p>Education, technical skills, projects, and achievements — all in one place.</p><div className="resume-actions"><a className="button-light" href="/assets/tanish-resume.pdf" target="_blank" rel="noreferrer"><FileText size={17}/> Preview resume <ArrowUpRight size={15}/></a><a className="button-outline" href="/assets/tanish-resume.pdf" download="Tanish-N-Jay-Resume.pdf"><Download size={17}/> Download PDF</a></div></div>
          <div className="resume-preview"><div className="paper-top"><span>TANISH N JAY</span><span>RESUME / 2026</span></div><div className="paper-rule"/><div className="paper-title">Computer Science & Engineering<br/><span>AI/ML Major</span></div><div className="paper-lines"><i/><i/><i/><i/><i/><i/></div><div className="paper-bottom"><span>EDUCATION</span><span>PROJECTS</span><span>SKILLS</span></div><div className="paper-stamp">PDF ↗</div></div>
        </div>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="section-label" data-reveal><span>07 / NEXT CHAPTER</span><span className="label-line"/></div>
        <div className="contact-main" data-reveal><p className="eyebrow">HAVE A GOOD PROBLEM?</p><h2>Let's build<br/><span>something real.</span></h2><a className="contact-email" href={`mailto:${email}`}>{email}<ArrowUpRight size={19}/></a></div>
        <div className="contact-bottom"><span>OPEN TO LEARNING, COLLABORATION & GOOD CONVERSATIONS.</span><div className="social-links"><a href={`https://github.com/${USER}`} target="_blank" rel="noreferrer"><Github size={16}/> GitHub <ArrowUpRight size={13}/></a><a href={`https://leetcode.com/u/${LC}/`} target="_blank" rel="noreferrer">LeetCode <ArrowUpRight size={13}/></a><a href="https://linkedin.com/in/tanish-n-jay" target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn <ArrowUpRight size={13}/></a></div></div>
      </section>
    </main>
    <footer className="footer"><a className="wordmark" href="#top"><span className="wordmark-mark">T.</span><span>TANISH N JAY</span></a><span>DESIGNED TO KEEP EVOLVING © {new Date().getFullYear()}</span><a href="#top" className="back-top">BACK TO TOP ↑</a></footer>
  </div>;
}

function GitHubHeatmap({ username }) {
  const [cells, setCells] = useState([]);
  const [message, setMessage] = useState("Loading contribution activity…");
  useEffect(() => {
    const url = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`;
    fetch(url).then(r => { if (!r.ok) throw new Error("Heatmap unavailable"); return r.json(); })
      .then(data => { setCells(data.contributions || []); setMessage(""); })
      .catch(() => setMessage("Contribution heatmap unavailable right now."));
  }, [username]);
  const weeks = useMemo(() => {
    if (!cells.length) return [];
    const first = new Date(cells[0].date + "T00:00:00Z").getUTCDay();
    const padded = [...Array(first).fill(null), ...cells];
    const cols = [];
    for (let i=0;i<padded.length;i+=7) cols.push(padded.slice(i,i+7));
    return cols;
  }, [cells]);
  const max = Math.max(1, ...cells.map(c => c.count || 0));
  return <div className="heatmap-wrap">
    {cells.length ? <><div className="heatmap-months"><span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span></div><div className="heatmap">{weeks.map((week,i)=><div className="heatmap-week" key={i}>{week.map((day,j)=>day ? <span key={day.date} className={`heat-level level-${Math.min(4, Math.ceil((day.count||0)/max*4))}`} title={`${day.date}: ${day.count} contributions`}/> : <span key={`blank-${i}-${j}`} className="heat-empty"/>)}</div>)}</div><div className="heat-legend"><span>LESS</span>{[0,1,2,3,4].map(i=><i key={i} className={`level-${i}`}/>)}<span>MORE</span></div></> : <div className="heatmap-fallback"><div className="heatmap-skeleton">{Array.from({length:91},(_,i)=><i key={i} className={`level-${(i*7+i%4)%5}`}/>)}</div><span>{message}</span></div>}
  </div>;
}
function LeetCodeHeatmap({ calendar }) {
  const days = useMemo(() => {
    if (!calendar) return [];
    let parsed = calendar;
    if (typeof parsed === "string") { try { parsed = JSON.parse(parsed); } catch { return []; } }
    return Object.entries(parsed).map(([ts,count])=>({ date: new Date(Number(ts)*1000).toISOString().slice(0,10), count: Number(count) })).sort((a,b)=>a.date.localeCompare(b.date)).slice(-364);
  }, [calendar]);
  const max = Math.max(1, ...days.map(d=>d.count));
  return <div className="lc-heatmap-section"><div className="heatmap-heading"><span>SUBMISSION ACTIVITY</span><span>{days.length ? "LIVE CALENDAR" : "PROFILE LINK"}</span></div>{days.length ? <div className="lc-heatmap">{days.map(d=><i key={d.date} className={`level-${Math.min(4,Math.ceil(d.count/max*4))}`} title={`${d.date}: ${d.count} submissions`}/>)}</div> : <div className="lc-heatmap-empty"><span className="heatmap-skeleton compact">{Array.from({length:140},(_,i)=><i key={i} className={`level-${(i*3+i%5)%5}`}/>)}</span><p>LeetCode calendar data is not available from the current API response. Open your profile for the full submission calendar.</p></div>}</div>;
}
createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);