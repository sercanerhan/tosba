import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ListingParseError,
  getMissingLiveFields,
  getUnknownMediaReferences,
  listingFileUrl,
  parseListing,
} from "../../src/lib/listing-parser";

const source = readFileSync(fileURLToPath(listingFileUrl), "utf8");

function replaceField(section: string, key: string, nextValue: string): string {
  const start = source.indexOf(`[${section}]`);
  const end = source.indexOf("\n[", start + 1);
  const block = source.slice(start, end === -1 ? undefined : end);
  const changed = block.replace(new RegExp(`^${key}:.*$`, "m"), `${key}: ${nextValue}`);
  return source.slice(0, start) + changed + (end === -1 ? "" : source.slice(end));
}

describe("araç bilgi parser'ı", () => {
  it("taslak içerik dosyasını şemaya dönüştürür", () => {
    const listing = parseListing(source);
    expect(listing.car.model).toBe("Golf");
    expect(listing.tires).toHaveLength(4);
    expect(listing.damage[0]?.photos).toContain("damage-contact-wide");
  });

  it("eksik canlı alanları raporlar", () => {
    const missing = getMissingLiveFields(parseListing(source));
    expect(missing).toContain("ilan.fiyat_tl");
    expect(missing).toContain("arac.kilometre");
    expect(missing).toContain("lastik:on-sol.dot");
    expect(missing).toContain("bakim:son-periyodik.tarih");
  });

  it("gerçek olmayan takvim tarihini reddeder", () => {
    expect(() => parseListing(replaceField("ilan", "guncel_fotograf_tarihi", "2026-13-40"))).toThrow(/Tarih gerçek/);
  });

  it("noktalı kilometreyi reddeder", () => {
    expect(() => parseListing(replaceField("arac", "kilometre", "125.000"))).toThrow(/yalnız rakamlardan/);
  });

  it("geçersiz DOT haftasını reddeder", () => {
    expect(() => parseListing(replaceField("lastik:on-sol", "dot", "5426"))).toThrow(/DOT kodu/);
  });

  it("bilinmiyor değerini doğrulanmamış durumlar için kabul eder", () => {
    const listing = parseListing(replaceField("ilan", "muayene_son", "bilinmiyor"));
    expect(listing.ad.inspectionExpiry).toBe("bilinmiyor");
  });

  it("bilinmeyen anahtarı satır bilgisiyle reddeder", () => {
    const changed = source.replace("renk: Siyah", "renk: Siyah\nseri_no: 123");
    expect(() => parseListing(changed)).toThrow(ListingParseError);
    expect(() => parseListing(changed)).toThrow(/bilinmeyen alan: seri_no/);
  });

  it("manifestte olmayan medya referansını bulur", () => {
    const changed = source.replace("damage-contact-wide,damage-contact-close", "kayip-foto,damage-contact-close");
    const listing = parseListing(changed);
    expect(getUnknownMediaReferences(listing, ["damage-contact-close", "repair-prep", "repair-after", "rear-area-mark"]))
      .toEqual(["kayip-foto"]);
  });
});
