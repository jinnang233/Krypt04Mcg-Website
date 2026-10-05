# 发送第一条消息

下面以 Alice 和 Bob 为例。双方都已[安装客户端](./installation.md)，进入同一测试服务器。将示例中的玩家名和文件路径替换成实际值。

::: warning 开始前
这是实验性软件，不适合生产环境或敏感数据。首次导入的 TOFU 信任不能替代身份核对；请通过可信的游戏外渠道交换公钥和完整指纹。
:::

## 1. 双方导出公钥

Alice 和 Bob 分别执行：

```text
/k04m key export
```

导出的可分享公钥 JSON 位于当前 Minecraft 账号目录：

```text
config/krypt04mcg/accounts/<minecraft-uuid>/export/
```

把导出的 JSON 通过可信的游戏外渠道发给对方，并提供打印出的完整 KEM 和签名指纹。**只分享导出的公钥，不要发送 `private/`、`secrets/` 或整个账号存储目录。**

## 2. 双方导入对方的公钥

Alice 导入 Bob 的公钥：

```text
/k04m key import Bob <Bob 的公钥文件路径>
```

Bob 导入 Alice 的公钥：

```text
/k04m key import Alice <Alice 的公钥文件路径>
```

也可以直接提供导出的 JSON。用以下命令检查已导入的记录：

```text
/k04m key list
/k04m key fingerprint Bob
/k04m status Bob
```

第一次导入自动建立 TOFU 信任。如果之前已有不同的公钥，模组会拒绝静默覆盖；请先调查原因，再按[密钥更换流程](./keys.md#替换对方的密钥)操作。

## 3. 核对完整指纹

通过可信的游戏外渠道，核对双方各自的 **完整 KEM 指纹和完整签名指纹**。确认后，Alice 执行：

```text
/k04m key verify Bob <KEM 完整指纹>:<签名完整指纹>
```

Bob 对 Alice 执行相同操作。两个完整指纹之间用英文冒号 `:` 连接，不要使用缩略指纹。通过核对后，身份可以标记为 `VERIFIED`。

## 4. 发送一条签名加密消息

Alice 可以先用 `stell` 测试：

```text
/k04m stell Bob 你好，Bob！
```

`stell` 通过接收者的长期 KEM 公钥加密，并附带发送者签名。双方都要导入对方公钥，以便加密和验证签名。

## 5. 建立会话并继续聊天

Alice 发起签名的会话交换：

```text
/k04m exchange Bob
```

等待会话建立成功后再发送：

```text
/k04m etell Bob 这是一条会话消息。
```

`etell` 使用会话密钥和 AEAD，不为每条消息附加后量子签名。协议 v4 会话消息认证会话 ID 和单调序号；双方都需要支持 v4 的客户端。

可以查看或刷新会话：

```text
/k04m session list
/k04m session refresh Bob
```

## 6. 使用聊天面板

通过游戏中的 Krypt04Mcg 按键绑定打开加密聊天面板。面板显示已导入玩家、最近通信对象和已配置群组；群组以 `#` 前缀显示。

磁盘聊天历史默认关闭；当前运行期间的界面仍可在内存中显示最多 300 条记录。有关保存设置、文件共享或自定义载荷，请查看[配置指南](./configuration.md)。

## 没有收到消息

先确认双方公钥、信任状态和传输设置。默认聊天可能受到过滤、限速或反垃圾插件影响。使用中继转发的 `<Alice> ...` 系统消息时，需要匹配的 Shadow Listen 设置，并使用 `stell`、`exchange` 或已建立会话的 `etell`。详见[排查指南](./faq.md)。
