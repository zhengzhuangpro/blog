import { defineCollection, z } from 'astro:content';
import { blogApiLoader } from './loaders/blog-api';

const posts = defineCollection({
  loader: blogApiLoader(),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    pubDate: z.coerce.date().optional(),
  }),
});

export const collections = { posts };
