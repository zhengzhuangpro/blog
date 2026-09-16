/**
 * Blog 服务公开 API 客户端（构建期调用，见 specs/2026-09-15-blog-api-integration-design.md）
 *
 * 接口文档：Blog 公开查询接口（/api/blog/v1/articles）
 * 统一响应：{ code, message, data }，code === 0 成功
 */

/** 文章（ArticleResponse）。id / userId 为 snowflake，超 JS 安全整数——仅透传，勿做数值比较 */
export interface Article {
  id: string;
  userId: number;
  title: string;
  slug?: string;
  summary: string;
  /** 仅 with_content=true 或详情接口返回 */
  contentMd?: string;
  coverUrl?: string;
  categoryId?: number;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  categoryName: string;
}

interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

interface ArticleListData {
  list: Article[];
  total: number;
  page: number;
  pageSize: number;
}

/** 业务错误（code !== 0 或 HTTP 非 2xx），不重试 */
export class BlogApiError extends Error {
  constructor(
    public readonly code: number,
    message: string,
  ) {
    super(`Blog API 错误 [${code}]: ${message}`);
    this.name = 'BlogApiError';
  }
}

/** 瞬时错误（网络失败 / 超时 / HTTP ≥ 500），可重试一次 */
class RetryableError extends Error {}

const DEFAULT_API_BASE = 'http://localhost:8080';
const PAGE_SIZE = 50;
const MAX_PAGES = 100; // 安全上限：50 × 100 = 5000 篇，超出视为后端数据异常
const REQUEST_TIMEOUT_MS = 10_000;

export function getApiBase(): string {
  return process.env.BLOG_API_BASE ?? DEFAULT_API_BASE;
}

async function requestOnce(url: string): Promise<ArticleListData> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, { signal: controller.signal });
  } catch (err) {
    throw new RetryableError(err instanceof Error ? err.message : String(err));
  } finally {
    clearTimeout(timer);
  }

  if (res.status >= 500) {
    throw new RetryableError(`HTTP ${res.status}`);
  }

  let body: ApiEnvelope<ArticleListData>;
  try {
    body = (await res.json()) as ApiEnvelope<ArticleListData>;
  } catch {
    throw new BlogApiError(50001, `HTTP ${res.status}，响应不是 JSON: ${url}`);
  }

  if (!res.ok || body.code !== 0) {
    throw new BlogApiError(body.code ?? res.status, body.message ?? `HTTP ${res.status}`);
  }
  return body.data;
}

async function fetchPage(page: number): Promise<ArticleListData> {
  const url = `${getApiBase()}/api/blog/v1/articles?page=${page}&page_size=${PAGE_SIZE}&with_content=true`;
  console.log(`[blog-api] GET ${url}`);
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await requestOnce(url);
    } catch (err) {
      lastError = err;
      if (!(err instanceof RetryableError) || attempt === 1) throw err;
    }
  }
  throw lastError; // 不可达，兜底
}

/** 遍历分页拉取全部已发布文章（带正文），直至累计达到 total 或读到空页 */
export async function fetchAllArticles(): Promise<Article[]> {
  const all: Article[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await fetchPage(page);
    all.push(...data.list);
    if (all.length >= data.total || data.list.length === 0) return all;
  }
  throw new BlogApiError(50001, `分页遍历超过安全上限 ${MAX_PAGES} 页（已取 ${all.length} 篇）`);
}
