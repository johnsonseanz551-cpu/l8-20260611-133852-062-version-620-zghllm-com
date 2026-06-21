(function () {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            document.body.classList.toggle('menu-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    let activeIndex = 0;

    function activateSlide(index) {
        if (!slides.length) {
            return;
        }
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === activeIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            activateSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            activateSlide(activeIndex + 1);
        }, 5200);
    }

    const filterInputs = Array.from(document.querySelectorAll('.local-filter-input'));
    filterInputs.forEach(function (input) {
        const cards = Array.from(document.querySelectorAll('[data-filter]'));
        input.addEventListener('input', function () {
            const value = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                const text = (card.getAttribute('data-filter') || '').toLowerCase();
                card.classList.toggle('is-filtered-out', value !== '' && text.indexOf(value) === -1);
            });
        });
    });
})();
