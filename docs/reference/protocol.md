# 协议与通道

本页用于理解传输边界，字段布局以对应版本客户端 `PacketCodec` 和插件实现为准。

## 聊天分片

聊天中的二进制包使用 Base64URL 编码并自动分片：

```text
[KRYPT04MCG] <messageIdHex> <index> <total> <payload>
```

接收端支持乱序重组、忽略重复片段、清理超时消息，并限制待处理消息与片段数量。

0.29.0 客户端要求 32 位十六进制消息 ID、最多四位十进制索引、最多 2,048 个片段和无填充 Base64URL 载荷；完整二进制聊天包最多 256 KiB，包含 KEM 密文、正文密文、签名及包头。默认载荷 180 字符可容纳上限包；配置更小的载荷时，会按需增大单片载荷，但每行仍最多 256 字符。自定义前缀过长仍可能导致无法分片。

组装期限从第一片起计算两分钟，新索引不续期；最多 128 条待组装消息、每个传输来源最多 16 条，无绑定系统聊天共享限额。新 ID 不驱逐在途消息，ID 大小写共享组装，断线、加入服务器或保存设置清理残留。预计超过期限的大包在服务器支持时自动使用自定义载荷，以每 50 ms 一片发送；发送队列也检查等待时间和固定期限，接收端的新鲜度及重放校验保持原样。

中继 1.9.0 默认允许 2,048 个片段和 256 KiB 完整包，取消了全局、每玩家及完成消息出口的缓冲文本字符限额；仍限制每玩家最多 16 条待组装消息及配置的全局消息数。自定义载荷逐片转发，不经过普通聊天收集器。双方客户端都应升级；旧版客户端仍只有 512 片容量。原始流 API 使用独立的传输和资源限制。

## 包类型与版本

| 包类型 | 标识 | 用途 |
| --- | --- | --- |
| KEM encrypted message | `1` | 未签名加密消息 |
| Signed KEM encrypted message | `2` | 带签名加密消息 |
| SESSION_EXCHANGE | `3` | 签名会话交换 |
| SESSION_MESSAGE | `4` | 会话消息 |

二进制包包含版本、类型、标志、发送者、接收者、时间戳、16 字节消息 ID、条件性的算法标识、AEAD / HKDF 标识、nonce、KEM 密文、消息密文及条件性签名。

- **v3**：会话消息省略 KEM 标识，未签名消息省略签名算法标识；移除旧包级分片索引和总数字段。
- **v4**：仅 SESSION_MESSAGE 在消息 ID 后加入 `sessionId` 和 `sequence`，并完全省略签名长度和内容；SESSION_EXCHANGE 保留后量子签名。
- **兼容性**：非会话消息保留 v1–v3 解码；旧 v1–v3 会话消息被拒绝，双方必须升级。

## 聊天自定义载荷

```text
channel: krypt04mcg:chat_fragment
C2S: string receiver, string fragment, varint version
S2C: string sender,   string fragment, varint version
```

两个方向的首字段含义不同。服务端必须从实际玩家连接取得 S2C `sender`，不能接受客户端自称的发送者，也不能把 C2S `receiver` 直接复制成发送者。

## 通道概览

| 通道 | 用途 | 状态 |
| --- | --- | --- |
| `krypt04mcg:chat_fragment` | 聊天片段转发 | 可选 |
| `krypt04mcg:public_key` | 公钥提议 | 接受后导入；仅公钥允许 `*` 广播 |
| `krypt04mcg:file_share` | 旧式文件转发 | 插件保留；当前客户端文件共享已改为加密流 |
| `krypt04mcg:data` | 旧式数据封装 | 插件保留；当前公共 API 已替换 |
| `krypt04mcg_stream:control` | 流握手、分配、READY、END、RESET、ABORT | 当前原始流控制 |
| `krypt04mcg_stream:data/0` … `data/(n-1)` | 原始加密记录 | 由 `apiChannelCount` / `api-channel-count` 配置 |
| `krypt04mcg:tunnel` | socket tunnel 转发 | 插件 README 标注客户端 0.22.0 |

::: info 旧通道兼容性
本文以客户端 0.29.0 与插件 1.9.0 为基准，两端均实现上述原始流通道。插件保留的旧通道供旧客户端使用；当前客户端 API 和文件共享使用原始加密流。使用其他版本时仍须核对双方是否支持相同通道。
:::

## 原始加密流

控制通道解码 `EXCHANGE`、`OPEN`、`ASSIGNED`、`READY`、`END`、`RESET`、`ABORT`。控制载荷包含类型、peer、流 UUID、slot、应用通道、会话 ID、序号及有界 body。

OPEN 请求槽位 `-1`；中继分配双方都支持的空闲槽位，向发起者发送 ASSIGNED，然后将 OPEN 转发给对方。对方验证 OPEN、保留持久化防重放计数并发送绑定槽位的认证 READY。

数据通道只含 **XChaCha20-Poly1305 密文和 16 字节认证标签**，没有外层应用头、流 ID、nonce、分片元数据、Base64 或 JSON。单个记录最多保护 16 KiB 明文，由 Minecraft 提供有序可靠交付和记录边界。

中继按同一槽位转发原始字节，不检查或解密内容。仅分配的玩家、READY 后且该发送方向 END 前可发送数据。双方 END、RESET、断线、订阅消失或 60 秒空闲会释放槽位。

## EOF 与失败

EOF 是包含最终记录数的经过认证的控制消息。丢失记录、非认证关闭、连接丢失或标签验证失败不能变成成功 EOF。READY 只表示分配就绪；没有逐数据 ACK 或完成回执。ABORT 始终表示失败。

如何在客户端消费流，见[加密流 API](./api.md)。密码设计和信任限制见[安全与限制](./security.md)。
