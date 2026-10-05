# 下载与构建

使用对应仓库的 GitHub Releases 获取产物。本站不镜像 JAR，也不把文档中的示例版本当作最新版本。

::: warning 安装前
这是未经独立安全审计的实验性项目，不适合生产环境或敏感数据。核对 Minecraft、加载器和 Java 版本，阅读发布说明，并按上游建议检查下载产物。
:::

## 下载入口

| 组件 | 发布产物 | 官方入口 |
| --- | --- | --- |
| 客户端 | Fabric / NeoForge 对应模组 JAR | [Krypt04Mcg Releases](https://github.com/jinnang233/Krypt04Mcg/releases) |
| 中继插件 | Krypt04McgRelay JAR | [插件 Releases](https://github.com/jinnang233/Krypt04mcg-plugin/releases) |

安装步骤分别见[客户端安装](./guide/installation.md)和[中继安装](./relay/index.md)。项目 README 当前目标为 Minecraft `26.3`、Java `25`，实际下载以 Release 说明为准。

## 产物签名

客户端 Release 包括模组 JAR、对应 `.jar.sign` 分离签名和 `public_key.pem`。把三者放在同一目录，替换下方示例文件名：

```bash
openssl dgst -verify public_key.pem \
  -signature krypt04mcg-<version>.jar.sign \
  krypt04mcg-<version>.jar
```

插件仅在 Release workflow 配置了 `RELEASE_SIGN_KEY` 时提供签名与公钥。若相应产物可用，可按同样方式验证插件 JAR。

验签依赖你使用的公钥；仅与 JAR 一同下载的公钥不能独立证明发布者身份，也不能证明代码或构建环境安全。

## 自行构建

### 客户端

在客户端源码目录，使用 Java 25 和 Gradle：

```bash
gradle build
gradle -p neoforge build
```

若需要 wrapper，README 给出的生成方式为：

```bash
gradle wrapper
./gradlew build
./gradlew -p neoforge build
```

Fabric 构建位于 `build/libs/`，NeoForge 构建位于 `neoforge/build/libs/`。Fabric 开发客户端可通过 `gradle runClient` 启动。

### 服务端插件

在插件源码目录安装 Java 25 和 Maven 后执行：

```bash
mvn package
```

JAR 生成于 `target/`。

## 上游自动构建

客户端在推送 `v*` 标签时构建并发布；手动触发可生成 `snapshot-YYYYMMDD-HHMMSS` 发布。插件有构建及发布 workflow，也支持标签或手动发布。可在对应仓库 Actions 查看结果。

## 文档来源

本站根据本地两个项目 README 编写，并以客户端配置源码核对常用默认值。内容整理日期为 **2026-10-05**。协议与依赖可能随上游变动，请以实际构建及对应版本文档为准。
