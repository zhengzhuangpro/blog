/**
 * 列表页共用逻辑：排序 / 分页切片（首页与分类页共用，见 index.astro、page/[page].astro、categories/*）
 *
 * 仅类型引用 astro:content，保持模块纯净可被 bun test 直接导入
 */
import type { CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'posts'>

/** 列表页每页文章数（首页与分类页一致） */
export const PAGE_SIZE = 20

/** 按发布时间倒序（与既有列表页行为一致：缺 pubDate 的排最后） */
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const da = a.data.pubDate?.getTime() ?? 0
    const db = b.data.pubDate?.getTime() ?? 0
    return db - da
  })
}

/** 总页数：0 篇也算 1 页，避免空站时出现 /page/1 之类的奇怪路由 */
export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE))
}

/** 取第 page 页（1 起）的切片，越界返回空数组 */
export function slicePage<T>(items: T[], page: number): T[] {
  return items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
}
