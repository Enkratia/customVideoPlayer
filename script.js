const container = document.querySelector(".container"),
  mainVideo = document.querySelector("video"),
  progressBar = document.querySelector(".progress-bar"),
  skipBackward = document.querySelector(".skip-backward i"),
  skipForward = document.querySelector(".skip-forward i"),
  volumeBtn = document.querySelector(".volume i"),
  volumeSlider = document.querySelector(".left input"),
  speedBtn = document.querySelector(".playback-speed span"),
  speedOptions = document.querySelector(".speed-options"),
  picInPicBtn = document.querySelector(".pic-in-pic span"),
  fullscreenBtn = document.querySelector(".fullscreen i"),
  videoTimeline = document.querySelector(".video-timeline"),
  currentVidTime = document.querySelector(".current-time"),
  videoDuration = document.querySelector(".video-duration"),
  playPauseBtn = document.querySelector(".play-pause i");
let timer;


const hideControls = () => {
  if (mainVideo.paused) return;
  timer = setTimeout(() => {
    container.classList.remove("show-controls");
  }, 3000);
}

container.addEventListener("mousemove", () => {
  container.classList.add("show-controls");
  clearTimeout(timer);
  hideControls();
});

const formatTime = time => {
  let seconds = Math.floor(time % 60);
  let minutes = Math.floor(time / 60);
  let hours = Math.floor(time / 3600);

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  if (hours == 0) {
    return `${minutes}:${seconds}`;
  } else {
    return `${hours}:${minutes}:${seconds}`;
  }
}

videoTimeline.addEventListener("mousedown", () => {
  videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

document.addEventListener("mouseup", () => {
  videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

const draggableProgressBar = (e) => {
  let timelineWidth = videoTimeline.clientWidth;
  progressBar.style.width = `${e.offsetX}px`;
  mainVideo.currentTime = e.offsetX / timelineWidth * mainVideo.duration;
  currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

mainVideo.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target;
  let percent = currentTime / duration * 100;
  progressBar.style.width = `${percent}%`;
  currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", (e) => {
  videoDuration.innerText = formatTime(e.target.duration);
})

videoTimeline.addEventListener("mousemove", (e) => {
  const progressTime = videoTimeline.querySelector("span");
  let offsetX = e.offsetX;
  progressTime.style.left = `${offsetX}px`;

  let timelineWidth = videoTimeline.clientWidth;
  let percent = e.offsetX / timelineWidth * mainVideo.duration;
  progressTime.innerText = formatTime(percent);
})

videoTimeline.addEventListener("click", (e) => {
  let timelineWidth = videoTimeline.clientWidth;
  mainVideo.currentTime = e.offsetX / timelineWidth * mainVideo.duration;
});

volumeBtn.addEventListener("click", () => {
  if (!volumeBtn.classList.contains("fa-volume-high")) {
    mainVideo.volume = 0.5;
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    mainVideo.volume = 0;
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  volumeSlider.value = mainVideo.volume;
});

speedBtn.addEventListener("click", () => {
  speedOptions.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (e.target.tagName !== "SPAN" && e.target.className !== "material-symbols-outlined") {
    speedOptions.classList.remove("show");
  }
});

picInPicBtn.addEventListener("click", () => {
  mainVideo.requestPictureInPicture();
});

fullscreenBtn.addEventListener("click", () => {
  if (document.fullscreenElement) {
    fullscreenBtn.classList.replace("fa-compress", "fa-expand");
    return document.exitFullscreen();
  } else {
    fullscreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen();
  }
});


document.querySelectorAll(".speed-options li").forEach(option => {
  option.addEventListener("click", () => {
    mainVideo.playbackRate = option.getAttribute("data-speed");
    speedOptions.querySelector(".active").classList.remove("active");
    option.classList.add("active");
  })
})

volumeSlider.addEventListener("input", (e) => {
  mainVideo.volume = e.target.value;
  if (mainVideo.volume === 0) {
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  } else {
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  }
});

skipBackward.addEventListener("click", () => {
  mainVideo.currentTime -= 5;
});

skipForward.addEventListener("click", () => {
  mainVideo.currentTime += 5;
});

playPauseBtn.addEventListener("click", () => {
  mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {
  playPauseBtn.classList.replace("fa-play", "fa-pause");
});

mainVideo.addEventListener("pause", () => {
  playPauseBtn.classList.replace("fa-pause", "fa-play");
});