# dramanda

Static one-page website. Plain HTML, Tailwind CSS v4 and a little vanilla JS, served by nginx.

## Structure

- `site/index.html`: the page
- `site/assets/`: CSS (`input.css` is the source, `output.css` is built), JS, fonts, images
- `Dockerfile`, `nginx.conf`: production image (nginx, gzip, cache and security headers)
- `docs/`: audit and content notes

## Local development

1. Put the Tailwind standalone CLI at `tools/tailwindcss` (git-ignored).
2. Run `./dev.sh` (CSS watch plus a static server on http://localhost:8000). Hard-refresh after changes.
3. Rebuild the CSS before committing, because the server does not build it:
   `./tools/tailwindcss -i site/assets/css/input.css -o site/assets/css/output.css --minify`

## Deploy

Built from the `Dockerfile` (build pack: Dockerfile, port 80). `site/assets/img/originals/`, `docs/` and `tools/` are excluded from the image by `.dockerignore`.

Cache rules: fonts one year, images 30 days, HTML/CSS/JS always revalidate.

## Contact form

The form posts to Formspree. The endpoint is the `action` on `#contact-form` in `site/index.html`.
