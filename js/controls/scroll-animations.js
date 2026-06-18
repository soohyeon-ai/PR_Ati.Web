/**
 * Scroll Animations Control
 * IntersectionObserver 기반 스크롤 진입 애니메이션 + 스크롤 연동 텍스트 리빌
 */
const ScrollAnimations = (function () {
  let observer;
  let scrollTopContainer;
  let scrollTopBtn;
  let scrollDownBtn;

  function init() {
    initIntersectionObserver();
    initScrollToTop();
    initInnovationScrub();
    initAboutGallery();
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function initIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.15,
    };

    observer = new IntersectionObserver(handleIntersection, options);

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  }

  function handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }

  /**
   * Innovation 섹션 스크롤 스크럽
   * 섹션을 250vh 트랙 + 내부 sticky 무대로 구성하고,
   * 스크롤 진행도(0~1)에 따라 두 단계를 직접 제어한다.
   *   1) 진행도 0 ~ REVEAL_END : 글자들이 순차적으로 스크롤하며 등장
   *   2) 진행도 ZOOM_START ~ 1 : 레이아웃 전체가 확대되며 사라지고,
   *      그 뒤로 About 섹션이 이어서 드러난다.
   * 모바일(992px 이하, 네이티브 스크롤)에서는 스크럽을 끄고
   * 단순 등장 애니메이션으로 폴백한다.
   */
  function initInnovationScrub() {
    const section = document.querySelector('.innovation');
    if (!section) return;

    const sticky = section.querySelector('.innovation__sticky');
    const content = section.querySelector('.innovation__content');
    const bg = section.querySelector('.innovation__bg');
    const overlay = section.querySelector('.innovation__overlay');
    const words = Array.prototype.slice.call(
      section.querySelectorAll('[data-scroll-reveal]')
    );
    if (!content || !words.length) return;

    const REVEAL_END = 0.45;   // 글자 등장이 끝나는 진행도
    const ZOOM_START = 0.5;    // 확대/소멸이 시작되는 진행도
    const ZOOM_SCALE = 2.6;    // 최종 확대 배율
    const BG_SCALE = 0.28;     // 배경 추가 확대량

    let scrubEnabled = false;
    let ticking = false;

    function isMobile() {
      return window.innerWidth <= 992;
    }

    function easeInCubic(t) {
      return t * t * t;
    }

    function setWords(progress) {
      const n = words.length;
      const span = REVEAL_END / n;
      for (let i = 0; i < n; i++) {
        const start = i * span;
        // 1.8배 겹침으로 부드럽게 이어지도록
        const t = clamp((progress - start) / (span * 1.8), 0, 1);
        const w = words[i];
        w.style.opacity = t;
        w.style.transform = 'translateY(' + (1 - t) * 40 + 'px)';
      }
    }

    function update() {
      ticking = false;
      if (!scrubEnabled) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = section.offsetHeight - vh;
      const p = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;

      // 1단계: 글자 스크럽 등장
      setWords(p);

      // 2단계: 레이아웃 확대 + 소멸
      const z = clamp((p - ZOOM_START) / (1 - ZOOM_START), 0, 1);
      const ez = easeInCubic(z);
      content.style.transform = 'scale(' + (1 + ez * (ZOOM_SCALE - 1)) + ')';
      content.style.opacity = String(1 - ez);
      if (bg) bg.style.transform = 'scale(' + (1 + ez * BG_SCALE) + ')';
      if (overlay) overlay.style.opacity = String(0.4 + ez * 0.4);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function clearInlineStyles() {
      words.forEach(w => {
        w.style.opacity = '';
        w.style.transform = '';
      });
      content.style.transform = '';
      content.style.opacity = '';
      if (bg) bg.style.transform = '';
      if (overlay) overlay.style.opacity = '';
    }

    function enableScrub() {
      if (scrubEnabled) return;
      scrubEnabled = true;
      section.classList.add('innovation--scrub');
      // 폴백용 클래스 제거 후 inline 스크럽으로 전환
      words.forEach(w => w.classList.remove('revealed'));
      update();
    }

    function disableScrub() {
      if (!scrubEnabled) return;
      scrubEnabled = false;
      section.classList.remove('innovation--scrub');
      clearInlineStyles();
      // 모바일 폴백: 글자를 그냥 보여준다.
      words.forEach(w => w.classList.add('revealed'));
    }

    function applyMode() {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isMobile() || reduced) {
        disableScrub();
        // 데스크탑에서 모션 최소화 설정 시 빈 스크롤 트랙이 생기지 않도록 축소
        if (!isMobile()) section.style.height = '100vh';
      } else {
        section.style.height = '';
        enableScrub();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', applyMode, { passive: true });
    applyMode();
  }

  /**
   * About 우측 3-이미지 갤러리 — 스크롤 스크럽(핀 고정)
   * 데스크탑: 섹션을 긴 트랙(.about--scrub)으로 만들고 무대를 sticky로 고정한 뒤,
   *   스크롤 진행도(0~1)에 맞춰 갤러리 트랙을 위로 밀어 위→가운데→아래 이미지를
   *   끝까지 다 보여준 다음에야 고정이 풀려 다음 섹션으로 넘어간다.
   * 모바일(992px 이하)·모션 최소화: 스크럽을 끄고 3장을 그대로 펼쳐 보여준다.
   */
  function initAboutGallery() {
    const section = document.querySelector('.about');
    const gallery = document.getElementById('about-gallery');
    const track = document.getElementById('about-gallery-track');
    if (!section || !gallery || !track) return;

    let scrubEnabled = false;
    let ticking = false;

    function isMobile() {
      return window.innerWidth <= 992;
    }

    function update() {
      ticking = false;
      if (!scrubEnabled) return;

      const overflow = track.scrollHeight - gallery.clientHeight;
      if (overflow <= 0) {
        track.style.transform = 'translateY(0)';
        return;
      }

      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - vh; // 고정이 유지되는 스크롤 구간
      const p = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
      // p=0 → 맨 위 이미지, p=1 → 맨 아래 이미지 (전부 노출)
      track.style.transform = 'translateY(' + (-p * overflow) + 'px)';
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function enableScrub() {
      if (scrubEnabled) return;
      scrubEnabled = true;
      section.classList.add('about--scrub');
      update();
    }

    function disableScrub() {
      if (!scrubEnabled) return;
      scrubEnabled = false;
      section.classList.remove('about--scrub');
      track.style.transform = ''; // 모바일: 펼친 상태로 복귀
    }

    function applyMode() {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isMobile() || reduced) {
        disableScrub();
      } else {
        enableScrub();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', applyMode, { passive: true });
    // 이미지 로드 후 높이가 바뀌면 다시 계산
    window.addEventListener('load', update);
    applyMode();
  }

  function initScrollToTop() {
    scrollTopContainer = document.getElementById('scroll-top');
    scrollTopBtn = document.getElementById('scroll-top-btn');
    scrollDownBtn = document.getElementById('scroll-down-btn');

    if (!scrollTopContainer) return;

    window.addEventListener('scroll', toggleScrollButton, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      SmoothScroll.scrollTo(0);
    });

    scrollDownBtn.addEventListener('click', function () {
      const sections = document.querySelectorAll(
        '.hero, .innovation, .about, .products-interactive, .news, .products-cards, .footer'
      );
      const currentScroll = window.scrollY;
      for (const section of sections) {
        if (section.offsetTop > currentScroll + 10) {
          SmoothScroll.scrollToElement(section, 0);
          return;
        }
      }
    });
  }

  function toggleScrollButton() {
    const scrollY = window.scrollY;
    scrollTopContainer.classList.toggle('scroll-top--visible', scrollY > 400);
  }

  return { init };
})();
