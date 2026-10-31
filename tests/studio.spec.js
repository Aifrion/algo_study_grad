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
test("Paper-first practice hides solutions, exports prompts, and preserves old drafts", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#practice");
  await page.evaluate(() => localStorage.setItem("as-draft-p1", JSON.stringify({algorithm:"Previous saved reasoning", proof:"", runtime:""})));
  await page.reload();
  await expect(page.locator("textarea")).toHaveCount(0);
  await page.getByRole("button", {name:"Copy prompt for chat"}).click();
  await expect(page.getByRole("status")).toContainText("Prompt copied");
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain("Algorithm Studio exercise p1");
  await expect(page.locator(".reference-outline")).not.toBeVisible();
  await page.getByText("Show a small hint", {exact:true}).click();
  await expect(page.getByText("Separate discovery", {exact:false})).toBeVisible();
  await page.getByText("Your previously saved draft", {exact:true}).click();
  await expect(page.getByText("Previous saved reasoning", {exact:true})).toBeVisible();
  await page.getByText("Reveal reference outline after attempting", {exact:true}).click();
  await expect(page.locator(".reference-outline")).toContainText("Counterexample");
  const dl = page.waitForEvent("download");
  await page.getByRole("button", {name:"Download prompt",exact:true}).click();
  expect((await dl).suggestedFilename()).toBe("algorithm-studio-p1.txt");
  await page.getByRole("combobox").selectOption("approximation");
  await expect(page.getByRole("heading", {name:"Find the critical job",exact:true})).toBeVisible();
  await expect(page.locator(".reference-outline")).not.toBeVisible();
});
test("Exam notes develop arguments and interactive comparisons update correctly", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#exam/greedy");
  await page.screenshot({path:"/tmp/algorithm-exam-desktop.png"});
  await expect(page.getByRole("heading",{name:"Develop a greedy proof",exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Reveal cost comparison"}).click();
  await expect(page.getByRole("status")).toContainText("B first is better");
  await page.getByLabel("Weight of A").fill("8");
  await expect(page.getByRole("status")).toHaveCount(0);
  await page.getByRole("button",{name:"Reveal cost comparison"}).click();
  await expect(page.getByRole("status")).toContainText("A first is better");
  await page.getByLabel("Weight of A").fill("2");
  await page.getByRole("button",{name:"Reveal cost comparison"}).click();
  await expect(page.getByRole("status")).toContainText("Both orders tie");
  const check=page.locator(".recall-check").first();
  await expect(check.getByText("It chooses",{exact:false})).not.toBeVisible();
  await check.getByText("Reveal explanation",{exact:true}).click();
  await expect(check.getByText("It chooses",{exact:false})).toBeVisible();
  await page.goto("/#exam/approximation");
  for(let i=0;i<5;i++) await page.getByRole("button",{name:"Assign next job"}).click();
  await expect(page.getByRole("status")).toContainText("Greedy makespan = 7");
  await expect(page.getByRole("button",{name:"Assign next job"})).toBeDisabled();
  await page.getByRole("button",{name:"Reset jobs"}).click();
  await expect(page.getByRole("status")).toHaveCount(0);
});
test("All lecture files are valid PDFs, search filters, and plan progress persists", async ({
  page,
  request,
}) => {
  await page.goto("/#library");
  const links = await page
    .getByRole("link", { name: "Open PDF" })
    .evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  expect(links).toHaveLength(7);
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
    "exam/start",
    "exam/greedy",
    "exam/reductions",
    "exam/dijkstra",
    "exam/order",
    "exam/mst",
    "exam/amortized",
    "exam/approximation",
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
    if(route === "exam/greedy") await page.screenshot({path:"/tmp/algorithm-exam-mobile.png"});
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
  }
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Practice room" }).click();
  await expect(page.locator("h1")).toContainText("Turn understanding");
  expect(errors).toEqual([]);
});
