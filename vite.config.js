import dts from 'vite-plugin-dts'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'I18n',
      fileName: 'i18n'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'mustache',
        'lodash.get',
        'lodash.merge'
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
        }
      }
    }
  },
  plugins: [
    dts()
  ]
})
