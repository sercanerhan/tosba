import type { ImageMetadata } from "astro";
import heroSafe from "../assets/generated/hero-privacy-safe.png";
import atlasTexture from "../assets/generated/orbit-atlas-texture.png";
import orbitalHorizon from "../assets/generated/orbital-horizon-footer.png";
import lifestyle from "../../photos/IMG_3978.jpeg";
import atlasExterior from "../../photos/IMG_6816.jpeg";
import atlasTires from "../../photos/IMG_6808.jpeg";
import rearAreaMark from "../../photos/IMG_6809.jpeg";
import interior from "../../photos/IMG_6849.jpeg";
import damageClose from "../../photos/IMG_4265.jpeg";
import damageWide from "../../photos/IMG_4266.jpeg";
import repairPrep from "../assets/repair-prep.jpg";
import repairAfter from "../../photos/IMG_4393.jpeg";
import archiveFrontSide from "../../photos/IMG_0075.jpeg";
import archiveSideDetail from "../../photos/8dc901e4-17bc-4c40-bcb7-c61e9ccf8ecb.jpg";
import archiveRearQuarter from "../../photos/9fe40ce3-9669-447b-bae9-2926674d12d2.jpg";
import archiveDoor from "../../photos/e70a31ec-8d2c-4bb1-8947-4ff0cc5e45e6.jpg";

export type MediaCategory = "today" | "interior" | "damage" | "repair" | "archive" | "generated";

export type PrivacyMask = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type MediaAsset = {
  id: string;
  src: ImageMetadata;
  category: MediaCategory;
  alt: string;
  caption: string;
  source: string;
  privacyMasks?: PrivacyMask[];
  gallery?: boolean;
};

export const mediaAssets: MediaAsset[] = [
  {
    id: "hero-safe",
    src: heroSafe,
    category: "today",
    alt: "Siyah 2012 Volkswagen Golf'un gün batımında sağ yan görünümü",
    caption: "Bugünkü hâli · plaka gizlenmiştir",
    source: "Satıcı fotoğrafı",
    gallery: true,
  },
  {
    id: "lifestyle-side",
    src: lifestyle,
    category: "today",
    alt: "Siyah Golf'un açık havada sol yan profili",
    caption: "Yan profil",
    source: "Satıcı fotoğrafı",
    gallery: true,
  },
  {
    id: "atlas-exterior",
    src: atlasExterior,
    category: "today",
    alt: "Siyah Golf'un ekspertiz alanında ön üç çeyrek görünümü",
    caption: "Dış görünüş atlası",
    source: "Satıcı fotoğrafı",
    privacyMasks: [{ left: 0, top: 55, width: 18, height: 20 }],
  },
  {
    id: "atlas-tires",
    src: atlasTires,
    category: "today",
    alt: "Golf'un sol arka bölümü, jantı ve lastiği",
    caption: "Jant ve lastik görünümü",
    source: "Satıcı fotoğrafı",
    gallery: true,
  },
  {
    id: "interior-console",
    src: interior,
    category: "interior",
    alt: "Golf'un çok fonksiyonlu deri direksiyonu, gösterge paneli, CD ünitesi ve manuel vitesi",
    caption: "Kokpit ve fabrika çıkışlı ek donanımlar",
    source: "Satıcı fotoğrafı",
    gallery: true,
  },
  {
    id: "damage-contact-close",
    src: damageClose,
    category: "damage",
    alt: "Ön temas sonrasında kaputtaki deformasyonun yakın görünümü",
    caption: "Temasın yakın görünümü",
    source: "Hasar anı fotoğrafı",
    privacyMasks: [{ left: 38, top: 2, width: 7, height: 19 }],
  },
  {
    id: "damage-contact-wide",
    src: damageWide,
    category: "damage",
    alt: "Ön temas sonrasında Golf ve diğer aracın geniş açı görünümü",
    caption: "Olayın geniş bağlamı",
    source: "Hasar anı fotoğrafı",
    gallery: true,
  },
  {
    id: "repair-prep",
    src: repairPrep,
    category: "repair",
    alt: "Serviste ön çamurlukta onarım ve boya hazırlığı",
    caption: "Serviste onarım hazırlığı",
    source: "Onarım süreci fotoğrafı",
    gallery: true,
  },
  {
    id: "repair-after",
    src: repairAfter,
    category: "repair",
    alt: "Onarım sonrasında Golf'un önden görünümü",
    caption: "Onarım sonrası görünüm",
    source: "Satıcı fotoğrafı",
    privacyMasks: [{ left: 37, top: 61, width: 27, height: 12 }],
  },
  {
    id: "rear-area-mark",
    src: rearAreaMark,
    category: "damage",
    alt: "Golf'un sol arka teker ve çamurluk çevresindeki yüzey izi",
    caption: "Güncel durumu yeniden fotoğraflanacak bölge",
    source: "Satıcı fotoğrafı",
    gallery: true,
  },
  {
    id: "archive-front-side",
    src: archiveFrontSide,
    category: "archive",
    alt: "Golf'un geçmiş yıllardaki ön üç çeyrek görünümü",
    caption: "Geçmişten dış görünüş",
    source: "Satıcı arşivi",
    gallery: true,
  },
  {
    id: "archive-side-detail",
    src: archiveSideDetail,
    category: "archive",
    alt: "Golf'un ön jant ve yan gövde arşiv detayı",
    caption: "Ön jant ve yan gövde",
    source: "Satıcı arşivi",
    gallery: true,
  },
  {
    id: "archive-rear-quarter",
    src: archiveRearQuarter,
    category: "archive",
    alt: "Golf'un arka çamurluk, stop ve jant arşiv detayı",
    caption: "Arka çeyrek görünümü",
    source: "Satıcı arşivi",
    gallery: true,
  },
  {
    id: "archive-door",
    src: archiveDoor,
    category: "archive",
    alt: "Golf'un arka kapı ve teker arşiv detayı",
    caption: "Arka kapı ve teker",
    source: "Satıcı arşivi",
    gallery: true,
  },
  {
    id: "atlas-texture",
    src: atlasTexture,
    category: "generated",
    alt: "",
    caption: "",
    source: "Üretilmiş atmosfer görseli",
  },
  {
    id: "orbital-horizon",
    src: orbitalHorizon,
    category: "generated",
    alt: "",
    caption: "",
    source: "Üretilmiş atmosfer görseli",
  },
];

export const mediaById = Object.fromEntries(mediaAssets.map((asset) => [asset.id, asset])) as Record<string, MediaAsset>;

export const galleryAssets = mediaAssets.filter((asset) => asset.gallery);
