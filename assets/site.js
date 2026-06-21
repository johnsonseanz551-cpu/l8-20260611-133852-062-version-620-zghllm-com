(function() {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".mobile-panel");

  if (toggle && panel) {
    toggle.addEventListener("click", function() {
      panel.classList.toggle("is-open");
    });
  }

  const hero = document.querySelector(".hero");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-dot"));
    const prev = hero.querySelector(".hero-prev");
    const next = hero.querySelector(".hero-next");
    let current = 0;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    if (prev) {
      prev.addEventListener("click", function() {
        show(current - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function() {
        show(current + 1);
      });
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        show(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function() {
        show(current + 1);
      }, 5200);
    }
  }

  const filterPages = document.querySelectorAll(".filter-page");
  filterPages.forEach(function(page) {
    const input = page.querySelector(".filter-input");
    const chips = Array.from(page.querySelectorAll(".filter-chip"));
    const cards = Array.from(page.querySelectorAll(".movie-card"));
    const empty = page.querySelector(".empty-state");
    let activeYear = "all";
    let activeType = "all";

    function apply() {
      const keyword = input ? input.value.trim().toLowerCase() : "";
      let visible = 0;

      cards.forEach(function(card) {
        const haystack = [
          card.dataset.title || "",
          card.dataset.year || "",
          card.dataset.type || "",
          card.dataset.tags || ""
        ].join(" ").toLowerCase();

        const yearOk = activeYear === "all" || card.dataset.year === activeYear;
        const typeOk = activeType === "all" || card.dataset.type === activeType;
        const keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
        const shouldShow = yearOk && typeOk && keywordOk;

        card.classList.toggle("is-hidden-card", !shouldShow);
        if (shouldShow) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-show", visible === 0);
      }
    }

    if (input) {
      input.addEventListener("input", apply);
    }

    chips.forEach(function(chip) {
      chip.addEventListener("click", function() {
        const group = chip.dataset.group;
        const value = chip.dataset.value;

        chips
          .filter(function(item) {
            return item.dataset.group === group;
          })
          .forEach(function(item) {
            item.classList.remove("is-active");
          });

        chip.classList.add("is-active");

        if (group === "year") {
          activeYear = value;
        }

        if (group === "type") {
          activeType = value;
        }

        apply();
      });
    });

    apply();
  });

  const searchPage = document.querySelector(".search-page");
  if (searchPage) {
    const input = searchPage.querySelector(".search-page-input");
    const cards = Array.from(searchPage.querySelectorAll(".movie-card"));
    const empty = searchPage.querySelector(".empty-state");
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q") || "";

    if (input) {
      input.value = initial;
    }

    function runSearch() {
      const keyword = input ? input.value.trim().toLowerCase() : "";
      let visible = 0;

      cards.forEach(function(card) {
        const haystack = [
          card.dataset.title || "",
          card.dataset.year || "",
          card.dataset.type || "",
          card.dataset.tags || ""
        ].join(" ").toLowerCase();
        const shouldShow = !keyword || haystack.indexOf(keyword) !== -1;

        card.classList.toggle("is-hidden-card", !shouldShow);
        if (shouldShow) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-show", visible === 0);
      }
    }

    if (input) {
      input.addEventListener("input", runSearch);
    }

    runSearch();
  }
})();
