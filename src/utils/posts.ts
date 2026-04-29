import type { CollectionEntry } from 'astro:content';
import fs from 'node:fs';

export function normalizeCategories(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(v => String(v));

  let str = String(value).trim();

  // Handle YAML list format: [item1, item2]
  if (str.startsWith('[') && str.endsWith(']')) {
    str = str.slice(1, -1).trim();
    // For YAML list in categories, use comma separator
    return str.split(/[,，]/).map(s => s.trim()).filter(Boolean);
  }

  // Split by spaces for categories
  return str.split(/\s+/).map(s => s.trim()).filter(Boolean);
}

export function normalizeTags(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(v => String(v));

  let str = String(value).trim();

  // Handle YAML list format: [item1, item2]
  if (str.startsWith('[') && str.endsWith(']')) {
    str = str.slice(1, -1).trim();
  }

  // Split by commas (both English and Chinese) for tags
  return str.split(/[,，]/).map(s => s.trim()).filter(Boolean);
}

// Kept for backward compatibility
export function normalizeToArray(value: any): string[] {
  return normalizeTags(value);
}

export function getAllCategories(posts: CollectionEntry<'posts'>[]): Map<string, CollectionEntry<'posts'>[]> {
  const categories = new Map<string, CollectionEntry<'posts'>[]>();
  for (const post of posts) {
    const cats = normalizeCategories(post.data.categories);
    for (const cat of cats) {
      if (!categories.has(cat)) {
        categories.set(cat, []);
      }
      categories.get(cat)!.push(post);
    }
  }
  return categories;
}

export function getAllTags(posts: CollectionEntry<'posts'>[]): Map<string, CollectionEntry<'posts'>[]> {
  const tags = new Map<string, CollectionEntry<'posts'>[]>();
  for (const post of posts) {
    const tagList = normalizeTags(post.data.tags);
    for (const tag of tagList) {
      if (!tags.has(tag)) {
        tags.set(tag, []);
      }
      tags.get(tag)!.push(post);
    }
  }
  return tags;
}

export function formatDate(
  date: Date | string | undefined,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', options);
}

function cleanMarkdownForComparison(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')       // 代码块
    .replace(/`[^`]*`/g, ' ')               // 行内代码
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, ' ') // 图片
    .replace(/\[([^\]]*)\]\([^)]+\)/g, '$1') // 链接
    .replace(/[#*~>_|=-]/g, ' ')            // Markdown 语法字符
    .replace(/<\/?[^>]+(>|$)/g, ' ')        // HTML 标签
    .replace(/https?:\/\/\S+/g, ' ')        // URL
    .replace(/[^一-鿿]/g, ' ')      // 只保留中文汉字
    .replace(/\s+/g, ' ')                   // 合并空白
    .trim();
}

function extractBigrams(text: string): Set<string> {
  const bigrams = new Set<string>();
  for (let i = 0; i < text.length - 1; i++) {
    bigrams.add(text.slice(i, i + 2));
  }
  return bigrams;
}

let relatedPostsCache: Record<string, string[]> | null = null;
let relatedPostsCacheLoaded = false;

function loadRelatedPostsCache(): Record<string, string[]> | null {
  if (relatedPostsCacheLoaded) return relatedPostsCache;
  relatedPostsCacheLoaded = true;
  try {
    const filePath = `${process.cwd()}/public/related-posts.json`;
    if (fs.existsSync(filePath)) {
      relatedPostsCache = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch {
    // related-posts.json not available, will fall back to bigram
  }
  return relatedPostsCache;
}

export function getRelatedPosts(
  currentPost: CollectionEntry<'posts'>,
  allPosts: CollectionEntry<'posts'>[],
  options?: { maxCount?: number }
): CollectionEntry<'posts'>[] {
  const { maxCount = 4 } = options ?? {};

  // Try embedding-based approach first
  const cache = loadRelatedPostsCache();
  if (cache && cache[currentPost.id]) {
    const relatedSlugs = cache[currentPost.id].slice(0, maxCount);
    const result: CollectionEntry<'posts'>[] = [];
    for (const slug of relatedSlugs) {
      const post = allPosts.find((p) => p.id === slug);
      if (post) result.push(post);
    }
    if (result.length > 0) return result;
  }

  // Fallback to bigram Jaccard similarity
  const currentBody = currentPost.body ?? '';
  const currentText = cleanMarkdownForComparison(currentBody);
  const currentBigrams = extractBigrams(currentText);

  if (currentBigrams.size < 5) return [];

  const scored = allPosts
    .filter((p) => p.id !== currentPost.id)
    .map((p) => {
      const text = cleanMarkdownForComparison(p.body ?? '');
      const bigrams = extractBigrams(text);
      if (bigrams.size === 0) return { post: p, score: 0 };

      let intersection = 0;
      for (const bg of bigrams) {
        if (currentBigrams.has(bg)) intersection++;
      }
      const union = currentBigrams.size + bigrams.size - intersection;
      return { post: p, score: intersection / union };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount);

  return scored.map(({ post }) => post);
}
