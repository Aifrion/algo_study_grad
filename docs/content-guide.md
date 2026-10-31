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

## Exam preparation expansion

Eight chapters in `src/examContent.js` map each topic to PDF pages or named key problems. The new lecture PDFs are included unchanged: `Week4tightamortizedtime.pdf` (57 pages) and `Week4approx.pdf` (45 pages). The five original labs and their 15 checkpoints remain separate from reading progress.

- **Greedy:** rule discovery, counterexamples, weighted adjacent swaps, safe-discard and pairing cases, residual induction, stays-ahead availability, room overlap lower bounds.
- **Reductions:** sufficient state, both solution maps, preserved cost, coupon/toll examples, event-chain construction, expanded-size accounting and recovery.
- **Foundations:** quantified order notation, hypotheses of counterexamples, BFS/Dijkstra/DAG assumptions, array/binary/b-ary heap costs, reverse graphs.
- **MST:** cut exchange, why the removed edge is not already accepted, Prim versus Dijkstra, rank invariants and Merge/Union conventions.
- **Amortized:** deriving potential coefficients, initial-state accounting, self/gift token arguments, and the mechanism of the inverse-Ackermann refinement. The full technical tight proof is referred to its slides rather than claimed to be reproduced.
- **Approximation:** metric TSP, two-machine critical-job bounds, prefix enumeration, parallel-job work bounds and the lecture's 11/4 refinement. The 7/6 tight LPT ratio is identified as stated in the slides, not proved by the 5/4 argument.

Source precision: `ans1F26.pdf` is labeled a graded-problem answer key. `ans2ugF26.pdf`'s edge-state construction needs the endpoint-compatibility condition omitted from its compact formula. Weighted waiting/completion costs differ by a constant under the stated job assumptions. TSP uses non-strict inequalities and distinguishes a metric visiting tour from an arbitrary original-edge Hamiltonian cycle.

## Practice and privacy

The original five exercises plus twelve new/adapted exercises provide 17 prompts. Hint, self-review, and reference outline are independently hidden. Copy/download creates a prompt for discussion in chat; there are no AI API calls or answer-entry fields. Old localStorage drafts are not erased and can be read under the corresponding prompt. Suggested times are not official exam times.

The supplied practice midterm informs a points/skills map without supplying its full solutions. Professor keys are used for source-identified worked examples. The student's HW3 submission is context, not an authority; it and the answer-key/midterm PDFs are not public assets. Graded homework solutions are not added to the site as a solution collection.
