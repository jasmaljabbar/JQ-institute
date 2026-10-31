/* =========================================================
   JG Institute — home hero: background video scrubbing + A.R.I.A greeting (home page only)
   · Moving the mouse (or swiping) left / right moves the hero video forwards / backwards.
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

  /* ---------- Hero video scrubbing ---------- */
  const video = document.querySelector(".hero__video");
  const hero = video && video.closest(".hero");
  if (video && hero) {
    const SENSITIVITY = 0.8; // a full-width sweep moves through 80% of the clip
    let ready = false, inView = true, target = 0, lastX = null;

    /* One seek at a time: when it lands ("seeked"), jump straight to wherever the pointer is now.
       Checking video.seeking (not a flag of our own) also recovers from seeks the browser drops
       without a "seeked" event, e.g. before a file from a server without range support is fully loaded. */
    const seek = () => {
      const s = video.seekable, to = Math.min(target, s.length ? s.end(s.length - 1) : 0);
      if (!ready || video.seeking || Math.abs(video.currentTime - to) < 0.01) return;
      video.currentTime = to;
    };
    video.addEventListener("seeked", seek);
    video.addEventListener("canplaythrough", seek);

    /* A server without range support (e.g. `python3 -m http.server`) leaves the file unseekable;
       reload it from a blob, which always is (usually straight from the HTTP cache) */
    video.addEventListener("canplaythrough", () => {
      const s = video.seekable;
      if (s.length && s.end(s.length - 1) > 0) return;
      fetch(video.currentSrc).then((r) => r.blob()).then((b) => { video.src = URL.createObjectURL(b); }).catch(() => {});
    }, { once: true });

    /* Wait for the duration before seeking; the first small seek also paints a frame on iOS */
    const onMeta = () => {
      if (ready || !isFinite(video.duration)) return;
      ready = true; target = 0.01; seek();
    };
    if (video.readyState >= 1) onMeta(); else video.addEventListener("loadedmetadata", onMeta);

    const scrub = (x) => {
      if (lastX === null || !ready || !inView) { lastX = x; return; }
      const dx = x - lastX;
      lastX = x;
      target = Math.min(Math.max(target + (dx / window.innerWidth) * video.duration * SENSITIVITY, 0), video.duration);
      seek();
    };

    if (!reduce) {
      window.addEventListener("mousemove", (e) => scrub(e.clientX), { passive: true });
      document.documentElement.addEventListener("mouseleave", () => (lastX = null));
      /* Touch: horizontal swipes on the hero scrub; vertical scrolling is left alone */
      hero.addEventListener("touchstart", (e) => (lastX = e.touches[0].clientX), { passive: true });
      hero.addEventListener("touchmove", (e) => scrub(e.touches[0].clientX), { passive: true });
    }

    /* Hide the fixed video while the hero is off screen */
    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      video.classList.toggle("is-away", !inView);
    }).observe(hero);
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
