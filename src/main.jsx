import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  Network,
  PenLine,
  GraduationCap,
  CalendarDays,
  Library,
  Check,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lightbulb,
  RotateCcw,
  Download,
  Menu,
  X,
  Play,
  Pause,
  Target,
  Braces,
  GitBranch,
  Layers,
  Route,
  Infinity as InfinityIcon,
  Search,
  Bookmark,
} from "lucide-react";
import { modules, exercises, plan } from "./content";
import { DijkstraLab, Lab } from "./Labs";
import { daysUntilExam } from "./algorithms";
import "./styles.css";
const topicIcons = {
  dijkstra: Route,
  reductions: Layers,
  greedy: Target,
  mst: GitBranch,
  amortized: InfinityIcon,
};
function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      return saved ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      window.dispatchEvent(new Event("storage-unavailable"));
    }
  }, [key, value]);
  return [value, setValue];
}
function App() {
  const [route, setRoute] = useState(
      () => location.hash.slice(1) || "overview",
    ),
    [menu, setMenu] = useState(false),
    [progress, setProgress] = useStored("as-progress-v1", {}),
    [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const f = () => setRoute(location.hash.slice(1) || "overview"),
      s = () => setStorageError(true);
    window.addEventListener("hashchange", f);
    window.addEventListener("storage-unavailable", s);
    return () => {
      window.removeEventListener("hashchange", f);
      window.removeEventListener("storage-unavailable", s);
    };
  }, []);
  function go(to) {
    location.hash = to;
    setRoute(to);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const mark = (id, part) =>
    setProgress((p) => ({ ...p, [id]: { ...p[id], [part]: true } }));
  const count = Object.values(progress).reduce(
      (sum, p) => sum + ["lab", "proof", "quiz"].filter((k) => p[k]).length,
      0,
    ),
    pct = Math.round((count / 15) * 100);
  const activeModule = modules.find((m) => m.id === route.split("/")[1]);
  const days = daysUntilExam();
  const nav = [
    ["overview", LayoutDashboard, "Study overview"],
    ["learn/dijkstra", Network, "Interactive lessons"],
    ["proofs", PenLine, "Proof toolkit"],
    ["practice", GraduationCap, "Practice room"],
    ["plan", CalendarDays, "Study plan"],
    ["library", Library, "Lecture library"],
  ];
  let title = route.startsWith("learn/")
    ? "Interactive lessons"
    : nav.find((n) => n[0] === route)?.[2] || "Study overview";
  return (
    <div className="app">
      <button
        className="mobile-menu icon-button"
        aria-label={menu ? "Close navigation" : "Open navigation"}
        aria-expanded={menu}
        onClick={() => setMenu(!menu)}
      >
        {menu ? <X /> : <Menu />}
      </button>
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <a className="brand" href="#overview" onClick={() => go("overview")}>
          <span className="brand-mark">
            <Network size={25} />
          </span>
          <span>
            algorithm<span className="brand-studio">STUDIO</span>
          </span>
        </a>
        <div className="course-badge">
          <span className="course-dot" />
          <div>
            <strong>CSE 202</strong>
            <small>Graduate algorithms · Fall 2026</small>
          </div>
        </div>
        <span className="nav-label">YOUR WORKSPACE</span>
        <nav>
          {nav.map(([id, Icon, label]) => (
            <a
              key={id}
              href={"#" + id}
              className={
                route === id ||
                (id === "learn/dijkstra" && route.startsWith("learn/"))
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={(e) => {
                e.preventDefault();
                go(id);
              }}
            >
              <Icon size={19} />
              {label}
              {id === "practice" && <span className="nav-count">5</span>}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="exam-card">
            <CalendarDays size={20} />
            <strong>A little practice, every day.</strong>
            <p>
              Your midterm is November 7.
              <br />
              Let’s make the ideas stick.
            </p>
            <button onClick={() => go("plan")}>
              View your study plan <ArrowRight size={15} />
            </button>
          </div>
          <div className="local-status">
            <span className="avatar">Y</span>
            <div>
              <strong>Your study space</strong>
              <span>Progress saved on this device</span>
            </div>
            <span className="status-dot" />
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div>
            CSE 202 <ChevronRight size={14} /> <strong>{title}</strong>
          </div>
          <span className="topbar-note">
            <span className="live-dot" /> Built for understanding
          </span>
        </header>
        <main>
          {storageError && (
            <div className="storage-warning" role="alert">
              Browser storage is unavailable. Your work will last for this
              session only; export written answers before leaving.
            </div>
          )}
          {route === "overview" ? (
            <Overview
              go={go}
              progress={progress}
              pct={pct}
              count={count}
              days={days}
            />
          ) : route.startsWith("learn/") && activeModule ? (
            <Lesson
              key={activeModule.id}
              module={activeModule}
              go={go}
              progress={progress[activeModule.id] || {}}
              mark={mark}
            />
          ) : route === "proofs" ? (
            <ProofToolkit />
          ) : route === "practice" ? (
            <Practice />
          ) : route === "plan" ? (
            <StudyPlan go={go} days={days} />
          ) : route === "library" ? (
            <LibraryPage go={go} />
          ) : (
            <Overview
              go={go}
              progress={progress}
              pct={pct}
              count={count}
              days={days}
            />
          )}
        </main>
        <footer>
          <span>Algorithm Studio</span>
          <span>Understand the idea. Justify every step.</span>
          <span>CSE 202 · Fall 2026</span>
        </footer>
      </div>
    </div>
  );
}
function PageIntro({ eyebrow, title, desc, children }) {
  return (
    <div className="page-intro">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {children}
    </div>
  );
}
function Overview({ go, progress, pct, count, days }) {
  const next =
    modules.find(
      (m) => !["lab", "proof", "quiz"].every((k) => progress[m.id]?.[k]),
    ) || modules[0];
  return (
    <>
      <PageIntro
        eyebrow="YOUR ALGORITHMS STUDY COMPANION"
        title={
          <>
            Big ideas. <em>One step at a time.</em>
          </>
        }
        desc="See the algorithm, build the proof, and make the reasoning your own."
      >
        <div className="countdown">
          <CalendarDays size={18} />
          <span>
            Midterm · Nov 7
            <strong>
              {days > 0
                ? `${days} days to prepare`
                : days === 0
                  ? "Exam day"
                  : "Keep practicing"}
            </strong>
          </span>
        </div>
      </PageIntro>
      <div className="overview-stats">
        <div>
          <span className="stat-icon">
            <BookOpen size={20} />
          </span>
          <div>
            <strong>
              5 <span>learning modules</span>
            </strong>
            <small>From shortest paths to amortized analysis</small>
          </div>
        </div>
        <div>
          <span className="stat-icon peach">
            <PenLine size={20} />
          </span>
          <div>
            <strong>
              3 <span>exam essentials</span>
            </strong>
            <small>Algorithm · Correctness · Complexity</small>
          </div>
        </div>
        <div>
          <div className="progress-ring" style={{ "--progress": `${pct}%` }}>
            <span>{pct}%</span>
          </div>
          <div>
            <strong>Your progress</strong>
            <small>{count} of 15 learning checkpoints</small>
          </div>
        </div>
      </div>
      <div className="dashboard-grid">
        <section className="continue-card">
          <div className="eyebrow">
            <span className="live-dot" />{" "}
            {count ? "CONTINUE YOUR JOURNEY" : "A GOOD PLACE TO START"}
          </div>
          <span className="week-chip">
            {next.week} <span>·</span> {next.time}
          </span>
          <h2>{next.title}</h2>
          <p>
            {next.description} Explore the intuition, then explain why it works.
          </p>
          <div className="learning-flow">
            <span>
              <Network size={16} /> Visualize
            </span>
            <ChevronRight size={13} />
            <span>
              <PenLine size={16} /> Prove
            </span>
            <ChevronRight size={13} />
            <span>
              <Braces size={16} /> Analyze
            </span>
          </div>
          <button
            className="button light"
            onClick={() => go("learn/" + next.id)}
          >
            {count ? "Continue learning" : "Start learning"}{" "}
            <ArrowRight size={18} />
          </button>
          <span className="continue-decoration" aria-hidden="true">
            δ(s, v)
          </span>
        </section>
        <section className="card demo-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">LEARN BY DOING</span>
              <h3>A shortest path, unfolding.</h3>
            </div>
            <button
              className="icon-button"
              aria-label="Open full Dijkstra lesson"
              onClick={() => go("learn/dijkstra")}
            >
              <ArrowUpRight size={20} />
            </button>
          </div>
          <DijkstraLab compact />
        </section>
      </div>
      <div className="section-heading section-space">
        <div>
          <h2>Your learning path</h2>
          <p>Five connected ideas. A stronger foundation with every one.</p>
        </div>
        <span className="subtle-label">BASED ON YOUR LECTURES</span>
      </div>
      <div className="module-grid">
        {modules.map((m) => {
          const Icon = topicIcons[m.id],
            done = ["lab", "proof", "quiz"].filter(
              (k) => progress[m.id]?.[k],
            ).length;
          return (
            <button
              className="module-card"
              key={m.id}
              onClick={() => go("learn/" + m.id)}
            >
              <div className="module-card-top">
                <span className={"module-icon " + m.id}>
                  <Icon size={23} />
                </span>
                <span className="module-num">{m.num}</span>
              </div>
              <span className="module-week">{m.week}</span>
              <h3>{m.title}</h3>
              <p>{m.tag}</p>
              <div className="module-card-bottom">
                <span>
                  <Clock size={13} />
                  {m.time}
                </span>
                <span>
                  {done ? `${done}/3 complete` : "Explore"}{" "}
                  <ArrowUpRight size={15} />
                </span>
              </div>
              <div className="module-progress">
                <i style={{ width: `${(done / 3) * 100}%` }} />
              </div>
            </button>
          );
        })}
      </div>
      <section className="exam-banner">
        <div className="exam-banner-icon">
          <PenLine size={25} />
        </div>
        <div>
          <span className="eyebrow">FROM “I GET IT” TO “I CAN PROVE IT”</span>
          <h3>Practice the way you’ll be asked to think.</h3>
          <p>
            Original free-response problems, guided hints, and a rubric for your
            reasoning.
          </p>
        </div>
        <button className="button secondary" onClick={() => go("practice")}>
          Enter practice room <ArrowRight size={17} />
        </button>
      </section>
      <div className="source-note">
        <Bookmark size={14} /> Grounded in your five lecture decks. Homework
        informs the format; its problems are left unsolved.
      </div>
    </>
  );
}
function Lesson({ module: m, go, progress, mark }) {
  const [tab, setTab] = useState("Explore");
  return (
    <>
      <div className="lesson-nav">
        {modules.map((x) => (
          <button
            key={x.id}
            className={x.id === m.id ? "active" : ""}
            onClick={() => go("learn/" + x.id)}
          >
            <span>{x.num}</span>
            {x.short}
          </button>
        ))}
      </div>
      <PageIntro
        eyebrow={`${m.week.toUpperCase()} / MODULE ${m.num}`}
        title={m.title}
        desc={m.description}
      >
        <a
          className="button secondary small"
          href={`${import.meta.env.BASE_URL}lectures/${encodeURIComponent(m.asset || m.file)}#page=${m.page}`}
          target="_blank"
          rel="noreferrer"
        >
          <BookOpen size={16} /> Lecture source <ExternalLink size={13} />
        </a>
      </PageIntro>
      <div className="tabs" role="tablist" aria-label="Lesson sections">
        {[
          ["Explore", Network, "lab"],
          ["Prove", PenLine, "proof"],
          ["Analyze", Braces, null],
          ["Check understanding", CheckCircle2, "quiz"],
        ].map(([t, Icon, part]) => (
          <button
            key={t}
            role="tab"
            onKeyDown={(ev) => {
              const all = [
                "Explore",
                "Prove",
                "Analyze",
                "Check understanding",
              ];
              if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(ev.key)) {
                ev.preventDefault();
                const i =
                  ev.key === "Home"
                    ? 0
                    : ev.key === "End"
                      ? 3
                      : (all.indexOf(t) + (ev.key === "ArrowRight" ? 1 : 3)) %
                        4;
                setTab(all[i]);
                ev.currentTarget.parentElement.children[i].focus();
              }
            }}
            tabIndex={tab === t ? 0 : -1}
            aria-selected={tab === t}
            aria-controls="lesson-panel"
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            <Icon size={17} />
            {t}
            {progress[part] && <Check size={14} />}
          </button>
        ))}
      </div>
      <div id="lesson-panel" role="tabpanel">
        {tab === "Explore" ? (
          <>
            <div className="lesson-intro">
              <p>{m.intro}</p>
            </div>
            <div className="card">
              <Lab id={m.id} onComplete={() => mark(m.id, "lab")} />
            </div>
            <div className="two-column section-space">
              <section className="card content-card">
                <div className="eyebrow">THE ALGORITHM</div>
                <h3>From intuition to steps</h3>
                <pre>
                  {m.code.map((line, i) => (
                    <div key={i}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      {line}
                    </div>
                  ))}
                </pre>
              </section>
              <section className="card content-card invariant-card">
                <div className="eyebrow">KEEP THIS IN MIND</div>
                <h3>
                  {m.id === "amortized"
                    ? "The accounting identity"
                    : "The claim you will prove"}
                </h3>
                <p>{m.invariant}</p>
                <button className="text-button" onClick={() => setTab("Prove")}>
                  Build the argument <ArrowRight size={16} />
                </button>
              </section>
            </div>
            {m.id === "amortized" && (
              <div className="callout section-space">
                <strong>The lecture goes deeper.</strong>
                <p>
                  Union by rank ensures ranks strictly increase on parent paths
                  and a rank-r root represents at least 2ʳ elements. Path
                  compression preserves those invariants. Tokens bound unpaid
                  vertices to obtain O(log log n); gifts sharpen this to O(log*
                  n); further refinement yields inverse Ackermann. The full
                  token argument is in slides 30–46.
                </p>
              </div>
            )}
          </>
        ) : tab === "Prove" ? (
          <ProofBuilder
            key={m.id}
            module={m}
            complete={() => mark(m.id, "proof")}
          />
        ) : tab === "Analyze" ? (
          <Runtime module={m} />
        ) : (
          <Quiz module={m} onCorrect={() => mark(m.id, "quiz")} />
        )}
      </div>
      <p className="source-note">
        <BookOpen size={14} />
        {m.file} · PDF pages {m.pages}. Explanations are study adaptations; lab
        graphs are original examples.
      </p>
    </>
  );
}
function ProofBuilder({ module: m, complete }) {
  const initial = m.proof.map((_, i) => (i + 2) % m.proof.length);
  const [order, setOrder] = useState(initial),
    [feedback, setFeedback] = useState("");
  function move(index, delta) {
    const a = [...order];
    [a[index], a[index + delta]] = [a[index + delta], a[index]];
    setOrder(a);
    setFeedback("");
  }
  return (
    <div className="proof-layout">
      <section className="card content-card">
        <div className="eyebrow">RECONSTRUCT THE REASONING</div>
        <h2>{m.proofTitle}</h2>
        <p className="muted-text">
          Put the proof in logical order. Read the dependencies, not just the
          transition words.
        </p>
        <div className="proof-blocks">
          {order.map((id, i) => (
            <div className="proof-block" key={id}>
              <span className="proof-index">{i + 1}</span>
              <p>{m.proof[id]}</p>
              <div>
                <button
                  className="icon-button"
                  disabled={i === 0}
                  aria-label={`Move step ${i + 1} up`}
                  onClick={() => move(i, -1)}
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  className="icon-button"
                  disabled={i === order.length - 1}
                  aria-label={`Move step ${i + 1} down`}
                  onClick={() => move(i, 1)}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="button-row">
          <button
            className="button"
            onClick={() => {
              const valid = order.every((v, i) => v === i);
              setFeedback(
                valid
                  ? "Correct. Now try writing the argument from memory in the practice room."
                  : "Not quite. Start with the base case or construction, then the key implication, and finish with the conclusion.",
              );
              if (valid) complete();
            }}
          >
            Check proof order <Check size={16} />
          </button>
          <button
            className="icon-button"
            aria-label="Shuffle proof again"
            onClick={() => {
              setOrder(initial);
              setFeedback("");
            }}
          >
            <RotateCcw size={17} />
          </button>
        </div>
        <p role="status" className="feedback">
          {feedback}
        </p>
      </section>
      <aside className="callout">
        <Lightbulb size={23} />
        <h3>An exam habit worth building</h3>
        <p>{m.trap}</p>
        <div className="callout-divider" />
        <strong>Say what you are proving.</strong>
        <p>
          State the claim before the argument. Close by connecting it to the
          required output.
        </p>
      </aside>
    </div>
  );
}
function Runtime({ module: m }) {
  const [dense, setDense] = useState(false),
    [n, setN] = useState(100);
  return (
    <>
      <div className="two-column">
        <section className="card content-card">
          <div className="eyebrow">COUNT THE WORK</div>
          <h2>Give each cost a reason.</h2>
          <p>
            Let n = |V| and m = |E| for graphs; n is the number of intervals for
            scheduling.
          </p>
          <table className="runtime-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>How often / assumption</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {m.runtime.map((row) => (
                <tr key={row[0]}>
                  {row.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="callout">
          <Braces size={24} />
          <h3>Your runtime checklist</h3>
          <ol>
            <li>Define the input-size parameters.</li>
            <li>Name the representation and data structures.</li>
            <li>Count total operations across all loops.</li>
            <li>Multiply counts by operation costs.</li>
            <li>Include preprocessing and output.</li>
            <li>State worst-case or amortized explicitly.</li>
          </ol>
        </aside>
      </div>
      {m.id === "dijkstra" && (
        <section className="card content-card section-space">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                CHANGE THE INPUT, CHANGE THE TRADEOFF
              </span>
              <h3>Array or binary heap?</h3>
            </div>
            <div className="segmented">
              <button
                className={!dense ? "active" : ""}
                onClick={() => setDense(false)}
              >
                Sparse · m ≈ 2n
              </button>
              <button
                className={dense ? "active" : ""}
                onClick={() => setDense(true)}
              >
                Dense · m ≈ n²
              </button>
            </div>
          </div>
          <label className="slider-label">
            Vertices: {n}
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
            />
          </label>
          {[
            ["Array · n² + m", n * n + (dense ? n * n : 2 * n)],
            [
              "Binary heap · (n + m) log₂ n",
              (n + (dense ? n * n : 2 * n)) * Math.log2(n),
            ],
          ].map(([label, cost]) => (
            <div className="runtime-bar" key={label}>
              <span>{label}</span>
              <div>
                <i
                  style={{
                    width: `${(cost / Math.max(n * n + (dense ? n * n : 2 * n), (n + (dense ? n * n : 2 * n)) * Math.log2(n))) * 100}%`,
                  }}
                />
              </div>
              <strong>{Math.round(cost).toLocaleString()}</strong>
            </div>
          ))}
          <p className="muted-text">
            Illustrative operation-count expressions, not benchmarks.{" "}
            {dense
              ? "On dense graphs the array bound is O(n²), while a binary heap gives O(n² log n)."
              : "For m = O(n), the binary heap bound is O(n log n), compared with O(n²) for an array."}{" "}
            An indexed heap needs a vertex-to-position map for decrease-key.
          </p>
        </section>
      )}
      {m.id === "reductions" && (
        <section className="card content-card section-space">
          <h3>Decision versus optimization</h3>
          <p>
            The lab decides feasibility for one threshold. To maximize
            bottleneck, sort the m distinct candidate edge capacities and
            binary-search them using reachability. Feasibility is monotone:
            raising the threshold can only remove routes.
          </p>
          <div className="formula">O(m log m + (n + m) log m)</div>
          <p>
            Include sorting and every reachability call. For m ≤ 1, handle the
            constant number of candidates directly. The original lecture also
            studies event-time graphs: an O(n)-size event graph can require O(n
            log n) construction time.
          </p>
        </section>
      )}
      {m.id === "mst" && (
        <section className="callout section-space">
          <h3>Prim and Kruskal: same objective, different choices</h3>
          <p>
            Prim grows a single tree by its cheapest outgoing edge; its
            priority-queue key is an edge cost, not a distance from the source.
            Kruskal merges a forest using globally sorted edges. With adjacency
            lists and a binary heap, Prim takes O((n + m) log n). Both use the
            cut/exchange argument. See MST slides 13–22.
          </p>
        </section>
      )}
    </>
  );
}
function Quiz({ module: m, onCorrect }) {
  const [choice, setChoice] = useState(null),
    [checked, setChecked] = useState(false);
  return (
    <section className="card quiz-card">
      <span className="eyebrow">A SMALL CHECK, A STRONGER UNDERSTANDING</span>
      <h2>{m.question}</h2>
      <div className="quiz-options">
        {m.choices.map((c, i) => (
          <button
            key={c}
            className={`${choice === i ? "selected" : ""} ${checked && i === m.correct ? "correct" : ""}`}
            onClick={() => {
              setChoice(i);
              setChecked(false);
            }}
          >
            <span>{String.fromCharCode(65 + i)}</span>
            {c}
          </button>
        ))}
      </div>
      <button
        className="button"
        disabled={choice === null}
        onClick={() => {
          setChecked(true);
          if (choice === m.correct) onCorrect();
        }}
      >
        Check my reasoning <ArrowRight size={16} />
      </button>
      {checked && (
        <div className="quiz-feedback" role="status">
          <strong>
            {choice === m.correct
              ? "That’s right."
              : "Let’s revisit the reasoning."}
          </strong>
          <p>{m.feedback}</p>
        </div>
      )}
    </section>
  );
}
function ProofToolkit() {
  const [selected, setSelected] = useState("dijkstra");
  const m = modules.find((x) => x.id === selected);
  return (
    <>
      <PageIntro
        eyebrow="YOUR EXAM PLAYBOOK"
        title={
          <>
            A structure for <em>every argument.</em>
          </>
        }
        desc="When the page is blank, start with the proof obligation—not the pseudocode."
      />
      <div className="three-essentials">
        {[
          [
            "01",
            "Specify the algorithm",
            "Inputs, assumptions, output, and unambiguous steps. Name the known algorithm if you use a reduction.",
          ],
          [
            "02",
            "Prove correctness",
            "State the claim. Select an invariant, correspondence, exchange, or potential. Prove every obligation.",
          ],
          [
            "03",
            "Analyze complexity",
            "Define n and m, count operations, name data structures, and include construction plus decoding.",
          ],
        ].map(([num, title, desc]) => (
          <div className="card content-card" key={num}>
            <span className="large-number">{num}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
      <div className="section-heading section-space">
        <h2>Choose your proof template</h2>
        <button
          className="button secondary small"
          onClick={() => window.print()}
        >
          Print toolkit
        </button>
      </div>
      <div className="template-tabs">
        {modules.map((x) => (
          <button
            className={selected === x.id ? "active" : ""}
            key={x.id}
            onClick={() => setSelected(x.id)}
          >
            {x.tag}
          </button>
        ))}
      </div>
      <section className="card content-card">
        <h2>{m.proofTitle}</h2>
        <p className="invariant-text">{m.invariant}</p>
        <ol className="template-steps">
          {m.proof.map((line, i) => (
            <li key={line}>
              <span>{i + 1}</span>
              <p>{line}</p>
            </li>
          ))}
        </ol>
        <div className="callout">
          <strong>Common gap</strong>
          <p>{m.trap}</p>
        </div>
      </section>
      <div className="two-column section-space">
        <div className="card content-card">
          <h3>A 60-second proof audit</h3>
          <ul className="plain-list">
            <li>Did I prove the output has the required property?</li>
            <li>Did I use every necessary assumption?</li>
            <li>Did I handle empty inputs, ties, and unreachable vertices?</li>
            <li>Did I distinguish feasibility from optimality?</li>
            <li>Does the conclusion follow when the algorithm terminates?</li>
          </ul>
        </div>
        <div className="card content-card">
          <h3>Order notation, precisely</h3>
          <p>
            <b>O(g)</b> is an eventual upper bound; <b>Ω(g)</b> is an eventual
            lower bound; <b>Θ(g)</b> requires both. Constants and the starting
            threshold must be independent of n.
          </p>
          <p>
            <b>o(g)</b> means f/g → 0; <b>ω(g)</b> means f/g → ∞ (for eventually
            positive g). A runtime bound needs a cost model, not just notation.
          </p>
        </div>
      </div>
    </>
  );
}
function Practice() {
  const [selected, setSelected] = useState(exercises[0].id),
    [topic, setTopic] = useState("all");
  const e = exercises.find((x) => x.id === selected),
    filtered = exercises.filter((x) => topic === "all" || x.topic === topic);
  return (
    <>
      <PageIntro
        eyebrow="THE PRACTICE ROOM"
        title={
          <>
            Turn understanding <em>into an answer.</em>
          </>
        }
        desc="Original free-response prompts. Three parts, just like the format you described."
      />
      <div className="practice-notice">
        <Lightbulb size={17} />
        <span>
          Preparation based on the reported format; the professor’s actual exam
          format is unconfirmed. These are new study exercises, not homework
          solutions.
        </span>
      </div>
      <div className="practice-layout">
        <aside className="card problem-list">
          <label>
            Focus area
            <select
              value={topic}
              onChange={(ev) => {
                setTopic(ev.target.value);
                const first = exercises.find(
                  (x) =>
                    ev.target.value === "all" || x.topic === ev.target.value,
                );
                setSelected(first.id);
              }}
            >
              <option value="all">All topics</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.short}
                </option>
              ))}
            </select>
          </label>
          {filtered.map((x, i) => (
            <button
              className={selected === x.id ? "active" : ""}
              onClick={() => setSelected(x.id)}
              key={x.id}
            >
              <span className="problem-number">
                0{exercises.indexOf(x) + 1}
              </span>
              <div>
                <strong>{x.title}</strong>
                <small>
                  {x.level} · {x.minutes} min
                </small>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </aside>
        <PracticeEditor key={e.id} exercise={e} />
      </div>
    </>
  );
}
function PracticeEditor({ exercise: e }) {
  const [draft, setDraft] = useStored("as-draft-" + e.id, {
      algorithm: "",
      proof: "",
      runtime: "",
    }),
    [checks, setChecks] = useStored("as-rubric-" + e.id, {}),
    [hint, setHint] = useState(false),
    [review, setReview] = useState(false),
    [outline, setOutline] = useState(false),
    [running, setRunning] = useState(false),
    [remaining, setRemaining] = useState(e.minutes * 60);
  useEffect(() => {
    if (!running) return;
    const deadline = Date.now() + remaining * 1000;
    const timer = setInterval(() => {
      const value = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(value);
      if (!value) setRunning(false);
    }, 250);
    return () => clearInterval(timer);
  }, [running]);
  const exportAnswer = () => {
    const text = `${e.title}\n\n${e.prompt}\n\n${Object.entries(draft)
      .map(([k, v]) => k.toUpperCase() + "\n" + v)
      .join("\n\n")}`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `algorithm-studio-${e.id}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section className="card practice-editor">
      <div className="editor-header">
        <span className="eyebrow">
          ORIGINAL EXERCISE · {e.level.toUpperCase()}
        </span>
        <div className="timer">
          <Clock size={15} />
          <span aria-label="Time remaining">
            {Math.floor(remaining / 60)}:
            {String(remaining % 60).padStart(2, "0")}
          </span>
          <button
            className="icon-button"
            aria-label={running ? "Pause timer" : "Start timer"}
            disabled={!remaining}
            onClick={() => setRunning(!running)}
          >
            {running ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            className="icon-button"
            aria-label="Reset timer"
            onClick={() => {
              setRunning(false);
              setRemaining(e.minutes * 60);
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      <h2>{e.title}</h2>
      <p className="exercise-prompt">{e.prompt}</p>
      {remaining === 0 && (
        <div role="status" className="callout">
          Time is up. Your draft is saved; you can keep writing or start your
          review.
        </div>
      )}
      <button className="text-button" onClick={() => setHint(!hint)}>
        <Lightbulb size={16} />
        {hint ? "Hide hint" : "I’d like a small hint"}
        <ChevronDown size={14} />
      </button>
      {hint && <div className="hint-box">{e.hint}</div>}
      <div className="answer-fields">
        {[
          [
            "algorithm",
            "01",
            "Algorithm",
            "Specify your input, assumptions, data structures, and steps…",
          ],
          [
            "proof",
            "02",
            "Correctness proof",
            "State a claim and justify it. Include the base case and inductive step, or both directions…",
          ],
          [
            "runtime",
            "03",
            "Time complexity",
            "Define your parameters, count the work, and justify the final bound…",
          ],
        ].map(([key, num, title, placeholder]) => (
          <label key={key}>
            <span>
              <i>{num}</i>
              {title}
              <small>{draft[key].length} characters</small>
            </span>
            <textarea
              value={draft[key]}
              placeholder={placeholder}
              onChange={(ev) => setDraft({ ...draft, [key]: ev.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="editor-actions">
        <span>
          <Check size={14} /> Saved on this device
        </span>
        <button className="button secondary small" onClick={exportAnswer}>
          <Download size={15} /> Export
        </button>
        <button className="button small" onClick={() => setReview(!review)}>
          {review ? "Hide review" : "Review my answer"} <ArrowRight size={16} />
        </button>
      </div>
      {review && (
        <div className="review-panel">
          <span className="eyebrow">
            SELF-ASSESSMENT · NOT AUTOMATED GRADING
          </span>
          <h3>Check the reasoning, not just the result.</h3>
          <p>
            Compare your answer against each obligation. Checking a box records
            your own assessment; it does not certify correctness.
          </p>
          {e.rubric.map((r, i) => (
            <label className="check-row" key={r}>
              <input
                type="checkbox"
                checked={!!checks[i]}
                onChange={(ev) =>
                  setChecks({ ...checks, [i]: ev.target.checked })
                }
              />
              <span>{r}</span>
            </label>
          ))}
          <button className="text-button" onClick={() => setOutline(!outline)}>
            {outline ? "Hide" : "Reveal"} reference outline{" "}
            <ChevronDown size={15} />
          </button>
          {outline && (
            <div className="reference-outline">
              {e.outline.map((o, i) => (
                <div key={o}>
                  <h4>{["Algorithm", "Correctness", "Complexity"][i]}</h4>
                  <p>{o}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
function StudyPlan({ go, days }) {
  const [done, setDone] = useStored("as-plan-v1", {});
  return (
    <>
      <PageIntro
        eyebrow="A LITTLE PRACTICE, EVERY DAY"
        title={
          <>
            Your path to <em>November 7.</em>
          </>
        }
        desc="A suggested plan for November 7, 2026. Aim for 45–60 focused minutes a day; adjust the pacing to your schedule."
      >
        <span className="pill">
          {days > 0
            ? `${days} days remaining`
            : days === 0
              ? "Exam day"
              : "Keep the habits going"}
        </span>
      </PageIntro>
      <div className="plan-layout">
        <section className="card content-card">
          {plan.map((p, i) => (
            <div className={`plan-row ${done[i] ? "done" : ""}`} key={p.title}>
              <button
                className="plan-check"
                aria-label={`Mark ${p.title} ${done[i] ? "incomplete" : "complete"}`}
                onClick={() => setDone({ ...done, [i]: !done[i] })}
              >
                {done[i] ? <Check size={18} /> : String(i + 1).padStart(2, "0")}
              </button>
              <div>
                <span className="eyebrow">{p.date}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <button
                  className="text-button"
                  onClick={() =>
                    go(
                      ["practice", "proofs"].includes(p.topic)
                        ? p.topic
                        : "learn/" + p.topic,
                    )
                  }
                >
                  Open study session <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </section>
        <aside>
          <div className="callout">
            <Clock size={24} />
            <h3>A 50-minute study session</h3>
            <ul className="plain-list">
              <li>
                <b>5 min</b> · Recall yesterday’s idea without notes.
              </li>
              <li>
                <b>15 min</b> · Predict and trace an algorithm.
              </li>
              <li>
                <b>20 min</b> · Write a complete free response.
              </li>
              <li>
                <b>10 min</b> · Review the proof and record one gap.
              </li>
            </ul>
          </div>
          <div className="card content-card section-space">
            <h3>Ready means you can explain.</h3>
            <p>
              Before moving on, explain why the algorithm works without looking
              at the template. Come back to the same idea a day later.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
function LibraryPage({ go }) {
  const [search, setSearch] = useState("");
  return (
    <>
      <PageIntro
        eyebrow="GROUNDED IN YOUR COURSE"
        title={
          <>
            Back to <em>the source.</em>
          </>
        }
        desc="Your original lecture decks, with a guide to the ideas worth revisiting."
      />
      <label className="search-field">
        <Search size={18} />
        <input
          aria-label="Search lectures"
          placeholder="Search topics, techniques, or lecture names…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <div className="library-grid">
        {modules
          .filter((m) =>
            `${m.title} ${m.tag} ${m.file}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .map((m) => {
            const Icon = topicIcons[m.id];
            return (
              <article className="card library-card" key={m.id}>
                <span className={"module-icon " + m.id}>
                  <Icon size={25} />
                </span>
                <div>
                  <span className="eyebrow">{m.week} · LECTURE PDF</span>
                  <h3>{m.title}</h3>
                  <p>{m.file}</p>
                  <small>Study focus: PDF pages {m.pages}</small>
                </div>
                <div className="button-row">
                  <a
                    className="button secondary small"
                    href={`${import.meta.env.BASE_URL}lectures/${encodeURIComponent(m.asset || m.file)}#page=${m.page}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open PDF <ExternalLink size={14} />
                  </a>
                  <button
                    className="text-button"
                    onClick={() => go("learn/" + m.id)}
                  >
                    Study interactively <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            );
          })}
      </div>
      {!modules.some((m) =>
        `${m.title} ${m.tag} ${m.file}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ) && (
        <div className="card content-card">
          No lectures match “{search}”. Try “greedy”, “proof”, or “Dijkstra”.
        </div>
      )}
      <div className="callout section-space">
        <h3>A note on the homework</h3>
        <p>
          Homework 1, 2, and 3 were used only to understand the expected problem
          style and the emphasis on algorithms, correctness, and time analysis.
          Their problems and solutions are not included here. Practice exercises
          are original or based on lecture examples.
        </p>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
