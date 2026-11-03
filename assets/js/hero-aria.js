/* =========================================================
   JG Institute — home hero: background video autoplay + A.R.I.A greeting (home page only)
   · The hero video (looping AI-brain animation) autoplays once the hero scrolls into view and
     pauses when it's off-screen or the tab is backgrounded, to save battery/CPU.
   · [data-typewriter] lines type themselves out when they come into view
     (optional data-speed / data-delay in ms; defaults 38 / 600).
   · The A.R.I.A quick-action pills fade in; [data-copy-email] copies SITE.email.
   Plain JS, no libraries. Visitors who prefer reduced motion get a still frame and the full text.
   ========================================================= */
(function () {
  const S = window.SITE || {};
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const whenVisible = (el, threshold = 0.3) => new Promise((resolve) => {
    if (!("IntersectionObserver" in window)) return resolve();
    new IntersectionObserver(([e], io) => { if (e.isIntersecting) { io.disconnect(); resolve(); } }, { threshold }).observe(el);
  });

  /* ---------- Hero video autoplay ---------- */
  const video = document.querySelector(".hero__video");
  const hero = video && video.closest(".hero");
  if (video && hero) {
    if (reduce) {
      video.removeAttribute("loop"); // reduced motion: hold on the poster frame, never play
    } else {
      let inView = false;
      const play = () => { if (inView && !document.hidden) video.play().catch(() => {}); };
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([e]) => {
          inView = e.isIntersecting;
          if (inView) play(); else video.pause();
        }, { threshold: 0.15 }).observe(hero);
      } else { inView = true; play(); }
      document.addEventListener("visibilitychange", () => { if (document.hidden) video.pause(); else play(); });
    }
  }

  /* ---------- Typewriter ----------
     Types el's own text one character at a time behind a blinking cursor, `delay` ms after `start`
     (a promise) settles; resolves when done. The full line stays in the page for screen readers
     and keeps the box at its final height. */
  const typewriter = (el, { speed = 38, delay = 600, start } = {}) => new Promise((resolve) => {
    const chars = [...el.textContent.trim()];
    if (reduce || !chars.length) return resolve();
    const span = (cls, text) => {
      const s = document.createElement("span");
      s.className = cls;
      if (text) s.textContent = text;
      if (cls !== "sr-only") s.setAttribute("aria-hidden", "true");
      return s;
    };
    const out = span("tw__out"), cursor = span("tw__cursor"), typed = document.createTextNode("");
    out.append(typed, cursor);
    el.textContent = "";
    el.classList.add("tw");
    el.append(span("sr-only", chars.join("")), span("tw__ghost", chars.join("")), out);
    let i = 0;
    const tick = () => {
      typed.data = chars.slice(0, ++i).join("");
      if (i < chars.length) setTimeout(tick, speed);
      else { cursor.remove(); resolve(); }
    };
    Promise.resolve(start).then(() => setTimeout(tick, delay));
  });

  document.querySelectorAll("[data-typewriter]").forEach((el) =>
    typewriter(el, { speed: +el.dataset.speed || 38, delay: +el.dataset.delay || 600, start: whenVisible(el) }));

  /* ---------- A.R.I.A quick actions ---------- */
  const band = document.querySelector(".aria");
  if (band) {
    band.classList.add("is-armed"); // CSS hides the pills only once JS is here to bring them back
    whenVisible(band).then(() => setTimeout(() => band.classList.add("is-on"), 400));
  }

  /* E-mail pill: copy the address; if the clipboard is unavailable or blocked, open the mail app instead */
  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    const label = btn.querySelector(".aria__label") || btn;
    const status = btn.parentElement.querySelector('[role="status"]');
    const email = S.email || label.textContent.split(":").pop().trim();
    let timer;
    const show = (text, copied) => {
      clearTimeout(timer);
      btn.style.minWidth = `${btn.offsetWidth}px`; // the shorter label shouldn't reflow the row
      if (!btn.dataset.label) btn.dataset.label = label.textContent;
      label.textContent = text;
      btn.classList.toggle("is-copied", copied);
      if (status) status.textContent = text;
      timer = setTimeout(() => {
        label.textContent = btn.dataset.label;
        btn.classList.remove("is-copied");
        btn.style.minWidth = "";
        if (status) status.textContent = "";
      }, 2200);
    };
    btn.addEventListener("click", async () => {
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(email);
        show("Email copied!", true);
      } catch (err) {
        show("Opening your e-mail app…", false);
        location.href = `mailto:${email}`;
      }
    });
  });
})();
