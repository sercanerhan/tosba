import { expect, type Page } from "@playwright/test";

export async function dismissFarewell(page: Page) {
  const curtain = page.getByRole("dialog", { name: "Tosba" });
  await expect(curtain).toBeVisible();
  await page.getByRole("button", { name: "Vedayı kapat" }).click();
  await expect(curtain).not.toBeVisible();
}
