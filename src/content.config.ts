import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const stringOrNumber = z.union([z.string(), z.number()]);

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    layout: z.string().optional(),
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['article', 'log', 'link', 'quote']).default('article'),
    tags: z.union([stringOrNumber, stringOrNumber.array()]).optional().nullable(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    toc: z.boolean().default(true),
    tocSticky: z.boolean().default(true),
    tocLabel: z.string().default('本文目录'),
    showDate: z.boolean().default(true),
    readTime: z.boolean().default(true),
  }),
});

export const collections = { posts };
