/* =========================================================
   JG Institute — motion layer (progressive enhancement)
   GSAP + ScrollTrigger: hero / page-hero entrances, gentle parallax, cube tilt.
   Swiper: testimonials and Meet the Experts sliders.
   Loaded with `defer` after GSAP (and before Swiper). If a library fails to load, or the
   visitor prefers reduced motion, the page keeps its plain CSS behaviour.
   ========================================================= */
(function () {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const endIntro = () => root.classList.remove("js-intro");

  /* ---------- Sliders (Swiper) ----------
     Swiper is deferred after this file (so it never delays the hero), and has run by DOMContentLoaded.
     toSwiper() turns a plain container into a slider: its children become slides, and dots are
     added to `nav`, whose [data-dir="-1|1"] buttons become prev / next. */
  const toSwiper = (el, nav, label, options) => {
    const wrapper = document.createElement("div");
    wrapper.className = "swiper-wrapper";
    [...el.children].forEach((slide) => { slide.classList.add("swiper-slide"); wrapper.appendChild(slide); });
    el.appendChild(wrapper);
    el.classList.add("swiper");
    const dots = document.createElement("div");
    dots.className = "carousel__dots";
    nav.prepend(dots);
    return new window.Swiper(el, Object.assign({
      speed: reduce ? 0 : 700, grabCursor: true, watchSlidesProgress: true,
      navigation: { prevEl: nav.querySelector('[data-dir="-1"]'), nextEl: nav.querySelector('[data-dir="1"]') },
      pagination: { el: dots, clickable: true },
      keyboard: { enabled: true, onlyInViewport: true },
      a11y: { prevSlideMessage: `Previous ${label}`, nextSlideMessage: `Next ${label}`, paginationBulletMessage: `Go to ${label} {{index}}` }
    }, options));
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.Swiper) return;

    /* Testimonials: upgrade the scroll-snap carousel */
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      const track = carousel.querySelector(".t-track");
      const nav = carousel.querySelector(".carousel__nav");
      if (!track || !nav) return;
      const slider = toSwiper(track, nav, "testimonial", {
        slidesPerView: 1.1, spaceBetween: 16, rewind: true,
        breakpoints: { 681: { slidesPerView: 2, spaceBetween: 19 } },
        autoplay: reduce ? false : { delay: 6000, pauseOnMouseEnter: true, disableOnInteraction: true }
      });
      /* Keyboard and screen-reader users get a still slider */
      track.addEventListener("focusin", () => slider.autoplay && slider.autoplay.stop());
    });

    /* Meet the Experts: endless right-to-left slide, one step every 3 seconds (0.6s move + 2.4s pause).
       Pauses while a card is hovered, focused or its profile is open. */
    const experts = document.querySelector(".experts");
    if (experts) {
      const nav = document.createElement("div");
      nav.className = "carousel__nav";
      nav.innerHTML = `
        <button class="carousel__btn" type="button" data-dir="-1" aria-label="Previous expert"><i data-icon="chevron-l"></i></button>
        <button class="carousel__btn" type="button" data-dir="1" aria-label="Next expert"><i data-icon="chevron-r"></i></button>`;
      window.renderIcons && window.renderIcons(nav);
      experts.after(nav);
      const slider = toSwiper(experts, nav, "expert", {
        slidesPerView: 1.15, spaceBetween: 16, loop: true, speed: reduce ? 0 : 600,
        breakpoints: { 681: { slidesPerView: 2, spaceBetween: 20 }, 1025: { slidesPerView: 3, spaceBetween: 22 } },
        autoplay: reduce ? false : { delay: 2400, pauseOnMouseEnter: true, disableOnInteraction: false }
      });
      if (slider.autoplay && slider.params.autoplay) {
        slider.autoplay.stop(); // start from the first expert when the section comes into view
        new IntersectionObserver(([e], io) => {
          if (!e.isIntersecting) return;
          experts.querySelectorAll(".reveal").forEach((card) => card.classList.add("in"));
          slider.autoplay.start(); io.disconnect();
        }, { threshold: 0.25 }).observe(experts);
        experts.addEventListener("focusin", () => slider.autoplay.pause());
        experts.addEventListener("focusout", () => slider.autoplay.resume());
        const profile = document.querySelector("dialog.modal--expert");
        experts.addEventListener("click", (e) => e.target.closest(".expert__open") && slider.autoplay.pause());
        profile && profile.addEventListener("close", () => slider.autoplay.resume());
      } else experts.querySelectorAll(".reveal").forEach((card) => card.classList.add("in"));
    }
  });

  /* ---------- GSAP ---------- */
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  if (!gsap || reduce) { endIntro(); return; }
  const intro = root.classList.contains("js-intro"); // false if <head> already gave up waiting
  window.JG_MOTION = true;
  if (ST) gsap.registerPlugin(ST);
  const mm = gsap.matchMedia();
  const scrubAway = (trigger) => ({ trigger, start: "top top", end: "bottom top", scrub: true });

  /* Home hero: copy rises line by line while the intelligence cube assembles */
  const hero = document.querySelector(".hero");
  if (hero) {
    const q = (s) => hero.querySelectorAll(s);
    if (intro) {
      const tiles = q(".tile");
      gsap.set(tiles, { transition: "none" });
      /* ~1.8s in total; the copy is readable within the first second */
      gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 }, onComplete: endIntro })
        .fromTo(q(".pill"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
        .fromTo(q("h1 .line > span"), { opacity: 0, yPercent: 110 }, { opacity: 1, yPercent: 0, duration: 0.95, stagger: 0.1, ease: "power4.out" }, 0.1)
        .fromTo(q(".hero__sub, .hero__lead"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.08 }, 0.45)
        .fromTo(q(".hero__points li"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.55 }, 0.65)
        .fromTo(q(".btn-row"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
        .fromTo(tiles, { opacity: 0, scale: 0.6, y: 24 }, {
          opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.5)",
          stagger: { each: 0.06, grid: [3, 3], from: "center" }, clearProps: "transform,transition"
        }, 0.3)
        .fromTo(q(".hero-chip"), { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.15 }, 1)
        .fromTo(q(".marquee"), { opacity: 0 }, { opacity: 1, duration: 0.7 }, 1.1);
    }

    /* Cube follows the pointer a little (mouse / trackpad only) */
    const tilt = hero.querySelector(".cube-tilt");
    if (tilt && finePointer) {
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3" });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3" });
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
      });
      hero.addEventListener("pointerleave", () => { rx(0); ry(0); });
    }

    /* Depth while scrolling away: cube lags behind, copy drifts up */
    if (ST) mm.add("(min-width: 901px)", () => {
      gsap.to(hero.querySelector(".cube-wrap"), { yPercent: 12, ease: "none", scrollTrigger: scrubAway(hero) });
      gsap.to(hero.querySelector(".hero__grid > :first-child"), { y: -40, ease: "none", scrollTrigger: scrubAway(hero) });
    });
  }

  /* Inner page hero: copy staggers in, illustration unmasks, floating card pops */
  const pageHero = document.querySelector(".page-hero");
  if (pageHero) {
    if (intro) {
      const img = pageHero.querySelector(".page-hero__visual img");
      const card = pageHero.querySelector(".float-card");
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.85 }, onComplete: endIntro })
        .fromTo(pageHero.querySelectorAll(".split > :first-child > *"), { opacity: 0, y: 22 }, { opacity: 1, y: 0, stagger: 0.09 });
      if (img) tl.fromTo(img,
        { opacity: 0, scale: 1.06, clipPath: "inset(10% 10% 10% 10% round 24px)" },
        { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.2, ease: "power4.out", clearProps: "clipPath,transform" }, 0.15);
      if (card) tl.fromTo(card, { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.6)", clearProps: "transform" }, "-=0.6");
    }
    const visual = pageHero.querySelector(".page-hero__visual");
    if (ST && visual) mm.add("(min-width: 901px)", () => {
      gsap.to(visual, { y: 50, ease: "none", scrollTrigger: scrubAway(pageHero) });
    });
  }

  if (!hero && !pageHero) endIntro();
})();
