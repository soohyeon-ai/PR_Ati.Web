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

    // ===== Mega menu (전용 항목) =====
    'mega.aiTech':    { en: 'AI Technology', ko: 'AI 기술' },
    'mega.customSol': { en: 'Custom Solutions', ko: '맞춤형 솔루션' },
    'mega.services':  { en: 'Services', ko: '서비스' },
    'mega.news':      { en: 'News', ko: '뉴스' },

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
    'footer.col.solutions': { en: 'Solution & Services', ko: '솔루션 및 서비스' },
    'footer.col.news':      { en: 'News & Events', ko: '뉴스 및 이벤트' },

    'footer.aboutAti': { en: 'About ATI', ko: '회사 소개' },
    'footer.history':  { en: 'History', ko: '연혁' },
    'footer.esg':      { en: 'ESG', ko: 'ESG' },
    'footer.semiApp':  { en: 'Semiconductor Applications', ko: '반도체 응용분야' },
    'footer.wafer':    { en: 'Wafer', ko: '웨이퍼' },
    'footer.reticle':  { en: 'Reticle', ko: '레티클' },
    'footer.package':  { en: 'Package', ko: '패키지' },
    'footer.pcbApp':   { en: 'PCB Applications', ko: 'PCB 응용분야' },
    'footer.contactUs':{ en: 'Contact Us', ko: '문의하기' },

    'footer.address':      { en: 'Address', ko: '주소' },
    'footer.addressValue': { en: '41, Songdo Mirae-ro, Yeonsu-gu, Incheon, South Korea', ko: '인천광역시 연수구 송도미래로 41' },
    'footer.phone':        { en: 'Phone.', ko: '전화.' },
    'footer.fax':          { en: 'Fax.', ko: '팩스.' },
    'footer.copyright':    {
      en: '© Copyright 2018 - 2026 | Advanced Technology Inc. | All Rights Reserved | Powered by Sales Team',
      ko: '© Copyright 2018 - 2026 | Advanced Technology Inc. | 모든 권리 보유 | Powered by Sales Team'
    },

    // ===== About 페이지 =====
    'about.tab.about': { en: 'About ATI', ko: '회사 소개' },
    'about.tab.history': { en: 'History', ko: '연혁' },
    'about.tab.esg': { en: 'ESG', ko: 'ESG' },

    'about.hero.subtitle': { en: 'The leading company for revolutionary vision machines', ko: '혁신적인 비전 검사 장비를 선도하는 기업' },
    'about.hero.intro': {
      en: 'Established in 1996 in Incheon, South Korea, Advanced Technology Inc. (ATI) has spent three decades at the forefront of precision engineering.',
      ko: '1996년 대한민국 인천에서 설립된 Advanced Technology Inc.(ATI)는 지난 30년간 정밀 엔지니어링 분야의 선도적인 위치에서 기술 혁신을 이어왔습니다. '
    },
    'about.hero.scroll': { en: 'Scroll Down', ko: '스크롤 다운' },

    'about.overview.title': { en: 'Company\nOverview', ko: '회사 개요' },
    'about.overview.subtitle': { en: 'Introducing ATI', ko: '에이티아이를 소개합니다' },
    'about.overview.para1': {
      en: 'Established in 1996 in Incheon, South Korea, Advanced Technology Inc. (ATI) has spent three decades at the forefront of precision engineering. While our journey began with pioneering PCB inspection, we have evolved into a <span class="ov-hl">specialized powerhouse in the semiconductor industry</span>, delivering world-class inspection systems for wafers and reticles, alongside high-speed laser marking and biotech automation solutions.',
      ko: '1996년 대한민국 인천에서 설립된 Advanced Technology Inc.(ATI)는 지난 30년간 정밀 엔지니어링 분야의 선도적인 위치에서 기술 혁신을 이어왔습니다. ATI의 여정은 PCB 검사 기술을 개척하는 것에서 시작되었지만, 현재는 <span class="ov-hl">반도체 산업에 특화된 전문 기업</span>으로 \n성장하여 웨이퍼 및 레티클을 위한 세계적 수준의 검사 시스템과 고속 레이저 마킹, \n바이오테크 자동화 솔루션을 제공하고 있습니다. '
    },
    'about.overview.desc': {
      en: "ATI provides comprehensive process solutions across the semiconductor and PCB value chain, specializing in inspection, metrology, and automation. Our in-house development of core technologies—optics, software & AI, automation, inspection, and metrology—ensures unmatched accuracy and seamless integration into the world's most advanced production lines. We serve customers globally with a strong presence in the United States, Japan, China, Vietnam, Taiwan, Singapore, Malaysia, and India.",
      ko: 'ATI는 반도체와 PCB 밸류체인 전반에 걸쳐 검사, 계측, 자동화를 아우르는 종합 공정 솔루션을 제공합니다. 광학, 소프트웨어 & AI, 자동화, 검사, 계측 등 핵심 기술을 자체 개발하여 뛰어난 정확도와 세계 최고 수준 생산 라인과의 완벽한 통합을 보장합니다. 미국, 일본, 중국, 베트남, 대만, 싱가포르, 말레이시아, 인도 등 전 세계 고객에게 서비스를 제공합니다.'
    },

    'about.cap.eyebrow': { en: 'Our Capabilities', ko: 'Our Capabilities' },
    'about.cap.title': { en: 'Integrated capabilities for precision\nsemiconductor & PCB solutions', ko: '반도체·PCB 정밀 솔루션을 위한 통합 역량' },
    'about.cap.desc': {
      en: "ATI's integrated capabilities span the semiconductor and PCB value chain, from wafer and reticle inspection to advanced package and PCB solutions, supported by a global service network.",
      ko: 'ATI의 통합 역량은 웨이퍼·레티클 검사부터 어드밴스드 패키지 및 PCB 솔루션까지 \n반도체와 PCB 밸류체인 전반을 아우르며, 글로벌 서비스 네트워크가 이를 뒷받침합니다.'
    },
    'about.cap.pill1': { en: 'Wafer inspection and\nmeasurement systems', ko: '웨이퍼 검사 및\n계측 시스템' },
    'about.cap.pill2': { en: 'Reticle (mask) inspection\nand metrology', ko: '레티클(마스크) 검사\n및 계측' },
    'about.cap.pill3': { en: 'Package inspection\nand sorting', ko: '패키지 검사\n및 분류' },
    'about.cap.pill4': { en: 'Biotech lab automation', ko: '바이오텍 랩 자동화' },
    'about.cap.pill5': { en: 'PCB inspection\nand laser marking', ko: 'PCB 검사\n및 레이저 마킹' },

    'about.mv.eyebrow': { en: 'Mission and Vision', ko: 'Mission and Vision' },
    'about.mv.title': { en: 'Building the future with\nprecision technology', ko: '정밀 기술로 만들어가는 미래' },
    'about.mv.desc1': {
      en: "Our foundation is built upon five pillars of excellence — <span class=\"accent\">Optics, Software & AI, Automation, Inspection, and Metrology</span> — which allow us to maintain a decisive technical advantage in the global market. Unlike others, ATI develops all core technologies in-house. This complete control over our hardware and AI-driven software ensures that our semiconductor solutions offer unmatched accuracy and seamless integration into the world's most advanced production lines.",
      ko: 'ATI의 기술력은\n <span class="accent">광학, 소프트웨어 & AI, 자동화, 검사, 계측</span>이라는 다섯 가지 핵심 역량을 바탕으로 글로벌 시장에서 차별화된 기술 경쟁력을 입증하고 있습니다. \n 또한 ATI는 다른 기업과 달리 모든 핵심 기술을 자체 개발 하고 있습니다. \n광학부터 하드웨어, AI 기반 소프트웨어까지 기술 전반을 직접 설계하고 통제하기 때문에, 고객의 생산 환경에 최적화된 고정밀 솔루션을 구현할 수 있습니다. \n그 결과 ATI의 반도체 솔루션은 비교 불가능한 정확도와 세계 최고 수준 생산 라인에 완벽히 통합되는 안정성을 제공합니다.'
    },
    'about.mv.desc2': {
      en: "We understand that the semiconductor landscape demands both extreme precision and adaptability. ATI distinguishes itself through a commitment to customization, engineering flexible systems tailored to the specific technical requirements of our partners. Supported by a robust global network, we provide rapid technical service across the United States, Japan, China, Vietnam, Taiwan, Singapore, Malaysia, and India. At ATI, we don't just supply equipment; we provide the technological foundation for the next generation of semiconductor innovation.",
      ko: '반도체 산업은 극도의 정밀함과 유연성을 동시에 요구합니다. \nATI는 이러한 요구에 대응하기 위해 고객의 특정 기술 조건과 생산 환경에 최적화된 맞춤형 시스템을 설계합니다. 높은 수준의 커스터마이징 역량을 바탕으로 각 파트너가 필요로 하는 성능과 공정 조건에 유연하게 대응하며, 차별화된 반도체 솔루션을 제공합니다. 또한 ATI는 견고한 글로벌 네트워크를 기반으로 미국, 일본, 중국, 베트남, 대만, 싱가포르, 말레이시아, 인도 전역에 신속하고 안정적인 기술 서비스를 지원합니다. \n단순한 장비 공급을 넘어, 차세대 반도체 혁신을 실현하기 위한 \n기술적 토대를 제공하고 있습니다.'
    },
    'about.pillar.optics': { en: 'Optics', ko: '광학 기술' },
    'about.pillar.software': { en: 'Software & AI', ko: '소프트웨어 & AI' },
    'about.pillar.automation': { en: 'Automation', ko: '자동화' },
    'about.pillar.inspection': { en: 'Inspection', ko: '검사 기술' },
    'about.pillar.metrology': { en: 'Metrology', ko: '계측 기술' },
    'about.pillar.optics.desc': {
      en: 'With in-house optical design expertise, ATI builds inspection environments optimized for semiconductor and PCB processes.',
      ko: 'ATI는 자체 광학 설계 역량을 바탕으로\n반도체 및 PCB 공정에 최적화된\n검사 환경을 구현합니다.'
    },
    'about.pillar.software.desc': {
      en: 'AI-driven image analysis and in-house software raise inspection accuracy and throughput at the same time.',
      ko: 'AI 기반 영상 분석과 \n자체 개발 소프트웨어로 검사 정확도와 처리 속도를 동시에 끌어올립니다.'
    },
    'about.pillar.automation.desc': {
      en: 'End-to-end automation of inspection and metrology minimizes manual intervention and ensures consistent quality.',
      ko: '검사·계측 전 공정을 자동화하여\n 사람의 개입을 최소화하고 일관된 품질을 보장합니다.'
    },
    'about.pillar.inspection.desc': {
      en: 'High-resolution inspection precisely detects micro-defects across everything from wafers to packages.',
      ko: '웨이퍼부터 패키지까지 미세 결함을\n 정밀하게 검출하는 고해상도 검사 기술을 제공합니다.'
    },
    'about.pillar.metrology.desc': {
      en: 'Nanometer-scale precision metrology controls process variation and supports yield improvement.',
      ko: '나노 단위의 정밀 계측으로 공정 편차를 제어하고 수율 향상을 지원합니다.'
    },

    'about.values.title': { en: 'Our Values', ko: '핵심 가치' },
    'about.values.body': {
      en: '<strong>Try, Think, Fight, Fun</strong>these four principles guide how we work. We encourage bold attempts, deep thinking, persistent effort, and a culture where innovation is enjoyable. This mindset has driven over 2,000 installations worldwide and continues to shape our product development and customer partnerships.',
      ko: '<strong>Try, Think, Fight, Fun</strong>이 네 가지 원칙이 우리가 일하는 방식을 이끕니다. 우리는 과감한 도전, 깊이 있는 사고, 끈질긴 노력, 그리고 혁신이 즐거운 문화를 지향합니다. 이러한 마인드셋은 전 세계 2,000건 이상의 설치 실적을 이끌었으며, 제품 개발과 고객 파트너십을 지속적으로 발전시켜 나가고 있습니다.'
    },

    'about.vision.title': { en: 'Vision', ko: 'ATI의 미래 비전' },
    'about.vision.eyebrow': { en: 'Vision', ko: 'Vision' },
    'about.vision.heading': { en: 'Building trust through technology, ATI', ko: '기술로 신뢰를 만드는 ATI' },
    'about.vision.p1': {
      en: 'We aim to be the trusted partner for precision inspection and metrology across the semiconductor and PCB industries. By combining in-house optics, AI-powered software, automation, inspection, and metrology, we deliver solutions that meet the most demanding technical requirements and help our customers achieve higher yield and faster time-to-market.',
      ko: 'ATI는 반도체와 PCB 산업 전반에 걸쳐 정밀 검사·계측 분야의 신뢰받는 파트너가 되고자 합니다. \n 자체 광학, AI 기반 소프트웨어, 자동화, 검사, 계측을 결합하여 가장 까다로운 기술 요구를 충족하는 솔루션을 제공하고, \n고객이 더 높은 수율과 더 빠른 출시 시간을 달성하도록 돕습니다.'
    },
    'about.vision.p2': {
      en: 'Our core technology pillars—Optic, Automation, Inspection, Metrology, and Software & AI—form an integrated system that delivers precision and reliability across every solution we offer.',
      ko: '광학, 자동화, 검사, 계측, 소프트웨어 & AI라는 핵심 기술 축이 하나의 통합 시스템을 이루어, \n 우리가 제공하는 모든 솔루션에 정밀함과 신뢰성을 더합니다.'
    },

    'about.history.title': { en: 'History', ko: '연혁' },
    'about.history.subtitle': { en: 'For nearly 30 years, ATI has grown alongside the semiconductor and PCB industries through a relentless dedication to precision technology.', ko: '지난 30년 가까운 시간, ATI는 정밀 기술에 대한 집념과 \n끊임없는 도전으로 반도체 및 PCB 산업의 변화와 함께 \n성장해왔습니다.' },
    'about.history.y1996': { en: 'ATI Founded · First PCB inspection equipment launched', ko: 'ATI 설립 · 첫 PCB 검사 장비 출시' },
    'about.history.y1998': { en: 'Selected as an export-promising SME · Venture company registration', ko: '수출유망 중소기업 선정 · 벤처기업 등록' },
    'about.history.y1999': { en: 'Corporate research institute established', ko: '기업부설연구소 설립' },
    'about.history.y2005': { en: 'Developed PCB inspection (AVIS-1800 series)', ko: 'PCB 검사 장비 개발 (AVIS-1800 시리즈)' },
    'about.history.y2006': { en: 'Developed semiconductor inspection (WIS-1000) · Selected as INNO-BIZ (technology innovation SME)', ko: '반도체 검사 장비 개발 (WIS-1000) · INNO-BIZ(기술혁신형 중소기업) 선정' },
    'about.history.y2007': { en: 'Developed LED inspection (AVIS-5000) · Acquired ISO 9001/14001 certification', ko: 'LED 검사 장비 개발 (AVIS-5000) · ISO 9001/14001 인증 취득' },
    'about.history.y2008': { en: 'Exhibited at JPCA 2008 and COPHEX 2008 · Started industry-academia joint research with Inha University · Selected as Incheon Star Company', ko: 'JPCA 2008 및 COPHEX 2008 전시 · 인하대학교와 산학공동연구 시작 · 인천 스타기업 선정' },
    'about.history.y2009': { en: 'Incheon Science and Technology Grand Prize · Acquired NET (New Excellent Technology) certification', ko: '인천 과학기술대상 수상 · NET(신기술) 인증 취득' },
    'about.history.y2010': { en: 'Developed BIO LAB AUTOMATION · IR52 Jang Young-sil Award · Developed WIND', ko: 'BIO LAB AUTOMATION 개발 · IR52 장영실상 수상 · WIND 개발' },
    'about.history.y2011': { en: 'Selected as a "Good Company to Work For" by the Ministry of Knowledge Economy', ko: "지식경제부 '일하기 좋은 기업' 선정" },
    'about.history.y2012': { en: 'Developed reticle inspection (SUN)', ko: '레티클 검사 장비 개발 (SUN)' },
    'about.history.y2013': { en: 'Established ATI America, ATI China, ATI Japan, ATI Vietnam · Developed PCB laser marking system (LMS series) · Presidential commendation for commercialization of new technology · Selected as Incheon City designated Vision Company', ko: 'ATI America·ATI China·ATI Japan·ATI Vietnam 설립 · PCB 레이저 마킹 시스템(LMS 시리즈) 개발 · 신기술 실용화 대통령 표창 · 인천시 지정 비전기업 선정' },
    'about.history.y2014': { en: '500 million dollar export tower award · Selected as leading company by SBC · Presidential commendation for venture contribution (CEO) 2015', ko: '5억 달러 수출의 탑 수상 · 중소기업진흥공단 선도기업 선정 · 벤처 기여 대통령 표창(CEO) 2015' },
    'about.history.y2015': { en: '10 million dollar export tower award', ko: '1천만 달러 수출의 탑 수상' },
    'about.history.y2016': { en: 'Merit award for industry-academia cooperation technology development (SMB Administration) · Established ATI Singapore, ATI Taiwan', ko: '산학협력 기술개발 공로상(중소기업청) · ATI Singapore·ATI Taiwan 설립' },
    'about.history.y2019': { en: 'Youth-friendly small but strong company · Selected as one of top 100 small but strong companies for materials, parts, and equipment · Korea Standards Association management system certification', ko: '청년친화강소기업 · 소재·부품·장비 강소기업 100 선정 · 한국표준협회 경영시스템 인증' },
    'about.history.y2020': { en: 'Citation for job creation and professional talent nurturing · Developed EUV reticle inspection (VEGA)', ko: '일자리 창출 및 전문인력 양성 표창 · EUV 레티클 검사 장비 개발 (VEGA)' },
    'about.history.y2021': { en: 'Developed wafer inspection (WIND2-F/B/P series) · Certified as national representative innovative company by Minister of SMEs and Startups · Developed reticle inspection (SUN2) · Developed reticle optical density measuring system (TRITON) · Developed PCB color inspection (PINE2-S)', ko: '웨이퍼 검사 장비 개발 (WIND2-F/B/P 시리즈) · 중소벤처기업부 국가대표 혁신기업 인증 · 레티클 검사 장비 개발 (SUN2) · 레티클 광학밀도 측정 시스템 개발 (TRITON) · PCB 컬러 검사 장비 개발 (PINE2-S)' },
    'about.history.y2022': { en: 'Selected as youth-friendly small but strong company by Ministry of Employment and Labor (excellent in wages, work-life balance, employment stability)', ko: '고용노동부 청년친화강소기업 선정(임금·일과 삶의 균형·고용 안정 우수)' },
    'about.history.y2023': { en: 'Developed FC-BGA inspection & sorting system (JEDI2) · Iron Tower Order of Industrial Service Merit (technology localization, regional economic revitalization) · Minister of Trade, Industry and Energy commendation for national quality innovation (product quality) 2024', ko: 'FC-BGA 검사 & 분류 시스템 개발 (JEDI2) · 산업포장(기술 국산화, 지역경제 활성화) · 산업통상자원부 국가품질혁신(제품 품질) 장관 표창 2024' },
    'about.history.y2024': { en: 'ATI India established', ko: 'ATI India 설립' },
    'about.history.y2025': { en: '—', ko: '—' },
    'about.history.ctaTitle': { en: '30 Years of Innovation', ko: '30년의 혁신' },
    'about.history.ctaDesc': {
      en: 'Celebrating 30 years of innovation since 1996, ATI (Advanced Technology Inc.) has evolved into a global leader in metrology and inspection solutions for the semiconductor and PCB industries. Driven by core principles of "Try, Think, Fight, and Fun," the company has achieved over 2,000 installations globally while advancing AI-driven technology for the future.',
      ko: '1996년 이후 30년의 혁신을 이어온 ATI(Advanced Technology Inc.)는 반도체·PCB 산업을 위한 계측·검사 솔루션의 글로벌 리더로 성장했습니다. "Try, Think, Fight, and Fun"이라는 핵심 가치를 바탕으로 전 세계 2,000건 이상의 설치 실적을 달성했으며, 미래를 위한 AI 기반 기술을 지속적으로 발전시키고 있습니다.'
    },
    'about.history.ctaLink': { en: 'More View', ko: '더 보기' },

    'about.esg.title': { en: 'Environmental, Social & Governance', ko: '환경·사회·지배구조 (ESG)' },
    'about.esg.intro': {
      en: 'ATI is committed to sustainable growth and responsible business practices. Our ESG framework guides how we operate, innovate, and contribute to our communities and the environment.',
      ko: 'ATI는 지속가능한 성장과 책임 있는 경영을 추구합니다. \nESG 프레임워크는 우리가 운영하고 혁신하며 지역사회와 환경에 기여하는 방식을 이끌어갑니다.'
    },
    'about.esg.isoTitle': { en: 'ISO Certifications', ko: 'ISO 인증' },
    'about.esg.isoDesc': { en: 'ATI maintains the following international management system certifications:', ko: 'ATI는 다음과 같은 국제 경영시스템 인증을 \n보유하고 있습니다.' },
    'about.esg.iso9001.sub': { en: '(Quality Management System)', ko: '(품질경영시스템)' },
    'about.esg.iso9001.desc': { en: 'Consistent quality in design, manufacturing, and service delivery.', ko: '설계, 제조, 서비스 전반의 일관된 품질을 보장합니다.' },
    'about.esg.iso14001.sub': { en: '(Environmental Management System)', ko: '(환경경영시스템)' },
    'about.esg.iso14001.desc': { en: 'Expiry: June 11, 2028. Supports environmental responsibility and compliance in our operations.', ko: '만료: 2028년 6월 11일. 운영 전반의 환경 책임과 규정 준수를 지원합니다.' },
    'about.esg.iso45001.sub': { en: '(Occupational Health & Safety Management System)', ko: '(안전보건경영시스템)' },
    'about.esg.iso45001.desc': { en: 'Expiry: June 5, 2026. Promotes safe working conditions and worker well-being.', ko: '만료: 2026년 6월 5일. 안전한 근로 환경과 근로자 복지를 증진합니다.' },
    'about.esg.iso13485.sub': { en: '(Medical Devices Quality Management)', ko: '(의료기기 품질경영)' },
    'about.esg.iso13485.desc': { en: 'Expiry: February 27, 2027. Applicable to relevant product and process controls.', ko: '만료: 2027년 2월 27일. 관련 제품 및 공정 관리에 적용됩니다.' },
    'about.esg.env.title': { en: 'Environmental', ko: '환경' },
    'about.esg.env.desc': { en: 'ATI minimizes environmental impact through responsible operations, energy efficiency, and full compliance with ISO 14001 standards across all of our facilities.', ko: 'ATI는 책임 있는 운영, 에너지 효율, 그리고 전 사업장에 걸친 ISO 14001 표준의 완전한 준수를 통해 환경 영향을 최소화합니다.' },
    'about.esg.social.title': { en: 'Social', ko: '사회' },
    'about.esg.social.desc': { en: 'We invest in our people and communities through fair labor practices, diversity and inclusion, and talent development. ATI has been recognized as a youth-friendly company and a good employer. We maintain safe working conditions and support local communities where we operate.', ko: '우리는 공정한 노동 관행, 다양성과 포용, 인재 육성을 통해 임직원과 지역사회에 투자합니다. ATI는 청년친화기업이자 우수 고용기업으로 인정받았으며, 안전한 근로 환경을 유지하고 사업장이 위치한 지역사회를 지원합니다.' },
    'about.esg.gov.title': { en: 'Governance', ko: '지배구조' },
    'about.esg.gov.desc': { en: 'Strong governance ensures transparency, accountability, and ethical conduct. Our board and management are committed to sound corporate governance, risk management, and stakeholder engagement. We adhere to applicable laws and regulations in all markets where we do business.', ko: '건전한 지배구조는 투명성, 책임성, 윤리적 행동을 보장합니다. 이사회와 경영진은 건전한 기업 지배구조, 리스크 관리, 이해관계자 소통에 헌신합니다. 우리는 사업을 영위하는 모든 시장에서 관련 법규를 준수합니다.' },
    'about.esg.gov.link': { en: '← History', ko: '← 연혁' }
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
