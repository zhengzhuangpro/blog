---
title: 当 CLI 工具成为 AI Agent 的手和脚
category: ai
pubDate: 2026-06-06
---

# 当 CLI 工具成为 AI Agent 的手和脚

> 开源地址：https://github.com/zhengzhuangpro/hotnews
>
> Agent Skills 生态：https://clawhub.ai/zhengzhuangpro/hotnews | https://www.skills.sh/

---

## 从一个 CLI 工具说起

故事的开头很简单。

每天早上，我会依次打开百度、微博、知乎、掘金、GitHub……看看今天大家都在聊什么。一个一个刷过去，10 分钟就没了。

作为一个终端重度用户，我想：**能不能用一条命令搞定？**

于是我做了 `hotnews`——一个命令行热搜聚合工具，一行命令获取 8 大平台的实时热门内容：

```bash
npm install -g hotnews

hotnews baidu      # 百度热搜
hotnews weibo      # 微博热搜
hotnews douyin     # 抖音热搜
hotnews zhihu      # 知乎热榜
hotnews hupu       # 虎扑热帖
hotnews juejin     # 掘金热门
hotnews kr36       # 36氪热榜
hotnews github     # GitHub Trending
```

支持控制条数、JSON 输出、管道组合：

```bash
hotnews weibo --limit 5           # 看微博 Top 5
hotnews baidu --json | jq '.[].title'  # 提取标题
```

到这里，它只是一个普通的 CLI 工具。

**但接下来发生的事情，才是这个故事真正有趣的部分。**

---

## 从工具到 Agent：一次意外的进化

做完 CLI 工具后，我一直在想：2026 年了，AI Agent 到处都是，但大部分 Agent 的"技能"还停留在聊天层面。能不能让一个 CLI 工具变成 AI Agent 的能力？

换句话说：**不是让人去用工具，而是让 AI 替你用工具。**

这个想法让我走上了两条路：

### 路径一：OpenClaw Agent（全自动）

我真正想要的是：**每天自动帮我收集热搜，整理好，推送到我的群里。**

这就要说到 [OpenClaw](https://clawhub.ai/) 了。

OpenClaw 是一个开源的 AI Agent 编排平台，可以在本地运行多个 Agent，每个 Agent 有自己的人格、记忆、工具权限，还能通过 Cron 定时触发、通过飞书/Telegram/钉钉等渠道推送消息。

![image.png](https://img.zhengz.cc/PicGo/20260519164809573.png)


我给 `hotnews` 创建了一个专属 Agent：**mac-hotnews**。

它的配置长这样：

```json
{
  "id": "mac-hotnews",
  "name": "mac-hotnews",
  "workspace": "~/.openclaw/workspace-hotnews",
  "model": "zai/glm-5-turbo",
  "tools": {
    "alsoAllow": ["exec", "web_search", "web_fetch", "feishu_im_user_message"]
  }
}
```

然后我给它写了"灵魂"（SOUL.md）：

```markdown
# 每日新闻助手

## 我是谁
我是每日新闻助手，负责每天定时从8大平台收集热点新闻，
整理后发送到飞书群。

## 核心职责
1. 每天上午9:30和下午15:00收集热点新闻
2. 从 baidu、weibo、douyin、hupu、kr36、zhihu、juejin、github 8个源抓取
3. 整理为清晰的格式发送到"mac-每日新闻"群
4. 每条新闻带标题、链接，方便点击查看
```

再给它设了两个定时任务：

```json
{ "cron": "30 9 * * *",  "name": "早间新闻播报" }
{ "cron": "0 15 * * *",  "name": "午后新闻播报" }
```

**从此以后，每天早上 9:30 和下午 3:00，mac-hotnews Agent 会自动醒来：**

1. 调用 `hotnews` CLI 抓取 7 个平台的热搜
2. 按平台分类整理，加上 emoji 标识
3. 通过飞书消息推送到群里
4. 记录到 Agent 记忆系统（它甚至会"做梦"来整理记忆）

效果就是，每天打开飞书群，已经整整齐齐地排好了：

> 📰 每日热点 | 2026-05-19 09:30
>
> 🔍 **百度热搜**
> 1. [xxx事件](https://baidu.com/...)
> 2. [xxx新闻](https://baidu.com/...)
>
> 🔥 **微博热搜**
> 1. [xxx话题](https://weibo.com/...)
> ...

**不需要我做任何事情。Agent 自己醒来，自己干活，自己发消息。**

这个 Agent 已经上架到了 [Clawhub](https://clawhub.ai/zhengzhuangpro/hotnews)，任何人都可以直接使用。

### 路径二：Claude Code Skill（手动调用）

全自动之外，还有一个轻量的选择。

我给 `hotnews` 写了一个 Skill 定义文件，发布到了 [Skills.sh](https://www.skills.sh/)——这是 Vercel 官方维护的 **AI Agent 技能市场**，支持 Claude Code、Cursor、Codex、GitHub Copilot、Windsurf、Gemini 等 **20+ 主流 AI 编程助手**。

安装只需要一行命令：

```bash
npx skills add https://github.com/zhengzhuangpro/hotnews --skill hotnews
```

装完后，在 Claude Code 里输入 `/hotnews baidu`，AI 就会自动调用 `hotnews` 获取数据，并用对话的方式呈现给你。

你可以这样玩：

- "帮我看看今天百度和微博的热搜有什么重合的"
- "对比一下知乎和掘金的技术热点"
- "用今天的热搜写一篇简报"

**你说话，AI 操作工具，结果以对话形式返回。** 这就是 Skill 的意义——给 AI 装上"手"。

---

## 两种模式对比

| | OpenClaw Agent | Claude Code Skill |
|---|---|---|
| **触发方式** | Cron 定时自动触发 | 手动输入 `/hotnews` |
| **运行环境** | OpenClaw 本地 Agent | Claude Code 会话中 |
| **输出方式** | 飞书群消息推送 | 终端对话 |
| **交互形式** | 自动执行、无需交互 | 可追问、可对话 |
| **记忆能力** | 持久化记忆 + 梦境整理 | 无 |
| **适合场景** | 每天定时获取，团队共享 | 写代码时顺便看热搜 |

简单说：**Agent 是"AI 自己查好了告诉你"，Skill 是"你让 AI 帮你查"。**

---

## 技术实现：用 React 写终端 UI

技术上，`hotnews` 有一些值得说的地方。

### React Ink：用 JSX 写终端界面

我用了 React Ink 来渲染终端 UI。没错，就是用 React 组件来写命令行界面：

```tsx
function NewsList({ source, items }) {
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">{source.name}</Text>
        <Text dimColor> - {source.description}</Text>
      </Box>
      {items.map((item, i) => (
        <Box key={`${item.rank}-${i}`}>
          <Text color="yellow" bold>{String(item.rank).padStart(2, " ")}.</Text>
          <Text> {item.title}</Text>
          {item.hot && <Text dimColor> ({item.hot})</Text>}
        </Box>
      ))}
    </Box>
  );
}
```

`Box` 是布局，`Text` 是文本，`color` 控制颜色——和写 Web 组件几乎一模一样。React 的声明式思维，放到终端里依然好用。

### 插件化数据源

每个平台的 API 都不一样，但我统一了数据结构：

```typescript
interface NewsItem {
  title: string;    // 标题
  url: string;      // 链接
  hot?: string;     // 热度
  rank: number;     // 排名
}
```

**添加新平台只需要一个文件**——写一个 `xxx.ts`，实现 `fetch` 函数返回 `NewsItem[]`，注册到 `sources/index.ts`，完事。

### 零配置一键发版

我还写了一键发布脚本，一条命令完成：预检 → 验证数据源 → 升版 → 构建 → Git 提交 → npm 发布 → GitHub Release → **AI 自动生成 Release Notes**（调用 Claude CLI 根据 git log 归纳更新日志）。

```bash
bun scripts/release.ts patch
```

---

## 为什么要做这件事？

`hotnews` 本身不复杂。8 个数据源，几百行核心代码。

但我想表达的是一个更大的趋势：**CLI 工具正在成为 AI Agent 的"手和脚"。**

以前我们写 CLI 工具，是给人用的。
现在我们写 CLI 工具，同时要考虑——**AI 怎么调用它？**

Skills.sh 上已经有来自 Vercel、Anthropic、Microsoft、Supabase 等公司的官方 Skills，支持 20+ 种 AI 编程助手。这是一个正在形成的生态：

- 开发者写 CLI 工具
- 封装为 Skill 定义
- 发布到 Skills.sh / Clawhub
- 任何支持 Skills 协议的 AI Agent 都能调用

**你写的每一行代码，都有可能被无数个 AI Agent 复用。**

这比单纯写一个工具要有意义得多。

---

## 30 秒上手

### 直接使用

```bash
npm install -g hotnews
hotnews list          # 查看所有平台
hotnews baidu         # 看百度热搜
hotnews weibo -l 5    # 看微博 Top 5
```

### 在 OpenClaw 中使用

查看 Clawhub 详情页，一键接入：

https://clawhub.ai/zhengzhuangpro/hotnews

### 作为 Claude Code Skill 使用

```bash
npx skills add https://github.com/zhengzhuangpro/hotnews --skill hotnews
# 然后在 Claude Code 中输入 /hotnews baidu
```

---

## 最后

从一个"不想切 App 刷热搜"的小需求，到一个 CLI 工具，再到 OpenClaw 里每天自动播报的 AI Agent，再到 Claude Code 的 Skill。

这个过程本身就是我理解的"开发者做产品"的方式：**从解决自己的问题开始，然后让它能被更多人（和 AI）使用。**

如果你也是一个喜欢折腾的开发者，试试 `hotnews`。

也许你用着用着，也会冒出新的想法——**如果让 AI 来做这件事，会怎样？**

---

**项目地址**：https://github.com/zhengzhuangpro/hotnews

**Skills.sh**：https://www.skills.sh/

**Clawhub**：https://clawhub.ai/zhengzhuangpro/hotnews

**npm 包**：https://www.npmjs.com/package/hotnews

**License**：MIT

---

> 如果觉得有用，欢迎点个 Star ⭐ 支持一下！
