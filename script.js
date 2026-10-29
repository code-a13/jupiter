(() => {
  document.documentElement.classList.add('reveal-ready');

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const navLinks = nav ? nav.querySelectorAll('a') : [];

  // Update the header when the page is scrolled.
  const updateHeader = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 24);
    }
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Mobile navigation.
  const closeMenu = () => {
    if (!menuToggle || !nav) return;

    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const opening =
        menuToggle.getAttribute('aria-expanded') !== 'true';

      menuToggle.setAttribute('aria-expanded', String(opening));
      menuToggle.setAttribute(
        'aria-label',
        opening ? 'Close navigation' : 'Open navigation'
      );

      nav.classList.toggle('open', opening);
      document.body.classList.toggle('nav-open', opening);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close the mobile menu when switching to desktop width.
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });

    // Close the mobile menu with the Escape key.
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  // Reveal sections when they enter the viewport.
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });
  } else {
    // Fallback for browsers without IntersectionObserver.
    revealItems.forEach(item => {
      item.classList.add('visible');
    });
  }

  // Filter the portfolio gallery by category.
  const filterButtons = document.querySelectorAll('.filter-button');
  const workCards = document.querySelectorAll('.work-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';

      // Update the active filter button.
      filterButtons.forEach(other => {
        const active = other === button;

        other.classList.toggle('active', active);
        other.setAttribute('aria-pressed', String(active));
      });

      // Show or hide matching portfolio cards.
      workCards.forEach(card => {
        const visible =
          filter === 'all' || card.dataset.category === filter;

        card.classList.toggle('is-hidden', !visible);

        if (visible) {
          card.classList.add('visible');
        }
      });
    });
  });

  // Keep the plus/minus icons in technology accordions updated.
  document.querySelectorAll('.tech-item').forEach(item => {
    const summary = item.querySelector('summary .plus');

    const updateIcon = () => {
      if (summary) {
        summary.textContent = item.open ? '−' : '+';
      }
    };

    item.addEventListener('toggle', updateIcon);
    updateIcon();
  });

  // Enquiry form: prepare an email using the visitor's email application.
  // This does not send the form directly to a server.
  const enquiryForm = document.querySelector('#enquiry-form');
  const formNote = document.querySelector('#form-note');

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', event => {
      event.preventDefault();

      // Validate required form fields.
      if (!enquiryForm.reportValidity()) {
        return;
      }

      const form = new FormData(enquiryForm);

      const name = String(form.get('name') || '').trim();
      const email = String(form.get('email') || '').trim();
      const phone = String(form.get('phone') || '').trim();
      const service = String(
        form.get('service') || 'General enquiry'
      );
      const message = String(form.get('message') || '').trim();

      const subject = `Project enquiry — ${service}`;

      const body = [
        'Hello Jupiter Offset Printers team,',
        '',
        'I would like to discuss a project.',
        '',
        `Name / Company: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Service: ${service}`,
        '',
        'Project details:',
        message || 'I would like to discuss the requirements.',
        '',
        'Thank you.'
      ].join('\n');

      const mailto =
        `mailto:khan@jupitercbe.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      if (formNote) {
        formNote.textContent =
          'Your email draft is ready to open. ' +
          'If your email app did not open, ' +
          'email khan@jupitercbe.com directly.';
      }

      window.location.href = mailto;
    });
  }

  // Automatically update the copyright year.
  const currentYear = document.querySelector('#current-year');

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }
})();