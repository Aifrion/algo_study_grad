// Visible answer requirements describe obligations, not solution techniques.
export function answerRequirements(e) {
  if (e.requirements) return e.requirements;
  if (e.topic === 'reductions') return [
    'Specification: instance, required output, feasibility constraints, and objective (or decision question). State how to report no solution.',
    'Construction: define every vertex/state and edge type, directions and weights if applicable, and start/accepting states. Explain what each represents.',
    'Algorithm and recovery: choose a standard solver, check its assumptions, and explain how to recover the requested route or walk. You may invoke the solver’s established correctness.',
    'Correctness: prove both directions of the correspondence. For optimization, relate objective values and justify optimality; handle no-solution cases.',
    'Efficiency: define original input parameters, count constructed vertices and edges, then add construction, solving, and output-recovery time.'
  ];
  if (e.topic === 'greedy') return [
    'Specification: instance, solution variables/output, constraints, and objective. State endpoint and tie conventions when relevant.',
    'Strategy: describe the exact greedy choice, which candidates are eligible, what remains, and what the algorithm returns.',
    'Correctness: prove feasibility and optimality using a precise lemma and a suitable proof method. If using induction, give the base case, hypothesis, and conclusion; distinguish the residual input from a selected residual solution.',
    'Implementation and efficiency: explain the data structures or ordering, define input-size parameters, and count preprocessing, repeated operations, and output work.'
  ];
  if (e.topic === 'dijkstra') return [
    'Assess the claim with a valid counterexample and explain the tentative-distance updates.',
    'Specify initialization, the extraction/finalization rule, relaxation, output distances and predecessor information, and treatment of unreachable vertices.',
    'State and prove the invariant: initialization, preservation, termination, and the exact use of nonnegative weights.',
    'Define n and m. Name the indexed binary heap and count initialization, extract-min, edge scans, and decrease-key operations.'
  ];
  if (e.topic === 'mst') return [
    'Specify the input assumptions, output tree, feasibility constraints, and minimum-weight objective.',
    'Describe edge ordering, tie handling, cycle detection, and the data structure used.',
    'Prove feasibility and minimum weight with a precise invariant or lemma. Address the separate question of uniqueness.',
    'Count sorting, initialization, union-find operations, and output work in n vertices and m edges.'
  ];
  return ['Answer each requested part of the prompt and justify your claims. This is a focused exercise; do not add an unrelated algorithm or runtime section to a pure mathematical proof question.'];
}
