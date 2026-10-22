import { test, expect } from "@playwright/test";

test("Dijkstra predictions, all frames, edge cases, and persistent progress", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#learn/dijkstra");
  await page
    .getByRole("button", { name: "Predict vertex A", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Choose the smallest");
  await page
    .getByRole("button", { name: "Predict vertex S", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Correct");
  const next = page.getByRole("button", { name: "Next step", exact: true });
  for (let i = 0; i < 6; i++) await next.click();
  await expect(next).toBeDisabled();
  await expect(
    page.getByText("All reachable vertices are finalized."),
  ).toBeVisible();
  await expect(page.locator(".distance-table tr").last()).toContainText("9");
  await page.reload();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("as-progress-v1")).dijkstra.lab,
    ),
  ).toBe(true);
  await page.getByLabel("Graph example").selectOption("unreachable");
  for (let i = 0; i < 5; i++) await next.click();
  await expect(next).toBeDisabled();
  await expect(
    page.getByText("T remains at ∞: no path from S reaches it."),
  ).toBeVisible();
  await page.getByLabel("Graph example").selectOption("zero");
  for (let i = 0; i < 6; i++) await next.click();
  await expect(page.locator(".distance-table tr").last()).toContainText("8");
  expect(errors).toEqual([]);
});
test("Proof ordering and quiz award checkpoints only for correct answers", async ({
  page,
}) => {
  await page.goto("/#learn/dijkstra");
  await page.getByRole("tab", { name: "Prove", exact: true }).click();
  await page.getByRole("button", { name: "Check proof order" }).click();
  await expect(page.getByRole("status")).toContainText("Not quite");
  for (let i = 4; i >= 2; i--)
    await page
      .getByRole("button", { name: `Move step ${i} up`, exact: true })
      .click();
  for (let i = 5; i >= 3; i--)
    await page
      .getByRole("button", { name: `Move step ${i} up`, exact: true })
      .click();
  await page.getByRole("button", { name: "Check proof order" }).click();
  await expect(page.getByRole("status")).toContainText("Correct");
  await page.getByRole("tab", { name: "Check understanding" }).click();
  await page.getByRole("button", { name: /A Because each/ }).click();
  await page.getByRole("button", { name: "Check my reasoning" }).click();
  await expect(page.getByRole("status")).toContainText("revisit");
  await page.getByRole("button", { name: /B Because the minimum/ }).click();
  await page.getByRole("button", { name: "Check my reasoning" }).click();
  await expect(page.getByRole("status")).toContainText("That’s right");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("as-progress-v1")),
  );
  expect(saved.dijkstra.proof).toBe(true);
  expect(saved.dijkstra.quiz).toBe(true);
});
test("Reduction threshold and greedy strategy produce meaningful changes", async ({
  page,
}) => {
  await page.goto("/#learn/reductions");
  await page.getByRole("button", { name: "Yes, reachable" }).click();
  await expect(page.getByRole("status")).toContainText("Correct");
  await page.getByRole("slider").fill("7");
  await page.getByRole("button", { name: "No route" }).click();
  await expect(page.getByRole("status")).toContainText("unreachable");
  await page.goto("/#learn/greedy");
  const next = page.getByRole("button", { name: "Next step" });
  for (let i = 0; i < 7; i++) await next.click();
  await expect(page.getByText("4 intervals selected")).toBeVisible();
  await page.getByLabel("Greedy rule").selectOption("start");
  for (let i = 0; i < 7; i++) await next.click();
  await expect(page.getByText("3 intervals selected")).toBeVisible();
});
test("Kruskal and amortized labs support predictions, cost spikes, and repeat Find", async ({
  page,
}) => {
  await page.goto("/#learn/mst");
  await page.getByRole("button", { name: "Reject edge", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Try again");
  await page.getByRole("button", { name: "Accept edge", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Correct");
  for (let i = 0; i < 9; i++)
    await page.getByRole("button", { name: "Next step" }).click();
  await expect(
    page.getByText("Minimum spanning tree complete", { exact: false }),
  ).toBeVisible();
  await page.goto("/#learn/amortized");
  await page.getByRole("button", { name: "Jump to $99" }).click();
  await page.getByRole("button", { name: "Deposit $1" }).click();
  await expect(page.locator(".math-note")).toContainText("3 actual");
  await expect(page.locator(".register-total")).toContainText("$100");
  await page
    .getByRole("button", { name: "Path compression", exact: true })
    .click();
  await page.getByRole("button", { name: "Find H", exact: true }).click();
  await expect(
    page.getByText("Find(H): 3 parent edges traversed"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Find H", exact: true }).click();
  await expect(
    page.getByText("Find(H): 1 parent edges traversed"),
  ).toBeVisible();
});
test("Practice persists separate answers, timer, rubric, and exports a readable file", async ({
  page,
}) => {
  await page.goto("/#practice");
  const boxes = page.getByRole("textbox");
  await boxes.nth(0).fill("My algorithm draft");
  await boxes.nth(1).fill("My inductive correctness argument");
  await boxes.nth(2).fill("O((n + m) log n)");
  await page.getByRole("button", { name: "Start timer" }).click();
  await expect(page.getByLabel("Time remaining")).not.toHaveText("20:00", {
    timeout: 3000,
  });
  await page.getByRole("button", { name: "Pause timer" }).click();
  await page.reload();
  await expect(boxes.nth(1)).toHaveValue("My inductive correctness argument");
  await page.getByRole("button", { name: "Review my answer" }).click();
  await expect(
    page.getByText("SELF-ASSESSMENT · NOT AUTOMATED GRADING"),
  ).toBeVisible();
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Reveal reference outline" }).click();
  await expect(page.locator(".reference-outline")).toContainText(
    "Counterexample",
  );
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export", exact: true }).click();
  expect((await dl).suggestedFilename()).toBe("algorithm-studio-p1.txt");
  await page.getByRole("button", { name: /Routes that stay/ }).click();
  await expect(boxes.nth(0)).toHaveValue("");
  await boxes.nth(0).fill("A different solution");
  await page.getByRole("button", { name: /A shortest-path proof/ }).click();
  await expect(boxes.nth(0)).toHaveValue("My algorithm draft");
});
test("All lecture files are valid PDFs, search filters, and plan progress persists", async ({
  page,
  request,
}) => {
  await page.goto("/#library");
  const links = await page
    .getByRole("link", { name: "Open PDF" })
    .evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  expect(links).toHaveLength(5);
  for (const link of links) {
    const r = await request.get(link.split("#")[0]);
    expect(r.status()).toBe(200);
    expect((await r.body()).subarray(0, 5).toString()).toBe("%PDF-");
  }
  await page.getByLabel("Search lectures").fill("greedy");
  await expect(page.locator(".library-card")).toHaveCount(1);
  await page.getByLabel("Search lectures").fill("nonexistent");
  await expect(
    page.getByText("No lectures match", { exact: false }),
  ).toBeVisible();
  await page.goto("/#plan");
  await page
    .getByRole("button", {
      name: "Mark Build the foundations complete",
      exact: true,
    })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: "Mark Build the foundations incomplete",
      exact: true,
    }),
  ).toBeVisible();
});
test("Every page works at mobile width without horizontal overflow or console errors", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "overview",
    "learn/dijkstra",
    "learn/reductions",
    "learn/greedy",
    "learn/mst",
    "learn/amortized",
    "proofs",
    "practice",
    "plan",
    "library",
  ]) {
    await page.goto("/#" + route);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
  }
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Practice room" }).click();
  await expect(page.locator("h1")).toContainText("Turn understanding");
  expect(errors).toEqual([]);
});
