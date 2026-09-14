import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { dismissFarewell } from "./helpers";

const blockingViolations = (results: Awaited<ReturnType<AxeBuilder["analyze"]>>) =>
  results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");

test("veda perdesi açıkken kritik veya ciddi axe ihlali yok", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .exclude("astro-dev-toolbar")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  expect(blockingViolations(results), JSON.stringify(blockingViolations(results), null, 2)).toEqual([]);
});

test("veda kapatıldıktan sonra kritik veya ciddi axe ihlali yok", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await dismissFarewell(page);
  await page.locator("#veda").scrollIntoViewIfNeeded();
  await page.locator("#top").scrollIntoViewIfNeeded();

  const results = await new AxeBuilder({ page })
    .exclude("astro-dev-toolbar")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  expect(blockingViolations(results), JSON.stringify(blockingViolations(results), null, 2)).toEqual([]);
});
