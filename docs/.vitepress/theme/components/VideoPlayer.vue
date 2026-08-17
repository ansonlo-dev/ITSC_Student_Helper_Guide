<script setup lang="ts">
// A screen recording served from `docs/public/videos`, played by the browser's
// own <video> element instead of an embedded Google Drive player: it keeps the
// controls, keyboard shortcuts and full-screen behaviour the reader already
// knows, works offline in a local build, and needs no Google sign-in.
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { useTranslate } from '../useTranslate'

const props = withDefaults(
  defineProps<{
    /** Path under `docs/public`, e.g. `/videos/media1.mp4`. */
    src: string
    /** Still frame shown before playback; defaults to `<src>-poster.jpg`. */
    poster?: string
    /** Caption rendered under the player. */
    caption?: string
    /**
     * The recording's own `width / height`, so the box is the right shape
     * before the file loads. `ffprobe -show_entries stream=width,height` on the
     * file gives the numbers; the 16:9 default suits most screen captures.
     */
    ratio?: string
  }>(),
  { ratio: '16 / 9' }
)

const t = useTranslate()

// Public-directory paths are absolute, so they need the site `base` prefixing
// by hand — VitePress only rewrites those for Markdown links and images.
const videoSrc = computed(() => withBase(props.src))
const posterSrc = computed(() =>
  withBase(props.poster ?? props.src.replace(/\.mp4$/, '-poster.jpg'))
)
</script>

<template>
  <figure class="video-player">
    <video
      class="video-player__video"
      :src="videoSrc"
      :poster="posterSrc"
      :style="{ aspectRatio: ratio }"
      controls
      playsinline
      preload="none"
      controlslist="nodownload"
    >
      <!-- Shown only by browsers that cannot play the file at all. -->
      <p>
        {{ t('video.unsupported') }}
        <a :href="videoSrc" download>{{ t('video.download') }}</a>
      </p>
    </video>
    <figcaption v-if="caption" class="video-player__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.video-player {
  margin: 1.5rem 0;
}

.video-player__video {
  display: block;
  width: 100%;
  max-height: 70vh;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: #000;
}

.video-player__caption {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.85em;
  color: var(--vp-c-text-2);
}
</style>
