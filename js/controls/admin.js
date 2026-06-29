/**
 * ATI Admin Console
 * - 정적 사이트용 프론트엔드 전용 관리자 (백엔드 없음, 목업 데이터 + localStorage)
 * - 인증 가드, 사이드바/상단바 주입, 페이지별 테이블 렌더링, 모달/토스트
 *
 * 데모 계정:  admin / ati1234
 */
(function (global) {
  'use strict';

  /* =========================================================
     아이콘 (Lucide 스타일 인라인 SVG)
     ========================================================= */
  var ICON = {
    dashboard: '<path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    news: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>',
    box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
    menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    chevronL: '<path d="M15 18l-6-6 6-6"/>',
    chevronR: '<path d="M9 18l6-6-6-6"/>',
    chevronD: '<path d="M6 9l6 6 6-6"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    trend: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 5L2 7"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + (ICON[name] || '') + '</svg>';
  }

  /* =========================================================
     인증
     ========================================================= */
  var AUTH_KEY = 'ati_admin_auth';
  var PW_KEY = 'ati_admin_pw';
  var DEMO = { id: 'admin', pw: 'ati1234', name: '관리자', role: 'ATI 운영팀', email: 'admin@ati.co.kr' };

  var Auth = {
    _pw: function () { return localStorage.getItem(PW_KEY) || DEMO.pw; },
    login: function (id, pw, remember) {
      if (id === DEMO.id && pw === this._pw()) {
        var data = JSON.stringify({ name: DEMO.name, role: DEMO.role, email: DEMO.email, ts: Date.now() });
        (remember ? localStorage : sessionStorage).setItem(AUTH_KEY, data);
        return true;
      }
      return false;
    },
    current: function () {
      var raw = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    },
    update: function (patch) {
      var inLocal = !!localStorage.getItem(AUTH_KEY);
      var next = Object.assign({}, this.current() || {}, patch);
      (inLocal ? localStorage : sessionStorage).setItem(AUTH_KEY, JSON.stringify(next));
      return next;
    },
    changePassword: function (cur, next) {
      if (cur !== this._pw()) return false;
      localStorage.setItem(PW_KEY, next);
      return true;
    },
    logout: function () {
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY);
      location.href = 'admin-login.html';
    },
    guard: function () {
      if (!this.current()) { location.replace('admin-login.html'); return false; }
      return true;
    }
  };

  /* =========================================================
     목업 데이터
     ========================================================= */
  var DATA = {
    inquiries: [
      { id: 1, name: '김도현', company: '삼성전자', type: 'quote', email: 'dh.kim@samsung.com', phone: '010-2841-7720', product: 'CAMELLIA3', status: 'new', date: '2026.06.28', content: 'CAMELLIA3 장비 도입 견적을 요청드립니다. 월 생산량 기준 처리 가능 매수와 납기 일정도 함께 안내 부탁드립니다.' },
      { id: 2, name: '이서연', company: 'SK하이닉스', type: 'product', email: 'sy.lee@skhynix.com', phone: '010-5530-1182', product: 'TIDAL', status: 'progress', assignee: '이준호', date: '2026.06.28', content: 'TIDAL 검사 장비의 검출 해상도와 AI 결함 분류 정확도 스펙 자료를 받아볼 수 있을까요?' },
      { id: 3, name: 'James Park', company: 'Micron', type: 'service', email: 'jpark@micron.com', phone: '010-3320-9981', product: 'OAK3', status: 'progress', assignee: '박서영', date: '2026.06.27', content: '기존 OAK3 장비 유지보수 계약 갱신 및 정기 점검 일정 협의를 원합니다.' },
      { id: 4, name: '최민준', company: '대덕전자', type: 'quote', email: 'mj.choi@daeduck.com', phone: '010-7745-2203', product: 'PUTTER2', status: 'done', assignee: '이준호', date: '2026.06.26', content: 'PCB 검사용 PUTTER2 2대 견적 요청. 설치 환경 사전 실사도 가능한지 문의드립니다.' },
      { id: 5, name: '정하늘', company: '심텍', type: 'partnership', email: 'sky.jung@simmtech.com', phone: '010-1192-4408', product: '-', status: 'new', date: '2026.06.26', content: '차세대 패키지 검사 솔루션 공동 개발 관련 파트너십 미팅을 제안드립니다.' },
      { id: 6, name: 'Yuki Tanaka', company: 'Denso', type: 'product', email: 'yuki.t@denso.co.jp', phone: '+81-90-2231-7788', product: 'TRITON', status: 'new', date: '2026.06.25', content: 'TRITON 장비의 자동차용 반도체 검사 적용 사례와 도입 레퍼런스를 알고 싶습니다.' },
      { id: 7, name: '박지우', company: '원익IPS', type: 'service', email: 'jw.park@wonik.com', phone: '010-6612-3390', product: 'SGM', status: 'hold', date: '2026.06.24', content: 'SGM 장비 소프트웨어 업그레이드 비용과 다운타임을 확인하고 싶습니다.' },
      { id: 8, name: 'Anna Schmidt', company: 'Photronics', type: 'quote', email: 'a.schmidt@photronics.com', phone: '+1-408-220-1190', product: 'C1', status: 'done', assignee: '한지민', date: '2026.06.24', content: 'Reticle 검사용 C1 장비 도입을 검토 중입니다. 데모 시연이 가능한지요?' },
      { id: 9, name: '한예진', company: '코리아써키트', type: 'etc', email: 'yj.han@kcircuit.com', phone: '010-9981-2245', product: '-', status: 'new', date: '2026.06.23', content: '회사 소개 자료와 전체 제품 카탈로그를 이메일로 받아볼 수 있을까요?' },
      { id: 10, name: 'David Lee', company: 'Absolics', type: 'quote', email: 'd.lee@absolics.com', phone: '010-3340-7781', product: 'ROE1000', status: 'progress', assignee: '김민석', date: '2026.06.22', content: 'Glass substrate 검사용 ROE1000 견적 및 설치 리드타임 문의드립니다.' }
    ],
    news: [
      { id: 1, title: 'ATI, SEMICON Korea 2026 참가… AI 검사 솔루션 공개', category: 'event', status: 'published', author: '홍보팀', date: '2026.06.20', views: 1284 },
      { id: 2, title: '차세대 Glass Substrate 검사 장비 ROE1000 정식 출시', category: 'product', status: 'published', author: '제품기획팀', date: '2026.06.12', views: 2103 },
      { id: 3, title: 'ATI 인천 송도 신사옥 R&D 센터 준공', category: 'company', status: 'published', author: '경영지원팀', date: '2026.05.30', views: 956 },
      { id: 4, title: 'AI 결함 분류 정확도 99.5% 달성 — 기술 백서 발간', category: 'tech', status: 'published', author: 'AI연구소', date: '2026.05.18', views: 1740 },
      { id: 5, title: '2026 하반기 채용 — 비전 SW / 광학 엔지니어 모집', category: 'company', status: 'draft', author: '인사팀', date: '2026.06.27', views: 0 },
      { id: 6, title: '글로벌 반도체 고객사와 장기 공급 계약 체결', category: 'company', status: 'published', author: '영업팀', date: '2026.04.22', views: 1322 },
      { id: 7, title: 'PCB 검사 신제품 PUTTER2 — 처리 속도 40% 향상', category: 'product', status: 'review', author: '제품기획팀', date: '2026.06.25', views: 0 }
    ],
    products: [
      { id: 1, name: 'CAMELLIA3', category: 'wafer', desc: 'Wafer 표면 결함 검사', status: 'active', updated: '2026.06.10' },
      { id: 2, name: 'OAK3', category: 'wafer', desc: 'Wafer 패턴 결함 검사', status: 'active', updated: '2026.05.28' },
      { id: 3, name: 'C1', category: 'reticle', desc: 'Reticle 검사 시스템', status: 'active', updated: '2026.06.02' },
      { id: 4, name: 'TIDAL', category: 'reticle', desc: 'Reticle AI 결함 분류', status: 'active', updated: '2026.06.15' },
      { id: 5, name: 'SGM', category: 'package', desc: 'Package 외관 검사', status: 'active', updated: '2026.04.30' },
      { id: 6, name: 'ROE1000', category: 'package', desc: 'Glass Substrate 검사', status: 'active', updated: '2026.06.20' },
      { id: 7, name: 'PUTTER2', category: 'pcb', desc: 'PCB AOI 검사', status: 'active', updated: '2026.06.24' },
      { id: 8, name: 'TRITON', category: 'pcb', desc: '자동차용 반도체 검사', status: 'draft', updated: '2026.06.18' },
      { id: 9, name: 'VEGA-D / VEGA-P', category: 'pcb', desc: 'PCB 측정·검사 통합', status: 'active', updated: '2026.03.12' },
      { id: 10, name: 'SUN2', category: 'wafer', desc: 'Wafer 매크로 검사', status: 'archived', updated: '2025.12.01' }
    ],
    faqs: [
      { id: 1, category: 'company', q: 'ATI Biosystems는 어떤 일을 하나요?', status: 'published', updated: '2026.06.10' },
      { id: 2, category: 'company', q: 'ATI Biosystems에서 만들어진 장비는 어떤 것들이 있나요?', status: 'published', updated: '2026.06.10' },
      { id: 3, category: 'equipment', q: '플라스크 기반 자동 세포 배양장비를 자세히 소개해주세요.', status: 'published', updated: '2026.06.08' },
      { id: 4, category: 'equipment', q: '플레이트 기반 자동 Cell expansion 장비를 자세히 소개해주세요.', status: 'published', updated: '2026.06.08' },
      { id: 5, category: 'equipment', q: 'Isolator 프레임의 자동 NK 세포 배양 장비를 자세히 소개해주세요.', status: 'published', updated: '2026.06.08' },
      { id: 6, category: 'equipment', q: 'GMP 환경에 준하는 자동 세포 배양 장비를 자세히 소개해주세요.', status: 'published', updated: '2026.06.05' },
      { id: 7, category: 'module', q: 'ATI에서 개발한 모듈들을 소개해주세요.', status: 'published', updated: '2026.05.30' },
      { id: 8, category: 'module', q: 'ATI에서 개발한 핵심 모듈만 따로 상품으로 판매하나요?', status: 'published', updated: '2026.05.30' },
      { id: 9, category: 'module', q: '자동 Microscope로 가능한 작업을 소개해주세요.', status: 'published', updated: '2026.05.28' },
      { id: 10, category: 'gmp', q: '장비를 GMP 시설에서 사용할 수 있나요?', status: 'published', updated: '2026.05.20' },
      { id: 11, category: 'gmp', q: '모듈이나 장비 내부의 멸균 작업은 어떻게 수행하나요?', status: 'published', updated: '2026.05.20' },
      { id: 12, category: 'gmp', q: 'CELLi에 사용되는 환경 모니터링의 종류를 알려주세요.', status: 'published', updated: '2026.05.18' },
      { id: 13, category: 'software', q: '장비 제어 및 프로토콜 관리 SW는 무엇을 사용하나요?', status: 'published', updated: '2026.05.15' }
    ]
  };

  /* 데이터 영속화 (편집/게시 페이지 간 상태 유지) */
  var DATA_KEY = 'ati_admin_data';
  var DATA_VERSION = 3; // 기본 데이터 변경 시 증가 → 캐시 무효화
  var STAFF = ['이준호', '박서영', '김민석', '한지민', '최영주']; // 문의 담당자 목록
  function loadData() {
    try {
      var raw = JSON.parse(localStorage.getItem(DATA_KEY));
      if (raw && raw.v === DATA_VERSION && raw.d) {
        ['inquiries', 'news', 'products', 'faqs'].forEach(function (k) {
          if (Array.isArray(raw.d[k])) DATA[k] = raw.d[k];
        });
      }
    } catch (e) {}
  }
  function saveData() {
    try { localStorage.setItem(DATA_KEY, JSON.stringify({ v: DATA_VERSION, d: DATA })); return true; } catch (e) { return false; }
  }
  function flash(msg) { try { sessionStorage.setItem('ati_admin_flash', msg); } catch (e) {} }

  /* 라벨 매핑 */
  var LABEL = {
    inqStatus: { new: '접수', progress: '처리중', done: '완료', hold: '보류' },
    inqStatusBadge: { new: 'blue', progress: 'amber', done: 'green', hold: 'gray' },
    inqType: { quote: '견적 문의', product: '제품 문의', service: '서비스 문의', partnership: '제휴/협력', etc: '기타' },
    newsCat: { event: '행사', product: '제품', company: '회사소식', tech: '기술' },
    newsStatus: { published: '게시중', draft: '임시저장', review: '검토중' },
    newsStatusBadge: { published: 'green', draft: 'gray', review: 'amber' },
    prodCat: { wafer: 'Wafer', reticle: 'Reticle', package: 'Package', pcb: 'PCB' },
    prodStatus: { active: '게시중', draft: '비공개', archived: '단종' },
    prodStatusBadge: { active: 'green', draft: 'amber', archived: 'gray' },
    faqCat: { company: '회사소개', equipment: '장비/시스템', module: '자동화 모듈', gmp: 'GMP·멸균', software: '소프트웨어' },
    faqStatus: { published: '게시중', draft: '임시저장' },
    faqStatusBadge: { published: 'green', draft: 'gray' }
  };

  /* =========================================================
     레이아웃 (사이드바 / 상단바) 주입
     ========================================================= */
  var NAV = [
    { group: '운영', items: [
      { key: 'dashboard', label: '대시보드', icon: 'dashboard', href: 'admin.html' },
      { key: 'inquiries', label: '문의 관리', icon: 'inbox', href: 'admin-inquiries.html', count: function () { return DATA.inquiries.filter(function (i) { return i.status === 'new'; }).length; } }
    ]},
    { group: '콘텐츠', items: [
      { key: 'news', label: '뉴스 관리', icon: 'news', href: 'admin-news.html', count: function () { return DATA.news.length; } },
      { key: 'products', label: '제품 관리', icon: 'box', href: 'admin-products.html', count: function () { return DATA.products.length; } },
      { key: 'faq', label: 'FAQ 관리', icon: 'help', href: 'admin-faq.html', count: function () { return DATA.faqs.length; } }
    ]}
  ];
  var PAGE_TITLE = { dashboard: '대시보드', inquiries: '문의 관리', news: '뉴스 관리', products: '제품 관리', faq: 'FAQ 관리' };

  function renderLayout(activeKey, titleOverride) {
    var user = Auth.current() || DEMO;
    var sidebar = document.getElementById('adm-sidebar');
    var topbar = document.getElementById('adm-topbar');

    var navHtml = NAV.map(function (g) {
      var items = g.items.map(function (it) {
        var count = '';
        if (it.count) { var c = it.count(); if (c) count = '<span class="adm-nav__count">' + c + '</span>'; }
        var dis = it.href === '#' ? ' style="opacity:.55;cursor:default"' : '';
        return '<a class="adm-nav__item' + (it.key === activeKey ? ' is-active' : '') + '" href="' + it.href + '"' + dis + '>' +
          icon(it.icon) + '<span>' + it.label + '</span>' + count + '</a>';
      }).join('');
      return '<div class="adm-nav__group"><p class="adm-nav__label">' + g.group + '</p>' + items + '</div>';
    }).join('');

    if (sidebar) {
      sidebar.className = 'adm-sidebar';
      sidebar.innerHTML =
        '<a class="adm-sidebar__brand" href="admin.html">' +
          '<img src="assets/images/ATI_Logo_default.png" alt="ATI">' +
          '<span class="adm-sidebar__brand-tag">ADMIN</span>' +
        '</a>' +
        '<div class="adm-sidebar__scroll">' + navHtml +
          '<div class="adm-sidebar__promo"><h4>ATI 관리자 콘솔</h4><p>웹사이트 콘텐츠와 고객 문의를 한 곳에서 관리하세요.</p></div>' +
        '</div>';
    }

    if (topbar) {
      topbar.className = 'adm-topbar';
      topbar.innerHTML =
        '<button class="adm-topbar__icon-btn adm-topbar__menu" id="adm-menu-btn" aria-label="메뉴">' + icon('menu') + '</button>' +
        '<h1 class="adm-topbar__title">' + (titleOverride || PAGE_TITLE[activeKey] || 'ATI Admin') + '</h1>' +
        '<div class="adm-topbar__spacer"></div>' +
        '<button class="adm-topbar__user" id="adm-user-menu" title="계정 설정">' +
          '<div class="adm-topbar__avatar">' + (user.name ? user.name.charAt(0) : 'A') + '</div>' +
          '<div><div class="adm-topbar__user-name">' + (user.name || '관리자') + '</div>' +
          '<div class="adm-topbar__user-role">' + (user.role || 'ATI') + '</div></div>' +
          icon('chevronD', 'adm-topbar__user-caret') +
        '</button>';
    }

    /* 모바일 사이드바 토글 */
    var backdrop = document.createElement('div');
    backdrop.className = 'adm-backdrop';
    backdrop.id = 'adm-backdrop';
    document.body.appendChild(backdrop);

    function openNav() { sidebar.classList.add('is-open'); backdrop.classList.add('is-open'); }
    function closeNav() { sidebar.classList.remove('is-open'); backdrop.classList.remove('is-open'); }
    var menuBtn = document.getElementById('adm-menu-btn');
    if (menuBtn) menuBtn.addEventListener('click', openNav);
    backdrop.addEventListener('click', closeNav);

    var userMenu = document.getElementById('adm-user-menu');
    if (userMenu) userMenu.addEventListener('click', openAccount);
  }

  /* =========================================================
     공용 UI 헬퍼 (모달, 토스트)
     ========================================================= */
  function modal(title, bodyHtml, footHtml) {
    var existing = document.getElementById('adm-modal');
    if (existing) existing.remove();
    var wrap = document.createElement('div');
    wrap.className = 'adm-modal';
    wrap.id = 'adm-modal';
    wrap.innerHTML =
      '<div class="adm-modal__box">' +
        '<div class="adm-modal__head"><h3 class="adm-modal__title">' + title + '</h3>' +
          '<button class="adm-modal__close" data-close>' + icon('x') + '</button></div>' +
        '<div class="adm-modal__body">' + bodyHtml + '</div>' +
        (footHtml ? '<div class="adm-modal__foot">' + footHtml + '</div>' : '') +
      '</div>';
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('is-open'); });
    function close() { wrap.classList.remove('is-open'); setTimeout(function () { wrap.remove(); }, 150); }
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap || e.target.closest('[data-close]')) close();
    });
    return { el: wrap, close: close };
  }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('adm-toast');
    if (!t) { t = document.createElement('div'); t.className = 'adm-toast'; t.id = 'adm-toast'; document.body.appendChild(t); }
    t.innerHTML = icon('check') + '<span>' + msg + '</span>';
    requestAnimationFrame(function () { t.classList.add('is-show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-show'); }, 2400);
  }

  function badge(text, color) { return '<span class="adm-badge adm-badge--' + color + '">' + text + '</span>'; }
  function assigneeCell(name) {
    if (!name) return '<span class="adm-unassigned">미배정</span>';
    return '<span class="adm-assignee">' + esc(name) + '</span>';
  }

  /* 이미지 업로더 (대표 1장 + 상세 다중) — 뉴스/제품 편집기 공용
     컨테이너 el 안에 #up-main, #up-detail 요소가 있어야 함 */
  function setupImageUploaders(el, initialMain, initialDetail) {
    var mainImg = initialMain || '';
    var detailImgs = Array.isArray(initialDetail) ? initialDetail.slice() : [];

    function renderMain() {
      el.querySelector('#up-main').innerHTML = mainImg
        ? '<div class="adm-thumb"><img src="' + mainImg + '" alt="대표 이미지"><button type="button" class="adm-thumb__del" data-del-main aria-label="삭제">' + icon('x') + '</button></div>'
        : '<button type="button" class="adm-upbox" data-add-main>' + icon('image') + '<span>대표 이미지 업로드</span><small>클릭하여 1장 선택</small></button>';
    }
    function renderDetail() {
      var thumbs = detailImgs.map(function (src, i) {
        return '<div class="adm-thumb"><img src="' + src + '" alt="상세 이미지"><button type="button" class="adm-thumb__del" data-del-detail="' + i + '" aria-label="삭제">' + icon('x') + '</button></div>';
      }).join('');
      el.querySelector('#up-detail').innerHTML = thumbs + '<button type="button" class="adm-upbox adm-upbox--add" data-add-detail>' + icon('plus') + '<span>이미지 추가</span></button>';
    }
    function pickFiles(multiple, cb) {
      var input = document.createElement('input');
      input.type = 'file'; input.accept = 'image/*'; input.multiple = !!multiple;
      input.addEventListener('change', function () {
        var files = Array.prototype.slice.call(input.files || []);
        if (!files.length) return;
        var out = []; var pending = files.length;
        files.forEach(function (f) {
          var r = new FileReader();
          r.onloadend = function () { if (r.result) out.push(r.result); if (--pending === 0) cb(out); };
          r.readAsDataURL(f);
        });
      });
      input.click();
    }
    el.querySelector('#up-main').addEventListener('click', function (e) {
      if (e.target.closest('[data-add-main]')) { pickFiles(false, function (r) { mainImg = r[0] || mainImg; renderMain(); }); }
      else if (e.target.closest('[data-del-main]')) { mainImg = ''; renderMain(); }
    });
    el.querySelector('#up-detail').addEventListener('click', function (e) {
      if (e.target.closest('[data-add-detail]')) { pickFiles(true, function (r) { detailImgs = detailImgs.concat(r); renderDetail(); }); return; }
      var d = e.target.closest('[data-del-detail]');
      if (d) { detailImgs.splice(+d.getAttribute('data-del-detail'), 1); renderDetail(); }
    });
    renderMain();
    renderDetail();
    return { getMain: function () { return mainImg; }, getDetail: function () { return detailImgs; } };
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* =========================================================
     계정 설정 모달 (우측 상단 관리자 칩 클릭 시)
     ========================================================= */
  function openAccount() {
    var u = Auth.current() || DEMO;
    var initial = (u.name || 'A').charAt(0);

    function acctRow(field, label, value, actionLabel) {
      return '<div class="adm-acct__field" data-field="' + field + '">' +
        '<div class="adm-acct__field-label">' + label + '</div>' +
        '<div class="adm-acct__field-view">' +
          '<div class="adm-acct__field-value">' + esc(value) + '</div>' +
          '<button type="button" class="adm-acct__link" data-edit>' + actionLabel + '</button>' +
        '</div></div>';
    }

    var body =
      '<div class="adm-acct">' +
        '<div class="adm-acct__tabs">' +
          '<button type="button" class="adm-acct__tab is-active" data-pane="account">계정</button>' +
          '<button type="button" class="adm-acct__tab" data-pane="security">보안</button>' +
        '</div>' +
        '<div class="adm-acct__body">' +
          '<div class="adm-acct__pane is-active" data-pane="account">' +
            '<div class="adm-acct__profile">' +
              '<div class="adm-acct__avatar-lg">' + initial + '</div>' +
              '<div><div class="adm-acct__profile-name">' + esc(u.name || '관리자') + '</div>' +
              '<div class="adm-acct__profile-sub">' + esc(u.role || 'ATI') + '</div></div>' +
            '</div>' +
            acctRow('name', '이름', u.name || '관리자', '이름 변경하기') +
            acctRow('email', '이메일', u.email || DEMO.email, '이메일 변경') +
            acctRow('role', '역할', u.role || 'ATI 운영팀', '역할 변경') +
            '<div class="adm-acct__field"><div class="adm-acct__field-label">언어</div>' +
              '<div class="adm-acct__field-view"><div class="adm-acct__field-value">한국어</div>' +
              '<span class="adm-acct__muted">관리자 콘솔 고정</span></div></div>' +
          '</div>' +
          '<div class="adm-acct__pane" data-pane="security">' +
            '<p class="adm-acct__hint">비밀번호를 변경합니다. 변경 후 다음 로그인부터 적용됩니다.</p>' +
            '<div class="adm-field"><label class="adm-field__label">현재 비밀번호</label>' +
              '<input class="adm-input" type="password" id="pw-cur" autocomplete="current-password"></div>' +
            '<div class="adm-field"><label class="adm-field__label">새 비밀번호</label>' +
              '<input class="adm-input" type="password" id="pw-new" autocomplete="new-password"></div>' +
            '<div class="adm-field"><label class="adm-field__label">새 비밀번호 확인</label>' +
              '<input class="adm-input" type="password" id="pw-new2" autocomplete="new-password"></div>' +
            '<button type="button" class="adm-btn adm-btn--primary adm-btn--block" id="pw-save">' + icon('check') + '비밀번호 변경</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    var foot =
      '<button type="button" class="adm-btn adm-btn--danger" id="acct-logout">' + icon('logout') + '로그아웃</button>' +
      '<button type="button" class="adm-btn adm-btn--ghost" data-close>닫기</button>';

    var m = modal('계정 설정', body, foot);
    m.el.querySelector('.adm-modal__box').classList.add('adm-modal__box--acct');

    /* 탭 전환 */
    m.el.querySelectorAll('.adm-acct__tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var p = tab.getAttribute('data-pane');
        m.el.querySelectorAll('.adm-acct__tab').forEach(function (t) { t.classList.toggle('is-active', t === tab); });
        m.el.querySelectorAll('.adm-acct__pane').forEach(function (pane) { pane.classList.toggle('is-active', pane.getAttribute('data-pane') === p); });
      });
    });

    /* 인라인 편집 (이름/이메일/역할) */
    m.el.querySelectorAll('.adm-acct__field[data-field]').forEach(function (row) {
      var field = row.getAttribute('data-field');
      var editBtn = row.querySelector('[data-edit]');
      if (!editBtn) return;
      editBtn.addEventListener('click', function () {
        var cur = (Auth.current() || DEMO)[field] || '';
        row.querySelector('.adm-acct__field-view').innerHTML =
          '<input class="adm-input adm-acct__input" type="' + (field === 'email' ? 'email' : 'text') + '" value="' + esc(cur) + '">' +
          '<div class="adm-acct__edit-actions">' +
            '<button type="button" class="adm-btn adm-btn--primary adm-btn--sm" data-save>저장</button>' +
            '<button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" data-cancel>취소</button>' +
          '</div>';
        var input = row.querySelector('.adm-acct__input');
        input.focus();
        row.querySelector('[data-cancel]').addEventListener('click', function () { rerender(); });
        row.querySelector('[data-save]').addEventListener('click', function () {
          var val = input.value.trim();
          if (!val) { input.focus(); return; }
          var patch = {}; patch[field] = val;
          Auth.update(patch);
          syncTopbar();
          rerender();
          toast('계정 정보가 저장되었습니다.');
        });
      });
    });

    function rerender() { m.close(); openAccount(); }

    /* 비밀번호 변경 */
    var pwBtn = m.el.querySelector('#pw-save');
    if (pwBtn) pwBtn.addEventListener('click', function () {
      var cur = m.el.querySelector('#pw-cur').value;
      var n1 = m.el.querySelector('#pw-new').value;
      var n2 = m.el.querySelector('#pw-new2').value;
      if (!cur || !n1 || !n2) { toast('모든 항목을 입력해 주세요.'); return; }
      if (n1.length < 4) { toast('새 비밀번호는 4자 이상이어야 합니다.'); return; }
      if (n1 !== n2) { toast('새 비밀번호가 일치하지 않습니다.'); return; }
      if (!Auth.changePassword(cur, n1)) { toast('현재 비밀번호가 올바르지 않습니다.'); return; }
      m.el.querySelector('#pw-cur').value = ''; m.el.querySelector('#pw-new').value = ''; m.el.querySelector('#pw-new2').value = '';
      toast('비밀번호가 변경되었습니다.');
    });

    /* 로그아웃 */
    m.el.querySelector('#acct-logout').addEventListener('click', function () {
      if (confirm('로그아웃 하시겠습니까?')) Auth.logout();
    });
  }

  /* 이름/역할 변경 시 상단바 즉시 반영 */
  function syncTopbar() {
    var u = Auth.current() || DEMO;
    var nameEl = document.querySelector('.adm-topbar__user-name');
    var roleEl = document.querySelector('.adm-topbar__user-role');
    var avEl = document.querySelector('.adm-topbar__avatar');
    if (nameEl) nameEl.textContent = u.name || '관리자';
    if (roleEl) roleEl.textContent = u.role || 'ATI';
    if (avEl) avEl.textContent = (u.name || 'A').charAt(0);
  }

  /* =========================================================
     필터 + 검색 + 탭 공용 처리
     ========================================================= */
  function attachFilter(opts) {
    // opts: { rows, tabKey, searchFields, render }
    var state = { tab: 'all', q: '', filters: {} };

    function apply() {
      var list = opts.rows.slice();
      if (state.tab !== 'all' && opts.tabKey) {
        list = list.filter(function (r) { return r[opts.tabKey] === state.tab; });
      }
      Object.keys(state.filters).forEach(function (f) {
        var v = state.filters[f];
        if (v) list = list.filter(function (r) { return r[f] === v; });
      });
      if (state.q) {
        var q = state.q.toLowerCase();
        list = list.filter(function (r) {
          return opts.searchFields.some(function (f) { return String(r[f] || '').toLowerCase().indexOf(q) > -1; });
        });
      }
      opts.render(list);
    }

    document.querySelectorAll('[data-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('[data-tab]').forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');
        state.tab = tab.getAttribute('data-tab');
        apply();
      });
    });
    document.querySelectorAll('[data-filter]').forEach(function (sel) {
      sel.addEventListener('change', function () { state.filters[sel.getAttribute('data-filter')] = sel.value; apply(); });
    });
    var search = document.getElementById('adm-search-input');
    if (search) search.addEventListener('input', function () { state.q = search.value.trim(); apply(); });

    apply();
  }

  /* =========================================================
     페이지: 대시보드
     ========================================================= */
  function pageDashboard() {
    var el = document.getElementById('adm-page');
    var newCnt = DATA.inquiries.filter(function (i) { return i.status === 'new'; }).length;
    var progCnt = DATA.inquiries.filter(function (i) { return i.status === 'progress'; }).length;
    var pubNews = DATA.news.filter(function (n) { return n.status === 'published'; }).length;
    var activeProd = DATA.products.filter(function (p) { return p.status === 'active'; }).length;

    function stat(label, value, ic, color, delta, up) {
      return '<div class="adm-stat"><div class="adm-stat__top"><span class="adm-stat__label">' + label + '</span>' +
        '<span class="adm-stat__icon adm-stat__icon--' + color + '">' + icon(ic) + '</span></div>' +
        '<div class="adm-stat__value">' + value + '</div>' +
        '<div class="adm-stat__delta adm-stat__delta--' + (up ? 'up' : 'down') + '">' + delta + '</div></div>';
    }

    var recentInq = DATA.inquiries.slice(0, 5).map(function (i) {
      var color = LABEL.inqStatusBadge[i.status];
      return '<div class="adm-list-item">' +
        '<span class="adm-list-item__dot" style="background:var(--adm-' + (color === 'gray' ? 'text-faint' : color) + ')"></span>' +
        '<div class="adm-list-item__body"><div class="adm-list-item__title">' + esc(i.name) + ' · ' + esc(i.company) + '</div>' +
        '<div class="adm-list-item__meta">' + LABEL.inqType[i.type] + ' · ' + badge(LABEL.inqStatus[i.status], color) + '</div></div>' +
        '<span class="adm-list-item__time">' + i.date + '</span></div>';
    }).join('');

    var recentNews = DATA.news.slice(0, 5).map(function (n) {
      return '<div class="adm-list-item"><div class="adm-list-item__body">' +
        '<div class="adm-list-item__title">' + esc(n.title) + '</div>' +
        '<div class="adm-list-item__meta">' + LABEL.newsCat[n.category] + ' · 조회 ' + n.views.toLocaleString() + '</div></div>' +
        '<span class="adm-list-item__time">' + badge(LABEL.newsStatus[n.status], LABEL.newsStatusBadge[n.status]) + '</span></div>';
    }).join('');

    el.innerHTML =
      '<div class="adm-content__head"><div>' +
        '<h2 class="adm-content__title">안녕하세요, 관리자님 👋</h2>' +
        '<p class="adm-content__subtitle">오늘 새로 접수된 문의 ' + newCnt + '건이 대기 중입니다.</p></div>' +
        '<div class="adm-content__head-actions"><a class="adm-btn adm-btn--ghost" href="index.html" target="_blank">' + icon('eye') + '사이트 보기</a>' +
        '<a class="adm-btn adm-btn--primary" href="admin-inquiries.html">' + icon('inbox') + '문의 확인</a></div></div>' +

      '<div class="adm-highlight"><span class="adm-highlight__tag">처리 필요</span>' +
        '<span class="adm-highlight__text"><strong>' + newCnt + '건</strong>의 신규 문의와 <strong>' + progCnt + '건</strong>의 처리중 문의가 있습니다. 빠른 응대가 고객 만족도를 높입니다.</span>' +
        '<a class="adm-btn adm-btn--primary adm-btn--sm adm-highlight__cta" href="admin-inquiries.html">바로가기 ' + icon('chevronR') + '</a></div>' +

      '<div class="adm-stats">' +
        stat('전체 문의', DATA.inquiries.length, 'inbox', 'red', '신규 ' + newCnt + '건 ↑', true) +
        stat('처리중 문의', progCnt, 'mail', 'amber', '응대 진행', true) +
        stat('게시중 뉴스', pubNews, 'news', 'blue', '전체 ' + DATA.news.length + '건', true) +
        stat('운영 제품', activeProd, 'box', 'green', '전체 ' + DATA.products.length + '종', true) +
      '</div>' +

      '<div class="adm-grid-2">' +
        '<div class="adm-panel"><div class="adm-panel__head"><h3 class="adm-panel__title">최근 문의</h3>' +
          '<a class="adm-btn adm-btn--ghost adm-btn--sm adm-panel__head-actions" href="admin-inquiries.html">전체보기</a></div>' + recentInq + '</div>' +
        '<div class="adm-panel"><div class="adm-panel__head"><h3 class="adm-panel__title">최근 뉴스</h3>' +
          '<a class="adm-btn adm-btn--ghost adm-btn--sm adm-panel__head-actions" href="admin-news.html">전체보기</a></div>' + recentNews + '</div>' +
      '</div>';
  }

  /* =========================================================
     페이지: 문의 관리
     ========================================================= */
  function pageInquiries() {
    var el = document.getElementById('adm-page');
    function count(s) { return DATA.inquiries.filter(function (i) { return i.status === s; }).length; }

    var tabs = [
      { k: 'all', label: '전체', c: DATA.inquiries.length },
      { k: 'new', label: '접수', c: count('new') },
      { k: 'progress', label: '처리중', c: count('progress') },
      { k: 'done', label: '완료', c: count('done') },
      { k: 'hold', label: '보류', c: count('hold') }
    ].map(function (t) {
      return '<button class="adm-tab' + (t.k === 'all' ? ' is-active' : '') + '" data-tab="' + t.k + '">' +
        t.label + '<span class="adm-tab__count">' + t.c + '</span></button>';
    }).join('');

    el.innerHTML =
      '<div class="adm-content__head"><div><h2 class="adm-content__title">문의 관리</h2>' +
        '<p class="adm-content__subtitle">고객 문의를 확인하고 처리 상태를 관리합니다.</p></div>' +
        '<div class="adm-content__head-actions"><button class="adm-btn adm-btn--ghost" id="adm-export">' + icon('mail') + '내보내기</button></div></div>' +
      '<div class="adm-panel">' +
        '<div class="adm-tabs">' + tabs + '</div>' +
        '<div class="adm-toolbar">' +
          '<select class="adm-select" data-filter="type"><option value="">유형 전체</option>' +
            Object.keys(LABEL.inqType).map(function (k) { return '<option value="' + k + '">' + LABEL.inqType[k] + '</option>'; }).join('') + '</select>' +
          '<select class="adm-select" data-filter="assignee"><option value="">담당자 전체</option>' +
            STAFF.map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('') + '</select>' +
          '<div class="adm-search">' + icon('search') + '<input id="adm-search-input" placeholder="이름·회사·제품 검색"></div>' +
        '</div>' +
        '<div class="adm-table-wrap"><table class="adm-table"><thead><tr>' +
          '<th style="width:40px"></th><th>문의자</th><th>회사</th><th>유형</th><th>관심 제품</th><th>상태</th><th>담당자</th><th>접수일</th><th style="width:60px"></th>' +
        '</tr></thead><tbody id="adm-tbody"></tbody></table></div>' +
        '<div class="adm-pagination"><button disabled>' + icon('chevronL') + '</button><button class="is-active">1</button><button disabled>' + icon('chevronR') + '</button></div>' +
      '</div>';

    var tbody = document.getElementById('adm-tbody');
    function render(list) {
      if (!list.length) { tbody.innerHTML = emptyRow(9); return; }
      tbody.innerHTML = list.map(function (i) {
        return '<tr data-id="' + i.id + '">' +
          '<td><button class="adm-table__star" data-star aria-label="즐겨찾기">' + icon('star') + '</button></td>' +
          '<td><div class="adm-table__name">' + esc(i.name) + '</div><div class="adm-table__sub">' + esc(i.email) + '</div></td>' +
          '<td>' + esc(i.company) + '</td>' +
          '<td>' + badge(LABEL.inqType[i.type], 'purple') + '</td>' +
          '<td>' + (i.product === '-' ? '<span class="adm-table__num">—</span>' : esc(i.product)) + '</td>' +
          '<td>' + badge(LABEL.inqStatus[i.status], LABEL.inqStatusBadge[i.status]) + '</td>' +
          '<td>' + assigneeCell(i.assignee) + '</td>' +
          '<td class="adm-table__num">' + i.date + '</td>' +
          '<td><button class="adm-table__action" data-view title="상세보기">' + icon('eye') + '</button></td>' +
        '</tr>';
      }).join('');
    }

    attachFilter({ rows: DATA.inquiries, tabKey: 'status', searchFields: ['name', 'company', 'product', 'email'], render: render });

    tbody.addEventListener('click', function (e) {
      var star = e.target.closest('[data-star]');
      if (star) { star.classList.toggle('is-on'); return; }
      var tr = e.target.closest('tr[data-id]');
      if (!tr) return;
      var inq = DATA.inquiries.find(function (x) { return x.id == tr.getAttribute('data-id'); });
      openInquiry(inq);
    });

    document.getElementById('adm-export').addEventListener('click', function () { toast('문의 목록을 CSV로 내보냈습니다.'); });
  }

  function openInquiry(i) {
    var body =
      '<div class="adm-detail-row"><div class="adm-detail-row__k">상태</div><div class="adm-detail-row__v">' + badge(LABEL.inqStatus[i.status], LABEL.inqStatusBadge[i.status]) + '</div></div>' +
      '<div class="adm-detail-row"><div class="adm-detail-row__k">담당자</div><div class="adm-detail-row__v">' + assigneeCell(i.assignee) + '</div></div>' +
      '<div class="adm-detail-row"><div class="adm-detail-row__k">문의자</div><div class="adm-detail-row__v">' + esc(i.name) + ' (' + esc(i.company) + ')</div></div>' +
      '<div class="adm-detail-row"><div class="adm-detail-row__k">유형</div><div class="adm-detail-row__v">' + LABEL.inqType[i.type] + '</div></div>' +
      '<div class="adm-detail-row"><div class="adm-detail-row__k">관심 제품</div><div class="adm-detail-row__v">' + esc(i.product) + '</div></div>' +
      '<div class="adm-detail-row"><div class="adm-detail-row__k">이메일</div><div class="adm-detail-row__v">' + esc(i.email) + '</div></div>' +
      '<div class="adm-detail-row"><div class="adm-detail-row__k">연락처</div><div class="adm-detail-row__v">' + esc(i.phone) + '</div></div>' +
      '<div class="adm-detail-row"><div class="adm-detail-row__k">접수일</div><div class="adm-detail-row__v">' + i.date + '</div></div>' +
      '<div class="adm-detail-row"><div class="adm-detail-row__k">문의 내용</div><div class="adm-detail-row__v">' + esc(i.content) + '</div></div>' +
      '<div class="adm-row" style="margin-top:18px">' +
        '<div class="adm-field" style="margin-bottom:0"><label class="adm-field__label">처리 상태</label>' +
          '<select class="adm-input" id="adm-inq-status">' + Object.keys(LABEL.inqStatus).map(function (k) {
            return '<option value="' + k + '"' + (k === i.status ? ' selected' : '') + '>' + LABEL.inqStatus[k] + '</option>';
          }).join('') + '</select></div>' +
        '<div class="adm-field" style="margin-bottom:0"><label class="adm-field__label">담당자</label>' +
          '<select class="adm-input" id="adm-inq-assignee"><option value="">미배정</option>' + STAFF.map(function (s) {
            return '<option value="' + s + '"' + (s === i.assignee ? ' selected' : '') + '>' + s + '</option>';
          }).join('') + '</select></div>' +
      '</div>';
    var foot =
      '<a class="adm-btn adm-btn--ghost" href="mailto:' + esc(i.email) + '">' + icon('mail') + '답변 메일</a>' +
      '<button class="adm-btn adm-btn--primary" data-save>' + icon('check') + '저장</button>';
    var m = modal('문의 상세 — ' + esc(i.name), body, foot);
    m.el.querySelector('[data-save]').addEventListener('click', function () {
      var newStatus = m.el.querySelector('#adm-inq-status').value;
      var newAssignee = m.el.querySelector('#adm-inq-assignee').value;
      if (newStatus === 'progress' && !newAssignee) {
        m.el.querySelector('#adm-inq-assignee').focus();
        toast('처리중으로 변경하려면 담당자를 지정해 주세요.');
        return;
      }
      i.status = newStatus;
      i.assignee = newAssignee;
      saveData();
      m.close(); toast('처리 상태가 저장되었습니다.');
      pageInquiries();
    });
  }

  /* =========================================================
     페이지: 뉴스 관리
     ========================================================= */
  function pageNews() {
    var el = document.getElementById('adm-page');
    el.innerHTML =
      '<div class="adm-content__head"><div><h2 class="adm-content__title">뉴스 관리</h2>' +
        '<p class="adm-content__subtitle">웹사이트에 노출되는 뉴스·보도자료를 관리합니다.</p></div>' +
        '<div class="adm-content__head-actions"><a class="adm-btn adm-btn--primary" href="admin-news-edit.html">' + icon('plus') + '새 뉴스 작성</a></div></div>' +
      '<div class="adm-panel"><div class="adm-toolbar">' +
        '<select class="adm-select" data-filter="category"><option value="">카테고리 전체</option>' +
          Object.keys(LABEL.newsCat).map(function (k) { return '<option value="' + k + '">' + LABEL.newsCat[k] + '</option>'; }).join('') + '</select>' +
        '<select class="adm-select" data-filter="status"><option value="">상태 전체</option>' +
          Object.keys(LABEL.newsStatus).map(function (k) { return '<option value="' + k + '">' + LABEL.newsStatus[k] + '</option>'; }).join('') + '</select>' +
        '<div class="adm-search">' + icon('search') + '<input id="adm-search-input" placeholder="제목 검색"></div></div>' +
        '<div class="adm-table-wrap"><table class="adm-table"><thead><tr>' +
          '<th>제목</th><th>카테고리</th><th>작성자</th><th>조회수</th><th>상태</th><th>작성일</th><th style="width:90px">관리</th>' +
        '</tr></thead><tbody id="adm-tbody"></tbody></table></div></div>';

    var tbody = document.getElementById('adm-tbody');
    function render(list) {
      if (!list.length) { tbody.innerHTML = emptyRow(7); return; }
      tbody.innerHTML = list.map(function (n) {
        var thumb = n.mainImage
          ? '<img class="adm-prod-thumb" src="' + n.mainImage + '" alt="">'
          : '<span class="adm-prod-thumb adm-prod-thumb--empty">' + icon('image') + '</span>';
        return '<tr data-id="' + n.id + '">' +
          '<td><div class="adm-prod-cell">' + thumb + '<span class="adm-table__name">' + esc(n.title) + '</span></div></td>' +
          '<td>' + badge(LABEL.newsCat[n.category], 'blue') + '</td>' +
          '<td>' + esc(n.author) + '</td>' +
          '<td class="adm-table__num">' + n.views.toLocaleString() + '</td>' +
          '<td>' + badge(LABEL.newsStatus[n.status], LABEL.newsStatusBadge[n.status]) + '</td>' +
          '<td class="adm-table__num">' + n.date + '</td>' +
          '<td><button class="adm-table__action" data-edit title="수정">' + icon('edit') + '</button>' +
            '<button class="adm-table__action adm-table__action--danger" data-del title="삭제">' + icon('trash') + '</button></td>' +
        '</tr>';
      }).join('');
    }
    attachFilter({ rows: DATA.news, searchFields: ['title', 'author'], render: render });

    tbody.addEventListener('click', function (e) {
      var tr = e.target.closest('tr[data-id]'); if (!tr) return;
      var id = +tr.getAttribute('data-id');
      var n = DATA.news.find(function (x) { return x.id === id; });
      if (e.target.closest('[data-del]')) {
        if (confirm('"' + n.title + '" 뉴스를 삭제할까요?')) {
          DATA.news = DATA.news.filter(function (x) { return x.id !== id; });
          saveData(); pageNews(); toast('뉴스가 삭제되었습니다.');
        }
        return;
      }
      if (e.target.closest('[data-edit]')) location.href = 'admin-news-edit.html#id=' + id;
    });
  }

  /* 뉴스 작성/편집 — 전용 게시 페이지 */
  function pageNewsEdit() {
    var el = document.getElementById('adm-page');
    var id = editId();
    var n = id ? DATA.news.find(function (x) { return x.id === id; }) : null;
    var isEdit = !!n;

    el.innerHTML =
      '<div class="adm-content__head"><div>' +
        '<a class="adm-back" href="admin-news.html">' + icon('chevronL') + '뉴스 목록</a>' +
        '<h2 class="adm-content__title">' + (isEdit ? '뉴스 수정' : '새 뉴스 작성') + '</h2>' +
        '<p class="adm-content__subtitle">웹사이트 뉴스·보도자료를 작성하고 게시합니다.</p></div></div>' +
      '<form class="adm-editor" id="adm-editor">' +
        '<div class="adm-panel adm-editor__main"><div class="adm-panel__pad">' +
          '<div class="adm-field"><label class="adm-field__label">제목 <span class="req">*</span></label>' +
            '<input class="adm-input" id="f-title" value="' + esc(n ? n.title : '') + '" placeholder="뉴스 제목을 입력하세요"></div>' +
          '<div class="adm-field"><label class="adm-field__label">요약</label>' +
            '<input class="adm-input" id="f-summary" value="' + esc(n ? (n.summary || '') : '') + '" placeholder="목록·미리보기에 노출될 한 줄 요약"></div>' +
          '<div class="adm-field">' +
            '<label class="adm-field__label">대표 이미지 <span class="adm-field__hint">목록·상단에 노출 (1장)</span></label>' +
            '<div class="adm-uploader adm-uploader--single" id="up-main"></div></div>' +
          '<div class="adm-field"><label class="adm-field__label">본문</label>' +
            '<textarea class="adm-textarea" id="f-body" style="min-height:280px" placeholder="뉴스 본문을 입력하세요">' + esc(n ? (n.body || '') : '') + '</textarea></div>' +
          '<div class="adm-field" style="margin-bottom:0">' +
            '<label class="adm-field__label">상세 이미지 <span class="adm-field__hint">상세 페이지 본문에 노출 (여러 장)</span></label>' +
            '<div class="adm-uploader adm-uploader--multi" id="up-detail"></div></div>' +
        '</div></div>' +
        '<aside class="adm-panel adm-editor__side"><div class="adm-panel__pad">' +
          '<h3 class="adm-editor__side-title">게시 설정</h3>' +
          '<div class="adm-field"><label class="adm-field__label">상태</label>' +
            '<select id="f-status" class="adm-input">' + Object.keys(LABEL.newsStatus).map(function (k) { return '<option value="' + k + '"' + (n && n.status === k ? ' selected' : (!n && k === 'draft' ? ' selected' : '')) + '>' + LABEL.newsStatus[k] + '</option>'; }).join('') + '</select></div>' +
          '<div class="adm-field"><label class="adm-field__label">카테고리</label>' +
            '<select id="f-cat" class="adm-input">' + Object.keys(LABEL.newsCat).map(function (k) { return '<option value="' + k + '"' + (n && n.category === k ? ' selected' : '') + '>' + LABEL.newsCat[k] + '</option>'; }).join('') + '</select></div>' +
          '<div class="adm-field"><label class="adm-field__label">작성자</label>' +
            '<input class="adm-input" id="f-author" value="' + esc(n ? n.author : '관리자') + '"></div>' +
          (isEdit ? '<div class="adm-detail-row" style="padding-top:4px"><div class="adm-detail-row__k">조회수</div><div class="adm-detail-row__v">' + (n.views || 0).toLocaleString() + '</div></div>' : '') +
          '<div class="adm-editor__actions">' +
            '<button type="submit" class="adm-btn adm-btn--primary adm-btn--block">' + icon('check') + (isEdit ? '수정 게시' : '게시하기') + '</button>' +
            '<button type="button" class="adm-btn adm-btn--ghost adm-btn--block" data-save-draft>임시저장</button>' +
          '</div>' +
        '</div></aside>' +
      '</form>';

    var up = setupImageUploaders(el, n && n.mainImage, n && n.detailImages);

    function save(forceStatus) {
      var title = el.querySelector('#f-title').value.trim();
      if (!title) { el.querySelector('#f-title').focus(); toast('제목을 입력해 주세요.'); return; }
      var st = forceStatus || el.querySelector('#f-status').value;
      var payload = {
        title: title,
        summary: el.querySelector('#f-summary').value.trim(),
        body: el.querySelector('#f-body').value.trim(),
        category: el.querySelector('#f-cat').value,
        status: st,
        author: el.querySelector('#f-author').value.trim() || '관리자',
        mainImage: up.getMain(),
        detailImages: up.getDetail()
      };
      if (isEdit) { Object.assign(n, payload); }
      else { DATA.news.unshift(Object.assign({ id: Date.now(), date: today(), views: 0 }, payload)); }
      if (!saveData()) {
        if (!isEdit) DATA.news.shift(); // 방금 추가분 롤백
        toast('이미지 용량이 너무 큽니다. 이미지 수/크기를 줄여 주세요.');
        return;
      }
      flash(st === 'published' ? '뉴스가 게시되었습니다.' : '임시저장되었습니다.');
      location.href = 'admin-news.html';
    }
    el.querySelector('#adm-editor').addEventListener('submit', function (e) { e.preventDefault(); save(); });
    el.querySelector('[data-save-draft]').addEventListener('click', function () { save('draft'); });
  }

  /* =========================================================
     페이지: 제품 관리
     ========================================================= */
  function pageProducts() {
    var el = document.getElementById('adm-page');
    el.innerHTML =
      '<div class="adm-content__head"><div><h2 class="adm-content__title">제품 관리</h2>' +
        '<p class="adm-content__subtitle">제품·애플리케이션 페이지에 노출되는 제품을 관리합니다.</p></div>' +
        '<div class="adm-content__head-actions"><a class="adm-btn adm-btn--primary" href="admin-product-edit.html">' + icon('plus') + '제품 등록</a></div></div>' +
      '<div class="adm-panel"><div class="adm-toolbar">' +
        '<select class="adm-select" data-filter="category"><option value="">카테고리 전체</option>' +
          Object.keys(LABEL.prodCat).map(function (k) { return '<option value="' + k + '">' + LABEL.prodCat[k] + '</option>'; }).join('') + '</select>' +
        '<select class="adm-select" data-filter="status"><option value="">상태 전체</option>' +
          Object.keys(LABEL.prodStatus).map(function (k) { return '<option value="' + k + '">' + LABEL.prodStatus[k] + '</option>'; }).join('') + '</select>' +
        '<div class="adm-search">' + icon('search') + '<input id="adm-search-input" placeholder="제품명 검색"></div></div>' +
        '<div class="adm-table-wrap"><table class="adm-table"><thead><tr>' +
          '<th>제품명</th><th>카테고리</th><th>설명</th><th>상태</th><th>수정일</th><th style="width:90px">관리</th>' +
        '</tr></thead><tbody id="adm-tbody"></tbody></table></div></div>';

    var tbody = document.getElementById('adm-tbody');
    function render(list) {
      if (!list.length) { tbody.innerHTML = emptyRow(6); return; }
      tbody.innerHTML = list.map(function (p) {
        var thumb = p.mainImage
          ? '<img class="adm-prod-thumb" src="' + p.mainImage + '" alt="">'
          : '<span class="adm-prod-thumb adm-prod-thumb--empty">' + icon('image') + '</span>';
        return '<tr data-id="' + p.id + '">' +
          '<td><div class="adm-prod-cell">' + thumb + '<span class="adm-table__name">' + esc(p.name) + '</span></div></td>' +
          '<td>' + badge(LABEL.prodCat[p.category], 'purple') + '</td>' +
          '<td>' + esc(p.desc) + '</td>' +
          '<td>' + badge(LABEL.prodStatus[p.status], LABEL.prodStatusBadge[p.status]) + '</td>' +
          '<td class="adm-table__num">' + p.updated + '</td>' +
          '<td><button class="adm-table__action" data-edit title="수정">' + icon('edit') + '</button>' +
            '<button class="adm-table__action adm-table__action--danger" data-del title="삭제">' + icon('trash') + '</button></td>' +
        '</tr>';
      }).join('');
    }
    attachFilter({ rows: DATA.products, searchFields: ['name', 'desc'], render: render });

    tbody.addEventListener('click', function (e) {
      var tr = e.target.closest('tr[data-id]'); if (!tr) return;
      var id = +tr.getAttribute('data-id');
      var p = DATA.products.find(function (x) { return x.id === id; });
      if (e.target.closest('[data-del]')) {
        if (confirm('"' + p.name + '" 제품을 삭제할까요?')) {
          DATA.products = DATA.products.filter(function (x) { return x.id !== id; });
          saveData(); pageProducts(); toast('제품이 삭제되었습니다.');
        }
        return;
      }
      if (e.target.closest('[data-edit]')) location.href = 'admin-product-edit.html#id=' + id;
    });
  }

  /* 제품 작성/편집 — 전용 게시 페이지 */
  function pageProductEdit() {
    var el = document.getElementById('adm-page');
    var id = editId();
    var p = id ? DATA.products.find(function (x) { return x.id === id; }) : null;
    var isEdit = !!p;

    el.innerHTML =
      '<div class="adm-content__head"><div>' +
        '<a class="adm-back" href="admin-products.html">' + icon('chevronL') + '제품 목록</a>' +
        '<h2 class="adm-content__title">' + (isEdit ? '제품 수정' : '제품 등록') + '</h2>' +
        '<p class="adm-content__subtitle">제품·애플리케이션 페이지에 노출될 제품을 작성하고 게시합니다.</p></div></div>' +
      '<form class="adm-editor" id="adm-editor">' +
        '<div class="adm-panel adm-editor__main"><div class="adm-panel__pad">' +
          '<div class="adm-field"><label class="adm-field__label">제품명 <span class="req">*</span></label>' +
            '<input class="adm-input" id="f-name" value="' + esc(p ? p.name : '') + '" placeholder="예: CAMELLIA3"></div>' +
          '<div class="adm-field"><label class="adm-field__label">한 줄 설명</label>' +
            '<input class="adm-input" id="f-desc" value="' + esc(p ? p.desc : '') + '" placeholder="목록에 노출될 제품 설명"></div>' +
          '<div class="adm-field">' +
            '<label class="adm-field__label">대표 이미지 <span class="adm-field__hint">메인·목록에 노출 (1장)</span></label>' +
            '<div class="adm-uploader adm-uploader--single" id="up-main"></div></div>' +
          '<div class="adm-field">' +
            '<label class="adm-field__label">상세 이미지 <span class="adm-field__hint">상세 페이지에 노출 (여러 장)</span></label>' +
            '<div class="adm-uploader adm-uploader--multi" id="up-detail"></div></div>' +
          '<div class="adm-field" style="margin-bottom:0"><label class="adm-field__label">상세 소개</label>' +
            '<textarea class="adm-textarea" id="f-detail" style="min-height:240px" placeholder="제품 상세 소개·주요 사양을 입력하세요">' + esc(p ? (p.detail || '') : '') + '</textarea></div>' +
        '</div></div>' +
        '<aside class="adm-panel adm-editor__side"><div class="adm-panel__pad">' +
          '<h3 class="adm-editor__side-title">게시 설정</h3>' +
          '<div class="adm-field"><label class="adm-field__label">상태</label>' +
            '<select id="f-status" class="adm-input">' + Object.keys(LABEL.prodStatus).map(function (k) { return '<option value="' + k + '"' + (p && p.status === k ? ' selected' : (!p && k === 'draft' ? ' selected' : '')) + '>' + LABEL.prodStatus[k] + '</option>'; }).join('') + '</select></div>' +
          '<div class="adm-field"><label class="adm-field__label">카테고리</label>' +
            '<select id="f-cat" class="adm-input">' + Object.keys(LABEL.prodCat).map(function (k) { return '<option value="' + k + '"' + (p && p.category === k ? ' selected' : '') + '>' + LABEL.prodCat[k] + '</option>'; }).join('') + '</select></div>' +
          '<div class="adm-editor__actions">' +
            '<button type="submit" class="adm-btn adm-btn--primary adm-btn--block">' + icon('check') + (isEdit ? '수정 게시' : '게시하기') + '</button>' +
            '<button type="button" class="adm-btn adm-btn--ghost adm-btn--block" data-save-draft>비공개 저장</button>' +
          '</div>' +
        '</div></aside>' +
      '</form>';

    var up = setupImageUploaders(el, p && p.mainImage, p && p.detailImages);

    function save(forceStatus) {
      var name = el.querySelector('#f-name').value.trim();
      if (!name) { el.querySelector('#f-name').focus(); toast('제품명을 입력해 주세요.'); return; }
      var st = forceStatus || el.querySelector('#f-status').value;
      var payload = {
        name: name,
        desc: el.querySelector('#f-desc').value.trim(),
        detail: el.querySelector('#f-detail').value.trim(),
        category: el.querySelector('#f-cat').value,
        status: st,
        mainImage: up.getMain(),
        detailImages: up.getDetail(),
        updated: today()
      };
      if (isEdit) { Object.assign(p, payload); }
      else { DATA.products.unshift(Object.assign({ id: Date.now() }, payload)); }
      if (!saveData()) {
        if (!isEdit) DATA.products.shift(); // 방금 추가분 롤백
        toast('이미지 용량이 너무 큽니다. 이미지 수/크기를 줄여 주세요.');
        return;
      }
      flash(st === 'active' ? '제품이 게시되었습니다.' : '저장되었습니다.');
      location.href = 'admin-products.html';
    }
    el.querySelector('#adm-editor').addEventListener('submit', function (e) { e.preventDefault(); save(); });
    el.querySelector('[data-save-draft]').addEventListener('click', function () { save('draft'); });
  }

  /* =========================================================
     페이지: FAQ 관리
     ========================================================= */
  function pageFaq() {
    var el = document.getElementById('adm-page');
    el.innerHTML =
      '<div class="adm-content__head"><div><h2 class="adm-content__title">FAQ 관리</h2>' +
        '<p class="adm-content__subtitle">자주 묻는 질문을 관리합니다.</p></div>' +
        '<div class="adm-content__head-actions"><button class="adm-btn adm-btn--primary" id="adm-new">' + icon('plus') + 'FAQ 등록</button></div></div>' +
      '<div class="adm-panel"><div class="adm-toolbar">' +
        '<select class="adm-select" data-filter="category"><option value="">카테고리 전체</option>' +
          Object.keys(LABEL.faqCat).map(function (k) { return '<option value="' + k + '">' + LABEL.faqCat[k] + '</option>'; }).join('') + '</select>' +
        '<div class="adm-search">' + icon('search') + '<input id="adm-search-input" placeholder="질문 검색"></div></div>' +
        '<div class="adm-table-wrap"><table class="adm-table"><thead><tr>' +
          '<th>질문</th><th>카테고리</th><th>상태</th><th>수정일</th><th style="width:90px">관리</th>' +
        '</tr></thead><tbody id="adm-tbody"></tbody></table></div></div>';

    var tbody = document.getElementById('adm-tbody');
    function render(list) {
      if (!list.length) { tbody.innerHTML = emptyRow(5); return; }
      tbody.innerHTML = list.map(function (f) {
        return '<tr data-id="' + f.id + '">' +
          '<td><div class="adm-table__name">Q. ' + esc(f.q) + '</div></td>' +
          '<td>' + badge(LABEL.faqCat[f.category], 'blue') + '</td>' +
          '<td>' + badge(LABEL.faqStatus[f.status], LABEL.faqStatusBadge[f.status]) + '</td>' +
          '<td class="adm-table__num">' + f.updated + '</td>' +
          '<td><button class="adm-table__action" data-edit title="수정">' + icon('edit') + '</button>' +
            '<button class="adm-table__action adm-table__action--danger" data-del title="삭제">' + icon('trash') + '</button></td>' +
        '</tr>';
      }).join('');
    }
    attachFilter({ rows: DATA.faqs, searchFields: ['q'], render: render });

    tbody.addEventListener('click', function (e) {
      var tr = e.target.closest('tr[data-id]'); if (!tr) return;
      var id = +tr.getAttribute('data-id');
      var f = DATA.faqs.find(function (x) { return x.id === id; });
      if (e.target.closest('[data-del]')) {
        if (confirm('이 FAQ를 삭제할까요?')) { DATA.faqs = DATA.faqs.filter(function (x) { return x.id !== id; }); saveData(); pageFaq(); toast('FAQ가 삭제되었습니다.'); }
        return;
      }
      if (e.target.closest('[data-edit]')) openFaqForm(f);
    });
    document.getElementById('adm-new').addEventListener('click', function () { openFaqForm(null); });
  }

  function openFaqForm(f) {
    var isEdit = !!f;
    var body =
      '<div class="adm-field"><label class="adm-field__label">질문 <span class="req">*</span></label>' +
        '<input class="adm-input" id="f-q" value="' + esc(f ? f.q : '') + '" placeholder="질문을 입력하세요"></div>' +
      '<div class="adm-field"><label class="adm-field__label">답변</label>' +
        '<textarea class="adm-textarea" id="f-a" placeholder="답변을 입력하세요">' + esc(f ? (f.a || '') : '') + '</textarea></div>' +
      '<div class="adm-row"><div class="adm-field"><label class="adm-field__label">카테고리</label>' +
        '<select id="f-cat">' + Object.keys(LABEL.faqCat).map(function (k) { return '<option value="' + k + '"' + (f && f.category === k ? ' selected' : '') + '>' + LABEL.faqCat[k] + '</option>'; }).join('') + '</select></div>' +
      '<div class="adm-field"><label class="adm-field__label">상태</label>' +
        '<select id="f-status">' + Object.keys(LABEL.faqStatus).map(function (k) { return '<option value="' + k + '"' + (f && f.status === k ? ' selected' : '') + '>' + LABEL.faqStatus[k] + '</option>'; }).join('') + '</select></div></div>';
    var foot = '<button class="adm-btn adm-btn--ghost" data-close>취소</button><button class="adm-btn adm-btn--primary" data-save>' + icon('check') + (isEdit ? '수정 저장' : '등록') + '</button>';
    var m = modal(isEdit ? 'FAQ 수정' : 'FAQ 등록', body, foot);
    m.el.querySelector('[data-save]').addEventListener('click', function () {
      var q = m.el.querySelector('#f-q').value.trim();
      if (!q) { m.el.querySelector('#f-q').focus(); return; }
      var cat = m.el.querySelector('#f-cat').value, st = m.el.querySelector('#f-status').value;
      if (isEdit) { f.q = q; f.category = cat; f.status = st; f.updated = today(); }
      else DATA.faqs.unshift({ id: Date.now(), q: q, category: cat, status: st, updated: today() });
      saveData();
      m.close(); pageFaq(); toast(isEdit ? 'FAQ가 수정되었습니다.' : 'FAQ가 등록되었습니다.');
    });
  }

  /* =========================================================
     유틸
     ========================================================= */
  function emptyRow(cols) {
    return '<tr><td colspan="' + cols + '"><div class="adm-empty">' + icon('search') + '<p>검색 결과가 없습니다.</p></div></td></tr>';
  }
  function today() {
    var d = new Date();
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '.' + p(d.getMonth() + 1) + '.' + p(d.getDate());
  }
  /* 편집 대상 id — 쿼리스트링 또는 해시(#id=) 모두 지원 (정적 호스팅 호환) */
  function editId() {
    var qs = new URLSearchParams(location.search);
    var hs = new URLSearchParams(location.hash.replace(/^#/, ''));
    return +(qs.get('id') || hs.get('id')) || 0;
  }

  /* =========================================================
     로그인 페이지 초기화
     ========================================================= */
  function initLogin() {
    if (Auth.current()) { location.replace('admin.html'); return; }
    var form = document.getElementById('adm-login-form');
    if (!form) return;
    var err = document.getElementById('adm-login-error');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var id = document.getElementById('login-id').value.trim();
      var pw = document.getElementById('login-pw').value;
      var remember = document.getElementById('login-remember').checked;
      if (Auth.login(id, pw, remember)) {
        location.href = 'admin.html';
      } else {
        err.classList.add('is-show');
      }
    });
    form.addEventListener('input', function () { err.classList.remove('is-show'); });
  }

  /* =========================================================
     초기화 라우터
     ========================================================= */
  var PAGES = { dashboard: pageDashboard, inquiries: pageInquiries, news: pageNews, products: pageProducts, faq: pageFaq };
  var EDITORS = {
    'news-edit': { nav: 'news', title: '뉴스 작성', fn: pageNewsEdit },
    'product-edit': { nav: 'products', title: '제품 작성', fn: pageProductEdit }
  };

  function showFlash() {
    try {
      var f = sessionStorage.getItem('ati_admin_flash');
      if (f) { sessionStorage.removeItem('ati_admin_flash'); setTimeout(function () { toast(f); }, 120); }
    } catch (e) {}
  }

  function init(pageKey) {
    if (pageKey === 'login') { initLogin(); return; }
    if (!Auth.guard()) return;
    loadData();
    if (EDITORS[pageKey]) {
      var ed = EDITORS[pageKey];
      renderLayout(ed.nav, ed.title);
      ed.fn();
      return;
    }
    renderLayout(pageKey);
    if (PAGES[pageKey]) PAGES[pageKey]();
    showFlash();
  }

  global.Admin = { init: init, auth: Auth, data: DATA, toast: toast };
})(window);
