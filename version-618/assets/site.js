(function () {
    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
            return;
        }
        document.addEventListener('DOMContentLoaded', callback);
    }

    ready(function () {
        var toggle = document.querySelector('[data-nav-toggle]');
        var mobileNav = document.querySelector('[data-mobile-nav]');
        if (toggle && mobileNav) {
            toggle.addEventListener('click', function () {
                mobileNav.classList.toggle('is-open');
            });
        }

        document.querySelectorAll('[data-hero]').forEach(function (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
            var prev = hero.querySelector('[data-hero-prev]');
            var next = hero.querySelector('[data-hero-next]');
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle('is-active', slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle('is-active', dotIndex === current);
                });
            }

            function startTimer() {
                stopTimer();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5000);
            }

            function stopTimer() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            if (prev) {
                prev.addEventListener('click', function () {
                    show(current - 1);
                    startTimer();
                });
            }
            if (next) {
                next.addEventListener('click', function () {
                    show(current + 1);
                    startTimer();
                });
            }
            dots.forEach(function (dot, index) {
                dot.addEventListener('click', function () {
                    show(index);
                    startTimer();
                });
            });
            hero.addEventListener('mouseenter', stopTimer);
            hero.addEventListener('mouseleave', startTimer);
            show(0);
            startTimer();
        });

        document.querySelectorAll('.slider-wrap').forEach(function (wrap) {
            var slider = wrap.querySelector('[data-slider]');
            var left = wrap.querySelector('[data-scroll-left]');
            var right = wrap.querySelector('[data-scroll-right]');
            if (!slider) {
                return;
            }
            function scrollByCard(direction) {
                slider.scrollBy({
                    left: direction * Math.min(520, slider.clientWidth * 0.82),
                    behavior: 'smooth'
                });
            }
            if (left) {
                left.addEventListener('click', function () {
                    scrollByCard(-1);
                });
            }
            if (right) {
                right.addEventListener('click', function () {
                    scrollByCard(1);
                });
            }
        });

        document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
            var scope = panel.parentElement || document;
            var input = panel.querySelector('[data-filter-input]');
            var sort = panel.querySelector('[data-sort-select]');
            var grid = scope.querySelector('[data-grid]');
            var empty = scope.querySelector('[data-empty-state]');
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
            cards.forEach(function (card, index) {
                card.dataset.rank = String(index);
            });

            function textOf(card) {
                return [
                    card.dataset.title,
                    card.dataset.year,
                    card.dataset.genre,
                    card.dataset.region,
                    card.dataset.category,
                    card.textContent
                ].join(' ').toLowerCase();
            }

            function applyFilter() {
                var keyword = input ? input.value.trim().toLowerCase() : '';
                var shown = 0;
                cards.forEach(function (card) {
                    var matched = !keyword || textOf(card).indexOf(keyword) !== -1;
                    card.classList.toggle('is-hidden-card', !matched);
                    if (matched) {
                        shown += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', shown === 0);
                }
            }

            function applySort() {
                if (!sort) {
                    return;
                }
                var value = sort.value;
                var sorted = cards.slice().sort(function (a, b) {
                    if (value === 'rank') {
                        return Number(a.dataset.rank || 0) - Number(b.dataset.rank || 0);
                    }
                    if (value === 'year-asc') {
                        return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
                    }
                    if (value === 'title-asc') {
                        return String(a.dataset.title || '').localeCompare(String(b.dataset.title || ''), 'zh-CN');
                    }
                    return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                });
                sorted.forEach(function (card) {
                    grid.appendChild(card);
                });
            }

            if (input) {
                input.addEventListener('input', applyFilter);
            }
            if (sort) {
                sort.addEventListener('change', function () {
                    applySort();
                    applyFilter();
                });
            }
            panel.querySelectorAll('[data-filter-chip]').forEach(function (chip) {
                chip.addEventListener('click', function () {
                    if (input) {
                        input.value = chip.dataset.filterChip || chip.textContent.trim();
                        applyFilter();
                    }
                });
            });
            applySort();
            applyFilter();
        });
    });
}());
