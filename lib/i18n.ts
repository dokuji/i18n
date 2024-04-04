import Mustache from 'mustache'
import { getIn } from './getIn'
import { iso6391, Locale, LocaleCode } from './locales'
import { DeepPartial, DottedPaths, Dictionaries, Dictionary } from './types'
import _merge from 'lodash.merge'

export function getLocale (l: Locale = 'en'): LocaleCode {
  // @ts-expect-error
  return Object.values(iso6391).includes(l) ? l : 'en'
}

export class I18n<T extends Dictionary> {

  private readonly defaultLocale: Locale
  protected _locale: Locale
  // @ts-expect-error
  private dictionaries: Dictionaries<DeepPartial<T> | T> = {}

  constructor (defaultLocale: Locale, defaultDictionary: T) {
    this._locale = this.defaultLocale = getLocale(defaultLocale)
    this.dictionaries[this.defaultLocale] = defaultDictionary
  }

  get locale (): Locale {
    return this._locale
  }

  private getLocale (l: Locale = this.defaultLocale): LocaleCode {
    // @ts-expect-error
    return Object.values(iso6391).includes(l) ? l : this.defaultLocale
  }

  setLocale (l: Locale): Locale {
    this._locale = this.getLocale(l)
    return this._locale
  }

  /**
   * Duplicate the instace and set a new default locale
   *
   * Meant to be used in server side rendering
   */
  duplicateWithLocale(l: Locale) {
    const newI18n = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    newI18n.setLocale(l)
    return newI18n
  }

  addDictionary (l: Locale, d: DeepPartial<T> | T, override: boolean = false) {
    const locale = this.getLocale(l)
    if (!override && this.dictionaries[locale] != null) {
      throw new Error(`dictionary ${locale} is already initialized. If you meant to override a dictionary use the override param.`)
    } else {
      this.dictionaries[locale] = d
    }
  }

  mergeDictionary (l: Locale, d: DeepPartial<T> | T) {
    const locale = this.getLocale(l)
    this.dictionaries[locale] = _merge(this.dictionaries[locale] ?? {}, d)
  }

  /**
   * Create a new I18n instance and extend the base dictionary
   * @param l
   * @param d
   * @throws
   */
  extendDictionary<U extends Dictionary> (l: Locale, d: U): I18n<T & U> {
    const locale = this.getLocale(l)
    if (locale !== this.defaultLocale) {
      throw new Error(`dictionary can only be extended with the default locale: "${this.defaultLocale}"`)
    }
    // this.dictionaries[locale] =
    // @ts-expect-error
    return new I18n(locale, _merge(this.dictionaries[locale] ?? {}, d))
  }

  t (path: DottedPaths<T>): string
  t (path: DottedPaths<T>, view: Record<string, any>): string
  t (path: DottedPaths<T>, locale: Locale): string
  t (path: DottedPaths<T>, view: Record<string, any>, locale: Locale): string
  t (
    path: DottedPaths<T>,
    view: Record<string, any> | string | null = null,
    locale: Locale = this._locale
  ): string {
    if (typeof view === 'string') {
      locale = view as Locale
      view = null
    }
    const l = this.getLocale(locale || this._locale)
    const dict = this.dictionaries[l] || this.dictionaries[this.defaultLocale]
    // @ts-ignore
    const str = getIn(dict, path, null) || getIn(this.dictionaries[this.defaultLocale], path, null) || path
    return view != null ? Mustache.render(str as string, view) : str as string
  }
}
