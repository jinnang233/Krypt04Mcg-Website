# 协议与通道

本页用于理解传输边界，字段布局以对应版本客户端 `PacketCodec` 和插件实现为准。

## 聊天分片

聊天中的二进制包使用 Base64URL 编码并自动分片：

```text
[KRYPT04MCG] <messageIdHex> <index> <total> <payload>
```

接收端支持乱序重组、忽略重复片段、清理超时消息，并限制待处理消息与片段数量。

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

::: info 版本文档差异
本地客户端 README 的部分段落仍称流中继是未来实现；插件 README 已描述原始流支持。这些描述来自不同组件，实际使用前应核对所选构建是否广告相同通道，不应把所有历史功能视为同一版本的可用能力。
:::

## 原始加密流

控制通道解码 `EXCHANGE`、`OPEN`、`ASSIGNED`、`READY`、`END`、`RESET`、`ABORT`。控制载荷包含类型、peer、流 UUID、slot、应用通道、会话 ID、序号及有界 body。

OPEN 请求槽位 `-1`；中继分配双方都支持的空闲槽位，向发起者发送 ASSIGNED，然后将 OPEN 转发给对方。对方验证 OPEN、保留持久化防重放计数并发送绑定槽位的认证 READY。

数据通道只含 **XChaCha20-Poly1305 密文和 16 字节认证标签**，没有外层应用头、流 ID、nonce、分片元数据、Base64 或 JSON。单个记录最多保护 16 KiB 明文，由 Minecraft 提供有序可靠交付和记录边界。

中继按同一槽位转发原始字节，不检查或解密内容。仅分配的玩家、READY 后且该发送方向 END 前可发送数据。双方 END、RESET、断线、订阅消失或 60 秒空闲会释放槽位。

## EOF 与失败

EOF 是包含最终记录数的经过认证的控制消息。丢失记录、非认证关闭、连接丢失或标签验证失败不能变成成功 EOF。READY 只表示分配就绪；没有逐数据 ACK 或完成回执。ABORT 始终表示失败。

如何在客户端消费流，见[加密流 API](./api.md)。密码设计和信任限制见[安全与限制](./security.md)。
