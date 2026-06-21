(function () {
    const video = document.querySelector('.movie-video');
    const cover = document.querySelector('.player-cover');
    const trigger = document.querySelector('.play-trigger');
    let attached = false;
    let hls = null;

    function attachVideo() {
        if (!video || attached) {
            return;
        }
        attached = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = pageVideoUrl;
        } else if (window.Hls && Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(pageVideoUrl);
            hls.attachMedia(video);
        } else {
            video.src = pageVideoUrl;
        }
    }

    function startPlay() {
        if (!video) {
            return;
        }
        attachVideo();
        if (cover) {
            cover.classList.add('is-hidden');
        }
        video.controls = true;
        const promise = video.play();
        if (promise && promise.catch) {
            promise.catch(function () {
                if (cover) {
                    cover.classList.remove('is-hidden');
                }
            });
        }
    }

    if (trigger) {
        trigger.addEventListener('click', startPlay);
    }
    if (cover && cover !== trigger) {
        cover.addEventListener('click', startPlay);
    }
    if (video) {
        video.addEventListener('click', function () {
            if (video.paused) {
                startPlay();
            }
        });
    }

    window.addEventListener('pagehide', function () {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
})();
