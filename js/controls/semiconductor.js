/**
 * Semiconductor Applications Page Control
 * - 11단계 정밀 공정 인터랙티브 스테퍼 (단계 클릭 / Phase 탭 / Prev·Next)
 * - 히어로 통계 카운트업
 * 첨부된 공정 플로우 이미지를 기반으로 11개 스텝 데이터를 구성했다.
 */
(function () {
  'use strict';

  /* ---- 공정 데이터 (이미지 기반 + 내용 작성) ---- */
  var STEPS = [
    {
      no: 1, name: 'Pre-Process', ko: '전처리',
      phase: 'Preparation', phaseNo: 1,
      desc: {
        en: 'A preparatory process that cleans and aligns reticles and wafers before line entry. Removes particles and contaminants to establish the yield baseline for all subsequent processes.',
        ko: '레티클·웨이퍼를 라인에 투입하기 전 세정과 정렬을 수행하는 준비 공정입니다. <br>파티클과 오염을 제거해 이후 모든 공정의 수율 기준선을 확보합니다.'
      },
      equip: ['SUN2']
    },
    {
      no: 2, name: 'Pellicle', ko: '펠리클 부착',
      phase: 'Preparation', phaseNo: 1,
      desc: {
        en: 'A process of attaching a lithography protection membrane (Pellicle). Conducted in a precisely controlled environment, this is a critical step that directly impacts the quality of subsequent exposure processes.',
        ko: '리소그래피 보호막(Pellicle)을 부착하는 공정입니다. 정밀 제어된 환경에서 진행되며, 후속 노광 공정의 품질에 직접적인 영향을 미치는 핵심 단계입니다.'
      },
      equip: ['SUN2']
    },
    {
      no: 3, name: 'Wafer Grinding', ko: '웨이퍼 그라인딩',
      phase: 'Wafer Process', phaseNo: 2,
      desc: {
        en: 'A thinning process that precision-grinds the wafer backside to target thickness. Ensures uniform thickness distribution (TTV) to enhance reliability in subsequent stacking and packaging stages.',
        ko: '웨이퍼 후면을 목표 두께까지 정밀 연삭하는 박막화 공정입니다. 균일한 두께 분포(TTV)를 확보해 적층·패키징 단계의 신뢰성을 높입니다.'
      },
      equip: ['C1']
    },
    {
      no: 4, name: 'Carrier Wafer Attachment', ko: '캐리어 웨이퍼 부착',
      phase: 'Wafer Process', phaseNo: 2,
      desc: {
        en: 'Temporarily bonds a carrier wafer for stable handling of thinned wafers. Suppresses warpage and prevents breakage during subsequent processes.',
        ko: '얇아진 웨이퍼를 안정적으로 핸들링하기 위해 캐리어 웨이퍼를 임시 접합합니다. 휨(Warpage)을 억제하고 후속 공정 중 파손을 방지합니다.'
      },
      equip: ['C1']
    },
    {
      no: 5, name: 'TSV Wafer Preparation', ko: 'TSV 웨이퍼 준비',
      phase: 'Wafer Process', phaseNo: 2,
      desc: {
        en: 'A process of forming and exposing Through-Silicon Vias (TSV) to prepare vertical interconnects. Establishes the critical foundation for 3D stacked devices such as HBM.',
        ko: '관통 실리콘 비아(TSV)를 형성·노출시켜 수직 인터커넥트를 준비하는 공정입니다. HBM 등 3D 적층 디바이스의 핵심 기반을 마련합니다.'
      },
      equip: ['C1']
    },
    {
      no: 6, name: 'Wafer RDL / Bumping', ko: '재배선 · 범핑',
      phase: 'Wafer Process', phaseNo: 2,
      desc: {
        en: 'A process of forming Redistribution Layers (RDL) and creating solder bumps. Rearranges I/O and enables fine-pitch bonding for high-density packages.',
        ko: '재배선층(RDL)을 형성하고 솔더 범프를 생성하는 공정입니다. I/O를 재배치하고 미세 피치 접합을 구현해 고집적 패키지를 가능하게 합니다.'
      },
      equip: ['C1']
    },
    {
      no: 7, name: 'Carrier Wafer Detachment', ko: '캐리어 웨이퍼 분리',
      phase: 'Assembly', phaseNo: 3,
      desc: {
        en: 'A debonding process that separates the temporarily bonded carrier wafer without damage. Transfers the device wafer to the assembly stage while maintaining its integrity.',
        ko: '임시 접합했던 캐리어 웨이퍼를 손상 없이 분리(Debonding)하는 공정입니다. 디바이스 웨이퍼의 무결성을 유지한 채 조립 단계로 이관합니다.'
      },
      equip: ['OAK3']
    },
    {
      no: 8, name: 'Wafer Dicing', ko: '웨이퍼 다이싱',
      phase: 'Assembly', phaseNo: 3,
      desc: {
        en: 'A process of cutting wafers into individual chip units. Precision cutting minimizes chipping and cracking to ensure the electrical and mechanical quality of singulated chips.',
        ko: '웨이퍼를 개별 칩 단위로 절단하는 공정입니다. 칩핑·크랙을 최소화하는 정밀 절단으로 단품 칩의 전기적·기계적 품질을 보장합니다.'
      },
      equip: ['OAK3', 'C1']
    },
    {
      no: 9, name: '3D Finalizing', ko: '3D 마무리',
      phase: 'Final', phaseNo: 4,
      desc: {
        en: 'A process that completes 3D structure formation and performs pre-bonding inspection. Verifies stack alignment and interconnect condition to ensure reliability in subsequent stacking.',
        ko: '3D 구조 형성을 마무리하고 본딩 전 검사를 수행하는 공정입니다. 적층 정렬도와 인터커넥트 상태를 점검해 후속 적층 신뢰성을 확보합니다.'
      },
      equip: ['D1']
    },
    {
      no: 10, name: 'Chip Stacking · 3D', ko: '3D 칩 적층',
      phase: 'Final', phaseNo: 4,
      desc: {
        en: 'A process of vertically stacking multiple chips with precision. Implements 3D packages with maximized bandwidth and power efficiency through micro bumps and hybrid bonding.',
        ko: '복수의 칩을 수직으로 정밀 적층하는 공정입니다. 마이크로 범프·하이브리드 본딩으로 대역폭과 전력 효율을 극대화한 3D 패키지를 구현합니다.'
      },
      equip: ['D1', 'CYPRESS2']
    },
    {
      no: 11, name: 'Chip on Substrate', ko: '기판 실장',
      phase: 'Final', phaseNo: 4,
      desc: {
        en: 'A process of mounting stacked chips onto a substrate to complete the final package. Validates electrical connections and thermo-mechanical reliability, concluding the single integrated line.',
        ko: '적층된 칩을 기판에 실장하여 최종 패키지를 완성하는 공정입니다. 전기적 연결과 열·기계적 신뢰성을 검증하며 단일 통합 라인을 마무리합니다.'
      },
      equip: ['MAPLE']
    }
  ];

  var PHASES = [
    { no: 1, name: 'Preparation',   steps: [1, 2] },
    { no: 2, name: 'Wafer Process', steps: [3, 4, 5, 6] },
    { no: 3, name: 'Assembly',      steps: [7, 8] },
    { no: 4, name: 'Final',         steps: [9, 10, 11] }
  ];

  // 단계별 인라인 SVG 아이콘 (Lucide 스타일)
  var ICONS = [
    '<path d="M4 7h16M4 12h10M4 17h7"/>',                                   // pre-process
    '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16"/>', // pellicle
    '<circle cx="12" cy="12" r="8"/><path d="M12 4v4"/>',                   // grinding
    '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9z"/>', // attach
    '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>',          // tsv
    '<path d="M3 12h4l2-6 4 12 2-6h6"/>',                                   // rdl/bumping
    '<path d="M7 7l10 10M17 7L7 17"/><rect x="4" y="4" width="16" height="16" rx="2"/>', // detach
    '<path d="M4 12h16"/><path d="M8 4l-4 8 4 8M16 4l4 8-4 8"/>',           // dicing
    '<rect x="4" y="13" width="16" height="5" rx="1"/><rect x="7" y="7" width="10" height="5" rx="1"/>', // 3d finalizing
    '<rect x="5" y="14" width="14" height="4" rx="1"/><rect x="7" y="9" width="10" height="4" rx="1"/><rect x="9" y="4" width="6" height="4" rx="1"/>', // stacking
    '<rect x="3" y="9" width="18" height="10" rx="2"/><path d="M7 9V5h10v4"/>' // chip on substrate
  ];

  // 장비별 실제 설비 이미지 (전용 사진이 없는 장비는 대표 설비 사진으로 폴백)
  var EQUIP_IMG = {
    C1: 'assets/images/product-c1.png',
    SUN2: 'assets/images/equipment-hero.png',
    OAK3: 'assets/images/equipment-hero.png',
    D1: 'assets/images/product-c1.png',
    CYPRESS2: 'assets/images/equipment-hero.png',
    MAPLE: 'assets/images/equipment-hero.png'
  };
  var EQUIP_IMG_FALLBACK = 'assets/images/equipment-hero.png';

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
            '<span class="semi-pcard__count">' + ph.steps.length + ' STEPS</span>' +
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

    // 상세 패널 — 크로스페이드
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

    // 설비 이미지 (해당 단계의 대표 장비 기준) + 전환 애니메이션
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
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });

    nums.forEach(function (n) { obs.observe(n); });
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function init() {
    // 공통 컨트롤 초기화 (메인 페이지의 main.js 역할을 이 페이지 전용으로 축약)
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

  /** 페이지 내부 앵커(More View·Technology 등)를 헤더 높이만큼 보정해 부드럽게 스크롤 */
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

  /**
   * 안전장치: 스크롤 진입 애니메이션(IntersectionObserver)이 동작하지 않는
   * 환경에서도 콘텐츠가 반드시 보이도록 한다.
   * 로드 후 일정 시간이 지나도 단 하나도 노출되지 않았다면(관찰자 미동작),
   * 모든 [data-animate] 요소를 강제로 노출시킨다.
   */
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
