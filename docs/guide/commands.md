# 命令参考

客户端主命令是 `/k04m`，也可使用 `/Krypt04Mcg:enc` 和 `/Krypt04Mcg:k04m`。尖括号表示需要替换的参数，方括号表示可选参数，不要把括号原样输入。

## 消息与会话

| 命令 | 用途 |
| --- | --- |
| `/k04m tell <receiver> <message>` | 使用接收者长期 KEM 公钥发送加密消息，不附加签名 |
| `/k04m stell <receiver> <message>` | 使用长期 KEM 公钥发送带签名的加密消息 |
| `/k04m exchange <receiver>` | 进行签名的临时 KEM 会话握手 |
| `/k04m etell <receiver> <message>` | 使用已建立会话发送 AEAD 消息 |
| `/k04m resend [messageId]` | 请求重发；可指定消息 ID |
| `/k04m session list` | 列出会话 |
| `/k04m session clear <player>` | 清理指定玩家的会话 |
| `/k04m session refresh <player>` | 刷新指定玩家的会话 |

::: tip 如何选择
一般测试可从 `stell` 开始；会话建立成功后使用 `etell`。未签名 `tell` 需要经过认证的聊天或载荷传输；系统消息（Shadow Listen）缺少经过认证的玩家身份，不接受这种未签名消息。
:::

## 群组

```text
/k04m group create <name> <members>
/k04m group list
/k04m group delete <name>
/k04m gtell <group> <message>
```

群组消息通过已有的逐成员发送流程实现。成员参数格式以游戏中的命令提示为准。

## 算法与状态

```text
/k04m showalgs
/k04m status <player>
```

`status` 显示该玩家存储的长期 KEM 和签名算法，没有公钥时显示未知。单独标注的本地配置代表你自己的设置。对方公钥导出不包含其临时 KEM 或 AEAD 配置，存储记录不会自动反映远端之后的密钥变化。

## 密钥与信任

| 命令 | 用途 |
| --- | --- |
| `/k04m key` / `/k04m key gui` | 打开密钥管理界面（0.27.0 起） |
| `/k04m key list` | 列出密钥 |
| `/k04m key fingerprint <player>` | 查看完整指纹 |
| `/k04m key export` | 导出当前账号可分享的公钥 JSON |
| `/k04m key import <player> <data-or-file>` | 导入公钥文件路径、JSON 或 Base64URL |
| `/k04m key delete <player>` | 移除该玩家的导入公钥、信任和保存会话 |
| `/k04m key remove <player>` | `delete` 的别名 |
| `/k04m key regenerate` | 显示当前 KEM 指纹与重新生成的确认命令 |
| `/k04m key regenerate <current-kem-fingerprint>` | 确认替换本地两组密钥 |
| `/k04m key verify <player> <kem-fingerprint>:<signature-fingerprint>` | 用核对过的完整指纹对验证身份 |
| `/k04m key trust <player>` | 调整信任状态，不能替代游戏外指纹核对 |
| `/k04m key distrust <player>` | 将身份标记为不信任，拒绝相应消息和会话变更 |

玩家名不区分大小写；不能用 `delete` 删除自己的密钥。密钥替换会影响现有信任，请先阅读[密钥指南](./keys.md)。

0.27.0 的密钥管理界面与这些命令使用相同的存储和信任规则。左侧列出本机身份与已导入玩家并显示信任状态，右侧显示算法和可复制的完整指纹；底部提供导入、导出和重新生成，联系人条目还提供 Verify、Distrust 与 Delete。也可以在 Controls 中绑定默认未分配的 **Open Key Manager** 按键。

## 可选共享

```text
/k04m-share key [player]
/k04m-share file <player> <path>
/k04m-share disable-files
```

这些功能需要兼容的服务端通道和 `CUSTOM_PAYLOAD` 模式。公钥提议只有在接收方接受后才会导入。文件共享需要双方已导入公钥，并分别启用文件发送和接收；当前限制为 **10 MiB**。详情见[共享配置](./configuration.md#公钥与文件共享)。

## 服务端管理

安装中继插件后，服务端使用：

```text
/kryptrelay reload
```

修改配置或语言后运行此命令。重载会中止活动流，建议避开传输过程。配置项见[插件配置](../relay/configuration.md)。
