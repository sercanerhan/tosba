import { expect, test } from "@playwright/test";

test("ana satış bilgileri görünür ve yatay taşma yok", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "14 Yıllık Yörünge" })).toBeVisible();
  await expect(page.getByLabel("Hızlı satış bilgileri")).toBeVisible();

  const viewportWidth = testInfo.project.use.viewport?.width ?? 0;
  const dimensions = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scroll, `${viewportWidth}px görünümünde yatay taşma`).toBe(dimensions.client);
});

test("atlas modları, hotspot ve odak dönüşü çalışır", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Aracı keşfet" }).click();
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

test("WhatsApp numarası eksikken dürüst durum penceresi açılır", async ({ page }) => {
  await page.goto("/");
  await page.locator("#iletisim").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Görüşme talebi" }).click();
  await page.getByRole("button", { name: "WhatsApp'tan konuşalım" }).click();
  await expect(page.getByRole("dialog", { name: "Bir bilgi daha gerekiyor." })).toBeVisible();
});

test("azaltılmış hareket tercihi doğal akışı korur", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const heroPosition = await page.locator("[data-hero]").evaluate((element) => getComputedStyle(element).position);
  expect(heroPosition).toBe("relative");
  await page.getByRole("link", { name: "Aracı keşfet" }).click();
  await expect(page.locator("#arac-atlasi")).toBeInViewport();
});
