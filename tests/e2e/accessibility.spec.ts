import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("kritik veya ciddi axe ihlali yok", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#iletisim").scrollIntoViewIfNeeded();
  await page.locator("#top").scrollIntoViewIfNeeded();

  const results = await new AxeBuilder({ page })
    .exclude("astro-dev-toolbar")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  const blocking = results.violations.filter((violation) =>
    violation.impact === "critical" || violation.impact === "serious",
  );
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
});
