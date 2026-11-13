document.addEventListener('DOMContentLoaded', async () => {
  
  const fetchData = async (file) => {
    try {
      const res = await fetch(`content/${file}.json`);
      return res.ok ? await res.json() : null;
    } catch { return null; }
  };

  const [hero, partners, services, about, projects, gallery, contact] = await Promise.all([
    fetchData('hero'), fetchData('partners'), fetchData('services'), fetchData('about'), 
    fetchData('projects'), fetchData('gallery'), fetchData('contact')
  ]);

  // ==================== 1. HERO SLIDER ====================
  if (hero && hero.slides) {
    const slider = document.getElementById('heroSlider');
    const dots = document.getElementById('heroDots');
    
    const socialsHTML = `
      <div class="hero-socials">
        <a href="#" class="hero-social" aria-label="X"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
        <a href="#" class="hero-social" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
        <a href="#" class="hero-social" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
        <a href="#" class="hero-social" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a>
      </div>
    `;

    slider.innerHTML = hero.slides.map((s, i) => `
      <div class="hero-slide ${i === 0 ? 'active' : ''}">
        <div class="hero-text">
          <h1 class="hero-title">${s.title}</h1>
          <p class="hero-desc">${s.desc}</p>
        </div>
        <div class="hero-media"><img class="hero-img" src="${s.image}" alt="صورة"></div>
        ${socialsHTML}
      </div>
    `).join('');

    if (hero.slides.length > 1) {
      slider.innerHTML += `
        <button class="hero-arrow hero-arrow--prev" id="heroPrev" aria-label="السابق"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
        <button class="hero-arrow hero-arrow--next" id="heroNext" aria-label="التالي"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
      `;
    }

    dots.innerHTML = hero.slides.map((_, i) => `
      <button class="hero-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>
    `).join('');

    const slides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    const btnPrev = document.getElementById('heroPrev');
    const btnNext = document.getElementById('heroNext');
    let currentHero = 0;
    
    function goToHero(index) {
      if(index === currentHero) return;
      slides[currentHero].classList.remove('active');
      heroDots[currentHero].classList.remove('active');
      currentHero = (index + slides.length) % slides.length;
      slides[currentHero].classList.add('active');
      heroDots[currentHero].classList.add('active');
    }
    
    heroDots.forEach((dot, i) => dot.addEventListener('click', () => goToHero(i)));
    if(btnPrev) btnPrev.addEventListener('click', () => goToHero(currentHero - 1));
    if(btnNext) btnNext.addEventListener('click', () => goToHero(currentHero + 1));
    if (slides.length > 1) setInterval(() => goToHero(currentHero + 1), 7000);
  }

  // ==================== 2. PARTNERS (الشركاء) ====================
  if (partners && partners.logos && partners.logos.length > 0) {
    const track = document.getElementById('partnersTrack');
    const titleEl = document.querySelector('.partners-title');
    
    if (titleEl && partners.title) titleEl.textContent = partners.title;

    let groupHTML = '';
    // تكرار الشعارات للحصول على شريط طويل (8 عناصر)
    for (let i = 0; i < 8; i++) {
      const imgSrc = partners.logos[i % partners.logos.length];
      groupHTML += `<div class="partner-item"><img src="${imgSrc}" alt="شعار شريك" loading="lazy"></div>`;
    }

    track.innerHTML = `
      <div class="partners-group">${groupHTML}</div>
      <div class="partners-group" aria-hidden="true">${groupHTML}</div>
    `;
  }

  // ==================== 3. SERVICES ====================
  if (services && services.items) {
    document.getElementById('servicesGrid').innerHTML = services.items.map(s => `
      <div class="service-card">
        <div class="service-card-inner">
          <h3 class="service-title" style="padding: 20px; font-size: 1.1rem; color: var(--dark); font-weight: 800;">${s.title}</h3>
          <p class="service-desc" style="padding: 0 20px 20px; font-size: 0.9rem; color: var(--text-muted);">${s.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // ==================== 4. ABOUT ====================
  if (about) {
    document.getElementById('aboutPanels').innerHTML = `
      <div class="about-panel active" id="panel-history">
        <div class="about-panel-content">
          <div class="about-panel-media"><img src="${about.history.image || ''}" alt="النشأة"></div>
          <div class="about-panel-text"><h3>${about.history.title}</h3><p>${about.history.content}</p></div>
        </div>
      </div>
      <div class="about-panel" id="panel-director">
        <div class="team-grid team-grid--single">
          <div class="team-member">
            <div class="team-avatar"><img src="${about.director.image || ''}" alt="المدير"></div>
            <h4 class="team-name">${about.director.name}</h4>
            <p class="team-role">${about.director.role}</p>
          </div>
        </div>
      </div>
      <div class="about-panel" id="panel-employees">
        <div class="team-grid">
          ${about.employees.map(e => `
            <div class="team-member">
              <div class="team-avatar"><img src="${e.image || ''}" alt="${e.name}"></div>
              <h4 class="team-name">${e.name}</h4>
              <p class="team-role">${e.role}</p>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="about-panel" id="panel-about-us">
        <div class="about-panel-content">
          <div class="about-panel-text"><h3>${about.brief.title}</h3><p>${about.brief.content}</p></div>
          <div class="about-panel-media"><img src="${about.brief.image || ''}" alt="نبذة"></div>
        </div>
      </div>
    `;

    const tabs = document.querySelectorAll('.about-tab');
    const panels = document.querySelectorAll('.about-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
      });
    });
  }

  // ==================== 5. PROJECTS ====================
  if (projects && projects.items) {
    const slider = document.getElementById('projectsSlider');
    const dots = document.getElementById('projectsDots');

    slider.innerHTML = projects.items.map((p, i) => `
      <div class="project-slide ${i === 0 ? 'active' : ''}">
        <article class="project-card">
          <div class="project-main">
            <div class="project-image"><img src="${p.image}" alt="${p.title}"></div>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.desc}</p>
          </div>
          <div class="project-details">
            <span class="project-type-tag"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><span>${p.type}</span></span>
            ${p.details.map(d => `<div class="project-detail"><span class="detail-label">${d.label}</span><span class="detail-value">${d.value}</span></div>`).join('')}
            ${p.amount ? `<div class="project-detail project-detail--amount"><span class="detail-label">المبلغ الإجمالي</span><span class="detail-value detail-value--amount">${p.amount}</span></div>` : ''}
          </div>
        </article>
      </div>
    `).join('');

    if (projects.items.length > 1) {
      slider.innerHTML += `
        <button class="projects-arrow projects-arrow--prev" id="projectsPrev" aria-label="السابق"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
        <button class="projects-arrow projects-arrow--next" id="projectsNext" aria-label="التالي"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
      `;
    }

    dots.innerHTML = projects.items.map((_, i) => `<button class="projects-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`).join('');

    const pSlides = document.querySelectorAll('.project-slide');
    const pDots = document.querySelectorAll('.projects-dot');
    let currProj = 0;
    
    function goToProj(index) {
      if(index === currProj) return;
      pSlides[currProj].classList.remove('active');
      pDots[currProj].classList.remove('active');
      currProj = (index + pSlides.length) % pSlides.length;
      pSlides[currProj].classList.add('active');
      pDots[currProj].classList.add('active');
    }
    
    pDots.forEach((dot, i) => dot.addEventListener('click', () => goToProj(i)));
    
    const pPrev = document.getElementById('projectsPrev');
    const pNext = document.getElementById('projectsNext');
    if(pPrev) pPrev.addEventListener('click', () => goToProj(currProj - 1));
    if(pNext) pNext.addEventListener('click', () => goToProj(currProj + 1));

    if (projects.items.length > 1) setInterval(() => goToProj(currProj + 1), 7000);
  }

  // ==================== 6. GALLERY ====================
  if (gallery && gallery.images) {
    document.getElementById('galleryGrid').innerHTML = gallery.images.map(img => `
      <div class="gallery-item"><img src="${img}" alt="صورة" loading="lazy"></div>
    `).join('');
  }

  // ==================== 7. CONTACT ====================
  if (contact) {
    document.getElementById('contactInfoBar').innerHTML = `
      <a href="mailto:${contact.email}" class="contact-info-item"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><span>${contact.email}</span></a>
      <a href="tel:${contact.phone}" class="contact-info-item"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span dir="ltr">${contact.phone}</span></a>
      <div class="contact-info-item"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>${contact.address}</span></div>
    `;
    
    document.getElementById('contactSocials').innerHTML = `
      <a href="#"><svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
      <a href="#"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
      <a href="#"><svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
    `;
  }

  // ==================== 8. HEADER & DRAWER ====================
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const drawerClose = document.getElementById('drawerClose');
  
  if(header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 6);
    }, { passive: true });
  }

  if (menuToggle && drawer && overlay && drawerClose) {
    menuToggle.addEventListener('click', () => {
      drawer.classList.add('open'); overlay.classList.add('open'); document.body.classList.add('drawer-open');
    });
    const closeDrawer = () => {
      drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.classList.remove('drawer-open');
    };
    drawerClose.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
  }
});