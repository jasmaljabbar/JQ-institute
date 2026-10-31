/* =========================================================
   JG Institute — shared components (header, footer, WhatsApp button + prompt,
   next-batch bar, enquiry modal, icons)
   Edit SITE below to update contact details everywhere at once.
   Works on GitHub Pages and when opening files directly (no fetch()).
   ========================================================= */

window.SITE = {
  name: "JG Institute",
  fullName: "JG Institute of AI & HI",
  tagline: "Discover. Learn. Create the Future.",
  phoneDisplay: "8089296340",           // from PDF
  phoneLink: "+918089296340",           // CONFIRM: country code assumed +91
  whatsapp: "918089296340",             // CONFIRM: is this number on WhatsApp?
  email: "aiwayanad@gmail.com",         // from PDF
  nextBatch: "1 December 2026",         // DEMO: replace with the real next batch date ("" hides the bar)
  hours: "9:00 AM – 7:00 PM",           // from PDF
  days: "Monday to Saturday",           // from PDF (contact page)
  address: "Ambalavayal, Wayanad, Kerala, India", // from PDF — full street address required
  mapQuery: "Ambalavayal, Wayanad, Kerala", // CONFIRM: replace with exact Google Maps place
  social: {                              // CONTENT REQUIRED: add real profile URLs. Empty = hidden.
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: ""
  }
};

(function () {
  const S = window.SITE;
  const page = document.body.dataset.page || "";
  const icon = (n) => `<i data-icon="${n}" aria-hidden="true"></i>`;

  const NAV = [
    ["home", "index.html", "Home"],
    ["about", "about.html", "About"],
    ["programs", "", "Programs", [
      ["junior", "junior-programs.html", "Junior Discovery", "Ages 4–14 · 7 programs", "puzzle", "var(--orange)"],
      ["ai", "ai-programs.html", "AI Integrated Programs", "Age 15+ · 4 career programs", "sparkles", "var(--blue-2)"],
      ["careers", "careers.html", "Certifications & Careers", "Assessments, internships, placement", "award", "var(--orange-2)"]
    ]],
    ["experts", "index.html#experts", "Experts"],
    ["projects", "projects.html", "Projects"],
    ["gallery", "gallery.html", "Gallery"],
    ["admissions", "admissions.html", "Admissions"],
    ["contact", "contact.html", "Contact"]
  ];

  /* Program list used by every enquiry form's <select> */
  const PROGRAMS = {
    "Junior Discovery (Age 4–14)": ["IQ & Logic Development", "Memory & Brain Development", "Puzzle & Strategy Lab", "Creativity & Innovation Lab", "Public Speaking & Communication", "Aptitude Discovery Program", "Kids AI Discovery Program"],
    "AI Integrated Programs": ["AI Web Development & Vibe Coding", "AI Integrated Digital Marketing", "AI Human Resources & People Analytics", "AI Integrated Python Development"]
  };
  const esc = (t) => t.replace(/&/g, "&amp;");
  const programOptions = Object.entries(PROGRAMS).map(([group, list]) =>
    `<optgroup label="${esc(group)}">${list.map((p) => `<option>${esc(p)}</option>`).join("")}</optgroup>`).join("") +
    "<option>Not sure — need guidance</option>";

  const brand = `
    <a class="brand" href="index.html" aria-label="${S.fullName} — Home">
      <img src="assets/images/logo-mark.svg" alt="" width="40" height="40">
      <span class="brand__text"><span class="brand__name">JG</span><span class="brand__sub">Institute of AI &amp; HI</span></span>
    </a>`;

  const navItem = ([k, href, label, children]) => {
    if (!children) return `<a href="${href}"${k === page ? ' aria-current="page"' : ""}>${label}</a>`;
    const current = children.some(([ck]) => ck === page);
    return `
      <div class="nav__dd">
        <button class="nav__dd-btn" type="button" aria-expanded="false" aria-controls="dd-${k}"${current ? " data-current" : ""}>${label} ${icon("chevron")}</button>
        <div class="nav__dd-menu" id="dd-${k}">
          ${children.map(([ck, chref, clabel, sub, ic, c]) => `
            <a href="${chref}"${ck === page ? ' aria-current="page"' : ""}>
              <span class="icon-box" style="--c:${c}">${icon(ic)}</span>
              <span><strong>${esc(clabel)}</strong><small>${sub}</small></span>
            </a>`).join("")}
        </div>
      </div>`;
  };

  /* ---------- Header ---------- */
  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="container nav" id="nav">
        ${brand}
        <div class="nav__scrim" aria-hidden="true"></div>
        <nav class="nav__links" id="nav-links" aria-label="Main">
          ${NAV.map(navItem).join("")}
          <button class="btn mobile-cta" type="button" data-modal="enquiry">Book Free Demo ${icon("arrow")}</button>
        </nav>
        <button class="theme-toggle" type="button" aria-label="Dark mode" aria-pressed="true" title="Switch light / dark mode">
          <i data-icon="sun" class="theme-toggle__sun"></i><i data-icon="moon" class="theme-toggle__moon"></i>
        </button>
        <button class="btn btn--sm nav__cta" type="button" data-modal="enquiry">Book Free Demo ${icon("arrow")}</button>
        <button class="nav__toggle" type="button" aria-controls="nav-links" aria-expanded="false" aria-label="Open menu"><span class="nav__bars" aria-hidden="true"><span></span><span></span><span></span></span></button>
      </div>`;
  }

  /* ---------- Footer ---------- */
  const socials = Object.entries(S.social).filter(([, url]) => url)
    .map(([k, url]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${k}">${icon(k)}</a>`).join("");

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container">
        <div class="footer__grid">
          <div class="reveal">
            ${brand}
            <p style="margin-top:1.2rem;max-width:22rem">Inspiring young minds and future professionals with Human Intelligence, Artificial Intelligence, Creativity and Leadership.</p>
            ${socials ? `<div class="socials" style="margin-top:1.2rem">${socials}</div>` : ""}
          </div>
          <div class="reveal">
            <h4>Explore</h4>
            <ul class="footer__links">
              <li><a href="about.html">About JG</a></li>
              <li><a href="index.html#experts">Meet the Experts</a></li>
              <li><a href="projects.html">Project Showcase</a></li>
              <li><a href="gallery.html">Gallery</a></li>
              <li><a href="careers.html">Certifications &amp; Careers</a></li>
              <li><a href="admissions.html">Admissions</a></li>
            </ul>
          </div>
          <div class="reveal">
            <h4>Programs</h4>
            <ul class="footer__links">
              <li><a href="junior-programs.html">Junior Discovery</a></li>
              <li><a href="ai-programs.html#ai-web">AI Web Development</a></li>
              <li><a href="ai-programs.html#ai-marketing">AI Digital Marketing</a></li>
              <li><a href="ai-programs.html#ai-hr">AI HR &amp; People Analytics</a></li>
              <li><a href="ai-programs.html#ai-python">AI Python Development</a></li>
            </ul>
          </div>
          <div class="reveal">
            <h4>Get in touch</h4>
            <ul class="footer__contact">
              <li>${icon("pin")}<span>${S.address}</span></li>
              <li>${icon("phone")}<a href="tel:${S.phoneLink}">${S.phoneDisplay}</a></li>
              <li>${icon("mail")}<a href="mailto:${S.email}">${S.email}</a></li>
              <li>${icon("clock")}<span>${S.hours}<br>${S.days}</span></li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© <span data-year></span> ${S.fullName}. All rights reserved.</span>
          <span>Learn · Build · Grow</span>
        </div>
      </div>`;
  }

  /* ---------- WhatsApp floating button + guidance prompt ---------- */
  const waLink = (msg) => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg || "Hi JG Institute, I'd like to know more about your programs.")}`;
  if (S.whatsapp && !document.querySelector(".wa-float")) {
    const wa = document.createElement("a");
    wa.className = "wa-float";
    wa.href = waLink();
    wa.target = "_blank"; wa.rel = "noopener";
    wa.setAttribute("aria-label", "Chat with JG Institute on WhatsApp");
    wa.innerHTML = icon("whatsapp");
    document.body.appendChild(wa);

    const prompt = document.createElement("div");
    prompt.className = "wa-prompt";
    prompt.setAttribute("role", "status");
    prompt.innerHTML = `
      <button class="wa-prompt__close" type="button" aria-label="Close chat prompt">${icon("x")}</button>
      <strong>Need help choosing a program?</strong>
      Chat with us on WhatsApp for free course guidance.
      <a href="${waLink("Hi JG Institute, I need guidance choosing a program.")}" target="_blank" rel="noopener">${icon("whatsapp")} Start chat</a>`;
    document.body.appendChild(prompt);
  }

  /* ---------- Sticky "next batch" bar ---------- */
  if (S.nextBatch) {
    const bar = document.createElement("div");
    bar.className = "batch-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Next batch");
    bar.innerHTML = `
      <span>${icon("calendar")}<span>Next batch starts <b>${S.nextBatch}</b><span class="batch-bar__extra"> · Limited seats</span></span></span>
      <button class="btn btn--sm" type="button" data-modal="enquiry">Book your free demo ${icon("arrow")}</button>
      <button class="batch-bar__close" type="button" aria-label="Dismiss">${icon("x")}</button>`;
    document.body.appendChild(bar);
  }

  /* ---------- Enquiry modal ("Book Free Demo") ---------- */
  const modal = document.createElement("dialog");
  modal.className = "modal";
  modal.id = "enquiry-modal";
  modal.setAttribute("aria-labelledby", "enquiry-modal-title");
  modal.innerHTML = `
    <button class="modal__close" type="button" data-close aria-label="Close">${icon("x")}</button>
    <div class="modal__grid">
      <div class="modal__aside">
        <span class="eyebrow" style="align-self:flex-start;margin:0">Free demo class</span>
        <h2 id="enquiry-modal-title">Book your <span class="hl">free demo</span> class.</h2>
        <p>Meet a mentor, try a real session and get a learning roadmap for you or your child — no cost, no commitment.</p>
        <ul class="checks">
          <li>${icon("check")}<span>45-minute live demo session</span></li>
          <li>${icon("check")}<span>One-to-one counselling with a mentor</span></li>
          <li>${icon("check")}<span>Personalised program recommendation</span></li>
          <li>${icon("check")}<span>Fee, batch and scholarship details</span></li>
        </ul>
        <div class="modal__trust"><span class="stars">${icon("star")}${icon("star")}${icon("star")}${icon("star")}${icon("star")}</span><span><b>4.9/5</b> from parents &amp; learners</span></div>
      </div>
      <div class="modal__body">
        <h3>Tell us a little about you</h3>
        <p>We'll call you back within one working day.</p>
        <form data-enquiry="Free demo" novalidate>
          <div class="form-grid">
            <div class="field field--full"><label for="m-name">Full name</label><input id="m-name" name="name" data-label="Name" autocomplete="name" required><span class="err">Please enter your name.</span></div>
            <div class="field"><label for="m-phone">Phone / WhatsApp</label><input id="m-phone" name="phone" type="tel" data-label="Phone" autocomplete="tel" inputmode="tel" required><span class="err">Please enter a valid phone number.</span></div>
            <div class="field"><label for="m-email">E-mail <span class="opt">(optional)</span></label><input id="m-email" name="email" type="email" data-label="Email" autocomplete="email"></div>
            <div class="field field--full"><label for="m-program">Program</label>
              <select id="m-program" name="program" data-label="Program" required><option value="">Select a program</option>${programOptions}</select><span class="err">Please choose a program.</span></div>
            <div class="field"><label for="m-mode">Demo mode</label>
              <select id="m-mode" name="mode" data-label="Demo mode"><option>In person</option><option>Online</option></select></div>
            <div class="field"><label for="m-batch">Preferred time</label>
              <select id="m-batch" name="batch" data-label="Preferred time"><option value="">Any time</option><option>Weekday — morning</option><option>Weekday — evening</option><option>Weekend</option></select></div>
          </div>
          <div class="form-actions">
            <button class="btn btn--wa" type="submit" data-via="whatsapp">${icon("whatsapp")} Send on WhatsApp</button>
            <button class="btn btn--ghost" type="submit" data-via="email">${icon("mail")} Send by e-mail</button>
          </div>
          <p class="form-status" role="status" aria-live="polite"></p>
          <p class="form-note">${icon("shield")}Your details are sent only to JG Institute and are not stored on this website.</p>
        </form>
      </div>
    </div>`;
  document.body.appendChild(modal);

  /* Fill any page <select data-programs> with the shared program list */
  document.querySelectorAll("select[data-programs]").forEach((sel) => sel.insertAdjacentHTML("beforeend", programOptions));

  /* ---------- Fill [data-site] placeholders in page content ---------- */
  document.querySelectorAll("[data-site]").forEach((el) => {
    const v = S[el.dataset.site]; if (v) el.textContent = v;
  });
  document.querySelectorAll("[data-href]").forEach((el) => {
    const t = el.dataset.href;
    if (t === "tel") el.href = `tel:${S.phoneLink}`;
    if (t === "mail") el.href = `mailto:${S.email}`;
    if (t === "wa") { el.href = waLink(el.dataset.msg); el.target = "_blank"; el.rel = "noopener"; }
  });
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Render icons ---------- */
  window.renderIcons = function (root) {
    (root || document).querySelectorAll("i[data-icon]").forEach((el) => {
      const p = (window.JG_ICONS || {})[el.dataset.icon];
      if (!p) return;
      const span = document.createElement("span");
      span.className = "ico " + (el.className || "");
      span.setAttribute("aria-hidden", "true");
      span.innerHTML = `<svg viewBox="0 0 24 24">${p}</svg>`;
      el.replaceWith(span);
    });
  };
  window.renderIcons();
})();
