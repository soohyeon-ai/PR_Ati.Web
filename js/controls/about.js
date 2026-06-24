/**
 * About (회사소개) Page Control
 * - About ATI / History / ESG 탭 전환 (URL 해시 연동)
 * - about 전용 스크롤 진입 애니메이션 (.is-visible 토글)
 * - History 타임라인 가운데 진행선 스크롤 스크럽
 */
const AboutPage = (function () {
  let tabs = [];
  let panels = {};
  let revealObserver;

  // 탭 ↔ 해시 매핑
  const HASH_TO_TAB = { '#about': 'about', '#mission': 'about', '#history': 'history', '#esg': 'esg' };

  function init() {
    tabs = Array.prototype.slice.call(document.querySelectorAll('.about-tab'));
    document.querySelectorAll('.about-panel').forEach(function (p) {
      panels[p.getAttribute('data-panel')] = p;
    });
    if (!tabs.length) return;

    bindTabs();
    initCapNetwork();
    initEsgCarousel();
    initReveal();
    initScrubbers();

    // 진입 시 해시로 탭 선택 (#mission 은 about 탭 + 해당 섹션으로 스크롤)
    var hash = window.location.hash;
    var initialTab = HASH_TO_TAB[hash] || 'about';
    activateTab(initialTab, false);
    if (hash === '#mission' || hash === '#history' || hash === '#esg' || hash === '#about') {
      requestAnimationFrame(function () { scrollToHash(hash); });
    }

    window.addEventListener('hashchange', function () {
      var t = HASH_TO_TAB[window.location.hash];
      if (t) { activateTab(t, false); scrollToHash(window.location.hash); }
    });
  }

  function bindTabs() {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activateTab(tab.getAttribute('data-tab'), true);
      });
    });
  }

  function activateTab(name, scrollTop) {
    if (!panels[name]) name = 'about';
    tabs.forEach(function (tab) {
      tab.classList.toggle('about-tab--active', tab.getAttribute('data-tab') === name);
    });
    Object.keys(panels).forEach(function (key) {
      panels[key].classList.toggle('about-panel--active', key === name);
    });

    // 패널이 바뀌면 새로 노출되는 요소들의 애니메이션을 다시 평가
    refreshReveal();
    recalcTimeline();

    if (scrollTop) {
      var headerH = (document.getElementById('header') || {}).offsetHeight || 0;
      var tabsEl = document.querySelector('.about-tabs');
      var y = tabsEl ? tabsEl.offsetTop - headerH : 0;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  function scrollToHash(hash) {
    var map = { '#mission': '#mission', '#history': '#history', '#esg': '#esg' };
    var sel = map[hash];
    var el = sel ? document.querySelector(sel) : null;
    if (!el) return;
    var headerH = (document.getElementById('header') || {}).offsetHeight || 0;
    var tabsH = (document.querySelector('.about-tabs') || {}).offsetHeight || 0;
    var y = el.getBoundingClientRect().top + window.scrollY - headerH - tabsH - 10;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  /* ---- 스크롤 진입 애니메이션 ---- */
  var REVEAL_SELECTOR = '.cap-images, .cap-network, .pillar-grid, .vision, .about-wide-image, .timeline__item, .esg-banner';

  function initReveal() {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
    refreshReveal();
  }

  function refreshReveal() {
    if (!revealObserver) return;
    document.querySelectorAll(REVEAL_SELECTOR).forEach(function (el) {
      // 활성 패널 안에 있고 아직 노출 전인 요소만 관찰
      if (el.closest('.about-panel') && !el.closest('.about-panel--active')) return;
      revealObserver.observe(el);
    });
  }

  /* ---- Capabilities 연결선 ----
   * 펄 위치를 실제로 측정해 Wafer → Reticle → Package → PCB → Biotech 순서(진행 방향)로
   * 하나의 선을 잇고, 화면에 들어오면 시작(Wafer)부터 끝까지 그려지는 애니메이션을 준다.
   * (선은 SVG가 펄 뒤에 있어 펄 사이 간격에서만 보인다 → 끊김 없이 이어진 흐름) */
  function initCapNetwork() {
    var net = document.querySelector('.cap-network');
    if (!net) return;
    var svg = net.querySelector('.cap-network__svg');
    var path = svg && svg.querySelector('path');
    if (!svg || !path) return;

    // 진행 순서대로 펄 수집 (top: Wafer/Reticle/Package, bottom: Biotech/PCB)
    var top = net.querySelectorAll('.cap-row--top .cap-pill');
    var bottom = net.querySelectorAll('.cap-row--bottom .cap-pill');
    var seq = [top[0], top[1], top[2], bottom[1], bottom[0]].filter(Boolean); // …→PCB→Biotech
    if (seq.length < 2) return;

    function build() {
      var nr = net.getBoundingClientRect();
      if (!nr.width) return;
      svg.setAttribute('viewBox', '0 0 ' + nr.width.toFixed(0) + ' ' + nr.height.toFixed(0));
      svg.setAttribute('preserveAspectRatio', 'none');
      var d = seq.map(function (p, i) {
        var r = p.getBoundingClientRect();
        var x = (r.left - nr.left + r.width / 2).toFixed(1);
        var y = (r.top - nr.top + r.height / 2).toFixed(1);
        return (i ? 'L' : 'M') + x + ' ' + y;
      }).join(' ');
      path.setAttribute('d', d);

      var len = path.getTotalLength();
      var visible = net.classList.contains('is-visible');
      path.style.transition = 'none';
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = visible ? 0 : len;
      // 강제 reflow 후 transition 복구 (다음 is-visible 토글에서 그려지도록)
      void path.getBoundingClientRect();
      path.style.transition = '';
    }

    // is-visible 가 켜지면 라인을 Wafer→Biotech 방향으로 그려준다.
    var mo = new MutationObserver(function () {
      if (net.classList.contains('is-visible')) path.style.strokeDashoffset = 0;
    });
    mo.observe(net, { attributes: true, attributeFilter: ['class'] });

    build();
    window.addEventListener('resize', build, { passive: true });
    window.addEventListener('load', build);
  }

  /* ---- ESG 인트로 이미지 캐러셀 (coverflow 자동 전환) ---- */
  function initEsgCarousel() {
    var root = document.getElementById('esg-gallery');
    if (!root) return;
    var items = Array.prototype.slice.call(root.querySelectorAll('.esg-gallery__item'));
    var dotsWrap = root.querySelector('.esg-gallery__dots');
    var n = items.length;
    if (n < 2) { if (items[0]) items[0].classList.add('is-active'); return; }

    var idx = 0, timer = null, DELAY = 3200;
    var dots = [];

    if (dotsWrap) {
      items.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'esg-gallery__dot';
        b.setAttribute('aria-label', (i + 1) + '번 이미지 보기');
        b.addEventListener('click', function () { go(i); start(); });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }

    function render() {
      items.forEach(function (it, i) {
        it.classList.remove('is-active', 'is-prev', 'is-next');
        if (i === idx) it.classList.add('is-active');
        else if (i === (idx - 1 + n) % n) it.classList.add('is-prev');
        else if (i === (idx + 1) % n) it.classList.add('is-next');
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
    }
    function go(i) { idx = (i + n) % n; render(); }
    function start() { stop(); timer = setInterval(function () { go(idx + 1); }, DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    // hover 와 무관하게 계속 자동 전환 (멈추지 않음)
    render();
    start();
  }

  /* ---- 스크롤 스크럽 통합 ----
   * 1) History 타임라인 진행선
   * 2) Company Overview 첫 문단 강조구문 좌→우 빨강 채움
   * 3) Capabilities 가로 스크롤(핀 고정 후 가로 이동, 다 보면 해제) */
  var timeline, progress, ovSection, ovSticky, ovP1, ovBlock1, ovBlock2, capSection, capTrack;
  var historyDecadeEl, historyItems = [], lastDecade = '';
  var esgIsoSection, esgIsoPin, isoItems = [], esgIsoStatic = false;
  var capScrub = false, ovScrub = false, ticking = false;

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function isMobile() { return window.innerWidth <= 992; }

  function initScrubbers() {
    timeline = document.querySelector('.timeline');
    progress = document.querySelector('.timeline__progress');
    historyDecadeEl = document.getElementById('history-decade');
    historyItems = Array.prototype.slice.call(document.querySelectorAll('.timeline__item[data-year]'));
    esgIsoSection = document.querySelector('.esg-iso-section');
    esgIsoPin = esgIsoSection ? esgIsoSection.querySelector('.iso-pin') : null;
    isoItems = Array.prototype.slice.call(document.querySelectorAll('.iso-item'));
    ovSection = document.querySelector('.ov-section');
    ovSticky = ovSection ? ovSection.querySelector('.ov-sticky') : null;
    ovP1 = document.querySelector('.ov-p1');
    ovBlock1 = document.querySelector('.ov-block--1');
    ovBlock2 = document.querySelector('.ov-block--2');
    capSection = document.getElementById('cap-scroll');
    capTrack = document.getElementById('cap-scroll-track');

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', function () { requestAnimationFrame(updateAll); });
    applyCapMode();
    applyOvMode();
    applyEsgIsoMode();
    updateAll();
  }

  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(updateAll); } }
  function onResize() { applyCapMode(); applyOvMode(); applyEsgIsoMode(); requestAnimationFrame(updateAll); }

  function updateAll() {
    ticking = false;
    updateTimeline();
    updateHistoryDecade();
    updateOverview();
    updateCapScroll();
    updateEsgIso();
  }

  /* ESG ISO 핀 스크럽: 2열 그리드를 중앙→상단 + 항목 순차 등장 */
  var isoHeadEl, isoInnerEl;

  function applyEsgIsoMode() {
    if (!esgIsoSection) return;
    isoHeadEl = esgIsoPin ? esgIsoPin.querySelector('.iso-pin__head') : null;
    isoInnerEl = esgIsoPin ? esgIsoPin.querySelector('.iso-pin__inner') : null;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile() || reduced) {
      esgIsoSection.classList.add('esg-iso--static');
      esgIsoStatic = true;
      isoItems.forEach(function (it) { it.classList.add('is-shown'); });
      if (isoInnerEl) isoInnerEl.style.transform = '';
    } else {
      esgIsoSection.classList.remove('esg-iso--static');
      esgIsoStatic = false;
    }
  }

  function updateEsgIso() {
    if (!esgIsoSection || esgIsoStatic || !esgIsoSection.offsetParent || !esgIsoPin) return;
    var scrollable = esgIsoSection.offsetHeight - esgIsoPin.offsetHeight;
    var rect = esgIsoSection.getBoundingClientRect();
    var p = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;

    if (isoInnerEl && isoHeadEl) {
      var pinH = esgIsoPin.clientHeight;
      var padTop = parseInt(getComputedStyle(esgIsoPin).paddingTop, 10) || 0;
      var usable = pinH - padTop;
      var headH = isoHeadEl.offsetHeight;
      var shift = Math.max(0, (usable - headH) / 2);
      var phase = clamp(p / 0.16, 0, 1);
      var eased = 1 - Math.pow(1 - phase, 3);
      isoInnerEl.style.transform = 'translateY(' + (shift * (1 - eased)).toFixed(1) + 'px)';
    }

    var n = isoItems.length;
    for (var i = 0; i < n; i++) {
      var threshold = 0.18 + (i / n) * 0.36;
      isoItems[i].classList.toggle('is-shown', p >= threshold);
    }
  }

  /* History 연대 라벨: 화면 기준선(뷰포트 45%)을 지난 마지막 연도를 찾아
   * 10년 단위 그룹 라벨로 회색 텍스트를 교체한다. */
  function decadeLabelFor(year) {
    if (year <= 2010) return '1996~2010';
    if (year <= 2020) return '2011~2020';
    return '2021~2025';
  }

  function updateHistoryDecade() {
    if (!historyDecadeEl || !historyItems.length || !historyDecadeEl.offsetParent) return;
    var line = window.innerHeight * 0.45;
    var activeYear = parseInt(historyItems[0].getAttribute('data-year'), 10);
    for (var i = 0; i < historyItems.length; i++) {
      var top = historyItems[i].getBoundingClientRect().top;
      if (top <= line) activeYear = parseInt(historyItems[i].getAttribute('data-year'), 10);
      else break;
    }
    var label = decadeLabelFor(activeYear);
    if (label === lastDecade) return;
    lastDecade = label;
    // 짧은 페이드 후 텍스트 교체
    historyDecadeEl.classList.add('is-changing');
    window.clearTimeout(historyDecadeEl._swap);
    historyDecadeEl._swap = window.setTimeout(function () {
      historyDecadeEl.textContent = label;
      historyDecadeEl.classList.remove('is-changing');
    }, 200);
  }

  function updateTimeline() {
    if (!timeline || !progress || !timeline.offsetParent) return;
    var rect = timeline.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * 0.5;
    var total = rect.height + start;
    var p = clamp((start - rect.top) / total, 0, 1);
    progress.style.height = (p * 100) + '%';

    // 진행선(빨강)이 지나온 마디는 회색 → 빨강으로 전환
    var progressPx = p * rect.height;
    for (var i = 0; i < historyItems.length; i++) {
      var it = historyItems[i];
      var dotY = it.offsetTop + 25; // 마디 중심 y
      it.classList.toggle('is-reached', dotY <= progressPx);
    }
  }

  function applyOvMode() {
    if (!ovSection) return;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile() || reduced) {
      ovSection.classList.add('ov-section--static');
      ovScrub = false;
      clearOvReveal();
    } else {
      ovSection.classList.remove('ov-section--static');
      ovScrub = true;
    }
  }

  function setBlock(el, opacity, ty) {
    if (!el) return;
    el.style.opacity = opacity.toFixed(3);
    el.style.transform = 'translateY(' + ty.toFixed(1) + 'px)';
  }

  // 정적 폴백: inline 스타일을 비워 CSS(보임 상태)가 적용되게 하고 강조구문은 채워둔다.
  function clearOvReveal() {
    [ovBlock1, ovBlock2].forEach(function (el) {
      if (el) { el.style.opacity = ''; el.style.transform = ''; }
    });
    if (ovP1) ovP1.style.setProperty('--fill', '100%');
  }

  /* Company Overview 핀 스크럽:
   * 진행도(0~1)에 따라 1번 블록(이미지+1번 글)이 먼저 등장(+강조구문 빨강 채움)하고,
   * 이어서 2번 블록(이미지+2번 글)이 등장한 뒤 고정이 풀려 다음 레이아웃으로 넘어간다. */
  function updateOverview() {
    if (!ovScrub || !ovSection || !ovSticky || !ovSection.offsetParent) return;
    var rect = ovSection.getBoundingClientRect();
    var scrollable = ovSection.offsetHeight - ovSticky.offsetHeight;
    var p = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;

    // 1번 블록: 0.05~0.30 등장 → 0.50~0.68 위로 빠지며 사라짐
    var enter1 = clamp((p - 0.05) / 0.25, 0, 1);
    var leave1 = clamp((p - 0.50) / 0.18, 0, 1);
    setBlock(ovBlock1, enter1 * (1 - leave1), (1 - enter1) * 40 - leave1 * 40);

    // 강조 구문 좌→우 빨강 채움 (1번 블록이 자리잡은 뒤)
    if (ovP1) ovP1.style.setProperty('--fill', (clamp((p - 0.18) / 0.26, 0, 1) * 100).toFixed(1) + '%');

    // 2번 블록: 0.52~0.80 아래에서 올라오며 등장
    var enter2 = clamp((p - 0.52) / 0.28, 0, 1);
    setBlock(ovBlock2, enter2, (1 - enter2) * 40);
  }

  function applyCapMode() {
    if (!capSection) return;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile() || reduced) {
      capSection.classList.add('cap-scroll--static');
      capScrub = false;
      if (capTrack) capTrack.style.transform = '';
    } else {
      capSection.classList.remove('cap-scroll--static');
      capScrub = true;
    }
  }

  function updateCapScroll() {
    if (!capScrub || !capSection || !capTrack || !capSection.offsetParent) return;
    var overflow = capTrack.scrollWidth - window.innerWidth;
    if (overflow <= 0) { capTrack.style.transform = 'translateX(0)'; return; }
    var rect = capSection.getBoundingClientRect();
    var scrollable = capSection.offsetHeight - window.innerHeight;
    var p = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
    capTrack.style.transform = 'translateX(' + (-p * overflow) + 'px)';
  }

  function recalcTimeline() { requestAnimationFrame(updateAll); }

  return { init };
})();

document.addEventListener('DOMContentLoaded', function () {
  // 공통 컨트롤 (존재할 때만 초기화 — 메인 페이지의 main.js 역할을 about 전용으로 축약)
  if (typeof Navigation !== 'undefined') Navigation.init();
  if (typeof SmoothScroll !== 'undefined') SmoothScroll.init();
  if (typeof ScrollAnimations !== 'undefined') ScrollAnimations.init();
  if (typeof I18n !== 'undefined') I18n.init();

  AboutPage.init();

  // 헤더 내부 해시 앵커 부드러운 스크롤
  document.querySelectorAll('a[href^="about.html#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      // 같은 페이지 내 이동이면 hashchange 가 처리하므로 기본 동작 유지
    });
  });
});
