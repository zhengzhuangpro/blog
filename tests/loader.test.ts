import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { blogApiLoader } from '../src/loaders/blog-api';
import type { Article } from '../src/lib/blog-api';

function article(partial: Partial<Article> & { id: string }): Article {
  return {
    userId: 1,
    title: `文章 ${partial.id}`,
    slug: `ai/post-${partial.id}`,
    summary: '摘要',
    contentMd: '## 前言',
    status: 'published',
    publishedAt: '2026-09-14T10:00:00+08:00',
    createdAt: '2026-09-14T09:00:00+08:00',
    updatedAt: '2026-09-14T10:00:00+08:00',
    tags: ['t'],
    categoryName: 'ai',
    ...partial,
  };
}

/** 最小 LoaderContext 桩：store 记录入库，parseData 原样透传，renderMarkdown 标记渲染 */
function makeContext() {
  const entries: { id: string; body?: string; data: Record<string, unknown>; rendered?: unknown }[] = [];
  return {
    entries,
    ctx: {
      collection: 'posts',
      store: {
        set: (entry: (typeof entries)[number]) => entries.push(entry),
        clear: () => (entries.length = 0),
      },
      logger: { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} },
      parseData: async ({ data }: { data: Record<string, unknown> }) => ({ ...data }),
      renderMarkdown: async (content: string) => ({ html: `<p>${content}</p>`, metadata: { headings: [] } }),
    } as never,
  };
}

function mockApi(list: Article[], total = list.length) {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ code: 0, message: 'success', data: { list, total, page: 1, pageSize: 50 } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })) as typeof fetch;
}

const originalFetch = globalThis.fetch;

beforeEach(() => {
  process.env.BLOG_API_BASE = 'http://api.test';
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  delete process.env.BLOG_API_BASE;
});

describe('blogApiLoader', () => {
  test('字段映射：slug→id、contentMd→body、summary→description、categoryName→category', async () => {
    mockApi([article({ id: '1', slug: 'ai/claude-code', title: 'Claude Code' })]);
    const { entries, ctx } = makeContext();
    await blogApiLoader().load(ctx);

    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe('ai/claude-code');
    expect(entries[0].body).toBe('## 前言');
    expect(entries[0].rendered).toEqual({ html: '<p>## 前言</p>', metadata: { headings: [] } });
    expect(entries[0].data.slug).toBe('ai/claude-code');
    expect(entries[0].data.title).toBe('Claude Code');
    expect(entries[0].data.description).toBe('摘要');
    expect(entries[0].data.category).toBe('ai');
    expect(entries[0].data.pubDate).toBe('2026-09-14T10:00:00+08:00');
  });

  test('归一化：categoryName 空串 → category undefined；publishedAt 缺失回退 createdAt', async () => {
    mockApi([article({ id: '1', slug: 'ai/x', categoryName: '', publishedAt: undefined })]);
    const { entries, ctx } = makeContext();
    await blogApiLoader().load(ctx);

    expect(entries[0].data.category).toBeUndefined();
    expect(entries[0].data.pubDate).toBe('2026-09-14T09:00:00+08:00');
  });

  test('slug 冲突：抛错并点名两篇文章', async () => {
    mockApi([
      article({ id: '1', slug: 'ai/dup', title: '甲' }),
      article({ id: '2', slug: 'ai/dup', title: '乙' }),
    ]);
    const { ctx } = makeContext();
    const err = await blogApiLoader().load(ctx).catch((e) => e);
    expect(err.message).toContain('甲');
    expect(err.message).toContain('乙');
    expect(err.message).toContain('ai/dup');
  });

  test.each([
    ['含 ?', 'ai/clau?de'],
    ['含空格', 'ai/claude code'],
    ['含 %', 'ai/100%'],
    ['连续斜杠', 'ai//claude'],
    ['首部斜杠', '/ai/claude'],
  ])('slug 非法（%s）：抛错', async (_label, slug) => {
    mockApi([article({ id: '1', slug: slug as string })]);
    const { ctx } = makeContext();
    await expect(blogApiLoader().load(ctx)).rejects.toThrow('slug');
  });

  test('slug 缺失：抛错', async () => {
    mockApi([article({ id: '1', slug: undefined })]);
    const { ctx } = makeContext();
    await expect(blogApiLoader().load(ctx)).rejects.toThrow('缺少 slug');
  });

  test('空列表：抛错（防空站上线）', async () => {
    mockApi([]);
    const { ctx } = makeContext();
    await expect(blogApiLoader().load(ctx)).rejects.toThrow('0 篇');
  });

  test('缺 contentMd：抛错', async () => {
    mockApi([article({ id: '1', slug: 'ai/empty', contentMd: undefined })]);
    const { ctx } = makeContext();
    await expect(blogApiLoader().load(ctx)).rejects.toThrow('contentMd');
  });
});
