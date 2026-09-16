import { describe, expect, test } from 'bun:test';
import { PAGE_SIZE, pageCount, slicePage, sortPosts } from '../src/lib/posts';

/** 最小 entry 桩：sortPosts 只读 data.pubDate */
function post(pubDate?: Date) {
  return { id: String(Math.random()), data: { pubDate } } as never;
}

describe('sortPosts', () => {
  test('pubDate 倒序，缺失排最后', () => {
    const sorted = sortPosts([
      post(new Date('2026-01-01')),
      post(),
      post(new Date('2026-03-01')),
    ]);
    expect(sorted[0].data.pubDate!.getMonth()).toBe(2); // 3 月在最前
    expect(sorted[1].data.pubDate!.getMonth()).toBe(0);
    expect(sorted[2].data.pubDate).toBeUndefined();
  });

  test('拷贝排序，不改动入参顺序', () => {
    const posts = [post(new Date('2026-01-01')), post(new Date('2026-02-01'))];
    sortPosts(posts);
    expect(posts[0].data.pubDate!.getMonth()).toBe(0);
  });
});

describe('pageCount', () => {
  test('0 篇也是 1 页（不生成分页路由）', () => {
    expect(pageCount(0)).toBe(1);
  });

  test('整除不多出空页', () => {
    expect(pageCount(PAGE_SIZE)).toBe(1);
    expect(pageCount(PAGE_SIZE * 2)).toBe(2);
  });

  test('余 1 篇多 1 页', () => {
    expect(pageCount(PAGE_SIZE + 1)).toBe(2);
  });
});

describe('slicePage', () => {
  const items = Array.from({ length: PAGE_SIZE + 3 }, (_, i) => i);

  test('第 1 页取满 PAGE_SIZE，顺序不变', () => {
    expect(slicePage(items, 1)).toHaveLength(PAGE_SIZE);
    expect(slicePage(items, 1)[0]).toBe(0);
  });

  test('第 2 页只剩尾部 3 篇', () => {
    expect(slicePage(items, 2)).toEqual([PAGE_SIZE, PAGE_SIZE + 1, PAGE_SIZE + 2]);
  });

  test('越界页为空数组', () => {
    expect(slicePage(items, 3)).toEqual([]);
  });
});
