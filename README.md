# Algorithm Studio

An interactive study website for CSE 202, based on the five supplied lecture decks. It emphasizes algorithm design, proof of correctness, and complexity analysis in preparation for the November 7, 2026 midterm.

## Run locally

Requires Node.js 22.12+ (tested with 24.19.0) and npm. No accounts, API keys, backend, or external services are required.

```sh
npm ci
npm run dev
```

In the cloud workspace, use a writable npm cache:

```sh
cd /workspace/algo_study_grad
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --port 5173 --strictPort
```

The development server binds to all interfaces. Use the hosting platform's supported access mechanism. Onboarding does not publish a public site. Build static production files with `npm run build`; output is in `dist/`. Hash routing avoids server-side route rewrites. Deploy the entire output, including `lectures/`, to a static host. Relative asset URLs also support a project subdirectory such as GitHub Pages.

## Study features

- **Dijkstra:** predict the next finalized vertex, step forward/back, inspect distances and predecessors, and explore zero-weight edges and unreachable targets.
- **Reductions:** adjust a bottleneck threshold and test reachability with both-direction correctness explanations.
- **Greedy:** compare earliest-finish, earliest-start, and shortest-duration interval choices. Intervals use half-open endpoints.
- **MST:** predict Kruskal accept/reject decisions and inspect the resulting forest, cycles, components, and weight.
- **Amortized analysis:** experiment with the lecture cash register potential, then run repeated finds on a union-by-rank tree with path compression.
- Reorder proof steps, study runtime breakdowns, compare dense/sparse priority queue costs, and check conceptual understanding.
- Five original free-response exercises with separate algorithm/proof/runtime fields, optional timers, hints, self-assessment rubrics, and reference outlines.
- Lecture library with source PDF page links, printable proof toolkit, and a suggested study plan.

Progress, answers, and self-assessments persist in browser localStorage on the same origin/device. Timer state resets when leaving a problem. Written answers can be exported as text. No automatic proof grading or cross-device sync is provided. Study progress records lab activity, proof ordering, and concept questions; it is not a mastery score.

## Academic content and sources

See [docs/content-guide.md](docs/content-guide.md) for the source mapping and scope. The homework PDFs were read only to understand style; no homework problems or solutions are included. Practice questions are original or revisit lecture examples. The reported free-response exam format is explicitly labeled unconfirmed.

## Validation

```sh
npm test          # 7 algorithm tests with independent or exhaustive comparisons
npm run build    # production compilation
npm run test:e2e  # browser interactions, persistence, assets, and responsive layout
```

Browser tests use system Chromium at `/usr/bin/chromium`, available in this cloud image. On another machine, set `CHROMIUM_PATH` to a compatible installed Chromium executable. Playwright automatically starts Vite if needed. `npm run preview -- --port 4173 --strictPort` serves the production build.

## Code layout

- `src/algorithms.js`: pure simulation logic and date calculation
- `src/content.js`: lecture adaptations, proof blocks, original exercises, and study plan
- `src/Labs.jsx`: interactive SVG and stateful lab components
- `src/main.jsx`: navigation, lesson views, practice editor, and persistence
- `src/styles.css`: responsive styles and print layout
- `public/lectures/`: five supplied lecture PDFs (MST filename normalized for URL compatibility)
- `tests/`: algorithm and browser regression coverage

Future cloud tasks should use the existing checkout; each task already runs in an isolated environment. Do not create a Git worktree unless explicitly requested. Install dependencies separately from starting the server: live processes do not survive environment publication/restoration.

## GitHub Pages deployment

The deployment target is `https://aifrion.github.io/algo_study_grad/`.

```sh
npm run deploy
```

This builds the site and publishes only `dist/` to the remote `gh-pages` branch. It uses a temporary Git index, preserves the source checkout and staging area, and appends to deployment history without force pushing. Git push access to `origin` is required.

One-time hosting configuration: in the repository's **Settings → Pages**, select **Deploy from a branch**, choose **gh-pages**, select **/ (root)**, and save. This requires repository administration access. Pushing files is not proof that hosting has been enabled; verify the URL after GitHub finishes the Pages build. No domain purchase or secret is required for the default github.io address.
