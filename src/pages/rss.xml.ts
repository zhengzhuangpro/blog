import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config';

/** RSS 只输出最近 N 篇，订阅器不需要全量，文章多了避免文件膨胀 */
const RSS_MAX_ITEMS = 30;

export async function GET() {
  const posts = await getCollection('posts');
  const sortedPosts = posts
    .filter((post) => post.data.pubDate)
    .sort((a, b) => b.data.pubDate!.getTime() - a.data.pubDate!.getTime());

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.site,
    items: sortedPosts.slice(0, RSS_MAX_ITEMS).map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/${post.id}`,
    })),
  });
}
