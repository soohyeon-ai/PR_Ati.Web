/**
 * I18n (Language Switcher) Control
 * 푸터의 KR/EN 콤보박스로 페이지 언어를 전환한다.
 * - data-i18n="key"       : textContent 를 번역값으로 교체 (일반 텍스트)
 * - data-i18n-html="key"  : innerHTML 을 번역값으로 교체 (<strong> 등 마크업 포함)
 * 기본값은 현재 본문과 동일한 'en'. 선택값은 localStorage 에 저장해 새로고침 후에도 유지된다.
 */
const I18n = (function () {
  const STORAGE_KEY = 'ati-lang';
  const DEFAULT_LANG = 'en';

  // key: { en, ko }
  const dict = {
    // ===== Header nav =====
    'nav.ati':        { en: 'ATI', ko: 'ATI' },
    'nav.products':   { en: 'Product & Applications', ko: '제품 및 응용분야' },
    'nav.solutions':  { en: 'Solution & Services', ko: '솔루션 및 서비스' },
    'nav.news':       { en: 'News & Events', ko: '뉴스 및 이벤트' },
    'nav.contact':    { en: 'Contact us', ko: '문의하기' },

    // ===== Hero =====
    'hero.subtitle':  { en: 'inspection solutions for the semiconductor and PCB industries', ko: '데이터와 정밀 검사를 잇는 ATI의 기술로 \n 반도체·PCB 산업의 미래 품질을 완성합니다.' },
    'hero.aboutBtn':  { en: 'About us', ko: 'About us' },
    'hero.contactBtn':{ en: 'Contact us', ko: 'Contact us' },

    // ===== Contact =====
    'contact.label':   { en: 'Contact us', ko: 'Contact us' },
    'contact.heading': { en: 'Partner with ATI for\nsemiconductor & PCB inspection solutions', ko: '반도체·PCB 검사 솔루션,\nATI와 함께하세요' },
    'contact.btn':     { en: 'Contact us →', ko: '문의하기 →' },

    // ===== Innovation =====
    'innovation.subtitle': { en: 'Since 1996, leading the future of inspection technology', ko: '1996년부터 검사 기술의 미래를 선도합니다' },

    // ===== About =====
    'about.title':       { en: '30 Years of Innovation', ko: '30 Years of Innovation' },
    'about.description': {
      en: 'Celebrating 30 years of innovation since 1996, ATI (Advanced Technology Inc.) has evolved into a global leader in metrology and inspection solutions for the semiconductor and PCB industries. Driven by core principles of "Try, Think, Fight, and Fun," the company has achieved over 2,000 installations globally while advancing AI-driven technology for the future.',
      ko: '1996년 창립 이후 ATI(Advanced Technology Inc.)는 30년 가까이 혁신을 이어오며, 반도체 및 PCB 산업을 위한 계측·검사 솔루션 분야에서 글로벌 경쟁력을 갖춘 기업으로 성장했습니다.\n"Try, Think, Fight, and Fun"이라는 핵심 가치를 바탕으로 전 세계 2,000건 이상의 설치 실적을 달성했으며, 미래를 위한 AI 기반 기술을 지속적으로 발전시키고 있습니다.'
    },
    'about.moreBtn':     { en: 'More View', ko: '더 보기' },

    // ===== Products Interactive (Solutions) =====
    'solutions.title':  { en: 'ATI Products and Applications', ko: 'ATI 검사·계측 제품 및 응용 분야' },
    'solutions.desc':   { en: 'Select a category below, and drag the camera along the rail to browse products.', ko: '아래 카테고리를 선택하고 \n 원하는 솔루션 제품을 확인해보세요.' },
    'solutions.allBtn': { en: 'All Product View', ko: '전체 제품 보기' },
    'cat.wafer':        { en: 'Wafer', ko: '웨이퍼' },
    'cat.reticle':      { en: 'Reticle', ko: '레티클' },
    'cat.pcb':          { en: 'PCB', ko: 'PCB' },

    // ===== News =====
    'news.title':    { en: 'News & Events', ko: '뉴스 및 이벤트' },
    'news.subtitle': { en: "What's Happening at ATI", ko: 'ATI의 새로운 소식을 전해드립니다' },

    // ===== Products Cards =====
    // 색상을 바꾸고 싶은 부분은 아래 <span style="color:..."> 값만 수정하면 됩니다.
    'cards.title':    { en: 'Products & <span style="color:#3A3A3A">Applications</span>', ko: '반도체 공정을 완성하는 <span style="color:#3A3A3A">통합 검사 솔루션</span>' },
    'cards.subtitle': { en: 'We provide inspection and measurement solutions for the entire semiconductor manufacturing process.', ko: '반도체 제조 전 공정을 위한 검사 및 계측 솔루션을 제공합니다.' },
    'card.wafer.title':    { en: '<strong>Wafer</strong> Inspection &amp; Measurement', ko: '<strong>Wafer</strong> Inspection &amp; Measurement' },
    'card.wafer.desc':     { en: 'High-resolution inspection and metrology for next-generation wafers.', ko: '차세대 웨이퍼를 위한 고해상도 검사 및 계측 솔루션입니다.' },
    'card.reticle.title':  { en: '<strong>Reticle</strong> Inspection &amp; Measurement', ko: '<strong>Reticle</strong> Inspection &amp; Measurement' },
    'card.reticle.desc':   { en: 'EUV/DUV Reticle inspection and Optical Density measurement.', ko: 'EUV/DUV 레티클을 위한 검사 및 광학 밀도 측정 솔루션을 제공합니다.' },
    'card.package.title':  { en: '<strong>Package</strong> Inspection &amp; Measurement', ko: '<strong>Package</strong> Inspection &amp; Measurement' },
    'card.package.desc':   { en: 'Advanced Package and PCB inspection, measurement, sorting and laser marking.', ko: 'Advanced Package와 PCB를 위한 검사·측정·분류 및 레이저 마킹 솔루션을 제공합니다.' },

    // ===== Common =====
    'common.moreLink': { en: '+ View More', ko: '+ 자세히 보기' },

    // ===== Footer =====
    'footer.col.ati':     { en: 'ATI', ko: 'ATI' },
    'footer.col.products':{ en: 'Products', ko: '제품' },
    'footer.col.company': { en: 'Company', ko: '회사' },
    'footer.col.legal':   { en: 'Legal', ko: '법적 고지' },

    'footer.aboutAti': { en: 'About ATI', ko: '회사 소개' },
    'footer.mission':  { en: 'Mission and Vision', ko: '미션과 비전' },
    'footer.history':  { en: 'History', ko: '연혁' },
    'footer.esg':      { en: 'ESG', ko: 'ESG' },
    'footer.semiApp':  { en: 'Semiconductor Applications', ko: '반도체 응용분야' },
    'footer.wafer':    { en: 'Wafer', ko: '웨이퍼' },
    'footer.reticle':  { en: 'Reticle', ko: '레티클' },
    'footer.package':  { en: 'Package', ko: '패키지' },
    'footer.pcbApp':   { en: 'PCB Applications', ko: 'PCB 응용분야' },

    'footer.address':      { en: 'Address', ko: '주소' },
    'footer.addressValue': { en: '41, Songdo Mirae-ro, Yeonsu-gu, Incheon, South Korea', ko: '인천광역시 연수구 송도미래로 41' },
    'footer.phone':        { en: 'Phone.', ko: '전화.' },
    'footer.fax':          { en: 'Fax.', ko: '팩스.' },
    'footer.copyright':    {
      en: '© Copyright 2018 - 2026 | Advanced Technology Inc. | All Rights Reserved | Powered by Sales Team',
      ko: '© Copyright 2018 - 2026 | Advanced Technology Inc. | 모든 권리 보유 | Powered by Sales Team'
    }
  };

  let currentLang = DEFAULT_LANG;
  let select;

  // 일반 텍스트를 안전하게 이스케이프 (\n → <br> 변환 시 XSS 방지)
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function init() {
    select = document.getElementById('lang-select');

    let saved = DEFAULT_LANG;
    try {
      saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) { /* localStorage 차단 환경 무시 */ }

    apply(saved);

    if (select) {
      select.value = currentLang;
      select.addEventListener('change', function () {
        apply(this.value);
      });
    }
  }

  function apply(lang) {
    if (lang !== 'ko' && lang !== 'en') lang = DEFAULT_LANG;
    currentLang = lang;

    // 일반 텍스트 (\n 이 있으면 줄바꿈 <br> 로 렌더링)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const entry = dict[el.getAttribute('data-i18n')];
      if (!entry || entry[lang] == null) return;
      const value = entry[lang];
      if (value.indexOf('\n') !== -1) {
        el.innerHTML = escapeHtml(value).replace(/\n/g, '<br>');
      } else {
        el.textContent = value;
      }
    });

    // 마크업 포함 텍스트 (\n 도 <br> 로 변환)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const entry = dict[el.getAttribute('data-i18n-html')];
      if (entry && entry[lang] != null) {
        el.innerHTML = entry[lang].replace(/\n/g, '<br>');
      }
    });

    // 문서 언어 속성 갱신 (접근성/SEO)
    document.documentElement.setAttribute('lang', lang === 'ko' ? 'ko' : 'en');

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* 무시 */ }
  }

  return { init, apply };
})();
