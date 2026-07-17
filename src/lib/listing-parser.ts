import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { listingSchema, type CarListing, type EvidenceSource } from "./listing-schema";

type RawSection = {
  name: string;
  id?: string;
  values: Record<string, string>;
  items: string[];
  line: number;
};

export class ListingParseError extends Error {
  constructor(message: string, readonly line?: number) {
    super(line ? `Satır ${line}: ${message}` : message);
    this.name = "ListingParseError";
  }
}

const allowedKeys: Record<string, readonly string[]> = {
  ilan: [
    "baslik", "fiyat_tl", "pazarlik", "sehir", "ilce", "whatsapp",
    "guncel_fotograf_tarihi", "muayene_son", "anahtar_sayisi",
    "satis_nedeni", "ekspertize_acik", "test_surusu",
  ],
  arac: [
    "marka", "model", "kasa", "paket", "model_yili", "ilk_tescil_yili",
    "motor", "guc_hp", "yakit", "vites", "vites_sayisi", "kapi_sayisi",
    "renk", "kilometre",
  ],
  sahiplik: [
    "ilk_sahibi", "sahiplik_yili", "kisa_hikaye", "uyari_deneyimi",
    "kullanim_aliskanligi", "kaynak",
  ],
  durum: [
    "boya_ozeti", "hasar_ozeti", "tramer_durumu", "tramer_tutari",
    "kaput_durumu", "radyator_durumu", "sasi_podye_direk", "airbag_durumu",
    "arka_bolge_guncel_durum", "kaynak",
  ],
  donanim: [],
  lastik: ["konum", "marka", "model", "ebat", "dot", "dis_mm", "takilma_tarihi", "kaynak"],
  bakim: ["tarih", "kilometre", "islem", "servis", "belge", "kaynak"],
  hasar: [
    "baslik", "tarih", "kilometre", "aciklama", "degisen", "boyanan",
    "tramer", "fotograflar", "kaynak",
  ],
  sss: ["soru", "cevap", "kaynak"],
};

function parseBoolean(value: string, field: string): boolean {
  if (value === "evet") return true;
  if (value === "hayir") return false;
  throw new ListingParseError(`${field} alanı evet veya hayir olmalıdır.`);
}

function sources(value: string): EvidenceSource[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean) as EvidenceSource[];
}

function splitList(value: string): string[] {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function value(section: RawSection, key: string): string {
  return section.values[key] ?? "";
}

function requireSection(sections: RawSection[], name: string): RawSection {
  const section = sections.find((candidate) => candidate.name === name);
  if (!section) throw new ListingParseError(`[${name}] bölümü eksik.`);
  return section;
}

export function parseSections(input: string): RawSection[] {
  const sections: RawSection[] = [];
  let current: RawSection | undefined;

  input.split(/\r?\n/).forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) return;

    const header = line.match(/^\[([a-z]+)(?::([a-z0-9-]+))?\]$/i);
    if (header) {
      const name = header[1]?.toLowerCase() ?? "";
      if (!Object.hasOwn(allowedKeys, name)) {
        throw new ListingParseError(`Bilinmeyen bölüm: ${name}`, lineNumber);
      }
      current = {
        name,
        ...(header[2] ? { id: header[2] } : {}),
        values: {},
        items: [],
        line: lineNumber,
      };
      sections.push(current);
      return;
    }

    if (!current) {
      throw new ListingParseError("Alan bir bölüm başlığının altında olmalıdır.", lineNumber);
    }

    if (line.startsWith("- ")) {
      if (current.name !== "donanim") {
        throw new ListingParseError("Liste maddesi yalnız [donanim] bölümünde kullanılabilir.", lineNumber);
      }
      current.items.push(line.slice(2).trim());
      return;
    }

    const separator = line.indexOf(":");
    if (separator < 1) {
      throw new ListingParseError("Alanlar anahtar: değer biçiminde olmalıdır.", lineNumber);
    }

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    if (!allowedKeys[current.name]?.includes(key)) {
      throw new ListingParseError(`[${current.name}] bölümünde bilinmeyen alan: ${key}`, lineNumber);
    }
    if (Object.hasOwn(current.values, key)) {
      throw new ListingParseError(`Aynı alan iki kez yazılmış: ${key}`, lineNumber);
    }
    current.values[key] = rawValue;
  });

  return sections;
}

export function parseListing(input: string): CarListing {
  const sections = parseSections(input);
  const ad = requireSection(sections, "ilan");
  const car = requireSection(sections, "arac");
  const ownership = requireSection(sections, "sahiplik");
  const condition = requireSection(sections, "durum");
  const equipment = requireSection(sections, "donanim");

  return listingSchema.parse({
    ad: {
      title: value(ad, "baslik"),
      priceTl: value(ad, "fiyat_tl"),
      negotiation: value(ad, "pazarlik"),
      city: value(ad, "sehir"),
      district: value(ad, "ilce"),
      whatsapp: value(ad, "whatsapp"),
      currentPhotoDate: value(ad, "guncel_fotograf_tarihi"),
      inspectionExpiry: value(ad, "muayene_son"),
      keyCount: value(ad, "anahtar_sayisi"),
      saleReason: value(ad, "satis_nedeni"),
      openToInspection: parseBoolean(value(ad, "ekspertize_acik"), "ekspertize_acik"),
      testDrive: value(ad, "test_surusu"),
    },
    car: {
      make: value(car, "marka"),
      model: value(car, "model"),
      generation: value(car, "kasa"),
      trim: value(car, "paket"),
      modelYear: value(car, "model_yili"),
      firstRegistrationYear: value(car, "ilk_tescil_yili"),
      engine: value(car, "motor"),
      powerHp: value(car, "guc_hp"),
      fuel: value(car, "yakit"),
      transmission: value(car, "vites"),
      gearCount: value(car, "vites_sayisi"),
      doorCount: value(car, "kapi_sayisi"),
      color: value(car, "renk"),
      mileage: value(car, "kilometre"),
    },
    ownership: {
      firstOwner: parseBoolean(value(ownership, "ilk_sahibi"), "ilk_sahibi"),
      years: value(ownership, "sahiplik_yili"),
      shortStory: value(ownership, "kisa_hikaye"),
      warningExperience: value(ownership, "uyari_deneyimi"),
      usageHabit: value(ownership, "kullanim_aliskanligi"),
      sources: sources(value(ownership, "kaynak")),
    },
    condition: {
      paintSummary: value(condition, "boya_ozeti"),
      damageSummary: value(condition, "hasar_ozeti"),
      tramerStatus: value(condition, "tramer_durumu"),
      tramerAmount: value(condition, "tramer_tutari"),
      hoodStatus: value(condition, "kaput_durumu"),
      radiatorStatus: value(condition, "radyator_durumu"),
      chassisStatus: value(condition, "sasi_podye_direk"),
      airbagStatus: value(condition, "airbag_durumu"),
      rearAreaCurrentStatus: value(condition, "arka_bolge_guncel_durum"),
      sources: sources(value(condition, "kaynak")),
    },
    equipment: equipment.items,
    tires: sections.filter((section) => section.name === "lastik").map((section) => ({
      id: section.id ?? "",
      position: value(section, "konum"),
      brand: value(section, "marka"),
      model: value(section, "model"),
      size: value(section, "ebat"),
      dot: value(section, "dot"),
      treadMm: value(section, "dis_mm"),
      installationDate: value(section, "takilma_tarihi"),
      sources: sources(value(section, "kaynak")),
    })),
    maintenance: sections.filter((section) => section.name === "bakim").map((section) => ({
      id: section.id ?? "",
      date: value(section, "tarih"),
      mileage: value(section, "kilometre"),
      operation: value(section, "islem"),
      service: value(section, "servis"),
      document: value(section, "belge"),
      sources: sources(value(section, "kaynak")),
    })),
    damage: sections.filter((section) => section.name === "hasar").map((section) => ({
      id: section.id ?? "",
      title: value(section, "baslik"),
      date: value(section, "tarih"),
      mileage: value(section, "kilometre"),
      description: value(section, "aciklama"),
      replaced: value(section, "degisen"),
      painted: value(section, "boyanan"),
      tramer: value(section, "tramer"),
      photos: splitList(value(section, "fotograflar")),
      sources: sources(value(section, "kaynak")),
    })),
    faq: sections.filter((section) => section.name === "sss").map((section) => ({
      id: section.id ?? "",
      question: value(section, "soru"),
      answer: value(section, "cevap"),
      sources: sources(value(section, "kaynak")),
    })),
  });
}

export const listingFileUrl = new URL("../content/arac-bilgileri.txt", import.meta.url);

export function readListing(): CarListing {
  return parseListing(readFileSync(fileURLToPath(listingFileUrl), "utf8"));
}

export const liveRequiredFields = [
  ["ilan.fiyat_tl", (listing: CarListing) => listing.ad.priceTl],
  ["ilan.sehir", (listing: CarListing) => listing.ad.city],
  ["ilan.whatsapp", (listing: CarListing) => listing.ad.whatsapp],
  ["ilan.guncel_fotograf_tarihi", (listing: CarListing) => listing.ad.currentPhotoDate],
  ["ilan.muayene_son", (listing: CarListing) => listing.ad.inspectionExpiry],
  ["ilan.anahtar_sayisi", (listing: CarListing) => listing.ad.keyCount],
  ["arac.kilometre", (listing: CarListing) => listing.car.mileage],
  ["durum.tramer_durumu", (listing: CarListing) => listing.condition.tramerStatus],
] as const;

export function getMissingLiveFields(listing: CarListing): string[] {
  const missing: string[] = liveRequiredFields
    .filter(([, getter]) => !getter(listing))
    .map(([path]) => path);

  listing.tires.forEach((tire) => {
    if (!tire.brand) missing.push(`lastik:${tire.id}.marka`);
    if (!tire.size) missing.push(`lastik:${tire.id}.ebat`);
    if (!tire.dot) missing.push(`lastik:${tire.id}.dot`);
  });

  const lastService = listing.maintenance.at(0);
  if (!lastService?.date) missing.push("bakim:son-periyodik.tarih");
  if (!lastService?.mileage) missing.push("bakim:son-periyodik.kilometre");

  return missing;
}

export function getUnknownMediaReferences(listing: CarListing, knownIds: Iterable<string>): string[] {
  const known = new Set(knownIds);
  return [...new Set(listing.damage.flatMap((record) => record.photos).filter((id) => !known.has(id)))];
}

export function formatNumber(value: string, suffix = ""): string {
  if (!value) return "Bilgi bekleniyor";
  if (value === "bilinmiyor") return "Bilinmiyor";
  return `${new Intl.NumberFormat("tr-TR").format(Number(value))}${suffix}`;
}

export function formatDate(value: string): string {
  if (!value) return "Tarih bekleniyor";
  if (value === "bilinmiyor") return "Bilinmiyor";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(`${value}T12:00:00`));
}
