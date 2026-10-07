# 项目介绍

**Krypt04Mcg**（也称 Krypt04Msg）意为 “Crypto for message (MineCraft message)”，是一个通过 Minecraft 传输加密消息的实验性客户端模组。它支持 Fabric 和 NeoForge；**Krypt04McgRelay** 是配套的可选 Bukkit / Spigot 中继插件。

::: warning 使用前请了解
项目代码由 AI 辅助生成，尚未经过独立安全审计。不要在生产环境使用，也不要用它保护敏感、重要、私密、受监管或高价值数据。项目不承诺长期维护、安全响应或兼容性更新。请阅读[安全与限制](../reference/security.md)。
:::

## 两个项目如何配合

| 组件 | 安装位置 | 主要职责 |
| --- | --- | --- |
| Krypt04Mcg | 每位通信玩家的客户端 | 生成密钥、加密和解密、签名验证、分片重组、聊天界面 |
| Krypt04McgRelay | 可选的 Bukkit / Spigot 服务端 | 定向转发加密片段、提供自定义载荷与流通道 |

默认聊天传输不要求服务端安装插件或模组。双方仍需安装客户端模组，并事先交换公钥。中继插件可以阻止识别到的加密片段被广播给所有玩家，把片段发送给目标玩家；它不解密消息正文。

## 可以做什么

- **加密聊天**：使用 `/k04m tell`、带签名的 `/k04m stell`，或建立会话后使用 `/k04m etell`。
- **身份管理**：导入和导出公钥，使用首次使用即信任（TOFU），并通过游戏外完整指纹核对标记身份为 `VERIFIED`。
- **密钥管理界面**：0.27.0 起可用 `/k04m key`、`/k04m key gui` 或可选按键打开 GUI，查看身份、算法与指纹，并执行导入、导出、验证、删除和重新生成。
- **算法与预设**：支持 PQC 与 X25519/X448 混合 KEM、Bouncy Castle 复合签名以及多组实验性 PQC 签名，并提供 Default、Compact、CMCE + Falcon、SLH-DSA 和 BC hybrid category 5 预设。
- **聊天面板与群组**：通过配置的按键打开面板，选择玩家或群组。群组消息通过逐个发送实现.
- **可选共享**：通过兼容中继交换公钥与文件；文件发送和接收默认分别关闭。
- **开发接口**：使用可选的加密字节流 API。它需要服务端广告兼容通道，不能回退到普通聊天。

## 名称与许可

项目曾名为 ObscuraLink-MC / ObscuraLink。由于 “Obscura” 已被 Minecraft 模组组织使用，项目更名为 Krypt04Mcg，避免名称冲突。

客户端和中继插件均使用 **The Unlicense**。源码与问题反馈入口：

- [客户端仓库](https://github.com/jinnang233/Krypt04Mcg)
- [中继插件仓库](https://github.com/jinnang233/Krypt04mcg-plugin)

## 下一步

先[安装客户端](./installation.md)，再跟随[快速入门](./quick-start.md)与另一位玩家交换密钥并发送消息。服主可以直接查看[中继安装指南](../relay/index.md)。
