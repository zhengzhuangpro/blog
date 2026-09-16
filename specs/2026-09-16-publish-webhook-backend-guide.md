# 博客发文自动部署：后端对接指引

- 日期：2026-09-16
- 读者：Blog 服务后端
- 目标：文章发布 / 修改 / 下架后，自动触发博客前台重建部署，**1~2 分钟线上生效**
- 现状：前台自动部署流水线已上线并全绿验证（GitHub Actions → Cloudflare Workers），**只差后端的触发调用**

## 1. 整体链路

```
后端发布成功 ──▶ POST GitHub API ──▶ Actions 自动构建部署 ──▶ blog.zhengz.cc 生效
 (你的代码)      (本文档要加的调用)       (已就绪 ✅)            (~1-2 分钟)
```

## 2. 要做的事

### 2.1 创建 PAT（一次性）

GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token：

- **Repository access**：Only select repositories → `zhengzhuangpro/blog`
- **Permissions**：Contents → **Read and write**
- 有效期按策略设置；**过期换新后需同步更新后端配置里的 token**

### 2.2 发布成功后触发部署（一处 HTTP 调用）

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST \
  https://api.github.com/repos/zhengzhuangpro/blog/dispatches \
  -H "Authorization: Bearer ${GITHUB_PAT}" \
  -H "Accept: application/vnd.github+json" \
  -d '{"event_type":"publish"}'
```

- 成功返回 **HTTP 204**（无响应体），即视为受理，Actions 异步执行，无需等待
- `event_type` 必须是 **`publish`**（workflow 按此过滤，其他值不会触发）

### 2.3 触发时机

| 操作 | 是否触发 |
|---|---|
| 发布新文章 | ✅ |
| 编辑已发布文章（标题/正文/标签/分类/slug/封面） | ✅ |
| 下架 / 删除已发布文章 | ✅ |
| 保存草稿 | ❌（前台只读已发布文章） |
| 分类、标签管理（影响前台展示时） | ✅ 建议触发 |

### 2.4 失败与重试策略（建议）

- **异步旁路**：调用放在发布事务提交之后（协程 / 消息队列均可），webhook 失败**不影响发文本身**
- 非 204 返回的语义：`401` PAT 失效或权限不足 / `404` PAT 无该仓库权限 / `403` 速率限制 → 记日志 + 告警，人工或定时补偿
- **无需防抖**：连续多次发布自动去重，只部署最后一次（workflow 已配 concurrency）
- 速率上限：认证后 5000 次/小时，个人博客场景远够

## 3. 数据红线（构建 fail-fast）

前台构建遇到以下情况会**失败中止**——线上保持旧版本不受影响（不会推空站），但新内容不会上线，Actions 会变红：

1. `slug` 缺失 / 含 URL 保留字符（`?` `#` `%` `&` 空白）/ 首尾或连续 `/` / 与其他文章重复 / 以保留前缀 `page/`、`categories/` 开头（与分页、分类静态路由冲突，2026-09-16 新增）
2. `slug` 为纯数字（与文章 ID 直查冲突，**管理端保存时就应校验拦截**）
3. `contentMd` 为空
4. 公开接口返回 0 篇已发布文章（视为后端故障，拒绝空站上线）

slug 完整规范见 [2026-09-15-blog-api-integration-design.md](./2026-09-15-blog-api-integration-design.md) 附录 A；公开接口行为约定见 [2026-09-16-blog-public-api-revision.md](./2026-09-16-blog-public-api-revision.md)。

**排错入口**：https://github.com/zhengzhuangpro/blog/actions —— 点开变红的 run，看「构建（从后端 API 拉取文章）」步骤日志，会打印涉事文章的 title 与 slug。

## 4. 环境差异提醒

- CI 构建拉取的是**公网后端**（secret `BLOG_API_BASE` 指定的域名），不是 localhost——公网库的数据变更才会体现到线上
- 已知待修：公网库「Vibe Coding 入门指南：从零基础到 AI 编程高手」标题带尾缀「1」，请在管理端修正（修正后手动触发一次：Actions 页面 → Deploy Blog → Run workflow，或重发一次 webhook）

## 5. 联调验收清单

- [ ] PAT 创建完成并配置到后端环境变量
- [ ] 后端发布一篇测试文章 → Actions 出现新 run 且全绿
- [ ] 约 1~2 分钟后 blog.zhengz.cc 首页出现该文章
- [ ] 下架该文章 → 再次触发 → 线上消失
- [ ] curl 调用返回 204；故意用错 PAT 返回 401 且后端日志有记录

## 附：手动触发方式（不依赖后端）

- 网页：GitHub 仓库 → Actions → Deploy Blog → Run workflow
- 命令行：`gh workflow run deploy.yml --ref main`
