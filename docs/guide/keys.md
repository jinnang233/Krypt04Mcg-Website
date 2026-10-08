# 密钥、信任与存储

公钥用于让其他玩家加密消息和验证签名；私钥和存储主密钥必须留在自己的设备上。首次导入和完整指纹核对是两件不同的事。

## 密钥管理界面

0.27.0 起，Fabric 和 NeoForge 都可以直接打开密钥管理界面：

```text
/k04m key
/k04m key gui
```

也可以在 Controls 中为 **Open Key Manager** 绑定按键（默认未绑定）。左侧列表包含自己的身份和已导入玩家，并用状态标记区分 `VERIFIED`、TOFU、`DISTRUSTED` 等状态；右侧显示该身份的 KEM / 签名算法和完整指纹，可直接复制。

GUI 的 Import 接受玩家名以及公钥文件路径、JSON 或 Base64URL；Export 只导出自己的可分享公钥并复制文件路径；Verify 仍要求通过可信渠道核对两份完整指纹；Delete 会确认移除导入身份、信任记录和已保存会话；Regenerate 要求输入当前 KEM 指纹，并按配置中选中的长期 KEM 与签名算法重新生成。它没有绕过下文的 TOFU 与密钥轮换规则。

## 首次导入与身份验证

Krypt04Mcg 使用 **TOFU（Trust On First Use，首次使用即信任）**。第一次导入会自动建立信任；后续出现不同公钥时，会拒绝静默覆盖。

通过可信的游戏外渠道核对对方完整 KEM 与签名指纹，然后执行：

```text
/k04m key fingerprint Bob
/k04m key verify Bob <KEM 完整指纹>:<签名完整指纹>
```

`VERIFIED` 记录绑定玩家名称及两份公钥指纹。`DISTRUSTED` 身份在解密或会话状态变更之前被拒绝。

## 替换对方的密钥

先确认对方确实更换了密钥，并通过可信渠道取得新公钥和新指纹。然后：

```text
/k04m key delete Bob
/k04m key import Bob <新公钥文件或 JSON>
/k04m key verify Bob <新 KEM 完整指纹>:<新签名完整指纹>
```

`delete`（别名 `remove`）同时移除该玩家的导入公钥、信任记录和保存的会话。替换后的记录重新从 TOFU 开始，需要再次验证。玩家名不区分大小写，不能这样删除自己的密钥。

## 重新生成自己的密钥

1. 在配置中选择新的长期 KEM 和签名参数集。
2. 运行 `/k04m key regenerate`，读取当前 KEM 指纹及显示的确认命令。
3. 使用当前完整指纹确认替换：

   ```text
   /k04m key regenerate <current-kem-fingerprint>
   ```

4. 重新导出并分发公钥。其他玩家需要显式替换旧记录并重新核对指纹。

仅修改配置不会替换已有密钥。收件人长期 KEM 路径与会话的临时 KEM 设置相互独立。

## 从旧 CMCE 密钥升级

当前源码使用 Bouncy Castle 1.86。该版本删除了旧 round-3 CMCE 实现，并移除了 `CMCE/mceliece348864` 和 `CMCE/mceliece348864f` 配置选项。更重要的是，**旧 round-3 CMCE 密钥不能被 1.86 解码**，即使某些参数大小在新的 ISO CMCE API 中仍然存在。

如果旧账号曾使用 CMCE，升级前先完整备份账号存储，然后选择当前支持的 KEM、重新生成本机密钥、导出新公钥，并让联系人显式删除旧记录、导入新公钥并重新核对指纹。现有 ML-KEM 密钥不受这项 CMCE API 迁移影响。

## 按账号隔离的存储

```text
config/krypt04mcg/accounts/<minecraft-uuid>/
  keys/
    private/local.json
    public/*.json
  export/
  sessions/
  cache/
  secrets/master.key
```

私钥与公钥分开，按当前 Minecraft 账号隔离。私钥、信任绑定、会话秘密以及启用的聊天历史使用 AES-256-GCM 存储加密。

Windows 使用当前用户的 DPAPI 保护存储主密钥；其他平台使用仅所有者可访问的主密钥文件。敏感写入采用原子写入，并在平台支持时应用仅所有者权限。公钥记录包含算法、所有者、UUID、完整 SHA-256 指纹、创建时间和 Base64URL 密钥数据。

0.27.5 中的群组 `groups.json`、已发送密文缓存 `cache/sent-fragments.json` 和解密/旧交换重放历史 `cache/decryption-history.json` 保留 JSON 格式，读写均限制到文件所有者，并拒绝最终文件或父目录中的符号链接、悬空链接。群组和已发送缓存更新使用私有临时文件替换。此前使用链接共享这些文件时，应先备份并迁移到普通本地目录。

## 历史与备份

聊天历史默认不保存到磁盘。启用 `enableConversationHistory` 后，最多最近 300 条记录存储在加密的：

```text
config/krypt04mcg/accounts/<minecraft-uuid>/cache/conversations.json
```

**备份时把账号目录作为一个整体处理。** 若 `secrets/master.key` 丢失，必须恢复原始密钥；生成新密钥不能恢复旧的加密文件。Windows 备份还应考虑 DPAPI 与用户环境的绑定，不要假设复制到其他系统账号后可直接使用。

存储目录必须支持仅所有者权限，不能使用符号链接或目录联接。请勿通过公钥交换渠道分享完整备份。
