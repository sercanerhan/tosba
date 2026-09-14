const dialog = document.querySelector<HTMLDialogElement>("[data-farewell]");

if (dialog) {
  const finalFrame = dialog.querySelector<HTMLElement>("[data-farewell-final]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let revealTimer: number | undefined;

  const revealFinalFrame = () => {
    finalFrame?.removeAttribute("inert");
    finalFrame?.removeAttribute("aria-hidden");
  };

  if (reducedMotion) {
    revealFinalFrame();
  } else {
    revealTimer = window.setTimeout(revealFinalFrame, 3_760);
  }

  const closeCurtain = () => {
    if (!dialog.open || dialog.dataset.closing === "true") return;

    const finish = () => {
      if (revealTimer) window.clearTimeout(revealTimer);
      dialog.close();
      delete dialog.dataset.closing;
      document.querySelector<HTMLElement>("#ana-icerik")?.focus({ preventScroll: true });
    };

    if (reducedMotion) {
      finish();
      return;
    }

    dialog.dataset.closing = "true";
    window.setTimeout(finish, 240);
  };

  dialog.querySelectorAll<HTMLButtonElement>("[data-farewell-close], [data-farewell-enter]")
    .forEach((button) => button.addEventListener("click", closeCurtain));

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeCurtain();
  });

  if (!dialog.open) dialog.showModal();
}
