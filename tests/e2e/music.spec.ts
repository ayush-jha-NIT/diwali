import { expect, test, type Page } from "@playwright/test";

function wavFixture() {
  const sampleRate = 8000;
  const samples = sampleRate * 2;
  const b = Buffer.alloc(44 + samples * 2);
  b.write("RIFF", 0); b.writeUInt32LE(b.length - 8, 4); b.write("WAVE", 8);
  b.write("fmt ", 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20);
  b.writeUInt16LE(1, 22); b.writeUInt32LE(sampleRate, 24);
  b.writeUInt32LE(sampleRate * 2, 28); b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34); b.write("data", 36);
  b.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++) b.writeInt16LE(Math.round(Math.sin(i * 440 * 2 * Math.PI / sampleRate) * 4000), 44 + i * 2);
  return b;
}

async function mockSong(page: Page) {
  const fixture = wavFixture();
  await page.route("**/audio/heeriye-flute-cover.mp3", async route =>
    route.fulfill({ status: 200, contentType: "audio/wav", body: fixture, headers: { "cache-control": "no-store" } }),
  );
}

async function invitation(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('[data-scene="invitation"]')).toBeVisible();
}

test("first visit defaults sound on and actually attempts autoplay", async ({ page }) => {
  await mockSong(page);
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      document.documentElement.dataset.autoplayAttempts = String(Number(document.documentElement.dataset.autoplayAttempts ?? "0") + 1);
      return original.apply(this, args);
    };
  });
  await invitation(page);
  await expect(page.locator(".experience")).toHaveAttribute("data-music-source", "heeriye");
  await expect(page.locator(".experience")).toHaveAttribute("data-music-state", /checking|tap|playing/);
  await expect(page.getByRole("button", { name: /Mute sounds|Start background music/ })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => Number(document.documentElement.dataset.autoplayAttempts ?? "0"))).toBeGreaterThan(0);
});

test("invitation click starts user supplied song; mute and unmute work", async ({ page }) => {
  await mockSong(page);
  await invitation(page);
  await page.getByRole("button", { name: "Discover your surprise" }).click();
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible();
  await expect(page.locator(".experience")).toHaveAttribute("data-music-source", "heeriye");
  await expect(page.locator(".experience")).toHaveAttribute("data-music-state", "playing", { timeout: 10000 });
  await page.getByRole("button", { name: "Diya 1 unlit" }).click();
  await expect(page.locator(".experience")).toHaveAttribute("data-music-state", "playing");
  await page.getByRole("button", { name: "Mute sounds" }).click();
  await expect(page.locator(".experience")).toHaveAttribute("data-music-state", "muted");
  await page.getByRole("button", { name: "Enable sounds" }).click();
  await expect(page.locator(".experience")).toHaveAttribute("data-music-state", "playing", { timeout: 10000 });
});

test("explicit mute before beginning is preserved", async ({ page }) => {
  await mockSong(page);
  await invitation(page);
  const blocked = page.getByRole("button", { name: "Start background music" });
  if (await blocked.isVisible()) await blocked.click();
  await page.getByRole("button", { name: "Mute sounds" }).click();
  await expect(page.locator(".experience")).toHaveAttribute("data-music-state", "muted");
  await page.getByRole("button", { name: "Discover your surprise" }).click();
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible();
  await expect(page.locator(".experience")).toHaveAttribute("data-music-state", "muted");
});

test("resumed chapters still begin with sound enabled", async ({ page }) => {
  await mockSong(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("the-last-spark:chapter:v1", "4"));
  await page.reload();
  await expect(page.locator('[data-scene="hidden-letter"]')).toBeVisible();
  await expect(page.locator(".experience")).toHaveAttribute("data-music-source", "heeriye");
  await expect(page.locator(".experience")).toHaveAttribute("data-music-state", /checking|tap|playing/);
  const blocked = page.getByRole("button", { name: "Start background music" });
  if (await blocked.isVisible()) await blocked.click();
  await expect(page.locator(".experience")).toHaveAttribute("data-music-state", "playing", { timeout: 10000 });
});

test("missing asset preserves original piano on user gesture", async ({ page }) => {
  await invitation(page);
  await expect(page.locator(".experience")).toHaveAttribute("data-music-source", "piano-fallback", { timeout: 10000 });
  await page.getByRole("button", { name: "Discover your surprise" }).click();
  await expect(page.locator('[data-scene="lost-diyas"]')).toBeVisible();
  await expect(page.locator(".experience")).toHaveAttribute("data-music-state", "playing", { timeout: 10000 });
});

test("music button remains reachable at 320, 390 and 1366 widths", async ({ page }) => {
  await mockSong(page);
  await invitation(page);
  for (const [width, height] of [[320, 640], [390, 844], [1366, 768]]) {
    await page.setViewportSize({ width, height });
    await expect(page.getByRole("button", { name: /Mute sounds|Start background music/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  }
});
