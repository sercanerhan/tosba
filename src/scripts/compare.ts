document.querySelectorAll<HTMLElement>("[data-compare]").forEach((compare) => {
  const before = compare.querySelector<HTMLElement>("[data-compare-before]");
  const range = compare.querySelector<HTMLInputElement>("[data-compare-range]");
  if (!before || !range) return;
  const update = () => { before.style.width = `${range.value}%`; };
  range.addEventListener("input", update);
  update();
});
