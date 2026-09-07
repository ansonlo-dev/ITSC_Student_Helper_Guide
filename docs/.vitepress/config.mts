import { defineConfig, type DefaultTheme } from 'vitepress'
import { createT, LANGUAGES, type Language } from './locales'

const REPO = 'https://github.com/ansonlo-dev/ITSC_Student_Helper_Guide'

/** English lives at `/`; the other languages live under `/<lang>/`. */
const base = (lang: Language) => (lang === 'en' ? '' : `/${lang}`)

/**
 * Nav, sidebar and every other UI string are built from translation keys, so a
 * label is only ever written once per language in `locales/<lang>.ts`.
 * Page paths live here and are prefixed per locale.
 */
function nav(lang: Language): DefaultTheme.NavItem[] {
  const t = createT(lang)
  const p = base(lang)
  return [
    { text: t('nav.home'), link: `${p}/` },
    { text: t('nav.guide'), link: `${p}/guide/getting-started` },
    { text: t('nav.duties'), link: `${p}/duties/` },
    { text: t('nav.tips'), link: `${p}/tips/` },
    { text: t('nav.reference'), link: `${p}/reference/faq` }
  ]
}

/**
 * `collapsed: false` on a group makes it collapsible but open on arrival;
 * omitting the key would render the group as a fixed, uncollapsible heading.
 */
function sidebar(lang: Language): DefaultTheme.SidebarItem[] {
  const t = createT(lang)
  const p = base(lang)
  return [
    {
      text: t('sidebar.group.gettingStarted'),
      collapsed: false,
      items: [
        { text: t('sidebar.welcome'), link: `${p}/guide/getting-started` },
        { text: t('sidebar.firstShift'), link: `${p}/guide/first-shift` },
        { text: t('sidebar.workPrecautions'), link: `${p}/guide/code-of-conduct` },
        { text: t('sidebar.schedulePay'), link: `${p}/guide/schedule-and-pay` }
      ]
    },
    {
      text: t('sidebar.group.duties'),
      collapsed: false,
      items: [
        { text: t('sidebar.dutiesOverview'), link: `${p}/duties/` },
        { text: t('sidebar.counter'), link: `${p}/duties/service-counter` },
        { text: t('sidebar.accounts'), link: `${p}/duties/accounts` },
        { text: t('sidebar.equipmentLoan'), link: `${p}/duties/av-equipment` },
        { text: t('sidebar.morningCheck'), link: `${p}/duties/morning-check` },
        { text: t('sidebar.printerCheck'), link: `${p}/duties/printing` },
        { text: t('sidebar.labCheck'), link: `${p}/duties/lab-support` },
        { text: t('sidebar.lectureRoomCheck'), link: `${p}/duties/lecture-room-check` },
        { text: t('sidebar.hostelClinicCheck'), link: `${p}/duties/hostel-clinic-check` }
      ]
    },
    {
      text: t('sidebar.group.facilities'),
      collapsed: false,
      items: [
        { text: t('sidebar.printerDirectory'), link: `${p}/facilities/printers` },
        { text: t('sidebar.roomEquipment'), link: `${p}/facilities/rooms` }
      ]
    },
    {
      text: t('sidebar.group.tips'),
      collapsed: false,
      items: [
        { text: t('sidebar.tipsOverview'), link: `${p}/tips/` },
        { text: t('sidebar.troubleshooting'), link: `${p}/tips/troubleshooting` },
        { text: t('sidebar.communication'), link: `${p}/tips/communication` }
      ]
    },
    {
      text: t('sidebar.group.reference'),
      collapsed: false,
      items: [
        { text: t('sidebar.faq'), link: `${p}/reference/faq` },
        { text: t('sidebar.links'), link: `${p}/reference/links` },
        { text: t('sidebar.contacts'), link: `${p}/reference/contacts` }
      ]
    }
  ]
}

function themeConfig(lang: Language): DefaultTheme.Config {
  const t = createT(lang)
  const p = base(lang)
  return {
    nav: nav(lang),
    sidebar: sidebar(lang),
    outline: { level: [2, 3], label: t('theme.outline') },
    returnToTopLabel: t('theme.returnToTop'),
    sidebarMenuLabel: t('theme.sidebarMenu'),
    langMenuLabel: t('theme.langMenu'),
    darkModeSwitchLabel: t('theme.darkModeSwitch'),
    lightModeSwitchTitle: t('theme.lightModeSwitchTitle'),
    darkModeSwitchTitle: t('theme.darkModeSwitchTitle'),
    docFooter: { prev: t('theme.docFooter.prev'), next: t('theme.docFooter.next') },
    editLink: { pattern: `${REPO}/edit/main/docs/:path`, text: t('theme.editLink') },
    lastUpdatedText: t('theme.lastUpdated'),
    footer: { message: t('footer.message'), copyright: t('footer.copyright') },
    notFound: {
      title: t('notFound.title'),
      quote: t('notFound.quote'),
      linkLabel: t('notFound.linkLabel'),
      linkText: t('notFound.linkText')
    },
    socialLinks: [{ icon: 'github', link: REPO }]
  }
}

/** Per-locale strings for the built-in local search UI. */
function searchLocale(lang: Language) {
  const t = createT(lang)
  return {
    translations: {
      button: { buttonText: t('search.button'), buttonAriaLabel: t('search.button') },
      modal: {
        displayDetails: t('search.displayDetails'),
        resetButtonTitle: t('search.resetButton'),
        backButtonTitle: t('search.backButton'),
        noResultsText: t('search.noResults'),
        footer: {
          selectText: t('search.footer.selectText'),
          navigateText: t('search.footer.navigateText'),
          closeText: t('search.footer.closeText')
        }
      }
    }
  }
}

const locales = Object.fromEntries(
  LANGUAGES.map((lang) => {
    const t = createT(lang)
    return [
      lang === 'en' ? 'root' : lang,
      {
        label: t('site.label'),
        lang: t('site.lang'),
        link: `${base(lang)}/`,
        title: t('site.title'),
        description: t('site.description'),
        themeConfig: themeConfig(lang)
      }
    ]
  })
)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/ITSC_Student_Helper_Guide/',
  title: createT('en')('site.title'),
  description: createT('en')('site.description'),
  lang: 'en-US',
  cleanUrls: true,

  // LXGW WenKai, in its Simplified and Traditional cuts. Each stylesheet is cut
  // into ~97 unicode-range subsets, so a reader only downloads the slices their
  // page actually renders, and every face is `font-display: swap` — text is
  // readable in the fallback immediately and the webfont swaps in behind it.
  // `custom.css` picks the cut per locale.
  //
  // Regular only, deliberately. A Chinese page touches enough subsets that
  // adding the bold cut roughly doubles the font bytes, and WenKai's real bold
  // is so close to its regular that emphasis barely reads; the browser's
  // synthesised bold is both free and easier to see. Measured on
  // zh-TW/guide/schedule-and-pay: 6.3 MB with the bold cut, 3.2 MB without.
  head: [
    ['link', { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-regular.css' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-tc-webfont@1.2.0/lxgwwenkaitc-regular.css' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/ITSC_Student_Helper_Guide/favicon.png' }]
  ],

  /**
   * The Chinese sources wrap at about 40 characters a line. A newline inside a
   * paragraph becomes a markdown-it `softbreak`, which renders as "\n", and the
   * browser collapses that to a space — so a word split across two source lines
   * shows up as "積金易平 台" on the page. Every Chinese page had a handful of
   * these; it only became obvious once WenKai widened the text.
   *
   * Drop the break when the characters on either side of it are both CJK. A
   * break next to Latin text or a number keeps its space, because there it is
   * a real word separator ("12 個月").
   */
  markdown: {
    config: (md) => {
      const CJK =
        /[\u2E80-\u303E\u3041-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60]/

      /** Nearest rendered character before/after a token, skipping tag tokens. */
      const edgeChar = (tokens: any[], from: number, step: -1 | 1) => {
        for (let i = from; i >= 0 && i < tokens.length; i += step) {
          const c = tokens[i].content
          if (tokens[i].type === 'softbreak' || !c) continue
          return step === -1 ? c[c.length - 1] : c[0]
        }
        return ''
      }

      md.renderer.rules.softbreak = (tokens, idx) =>
        CJK.test(edgeChar(tokens, idx - 1, -1)) &&
        CJK.test(edgeChar(tokens, idx + 1, 1))
          ? ''
          : '\n'
    }
  },

  // `lastUpdated: true` reads git history at build time. The snap-installed bun
  // on this machine cannot spawn the system git binary, so it is left off.
  // Enable it if you build with Node, or in CI.
  lastUpdated: false,

  locales,

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          'zh-TW': searchLocale('zh-TW'),
          'zh-CN': searchLocale('zh-CN'),
          root: searchLocale('en')
        }
      }
    }
  }
})
