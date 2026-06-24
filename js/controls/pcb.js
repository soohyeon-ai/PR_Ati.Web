/**
 * Package & PCB Applications Page Control
 * - 6단계 정밀 검사·마킹·소팅 인터랙티브 스테퍼 (단계 클릭 / Phase 탭 / Prev·Next)
 * - 히어로 통계 카운트업 / KR·EN 이중언어 (langchange 이벤트로 재렌더)
 * 반도체 페이지(semiconductor.js)와 동일한 구조이며 데이터/이미지만 다르다.
 */
(function () {
  'use strict';

  /* ---- 공정 데이터 (Package & PCB Applications Flow) ---- */
  var STEPS = [
    {
      no: 1, name: 'Die Attach & Wire Bonding Inspection', ko: '다이 어태치·와이어 본딩 검사',
      phase: 'Pre-Inspection / Preparation', phaseNo: 1,
      desc: {
        en: 'Inspects the internal connections of the package — die attach, wire bonding, wire loop height, die tilt and more.',
        ko: 'Die Attach, Wire Bonding, Wire Loop Height, Die Tilt 등 패키지 내부 연결 상태를 검사하는 단계입니다.'
      },
      equip: ['IVY2']
    },
    {
      no: 2, name: 'Advanced Package Inspection & Measurement', ko: '어드밴스드 패키지 검사·측정',
      phase: 'Inspection & Measurement', phaseNo: 2,
      desc: {
        en: '2D inspection, 3D height measurement, warpage, particle, scratch, crack, die shift and more.',
        ko: '2D Inspection, 3D Height Measurement, Warpage, Particle, Scratch, Crack, Die Shift 등을 검사합니다.'
      },
      equip: ['CYPRESS2']
    },
    {
      no: 3, name: 'Final Vision Inspection', ko: '최종 비전 검사',
      phase: 'Inspection & Measurement', phaseNo: 2,
      desc: {
        en: 'Final appearance inspection of IC package substrates, Cu posts, CSP, SiP, PBGA, FC-BGA and more.',
        ko: 'IC Package Substrate, Cu Post, CSP, SiP, PBGA, FC-BGA 등의 최종 외관 검사를 수행합니다.'
      },
      equip: ['PINE2-S']
    },
    {
      no: 4, name: 'Laser Marking', ko: '레이저 마킹',
      phase: 'Marking & Traceability', phaseNo: 3,
      desc: {
        en: 'Marks product identification information — PCB X-out marking, 2D barcode marking, wafer ID marking, die marking and more.',
        ko: 'PCB X-Out Marking, 2D Barcode Marking, Wafer ID Marking, Die Marking 등 제품 식별 정보를 마킹합니다.'
      },
      equip: ['LMS']
    },
    {
      no: 5, name: 'Sorting & Identification', ko: '소팅 · 식별',
      phase: 'Sorting & Final Handling', phaseNo: 4,
      desc: {
        en: '2D barcode reading, OCR reading, map-data generation and sorting-bin classification.',
        ko: '2D Barcode Reading, OCR Reading, Map Data 생성, Sorting Bin 분류를 수행합니다.'
      },
      equip: ['ASIS Series']
    },
    {
      no: 6, name: 'JEDEC Tray Inspection & Sorting', ko: 'JEDEC 트레이 검사·소팅',
      phase: 'Sorting & Final Handling', phaseNo: 4,
      desc: {
        en: 'Placement, alignment and missing-unit checks within JEDEC trays, with tray-level inspection and sorting.',
        ko: 'JEDEC Tray 내 제품 배치·정렬·누락 점검 등 트레이 단위 검사와 소팅을 수행합니다.'
      },
      equip: ['JEDI3']
    }
  ];

  var PHASES = [
    { no: 1, name: 'Pre-Inspection / Preparation', steps: [1] },
    { no: 2, name: 'Inspection & Measurement',     steps: [2, 3] },
    { no: 3, name: 'Marking & Traceability',       steps: [4] },
    { no: 4, name: 'Sorting & Final Handling',     steps: [5, 6] }
  ];

  // 단계별 인라인 SVG 아이콘 (Lucide 스타일)
  var ICONS = [
    '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',                 // inspection (magnifier)
    '<rect x="3" y="9" width="18" height="6" rx="1"/><path d="M7 9v3M11 9v3M15 9v3"/>', // measurement (ruler)
    '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>', // vision (eye)
    '<path d="M13 2 4 13h6l-1 9 9-12h-6l1-8Z"/>',                                // laser marking (zap)
    '<path d="M4 6v12M8 6v12M12 6v12M16 6v12M20 6v12"/>',                        // sorting (barcode)
    '<rect x="3" y="13" width="18" height="6" rx="1"/><path d="M3 9h18M7 5h10"/>' // tray (jedec tray)
  ];

  // PCB 설비는 전용 사진이 없어 대표 설비 사진을 공통 사용
  var EQUIP_IMG = {};
  var EQUIP_IMG_FALLBACK = 'assets/images/equipment-pcb.png';

  var current = 0; // 0-based index

  var $ = function (id) { return document.getElementById(id); };

  function buildRail() {
    var wrap = $('semi-rail-steps');
    if (!wrap) return;
    var html = '';
    for (var i = 0; i < STEPS.length; i++) {
      html +=
        '<button class="semi-step" data-index="' + i + '" data-phase="' + STEPS[i].phaseNo + '" aria-label="' + STEPS[i].name + '">' +
          '<span class="semi-step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICONS[i] + '</svg></span>' +
          '<span class="semi-step__no">' + pad(STEPS[i].no) + '</span>' +
        '</button>';
    }
    wrap.innerHTML = html;
    wrap.querySelectorAll('.semi-step').forEach(function (btn) {
      btn.addEventListener('click', function () {
        select(parseInt(btn.getAttribute('data-index'), 10));
      });
    });
  }

  function buildPhasesGrid() {
    var grid = $('semi-phases-grid');
    if (!grid) return;
    var html = '';
    for (var p = 0; p < PHASES.length; p++) {
      var ph = PHASES[p];
      var rows = '';
      for (var s = 0; s < ph.steps.length; s++) {
        var st = STEPS[ph.steps[s] - 1];
        rows +=
          '<li class="semi-pcard__row" data-index="' + (st.no - 1) + '">' +
            '<span class="semi-pcard__no">' + pad(st.no) + '</span>' +
            '<span class="semi-pcard__name">' + st.name + '</span>' +
          '</li>';
      }
      html +=
        '<article class="semi-pcard' + (p === 0 ? ' is-lead' : '') + '" style="--d:' + (p * 90) + 'ms">' +
          '<div class="semi-pcard__head">' +
            '<span class="semi-pcard__idx">' + pad(ph.no) + '</span>' +
            '<span class="semi-pcard__count">' + ph.steps.length + (ph.steps.length > 1 ? ' STEPS' : ' STEP') + '</span>' +
          '</div>' +
          '<h3 class="semi-pcard__title">' + ph.name + '</h3>' +
          '<ul class="semi-pcard__list">' + rows + '</ul>' +
        '</article>';
    }
    grid.innerHTML = html;
    grid.querySelectorAll('.semi-pcard__row').forEach(function (row) {
      row.addEventListener('click', function () {
        select(parseInt(row.getAttribute('data-index'), 10));
        var process = document.getElementById('process');
        if (process && window.SmoothScroll) SmoothScroll.scrollToElement(process, 0);
        else if (process) process.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function select(index) {
    if (index < 0) index = 0;
    if (index > STEPS.length - 1) index = STEPS.length - 1;
    current = index;
    render();
  }

  function getLang() {
    return document.documentElement.lang || 'en';
  }

  function render() {
    var st = STEPS[current];
    var lang = getLang();

    var info = document.querySelector('.semi-detail__info');
    if (info) {
      info.classList.remove('is-swap');
      void info.offsetWidth;
      info.classList.add('is-swap');
    }

    $('semi-d-stepbadge').textContent = 'STEP ' + pad(st.no);
    $('semi-d-phase').textContent = st.phase.toUpperCase();
    $('semi-d-name').textContent = st.name;

    var koEl = $('semi-d-ko');
    if (koEl) {
      if (lang === 'ko') {
        koEl.textContent = st.ko;
        koEl.style.display = '';
      } else {
        koEl.style.display = 'none';
      }
    }

    $('semi-d-desc').textContent = st.desc[lang] || st.desc.en;
    $('semi-d-phasev').textContent = st.phase;
    $('semi-d-seq').textContent = pad(st.no);

    // 장비 리스트
    var equipHtml = '';
    for (var e = 0; e < st.equip.length; e++) {
      equipHtml +=
        '<div class="semi-equip__item">' +
          '<span class="semi-equip__dot"></span>' +
          '<span class="semi-equip__name">' + st.equip[e] + '</span>' +
          '<span class="semi-equip__state">ACTIVE</span>' +
        '</div>';
    }
    $('semi-d-equip').innerHTML = equipHtml;

    // 설비 이미지 + 전환 애니메이션
    var img = $('semi-d-equipimg');
    if (img) {
      var src = EQUIP_IMG[st.equip[0]] || EQUIP_IMG_FALLBACK;
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
      img.alt = st.equip.join(', ') + ' 설비';
      var photo = img.parentElement;
      photo.classList.remove('is-swap');
      void photo.offsetWidth;
      photo.classList.add('is-swap');
    }

    // 미니 process flow (이전 → 현재 → 다음)
    var flow = '';
    if (current > 0) flow += '<span class="semi-flowchip semi-flowchip--ghost">' + STEPS[current - 1].name + '</span><span class="semi-flowchip__arr">›</span>';
    flow += '<span class="semi-flowchip semi-flowchip--on">' + st.name + '</span>';
    if (current < STEPS.length - 1) flow += '<span class="semi-flowchip__arr">›</span><span class="semi-flowchip semi-flowchip--ghost">' + STEPS[current + 1].name + '</span>';
    $('semi-d-flow').innerHTML = flow;

    // rail 상태
    var steps = document.querySelectorAll('.semi-step');
    steps.forEach(function (btn, i) {
      btn.classList.toggle('is-active', i === current);
      btn.classList.toggle('is-done', i < current);
    });
    var fill = $('semi-rail-fill');
    if (fill && steps.length > 1) {
      fill.style.width = (current / (steps.length - 1) * 100) + '%';
    }

    // phase 탭 상태
    document.querySelectorAll('.semi-phasebar__tab').forEach(function (tab) {
      tab.classList.toggle('is-active', parseInt(tab.getAttribute('data-phase'), 10) === st.phaseNo);
    });

    // prev/next 비활성
    $('semi-prev').disabled = current === 0;
    $('semi-next').disabled = current === STEPS.length - 1;
  }

  function bindControls() {
    $('semi-prev').addEventListener('click', function () { select(current - 1); });
    $('semi-next').addEventListener('click', function () { select(current + 1); });

    document.querySelectorAll('.semi-phasebar__tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var pno = parseInt(tab.getAttribute('data-phase'), 10);
        var ph = PHASES[pno - 1];
        if (ph) select(ph.steps[0] - 1);
      });
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight') select(current + 1);
      else if (ev.key === 'ArrowLeft') select(current - 1);
    });
  }

  /* ---- 히어로 통계 카운트업 ---- */
  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduced) { el.textContent = target + suffix; return; }
        var dur = 1200, start = null;
        function tick(ts) {
          if (start === null) start = ts;
          var pr = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - pr, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (pr < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });

    nums.forEach(function (n) { obs.observe(n); });
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function init() {
    if (typeof Navigation !== 'undefined') Navigation.init();
    if (typeof SmoothScroll !== 'undefined') SmoothScroll.init();
    if (typeof ScrollAnimations !== 'undefined') ScrollAnimations.init();
    if (typeof I18n !== 'undefined') I18n.init();

    if (!document.querySelector('.semi-process')) return;
    buildRail();
    buildPhasesGrid();
    bindControls();
    bindAnchorLinks();
    render();
    initCounters();
    initRevealFallback();

    document.addEventListener('langchange', function () { render(); });
  }

  function bindAnchorLinks() {
    document.querySelectorAll('.semi a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var id = a.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        ev.preventDefault();
        var header = document.getElementById('header');
        var offset = header ? header.offsetHeight : 0;
        if (typeof SmoothScroll !== 'undefined' && SmoothScroll.scrollToElement) {
          SmoothScroll.scrollToElement(target, offset);
        } else {
          var y = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  function initRevealFallback() {
    var supported = 'IntersectionObserver' in window;
    function revealAll() {
      document.querySelectorAll('.semi [data-animate]').forEach(function (el) {
        el.classList.add('is-visible');
      });
      var grid = document.getElementById('semi-phases-grid');
      if (grid) grid.classList.add('is-visible');
    }
    if (!supported) { revealAll(); return; }
    setTimeout(function () {
      if (!document.querySelector('.semi [data-animate].is-visible')) revealAll();
    }, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
