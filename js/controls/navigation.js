/**
 * Navigation Control
 * 헤더 스크롤 반응, 모바일 메뉴 토글, 스크롤 프로그레스 바
 */
const Navigation = (function () {
  let header;
  let mobileToggle;
  let nav;
  let navOverlay;
  let scrollProgress;
  let isOpen = false;

  let megaMenu;
  let navItems;
  let megaCols;
  let megaCloseTimer = null;

  function init() {
    header = document.getElementById('header');
    mobileToggle = document.getElementById('mobile-toggle');
    nav = document.getElementById('main-nav');
    megaMenu = document.getElementById('mega-menu');
    navItems = document.querySelectorAll('.nav__item[data-menu]');
    megaCols = document.querySelectorAll('.mega-menu__column[data-col]');

    createOverlay();
    createScrollProgress();
    bindEvents();
    bindMegaMenu();
    updateHeaderOnScroll();
  }

  function createOverlay() {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    navOverlay.id = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  function createScrollProgress() {
    scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
  }

  function syncColumnWidths() {
    navItems.forEach(function (item) {
      var key = item.getAttribute('data-menu');
      var col = megaMenu.querySelector('.mega-menu__column[data-col="' + key + '"]');
      if (col) {
        col.style.width = item.offsetWidth + 'px';
      }
    });
  }

  function bindMegaMenu() {
    syncColumnWidths();
    window.addEventListener('resize', syncColumnWidths);

    navItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        clearTimeout(megaCloseTimer);
        openMegaMenu(item.getAttribute('data-menu'));
      });
      item.addEventListener('mouseleave', scheduleMegaClose);
    });

    megaMenu.addEventListener('mouseenter', function () {
      clearTimeout(megaCloseTimer);
    });
    megaMenu.addEventListener('mouseleave', scheduleMegaClose);
  }

  function openMegaMenu(activeKey) {
    syncColumnWidths();
    megaMenu.classList.add('mega-menu--open');
    header.classList.add('header--mega-open');

    navItems.forEach(function (item) {
      item.classList.toggle('nav__item--active', item.getAttribute('data-menu') === activeKey);
    });
    megaCols.forEach(function (col) {
      col.classList.toggle('mega-menu__column--active', col.getAttribute('data-col') === activeKey);
    });
  }

  function closeMegaMenu() {
    megaMenu.classList.remove('mega-menu--open');
    header.classList.remove('header--mega-open');
    navItems.forEach(function (item) { item.classList.remove('nav__item--active'); });
    megaCols.forEach(function (col) { col.classList.remove('mega-menu__column--active'); });
  }

  function scheduleMegaClose() {
    clearTimeout(megaCloseTimer);
    megaCloseTimer = setTimeout(closeMegaMenu, 180);
  }

  function bindEvents() {
    mobileToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          closeMegaMenu();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            closeMenu();
          }
        }
      });
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
  }

  function toggleMenu() {
    isOpen = !isOpen;
    nav.classList.toggle('header__nav--open', isOpen);
    navOverlay.classList.toggle('nav-overlay--active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    mobileToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');

    const spans = mobileToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    }
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;
    nav.classList.remove('header__nav--open');
    navOverlay.classList.remove('nav-overlay--active');
    document.body.style.overflow = '';

    const spans = mobileToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }

  function handleScroll() {
    updateHeaderOnScroll();
    updateScrollProgress();
  }

  function updateHeaderOnScroll() {
    const scrollY = window.scrollY;
    header.classList.toggle('header--scrolled', scrollY > 50);
  }

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  function handleResize() {
    if (window.innerWidth > 992 && isOpen) {
      closeMenu();
    }
  }

  return { init };
})();
