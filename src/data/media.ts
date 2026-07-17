import type { ImageMetadata } from "astro";
import heroSafe from "../assets/generated/hero-privacy-safe.png";
import atlasTexture from "../assets/generated/orbit-atlas-texture.png";
import orbitalHorizon from "../assets/generated/orbital-horizon-footer.png";
import lifestyle from "../assets/listing/lifestyle-side.jpg";
import atlasExterior from "../assets/listing/atlas-exterior.jpg";
import atlasTires from "../assets/listing/atlas-tires.jpg";
import rearAreaMark from "../assets/listing/rear-area-mark.jpg";
import interior from "../assets/listing/interior-console.jpg";
import damageClose from "../assets/listing/damage-contact-close.jpg";
import damageWide from "../assets/listing/damage-contact-wide.jpg";
import repairPrep from "../assets/repair-prep.jpg";
import repairAfter from "../assets/listing/repair-after.jpg";
import archiveFrontSide from "../assets/listing/archive-front-side.jpg";
import archiveSideDetail from "../assets/listing/archive-side-detail.jpg";
import archiveRearQuarter from "../assets/listing/archive-rear-quarter.jpg";
import archiveDoor from "../assets/listing/archive-door.jpg";

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
