import test from "node:test";
import assert from "node:assert/strict";
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
  daysUntilExam,
} from "../src/algorithms.js";
const vertices = nodes.map((n) => n.id);
test("Dijkstra distances agree with independent Bellman-Ford, including zero and unreachable edges", () => {
  for (const name of ["standard", "zero", "unreachable"]) {
    const edges = exampleEdges(name),
      frames = dijkstra(vertices, edges),
      last = frames.at(-1),
      d = Object.fromEntries(vertices.map((v) => [v, Infinity]));
    d.S = 0;
    for (let pass = 0; pass < vertices.length - 1; pass++)
      for (const e of edges) d[e.v] = Math.min(d[e.v], d[e.u] + e.w);
    assert.deepEqual(last.dist, d);
    for (const f of frames)
      for (const u of f.settled) assert.equal(f.dist[u], d[u]);
    for (const [v, u] of Object.entries(last.prev))
      assert.equal(
        last.dist[v],
        last.dist[u] + edges.find((e) => e.u === u && e.v === v).w,
      );
  }
  assert.deepEqual(dijkstra(vertices, baseEdges).at(-1).dist, {
    S: 0,
    A: 3,
    B: 2,
    C: 6,
    D: 7,
    T: 9,
  });
  assert.throws(
    () => dijkstra(vertices, [{ u: "S", v: "A", w: -1 }]),
    /nonnegative/,
  );
});
test("Kruskal matches exhaustive enumeration of all spanning trees", () => {
  let optimum = Infinity;
  for (let mask = 0; mask < 1 << baseEdges.length; mask++) {
    const selected = baseEdges.filter((_, i) => mask & (1 << i));
    if (selected.length !== vertices.length - 1) continue;
    const both = selected.flatMap((e) => [e, { ...e, u: e.v, v: e.u }]);
    if (reachable(vertices, both, -Infinity).seen.length === vertices.length)
      optimum = Math.min(
        optimum,
        selected.reduce((s, e) => s + e.w, 0),
      );
  }
  const f = kruskal(vertices, baseEdges).at(-1);
  assert.equal(f.total, optimum);
  assert.equal(f.chosen.length, 5);
  assert.equal(f.components, 1);
  assert.equal(f.rejected.length, 4);
  const disconnected = kruskal(vertices, exampleEdges("unreachable")).at(-1);
  assert.equal(disconnected.components, 2);
});
test("Threshold reduction retains exactly paths with sufficient bottleneck", () => {
  function enumerate(u, visited, bottleneck) {
    if (u === "T") return bottleneck;
    return Math.max(
      -Infinity,
      ...baseEdges
        .filter((e) => e.u === u && !visited.includes(e.v))
        .map((e) =>
          enumerate(e.v, [...visited, e.v], Math.min(bottleneck, e.w)),
        ),
    );
  }
  const optimum = enumerate("S", ["S"], Infinity);
  for (let b = 1; b <= 7; b++)
    assert.equal(
      reachable(vertices, baseEdges, b).seen.includes("T"),
      optimum >= b,
    );
  assert.equal(optimum, 3);
});
test("Earliest finish finds an optimal schedule; alternate rules expose counterexamples", () => {
  let max = 0;
  for (let mask = 0; mask < 1 << intervals.length; mask++) {
    const subset = intervals.filter((_, i) => mask & (1 << i));
    if (
      subset.every((a, i) =>
        subset.every((b, j) => i === j || a.f <= b.s || b.f <= a.s),
      )
    )
      max = Math.max(max, subset.length);
  }
  assert.equal(schedule(intervals).at(-1).chosen.length, max);
  assert.equal(max, 4);
  assert.ok(schedule(intervals, "start").at(-1).chosen.length < max);
  for (const rule of ["finish", "start", "duration"]) {
    const ids = schedule(intervals, rule).at(-1).chosen,
      chosen = intervals.filter((x) => ids.includes(x.id));
    assert.ok(
      chosen.every((a, i) =>
        chosen.every((b, j) => i === j || a.f <= b.s || b.f <= a.s),
      ),
    );
  }
});
test("Cash register actual costs telescope and remain below the amortized bound", () => {
  let actual = 0;
  for (let n = 1; n <= 1000; n++) {
    const r = registerDeposit(n);
    actual += r.actual;
    assert.ok(Math.abs(r.amortized - 10 / 9) < 1e-12);
    assert.equal(r.total, actual);
    assert.ok(actual <= (n * 10) / 9 + 1e-9);
  }
  assert.equal(registerDeposit(100).trades, 2);
  assert.equal(registerDeposit(1000).trades, 3);
});
test("Path compression preserves roots and reduces repeated traversal", () => {
  const parents = {
    A: "A",
    B: "A",
    C: "A",
    D: "C",
    E: "A",
    F: "E",
    G: "E",
    H: "G",
  };
  const first = compressPath(parents, "H");
  assert.equal(first.cost, 3);
  assert.deepEqual(first.path, ["H", "G", "E", "A"]);
  assert.equal(compressPath(first.parents, "H").cost, 1);
  for (const x of Object.keys(parents))
    assert.equal(compressPath(first.parents, x).path.at(-1), "A");
  assert.equal(parents.H, "G");
});
test("Countdown uses Los Angeles calendar dates including UTC boundary and DST", () => {
  assert.equal(daysUntilExam(new Date("2026-10-22T05:00:00Z")), 17);
  assert.equal(daysUntilExam(new Date("2026-11-07T08:01:00Z")), 0);
  assert.equal(daysUntilExam(new Date("2026-11-08T08:01:00Z")), -1);
});
