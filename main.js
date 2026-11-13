document.addEventListener('DOMContentLoaded', async () => {
  
  // 1. جلب البيانات (JSON)
  const fetchData = async (file) => {
    try {
      const res = await fetch(`content/${file}.json`);
      return res.ok ? await res.json() : null;
    } catch { return null; }
  };

  const [hero, services, about, projects, gallery, contact] = await Promise.all([
    fetchData('hero'), fetchData('services'), fetchData('about'), 
    fetchData('projects'), fetchData('gallery'), fetchData('contact')
  ]);

  // 2. بناء قسم الهيرو (Hero)
  if (hero && hero.slides) {
    const slider = document.getElementById('heroSlider');
    const dots = document.getElementById('heroDots');
    
    slider.innerHTML = hero.slides.map((s, i) => `
      <div class="hero-slide ${i === 0 ? 'active' : ''}">
        <div class="hero-text">
          <h1 class="hero-title">${s.title}</h1>
          <p class="hero-desc">${s.desc}</p>
        </div>
        <div class="hero-media"><img class="hero-img" src="${s.image}" alt="صورة"></div>
        <div class="hero-socials"></div>
      </div>
    `).join('');

    dots.innerHTML = hero.slides.map((_, i) => `
      <button class="hero-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>
    `).join('');

    // تفعيل سلايدر الهيرو
    const slides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
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
    setInterval(() => goToHero(currentHero + 1), 7000);
  }

  // 3. الخدمات (Services)
  if (services && services.items) {
    document.getElementById('servicesGrid').innerHTML = services.items.map(s => `
      <div class="service-card">
        <div class="service-card-inner">
          <h3 class="service-title" style="padding: 20px; font-size: 1rem; color: var(--dark);">${s.title}</h3>
          <p class="service-desc" style="padding: 0 20px; font-size: 0.85rem; color: var(--text-muted);">${s.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // 4. من نحن (About)
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

    // تفعيل التبويبات
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

  // 5. المشاريع (Projects)
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

    dots.innerHTML = projects.items.map((_, i) => `<button class="projects-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`).join('');

    // تفعيل السلايدر
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
    setInterval(() => goToProj(currProj + 1), 7000);
  }

  // 6. المعرض (Gallery)
  if (gallery && gallery.images) {
    document.getElementById('galleryGrid').innerHTML = gallery.images.map(img => `
      <div class="gallery-item"><img src="${img}" alt="صورة" loading="lazy"></div>
    `).join('');
  }

  // 7. التواصل (Contact Info)
  if (contact) {
    document.getElementById('contactInfoBar').innerHTML = `
      <a href="mailto:${contact.email}" class="contact-info-item"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><span>${contact.email}</span></a>
      <a href="tel:${contact.phone}" class="contact-info-item"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span dir="ltr">${contact.phone}</span></a>
      <div class="contact-info-item"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>${contact.address}</span></div>
    `;
    
    // يمكنك إضافة روابط التواصل الاجتماعي هنا بنفس الطريقة
  }

  // 8. الهيدر والقائمة الجانبية (Main JS Logic)
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