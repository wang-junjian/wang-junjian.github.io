import type { CollectionEntry } from 'astro:content';
import fs from 'node:fs';
import { stripMarkdownSyntax } from './textCleaning';

function cleanMarkdownForComparison(content: string): string {
  return stripMarkdownSyntax(content)
    .replace(/[#*~>_|=-]/g, ' ')            // Markdown 语法字符
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
