document.querySelectorAll<HTMLElement>("[data-travel-map]").forEach((map) => {
  const controls = [...map.querySelectorAll<HTMLButtonElement>("[data-travel-control]")];
  const markers = [...map.querySelectorAll<HTMLElement>("[data-travel-marker]")];
  const activeName = map.querySelector<HTMLElement>("[data-travel-active-name]");
  const activeRegion = map.querySelector<HTMLElement>("[data-travel-active-region]");
  const supportsHover = window.matchMedia("(hover: hover)");

  function setActive(control: HTMLButtonElement) {
    const id = control.dataset.travelControl;
    if (!id) return;

    controls.forEach((item) => item.setAttribute("aria-pressed", String(item === control)));
    markers.forEach((marker) => marker.setAttribute("data-active", String(marker.dataset.travelMarker === id)));

    if (activeName) activeName.textContent = control.dataset.travelName ?? "";
    if (activeRegion) activeRegion.textContent = control.dataset.travelRegion ?? "";
  }

  controls.forEach((control) => {
    control.addEventListener("click", () => setActive(control));
    control.addEventListener("focus", () => setActive(control));
    control.addEventListener("pointerenter", () => {
      if (supportsHover.matches) setActive(control);
    });
  });
});
