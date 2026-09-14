import { expect, test } from "@playwright/test";
import { dismissFarewell } from "./helpers";

test("veda perdesi açılır ve kapatıldığında odağı ana hikâyeye verir", async ({ page }) => {
  await page.goto("/");

  const curtain = page.getByRole("dialog", { name: "Tosba" });
  await expect(curtain).toBeVisible();
  await expect(page.getByRole("button", { name: "Vedayı kapat" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");

  await page.getByRole("button", { name: "Vedayı kapat" }).click();

  await expect(curtain).not.toBeVisible();
  await expect(page.locator("#ana-icerik")).toBeFocused();
});

test("veda perdesi her yüklemede yeniden açılır ve tüm kapatma yollarını destekler", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const curtain = page.getByRole("dialog", { name: "Tosba" });

  await page.goto("/");
  await expect(curtain).toBeVisible();
  await expect(page.getByRole("button", { name: "Hikâyeyi aç" })).toBeVisible();
  await page.getByRole("button", { name: "Hikâyeyi aç" }).click();
  await expect(curtain).not.toBeVisible();

  await page.reload();
  await expect(curtain).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(curtain).not.toBeVisible();

  await page.reload();
  await expect(curtain).toBeVisible();
});

test("veda açıkken arka plan kaydırma ve etkileşim almaz", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Tosba" })).toBeVisible();

  await page.evaluate(() => {
    document.querySelector("main")?.addEventListener("click", () => {
      document.documentElement.dataset.backgroundClicked = "true";
    });
  });
  await page.mouse.click(12, 12);
  await page.mouse.wheel(0, 900);

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.backgroundClicked ?? "false")).toBe("false");
});

test("veda son eylemi görünene kadar odağa girmez ve ilk tarih karesi oynar", async ({ page }) => {
  await page.goto("/");
  const finalFrame = page.locator("[data-farewell-final]");

  await expect.poll(async () => Number(await page.locator(".farewell__beat--start").evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThan(0.1);
  await expect(finalFrame).toHaveAttribute("inert", "");
  await page.keyboard.press("Tab");
  await expect(page.locator("[data-farewell-enter]")).not.toBeFocused();
  await expect.poll(() => page.evaluate(() => document.activeElement?.closest("[data-farewell-final]") === null)).toBe(true);
});

test("veda kapatıldığında satılık ilan yerine arşiv görünür", async ({ page }) => {
  await page.goto("/");
  await dismissFarewell(page);

  await expect(page.getByLabel("Hızlı arşiv bilgileri")).toBeVisible();
  await expect(page.getByText("Satıldı · 14 Eyl 2026", { exact: true })).toBeVisible();
  await expect(page.getByText(/WhatsApp/)).toHaveCount(0);
  await expect(page.getByText("Ekspertize açık", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Satış hazırlığı", { exact: true })).toHaveCount(0);
  await expect(page.getByText("FİYAT", { exact: true })).toHaveCount(0);
});

test("ana arşiv bilgileri görünür ve yatay taşma yok", async ({ page }, testInfo) => {
  await page.goto("/");
  await dismissFarewell(page);
  await expect(page.getByRole("heading", { level: 1, name: "14 Yıllık Yörünge" })).toBeVisible();
  await expect(page.getByLabel("Hızlı arşiv bilgileri")).toBeVisible();

  const viewportWidth = testInfo.project.use.viewport?.width ?? 0;
  const dimensions = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scroll, `${viewportWidth}px görünümünde yatay taşma`).toBe(dimensions.client);
});

test("atlas modları, hotspot ve odak dönüşü çalışır", async ({ page }, testInfo) => {
  await page.goto("/");
  await dismissFarewell(page);
  await page.locator("#arac-atlasi").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: /İç mekân/ }).click();
  await expect(page.getByRole("tab", { name: /İç mekân/ })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: /Dış görünüş/ }).click();

  const hotspot = page.getByRole("button", { name: "1.4 TSI · 122 HP bilgisini aç" });
  await hotspot.click();

  if ((testInfo.project.use.viewport?.width ?? 0) <= 900) {
    const sheet = page.locator("[data-atlas-sheet]");
    await expect(sheet).toHaveAttribute("open", "");
    await page.getByRole("button", { name: "Bilgi panelini kapat" }).click();
    await expect(sheet).not.toHaveAttribute("open", "");
    await expect(hotspot).toBeFocused();
  } else {
    await expect(page.locator("[data-detail-title]")).toHaveText("1.4 TSI · 122 HP");
  }
});

test("yolculuk atlası 15 durağı gösterir ve seçim haritayı günceller", async ({ page }, testInfo) => {
  await page.goto("/");
  await dismissFarewell(page);
  if ((testInfo.project.use.viewport?.width ?? 0) <= 767) {
    await page.getByRole("button", { name: /Menü/ }).click();
  }
  await page.locator('.site-header a[href="#yolculuk"]:visible').click();
  await expect(page.locator("#yolculuk")).toBeInViewport();
  await expect(page.getByRole("heading", { level: 2, name: "14 yılda, Türkiye yollarında." })).toBeVisible();

  const places = [
    "İstanbul", "Kaş", "Kalkan", "Muğla", "Kırklareli", "Samsun", "Ünye", "Ankara",
    "Eskişehir", "Kandıra", "Silivri", "Tekirdağ", "İzmir", "Marmaris", "Bolu",
  ];
  const travelMap = page.locator("#yolculuk");
  for (const place of places) {
    await expect(travelMap.getByRole("button", { name: place, exact: true })).toHaveCount(1);
  }

  const kalkan = travelMap.getByRole("button", { name: "Kalkan", exact: true });
  await kalkan.focus();
  await expect(kalkan).toHaveAttribute("aria-pressed", "true");
  await expect(travelMap.locator("[data-travel-marker='kalkan']")).toHaveAttribute("data-active", "true");
  await expect(travelMap.locator("[data-travel-active-name]")).toHaveText("Kalkan");

  const bolu = travelMap.getByRole("button", { name: "Bolu", exact: true });
  await bolu.click();
  await expect(bolu).toHaveAttribute("aria-pressed", "true");
  await expect(kalkan).toHaveAttribute("aria-pressed", "false");
  await expect(travelMap.locator("[data-travel-marker='bolu']")).toHaveAttribute("data-active", "true");
  await expect(travelMap.locator("[data-travel-active-region]")).toHaveText("Karadeniz");
});

test("galeri filtrelenir ve büyütme açılır", async ({ page }) => {
  await page.goto("/");
  await dismissFarewell(page);
  const gallery = page.locator("#galeri");
  await expect(gallery).toHaveAttribute("data-gallery-ready", "true");
  await gallery.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Kabin" }).click();
  await expect(page.locator("[data-gallery-item='interior']")).toBeVisible();
  await expect(page.locator("[data-gallery-item='today']")).toHaveCount(3);
  await expect(page.locator("[data-gallery-item='today']:not([hidden])")).toHaveCount(0);
  await page.locator("[data-gallery-item='interior'] .gallery-card__link").click();
  await expect(page.locator(".pswp--open")).toBeVisible();
  await page.locator(".pswp__button--close").click();
});

test("arşiv vedası başa dönüş bağlantısını sunar", async ({ page }) => {
  await page.goto("/");
  await dismissFarewell(page);
  await page.locator("#veda").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Yolun açık olsun, Tosba." })).toBeVisible();
  await page.getByRole("link", { name: "Başa dön" }).click();
  await expect(page.locator("#top")).toBeInViewport();
});

test("azaltılmış hareket tercihi doğrudan son yazıyı gösterir ve doğal akışı korur", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Tosba" }).getByText("08.03.2012 · 14.09.2026", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hikâyeyi aç" })).toBeVisible();
  await page.getByRole("button", { name: "Hikâyeyi aç" }).click();
  const heroPosition = await page.locator("[data-hero]").evaluate((element) => getComputedStyle(element).position);
  expect(heroPosition).toBe("relative");
  await page.getByRole("link", { name: "Hikâyeyi oku" }).click();
  await expect(page.locator("#hikaye")).toBeInViewport();
});
