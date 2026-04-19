import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      layout: z.string().optional(),
      title: z.string(),
      date: z.coerce.date(),
      categories: z.union([z.string(), z.array(z.string()), z.any()]).optional().nullable(),
      tags: z.union([z.string(), z.array(z.string()), z.any()]).optional().nullable(),
      excerpt: z.string().optional(),
      toc: z.boolean().default(true),
      toc_sticky: z.boolean().default(true),
      toc_label: z.string().default('本文目录'),
      show_date: z.boolean().default(true),
      read_time: z.boolean().default(true),
    }),
});

export const collections = { posts };
