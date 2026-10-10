import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeOverview from './HomeOverview.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  /**
   * Registers the homepage component with the Vue application created by VitePress.
   *
   * @param app - The Vue application supplied by the VitePress theme lifecycle.
   */
  enhanceApp({ app }) {
    // Uses Vue component registration so Markdown pages can reference HomeOverview.
    app.component('HomeOverview', HomeOverview)
  }
} satisfies Theme
