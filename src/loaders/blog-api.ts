/**
 * Astro 内容集合自定义 Loader：构建时从 Blog API 拉取全量文章（specs/2026-09-15 §4.2/4.3）
 *
 * entry 结构：id = slug（如 ai/claude-code），body = contentMd（原始 markdown），
 * rendered = renderMarkdown() 产物（Astro 6 的 render() 只读 entry.rendered，不渲染 body，
 * 与原 glob loader 行为一致），TOC 取 rendered.metadata.headings。
 * fail-fast：slug 非法 / 重复 / 缺正文 / 空列表一律抛错终止构建，防止把坏数据部署上线。
 */
import type { Loader } from 'astro/loaders';
import { fetchAllArticles, type Article } from '../lib/blog-api';

/** 会让静态路由出问题的字符（specs/2026-09-15 附录 A：slug 禁止 ? # % & 与空白） */
const RESERVED_CHARS = /[?#%&\s]/;

/** 与静态路由冲突的保留前缀：/page/N 是首页分页，/categories/* 是分类页 */
const RESERVED_PREFIXES = ['page/', 'categories/'];

class LoaderError extends Error {}

function validateSlug(article: Article, slug: string): void {
  if (!slug) {
    throw new LoaderError(`文章「${article.title}」(id=${article.id}) 缺少 slug`);
  }
  if (RESERVED_CHARS.test(slug)) {
    throw new LoaderError(`文章「${article.title}」slug 含 URL 保留字符（? # % & 空白）: ${slug}`);
  }
  if (slug.startsWith('/') || slug.endsWith('/') || slug.includes('//')) {
    throw new LoaderError(`文章「${article.title}」slug 首尾或连续斜杠非法: ${slug}`);
  }
  const reserved = RESERVED_PREFIXES.find((p) => slug.startsWith(p));
  if (reserved) {
    throw new LoaderError(`文章「${article.title}」slug 使用保留前缀「${reserved}」（与分页/分类静态路由冲突）: ${slug}`);
  }
}

/** specs/2026-09-15 §4.3 数据映射 */
function toEntryData(article: Article): Record<string, unknown> {
  return {
    slug: article.slug,
    title: article.title,
    description: article.summary,
    // 分类被删后端回落 ""，归一化为 undefined：不进分类页，URL 不受影响
    category: article.categoryName || undefined,
    tags: article.tags ?? [],
    pubDate: article.publishedAt ?? article.createdAt,
  };
}

export function blogApiLoader(): Loader {
  return {
    name: 'blog-api',
    async load({ store, logger, parseData, renderMarkdown }) {
      const articles = await fetchAllArticles();
      if (articles.length === 0) {
        throw new LoaderError('Blog API 返回 0 篇文章——疑似后端故障，终止构建以防空站上线');
      }

      store.clear();
      const seen = new Map<string, string>(); // slug -> title（冲突报错用）

      for (const article of articles) {
        const slug = article.slug ?? '';
        validateSlug(article, slug);

        if (seen.has(slug)) {
          throw new LoaderError(`slug 冲突：「${article.title}」与「${seen.get(slug)}」均为 ${slug}`);
        }
        seen.set(slug, article.title);

        if (!article.contentMd) {
          throw new LoaderError(`文章「${article.title}」(${slug}) 缺少 contentMd——with_content 未生效或正文为空`);
        }

        const data = await parseData({ id: slug, data: toEntryData(article) });
        const rendered = await renderMarkdown(article.contentMd);
        store.set({ id: slug, body: article.contentMd, data, rendered });
      }

      logger.info(`blog-api loader: ${articles.length} 篇文章入库`);
    },
  };
}
