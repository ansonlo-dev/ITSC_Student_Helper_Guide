<script setup lang="ts">
// The teaching-room equipment and software list.
//
// The sheet is 114 rooms x 20 columns. As a table that is 2280 cells, most of
// them blank, scrolling sideways off a phone — so it is inverted: filter down
// to the handful of rooms you care about, then open one card for its full
// twenty rows.
//
// The questions this is actually asked, in order: "what is in LKK205?" (a
// helper standing in the room with a checklist), "which rooms have a PTZ camera
// / a ceiling mic / a printer?" (a helper covering somebody else's round), and
// "where is Matlab, and which version?" (the counter). Hence a search box that
// matches equipment as well as room codes, and chips with live counts rather
// than a sortable header — the count answers the second question without even
// clicking.
import { computed, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { useTranslate } from '../useTranslate'
import {
  ATTRIBUTE_GROUPS,
  BUILDINGS,
  ROOMS,
  ROOM_TYPES,
  type Attribute,
  type Room,
  type Spec
} from '../../data/rooms'

const t = useTranslate()
const { lang } = useData()

/** Everything except the software group — what "nothing recorded" means. */
const EQUIPMENT: Attribute[] = [
  ...ATTRIBUTE_GROUPS.teachingStation,
  ...ATTRIBUTE_GROUPS.display,
  ...ATTRIBUTE_GROUPS.camera,
  ...ATTRIBUTE_GROUPS.opticalDrive,
  ...ATTRIBUTE_GROUPS.network,
  ...ATTRIBUTE_GROUPS.mic,
  ...ATTRIBUTE_GROUPS.printer
]

const has = (room: Room, ...keys: Attribute[]) => keys.some((key) => key in room.equipment)

/**
 * The filter chips, in two rows. Several span more than one column, because a
 * reader asks "is there a wireless mic in there" rather than naming infrared
 * and digital separately.
 */
const EQUIPMENT_NEEDS: { key: string; test: (r: Room) => boolean }[] = [
  { key: 'computer', test: (r) => has(r, 'pcDual', 'notebook') },
  { key: 'projector', test: (r) => has(r, 'projector') },
  { key: 'displayPanel', test: (r) => has(r, 'displayPanel') },
  { key: 'visualizer', test: (r) => has(r, 'visualizer') },
  { key: 'webcam', test: (r) => has(r, 'webcam') },
  { key: 'ptz', test: (r) => has(r, 'ptz') },
  { key: 'opticalDrive', test: (r) => has(r, 'usbBluray', 'cdRom') },
  { key: 'wirelessGateway', test: (r) => has(r, 'wirelessGateway') },
  { key: 'wirelessMic', test: (r) => has(r, 'irWirelessMic', 'digitalWirelessMic') },
  { key: 'ceilingMic', test: (r) => has(r, 'ceilingMic') },
  { key: 'printer', test: (r) => has(r, 'printer') }
]

const SOFTWARE_NEEDS: { key: string; test: (r: Room) => boolean }[] = [
  { key: 'xclass', test: (r) => has(r, 'xclass') },
  { key: 'spssAmos', test: (r) => has(r, 'spssAmos') },
  { key: 'sdl', test: (r) => has(r, 'sdl') },
  { key: 'matlab', test: (r) => has(r, 'matlab') }
]

const NEEDS = [...EQUIPMENT_NEEDS, ...SOFTWARE_NEEDS]

const query = ref('')
const buildings = ref(new Set<string>())
const roomType = ref('')
const needs = ref(new Set<string>())
const open = ref(new Set<string>())

/** Room code, hall name, building, room type and every qualifier on the card —
 *  so "video wall", "on-loan" or "互動屏" all find their rooms. */
const haystack = computed(() => {
  const index = new Map<string, string>()
  for (const room of ROOMS) {
    const words = [room.code, room.name, room.building, t.value(`rooms.type.${room.type}`)]
    for (const specs of Object.values(room.equipment)) {
      for (const spec of specs as Spec[]) {
        if (spec.note) words.push(t.value(`rooms.note.${spec.note}`))
      }
    }
    for (const key of Object.keys(room.equipment)) words.push(t.value(`rooms.attr.${key}`))
    index.set(room.id, words.join(' ').toLowerCase())
  }
  return index
})

const passQuery = (room: Room) => {
  const q = query.value.trim().toLowerCase()
  return !q || (haystack.value.get(room.id) ?? '').includes(q)
}
const passBuilding = (room: Room) =>
  buildings.value.size === 0 || buildings.value.has(room.building)
const passType = (room: Room) => !roomType.value || room.type === roomType.value
/** `except` is how a chip counts what it would return if it were switched on. */
const passNeeds = (room: Room, except?: string) =>
  NEEDS.every((need) => !needs.value.has(need.key) || need.key === except || need.test(room))

const results = computed(() =>
  ROOMS.filter(
    (room) => passQuery(room) && passBuilding(room) && passType(room) && passNeeds(room)
  )
)

/** Results keep the sheet's order, which is already grouped by building. */
const groups = computed(() => {
  const out: { building: string; rooms: Room[] }[] = []
  for (const room of results.value) {
    const last = out[out.length - 1]
    if (last?.building === room.building) last.rooms.push(room)
    else out.push({ building: room.building, rooms: [room] })
  }
  return out
})

const needCount = (need: { key: string; test: (r: Room) => boolean }) =>
  ROOMS.filter(
    (room) =>
      passQuery(room) &&
      passBuilding(room) &&
      passType(room) &&
      passNeeds(room, need.key) &&
      need.test(room)
  ).length

const buildingCount = (building: string) =>
  ROOMS.filter(
    (room) => room.building === building && passQuery(room) && passType(room) && passNeeds(room)
  ).length

const typeCount = (type: string) =>
  ROOMS.filter(
    (room) => room.type === type && passQuery(room) && passBuilding(room) && passNeeds(room)
  ).length

/** Room types the sheet actually uses, with the empty ones dropped from the menu. */
const typeOptions = computed(() =>
  ROOM_TYPES.map((type) => ({ type, count: typeCount(type) })).filter(
    (option) => option.count > 0 || option.type === roomType.value
  )
)

const isFiltered = computed(
  () =>
    query.value !== '' ||
    buildings.value.size > 0 ||
    roomType.value !== '' ||
    needs.value.size > 0
)

const allOpen = computed(
  () => results.value.length > 0 && results.value.every((room) => open.value.has(room.id))
)

function toggle(set: Set<string>, key: string) {
  set.has(key) ? set.delete(key) : set.add(key)
}

function reset() {
  query.value = ''
  buildings.value.clear()
  roomType.value = ''
  needs.value.clear()
}

function toggleAll() {
  if (allOpen.value) for (const room of results.value) open.value.delete(room.id)
  else for (const room of results.value) open.value.add(room.id)
}

/** What the sheet records for one column; `[]` when the cell is blank. */
const specsFor = (room: Room, key: Attribute): Spec[] => room.equipment[key] ?? []

/** A cell's counts added up — `2 (B&W) / 1 (Colour)` is three machines. */
function total(room: Room, ...keys: Attribute[]) {
  let sum = 0
  for (const key of keys) for (const spec of specsFor(room, key)) sum += spec.count ?? 1
  return sum
}

const isBare = (room: Room) => !EQUIPMENT.some((key) => key in room.equipment)

/**
 * The few facts that decide whether this is the room you are thinking of. The
 * visualizer is left out on purpose — 88 of the 114 rooms have one, so a pill
 * for it costs a line of width and tells the reader nothing.
 */
function pillsFor(room: Room) {
  if (isBare(room)) return [{ key: 'bare', count: 0, tone: 'is-muted' }]
  const pills: { key: string; count: number; tone: string }[] = []
  if (has(room, 'pcDual')) pills.push({ key: 'pc', count: 0, tone: 'is-brand' })
  else if (has(room, 'notebook')) pills.push({ key: 'notebook', count: 0, tone: 'is-brand' })
  else pills.push({ key: 'noPc', count: 0, tone: 'is-muted' })
  if (has(room, 'projector'))
    pills.push({ key: 'projector', count: total(room, 'projector'), tone: '' })
  if (has(room, 'displayPanel'))
    pills.push({ key: 'panel', count: total(room, 'displayPanel'), tone: '' })
  if (has(room, 'printer')) pills.push({ key: 'printer', count: 0, tone: 'is-green' })
  return pills
}

/** `/facilities/printers` in the locale the reader is already in. */
const printerLink = computed(() => {
  const prefix = { 'zh-HK': '/zh-TW', 'zh-CN': '/zh-CN' }[lang.value] ?? ''
  return withBase(`${prefix}/facilities/printers`)
})

// Other pages deep-link to a single room — `…/facilities/rooms#lkk205` from the
// lecture room check, for instance. Open that card on arrival so the reader
// lands on the detail rather than on a collapsed row.
onMounted(() => {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (id && ROOMS.some((room) => room.id === id)) open.value.add(id)
})
</script>

<template>
  <div class="room-equipment">
    <div class="re-controls">
      <input
        v-model="query"
        type="search"
        class="re-search"
        :placeholder="t('rooms.search')"
        :aria-label="t('rooms.search')"
      />

      <div class="re-filter-row">
        <span class="re-filter-label">{{ t('rooms.filter.building') }}</span>
        <button
          v-for="building in BUILDINGS"
          :key="building"
          type="button"
          class="re-chip"
          :class="{ 'is-on': buildings.has(building), 'is-empty': buildingCount(building) === 0 }"
          :aria-pressed="buildings.has(building)"
          @click="toggle(buildings, building)"
        >
          {{ building }}
          <span class="re-chip-count">{{ buildingCount(building) }}</span>
        </button>
      </div>

      <div class="re-filter-row">
        <label class="re-filter-label" for="re-type">{{ t('rooms.filter.type') }}</label>
        <select id="re-type" v-model="roomType" class="re-select">
          <option value="">{{ t('rooms.filter.allTypes') }}</option>
          <option v-for="option in typeOptions" :key="option.type" :value="option.type">
            {{ t(`rooms.type.${option.type}`) }} ({{ option.count }})
          </option>
        </select>
      </div>

      <div class="re-filter-row">
        <span class="re-filter-label">{{ t('rooms.filter.equipment') }}</span>
        <button
          v-for="need in EQUIPMENT_NEEDS"
          :key="need.key"
          type="button"
          class="re-chip"
          :class="{ 'is-on': needs.has(need.key), 'is-empty': needCount(need) === 0 }"
          :aria-pressed="needs.has(need.key)"
          @click="toggle(needs, need.key)"
        >
          {{ t(`rooms.need.${need.key}`) }}
          <span class="re-chip-count">{{ needCount(need) }}</span>
        </button>
      </div>

      <div class="re-filter-row">
        <span class="re-filter-label">{{ t('rooms.filter.software') }}</span>
        <button
          v-for="need in SOFTWARE_NEEDS"
          :key="need.key"
          type="button"
          class="re-chip"
          :class="{ 'is-on': needs.has(need.key), 'is-empty': needCount(need) === 0 }"
          :aria-pressed="needs.has(need.key)"
          @click="toggle(needs, need.key)"
        >
          {{ t(`rooms.need.${need.key}`) }}
          <span class="re-chip-count">{{ needCount(need) }}</span>
        </button>
      </div>

      <p class="re-status" aria-live="polite">
        {{ t('rooms.showing', { shown: results.length, total: ROOMS.length }) }}
        <button v-if="isFiltered" type="button" class="re-link-button" @click="reset">
          {{ t('rooms.reset') }}
        </button>
        <button
          v-if="results.length"
          type="button"
          class="re-link-button"
          @click="toggleAll"
        >
          {{ allOpen ? t('rooms.collapseAll') : t('rooms.expandAll') }}
        </button>
      </p>
    </div>

    <p v-if="results.length === 0" class="re-empty">{{ t('rooms.none') }}</p>

    <div v-for="group in groups" :key="group.building" class="re-group">
      <h3 class="re-group-head">
        <span class="re-building">{{ group.building }}</span>
        <span class="re-group-count">{{
          t(group.rooms.length === 1 ? 'rooms.roomCountOne' : 'rooms.roomCount', {
            count: group.rooms.length
          })
        }}</span>
      </h3>

      <article v-for="room in group.rooms" :id="room.id" :key="room.id" class="re-card">
        <button
          type="button"
          class="re-head"
          :aria-expanded="open.has(room.id)"
          :aria-controls="`${room.id}-detail`"
          @click="toggle(open, room.id)"
        >
          <span class="re-head-text">
            <span class="re-where">
              <strong>{{ room.code }}</strong>
              <span v-if="room.name" class="re-room-name">{{ room.name }}</span>
            </span>
            <span class="re-sub">{{ t(`rooms.type.${room.type}`) }}</span>
          </span>

          <span class="re-pills">
            <span v-for="pill in pillsFor(room)" :key="pill.key" class="re-pill" :class="pill.tone">
              {{ t(`rooms.pill.${pill.key}`) }}
              <span v-if="pill.count > 1" class="re-pill-count">×{{ pill.count }}</span>
            </span>
          </span>

          <svg
            class="re-chevron"
            :class="{ 'is-open': open.has(room.id) }"
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

        <div v-show="open.has(room.id)" :id="`${room.id}-detail`" class="re-detail">
          <p v-if="isBare(room)" class="re-note re-bare">{{ t('rooms.bareRoom') }}</p>

          <div class="re-groups">
            <section v-for="(attributes, groupKey) in ATTRIBUTE_GROUPS" :key="groupKey">
              <h4>{{ t(`rooms.group.${groupKey}`) }}</h4>
              <dl>
                <template v-for="attribute in attributes" :key="attribute">
                  <dt>{{ t(`rooms.attr.${attribute}`) }}</dt>
                  <dd v-if="specsFor(room, attribute as Attribute).length">
                    <span
                      v-for="(spec, index) in specsFor(room, attribute as Attribute)"
                      :key="index"
                      class="re-spec"
                    >
                      <span v-if="spec.count !== null" class="re-count">{{ spec.count }}</span>
                      <span v-else-if="!spec.note" class="re-count">{{ t('rooms.yes') }}</span>
                      <span v-if="spec.note" class="re-spec-note">{{
                        t(`rooms.note.${spec.note}`)
                      }}</span>
                    </span>
                  </dd>
                  <dd v-else class="re-blank">–</dd>
                </template>
              </dl>
              <p v-if="groupKey === 'printer' && has(room, 'printer')" class="re-note">
                <a :href="printerLink">{{ t('rooms.printerLink') }}</a>
              </p>
            </section>
          </div>
        </div>
      </article>
    </div>

    <p class="re-legend">
      <span><span class="re-blank">–</span> {{ t('rooms.legend.blank') }}</span>
      <span><span class="re-count">3</span> {{ t('rooms.legend.count') }}</span>
    </p>
  </div>
</template>

<style scoped>
.room-equipment {
  margin: 1.5rem 0;
}

/* ---- Controls ---------------------------------------------------------- */

.re-controls {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.re-search {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  font-family: inherit;
}

.re-search:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.re-filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.75rem;
}

.re-filter-label {
  flex: 0 0 auto;
  min-width: 5.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}

.re-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.82rem;
  max-width: 100%;
}

.re-select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.re-chip {
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
  transition: border-color 0.15s, color 0.15s, background-color 0.15s, opacity 0.15s;
}

.re-chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

/* A chip that would return nothing stays clickable — it is the answer to
   "is there one anywhere in LKK?" — but says so by fading. */
.re-chip.is-empty {
  opacity: 0.45;
}

.re-chip.is-on {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
  opacity: 1;
}

.re-chip-count {
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--vp-c-gray-soft);
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
}

.re-chip.is-on .re-chip-count {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
}

.re-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 1rem;
  margin: 0.85rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
}

.re-link-button {
  border: 0;
  background: none;
  padding: 0;
  color: var(--vp-c-brand-1);
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
}

.re-empty {
  margin: 1.5rem 0;
  text-align: center;
  color: var(--vp-c-text-2);
}

/* ---- Building groups --------------------------------------------------- */

.re-group {
  margin-top: 1.5rem;
}

/* `.vp-doc h3` would give this a top border and a link anchor; it is a divider
   in a list, not a section of the page's prose. */
.re-group-head {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin: 0 0 0.5rem;
  padding: 0;
  border: 0;
  letter-spacing: normal;
}

.re-building {
  font-size: 0.95rem;
  font-weight: 600;
}

.re-group-count {
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  font-weight: 400;
}

/* ---- Cards ------------------------------------------------------------- */

.re-card {
  margin-top: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  overflow: hidden;
  /* Anchored from another page: keep the card clear of the sticky nav bar. */
  scroll-margin-top: 6rem;
}

.re-card:hover {
  border-color: var(--vp-c-border);
}

.re-head {
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

.re-head:hover {
  background: var(--vp-c-bg-soft);
}

.re-head-text {
  flex: 1 1 auto;
  min-width: 0;
}

.re-where {
  display: block;
}

.re-where strong {
  font-weight: 600;
}

.re-room-name {
  margin-left: 0.4rem;
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}

.re-sub {
  display: block;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
}

.re-pills {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.3rem;
}

.re-pill {
  padding: 0.1rem 0.45rem;
  border-radius: 5px;
  background: var(--vp-c-gray-soft);
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
  white-space: nowrap;
}

.re-pill.is-brand {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.re-pill.is-green {
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
  font-weight: 600;
}

.re-pill.is-muted {
  color: var(--vp-c-text-3);
}

.re-pill-count {
  font-variant-numeric: tabular-nums;
  opacity: 0.75;
}

.re-chevron {
  flex: 0 0 auto;
  color: var(--vp-c-text-3);
  transition: transform 0.18s ease;
}

.re-chevron.is-open {
  transform: rotate(90deg);
}

/* ---- Detail ------------------------------------------------------------ */

.re-detail {
  padding: 0.85rem 0.85rem 0.95rem;
  border-top: 1px solid var(--vp-c-divider);
}

/* Multi-column rather than grid: the eight groups are 1 to 5 rows tall, and a
   grid would align them all to the tallest. Columns pack them by height
   instead, and collapse to one below ~590px. */
.re-groups {
  columns: 265px;
  column-gap: 1.75rem;
}

.re-groups > section {
  margin-bottom: 1.1rem;
  break-inside: avoid;
}

.re-groups h4 {
  margin: 0 0 0.4rem;
  color: var(--vp-c-text-3);
  font-size: 0.74rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Label left, the sheet's value right. Both columns wrap, so a long note like
   `42" Touch Screen in Discussion room` folds instead of overflowing. */
.re-groups dl {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0;
  margin: 0;
}

.re-groups dt,
.re-groups dd {
  margin: 0;
  padding: 0.2rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
  line-height: 1.5;
}

.re-groups dt {
  padding-right: 0.5rem;
  color: var(--vp-c-text-2);
}

.re-groups dd {
  text-align: right;
}

/* Two entries in one cell — a webcam facing the teacher and one facing the
   students — stack rather than run together on one line. */
.re-spec {
  display: block;
}

.re-count {
  color: var(--vp-c-text-1);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.re-spec-note {
  margin-left: 0.35rem;
  color: var(--vp-c-text-2);
}

/* A blank cell is not a confirmed "no", so it stays grey and quiet rather than
   taking the red of a real warning. */
.re-blank {
  color: var(--vp-c-text-3);
}

.re-note {
  margin: 0.5rem 0 0;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  line-height: 1.6;
}

.re-bare {
  margin: 0 0 0.85rem;
  padding: 0.5rem 0.7rem;
  border-left: 2px solid var(--vp-c-border);
  border-radius: 0 6px 6px 0;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.re-legend {
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

.re-legend > span {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

/* ---- Narrow screens ---------------------------------------------------- */

@media (max-width: 560px) {
  .re-filter-label {
    flex: 1 0 100%;
    min-width: 0;
  }

  .re-head {
    flex-wrap: wrap;
  }

  .re-head-text {
    flex: 1 1 calc(100% - 2rem);
  }

  /* The pills drop to a second line, but the chevron stays up beside the room
     code — ordered past them so a full-width pill row does not push it down. */
  .re-pills {
    order: 3;
    flex: 1 1 100%;
    justify-content: flex-start;
    margin-top: 0.35rem;
  }

  .re-chevron {
    order: 2;
    align-self: flex-start;
    margin-top: 0.25rem;
  }
}
</style>
