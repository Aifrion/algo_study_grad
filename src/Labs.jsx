import React, { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Lightbulb,
  Play,
  GitBranch,
} from "lucide-react";
import {
  nodes,
  baseEdges,
  exampleEdges,
  dijkstra,
  kruskal,
  reachable,
  intervals,
  schedule,
  registerDeposit,
  compressPath,
} from "./algorithms";
const fmt = (n) => (n === Infinity ? "∞" : n);
export function Graph({
  edges = baseEdges,
  settled = [],
  active = null,
  highlight = [],
  muted = [],
  directed = true,
  dist,
  onNode,
}) {
  return (
    <svg
      className="graph"
      viewBox="0 0 630 330"
      role="img"
      aria-label={
        directed
          ? "Directed weighted graph from S to T"
          : "Undirected weighted graph"
      }
    >
      <defs>
        <marker
          id={directed ? "arrow" : "unused"}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L7,3.5 L0,7" fill="context-stroke" />
        </marker>
      </defs>
      {edges.map((e) => {
        const a = nodes.find((n) => n.id === e.u),
          b = nodes.find((n) => n.id === e.v),
          dx = b.x - a.x,
          dy = b.y - a.y,
          len = Math.hypot(dx, dy),
          end = directed ? 29 : 24;
        return (
          <g
            key={e.id}
            className={`edge ${highlight.includes(e.id) ? "highlight" : ""} ${muted.includes(e.id) ? "muted" : ""}`}
          >
            <line
              x1={a.x + (dx / len) * 24}
              y1={a.y + (dy / len) * 24}
              x2={b.x - (dx / len) * end}
              y2={b.y - (dy / len) * end}
              markerEnd={directed ? "url(#arrow)" : undefined}
            />
            <rect
              x={(a.x + b.x) / 2 - 13}
              y={(a.y + b.y) / 2 - 12}
              width="26"
              height="24"
              rx="7"
            />
            <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 + 5}>
              {e.w}
            </text>
          </g>
        );
      })}
      {nodes.map((n) => (
        <g
          key={n.id}
          className={`vertex ${settled.includes(n.id) ? "settled" : ""} ${active === n.id ? "current" : ""} ${onNode ? "clickable" : ""}`}
          onClick={() => onNode?.(n.id)}
          onKeyDown={(e) => {
            if (onNode && ["Enter", " "].includes(e.key)) {
              e.preventDefault();
              onNode(n.id);
            }
          }}
          tabIndex={onNode ? 0 : undefined}
          role={onNode ? "button" : undefined}
          aria-label={onNode ? `Predict vertex ${n.id}` : undefined}
        >
          <circle cx={n.x} cy={n.y} r="24" />
          <text x={n.x} y={n.y + 5}>
            {n.id}
          </text>
          {dist && (
            <text
              className="distance-label"
              x={n.x}
              y={n.y + (n.y < 165 ? -36 : 46)}
            >
              d = {fmt(dist[n.id])}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
function Controls({ step, total, setStep, onReset }) {
  return (
    <div className="lab-controls">
      <button
        className="icon-button"
        aria-label="Reset visualization"
        onClick={() => {
          setStep(0);
          onReset?.();
        }}
      >
        <RotateCcw size={16} />
      </button>
      <div className="step-count">
        Step <strong>{step}</strong> / {total}
      </div>
      <div className="step-progress">
        <span style={{ width: `${(step / total) * 100}%` }} />
      </div>
      <button
        className="icon-button"
        aria-label="Previous step"
        disabled={!step}
        onClick={() => setStep(step - 1)}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        className="button small"
        disabled={step === total}
        onClick={() => setStep(step + 1)}
      >
        Next step <ChevronRight size={16} />
      </button>
    </div>
  );
}
export function DijkstraLab({ compact = false, onComplete }) {
  const [example, setExample] = useState("standard"),
    [step, setStep] = useState(0),
    [feedback, setFeedback] = useState(""),
    [guess, setGuess] = useState("");
  const edges = exampleEdges(example),
    frames = dijkstra(
      nodes.map((n) => n.id),
      edges,
    ),
    f = frames[Math.min(step, frames.length - 1)],
    next = frames[step + 1];
  function advance(n) {
    setStep(n);
    setGuess("");
    setFeedback("");
    if (n === frames.length - 1) onComplete?.();
  }
  function predict(id) {
    setGuess(id);
    setFeedback(
      id === next?.active
        ? `Correct. ${id} has the smallest tentative distance. Step forward to see its relaxations.`
        : `Look at the tentative distances outside X. Choose the smallest; ties use alphabetical order.`,
    );
  }
  return (
    <div className="lab-content">
      <div className="lab-top">
        <span className="eyebrow">
          <span className="live-dot" /> INTERACTIVE WALKTHROUGH
        </span>
        <label className="select-wrap">
          <span className="sr-only">Graph example</span>
          <select
            value={example}
            onChange={(e) => {
              setExample(e.target.value);
              advance(0);
            }}
          >
            <option value="standard">Campus paths</option>
            <option value="zero">Zero-weight edge</option>
            <option value="unreachable">Unreachable target</option>
          </select>
        </label>
      </div>
      <div className={compact ? "" : "lab-two-col"}>
        <div>
          <Graph
            edges={edges}
            settled={f.settled}
            active={f.active}
            highlight={f.changed}
            dist={f.dist}
            onNode={next ? predict : undefined}
          />
          <div className="legend">
            <span>
              <i className="green" />
              Finalized
            </span>
            <span>
              <i className="outline" />
              Unsettled
            </span>
            <span>
              <i className="line" />
              Relaxed edge
            </span>
          </div>
        </div>
        {!compact && (
          <div className="distance-table">
            <span className="eyebrow">THE ALGORITHM’S MEMORY</span>
            <table>
              <thead>
                <tr>
                  <th>Vertex</th>
                  <th>d(v)</th>
                  <th>prev</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((n) => (
                  <tr
                    key={n.id}
                    className={f.active === n.id ? "active-row" : ""}
                  >
                    <td>{n.id}</td>
                    <td>{fmt(f.dist[n.id])}</td>
                    <td>{f.prev[n.id] || "—"}</td>
                    <td>{f.settled.includes(n.id) ? "Final" : "Tentative"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted-text">
              Source S · directed graph
              <br />
              Ties break alphabetically.
            </p>
          </div>
        )}
      </div>
      <div className="step-message" aria-live="polite">
        <span className="number-badge">{step}</span>
        <div>
          <strong>
            {step ? `Vertex ${f.active} finalized` : "Start with the source"}
          </strong>
          <p>{f.message}</p>
        </div>
      </div>
      {!compact && (
        <div className="predict">
          <Lightbulb size={18} />
          <div>
            {next ? (
              <>
                <strong>Predict before you step</strong>
                <p>Click the vertex that will be finalized next.</p>
                {feedback && (
                  <p
                    role="status"
                    className={
                      guess === next.active ? "success-text" : "hint-text"
                    }
                  >
                    {feedback}
                  </p>
                )}
              </>
            ) : (
              <>
                <strong>All reachable vertices are finalized.</strong>
                <p>
                  {example === "unreachable"
                    ? "T remains at ∞: no path from S reaches it."
                    : "Follow prev pointers backward from T to recover the shortest path."}
                </p>
              </>
            )}
          </div>
        </div>
      )}
      <Controls step={step} total={frames.length - 1} setStep={advance} />
    </div>
  );
}
export function MSTLab({ onComplete }) {
  const frames = kruskal(
      nodes.map((n) => n.id),
      baseEdges,
    ),
    [step, setStep] = useState(0),
    [feedback, setFeedback] = useState("");
  const f = frames[step],
    next = frames[step + 1],
    edge = baseEdges.find((e) => e.id === next?.active);
  const advance = (n) => {
    setStep(n);
    setFeedback("");
    if (n === frames.length - 1) onComplete?.();
  };
  return (
    <div className="lab-content">
      <div className="lab-top">
        <span className="eyebrow">KRUSKAL · UNDIRECTED GRAPH</span>
        <span className="pill">
          Weight: {f.total} · {f.components} components
        </span>
      </div>
      <Graph directed={false} highlight={f.chosen} muted={f.rejected} />
      <div className="edge-queue">
        {[...baseEdges]
          .sort((a, b) => a.w - b.w || a.id - b.id)
          .map((e) => (
            <span
              key={e.id}
              className={
                f.chosen.includes(e.id)
                  ? "accepted"
                  : f.rejected.includes(e.id)
                    ? "rejected"
                    : ""
              }
            >
              {e.u}–{e.v} <b>{e.w}</b>
            </span>
          ))}
      </div>
      <div className="predict">
        <GitBranch size={21} />
        <div>
          {edge ? (
            <>
              <strong>
                Next edge: {edge.u}–{edge.v}, weight {edge.w}
              </strong>
              <p>Would adding this edge create a cycle?</p>
              <div className="button-row">
                {[true, false].map((accept) => (
                  <button
                    className="button secondary small"
                    key={String(accept)}
                    onClick={() =>
                      setFeedback(
                        accept === next.accept
                          ? "Correct. " +
                              (accept
                                ? "Its endpoints lie in different components."
                                : "Its endpoints are already connected, so it would create a cycle.")
                          : "Try again: follow the accepted green edges to check whether the endpoints are already connected.",
                      )
                    }
                  >
                    {accept ? "Accept edge" : "Reject edge"}
                  </button>
                ))}
              </div>
              <p role="status">{feedback}</p>
            </>
          ) : (
            <>
              <strong>
                Minimum spanning tree complete · total weight {f.total}
              </strong>
              <p>
                The five accepted edges connect all six vertices without a
                cycle.
              </p>
            </>
          )}
        </div>
      </div>
      <Controls step={step} total={frames.length - 1} setStep={advance} />
    </div>
  );
}
export function ReductionLab({ onComplete }) {
  const [threshold, setThreshold] = useState(3),
    [answer, setAnswer] = useState(null);
  const { seen, prev } = reachable(
    nodes.map((n) => n.id),
    baseEdges,
    threshold,
  );
  const feasible = seen.includes("T");
  let path = ["T"];
  if (feasible) while (path[0] !== "S") path.unshift(prev[path[0]]);
  return (
    <div className="lab-content">
      <div className="lab-top">
        <span className="eyebrow">BOTTLENECK PATH → REACHABILITY</span>
        <span className="pill">Threshold B = {threshold}</span>
      </div>
      <p className="lab-description">
        Treat edge labels as capacities. Keep only edges with capacity ≥ B, then
        ask whether T is reachable from S.
      </p>
      <Graph
        edges={baseEdges}
        muted={baseEdges.filter((e) => e.w < threshold).map((e) => e.id)}
        highlight={baseEdges.filter((e) => e.w >= threshold).map((e) => e.id)}
        settled={seen}
      />
      <label className="slider-label">
        Required capacity <strong>{threshold}</strong>
        <input
          type="range"
          min="1"
          max="7"
          value={threshold}
          onChange={(e) => {
            setThreshold(Number(e.target.value));
            setAnswer(null);
          }}
        />
      </label>
      <div className="predict">
        <Lightbulb size={20} />
        <div>
          <strong>Does a route of bottleneck ≥ {threshold} exist?</strong>
          <div className="button-row">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                className="button secondary small"
                onClick={() => {
                  setAnswer(v);
                  if (v === feasible) onComplete?.();
                }}
              >
                {v ? "Yes, reachable" : "No route"}
              </button>
            ))}
          </div>
          {answer !== null && (
            <p role="status">
              {answer === feasible
                ? "Correct. "
                : "Look at the surviving directed edges. "}
              {feasible
                ? `A witness path is ${path.join(" → ")}.`
                : "T is unreachable in the filtered graph."}
            </p>
          )}
        </div>
      </div>
      <div className="formula-row">
        <span>
          Original route
          <br />
          <b>Every capacity ≥ B</b>
        </span>
        <span>⇔</span>
        <span>
          Filtered graph
          <br />
          <b>An s–t path exists</b>
        </span>
      </div>
    </div>
  );
}
export function GreedyLab({ onComplete }) {
  const [rule, setRule] = useState("finish"),
    [step, setStep] = useState(0);
  const frames = schedule(intervals, rule),
    f = frames[step];
  const advance = (n) => {
    setStep(n);
    if (n === frames.length - 1) onComplete?.();
  };
  return (
    <div className="lab-content">
      <div className="lab-top">
        <span className="eyebrow">INTERVAL SCHEDULING</span>
        <select
          aria-label="Greedy rule"
          value={rule}
          onChange={(e) => {
            setRule(e.target.value);
            setStep(0);
          }}
        >
          <option value="finish">Earliest finish</option>
          <option value="start">Earliest start</option>
          <option value="duration">Shortest duration</option>
        </select>
      </div>
      <p className="lab-description">
        Try different rules. Each step considers one interval and accepts it if
        it is compatible with all previously accepted intervals.
      </p>
      <div className="timeline">
        <div className="timeline-axis">
          <span />
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
        {intervals.map((x) => (
          <div className="interval-row" key={x.id}>
            <b>{x.id}</b>
            <div className="interval-track">
              <div
                className={`interval ${f.chosen.includes(x.id) ? "chosen" : ""} ${f.rejected.includes(x.id) ? "rejected" : ""} ${f.active === x.id ? "current" : ""}`}
                style={{ left: `${x.s * 10}%`, width: `${(x.f - x.s) * 10}%` }}
              >
                {x.s}–{x.f}
                {f.chosen.includes(x.id) && <Check size={14} />}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="step-message" aria-live="polite">
        <span className="number-badge">{f.chosen.length}</span>
        <div>
          <strong>{f.chosen.length} intervals selected</strong>
          <p>
            {step
              ? `${f.accept ? "Accept" : "Skip"} ${f.active}. ${f.accept ? "It does not overlap the selected intervals." : "It conflicts with a selected interval."}`
              : "Which interval would you choose first?"}{" "}
            {step === frames.length - 1 &&
              (rule === "finish"
                ? "Earliest finish selects 4 intervals, an optimal schedule."
                : `This rule selects ${f.chosen.length}; earliest finish selects 4. A rule working on one instance is not a proof.`)}
          </p>
        </div>
      </div>
      <Controls step={step} total={frames.length - 1} setStep={advance} />
    </div>
  );
}
const initialParents = {
  A: "A",
  B: "A",
  C: "A",
  D: "C",
  E: "A",
  F: "E",
  G: "E",
  H: "G",
};
export function AmortizedLab({ onComplete }) {
  const [mode, setMode] = useState("register"),
    [n, setN] = useState(0),
    [parents, setParents] = useState(initialParents),
    [findInfo, setFindInfo] = useState(null);
  const r = n ? registerDeposit(n) : null;
  const positions = {
    A: [310, 40],
    B: [80, 110],
    C: [200, 110],
    D: [160, 180],
    E: [430, 110],
    F: [350, 180],
    G: [510, 180],
    H: [510, 255],
  };
  function find(x) {
    const out = compressPath(parents, x);
    setParents(out.parents);
    setFindInfo({ ...out, node: x });
    onComplete?.();
  }
  return (
    <div className="lab-content">
      <div className="lab-top">
        <span className="eyebrow">EXPENSIVE NOW, CHEAPER LATER</span>
        <div className="segmented">
          {["register", "union-find"].map((m) => (
            <button
              className={mode === m ? "active" : ""}
              onClick={() => setMode(m)}
              key={m}
            >
              {m === "register" ? "Potential lab" : "Path compression"}
            </button>
          ))}
        </div>
      </div>
      {mode === "register" ? (
        <>
          <p className="lab-description">
            The lecture’s cash register: deposit $1, then trade ten equal bills
            for one of the next denomination. Count 1 for the deposit plus 1 per
            trade.
          </p>
          <div className="register">
            <div className="register-total">
              <span>DEPOSITED</span>
              <strong>${n}</strong>
            </div>
            <div className="bill-groups">
              {[1000, 100, 10, 1].map((d) => (
                <div key={d}>
                  <span>${d} bills</span>
                  <strong>{Math.floor(n / d) % 10}</strong>
                  <div className="bill-stack">
                    {Array.from({ length: Math.floor(n / d) % 10 }, (_, i) => (
                      <i key={i} style={{ top: i * 3 }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="cost-grid">
            <div>
              <span>Actual cost cᵢ</span>
              <strong>{r?.actual ?? "—"}</strong>
            </div>
            <div>
              <span>Potential Φᵢ</span>
              <strong>{r ? r.after.toFixed(3) : "0"}</strong>
            </div>
            <div>
              <span>Amortized cost ĉᵢ</span>
              <strong>{r ? "10/9" : "—"}</strong>
            </div>
          </div>
          <div className="button-row">
            <button
              className="button"
              disabled={n >= 9999}
              onClick={() => {
                setN(n + 1);
                if (n >= 9) onComplete?.();
              }}
            >
              Deposit $1 <ArrowRight size={16} />
            </button>
            <button className="button secondary" onClick={() => setN(99)}>
              Jump to $99
            </button>
            <button
              className="icon-button"
              aria-label="Reset register"
              onClick={() => setN(0)}
            >
              <RotateCcw size={17} />
            </button>
          </div>
          <div className="math-note" aria-live="polite">
            {r
              ? `Last deposit: ${r.actual} actual + (${r.after.toFixed(3)} − ${r.before.toFixed(3)}) potential = 10/9 amortized. Total actual cost: ${r.total}.`
              : "Φ = number of bills / 9. Try depositing after $99: one deposit triggers two trades."}
          </div>
        </>
      ) : (
        <>
          <p className="lab-description">
            Click a vertex to run Find. Every parent pointer along its path is
            redirected to root A. Repeat the same Find to see how the cost
            changes. This eight-node tree can arise from union by rank.
          </p>
          <svg
            className="union-tree"
            viewBox="0 0 620 300"
            role="img"
            aria-label="Union-find parent tree"
          >
            {Object.entries(parents)
              .filter(([x, p]) => x !== p)
              .map(([x, p]) => (
                <line
                  key={x}
                  x1={positions[x][0]}
                  y1={positions[x][1]}
                  x2={positions[p][0]}
                  y2={positions[p][1]}
                  className={findInfo?.path.includes(x) ? "compressed" : ""}
                />
              ))}
            {Object.entries(positions).map(([x, [cx, cy]]) => (
              <g
                key={x}
                className="vertex clickable"
                role="button"
                tabIndex="0"
                aria-label={`Find ${x}`}
                onClick={() => find(x)}
                onKeyDown={(e) => {
                  if (["Enter", " "].includes(e.key)) {
                    e.preventDefault();
                    find(x);
                  }
                }}
              >
                <circle cx={cx} cy={cy} r="22" />
                <text x={cx} y={cy + 5}>
                  {x}
                </text>
              </g>
            ))}
          </svg>
          <div className="step-message" aria-live="polite">
            <GitBranch size={24} />
            <div>
              <strong>
                {findInfo
                  ? `Find(${findInfo.node}): ${findInfo.cost} parent edges traversed`
                  : "Try Find(H), then Find(H) again."}
              </strong>
              <p>
                {findInfo
                  ? `Path before compression: ${findInfo.path.join(" → ")}. Root and set membership are unchanged.`
                  : "Ranks stay unchanged during compression; rank is an upper bound on height, not the current height."}
              </p>
            </div>
          </div>
          <button
            className="button secondary small"
            onClick={() => {
              setParents(initialParents);
              setFindInfo(null);
            }}
          >
            <RotateCcw size={15} /> Reset tree
          </button>
        </>
      )}
    </div>
  );
}
export function Lab({ id, ...props }) {
  const C = {
    dijkstra: DijkstraLab,
    mst: MSTLab,
    greedy: GreedyLab,
    reductions: ReductionLab,
    amortized: AmortizedLab,
  }[id];
  return <C {...props} />;
}
