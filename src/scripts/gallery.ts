import PhotoSwipeLightbox from "photoswipe/lightbox";

const root = document.querySelector<HTMLElement>("[data-gallery]");

if (root) {
  const filters = [...root.querySelectorAll<HTMLButtonElement>("[data-gallery-filter]")];
  const items = [...root.querySelectorAll<HTMLElement>("[data-gallery-item]")];

  filters.forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.galleryFilter ?? "today";
    filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    items.forEach((item) => {
      const category = item.dataset.galleryItem;
      item.hidden = category !== filter;
    });
  }));

  const lightbox = new PhotoSwipeLightbox({
    pswpModule: () => import("photoswipe"),
    bgOpacity: 0.94,
    showHideAnimationType: "fade",
    wheelToZoom: true,
  });
  lightbox.init();
  root.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>(".gallery-card__link") : null;
    if (!target) return;
    event.preventDefault();
    const links = [...root.querySelectorAll<HTMLAnchorElement>(".gallery-card:not([hidden]) .gallery-card__link")];
    const index = links.indexOf(target);
    if (index < 0) return;
    lightbox.loadAndOpen(index, links.map((link) => ({
      src: link.href,
      width: Number(link.dataset.pswpWidth),
      height: Number(link.dataset.pswpHeight),
      alt: link.querySelector("img")?.alt ?? "",
      element: link,
    })));
  });
  root.dataset.galleryReady = "true";
}
