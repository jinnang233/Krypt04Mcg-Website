# 安装客户端

每位参与加密通信的玩家都需要安装 Krypt04Mcg。下面的环境要求来自本地项目 README，是文档编写时的目标配置；下载前请同时核对对应 Release 的说明。

## 环境要求

| 项目 | 目标版本 |
| --- | --- |
| Minecraft Java | `26.3` |
| Java | `25` |
| Fabric Loader | `0.19.5` |
| Fabric API | `0.162.0+26.3` |
| NeoForge | `26.3.0.57-beta`（独立客户端构建） |

本次文档同步对应客户端 `0.29.0`，相关升级说明见[版本更新](../releases.md)。下载时仍以具体 Release 的构建状态和说明为准。

::: warning 实验环境
请先阅读[安全与限制](../reference/security.md)。上游建议尽可能在虚拟机等隔离环境中运行，并在安装下载的 JAR 前使用 VirusTotal 或同类服务检查构建产物。
:::

## Fabric

1. 创建匹配 Minecraft 版本的 Fabric 客户端配置，确认使用 Java 25。
2. 从[客户端 Releases](https://github.com/jinnang233/Krypt04Mcg/releases)下载对应的 Fabric JAR，或[自行构建](../downloads.md#自行构建)。
3. 将模组 JAR 和对应版本的 Fabric API 放入该游戏实例的 `mods/` 目录。
4. 如需配置界面，另外安装兼容的 Cloth Config；ModMenu 设置入口还需要 ModMenu。
5. 启动游戏，进入测试世界或服务器，输入 `/k04m showalgs` 检查命令是否可用。0.27.0 起还可输入 `/k04m key` 打开密钥管理界面，或在 Controls 中绑定 **Open Key Manager**。

## NeoForge

1. 创建匹配版本的 NeoForge 客户端配置，确认使用 Java 25。
2. 下载 **NeoForge 构建**，放入该游戏实例的 `mods/` 目录。不要混用 Fabric JAR。
3. 如需保存设置和配置界面，单独安装匹配版本的 NeoForge Cloth Config。README 列出的集成版本为 `26.3.159`，模组 ID 为 `cloth_config`。
4. 启动游戏并检查 `/k04m` 命令。0.27.0 起 `/k04m key` / `/k04m key gui` 可直接打开密钥管理界面。

Cloth Config 是可选依赖。没有它，模组以默认设置启动。Fabric 与 NeoForge 共享协议、加密和存储代码。

## 需要安装服务端插件吗

普通聊天传输不需要。双方本地导入公钥后，可以使用 `CHAT` 模式发送消息。

自定义载荷、公钥共享、文件共享和流式 API 需要提供相应通道的兼容中继。服务端没有这些通道时，不会因此阻止正常登录；相关可选功能不可用。服主请查看[中继安装](../relay/index.md)。

## 安装之后

跟随[发送第一条消息](./quick-start.md)交换公钥。有关不显示命令、接收失败等问题，请查看[常见问题](./faq.md)。
