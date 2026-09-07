<script setup lang="ts">
// The ITSC printer directory.
//
// The source sheet records 18 capabilities per machine — colour, A3, duplex,
// five kinds of computer, three kinds of phone, scanning, copying, Octopus,
// charging, paper. Rendered as one table that is 18 columns of ticks nobody can
// read, and on a phone it is hopeless. So: filter first, then one card per
// machine showing only what decides the answer, with the full 18 columns one
// click away.
//
// The questions this is actually asked, in order: "where can a student print in
// colour / A3?", "can they print from their own laptop?", "which ones are free?"
// — hence the chip row rather than a sort-by-column header.
import { computed, onMounted, ref } from 'vue'
import { useTranslate } from '../useTranslate'
import {
  FEATURE_GROUPS,
  PRINTERS,
  type Feature,
  type Printer,
  type Support
} from '../../data/printers'

const t = useTranslate()

/**
 * The filter chips. Three of them span several columns, because a reader asks
 * "can I print from my own laptop" rather than naming an operating system.
 * `untested` deliberately does not count as a match — a chip should only ever
 * return machines somebody has actually made work.
 */
const NEEDS: { key: string; test: (p: Printer) => boolean }[] = [
  { key: 'colour', test: (p) => p.features.colour === 'yes' },
  { key: 'a3', test: (p) => p.features.a3 === 'yes' },
  { key: 'duplex', test: (p) => p.features.duplex === 'yes' },
  { key: 'scanToEmail', test: (p) => p.features.scanToEmail === 'yes' },
  { key: 'copy', test: (p) => p.features.copy === 'yes' },
  {
    key: 'ownDevice',
    test: (p) =>
      p.features.personalWindows === 'yes' ||
      p.features.personalMac === 'yes' ||
      p.features.personalLinux === 'yes'
  },
  {
    key: 'mobile',
    test: (p) =>
      p.features.webPdf === 'yes' || p.features.android === 'yes' || p.features.ios === 'yes'
  },
  { key: 'free', test: (p) => p.features.charged === 'no' }
]

const query = ref('')
const needs = ref(new Set<string>())
const open = ref(new Set<string>())
const copied = ref('')

/** Everything worth typing into the search box: room, address, brand, model. */
const haystack = (p: Printer) =>
  [p.location, p.name, p.ip, p.host, p.brand, p.model].join(' ').toLowerCase()

const matches = (p: Printer) => {
  for (const need of NEEDS) {
    if (needs.value.has(need.key) && !need.test(p)) return false
  }
  const q = query.value.trim().toLowerCase()
  return !q || haystack(p).includes(q)
}

const results = computed(() => PRINTERS.filter(matches))

const isFiltered = computed(() => query.value !== '' || needs.value.size > 0)

function toggleNeed(key: string) {
  needs.value.has(key) ? needs.value.delete(key) : needs.value.add(key)
}

function toggleCard(id: string) {
  open.value.has(id) ? open.value.delete(id) : open.value.add(id)
}

function reset() {
  query.value = ''
  needs.value.clear()
}

/**
 * The four facts that decide whether this is the machine you want. Duplex and
 * copy are left out on purpose: nearly every machine does both, so a pill for
 * them costs a line of width and tells the reader nothing.
 */
function pillsFor(p: Printer) {
  const pills = [
    p.features.colour === 'yes'
      ? { key: 'colour', tone: 'is-colour' }
      : { key: 'bw', tone: 'is-plain' }
  ]
  if (p.features.a3 === 'yes') pills.push({ key: 'a3', tone: 'is-plain' })
  if (p.features.scanToEmail === 'yes') pills.push({ key: 'scan', tone: 'is-plain' })
  if (p.features.charged === 'no') pills.push({ key: 'free', tone: 'is-free' })
  else if (p.features.charged === 'yes') pills.push({ key: 'paid', tone: 'is-plain' })
  return pills
}

const GLYPHS: Record<Support, string> = { yes: '✓', no: '✕', untested: '?', unknown: '–' }

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = text
    setTimeout(() => (copied.value === text ? (copied.value = '') : null), 1600)
  } catch {
    // No clipboard permission (or an insecure origin) — the address is on
    // screen and selectable, so fail quietly rather than throwing an error at
    // somebody who is mid-shift.
  }
}

// Other pages deep-link to a single machine — `…/facilities/printers#sekg02-colour-copier`
// from the printer check duty, for instance. Open that card on arrival so the
// reader lands on the detail rather than on a collapsed row.
onMounted(() => {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (id && PRINTERS.some((p) => p.id === id)) open.value.add(id)
})
</script>

<template>
  <div class="printer-directory">
    <div class="pd-controls">
      <input
        v-model="query"
        type="search"
        class="pd-search"
        :placeholder="t('printers.search')"
        :aria-label="t('printers.search')"
      />

      <div class="pd-filter-row">
        <span class="pd-filter-label">{{ t('printers.filter.needs') }}</span>
        <button
          v-for="need in NEEDS"
          :key="need.key"
          type="button"
          class="pd-chip"
          :class="{ 'is-on': needs.has(need.key) }"
          :aria-pressed="needs.has(need.key)"
          @click="toggleNeed(need.key)"
        >
          {{ t(`printers.need.${need.key}`) }}
        </button>
      </div>

      <p class="pd-status" aria-live="polite">
        {{ t('printers.showing', { shown: results.length, total: PRINTERS.length }) }}
        <button v-if="isFiltered" type="button" class="pd-reset" @click="reset">
          {{ t('printers.reset') }}
        </button>
      </p>
    </div>

    <p v-if="results.length === 0" class="pd-empty">{{ t('printers.none') }}</p>

    <div class="pd-list">
      <article v-for="printer in results" :id="printer.id" :key="printer.id" class="pd-card">
        <button
          type="button"
          class="pd-head"
          :aria-expanded="open.has(printer.id)"
          :aria-controls="`${printer.id}-detail`"
          @click="toggleCard(printer.id)"
        >
          <span class="pd-head-text">
            <span class="pd-where">
              <strong>{{ printer.location }}</strong>
              <span v-if="printer.name" class="pd-machine">{{ printer.name }}</span>
            </span>
            <span class="pd-sub">{{ printer.brand }} {{ printer.model }}</span>
          </span>

          <span class="pd-pills">
            <span
              v-for="pill in pillsFor(printer)"
              :key="pill.key"
              class="pd-pill"
              :class="pill.tone"
            >
              {{ t(`printers.pill.${pill.key}`) }}
            </span>
          </span>

          <svg
            class="pd-chevron"
            :class="{ 'is-open': open.has(printer.id) }"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <path
              d="M8 5l8 7-8 7"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div v-show="open.has(printer.id)" :id="`${printer.id}-detail`" class="pd-detail">
          <dl class="pd-address">
            <div>
              <dt>{{ t('printers.field.ip') }}</dt>
              <dd>
                <code>{{ printer.ip }}</code>
                <button type="button" class="pd-copy" @click="copy(printer.ip)">
                  {{ copied === printer.ip ? t('printers.copied') : t('printers.copy') }}
                </button>
              </dd>
            </div>
            <div>
              <dt>{{ t('printers.field.host') }}</dt>
              <dd>
                <code>{{ printer.host }}</code>
                <button type="button" class="pd-copy" @click="copy(printer.host)">
                  {{ copied === printer.host ? t('printers.copied') : t('printers.copy') }}
                </button>
              </dd>
            </div>
          </dl>

          <div class="pd-features">
            <section v-for="(features, groupKey) in FEATURE_GROUPS" :key="groupKey">
              <h4>{{ t(`printers.group.${groupKey}`) }}</h4>
              <ul>
                <li v-for="feature in features" :key="feature">
                  <span class="pd-feature-name">{{ t(`printers.feature.${feature}`) }}</span>
                  <span
                    class="pd-mark"
                    :class="`is-${printer.features[feature as Feature]}`"
                    :title="t(`printers.support.${printer.features[feature as Feature]}`)"
                  >
                    {{ GLYPHS[printer.features[feature as Feature]] }}
                    <span class="pd-sr">{{
                      t(`printers.support.${printer.features[feature as Feature]}`)
                    }}</span>
                  </span>
                </li>
              </ul>
              <p v-if="groupKey === 'printFrom'" class="pd-note">
                {{ t('printers.note.campusNetwork') }}
              </p>
            </section>
          </div>

          <p v-if="printer.mobile" class="pd-note pd-how">
            {{ t(`printers.mobile.${printer.mobile}`) }}
          </p>

          <section v-if="printer.queues.length" class="pd-queues">
            <h4>{{ t('printers.queues.title') }}</h4>
            <div v-for="queue in printer.queues" :key="queue.uri" class="pd-queue">
              <code>{{ queue.uri }}</code>
              <button type="button" class="pd-copy" @click="copy(queue.uri)">
                {{ copied === queue.uri ? t('printers.copied') : t('printers.copy') }}
              </button>
              <span v-if="queue.driver" class="pd-driver">
                {{ t('printers.queues.driver') }}: {{ queue.driver }}
              </span>
            </div>
            <p class="pd-note">{{ t('printers.queues.note') }}</p>
          </section>
        </div>
      </article>
    </div>

    <p class="pd-legend">
      <span><span class="pd-mark is-yes">✓</span> {{ t('printers.support.yes') }}</span>
      <span><span class="pd-mark is-no">✕</span> {{ t('printers.support.no') }}</span>
      <span><span class="pd-mark is-untested">?</span> {{ t('printers.legend.untested') }}</span>
      <span><span class="pd-mark is-unknown">–</span> {{ t('printers.legend.unknown') }}</span>
    </p>
  </div>
</template>

<style scoped>
.printer-directory {
  margin: 1.5rem 0;
}

/* ---- Controls ---------------------------------------------------------- */

.pd-controls {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.pd-search {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  font-family: inherit;
}

.pd-search:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.pd-filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.75rem;
}

.pd-filter-label {
  flex: 0 0 auto;
  min-width: 4.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}

.pd-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  line-height: 1.5;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background-color 0.15s;
}

.pd-chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.pd-chip.is-on {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.pd-chip-count {
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--vp-c-gray-soft);
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
}

.pd-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.85rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
}

.pd-reset {
  border: 0;
  background: none;
  padding: 0;
  color: var(--vp-c-brand-1);
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
}

.pd-empty {
  margin: 1.5rem 0;
  text-align: center;
  color: var(--vp-c-text-2);
}

/* ---- Cards ------------------------------------------------------------- */

.pd-list {
  margin-top: 1rem;
}

.pd-card {
  margin-top: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  overflow: hidden;
}

/* Anchored from another page: keep the card clear of the sticky nav bar. */
.pd-card {
  scroll-margin-top: 6rem;
}

.pd-card:hover {
  border-color: var(--vp-c-border);
}

.pd-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.7rem 0.85rem;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.pd-head:hover {
  background: var(--vp-c-bg-soft);
}

.pd-head-text {
  flex: 1 1 auto;
  min-width: 0;
}

.pd-where {
  display: block;
}

.pd-where strong {
  font-weight: 600;
}

.pd-machine {
  margin-left: 0.4rem;
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}

.pd-sub {
  display: block;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
}

.pd-pills {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.3rem;
}

.pd-pill {
  padding: 0.1rem 0.45rem;
  border-radius: 5px;
  background: var(--vp-c-gray-soft);
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
  white-space: nowrap;
}

.pd-pill.is-colour {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.pd-pill.is-free {
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
  font-weight: 600;
}

.pd-chevron {
  flex: 0 0 auto;
  color: var(--vp-c-text-3);
  transition: transform 0.18s ease;
}

.pd-chevron.is-open {
  transform: rotate(90deg);
}

/* ---- Detail ------------------------------------------------------------ */

.pd-detail {
  padding: 0.25rem 0.85rem 0.95rem;
  border-top: 1px solid var(--vp-c-divider);
}

.pd-address {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 2rem;
  margin: 0.85rem 0 1.1rem;
}

.pd-address dt {
  color: var(--vp-c-text-3);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.pd-address dd {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0.1rem 0 0;
}

/* Addresses are meant to be copied and read back character by character, so
   they keep the body text colour rather than `.vp-doc`'s brand-tinted code. */
.pd-detail code {
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.82rem;
}

.pd-copy {
  padding: 0.05rem 0.4rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: none;
  color: var(--vp-c-text-3);
  font: inherit;
  font-size: 0.7rem;
  cursor: pointer;
}

.pd-copy:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* Multi-column rather than grid: the three groups are 5, 8 and 5 rows tall, and
   a grid would align them to the tallest and leave a column half empty. Columns
   pack them by height instead, and collapse to one below ~510px. */
.pd-features {
  columns: 240px;
  column-gap: 1.5rem;
}

.pd-features > section {
  margin-bottom: 1.1rem;
  break-inside: avoid;
}

.pd-features h4 {
  margin: 0 0 0.4rem;
  color: var(--vp-c-text-3);
  font-size: 0.74rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.pd-features ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* `margin-top` is reset because `.vp-doc li + li` would otherwise space these
   out like prose bullets; the rows are a table, not a list of points. */
.pd-features li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0;
  padding: 0.15rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
  line-height: 1.5;
}

.pd-feature-name {
  color: var(--vp-c-text-2);
}

/* Status is read at a glance down a column, so it carries colour as well as a
   glyph — but "no" stays grey. Most of the noes are "this machine simply does
   not do that", which red would overstate next to the guide's real warnings. */
.pd-mark {
  flex: 0 0 auto;
  font-weight: 600;
}

.pd-mark.is-yes {
  color: var(--vp-c-green-1);
}

.pd-mark.is-no {
  color: var(--vp-c-text-3);
}

.pd-mark.is-untested {
  color: var(--vp-c-warning-1);
}

.pd-mark.is-unknown {
  color: var(--vp-c-text-3);
}

.pd-note {
  margin: 0.5rem 0 0;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  line-height: 1.6;
}

.pd-how {
  margin-top: 1rem;
  padding: 0.5rem 0.7rem;
  border-left: 2px solid var(--vp-c-brand-1);
  border-radius: 0 6px 6px 0;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.pd-queues {
  margin-top: 1rem;
}

.pd-queues h4 {
  margin: 0 0 0.4rem;
  color: var(--vp-c-text-3);
  font-size: 0.74rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.pd-queue {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0;
}

.pd-driver {
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
}

.pd-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.25rem;
  margin: 1.5rem 0 0;
  padding-top: 0.85rem;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  line-height: 1.6;
}

.pd-legend > span {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

/* Visible glyph plus a spoken word, so a screen reader does not read "✓". */
.pd-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ---- Narrow screens ---------------------------------------------------- */

@media (max-width: 560px) {
  .pd-filter-label {
    flex: 1 0 100%;
    min-width: 0;
  }

  .pd-head {
    flex-wrap: wrap;
  }

  .pd-head-text {
    flex: 1 1 calc(100% - 2rem);
  }

  /* The pills drop to a second line, but the chevron stays up beside the room
     name — ordered past them so a full-width pill row does not push it down. */
  .pd-pills {
    order: 3;
    flex: 1 1 100%;
    justify-content: flex-start;
    margin-top: 0.35rem;
  }

  .pd-chevron {
    order: 2;
    align-self: flex-start;
    margin-top: 0.25rem;
  }
}
</style>
