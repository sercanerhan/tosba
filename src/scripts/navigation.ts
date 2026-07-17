const header = document.querySelector<HTMLElement>("[data-site-header]");
const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
const menuButton = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const mobileMenu = document.querySelector<HTMLElement>("[data-mobile-menu]");
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>(".site-header nav a[href^='#']")];

let ticking = false;

function updateScrollUi() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const ratio = Math.min(1, Math.max(0, window.scrollY / max));
  progress?.style.setProperty("transform", `scaleX(${ratio})`);
  header?.setAttribute("data-scrolled", String(window.scrollY > 24));
  ticking = false;
}

function closeMenu() {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.querySelector("span")!.textContent = "Menü";
  mobileMenu.hidden = true;
  document.body.removeAttribute("data-menu-open");
}

menuButton?.addEventListener("click", () => {
  if (!mobileMenu) return;
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.querySelector("span")!.textContent = willOpen ? "Kapat" : "Menü";
  mobileMenu.hidden = !willOpen;
  document.body.toggleAttribute("data-menu-open", willOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScrollUi);
}, { passive: true });

const sections = navLinks
  .map((link) => document.querySelector<HTMLElement>(link.hash))
  .filter((section): section is HTMLElement => Boolean(section));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.toggleAttribute("aria-current", link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: "-30% 0px -60%", threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

updateScrollUi();
