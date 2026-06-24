/**
 * Product Listing / Detail Pages Control
 * - 풀스크린 히어로 → 스크롤 시 뚝 끊기며 다음 섹션으로 전환 (JS snap)
 * - 배너 진입 애니메이션
 * - 앵커 스크롤
 */
(function () {
  'use strict';

  var isHeroPage = false;

  function revealAll() {
    document.querySelectorAll('.prod [data-animate]').forEach(function (el) {
      el.classList.add('is-visible');
    });
    document.querySelectorAll('.prod-section').forEach(function (el) {
      el.classList.add('is-snapped');
    });
  }

  function revealSection(section) {
    section.classList.add('is-snapped');
    var children = section.querySelectorAll('[data-animate]');
    children.forEach(function (child, i) {
      setTimeout(function () {
        child.classList.add('is-visible');
      }, i * 100);
    });
  }

  /**
   * 히어로 ↔ 콘텐츠 구간만 스냅 처리.
   * 히어로가 화면에 보이는 동안 스크롤하면
   * 반 이상 보이면 → 히어로로 복귀, 반 이하 → 다음 섹션으로 점프.
   * 제품 목록/푸터는 자유 스크롤.
   */
  function initHeroSnap() {
    var hero = document.querySelector('.prod-section--hero');
    if (!hero) return;

    var next = hero.nextElementSibling;
    if (!next) return;

    var locked = false;
    var timer = null;

    function getNextTop() {
      return next.getBoundingClientRect().top + window.scrollY;
    }

    function snapCheck() {
      if (locked) return;
      var rect = hero.getBoundingClientRect();
      var vh = window.innerHeight;

      if (rect.bottom <= 0 || rect.bottom >= vh) return;

      locked = true;
      var target = rect.bottom > vh * 0.5 ? 0 : getNextTop();
      window.scrollTo({ top: target, behavior: 'smooth' });
      setTimeout(function () { locked = false; }, 650);
    }

    window.addEventListener('scroll', function () {
      clearTimeout(timer);
      timer = setTimeout(snapCheck, 60);
    }, { passive: true });
  }

  function initRevealObserver() {
    var sections = document.querySelectorAll('.prod-section');
    if (!sections.length) return;
    if (!('IntersectionObserver' in window)) { revealAll(); return; }

    var hero = document.querySelector('.prod-section--hero');
    if (hero) revealSection(hero);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revealSection(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    sections.forEach(function (s) {
      if (!s.classList.contains('prod-section--hero')) {
        observer.observe(s);
      }
    });
  }

  function bindAnchorLinks() {
    document.querySelectorAll('.prod a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var id = a.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function init() {
    if (typeof Navigation !== 'undefined') Navigation.init();

    isHeroPage = !!document.querySelector('.prod--hero-first');

    if (isHeroPage) {
      document.body.classList.add('has-hero');
    }

    if (!isHeroPage && typeof SmoothScroll !== 'undefined') SmoothScroll.init();
    if (typeof ScrollAnimations !== 'undefined') ScrollAnimations.init();
    if (typeof I18n !== 'undefined') I18n.init();

    initRevealObserver();
    if (isHeroPage) initHeroSnap();
    bindAnchorLinks();

    setTimeout(function () {
      if (!document.querySelector('.prod [data-animate].is-visible')) revealAll();
    }, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
