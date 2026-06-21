(function() {
  function setupPlayer(player) {
    const video = player.querySelector("video");
    const cover = player.querySelector(".player-cover");
    const button = player.querySelector(".player-start");
    const message = player.querySelector(".player-message");
    const videoUrl = player.dataset.videoUrl;
    let loaded = false;
    let hls = null;

    function showMessage(text) {
      if (!message) {
        return;
      }

      message.textContent = text;
      message.classList.add("is-show");
    }

    function hideCover() {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    }

    function loadVideo() {
      if (!video || !videoUrl) {
        showMessage("视频暂时无法播放，请稍后再试");
        return;
      }

      hideCover();

      if (loaded) {
        video.play().catch(function() {});
        return;
      }

      loaded = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function() {
          video.play().catch(function() {});
        });
        hls.on(window.Hls.Events.ERROR, function(event, data) {
          if (!data || !data.fatal) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
            return;
          }

          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
            return;
          }

          showMessage("视频暂时无法播放，请稍后再试");
          hls.destroy();
        });
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        video.addEventListener("loadedmetadata", function() {
          video.play().catch(function() {});
        }, { once: true });
        video.load();
        return;
      }

      video.src = videoUrl;
      video.load();
      video.play().catch(function() {
        showMessage("视频暂时无法播放，请稍后再试");
      });
    }

    if (button) {
      button.addEventListener("click", loadVideo);
    }

    if (video) {
      video.addEventListener("click", function() {
        if (!loaded || video.paused) {
          loadVideo();
        }
      });

      video.addEventListener("play", hideCover);

      video.addEventListener("error", function() {
        showMessage("视频暂时无法播放，请稍后再试");
      });
    }

    window.addEventListener("pagehide", function() {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.querySelectorAll(".player-card").forEach(setupPlayer);
})();
