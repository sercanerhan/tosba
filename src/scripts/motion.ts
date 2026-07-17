async function startMotion() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);

  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();

  media.add({
    animated: "(prefers-reduced-motion: no-preference)",
    desktop: "(min-width: 901px)",
  }, (context) => {
    if (!context.conditions?.animated) return;

    if (context.conditions.desktop) {
      gsap.to("[data-hero-media] img", {
        yPercent: 10,
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: .8 },
      });
    }

    gsap.utils.toArray<HTMLElement>("[data-reveal-media], [data-reveal-record]").forEach((element) => {
      gsap.from(element, {
        y: 48,
        opacity: 0,
        duration: .9,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      });
    });

    const events = gsap.utils.toArray<HTMLElement>("[data-timeline-event]");
    if (events.length) {
      gsap.to("[data-timeline-progress]", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: "[data-timeline]", start: "top 60%", end: "bottom 70%", scrub: true },
      });
      events.forEach((event) => gsap.from(event.querySelector(".timeline__body"), {
        x: 24,
        opacity: 0,
        duration: .65,
        scrollTrigger: { trigger: event, start: "top 82%", once: true },
      }));
    }
  });

  media.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set("[data-hero-copy] > *, [data-hero-facts], [data-hero-date], [data-reveal-media], [data-reveal-record], [data-timeline-event] .timeline__body", { clearProps: "all" });
  });
}

window.addEventListener("scroll", () => void startMotion(), { once: true, passive: true });
