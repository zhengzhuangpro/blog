---
title: Claude Code 安装指南（Mac）
category: ai
date: 2026-04-17
---

Claude Code 对于中国大陆用户，直接使用面临网络与账号双重门槛。但可以通过本地部署 + 国产大模型兼容层（GLM/DeepSeek）方案，实现无障碍安装使用。

## 1. 安装 Node.js

Claude Code 依赖 Node.js（要求 >= 18）。推荐使用 nvm 管理 Node 版本：

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 重新打开终端后安装 Node
nvm install 22
nvm use 22

# 验证
node -v
npm -v
```

## 2. 安装 Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

如果 npm 下载卡顿，使用国内镜像：

```bash
npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com
```

验证安装：

```bash
claude --version
```

## 3. 配置账号

根据你的网络环境选择：

- **海外用户**：直接运行 `claude login`，浏览器登录 Anthropic 账号即可。
- **国内用户**：跳过登录，使用智谱 GLM 或 DeepSeek 的兼容接口。见下方配置。

### 设置环境变量（永久生效）

将以下内容添加到 `~/.zshrc`：

**智谱 GLM：**
```bash
echo 'export ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/anthropic"' >> ~/.zshrc
echo 'export ANTHROPIC_AUTH_TOKEN="你的_GLM_API_KEY"' >> ~/.zshrc
echo 'export ANTHROPIC_MODEL="glm-4.6"' >> ~/.zshrc
source ~/.zshrc
```

**DeepSeek：**
```bash
echo 'export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"' >> ~/.zshrc
echo 'export ANTHROPIC_AUTH_TOKEN="你的_DEEPSEEK_API_KEY"' >> ~/.zshrc
echo 'export ANTHROPIC_MODEL="deepseek-chat"' >> ~/.zshrc
source ~/.zshrc
```

### 绕过登录验证

修改 `~/.claude.json`，确保包含以下字段：

```json
{
  "hasCompletedOnboarding": true
}
```

创建 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的API Key",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

## 4. 启动与常用指令

```bash
claude
```

出现 "Welcome to Claude Code" 即成功。

**常用指令：**
- `/clear` — 清除上下文，开启新任务
- `/compact` — 压缩上下文，处理长任务
- `/help` — 查看所有命令
- `Option + Enter` — 在对话框中换行
- `exit` — 退出程序
