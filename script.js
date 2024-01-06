var toHHMMSS = function (value) {
  var sec_num = parseInt(value, 10); // don't forget the second param
  var hoursInt = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hoursInt * 3600)) / 60);
  var seconds = sec_num - (hoursInt * 3600) - (minutes * 60);
  var hours;

  if (hoursInt < 10) { hours = "0" + hoursInt + ":"; }
  if (hoursInt < 1) { hours = ""; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  var time = hours + minutes + ':' + seconds;
  return time;
};
var videoDimensions = function(video) {
  // Ratio of the video's intrisic dimensions
  var videoRatio = video.videoWidth / video.videoHeight;
  // The width and height of the video element
  var width = video.offsetWidth, height = video.offsetHeight;
  // The ratio of the element's width to its height
  var elementRatio = width/height;
  // If the video element is short and wide
  if(elementRatio > videoRatio) width = height * videoRatio;
  // It must be tall and thin, or exactly equal to the original ratio
  else height = width / videoRatio;
  return {
    width: width,
    height: height
  };
};
var resizeOverlays = function() {
  if(video.videoWidth == 0 || video.videoHeight == 0) {
      return;
    }
  var dimensions = videoDimensions(video);
  var frameWidth = dimensions.width;
  var widthCss = "width: " + frameWidth + "px;";
  var left = (video.offsetWidth - frameWidth) / 2;
  var leftCss = "left: " + left + "px;";
  var bottom = (video.offsetHeight - dimensions.height) / 2;
  var bottomCss = "bottom: " + bottom + "px;";
  metadata.style = widthCss + leftCss;
  controls.style = widthCss + leftCss + bottomCss;
};
var setVolumeIcon = function(volume, unmuted) {
  if(volume < 0.5) {
    unmuted.classList.remove("fa-volume-up");
    unmuted.classList.add("fa-volume-down");
  } else {
    unmuted.classList.remove("fa-volume-down");
    unmuted.classList.add("fa-volume-up");
  }
}
if(Hls.isSupported()) {
  var controls = document.getElementById('controls');
  var metadata = document.getElementById('metadata');
  var video = document.getElementById('video');
  var play = document.getElementById('play');
  var pause = document.getElementById('pause');
  var elapsed = document.getElementById('elapsed');
  var separator = document.getElementById('separator');
  var duration = document.getElementById('duration');
  var seek = document.getElementById('seek');
  var muted = document.getElementById('muted');
  var unmuted = document.getElementById('unmuted');
  var volume = document.getElementById('volume');
  var hideOverlaysTimer = undefined;
  var setHideOverlaysTimer = function() { 
    hideOverlaysTimer = window.setTimeout(function() {
      if(video.paused) {
        return;
      }
      document.body.className = 'hideOverlays';
    }, 5000);
  };
  var clearHideOverlaysTimer = function() {
    if(typeof hideOverlaysTimer === 'number') {
      window.clearTimeout(hideOverlaysTimer);
      hideOverlaysTimer = undefined;
    }
  };
  var hls = new Hls();
  hls.loadSource(video.src);
  hls.attachMedia(video);
  document.body.addEventListener('mousemove', function(e) {
    document.body.className = '';
    clearHideOverlaysTimer();
    setHideOverlaysTimer();
  });
  play.addEventListener('click', function(e) {
    video.play();
  });
  pause.addEventListener('click', function(e) {
    video.pause();
    document.body.class = '';
  });
  window.addEventListener('resize', function(e) {
    resizeOverlays();
  });
  video.addEventListener('loadeddata', function(e) {
    resizeOverlays();
    video.play();
  });
  video.addEventListener('play', function(e) {
    play.classList.add('hidden');
    pause.classList.remove('hidden');
    setHideOverlaysTimer();
  });
  video.addEventListener('pause', function(e) {
    pause.classList.add('hidden');
    play.classList.remove('hidden');
    document.body.className = '';
  });
  video.addEventListener('durationchange', function(e) {
    duration.innerHTML = toHHMMSS(video.duration);
    seek.max = video.duration;
  });
  video.addEventListener('timeupdate', function(e) {
    elapsed.innerHTML = toHHMMSS(video.currentTime);
    seek.value = video.currentTime;
  });
  video.addEventListener('click', function(e) {
    if(video.paused) {
      video.play();
    }
    else {
      video.pause();
    }
  });
  video.addEventListener('ended', function(e) {
  });
  volume.addEventListener('change', function(e) {
    video.volume = volume.value;
    setVolumeIcon(video.volume, unmuted);
  });
  unmuted.addEventListener('click', function(e) {
    video.muted = true;
    unmuted.classList.add("hidden");
    muted.classList.remove("hidden");
    volume.disabled = true;
  });
  muted.addEventListener('click', function(e) {
    video.muted = false;
    muted.classList.add("hidden");
    unmuted.classList.remove("hidden");
    volume.disabled = false;
  });
  seek.addEventListener('change', function(e) {
    video.currentTime = seek.value;
  });
}