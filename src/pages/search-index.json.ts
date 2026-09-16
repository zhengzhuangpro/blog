import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');
  const index = posts.map((post) => {
    const date = post.data.pubDate;
    return {
      title: post.data.title,
      description: post.data.description || '',
      category: post.data.category || '',
      tags: post.data.tags || [],
      date: date ? date.toISOString().slice(0, 10) : '',
      slug: '/' + post.id,
    };
  });
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
