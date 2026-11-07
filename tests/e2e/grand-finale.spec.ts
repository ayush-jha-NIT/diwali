import { expect, test, type Page } from "@playwright/test";

async function openFinale(page: Page, motion: "reduce" | "no-preference") {
  await page.emulateMedia({ reducedMotion: motion });
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("the-last-spark:chapter:v1", "6"));
  await page.reload();
  await expect(page.locator('[data-scene="grand-finale"]')).toBeVisible();
}

test("KUHU remains legible without motion and replay starts clean", async ({ page }, testInfo) => {
  await openFinale(page, "reduce");
  await expect(page.getByRole("heading", { name: "Happy Diwali," })).toBeVisible();
  await expect(page.locator(".finale__static-name")).toHaveText("KUHU");
  await expect(page.locator(".finale-v2__canvas")).toHaveCount(0);
  await expect(page.getByText(/lights bhi thodi jealous hongi/i)).toBeVisible();
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-phase7-reduced.png", fullPage: true });
  await page.getByRole("button", { name: "Replay the magic" }).click();
  await expect(page.locator('[data-scene="invitation"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "Discover your surprise" })).toBeEnabled();
  expect(await page.evaluate(() => localStorage.getItem("the-last-spark:chapter:v1"))).toBeNull();
});

test("all four letters are composed of visible particles, not overlay text", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await openFinale(page, "no-preference");
  const canvas = page.locator("canvas.finale-v2__canvas");
  await expect(canvas).toBeVisible();
  await expect(page.locator(".finale-v2__static-name")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "KUHU" })).toBeAttached();

  await expect.poll(async () => Number(await canvas.getAttribute("data-particle-count"))).toBeGreaterThan(680);
  await expect(canvas).toHaveAttribute("data-reveal-state", "complete", { timeout: 12_000 });
  const result = await canvas.evaluate(element => {
    const cnv = element as HTMLCanvasElement;
    const ctx = cnv.getContext("2d");
    if (!ctx) return { pixels: 0, dprWidth: 0 };
    const bounds = cnv.getBoundingClientRect();
    const slot = document.querySelector<HTMLElement>(".finale-v2__name-slot")!.getBoundingClientRect();
    const sx = cnv.width / bounds.width;
    const sy = cnv.height / bounds.height;
    const x = Math.max(0, Math.floor((slot.left - bounds.left) * sx));
    const y = Math.max(0, Math.floor((slot.top - bounds.top) * sy));
    const w = Math.max(1, Math.min(cnv.width - x, Math.floor(slot.width * sx)));
    const h = Math.max(1, Math.min(cnv.height - y, Math.floor(slot.height * sy)));
    const rgba = ctx.getImageData(x, y, w, h).data;
    let pixels = 0;
    for (let i = 3; i < rgba.length; i += 4) if (rgba[i] > 45) pixels++;
    return { pixels, dprWidth: cnv.width };
  });
  expect(result.dprWidth).toBeGreaterThan(300);
  expect(result.pixels).toBeGreaterThan(300);
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-phase7-particle-KUHU.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("finale stays readable with responsive particle budgets and replay", async ({ page }, testInfo) => {
  await openFinale(page, "no-preference");
  for (const [width, height] of [
    [320, 640], [360, 740], [390, 844], [430, 932],
    [768, 1024], [1024, 768], [1366, 768], [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    const m = await page.evaluate(() => {
      const scene = document.querySelector<HTMLElement>(".finale--phase7")!.getBoundingClientRect();
      const button = document.querySelector<HTMLElement>(".finale-v2__replay")!.getBoundingClientRect();
      const canvas = document.querySelector<HTMLCanvasElement>(".finale-v2__canvas")!;
      return {
        scrollWidth: document.documentElement.scrollWidth,
        width: window.innerWidth,
        sceneLeft: scene.left, sceneRight: scene.right,
        buttonLeft: button.left, buttonRight: button.right,
        canvasPixels: canvas.width * canvas.height,
        particles: Number(canvas.dataset.particleCount),
      };
    });
    expect(m.scrollWidth, "page overflow at " + width).toBeLessThanOrEqual(width + 1);
    expect(m.sceneLeft).toBeGreaterThanOrEqual(-1);
    expect(m.sceneRight).toBeLessThanOrEqual(width + 1);
    expect(m.buttonLeft).toBeGreaterThanOrEqual(-1);
    expect(m.buttonRight).toBeLessThanOrEqual(width + 1);
    expect(m.canvasPixels).toBeLessThanOrEqual(width * height * 4 + 10000);
    expect(m.particles).toBeGreaterThanOrEqual(600);
    if (width === 390 || width === 1366) {
      await expect(page.locator(".finale-v2__canvas")).toHaveAttribute("data-reveal-state", "complete", { timeout: 12000 });
      await page.screenshot({
        path: "test-results/" + testInfo.project.name + "-phase7-" + width + ".png", fullPage: true,
      });
    }
  }
});

test("link preview is generic, noindexed, and returns a valid PNG", async ({ page }) => {
  await page.goto("/");
  expect(await page.title()).toContain("The Last Spark");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "The Last Spark");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  const response = await page.request.get("/opengraph-image");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("image/png");
  const bytes = await response.body();
  expect(bytes.length).toBeGreaterThan(15000);
  expect(Array.from(bytes.subarray(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
});

test("fresh visitor starts at secret invitation without name leak", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('[data-scene="invitation"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "Discover your surprise" })).toBeEnabled();
  await expect(page.getByText("KUHU", { exact: true })).toHaveCount(0);
});
