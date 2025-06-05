/*
 * Video Block
 * Show a video referenced by a link
 * https://www.hlx.live/developer/block-collection/video
 */

import {
  trackYTStart,
  trackYTPause,
  trackYTResume,
  trackYTProgress,
  trackYTComplete,
} from '../../scripts/analytics.js';
import { getDocFileExtension } from '../../scripts/tools.js';

let videoCount = 0;
let ytIframeApiReady = false;
const videoEmbedCount = Array.from(document.querySelectorAll('.video-embed')).length;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const addYTiframeAPI = () => {
  const tag = document.createElement('script');

  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = () => {
    ytIframeApiReady = true;
  };
};

const allYTVideos = [];
const allCompletedYTVideos = [];
let intervalId;

const checkAllVideosCompleted = () => {
  let allCompleted = true;

  if (allCompletedYTVideos.find((thisPlayer) => thisPlayer.isComplete === false)) {
    allCompleted = false;
  }
  if (allCompleted && intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const calculateYTProgress = () => {
  allYTVideos.forEach((thisPlayer) => {
    const completedVideo = allCompletedYTVideos.find(
      (this2Player) => this2Player.id === thisPlayer.id && this2Player.isComplete,
    );
    if (!completedVideo && thisPlayer.player && thisPlayer.player.getCurrentTime) {
      const completedProgress = (thisPlayer.player.getCurrentTime() / thisPlayer.duration) * 100;
      if (completedProgress >= 25 && !thisPlayer.tracked25) {
        thisPlayer.tracked25 = true;
        trackYTProgress({
          video_id: thisPlayer.id,
          video_name: thisPlayer.player.videoTitle,
          video_url: window.location.href,
          video_duration: thisPlayer.duration,
          video_milestone: 25,
        });
      }
      if (completedProgress >= 75 && !thisPlayer.tracked75) {
        thisPlayer.tracked75 = true;
        trackYTProgress({
          video_id: thisPlayer.id,
          video_name: thisPlayer.player.videoTitle,
          video_url: window.location.href,
          video_duration: thisPlayer.duration,
          video_milestone: 75,
        });
      }
      if (completedProgress >= 50 && !thisPlayer.tracked50) {
        thisPlayer.tracked50 = true;
        trackYTProgress({
          video_id: thisPlayer.id,
          video_name: thisPlayer.player.videoTitle,
          video_url: window.location.href,
          video_duration: thisPlayer.duration,
          video_milestone: 50,
        });
      }
    }
  });
  checkAllVideosCompleted();
};

window.onYTPlayerReady = (event, autoplay) => {
  if (autoplay) {
    event.target.playVideo();
  }
  intervalId = setInterval(calculateYTProgress, 100);
};

window.onPlayerStateChange = (event) => {
  const player = event.target;
  let playerEvent = '';
  switch (event.data) {
    case window.YT.PlayerState.PLAYING:
      if (
        player.getCurrentTime() >= 0.05 &&
        player.getPlayerState() !== window.YT.PlayerState.PAUSED
      ) {
        playerEvent = 'resume';
      }
      if (
        player.getCurrentTime() < 0.05 &&
        player.getPlayerState() !== window.YT.PlayerState.PAUSED
      ) {
        playerEvent = 'start';
        allYTVideos.forEach((thisPlayer) => {
          if (thisPlayer.id === player.options?.videoId) {
            thisPlayer.duration = player.getDuration();
          }
        });
        allCompletedYTVideos.forEach((thisPlayer) => {
          if (thisPlayer.id === player.options?.videoId) {
            thisPlayer.isComplete = false;
          }
        });
      }
      break;
    case window.YT.PlayerState.PAUSED:
      playerEvent = 'pause';
      break;
    case window.YT.PlayerState.ENDED:
      playerEvent = 'complete';
      allCompletedYTVideos.forEach((thisPlayer) => {
        if (thisPlayer.id === player.options?.videoId) {
          thisPlayer.isComplete = true;
        }
      });
      checkAllVideosCompleted();
      break;
    default:
      break;
  }
  if (playerEvent.length > 0 && player && player.getCurrentTime && player.getDuration) {
    if (playerEvent === 'start') {
      trackYTStart({
        video_id: player.options?.videoId,
        video_name: player.videoTitle,
        video_url: window.location.href,
        video_duration: player.getDuration(),
      });
    }
    if (playerEvent === 'pause') {
      trackYTPause({
        video_id: player.options?.videoId,
        video_name: player.videoTitle,
        video_url: window.location.href,
        video_duration: player.getDuration(),
      });
    }
    if (playerEvent === 'resume') {
      trackYTResume({
        video_id: player.options?.videoId,
        video_name: player.videoTitle,
        video_url: window.location.href,
        video_duration: player.getDuration(),
      });
    }
    if (playerEvent === 'complete') {
      trackYTComplete({
        video_id: player.options?.videoId,
        video_name: player.videoTitle,
        video_url: window.location.href,
        video_duration: player.getDuration(),
        video_milestone: 100,
      });
    }
  }
};

function embedYoutube(ytBlock, autoplay) {
  if (ytBlock && ytIframeApiReady && window.YT) {
    /* eslint-disable */
    const player = new window.YT.Player(ytBlock.id, {
      height: '390',
      width: '640',
      videoId: ytBlock.getAttribute('data-video'),
      playerVars: {
        playsinline: 1,
      },
      events: {
        onReady: (event) => window.onYTPlayerReady(event, autoplay),
        onStateChange: window.onPlayerStateChange,
        onError: ({ data }) => {
          console.error('Youtube error code:', data);
        },
      },
    });

    allYTVideos.push({
      id: ytBlock.getAttribute('data-video'),
      player,
      videoTitle: player.videoTitle,
      tracked25: false,
      tracked50: false,
      tracked75: false,
    });
    allCompletedYTVideos.push({
      id: ytBlock.getAttribute('data-video'),
      isComplete: false,
    });
    /* eslint-enable */
  }
}

function embedVimeo(url, autoplay, background) {
  const [, video] = url.pathname.split('/');
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? '1' : '0',
      background: background ? '1' : '0',
    };
    suffix = `?${Object.entries(suffixParams)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')}`;
  }
  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}${suffix}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function embedDAMVideo(url, autoplay, background) {
  // const [, video] = url.pathname.split('/');
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? 'true' : '0',
      background: background ? '1' : '0',
    };
    suffix = `?${Object.entries(suffixParams)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')}`;
  }
  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="${url}${suffix}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function getVideoElement(source, autoplay, background) {
  const video = document.createElement('video');
  const extn = getDocFileExtension(source) || 'mp4';
  video.setAttribute('controls', '');
  if (autoplay) {
    video.setAttribute('autoplay', '');
    video.play();
  }
  if (background) {
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.removeAttribute('controls');
    video.addEventListener('canplay', () => {
      video.muted = true;
      if (autoplay) {
        video.play();
      }
    });
  }

  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  sourceEl.setAttribute('type', `video/${extn}`);
  video.append(sourceEl);

  return video;
}

const loadVideoEmbed = (block, link, autoplay, background) => {
  if (block.dataset.embedLoaded === 'true') {
    return;
  }
  const url = new URL(link);

  const isYoutube = link.includes('youtube') || link.includes('youtu.be');
  const isVimeo = link.includes('vimeo');

  if (isYoutube) {
    embedYoutube(block?.parentNode.querySelector('[data-videotype]'), autoplay);
  } else if (isVimeo) {
    const embedWrapper = embedVimeo(url, autoplay, background);
    block.append(embedWrapper);
    embedWrapper.querySelector('iframe').addEventListener('load', () => {
      block.dataset.embedLoaded = true;
    });
  } else if (getDocFileExtension(link) || link.indexOf('wellmark.scene7.com') !== -1) {
    const videoEl = getVideoElement(link, autoplay, background);
    block.append(videoEl);
    console.log(
      '==========link, autoplay, background, videoEl',
      link,
      autoplay,
      background,
      videoEl,
    );
    videoEl.addEventListener('canplay', () => {
      block.dataset.embedLoaded = true;
    });
  } else {
    const videoEl = embedDAMVideo(link, autoplay, background);
    block.append(videoEl);
    videoEl.addEventListener('canplay', () => {
      block.dataset.embedLoaded = true;
    });
  }
};

const addYTDivToBlock = (block, link) => {
  const isYoutube = link.includes('youtube') || link.includes('youtu.be');
  if (isYoutube) {
    const usp = new URLSearchParams(new URL(link).search);
    const playerVideo = usp.get('v') || encodeURIComponent(usp.get('v'));
    const ytDiv = document.createElement('div');
    ytDiv.id = `youtube_player_${Date.now()}`;
    ytDiv.setAttribute('data-videotype', 'yt');
    ytDiv.setAttribute('data-video', playerVideo);
    block.parentNode.append(ytDiv);
    block.parentNode.classList.add('has-youtube-video');
  }
};

export default async function decorate(block) {
  let linkParent = block.querySelector('em a');
  const hasNoPoster = block.classList.contains('hosted-no-poster');
  if (!linkParent && hasNoPoster) {
    linkParent = block.querySelector('a');
  }
  const link = linkParent.href;
  addYTDivToBlock(block, link);
  videoCount += 1;
  if (videoCount === videoEmbedCount) {
    addYTiframeAPI();
  }
  setTimeout(() => {
    const placeholder = block.querySelector('picture');
    block.textContent = '';
    block.dataset.embedLoaded = false;

    const autoplay = block.classList.contains('autoplay');
    if (placeholder) {
      block.classList.add('placeholder');
      const wrapper = document.createElement('div');
      wrapper.className = 'video-embed-placeholder';
      wrapper.append(placeholder);

      if (!autoplay) {
        wrapper.insertAdjacentHTML(
          'beforeend',
          '<div class="video-embed-placeholder-play"><button type="button" title="Play"></button></div>',
        );
        wrapper.addEventListener('click', () => {
          wrapper.remove();
          loadVideoEmbed(block, link, true, false);
        });
      }
      block.append(wrapper);
    }

    if (!placeholder && !autoplay && hasNoPoster) {
      const wrapper = document.createElement('div');
      wrapper.className = 'video-embed-placeholder';

      wrapper.insertAdjacentHTML(
        'beforeend',
        '<div class="video-embed-placeholder-play"><button type="button" title="Play"></button></div>',
      );
      wrapper.addEventListener('click', () => {
        wrapper.remove();
        block.querySelector('video')?.play();
      });
      block.append(wrapper);
    }

    if (!placeholder || autoplay) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          const playOnLoad = autoplay && !prefersReducedMotion.matches;
          loadVideoEmbed(block, link, playOnLoad, autoplay);
        }
      });
      observer.observe(block);
    }
  }, 1500);
}
