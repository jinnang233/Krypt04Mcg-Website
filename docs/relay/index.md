# 服务端中继

**Krypt04McgRelay** 是可选的 Bukkit / Spigot 插件。它将识别到的加密聊天片段从普通广播中取消，根据包头中的目标玩家定向转发原始加密片段，并提供兼容客户端使用的载荷通道。

::: warning 实验性插件
插件与客户端均由 AI 辅助生成，尚未经过独立安全审计，不应用于生产环境或敏感数据。插件不加密或解密消息正文，也不能隐藏路由元数据。
:::

## 环境与依赖

| 项目 | 要求 |
| --- | --- |
| 服务端 API | Spigot `26.3-R0.1-SNAPSHOT` |
| Java | `25` |
| ProtocolLib | 可选，仅聊天垃圾检测绕过需要 |

插件使用 Bukkit API 和可选 ProtocolLib 包拦截，不依赖 NMS / CraftBukkit 内部实现。ProtocolLib 不打包进插件 JAR。

README 指出 ProtocolLib 发布源码中最高测试版本仍为 `26.2`，其 `26.3` 包拦截尚未验证。请针对实际服务端测试；普通聊天转发和自定义载荷不依赖 ProtocolLib。

## 安装

1. 从[插件 Releases](https://github.com/jinnang233/Krypt04mcg-plugin/releases)下载 JAR，或执行 `mvn package` 自行构建。
2. 将 JAR 放入服务端 `plugins/` 目录。
3. 如需聊天垃圾检测绕过，另外安装兼容的 ProtocolLib 构建。
4. 重启服务端，让插件创建配置和语言文件。
5. 按需修改插件数据目录的 `config.yml`，然后执行 `/kryptrelay reload`。
6. 用两位已安装客户端且交换过公钥的测试玩家，验证签名消息和载荷传输。

## 普通聊天中继

插件识别：

```text
[KRYPT04MCG] <messageId> <index> <total> <payload>
```

收齐同一发送者、同一消息 ID 的片段后，解码包头，读取接收者，再把原始片段发给对应玩家。支持包协议版本 `1`、`2`、`3`、`4`，包括会话交换和 v4 会话消息。

1.8.2 起，待处理消息缓存满时忽略新的消息 ID，继续接收已有消息的片段，避免新消息驱逐正在收集的正常消息。完成、超时、断线或重载会释放容量。1.8.3 另外限制每玩家 UUID 的组装数量和缓冲文本，见[资源边界](./configuration.md#聊天队列与内存边界)。这些修复针对普通聊天和私信命令的片段收集，不改变自定义载荷或原始流 API 的转发行为。

转发的系统消息形如：

```text
<Alice> [KRYPT04MCG] <messageId> <index> <total> <payload>
```

客户端需匹配的 Shadow Listen 设置，并使用签名消息或已绑定身份的会话消息。控制台不会打印加密载荷，改为记录本地化摘要，例如 “Alice sent an encrypted message to Bob.”。

默认启用 `enforce-sender-match`，拒绝包内发送者与真实发送玩家不一致的消息。

## 自定义载荷与流

聊天载荷 `krypt04mcg:chat_fragment` 的客户端发送字段是 `(receiver, fragment, version)`，服务端转发字段为 `(sender, fragment, version)`。发送者来自真实玩家连接，片段和版本保持不变。

中继还支持公钥共享、旧式文件/数据通道、原始加密流和 socket tunnel。**通道存在不代表所有客户端版本都使用它。** 当前本地客户端 README 已说明旧可靠传输被加密流取代，不能把旧通道文档当成新 API 的使用指南。

原始流使用 `krypt04mcg_stream:control` 与 `krypt04mcg_stream:data/<slot>`。服务端解析控制消息分配路由；数据仅在分配的两名玩家之间、READY 之后、该方向 END 之前按原字节转发。流槽位由所有玩家共享。

## 重载与流量限制

重载、禁用、断线或失去订阅会清理相关路由。原始流在双方 END、RESET 或 60 秒空闲时释放槽位。重载会中止活动流。

普通聊天和旧载荷有队列、超时、片段和速率预算；过载时可能丢弃，客户端需在负载恢复后重试。原始加密流和 tunnel 不使用这套丢弃式速率配额，但仍受 Bukkit 输出缓冲、服务端网络限制和接收端速度影响。

具体配置请查看[插件配置](./configuration.md)，开发通道说明见[协议与通道](../reference/protocol.md)。
