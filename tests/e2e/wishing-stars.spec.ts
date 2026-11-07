import { expect, test, type Page } from "@playwright/test";

async function openStars(page: Page, motion: "reduce" | "no-preference" = "reduce") {
  await page.emulateMedia({ reducedMotion: motion });
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("the-last-spark:chapter:v1", "3"));
  await page.reload();
  await expect(page.locator('[data-scene="wishing-stars"]')).toBeVisible();
}

test("stars must be connected strictly in order and unlock gift", async ({ page }, testInfo) => {
  await openStars(page);
  await expect(page.getByRole("button", { name: "Make a wish" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Star 5", exact: true })).toBeDisabled();
  await expect(page.getByRole("status")).toHaveText("0 / 5 stars connected");
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-phase4-initial.png" });

  for (let index = 1; index <= 5; index++) {
    const star = page.getByRole("button", { name: "Star " + index, exact: true });
    await expect(star).toBeEnabled();
    await star.click();
    await expect(page.getByRole("status")).toContainText(index < 5 ? index + " / 5 stars" : "A wish is on its way.");
    await expect(page.getByRole("button", { name: "Star " + index + " connected" }))
      .toHaveAttribute("aria-pressed", "true");
    if (index < 5) await expect(page.getByRole("button", { name: "Make a wish" })).toBeDisabled();
  }

  await expect(page.locator(".wishing-v2__line-active--lit")).toHaveCount(4);
  await expect(page.locator(".wishing-v2__progress--lit")).toHaveCount(5);
  await expect(page.locator(".wishing-v2__gift")).toBeVisible();
  await expect(page.getByText("A LITTLE SOMETHING AWAITS")).toBeVisible();
  await expect(page.getByRole("button", { name: "Make a wish" })).toBeEnabled();
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-phase4-completed.png" });
  await page.getByRole("button", { name: "Make a wish" }).click();
  await expect(page.locator('[data-scene="hidden-letter"]')).toBeVisible();
});

test("stars are accessible by keyboard", async ({ page }) => {
  await openStars(page);
  const first = page.getByRole("button", { name: "Star 1", exact: true });
  await first.focus();
  await expect(first).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("1 / 5 stars connected");
  await expect(page.getByRole("button", { name: "Star 1 connected" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Star 2", exact: true })).toBeEnabled();
});

test("KUHU's finale reveal remains secret and starfield does not throw", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await openStars(page);
  await expect(page.locator(".wishing-v2__ambient-star")).toHaveCount(74);
  await expect(page.getByText("KUHU", { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("constellation targets remain visible at eight viewport sizes", async ({ page }, testInfo) => {
  await openStars(page);
  for (const [width, height] of [
    [320, 640], [360, 740], [390, 844], [430, 932],
    [768, 1024], [1024, 768], [1366, 768], [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    const measurements = await page.evaluate(() => {
      const worldRect = document.querySelector<HTMLElement>(".wishing-v2__world")!.getBoundingClientRect();
      return {
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        worldLeft: worldRect.left,
        worldRight: worldRect.right,
        stars: Array.from(document.querySelectorAll<HTMLElement>(".wishing-v2__star")).map((star) => {
          const rect = star.getBoundingClientRect();
          return { left: rect.left, right: rect.right, width: rect.width };
        }),
      };
    });
    expect(measurements.pageWidth, "overflow at " + width).toBeLessThanOrEqual(width + 1);
    expect(measurements.stars).toHaveLength(5);
    for (const star of measurements.stars) {
      expect(star.width).toBeGreaterThanOrEqual(54);
      expect(star.left).toBeGreaterThanOrEqual(measurements.worldLeft - 1);
      expect(star.right).toBeLessThanOrEqual(measurements.worldRight + 1);
    }
    if (width === 390 || width === 1366) {
      await page.screenshot({
        path: "test-results/" + testInfo.project.name + "-phase4-" + width + ".png",
        fullPage: true,
      });
    }
  }
});

test("motion-enabled constellation can be completed without unstable targets", async ({ page }) => {
  await openStars(page, "no-preference");
  await expect(page.locator(".wishing-v2__world")).toBeVisible();
  await page.getByRole("button", { name: "Star 1", exact: true }).click({ timeout: 10_000 });
  await page.getByRole("button", { name: "Star 2", exact: true }).click({ timeout: 10_000 });
  await expect(page.locator(".wishing-v2__line-active--lit")).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText("2 / 5 stars connected");
});
