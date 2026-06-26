/**
 * News Slider Control
 * 뉴스 카드 슬라이더 (드래그 및 버튼 탐색 지원)
 */
const NewsSlider = (function () {
  // 뉴스 데이터는 news.html 목록과 통일한다.
  const newsItems = [
    { tag: '공지', title: '제 30기 정기주주총회 개최', body: '제 30기 정기주주총회를 개최합니다. 자세한 내용은 소집공고문을 참고해 주시기 바랍니다.', date: '2026-04-06' },
    { tag: '공지', title: 'ATI, SEMICON Korea 2026 참가 안내', body: 'ATI가 SEMICON Korea 2026에 참가합니다. 부스를 방문하시어 최신 검사 솔루션을 확인해 보세요.', date: '2026-03-18' },
    { tag: '보도', title: 'AI 기반 결함 검사 시스템 신규 출시', body: '딥러닝 기반 자동 결함 분류(ADC) 검사 시스템을 새롭게 출시했습니다.', date: '2026-02-27' },
    { tag: '공지', title: '2026년 신년사 및 경영방침 발표', body: '2026년 새해 경영방침과 비전을 임직원 및 고객 여러분께 공유드립니다.', date: '2026-01-15' },
    { tag: '채용', title: '2025 하반기 신입·경력 채용 공고', body: '함께 성장할 신입 및 경력 인재를 모집합니다. 많은 지원 바랍니다.', date: '2025-12-10' },
    { tag: '보도', title: 'ATI 인도 법인(ATI India) 설립', body: '글로벌 시장 확대를 위해 인도 법인을 신규 설립했습니다.', date: '2025-11-22' },
    { tag: '공지', title: '본사 이전 안내 (인천 송도)', body: '본사를 인천 송도로 이전하였습니다. 방문 시 참고 부탁드립니다.', date: '2025-10-08' },
    { tag: '보도', title: '글로벌 고객사 신규 장비 공급 계약 체결', body: '글로벌 반도체 고객사와 신규 검사 장비 공급 계약을 체결했습니다.', date: '2025-09-30' },
  ];

  let track;
  let scrollbar;
  let thumb;
  let currentSlide = 0;
  let cardWidth = 371.755;
  let maxSlide;

  let isDragging = false;
  let hasDragged = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  let thumbDragging = false;
  let thumbStartX = 0;
  let thumbStartTranslate = 0;

  function init() {
    track = document.getElementById('news-track');
    scrollbar = document.getElementById('news-scrollbar');
    thumb = document.getElementById('news-scrollbar-thumb');

    if (!track) return;

    renderCards();
    calculateDimensions();
    bindEvents();
    updateScrollbar();
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function renderCards() {
    track.innerHTML = newsItems.map(item => createCardHTML(item)).join('');
  }

  function createCardHTML(item) {
    // .news-card-reveal(등장 애니메이션 담당) > .news-card(hover 애니메이션 담당)
    // 두 레이어로 분리해 reveal transform 과 hover transform 이 충돌하지 않게 한다.
    // 카드 전체를 클릭하면 해당 뉴스(상세 페이지)로 이동한다.
    return `
      <div class="news-card-reveal">
        <a class="news-card" href="news-article.html">
          <span class="news-card__tag">${item.tag}</span>
          <div class="news-card__body">
            <h3 class="news-card__title">${item.title}</h3>
            <p class="news-card__desc">${item.body}</p>
          </div>
          <div class="news-card__footer">
            <span class="news-card__date">${item.date}</span>
            <span class="news-card__link">View</span>
          </div>
        </a>
      </div>
    `;
  }

  function calculateDimensions() {
    const cards = track.querySelectorAll('.news-card');
    if (cards.length > 0) {
      const cardRect = cards[0].getBoundingClientRect();
      cardWidth = cardRect.width + 20;
    }
    const visibleCards = Math.floor(track.parentElement.clientWidth / cardWidth);
    maxSlide = Math.max(0, newsItems.length - visibleCards);
  }

  function bindEvents() {
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('touchstart', dragStart, { passive: true });

    // mousemove/mouseup을 window에 바인딩하여 빠른 드래그 시 트랙 밖으로 벗어나도 추적 유지
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('touchmove', dragMove, { passive: true });
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);

    // 드래그 후 <a> 클릭 이벤트를 가로채어 불필요한 페이지 이동 방지
    track.addEventListener('click', preventClickAfterDrag, true);

    if (thumb) {
      thumb.addEventListener('mousedown', thumbDragStart);
      thumb.addEventListener('touchstart', thumbDragStart, { passive: true });
    }
    window.addEventListener('mousemove', thumbDragMove);
    window.addEventListener('touchmove', thumbDragMove, { passive: true });
    window.addEventListener('mouseup', thumbDragEnd);
    window.addEventListener('touchend', thumbDragEnd);

    window.addEventListener('resize', () => {
      calculateDimensions();
      updatePosition(false);
      updateScrollbar();
    });
  }

  /** 드래그 직후 발생하는 click 이벤트를 캡처 단계에서 차단 */
  function preventClickAfterDrag(e) {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged = false;
    }
  }

  function getScrollRange() {
    return maxSlide * cardWidth;
  }

  function updateScrollbar() {
    if (!scrollbar || !thumb) return;
    const trackW = scrollbar.clientWidth;
    const visibleWidth = track.parentElement.clientWidth;
    const totalWidth = cardWidth * newsItems.length;
    const ratio = Math.min(1, visibleWidth / totalWidth);
    const thumbW = Math.max(40, trackW * ratio);
    thumb.style.width = thumbW + 'px';

    const scrollRange = getScrollRange();
    const progress = scrollRange > 0 ? clamp(-currentTranslate / scrollRange, 0, 1) : 0;
    const maxX = trackW - thumbW;
    thumb.style.transform = `translate(${progress * maxX}px, -50%)`;
  }

  function thumbDragStart(e) {
    thumbDragging = true;
    thumbStartX = getPositionX(e);
    thumbStartTranslate = currentTranslate;
    track.style.transition = 'none';
    document.body.style.userSelect = 'none';
  }

  function thumbDragMove(e) {
    if (!thumbDragging) return;
    const dx = getPositionX(e) - thumbStartX;
    const trackW = scrollbar.clientWidth;
    const maxX = trackW - thumb.offsetWidth;
    const scrollRange = getScrollRange();
    const deltaProgress = maxX > 0 ? dx / maxX : 0;
    const newTranslate = clamp(thumbStartTranslate - deltaProgress * scrollRange, -scrollRange, 0);
    currentTranslate = newTranslate;
    prevTranslate = newTranslate;
    track.style.transform = `translateX(${newTranslate}px)`;
    updateScrollbar();
  }

  function thumbDragEnd() {
    if (!thumbDragging) return;
    thumbDragging = false;
    document.body.style.userSelect = '';
    const scrollRange = getScrollRange();
    const progress = scrollRange > 0 ? -currentTranslate / scrollRange : 0;
    currentSlide = Math.round(progress * maxSlide);
    updatePosition(true);
    updateScrollbar();
  }

  function slide(direction) {
    currentSlide = Math.max(0, Math.min(maxSlide, currentSlide + direction));
    updatePosition(true);
  }

  function updatePosition(animate) {
    const translateX = -currentSlide * cardWidth;
    currentTranslate = translateX;
    prevTranslate = translateX;
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(${translateX}px)`;
    updateScrollbar();
  }

  const DRAG_THRESHOLD = 5;

  function dragStart(e) {
    // 마우스 이벤트에서 브라우저 기본 링크 드래그(고스트 이미지) 방지
    if (e.type === 'mousedown') e.preventDefault();
    isDragging = true;
    hasDragged = false;
    startX = getPositionX(e);
    track.style.transition = 'none';
    track.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }

  function dragMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const diff = currentX - startX;
    if (Math.abs(diff) > DRAG_THRESHOLD) hasDragged = true;
    currentTranslate = prevTranslate + diff;
    track.style.transform = `translateX(${currentTranslate}px)`;
    updateScrollbar();
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = '';
    document.body.style.userSelect = '';

    const movedBy = currentTranslate - prevTranslate;
    if (Math.abs(movedBy) > cardWidth * 0.3) {
      if (movedBy < 0) {
        currentSlide = Math.min(maxSlide, currentSlide + 1);
      } else {
        currentSlide = Math.max(0, currentSlide - 1);
      }
    }
    updatePosition(true);
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  return { init };
})();
