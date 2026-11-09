(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero video: load the Vimeo background player (skipped for reduced motion / data saver) ---------- */
  const hero = document.getElementById('hero-video');
  const saveData = navigator.connection && navigator.connection.saveData;
  if (hero && !reduced && !saveData) hero.src = hero.dataset.src;

  /* ---------- Sticky header state ---------- */
  const header = document.getElementById('site-header');
  const bar = document.getElementById('header-bar');
  const onScroll = () => {
    const v = String(window.scrollY > 24);
    header.dataset.scrolled = v;
    bar.dataset.scrolled = v;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('menu-close');
  const panel = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('menu-backdrop');
  const setMenu = (open) => {
    panel.classList.toggle('translate-x-full', !open);
    panel.classList.toggle('invisible', !open);
    panel.setAttribute('aria-hidden', String(!open));
    backdrop.hidden = false;
    backdrop.classList.toggle('invisible', !open);
    backdrop.classList.toggle('opacity-0', !open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) closeBtn.focus();
    else if (document.activeElement && panel.contains(document.activeElement)) toggle.focus();
  };
  toggle.addEventListener('click', () => setMenu(true));
  closeBtn.addEventListener('click', () => setMenu(false));
  backdrop.addEventListener('click', () => setMenu(false));
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setMenu(false));

  /* ---------- Highlight the current section in the nav ---------- */
  const ids = ['home', 'about', 'books', 'videos', 'clients', 'testimonials'];
  const links = [...document.querySelectorAll('.nav-link, .mobile-link')];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const setActive = (id) =>
    links.forEach((a) => {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  if ('IntersectionObserver' in window) {
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => seen.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
        let best = null;
        let max = 0;
        seen.forEach((r, id) => {
          if (r > max) {
            max = r;
            best = id;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: '-90px 0px -45% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Stats count-up (runs once, when the row scrolls into view) ---------- */
  const row = document.getElementById('stats-row');
  const counters = [...document.querySelectorAll('.count')];
  const fmt = (n, d) => n.toFixed(d);
  if (row && counters.length && !reduced && 'IntersectionObserver' in window) {
    const run = () => {
      const start = performance.now();
      const dur = 2000;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const e = 1 - Math.pow(1 - t, 3);
        counters.forEach((c) => {
          const to = parseFloat(c.dataset.to);
          const d = parseInt(c.dataset.decimals, 10) || 0;
          c.textContent = fmt(to * e, d);
        });
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    counters.forEach((c) => (c.textContent = fmt(0, parseInt(c.dataset.decimals, 10) || 0)));
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(row);
  }

  /* ---------- Fade-up on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach((el) => el.classList.add('is-visible'));
  else {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Show Reel: load the Vimeo player shortly before it scrolls into view ---------- */
  const reel = document.getElementById('showreel-video');
  if (reel) {
    const load = () => {
      const q = reduced ? '' : '?autoplay=1&muted=1&loop=1&autopause=0&playsinline=1';
      reel.src = reel.dataset.src + q;
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            load();
          }
        },
        { rootMargin: '300px 0px' }
      );
      io.observe(reel);
    } else load();
  }

  /* ---------- Carousels (scroll-snap, arrows, dots, autoplay with pause on hover/focus) ---------- */
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('[data-track]');
    const slides = [...track.children];
    const prev = root.querySelector('[data-prev]');
    const next = root.querySelector('[data-next]');
    const dotsWrap = root.querySelector('[data-dots]');
    const delay = parseInt(root.dataset.autoplay || '0', 10);
    let idx = 0;
    let paused = false;
    let timer = null;
    let dots = [];

    const slideW = () => slides[0].getBoundingClientRect().width;
    const per = () => Math.max(1, Math.round(track.clientWidth / slideW()));
    const maxIdx = () => Math.max(0, slides.length - per());
    const go = (i) => {
      idx = Math.min(Math.max(i, 0), maxIdx());
      track.scrollTo({ left: idx * slideW(), behavior: reduced ? 'auto' : 'smooth' });
    };
    const mark = () => dots.forEach((d, n) => (n === idx ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    const buildDots = () => {
      if (!dotsWrap) return;
      const n = maxIdx() + 1;
      if (dots.length === n) return;
      dotsWrap.textContent = '';
      dots = Array.from({ length: n }, (_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'car-dot';
        b.setAttribute('aria-label', 'Go to position ' + (i + 1));
        b.addEventListener('click', () => go(i));
        dotsWrap.appendChild(b);
        return b;
      });
      mark();
    };

    prev.addEventListener('click', () => go(idx <= 0 ? maxIdx() : idx - 1));
    next.addEventListener('click', () => go(idx >= maxIdx() ? 0 : idx + 1));
    let raf = 0;
    track.addEventListener(
      'scroll',
      () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          idx = Math.min(maxIdx(), Math.round(track.scrollLeft / slideW()));
          mark();
        });
      },
      { passive: true }
    );
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next.click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev.click();
      }
    });
    window.addEventListener('resize', () => {
      buildDots();
      go(idx);
    });
    buildDots();

    if (delay && !reduced) {
      const stop = () => clearInterval(timer);
      const start = () => {
        stop();
        timer = setInterval(() => {
          if (!paused && !document.hidden) next.click();
        }, delay);
      };
      ['mouseenter', 'focusin', 'touchstart'].forEach((ev) => root.addEventListener(ev, () => (paused = true), { passive: true }));
      ['mouseleave', 'focusout'].forEach((ev) => root.addEventListener(ev, () => (paused = false)));
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((en) => (en.some((x) => x.isIntersecting) ? start() : stop())).observe(root);
      } else start();
    }
  });

  /* ---------- Video facades: thumbnail first, the player loads on click (YouTube + Vimeo) ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.vid[data-provider]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const { provider, id, title } = a.dataset;
    const src =
      provider === 'youtube'
        ? 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'
        : 'https://player.vimeo.com/video/' + id + '?autoplay=1';
    const f = document.createElement('iframe');
    f.src = src;
    f.title = title || 'Video';
    f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    f.allowFullscreen = true;
    const box = document.createElement('div');
    box.className = 'vid';
    box.appendChild(f);
    a.replaceWith(box);
    f.focus();
  });
  /* ---------- Word-by-word reveal for big headings (skipped for reduced motion) ---------- */
  if (!reduced && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.sec-title, .book-title, .pullquote');
    let n;
    const wrap = (node) => {
      [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) frag.appendChild(document.createTextNode(t));
            else {
              const w = document.createElement('span');
              w.className = 'w';
              w.style.setProperty('--i', n++);
              w.textContent = t;
              frag.appendChild(w);
            }
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) wrap(c);
      });
    };
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.4 }
    );
    targets.forEach((el) => {
      n = 0;
      wrap(el);
      el.classList.add('split');
      io.observe(el);
    });
  }

  /* ---------- Footer year ---------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Contact form: validate, send to Formspree with fetch, inline messages (works as a normal POST without JS) ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');
    const btn = form.querySelector('button[type="submit"]');
    const say = (msg, state) => {
      status.textContent = msg;
      status.dataset.state = state || '';
    };
    form.addEventListener('submit', async (e) => {
      const bad = [...form.querySelectorAll('[required]')].filter((el) => !el.checkValidity());
      form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
      if (bad.length) {
        e.preventDefault();
        bad.forEach((el) => el.setAttribute('aria-invalid', 'true'));
        say('Please fill in the highlighted fields.', 'error');
        bad[0].focus();
        return;
      }
      if (!window.fetch) return; // fall back to a normal POST
      e.preventDefault();
      btn.disabled = true;
      const label = btn.textContent;
      btn.textContent = 'Sending…';
      say('', '');
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (res.ok) {
          form.reset();
          say('Thank you! Your enquiry has been sent. We will be in touch soon.', 'ok');
        } else {
          let msg = 'Sorry, something went wrong. Please try again or email amanda@yourlifeliveit.com.';
          try {
            const data = await res.json();
            if (data.errors && data.errors.length) msg = data.errors.map((x) => x.message).join(' ');
          } catch (_) {}
          say(msg, 'error');
        }
      } catch (_) {
        say('Could not send your message. Please check your connection or email amanda@yourlifeliveit.com.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = label;
      }
    });
  }
})();
