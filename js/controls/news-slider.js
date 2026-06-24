/**
 * News Slider Control
 * 뉴스 카드 슬라이더 (드래그 및 버튼 탐색 지원)
 */
const NewsSlider = (function () {
  const newsItems = [
    { tag: 'Notice', title: '제 30기 정기주주총회 개최', body: '제 30기 정기주주총회를 개최 합니다. 자세한 내용은 아래 링크 참고 하시기 바랍니다. 링크 : 정기주주총회 소집공고문', date: '3월 12th, 2026' },
    { tag: 'Notice', title: '제 30기 정기주주총회 개최', body: '제 30기 정기주주총회를 개최 합니다. 자세한 내용은 아래 링크 참고 하시기 바랍니다. 링크 : 정기주주총회 소집공고문', date: '3월 13th, 2026' },
    { tag: 'Notice', title: '제 30기 정기주주총회 개최', body: '제 30기 정기주주총회를 개최 합니다. 자세한 내용은 아래 링크 참고 하시기 바랍니다. 링크 : 정기주주총회 소집공고문', date: '3월 14th, 2026' },
    { tag: 'Event', title: 'SEMICON Korea 2026 참가', body: 'ATI가 SEMICON Korea 2026에 참가합니다. 부스를 방문하시어 최신 검사 솔루션을 확인해 보세요.', date: '3월 15th, 2026' },
    { tag: 'Notice', title: '제 30기 정기주주총회 개최', body: '제 30기 정기주주총회를 개최 합니다. 자세한 내용은 아래 링크 참고 하시기 바랍니다. 링크 : 정기주주총회 소집공고문', date: '3월 16th, 2026' },
    { tag: 'Event', title: 'AI 기반 검사 기술 세미나', body: 'AI 기반의 차세대 반도체 검사 기술에 대한 세미나를 개최합니다. 많은 참여 부탁드립니다.', date: '3월 17th, 2026' },
    { tag: 'Notice', title: '제 30기 정기주주총회 개최', body: '제 30기 정기주주총회를 개최 합니다. 자세한 내용은 아래 링크 참고 하시기 바랍니다. 링크 : 정기주주총회 소집공고문', date: '3월 18th, 2026' },
    { tag: 'Notice', title: '제 30기 정기주주총회 개최', body: '제 30기 정기주주총회를 개최 합니다. 자세한 내용은 아래 링크 참고 하시기 바랍니다. 링크 : 정기주주총회 소집공고문', date: '3월 19th, 2026' },
  ];

  let track;
  let scrollbar;
  let thumb;
  let currentSlide = 0;
  let cardWidth = 371.755;
  let maxSlide;

  let isDragging = false;
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
    return `
      <div class="news-card-reveal">
        <article class="news-card">
          <span class="news-card__tag">${item.tag}</span>
          <div class="news-card__body">
            <h3 class="news-card__title">${item.title}</h3>
            <p class="news-card__desc">${item.body}</p>
          </div>
          <div class="news-card__footer">
            <span class="news-card__date">${item.date}</span>
            <a href="#" class="news-card__link" data-modal="news">View</a>
          </div>
        </article>
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
    track.addEventListener('mousemove', dragMove);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('mouseleave', dragEnd);

    track.addEventListener('touchstart', dragStart, { passive: true });
    track.addEventListener('touchmove', dragMove, { passive: true });
    track.addEventListener('touchend', dragEnd);

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

  function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    track.style.transition = 'none';
    track.style.cursor = 'grabbing';
  }

  function dragMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
    track.style.transform = `translateX(${currentTranslate}px)`;
    updateScrollbar();
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = '';

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
