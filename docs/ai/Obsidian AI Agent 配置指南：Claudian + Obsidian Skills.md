---
title: Obsidian AI Agent 配置指南：Claudian + Obsidian Skills
category: ai
date: 2026-01-20
---
# Obsidian AI Agent 配置指南：Claudian + Obsidian Skills

## 1. 核心组件
*   **Claudian**: Obsidian 第三方插件（暂未上架官方市场），适配 Claude Code。
*   **Obsidian Skills**: 由 Obsidian CEO (Kepano) 发布的 Skill 包，赋予 AI 处理 Canvas、Markdown 及数据库的能力。

## 2. 环境部署流程

### 2.1 安装 Claudian 插件 (手动旁加载)
1.  **获取文件**: 访问 GitHub 仓库 `claudian`，下载以下三个核心文件：
    *   `main.js`
    *   `manifest.json`
    *   `styles.css`
2.  **放置插件**:
    *   进入 Obsidian 仓库根目录。
    *   路径导航: `.obsidian` -> `plugins`。
    *   新建文件夹命名为 `claudian`。
    *   将上述三个文件放入该文件夹。
3.  **启用**: 重启 Obsidian，在“第三方插件”中开启 Claudian。

### 2.2 配置模型参数
1.  打开 Claudian 设置页。
2.  **基础设置**: 设置 `User Name` (如 Jason)。
3.  **自定义AI模型**: 使用智谱GLM或DeepSeek来替换Claude模型。

```bash
ANTHROPIC_BASE_URL=https://open.bigmodel.cn/api/anthropic
ANTHROPIC_API_KEY=你的智谱api key
ANTHROPIC_DEFAULT_OPUS_MODEL=GLM-4.6
```

4.  **连通性验证**:
    *   `Ctrl/Cmd + P` 调出命令面板 -> 输入 `claudian` -> 选择 `Open chat view`。
    *   发送“你好”，若回复正常则配置成功。

### 2.3 部署 Obsidian Skills
1.  **下载**: 访问 GitHub 仓库 `kepano/obsidian-skills`，下载 ZIP 包并解压。
2.  **安装**:
    *   复制解压后的 `skills` 文件夹。
    *   进入 Obsidian 仓库根目录。
    *   进入或新建 `.claude` 隐藏文件夹。
    *   粘贴 `skills` 文件夹 (最终路径: `[Vault Root]/.claude/skills/`)。
3.  **验证**: 在 Claudian 对话框输入 `/skills`，应显示以下三个 Skill:
    *   `obsidian-markdown`: 处理专有 Markdown 语法。
    *   `json-canvas`: 生成/编辑无限画布。
    *   `obsidian-bases`: 数据库管理。

## 3. 实战应用与技巧

### 3.1 典型用例：生成知识图谱
*   **指令**: “使用无限画布 canvas 画出地中海饮食的知识结构图，并保存到根目录。”
*   **流程**: AI 自动调用 `json-canvas` skill -> 分析逻辑 -> 在根目录直接生成 `.canvas` 文件。

### 3.2 优化 
由于 Skill 定义为英文，中文指令可能导致匹配偏差，建议方案：
*   **显式指令**: 在 Prompt 中明确指定工具名 (如“请使用 json-canvas skill...”)。
*   **系统提示词 (System Prompt)**: 在插件设置中添加规则 —— “收到指令后优先思考并匹配最合适的 Skill”。

## 4. 理念解析：Why Local Agent?

*   **官方态度 (Stephan Ango/Kepano)**:
    *   **发布渠道**: 选择在个人 GitHub 账号而非 Obsidian 官方账号发布，体现了“非官方强制”的定位。
    *   **核心哲学**: 知行合一。坚持 **Local-first** 和 **Privacy-first**，不构建封闭的官方 AI 环境，也不参与 AI 军备竞赛。
*   **差异化优势**:
    *   不同于 Notion 的云端封闭生态。
    *   Obsidian 文件完全本地化，鼓励用户基于隐私安全，“手搓”适合自己的 AI Agent。