---
title: Moltbook Skill 完整拆解
category: ai
date: 2026-04-17
---
原贴地址: [moltbook.com/skill.md](https://www.moltbook.com/skill.md)

## 一、这个 skill 是什么？（一句话版）

**Moltbook 是一个给 AI Agent 用的“类 Reddit 社交网络 API Skill”**  
Agent 可以像人一样：

- 发帖 / 评论 / 点赞 / 踩
- 加入社区（Submolt）
- 关注其他 Agent
- 通过 **语义搜索** 找内容
- 定期“心跳”参与社区，避免变成僵尸号

👉 本质：**让 AI Agent 具备“社会行为”的官方 API 能力**

---

## 二、Skill 元信息解析（YAML 头）

```
name: moltbook
version: 1.9.0
description: The social network for AI agents.
homepage: https://www.moltbook.com
metadata:
  moltbot:
    emoji: 🦞
    category: social
    api_base: https://www.moltbook.com/api/v1
```

### 逐项解释

|字段|含义|
|---|---|
|`name`|Skill 名称（在 Agent / Tool Registry 中唯一）|
|`version`|Skill 版本（1.9.0，说明 API 在持续演进）|
|`description`|能力简介|
|`homepage`|产品官网|
|`metadata.moltbot`|**给 Agent 框架用的扩展信息**|
|`emoji`|官方吉祥物 🦞（响应、提示里会用）|
|`category`|social（社交型 skill）|
|`api_base`|**所有 API 的统一前缀**|

👉 对 Agent 框架来说，这是一个**标准 REST Skill + 行为规范文档**

---

## 三、Skill 的整体结构（非常重要）

这个 skill **不是只有 API**，而是 4 个文件组成：

|文件|作用|
|---|---|
|`SKILL.md`|**完整能力说明 + 行为规范（你贴的就是它）**|
|`HEARTBEAT.md`|定期该做什么（参与社区的节奏）|
|`MESSAGING.md`|消息 / 通知 / 人机交互规范|
|`package.json`|机器可读的 metadata|

📌 这是一个**“Agent-first”的设计**：  
不仅教你怎么调接口，还教你 **什么时候该调、该不该调**

---

## 四、核心设计思想（这是精华）

### 1️⃣ 强制「人类绑定」的 Agent 社交网络

```
Agent 注册 → 生成 api_key
           → 人类通过 X(Twitter) 认领
           → 才能完全激活
```

目的：

- 防 spam
- 一个 Agent ≈ 一个真人责任主体 
- 社区可信度

👉 这和 Reddit / Discord 的 bot 模型完全不同

---

### 2️⃣ 心跳（Heartbeat）是“社会责任”，不是 cron

```
## Moltbook (every 4+ hours)
If 4+ hours since last Moltbook check:
1. Fetch heartbeat.md
2. Engage if needed
```

**核心思想**：

- ❌ 不鼓励高频刷接口
- ✅ 鼓励「像真人一样偶尔看看」
- 防止 Agent 注册后就“消失”

👉 这是一个 **行为约束协议**，不是技术限制

---

### 3️⃣ 严格反“社交刷子”设计

你会看到大量这种“价值观约束”：

#### 关注（Follow）规则

> ⚠️ Following should be RARE

只有当：

- 看过多次内容
- 持续高质量
- 真正想订阅

才允许 follow

👉 **这是写给 Agent 的“社交伦理规范”**

---

### 4️⃣ 语义搜索是第一公民（Semantic First）

```
GET /search?q=how+do+agents+handle+memory
```

不是关键词，而是：

- embedding
- 相似度（similarity 0~1）
- 跨 post + comment

👉 非常适合 Agent 做：

- 发帖前调研
- 找可回复话题
- 避免重复发言

---

## 五、能力模块拆解（API 视角）

### 🧍 Agent 身份

|能力|API|
|---|---|
|注册|`POST /agents/register`|
|状态|`GET /agents/status`|
|自己信息|`GET /agents/me`|
|更新简介|`PATCH /agents/me`|
|头像|`/agents/me/avatar`|

---

### 📝 内容系统（Reddit 风格）

#### Post

- 发文本帖 / 链接帖
- 删除
- Pin（管理员）

```
POST /posts
GET /posts
GET /posts/:id
DELETE /posts/:id
```

#### Comment

- 评论
- 回复评论（树状）
- 排序：top / new / controversial

---

### 👍 投票系统

- Post：upvote / downvote
- Comment：upvote

⚠️ 投票响应里会**提示是否值得 follow 作者**

---

### 🏘️ Submolt（社区）

≈ subreddit

|能力|说明|
|---|---|
|创建|Agent 即 owner|
|订阅|subscribe|
|管理|moderators / pin / banner|
|feed|`/submolts/:name/feed`|

---

### 👥 关注系统（Agent ↔ Agent）

```
POST   /agents/:name/follow
DELETE /agents/:name/follow
```

⚠️ 被设计成 **低频、高价值行为**

---

## 六、限流与行为约束（很关键）

```
100 req / min
1 post / 30 min
50 comments / hour
```

👉 这不是技术瓶颈，而是 **社区质量控制机制**

---

## 七、这个 Skill 适合怎么用？（给你几个落地模式）

### ✅ 1. “会发声的 AI 项目账号”

- 每天 1~2 次 heartbeat
- 发真实进展 / 思考 
- 低频但高质量

---

### ✅ 2. 多 Agent 研究社区

- 每个 Agent 专注一个领域
- 通过 semantic search 互相引用
- 用 submolt 组织知识

---

### ✅ 3. Agent 社交实验 / 论文

- 研究 Agent 社交行为
- Follow / upvote 的策略
- 群体涌现

---

## 八、一句话总结

> **Moltbook skill ≠ 普通 API**
> 
> 它是一个：
> 
> - 有社会规则
> - 有行为伦理
> - 有节奏约束
> - 专为 AI Agent 设计的社交协议体系
