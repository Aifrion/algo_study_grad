export const chapters = [
  {
    "id": "start",
    "title": "Start with the exam task",
    "subtitle": "A concrete answer structure drawn from the supplied keys and practice midterm.",
    "source": "Practice midterm, pp. 1–3, 5–6; ans1F26, pp. 1–4; ans2ugF26, pp. 3–6; ans3ugF26, pp. 1–4.",
    "sections": [
      {
        "title": "What the practice midterm actually asks",
        "paragraphs": [
          "Order notation: a proof or counterexample, with 20 of its 25 points on the justification. Quests: a clear algorithm (10), correctness (15), and efficiency (5). Exact-edge-count paths: graph construction (10), equivalence (10), standard algorithm (5), and total time (5). Earliest dominating subsequence: specification (8), greedy strategy (8), main proof lemma (16), implementation and time (8).",
          "These are the supplied practice exam’s allocations, not a promise about the real exam. They explain why recognizing an algorithm or repeating “feasible and optimal” is not enough. Keep the practice midterm unspoiled until you can produce the lemmas yourself."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Write in the professor’s order",
        "paragraphs": [
          "The answer keys typically explain the structural idea first, give the key lemma or equivalence, and then make the implementation and running time precise. Use headings to make these obligations easy to find. There is no need to force induction into every proof."
        ],
        "steps": [
          "Specification: name the instance, solution variables, constraints, and objective. Distinguish a requested sequence from only its cost. Include impossible instances.",
          "High-level strategy: state exactly which choice is made, from which feasible candidates, and what remains afterward.",
          "Main lemma: state a precise, quantified claim connecting your choice to arbitrary feasible or optimal solutions.",
          "Proof and conclusion: prove that claim, then explain why repeated choices or the reduction produce the requested output.",
          "Implementation and time: name data structures; count construction, main computation, and output recovery in the original input parameters."
        ],
        "check": null,
        "answer": null
      },
      {
        "title": "Specification: what exactly is a solution?",
        "paragraphs": [
          "For interval selection, an instance is a list of n intervals with sᵢ<fᵢ. A solution is a subset S of their indices. With half-open endpoints, feasibility means that for distinct i,j in S, either fᵢ≤sⱼ or fⱼ≤sᵢ. The objective is to maximize |S|. Returning only that number is insufficient if a schedule is requested.",
          "For a route through a required sequence, the position in the sequence matters even when location names repeat. Start and destination having the same name does not make the required intermediate stops disappear. An empty output is appropriate only if the specification permits it. These edge cases should follow from the formal constraints rather than from a convenient early-return condition."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Choose a proof because of the structure",
        "paragraphs": [
          "Reduction: the problem becomes a known graph problem after choosing the right states. Prove maps in both directions and preserve costs. Exchange: a local repair can make an arbitrary optimum agree with your first choice. Stays-ahead: a prefix measure summarizes all future opportunities. Achieves-the-bound: every solution must pay an unavoidable amount and your solution pays exactly that amount. Approximation: your solution pays at most a constant multiple of such a bound.",
          "Invariant means a statement that remains true at a chosen point in every iteration. Induction is the tool used to prove it: initialization, preservation, and termination. A potential argument instead controls total work; by itself it does not prove that the algorithm returns the right answer."
        ],
        "steps": [],
        "check": "Before writing code, what one sentence should you be able to finish?",
        "answer": "“My key lemma is …” followed by a mathematical statement, such as: for any optimal schedule O there exists an equally good feasible schedule O′ beginning with g. Then identify what inequality makes that lemma true."
      },
      {
        "title": "A practical study order",
        "paragraphs": [
          "First study greedy proof development and graph-state reductions; these transfer directly to the supplied practice exam. Next do order notation and shortest-path algorithm selection. Then review MST and potential analysis. Finally work through the two new decks: tight union-find analysis and approximation. Those decks may be covered, but they do not appear as separate questions on this practice midterm.",
          "For each chapter: read one worked argument, cover it, explain its main lemma aloud, and attempt an original practice prompt on paper. Bring the prompt ID and your reasoning into our chat. No website answer submission or AI grading is needed."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "How these sources are used",
        "paragraphs": [
          "The professor’s keys guide the structure and worked explanations. ans1F26.pdf is labeled “Graded Problems Solution Key,” despite being grouped with ungraded keys in the upload. Your HW3 submission is your work, not an official answer key; it informs which misunderstandings need attention. It is not published as a site asset.",
          "The site adapts and checks arguments rather than copying typographical mistakes. For example, edge-state reductions require matching endpoints, and metric TSP inequalities are non-strict when zero lengths or equalities are allowed."
        ],
        "steps": [],
        "check": null,
        "answer": null
      }
    ]
  },
  {
    "id": "greedy",
    "title": "Develop a greedy proof",
    "subtitle": "Find the inequality that preserves future possibilities; then turn it into a lemma.",
    "source": "Week3-greedyintro.pdf, pp. 23–40, 48–62; ans3ugF26.pdf, weighted jobs pp. 1–2, oxen pp. 2–4, matching p. 4; Week4approx.pdf, pp. 5–7.",
    "sections": [
      {
        "title": "Before choosing a greedy rule",
        "paragraphs": [
          "Write what the objective counts. Maximizing the number of nonoverlapping events is different from maximizing their total weight. Minimizing the final finish time is different from minimizing the sum of completion times. A locally attractive choice for one objective can fail for another.",
          "Generate candidate rules, then attack each with tiny instances. A counterexample needs the algorithm’s actual output and a better feasible alternative, with their objective values. Resolve ties or avoid them. One failed rule does not prove that a different rule works."
        ],
        "steps": [],
        "check": "For half-open intervals [0,10), [1,2), [2,3), [3,4), what does earliest start do?",
        "answer": "It chooses [0,10) and gets one event. The three short events are mutually compatible, so earliest start is not optimal. This refutes that rule only; earliest finish still needs its own proof."
      },
      {
        "title": "Exchange: exactly what changes?",
        "paragraphs": [
          "Goal: show there exists an optimal solution that agrees with the first greedy choice. Do not claim every optimum agrees. Ties often produce multiple optima. Start with any optimum O and explicitly define O′, including every removed and inserted object."
        ],
        "steps": [
          "Name the greedy choice g and an arbitrary optimal O. If g already appears in the right place, say so.",
          "Construct O′ by a replacement, swap, or reassignment. Keep the untouched part fixed.",
          "Check every feasibility constraint affected by that change. This is where the problem-specific inequality belongs.",
          "Compute the objective difference. For minimization prove cost(O′) − cost(O) ≤ 0; for maximization prove value(O′) − value(O) ≥ 0.",
          "Because O was optimal, O′ is also optimal. State the smaller residual instance and show that replacing its solution with a better one would improve O′.",
          "Apply induction to the residual instance, with an explicit base case. Combine the greedy choice and the optimal residual solution."
        ],
        "check": null,
        "answer": null
      },
      {
        "title": "Worked exchange: weighted job ordering",
        "paragraphs": [
          "Assume all jobs are available initially, a single machine processes them without preemption, durations tᵢ > 0 and weights wᵢ ≥ 0, and the objective is ΣwᵢCᵢ. Cᵢ is the time the job finishes, not its processing duration. The weight is an input priority or penalty per unit time; the algorithm does not compute it from the duration.",
          "For A with (t,w)=(1,1) and B with (2,4), A then B gives completion times 1 and 3, hence 1·1 + 4·3 = 13. B then A gives completion times 2 and 3, hence 4·2 + 1·3 = 11. This defeats shortest-processing-time first for weighted completion cost."
        ],
        "steps": [
          "Consider two adjacent jobs a,b starting after time S. Their contribution in order ab is wₐ(S+tₐ) + wᵦ(S+tₐ+tᵦ).",
          "In order ba it is wᵦ(S+tᵦ) + wₐ(S+tᵦ+tₐ). Subtract: cost(ab) − cost(ba) = wᵦtₐ − wₐtᵦ.",
          "If wₐ/tₐ ≥ wᵦ/tᵦ, then ab is no worse. Feasibility is unchanged: each job still appears once, and all other jobs retain their completion times because the pair has the same total duration.",
          "Take a job g of largest w/t. Move it left through adjacent swaps. Every swap is non-increasing in cost, so an optimum with g first exists.",
          "After fixing g, each remaining job’s completion time gains the constant t_g. The extra weighted cost t_g·Σremaining w is independent of the residual order. Induct on the remaining jobs; the empty set is the base.",
          "Sort by decreasing w/t, using cross-products wₐtᵦ versus wᵦtₐ when appropriate to avoid floating-point division. Sorting takes O(n log n); scanning and producing the schedule take O(n)."
        ],
        "check": "The key sometimes describes weighted waiting time but calculates weighted completion time. Does the optimal order change?",
        "answer": "No, under these assumptions. Cᵢ = waitingᵢ + tᵢ, so ΣwᵢCᵢ = Σwᵢwaitingᵢ + Σwᵢtᵢ. The final term is independent of the order. State which objective you analyze, then explain this equivalence."
      },
      {
        "title": "Worked exchange: pairing requires cases",
        "paragraphs": [
          "In the professor’s oxen example, let w be the weakest strength, s the strongest, and P the required pair strength. If w+s < P, then w cannot pair with any remaining animal: w+x ≤ w+s < P. Discarding w is safe because no feasible solution can use it.",
          "If w+s ≥ P, compare to an optimum. If w and s are already paired, nothing changes. If at most one is paired, remove its pair if present and insert (w,s), losing at most one pair and gaining one. If both are paired separately, replace (w,y) and (s,x) by (w,s) and (x,y). Since x ≥ w and w+y ≥ P, x+y ≥ P. Disjointness and the number of pairs are preserved.",
          "Induct on the remaining n−1 or n−2 animals. Sort once and use two indices moving inward, so the scan is O(n) after O(n log n) sorting. The transferable skill is identifying a safe-discard lemma separately from the exchange lemma."
        ],
        "steps": [],
        "check": "Why is “replace two pairs by two pairs” insufficient by itself?",
        "answer": "It proves only that cardinality is unchanged. You must also prove that both new pairs meet the strength requirement and that no animal is assigned twice."
      },
      {
        "title": "Stays-ahead: prove availability before superiority",
        "paragraphs": [
          "For interval scheduling, compare greedy intervals g₁,… with any feasible ordered schedule o₁,… . The progress claim is finish(gᵢ) ≤ finish(oᵢ) whenever oᵢ exists; the proof must also establish that greedy can choose its i-th event."
        ],
        "steps": [
          "Base: the earliest-finishing event finishes no later than o₁.",
          "Induction: assume finish(gᵢ) ≤ finish(oᵢ). Feasibility of the comparison schedule gives finish(oᵢ) ≤ start(oᵢ₊₁).",
          "Therefore finish(gᵢ) ≤ start(oᵢ₊₁): the comparison event is available to greedy. Only now use the greedy rule to conclude finish(gᵢ₊₁) ≤ finish(oᵢ₊₁).",
          "If greedy stopped after L events while a feasible schedule had more, oL+1 would still be available. This contradicts stopping. Thus greedy has maximum cardinality."
        ],
        "check": "What is wrong with “Gᵢ ≤ Aᵢ, therefore Gᵢ₊₁ ≤ Aᵢ₊₁”?",
        "answer": "It omits the bridge. First use the comparison solution’s feasibility to show its next choice is available from the greedy state. Then apply the greedy minimization rule. The next-step inequality is the conclusion, not the reason the choice is available."
      },
      {
        "title": "Achieves-the-bound: rooms for all events",
        "paragraphs": [
          "This is a different scheduling objective: assign every interval to a room and minimize the number of rooms. Process intervals by increasing start time. Reuse a room whose last event ends no later than the next start; open a new room only if none is available. A min-heap of room finishing times implements the rule.",
          "Suppose the algorithm opens room r at time s. Each of the existing r−1 rooms holds an event with finish > s; its start is ≤ s because of processing order. Together with the new event there are r simultaneous events, so every schedule needs at least r rooms. The algorithm uses r rooms, achieving that lower bound. Feasibility follows from reusing rooms only after their last event finishes.",
          "Sort O(n log n), then n heap operations of O(log n), with O(n) output storage. This bound proof does not require an exchange or induction on optimal schedules."
        ],
        "steps": [],
        "check": "Can you add lower bounds from different cuts or times automatically?",
        "answer": "No. The same cost may be counted more than once. For rooms, take maximum overlap, not the sum of overlaps. For handoff problems, summing boundary crossings works only after showing the objective equals the total crossing count."
      },
      {
        "title": "Exam-ready sentences, with the blanks that matter",
        "paragraphs": [
          "Exchange: “Let O be optimal. Replace ___ by ___ to obtain O′. It is feasible because ___. The objective changes by ___, which is ≤ 0. Therefore an optimum begins with g. The remaining instance is ___, and induction applies because ___.”",
          "Stays-ahead: “For every feasible comparison solution A, after i choices the greedy progress ___ is no worse than ___. By feasibility of A, its next choice is available to greedy because ___. The greedy rule therefore gives ___.”",
          "Bound: “For every feasible solution S, cost(S) ≥ B because ___. The algorithm returns a feasible G with cost(G) = B because ___. Therefore G is optimal.”",
          "Do not fill these blanks with “because greedy is best.” Each requires a constraint, equation, or already-proved lemma."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Close the proof with the actual comparison",
        "paragraphs": [
          "“Better than most choices” is not an optimality conclusion. For minimization, start from an optimum O₀ and show each exchange produces a feasible Oᵢ with cost(Oᵢ)≤cost(Oᵢ₋₁). If the final transformed solution is G, then cost(G)≤cost(O₀)=OPT. Because G is feasible, OPT≤cost(G); hence equality.",
          "Likewise, saying a feasible solution exists is not enough to show your algorithm cannot get stuck. Keep a comparison solution agreeing with the greedy prefix, or use a stays-ahead lemma to prove its next action is available. Explain what the algorithm reports when no candidate exists."
        ],
        "steps": [],
        "check": null,
        "answer": null
      }
    ]
  },
  {
    "id": "reductions",
    "title": "Design the right graph state",
    "subtitle": "The hard part is choosing what a vertex must remember.",
    "source": "week2revised-reductions.pdf, pp. 39–54, 64–73; ans2ugF26.pdf, pp. 3–6; practice midterm, pp. 2–3.",
    "sections": [
      {
        "title": "When one location is not one state",
        "paragraphs": [
          "A state must retain everything about the past that changes legal future moves or their costs. Two histories can share a state only if they have the same future possibilities, with any accumulated objective accounted for separately.",
          "A city alone loses arrival time. A vertex alone loses how many edges have already been taken. An item alone may lose other inventory if future rules require combinations. Ask: if two histories end here, can one continue legally while the other cannot? If yes, your state is missing information."
        ],
        "steps": [],
        "check": "A route must use exactly r red edges. What information would an ordinary graph vertex forget?",
        "answer": "How many red edges have already been used. A natural state is (v,j), with 0 ≤ j ≤ r; red edges increment j and other edges preserve it. The allowed terminal states must express “exactly,” not “at most.”"
      },
      {
        "title": "A complete reduction has six pieces",
        "paragraphs": [],
        "steps": [
          "Define V′ explicitly, including start and target states. Explain the meaning of each coordinate.",
          "Define each edge type and its direction, weight, and existence condition. Name the invariant enforced by every transition.",
          "Choose a standard solver whose assumptions hold: reachability, BFS, Dijkstra, DAG shortest paths, or another justified algorithm.",
          "Forward map: transform every feasible original solution into a valid transformed path and calculate its cost.",
          "Reverse map: decode every transformed path into a feasible original solution and calculate its cost. Conclude equality of optimal values, including infeasibility.",
          "Count |V′|, |E′|, construction time, solver time, and recovery time in original parameters. Save predecessor information to recover the requested witness."
        ],
        "check": null,
        "answer": null
      },
      {
        "title": "Worked state expansion: a route with at most one toll edge",
        "paragraphs": [
          "Original example: a directed graph with n vertices, m nonnegative weighted edges, some marked toll. Find a cheapest s–t route using at most one toll edge. Make states (v,0) and (v,1), recording whether the allowance has been used. Begin at (s,0)."
        ],
        "steps": [
          "For a non-toll edge u→v of weight w, add (u,0)→(v,0) and (u,1)→(v,1), each of weight w. For a toll edge, add only (u,0)→(v,1).",
          "Run Dijkstra from (s,0). Choose the cheaper reachable target among (t,0) and (t,1), then decode the predecessor path by forgetting the second coordinate.",
          "Forward: annotate an original legal route with 0 before its toll edge and 1 after. Every transition exists and total weight is unchanged.",
          "Reverse: a transformed path can move from layer 0 to layer 1 at most once and never back, so its decoded route uses at most one toll. Every edge is an original edge of the same weight.",
          "There are 2n vertices and at most 2m edges. Construction is O(n+m), binary-heap Dijkstra is O((n+m) log n), and recovery is O(n) using a simple predecessor path in the expanded graph. If both targets are unreachable, no feasible route exists."
        ],
        "check": "What changes if exactly one toll is required? Is the graph necessarily a DAG?",
        "answer": "Accept only (t,1). It is not necessarily a DAG: non-toll edges can form cycles within either layer. Layers alone do not justify using DAG shortest paths."
      },
      {
        "title": "Compatibility edges need every condition",
        "paragraphs": [
          "For edge-state problems, a vertex can represent an original edge e=(u,v). A transition e→f is legal only if f starts at v and the extra condition holds, such as weight(e) < weight(f). Checking only the weights can create a sequence that is not a walk.",
          "The compact formula in the increasing-path key omits the shared-endpoint condition, but its construction checks incoming and outgoing edges at the same vertex. Keep that condition explicit in your own proof. A direct compatibility graph can have Θ(m²) edges; calling its search “linear” still means linear in the expanded graph, not the original one."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Event chains save edges",
        "paragraphs": [
          "For timed connections, first make states for relevant (city,time) events and sort each city’s events by time. Waiting edges connect consecutive times at the same city. A chain of waiting edges replaces many direct “can wait until” edges without changing reachability.",
          "Flight edges connect departure events to arrival events. Add a counter coordinate only when the constraint requires it, and update it on flight edges rather than waiting edges. Decide whether equal-time connections are legal; do not silently replace < by ≤. Strictly forward time can establish acyclicity, but prove it for all edge types.",
          "With F flights there are O(F) event states and waiting edges before adding counters. Sorting takes O(F log F). With k+1 counter layers there are O(kF) states and edges. A DAG solver, when justified, takes O(kF); total construction includes the initial sorting. Decode only flight edges, retaining flight IDs."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Implementation must actually support the claimed query",
        "paragraphs": [
          "Sorting a list does not automatically make every later choice a binary search. Binary search needs a monotone predicate in that sorted order. For instance, sorting by arrival time does not make departure-time feasibility monotone. A proof of O(n log n) must explain the search structure or a scan that never revisits entries too often.",
          "Count the work in each loop. “There are k stages” and “n flights” can give O(kn) if each stage rescans the whole list. To claim a linear scan after sorting, state the pointer or grouping invariant that bounds the total number of inspections. Include data-structure preprocessing and witness recovery."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Read the practice midterm without revealing its solutions",
        "paragraphs": [
          "Quests: formalize what is retained or consumed, what constitutes a move, and what the health constraint means. “Health must stay positive” is stricter than “cost at most M.” If costs are nonnegative, compare final accumulated loss with the strict bound; otherwise final cost alone would not control prefixes.",
          "Fixed-number-of-edges path: distinguish a walk from a simple path and exactly k from at most k. Negative weights rule out a blanket Dijkstra justification, but do not rule out every shortest-path algorithm. Your proof must explain which structural property of the transformed graph permits your chosen solver.",
          "Try these questions from the PDF after the toll-route exercise. Bring your proposed state definition to chat before requesting the full solution."
        ],
        "steps": [],
        "check": null,
        "answer": null
      }
    ]
  },
  {
    "id": "dijkstra",
    "title": "Search, shortest paths, and data structures",
    "subtitle": "Choose the algorithm from the graph’s structure and objective.",
    "source": "week1and2-Dijkstra.pdf, pp. 2–18, 32–42, 43–69; ans2ugF26.pdf, pp. 1–3.",
    "sections": [
      {
        "title": "Which standard algorithm applies?",
        "paragraphs": [
          "Reachability only: BFS or DFS, O(n+m) with adjacency lists. Minimum number of edges or equal positive edge costs: BFS. Nonnegative weighted shortest paths: Dijkstra. Directed acyclic graph with arbitrary real weights: process vertices topologically and relax outgoing edges, O(n+m). A general graph with negative edges needs a different solver, such as Bellman–Ford, and careful treatment of reachable negative cycles.",
          "In a DAG all predecessors of a vertex come before it, so when it is processed every possible last-edge candidate has already been considered. This is why negative edges are allowed there. Dijkstra instead needs nonnegative weights to justify finalizing the smallest tentative label."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Rebuild Dijkstra’s proof, not just its statement",
        "paragraphs": [
          "Tentative distances are lengths of discovered paths, so finite d[v] ≥ δ(s,v). Maintain: every finalized vertex x has d[x]=δ(s,x). Also retain predecessors so distance labels correspond to actual paths."
        ],
        "steps": [
          "Base: s has distance 0, which is optimal with nonnegative weights.",
          "Let u be the next extracted vertex with finite minimum tentative distance. On a shortest s–u path, let y be the first vertex not yet finalized and x its preceding finalized vertex.",
          "Relaxing x→y gives d[y] ≤ δ(s,y). A prefix of a shortest path can be chosen shortest; combined with the discovered-path upper bound, d[y]=δ(s,y).",
          "Nonnegativity of the remaining suffix gives δ(s,y) ≤ δ(s,u). Minimum extraction gives d[u] ≤ d[y]. Hence δ(s,u) ≤ d[u] ≤ d[y] = δ(s,y) ≤ δ(s,u), so all are equal.",
          "When no finite frontier label remains, no unfinalized vertex can be reachable: a reachable path would have a first unfinalized vertex with a finite label."
        ],
        "check": "Where exactly does a negative edge break the proof?",
        "answer": "The suffix inequality δ(s,y) ≤ δ(s,u) can fail. A path can reach y at a larger cost and then become cheaper through a negative suffix. Discovery and relaxation do not themselves finalize a distance."
      },
      {
        "title": "Count operations before choosing a heap",
        "paragraphs": [
          "Indexed binary heap: at most n extract-min operations and m successful decrease-key operations, costing O((n+m) log n) plus graph storage. The index map must be maintained after swaps so a vertex can be located for decrease-key. A lazy duplicate-entry implementation needs a different queue-size analysis.",
          "Array priority queue: each extract-min scans n labels, while decrease-key takes O(1). Total O(n²+m). For simple dense graphs m=Θ(n²), this can beat the binary heap. For a square grid with side q, n=Θ(q²) and m=Θ(q²), giving O(q² log q) with a heap versus O(q⁴) with an array.",
          "A b-ary heap has height O(log_b n); decrease-key examines one ancestor per level, while extract-min may inspect b children at each level. The resulting expression is O((m+nb) log_b n). Choosing b balances the frequency of these operations; “heap is faster” without densities is not an analysis."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Useful transformations and variants",
        "paragraphs": [
          "For distances from every v to a fixed target t, reverse all directed edges and run a single-source algorithm from t. Every original v→t path reverses to a t→v path of identical weight. Building the reverse adjacency lists takes O(n+m).",
          "For widest paths, replace addition by min and minimization by max: candidate through u is min(width[u], capacity(u,v)); update width[v] with the maximum of its old value and that candidate. Extract maximum width. State a fresh invariant and prove it; changing the code’s operators is not itself a correctness argument.",
          "If stopping Dijkstra early, stop on extraction/finalization, not first discovery. Count whether the source is included in the requested k nearest vertices, and handle fewer than k reachable vertices."
        ],
        "steps": [],
        "check": null,
        "answer": null
      }
    ]
  },
  {
    "id": "order",
    "title": "Order notation and counterexamples",
    "subtitle": "Definitions first; a graph or a few numerical values are not a proof.",
    "source": "ans1F26.pdf, p. 1; practice midterm, p. 1. Additional worked examples below are original.",
    "sections": [
      {
        "title": "Quantifiers you should be able to write",
        "paragraphs": [
          "For eventually positive functions: f∈O(g) means there exist C>0 and N such that every n≥N satisfies f(n)≤Cg(n). f∈Ω(g) reverses the bound. f∈Θ(g) requires both. f∈o(g) means for every ε>0 there exists N such that every n≥N satisfies f(n)≤εg(n). f∈ω(g) means g∈o(f).",
          "A ratio tending to a positive finite constant implies Θ. But Θ does not require a convergent ratio: eventual upper and lower constant bounds suffice. If a ratio does not converge, that alone does not disprove Θ or O."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Worked example: oscillation is not enough",
        "paragraphs": [
          "Let g(n)=n and f(n)=n for even n, 2n for odd n. For every n, g(n)≤f(n)≤2g(n); therefore f∈Θ(g). Yet f/g alternates between 1 and 2 and has no limit.",
          "This example teaches the ratio issue, but f is not increasing everywhere. A counterexample to a statement about increasing functions must satisfy that extra hypothesis too. Check domain, positivity, integrality, and monotonicity before using it on the practice midterm."
        ],
        "steps": [],
        "check": "Does f∉o(g) imply f∈Ω(g)?",
        "answer": "No. Not being eventually smaller by every constant only supplies arbitrarily late large ratios; Ω requires a uniform positive lower bound for all sufficiently large n. A ratio can have subsequences approaching zero and others bounded away from zero."
      },
      {
        "title": "How to build a valid construction",
        "paragraphs": [
          "Translate the desired conclusion into a ratio inequality first. To force f(n+1)/g(f(n))→∞, the HW1 key recursively adds a growing multiple of g(f(n)). The added positive term also makes monotonicity easy to prove. The lesson is to design the function around the target inequality, not guess a familiar polynomial.",
          "For a counterexample with competing growth, consider recursively chosen checkpoints and intervals between them. Maintain monotonicity by only increasing values. At alternating checkpoints force the ratio large or small. Then prove that the values between checkpoints still satisfy all hypotheses. Work out the actual construction yourself for the practice midterm; a sketch saying “make them alternate” is not enough."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "A short proof you can model",
        "paragraphs": [
          "Claim: 3n²+7n+4 ∈ Θ(n²), but not o(n²). For n≥1, 3n² ≤ 3n²+7n+4 ≤ 14n². Thus constants 3 and 14 prove Θ. The ratio is 3+7/n+4/n²→3, not zero, so little-o fails.",
          "On an exam, state constants and a threshold for O/Ω arguments, or state the limit and justify it. For disproofs involving “for all functions,” one valid pair suffices, but that pair must satisfy every input restriction."
        ],
        "steps": [],
        "check": null,
        "answer": null
      }
    ]
  },
  {
    "id": "mst",
    "title": "MST proofs and union-find invariants",
    "subtitle": "Connectivity and minimum weight are different claims.",
    "source": "Week3+4-MST.pdf, pp. 13–22, 30–40, 51–86; Week4tightamortizedtime.pdf, pp. 15–22.",
    "sections": [
      {
        "title": "The cut exchange that makes an edge safe",
        "paragraphs": [
          "Maintain that the accepted forest F is contained in some MST T. Take a cut that no edge of F crosses, and let e be a lightest edge crossing it. If e∈T, retain T. Otherwise add e to T, creating a cycle. That cycle must cross the cut again, at some f.",
          "Since f crosses the cut and e is lightest, w(e)≤w(f). Since no edge of F crosses the cut, f∉F. Therefore T−f+e remains a spanning tree, is no heavier than T, and contains F∪{e}. This proves the invariant for the new forest. On termination, n−1 accepted edges on connected input give an MST."
        ],
        "steps": [],
        "check": "Why must you explain f∉F?",
        "answer": "Otherwise the exchange might remove an edge already chosen by the algorithm, destroying the very invariant you are trying to preserve."
      },
      {
        "title": "Prim versus Kruskal",
        "paragraphs": [
          "Prim maintains one growing connected set and chooses the minimum-weight edge crossing from it to the outside. Kruskal scans all edges by nondecreasing weight and accepts those joining distinct components. Both use the cut property; they do not use the same priority keys as Dijkstra.",
          "Dijkstra’s key is distance from the source. Prim’s key is the cheapest connection to the current tree. An MST minimizes the sum of selected edge weights, not all source-to-vertex path distances. Negative weights and ties are allowed for MSTs; equal weights may produce different optimal trees.",
          "Kruskal takes O(n + m log m + mα(n)) with comparison sorting, rank, and compression. Prim with a binary heap takes O((n+m) log n); a dense array implementation takes O(n²). For disconnected graphs state that you return a minimum spanning forest or report that no spanning tree exists."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Prove the rank invariants",
        "paragraphs": [
          "Along every non-root parent pointer, rank(parent)>rank(child). A union attaches a smaller-rank root under a larger-rank root; on equal ranks, increase the new root’s rank by one. Compression redirects to an ancestor with still larger rank, preserving the property.",
          "A root of rank r represents at least 2ʳ elements. Base: rank 0 represents one element. Unequal-rank union only increases the larger tree’s size. Equal-rank union combines two sets of size at least 2ʳ into size at least 2ʳ⁺¹ and raises rank to r+1. Finds do not change set membership.",
          "Thus rank(root)≤log₂n and an uncompressed path has length at most log₂n. Rank is a historical upper bound, not the current height after compression. Do not reset ranks when paths shorten."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Separate Merge from Union",
        "paragraphs": [
          "Linking two known roots by rank takes O(1). A Union operation on arbitrary elements normally calls Find twice before linking, so its cost includes those Finds. The lecture sometimes calls the root-linking step Merge. Name your convention before counting operations."
        ],
        "steps": [],
        "check": null,
        "answer": null
      }
    ]
  },
  {
    "id": "amortized",
    "title": "Potential, tokens, and tight bounds",
    "subtitle": "Account for expensive work across the whole sequence.",
    "source": "Week4amortizedtime.pdf, pp. 16–46; Week4tightamortizedtime.pdf, pp. 19–56.",
    "sections": [
      {
        "title": "Derive the potential instead of guessing it",
        "paragraphs": [
          "Identify the expensive event and what resource it consumes. Choose a nonnegative potential that drops enough to pay for that event. Cheap operations replenish the resource. Define the cost model first; counting only trades differs from counting deposits plus trades.",
          "For a base-b register, exchanging b bills for one reduces bill count by b−1. Set Φ=(number of bills)/(b−1), so each exchange drops potential by one. A deposit with k exchanges has c=1+k and ΔΦ=1/(b−1)−k. Thus ĉ=c+ΔΦ=b/(b−1).",
          "Starting empty, Φ₀=0 and Φₘ≥0. Telescoping gives Σcᵢ=Σĉᵢ+Φ₀−Φₘ≤mb/(b−1). This is a bound for every sequence of m deposits, not a probability statement."
        ],
        "steps": [],
        "check": "If the initial state is not empty, can you still drop Φ₀?",
        "answer": "No. The bound is Σcᵢ≤Σĉᵢ+Φ₀ when the final potential is nonnegative. Initial stored work can pay for expensive operations and must be included."
      },
      {
        "title": "Why rank alone gives log n but compression helps",
        "paragraphs": [
          "Rank invariants bound each Find by O(log n), but repeated long Finds compress the very paths that made them expensive. Multiplying the worst single-operation bound by the number of operations ignores this improvement. Tokens are an analysis device; the actual algorithm still only changes parent pointers and ranks.",
          "Assign tokens on MakeSet and root-linking Merge. Spending a token pays for a changed pointer. If C is a constant covering each change, use Φ=C·(unspent tokens). Find’s amortized cost is O(1) plus the number of changes not paid by tokens. The task becomes bounding unpaid vertices on any Find path."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Self tokens: where log log n comes from",
        "paragraphs": [
          "A root receives a token at creation and on merges in which it becomes the new root. It therefore has at least as many tokens as its rank when it stops being a root. Thereafter its rank stays fixed and each paid pointer change raises its parent’s rank.",
          "After enough changes exhaust its tokens, a vertex v has rank(parent(v))>2·rank(v). Along a path, ranks increase strictly. Among broke vertices of positive rank, these doubling inequalities imply that k such vertices force rank near the top to be at least 2 to a power proportional to k. But every rank is at most log₂n. Therefore k=O(log log n), with a constant allowance for the rank-zero and endpoint cases.",
          "MakeSet and root-linking Merge create only O(1) potential; each Find has O(log log n) amortized cost in this analysis. This is an upper bound for the unchanged data structure, not yet its tightest analysis."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Gift tokens: where log-star comes from",
        "paragraphs": [
          "Add self tokens and gift tokens. A child may spend a gift to pay for its broke parent’s pointer change. At such a moment the parent’s parent has rank more than twice the parent’s rank. Compression redirects the child to the root too, so spending a gift more than doubles the rank of that child’s parent.",
          "Exhausting the gifts therefore forces the new parent rank to be exponential in the child’s rank. Repeated unpaid vertices now force a tower of exponentials along the path, still capped by log n. The inverse of tower growth is log-star: the number of repeated logarithms needed to reach a constant.",
          "That gives O(log* n) amortized Find in the gift analysis. Be able to explain the chain: token exhaustion ⇒ rank growth ⇒ few unpaid changes ⇒ amortized bound. Simply quoting log-star skips the argument."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Many token types and inverse Ackermann",
        "paragraphs": [
          "The tight deck extends gifts to ancestors: self, parent, grandparent, and so on. With K types, MakeSet and root-linking Merge create O(K) potential. Higher token types force faster rank growth on exhaustion, using the hierarchy F₀(x)=2x and Fᵢ(x+1)=Fᵢ₋₁(Fᵢ(x)), with Fᵢ(1)=2.",
          "The proof uses linked inductions: tokens spent imply parent-rank growth, and exhaustion gives the rank bound needed by the next token type. Balance the cost of issuing token types against the number of unpaid changes. Choosing the level around inverse Ackermann yields the standard O(α(n)) amortized bound.",
          "For n elements and q Find/Union operations, use O((n+q)α(n)) as a standard sequence bound. This does not make every Find worst-case constant. Kruskal still includes sorting: O(n + m log m + mα(n)); claiming only the union-find term requires a justified linear-time sorting assumption.",
          "Study the full linked induction in tight-deck pp. 45–54 if it is in scope. These notes explain the mechanism and dependence of the claims; they are not a substitute for every technical step of that proof. The deck’s final lower-bound result establishes tightness in a specified model; an upper bound alone cannot establish tightness."
        ],
        "steps": [],
        "check": null,
        "answer": null
      }
    ]
  },
  {
    "id": "approximation",
    "title": "From exact optimality to approximation",
    "subtitle": "Use unavoidable lower bounds even when greedy is not optimal.",
    "source": "Week4approx.pdf, pp. 5–18 (bounds and TSP), 19–32 (two machines), 33–44 (parallel jobs). Possible exam coverage; absent as a standalone practice-midterm question.",
    "sections": [
      {
        "title": "Get the inequality direction right",
        "paragraphs": [
          "For minimization, prove cost(G)≤ρ·OPT with ρ≥1. Since G is feasible, OPT≤cost(G) is automatic and proves no approximation guarantee. A useful method is to find LB≤OPT and then prove cost(G)≤ρ·LB.",
          "For maximization, prove value(G)≥OPT/ρ. The same phrase “within a factor” has opposite inequality direction. Always say whether the objective is a cost to minimize or a value to maximize."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Worked proof: metric TSP from an MST",
        "paragraphs": [
          "Assume a complete undirected graph with nonnegative symmetric distances satisfying the triangle inequality. Find an MST T, traverse each tree edge twice in a closed walk, and shortcut already-visited vertices to obtain a tour visiting each vertex once."
        ],
        "steps": [
          "Lower bound: delete one edge from an optimal tour. The remaining path is a spanning tree, so w(T)≤OPT. Nonnegativity ensures deleting the edge does not increase cost.",
          "Traversal: each tree edge is used twice, so the walk costs 2w(T).",
          "Shortcut: triangle inequality ensures replacing a subwalk by the direct edge cannot increase length. Completeness guarantees that edge exists.",
          "Feasibility: retain each vertex on its first visit and return to the start. This gives a tour of all vertices.",
          "Conclusion: cost(G)≤2w(T)≤2OPT. The non-strict inequalities handle zero weights and equality. For an explicit distance matrix, dense Prim takes O(n²); traversal and shortcutting take O(n)."
        ],
        "check": "Can you apply metric closure to arbitrary Hamiltonian-cycle TSP and claim the optimum is unchanged?",
        "answer": "No. On a connected nonnegative road network, shortest-path distances yield a metric whose tour expands into a closed visiting walk in the original graph, possibly repeating vertices. That is appropriate when repeats are allowed in the road route. It does not preserve arbitrary original-edge Hamiltonian-cycle TSP."
      },
      {
        "title": "Worked proof: load balancing on two machines",
        "paragraphs": [
          "Jobs of nonnegative duration may be assigned to two identical machines. The objective is makespan, the larger total load. List scheduling sends each job to the currently less-loaded machine. Longest-processing-time first (LPT) sorts before doing this.",
          "Let W=Σtᵢ and pmax=max tᵢ. Every feasible schedule has OPT≥W/2 and OPT≥pmax. Focus on the last job of duration p placed on a machine that attains the final makespan C. Let its load before that assignment be S. Since it was the less-loaded machine, S is at most half the total already-assigned work, hence S≤(W−p)/2.",
          "Therefore C=S+p≤W/2+p/2≤OPT+OPT/2=3OPT/2. This proof holds for any input order. It uses the critical job, not necessarily the last job in the entire list."
        ],
        "steps": [],
        "check": "For LPT on 3,3,2,2,2, what are the final loads and what does the example prove?",
        "answer": "The greedy loads are 7 and 5. An optimal partition has loads 6 and 6, so the ratio is 7/6. This proves the worst-case ratio is at least 7/6, not at most 7/6. An upper bound needs an argument for all instances."
      },
      {
        "title": "How sorting sharpens the proof",
        "paragraphs": [
          "For LPT, let j be the position of the critical job in decreasing duration order. Since W≥j·p, p/2≤W/(2j)≤OPT/j. Thus C≤(1+1/j)OPT. If j=1, the makespan is the largest job and is optimal. For positive jobs j=2 cannot be the critical job unless the first two tie, in which case choose the first as critical.",
          "If j=3, the critical machine holds t₂+t₃ (up to ties). Any two-machine schedule puts at least two of the three largest jobs together; their sum is at least t₂+t₃. Thus this case is optimal. For j≥4 the previous inequality gives C≤5OPT/4. The slides state the sharper tight 7/6 result but do not give its full case analysis; do not present the 5/4 argument as a proof of 7/6."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Enumerate only a small difficult prefix",
        "paragraphs": [
          "Sort durations, choose k, and enumerate assignments of the k largest jobs to find their optimal makespan. Then assign the remaining jobs greedily. The optimum for the prefix is a lower bound on the full optimum.",
          "If a final critical machine never receives another job, its load is at most the prefix optimum, so the schedule is optimal. Otherwise its final job has index j>k, and the critical-job argument gives C≤(1+1/j)OPT≤(1+1/(k+1))OPT. A conservative running time is O(n log n + k·2ᵏ + n), recomputing each enumerated load in O(k). Incrementally maintaining loads can reduce enumeration to O(2ᵏ).",
          "For k=floor(log₂n), enumeration is polynomial and sorting remains O(n log n). For a desired fixed error ε, choosing k about 1/ε produces a (1+ε)-style guarantee with exponential dependence on 1/ε. State both the approximation and the computation cost."
        ],
        "steps": [],
        "check": null,
        "answer": null
      },
      {
        "title": "Parallel jobs: combine two different lower bounds",
        "paragraphs": [
          "Job i needs pᵢ processors simultaneously for duration tᵢ, with 1≤pᵢ≤P. Sort by decreasing processor requirement. Start jobs in this order whenever the next fits, waiting for completion events otherwise. Do not skip ahead to smaller jobs unless your proof covers that different rule.",
          "Let Work=Σpᵢtᵢ and Tmax=max tᵢ. Every schedule has OPT≥Work/P and OPT≥Tmax. Before the last job starts, more than half the processors are busy: if the next job needs ≤P/2, it would fit if that many were idle; if it needs >P/2, any running earlier job itself uses >P/2. Event instants do not affect the area bound.",
          "If T₁ is the time before the last start, Work≥(P/2)T₁, so T₁≤2OPT. The tail T₂ after the last start is at most Tmax≤OPT. Hence C=T₁+T₂≤3OPT. Sorting and a finish-event min-heap give O(n log n) time and O(n) space.",
          "The deck refines this to 11/4 by separating the time with jobs requiring >P/2 processors from the later phase. Let these lengths be A and B, and let Z be the final tail. Large jobs cannot overlap, so A≤OPT; after they finish, the rule keeps at least 2P/3 processors busy while jobs remain unstarted. Thus Work/P≥A/2+2B/3 and C=A+B+Z≤(3/2)(Work/P)+A/4+Z≤(11/4)OPT. The key is a weighted combination of bounds, not assuming their sum is itself ≤OPT."
        ],
        "steps": [],
        "check": null,
        "answer": null
      }
    ]
  }
];
