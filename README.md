# ITSC Student Helper Guide

A trilingual VitePress static site documenting duties, procedures and practical
tips for ITSC Student Helpers at Lingnan University.

Languages: **English** (`/`), **繁體中文** (`/zh-TW/`), **简体中文** (`/zh-CN/`).

## Local development

```bash
bun install
bun run docs:dev      # start the dev server
bun run docs:build    # build the static site to docs/.vitepress/dist
bun run docs:preview  # preview the production build
```

## Structure

```
docs/
├── .vitepress/
│   ├── config.mts          # builds all three locales from translation keys
│   └── locales/
│       ├── index.ts        # Language type, createT(), missingKeys()
│       ├── en.ts           # UI strings — flat dot-notation keys
│       ├── zh-TW.ts
│       └── zh-CN.ts
├── index.md                # English content (root locale)
├── guide/  duties/  tips/  reference/
├── zh-TW/                  # 繁體中文 content, same tree
└── zh-CN/                  # 简体中文 content, same tree
```

## How the translations are split

Following the LingUBible convention, **UI chrome** lives in translation keys —
flat dot-notation, one file per language, `{param}` interpolation:

```ts
// docs/.vitepress/locales/zh-TW.ts
'sidebar.serviceCounter': '服務櫃檯',
```

`config.mts` builds the nav, sidebar, footer, search UI and 404 page for every
locale from those keys, so a label is written once per language and page paths
are declared once for all three.

**Page prose** stays in per-locale Markdown trees (`docs/`, `docs/zh-TW/`,
`docs/zh-CN/`) because VitePress needs real Markdown files to render frontmatter,
custom containers and the per-locale search index.

### Adding a page

1. Create the `.md` file in all three trees.
2. Add one title key per language in `docs/.vitepress/locales/*.ts`.
3. Add the path once to `sidebar()` in `docs/.vitepress/config.mts`.

Internal links must carry the locale prefix — `/zh-TW/duties/printing` from a
`zh-TW` page. The build fails on dead links, so mistakes surface immediately.

### Keeping 简体中文 in sync

`docs/zh-CN` is generated from `docs/zh-TW` by OpenCC character conversion plus a
HK/TW → Mainland terminology pass (伺服器→服务器, 咪高峰→麦克风, 「」→“”, …):

```bash
pip install opencc-python-reimplemented
python3 scripts/sync-zh-cn.py     # run from the repo root
```

Re-run it after editing `docs/zh-TW`, then review the output — the terminology
map in the script is a starting point, not a substitute for a read-through.

### Checking for missing keys

`missingKeys(lang)` in `docs/.vitepress/locales/index.ts` lists keys present in
English but absent from another language. Missing keys fall back to English
rather than breaking the build.

## Media

Screenshots and photos live in `docs/public/images/` and are shared by all three
locales — only the alt text and caption differ per language. They were extracted
from the orientation deck with `mutool extract`, then resized to 1400px and
re-encoded as JPEG.

Two screen recordings of the booking system live in `docs/public/videos/`.

::: warning Repository size
The two MP4s are ~64 MB combined and are committed directly. Re-encoding them
(H.264, CRF 28) would cut that to a few MB; consider that or Git LFS before the
repo grows further.
:::

Images are styled by `docs/.vitepress/theme/custom.css` — a border, rounded
corners and a height cap, with an italic line directly under an image rendered
as its caption.

## Sources

Everything on the site is derived from the originals kept in `ref/`:

| Source | Covers |
| --- | --- |
| `ITSC Student Helper Orientation_paul_20260817.pdf` (82 slides, repo root) | Team, workflow, duty schedule, systems, salary |
| `20260324 Morning Check Training Summary.md` | Morning Check rationale, item-by-item guidance, work evidence |
| `20260402 Computer Lab Check Training Summary.md` | Lab check flow, XClass, camera methods, end-of-check routine |
| `training.md` | Counter tasks, printer handling, Do's and Don'ts, software coverage |
| `counter_checklist_2.pdf` | Counter Checklist questions |
| `issues_received_by_ITSC_student_helper.pdf` | Enquiry form, all 10 questions |
| `morning_check.pdf` | Morning Check form, page 1 of 4 |
| `printer_check.pdf` | Printer & Paper Stock Check, all questions |
| `computer_lab_checklist.pdf`, `computer_lab_checklist_2.pdf` | Computer Lab Checklist Q1–18 |
| `lecture_room_check_1.pdf`, `lecture_room_check_2.pdf` | Lecture Room Checklist Q1–26 |
| `hostel_clinic_checklist.pdf` | Hostel Clinic Checklist, all 25 questions |

When a form or deck changes, diff it against these pages rather than editing from
memory.

::: note
This repository contains internal ITSC operational detail — staff extensions,
system logins, and shared counter phone credentials. Keep it private.
:::

## Contributing

Blocks marked `::: info To be filled in` / `待補充` / `待确认` are placeholders
that still need details confirmed with a supervisor.
