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
| 反向 TCP 转发 | Fabric / NeoForge 对应扩展 JAR | [k04m-reverseforward Releases](https://github.com/jinnang233/k04m-reverseforward/releases) |

安装步骤见[客户端安装](./guide/installation.md)、[中继安装](./relay/index.md)和[反向转发](./guide/reverse-forward.md)。本次文档对应客户端 **0.29.0**、中继插件 **1.9.0**、反向转发 **1.3.2**，目标为 Minecraft `26.3`、Java `25`。安全修复和升级注意事项见[更新记录](./releases.md)；实际下载以对应 Release 已生成的产物和说明为准。

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

仓库现在已经包含 Gradle Wrapper，可直接使用：

```bash
./gradlew build
./gradlew -p neoforge build
```

Windows 可使用对应的 `gradlew.bat`。如果你使用系统安装的 Gradle，当前 README 与 CI 对齐到 Gradle `9.8.0`。

Fabric 构建位于 `build/libs/`，NeoForge 构建位于 `neoforge/build/libs/`。Fabric 开发客户端可通过 `gradle runClient` 启动。

### 服务端插件

在插件源码目录安装 Java 25 和 Maven 后执行：

```bash
mvn package
```

JAR 生成于 `target/`。

### 反向转发扩展

使用 Java 25、Gradle `9.5.1`。先把 Krypt04Mcg 的 Fabric 发布 JAR 放到扩展仓库的 `libs/Krypt04Mcg.jar`，作为编译依赖，再运行：

```bash
gradle build
gradle -p neoforge build
```

产物分别为 `build/libs/k04m-reverse-forward-fabric-1.3.2.jar` 和 `neoforge/build/libs/k04m-reverse-forward-neoforge-1.3.2.jar`。NeoForge 游戏实例仍应安装核心和扩展各自的 NeoForge 构建；编译用的 Fabric JAR 不随扩展打包。

## 上游自动构建

客户端、插件和反向转发均在推送 `v*` 标签时构建并发布，也支持手动发布。手动触发可生成 `snapshot-YYYYMMDD-HHMMSS` 发布。Tag 存在不代表产物已经构建完成，可在对应仓库 Actions 查看结果。

## 文档来源

本站根据客户端、中继和反向转发的 README、更新记录及配置源码编写，最近一次同步于 **2026-10-08**。协议与依赖可能随上游变动，请以实际构建及对应版本文档为准。
