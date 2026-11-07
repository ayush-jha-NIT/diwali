import { expect, test, type Page } from "@playwright/test";

async function openLetter(page: Page, motion: "reduce" | "no-preference" = "reduce") {
  await page.emulateMedia({ reducedMotion: motion });
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("the-last-spark:chapter:v1", "4"));
  await page.reload();
  await expect(page.locator('[data-scene="hidden-letter"]')).toBeVisible();
}

test("wax-sealed letter reveals the full message and advances once opened", async ({ page }, testInfo) => {
  await openLetter(page);
  await expect(page.getByRole("button", { name: "Open the letter" })).toBeEnabled();
  await expect(page.getByRole("button", { name: /There's one more thing/i })).toHaveCount(0);
  await expect(page.locator(".letter-v2__envelope-flap")).toBeVisible();
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-phase5-sealed.png", fullPage: true });
  await page.getByRole("button", { name: "Open the letter" }).click();
  const note = page.getByRole("region", { name: "Your personal Diwali letter from Ayush" });
  await expect(note).toBeVisible();
  await expect(note).toBeFocused();
  await expect(note.getByText(/bina kisi light ke bhi din bright/i)).toBeVisible();
  await expect(note.getByText(/tumhari smile kabhi kam na ho/i)).toBeVisible();
  await expect(note.getByText("Ayush", { exact: true })).toBeVisible();
  await expect(page.getByText("KUHU", { exact: true })).toHaveCount(0);
  await page.screenshot({ path: "test-results/" + testInfo.project.name + "-phase5-open.png", fullPage: true });
  await page.getByRole("button", { name: /There's one more thing/i }).click();
  await expect(page.locator('[data-scene="skyshot-launch"]')).toBeVisible();
});

test("letter seal opens with keyboard and announces the note", async ({ page }) => {
  await openLetter(page);
  const open = page.getByRole("button", { name: "Open the letter" });
  await open.focus();
  await expect(open).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Your personal Diwali letter from Ayush" })).toBeVisible();
  await expect(page.locator(".letter-v2__paper-top")).toContainText("A LITTLE NOTE FROM THE HEART");
});

test("opening animation cannot be triggered a second time", async ({ page }) => {
  await openLetter(page, "no-preference");
  const open = page.getByRole("button", { name: "Open the letter" });
  await expect(open).toBeVisible();
  await open.click({ timeout: 10000 });
  await expect(open).toHaveAttribute("aria-disabled", "true");
  await expect(page.getByRole("status")).toHaveText("Unsealing a little bit of magic...");
  await open.click({ force: true });
  await expect(page.locator(".letter-v2__paper")).toBeVisible({ timeout: 5000 });
  await expect(page.locator(".letter-v2__envelope")).toHaveCount(0);
});

test("letter stages have no horizontal overflow across eight viewports", async ({ page }, testInfo) => {
  await openLetter(page);
  for (const [width,height] of [
    [320,640],[360,740],[390,844],[430,932],[768,1024],[1024,768],[1366,768],[1920,1080],
  ]) {
    await page.setViewportSize({width,height});
    await expect(page.locator(".letter-v2__envelope")).toBeVisible();
    const dims = await page.evaluate(() => {
      const button = document.querySelector<HTMLElement>(".letter-v2__envelope")!.getBoundingClientRect();
      return { scroll: document.documentElement.scrollWidth, width:window.innerWidth, left:button.left,right:button.right };
    });
    expect(dims.scroll, "horizontal overflow at "+width).toBeLessThanOrEqual(width+1);
    expect(dims.left).toBeGreaterThanOrEqual(-1);
    expect(dims.right).toBeLessThanOrEqual(width+1);
    if (width === 390 || width === 1366) await page.screenshot({
      path:"test-results/"+testInfo.project.name+"-phase5-sealed-"+width+".png",fullPage:true,
    });
  }
  await page.getByRole("button", {name:"Open the letter"}).click();
  for(const [width,height] of [[320,640],[390,844],[1366,768]]) {
    await page.setViewportSize({width,height});
    await expect(page.getByRole("button",{name:/There's one more thing/i})).toBeVisible();
    const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(width+1);
  }
});
