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
  it("satılmış aracın arşiv kimliğini şemaya dönüştürür", () => {
    const listing = parseListing(source);

    expect(listing.ad.status).toBe("satildi");
    expect(listing.ad.soldAt).toBe("2026-09-14");
    expect(listing.car.nickname).toBe("Tosba");
    expect(listing.ownership.startedAt).toBe("2012-03-08");
  });

  it("satılmış araçta satış tarihi eksikse içeriği reddeder", () => {
    const missingSaleDate = replaceField("ilan", "satis_tarihi", "");

    expect(() => parseListing(missingSaleDate)).toThrow(/satış tarihi zorunludur/);
  });

  it("satış tarihi gerçek bir takvim tarihi değilse içeriği reddeder", () => {
    const invalidSaleDate = replaceField("ilan", "satis_tarihi", "2026-02-31");

    expect(() => parseListing(invalidSaleDate)).toThrow(/Tarih gerçek/);
  });

  it("ilk sahiplik başlangıcı gerçek bir takvim tarihi değilse içeriği reddeder", () => {
    const invalidStartDate = replaceField("sahiplik", "baslangic_tarihi", "2012-02-30");

    expect(() => parseListing(invalidStartDate)).toThrow(/Tarih gerçek/);
  });

  it("satılmış araçta fiyat ve WhatsApp bilgisi aramaz", () => {
    const missing = getMissingLiveFields(parseListing(source));

    expect(missing).toEqual([]);
  });

  it("arşiv içerik dosyasını şemaya dönüştürür", () => {
    const listing = parseListing(source);
    expect(listing.car.model).toBe("Golf");
    expect(listing.tires).toHaveLength(4);
    expect(listing.damage[0]?.photos).toContain("damage-contact-wide");
  });

  it("satılık araç için eksik canlı alanları raporlar", () => {
    const forSaleSource = replaceField("ilan", "durum", "satilik");
    const missing = getMissingLiveFields(parseListing(forSaleSource));
    expect(missing).toEqual(["ilan.fiyat_tl", "ilan.whatsapp"]);
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
