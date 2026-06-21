(function () {
  var Hls = window.Hls;

  document.querySelectorAll('[data-player]').forEach(function (shell) {
    var video = shell.querySelector('video');
    var play = shell.querySelector('[data-play]');
    if (!video || !play) return;

    var stream = video.getAttribute('data-stream');
    var ready = false;
    var hls = null;

    function attach() {
      if (ready || !stream) return;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
      ready = true;
    }

    function start() {
      attach();
      shell.classList.add('is-playing');
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    play.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!ready || video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
    video.addEventListener('ended', function () {
      shell.classList.remove('is-playing');
    });
    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') hls.destroy();
    });
  });
})();
