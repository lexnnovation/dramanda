# Dr. Amanda Foo-Ryland: static website

A static one-page rebuild of https://dramandafoo-ryland.com/ (was WordPress + Elementor).

- `site/index.html`: the whole page. `site/assets/js/main.js`: all behaviour (about 12 KB, no libraries).
- Styling: Tailwind CSS v4 (standalone CLI, no Node). Source `site/assets/css/input.css`, built to `site/assets/css/output.css`.
- Contact form: Formspree. Hosting: Coolify, from the `Dockerfile` (nginx).
- Planning and notes: `dr-amanda-rebuild-plan.md` (spec), `docs/audit.md` (live-site audit), `docs/content.md` (all copy, plus every change made on purpose).

## Local development

1. Install the Tailwind standalone CLI once into `tools/tailwindcss` (it is git-ignored):
   `curl -sL https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-macos-arm64 -o tools/tailwindcss && chmod +x tools/tailwindcss`
2. Run `./dev.sh`. It watches the CSS and serves `site/` at http://localhost:8000. Hard-refresh (Cmd+Shift+R) after changes, because the Python server caches.
3. **Before every commit that changes HTML or CSS**, rebuild the CSS. The server does not build it:
   `./tools/tailwindcss -i site/assets/css/input.css -o site/assets/css/output.css --minify`

## 1. Formspree setup (owner)

1. Create a form at https://formspree.io that sends to `amanda@yourlifeliveit.com`.
2. In the form's settings, add the site domain to the allowed domains.
3. Copy the form ID (the part after `/f/`) and replace `FORM_ID` in `site/index.html`:
   `<form id="contact-form" action="https://formspree.io/f/FORM_ID" ...>`
   It appears once. Search for `FORM_ID`.
4. Rebuild if needed, commit, redeploy, then send a test enquiry.

The fields are `name`, `email`, `location`, `present`, `hours`, `budget` and `message`. `email` is used as the Reply-To. Spam protection is Formspree's filtering plus the hidden `_gotcha` field.

## 2. Deploy with Coolify

1. Push this repo to GitHub or GitLab (`git remote add origin ...`, `git push -u origin main`).
2. In Coolify: **New resource → Public/Private repository**, pick the repo and branch `main`.
3. Build pack: **Dockerfile**. Port: **80**. Base directory: `/`.
4. Domains: `https://dramandafoo-ryland.com` and `https://www.dramandafoo-ryland.com`. Coolify issues the HTTPS certificate.
5. Deploy. Turn on auto-deploy from the repo if you want a push to go live.

The image is `nginx:alpine` with `nginx.conf` (gzip, cache headers, security headers). `site/assets/img/originals/`, `docs/` and `tools/` are kept out of the image by `.dockerignore`.

Cache rules: fonts one year, images 30 days (rename a file when you replace it), HTML/CSS/JS always revalidate.

## 3. DNS cutover

1. **Keep the WordPress site live until the new site is checked.**
2. Deploy to Coolify and test it on the temporary Coolify domain (or a spare subdomain). Check the form, the videos, the carousels and mobile.
3. Lower the DNS TTL on `dramandafoo-ryland.com` and `www` a day ahead (for example to 300 s).
4. Point the `A` records (and `www`) at the Coolify server IP.
5. Wait for the certificate, check https://dramandafoo-ryland.com/, and keep WordPress around for a few days in case you need to roll back.
6. Submit `https://dramandafoo-ryland.com/sitemap.xml` in Google Search Console.

## Open items (TODO)

- [ ] **Formspree form ID**: replace `FORM_ID` (see above). The form can't send until this is done.
- [ ] **Meta description**: a draft in `site/index.html` (also used in the Open Graph and JSON-LD data). Confirm or edit the text.
- [ ] **Video descriptions**: the shortened one-line versions are in use. The original live wording is in `docs/content.md`.
- [ ] **Dream Teams thumbnail** is low resolution (480×270, the only size YouTube provides). A custom thumbnail would help.
- [ ] **Testimonial avatars** are small (100 px) and look soft on retina screens. Better originals would help.
- [ ] **Video upload dates** are unknown, so there is no `VideoObject` structured data yet.
- [ ] **Visual checks at 375/768/1024/1440 px** and a **Lighthouse run** still need doing in a browser.
- [ ] After launch, the planned visual modernisation.

## What differs from the live site (on purpose)

1. The third book (*This is It!*) is removed.
2. The testimonial cards sit in a contained carousel (they overflowed the page).
3. Videos use thumbnails that load the player on click. Every video now works, so no "coming soon" placeholders are needed.
4. The footer year is dynamic.
5. Text on the cyan boxes is navy instead of white, to pass AA contrast (the cyans are unchanged).
6. Each video has a short description under its title, and "Speak Up for Amazon Prime" has a shorter title.
7. The header is sticky, and the footer credit is "Created by Lexnnovation" (linked to X).
8. Extras for search and AI engines: meta tags, JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt`.
