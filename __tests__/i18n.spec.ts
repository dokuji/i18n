import { I18n } from '../lib/i18n'
import { DeepPartial } from '../lib/types'

const en = {
  a: 'en-a',
  b: 'en-b',
  mustache: 'Hi {{name}}!',
  c: {
    a: 'en-ca',
    b: 'en-cb',
    c: {
      a: 'en-cca',
      b: 'en-ccb'
    }
  }
}

const en2 = {
  a: 'en-a2',
  d: 'en-d',
  c: {
    c: {
      d: 'en-ccd'
    }
  }
}

const fr: DeepPartial<typeof en> = {
  a: 'fr-a',
  b: 'fr-b',
  mustache: 'Bonjour {{name}} !',
  c: {
    a: 'fr-ca',
    b: 'fr-cb',
    c: {
      a: 'fr-cca',
      b: 'fr-ccb'
    }
  }
}

const fr2: DeepPartial<typeof en2> = {
  a: 'fr-a2',
  d: 'fr-d'
}

const de: DeepPartial<typeof en> = {
  a: 'de-a',
  mustache: 'Hallo {{name}} !',
  c: {
    a: 'de-ca'
  }
}

let i18n: I18n<typeof en>

test('init', () => {
  i18n = new I18n('en', en)
  i18n.addDictionary('fr', fr)
  i18n.addDictionary('de', de)
})

test('english', () => {
  expect(i18n.locale).toBe('en')
  expect(i18n.t('a')).toBe('en-a')
  expect(i18n.t('b')).toBe('en-b')
  expect(i18n.t('c.a')).toBe('en-ca')
  expect(i18n.t('c.b')).toBe('en-cb')
  expect(i18n.t('c.c.a')).toBe('en-cca')
  expect(i18n.t('c.c.b')).toBe('en-ccb')
  expect(i18n.t('mustache')).toBe('Hi {{name}}!')
  expect(i18n.t('mustache', { name: 'Mark' })).toBe('Hi Mark!')
  // @ts-expect-error
  expect(i18n.t('made.up.path')).toBe('made.up.path')
})

test('french', () => {
  i18n.setLocale('fr')
  expect(i18n.locale).toBe('fr')
  expect(i18n.t('a')).toBe('fr-a')
  expect(i18n.t('b')).toBe('fr-b')
  expect(i18n.t('c.a')).toBe('fr-ca')
  expect(i18n.t('c.b')).toBe('fr-cb')
  expect(i18n.t('c.c.a')).toBe('fr-cca')
  expect(i18n.t('c.c.b')).toBe('fr-ccb')
  expect(i18n.t('mustache')).toBe('Bonjour {{name}} !')
  expect(i18n.t('mustache', { name: 'Mark' })).toBe('Bonjour Mark !')
  // @ts-expect-error
  expect(i18n.t('made.up.path')).toBe('made.up.path')
})

test('german', () => {
  i18n.setLocale('de')
  expect(i18n.locale).toBe('de')
  expect(i18n.t('a')).toBe('de-a')
  expect(i18n.t('b')).toBe('en-b')
  expect(i18n.t('c.a')).toBe('de-ca')
  expect(i18n.t('c.b')).toBe('en-cb')
  expect(i18n.t('c.c.a')).toBe('en-cca')
  expect(i18n.t('c.c.b')).toBe('en-ccb')
  expect(i18n.t('mustache')).toBe('Hallo {{name}} !')
  expect(i18n.t('mustache', { name: 'Mark' })).toBe('Hallo Mark !')
  // @ts-expect-error
  expect(i18n.t('made.up.path')).toBe('made.up.path')
})

test('extend & merge dictionary', () => {
  const i18n2 = i18n.extendDictionary('en', en2)
  expect(i18n2.t('a')).toBe('en-a2')
  expect(i18n2.t('d')).toBe('en-d')
  expect(i18n2.t('c.a')).toBe('en-ca')
  expect(i18n2.t('c.c.d')).toBe('en-ccd')
  i18n2.mergeDictionary('fr', fr2)
  i18n2.setLocale('fr')
  expect(i18n2.t('a')).toBe('fr-a2')
  expect(i18n2.t('d')).toBe('fr-d')
})
