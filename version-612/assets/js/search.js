(function () {
    const params = new URLSearchParams(window.location.search);
    const query = (params.get('q') || '').trim();
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const hint = document.getElementById('searchHint');

    if (input) {
        input.value = query;
    }

    function normalize(value) {
        return String(value || '').toLowerCase();
    }

    function createCard(movie) {
        const tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return [
            '<article class="movie-card">',
            '    <a class="poster-link" href="' + escapeHtml(movie.url) + '" aria-label="观看' + escapeHtml(movie.title) + '">',
            '        <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <span class="poster-shade"></span>',
            '        <span class="card-play">▶</span>',
            '    </a>',
            '    <div class="movie-card-body">',
            '        <div class="card-meta">',
            '            <span>' + escapeHtml(movie.year) + '</span>',
            '            <span>' + escapeHtml(movie.region) + '</span>',
            '            <span>' + escapeHtml(movie.type) + '</span>',
            '        </div>',
            '        <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
            '        <p>' + escapeHtml(movie.oneLine || movie.genre) + '</p>',
            '        <div class="tag-row">' + tags + '</div>',
            '    </div>',
            '</article>'
        ].join('\n');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function render() {
        if (!results || !Array.isArray(MOVIE_SEARCH_DATA)) {
            return;
        }
        const words = normalize(query).split(/\s+/).filter(Boolean);
        let matches = MOVIE_SEARCH_DATA;
        if (words.length) {
            matches = MOVIE_SEARCH_DATA.filter(function (movie) {
                const text = normalize([
                    movie.title,
                    movie.year,
                    movie.region,
                    movie.type,
                    movie.genre,
                    movie.category,
                    (movie.tags || []).join(' '),
                    movie.oneLine
                ].join(' '));
                return words.every(function (word) {
                    return text.indexOf(word) !== -1;
                });
            });
        } else {
            matches = MOVIE_SEARCH_DATA.slice(0, 36);
        }
        results.innerHTML = matches.slice(0, 120).map(createCard).join('\n');
        if (hint) {
            hint.textContent = words.length ? '已显示匹配度较高的影片。' : '默认展示近期推荐影片。';
        }
        if (!results.innerHTML) {
            results.innerHTML = '<div class="empty-state">没有找到匹配影片，可更换关键词继续搜索。</div>';
        }
    }

    render();
})();
