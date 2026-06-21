(function () {
  var body = document.body;
  var navToggle = document.querySelector('[data-nav-toggle]');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      body.classList.toggle('nav-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function filterScope(scope, keyword, category) {
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var activeCategory = category || 'all';
    var normalizedKeyword = normalize(keyword);

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-keywords'));
      var filter = card.getAttribute('data-filter') || '';
      var matchKeyword = !normalizedKeyword || text.indexOf(normalizedKeyword) !== -1;
      var matchCategory = activeCategory === 'all' || filter === activeCategory;
      card.hidden = !(matchKeyword && matchCategory);
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-card-scope]')).forEach(function (scope) {
    var section = scope.closest('.section') || document;
    var input = section.querySelector('[data-search-input]');
    var clearButton = section.querySelector('[data-search-clear]');
    var buttons = Array.prototype.slice.call(section.querySelectorAll('[data-filter-button]'));
    var category = 'all';

    function apply() {
      filterScope(scope, input ? input.value : '', category);
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    if (clearButton && input) {
      clearButton.addEventListener('click', function () {
        input.value = '';
        input.focus();
        apply();
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        category = button.getAttribute('data-filter-button') || 'all';
        buttons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        apply();
      });
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var source = player.getAttribute('data-video-src');
    var hls = null;
    var ready = false;

    function attachSource() {
      if (ready || !video || !source) {
        return;
      }
      ready = true;

      if (window.Hls && window.Hls.isSupported && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function startPlayback() {
      attachSource();
      player.classList.add('is-ready');
      var promise = video.play();
      if (promise && typeof promise.then === 'function') {
        promise.then(function () {
          player.classList.add('is-playing');
        }).catch(function () {
          player.classList.remove('is-playing');
        });
      } else {
        player.classList.add('is-playing');
      }
    }

    if (button && video) {
      button.addEventListener('click', startPlayback);
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        player.classList.remove('is-playing');
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayback();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  });
})();
