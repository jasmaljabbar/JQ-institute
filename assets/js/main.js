/* =========================================================
   JG Institute — interactions
   Header state · light/dark theme · mobile menu · dropdown · scroll reveal · filters · lightbox · tabs · modals ·
   expert profiles · stat counters · card spotlight · carousel · batch bar · WhatsApp prompt · enquiry forms
   (GSAP/Swiper enhancements are in motion.js; everything here works without them.)
   ========================================================= */
(function () {
  document.documentElement.classList.remove("no-js");
  const S = window.SITE || {};

  /* Header shadow on scroll */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* Light / dark theme. <head> already applied the saved choice (or the device setting);
     the header button switches and remembers it, with a circular reveal where supported. */
  const root = document.documentElement;
  const themeBtn = document.querySelector(".theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const savedTheme = () => { try { return localStorage.getItem("jg-theme"); } catch (e) { return null; } };
  const applyTheme = (t) => {
    root.setAttribute("data-theme", t);
    if (themeMeta) themeMeta.content = t === "light" ? "#FFFFFF" : "#0A0A0A";
    if (themeBtn) themeBtn.setAttribute("aria-pressed", String(t === "dark"));
  };
  applyTheme(root.getAttribute("data-theme") || "dark");
  if (themeBtn) themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    try { localStorage.setItem("jg-theme", next); } catch (e) { /* storage blocked */ }
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return applyTheme(next);
    const r = themeBtn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => applyTheme(next)).ready.then(() => {
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(.22,.8,.26,1)", pseudoElement: "::view-transition-new(root)" });
    }).catch(() => {});
  });
  /* No saved choice yet: follow the device if it switches (e.g. sunset auto dark mode) */
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    if (!savedTheme()) applyTheme(e.matches ? "light" : "dark");
  });

  /* Mobile menu */
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav__toggle");
  if (nav && toggle) {
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.innerHTML = `<i data-icon="${open ? "x" : "menu"}"></i>`;
      window.renderIcons(toggle);
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    nav.querySelectorAll(".nav__links a, .nav__links [data-modal]").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
    window.addEventListener("resize", () => window.innerWidth > 1100 && setOpen(false));
  }

  /* Programs dropdown (click for touch/keyboard; hover handled in CSS) */
  document.querySelectorAll(".nav__dd").forEach((dd) => {
    const btn = dd.querySelector(".nav__dd-btn");
    const set = (open) => { dd.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open)); };
    btn.addEventListener("click", () => set(!dd.classList.contains("open")));
    document.addEventListener("click", (e) => !dd.contains(e.target) && set(false));
    dd.addEventListener("keydown", (e) => { if (e.key === "Escape") { set(false); btn.focus(); } });
  });

  /* Scroll reveal — items entering together are staggered unless they set their own --d */
  document.querySelectorAll(".gallery:not(.reveal) > .g-item").forEach((el) => el.classList.add("reveal"));
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      let n = 0;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (!e.target.style.getPropertyValue("--d")) e.target.style.setProperty("--d", `${Math.min(n++, 6) * 0.07}s`);
        e.target.classList.add("in"); io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("in"));

  /* Filters (gallery + projects): <div class="filters" data-filter-for="#grid"> buttons with data-filter */
  document.querySelectorAll("[data-filter-for]").forEach((bar) => {
    const grid = document.querySelector(bar.dataset.filterFor);
    if (!grid) return;
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      bar.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      const f = btn.dataset.filter;
      grid.querySelectorAll("[data-cat]").forEach((item) => {
        item.classList.toggle("is-hidden", f !== "all" && !item.dataset.cat.split(" ").includes(f));
      });
      /* Ease the remaining items back in, one after another */
      const shown = grid.querySelectorAll("[data-cat]:not(.is-hidden)");
      shown.forEach((item) => item.classList.remove("is-entering"));
      void grid.offsetWidth; // restart the animation
      shown.forEach((item, i) => {
        item.style.setProperty("--fd", `${Math.min(i, 8) * 0.04}s`);
        item.classList.add("in", "is-entering");
      });
    });
    grid.addEventListener("animationend", (e) => e.animationName === "itemIn" && e.target.classList.remove("is-entering"));
  });

  /* Lightbox */
  const lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    const img = lb.querySelector("img"), cap = lb.querySelector("p");
    let items = [], idx = 0;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const it = items[idx], im = it.querySelector("img");
      img.src = it.dataset.full || im.src; img.alt = im.alt;
      cap.textContent = it.querySelector("figcaption")?.textContent || "";
      if (lb.open && img.animate && !matchMedia("(prefers-reduced-motion: reduce)").matches)
        img.animate([{ opacity: 0, transform: "scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 350, easing: "cubic-bezier(.22,.8,.26,1)" });
    };
    document.querySelectorAll("figure.g-item").forEach((el) => {
      const open = () => {
        items = [...document.querySelectorAll(".g-item:not(.is-hidden)")];
        show(items.indexOf(el)); lb.showModal();
      };
      el.addEventListener("click", open);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    lb.querySelector(".lb-close").addEventListener("click", () => lb.close());
    lb.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
    lb.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => e.target === lb && lb.close());
    lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
  }

  /* Tabs */
  document.querySelectorAll("[role=tablist]").forEach((list) => {
    const tabs = [...list.querySelectorAll("[role=tab]")];
    tabs.forEach((t) => t.addEventListener("click", () => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
    }));
  });

  /* Modals: any [data-modal="enquiry"] opens the Book Free Demo dialog; data-program pre-selects a program */
  const store = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  };
  const openDialog = (dlg) => {
    if (!dlg || typeof dlg.showModal !== "function") return false;
    document.querySelectorAll("dialog.modal[open]").forEach((d) => d.close());
    dlg.showModal(); document.body.classList.add("modal-open");
    return true;
  };
  document.querySelectorAll("dialog.modal").forEach((dlg) => {
    dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
    dlg.addEventListener("close", () => { if (!document.querySelector("dialog.modal[open]")) document.body.classList.remove("modal-open"); });
  });
  const enquiry = document.getElementById("enquiry-modal");
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest('[data-modal="enquiry"]');
    if (!trigger) return;
    e.preventDefault();
    const sel = enquiry && enquiry.querySelector('select[name="program"]');
    if (sel && trigger.dataset.program) {
      const opt = [...sel.options].find((o) => o.value === trigger.dataset.program || o.textContent === trigger.dataset.program);
      if (opt) sel.value = opt.value;
    }
    if (openDialog(enquiry)) setTimeout(() => enquiry.querySelector("input")?.focus(), 60);
    else location.href = "admissions.html#enquiry";
  });

  /* Expert profiles: clicking a .expert card opens a profile dialog built from the card's content */
  const experts = document.querySelectorAll(".expert");
  if (experts.length) {
    const dlg = document.createElement("dialog");
    dlg.className = "modal modal--expert";
    dlg.setAttribute("aria-labelledby", "expert-modal-name");
    document.body.appendChild(dlg);
    dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
    dlg.addEventListener("close", () => { if (!document.querySelector("dialog.modal[open]")) document.body.classList.remove("modal-open"); });
    const html = (card, sel) => card.querySelector(sel)?.innerHTML || "";
    const text = (card, sel) => card.querySelector(sel)?.textContent.trim() || "";
    experts.forEach((card) => card.querySelector(".expert__open")?.addEventListener("click", () => {
      const name = text(card, ".expert__name"), first = name.split(" ")[0];
      const img = card.querySelector(".expert__img");
      dlg.style.setProperty("--c", getComputedStyle(card).getPropertyValue("--c"));
      dlg.innerHTML = `
        <button class="modal__close" type="button" data-close aria-label="Close"><i data-icon="x"></i></button>
        <div class="modal__grid">
          <div class="modal__photo">
            <img src="${img.src}" alt="${img.alt}" width="600" height="750">
            <div class="expert__exp" style="top:1rem;left:1rem">${html(card, ".expert__exp")}</div>
          </div>
          <div class="modal__body">
            <span class="expert__role">${text(card, ".expert__role")}</span>
            <h2 id="expert-modal-name">${name}</h2>
            <p class="expert__cred">${text(card, ".expert__cred")}</p>
            <p class="expert__hook">${text(card, ".expert__hook")}</p>
            <p class="m-bio">${text(card, ".expert__bio")}</p>
            <div class="expert__skills">${html(card, ".expert__skills")}</div>
            <div class="m-actions">
              <button class="btn" type="button" data-modal="enquiry" data-program="${card.dataset.program || ""}">Book a demo with ${first} <i data-icon="arrow"></i></button>
              ${card.querySelector(".expert__socials") ? `<div class="socials">${html(card, ".expert__socials")}</div>` : ""}
            </div>
          </div>
        </div>`;
      window.renderIcons(dlg);
      openDialog(dlg);
    }));
  }

  /* Stat counters: <b data-count="500" data-suffix="+" data-decimals="1"> */
  const counters = document.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0), suf = el.dataset.suffix || "";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = end.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1), v = end * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } }), { threshold: .6 });
    counters.forEach((el) => co.observe(el));
  } else counters.forEach(runCount);

  /* Card spotlight: pass the pointer position to CSS (--mx / --my) */
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest && e.target.closest(".course, .program, .card, .cat-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* Carousel: [data-carousel] with .t-track and [data-dir="-1|1"] buttons */
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector(".t-track");
    const prev = root.querySelector('[data-dir="-1"]'), next = root.querySelector('[data-dir="1"]');
    const update = () => {
      if (track.swiper) return; // motion.js upgraded this carousel to Swiper
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    root.querySelectorAll("[data-dir]").forEach((b) => b.addEventListener("click", () => {
      if (track.swiper) return;
      const card = track.firstElementChild;
      const by = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth;
      track.scrollBy({ left: by * +b.dataset.dir, behavior: "smooth" });
    }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  /* Next-batch bar + WhatsApp prompt (dismissals remembered for this browser session) */
  const bar = document.querySelector(".batch-bar");
  if (bar && !store.get("jg-bar-closed")) {
    setTimeout(() => { bar.classList.add("show"); document.body.classList.add("has-batchbar"); }, 1200);
    bar.querySelector(".batch-bar__close").addEventListener("click", () => {
      bar.classList.remove("show"); document.body.classList.remove("has-batchbar"); store.set("jg-bar-closed", "1");
    });
  }
  const waPrompt = document.querySelector(".wa-prompt");
  if (waPrompt && !store.get("jg-wa-closed")) {
    setTimeout(() => { if (!document.querySelector("dialog.modal[open]")) waPrompt.classList.add("show"); }, 9000);
    waPrompt.querySelector(".wa-prompt__close").addEventListener("click", () => { waPrompt.classList.remove("show"); store.set("jg-wa-closed", "1"); });
    waPrompt.querySelector("a").addEventListener("click", () => { waPrompt.classList.remove("show"); store.set("jg-wa-closed", "1"); });
  }

  /* Pre-select program from ?program= */
  const pre = new URLSearchParams(location.search).get("program");
  if (pre) document.querySelectorAll('select[name="program"]').forEach((s) => {
    const opt = [...s.options].find((o) => o.value === pre || o.textContent === pre);
    if (opt) s.value = opt.value;
  });

  /* Enquiry forms — static site: send via WhatsApp (default) or e-mail (mailto). No server needed. */
  document.querySelectorAll("form[data-enquiry]").forEach((form) => {
    const status = form.querySelector(".form-status");
    const validate = () => {
      let ok = true;
      form.querySelectorAll("[required]").forEach((el) => {
        const field = el.closest(".field");
        let valid = el.value.trim() !== "";
        if (valid && el.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
        if (valid && el.type === "tel") valid = /^[+\d][\d\s-]{7,15}$/.test(el.value.trim());
        field && field.classList.toggle("invalid", !valid);
        if (!valid && ok) { el.focus(); ok = false; }
      });
      return ok;
    };
    form.querySelectorAll("input, select, textarea").forEach((el) =>
      el.addEventListener("input", () => el.closest(".field")?.classList.remove("invalid")));

    const message = () => {
      const lines = [`New ${form.dataset.enquiry} enquiry — ${S.fullName || "JG Institute"} website`, ""];
      form.querySelectorAll("[name]").forEach((el) => {
        if (el.value.trim()) lines.push(`${el.dataset.label || el.name}: ${el.value.trim()}`);
      });
      return lines.join("\n");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) return;
      const via = (e.submitter && e.submitter.dataset.via) || "whatsapp";
      const text = message();
      if (via === "email") {
        location.href = `mailto:${S.email}?subject=${encodeURIComponent(`${form.dataset.enquiry} enquiry — website`)}&body=${encodeURIComponent(text)}`;
      } else {
        window.open(`https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      }
      if (status) {
        status.textContent = via === "email"
          ? "Your e-mail app should now open with your enquiry. Please press Send there."
          : "WhatsApp should now open with your enquiry. Please press Send there.";
        status.classList.add("show");
      }
    });
  });
})();
