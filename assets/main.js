    'use strict';

    // ── Scroll animations ────────────────────────────────────────────────────
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.animate-fade-up').forEach(el => {
      observer.observe(el);
    });

    // Immediately show hero elements (above fold)
    document.querySelectorAll('.hero .animate-fade-up').forEach(el => {
      setTimeout(() => el.classList.add('is-visible'), 100);
    });

    // ── Sticky nav opacity on scroll ─────────────────────────────────────────
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.style.background = 'rgba(14, 21, 18, 0.97)';
      } else {
        nav.style.background = 'rgba(14, 21, 18, 0.88)';
      }
    }, { passive: true });

    // ── Live widget animation ────────────────────────────────────────────────
    const widgetData = {
      jira: {
        base: 1240, variance: 180, median: 820,
        timeEl: document.getElementById('jira-time'),
        barYours: document.getElementById('jira-bar-yours'),
        barMedian: document.getElementById('jira-bar-median'),
        max: 1800
      },
      netsuite: {
        base: 2105, variance: 250, median: 1420,
        timeEl: document.getElementById('netsuite-time'),
        barYours: document.getElementById('netsuite-bar-yours'),
        barMedian: document.getElementById('netsuite-bar-median'),
        max: 3000
      },
      sfdc: {
        base: 680, variance: 120, median: 740,
        timeEl: document.getElementById('sfdc-time'),
        barYours: document.getElementById('sfdc-bar-yours'),
        barMedian: document.getElementById('sfdc-bar-median'),
        max: 1200
      }
    };

    const statSessions = document.getElementById('stat-sessions');
    const statOrgs = document.getElementById('stat-orgs');

    let sessionCount = 4812;
    let orgCount = 1247;

    function animateNumber(el, target, duration) {
      const start = parseInt(el.textContent.replace(/,/g, '')) || 0;
      const startTime = performance.now();
      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * eased);
        el.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    function updateWidget() {
      Object.values(widgetData).forEach(d => {
        const noise = (Math.random() - 0.5) * d.variance;
        const current = Math.max(100, Math.round(d.base + noise));
        d.timeEl.textContent = current.toLocaleString() + 'ms';
        const yoursPct = Math.min(96, Math.round((current / d.max) * 100));
        const medianPct = Math.min(96, Math.round((d.median / d.max) * 100));
        d.barYours.style.width = yoursPct + '%';
        d.barMedian.style.width = medianPct + '%';
      });

      // Tick up session count occasionally
      if (Math.random() < 0.4) {
        sessionCount += Math.floor(Math.random() * 4) + 1;
        animateNumber(statSessions, sessionCount, 600);
      }
      if (Math.random() < 0.08) {
        orgCount += 1;
        animateNumber(statOrgs, orgCount, 800);
      }
    }

    // Initial count-up animation
    setTimeout(() => {
      animateNumber(statSessions, sessionCount, 1200);
      animateNumber(statOrgs, orgCount, 1200);
    }, 800);

    // Update every 3 seconds
    setInterval(updateWidget, 3000);

    // ── Mobile menu (basic toggle) ────────────────────────────────────────────
    const hamburger = document.querySelector('.nav__hamburger');
    const navLinks = document.querySelector('.nav__links');
    const navCta = document.querySelector('.nav__cta');

    let menuOpen = false;

    hamburger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      hamburger.setAttribute('aria-expanded', menuOpen);

      if (menuOpen) {
        // Create mobile menu overlay
        const overlay = document.createElement('div');
        overlay.id = 'mobile-menu';
        overlay.style.cssText = `
          position: fixed; top: 68px; left: 0; right: 0; bottom: 0;
          background: rgba(14,21,18,0.98); z-index: 999;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 32px;
          backdrop-filter: blur(12px);
          animation: fadeIn 0.2s ease;
        `;

        const style = document.createElement('style');
        style.textContent = '@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }';
        document.head.appendChild(style);

        const links = [
          { href: '#how-it-works', text: 'How it Works' },
          { href: '#platforms', text: 'Platforms' },
          { href: '#pricing', text: 'Pricing' }
        ];

        links.forEach(l => {
          const a = document.createElement('a');
          a.href = l.href;
          a.textContent = l.text;
          a.style.cssText = 'font-size:24px;font-weight:600;color:rgba(255,255,255,0.85);font-family:Sora,sans-serif;text-decoration:none;';
          a.addEventListener('click', closeMenu);
          overlay.appendChild(a);
        });

        const cta = document.createElement('a');
        cta.href = '#';
        cta.textContent = 'Install Free';
        cta.style.cssText = 'margin-top:8px;background:#1D9E75;color:#fff;padding:14px 36px;border-radius:6px;font-size:16px;font-weight:600;font-family:Sora,sans-serif;text-decoration:none;';
        overlay.appendChild(cta);

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Animate hamburger to X
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        closeMenu();
      }
    });

    function closeMenu() {
      menuOpen = false;
      hamburger.setAttribute('aria-expanded', false);
      const overlay = document.getElementById('mobile-menu');
      if (overlay) overlay.remove();
      document.body.style.overflow = '';
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }

    // Close mobile menu on nav link click
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => {
        if (menuOpen) closeMenu();
      });
    });

    // ── Platform logo fallbacks ───────────────────────────────────────────────
    document.querySelectorAll('.platform-tile__logo[src]').forEach(img => {
      img.addEventListener('error', () => {
        const name = img.closest('.platform-tile')?.querySelector('.platform-tile__name')?.textContent || '??';
        const initials = name.split(/[\s\/]+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
        const chip = document.createElement('div');
        chip.className = 'platform-tile__dot';
        chip.setAttribute('aria-hidden', 'true');
        chip.textContent = initials;
        img.replaceWith(chip);
      });
    });

    // ── Currency switcher ─────────────────────────────────────────────────────
    const CURRENCY_RATES = {
      USD: { symbol: '$', rate: 1,    label: 'USD' },
      AUD: { symbol: '$', rate: 1.55, label: 'AUD' },
      NZD: { symbol: '$', rate: 1.70, label: 'NZD' },
      CAD: { symbol: '$', rate: 1.38, label: 'CAD' },
    };

    const BASE_TEAM_PRICE = 10; // USD

    function formatPrice(usdAmount, currency) {
      const { symbol, rate } = CURRENCY_RATES[currency];
      const converted = Math.round(usdAmount * rate);
      return `${symbol}${converted}`;
    }

    const currencySelect = document.getElementById('currency-select');
    const teamPriceEl = document.getElementById('team-price');

    currencySelect.addEventListener('change', () => {
      const currency = currencySelect.value;
      if (teamPriceEl) {
        teamPriceEl.textContent = formatPrice(BASE_TEAM_PRICE, currency);
      }
    });
  </script>
