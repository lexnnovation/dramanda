# Phase 0 audit: https://dramandafoo-ryland.com/

Date: 2026-11-03. Method: raw HTML (curl) plus computed styles and screenshots from a real Chrome session at a 1623 px viewport. Elementor's per-page CSS is inlined in the HTML, so there are no `post-*.css` files to fetch. Values below come from the inline CSS and from `getComputedStyle`.

## ⚠️ Findings that differ from the plan's assumptions

1. **Most videos are Vimeo, not YouTube.** The plan assumes YouTube plus `lite-youtube-embed`. The live page has 4 working YouTube videos and 6 Vimeo ids. **All 6 Vimeo embeds are broken** on the live site ("Sorry. This video isn't available. The owner has been notified."). See §7.
2. **The Show Reel is one of the broken Vimeo videos** (932886427). The plan lists it as a normal video embed, and §9.3 only mentions the Videos grid. I'd treat it the same way (a "coming soon" placeholder). Please confirm.
3. **The hero is empty black.** Its Vimeo background video (520179318) is also broken, so the live hero shows only black under the header. See §6.
4. **"Available on" has only the Amazon logo** on the live site. The plan mentions Audible and Barnes & Noble, but neither exists on the live site and neither has a link, so I'll use Amazon only.
5. **The "NZ Woman" logo reads "M2WOMAN"** in the image file. I'll use the real image and label its alt text "M2Woman". Please confirm that's the right name.
6. **The live header is not sticky.** It is `position:absolute` over the hero. The plan (§5.1) asks for sticky, which is a change beyond the §9 list. Is that OK, or should it scroll away like on the live site?
7. **Testimonial cards are a slightly different cyan from the other turquoise.** See §1.
8. **The "What my clients are saying" caption** from the plan (§5.10) isn't visible on the live page. The only video text is the YouTube title. I won't invent a caption unless you say so.
9. **Footer credit link:** "Alexander Teye" links to `linkedin.com/in/alex-larweh-5143b093/` and the YouTube channel is "Alex Larweh". The name and URL differ. I'll keep the live link as is.
10. **Live site is open in the WordPress admin session** (admin bar visible). I only read pages and changed nothing.
11. **Page overflow bug confirmed:** `scrollWidth` is 3825 px against a 1623 px viewport (the testimonial slider), as the plan says.

## 1. Brand colours (as used)

| Role | Hex | Where |
|---|---|---|
| Turquoise (primary) | `#52CAD3` | Stat cards, book titles / "Available on", contact panel boxes, carousel arrows/dots (Astra global colour 0) |
| Dark teal-navy | `#1A3F50` | Headings, body text, Books bg, Get in Touch bg, dark buttons ("GET IN TOUCH" in About, "BUY BOOK NOW", "Enquire Now"), footer |
| Testimonial card cyan | `#01BFCF` | The 9 testimonial cards only (differs from `#52CAD3`) |
| Hero / black | `#000000` | Hero section, header area |
| White | `#FFFFFF` | Section bg, text on teal/turquoise |
| Off-white | `#F6F8F5` | Nav link text (Astra global colour 4) |
| Other (unused / defaults) | `#DAB200`, `#536942`, `#6EC1E4`, `#54595F`, `#7A7A7A`, `#9FCE00` | Elementor/Astra defaults, not visible in the design |

The plan's estimates (`#4FCCD3`, `#1B4153`) are close, but the real values above will be used. Heading and body text are both `#1A3F50`.

## 2. Fonts

| Use | Family | Size / weight |
|---|---|---|
| Body | Lato | 16px / 400, line-height 1.7 |
| Section headings (H2) | Poppins | 40px / 700 |
| Book titles | Poppins | 45px / 700, turquoise |
| "Available on" | Poppins | 28px / 500, turquoise |
| Video titles | Poppins | 30px / 700 |
| Nav links | Montserrat | 15px (weight to confirm in Phase 1) |
| Stat numbers | Montserrat | 40px / 700, line-height 53px, white |
| Stat labels | Lato | 17px / 400, line-height 27px, white |
| Buttons | Lato | 20px / 400, padding 10px 20px, radius 16px |
| Form submit | Lato | 15px, padding 15px 34px, radius 16px |
| Testimonial quote | Montserrat | 16px, white-on-cyan |

Google Fonts requested by the page: Lato 400, Poppins 400/700, Forum 400 (not seen in use), Montserrat 600 (plus Roboto / Roboto Slab from Elementor defaults, not used visibly). Fonts to self-host as woff2: **Lato, Poppins, Montserrat**.

## 3. Spacing and widths (at 1623 px viewport)

| Item | Value |
|---|---|
| Content width | about 1140 px (the Testimonials video is 1140 wide) |
| Hero section | padding 50px 0 55px, height 1091 |
| About | padding 50px 0, height 910 |
| Books | bg `#1A3F50`, padding 70px 0 (heights total about 788 for the two books and the retired third) |
| Videos | padding 70px 0, height 2132; two-column grid, each video 550×309 |
| Clients | padding 0, height 308 |
| Testimonials | padding 51px 0 136px, height 923 |
| Get in Touch | bg `#1A3F50`, padding 100px 0 0, height 844 (plus the contact panel) |
| Stat card | 198×270, radius 23px, padding 0 32px 0 24px, icon 65px white |
| Testimonial card | 373×358, radius 24px, padding 30/30/50, avatar 89×89 round |
| Contact panel | two turquoise columns, each about 570 wide, padding 0 50px, no radius |
| Form input | height about 52px, radius 2px, white bg |

Section order and ids are as in the plan: home, about, books, videos, clients, testimonials, getintouch.

## 4. Images (originals in `site/assets/img/originals/`)

Named `YYYY_MM_filename` after the WordPress upload folder. 48 files. The retired book cover is the only one that won't be used.

- **Logos / signature:** the images in the page are `Dr-Amanda_black_high-res-scaled` (header, white-on-transparent webp, 2022/12), `Dr-Amanda_black_high-res-copy` (About, blue, 2022/12) and `dr-amanda-logo-turquoise` (Get in Touch, png, 2022/11). Full-size originals downloaded. The footer uses the same white `-scaled` file as the header.
- **About portrait:** `amanda-dr.png` (994×1242).
- **Book covers:** Neural Coding = `2023/11/dr-amanda-bookk.png`; Knowing You = `2022/11/dr-amanda-bookk.webp` (both 1029×1080; badges are baked into the images). Retired book cover `20170216064642-1.png` was downloaded but will not be used.
- **Amazon logo (white):** `amazon-logo-white._cb1509666198_-2` (downloaded).
- **As seen on (13):** BBC, MINDFOOD, M2WOMAN, RADIO LIVE, HUFFPOST, TVNZ, INSPO, The Café, RNZCGP badge, Cookie Time, Aro Hā, TEDx, LA Weekly. Originals found for all 13.
- **Clients (19):** Estée Lauder, BBC, TVNZ, nzski, The Hills, Elizabeth Arden, Clinique, All Blacks Sevens, NZ Chambers of Commerce, NCWNZ, NZ MFAT Aid Programme, bird emblem, Sistahood Co., Ronald McDonald House NZ, Eaton, St James's Place, Cookie Time, Business Success Partners, Aro Hā.
- **Testimonial avatars (9):** Annemarie, Steve Gurney, Damian, Margaux, Guy, Susan, Robyn (R. Haaker), Joan, Leonard Lauder. Small files, 2–4 KB each (about 100 px or less), so they'll look soft when rendered at 89 px on retina screens. No larger source exists on the site.
- **Contact background:** `f2025c_b736139b…_s_4_2.webp` (1792×1120, a laughing portrait) under a dark-teal overlay. The same file is the site icon source.
- **Stat icons:** icon-font glyphs (Font Awesome / ElementsKit), not images. I'll draw inline SVGs as the plan says.
- **Favicon:** `cropped-f2025c…-32x32.webp` etc. (sizes 32/180/192/270).

## 5. Text

Everything is in `docs/content.md`, copied from the HTML.

## 6. Hero

- It's the `#home` section, `background: #000`, 1091 px tall at 1623 wide, with the header (logo left, nav, GET IN TOUCH pill) absolutely positioned on top of it.
- Elementor settings: `background_background: video`, link `https://vimeo.com/520179318`, `play_on_mobile: yes`.
- The Vimeo video **fails to load** (403 / unavailable), so the live hero is a **solid black rectangle**. There is no poster image or fallback.
- So there's nothing to copy visually apart from the black block. Options for the rebuild: (a) black block exactly like live, (b) I wait for you to send a working hero video, (c) a still image you choose. I'll do (a) with a clearly marked slot for a video unless you say otherwise.

## 7. Videos

| Where | Platform / id | Status |
|---|---|---|
| Hero background | Vimeo 520179318 | ✅ works (re-checked 2026-11-07) |
| Show Reel | Vimeo 932886427 | ✅ works (re-checked 2026-11-07) |
| Ted Talk | YouTube `L4UTIsnY3-Q` ("Label-Less Living", TEDx Talks) | ✅ works |
| TV Interview | YouTube `f6IQNc6p_zs` | ✅ works |
| Speak Up for Amazon Prime Video USA | Vimeo 846288087 | ✅ works (re-checked 2026-11-07) |
| Dream Teams | YouTube `mZ-xkAWjA9Y` | ✅ works |
| Belief Change | Vimeo 511462951 | ✅ works (re-checked 2026-11-07) |
| BBC Radio | Vimeo 495589623 | ✅ works (re-checked 2026-11-07) |
| BBC Radio Scotland | Vimeo 754681780 | ✅ works (re-checked 2026-11-07) |
| Testimonials video | YouTube `cIQAjVArWEc` | ✅ works |

The Vimeo videos could be private, domain-restricted or deleted. I can't tell which from outside, and can't fix it without access to the Vimeo account. The 5 Videos-grid items (plus the Show Reel) get "Video coming soon" placeholders with `<!-- TODO: need working video URL -->`, as §9.3 says.

## 8. Carousels (Elementor image-carousel settings)

- **As seen on:** 7 slides on desktop, 3 on mobile, arrows and dots, autoplay every 5000 ms, pause on hover, infinite loop.
- **Clients:** 5 slides on desktop, 2 on mobile, same behaviour.
- **Testimonials (ElementsKit slider):** 9 cards, about 373 px wide, the overflowing one to be rebuilt per §9.2.

## Questions before Phase 1

1. **Vimeo videos:** all 6 are broken (hero, Show Reel and 4 in the Videos grid). Do you have working links (Vimeo, YouTube or files)? Until then: placeholders everywhere, hero plain black. OK?
2. **Show Reel:** placeholder too (it isn't in §9.3's list)? Yes/no.
3. **Sticky header:** the live one isn't sticky. Keep the plan's sticky behaviour (§5.1) or match live?
4. **Amazon only** under "Available on" (live has no Audible or Barnes & Noble). OK?
5. **Logo name:** the "NZ Woman" image reads "M2WOMAN". Use the image as is?
6. **Testimonial cyan:** keep `#01BFCF` for the testimonial cards and `#52CAD3` elsewhere, as on the live site? (White text on both will probably fail AA contrast; the plan says to adjust minimally in Phase 6.)
7. **Meta description / Open Graph text:** the live page has no meta description or Open Graph tags, only the title "Dr. Amanda Foo-Ryland". Phase 6 needs a meta description. I'll draft one from the About copy for your approval, and not publish anything invented.

## Decisions (from the owner, 2026-11-06)

1. Working video links are used where they exist (the 4 YouTube videos); every broken Vimeo item gets a "Video coming soon" placeholder.
2. Show Reel gets a placeholder too.
3. Header may be sticky and more modern.
4. "Available on" shows Amazon, Audible and Barnes & Noble, per the owner's screenshot (`Screenshot 2026-11-06 at 09.01.25.png`). Audible/B&N logos are cropped from that screenshot (low-res, about 150 px wide) and **their link URLs are still needed**; the live site has no links for them.
5. "M2WOMAN" logo is used as is.
6. Two cyans kept: `#52CAD3` and `#01BFCF` (testimonial cards).
7. Use all content, and the favicon, from the live site (favicon built from the live site-icon file, 512×512).

## Decisions (2026-11-07)

- Audible and Barnes & Noble logos are shown **unlinked** (no URLs needed). Amazon stays linked.
- Cropped logo quality is accepted as is.
- Item 7 confirmed: all live-site content plus the live favicon.

## Update 2026-11-07: Vimeo videos are now public and working

Re-scan of the live page: same ids, no changes to the HTML apart from tokens. All 6 Vimeo ids now return valid oEmbed data and play. Decisions 1 and 2 above (placeholders) are superseded: **no placeholders are needed**, and every video is embedded.

| Where | Vimeo id | Title (from Vimeo) | Length |
|---|---|---|---|
| Hero (background) | 520179318 | TEASER with Tedx Master Shorter WITH TED intro 1min 18sec | 1:18 |
| Show Reel | 932886427 | Dr Amanda Speaker Showreel | 3:00 |
| Speak Up for Amazon Prime Video USA | 846288087 | Speak Up Dr Amanda Foo-Ryland Amazon Prime | 18:50 |
| Belief Change | 511462951 | Belief Change Forum Intro | 1:50 |
| BBC Radio | 495589623 | BBC radio interview Dec 2020 | 10:59 |
| BBC Radio Scotland | 754681780 | BBC Radio Scotland Interview 28:9:22.mov | 7:29 |

**Hero behaviour (observed on the live site):** a full-width Vimeo teaser that autoplays, muted and looping (Elementor: `background_video`, `play_on_mobile: yes`). It starts black, then shows turquoise title cards and footage. The 16:9 video fills the width, with black bars above and below inside the taller section (about 1427 px at a 1396 px viewport). The header sits over it. The plan says to keep the full video there, so it's kept uncropped.

**Technical note:** the plan's `lite-youtube-embed` only handles YouTube. For the 6 Vimeo videos I'll use the same pattern, a thumbnail first and the player loaded on click. The hero will use Vimeo's background player (autoplay, muted, loop, no controls). Vimeo thumbnails will be downloaded and self-hosted.

## Update 2026-11-07 (Phase 3): the "Available on" logos

The live site's "Available on" image (`2022/11/amazon-logo-white._cb1509666198_-2.png`, 2281×301) is **one picture containing the Amazon, Audible and Barnes & Noble logos**. My first audit missed this because the file name only says "amazon". So the logos are sliced from that original at full quality, and the cropped screenshot versions were deleted. On the live site the whole image has one Amazon link; in the rebuild only the Amazon logo is linked (as agreed), Audible and Barnes & Noble are plain images.

Also noted for Phase 3: "As seen on" originals are 705×350 JPGs (LA Weekly is 252×65), converted to 320 px WebP.
