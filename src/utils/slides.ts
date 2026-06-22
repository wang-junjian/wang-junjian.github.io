import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export interface SlideInfo {
  id: string;
  slug: string;
  title: string;
  file: string;
}

/**
 * Convert a slide filename/identifier into a URL-safe slug.
 * Spaces are collapsed and replaced with hyphens so Astro can generate
 * reliable static routes for filenames like "大模型 AI 基础服务".
 */
export function slugifySlideId(id: string): string {
  return id
    .trim()
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Read all slide markdown files from the slides directory and return
 * metadata plus URL-safe slugs.
 */
export function getSlides(slidesDir?: string): SlideInfo[] {
  const dir = slidesDir || join(process.cwd(), 'slides');
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(b));

  return files.map((file) => {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const id = file.replace(/\.md$/, '');
    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : id;
    return { id, slug: slugifySlideId(id), title, file };
  });
}

/**
 * Find a slide by its URL-safe slug.
 */
export function getSlideBySlug(slug: string, slidesDir?: string): SlideInfo | undefined {
  return getSlides(slidesDir).find((slide) => slide.slug === slug);
}
