# 插件配置

首次运行会在插件数据目录创建 `config.yml` 和语言文件。以下是 README 给出的默认配置：

```yaml
language: zh_cn
api-channel-count: 16
announce-plugin-installed: true
echo-to-sender: false
notify-offline-receiver: true
notify-malformed-fragment: true
enforce-sender-match: true
kick-krypt04mcg-chat-spam: false
fragment-timeout-seconds: 120
max-pending-messages: 128
max-fragments-per-message: 2048
```

修改后运行：

```text
/kryptrelay reload
```

执行重载需要 `krypt04mcg.relay.admin` 权限，默认授予 OP。

::: tip 重载影响
重载会清空聊天相关队列并中止活动流。调整流通道数量时，也要修改客户端 `apiChannelCount` 并重启客户端。
:::

## 配置项

| 配置 | 作用 |
| --- | --- |
| `language` | 选择 `zh_cn` 或 `en_us` |
| `api-channel-count` | 流数据槽位数量，默认 16，限制在 `1..256` |
| `announce-plugin-installed` | 向玩家发送插件已安装提示，提醒兼容客户端启用 Shadow Listen |
| `echo-to-sender` | 是否同时向发送者回显中继消息 |
| `notify-offline-receiver` | 是否提示目标玩家离线 |
| `notify-malformed-fragment` | 是否提示格式错误 |
| `enforce-sender-match` | 校验包内部发送者与实际发送玩家一致 |
| `kick-krypt04mcg-chat-spam` | `false` 时尝试绕过加密片段的垃圾聊天踢出；需要兼容 ProtocolLib |
| `fragment-timeout-seconds` | 未完成片段超时，限制在 `5..3600` 秒 |
| `max-pending-messages` | 待重组消息上限，限制在 `1..1024` |
| `max-fragments-per-message` | 单条消息片段上限，默认 `2048`，限制在 `1..2048` |

`kick-krypt04mcg-chat-spam: true` 表示使用正常垃圾聊天踢出行为。该选项不改变非 Krypt04Mcg 的普通聊天；支持的拦截还覆盖 `/tell`、`/msg`、`/w` 中的 Krypt04Mcg 片段，不拦截其他命令和普通私信。

## 语言文件

```text
messages_zh_cn.yml
messages_en_us.yml
```

修改语言后重载即可。自定义语言文件缺失时回退到英文，不中断重载。语言标识经别名归一化后只允许字母、数字和下划线。

## 聊天队列与内存边界

聊天采用 1,024 项入口队列，每 tick 最多处理 64 个输入片段和 64 次发送，交错执行并在操作间检查共享 2 ms 时间预算；单次解码或发送仍可能超出预算。

完成消息逐步发送，出口最多保留 64 条消息，投递期限为 10 秒。1.9.0 已取消出口、全局及每玩家的缓冲文本字符限额；并发大包因此会占用更多内存。普通聊天/命令收集器仍限制每个玩家 UUID 最多 16 条待组装消息、配置的全局待组装数，以及每包 256 KiB / 最多 2,048 片。未完成消息从首片起计算固定超时，新片和重复片都不续期。新 ID 超限时忽略，不驱逐在途消息；完成、超时、退出和重载释放名额。

旧 `config.yml` 不会自动覆盖已有值。升级后如需大包支持，请将 `max-fragments-per-message` 改为 `2048`，保留默认 `fragment-timeout-seconds: 120`，然后重启或执行 `/kryptrelay reload`。两端客户端也需升级到 0.29.0。大包在可用时自动通过自定义载荷快速发送，避免普通聊天每秒一片导致超时；没有载荷通道会提前提示缩短消息或更新中继。自定义载荷和原始流转发不经过普通聊天收集器。

超额入口、溢出或过期投递会被丢弃。断线清理关联投递，重载或禁用清空队列。

## 旧载荷预算

README 中普通聊天及旧公钥/文件载荷的主要预算如下，突发额度另见上游完整说明：

| 预算 | 速率 |
| --- | --- |
| 每个来源入口 | 256 包/秒、2 MiB/秒 |
| 每个传输入口总量 | 2,048 包/秒、8 MiB/秒 |
| 每个来源出口 | 2,048 次发送/秒、8 MiB/秒 |
| 全局出口 | 8,192 次发送/秒、32 MiB/秒 |

广播按每位接收者计费。超额流量无投递确认，未完成传输需要重试。原始流与 tunnel 数据绕过旧配额；控制消息仍保留入口预算，服务端网络限制仍适用。

完整实现细节以[插件 README](https://github.com/jinnang233/Krypt04mcg-plugin#readme)及实际安装版本为准。
