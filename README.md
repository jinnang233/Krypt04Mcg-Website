# Krypt04Mcg Website

Krypt04Mcg 客户端与 Krypt04McgRelay 服务端中继的中文文档站，使用 VitePress 1.6.4 构建，部署目标为 GitHub Pages。

- 预期地址：<https://jinnang233.github.io/Krypt04Mcg-Website/>
- 客户端源码：<https://github.com/jinnang233/Krypt04Mcg>
- 插件源码：<https://github.com/jinnang233/Krypt04mcg-plugin>

## 本地开发

需要 Node.js 22 或以上，推荐 Node.js 24（`.nvmrc`）。

```bash
npm ci
npm run docs:dev
```

生产构建与预览：

```bash
npm run docs:build
npm run docs:preview
```

预览应访问命令输出的 `/Krypt04Mcg-Website/` 路径。构建产物位于 `docs/.vitepress/dist/`，不提交到 Git。

## GitHub Pages 部署

1. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
2. 推送到 `main`，或在 Actions 手动运行 **Build and deploy VitePress**。
3. 工作流运行 `npm ci`、构建并上传产物，然后部署到 `github-pages` 环境。

Pull request 只检查构建，不发布网站。依赖使用 `package-lock.json` 锁定，构建默认拒绝无效内部链接。

VitePress 保持稳定版 `1.6.4`，通过 npm override 使用修复过已知开发服务器问题的 `vite@6.4.3`，构建和本地预览需一起验证后再更新该覆盖。

仓库名或域名变化时，需要同步调整 `docs/.vitepress/config.mts` 中的 `base`、`sitemap.hostname` 和本 README 的地址。Pages 使用默认 `.html` 链接，避免依赖服务器 URL 重写。

部署方式参考 [VitePress 官方文档](https://vuejs.github.io/vitepress/v1/guide/deploy)和 [GitHub Pages 自定义工作流文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 文档维护

- `docs/index.md`：首页入口和功能说明。
- `docs/guide/`：客户端安装、使用、命令、配置与排查。
- `docs/relay/`：插件安装和配置。
- `docs/reference/`：协议、开发 API 和安全边界。
- `docs/.vitepress/`：导航、搜索、主题和自定义首页组件。
- `docs/public/logo.svg`：临时站点标识，等待替换为正式项目 logo。

内容整理于 2026-10-05，依据相邻的 `Krypt04Mcg/README.md`、`Krypt04Mcg-plugin/README.md`，并核对客户端常用配置默认值。不自动读取相邻目录，克隆此仓库即可独立构建。

上游 README 对旧通道和未来流中继有不同阶段的描述，文档明确区分旧传输与当前加密流；维护时应核对两端实际版本。项目的实验性声明在首页及安全页面保留，不应写成经审计的安全保证。
