import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// Publish only dist/; preserve source checkout, index, and deployment history.
const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
if (!existsSync(join(dist, "index.html")))
  throw new Error("Run npm run build first.");
const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const remote = git("ls-remote", "origin", "refs/heads/gh-pages");
let parent;
if (remote) {
  git("fetch", "origin", "refs/heads/gh-pages");
  parent = git("rev-parse", "FETCH_HEAD");
}
const temp = mkdtempSync(join(tmpdir(), "algorithm-studio-deploy-"));
try {
  const env = { ...process.env, GIT_INDEX_FILE: join(temp, "index") };
  const indexGit = (...args) =>
    execFileSync("git", ["--work-tree=" + dist, ...args], {
      cwd: root,
      env,
      encoding: "utf8",
    }).trim();
  writeFileSync(join(dist, ".nojekyll"), "");
  indexGit("read-tree", "--empty");
  indexGit("add", "--all", "--", dist);
  const tree = indexGit("write-tree");
  const commit = git(
    "commit-tree",
    tree,
    ...(parent ? ["-p", parent] : []),
    "-m",
    "Deploy Algorithm Studio",
  );
  execFileSync("git", ["push", "origin", `${commit}:refs/heads/gh-pages`], {
    cwd: root,
    stdio: "inherit",
  });
  console.log(
    "Production files pushed to gh-pages. GitHub Pages must publish that branch from / (root).",
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}
