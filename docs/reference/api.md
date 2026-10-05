# 加密流 API

当前客户端的公共 API 使用字节流，已替换旧可靠传输 API。旧 `DataTransfer`、`TransferResult`、DATA/ACK/NACK 封装、完成回执和重传不再是当前 API 的使用方式。

## 启用与前提

- 设置 `enableDataApi=true`，双方已导入彼此公钥。
- 服务端广告兼容的 `krypt04mcg_stream:control` 与数据槽位通道。
- `apiChannelCount` 默认 16，可设 `1..256`，修改后重启客户端。
- 公共 API 没有普通聊天回退；通道不可用时请求失败，但不妨碍登录或聊天。

文件共享有自己的开关，不需要启用公共 API。

## Socket 接口

核心类型来自 `dev.krypt04mcg.api`。以下是基于 README 的调用示意，`executor`、`bytes` 和跨 tick 发送状态由你的集成提供：

```java
import dev.krypt04mcg.api.Krypt04McgApi;
import dev.krypt04mcg.api.KryptSocket;

// 在 Minecraft 客户端线程注册。
Krypt04McgApi.registerSocketReceiver("example:stream", socket -> {
    executor.execute(() -> {
        try {
            // 在后台线程读取；实际应用应使用有界读取并设置大小限制。
            byte[] received = socket.getInputStream().readAllBytes();
            // 处理经过认证的字节。
        } catch (java.io.IOException failure) {
            // RESET、认证失败、截断、超时或断线。
        }
    });
    socket.close(); // 半关闭输出，输入仍可读。
});

// 在客户端线程连接；保存 socket 和 offset 跨 tick 使用。
KryptSocket socket = Krypt04McgApi.connect("Bob", "example:stream");
int offset = 0;
```

在后续每个客户端 tick 中，单一生产者执行一步：

```java
int count = Math.min(socket.writableBytes(), bytes.length - offset);
if (count > 0) {
    socket.getOutputStream().write(bytes, offset, count);
    offset += count;
}
if (offset == bytes.length) {
    socket.close(); // 排队字节先于认证 EOF 发送。
}
// 没有容量时返回主循环，下一个 tick 再继续，不要忙等。
```

调用者需处理 `IOException` 或 `socket.isFailed()`，失败后停止发送。示例用于展示 API 结构，不能原样作为完整独立程序运行。

## 线程与缓冲语义

连接、控制和监听回调在 Minecraft 客户端线程执行。**读取可能阻塞，不要在客户端线程读取。** 写入只把字节复制进队列，可以在交换或分配尚未完成时调用。

每个方向最多缓冲 1 MiB。写入超出容量会抛出 `IOException`，不会部分接受写入。`writableBytes()` 检查不会预留容量，多生产者必须在 socket monitor 上把检查和写入一起串行化。

`close()` 半关闭输出；关闭输入取消流。空闲、分配和交换超时为 60 秒。并发流数量受通道池限制，调度在活动流之间轮换。

## 便捷接口

| 方法 | 语义 |
| --- | --- |
| `send(player, channel, bytes)` | 返回 `void`，发送一个流并 EOF，最多 1 MiB |
| `registerReceiver(channel, (sender, bytes) -> ...)` | 在客户端线程接收流片段；每次回调不代表完整应用消息 |
| `connect(player)` | 返回 `KryptSession` |
| `KryptSession.ready()` | 本地会话交换就绪 |
| `KryptSession.isReady()` / `sessionId()` | 查询就绪状态与会话 ID |
| `KryptSession.send(channel, bytes)` | 与便捷发送相同的语义 |

应用若需要消息边界，应自行定义流内内容格式。API 不声称远端投递或持久化完成；会话 readiness 也不是数据完成回执。公开 handle 不暴露会话秘密。

## 加密与认证边界

数据直接使用 Bouncy Castle 的 XChaCha20-Poly1305。HKDF-SHA256 按会话、流 ID、槽位、应用通道、方向和用途隔离密钥。24 字节 nonce 由流 ID 与隐式方向记录计数构成，链路仅发送密文和标签。

验证认证标签后才释放明文。重放、重排、反射与跨通道替换会认证失败。自连接被拒绝，因为两端必须拥有不同方向密钥。

会话交换与聊天会话分开存储在 `stream-api`。交换 body 必须适配 30,000 字节的单个控制载荷，过大的交换材料会失败，不能靠额外分片处理。

## 上游参考

API 是正在演进的实验性接口。集成时核对[客户端 README](https://github.com/jinnang233/Krypt04Mcg#raw-encrypted-channel-api)与实际版本源码，服务端行为见[协议与通道](./protocol.md)。
