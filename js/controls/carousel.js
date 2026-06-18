/**
 * Product Carousel Control
 * 제품 이미지 회전 캐러셀 (원형 인디케이터 포함)
 */
const ProductCarousel = (function () {
  // 카테고리별로 설비 목록이 다르므로 각각 독립된 리스트로 관리한다.
  const catalog = {
    wafer: [
      { code: 'C1', name: 'Wafer Macro Inspection System', img: 'assets/images/product-c1.png' },
      { code: 'C2', name: 'Wafer Edge Inspection System', img: 'assets/images/product-c1.png' },
    ],
    reticle: [
      { code: 'R1', name: 'Reticle Inspection System', img: 'assets/images/product-c1.png' },
      { code: 'R2', name: 'Reticle Defect Review', img: 'assets/images/product-c1.png' },
    ],
    pcb: [
      { code: 'P1', name: 'PCB Optical Inspection', img: 'assets/images/product-c1.png' },
      { code: 'P2', name: 'PCB Metrology System', img: 'assets/images/product-c1.png' },
    ],
  };

  const watermarkMap = {
    wafer: 'Wafer System',
    reticle: 'Reticle System',
    pcb: 'PCB System',
  };

  let currentCategory = 'wafer';
  let products = catalog[currentCategory];
  let currentIndex = 0;
  let isAnimating = false;

  let arcEl, arcPathEl, arcDotEl, arcHaloEl, imageEl, infoEl, currentEl, totalEl, watermarkEl, watermarkTextEls, stageEl;

  // 원형 진행 인디케이터 지오메트리 (SVG viewBox 기준)
  const ARC_CX = 226, ARC_CY = 226, ARC_R = 223;
  let arcFraction = 0;
  let arcAnimId = null;
  let arcSnapId = null;

  function arcPolar(angleDeg) {
    const a = (angleDeg - 90) * Math.PI / 180; // 12시 방향(위)에서 시계방향
    return { x: ARC_CX + ARC_R * Math.cos(a), y: ARC_CY + ARC_R * Math.sin(a) };
  }

  function buildArcPath(frac) {
    frac = Math.max(0, Math.min(1, frac));
    if (frac <= 0.0001) return '';
    const s = arcPolar(0);
    if (frac >= 0.9999) {
      const m = arcPolar(180);
      return `M ${s.x} ${s.y} A ${ARC_R} ${ARC_R} 0 1 1 ${m.x} ${m.y} A ${ARC_R} ${ARC_R} 0 1 1 ${s.x} ${s.y}`;
    }
    const sweep = frac * 360;
    const e = arcPolar(sweep);
    const largeArc = sweep > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${ARC_R} ${ARC_R} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  function drawArc(frac) {
    if (!arcPathEl) return;
    arcPathEl.setAttribute('d', buildArcPath(frac));
    const end = arcPolar(frac * 360);
    arcDotEl.setAttribute('cx', end.x);
    arcDotEl.setAttribute('cy', end.y);
    arcHaloEl.setAttribute('cx', end.x);
    arcHaloEl.setAttribute('cy', end.y);
  }

  function animateArcTo(target) {
    if (arcAnimId) cancelAnimationFrame(arcAnimId);
    if (arcSnapId) clearTimeout(arcSnapId);
    const start = arcFraction;
    const dur = 550;
    const t0 = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - t0) / dur);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
      arcFraction = start + (target - start) * ease;
      drawArc(arcFraction);
      if (t < 1) {
        arcAnimId = requestAnimationFrame(frame);
      } else {
        arcFraction = target;
        drawArc(arcFraction);
      }
    }
    arcAnimId = requestAnimationFrame(frame);
    // requestAnimationFrame이 멈춰도 최종 상태는 반드시 반영
    arcSnapId = setTimeout(() => {
      arcFraction = target;
      drawArc(target);
    }, dur + 80);
  }

  function init() {
    arcEl = document.getElementById('carousel-arc');
    arcPathEl = document.getElementById('carousel-arc-path');
    arcDotEl = document.getElementById('carousel-arc-dot');
    arcHaloEl = document.getElementById('carousel-arc-halo');
    imageEl = document.getElementById('carousel-image');
    infoEl = document.getElementById('carousel-info');
    currentEl = document.getElementById('carousel-current');
    totalEl = document.getElementById('carousel-total');
    watermarkEl = document.getElementById('product-watermark');
    watermarkTextEls = watermarkEl ? watermarkEl.querySelectorAll('.products-interactive__watermark-text') : [];
    stageEl = document.querySelector('.carousel__stage');

    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!arcEl || !imageEl || !infoEl) return;

    totalEl.textContent = products.length;
    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));

    initCategoryButtons();
    render();
  }

  function initCategoryButtons() {
    const buttons = document.querySelectorAll('#product-categories .category-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', function () {
        buttons.forEach(b => b.classList.remove('category-btn--active'));
        this.classList.add('category-btn--active');

        selectCategory(this.dataset.category);
      });
    });
  }

  function selectCategory(category) {
    if (!catalog[category] || category === currentCategory) return;

    // 카테고리가 바뀌면 해당 설비 목록으로 교체하고 항상 1번부터 시작
    currentCategory = category;
    products = catalog[category];
    currentIndex = 0;
    totalEl.textContent = products.length;

    updateWatermark(category);
    animateTransition(1);
  }

  function updateWatermark(category) {
    const newText = watermarkMap[category];
    if (!newText || !watermarkTextEls || !watermarkTextEls.length) return;
    if (watermarkTextEls[0].textContent === newText) return;

    // 세로 마퀴는 계속 흐르고, 카테고리 변경 시 살짝 페이드되며 텍스트 교체
    watermarkEl.classList.add('is-swapping');
    setTimeout(() => {
      watermarkTextEls.forEach(el => { el.textContent = newText; });
      watermarkEl.classList.remove('is-swapping');
    }, 200);
  }

  function go(direction) {
    if (isAnimating) return;
    currentIndex = (currentIndex + direction + products.length) % products.length;
    animateTransition(direction);
  }

  function animateTransition(direction) {
    isAnimating = true;
    const img = imageEl.querySelector('img');
    const slideOutClass = direction > 0 ? 'slide-out-left' : 'slide-out-right';
    const slideInClass = direction > 0 ? 'slide-in-right' : 'slide-in-left';

    infoEl.classList.add('transitioning');
    img.classList.add(slideOutClass);

    // 원형 스테이지에 살짝 반응하는 펄스
    if (stageEl) {
      stageEl.classList.remove('is-pulsing');
      void stageEl.offsetWidth;
      stageEl.classList.add('is-pulsing');
    }

    setTimeout(() => {
      render();
      img.classList.remove(slideOutClass);
      img.classList.add(slideInClass);

      // 다음 페인트 후 슬라이드 인 (rAF가 멈춰도 멈추지 않도록 setTimeout 사용)
      setTimeout(() => {
        img.classList.remove(slideInClass);
        infoEl.classList.remove('transitioning');
        isAnimating = false;
      }, 30);
    }, 300);
  }

  function render() {
    const product = products[currentIndex];

    // 진행률 = 현재 번호 / 카테고리 설비 수 (카운터 "n/N"과 동일하게 원이 채워짐)
    animateArcTo((currentIndex + 1) / products.length);
    currentEl.textContent = currentIndex + 1;

    const img = imageEl.querySelector('img');
    img.src = product.img;
    img.alt = product.name;

    infoEl.querySelector('.carousel__product-code').textContent = product.code;
    infoEl.querySelector('.carousel__product-name').textContent = product.name;
  }

  return { init };
})();
