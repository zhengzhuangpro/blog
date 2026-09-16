# Blog 公开查询接口修订（列表参数与校验规则）

- 日期：2026-09-16
- 状态：待后端实施
- 前置文档：Blog 公开查询接口文档（文章 + 分类 + 标签，`/api/blog/v1`）；前端侧见 [2026-09-15-blog-api-integration-design.md](./2026-09-15-blog-api-integration-design.md)
- 修订范围：**仅文章列表接口**的参数与校验增补 + 详情路由实现注意事项；`categories` / `tags` 接口与所有响应字段定义（附录 ArticleResponse）零改动

## 破坏性说明（唯一的最后窗口）

「修改 1」将列表默认行为从「携带全文」改为「不含全文」，是本次唯一破坏性变更。当前前端尚未接入（前端改造以后端就绪为前置），**无任何存量调用方依赖列表全文**，现在改是零成本窗口；前端接入后再改需两侧联动。

---

## 修改 1：文章列表新增 `with_content` 参数（默认 `false`）

**动机**：前台列表场景实测只用 `title` / `summary` / `tags` / `category` / 时间（首页、搜索索引、sitemap 遍历、RSS 摘要），正文仅构建期全量拉取需要（`contentMd` → entry `body`）。默认吐全文 = 每次列表请求白带几十 KB × N 篇。

**Query 参数表新增行**：

| 参数 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `with_content` | bool | `false` | 是否返回正文 `contentMd`。`false` 时列表项**省略该字段**（字段不出现，非空串）；仅构建期全量拉取等场景传 `true` |

**后端行为**：

- 取值解析：`true` / `1` 为真；`false` / `0` / 缺省 / 任意非法值一律为假，**非法值不报错**（容错优先，bool 参数不值得 40001）
- `false` 时列表 DTO 不序列化 `contentMd`
- 详情接口不受影响，恒返回 `contentMd`

**选型说明**：否决通用字段选择 `fields=title,summary,...`——当前只有一个字段需要开关，bool 足够；通用 fields 引入解析、校验与白名单维护成本，属过度设计。

**响应示例更新**（列表项，`with_content` 缺省时）：

```json
{
  "id": "2098244470511243264",
  "userId": 2098244000000000001,
  "title": "博客上线记",
  "slug": "技术/博客上线记",
  "summary": "从零搭建个人博客的全过程……",
  "coverUrl": "https://example.com/cover.png",
  "categoryId": 1,
  "status": "published",
  "publishedAt": "2026-09-14T10:00:00+08:00",
  "createdAt": "2026-09-14T09:00:00+08:00",
  "updatedAt": "2026-09-14T10:00:00+08:00",
  "tags": ["博客", "部署"],
  "categoryName": "技术"
}
```

原文档备注「列表项同样携带全文 `contentMd`……」删除，替换为：

> 列表默认不含 `contentMd`；需要正文时传 `with_content=true`（如构建期全量拉取），单篇场景用详情接口。

**前端联动**（见 2026-09-15 设计文档 §4.1）：`fetchAllArticles()` 单页请求改为 `GET ${base}/api/blog/v1/articles?page=N&page_size=50&with_content=true`。

---

## 修改 2：`keyword` 匹配范围扩展为 `title` + `summary` + `tags`

**动机**：现网前端搜索（`search-index.json`）覆盖 title + description + tags 三字段；接口只搜标题是功能降级。

**Query 参数表 `keyword` 行改为**：

| 参数 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `keyword` | string | — | 关键词模糊匹配：`title` / `summary` / `tags[]` 任一命中即返回 |

**后端行为**：

- 匹配条件：`title LIKE %kw% OR summary LIKE %kw% OR 任一 tag LIKE %kw%`；与 `category_id` / `tag_id` 筛选为 **AND** 关系（筛选交集内做关键词命中）
- 英文不区分大小写（MySQL utf8mb4 默认 collation 即满足；PostgreSQL 用 `ILIKE`）
- `keyword` 去首尾空白后为空 → 视为未传
- **不分词、不上全文索引**：百级文章量 LIKE 足够；量级上万再演进，属范围外

---

## 修改 3：分页参数边界与上限

**动机**：公开免登录接口不设限等于把全库送人爬。

| 参数 | 规则 | 违例行为 |
|---|---|---|
| `page` | ≥ 1 整数 | `< 1` / 非数字 → `40001`；超出总页数 → 空 `list` + 正常 `total`，**不报错** |
| `page_size` | ∈ [1, 100] 整数 | `< 1` / 非数字 → `40001`；**`> 100` 截断为 100，不报错** |

- 超上限采取**截断而非报错**：调用方无需预知上限，宽容策略
- Query 参数表 `page_size` 行补注「上限 100」

---

## 修改 4：文档修正——列表项补 `coverUrl`

列表响应示例补上 `coverUrl`（空时省略，与附录 ArticleResponse 定义一致）。

- 纯文档修正：**确认列表 DTO 实现已含该字段**，若实现遗漏则补齐
- 首页本次不展示封面（前端设计文档 §8 范围外），但字段先行到位，避免以后加封面卡片时后端再动

---

## 修改 5：详情路由实现注意事项（接口形状零改动）

`GET /articles/{path}` 的 `path` 含 `/` 分层与中文，实现需满足：

1. **多段匹配**：Gateway 与 Blog 服务路由均须按通配透传/匹配（如 Spring `@GetMapping("/articles/**")` 取余段；网关路由规则不得把 `ai/claude-code` 截成 `ai`）
2. **URL 解码**：中文 slug 经 HTTP 传输为 percent-encoding（`/articles/vpn/%E5%9F%BA%E4%BA%8E-...`），服务端解码后再查 slug；**「纯数字按 ID 查」的判断在解码后的字符串上做**
3. **只解码一次**：框架通常已自动解码，手写 `URLDecoder` 前先确认，防双重解码改变语义
4. **联调用例**（三种形态各一）：
   ```bash
   curl "http://localhost:8080/api/blog/v1/articles/ai/claude-code"                              # 多段 slug
   curl "http://localhost:8080/api/blog/v1/articles/vpn/基于-cloudflare-搭建免费节点"               # 中文 slug
   curl "http://localhost:8080/api/blog/v1/articles/2098244470511243264"                          # 纯数字 ID
   ```

---

## 验收清单

- [ ] `GET /articles` 缺省响应的列表项**无** `contentMd` 字段；`with_content=true` 时有
- [ ] `keyword=部署` 能命中「标题不含、但 summary 或 tags 含"部署"」的文章
- [ ] `keyword` + `category_id` 组合为交集筛选
- [ ] `page_size=1000` → `code=0` 且实际 ≤ 100 条；`page_size=-1` / `page=0` / `page_size=abc` → `40001`
- [ ] `page=999` → 空 `list` + 正常 `total`，`code=0`
- [ ] 列表项含 `coverUrl`（有封面的文章）
- [ ] 修改 5 的三种详情请求全部正确返回
- [ ] `categories` / `tags` / 详情接口行为无回归

---

## 验收记录（2026-09-16，本地 Gateway `:8080`）

### 通过

| 项 | 结果 |
|---|---|
| 详情三形态路由 | 多段 slug（`ai/claude-skill`）、中文 slug（`vpn/基于-cloudflare-搭建免费节点`）、纯数字 ID 均正确 |
| 40401 不暴露存在性 | 不存在 slug 返回 `40401 资源不存在` |
| `page` 超总页数 | 空 `list` + 正常 `total`，`code=0` |
| keyword 标题匹配 | `claude` / `CLAUDE` 均 2 篇（大小写不敏感）；空 keyword 视为未传 |
| `categories` / `tags` | 可用，按 id 升序 |

### 未通过（按优先级）

**P0 · slug 回填 6/12 篇不符清单 → 上线即断链**（对照 [2026-09-15 设计文档附录 A](./2026-09-15-blog-api-integration-design.md)）：

| 库内实际 slug | 应为（清单） | 问题 |
|---|---|---|
| `2099673706182742016` | `ai/ai-开发新秩序---ai全栈应用开发技术栈-推荐` | slug 为**纯数字 ID**，违反「slug 禁止纯数字」，且与 ID 直查歧义 |
| `claude-code-安装指南mac` | `ai/claude-code` | 缺 `ai/` 前缀（标题也与清单不一致，疑重新录入） |
| `moltbook-skill-完整拆解` | `ai/moltbook-skill完整拆解` | 缺前缀 + 多一个 `-` |
| `从零开始构建-rag-知识库系统go--postgresql--pgvector-实战` | `ai/从零开始构建-rag-…` | 缺 `ai/` 前缀 |
| `零成本打造专业收件域名邮箱cloudflare--gmail-终极配置保姆级全攻略` | `ai/零成本打造专业收件域名邮箱…` | 缺 `ai/` 前缀 |
| `我用超级马里奥的风格做了一个个人主页` | `website/我用超级马里奥的风格做了一个个人主页` | 缺 `website/` 前缀 |

> 规律：录入时大多只取了文件名，没带 `分类/` 目录前缀。另：13 篇中的 LangGraph 为新文章无清单对照；抽查 vpn 篇 `tags` 为空数组，如原 frontmatter 有 tags 请一并核对回填。

**P1 · `with_content` 未实现**：缺省 / `false` / `0` 列表均带 `contentMd`（参数被忽略）。

**P1 · 分页校验未实现**：`page_size=1000` 回显 1000 不截断；`page=0` / `page_size=-1` / `abc` 均返回 `code=0` 不报 `40001`；且 `page_size=-1` 与 `0` 实际**无条数限制**（返回全部 13 篇）——即防爬洞本身。

**P2 · `keyword` 只匹配 `title`**：取 vpn 篇 summary 开头长句（明确存在于 `summary`、不存在于 `title`）搜索 → 0 篇，证明 summary 未进匹配范围（tags 因抽查文章为空无法确证，大概率同样未实现）。

**P3 · 文档外字段泄漏**：`categories` 与列表/详情均返回 `deletedAt: null`，序列化时应排除。
