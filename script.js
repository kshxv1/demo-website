(function () {
  const b = business;

  function el(tag, cls, txt) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  function bindText(sel, val) {
    document.querySelectorAll('[data-bind="' + sel + '"]').forEach(n => { n.textContent = val; });
  }

  function bindHtml(sel, val) {
    document.querySelectorAll('[data-bind-html="' + sel + '"]').forEach(n => { n.innerHTML = val; });
  }

  function telHref(phone) {
    return 'tel:' + String(phone).replace(/[^\d+]/g, '');
  }

  function mailtoHref(email) {
    return 'mailto:' + email;
  }

  function setPhone(id, phone, labelSel) {
    const node = document.getElementById(id);
    if (!node || !phone) return;
    node.href = telHref(phone);
    const span = node.querySelector(labelSel ? '.contact-val' : '.val');
    if (span) span.textContent = phone;
  }

  function setEmail(id, email) {
    const node = document.getElementById(id);
    if (!node || !email) return;
    node.href = mailtoHref(email);
    const span = node.querySelector('.contact-val') || node.querySelector('.val');
    if (span) span.textContent = email;
  }

  function svgPin() {
    const s = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
    return s;
  }

  function svgPhoneIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>';
  }

  function svgMailIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
  }

  function makePlaceholder(ratio, label) {
    const wrap = el('div', 'ph-img' + (ratio === 'portrait' ? ' portrait' : ''));
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', label + ' — photo placeholder, replace via config.images');
    wrap.textContent = label + ' · photo goes here';
    return wrap;
  }

  function mountPhoto(imgEl, src, alt, ratio, fallbackLabel) {
    if (!src) {
      const ph = makePlaceholder(ratio, fallbackLabel);
      imgEl.replaceWith(ph);
      return;
    }
    imgEl.src = src;
    imgEl.alt = alt;
    imgEl.onerror = function () {
      const ph = makePlaceholder(ratio, fallbackLabel);
      imgEl.replaceWith(ph);
    };
  }

  function injectBrandTokens() {
    const root = document.documentElement;
    const brand = b.brand;
    if (!brand) return;
    if (brand.bg) root.style.setProperty('--bg', brand.bg);
    if (brand.surface) root.style.setProperty('--surface', brand.surface);
    if (brand.fg) root.style.setProperty('--fg', brand.fg);
    if (brand.muted) root.style.setProperty('--muted', brand.muted);
    if (brand.border) root.style.setProperty('--border', brand.border);
    if (brand.accent) root.style.setProperty('--accent', brand.accent);
    if (brand.accentOn) root.style.setProperty('--accent-on', brand.accentOn);
    if (brand.darkBg) root.style.setProperty('--dark-bg', brand.darkBg);
    if (brand.darkFg) root.style.setProperty('--dark-fg', brand.darkFg);
    if (brand.danger) root.style.setProperty('--danger', brand.danger);
  }

  function buildFavicon(accent, bg) {
    const a = encodeURIComponent(accent || '#245744');
    const w = encodeURIComponent(bg || '#FAF9F6');
    const initial = (b.name || 'V').charAt(0).toUpperCase();
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='" + a + "'/%3E%3Ctext x='16' y='22' font-family='Georgia,serif' font-size='18' fill='" + w + "' text-anchor='middle'%3E" + initial + "%3C/text%3E%3C/svg%3E";
  }

  function updateFavicon() {
    const link = document.getElementById('favicon');
    if (!link) return;
    const brand = b.brand || {};
    link.href = buildFavicon(brand.accent, brand.bg);
  }

  function updateOgImage() {
    const ogImg = document.getElementById('og-image');
    if (!ogImg) return;
    if (b.images && b.images.hero) {
      ogImg.content = new URL(b.images.hero, window.location.href).href;
    }
  }

  function injectJsonLd() {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': b.name,
      'description': b.tagline,
      'telephone': b.phone,
      'email': b.email,
      'areaServed': b.serviceArea.locations.map(l => ({ '@type': 'City', 'name': l.split('—')[0].trim() })),
      'priceRange': '$$',
      'openingHoursSpecification': b.hours.map(h => ({
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': h.day,
        'opens': h.time.split('-')[0].trim(),
        'closes': (h.time.split('-')[1] || '').trim()
      }))
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }

  function renderHeaderNav() {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    const backdrop = el('div', 'nav-backdrop');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);

    let lastFocused = null;

    function openNav() {
      lastFocused = document.activeElement;
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('is-visible');
      document.body.classList.add('nav-open');
      const firstLink = nav.querySelector('a, button');
      if (firstLink) firstLink.focus();
    }

    function closeNav() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('is-visible');
      document.body.classList.remove('nav-open');
      if (lastFocused) lastFocused.focus();
    }

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeNav();
      else openNav();
    });

    backdrop.addEventListener('click', closeNav);

    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        closeNav();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = Array.from(nav.querySelectorAll('a[href], button:not([disabled])'));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  function initScrolledHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function renderHero() {
    const pinNode = document.querySelector('.pin');
    if (pinNode) pinNode.innerHTML = svgPin();
    if (b.hero) {
      const headlineHtml = String(b.hero.headline || '').replace(/\n/g, '<br />');
      bindHtml('heroHeadline', headlineHtml);
      const leadText = String(b.hero.lead || '').replace('{{area}}', b.serviceArea.intro || '');
      bindText('heroLead', leadText);
    }
    const heroImg = document.getElementById('hero-photo');
    if (heroImg) {
      mountPhoto(heroImg, b.images.hero, 'A cleaned living room after a regular weekly visit.', 'landscape', 'Hero');
    }
    const summary = b.serviceArea.locations.slice(0, 3).map(l => l.split('—')[0].trim()).join(', ');
    bindText('areaSummary', 'Serving ' + summary + ' & nearby');
  }

  function renderServices() {
    const list = document.getElementById('service-list');
    if (!list) return;
    b.services.forEach((svc, i) => {
      const item = el('li', 'service-item');
      item.dataset.odId = 'service-' + svc.id;
      const info = el('div', 'service-info');
      const counter = el('p', 'service-counter num', String(i + 1).padStart(2, '0'));
      const name = el('h3', 'service-name', svc.name);
      const desc = el('p', 'service-desc', svc.description);
      info.append(counter, name, desc);
      if (svc.startingFrom) {
        const price = el('p', 'service-price num', 'Starting from ' + svc.startingFrom);
        info.append(price);
      }
      const fig = el('figure', 'service-media');
      const img = el('img', 'photo');
      img.loading = 'lazy';
      img.decoding = 'async';
      const src = b.images.services[svc.imageIndex] || '';
      mountPhoto(img, src, svc.name + ' — sample work', 'landscape', svc.name);
      fig.appendChild(img);
      item.append(info, fig);
      list.appendChild(item);
    });
  }

  function renderWhyUs() {
    const dl = document.getElementById('why-list');
    if (dl) {
      b.whyUs.forEach(w => {
        const dt = el('dt', '', w.title);
        const dd = el('dd', '', w.body);
        const div = el('div', 'why-item');
        div.append(dt, dd);
        dl.appendChild(div);
      });
    }
    const aboutImg = document.getElementById('about-photo');
    if (aboutImg) {
      aboutImg.alt = 'Cleaning supplies arranged on site before a visit.';
      mountPhoto(aboutImg, b.images.about, 'A cleaning crew working through a home interior during a scheduled visit.', 'landscape', 'About');
    }
  }

  function renderTestimonials() {
    const section = document.getElementById('testimonials');
    const list = document.getElementById('testimonial-list');
    if (!section || !list) return;
    const items = Array.isArray(b.testimonials) ? b.testimonials : [];
    if (!items.length) {
      section.remove();
      return;
    }
    items.forEach(t => {
      const li = el('li', 'testimonial-card');
      li.dataset.odId = 'testimonial-' + String(t.author || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const quote = el('blockquote', 'testimonial-quote', '\u201C' + t.quote + '\u201D');
      const meta = el('div', 'testimonial-meta');
      meta.append(el('span', 'testimonial-author', t.author));
      if (t.detail) meta.append(el('span', 'testimonial-detail', t.detail));
      li.append(quote, meta);
      if (t.sourceUrl && t.sourceLabel) {
        const src = el('p', 'testimonial-source');
        const a = document.createElement('a');
        a.href = t.sourceUrl;
        a.rel = 'noopener noreferrer';
        a.target = '_blank';
        a.textContent = t.sourceLabel;
        src.append(document.createTextNode('Verified via '), a);
        li.append(src);
      }
      list.appendChild(li);
    });
  }

  function renderSteps() {
    const ol = document.getElementById('steps-list');
    if (!ol) return;
    b.howItWorks.forEach(s => {
      const li = el('li', 'step');
      li.append(
        el('p', 'step-num num', s.step),
        el('h3', 'step-title', s.title),
        el('p', 'step-body', s.body)
      );
      ol.appendChild(li);
    });
  }

  function renderArea() {
    bindText('areaHeadline', b.serviceArea.headline);
    bindText('areaIntro', b.serviceArea.intro);
    const locList = document.getElementById('area-locations');
    if (locList) {
      b.serviceArea.locations.forEach(loc => {
        const li = el('li', 'loc-item');
        const dot = el('span', 'loc-dot');
        dot.setAttribute('aria-hidden', 'true');
        li.append(dot, el('span', '', loc));
        locList.appendChild(li);
      });
    }
    const zipList = document.getElementById('area-zips');
    if (zipList) {
      const head = el('p', 'meta zip-head', 'ZIP codes we cover:');
      zipList.appendChild(head);
      b.serviceArea.zipCodes.forEach(z => {
        zipList.appendChild(el('li', 'zip-tag num', z));
      });
    }
    const contactArea = document.getElementById('contact-area');
    if (contactArea) contactArea.textContent = b.serviceArea.intro;
  }

  function renderContactLinks() {
    setPhone('hero-call', b.phone);
    const heroCallBtn = document.getElementById('hero-call');
    if (heroCallBtn && b.phone) {
      heroCallBtn.textContent = b.ctas.secondary + ' · ' + b.phone;
    }
    setPhone('quote-phone', b.phone, true);
    setEmail('quote-email', b.email);
    setPhone('contact-phone', b.phone);
    setEmail('contact-email', b.email);
    setPhone('footer-phone', b.phone);
    setEmail('footer-email', b.email);
    setPhone('mab-phone', b.phone);
    const mab = document.getElementById('mab-phone');
    if (mab && b.phone) mab.textContent = 'Call ' + b.phone;
    const qIcon = document.querySelector('#quote-phone .contact-icon');
    if (qIcon) qIcon.innerHTML = svgPhoneIcon();
    const eIcon = document.querySelector('#quote-email .contact-icon');
    if (eIcon) eIcon.innerHTML = svgMailIcon();
  }

  function renderHours() {
    const ul = document.getElementById('hours-list');
    if (!ul) return;
    b.hours.forEach(h => {
      const li = el('li');
      li.append(el('span', 'hours-day', h.day), el('span', 'hours-time num', h.time));
      ul.appendChild(li);
    });
  }

  function populateServiceOptions() {
    const sel = document.getElementById('q-service');
    if (!sel) return;
    b.services.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.name;
      sel.appendChild(o);
    });
  }

  function validateField(input) {
    const errNode = document.getElementById('err-' + input.id);
    let valid = true;
    if (input.required && !input.value.trim()) valid = false;
    if (valid && input.type === 'email' && input.value.trim()) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    }
    if (valid && input.type === 'tel' && input.value.trim()) {
      valid = input.value.replace(/\D/g, '').length >= 7;
    }
    if (errNode) {
      errNode.hidden = valid;
    }
    input.setAttribute('aria-invalid', String(!valid));
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const note = document.getElementById('form-note');
    const fields = Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'));
    let allValid = true;
    fields.forEach(f => { if (!validateField(f)) allValid = false; });
    note.classList.remove('is-error', 'is-success', 'is-info');
    if (!allValid) {
      note.textContent = 'Please fix the highlighted fields above.';
      note.classList.add('is-error');
      const firstBad = fields.find(f => f.getAttribute('aria-invalid') === 'true');
      if (firstBad) firstBad.focus();
      return;
    }
    if (b.formHandlerUrl) {
      const payload = Object.fromEntries(new FormData(form).entries());
      note.textContent = 'Sending…';
      fetch(b.formHandlerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(res => {
        if (!res.ok) throw new Error('bad status');
        note.textContent = 'Thanks — your request has been sent. We reply within one business day.';
        note.classList.add('is-success');
        form.reset();
      }).catch(() => {
        note.textContent = 'Something went wrong sending that. Please call or email us directly and we\'ll take it from there.';
        note.classList.add('is-error');
      });
      return;
    }
    note.textContent = 'Demo mode: no form handler is configured in config.js, so nothing was submitted. Your details are kept only in this browser. To go live, set business.formHandlerUrl to your endpoint (Formspree, Netlify Forms, or your own API) — or reach us by phone or email using the links beside this form.';
    note.classList.add('is-info');
  }

  function initForm() {
    const form = document.getElementById('quote-form');
    if (!form) return;
    populateServiceOptions();
    form.querySelectorAll('input[required], select[required]').forEach(f => {
      f.addEventListener('blur', () => validateField(f));
      f.addEventListener('input', () => {
        if (f.getAttribute('aria-invalid') === 'true') validateField(f);
      });
    });
    form.addEventListener('submit', handleSubmit);
  }

  function initMobileBar() {
    const bar = document.getElementById('mobile-action-bar');
    if (!bar) return;
    const quote = document.getElementById('quote');
    if (!quote) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        bar.classList.toggle('is-hidden', en.isIntersecting);
        bar.setAttribute('aria-hidden', String(en.isIntersecting));
      });
    }, { threshold: 0.15 });
    io.observe(quote);
  }

  function init() {
    injectBrandTokens();
    updateFavicon();
    updateOgImage();
    injectJsonLd();
    bindText('name', b.name);
    bindText('tagline', b.tagline);
    document.title = b.name + ' — ' + b.tagline;
    document.getElementById('year').textContent = new Date().getFullYear();
    renderHeaderNav();
    initScrolledHeader();
    renderHero();
    renderServices();
    renderWhyUs();
    renderTestimonials();
    renderSteps();
    renderArea();
    renderContactLinks();
    renderHours();
    initForm();
    initMobileBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();