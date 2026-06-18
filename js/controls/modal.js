/**
 * Modal Control
 * 모달 열기/닫기 (뉴스 상세 등)
 */
const Modal = (function () {
  let modal, overlay, closeBtn, body;

  function init() {
    modal = document.getElementById('modal');
    overlay = document.getElementById('modal-overlay');
    closeBtn = document.getElementById('modal-close');
    body = document.getElementById('modal-body');

    if (!modal) return;

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    document.addEventListener('click', function (e) {
      const trigger = e.target.closest('[data-modal]');
      if (trigger) {
        e.preventDefault();
        const type = trigger.dataset.modal;
        openByType(type, trigger);
      }
    });
  }

  function openByType(type, trigger) {
    let content = '';

    switch (type) {
      case 'news':
        const card = trigger.closest('.news-card');
        if (card) {
          const title = card.querySelector('.news-card__title').textContent;
          const desc = card.querySelector('.news-card__desc').textContent;
          const date = card.querySelector('.news-card__date').textContent;
          content = `
            <h2 style="font-size:24px;font-weight:700;margin-bottom:16px;color:#090909;">${title}</h2>
            <p style="font-size:14px;color:#787878;margin-bottom:20px;">${date}</p>
            <p style="font-size:16px;line-height:1.6;color:#4d4d4d;">${desc}</p>
            <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5e5;">
              <p style="font-size:14px;color:#787878;">자세한 내용은 관련 링크를 참고해 주세요.</p>
            </div>
          `;
        }
        break;
      default:
        content = '<p>콘텐츠를 불러올 수 없습니다.</p>';
    }

    open(content);
  }

  function open(content) {
    body.innerHTML = content;
    modal.classList.add('modal--active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('modal--active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  return { init, open, close };
})();
