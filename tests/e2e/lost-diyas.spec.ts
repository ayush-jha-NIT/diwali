import { expect, test, type Page } from "@playwright/test";

async function openGarden(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Discover your surprise" }).click();
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible();
}

test("only three distinct diyas unlock the garden and golden key", async ({ page }, testInfo) => {
  await openGarden(page);
  const continueButton = page.getByRole("button", { name: "Follow the glow" });
  await expect(continueButton).toBeDisabled();
  await expect(page.getByText("0 / 3 diyas lit")).toBeVisible();

  await page.getByRole("button", { name: "Diya 2 unlit" }).click();
  await expect(page.getByRole("button", { name: "Diya 2 lit" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("1 / 3 diyas lit")).toBeVisible();
  await expect(continueButton).toBeDisabled();

  await page.getByRole("button", { name: "Diya 4 unlit" }).click();
  await expect(page.getByText("2 / 3 diyas lit")).toBeVisible();
  await page.getByRole("button", { name: "Diya 5 unlit" }).click();

  await expect(page.getByText("You found the light. Beautifully done.")).toBeVisible();
  await expect(page.locator(".diya-garden__progress-pip--lit")).toHaveCount(3);
  await expect(page.locator(".diya-garden__butterfly")).toHaveCount(3);
  await expect(page.locator(".diya-garden__relic")).toBeVisible();
  await expect(page.getByText("THE GATE IS OPEN")).toBeVisible();
  await expect(continueButton).toBeEnabled();

  await expect(page.getByRole("button", { name: "Diya 1 unlit" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Diya 3 unlit" })).toBeDisabled();
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-phase2-completed.png" });

  await continueButton.click();
  await expect(page.locator('[data-scene="rangoli"]')).toBeVisible();
});

test("lighting a diya responds to keyboard and provides live status", async ({ page }) => {
  await openGarden(page);
  const diya = page.getByRole("button", { name: "Diya 1 unlit" });
  await diya.focus();
  await expect(diya).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByText("1 / 3 diyas lit")).toBeVisible();
  await expect(page.getByRole("status")).toContainText("1 / 3 diyas lit");
  await expect(page.getByRole("button", { name: "Diya 1 lit" })).toBeDisabled();
});

test("garden retains KUHU surprise and produces no page errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await openGarden(page);
  await expect(page.locator(".diya-garden__moon-glow")).toBeVisible();
  await expect(page.locator(".diya-garden__backdrop")).toBeVisible();
  await expect(page.getByText("KUHU", { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("diya garden stays inside viewport and all five lamps are reachable", async ({ page }, testInfo) => {
  await openGarden(page);
  for (const [width, height] of [
    [320, 640],
    [360, 740],
    [390, 844],
    [430, 932],
    [768, 1024],
    [1024, 768],
    [1366, 768],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    const measurements = await page.evaluate(() => {
      const world = document.querySelector<HTMLElement>(".diya-garden__world");
      const lamps = [...document.querySelectorAll<HTMLButtonElement>(".diya-garden__lamp")];
      const rect = world?.getBoundingClientRect();
      return {
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        worldLeft: rect?.left ?? -1,
        worldRight: rect?.right ?? -1,
        worldWidth: rect?.width ?? 0,
        lamps: lamps.map(lamp => {
          const box = lamp.getBoundingClientRect();
          return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width };
        }),
      };
    });
    expect(measurements.pageWidth, "Page overflow at " + width).toBeLessThanOrEqual(width + 1);
    expect(measurements.worldLeft).toBeGreaterThanOrEqual(-1);
    expect(measurements.worldRight).toBeLessThanOrEqual(width + 1);
    expect(measurements.lamps).toHaveLength(5);
    for (const lamp of measurements.lamps) {
      expect(lamp.width).toBeGreaterThanOrEqual(88);
      expect(lamp.left).toBeGreaterThanOrEqual(measurements.worldLeft - 1);
      expect(lamp.right).toBeLessThanOrEqual(measurements.worldRight + 1);
    }
    if (width === 390 || width === 1366) {
      await page.screenshot({
        path: "test-results/" + testInfo.project.name + "-phase2-garden-" + width + ".png",
        fullPage: true,
      });
    }
  }
});

test("motion-enabled garden entrance and first lamp reveal both finish", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Discover your surprise" }).click();
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".diya-garden__world")).toBeVisible();

  await expect(page.locator(".diya-garden__lamp-figure").first()).toHaveCSS("opacity", "1", { timeout: 10_000 });
  await page.getByRole("button", { name: "Diya 1 unlit" }).click();
  await expect(page.locator(".diya-garden__lamp--lit")).toHaveCount(1);
  await expect(page.locator(".diya-garden__butterfly")).toHaveCount(1);
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-phase2-lit.png" });
});
