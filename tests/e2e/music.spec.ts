import { expect, test, type Page } from "@playwright/test";

async function freshInvitation(page: Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('[data-scene="invitation"]')).toBeVisible();
}

test("opening invitation creates a real, original Web Audio piano score", async ({ page }) => {
  // Verify generated oscillators, rather than merely trusting the button label.
  await page.addInitScript(() => {
    const BaseAudioContext = window.AudioContext;
    if (!BaseAudioContext) return;
    class TrackedAudioContext extends BaseAudioContext {
      createOscillator(): OscillatorNode {
        const result = super.createOscillator();
        document.documentElement.dataset.generatedNotes = String(
          Number(document.documentElement.dataset.generatedNotes ?? "0") + 1,
        );
        return result;
      }
    }
    window.AudioContext = TrackedAudioContext;
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await freshInvitation(page);
  await expect(page.locator('[data-music-state="muted"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "Enable sounds" })).toBeVisible();
  expect(await page.evaluate(() => Number(document.documentElement.dataset.generatedNotes ?? "0"))).toBe(0);

  await page.getByRole("button", { name: "Discover your surprise" }).click();
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible();
  await expect(page.locator('[data-music-state="playing"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "Mute sounds" })).toBeVisible();
  await expect.poll(async () => page.evaluate(
    () => Number(document.documentElement.dataset.generatedNotes ?? "0"),
  )).toBeGreaterThan(80);

  await page.getByRole("button", { name: "Diya 1 unlit" }).click();
  await expect(page.locator('[data-music-state="playing"]')).toBeVisible();
  await page.getByRole("button", { name: "Mute sounds" }).click();
  await expect(page.locator('[data-music-state="muted"]')).toBeVisible();
  await page.getByRole("button", { name: "Enable sounds" }).click();
  await expect(page.locator('[data-music-state="playing"]')).toBeVisible();
});

test("explicit mute before beginning is respected", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await freshInvitation(page);
  await page.getByRole("button", { name: "Enable sounds" }).click();
  await expect(page.locator('[data-music-state="playing"]')).toBeVisible();
  await page.getByRole("button", { name: "Mute sounds" }).click();
  await page.getByRole("button", { name: "Discover your surprise" }).click();
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible();
  await expect(page.locator('[data-music-state="muted"]')).toBeVisible();
});

test("resuming an existing chapter never triggers autoplay", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("the-last-spark:chapter:v1", "4"));
  await page.reload();
  await expect(page.locator('[data-scene="hidden-letter"]')).toBeVisible();
  await expect(page.locator('[data-music-state="muted"]')).toBeVisible();
  await page.getByRole("button", { name: "Enable sounds" }).click();
  await expect(page.locator('[data-music-state="playing"]')).toBeVisible();
  await page.getByRole("button", { name: "Mute sounds" }).click();
  await expect(page.locator('[data-music-state="muted"]')).toBeVisible();
});

test("music status and controls have no horizontal overflow on phones", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await freshInvitation(page);
  for (const [width, height] of [[320, 640], [390, 844], [1366, 768]]) {
    await page.setViewportSize({ width, height });
    await expect(page.getByRole("button", { name: "Enable sounds" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(width + 1);
  }
});
