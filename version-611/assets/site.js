(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function bindMobileNav() {
        var button = document.querySelector('[data-mobile-menu]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function bindHeroCarousel() {
        var carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', carousel);
        var dots = selectAll('[data-hero-dot]', carousel);
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('is-active', itemIndex === current);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('is-active', itemIndex === current);
            });
        }
        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }
        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }
        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener('click', function () {
                show(itemIndex);
                restart();
            });
        });
        show(0);
        restart();
    }

    function bindFilters() {
        var panels = selectAll('[data-filter-scope]');
        panels.forEach(function (panel) {
            var input = panel.querySelector('[data-filter-input]');
            var region = panel.querySelector('[data-filter-region]');
            var year = panel.querySelector('[data-filter-year]');
            var sort = panel.querySelector('[data-filter-sort]');
            var grid = panel.querySelector('[data-filter-grid]');
            var empty = panel.querySelector('[data-empty-state]');
            if (!grid) {
                return;
            }
            var cards = selectAll('[data-filter-card]', grid);
            function apply() {
                var query = input ? input.value.trim().toLowerCase() : '';
                var regionValue = region ? region.value : '';
                var yearValue = year ? year.value : '';
                var visible = 0;
                cards.forEach(function (card) {
                    var text = (card.getAttribute('data-text') || '').toLowerCase();
                    var matchQuery = !query || text.indexOf(query) !== -1;
                    var matchRegion = !regionValue || card.getAttribute('data-region') === regionValue;
                    var matchYear = !yearValue || card.getAttribute('data-year-group') === yearValue;
                    var ok = matchQuery && matchRegion && matchYear;
                    card.style.display = ok ? '' : 'none';
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }
            function applySort() {
                if (!sort) {
                    return;
                }
                var value = sort.value;
                var sorted = cards.slice().sort(function (a, b) {
                    if (value === 'title') {
                        return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
                    }
                    if (value === 'old') {
                        return Number(a.getAttribute('data-year') || 0) - Number(b.getAttribute('data-year') || 0);
                    }
                    return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
                });
                sorted.forEach(function (card) {
                    grid.appendChild(card);
                });
                apply();
            }
            [input, region, year].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });
            if (sort) {
                sort.addEventListener('change', applySort);
            }
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q && input) {
                input.value = q;
            }
            applySort();
        });
    }

    window.initMoviePlayer = function (source) {
        var video = document.querySelector('[data-player-video]');
        var overlay = document.querySelector('[data-player-overlay]');
        var startButton = document.querySelector('[data-player-start]');
        if (!video || !source) {
            return;
        }
        var loaded = false;
        function loadSource() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                video.hlsController = hls;
            } else {
                video.src = source;
            }
        }
        function start() {
            loadSource();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            video.controls = true;
            var playPromise = video.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(function () {});
            }
        }
        if (overlay) {
            overlay.addEventListener('click', start);
        }
        if (startButton) {
            startButton.addEventListener('click', function (event) {
                event.stopPropagation();
                start();
            });
        }
        video.addEventListener('click', start);
        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        bindMobileNav();
        bindHeroCarousel();
        bindFilters();
    });
}());
