# Content guide

The site adapts lecture concepts into small interactive examples; it does not reproduce every slide or replace the full lectures. All graph instances and the interval instance in the visualizations are newly constructed. The cash-register example follows the lecture directly.

| Module         | Original upload             | Main PDF pages      | Interactive emphasis                                                         |
| -------------- | --------------------------- | ------------------- | ---------------------------------------------------------------------------- |
| Shortest paths | week1and2-Dijkstra.pdf      | 19–42, 43–66        | Extract-min, relaxation, finalized-distance invariant, data-structure costs  |
| Reductions     | week2revised-reductions.pdf | 39–54, 64–73        | Threshold reachability, solution correspondence, transformed-size accounting |
| Greedy         | Week3-greedyintro.pdf       | 23–40, 43–62        | Interval scheduling, exchange, feasibility, objective, induction             |
| MST            | Week3+4-MST.pdf             | 13–22, 30–40, 51–86 | Kruskal, cut/exchange proof, components, union-find                          |
| Amortized      | Week4amortizedtime.pdf      | 16–29, 30–46        | Potential telescoping, cash register, path compression, rank invariants      |

The MST PDF is stored as `Week3-4-MST.pdf` to avoid encoded-plus URL handling differences; its bytes are unchanged. Displayed citations retain its original filename.

## Proof and complexity choices

- Dijkstra uses nonnegative directed edges, finite distances only, and alphabetical tie-breaking in the simulation. The runtime lesson describes an indexed binary heap; the visualization computes small example snapshots using a straightforward scan, not an actual heap implementation.
- Kruskal's lab uses an undirected connected graph; the general explanation covers a minimum spanning forest for disconnected input. The presented optimality proof uses cut/exchange, also used in the MST lecture for Prim. The lecture's separate component invariant and stays-ahead approach are identified.
- Interval scheduling uses half-open intervals. Earliest finish is optimal for unweighted cardinality, not arbitrary weighted scheduling. The alternate-rule simulation accepts an interval only if it is compatible with all prior selections.
- The bottleneck lab solves one threshold decision question. The runtime extension separately accounts for optimization via sorting and binary search. Surviving edges alone are insufficient: reachability respects direction.
- Cash-register cost is 1 per deposit plus 1 per trade; Φ = bill count / 9, so every deposit has amortized cost 10/9. Jumping to 99 loads the state resulting from 99 deposits; the displayed total includes that whole prefix.
- The union-find tree has eight vertices and can arise from union by rank. Compression changes parent pointers but not ranks or represented sets. The cost counter reports parent edges traversed, excluding constant overhead. It illustrates the mechanism rather than claiming to prove the inverse-Ackermann bound by example. The lecture's token/gift progression is summarized with a source link.
- Arrays versus heaps shows symbolic operation-count expressions with unit coefficients, not measured execution time.

## Homework boundary

Homework 1, 2, and 3 were used only as references for topic mix and expected answer structure. They are not included as site assets. None of their questions is answered. Five practice exercises address a discovery/finalization misconception, safe-vertex reachability, the lecture's scheduling proof, tied MST weights, and an independent stack potential argument.

Reference outlines are available only in the practice self-review section. Written answers are not automatically assessed. The timer lengths are suggested practice durations, not claims about the exam.

## Intentional limits

The site has five focused modules, not exhaustive coverage of the full course. Prim, graph search foundations, order notation, and the union-find token/gift analyses receive explanatory coverage; Prim, b-ary heaps, event-time flight reductions, and full inverse-Ackermann proofs do not have dedicated interactive labs. The original PDFs remain available for deeper study.
