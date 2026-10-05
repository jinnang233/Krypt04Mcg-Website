import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeOverview from './HomeOverview.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeOverview', HomeOverview)
  }
} satisfies Theme
