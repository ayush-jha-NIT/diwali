import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("invitation is personal but keeps KUHU's name secret", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('[data-scene="invitation"]')).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Someone left a little magic for you tonight.",
  );
  await expect(page.getByText(/kuch raatein sirf roshni/i)).toBeVisible();
  await expect(page.getByText("KUHU", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Discover your surprise" })).toBeEnabled();
});

test("cinematic entrance settles and the CTA advances to the first puzzle", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  const title = page.locator(".invitation__title");
  await expect(title).toBeVisible();
  await expect(page.locator(".invitation-art__diya")).toBeVisible();

  await page.waitForTimeout(3500);
  await expect(page.locator(".invitation__title-line").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".invitation-art__mandala")).toBeVisible();
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-phase1-cinematic.png" });

  await page.getByRole("button", { name: "Discover your surprise" }).click();
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible({ timeout: 10_000 });
  expect(errors).toEqual([]);
});

test("invitation can be traversed by keyboard without animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const button = page.getByRole("button", { name: "Discover your surprise" });
  await button.focus();
  await expect(button).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible();
});

test("responsive layout has no horizontal clipping and invitation button remains reachable", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const [width, height] of [
    [320, 640],
    [375, 667],
    [390, 844],
    [768, 1024],
    [1024, 768],
    [1366, 768],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    const measurements = await page.evaluate(() => {
      const doc = document.documentElement;
      const button = document.querySelector<HTMLButtonElement>(".invitation__button");
      const title = document.querySelector<HTMLElement>(".invitation__title");
      const btnRect = button?.getBoundingClientRect();
      const titleRect = title?.getBoundingClientRect();
      return {
        scrollWidth: doc.scrollWidth,
        viewportWidth: window.innerWidth,
        buttonWidth: btnRect?.width ?? 0,
        buttonX: btnRect?.left ?? -1,
        titleWidth: titleRect?.width ?? 0,
      };
    });
    expect(measurements.scrollWidth, "overflow at " + width).toBeLessThanOrEqual(width + 1);
    expect(measurements.buttonWidth).toBeGreaterThan(180);
    expect(measurements.buttonX).toBeGreaterThanOrEqual(-1);
    expect(measurements.buttonX + measurements.buttonWidth).toBeLessThanOrEqual(width + 1);
    expect(measurements.titleWidth).toBeGreaterThan(100);

    if (width === 390 || width === 1366) {
      await page.screenshot({
        path: "test-results/" + testInfo.project.name + "-phase1-" + width + ".png",
        fullPage: true,
      });
    }
  }
});
