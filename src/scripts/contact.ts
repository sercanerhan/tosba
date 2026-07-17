const contact = document.querySelector<HTMLElement>("[data-contact]");

if (contact) {
  const topics = [...contact.querySelectorAll<HTMLButtonElement>("[data-contact-topic]")];
  const action = contact.querySelector<HTMLButtonElement>("[data-whatsapp-action]");
  const dialog = contact.querySelector<HTMLDialogElement>("[data-contact-dialog]");
  const close = contact.querySelector<HTMLButtonElement>("[data-contact-close]");
  let selected = topics[0]?.dataset.contactTopic ?? "Genel bilgi";

  topics.forEach((topic) => topic.addEventListener("click", () => {
    selected = topic.dataset.contactTopic ?? "Genel bilgi";
    topics.forEach((item) => item.setAttribute("aria-pressed", String(item === topic)));
  }));

  action?.addEventListener("click", () => {
    const phone = (contact.dataset.whatsapp ?? "").replace(/\D/g, "");
    if (!phone) {
      dialog?.showModal();
      return;
    }
    const message = `Merhaba, 2012 Golf 1.4 TSI ilanınızla ilgileniyorum. Konu: ${selected}. Uygun olduğunuzda bilgi alabilir miyim?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });

  close?.addEventListener("click", () => dialog?.close());
}
