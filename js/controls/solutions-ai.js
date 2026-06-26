/**
 * Solution & Services — AI Technology page control
 *
 * 1) 히어로 타이틀 스크롤 필: 스크롤 진행도에 따라 글자가 왼쪽→오른쪽으로
 *    회색(rgba 0.22) → 흰색으로 순차적으로 차오른다.
 * 2) 전역 배경 스크럽: 히어로 영역을 지나 흰색 섹션으로 넘어가는 구간에서
 *    남색 배경과 글로우가 흰색으로 자연스럽게 전환된다.
 *
 * 두 효과 모두 requestAnimationFrame 으로 스크롤에 직접 연동(scrub)한다.
 */
(function () {
  'use strict';

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  /* ---- 1. 히어로 타이틀: 글자 단위 스팬 생성 (언어별 텍스트) ---- */
  function currentLang() {
    var l = document.documentElement.getAttribute('lang');
    return l === 'ko' ? 'ko' : 'en';
  }

  function buildFillTitle(el, lang) {
    var text = el.getAttribute('data-fill-' + lang) ||
               el.getAttribute('data-fill-en') || el.textContent;
    el.textContent = '';
    var chars = [];
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      var span = document.createElement('span');
      span.className = 'sai-fill__ch';
      // 공백은 줄바꿈 시 자연스럽도록 nbsp 대신 일반 공백 유지
      span.textContent = c;
      if (c === ' ') span.style.whiteSpace = 'pre';
      el.appendChild(span);
      chars.push(span);
    }
    return chars;
  }

  /* Tailored 섹션: 데스크탑에서 섹션을 길게(핀 트랙) 만들고 내부를 sticky 로
     고정한 뒤, 고정된 동안 스크롤 진행도(0~1)에 맞춰 세 이미지를 하나씩 노출한다.
     셋이 모두 등장하면 고정이 풀려 다음 섹션으로 넘어간다.
     모바일·모션 최소화에서는 핀을 끄고 단순히 차례로 보여준다. */
  function initTailoredReveal() {
    var section = document.querySelector('.sai-tailored');
    if (!section) return;
    var tiles = Array.prototype.slice.call(section.querySelectorAll('.sai-tile'));
    if (!tiles.length) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 각 타일이 등장하는 스크롤 진행도 임계값 (DOM 순서: Machines → Tailored → Software)
    var THRESHOLDS = [0.14, 0.42, 0.70];
    var TRACK_VH = 2.6;   // 섹션 전체 높이 = 화면의 2.6배 (1 고정 + 1.6 스크롤 여행)
    var pinned = false;
    var ticking = false;

    function isDesktop() { return window.innerWidth > 1024; }

    function enablePin() {
      if (pinned) return;
      pinned = true;
      section.classList.add('is-pinned');
      section.style.height = (TRACK_VH * 100) + 'vh';
    }
    function disablePin() {
      if (!pinned) return;
      pinned = false;
      section.classList.remove('is-pinned');
      section.style.height = '';
    }

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      var rect = section.getBoundingClientRect();
      var p;
      if (pinned) {
        // 고정 트랙 진행도: 섹션 상단이 화면 상단에 닿을 때 0, 끝까지 스크롤하면 1
        var scrollable = section.offsetHeight - vh;
        p = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 1;
      } else {
        // 폴백: 섹션이 뷰포트를 지나는 진행도
        p = clamp((vh - rect.top) / (rect.height + vh), 0, 1);
      }
      tiles.forEach(function (t, i) {
        if (p >= THRESHOLDS[i]) t.classList.add('is-in');
        else t.classList.remove('is-in');
      });
    }

    function onScroll() {
      // 일부 환경에서 rAF 가 지연돼 등장이 끊기지 않도록 즉시 한 번 갱신도 수행
      update();
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function applyMode() {
      if (reduced) {
        disablePin();
        tiles.forEach(function (t) { t.classList.add('is-in'); });
        return;
      }
      if (isDesktop()) enablePin();
      else disablePin();
      update();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', applyMode, { passive: true });
    applyMode();
  }

  function init() {
    if (typeof Navigation !== 'undefined') Navigation.init();
    if (typeof ScrollAnimations !== 'undefined') ScrollAnimations.init();
    if (typeof I18n !== 'undefined') I18n.init();

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var titleEl = document.getElementById('sai-hero-title');
    var track = document.getElementById('sai-hero-track');
    var backdrop = document.getElementById('sai-backdrop');
    var glow = document.getElementById('sai-glow');
    var howto = document.querySelector('.sai-howto');

    var chars = titleEl ? buildFillTitle(titleEl, currentLang()) : [];

    // 배경 전환 색 (남색 → 흰색)
    var NAVY = [5, 8, 28];
    var WHITE = [255, 255, 255];

    // 언어 전환 시 히어로 타이틀을 해당 언어 텍스트로 다시 구성하고 채움 상태를 재적용
    document.addEventListener('langchange', function () {
      if (!titleEl) return;
      chars = buildFillTitle(titleEl, currentLang());
      if (prefersReduced) {
        chars.forEach(function (c) { c.classList.add('is-on'); });
      } else {
        update();
      }
    });

    if (prefersReduced) {
      chars.forEach(function (c) { c.classList.add('is-on'); });
      return;
    }

    /* ---- 3. Tailored 이미지: 스크롤 진행도에 맞춰 하나씩 등장 ---- */
    initTailoredReveal();

    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight;

      /* --- 타이틀 필: 고정(pin) 무대의 스크롤 진행도(0~1)에 맞춰 천천히 차오름 ---
         진행도 0 = 전부 회색, FILL_END 지점에서 전부 흰색. 맵은 함께 고정돼 항상 보인다. */
      if (chars.length && track) {
        var trackRect = track.getBoundingClientRect();
        var scrollable = track.offsetHeight - vh;
        var tp = scrollable > 0 ? clamp(-trackRect.top / scrollable, 0, 1) : 1;
        var FILL_END = 0.82;
        var fp = clamp(tp / FILL_END, 0, 1);
        var litTo = fp * chars.length;
        for (var i = 0; i < chars.length; i++) {
          if (i < litTo) chars[i].classList.add('is-on');
          else chars[i].classList.remove('is-on');
        }
      }

      /* --- 배경 스크럽: 흰색 섹션(.sai-howto)이 올라오는 구간에서 전환 --- */
      if (howto && backdrop) {
        var hRect = howto.getBoundingClientRect();
        // howto 상단이 화면 하단(vh)에 들어올 때 0,
        // howto 상단이 화면 중앙(0.42vh)에 닿을 때 1
        var bStart = vh;
        var bEnd = vh * 0.42;
        var bp = easeInOut(clamp((bStart - hRect.top) / (bStart - bEnd), 0, 1));
        var r = Math.round(lerp(NAVY[0], WHITE[0], bp));
        var g = Math.round(lerp(NAVY[1], WHITE[1], bp));
        var b = Math.round(lerp(NAVY[2], WHITE[2], bp));
        backdrop.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
        if (glow) glow.style.opacity = String(1 - bp);
      }
    }

    function onScroll() {
      // rAF 로 한 프레임에 한 번만 실행하되, 일부 환경에서 rAF 가 지연되어
      // 스크럽이 끊기는 것을 막기 위해 즉시 한 번 갱신도 함께 수행한다.
      update();
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
