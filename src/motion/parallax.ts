import type { MotionModule } from "./engine";

// The picture drifts by this share of its own height. It is also grown by twice that plus a margin, so the figure's clip
// never shows an empty band (the clip is pixel-snapped, the picture's edge is not). The growth runs ahead of the drift
// (ease-out), so the margin is there from the first scrolled pixel; both are zero at scroll 0, where the picture is
// exactly the server's.
const SHIFT = 6;
const MARGIN = 0.01;

export const parallax: MotionModule = ({ gsap }) => {
  const figure = document.querySelector<HTMLElement>("[data-motion-parallax]");
  const image = figure?.querySelector<HTMLElement>("img");
  if (!figure || !image) return undefined;

  // `next/image` puts an inline style on the picture; cleanup puts that exact attribute back.
  const serverStyle = image.getAttribute("style");
  let timeline: gsap.core.Timeline | undefined;

  const release = () => {
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = undefined;
    figure.removeAttribute("data-parallax-ready");
    if (serverStyle === null) image.removeAttribute("style");
    else image.setAttribute("style", serverStyle);
  };

  // Everything that can throw comes first and the takeover is marked ready last: a failure leaves the plain picture.
  try {
    timeline = gsap.timeline({ scrollTrigger: { trigger: figure, start: 0, end: "bottom top", scrub: true } });
    timeline.fromTo(image, { yPercent: 0 }, { yPercent: SHIFT, ease: "none", duration: 1 }, 0);
    timeline.fromTo(image, { scale: 1 }, { scale: 1 + (2 * SHIFT) / 100 + MARGIN, ease: "power2.out", duration: 1 }, 0);
    figure.setAttribute("data-parallax-ready", "");
  } catch (error) {
    release();
    console.warn("The cover parallax could not start; the cover stays still.", error);
    return undefined;
  }
  return release;
};
