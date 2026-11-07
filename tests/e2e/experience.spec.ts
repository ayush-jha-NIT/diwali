import { expect, test, type Page } from "@playwright/test";

async function assertNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
}

async function begin(page: Page) {
  await expect(page.locator('[data-scene="invitation"]')).toBeVisible();
  await page.getByRole("button", { name: /Discover your surprise/i }).click();
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("all seven scenes work and KUHU appears in the finale", async ({ page }, testInfo) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await expect(page.locator(".invitation__title")).toBeVisible();
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-invitation.png" });
  await begin(page);
  await assertNoHorizontalOverflow(page);
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-lost-diyas.png" });

  for (const id of [1, 2, 3]) {
    await page.getByRole("button", { name: "Diya " + id + " unlit" }).click();
  }
  await expect(page.getByText("You found the light. Beautifully done.")).toBeVisible();
  await page.getByRole("button", { name: /Follow the glow/i }).click();
  await expect(page.locator('[data-scene="rangoli"]')).toBeVisible();
  await assertNoHorizontalOverflow(page);

  for (const id of [2, 4, 6, 8]) {
    await page.getByRole("button", { name: "Petal " + id + " missing" }).click();
  }
  await page.getByRole("button", { name: /Follow the petals/i }).click();
  await expect(page.locator('[data-scene="wishing-stars"]')).toBeVisible();
  await assertNoHorizontalOverflow(page);

  for (let i = 1; i <= 5; i++) {
    await page.getByRole("button", { name: "Star " + i, exact: true }).click();
  }
  await page.getByRole("button", { name: /Make a wish/i }).click();
  await expect(page.locator('[data-scene="hidden-letter"]')).toBeVisible();
  await page.getByRole("button", { name: /Open the letter/i }).click();
  await expect(page.getByText(/bina kisi light ke bhi din bright/i)).toBeVisible();
  await page.getByRole("button", { name: /There's one more thing/i }).click();
  await expect(page.locator('[data-scene="skyshot-launch"]')).toBeVisible();

  await page.getByRole("button", { name: /Swipe up or tap to launch/i }).click();
  await expect(page.locator('[data-scene="grand-finale"]')).toBeVisible({ timeout: 8_000 });
  await expect(page.getByRole("heading", { name: /Happy Diwali/i })).toBeVisible();
  await expect(page.locator(".finale__static-name")).toHaveText("KUHU");
  await assertNoHorizontalOverflow(page);
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-finale.png" });
  expect(browserErrors).toEqual([]);
});

test("chapter progress survives reload and replay resets the story", async ({ page }) => {
  await begin(page);
  await expect.poll(async () => page.evaluate(() => localStorage.getItem("the-last-spark:chapter:v1"))).toBe("1");

  await page.reload();
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible();
  await page.getByRole("button", { name: "Restart experience" }).click();
  await expect(page.locator('[data-scene="invitation"]')).toBeVisible();
  await expect(page.getByRole("button", { name: /Discover your surprise/i })).toBeEnabled();
});

test("sound starts enabled but can be muted", async ({ page }) => {
  const blocked = page.getByRole("button", { name: "Start background music" });
  if (await blocked.isVisible()) await blocked.click();
  await expect(page.getByRole("button", { name: "Mute sounds" })).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "Mute sounds" }).click();
  await expect(page.getByRole("button", { name: "Enable sounds" })).toBeVisible();
  await assertNoHorizontalOverflow(page);
});

test("motion-enabled chapter transition settles without blocking interaction", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: /Discover your surprise/i }).click();
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("button", { name: "Diya 1 unlit" })).toBeEnabled();
  await expect(page.locator(".scene-transition__veil")).toHaveCSS("visibility", "hidden", { timeout: 10_000 });
});
