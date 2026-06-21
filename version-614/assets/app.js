(function () {
  var header = document.querySelector('.site-header');
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer;

    function show(next) {
      if (!slides.length) return;
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  });

  document.querySelectorAll('[data-filter-root]').forEach(function (root) {
    var section = root.parentElement;
    var grid = section ? section.querySelector('[data-card-grid]') : null;
    var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('[data-card]')) : [];
    var search = root.querySelector('[data-search-input]');
    var category = root.querySelector('[data-filter-category]');
    var sort = root.querySelector('[data-sort-select]');
    var empty = section ? section.querySelector('[data-empty-state]') : null;

    function valueOf(card, name) {
      return card.getAttribute(name) || '';
    }

    function apply() {
      var q = search ? search.value.trim().toLowerCase() : '';
      var cat = category ? category.value : 'all';
      var visible = 0;

      cards.forEach(function (card) {
        var ok = true;
        if (q && valueOf(card, 'data-keywords').indexOf(q) === -1) ok = false;
        if (cat && cat !== 'all' && valueOf(card, 'data-category') !== cat) ok = false;
        card.style.display = ok ? '' : 'none';
        if (ok) visible += 1;
      });

      if (sort && grid) {
        var active = cards.filter(function (card) {
          return card.style.display !== 'none';
        });
        if (sort.value === 'score') {
          active.sort(function (a, b) {
            return Number(valueOf(b, 'data-score')) - Number(valueOf(a, 'data-score'));
          });
        } else if (sort.value === 'year') {
          active.sort(function (a, b) {
            return String(valueOf(b, 'data-year')).localeCompare(String(valueOf(a, 'data-year')), 'zh-Hans-CN-u-kn-true');
          });
        }
        active.forEach(function (card) {
          grid.appendChild(card);
        });
      }

      if (empty) empty.classList.toggle('is-visible', visible === 0);
    }

    if (search) search.addEventListener('input', apply);
    if (category) category.addEventListener('change', apply);
    if (sort) sort.addEventListener('change', apply);
    apply();
  });
})();
