# Content Required from JG Institute

The website uses only information found in the supplied PDF. Items below are missing, unconfirmed, or were deliberately left out. Please supply or confirm each one before launch.

## 1. Must confirm before launch

| # | Item | Where it's used | Current state |
|---|---|---|---|
| 1 | **Approved logo** (SVG or high-res PNG) | Header, footer, favicon | Placeholder colour-grid mark (`assets/images/logo-mark.svg`). PDF logo not assumed final. |
| 2 | **Full street address** + PIN code | Contact, footer | "Ambalavayal, Wayanad, Kerala, India" (PDF) |
| 3 | **Exact Google Maps location** (share/embed link of the building) | Contact map | Map centred on Ambalavayal town, not the building |
| 4 | **WhatsApp number** — is 8089296340 on WhatsApp? Country code +91? | WhatsApp button, forms | Assumed `918089296340` |
| 5 | **Phone / e-mail** — confirm 8089296340 and aiwayanad@gmail.com are final | Everywhere | From PDF |
| 6 | **Opening days** | Contact, footer | "9:00 AM – 7:00 PM, Monday to Saturday" (PDF contact page) |
| 7 | **Junior program fees** — confirm ₹4,999–₹7,999 (₹5,999–₹8,999 Kids AI) are current | Admissions → Fees | Shown as "indicative" from PDF |
| 8 | **AI program fees** | Admissions → Fees (AI tab) | "Fees shared on enquiry" |
| 9 | **Scholarships, early-bird discounts, flexible payment** — confirm these are offered and the rules | Admissions | Mentioned (from PDF), no details |

## 2. Content gaps (placeholders shown, marked with red dashed outline)

- **About:** founder's name and message, year established, mission, vision, team/trainer profiles (with photos and permission).
- **FAQ answers:** online vs offline classes; policy on switching programs; accepted payment methods.
- **Course durations, batch timings, class sizes** for every program (not in PDF — not shown anywhere).
- **Syllabus / modules** for each AI program (optional but recommended).
- **Batch/timing options** in the form are generic preferences (weekday morning/afternoon/evening, weekend). Replace with real batches if you have fixed ones.
- **Social media URLs:** Facebook, Instagram, YouTube, LinkedIn — icons are hidden until added in `assets/js/components.js`.

## 3. Photos & media

All images are branded placeholder illustrations. Needed (real photos, with parental consent for children):

- Junior Discovery activities: Rubik's cubes, puzzles, logic games, memory challenges, creativity labs (≥ 2 each)
- AI program sessions / computer lab
- Institute building exterior and classrooms
- Certificate sample (design approved)
- Trainers / founder portraits
- Optional: short video for the gallery ("Watch Video Showcase" in the PDF)

## 4. Deliberately NOT used from the PDF (unverified)

These appear in the PDF mock-ups but look like sample content. Add them only with proof:

- Statistics: "500+ active learners", "20+ brain activities", "50+ challenges", "100+ creativity projects", "200+ projects built", "100+ happy learners", "15+ domains", "1000+ students certified", "200+ hiring partners", "95% placement assistance", "50+ industry mentors".
- Student testimonials and placements (Adithya P., Fathima N., Rahul R., Sneha M., Vishnu K.) and their companies.
- Company logos "Our students work at" (TCS, Infosys, Wipro, Accenture, Cognizant, IBM) — needs written permission and genuine placements.
- Sample student projects (Creative Agency Website, EcoNature Blog, AI Chat Assistant, Image Recognition System, Summer Sale Campaign, Employee Attrition Dashboard, Expense Tracker, File Organizer, etc.).
- "Globally relevant" / "industry-recognized" certification — needs an accreditation or partner name.
- "Webify AI Console" artwork.
- "We reply within 24 hours" — replace "Quick response" copy if you can commit to a time.

## 5. Optional extras

- Privacy policy page (recommended once you collect enquiries).
- Google Business Profile link and reviews.
- Domain name (e.g. jginstitute.in) for GitHub Pages custom domain.

## 6. DEMO content added in the 2026 redesign — replace before launch

The home page was redesigned (dark theme, BlackBox-style layout). To show the design, it uses **sample data**. Each block is marked `DEMO` in an HTML comment in `index.html`. Replace or remove every item below. Never publish recognitions, ratings or testimonials that are not real.

| Item | Where | What to supply |
|---|---|---|
| **Recognition strip**: "Udyam Registered MSME", "ISO 9001:2015 Certified", "Startup India Recognised" | `index.html` → RECOGNITION | Real registrations/certificates only (certificate number or document link). Delete any that don't apply. |
| **Statistics**: 500+ learners, 25+ projects per AI learner, 30+ AI tools, 4.9 rating | `index.html` → WHY JG, and the hero chips | Real numbers, or remove the stats row. |
| **Meet the Experts**: 6 mentor profiles (Arun Mathew, Neethu Krishnan, Fahad Rahman, Aswathy Nair, Vishnu Prasad, Shabna Ashraf) | `index.html` → MEET THE EXPERTS | For each trainer: name, role, years of experience, qualification line, 3 skills, hook line, 1-sentence proof, 3–4-sentence bio, LinkedIn/Instagram URL, portrait photo (with permission). |
| **Expert portraits** | `assets/images/experts/*.svg` | Real portraits, 4:5 ratio (e.g. 1200×1500), `.webp`/`.jpg`. Update `src` and `alt`. |
| **Founder's note** (name, photo, quote) | `index.html` → FOUNDER'S NOTE | Real founder name, title, photo and message. |
| **Testimonials** (6) and **Google rating** "4.9 from 120+ reviews" | `index.html` → TESTIMONIALS | Real reviews with permission. Link the real Google Business Profile. |
| **Course durations and batch chips** (e.g. "6 months", "Weekend batches", "8+ live projects") | `index.html` → PROGRAMS | Real duration and format for each program. |
| **Next batch date** "1 December 2026" (sticky bottom bar) | `assets/js/components.js` → `SITE.nextBatch` | Real date. Set to `""` to hide the bar. |
| **FAQ answers** about beginners, weekend/online batches and instalments | `index.html` → FAQ | Confirm or correct. |
| **Enquiry modal claims**: "45-minute live demo", "call back within one working day", "4.9/5" | `assets/js/components.js` → Enquiry modal | Confirm or edit. |
