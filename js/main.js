/**
 * ATI Website - Main Entry Point
 * 모든 컨트롤 초기화 및 전역 이벤트 처리
 */
(function () {
  'use strict';

  function initApp() {
    Navigation.init();
    ProductCarousel.init();
    NewsSlider.init();
    Modal.init();
    ScrollAnimations.init();
    SmoothScroll.init();
    I18n.init();

    initSmoothScrollLinks();
    initHeroScrollButton();
    initProductsMarquee();
  }

  // 제품 카드 트랙을 복제해 끊김 없는 무한 마퀴를 만든다.
  function initProductsMarquee() {
    const track = document.getElementById('products-track');
    if (!track) return;
    const originals = Array.from(track.children);
    originals.forEach(node => {
      const clone = node.cloneNode(true);
      // 복제본은 시각적 무한 스크롤용이므로 스크린리더/검색엔진에서 중복 노출되지 않게 숨김
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  function initSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = document.getElementById('header').offsetHeight;
          SmoothScroll.scrollToElement(target, headerHeight);
        }
      });
    });
  }

  function initHeroScrollButton() {
    const scrollBtn = document.querySelector('.scroll-btn');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', function () {
        SmoothScroll.scrollToElement(document.getElementById('innovation'), 0);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
