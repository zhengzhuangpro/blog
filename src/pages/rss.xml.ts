import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config';

export async function GET() {
  const posts = await getCollection('posts');
  const sortedPosts = posts
    .filter((post) => post.data.pubDate)
    .sort((a, b) => b.data.pubDate!.getTime() - a.data.pubDate!.getTime());

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/${post.id.replace(/\.md$/, '')}`,
    })),
  });
}
