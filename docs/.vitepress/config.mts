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

function sidebar(lang: Language): DefaultTheme.SidebarItem[] {
  const t = createT(lang)
  const p = base(lang)
  return [
    {
      text: t('sidebar.group.gettingStarted'),
      items: [
        { text: t('sidebar.welcome'), link: `${p}/guide/getting-started` },
        { text: t('sidebar.firstShift'), link: `${p}/guide/first-shift` },
        { text: t('sidebar.workPrecautions'), link: `${p}/guide/code-of-conduct` },
        { text: t('sidebar.schedulePay'), link: `${p}/guide/schedule-and-pay` }
      ]
    },
    {
      text: t('sidebar.group.duties'),
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
      text: t('sidebar.group.tips'),
      items: [
        { text: t('sidebar.tipsOverview'), link: `${p}/tips/` },
        { text: t('sidebar.troubleshooting'), link: `${p}/tips/troubleshooting` },
        { text: t('sidebar.communication'), link: `${p}/tips/communication` }
      ]
    },
    {
      text: t('sidebar.group.reference'),
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
  title: createT('en')('site.title'),
  description: createT('en')('site.description'),
  cleanUrls: true,

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
