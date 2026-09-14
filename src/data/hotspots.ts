import type { EvidenceSource } from "../lib/listing-schema";

export type HotspotMode = "exterior" | "interior" | "tires";

export type Hotspot = {
  id: string;
  mode: HotspotMode;
  x: number;
  y: number;
  title: string;
  summary: string;
  detail: string;
  sources: EvidenceSource[];
};

export const hotspotMedia: Record<HotspotMode, string> = {
  exterior: "atlas-exterior",
  interior: "interior-console",
  tires: "atlas-tires",
};

export const hotspots: Hotspot[] = [
  {
    id: "engine",
    mode: "exterior",
    x: 34,
    y: 58,
    title: "1.4 TSI · 122 HP",
    summary: "Benzinli motor ve 6 ileri manuel şanzıman.",
    detail: "Motor ve şanzımanla ilgili elde kalan tarih ve kilometre bilgileri bakım yörüngesinde korunur.",
    sources: ["satici_beyani"],
  },
  {
    id: "fog-lights",
    mode: "exterior",
    x: 17,
    y: 76,
    title: "Sis farları",
    summary: "Trendline donanımına ek olarak araç üzerinde teslim edildi.",
    detail: "Fabrika ve teslim donanımı ayrımını doğrulayacak araç evrakı bu arşivde bulunmuyor.",
    sources: ["satici_beyani", "fotograf"],
  },
  {
    id: "wheels",
    mode: "exterior",
    x: 68,
    y: 76,
    title: "Çift renkli 16 inç jantlar",
    summary: "Araçla birlikte gelen çift renkli alaşım jantlar.",
    detail: "Dört lastiğin marka, ebat, DOT ve diş derinliği kayıtları araç pasaportunda ayrı ayrı korunur.",
    sources: ["satici_beyani", "fotograf"],
  },
  {
    id: "park-sensor",
    mode: "exterior",
    x: 86,
    y: 62,
    title: "Arka park sensörü",
    summary: "Araç tesliminde yetkili serviste sonradan takıldı.",
    detail: "Montaj bilgisi ilk sahibinin kaydıdır; bunu doğrulayacak servis faturası arşivde bulunmuyor.",
    sources: ["satici_beyani", "fotograf"],
  },
  {
    id: "steering",
    mode: "interior",
    x: 28,
    y: 56,
    title: "Deri ve çok fonksiyonlu direksiyon",
    summary: "Ses ve bilgi ekranı kontrolleri direksiyon üzerinde.",
    detail: "Deri direksiyon ve çok fonksiyon tuşları fotoğrafta görülebilir durumdadır.",
    sources: ["fotograf"],
  },
  {
    id: "six-disc",
    mode: "interior",
    x: 69,
    y: 49,
    title: "6'lı CD ünitesi",
    summary: "Araçla birlikte gelen RCD multimedya ünitesi.",
    detail: "Ünitenin çalışma durumu ve telefon bağlantı özellikleri ilk sahiplik döneminde ayrıca belgelenmedi.",
    sources: ["satici_beyani", "fotograf"],
  },
  {
    id: "manual",
    mode: "interior",
    x: 83,
    y: 87,
    title: "6 ileri manuel",
    summary: "Deri vites topuzu ile manuel şanzıman.",
    detail: "Debriyaj ve şanzıman için elde kalan bakım bilgileri bakım yörüngesinde gösterilir.",
    sources: ["fotograf", "satici_beyani"],
  },
  {
    id: "rear-tire",
    mode: "tires",
    x: 69,
    y: 77,
    title: "Arka lastik",
    summary: "Marka, model, ebat, DOT ve diş derinliği ayrı kayıtlarda.",
    detail: "Dört lastik birbirinden bağımsız kaydedilir. DOT kodu hafta/yıl biçiminde gösterilir.",
    sources: ["fotograf", "satici_beyani"],
  },
  {
    id: "front-tire",
    mode: "tires",
    x: 16,
    y: 68,
    title: "Ön lastik",
    summary: "Son kayıtlı marka, ebat ve üretim tarihi araç pasaportunda.",
    detail: "Ön lastiklerin ilk sahiplik döneminden kalan bilgileri iki konum için ayrı ayrı saklanır.",
    sources: ["satici_beyani", "fotograf"],
  },
];

export const hotspotsByMode = {
  exterior: hotspots.filter((hotspot) => hotspot.mode === "exterior"),
  interior: hotspots.filter((hotspot) => hotspot.mode === "interior"),
  tires: hotspots.filter((hotspot) => hotspot.mode === "tires"),
};
