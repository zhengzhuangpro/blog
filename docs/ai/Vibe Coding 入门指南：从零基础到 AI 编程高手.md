---
title: Vibe Coding 入门指南：从零基础到 AI 编程高手
description: 从安装环境到 Claude Code Auto Mode，零基础掌握 AI 编程
category: ai
pubDate: 2026-06-26
---

> 从安装环境到 Claude Code Auto Mode，零基础掌握 AI 编程

![](https://img.zhengz.cc/PicGo/20260626093520484.png)

---

## 📚 目录

1. [为什么需要 Node.js？](#1-为什么需要-nodejs)
2. [什么是 Node.js？](#2-什么是-nodejs)
3. [安装 Node.js](#3-安装-nodejs)
4. [配置 npm 镜像源](#4-配置-npm-镜像源)
5. [安装 VS Code](#5-安装-vs-code)
6. [安装 Git](#6-安装-git)
7. [什么是 Claude Code？](#7-什么是-claude-code)
8. [安装 Claude Code](#8-安装-claude-code)
9. [CLAUDE.md 项目配置](#9-claudemd-项目配置)
10. [Auto Mode 自动模式](#10-auto-mode-自动模式)
11. [常用命令汇总](#11-常用命令汇总)
12. [更多实用命令](#12-更多实用命令)
13. [各大平台 Skill 服务](#13-各大平台-skill-服务)
14. [什么是 Skills？](#14-什么是-skills)
15. [Skills 实战应用](#15-skills-实战应用)
16. [Superpowers 超能力](#16-superpowers-超能力)
17. [CC Switch 模型切换](#17-cc-switch-模型切换)
18. [国产模型介绍](#18-国产模型介绍)
19. [国内快速上手](#19-国内快速上手)
20. [Claude Code 能做什么？](#20-claude-code-能做什么)

---

## 1. 为什么需要 Node.js？

![image.png](https://img.zhengz.cc/pic-go/20260626095343706.png)

很多人问，为什么第一步要安装 Node.js？

答案很直接：**如果你想使用 Claude Code 或 OpenClaw 这样的智能体工具，必须安装 Node.js。**

因为这些 AI 智能体工具都是基于 Node.js 环境运行的。没有 Node.js，这些工具根本无法使用。

**两个主要原因：**
- 运行 AI 工具（Claude Code、OpenClaw 等）
- 使用 npm 管理各种开发包和依赖

所以，Node.js 是使用 AI 智能体工具的必备环境，也是搭建开发环境的第一步。

---

## 2. 什么是 Node.js？

Node.js 让 JavaScript 这门语言脱离浏览器，能在你的电脑上独立运行。

前端开发中的打包、编译、测试，全都依赖它。而且 **npm** 这个包管理器会随 Node.js 一起安装，不需要你单独去装。

> 当前推荐安装 **v22 的 LTS 长期支持版本**

![](https://img.zhengz.cc/pic-go/20260626095729118.png)

---

## 3. 安装 Node.js

![image.png](https://img.zhengz.cc/pic-go/20260626095833534.png)

### 方式一：官网下载（推荐新手）

1. 访问 [nodejs.org](https://nodejs.org)
2. 下载 LTS 版本
3. 双击安装，一路 Next

### 方式二：使用 nvm（进阶用户）

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash
```

### 验证安装

```bash
node -v    # 查看 Node.js 版本
npm -v     # 查看 npm 版本
```

看到版本号就说明安装成功了！

---

## 4. 配置 npm 镜像源

安装完 Node.js 后，下一步是配置 npm 镜像源。

**为什么？** 因为国内访问 npm 官方源速度很慢，配置国内镜像可以大幅提升下载速度。

### 方式一：使用 nrm 管理镜像源

```bash
npm install -g nrm
nrm use taobao
```

### 方式二：直接配置淘宝镜像

```bash
npm config set registry https://registry.npmmirror.com
```

配置好后，安装包的速度会快很多！

---

## 5. 安装 VS Code

VS Code 是前端开发的事实标准，免费、开源、插件海量。

### 下载安装

访问 [code.visualstudio.com](https://code.visualstudio.com) 下载安装。

### 推荐插件

| 插件 | 用途 |
|------|------|
| **Prettier** | 代码格式化 |
| **ESLint** | 代码规范检查 |
| **Auto Rename Tag** | 自动重命名标签 |
| **Live Server** | 本地实时预览 |
| **GitLens** | Git 增强 |
| **Code Runner** | 代码运行 |
| **Error Lens** | 错误提示增强 |
| **JavaScript ES6** | ES6 语法支持 |

---

## 6. 安装 Git

![image.png](https://img.zhengz.cc/pic-go/20260626095956277.png)

Git 是版本控制系统，你可以把它理解为**代码的时间机器**。

它能记录你每一次修改，随时可以回退，也是团队协作的基础。

### 各平台安装

```bash
# macOS
xcode-select --install

# Windows
# 访问 git-scm.com 下载安装

# Linux
sudo apt install git
```

### 验证安装

```bash
git --version
```

---

## 7. 什么是 Claude Code？

![image.png](https://img.zhengz.cc/pic-go/20260626100134543.png)

Claude Code 是 Anthropic 出品的 AI 编程智能体。

它不是代码补全工具，而是能**自主读文件、改代码、跑命令**的 AI 助手。

### 核心特性

- **100 万 token** 上下文窗口
- 支持 CLI 终端、Desktop App、IDE 插件
- 系统要求：macOS 13+、Windows 10+、Ubuntu 20.04+
- 至少 4GB 内存

---

## 8. 安装 Claude Code

![image.png](https://img.zhengz.cc/pic-go/20260626100201605.png)

### 推荐方式：npm 安装

```bash
npm install -g @anthropic-ai/claude-code
```

### 原生安装脚本

```bash
# macOS / Linux
curl -fsSL https://claude.ai/install.sh | bash

# Windows (PowerShell)
irm https://claude.ai/install.ps1 | iex
```

### 验证安装

```bash
claude --version
```

### 配置模型（使用 CC Switch）

CC Switch 是一个图形化桌面工具，用于切换不同的大模型。

**安装方式：**
1. 访问 [ccswitch.io](https://ccswitch.io) 或 GitHub Releases
2. 下载对应系统版本（macOS / Windows / Linux）
3. 双击安装即可

**使用方式：**
1. 打开 CC Switch 应用
2. 选择国产模型提供商
3. 输入 API Key
4. 保存配置

---

## 9. CLAUDE.md 项目配置

![image.png](https://img.zhengz.cc/pic-go/20260626100222655.png)

CLAUDE.md 是 Claude Code 每次会话自动读取的**"项目说明书"**。

### 生成方式

```bash
/init
```

### 包含内容

- 项目命令
- 架构概述
- 编码规范

### 最佳实践

- 控制在 **100 行以内**
- 每次 Claude 犯错，把纠正规则加进去
- 提交到 Git，团队共享

---

## 10. Auto Mode 自动模式

![image.png](https://img.zhengz.cc/pic-go/20260626100236193.png)

Auto Mode 用 AI 分类器自动审查每个操作 — 安全的自动放行，危险的自动拦截。

### 三种模式对比

| 模式 | 描述 | 适用场景 |
|------|------|----------|
| **默认模式** | 每次操作都要手动批准 | 新手、生产环境 |
| **Auto Mode** | AI 自动判断，危险时拦截 | 日常开发（推荐） |
| **跳过权限** | 所有操作直接执行 | CI/CD、受控环境 |

### 开启方式

```bash
# 推荐
claude --enable-auto-mode

# 最快但危险（不推荐新手）
--dangerously-skip-permissions
```

### 切换模式

会话中按 `Shift+Tab` 切换模式

---

## 11. 常用命令汇总

![image.png](https://img.zhengz.cc/pic-go/20260626100301765.png)

### 斜杠命令

| 命令 | 功能 |
|------|------|
| `/init` | 生成项目配置文件 |
| `/plan` | 进入规划模式 |
| `/config` | 打开设置面板 |
| `/mcp` | 管理外部工具集成 |

### 终端命令

| 命令 | 功能 |
|------|------|
| `claude` | 启动会话 |
| `claude --version` | 查看版本 |
| `claude update` | 手动更新 |
| `claude doctor` | 诊断配置问题 |

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Shift+Tab` | 切换权限模式 |
| `Ctrl+C` | 中断当前操作 |
| `Esc` | 退出会话 |

### 实用 Prompt 技巧

- 会话开始先问"这个项目是做什么的"建立认知
- 描述 bug 要具体到文件名和行号，给验证方式让它自己迭代
- 用"先不要实现，只出方案"配合 `/plan` 审方案

---

## 12. 更多实用命令

![image.png](https://img.zhengz.cc/pic-go/20260626100318093.png)

### 文件操作命令

| 命令 | 功能 |
|------|------|
| `/read` | 查看文件内容 |
| `/search` | 搜索代码 |
| `/grep` | 查找文本 |
| `/list` | 列出目录文件 |
| `/tree` | 查看项目结构 |

### 开发工作流

| 命令 | 功能 |
|------|------|
| `/test` | 运行测试 |
| `/build` | 执行构建 |
| `/lint` | 代码检查 |
| `/format` | 格式化代码 |
| `/commit` | Git 提交 |

### 高级功能

| 命令 | 功能 |
|------|------|
| `/diff` | 查看文件差异 |
| `/undo` | 撤销上次操作 |
| `/memory` | 查看记忆 |

### 会话管理

| 命令 | 功能 |
|------|------|
| `/compact` | 压缩对话上下文，节省 token |
| `/resume` | 恢复上次会话 |

---

## 13. 各大平台 Skill 服务

越来越多的国民级产品开始将自己的能力封装成 Skill、MCP 或 CLI，向 AI Agent 开放。这意味着你可以用自然语言直接操控这些真实世界的服务。

![image.png](https://img.zhengz.cc/pic-go/20260626100933549.png)

### 🍽️ 餐饮类

| 平台 | 接入方式 | 功能 | 官网 |
|------|----------|------|------|
| **瑞幸咖啡** | Skill / MCP / CLI | AI 点咖啡、查门店、搜商品、到店自取 | [open.lkcoffee.com](http://open.lkcoffee.com) |
| **麦当劳** | MCP | 查活动日历、领券、点餐 | [open.mcd.cn](https://open.mcd.cn/mcp) |

### 🚗 出行类

| 平台 | 接入方式 | 功能 | 官网 |
|------|----------|------|------|
| **飞猪** | Skill / MCP | 机票、酒店、门票、用车咨询和预定 | [flyai.open.fliggy.com](https://flyai.open.fliggy.com/) |
| **滴滴出行** | Skill / MCP | 实时叫车、预约出行、订单查询、司机位置 | [mcp.didichuxing.com](https://mcp.didichuxing.com/) |

### 🗺️ 地图类

| 平台 | 接入方式 | 功能 | 官网 |
|------|----------|------|------|
| **高德地图** | Skill / MCP | 位置服务、地图开发、酒店搜索 | [lbs.amap.com](https://lbs.amap.com/) |
| **腾讯地图** | Skill / MCP | 搜索、规划、天气查询、3D地图开发 | [lbs.qq.com](https://lbs.qq.com) |

### 🏃 本地生活

| 平台 | 接入方式 | 功能 | 官网 |
|------|----------|------|------|
| **美团跑腿** | Skill | 下单跑腿、地址匹配、订单预览 | [GitHub](https://github.com/meituan/MT-Paotui-For-Client) |

### 💼 办公协作

| 平台 | 接入方式 | 功能 | 官网 |
|------|----------|------|------|
| **飞书** | Skill / CLI / MCP | 消息、文档、日程、审批等全面操控 | [open.feishu.cn](https://open.feishu.cn/) |
| **钉钉** | Skill / CLI / MCP | 消息、待办、日程、审批流 | [open.dingtalk.com](https://open.dingtalk.com/) |
| **企业微信** | Skill / CLI / MCP | 消息收发、通讯录管理 | [GitHub](https://github.com/WecomTeam/wecom-cli) |
| **腾讯文档** | Skill / MCP | 在线文档、知识库管理、AI PPT | [docs.qq.com](https://docs.qq.com/open/document/) |

### 💰 支付类

| 平台 | 接入方式 | 功能 | 官网 |
|------|----------|------|------|
| **支付宝** | Skill / MCP | 手机支付、网页支付、订单查询、退款 | [open.alipay.com](https://open.alipay.com/) |
| **微信支付** | Skill / MCP | 支付产品选择、示例代码、商品券管理 | [GitHub](https://github.com/wechatpay-apiv3/wechatpay-skills) |

### 📚 娱乐阅读

| 平台 | 接入方式 | 功能 | 官网 |
|------|----------|------|------|
| **微信读书** | Skill | 查书架、阅读进度、笔记划线、书籍推荐 | [weread.qq.com](http://weread.qq.com/r/weread-skills) |
| **网易云音乐** | Skill / CLI | 搜索播放音乐、歌单管理、偏好分析 | [GitHub](https://github.com/NetEase/skills) |
| **美图** | Skill / CLI | 图片编辑、文生图、文生视频、AI写真 | [miraclevision.com](https://www.miraclevision.com/open-claw) |

### 🔌 使用方式

大多数平台的 Skill 安装方式都非常简单：

```bash
# 方式一：直接在 Claude Code 中说
"帮我安装瑞幸咖啡的 Skill"

# 方式二：使用 plugin 命令
/plugin install <skill-name>

# 方式三：MCP 配置
/mcp add <platform-mcp-url>
```

### 💡 组合玩法

这些 Skill 的真正威力在于**组合使用**：

- 🚗 **出行规划**：飞猪查航班 + 高德查路线 + 滴滴叫车
- 🍽️ **餐饮消费**：瑞幸点咖啡 + 美团跑腿取餐
- 📋 **办公协作**：飞书发消息 + 腾讯文档写报告
- 💰 **支付集成**：支付宝收款 + 微信支付结算

**AI Agent + 真实世界服务 = 无限可能！**

---

## 14. 什么是 Skills？

![image.png](https://img.zhengz.cc/pic-go/20260626101000905.png)

Skills 是 Claude Code 的**可插拔能力扩展包**。

每个 Skill 是一个包含 SKILL.md 的文件夹，为 Claude 注入专项能力，用斜杠 `skill-name` 就能调用。

你可以把它理解成**给 AI 看的可执行入职手册**。

### 工作原理

把流程、脚本、模板、参考资料打包成一个文件夹。

### Skill 文件结构

```shell
skill-name/
├── SKILL.md         # 核心指令
├── scripts/         # 可执行脚本
├── templates/       # 模板文件
├── references/      # 参考资料
└── workflows/       # 工作流定义
```

---

## 15. Skills 实战应用

![image.png](https://img.zhengz.cc/pic-go/20260626103242246.png)

### 常用 Skills 示例

| Skill | 功能 |
|-------|------|
| **ppt-master** | 自动生成演示文稿 |
| **hotnews** | 获取和分析热点新闻 |
| **ydy-design** | 远度云组件库使用指南 |
| **git-workflow** | Git 工作流管理 |
| **code-review** | 代码审查助手 |
| **test-writer** | 测试用例生成 |

### MCP — Model Context Protocol

MCP 让 Claude Code 连接外部工具和服务：

- 🐙 **GitHub** - PR/Issue 管理
- 🗄️ **数据库** - SQL 查询执行
- 🎭 **Playwright** - UI 自动化测试
- 📋 **Linear** - 任务管理

### 安装 Skills

1. 下载 Skill 包（zip 文件）
2. 解压到 `~/.claude/skills/` 目录
3. 自动加载，无需手动配置

### 🔥 实战案例：hotnews 新闻聚合 Skill

以 [hotnews](https://clawhub.ai/zhengzhuangpro/skills/hotnews) 为例，这是一个从8个平台获取热门新闻的 CLI 工具。

**支持的新闻源：**

| 平台 | ID | 说明 |
|------|-----|------|
| 百度 | `baidu` | 百度实时搜索趋势 |
| 微博 | `weibo` | 微博实时热搜 |
| 抖音 | `douyin` | 抖音实时热点 |
| 虎扑 | `hupu` | 虎扑步行街热帖 |
| 36氪 | `kr36` | 36氪科技快讯 |
| 知乎 | `zhihu` | 知乎热门问题 |
| 掘金 | `juejin` | 掘金开发者社区热文 |
| GitHub | `github` | GitHub 今日热门开源项目 |

**安装方式：**

```bash
# 从 ClawHub 安装
openclaw skills install @zhengzhuangpro/hotnews
```

**使用示例：**

```bash
# 查看所有可用新闻源
hotnews list

# 获取百度热搜
hotnews baidu

# 获取微博热搜（JSON 格式，限制5条）
hotnews weibo --json --limit 5

# 获取 GitHub 热门项目
hotnews github

# 结合 jq 处理 JSON 数据
hotnews baidu --json | jq '.[].title'
```

**使用场景：**
- 📰 快速了解今日热点
- 🔍 监控特定领域动态
- 📊 获取结构化数据进行分析
- 🤖 集成到自动化工作流

### 🌐 Skills 网站推荐

![image.png](https://img.zhengz.cc/pic-go/20260626101018621.png)

#### ClawHub

**网站**: [clawhub.ai](https://clawhub.ai)

ClawHub 是 Claude Code Skills 的市场平台，提供丰富的社区贡献 Skills。

**特点：**
- 社区驱动的 Skills 仓库
- 多种分类和标签
- 用户评价和评分
- 一键安装

#### Skills.sh

**网站**: [skills.sh](https://skills.sh)

Skills.sh 是 Skills 发现和分享平台，帮助开发者浏览、搜索和安装 Skills。

**特点：**
- 强大的搜索功能
- 详细的 Skills 文档
- 安装指南和示例
- 社区讨论区

### 🚀 快速开始

1. 访问网站
2. 浏览或搜索 Skills
3. 下载 Skill 包
4. 解压到 `~/.claude/skills/`
5. 自动加载使用

---

## 16. Superpowers 超能力

![image.png](https://img.zhengz.cc/pic-go/20260626103301162.png)

Superpowers 是一个完整的 **AI 软件开发方法论**，给你的编程智能体装上超能力。

### 核心流程（7 步）

1. **头脑风暴** - 细化需求
2. **Git Worktree** - 创建隔离工作区
3. **编写计划** - 把任务拆成 2-5 分钟的小块
4. **子智能体** - 并行开发
5. **TDD 流程** - 红绿重构
6. **代码审查** - 任务间自动审查
7. **合并分支** - 完成项目

### 安装方式

```bash
/plugin install superpowers
```

### 支持平台

- Claude Code
- Codex
- Cursor
- Gemini CLI
- Kimi Code

---

## 17. CC Switch 模型切换

![image.png](https://img.zhengz.cc/pic-go/20260626103329999.png)

如果你不想每月花 $20 订阅 Claude，或者想用国产大模型来写代码，**CC Switch** 就是你的救星。

### 什么是 CC Switch？

Claude Code 的模型路由器，一个图形化桌面工具，让你一键切换不同的大模型。

### 支持模型

- GLM-5.2
- DeepSeek
- MiniMax
- Mimo

### 安装方式

1. 访问 [ccswitch.io](https://ccswitch.io) 或 GitHub Releases
2. 下载对应系统版本（macOS / Windows / Linux）
3. 双击安装即可

### 使用方式

1. 打开 CC Switch 应用
2. 选择国产模型提供商
3. 输入 API Key
4. 保存配置

---

## 18. 国产模型介绍

![image.png](https://img.zhengz.cc/pic-go/20260626103348193.png)

### 主流模型

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| **GLM-5.2** | 智谱 AI 出品，工具调用能力强 | Agent、代码生成 |
| **DeepSeek** | 推理能力突出，性价比极高 | 日常开发 |
| **MiniMax** | 长文本理解好，支持多模态 | 复杂任务 |
| **Mimo** | 小米出品，代码能力强 | 编程场景 |

### 价格优势

通过 API 中转站，价格可低至官方的 **30%**！

---

## 19. 国内快速上手

![image.png](https://img.zhengz.cc/pic-go/20260626103407529.png)

国内用户有专属的快速上手方案，通过 CC Switch 工具，**无需翻墙、无需订阅国际版**。

### 完整流程

1. ✅ 安装 Node.js
2. ✅ 配置 npm 镜像
3. ✅ 安装 VS Code
4. ✅ 安装 Git
5. ✅ 安装 Claude Code
6. ✅ 安装 CC Switch
7. ✅ 配置国产模型
8. ✅ 开始使用

### 开始第一个项目

```bash
cd my-project
claude
```

### 国内优势

- 无需翻墙，访问稳定
- 价格更低，低至官方 30%
- 响应速度快，本地优化

---

## 20. Claude Code 能做什么？

![image.png](https://img.zhengz.cc/pic-go/20260626103425269.png)

Claude Code 不仅仅是代码助手，它可以帮助你完成多种任务。

### 软件开发 💻

- 编写新功能代码
- 修复 bug 和错误
- 代码重构和优化
- 编写和运行测试

### 文档创作 📄

- 生成 PPT 演示文稿
- 编写技术文档
- 自动生成 README
- 创建 API 文档

### 视频剪辑 🎬

- 自动剪辑视频片段
- 生成字幕
- 批量视频处理
- 格式转换

### 代码审查 🔍

- 查找代码中的 bug
- 提出优化建议
- 安全性检查
- 最佳实践验证

### 数据分析 📊

- 处理 CSV 数据
- 生成可视化图表
- 分析数据趋势
- 生成分析报告

### 自动化脚本 🎯

- 批量文件重命名
- 文件格式转换
- 自动化部署
- 定时任务脚本

**Claude Code = 你的 AI 编程助手，让复杂工作变得简单！**

---

## 🎉 开始你的 Vibe Coding 之旅！

现在你已经掌握了从环境搭建到 Claude Code 高级用法的全部内容。

**下一步行动：**

1. 按照本文安装 Node.js 和 Claude Code
2. 配置 CC Switch 使用国产模型
3. 尝试用自然语言写第一个项目
4. 探索 Skills 网站，发现更多强大功能

**记住：** Claude Code 不只是代码补全工具，它是能自主读文件、改代码、跑命令的 AI 编程智能体。

**让 AI 成为你开发的得力助手，开始 Vibe Coding 吧！**
