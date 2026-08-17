// Client-side counterpart to the build-time `createT` used in `config.mts`.
//
// Components cannot read the locale key VitePress used for the page, only the
// `lang` string it wrote into `<html lang>`, so map that back to a `Language`.
import { computed } from 'vue'
import { useData } from 'vitepress'
import { createT, type Language } from '../locales'

const LANG_BY_HTML_LANG: Record<string, Language> = {
  'en-US': 'en',
  'zh-HK': 'zh-TW',
  'zh-CN': 'zh-CN'
}

export function useTranslate() {
  const { lang } = useData()
  return computed(() => createT(LANG_BY_HTML_LANG[lang.value] ?? 'en'))
}
