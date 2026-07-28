---
title: 从零开始构建 RAG 知识库系统：Go + PostgreSQL + pgvector 实战
category: ai
pubDate: 2026-07-28
---

> 本文详细介绍如何使用 Go 语言构建一个完整的 RAG（Retrieval-Augmented Generation）知识库系统，包括文档解析、文本分块、向量化存储、语义搜索和智能问答。

## 什么是 RAG？

RAG（Retrieval-Augmented Generation，检索增强生成）是一种结合了信息检索和生成式 AI 的技术架构。它的核心思想是：

1. **检索（Retrieval）**：从知识库中找到与用户问题相关的文档片段
2. **增强（Augmented）**：将检索到的内容作为上下文提供给大模型
3. **生成（Generation）**：大模型基于上下文生成准确的回答

### 为什么需要 RAG？

直接使用大模型（如 ChatGPT、GLM）存在以下问题：

| 问题 | 说明 |
|------|------|
| 知识截止 | 模型训练数据有时间限制，无法获取最新信息 |
| 幻觉问题 | 模型可能编造不存在的信息 |
| 私有数据 | 模型无法访问企业内部文档和数据 |
| 专业领域 | 通用模型在特定领域可能不够专业 |

RAG 通过"先检索，再生成"的方式，让大模型能够基于真实的文档内容回答问题，有效解决了上述问题。

### RAG 工作流程

```text
┌─────────────────────────────────────────────────────────────────┐
│                        文档导入流程                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   上传文档                                                      │
│      ↓                                                          │
│   文档解析（PDF/DOCX/TXT）                                      │
│      ↓                                                          │
│   文本分块（Chunking）                                          │
│      ↓                                                          │
│   向量化（Embedding）                                           │
│      ↓                                                          │
│   存储到向量数据库                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          问答流程                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   用户提问                                                      │
│      ↓                                                          │
│   问题向量化                                                    │
│      ↓                                                          │
│   向量相似度搜索                                                 │
│      ↓                                                          │
│   获取 Top-K 相关文档片段                                        │
│      ↓                                                          │
│   拼接上下文 + 用户问题                                          │
│      ↓                                                          │
│   调用大模型生成回答                                              │
│      ↓                                                          │
│   返回答案 + 参考来源                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### RAG vs Fine-tuning

| 维度 | RAG | Fine-tuning |
|------|-----|-------------|
| 知识更新 | 实时更新，增删文档即可 | 需重新训练模型 |
| 成本 | 低，仅需向量数据库 | 高，需要 GPU 和训练数据 |
| 可解释性 | 高，可追溯到具体文档片段 | 低，黑盒 |
| 适用场景 | 知识频繁变化、需要引用来源 | 风格迁移、特定领域深度优化 |
| 幻觉控制 | 强，基于真实文档生成 | 弱，仍可能编造 |

> 两者并不互斥，实际项目中常组合使用：RAG 负责知识检索，Fine-tuning 负责让模型更贴合业务语境。

## 技术栈

| 组件 | 技术选型 | 说明 |
|------|----------|------|
| 前端 | React + TypeScript | 现代化 UI |
| 后端语言 | Go | 高性能、并发友好 |
| Web 框架 | Gin | Go 生态最流行的 Web 框架 |
| 数据库 | PostgreSQL | 支持 JSONB、全文搜索 |
| 向量存储 | pgvector | PostgreSQL 向量扩展 |
| 文档解析 | LangChain Go | 支持多种文档格式 |
| Embedding | 智谱 embedding-3 | 中文优化，支持 256/512/1024/2048 维（默认 2048） |
| 大模型 | 智谱 GLM-4-Flash | 免费、快速的中文模型 |
| 文件存储 | Cloudflare R2 | S3 兼容，低成本 |

## 环境搭建

### 1. 安装 pgvector 扩展

```bash
# PostgreSQL 15+
sudo apt install postgresql-15-pgvector

# 或从源码编译
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make && sudo make install

# 在数据库中启用
psql -d your_db -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 2. Go 项目依赖

```bash
go mod init your-project

# 核心依赖
go get github.com/gin-gonic/gin           # Web 框架
go get gorm.io/gorm                        # ORM
go get gorm.io/driver/postgres             # PostgreSQL 驱动
go get github.com/tmc/langchaingo          # LangChain Go
go get github.com/pgvector/pgvector-go     # pgvector Go 绑定
```

### 3. 环境变量

```bash
# .env
DATABASE_URL=postgres://user:password@localhost:5432/rag_db?sslmode=disable
ZHIPU_API_KEY=your_zhipu_api_key
R2_ACCOUNT_ID=your_cf_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
```

## 系统架构

```text
┌─────────────────────────────────────────────────────────────────┐
│                       前端 (React)                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  知识库管理   │  │  文档管理    │  │      智能问答            │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API Gateway                                │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Admin 服务 (Go)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ RAG Handler  │  │ RAG Service  │  │  RAG Processor Service  │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Parser     │  │   Chunker    │  │  Embedding Service      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           │               │                    │
           ▼               ▼                    ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │ Cloudflare R2   │ │   智谱 AI API    │
│   + pgvector    │ │   文件存储       │ │   Embedding      │
│    向量存储      │ │                 │ │   + Chat         │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 数据库设计

### 知识库表

```sql
CREATE TABLE rag_knowledge_bases (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,               -- 知识库名称
    description TEXT,                          -- 描述
    status SMALLINT NOT NULL DEFAULT 1,        -- 状态 1=启用 0=禁用
    document_count INTEGER NOT NULL DEFAULT 0, -- 文档数量
    -- RAG 配置
    chunk_size INTEGER NOT NULL DEFAULT 500,   -- 分块大小
    chunk_overlap INTEGER NOT NULL DEFAULT 100,-- 分块重叠
    top_k INTEGER NOT NULL DEFAULT 5,          -- 检索数量
    model VARCHAR(50) NOT NULL DEFAULT 'glm-4-flash', -- 问答模型
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP(3) NULL
);
```

### 文档表

```sql
CREATE TABLE rag_documents (
    id BIGSERIAL PRIMARY KEY,
    knowledge_base_id BIGINT NOT NULL,     -- 所属知识库
    title VARCHAR(255) NOT NULL,           -- 文档标题
    file_name VARCHAR(255) NOT NULL,       -- 原始文件名
    file_key VARCHAR(500) NOT NULL,        -- R2 存储路径
    file_size BIGINT NOT NULL,             -- 文件大小
    file_type VARCHAR(50) NOT NULL,        -- 文件类型 pdf/docx/txt/md
    status SMALLINT NOT NULL DEFAULT 0,    -- 0=待处理 1=处理中 2=已完成 3=失败
    chunk_count INTEGER NOT NULL DEFAULT 0,-- 分块数量
    error_message TEXT,                    -- 错误信息
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP(3) NULL
);
```

### 分块表（带向量）

```sql
-- 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE rag_chunks (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL,           -- 所属文档
    knowledge_base_id BIGINT NOT NULL,     -- 所属知识库
    chunk_index INTEGER NOT NULL,          -- 分块序号
    content TEXT NOT NULL,                 -- 分块内容
    content_length INTEGER NOT NULL,       -- 内容长度
    metadata JSONB,                        -- 元数据
    embedding vector(2048),                -- 向量嵌入（2048维）
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP(3) NULL
);

-- 索引
CREATE INDEX idx_rag_chunks_document_id ON rag_chunks(document_id);
CREATE INDEX idx_rag_chunks_knowledge_base_id ON rag_chunks(knowledge_base_id);
```

> [!info] 关于向量维度
> 表中 `vector(2048)` 对应 embedding-3 的维度。pgvector 索引最多支持 2000 维，2048 维无法创建索引，但小数据量（<10万）暴力搜索性能可接受。如需索引支持，可换用其他支持 1024 维的 Embedding 模型。

## 核心实现

### 1. 文档解析

使用 LangChain Go 的文档加载器，支持 PDF、DOCX、TXT、Markdown 等格式：

```go
package parser

import (
	"bytes"
	"context"
	"fmt"
	"io"

	"github.com/tmc/langchaingo/documentloaders"
	"github.com/tmc/langchaingo/textsplitter"
)

// 文档解析器（支持 PDF/DOCX/TXT/Markdown）
type DocumentParser struct{}

func (p *DocumentParser) ParseAndSplit(ctx context.Context, reader io.Reader,
	fileName string, chunkSize, chunkOverlap int) ([]DocumentChunk, error) {
	// 读取文件内容
	data, err := io.ReadAll(reader)
	if err != nil {
		return nil, fmt.Errorf("读取文件失败: %w", err)
	}
	// 创建 LangChain PDF 加载器
	loader := documentloaders.NewPDF(bytes.NewReader(data), int64(len(data)))
	// 创建分块器
	splitter := textsplitter.NewRecursiveCharacter(
		textsplitter.WithChunkSize(chunkSize),
		textsplitter.WithChunkOverlap(chunkOverlap),
		textsplitter.WithSeparators([]string{
			"\n\n", // 段落
			"\n",   // 换行
			"。",   // 句号
			"！",   // 感叹号
			"？",   // 问号
			".",    // 英文句号
			"，",   // 逗号
		}),
	)
	// 加载并分割
	docs, err := loader.LoadAndSplit(ctx, splitter)
	if err != nil {
		return nil, fmt.Errorf("解析文档失败: %w", err)
	}
	return convertDocs(docs), nil
}
```

### 2. 文本分块策略

采用递归字符分割策略，按优先级使用不同分隔符：

```text
优先级：段落(\n\n) > 换行(\n) > 句号(。) > 逗号(，)

示例：
原文 (1200字):
  "第一章 总则\n\n第一条 目的...（500字）\n\n第二条 适用范围...（400字）"

分块结果：
  块0: "第一章 总则\n\n第一条 目的..." (500字)
  块1: "[第一条末尾100字]\n第二条 适用范围..." (500字)
```

关键参数：

- **chunk_size**：每个分块的最大字符数，默认 500
- **chunk_overlap**：分块之间的重叠字符数，默认 100

重叠机制确保相邻分块有上下文关联，避免语义被切断。

### 3. 向量化（Embedding）

使用智谱 embedding-3 模型，将文本转换为 2048 维向量：

```go
package embedding

// ZhipuClient 智谱 API 客户端
type ZhipuClient struct {
	apiKey     string
	httpClient *http.Client
}

// Embedding 获取单个文本的向量
func (c *ZhipuClient) Embedding(text string) ([]float32, error) {
	results, err := c.Embeddings([]string{text})
	if err != nil {
		return nil, err
	}
	return results[0], nil
}

// EmbeddingsWithBatch 批量获取向量（并发处理）
func (c *ZhipuClient) EmbeddingsWithBatch(texts []string, batchSize int) ([][]float32, error) {
	batchCount := (len(texts) + batchSize - 1) / batchSize
	results := make([][]float32, len(texts))
	errChan := make(chan error, batchCount)

	// 并发处理各批次
	for i := 0; i < len(texts); i += batchSize {
		go func(start int) {
			end := start + batchSize
			if end > len(texts) {
				end = len(texts)
			}
			batch := texts[start:end]
			batchResults, err := c.Embeddings(batch)
			if err != nil {
				errChan <- err
				return
			}
			copy(results[start:], batchResults)
			errChan <- nil
		}(i)
	}

	// 等待所有批次完成
	for i := 0; i < batchCount; i++ {
		if err := <-errChan; err != nil {
			return nil, err
		}
	}

	return results, nil
}
```

### 4. 向量存储与搜索

使用 PostgreSQL + pgvector 存储和搜索向量：

```go
// SearchSimilar 向量相似度搜索
func (r *ragChunkRepository) SearchSimilar(ctx context.Context, kbID uint,
	embedding []float32, limit int) ([]model.EmbeddingSearchResult, error) {
	var results []model.EmbeddingSearchResult

	// SQL 查询：使用余弦距离排序
	query := `
		SELECT id, document_id, knowledge_base_id, chunk_index, content, metadata,
			(embedding <=> ?::vector) as distance
		FROM rag_chunks
		WHERE knowledge_base_id = ? AND deleted_at IS NULL
		ORDER BY distance ASC
		LIMIT ?
	`

	// 将向量转换为 pgvector 格式
	vectorStr := pgvector.NewVector(embedding).String()

	err := r.db.WithContext(ctx).Raw(query, vectorStr, kbID, limit).Scan(&results).Error
	return results, err
}
```

pgvector 提供的向量距离运算符：

- `<=>`：余弦距离（cosine distance），值越小越相似
- `<->`：L2 距离（欧几里得距离）
- `<#>`：内积（inner product）

### 5. RAG 问答

将检索到的文档片段作为上下文，调用大模型生成回答：

```go
// AnswerQuestion 回答问题
func (s *AdminRagQAService) AnswerQuestion(ctx context.Context, req *QARequest) (*QAResponse, error) {
	// 1. 获取知识库配置
	kb, err := s.ragRepo.GetKnowledgeBaseByID(ctx, req.KBID)
	if err != nil {
		return nil, fmt.Errorf("获取知识库失败: %w", err)
	}
	topK := kb.TopK // 检索数量

	// 2. 问题向量化
	queryEmbedding, err := s.zhipuClient.Embedding(req.Question)
	if err != nil {
		return nil, fmt.Errorf("向量化失败: %w", err)
	}

	// 3. 向量搜索
	searchResults, err := s.chunkRepo.SearchSimilar(ctx, req.KBID, queryEmbedding, topK)
	if err != nil {
		return nil, fmt.Errorf("向量搜索失败: %w", err)
	}

	// 4. 构建上下文
	var contextParts []string
	for _, result := range searchResults {
		contextParts = append(contextParts,
			fmt.Sprintf("[文档%d-分块%d]\n%s",
				result.DocumentID, result.ChunkIndex, result.Content))
	}
	knowledgeContext := strings.Join(contextParts, "\n\n---\n\n")

	// 5. 调用大模型
	messages := []ChatMessage{
		{
			Role: "system",
			Content: `你是一个知识库问答助手。请根据提供的知识库内容回答用户的问题。
规则：
1. 只根据提供的知识库内容回答，不要编造信息
2. 如果知识库中没有相关内容，请明确告知用户
3. 回答要简洁、准确、有条理`,
		},
		{
			Role: "user",
			Content: fmt.Sprintf(`请根据以下知识库内容回答问题。

## 知识库内容
%s

## 用户问题
%s`, knowledgeContext, req.Question),
		},
	}

	answer, err := s.zhipuClient.Chat(messages)
	if err != nil {
		return nil, fmt.Errorf("调用大模型失败: %w", err)
	}

	return &QAResponse{
		Answer:  answer,
		Sources: sources, // 参考来源
	}, nil
}
```

### 6. 流式回答

使用 SSE（Server-Sent Events）实现流式响应，提升用户体验：

```go
// AskQuestionStream 流式问答
func (h *AdminRagHandler) AskQuestionStream(c *gin.Context) {
	// 设置 SSE 响应头
	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")

	flusher := c.Writer.(http.Flusher)

	// 流式写入
	h.ragQAService.AnswerQuestionStream(ctx, req, func(chunk string, sources []QASource) {
		if sources != nil {
			data, _ := json.Marshal(map[string]interface{}{
				"type":    "sources",
				"sources": sources,
			})
			fmt.Fprintf(c.Writer, "data: %s\n\n", data)
			flusher.Flush()
		}

		if chunk != "" {
			data, _ := json.Marshal(map[string]interface{}{
				"type":  "chunk",
				"chunk": chunk,
			})
			fmt.Fprintf(c.Writer, "data: %s\n\n", data)
			flusher.Flush()
		}
	})

	// 结束标记
	fmt.Fprintf(c.Writer, "data: [DONE]\n\n")
	flusher.Flush()
}
```

前端流式接收：

```typescript
async function askQuestionStream(kbId: number, question: string,
	onChunk: (chunk: string) => void) {
	const response = await fetch(`/api/admin/v1/rag/knowledge-bases/${kbId}/ask/stream`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		body: JSON.stringify({ question }),
	})

	const reader = response.body?.getReader()
	const decoder = new TextDecoder()

	while (true) {
		const { done, value } = await reader.read()
		if (done) break

		const text = decoder.decode(value)
		const lines = text.split('\n')

		for (const line of lines) {
			if (!line.startsWith('data: ')) continue
			const data = line.slice(6)
			if (data === '[DONE]') return

			const parsed = JSON.parse(data)
			if (parsed.type === 'chunk') {
				onChunk(parsed.chunk) // 逐字显示
			}
		}
	}
}
```

## API 接口

### 知识库管理

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/admin/v1/rag/knowledge-bases` | 创建知识库 |
| GET | `/api/admin/v1/rag/knowledge-bases` | 获取知识库列表 |
| GET | `/api/admin/v1/rag/knowledge-bases/:id` | 获取知识库详情 |
| PUT | `/api/admin/v1/rag/knowledge-bases/:id` | 更新知识库 |
| DELETE | `/api/admin/v1/rag/knowledge-bases/:id` | 删除知识库 |

### 文档管理

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/admin/v1/rag/knowledge-bases/:id/documents` | 上传文档（自动处理） |
| GET | `/api/admin/v1/rag/knowledge-bases/:id/documents` | 获取文档列表 |
| DELETE | `/api/admin/v1/rag/documents/:id` | 删除文档 |

### 搜索与问答

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/v1/rag/knowledge-bases/:id/search?query=xxx` | 语义搜索 |
| POST | `/api/admin/v1/rag/knowledge-bases/:id/ask` | 问答（一次性返回） |
| POST | `/api/admin/v1/rag/knowledge-bases/:id/ask/stream` | 问答（流式返回） |

### 请求示例

**创建知识库：**

```bash
curl -X POST http://localhost:8082/api/admin/v1/rag/knowledge-bases \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "产品文档",
    "description": "产品使用说明和FAQ",
    "chunkSize": 500,
    "chunkOverlap": 100,
    "topK": 5,
    "model": "glm-4-flash"
  }'
```

**上传文档：**

```bash
curl -X POST http://localhost:8082/api/admin/v1/rag/knowledge-bases/1/documents \
  -H "Authorization: Bearer <token>" \
  -F "file=@document.pdf"
```

**问答：**

```bash
curl -X POST http://localhost:8082/api/admin/v1/rag/knowledge-bases/1/ask \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"question": "如何配置系统参数？"}'
```

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "answer": "根据文档，系统参数配置步骤如下：\n1. 登录管理后台\n2. 进入系统设置\n3. 修改相关参数...",
    "sources": [
      {
        "documentId": 1,
        "chunkIndex": 5,
        "content": "系统参数配置说明...",
        "similarity": 92.5
      }
    ]
  }
}
```

## 配置参数说明

| 参数 | 默认值 | 说明 |
|------|--------|------|
| chunk_size | 500 | 每个分块的最大字符数。值越大，上下文越完整，但检索精度可能下降 |
| chunk_overlap | 100 | 分块之间的重叠字符数。用于保持上下文连续性 |
| top_k | 5 | 检索时返回的最相似文档数量。值越大，上下文越丰富，但成本越高 |
| model | glm-4-flash | 问答使用的模型。glm-4-flash 免费快速，GLM-5.2 更强但需付费 |

### 参数调优建议

| 场景 | chunk_size | chunk_overlap | top_k |
|------|------------|---------------|-------|
| FAQ/短文档 | 300 | 50 | 3 |
| 技术文档 | 500 | 100 | 5 |
| 合同/法律文件 | 800 | 200 | 5 |
| 长篇报告 | 1000 | 200 | 3 |

## 性能优化

### 1. 并发 Embedding

批量生成向量时使用 goroutine 并发处理：

```go
// 串行：16个文本 * 100ms = 1.6秒
// 并发（4批次）：4 * 100ms = 400ms
```

### 2. 异步文档处理

文档上传后立即返回，后台异步处理：

```go
go func() {
	ctx := context.Background()
	if err := h.ragProcessorService.ProcessDocument(ctx, doc.ID); err != nil {
		h.logger.Error("处理文档失败", zap.Error(err))
	}
}()
```

### 3. 向量索引

对于大数据量（>10万条），可以创建向量索引加速搜索：

```sql
-- HNSW 索引（推荐，性能更好）
CREATE INDEX idx_embedding ON rag_chunks
USING hnsw (embedding vector_cosine_ops);

-- IVFFlat 索引（适合静态数据）
CREATE INDEX idx_embedding ON rag_chunks
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

> [!tip] 维度与索引
> pgvector 索引最多支持 2000 维。embedding-3 默认 2048 维无法创建索引。如需索引支持，可换用其他支持 1024 维的 Embedding 模型。对于小数据量（<10万），即使 2048 维暴力搜索性能也可接受。

### 4. Redis 缓存

使用 Redis 缓存 Embedding 结果，避免重复调用 API：

```go
// EmbeddingCache Embedding 缓存接口
type EmbeddingCache interface {
	Get(key string) ([]float32, bool)
	Set(key string, value []float32, ttl time.Duration)
}

// RedisEmbeddingCache Redis 实现的 Embedding 缓存
type RedisEmbeddingCache struct {
	client redis.UniversalClient
	ttl    time.Duration
}

func (c *RedisEmbeddingCache) Get(key string) ([]float32, bool) {
	ctx := context.Background()
	data, err := c.client.Get(ctx, "rag:emb:"+key).Bytes()
	if err != nil {
		return nil, false
	}
	var result []float32
	json.Unmarshal(data, &result)
	return result, true
}

func (c *RedisEmbeddingCache) Set(key string, value []float32, ttl time.Duration) {
	ctx := context.Background()
	data, _ := json.Marshal(value)
	c.client.Set(ctx, "rag:emb:"+key, data, ttl)
}
```

在 Embedding 函数中集成缓存：

```go
// hashText 计算文本哈希作为缓存键
func hashText(text string) string {
	h := sha256.Sum256([]byte(text))
	return hex.EncodeToString(h[:16])
}

// Embedding 获取向量（带缓存）
func (c *ZhipuClient) Embedding(text string) ([]float32, error) {
	// 1. 检查缓存
	if c.cache != nil {
		cacheKey := hashText(text)
		if cached, ok := c.cache.Get(cacheKey); ok {
			return cached, nil // 命中缓存，直接返回
		}
	}

	// 2. 调用 API
	results, err := c.callAPI([]string{text})
	if err != nil {
		return nil, err
	}

	// 3. 存入缓存（TTL 24小时）
	if c.cache != nil {
		cacheKey := hashText(text)
		c.cache.Set(cacheKey, results[0], 24*time.Hour)
	}

	return results[0], nil
}
```

**缓存效果：**

| 场景 | 无缓存 | 有缓存 |
|------|--------|--------|
| 相同文本重复 Embedding | 每次调用 API（~100ms） | 从 Redis 读取（<1ms） |
| 文档重新处理 | 重新生成所有向量 | 只生成新内容的向量 |
| 问答时问题向量化 | 每次调用 API | 相同问题直接返回 |

**缓存键设计：**

```go
const (
	KeyRAGEmbedding = "rag:emb:%s"       // Embedding 缓存，键为文本哈希
	TTLRAGEmbedding = 24 * time.Hour     // 向量不会变，长期缓存
)
```

### 5. 问答结果缓存

相同问题 + 相同知识库的问答结果可以缓存，避免重复调用大模型 API：

```go
// AnswerQuestion 回答问题
func (s *AdminRagQAService) AnswerQuestion(ctx context.Context, req *QARequest) (*QAResponse, error) {
	// 1. 检查缓存
	cacheKey := fmt.Sprintf("rag:qa:%d:%s", req.KBID, hashQuestion(req.Question))
	if cached, ok := cache.Get[QAResponse](s.cache, cacheKey); ok {
		return &cached, nil // 命中缓存，直接返回
	}

	// 2. 搜索相关文档
	queryEmbedding, _ := s.zhipuClient.Embedding(req.Question)
	searchResults, _ := s.chunkRepo.SearchSimilar(ctx, req.KBID, queryEmbedding, topK)

	// 3. 构建上下文并调用大模型
	// ... (省略)

	// 4. 存入缓存（TTL 10分钟）
	result := &QAResponse{Answer: answer, Sources: sources}
	cache.Set(cacheKey, result, 10*time.Minute)

	return result, nil
}
```

**缓存效果：**

| 场景 | 无缓存 | 有缓存 |
|------|--------|--------|
| 用户重复提问 | 每次调用大模型（~2-5秒） | 从缓存读取（<1ms） |
| 多用户问相同问题 | 每个用户都调用 API | 第一个调用，后续缓存 |

**缓存键设计：**

```go
const (
	KeyRAGQA = "rag:qa:%d:%s"         // 问答结果缓存（参数: kbID, question hash）
	TTLRAGQA = 10 * time.Minute       // 10分钟 TTL，避免答案过时
)
```

### 6. 知识库配置缓存

知识库配置不经常变化，可以缓存以减少数据库查询：

```go
// GetKnowledgeBase 获取知识库详情
func (s *AdminRagService) GetKnowledgeBase(ctx context.Context, id uint) (*model.RagKnowledgeBase, error) {
	// 1. 检查缓存
	cacheKey := fmt.Sprintf("rag:kb:%d", id)
	if cached, ok := cache.Get[model.RagKnowledgeBase](s.cache, cacheKey); ok {
		return &cached, nil
	}

	// 2. 查询数据库
	kb, err := s.ragRepo.GetKnowledgeBaseByID(ctx, id)
	if err != nil || kb == nil {
		return nil, errors.New("知识库不存在")
	}

	// 3. 存入缓存
	cache.Set(cacheKey, kb, 30*time.Minute)

	return kb, nil
}

// UpdateKnowledgeBase 更新知识库时清除缓存
func (s *AdminRagService) UpdateKnowledgeBase(ctx context.Context, id uint, req *UpdateKnowledgeBaseRequest) (*model.RagKnowledgeBase, error) {
	// ... 更新逻辑

	// 清除缓存
	cache.Delete(fmt.Sprintf("rag:kb:%d", id))

	return kb, nil
}
```

**缓存键设计：**

```go
const (
	KeyRAGKnowledgeBase = "rag:kb:%d"    // 知识库配置缓存（参数: kbID）
	TTLRAGKB            = 30 * time.Minute // 30分钟 TTL
)
```

### 7. 批量删除优化

删除知识库时，使用数据库事务批量删除关联数据，避免 N+1 查询：

```go
// DeleteKnowledgeBaseWithCascade 级联删除知识库及所有关联数据
func (r *ragRepository) DeleteKnowledgeBaseWithCascade(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// 1. 删除所有分块
		if err := tx.Where("knowledge_base_id = ?", id).Delete(&model.RagChunk{}).Error; err != nil {
			return err
		}
		// 2. 删除所有文档
		if err := tx.Where("knowledge_base_id = ?", id).Delete(&model.RagDocument{}).Error; err != nil {
			return err
		}
		// 3. 删除知识库
		if err := tx.Delete(&model.RagKnowledgeBase{}, id).Error; err != nil {
			return err
		}
		return nil
	})
}
```

**优化效果：**

| 方式 | 查询次数 | 数据一致性 |
|------|----------|-----------|
| 逐条删除 | N+1 次查询 | 可能部分失败 |
| 事务批量删除 | 3 次查询 | 原子操作，全部成功或全部失败 |

### 8. API 重试机制

Embedding 和 Chat API 调用失败时自动重试，使用指数退避策略：

```go
// Embeddings 批量获取 Embedding（带重试）
func (c *ZhipuClient) Embeddings(texts []string) ([][]float32, error) {
	var lastErr error
	maxRetries := 3

	for attempt := 0; attempt < maxRetries; attempt++ {
		if attempt > 0 {
			// 指数退避：1s, 2s, 4s
			time.Sleep(time.Duration(1<<uint(attempt-1)) * time.Second)
		}

		results, err := c.embeddingsInternal(texts)
		if err == nil {
			return results, nil
		}

		lastErr = err

		// 如果是客户端错误（4xx），不重试
		if strings.Contains(err.Error(), "状态码: 4") {
			return nil, err
		}
	}

	return nil, fmt.Errorf("重试 %d 次后失败: %w", maxRetries, lastErr)
}
```

**重试策略：**

| 参数 | 值 | 说明 |
|------|-----|------|
| 最大重试次数 | 3 | 包括首次调用 |
| 退避时间 | 1s, 2s, 4s | 指数退避 |
| 跳过条件 | 4xx 错误 | 客户端错误不重试 |

### 9. 并发限制

限制同时处理的文档数量，防止资源耗尽：

```go
// AdminRagProcessorService RAG 文档处理服务
type AdminRagProcessorService struct {
	// ... 其他字段
	concurrencyLimit chan struct{} // 并发限制信号量
}

func NewAdminRagProcessorService(...) *AdminRagProcessorService {
	return &AdminRagProcessorService{
		// ... 其他初始化
		concurrencyLimit: make(chan struct{}, 3), // 最多同时处理 3 个文档
	}
}

// ProcessDocument 处理文档（带并发限制）
func (s *AdminRagProcessorService) ProcessDocument(ctx context.Context, documentID uint) error {
	// 获取信号量（阻塞等待）
	s.concurrencyLimit <- struct{}{}
	defer func() { <-s.concurrencyLimit }()

	// ... 处理文档逻辑
}
```

**并发控制：**

| 场景 | 行为 |
|------|------|
| 并发数 < 3 | 立即处理 |
| 并发数 = 3 | 阻塞等待，直到有空闲槽位 |
| 并发数 > 3 | 排队等待 |

### 10. 多轮对话

支持多轮对话，维护对话上下文，实现追问功能：

```go
// QARequest 问答请求
type QARequest struct {
	Question string        `json:"question" binding:"required"`
	KBID     uint          `json:"kbId" binding:"required"`
	History  []ChatMessage `json:"history,omitempty"` // 对话历史
}

// AnswerQuestion 回答问题（支持多轮对话）
func (s *AdminRagQAService) AnswerQuestion(ctx context.Context, req *QARequest) (*QAResponse, error) {
	// ... 搜索相关文档

	// 构建消息（包含对话历史）
	messages := []embedding.ChatMessage{
		{Role: "system", Content: systemPrompt},
	}

	// 添加对话历史（最多保留最近 5 轮）
	historyStart := 0
	if len(req.History) > 10 { // 5轮 = 10条消息
		historyStart = len(req.History) - 10
	}
	for _, msg := range req.History[historyStart:] {
		messages = append(messages, embedding.ChatMessage{
			Role:    msg.Role,
			Content: msg.Content,
		})
	}

	// 添加当前问题（带知识库上下文）
	messages = append(messages, embedding.ChatMessage{
		Role:    "user",
		Content: fmt.Sprintf("知识库内容...\n问题: %s", req.Question),
	})

	// 调用大模型
	answer, _ := s.zhipuClient.Chat(messages)
	return &QAResponse{Answer: answer, Sources: sources}, nil
}
```

**前端调用示例：**

```typescript
// 传递对话历史
const history = chatMessages.map(msg => ({
	role: msg.role,
	content: msg.content
}))

await askQuestionStream(kbId, question, onChunk, onSources, history)
```

### 11. 文档更新

支持重新上传文档，自动删除旧分块并重新处理：

```go
// UpdateDocument 更新文档（重新上传文件）
func (s *AdminRagService) UpdateDocument(ctx context.Context, id uint, req *UpdateDocumentRequest) (*model.RagDocument, error) {
	// 1. 获取原文档
	doc, _ := s.ragRepo.GetDocumentByID(ctx, id)

	// 2. 删除旧文件
	s.r2Client.Delete(ctx, doc.FileKey)

	// 3. 删除旧分块
	s.chunkRepo.DeleteByDocumentID(ctx, id)

	// 4. 上传新文件
	newKey := storage.GenerateKey("rag/"+kbID, timestamp, ext)
	s.r2Client.Upload(ctx, &storage.UploadInput{Key: newKey, Body: req.File})

	// 5. 更新文档记录（重置状态为待处理）
	doc.FileKey = newKey
	doc.Status = 0 // 待处理
	doc.ChunkCount = 0

	return doc, nil
}
```

**API 接口：**

```bash
# 更新文档（重新上传）
curl -X PUT http://localhost:8082/api/admin/v1/rag/documents/1 \
  -H "Authorization: Bearer <token>" \
  -F "file=@new_document.pdf"
```

## 总结

本文介绍了一个基于 Go + PostgreSQL + pgvector 构建的 RAG 知识库系统。通过合理的架构设计和技术选型，实现了一个功能完整、性能良好的 RAG 解决方案。

关键点回顾：

- 使用 LangChain Go 进行文档解析和分块，支持多种文档格式
- 使用 pgvector 在 PostgreSQL 中存储和搜索向量，无需引入额外的向量数据库
- 使用智谱 AI 的 Embedding 和 Chat API，中文效果好
- 支持流式回答，提升用户体验
- 参数可配置，适应不同场景需求

RAG 技术还在快速发展中，未来会有更多优化和改进。希望本文能为你构建自己的 RAG 系统提供参考。

---

**相关资源**：

- [pgvector 文档](https://github.com/pgvector/pgvector)
- [LangChain Go](https://github.com/tmc/langchaingo)
- [智谱 AI 开放平台](https://open.bigmodel.cn/)
