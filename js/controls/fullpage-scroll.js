/**
 * Smooth Scroll Control
 * 자유 스크롤 + lerp(보간) 기반의 부드럽고 약간 무거운 관성 스크롤.
 * 섹션 단위로 턱턱 넘어가지 않고, 요즘 웹사이트처럼 느릿하게 따라오는 느낌.
 */
const SmoothScroll = (function () {
  // 0에 가까울수록 더 느리고 무겁게, 1에 가까울수록 즉각적으로 따라온다.
  const EASE = 0.072;

  let target = 0;
  let current = 0;
  let isRunning = false;
  let enabled = false;

  function isMobile() {
    return window.innerWidth <= 992;
  }

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function init() {
    // 모바일/터치 환경은 네이티브 스크롤이 더 자연스러우므로 그대로 둔다.
    if (isMobile()) return;

    enabled = true;
    target = window.scrollY || 0;
    current = target;

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onResize, { passive: true });
    // 스크롤바 드래그 / 네이티브 smooth 스크롤과 위치 동기화
    window.addEventListener('scroll', onNativeScroll, { passive: true });
  }

  function onWheel(e) {
    e.preventDefault();
    target = clamp(target + e.deltaY, 0, maxScroll());
    start();
  }

  function onKeydown(e) {
    const page = window.innerHeight * 0.85;
    let delta = 0;

    if (e.key === 'ArrowDown') delta = 120;
    else if (e.key === 'ArrowUp') delta = -120;
    else if (e.key === 'PageDown' || e.key === ' ') delta = page;
    else if (e.key === 'PageUp') delta = -page;
    else if (e.key === 'Home') { e.preventDefault(); scrollTo(0); return; }
    else if (e.key === 'End') { e.preventDefault(); scrollTo(maxScroll()); return; }
    else return;

    e.preventDefault();
    target = clamp(target + delta, 0, maxScroll());
    start();
  }

  function onResize() {
    target = clamp(target, 0, maxScroll());
  }

  function onNativeScroll() {
    // 우리 루프가 돌고 있지 않을 때 발생한 스크롤은 외부 요인(스크롤바 등)이므로 동기화.
    if (!isRunning) {
      current = window.scrollY;
      target = window.scrollY;
    }
  }

  function start() {
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(loop);
    }
  }

  function loop() {
    current += (target - current) * EASE;

    if (Math.abs(target - current) < 0.4) {
      current = target;
      window.scrollTo(0, current);
      isRunning = false;
      return;
    }

    window.scrollTo(0, current);
    requestAnimationFrame(loop);
  }

  function scrollTo(targetY) {
    if (!enabled) {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      return;
    }
    target = clamp(targetY, 0, maxScroll());
    start();
  }

  function scrollToElement(el, offset) {
    if (!el) return;
    const base = enabled ? current : (window.scrollY || 0);
    const top = el.getBoundingClientRect().top + base - (offset || 0);
    scrollTo(top);
  }

  return { init, scrollTo, scrollToElement };
})();

// 기존 호출부 호환용 별칭
const FullpageScroll = {
  init: SmoothScroll.init,
  scrollTo: SmoothScroll.scrollTo,
  scrollToElement: SmoothScroll.scrollToElement,
};
