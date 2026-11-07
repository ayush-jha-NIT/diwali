import { expect, test, type Page } from "@playwright/test";

async function openRangoli(page: Page, motion: "reduce" | "no-preference" = "reduce") {
  await page.emulateMedia({ reducedMotion: motion });
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("the-last-spark:chapter:v1", "2"));
  await page.reload();
  await expect(page.locator('[data-scene="rangoli"]')).toBeVisible();
}

test("four unique petals unlock the lotus and next chapter", async ({ page }, testInfo) => {
  await openRangoli(page);
  await expect(page.getByRole("button", { name: "Follow the petals" })).toBeDisabled();
  await expect(page.getByRole("status")).toHaveText("0 / 4 missing petals found");
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-phase3-initial.png" });

  for (const [position, index] of [2, 4, 6, 8].entries()) {
    await page.getByRole("button", { name: "Petal " + index + " missing" }).click();
    if (position < 3) {
      await expect(page.getByRole("status")).toContainText((position + 1) + " / 4");
      await expect(page.getByRole("button", { name: "Follow the petals" })).toBeDisabled();
    }
  }
  await expect(page.getByRole("status")).toHaveText("Perfect. Some things are meant to fit together.");
  await expect(page.locator(".rangoli-v2__lotus")).toBeVisible();
  await expect(page.getByText("BLOOMING WITH MAGIC")).toBeVisible();
  await expect(page.locator(".rangoli-v2__progress--filled")).toHaveCount(4);
  await expect(page.getByRole("button", { name: "Petal 2 complete" })).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-phase3-complete.png" });
  await page.getByRole("button", { name: "Follow the petals" }).click();
  await expect(page.locator('[data-scene="wishing-stars"]')).toBeVisible();
});

test("a missing petal can be placed using keyboard controls", async ({ page }) => {
  await openRangoli(page);
  const petal = page.getByRole("button", { name: "Petal 8 missing" });
  await petal.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("1 / 4 missing petals found");
  await expect(page.getByRole("button", { name: "Petal 8 complete" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Drag petal 8 to its matching slot" })).toBeDisabled();
});

test("dragging from tray to matching slot actually places a petal", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Mouse drag gesture tested on desktop; tap alternative tested on both.");
  await openRangoli(page);
  const source = page.getByRole("button", { name: "Drag petal 2 to its matching slot" });
  const target = page.locator('[data-slot-index="1"]');
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  expect(from).not.toBeNull();
  expect(to).not.toBeNull();
  await page.mouse.move(from!.x + from!.width / 2, from!.y + from!.height / 2);
  await page.mouse.down();
  await page.mouse.move(to!.x + to!.width / 2, to!.y + to!.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(page.getByRole("button", { name: "Petal 2 complete" })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("1 / 4 missing petals found");
  await expect(source).toBeDisabled();
});

test("Rangoli fits eight mobile and desktop viewport sizes", async ({ page }, testInfo) => {
  await openRangoli(page);
  for (const [width, height] of [
    [320, 640], [360, 740], [390, 844], [430, 932],
    [768, 1024], [1024, 768], [1366, 768], [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    const measures = await page.evaluate(() => {
      const scene = document.querySelector<HTMLElement>(".rangoli-v2__world")!;
      const world = scene.getBoundingClientRect();
      const petals = Array.from(document.querySelectorAll<HTMLElement>(".rangoli-v2__slot"));
      return {
        documentWidth: document.documentElement.scrollWidth,
        screenWidth: window.innerWidth,
        worldLeft: world.left,
        worldRight: world.right,
        targets: petals.map((petal) => {
          const r = petal.getBoundingClientRect();
          return { left: r.left, right: r.right, width: r.width, top: r.top, bottom: r.bottom };
        }),
      };
    });
    expect(measures.documentWidth, "horizontal overflow at " + width).toBeLessThanOrEqual(width + 1);
    expect(measures.worldLeft).toBeGreaterThanOrEqual(-1);
    expect(measures.worldRight).toBeLessThanOrEqual(width + 1);
    expect(measures.targets).toHaveLength(8);
    for (const target of measures.targets) {
      expect(target.width).toBeGreaterThanOrEqual(38);
      expect(target.left).toBeGreaterThanOrEqual(measures.worldLeft - 1);
      expect(target.right).toBeLessThanOrEqual(measures.worldRight + 1);
    }
    if (width === 390 || width === 1366) {
      await page.screenshot({
        path: "test-results/" + testInfo.project.name + "-phase3-" + width + ".png",
        fullPage: true,
      });
    }
  }
});

test("animated Rangoli entrance still permits normal click interactions", async ({ page }) => {
  await openRangoli(page, "no-preference");
  await expect(page.locator(".rangoli-v2__board")).toBeVisible();
  await expect(page.locator(".rangoli-v2__slot--empty")).toHaveCount(4);
  await page.getByRole("button", { name: "Petal 2 missing" }).click({ timeout: 10_000 });
  await expect(page.getByRole("status")).toHaveText("1 / 4 missing petals found");
  await expect(page.locator(".rangoli-v2__drag-ghost")).toHaveCount(0);
});
