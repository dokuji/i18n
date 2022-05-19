import { I18n, DeepPartial } from '../lib/main'

const en = {
  hello: {
    world: 'Hello World!',
    name: 'Hello {{name}}!'
  }
}

const fr: DeepPartial<typeof en> = {
  hello: {
    name: 'Bonjour {{name}} !'
  }
}

test('readme file should work', () => {
  const i18n = new I18n(
    // default/fallback locale
    'en',
    // default/fallback dictionary
    en
  )

  i18n.addDictionary(
    // locale
    'fr',
    // dictionary
    fr
  )

  // change local
  expect(i18n.setLocale('fr')).toBe('fr')

  // use dictionary
  expect(i18n.t('hello.world')).toBe(en.hello.world)

  // use mustache template
  expect(i18n.t('hello.name', { name: 'John' })).toBe('Bonjour John !')

  // force local
  expect(i18n.t('hello.name', { name: 'John' }, 'en')).toBe('Hello John!')
  expect(i18n.t('hello.world', 'en')).toBe('Hello World!')
})
