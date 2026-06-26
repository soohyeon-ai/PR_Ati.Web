/**
 * FAQ Control
 * 아코디언 토글 + 카테고리 필터링
 */
const FaqControl = (function () {
  function init() {
    bindFilter();
    bindAccordion();
  }

  /** 카테고리 필터 버튼 */
  function bindFilter() {
    var btns = document.querySelectorAll('.faq-filter__btn');
    if (!btns.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        var cat = btn.getAttribute('data-category');
        filterItems(cat);
      });
    });
  }

  function filterItems(category) {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      if (category === 'all') {
        item.classList.remove('is-hidden');
      } else {
        var cats = (item.getAttribute('data-category') || '').split(/\s+/);
        if (cats.indexOf(category) !== -1) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
          closeItem(item);
        }
      }
    });
  }

  /** 아코디언 토글 */
  function bindAccordion() {
    var headers = document.querySelectorAll('.faq-item__header');
    headers.forEach(function (header) {
      header.addEventListener('click', function () {
        var item = header.closest('.faq-item');
        if (!item) return;

        if (item.classList.contains('is-open')) {
          closeItem(item);
        } else {
          openItem(item);
        }
      });
    });
  }

  function openItem(item) {
    var answer = item.querySelector('.faq-item__answer');
    var btn = item.querySelector('.faq-item__header');
    if (!answer) return;

    item.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }

  function closeItem(item) {
    var answer = item.querySelector('.faq-item__answer');
    var btn = item.querySelector('.faq-item__header');
    if (!answer) return;

    item.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    answer.style.maxHeight = '0';
  }

  return { init: init };
})();
