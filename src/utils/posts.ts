import type { CollectionEntry } from 'astro:content';
import fs from 'node:fs';
import { marked } from 'marked';
import katex from 'katex';

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

export function calculateReadingTime(body: string | undefined): number {
  if (!body) return 0;
  // Remove code blocks and inline code
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]+\)/g, '$1')
    .replace(/<\/?[^>]+(>|$)/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ');

  // Count Chinese characters
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  // Count English words
  const englishWords = (text.replace(/[一-鿿]/g, ' ').match(/\b[a-zA-Z0-9_]+\b/g) || []).length;

  // ~300 Chinese chars/min or ~200 English words/min; blend them
  const minutes = chineseChars / 300 + englishWords / 200;
  return Math.max(1, Math.round(minutes));
}

export function getWordCount(body: string | undefined): number {
  if (!body) return 0;
  // Strip Markdown syntax for a rough word/character count
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]+\)/g, '$1')
    .replace(/<\/?[^>]+(>|$)/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#*~>|=_\-\[\]()`{}]/g, ' ');

  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const englishWords = (text.replace(/[一-鿿]/g, ' ').match(/\b[a-zA-Z0-9_]+\b/g) || []).length;
  return chineseChars + englishWords;
}

export function groupPostsByDay(posts: CollectionEntry<'posts'>[]): Map<string, CollectionEntry<'posts'>[]> {
  const groups = new Map<string, CollectionEntry<'posts'>[]>();
  for (const post of posts) {
    const date = post.data.date ? new Date(post.data.date) : new Date(0);
    // Use local date components so the grouping key matches the locale-formatted
    // date shown in EntryCard (avoiding UTC vs local timezone mismatch).
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(post);
  }
  return groups;
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

const PREVIEW_ALLOWED_TAGS = new Set([
  'p', 'br', 'a', 'strong', 'b', 'em', 'i', 'u', 'del', 's',
  'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
  'img', 'figure', 'figcaption', 'hr',
  'span', 'sub', 'sup',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
]);

function sanitizePreviewHtml(html: string): string {
  // Remove disallowed tags (like h1-h6) while keeping their text content
  return html
    .replace(/<\/(h[1-6])>/gi, '</p>')
    .replace(/<h[1-6](\s[^>]*)?>/gi, '<p>')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function protectCodeBlocks(md: string): { text: string; placeholders: string[] } {
  const placeholders: string[] = [];
  const text = md.replace(/(```[\s\S]*?```|`[^`]+`)/g, (match) => {
    placeholders.push(match);
    return ` CODE${placeholders.length - 1} `;
  });
  return { text, placeholders };
}

function restoreCodeBlocks(text: string, placeholders: string[]): string {
  return text.replace(/ CODE(\d+) /g, (_, i) => placeholders[parseInt(i, 10)]);
}

function renderInlineMath(md: string): string {
  const { text, placeholders } = protectCodeBlocks(md);
  const rendered = text.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `$${math}$`;
    }
  });
  return restoreCodeBlocks(rendered, placeholders);
}

function renderBlockMath(block: string): string | null {
  const trimmed = block.trim();
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
    const math = trimmed.slice(2, -2).trim();
    if (!math) return null;
    try {
      return katex.renderToString(math, { displayMode: true, throwOnError: false });
    } catch {
      return null;
    }
  }
  return null;
}

function renderMarkdownBlock(block: string): string {
  const blockMath = renderBlockMath(block);
  if (blockMath) return blockMath;

  // Code blocks must bypass renderInlineMath: replacing them with placeholders
  // before marked.parse would hide the ``` fence from the Markdown parser.
  if (block.trim().startsWith('```')) {
    const html = marked.parse(block, { async: false, gfm: true }) as string;
    return sanitizePreviewHtml(html);
  }

  const html = marked.parse(renderInlineMath(block), { async: false, gfm: true }) as string;
  return sanitizePreviewHtml(html);
}

function truncateCodeBlock(block: string, maxLines = 8): string {
  const lines = block.split('\n');
  // Remove opening ```lang and closing ```
  const codeLines = lines.slice(1, -1);
  if (codeLines.length <= maxLines) return block;
  const truncated = codeLines.slice(0, maxLines).join('\n');
  return `${lines[0]}\n${truncated}\n// ...\n${lines[lines.length - 1]}`;
}

function truncateAtSentenceBoundary(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const candidate = text.slice(0, maxLen);
  // Find the last sentence-ending punctuation (Chinese or Western)
  const match = candidate.match(/[。！？.!?]/g);
  if (!match) return candidate;
  const lastPunct = match[match.length - 1];
  const lastIndex = candidate.lastIndexOf(lastPunct);
  if (lastIndex <= 0) return candidate;
  return candidate.slice(0, lastIndex + 1).trim();
}

function protectCodeBlocksForSplit(md: string): { text: string; placeholders: string[] } {
  const placeholders: string[] = [];
  const text = md.replace(/```[\s\S]*?```/g, (match) => {
    placeholders.push(match);
    return `__PREVIEW_CODE_BLOCK_${placeholders.length - 1}__`;
  });
  return { text, placeholders };
}

function restoreCodeBlocksForSplit(text: string, placeholders: string[]): string {
  return text.replace(/__PREVIEW_CODE_BLOCK_(\d+)__/g, (_, i) => placeholders[parseInt(i, 10)]);
}

export function renderPreview(body: string | undefined, maxChars = 600): string {
  if (!body) return '';

  // Protect whole code blocks before splitting, so internal blank lines don't
  // break a single ```...``` fence into multiple fragments.
  const { text: splitProtectedBody, placeholders: codeBlockPlaceholders } = protectCodeBlocksForSplit(body);

  const blocks = splitProtectedBody
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const previewBlocks: string[] = [];
  let charCount = 0;
  let reachedLimit = false;

  for (const block of blocks) {
    if (reachedLimit) break;

    // Restore the real Markdown before any further processing.
    const realBlock = restoreCodeBlocksForSplit(block, codeBlockPlaceholders);

    // Skip headings and horizontal rules in preview
    if (/^#{1,6}\s/.test(realBlock) || /^-{3,}$|^\*{3,}$/.test(realBlock)) {
      continue;
    }

    const isCodeBlock = realBlock.startsWith('```');
    const isImageBlock = /^!\[/.test(realBlock);
    const isTableBlock = /^\|.*\|/m.test(realBlock) && /^\|?[\s\-:|]+\|?\s*$/m.test(realBlock);

    let processedBlock = realBlock;
    if (isCodeBlock) {
      processedBlock = truncateCodeBlock(realBlock, 15);
    }

    const html = renderMarkdownBlock(processedBlock);
    const text = stripHtmlTags(html);
    const blockLength = text.length;

    if (charCount + blockLength > maxChars && previewBlocks.length > 0) {
      // We've reached the limit. For plain text blocks, try to truncate gracefully.
      if (!isCodeBlock && !isImageBlock && !isTableBlock) {
        const remaining = Math.max(0, maxChars - charCount);
        if (remaining > 20) {
          const truncatedText = truncateAtSentenceBoundary(text, remaining);
          if (truncatedText.length > 0) {
            const truncatedHtml = marked.parse(truncatedText, { async: false, gfm: true }) as string;
            previewBlocks.push(sanitizePreviewHtml(truncatedHtml));
          }
        }
      }
      reachedLimit = true;
      break;
    }

    previewBlocks.push(html);
    charCount += blockLength;

    if (charCount >= maxChars) {
      reachedLimit = true;
    }
  }

  return previewBlocks.join('\n');
}

export function generateExcerpt(body: string | undefined, maxChars = 320): string {
  const preview = renderPreview(body, maxChars);
  if (!preview) return '';
  const text = stripHtmlTags(preview);
  return text.length > maxChars ? text.slice(0, maxChars).trim() + '…' : text;
}
