<script setup lang="ts">
// Click-to-open viewer for every screenshot in the guide.
//
// The images are dense screenshots of booking systems and forms, so seeing one
// at page width is often not enough: this opens it full screen, and lets the
// reader zoom (wheel, pinch, buttons, double click), pan, and step through the
// other images on the same page.
//
// Rather than binding a handler to each <img>, one delegated listener on the
// document catches clicks inside `.vp-doc` — so images added by a route change
// or by a Vue component work with no re-scanning.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTranslate } from '../useTranslate'

const t = useTranslate()

const MIN_SCALE = 1
const MAX_SCALE = 6
/** Scale a double click (or double tap) jumps to. */
const DOUBLE_CLICK_SCALE = 2.5

const open = ref(false)
const images = ref<HTMLImageElement[]>([])
const index = ref(0)
const scale = ref(1)
const offset = ref({ x: 0, y: 0 })

const current = computed(() => images.value[index.value])
const src = computed(() => current.value?.currentSrc || current.value?.src || '')
const caption = computed(() => current.value?.alt ?? '')
const hasSiblings = computed(() => images.value.length > 1)
const canZoomIn = computed(() => scale.value < MAX_SCALE)
const canZoomOut = computed(() => scale.value > MIN_SCALE)

function zoomable(element: EventTarget | null): element is HTMLImageElement {
  return (
    element instanceof HTMLImageElement &&
    !!element.closest('.vp-doc') &&
    // Icons and badges inside links are navigation, not content.
    !element.closest('a') &&
    !element.hasAttribute('data-no-zoom')
  )
}

function onDocumentClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return
  const target = event.target
  if (!zoomable(target)) return

  const all = Array.from(
    document.querySelectorAll<HTMLImageElement>('.vp-doc img')
  ).filter((image) => zoomable(image))

  images.value = all
  index.value = Math.max(0, all.indexOf(target))
  reset()
  open.value = true
}

function reset() {
  scale.value = 1
  offset.value = { x: 0, y: 0 }
}

function close() {
  open.value = false
}

function step(delta: number) {
  if (!hasSiblings.value) return
  const count = images.value.length
  index.value = (index.value + delta + count) % count
  reset()
}

function zoomBy(factor: number, origin?: { x: number; y: number }) {
  const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.value * factor))
  if (next === scale.value) return

  if (origin) {
    // Keep the point under the cursor fixed while the image grows around it.
    const ratio = next / scale.value
    offset.value = {
      x: origin.x - (origin.x - offset.value.x) * ratio,
      y: origin.y - (origin.y - offset.value.y) * ratio
    }
  }

  scale.value = next
  if (next === MIN_SCALE) offset.value = { x: 0, y: 0 }
}

function originOf(event: { clientX: number; clientY: number }) {
  return {
    x: event.clientX - window.innerWidth / 2,
    y: event.clientY - window.innerHeight / 2
  }
}

function onWheel(event: WheelEvent) {
  zoomBy(event.deltaY < 0 ? 1.15 : 1 / 1.15, originOf(event))
}

function onDoubleClick(event: MouseEvent) {
  if (scale.value > 1) reset()
  else zoomBy(DOUBLE_CLICK_SCALE / scale.value, originOf(event))
}

// --- Pointer handling: one pointer pans, two pinch. -------------------------

const pointers = new Map<number, { x: number; y: number }>()
let panStart: { x: number; y: number; offsetX: number; offsetY: number } | null = null
let pinchStart: { distance: number; scale: number } | null = null

function pointerDistance() {
  const [a, b] = Array.from(pointers.values())
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function onPointerDown(event: PointerEvent) {
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  // Capture keeps a drag alive when the cursor leaves the image, but it throws
  // if the pointer is no longer active — which must not abort the gesture.
  try {
    ;(event.target as Element).setPointerCapture?.(event.pointerId)
  } catch {
    /* dragging still works without capture */
  }

  if (pointers.size === 2) {
    pinchStart = { distance: pointerDistance(), scale: scale.value }
    panStart = null
  } else if (pointers.size === 1 && scale.value > 1) {
    panStart = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.value.x,
      offsetY: offset.value.y
    }
  }
}

function onPointerMove(event: PointerEvent) {
  if (!pointers.has(event.pointerId)) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  if (pinchStart && pointers.size === 2) {
    const distance = pointerDistance()
    if (pinchStart.distance > 0) {
      const target = (pinchStart.scale * distance) / pinchStart.distance
      zoomBy(target / scale.value)
    }
    return
  }

  if (panStart) {
    offset.value = {
      x: panStart.offsetX + (event.clientX - panStart.x),
      y: panStart.offsetY + (event.clientY - panStart.y)
    }
  }
}

function onPointerUp(event: PointerEvent) {
  pointers.delete(event.pointerId)
  if (pointers.size < 2) pinchStart = null
  if (pointers.size === 0) panStart = null
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value) return
  const handlers: Record<string, () => void> = {
    Escape: close,
    ArrowRight: () => step(1),
    ArrowLeft: () => step(-1),
    '+': () => zoomBy(1.3),
    '=': () => zoomBy(1.3),
    '-': () => zoomBy(1 / 1.3),
    '0': reset
  }
  const handler = handlers[event.key]
  if (!handler) return
  event.preventDefault()
  handler()
}

// Keep the page behind the overlay still while it is open.
watch(open, (isOpen) => {
  document.documentElement.classList.toggle('lightbox-open', isOpen)
})

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('keydown', onKeydown)
  document.documentElement.classList.remove('lightbox-open')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="open"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="t('lightbox.dialog')"
        @click.self="close"
        @wheel.prevent="onWheel"
      >
        <div class="lightbox__toolbar" @click.stop>
          <button
            class="lightbox__button"
            :title="t('lightbox.zoomOut')"
            :aria-label="t('lightbox.zoomOut')"
            :disabled="!canZoomOut"
            @click="zoomBy(1 / 1.3)"
          >
            &minus;
          </button>
          <span class="lightbox__scale">{{ Math.round(scale * 100) }}%</span>
          <button
            class="lightbox__button"
            :title="t('lightbox.zoomIn')"
            :aria-label="t('lightbox.zoomIn')"
            :disabled="!canZoomIn"
            @click="zoomBy(1.3)"
          >
            +
          </button>
          <button
            class="lightbox__button"
            :title="t('lightbox.reset')"
            :aria-label="t('lightbox.reset')"
            @click="reset"
          >
            ⤢
          </button>
          <button
            class="lightbox__button"
            :title="t('lightbox.close')"
            :aria-label="t('lightbox.close')"
            @click="close"
          >
            ✕
          </button>
        </div>

        <button
          v-if="hasSiblings"
          class="lightbox__nav lightbox__nav--prev"
          :title="t('lightbox.previous')"
          :aria-label="t('lightbox.previous')"
          @click.stop="step(-1)"
        >
          ‹
        </button>
        <button
          v-if="hasSiblings"
          class="lightbox__nav lightbox__nav--next"
          :title="t('lightbox.next')"
          :aria-label="t('lightbox.next')"
          @click.stop="step(1)"
        >
          ›
        </button>

        <img
          class="lightbox__image"
          :class="{ 'lightbox__image--zoomed': scale > 1 }"
          :src="src"
          :alt="caption"
          :style="{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`
          }"
          draggable="false"
          @click.stop
          @dblclick.stop="onDoubleClick"
          @pointerdown.prevent="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        />

        <div class="lightbox__footer" @click.stop>
          <p v-if="caption" class="lightbox__caption">{{ caption }}</p>
          <p v-if="hasSiblings" class="lightbox__counter">
            {{ index + 1 }} / {{ images.length }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1rem 4.5rem;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  overflow: hidden;
  cursor: zoom-out;
}

.lightbox__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
  background: #fff;
  cursor: zoom-in;
  touch-action: none;
  user-select: none;
  transition: transform 0.12s ease-out;
  will-change: transform;
}

.lightbox__image--zoomed {
  cursor: grab;
}

.lightbox__image--zoomed:active {
  cursor: grabbing;
}

/* The controls sit above the image, which can be wide enough to reach the
   edges of the screen. */
.lightbox__toolbar,
.lightbox__nav,
.lightbox__footer {
  z-index: 1;
}

.lightbox__toolbar {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.55);
  cursor: default;
}

.lightbox__scale {
  min-width: 3.25rem;
  text-align: center;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.85);
}

.lightbox__button {
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  font-size: 1rem;
  line-height: 1;
  color: #fff;
  transition: background-color 0.2s;
}

.lightbox__button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.18);
}

.lightbox__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  font-size: 1.75rem;
  line-height: 1;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  transition: background-color 0.2s;
}

.lightbox__nav:hover {
  background: rgba(255, 255, 255, 0.22);
}

.lightbox__nav--prev {
  left: 0.75rem;
}

.lightbox__nav--next {
  right: 0.75rem;
}

.lightbox__footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.75rem 1rem 1rem;
  text-align: center;
  cursor: default;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

.lightbox__caption {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.92);
}

.lightbox__counter {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.6);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.18s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .lightbox {
    padding: 3.25rem 0.25rem 4rem;
  }

  .lightbox__nav {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.4rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lightbox__image,
  .lightbox-enter-active,
  .lightbox-leave-active {
    transition: none;
  }
}
</style>
