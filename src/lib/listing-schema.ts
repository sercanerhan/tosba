import { z } from "zod";

export const evidenceSourceSchema = z.enum([
  "satici_beyani",
  "fotograf",
  "servis_belgesi",
]);

const unknown = "bilinmiyor";

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month! - 1 && date.getUTCDate() === day;
}

const optionalDate = z
  .string()
  .refine((value) => value === "" || value === unknown || isCalendarDate(value), {
    message: "Tarih gerçek bir YYYY-AA-GG tarihi veya bilinmiyor olmalıdır.",
  });

const optionalInteger = z
  .string()
  .refine((value) => value === "" || value === unknown || /^\d+$/.test(value), {
    message: "Değer yalnız rakamlardan oluşmalı veya bilinmiyor olmalıdır.",
  });

const optionalDot = z
  .string()
  .refine((value) => value === "" || value === unknown || /^(0[1-9]|[1-4]\d|5[0-3])\d{2}$/.test(value), {
    message: "DOT kodu WWYY biçiminde ve geçerli bir hafta içermeli veya bilinmiyor olmalıdır.",
  });

const sourceList = z.array(evidenceSourceSchema).min(1);

export const listingSchema = z.object({
  ad: z.object({
    title: z.string().min(1),
    priceTl: optionalInteger,
    negotiation: z.string(),
    city: z.string(),
    district: z.string(),
    whatsapp: z.string().refine(
      (value) => value === "" || /^\+?[1-9]\d{9,14}$/.test(value.replace(/\s/g, "")),
      { message: "WhatsApp numarası ülke koduyla yazılmalıdır." },
    ),
    currentPhotoDate: optionalDate,
    inspectionExpiry: optionalDate,
    keyCount: optionalInteger,
    saleReason: z.string(),
    openToInspection: z.boolean(),
    testDrive: z.string(),
  }),
  car: z.object({
    make: z.string().min(1),
    model: z.string().min(1),
    generation: z.string(),
    trim: z.string(),
    modelYear: z.coerce.number().int().min(1900).max(2100),
    firstRegistrationYear: z.coerce.number().int().min(1900).max(2100),
    engine: z.string(),
    powerHp: z.coerce.number().int().positive(),
    fuel: z.string(),
    transmission: z.string(),
    gearCount: z.coerce.number().int().positive(),
    doorCount: z.coerce.number().int().positive(),
    color: z.string(),
    mileage: optionalInteger,
  }),
  ownership: z.object({
    firstOwner: z.boolean(),
    years: z.coerce.number().int().positive(),
    shortStory: z.string(),
    warningExperience: z.string(),
    usageHabit: z.string(),
    sources: sourceList,
  }),
  condition: z.object({
    paintSummary: z.string(),
    damageSummary: z.string(),
    tramerStatus: z.string(),
    tramerAmount: optionalInteger,
    hoodStatus: z.string(),
    radiatorStatus: z.string(),
    chassisStatus: z.string(),
    airbagStatus: z.string(),
    rearAreaCurrentStatus: z.string(),
    sources: sourceList,
  }),
  equipment: z.array(z.string().min(1)),
  tires: z.array(
    z.object({
      id: z.string(),
      position: z.string().min(1),
      brand: z.string(),
      model: z.string(),
      size: z.string(),
      dot: optionalDot,
      treadMm: z.string().refine(
        (value) => value === "" || value === unknown || /^\d+(?:[.,]\d)?$/.test(value),
        { message: "Diş derinliği örneğin 6 veya 6,5 olarak yazılmalıdır." },
      ),
      installationDate: optionalDate,
      sources: sourceList,
    }),
  ).length(4),
  maintenance: z.array(
    z.object({
      id: z.string(),
      date: optionalDate,
      mileage: optionalInteger,
      operation: z.string().min(1),
      service: z.string(),
      document: z.string(),
      sources: sourceList,
    }),
  ),
  damage: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1),
      date: optionalDate,
      mileage: optionalInteger,
      description: z.string().min(1),
      replaced: z.string(),
      painted: z.string(),
      tramer: z.string(),
      photos: z.array(z.string()),
      sources: sourceList,
    }),
  ),
  faq: z.array(
    z.object({
      id: z.string(),
      question: z.string().min(1),
      answer: z.string().min(1),
      sources: sourceList,
    }),
  ),
});

export type CarListing = z.infer<typeof listingSchema>;
export type EvidenceSource = z.infer<typeof evidenceSourceSchema>;
export type TireRecord = CarListing["tires"][number];
export type ServiceEvent = CarListing["maintenance"][number];
export type DamageRecord = CarListing["damage"][number];
