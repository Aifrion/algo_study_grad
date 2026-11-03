export const examExercises = [
  {
    "id": "g1",
    "topic": "greedy",
    "title": "Derive a priority rule",
    "minutes": 25,
    "level": "Exam transfer",
    "prompt": "A single machine handles all requests, available at time zero. Request i takes tᵢ>0 time and has penalty wᵢ≥0 per unit of completion time. Minimize the weighted sum of completion times. Derive a rule by comparing two adjacent requests; prove it and analyze its implementation. Then explain what changes if the objective is weighted waiting time.",
    "hint": "Write the two costs starting at an arbitrary time S. Cancel the terms that do not change.",
    "outline": [
      "Sort by decreasing wᵢ/tᵢ, keeping every job once. Waiting and completion objectives differ by the constant Σwᵢtᵢ.",
      "For adjacent a,b, cost(ab)−cost(ba)=wᵦtₐ−wₐtᵦ. Move a largest-ratio job to the front through non-increasing swaps. Feasibility and all other completion times are unchanged. The residual time offset contributes a constant, so induction applies.",
      "O(n log n) for sorting and O(n) for output. State the arithmetic model if weights are large integers."
    ],
    "rubric": [
      "Derive the difference instead of citing the ratio rule.",
      "Check feasibility and unchanged jobs.",
      "Explain the residual objective and induction.",
      "Distinguish duration, completion time, and weight."
    ]
  },
  {
    "id": "g2",
    "topic": "greedy",
    "title": "Cover points with fixed-length intervals",
    "minutes": 25,
    "level": "Exam transfer",
    "prompt": "Given n real points on a line and L>0, cover every point with as few closed intervals of length L as possible. Propose a greedy algorithm, prove it optimal using a method you choose, and analyze time. Return the intervals, not only their count.",
    "hint": "Consider the leftmost uncovered point. How far right can an interval containing it end?",
    "outline": [
      "Sort points. At the leftmost uncovered x, choose [x,x+L], skip every point ≤x+L, and repeat.",
      "Any solution must cover x. Replacing one interval containing x with [x,x+L] loses no still-uncovered point: none is left of x and the new right endpoint is at least the old one. This gives an equally good solution with the greedy first interval; induct on uncovered points. Alternatively, greedy leftmost anchors are separated by >L, so every solution needs a distinct interval for each anchor.",
      "O(n log n) sorting and O(n) scanning, with O(n) output in the worst case."
    ],
    "rubric": [
      "Use closed endpoints consistently.",
      "Prove the exchange preserves all remaining coverage.",
      "Finish the induction or show the anchor lower bound.",
      "Return actual interval endpoints."
    ]
  },
  {
    "id": "g3",
    "topic": "greedy",
    "title": "Repair a stays-ahead argument",
    "minutes": 15,
    "level": "Focused proof drill",
    "prompt": "For unweighted half-open interval scheduling, a student writes: “Greedy finishes its i-th event earlier, so it also finishes its next event earlier. Thus it is optimal.” Repair the missing induction step and explain why the finish-time comparison implies maximum cardinality.",
    "hint": "First prove that the other schedule’s next event can be chosen from the greedy state.",
    "outline": [
      "Use earliest compatible finish; sort by finish time.",
      "If f(gᵢ)≤f(oᵢ), then f(gᵢ)≤f(oᵢ)≤s(oᵢ₊₁). Thus oᵢ₊₁ is available to greedy and f(gᵢ₊₁)≤f(oᵢ₊₁). Base case uses the earliest finish overall. If the comparison has an extra event when greedy stops, that event is still available, a contradiction.",
      "O(n log n) sorting and O(n) scan."
    ],
    "rubric": [
      "State the quantified comparison schedule.",
      "Use feasibility before the greedy choice rule.",
      "Prove the stopping/cardinality implication."
    ],
    "requirements": [
      "State the earliest-finish rule and a precise progress comparison against an arbitrary feasible schedule.",
      "Prove the base case and inductive step, including why the comparison’s next event is available to greedy.",
      "Explain why the comparison implies maximum cardinality and verify that greedy’s selections are feasible. This exercise focuses on the lemma, not a full implementation."
    ]
  },
  {
    "id": "r1",
    "topic": "reductions",
    "title": "A route with a one-use coupon",
    "minutes": 30,
    "level": "Exam transfer",
    "prompt": "A directed graph has n vertices, m edges, and nonnegative travel costs. You may use a coupon on at most one edge to make that edge free. Find a cheapest s–t route and indicate the coupon edge, if any. Define a reduction, prove both directions, and include output recovery in the running time. The graph is given by adjacency lists; vertices may repeat in a route, and an empty route is permitted when s=t. Report no route if t cannot be reached.",
    "hint": "Remember whether the coupon has been used. Paying normally must remain an option.",
    "outline": [
      "Create states (v,0),(v,1). For every u→v of cost w, add same-layer edges of cost w and (u,0)→(v,1) of cost 0. Run Dijkstra from (s,0), accepting either target layer. Decode predecessor edges, preserving original edge IDs and coupon status.",
      "A route with a coupon annotates to a path switching layers once; a transformed path switches at most once and decodes to a legal coupon route. Costs match in both directions. Unreachable targets mean no solution.",
      "2n states, 3m edges; O(n+m) construction and O((n+m) log n) binary-heap solve, O(n) recovery."
    ],
    "rubric": [
      "Allow both zero and one coupon uses.",
      "Preserve edge identities when recovering the route.",
      "Prove both maps and cost equality.",
      "Check nonnegative weights and count the expanded graph."
    ]
  },
  {
    "id": "r2",
    "topic": "reductions",
    "title": "Even-length walks",
    "minutes": 25,
    "level": "Exam transfer",
    "prompt": "Given a directed graph in adjacency-list format with n vertices and m edges, return an s–t walk with an even number of edges, or report none. The empty walk is allowed when s=t. Vertices may repeat. Give a graph reduction, equivalence proof, and efficient implementation.",
    "hint": "Track parity, rather than every possible length.",
    "outline": [
      "Use states (v,0),(v,1). Each original edge changes parity. Search from (s,0) to (t,0); decode a predecessor path.",
      "After j transitions the parity is j mod 2. Every even original walk maps to a target-reaching walk, and every target-reaching transformed path decodes to an even walk. A simple path in the state graph may repeat original vertices, which is allowed.",
      "2n states and 2m edges: O(n+m) time and space, including recovery."
    ],
    "rubric": [
      "Use the correct target layer.",
      "Handle the empty walk.",
      "Do not mistakenly require original vertices to be distinct.",
      "Count transformed sizes."
    ]
  },
  {
    "id": "o1",
    "topic": "order",
    "title": "A ratio without a limit",
    "minutes": 15,
    "level": "Exam transfer",
    "prompt": "For positive integer n, let f(n)=n for even n and 2n for odd n, and let g(n)=n. Determine whether f is O(g), Ω(g), Θ(g), o(g), or ω(g), proving each conclusion. Is this pair a valid example for a question restricted to increasing functions?",
    "hint": "Constant-factor bounds do not require a convergent ratio.",
    "outline": [
      "Use the ratio f/g∈{1,2} and the explicit inequalities g≤f≤2g.",
      "O, Ω and Θ hold. Little-o and little-omega fail because the ratio is always between 1 and 2. f is not increasing: f(3)=6>f(4)=4, so this pair cannot meet that extra hypothesis.",
      "This is a proof question, not an algorithm-design task; a runtime paragraph is unnecessary."
    ],
    "rubric": [
      "Write constants and an eventual threshold.",
      "Separate Θ from convergence to a constant.",
      "Check every hypothesis of a claimed counterexample."
    ]
  },
  {
    "id": "o2",
    "topic": "order",
    "title": "Construct a faster sequence",
    "minutes": 20,
    "level": "Exam transfer",
    "prompt": "Let h map positive integers to positive integers. Construct a strictly increasing positive-integer sequence a(n) such that a(n+1)/h(a(n)) tends to infinity. Prove positivity, integrality, monotonicity, and the limiting claim separately.",
    "hint": "Build the desired ratio into a recurrence with an increasing multiplier.",
    "outline": [
      "Set a(1)=1 and a(n+1)=a(n)+(n+1)h(a(n)).",
      "By induction all values are positive integers. Each increment is positive, so the sequence is strictly increasing. Dividing gives a(n+1)/h(a(n))≥n+1→∞. No monotonicity of h is needed.",
      "No runtime claim is required for this existence construction; the values may grow extremely quickly."
    ],
    "rubric": [
      "Define the sequence on its full domain.",
      "Prove it satisfies the requested restrictions.",
      "Display the ratio lower bound."
    ]
  },
  {
    "id": "a1",
    "topic": "amortized",
    "title": "Find the coefficient of a potential",
    "minutes": 20,
    "level": "Exam transfer",
    "prompt": "A counter stores bills in denominations 1,b,b²,… for integer b≥2. Deposit one unit bill at a time; whenever b bills of one denomination accumulate, exchange them for one of the next. Count one per deposit and one per exchange. Derive a potential proving constant amortized cost from an empty state.",
    "hint": "One exchange reduces the bill count by b−1. What coefficient makes that decrease pay for one unit of work?",
    "outline": [
      "Process carries until each denomination has fewer than b bills. Use Φ=bill count/(b−1).",
      "For k exchanges, c=1+k and ΔΦ=1/(b−1)−k, so ĉ=b/(b−1)≤2. Initial potential is zero and final potential nonnegative. Therefore total cost of q deposits is at most 2q.",
      "O(1) amortized per deposit. A single deposit can take Θ(log_b q) exchanges after a long prefix; do not call it constant worst-case."
    ],
    "rubric": [
      "Include the deposit in actual cost.",
      "Derive rather than guess the coefficient.",
      "Check initial and final potential.",
      "State sequence versus single-operation bounds."
    ]
  },
  {
    "id": "a2",
    "topic": "amortized",
    "title": "Audit a union-find claim",
    "minutes": 20,
    "level": "Focused proof drill",
    "prompt": "A student says: “Path compression makes every Find constant time, and rank is always the current tree height. Therefore Kruskal runs in O(m).” Identify and repair all three claims. Explain one rank invariant and how it is preserved.",
    "hint": "Separate one operation, a sequence of operations, and sorting.",
    "outline": [
      "Use union by rank and path compression; rank is not reduced by compression. Include comparison sorting of the m edges.",
      "Ranks strictly increase along parent pointers. Union preserves this by attaching smaller rank under larger and incrementing on ties; compression moves a parent to a higher-ranked ancestor. A rank-r root represents at least 2ʳ elements. One Find can still take logarithmic time even though sequence cost has inverse-Ackermann amortization.",
      "A standard Kruskal bound is O(n+m log m+mα(n)). A linear sorting assumption would need justification; it does not follow from compression."
    ],
    "rubric": [
      "Do not equate amortized with worst-case.",
      "Do not update rank to match compressed height.",
      "Include sorting and initialization."
    ]
  },
  {
    "id": "ap1",
    "topic": "approximation",
    "title": "Find the critical job",
    "minutes": 25,
    "level": "Exam transfer",
    "prompt": "Jobs of positive durations are assigned in a given order to the less-loaded of two identical machines. Prove the resulting makespan is at most 3/2 times optimal. Specify the algorithm and time. Does your proof require sorting?",
    "hint": "Choose the last job placed on a machine that attains the final makespan.",
    "outline": [
      "Maintain two loads and append each job to the smaller one, breaking ties consistently. Record assignments.",
      "With W total work and pmax largest job, OPT≥W/2 and OPT≥pmax. For critical job p, prior load S≤(W−p)/2, so C=S+p≤W/2+p/2≤3OPT/2.",
      "O(n) time for a given order and O(n) assignment output. Sorting is not needed for this 3/2 proof."
    ],
    "rubric": [
      "Justify both lower bounds for every schedule.",
      "Identify the critical machine and job.",
      "Prove the prior-load inequality.",
      "State the ratio in the minimization direction."
    ]
  },
  {
    "id": "ap2",
    "topic": "approximation",
    "title": "Repair a tour guarantee",
    "minutes": 20,
    "level": "Focused proof drill",
    "prompt": "A proposed proof says: “An MST is shorter than an optimal TSP tour. Walk around the MST and skip repeated vertices, so the answer is optimal.” Under metric TSP assumptions, repair the proof and state the guarantee actually established. Identify the assumption used when skipping vertices.",
    "hint": "Count each tree edge traversal and write an inequality chain.",
    "outline": [
      "Compute an MST in the complete undirected metric graph, perform a doubled-tree traversal, and shortcut repeated vertices.",
      "MST≤OPT by deleting an optimal tour edge. The doubled traversal costs 2MST. Triangle inequality makes shortcutting non-increasing in length and completeness supplies the shortcut edges. The final tour is feasible and costs at most 2OPT; optimality is not established.",
      "For an explicit n-by-n distance matrix, O(n²) dense Prim plus O(n) traversal/shortcutting. Include metric-closure computation separately if starting with a road network."
    ],
    "rubric": [
      "Use non-strict inequalities.",
      "Explain both the bound and feasibility.",
      "Identify triangle inequality and completeness.",
      "Do not confuse a factor-2 guarantee with exact optimality."
    ]
  },
  {
    "id": "g4",
    "topic": "greedy",
    "title": "Prove a room-count lower bound",
    "minutes": 25,
    "level": "Exam transfer",
    "prompt": "Assign every half-open interval [sᵢ,fᵢ), sᵢ<fᵢ, to a room so overlapping intervals never share a room. Minimize rooms. Give a greedy algorithm, prove optimality by a lower bound, and analyze an efficient implementation.",
    "hint": "When a new room is opened, what do the finish times in all existing rooms tell you?",
    "outline": [
      "Sort by start. Keep a min-heap of room finish times and IDs. Reuse the earliest-finishing room when its finish≤the next start; otherwise open a new one.",
      "Reusing only compatible rooms proves feasibility. When room r is opened at s, all r−1 current rooms have finish>s and their active events started≤s. With the new event, r intervals overlap. Any assignment needs at least r rooms, which greedy achieves.",
      "O(n log n) sorting and heap processing; O(n) space including the assignment output."
    ],
    "rubric": [
      "Schedule all intervals rather than selecting a subset.",
      "Justify simultaneous overlap at the critical moment.",
      "Use max overlap, not summed overlaps.",
      "Preserve room IDs in the output."
    ]
  },
  {
    "id": "r3",
    "topic": "reductions",
    "title": "A cheapest sequence of upgrades",
    "minutes": 30,
    "level": "Independent transfer",
    "prompt": "A device has n named configurations. Configuration v has an integer stage h(v). A list of m permitted upgrades gives a starting configuration u, a resulting configuration v, and a real cost c for each upgrade; every listed upgrade satisfies h(v)>h(u). Costs may be negative because of rebates. Given configurations s and t, return a minimum-total-cost sequence of upgrades from s to t or report that none exists. The empty sequence is allowed when s=t. Design an efficient algorithm and justify your choice of standard solver.",
    "hint": "Which quantity changes strictly on every permitted move? What does that imply about cycles, even when costs are negative?",
    "outline": [
      "Create a directed vertex for each configuration and an edge for each permitted upgrade, preserving its cost and ID. Topologically sort the graph, initialize d[s]=0 and other distances to infinity, and relax outgoing edges in topological order. Recover upgrade IDs from predecessors, or report no sequence if d[t] is infinite.",
      "Stage increases strictly on every edge, so a directed cycle is impossible. Original upgrade sequences and graph paths correspond in both directions with identical costs. DAG shortest paths is valid with negative weights because all predecessors are processed before a vertex. Its shortest path therefore decodes to a cheapest upgrade sequence.",
      "O(n+m) construction, topological sorting, and relaxation; O(n) recovery. O(n+m) total time and space. Sorting the numerical stages is a valid but potentially slower alternative; linear-time graph topological sorting suffices."
    ],
    "rubric": [
      "Define states and transitions, rather than only naming a solver.",
      "Prove acyclicity and explain why negative costs are allowed.",
      "Prove both maps and preserve total cost.",
      "Return the sequence, handle unreachable t and s=t, and count all phases."
    ]
  },
  {
    "id": "r4",
    "topic": "reductions",
    "title": "The widest delivery route",
    "minutes": 30,
    "level": "Independent transfer",
    "prompt": "A directed road network is given by adjacency lists with n vertices and m edges. Each edge e has a positive capacity c(e). For distinct depots s and t, find a route maximizing its bottleneck: the minimum edge capacity on the route. Return both the route and its bottleneck, or report no route. First give a test for whether a route of bottleneck at least B exists; then use that test to solve the optimization problem efficiently.",
    "hint": "What edges can a route meeting threshold B use? How does feasibility change as B increases? Where can an optimal bottleneck value occur?",
    "outline": [
      "For a threshold B, retain edges with capacity at least B and run directed reachability from s. Sort distinct edge capacities and binary search for the largest feasible value. Run a final search with predecessor pointers to return its route. If there are no edges or no feasible value, report no route.",
      "Every route with bottleneck at least B survives the filtering, and every route in the filtered graph meets that threshold. Feasibility is monotone: a route meeting a larger B also meets every smaller B. Any nonempty route has bottleneck equal to one of its edge capacities. Thus binary search over distinct capacities finds the optimum.",
      "For m≥1, sorting takes O(m log(m+1)); O(log(m+1)) reachability tests take O((n+m) log(m+1)), plus O(n+m) recovery. Overall O((n+m) log(m+2)), including the empty-edge case. Space O(n+m). A separately justified widest-path algorithm is an alternative, but this exercise asks you to develop the threshold reduction."
    ],
    "rubric": [
      "Do not confuse maximizing the minimum edge with minimizing the sum.",
      "Prove both directions for the threshold test.",
      "Justify monotonicity and the candidate values searched.",
      "Count repeated searches, sorting, and recovery; do not claim one-search runtime for optimization."
    ]
  },
  {
    "id": "g5",
    "topic": "greedy",
    "title": "Reach the destination with fewest refills",
    "minutes": 30,
    "level": "Independent transfer",
    "prompt": "A vehicle starts at position 0 with a full tank and must reach position D>0 along a straight road. A full tank permits travel distance L>0. There are n refilling stations at distinct positions strictly between 0 and D, given in arbitrary order. At any selected station, refilling restores a full tank; every refill counts as one stop. Travel is only toward D, and you may reach a station or D with an empty tank. Find a sequence of stations minimizing refill stops, or report that the trip is impossible. Design a greedy strategy and choose your own correctness proof method.",
    "hint": "Compare the locations reached after the same number of refills. Is there a reason to stop when the destination is already within range?",
    "outline": [
      "Sort station positions. While D is farther than L from the current position, go to the farthest station within distance L, record a refill, and continue. If none is ahead within reach, report impossible. When D is within L, finish without an extra refill. Maintain a forward scan to avoid repeatedly searching all stations.",
      "Each selected leg has length at most L. For stays-ahead, compare greedy location gᵢ after i refills with any feasible comparison location aᵢ: gᵢ≥aᵢ. Both start at 0. If aᵢ₊₁≤gᵢ, any next greedy refill advances beyond it. Otherwise aᵢ₊₁−gᵢ≤aᵢ₊₁−aᵢ≤L, so that comparison station is available and greedy chooses at least as far. If the comparison reaches D after k refills, greedy can finish by k because D−gₖ≤D−aₖ≤L, or greedy already finished. If greedy is stuck before D, no feasible trip can exist: any route reaching D must cross beyond the stuck position, and its first station/destination beyond it would have to be within L of that position.",
      "O(n log n) sorting plus O(n) scanning and output, with O(n) storage for a simple sorted-copy implementation. If already sorted, O(n) time suffices. Handle n=0, D≤L, and gaps exactly L."
    ],
    "rubric": [
      "Specify the sequence of station indices or positions and the minimum-stop objective.",
      "Handle direct travel and exact-range endpoints without an unnecessary final refill.",
      "State and prove a comparison or exchange lemma; availability needs justification.",
      "Explain why the final comparison proves minimum stops and why failure means impossibility.",
      "Count sorting and implement the scan without rescanning all stations per stop."
    ]
  }
];
