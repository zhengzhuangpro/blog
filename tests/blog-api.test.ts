import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { BlogApiError, fetchAllArticles, type Article } from '../src/lib/blog-api';

/** 构造一篇文章（覆盖必填字段，其余用 partial 覆盖） */
function article(partial: Partial<Article> & { id: string }): Article {
  return {
    userId: 2098244000000000001,
    title: `文章 ${partial.id}`,
    slug: `ai/post-${partial.id}`,
    summary: '摘要',
    contentMd: '## 前言\n\n正文',
    status: 'published',
    publishedAt: '2026-09-14T10:00:00+08:00',
    createdAt: '2026-09-14T09:00:00+08:00',
    updatedAt: '2026-09-14T10:00:00+08:00',
    tags: [],
    categoryName: 'ai',
    ...partial,
  };
}

function envelope(list: Article[], total: number) {
  return new Response(
    JSON.stringify({ code: 0, message: 'success', data: { list, total, page: 1, pageSize: 50 } }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
}

const originalFetch = globalThis.fetch;
let calls: string[] = [];

beforeEach(() => {
  process.env.BLOG_API_BASE = 'http://api.test';
  calls = [];
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  delete process.env.BLOG_API_BASE;
});

describe('fetchAllArticles', () => {
  test('分页遍历：累计达到 total 即停，聚合全量', async () => {
    const page1 = Array.from({ length: 50 }, (_, i) => article({ id: `p1-${i}` }));
    const page2 = Array.from({ length: 10 }, (_, i) => article({ id: `p2-${i}` }));
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      calls.push(String(input));
      return envelope(String(input).includes('page=1') ? page1 : page2, 60);
    }) as typeof fetch;

    const all = await fetchAllArticles();

    expect(all).toHaveLength(60);
    expect(calls).toHaveLength(2);
    expect(calls[0]).toContain('page=1&page_size=50&with_content=true');
    expect(calls[1]).toContain('page=2');
  });

  test('单页即达 total：只发一次请求', async () => {
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      calls.push(String(input));
      return envelope([article({ id: 'only' })], 1);
    }) as typeof fetch;

    expect(await fetchAllArticles()).toHaveLength(1);
    expect(calls).toHaveLength(1);
  });

  test('code !== 0：抛 BlogApiError 且不重试', async () => {
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      calls.push(String(input));
      return new Response(JSON.stringify({ code: 40401, message: '资源不存在', data: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;

    const err = await fetchAllArticles().catch((e) => e);
    expect(err).toBeInstanceOf(BlogApiError);
    expect(err.code).toBe(40401);
    expect(calls).toHaveLength(1); // 业务错误不重试
  });

  test('瞬时失败（网络错误）重试一次后成功', async () => {
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      calls.push(String(input));
      if (calls.length === 1) throw new TypeError('fetch failed');
      return envelope([article({ id: 'ok' })], 1);
    }) as typeof fetch;

    expect(await fetchAllArticles()).toHaveLength(1);
    expect(calls).toHaveLength(2);
  });

  test('HTTP 500 重试一次仍失败：抛错', async () => {
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      calls.push(String(input));
      return new Response('boom', { status: 500 });
    }) as typeof fetch;

    await expect(fetchAllArticles()).rejects.toThrow();
    expect(calls).toHaveLength(2);
  });
});
