import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import PrinterDirectory from './components/PrinterDirectory.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // Usable from any Markdown page: <VideoPlayer src="/videos/x.mp4" caption="…" />
    app.component('VideoPlayer', VideoPlayer)
    // The campus printer directory: <PrinterDirectory /> — it carries its own
    // data and translations, so the tag takes no props.
    app.component('PrinterDirectory', PrinterDirectory)
  }
} satisfies Theme
