# 博客接入后端文章 API 设计文档

- 日期：2026-09-15
- 状态：已确认（方案 A：内容集合自定义 Loader）
- 前置文档：Blog 公开文章查询接口文档（列表 + 详情，`/api/blog/v1/articles*`）

## 1. 背景与目标

文章数据已录入自建后端（Blog 服务，公开查询接口免登录），前端 Astro 博客仍从 `docs/**/*.md` 内容集合读取。本次改造：

- 数据源切换为构建时拉取后端 API，文章统一在后端管理
- 保持纯静态输出，部署管线（`wrangler deploy`）不变
- 现有 12 篇文章 URL 零变化，SEO 无损

## 2. 已确认的决策

| 决策点 | 结论 | 否决的备选 |
|---|---|---|
| 接入方式 | 内容集合自定义 Loader，构建时拉取 | SSR+缓存（复杂度高，目标非即时发布）；CSR 即 sorrycc 模式（百度/微信爬虫拿不到正文，链接预览为空） |
| slug 来源 | 后端新增 `slug` 字段，存完整路径形（如 `ai/claude-code`），老文章按现有 URL 回填 | title 前端生成（断链需 301 表，改标题即变 URL） |
| 现有 docs/ | 保留为归档，构建不再读取 | 双数据源并存（两套来源长期维护成本高） |
| 主题同步 | 删除 `.github/workflows/sync-theme.yml`，`src/` 独立演进 | 加 rsync 排除清单（排除项会持续增加） |

前提约束：

- 后端 API 有公网域名，构建环境可访问；公开接口免登录
- **后端先行**：`slug` 字段上线前，前端构建因校验失败终止，属预期行为

## 3. 架构

```
构建时（bun run build）
  Blog API ──fetch──▶ src/lib/blog-api.ts（遍历分页拉全量）
                          │
                          ▼
              src/loaders/blog-api.ts（Loader）
              文章 → collection entry（id = slug，body = contentMd）
                          │
                          ▼
          getCollection('posts')——首页/分类/文章页/搜索/RSS 零改动
                          │
                          ▼
              render(post) 渲染 markdown，TOC 自动生成照旧
                          ▼
              dist/ 静态输出 → wrangler deploy
```

- API 地址取环境变量 `BLOG_API_BASE`（如 `https://api.example.com`），未设置时默认 `http://localhost:8080`（本地经 Gateway）
- Astro 内容层自定义 loader 产出带原始 markdown `body` 的 entry，`render()` 走与现在 glob 完全相同的渲染管线

## 4. 组件设计

### 4.1 `src/lib/blog-api.ts`（新增：API 客户端）

- `getApiBase(): string` — `process.env.BLOG_API_BASE ?? 'http://localhost:8080'`
- `fetchAllArticles(): Promise<Article[]>` — 以 `page_size=50` 遍历分页直至累计达到 `total`；安全上限 100 页
- 单页请求 `GET ${base}/api/blog/v1/articles?page=N&page_size=50&with_content=true`（构建需要正文，`with_content` 见接口修订文档），10s 超时（AbortController）；网络错误或 HTTP ≥ 500 重试 1 次
- 响应解包：HTTP 200 且 `code === 0` 时取 `data`，否则抛出含 `code` / `message` 的错误
- `Article` 类型按接口文档 `ArticleResponse` 定义；`id`、`userId` 均按 string 透传（snowflake 超 JS 安全整数）

### 4.2 `src/loaders/blog-api.ts`（新增：自定义 Loader）

- 实现 Astro `Loader` 接口，`name: 'blog-api'`
- `load()`：`fetchAllArticles()` → 逐篇检查 `slug`（非空、不含 `? # %` 等 URL 保留字符）→ slug 全局去重 → 数据映射（见 4.3）→ `store.set({ id: slug, body: contentMd, data })`
- 字段类型校验由 collection 的 zod schema 承担；loader 负责跨条目校验（唯一性）与 fail-fast

### 4.3 数据映射

| API 字段 | entry 字段 | 说明 |
|---|---|---|
| `slug` | `id` + `data.slug` | 完整路径，既作静态路由参数，也随 data 供页面使用 |
| `contentMd` | `body` | 原始 markdown，渲染管线与 TOC 不变 |
| `title` | `data.title` | |
| `summary` | `data.description` | 后端缺省时自动生成前 120 字，前端直接用 |
| `categoryName` | `data.category` | `""`（分类被删）归一化为 `undefined`：不进分类页，URL 不受影响 |
| `tags` | `data.tags` | 空数组保持 |
| `publishedAt` | `data.pubDate` | 缺失时回退 `createdAt`；zod `coerce.date()` |
| `coverUrl` | — | 不映射（本次不展示封面） |
| `id` / `userId` / `status` / `categoryId` | — | 不映射，静态站无用途 |

### 4.4 `src/content.config.ts`（修改）

- `glob({ pattern: '**/*.md', base: './docs' })` → `blogApiLoader()`
- schema 字段不变，新增 `slug: z.string()` 作为冗余校验防线

### 4.5 页面清理（微调，行为不变）

- `[...slug].astro`、`index.astro`、`search-index.json.ts`、`rss.xml.ts`：删除 `post.id.replace(/\.md$/, '')`（id 不再有 `.md` 后缀）
- `index.astro`、`search-index.json.ts`：删除 README.md 过滤（docs/ 不再是数据源）

### 4.6 工作流

- 删除 `.github/workflows/sync-theme.yml`（停用主题同步）

## 5. 错误处理（fail fast，保护线上站点）

| 场景 | 行为 |
|---|---|
| HTTP 失败 / `code !== 0` | 构建终止，输出 `code` 与 `message` |
| 空列表（`total = 0`） | 构建终止 — 防止后端故障时把空站部署上线 |
| slug 缺失 / 含 URL 保留字符 / 重复 | 构建终止，打印涉事文章 `title` 与 `slug` |
| 列表项缺 `contentMd`（`with_content` 未传或后端未实现） | 构建终止 — entry `body` 为空即渲染空文章，宁可在构建期暴露 |
| 请求超时 | 10s 中止，重试 1 次，再失败即终止 |

## 6. 测试策略

单测（`bun test`，零新增依赖；mock `global.fetch` 与最小 store 桩对象）：

- `blog-api`：分页遍历聚合全量、`code !== 0` 抛错、首请求失败重试一次后成功
- `loader`：slug 冲突 / 非法 / 空列表各自抛错；字段映射正确（含 `categoryName === ""` 归一化）

端到端验收（后端就绪后）：

1. `BLOG_API_BASE=<公网域名> bun run build` 成功
2. dist 中文章 URL 与现网完全一致（12 篇对照清单，实施时从 `docs/` 路径自动生成）
3. `rss.xml`、`search-index.json`、`sitemap` 内容正常
4. 后端不可达时构建明确报错（而非空产物）
5. `bun test` 全绿

## 7. 实施顺序与依赖

1. **后端**（先行）：
   - 列表与详情的 `ArticleResponse` 增加 `slug` 字段
   - 管理端发布/编辑接口支持设置 `slug`
   - 按 `docs/` 相对路径回填 12 篇存量文章（如 `ai/claude-code`）
2. **前端**：`lib/blog-api.ts` → `loaders/blog-api.ts` → `content.config.ts` → 页面清理 → 删 `sync-theme.yml` → 单测
3. **验收**：本地构建对照 → 部署验证 → 上线

回滚：`git revert` 前端提交即回到 glob loader，`docs/` 归档仍在原处。

## 附录 A：slug 格式规范（后端实现依据）

- 结构：`分类/名称`，即原 `docs/` 相对路径去掉 `.md`（如 `ai/claude-code`）
- ASCII 统一小写；空格 → `-`；标点（`：+，。` 等）直接删除；中文原样保留
- 禁止：大写字母、空格、`? # % & + . , :`、首尾 `/`、连续 `//`、保留前缀 `page/` 与 `categories/`（与分页/分类静态路由冲突，2026-09-16 起 loader 拦截）
- 校验正则：`^[a-z0-9一-龥][a-z0-9一-龥-]*(/[a-z0-9一-龥][a-z0-9一-龥-]*)*$`
- 全局唯一（建议 DB 唯一索引）、非空、长度 ≤ 100

存量 12 篇回填清单（与线上 URL 逐一对应，含 `---` / `--` 连字符均须原样照抄）：

| 文章 | slug |
|---|---|
| Ai 开发新秩序 | `ai/ai-开发新秩序---ai全栈应用开发技术栈-推荐` |
| Claude Code | `ai/claude-code` |
| Claude Skill | `ai/claude-skill` |
| Moltbook skill完整拆解 | `ai/moltbook-skill完整拆解` |
| Obsidian AI Agent 配置指南 | `ai/obsidian-ai-agent-配置指南claudian--obsidian-skills` |
| Vibe Coding 入门指南 | `ai/vibe-coding-入门指南从零基础到-ai-编程高手` |
| 从零开始构建 RAG 知识库系统 | `ai/从零开始构建-rag-知识库系统go--postgresql--pgvector-实战` |
| 当 CLI 工具成为 AI Agent 的手和脚 | `ai/当-cli-工具成为-ai-agent-的手和脚` |
| 零成本打造专业收件域名邮箱 | `ai/零成本打造专业收件域名邮箱cloudflare--gmail-终极配置保姆级全攻略` |
| 基于 Cloudflare 搭建免费节点 | `vpn/基于-cloudflare-搭建免费节点` |
| 你的剪贴板，该有个好记性。 | `website/你的剪贴板该有个好记性` |
| 我用超级马里奥的风格，做了一个个人主页 | `website/我用超级马里奥的风格做了一个个人主页` |

## 8. 范围外（本次不做）

- 封面图 `coverUrl` 的映射与展示
- ~~发文 webhook / 自动部署 workflow~~（2026-09-16 已实施：`.github/workflows/deploy.yml`，后端发布成功后调 repository_dispatch 触发构建部署）
- SSR、评论、阅读量等动态功能
- `docs/` 归档目录的删除

## 9. 验收标准

- 12 篇文章 URL、RSS、sitemap 与切换前完全一致
- 首页 / 分类 / 搜索 / TOC 功能无回归
- 后端故障时构建失败，而非静默产出空站
- 主题同步已停用，`src/` 改动不再被覆盖
