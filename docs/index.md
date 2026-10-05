---
layout: home
title: Minecraft 加密通信
description: Krypt04Mcg 客户端模组和 Krypt04McgRelay 中继插件的中文文档。了解安装、密钥验证、加密聊天和流式开发接口。
hero:
  name: Krypt04Mcg
  text: 方块世界里的<br>加密通信实验。
  tagline: 在熟悉的 Minecraft 聊天中交换加密消息。<br>从客户端到可选中继，用一份文档连接整个项目。
  actions:
    - theme: brand
      text: 开始使用 →
      link: /guide/quick-start
    - theme: alt
      text: 下载客户端
      link: /downloads
    - theme: alt
      text: 查看源码 ↗
      link: https://github.com/jinnang233/Krypt04Mcg
features:
  - icon: ⌘
    title: 从聊天框开始
    details: 用 /k04m 发送消息，或打开加密聊天面板。默认聊天传输无需安装服务端插件。
    link: /guide/commands
    linkText: 认识客户端命令
  - icon: ◈
    title: 后量子算法选项
    details: 可配置 KEM、签名与 AEAD；通过公钥导入和完整指纹核对管理玩家身份。
    link: /guide/keys
    linkText: 了解密钥与信任
  - icon: ⇄
    title: 可选的服务端中继
    details: Spigot 插件定向转发加密片段和自定义载荷，服务端不负责解密消息正文。
    link: /relay/
    linkText: 搭建中继服务
---

<HomeOverview />
