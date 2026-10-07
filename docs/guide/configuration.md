# 配置与传输方式

Cloth Config 提供可选的配置集成。客户端没有 Cloth Config 时以默认设置启动；流通道数量另有独立配置文件，见下文。

## 选择传输方式

| 模式 | 行为 | 要求 |
| --- | --- | --- |
| `CHAT` | 通过普通聊天发送加密片段 | 默认模式，无需服务端插件 |
| `SERVER_COMMAND` | 通过配置的服务端命令模板发送片段 | 服务端支持对应命令，默认模板 `/msg <receiver> <fragment>` |
| `CUSTOM_PAYLOAD` | 通过 `krypt04mcg:chat_fragment` 发送 | 兼容中继广告对应通道 |

`CHAT` 和 `SERVER_COMMAND` 的片段发送间隔至少为 1 秒，即 `max(sendDelayMs, 1000)`。`CUSTOM_PAYLOAD` 直接使用 `sendDelayMs`。断线或切换服务器会取消排队的聊天片段。

自定义载荷模式下，只有服务端可以接收对应通道时才发送；没有通道会跳过载荷发送，并不会自动提供聊天回退。原版服务器上请显式使用 `CHAT`。

## 常用设置

以下默认值核对自本地客户端配置源码：

| 设置 | 默认值 | 含义 |
| --- | --- | --- |
| `chatSendMode` | `CHAT` | 发送方式 |
| `fragmentSize` | `180` | 聊天分片大小 |
| `sendDelayMs` | `250` | 发送延迟；聊天/命令模式仍受至少 1 秒约束 |
| `hideEncryptedRawMessage` | `true` | 隐藏界面中的原始加密消息 |
| `showProgress` | `true` | 显示发送进度 |
| `showSentPlaintext` | `true` | 本地发送通知显示发送者、接收者和明文；关闭后只显示已发送加密消息 |
| `showReceiveProgress` | `true` | 显示接收进度 |
| `enableConversationHistory` | `false` | 是否保存加密会话历史 |
| `shadowListenMode` | `false` | 监听系统消息中的聊天片段 |
| `sessionTtlMinutes` | `60` | 会话有效期配置 |
| `maxMessagesPerSession` | `100` | 会话消息轮换阈值 |
| `rotateAfterBytes` | `1048576` | 会话字节轮换阈值 |

服务端过滤、签名和反垃圾插件可能影响消息。较大的密钥或签名会产生更多片段；优先在测试环境确认双方可以接收。

## Shadow Listen

中继通过普通聊天转发时，消息形如：

```text
<Alice> [KRYPT04MCG] <messageId> <index> <total> <payload>
```

对应默认匹配表达式：

```regex
^<(?<player>[^>]+)>\s*(?<message>.*)$
```

服务端插件默认会提示玩家启用 “Shadow Listen Mode”。系统消息中显示的名称本身不构成经过认证的玩家身份，因此这类传输需使用带签名的 `stell`、`exchange`，或已经绑定身份的会话消息 `etell`。

## 算法选项

| 用途 | 默认值 | 应用范围 |
| --- | --- | --- |
| 长期 KEM | `ML-KEM-768+X25519` | 长期公钥及 `tell` / `stell` |
| 签名 | `MLDSA65-Ed25519-SHA512` | 签名消息和会话交换 |
| 临时 KEM | `ML-KEM-768+X25519` | `/k04m exchange` 的一次性密钥 |
| 聊天 AEAD | `AES-256-GCM` | 聊天加密；也支持 ChaCha20-Poly1305 |

长期 KEM 和签名的设置只在没有本地密钥或显式重新生成密钥时应用。修改设置不会重写已有密钥。临时 KEM 独立配置，在下一次 exchange 时生效。实际加密和验证根据密钥记录和协议算法标识进行；Fabric 和 NeoForge 的算法字段均使用下拉选择器。

KEM 选项包括当前 Bouncy Castle 1.86 暴露的 ISO CMCE、HQC、NTRU Prime、ML-KEM，以及将这些 KEM 与 X25519 / X448 配对的混合选项。默认 `ML-KEM-768+X25519` 使用 BC 原生 `MLKEM768-X25519-SHA3-256` 组合；部分其他混合组合使用项目定义的 HKDF 组合格式，不是 X-Wing 或标准化复合 KEM。

签名除 Falcon、ML-DSA、SLH-DSA、SQIsign、SNOVA 外，还包括 MAYO、HAETAE、UOV、QR-UOV、AIMer、FAEST、MQOM 和 SDitH。后八个家族还提供 `+Ed25519` / `+Ed448` 混合变体。默认 `MLDSA65-Ed25519-SHA512` 是 BC 原生 ML-DSA 复合签名之一；其他新增 PQ+EdDSA 组合使用项目自定义的版本化格式。以 `/k04m showalgs` 和对应版本 README 为准。加密流数据固定使用 XChaCha20-Poly1305，不跟随聊天 AEAD 设置。

::: warning 从旧 CMCE 配置升级
Bouncy Castle 1.86 移除了旧 round-3 CMCE 实现以及 `CMCE/mceliece348864` / `mceliece348864f`。使用这两个配置值时会迁移到 `ML-KEM-768`；旧 round-3 CMCE 密钥即使参数名仍存在，也不能由 1.86 解码。升级前应备份账号存储，CMCE 用户需要重新生成并重新交换公钥。
:::

## 配置预设

主项目的 `presets/` 目录提供可直接复制到 `config/krypt04mcg.json` 的完整配置：

| 预设 | 长期 KEM | 临时 KEM | 签名 |
| --- | --- | --- | --- |
| Default | `ML-KEM-768+X25519` | `ML-KEM-768+X25519` | `MLDSA65-Ed25519-SHA512` |
| Compact | `CMCE/mceliece460896` | `ML-KEM-512` | `UOV-IS` |
| CMCE + Falcon | `CMCE/mceliece8192128f` | `ML-KEM-768+X25519` | `Falcon-1024` |
| SLH-DSA | `ML-KEM-768+X25519` | `ML-KEM-768+X25519` | `SLH-DSA-SHA2-192S` |
| BC hybrid, category 5 | `ML-KEM-1024+X448` | `ML-KEM-1024+X448` | `MLDSA87-Ed448-SHAKE256` |

预设会替换完整配置文件，但**不会重新生成已有密钥**。如果更改了长期 KEM 或签名，仍需显式执行密钥重新生成并把新公钥重新分发给联系人。

## 公钥与文件共享

共享需要 `CUSTOM_PAYLOAD` 模式及兼容服务端。公钥共享使用 `krypt04mcg:public_key`；`/k04m-share key [player]` 提供公钥提议，由接收者接受后导入。

文件共享使用当前的加密流 API，需要双方已导入公钥：

| 设置 | 默认值 |
| --- | --- |
| `enableFileSending` | `false` |
| `enableFileReceiving` | `false` |
| `permanentlyDisableFileSharing` | `false` |

文件最大 **10 MiB**，文件名和内容均加密并认证。只有收到完整流和经过认证的 EOF 后才显示接收提议。明确接受并重新检查身份/信任后，文件保存到 `received-files`，使用清理过的名称与随机前缀，不会自动打开或执行。

最多四个提议（其中最多一个文件）等待同意，期限为 60 秒。禁用共享、断线或切换传输模式会取消正在进行的文件操作。`/k04m-share disable-files` 或 `permanentlyDisableFileSharing=true` 会持久化账号级文件共享锁。

## 开发 API 和通道数量

公共 API 默认关闭，通过 `enableDataApi=true` 启用；`apiReceiver` 是便捷发送的默认目标。文件共享使用独立开关，不要求启用公共 API。

`apiChannelCount` 默认 `16`，范围 `1..256`。安装 Cloth Config 时修改其配置；没有 Cloth Config 时，在 `config/krypt04mcg-stream.json` 中设置同名字段：

```json
{ "apiChannelCount": 16 }
```

更改后需要重启客户端。服务端同时设置 `api-channel-count`，可用槽位需要双方客户端已订阅，且服务端有空闲槽位。见[加密流 API](../reference/api.md)。
