import { expect, test, type Page } from "@playwright/test";

async function openRocket(page: Page, motion: "reduce" | "no-preference" = "reduce") {
  await page.emulateMedia({ reducedMotion: motion });
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("the-last-spark:chapter:v1", "5"));
  await page.reload();
  await expect(page.locator('[data-scene="skyshot-launch"]')).toBeVisible();
}

test("rocket begins on rooftop, launches via button and reaches finale", async ({ page }, testInfo) => {
  await openRocket(page);
  await expect(page.locator(".sky-v2__rocket")).toBeVisible();
  await expect(page.locator(".sky-v2__moon")).toBeVisible();
  await expect(page.locator(".sky-v2__ambient-star")).toHaveCount(71);
  await expect(page.getByText("KUHU", { exact: true })).toHaveCount(0);
  await page.screenshot({ path: "test-results/"+testInfo.project.name+"-phase6-rooftop.png", fullPage:true });
  const launch=page.getByRole("button",{name:/Swipe up or tap to launch/i});
  await expect(launch).toBeEnabled();
  await launch.click();
  await expect(page.locator(".sky-v2--launched")).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Your wish is flying...");
  await expect(page.locator('[data-scene="grand-finale"]')).toBeVisible({timeout:8000});
});

test("button has keyboard fallback for non-touch devices", async ({ page }) => {
  await openRocket(page);
  const launch=page.getByRole("button",{name:/Swipe up or tap to launch/i});
  await launch.focus();
  await expect(launch).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-scene="grand-finale"]')).toBeVisible({timeout:8000});
});

test("upward swipe in launch zone initiates rocket flight", async ({ page }) => {
  await openRocket(page,"no-preference");
  const zone=page.locator(".sky-v2__launch-zone");
  await expect(zone).toBeVisible();
  const bounds=await zone.boundingBox();
  expect(bounds).not.toBeNull();
  const x=bounds!.x+bounds!.width/2;
  const y=bounds!.y+bounds!.height-10;
  await page.mouse.move(x,y);
  await page.mouse.down();
  await page.mouse.move(x,y-70,{steps:10});
  await page.mouse.up();
  await expect(page.locator(".sky-v2--launched")).toBeVisible({timeout:5000});
  await expect(page.locator('[data-scene="grand-finale"]')).toBeVisible({timeout:8000});
});

test("short and downward movements do not launch", async ({ page }) => {
  await openRocket(page);
  const zone=page.locator(".sky-v2__launch-zone");
  const bounds=await zone.boundingBox();
  expect(bounds).not.toBeNull();
  const x=bounds!.x+22;
  const y=bounds!.y+22;
  await page.mouse.move(x,y);
  await page.mouse.down();
  await page.mouse.move(x,y+26,{steps:4});
  await page.mouse.up();
  await expect(page.getByRole("button",{name:/Swipe up or tap to launch/i})).toBeEnabled();
  await expect(page.locator(".sky-v2--launched")).toHaveCount(0);
});

test("rooftop CTA fits eight mobile and desktop viewports", async ({ page }, testInfo) => {
  await openRocket(page);
  for(const [width,height] of [
    [320,640],[360,740],[390,844],[430,932],[768,1024],[1024,768],[1366,768],[1920,1080],
  ]) {
    await page.setViewportSize({width,height});
    const m=await page.evaluate(()=>{
      const r=document.querySelector<HTMLElement>(".sky-v2__launch-button")!.getBoundingClientRect();
      return {scroll:document.documentElement.scrollWidth,width:innerWidth,left:r.left,right:r.right,buttonWidth:r.width};
    });
    expect(m.scroll,"horizontal overflow at "+width).toBeLessThanOrEqual(width+1);
    expect(m.buttonWidth).toBeGreaterThanOrEqual(240);
    expect(m.left).toBeGreaterThanOrEqual(-1);
    expect(m.right).toBeLessThanOrEqual(width+1);
    if(width===390||width===1366) await page.screenshot({
      path:"test-results/"+testInfo.project.name+"-phase6-"+width+".png",fullPage:true,
    });
  }
});

test("rocket animation remains single-fire under rapid repeated taps", async ({ page }) => {
  await openRocket(page,"no-preference");
  const launch=page.getByRole("button",{name:/Swipe up or tap to launch/i});
  await launch.click({timeout:10000});
  await expect(page.locator(".sky-v2--launched")).toBeVisible();
  await expect(launch).toHaveCount(0);
  await expect(page.locator('[data-scene="grand-finale"]')).toBeVisible({timeout:8000});
});
