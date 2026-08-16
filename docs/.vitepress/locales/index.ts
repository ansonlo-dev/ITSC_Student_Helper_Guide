// Translation loader, mirroring the LingUBible `src/locales` convention:
// flat dot-notation keys, one file per language, `{param}` interpolation.
//
// Unlike LingUBible this loader is synchronous — VitePress resolves the site
// config at build time in Node, so there is no benefit to dynamic imports here.
import en from './en'
import zhTW from './zh-TW'
import zhCN from './zh-CN'

export type Language = 'en' | 'zh-TW' | 'zh-CN'

export const LANGUAGES: Language[] = ['en', 'zh-TW', 'zh-CN']

export const translations: Record<Language, Record<string, string>> = {
  en,
  'zh-TW': zhTW,
  'zh-CN': zhCN
}

/**
 * Build a `t()` function bound to one language.
 *
 * Falls back to English, then to the key itself, so a missing translation
 * degrades to readable text instead of breaking the build.
 */
export function createT(language: Language) {
  return (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key] ?? translations.en[key] ?? key

    if (params) {
      for (const paramKey of Object.keys(params)) {
        const placeholder = `{${paramKey}}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        translation = translation.replace(new RegExp(placeholder, 'g'), String(params[paramKey]))
      }
    }

    return translation
  }
}

/** Report keys that exist in English but are missing from another language. */
export function missingKeys(language: Language): string[] {
  return Object.keys(translations.en).filter((key) => !(key in translations[language]))
}
