/* Scissor landing page – interactions */
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('navMenu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close the menu after choosing a link (mobile)
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  });

  /* ---------- Features dropdown ---------- */
  const dd = document.querySelector('.has-dropdown');
  const ddBtn = dd.querySelector('.nav__dd-btn');

  ddBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dd.classList.toggle('is-open');
    ddBtn.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (e) => {
    if (!dd.contains(e.target)) {
      dd.classList.remove('is-open');
      ddBtn.setAttribute('aria-expanded', 'false');
    }
    if (!menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dd.classList.remove('is-open');
      ddBtn.setAttribute('aria-expanded', 'false');
      setMenu(false);
    }
  });

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = [...document.querySelectorAll('.nav__links > li > a')];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) =>
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id)
        );
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- FAQ accordion ---------- */
  const accordion = document.getElementById('accordion');

  accordion.addEventListener('click', (e) => {
    const btn = e.target.closest('.acc__btn');
    if (!btn) return;
    const item = btn.closest('.acc');
    const willOpen = !item.classList.contains('is-open');

    // Only one open at a time, like the design
    accordion.querySelectorAll('.acc.is-open').forEach((open) => {
      open.classList.remove('is-open');
      open.querySelector('.acc__btn').setAttribute('aria-expanded', 'false');
    });

    if (willOpen) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  /* ---------- Trim URL form (front-end demo) ---------- */
  const form = document.getElementById('trimForm');
  const urlInput = document.getElementById('longUrl');
  const domainSel = document.getElementById('domain');
  const aliasInput = document.getElementById('alias');
  const result = document.getElementById('trimResult');

  function isValidUrl(value) {
    try {
      const u = new URL(/^https?:\/\//i.test(value) ? value : 'https://' + value);
      return u.hostname.includes('.');
    } catch (_) {
      return false;
    }
  }

  function randomSlug(len = 6) {
    const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  urlInput.addEventListener('input', () => urlInput.classList.remove('is-error'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = urlInput.value.trim();

    if (!isValidUrl(value)) {
      urlInput.classList.add('is-error');
      result.hidden = false;
      result.textContent = 'Enter a valid URL, for example https://example.com/my-long-link';
      urlInput.focus();
      return;
    }

    const domain = domainSel.value || 'scissor.link';
    const slug = aliasInput.value.trim().replace(/[^\w-]/g, '') || randomSlug();
    const short = `https://${domain}/${slug}`;

    result.hidden = false;
    result.innerHTML = '';
    const text = document.createElement('span');
    text.textContent = short;
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = 'Copy';
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(short);
        copy.textContent = 'Copied!';
      } catch (_) {
        copy.textContent = 'Press Ctrl+C';
      }
      setTimeout(() => (copy.textContent = 'Copy'), 1800);
    });
    result.append(text, copy);
  });
})();
