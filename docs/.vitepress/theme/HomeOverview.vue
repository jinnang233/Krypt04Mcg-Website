<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <div class="home-overview">
    <div class="project-notice">
      <span class="notice-label">实验性项目</span>
      <p>尚未经过独立安全审计。请勿用于生产环境或保护敏感数据。</p>
      <a :href="withBase('/reference/security.html')">阅读安全与限制 <span aria-hidden="true">↗</span></a>
    </div>

    <section class="home-section" aria-labelledby="ecosystem-title">
      <div class="section-heading">
        <div><span class="eyebrow">ONE PROJECT, TWO SIDES</span><h2 id="ecosystem-title">选择你的起点。</h2></div>
        <p>玩家从客户端开始，服主按需添加中继。</p>
      </div>
      <div class="project-grid">
        <a class="project-card" :href="withBase('/guide/installation.html')">
          <div class="card-top"><span class="project-number">01 / CLIENT</span><span aria-hidden="true">↗</span></div>
          <h3>Krypt04Mcg</h3>
          <p>导入公钥，核对指纹，在游戏内发送加密消息。支持一次性消息、签名消息与会话聊天。</p>
          <div class="tags"><span>Fabric</span><span>NeoForge</span><span>Java 25</span></div>
          <div class="card-link">安装客户端 <span aria-hidden="true">→</span></div>
        </a>
        <a class="project-card" :href="withBase('/relay/index.html')">
          <div class="card-top"><span class="project-number">02 / RELAY</span><span aria-hidden="true">↗</span></div>
          <h3>Krypt04McgRelay</h3>
          <p>把加密片段送到目标玩家，提供可选载荷与加密流通道。消息正文的加密和解密仍在客户端完成。</p>
          <div class="tags"><span>Bukkit / Spigot</span><span>可选安装</span><span>Java 25</span></div>
          <div class="card-link">部署服务端插件 <span aria-hidden="true">→</span></div>
        </a>
      </div>
    </section>

    <section class="first-message" aria-labelledby="first-message-title">
      <div class="message-copy">
        <span class="eyebrow">YOUR FIRST ENCRYPTED MESSAGE</span>
        <h2 id="first-message-title">先认识彼此，<br>再开始对话。</h2>
        <p>通过可信的游戏外渠道交换公钥，核对双方完整指纹，然后建立会话。Bob 只是示例玩家名。</p>
        <a :href="withBase('/guide/quick-start.html')">跟随快速入门 <span aria-hidden="true">→</span></a>
      </div>
      <div class="terminal" aria-label="加密聊天命令示例">
        <div class="terminal-bar"><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-title">MINECRAFT / CHAT</span></div>
        <div class="terminal-body">
          <p class="terminal-comment"># 双方先导出、交换并导入公钥</p>
          <p><span class="prompt">›</span> /k04m key export</p>
          <p><span class="prompt">›</span> /k04m key import Bob &lt;公钥文件&gt;</p>
          <p class="terminal-comment"># 完成指纹验证后，建立会话并发送</p>
          <p><span class="prompt">›</span> /k04m exchange Bob</p>
          <p><span class="prompt">›</span> /k04m etell Bob 你好，方块世界！</p>
        </div>
      </div>
    </section>

    <section class="home-section reading-section" aria-labelledby="reading-title">
      <div class="section-heading"><div><span class="eyebrow">EXPLORE THE DOCS</span><h2 id="reading-title">继续探索。</h2></div></div>
      <div class="reading-grid">
        <a :href="withBase('/guide/configuration.html')"><span>01</span><h3>传输与配置 <span aria-hidden="true">↗</span></h3><p>聊天、自定义载荷、历史记录与文件共享。</p></a>
        <a :href="withBase('/reference/api.html')"><span>02</span><h3>开发者接口 <span aria-hidden="true">↗</span></h3><p>基于加密字节流构建你的客户端集成。</p></a>
        <a :href="withBase('/guide/faq.html')"><span>03</span><h3>遇到问题？ <span aria-hidden="true">↗</span></h3><p>检查密钥、传输方式和服务端兼容性。</p></a>
      </div>
    </section>
  </div>
</template>
