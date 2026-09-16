const config = window.PRIMEFIELD_CONFIG || {};

function headerMarkup() {
  return `
    <a class="skip-link" href="#main">Pređi na sadržaj</a>
    <header class="site-header">
      <div class="container nav-wrap">
        <nav class="nav" id="main-nav" aria-label="Glavna navigacija">
          <a href="/">Početna</a>
          <a href="/#usluge">Usluge</a>
          <a href="/radovi/">Radovi</a>
          <a href="/o-nama/">O nama</a>
          <a href="/kontakt/">Kontakt</a>
        </nav>
        <a class="logo" href="/" aria-label="Primefield početna">
  <img
    class="logo-image"
    src="/assets/media/logo.png"
    alt="Primefield"
    width="1200"
    height="300"
  >
</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Otvori meni">
  <img class="menu-icon" src="/assets/media/menu.png" alt="">
</button>
      </div>
    </header>`;
}

function footerMarkup() {
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-top">
          <div><a class="logo footer-logo" href="/" aria-label="Primefield početna"><img class="logo-image" src="/assets/media/logo.png" alt="Primefield" width="1200" height="300"></a><p class="muted">Video produkcija za biznise, brendove i kreatore u Beogradu.</p></div>
          <div class="footer-links"><strong>Usluge</strong><a href="/content-produkcija/">Content produkcija</a><a href="/video-produkcija/">Video produkcija</a><a href="/podcast-produkcija/">Podcast produkcija</a><a href="/video-montaza/">Video montaža</a><a href="/kreativna-produkcija/">Motion i VFX</a></div>
          <div class="footer-links"><strong>Kontakt</strong><a href="${config.instagramUrl || '#'}" target="_blank" rel="noreferrer">${config.instagramLabel || '@theprimefield'}</a><a href="/kontakt/">Zatražite ponudu</a></div>
        </div>
        <div class="footer-bottom"><span>© ${year} Primefield. Sva prava zadržana.</span><a href="/politika-privatnosti.html">Politika privatnosti</a></div>
      </div>
    </footer>`;
}

document.querySelector('[data-site-header]')?.insertAdjacentHTML('afterbegin', headerMarkup());
document.querySelector('[data-site-footer]')?.insertAdjacentHTML('afterbegin', footerMarkup());

document.querySelectorAll('[data-contact-email]').forEach((link) => {
  if (config.email && !config.email.startsWith('UNESI_')) {
    link.textContent = config.email;
    link.href = `mailto:${config.email}`;
    link.hidden = false;
  }
});
document.querySelectorAll('[data-contact-phone]').forEach((link) => {
  if (config.phone && !config.phone.startsWith('UNESI_')) {
    link.textContent = config.phone;
    link.href = `tel:${config.phone.replace(/\s/g, '')}`;
    link.hidden = false;
  }
});

const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const revealThreshold = 80;
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y <= revealThreshold || y < lastScrollY) {
      siteHeader.classList.remove('site-header--hidden');
    } else if (y > lastScrollY) {
      siteHeader.classList.add('site-header--hidden');
    }
    lastScrollY = y;
  }, { passive: true });

  window.addEventListener('mousemove', (event) => {
    if (event.clientY <= 60) {
      siteHeader.classList.remove('site-header--hidden');
    }
  });
}

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Zatvori meni' : 'Otvori meni');
});

const currentPath = location.pathname.replace(/index\.html$/, '');
document.querySelectorAll('.nav a').forEach((link) => {
  const href = new URL(link.href).pathname;
  if ((href === '/' && currentPath === '/') || (href !== '/' && currentPath.startsWith(href.replace('/#usluge', '/usluge')))) {
    link.setAttribute('aria-current', 'page');
  }
});

document.querySelectorAll('.faq-button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const open = item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
});

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const category = button.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach((item) => {
      item.hidden = category !== 'sve' && item.dataset.category !== category;
    });
  });
});

document.querySelectorAll('.yt-embed').forEach((box) => {
  const playButton = box.querySelector('.yt-play');
  playButton?.addEventListener('click', () => {
    const id = box.dataset.ytId;
    const start = box.dataset.ytStart ? `&start=${box.dataset.ytStart}` : '';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${start}`;
    iframe.title = 'YouTube video player';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    box.innerHTML = '';
    box.appendChild(iframe);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const form = document.querySelector('#project-form');
form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  if (!config.web3formsKey) {
    status.textContent = 'Forma je spremna. Podesite web3formsKey u assets/js/config.js da biste aktivirali slanje.';
    return;
  }
  const data = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');
  const payload = {
    access_key: config.web3formsKey,
    subject: `Primefield upit — ${data.get('projekat')}`,
    Ime: data.get('ime'),
    'Firma / brend': data.get('firma'),
    Kontakt: data.get('kontakt'),
    'Vrsta projekta': data.get('projekat'),
    Budžet: data.get('budzet') || 'Nije naveden',
    Opis: data.get('opis'),
  };

  submitButton.disabled = true;
  status.textContent = 'Šaljemo upit…';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (result.success) {
      status.textContent = 'Hvala! Upit je uspešno poslat, javićemo se uskoro.';
      form.reset();
    } else {
      status.textContent = 'Došlo je do greške pri slanju. Pokušajte ponovo ili nas kontaktirajte direktno.';
    }
  } catch (error) {
    status.textContent = 'Došlo je do greške pri slanju. Proverite internet konekciju i pokušajte ponovo.';
  } finally {
    submitButton.disabled = false;
  }
});
