import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import path from 'node:path';

const stringOrNumber = z.union([z.string(), z.number()]);

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './posts',
    generateId: ({ entry }) => path.basename(entry, '.md'),
  }),
  schema: z.object({
    layout: z.string().optional(),
    title: z.string().optional(),
    date: z.coerce.date(),
    type: z.enum(['article', 'log', 'link', 'release', 'quote', 'note']).default('article'),
    tags: z.union([stringOrNumber, stringOrNumber.array()]).optional().nullable(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    toc: z.boolean().default(true),
    tocSticky: z.boolean().default(true),
    tocLabel: z.string().default('本文目录'),
    showDate: z.boolean().default(true),
    readTime: z.boolean().default(true),
    // Fields for type: 'quote'
    author: z.string().optional(),
    source: z.string().url().optional(),
    sourceTitle: z.string().optional(),
    context: z.string().optional(),
    // Fields for type: 'link'
    linkUrl: z.string().url().optional(),
  }),
});

export const collections = { posts };
