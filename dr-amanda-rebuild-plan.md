# Dr. Amanda Foo-Ryland Website: Rebuild Plan (for Claude Code)

> **How to use this file:** put it in the root of an empty project folder and start Claude Code there. Then say:
> *"Read dr-amanda-rebuild-plan.md and follow it phase by phase. Stop after each phase so I can review."*

---

## 1. Goal

Rebuild https://dramandafoo-ryland.com/ (currently WordPress + Elementor) as a **static one-page site**, self-hosted on a Hetzner server.

**Rule #1: same layout, same arrangement, same brand.**
- Keep every section, in the same order, with the same structure and content.
- Copy the colours, logo, imagery and overall look from the live site.
- "Modern" in this phase means **only**: cleaner code, faster loading, crisp typography, a proper mobile layout, smooth scrolling and light hover/scroll polish.
- **Do not** redesign, reorder, merge or remove sections (except the items in §9). Design changes come in a later phase.

---

## 2. Stack (no framework)

| Concern | Choice |
|---|---|
| Markup | One `index.html` |
| Styling | **Tailwind CSS via the standalone CLI binary** (no Node/npm, **no CDN script**) |
| JS | Plain vanilla JS in one `main.js` (no jQuery, no React). Swiper is allowed only if the carousels need it. |
| Video embeds | `lite-youtube-embed` (thumbnail first, player loads on click) |
| Contact form backend | **Formspree** (hosted, free tier). No backend code of our own. |
| Spam protection | Formspree's built-in spam filtering + its `_gotcha` honeypot field |
| Web server | **Caddy** (auto HTTPS, serves `site/` as static files only) |
| Deploy | `rsync` of `site/` to the server |

---

## 3. Project structure

```
dr-amanda/
├── dr-amanda-rebuild-plan.md
├── site/
│   ├── index.html
│   ├── assets/
│   │   ├── css/input.css       # Tailwind source (@theme tokens, base styles)
│   │   ├── css/output.css      # built, minified (generated)
│   │   ├── js/main.js
│   │   ├── img/                # optimised WebP/AVIF + logo SVG/PNG
│   │   └── fonts/              # self-hosted woff2 (no Google Fonts calls)
│   ├── favicon.ico, robots.txt, sitemap.xml
├── deploy/
│   ├── Caddyfile
│   └── deploy.sh
├── tools/tailwindcss           # standalone CLI binary (gitignored)
└── README.md
```

---

## 4. Phase 0: Audit the live site (do this first, don't guess)

Fetch the live site and its stylesheets (including the Elementor `post-*.css` / `global.css` files) and record the results in `docs/audit.md`:

1. **Exact brand colours** (hex) as they're actually used: the turquoise/cyan (stat cards, buttons, testimonial cards, contact panel), the dark teal-navy (Books section, footer), the heading text colour, body text colour, white/off-white.
   *Visual estimate to verify: turquoise ≈ `#4FCCD3`, dark teal ≈ `#1B4153`.*
2. **Fonts:** family names, weights and sizes for headings, body, nav and buttons. Self-host the same fonts as woff2 files.
3. **Spacing and widths:** content max-width, section paddings, card sizes and radii.
4. **All images:** logo/signature, portrait photos, book covers, "As seen on" logos, client logos, testimonial avatars, contact-section background image. Download the originals into `site/assets/img/originals/`.
5. **All text:** copy every heading, paragraph, testimonial quote, name and title **word for word** into `docs/content.md`.
6. **Hero:** work out what the top black area actually is (a background video, a slider or an image) and how it behaves.
7. **All YouTube video IDs** for every video in the Videos section and the Testimonials video. Record which ones are broken ("This video isn't available").

Show me `docs/audit.md` before building.

---

## 5. Section-by-section spec (same order as the live site)

The nav links are **same-page anchors**: `#home`, `#about`, `#books`, `#videos`, `#clients`, `#testimonials`, and a **GET IN TOUCH** button → `#getintouch`.

### 5.1 Header / Nav
- Signature logo on the left; the links Home, About Dr. Amanda, Books, Videos, Clients, Testimonials; a turquoise "GET IN TOUCH" pill button on the right.
- Make it sticky. The current section's link is highlighted while scrolling (IntersectionObserver).
- Mobile: hamburger → slide-in panel that closes on link tap or Esc.

### 5.2 Hero (`#home`)
- Rebuild it to match whatever the audit finds (full-width dark media area).
- If it's a video: use a muted, autoplaying, looping, `playsinline` video with a poster image, `preload="none"` on mobile, and respect `prefers-reduced-motion`.

### 5.3 Stats row
Five turquoise square cards, each with a white line icon, a big number and a small uppercase label:
- 1.9M · PLUS VIEWS OF MY TEDx TALK
- 36 · YEARS INSPIRING AUDIENCES
- 3.5M · PLUS LIVES IMPACTED
- 14 · PLUS COUNTRIES I'VE SPOKEN IN
- #1 · BEST SELLING AUTHOR

The numbers count up once when the row scrolls into view (skip this if the user prefers reduced motion). Use inline SVG icons similar to the originals (eye, audience, people, flag, book).

### 5.4 About (`#about`)
Two columns:
- Left: portrait photo with the signature logo below it.
- Right: small "ABOUT ME" label, the signature graphic, the bio paragraphs (exact copy) and a dark "GET IN TOUCH" button → `#getintouch`.

### 5.5 Show Reel
- Centered heading "Dr. Amanda's Show Reel" with a short underline.
- One full-width video embed.

### 5.6 As seen on
- Heading "As seen on" and a logo carousel with prev/next arrows and dots: BBC, MINDFOOD, NZ Woman, Radio Live, HuffPost, TVNZ, INSPO and the others found in the audit.
- Autoplay, pause on hover. Logos in their original colours.

### 5.7 Books (`#books`), dark teal background
- Heading "Books", white, with an underline.
- **Two books only:** *Neural Coding* and *Knowing You*. ⚠️ Do not include *This is It! It's Your Life Live it*; it has been retired.
- Each book: turquoise title, description paragraphs, an "Available on" row (Amazon, Audible, Barnes & Noble logos, each linked), the cover image on the right with its badge ("#1 Bestseller" / "Best Seller") and a turquoise "BUY BOOK NOW" button.
- Thin divider line between the two books.

### 5.8 Videos (`#videos`)
- Heading "Videos". A 2-column grid; each item has a bold title, a small description and a 16:9 video.
- Order: Ted Talk · TV Interview · Speak Up for Amazon Prime Video USA · Dream Teams (with its link to creatingdreamteams.com) · Belief Change · BBC Radio · BBC Radio Scotland.
- Use `lite-youtube` for every video.
- **Broken videos:** render a neutral placeholder card ("Video coming soon"), leave an HTML comment `<!-- TODO: need working video URL -->`, and list them in the README. Don't show YouTube's "Sorry, this video isn't available" box.

### 5.9 Clients (`#clients`)
- Heading "Clients". A logo carousel styled like "As seen on": Eaton, St. James's Place, Aro Ha, and the others from the audit.

### 5.10 Testimonials (`#testimonials`)
- Heading "Testimonials", then the "What my clients are saying" video (lite-youtube).

### 5.11 Get in Touch (`#getintouch`)
- Full-width section with the background photo under a dark-teal overlay. Heading "Get in Touch with me" with the signature underneath.
- **Testimonial cards:** a row of turquoise cards, each with a quote icon, the quote, a round avatar, a name and a role.
  - **Bug to fix:** on the live site these cards overflow past the right edge of the page. Rebuild them as a contained carousel (scroll-snap, arrows/dots, 3 visible on desktop, 1 on mobile), keeping the same card look.
- **Contact panel:** a turquoise box split into two columns.
  - **Left:** intro text (exact copy) and the contact list:
    - amanda@yourlifeliveit.com (mailto)
    - Instagram https://www.instagram.com/dr_amanda_foo_ryland/
    - Facebook https://www.facebook.com/yourlifeliveit/
    - LinkedIn https://linkedin.com/in/amandafoo-ryland
  - **Right:** "Let's Talk!" form. All fields are required except the last:
    1. Name (text)
    2. Email (email)
    3. Location (text)
    4. I want Dr. Amanda to present (radio: Online / Live)
    5. How many hours do you want to engage Dr. Amanda for? (text)
    6. Budget (text)
    7. Comment or Message (textarea, optional)
    8. Hidden honeypot field `_gotcha` (Formspree's spam trap) + a hidden `_subject` field, e.g. "New speaking enquiry from the website"
    9. Dark "Enquire Now" button
  - Submit the form as described in §6.

### 5.12 Footer, dark teal
- Signature logo, the same nav links, `© <current year via JS>`, "Created with Passion and a whole lot of Love" and "Created by Alexander Teye" (linked to his LinkedIn).

---

## 6. Contact form (Formspree)

There's no backend of our own. Formspree receives the form and emails each enquiry.

- **Setup (done by me, the owner, not by Claude Code):** create a Formspree form that sends to amanda@yourlifeliveit.com, and add the site's domain to the form's allowed domains. That gives a form ID.
- Put the ID in one place: `<form action="https://formspree.io/f/FORM_ID" method="POST">`. Use the placeholder `FORM_ID` and list it in the README as a setup step.
- Name the email input `email`. Formspree then uses it as the **Reply-To**, so Dr. Amanda can reply directly to the enquirer.
- Give every field a clear `name` (`name`, `email`, `location`, `present`, `hours`, `budget`, `message`) so the email she receives is easy to read.
- **JS (progressive enhancement):**
  1. Intercept submit and validate (HTML5 + JS).
  2. `fetch` the form action with `FormData` and the header `Accept: application/json`.
  3. Disable the button and show "Sending…" while waiting.
  4. On success, show an inline thank-you message and reset the form. On error, show Formspree's error messages inline.
  5. Don't reload the page. Without JS, the form still works as a normal POST.
- Spam: rely on Formspree's filtering plus the `_gotcha` honeypot. Add a CAPTCHA only if spam becomes a problem.

---

## 7. Quality bar

- **Mobile-first and responsive.** Check at 375, 768, 1024 and 1440 px, with no horizontal scroll at any width.
- **Performance:**
  - Lighthouse ≥ 95 on Performance, Accessibility, Best Practices and SEO.
  - Images are WebP/AVIF with `width`/`height` set, lazy-loaded below the fold, and served via `srcset`.
  - Fonts are preloaded with `font-display: swap`.
  - Total JS is under ~30 KB, excluding Swiper if it's used.
- **Accessibility:** semantic landmarks, alt text, visible focus states, labelled form fields, AA contrast on turquoise backgrounds (check the white text on turquoise and adjust the shade minimally if it fails), and carousels that work by keyboard.
- **SEO:** title, meta description, Open Graph and Twitter tags, canonical URL, `Person` + `Book` JSON-LD, `sitemap.xml` and `robots.txt`.
- **Motion:** smooth scrolling, `scroll-margin-top` on sections, and subtle fade-up on scroll. Everything is disabled under `prefers-reduced-motion`.

---

## 8. Deployment (Hetzner)

1. Create a `deploy/Caddyfile`:
   ```
   dramandafoo-ryland.com, www.dramandafoo-ryland.com {
       root * /var/www/amanda/site
       encode zstd gzip
       file_server
       header /assets/* Cache-Control "public, max-age=31536000, immutable"
   }
   ```
2. Write `deploy/deploy.sh`. It should:
   - build the Tailwind CSS with `--minify`;
   - `rsync` `site/` to the server.
   Caddy serves the new files immediately, so there's nothing to restart.
3. In the README, include:
   - local dev commands (`tailwindcss --watch` + `python -m http.server`);
   - the Formspree setup step (create the form, allow the domain, paste the form ID);
   - DNS cutover steps;
   - a reminder to keep the WordPress site live until the new one is verified.

---

## 9. Known changes vs the live site (the only allowed differences)

1. Remove the third book (*This is It! It's Your Life Live it*).
2. Fix the testimonial cards that overflow the page (contain them in a carousel).
3. Replace the broken video embeds with "coming soon" placeholders until working links are provided.
4. Make the footer year dynamic.

---

## 10. Build phases (stop and show me after each)

1. **Phase 0:** Audit (§4) → `docs/audit.md` + `docs/content.md` + downloaded assets.
2. **Phase 1:** Scaffold: folder structure, Tailwind CLI, `@theme` design tokens (colours, fonts) and base styles.
3. **Phase 2:** Header, hero, stats and About.
4. **Phase 3:** Show Reel, As seen on, Books.
5. **Phase 4:** Videos, Clients, Testimonials video.
6. **Phase 5:** Get in Touch (testimonial carousel + contact panel + Formspree form JS) and the footer.
7. **Phase 6:** Polish: responsive pass, accessibility, SEO, image optimisation, Lighthouse run.
8. **Phase 7:** Deploy files (Caddyfile, deploy.sh) + README.

**Visual check at every phase:** take Playwright screenshots of the new build and the live site at 1440 px and 375 px, compare them side by side, and list any differences in layout, spacing, colour or order before moving on.
