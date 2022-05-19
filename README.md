# i18n
Internationalization package

```typescript
import { I18n, DeepPartial } from '@dokuji/i18n'

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
i18n.setLocale('fr')

// use dictionary
i18n.t('hello.world') // Hello World!

// use mustache template
i18n.t('hello.name', { name: 'John' }) // Bonjour John !

// force local
i18n.t('hello.name', { name: 'John' }, 'en') // Hello John!
i18n.t('hello.world', 'en') // Hello World!
```