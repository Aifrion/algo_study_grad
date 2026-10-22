export const nodes = [
  { id: "S", x: 65, y: 165 },
  { id: "A", x: 220, y: 65 },
  { id: "B", x: 220, y: 265 },
  { id: "C", x: 410, y: 65 },
  { id: "D", x: 410, y: 265 },
  { id: "T", x: 565, y: 165 },
];
export const baseEdges = [
  ["S", "A", 4],
  ["S", "B", 2],
  ["B", "A", 1],
  ["A", "C", 3],
  ["B", "D", 6],
  ["B", "C", 5],
  ["C", "D", 1],
  ["C", "T", 5],
  ["D", "T", 2],
].map(([u, v, w], i) => ({ u, v, w, id: i }));
export function exampleEdges(example = "standard") {
  return baseEdges
    .filter((e) => example !== "unreachable" || e.v !== "T")
    .map((e) => ({ ...e, w: example === "zero" && e.id === 2 ? 0 : e.w }));
}
export function dijkstra(vertices, edges, source = "S") {
  if (edges.some((e) => e.w < 0))
    throw new Error("Dijkstra requires nonnegative weights");
  const dist = Object.fromEntries(vertices.map((v) => [v, Infinity]));
  dist[source] = 0;
  const prev = {},
    settled = [],
    frames = [];
  const save = (active, changed, message) =>
    frames.push({
      dist: { ...dist },
      prev: { ...prev },
      settled: [...settled],
      active,
      changed,
      message,
    });
  save(
    null,
    [],
    `Initialize d(${source}) = 0; all other distances are ∞. Nothing is finalized yet.`,
  );
  while (settled.length < vertices.length) {
    const u = vertices
      .filter((v) => !settled.includes(v))
      .sort((a, b) => dist[a] - dist[b] || a.localeCompare(b))[0];
    if (dist[u] === Infinity) break;
    settled.push(u);
    const changed = [];
    for (const e of edges.filter((e) => e.u === u))
      if (!settled.includes(e.v) && dist[u] + e.w < dist[e.v]) {
        dist[e.v] = dist[u] + e.w;
        prev[e.v] = u;
        changed.push(e.id);
      }
    save(
      u,
      changed,
      `Finalize ${u} at distance ${dist[u]}. ${changed.length ? `Relax ${changed.length} edge${changed.length === 1 ? "" : "s"}: update the highlighted tentative distances.` : "No tentative distances improve."}`,
    );
  }
  return frames;
}
export function kruskal(vertices, edges) {
  const parent = Object.fromEntries(vertices.map((v) => [v, v]));
  const find = (x) => (parent[x] === x ? x : find(parent[x]));
  const chosen = [],
    rejected = [],
    frames = [
      {
        chosen: [],
        rejected: [],
        active: null,
        total: 0,
        accept: null,
        components: vertices.length,
      },
    ];
  let total = 0;
  for (const e of [...edges].sort((a, b) => a.w - b.w || a.id - b.id)) {
    const a = find(e.u),
      b = find(e.v),
      accept = a !== b;
    if (accept) {
      parent[b] = a;
      chosen.push(e.id);
      total += e.w;
    } else rejected.push(e.id);
    frames.push({
      chosen: [...chosen],
      rejected: [...rejected],
      active: e.id,
      accept,
      total,
      components: vertices.length - chosen.length,
    });
  }
  return frames;
}
export function reachable(vertices, edges, threshold, source = "S") {
  const seen = new Set([source]),
    queue = [source],
    prev = {};
  for (let i = 0; i < queue.length; i++)
    for (const e of edges.filter((e) => e.u === queue[i] && e.w >= threshold))
      if (!seen.has(e.v)) {
        seen.add(e.v);
        queue.push(e.v);
        prev[e.v] = e.u;
      }
  return { seen: [...seen], prev };
}
export const intervals = [
  { id: "A", s: 0, f: 4 },
  { id: "B", s: 1, f: 2 },
  { id: "C", s: 2, f: 5 },
  { id: "D", s: 4, f: 7 },
  { id: "E", s: 5, f: 6 },
  { id: "F", s: 6, f: 9 },
  { id: "G", s: 8, f: 10 },
];
export function schedule(items, rule = "finish") {
  const score = (x) =>
    rule === "start" ? x.s : rule === "duration" ? x.f - x.s : x.f;
  const order = [...items].sort(
    (a, b) => score(a) - score(b) || a.f - b.f || a.id.localeCompare(b.id),
  );
  const chosen = [];
  let frames = [{ chosen: [], rejected: [], active: null }];
  const rejected = [];
  for (const x of order) {
    const accept = chosen.every((y) => x.s >= y.f || x.f <= y.s);
    (accept ? chosen : rejected).push(x);
    frames.push({
      chosen: chosen.map((y) => y.id),
      rejected: rejected.map((y) => y.id),
      active: x.id,
      accept,
    });
  }
  return frames;
}
export function registerDeposit(n) {
  if (!Number.isInteger(n) || n < 1)
    throw new Error("Deposit index must be positive");
  const digitSum = (x) =>
    String(x)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  let k = n,
    trades = 0;
  while (k % 10 === 0) {
    trades++;
    k /= 10;
  }
  const before = digitSum(n - 1) / 9,
    after = digitSum(n) / 9;
  return {
    actual: 1 + trades,
    trades,
    before,
    after,
    amortized: 1 + trades + after - before,
    total: n + (n - digitSum(n)) / 9,
  };
}
export function compressPath(parents, node) {
  const next = { ...parents },
    path = [node];
  while (next[node] !== node) {
    node = next[node];
    path.push(node);
  }
  for (const x of path) next[x] = node;
  return { parents: next, path, cost: path.length - 1 };
}
export function daysUntilExam(now = new Date()) {
  const local = now.toLocaleDateString("en-CA", {
    timeZone: "America/Los_Angeles",
  });
  return Math.ceil(
    (Date.UTC(2026, 10, 7) - Date.parse(local + "T00:00:00Z")) / 86400000,
  );
}
