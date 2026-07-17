import type { Hotspot, HotspotMode } from "../data/hotspots";

const root = document.querySelector<HTMLElement>("[data-atlas]");

if (root) {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-atlas-tab]")];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-atlas-panel]")];
  const points = [...root.querySelectorAll<HTMLButtonElement>("[data-hotspot]")];
  const detail = root.querySelector<HTMLElement>("[data-atlas-detail]");
  const sheet = root.querySelector<HTMLDialogElement>("[data-atlas-sheet]");
  const close = root.querySelector<HTMLButtonElement>("[data-atlas-close]");
  let origin: HTMLButtonElement | null = null;

  const sourceLabel = (source: string) => source === "fotograf" ? "Fotoğraf" : source === "servis_belgesi" ? "Servis belgesi" : "Satıcı beyanı";

  function writeSources(target: Element | null, sources: string[]) {
    if (!target) return;
    target.replaceChildren(...sources.map((source) => {
      const li = document.createElement("li");
      li.className = "source-tag";
      li.textContent = sourceLabel(source);
      return li;
    }));
  }

  function updateContent(hotspot: Hotspot, index: number) {
    const modeLabel = tabs.find((tab) => tab.dataset.atlasTab === hotspot.mode)?.querySelector("span")?.textContent ?? "Araç";
    detail?.querySelector<HTMLElement>("[data-detail-index]")?.replaceChildren(String(index + 1).padStart(2, "0"));
    detail?.querySelector<HTMLElement>("[data-detail-title]")?.replaceChildren(hotspot.title);
    detail?.querySelector<HTMLElement>("[data-detail-summary]")?.replaceChildren(hotspot.summary);
    detail?.querySelector<HTMLElement>("[data-detail-text]")?.replaceChildren(hotspot.detail);
    detail?.querySelector<HTMLElement>("[data-detail-mode]")?.replaceChildren(modeLabel);
    writeSources(detail?.querySelector("[data-detail-sources]") ?? null, hotspot.sources);

    sheet?.querySelector<HTMLElement>("[data-sheet-title]")?.replaceChildren(hotspot.title);
    sheet?.querySelector<HTMLElement>("[data-sheet-summary]")?.replaceChildren(hotspot.summary);
    sheet?.querySelector<HTMLElement>("[data-sheet-text]")?.replaceChildren(hotspot.detail);
    sheet?.querySelector<HTMLElement>("[data-sheet-mode]")?.replaceChildren(modeLabel);
    writeSources(sheet?.querySelector("[data-sheet-sources]") ?? null, hotspot.sources);
  }

  function activatePoint(button: HTMLButtonElement, openSheet = true) {
    const hotspot = JSON.parse(button.dataset.hotspot ?? "{}") as Hotspot;
    const visiblePoints = points.filter((point) => point.closest<HTMLElement>("[data-atlas-panel]")?.hidden === false);
    points.forEach((point) => {
      const selected = point === button;
      point.classList.toggle("hotspot--active", selected);
      point.setAttribute("aria-expanded", String(selected));
    });
    updateContent(hotspot, Math.max(0, visiblePoints.indexOf(button)));
    origin = button;
    if (openSheet && window.matchMedia("(max-width: 900px)").matches && sheet && !sheet.open) sheet.showModal();
  }

  function activateTab(tab: HTMLButtonElement, focus = false) {
    const mode = tab.dataset.atlasTab as HotspotMode;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.atlasPanel !== mode; });
    const first = points.find((point) => point.closest<HTMLElement>("[data-atlas-panel]")?.dataset.atlasPanel === mode);
    if (first) activatePoint(first, false);
    if (focus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (!(["ArrowLeft", "ArrowRight", "Home", "End"] as string[]).includes(event.key)) return;
      event.preventDefault();
      let next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : index + (event.key === "ArrowRight" ? 1 : -1);
      next = (next + tabs.length) % tabs.length;
      activateTab(tabs[next]!, true);
    });
  });
  points.forEach((point) => point.addEventListener("click", () => activatePoint(point)));
  close?.addEventListener("click", () => sheet?.close());
  sheet?.addEventListener("close", () => origin?.focus());
}
