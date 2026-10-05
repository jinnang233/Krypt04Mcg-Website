import { defineConfig } from 'vitepress'

const base = '/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Krypt04Mcg',
  description: 'Minecraft 实验性加密通信：Fabric / NeoForge 客户端与 Spigot 中继插件的安装和使用文档。',
  base,
  cleanUrls: false,
  lastUpdated: true,
  sitemap: { hostname: 'https://krypt04mcg.buranko.top/' },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#14856c' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Krypt04Mcg · Minecraft 加密通信' }],
    ['meta', { property: 'og:description', content: '从第一条加密消息开始。客户端模组、可选中继与开发接口文档。' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Krypt04Mcg',
    nav: [
      { text: '使用指南', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: '服务端中继', link: '/relay/', activeMatch: '/relay/' },
      { text: '开发文档', link: '/reference/protocol', activeMatch: '/reference/' },
      { text: '下载', link: '/downloads' }
    ],
    sidebar: [
      { text: '开始使用', items: [
        { text: '项目介绍', link: '/guide/introduction' },
        { text: '安装客户端', link: '/guide/installation' },
        { text: '发送第一条消息', link: '/guide/quick-start' },
        { text: '下载与构建', link: '/downloads' }
      ] },
      { text: '客户端指南', items: [
        { text: '命令参考', link: '/guide/commands' },
        { text: '配置与传输方式', link: '/guide/configuration' },
        { text: '密钥、信任与存储', link: '/guide/keys' },
        { text: '常见问题', link: '/guide/faq' }
      ] },
      { text: '服务端中继', items: [
        { text: '安装与工作方式', link: '/relay/' },
        { text: '插件配置', link: '/relay/configuration' }
      ] },
      { text: '开发与设计', items: [
        { text: '协议与通道', link: '/reference/protocol' },
        { text: '加密流 API', link: '/reference/api' },
        { text: '安全与限制', link: '/reference/security' }
      ] }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/jinnang233/Krypt04Mcg' }],
    search: {
      provider: 'local',
      options: { locales: { root: { translations: {
        button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
        modal: { noResultsText: '没有找到相关结果', resetButtonTitle: '清除搜索',
          footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } }
      } } } }
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '文档更新于', formatOptions: { dateStyle: 'medium' } },
    editLink: {
      pattern: 'https://github.com/jinnang233/Krypt04Mcg-Website/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '文档导航',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    notFound: { title: '页面未找到', quote: '这条路径没有可用的文档，请回到首页继续探索。', linkLabel: '返回首页' },
    footer: {
      message: '基于 The Unlicense 发布 · 实验性项目，请先阅读安全与限制。',
      copyright: 'Krypt04Mcg & Krypt04McgRelay'
    }
  }
})
