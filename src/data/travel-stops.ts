export type TravelRegion = "Marmara" | "Ege" | "Akdeniz" | "Karadeniz" | "İç Anadolu";

export type TravelStop = {
  id: string;
  name: string;
  region: TravelRegion;
  latitude: number;
  longitude: number;
  labelOffset?: readonly [x: number, y: number];
};

export const travelRegionOrder: readonly TravelRegion[] = [
  "Marmara",
  "Ege",
  "Akdeniz",
  "Karadeniz",
  "İç Anadolu",
];

export const travelStops: readonly TravelStop[] = [
  { id: "istanbul", name: "İstanbul", region: "Marmara", latitude: 41.0082, longitude: 28.9784, labelOffset: [0, 40] },
  { id: "kas", name: "Kaş", region: "Akdeniz", latitude: 36.1999, longitude: 29.6377, labelOffset: [16, -16] },
  { id: "kalkan", name: "Kalkan", region: "Akdeniz", latitude: 36.2651, longitude: 29.4137, labelOffset: [-16, -16] },
  { id: "mugla", name: "Muğla", region: "Ege", latitude: 37.2153, longitude: 28.3636 },
  { id: "kirklareli", name: "Kırklareli", region: "Marmara", latitude: 41.7351, longitude: 27.2252, labelOffset: [16, 40] },
  { id: "samsun", name: "Samsun", region: "Karadeniz", latitude: 41.2867, longitude: 36.33 },
  { id: "unye", name: "Ünye", region: "Karadeniz", latitude: 41.127, longitude: 37.2885 },
  { id: "ankara", name: "Ankara", region: "İç Anadolu", latitude: 39.9334, longitude: 32.8597 },
  { id: "eskisehir", name: "Eskişehir", region: "İç Anadolu", latitude: 39.7667, longitude: 30.5256 },
  { id: "kandira", name: "Kandıra", region: "Marmara", latitude: 41.0736, longitude: 30.1525 },
  { id: "silivri", name: "Silivri", region: "Marmara", latitude: 41.0739, longitude: 28.2464, labelOffset: [-12, -16] },
  { id: "tekirdag", name: "Tekirdağ", region: "Marmara", latitude: 40.9781, longitude: 27.5117, labelOffset: [-12, 40] },
  { id: "izmir", name: "İzmir", region: "Ege", latitude: 38.4237, longitude: 27.1428 },
  { id: "marmaris", name: "Marmaris", region: "Ege", latitude: 36.855, longitude: 28.2742, labelOffset: [-12, 40] },
  { id: "bolu", name: "Bolu", region: "Karadeniz", latitude: 40.7395, longitude: 31.6116 },
];

const mapProjection = {
  width: 1000,
  height: 460,
  minLongitude: 25.668945,
  maxLatitude: 42.093262,
  longitudeScale: 0.7775592920185117,
  scale: 61.96284560855099,
  offsetX: 38.72087151815305,
  offsetY: 36,
} as const;

export function projectTravelStop(stop: TravelStop): { x: number; y: number } {
  const x = mapProjection.offsetX
    + (stop.longitude - mapProjection.minLongitude) * mapProjection.longitudeScale * mapProjection.scale;
  const y = mapProjection.offsetY
    + (mapProjection.maxLatitude - stop.latitude) * mapProjection.scale;

  return {
    x: (x / mapProjection.width) * 100,
    y: (y / mapProjection.height) * 100,
  };
}

// Natural Earth 1:50m Admin 0 Countries, Turkey feature, simplified for display.
// Source and public-domain terms: naturalearthdata.com.
export const turkeyOutlinePath = "M53.2 157.3 L42.2 159.2 L38.7 157.3 L48.6 151.2 L53.6 154.7 L53.2 157.3 Z M801.9 71.7 L817.0 77.0 L822.0 73.0 L848.0 76.5 L854.8 67.9 L863.5 68.8 L865.1 73.2 L882.0 85.9 L880.5 87.3 L883.6 91.4 L894.6 94.1 L895.7 99.7 L904.2 108.1 L908.5 121.1 L905.9 130.1 L901.2 135.8 L907.9 155.4 L905.8 157.9 L919.1 164.3 L935.8 163.2 L941.2 166.0 L961.3 187.4 L950.2 180.0 L943.9 186.4 L940.7 201.5 L923.0 204.3 L925.7 214.1 L930.5 218.7 L928.9 228.0 L930.1 231.7 L935.0 237.8 L936.3 265.7 L943.6 268.9 L932.1 295.3 L938.1 297.6 L950.3 307.6 L948.2 310.8 L949.6 324.6 L960.2 333.6 L958.8 342.8 L951.1 340.7 L935.5 353.0 L931.6 348.4 L931.1 336.1 L927.4 332.9 L922.5 332.2 L914.0 337.7 L906.3 337.5 L878.2 328.8 L870.7 331.5 L862.9 328.6 L847.5 343.6 L842.8 344.9 L840.6 337.4 L835.3 333.2 L828.4 338.8 L802.2 346.1 L763.2 345.5 L730.0 362.4 L698.2 371.3 L669.8 370.6 L654.2 360.1 L642.1 357.7 L605.7 373.7 L587.8 373.1 L581.8 366.6 L568.2 363.8 L562.4 385.2 L567.1 399.1 L554.6 402.9 L553.2 413.3 L546.2 417.4 L542.6 424.0 L531.3 418.7 L534.4 413.7 L527.4 394.4 L545.5 372.7 L545.1 363.5 L538.8 357.1 L520.1 368.7 L514.2 376.6 L507.2 377.9 L474.0 362.9 L454.5 376.1 L437.9 395.3 L425.4 402.3 L388.5 407.6 L382.0 411.3 L369.5 407.3 L361.9 402.2 L344.8 380.4 L312.6 363.9 L278.4 359.9 L275.4 364.2 L274.3 381.0 L268.9 396.8 L266.1 398.5 L258.6 394.5 L232.4 403.8 L210.0 393.5 L206.1 388.9 L201.1 370.6 L197.7 369.2 L190.4 371.7 L174.3 363.7 L165.7 363.2 L160.5 371.0 L152.0 374.2 L155.1 367.0 L141.6 367.9 L134.4 371.8 L124.7 369.4 L125.3 367.3 L133.2 364.8 L151.3 362.0 L162.7 349.8 L119.7 350.4 L115.5 353.0 L114.9 346.7 L117.3 343.7 L128.6 341.4 L127.9 336.2 L113.4 327.5 L110.0 314.2 L106.1 310.8 L113.7 306.6 L115.1 296.9 L114.0 291.0 L97.0 286.2 L93.6 281.1 L87.6 277.3 L82.7 280.4 L68.7 272.5 L71.2 266.7 L74.7 266.8 L72.9 251.0 L75.9 249.9 L79.4 250.6 L82.9 255.1 L83.3 263.7 L87.2 268.8 L89.7 263.7 L96.2 266.5 L109.8 261.6 L101.4 261.9 L98.4 259.8 L91.5 245.7 L98.5 241.6 L103.5 234.7 L93.9 230.1 L95.8 220.5 L87.5 209.6 L98.6 195.6 L98.0 193.6 L60.1 198.7 L63.4 166.3 L69.8 164.2 L90.2 140.9 L103.4 141.1 L108.7 137.7 L116.6 137.5 L118.9 142.4 L125.8 145.9 L137.9 145.3 L143.7 142.1 L138.1 135.9 L145.0 133.9 L150.5 135.4 L147.6 142.1 L149.2 142.8 L165.0 140.7 L199.6 141.6 L201.9 139.4 L189.0 132.6 L201.8 125.5 L239.9 120.0 L216.8 115.6 L204.7 107.6 L201.4 103.3 L203.8 92.8 L206.3 90.0 L243.5 94.4 L264.0 91.5 L286.4 98.5 L307.9 97.1 L312.3 94.0 L317.6 83.9 L347.9 67.2 L358.5 58.5 L405.6 41.5 L476.3 44.5 L488.6 37.9 L495.8 40.1 L494.2 48.5 L502.6 58.6 L515.2 64.5 L532.6 59.5 L539.0 61.4 L545.1 77.3 L556.0 86.7 L561.0 87.5 L567.6 81.9 L573.9 81.2 L584.3 86.7 L587.8 92.3 L621.5 98.9 L628.5 103.6 L651.2 108.4 L701.6 97.1 L719.9 104.8 L742.0 106.1 L781.4 87.6 L797.3 77.5 L801.9 71.7 Z M151.7 43.7 L150.4 50.8 L160.6 69.4 L167.7 74.8 L202.0 89.5 L197.1 103.2 L188.6 105.3 L159.3 98.7 L147.4 104.3 L138.9 102.9 L126.9 105.4 L123.6 113.7 L115.3 123.1 L91.9 134.8 L70.6 158.1 L64.4 161.0 L67.2 153.2 L66.9 146.2 L76.2 138.1 L89.4 132.0 L92.8 126.9 L59.8 127.8 L56.5 120.7 L59.9 119.3 L70.6 106.6 L70.6 88.9 L83.7 81.8 L84.8 78.8 L82.7 66.5 L70.1 59.3 L70.4 55.9 L79.3 52.5 L84.3 44.0 L97.3 42.3 L103.4 38.1 L114.6 36.0 L128.6 46.7 L145.2 42.6 L151.7 43.7 Z";
