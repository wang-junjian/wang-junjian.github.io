import type { CollectionEntry } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { marked } from 'marked';
import katex from 'katex';

export function normalizeTags(value: unknown): string[] {
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
export function normalizeToArray(value: unknown): string[] {
  return normalizeTags(value);
}

/** 匹配行内数学公式 `$...$` 和块级数学公式 `$$...$$`。 */
export const MATH_REGEX = /(?<!\$)\$[^$\n]+?\$(?!\$)|\$\$[\s\S]+?\$\$/;

interface WithDate {
  data: { date?: Date | string };
}

export function sortPostsByDate<T extends WithDate>(posts: T[], direction: 'asc' | 'desc' = 'desc'): T[] {
  return [...posts].sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    const delta = dateB - dateA;
    return direction === 'asc' ? -delta : delta;
  });
}

/** 判断一组文章中是否有任何一篇包含数学公式，用于决定是否加载 KaTeX CSS。 */
export function needsKatex(posts: Array<{ body?: string }>): boolean {
  return posts.some((post) => MATH_REGEX.test(post.body || ''));
}

const imageDimensionCache = new Map<string, { width?: number; height?: number }>();

/** 读取图片尺寸并缓存，避免构建时重复 I/O。 */
export async function getImageDimensions(imagePath: string): Promise<{ width?: number; height?: number }> {
  if (imageDimensionCache.has(imagePath)) {
    return imageDimensionCache.get(imagePath)!;
  }

  try {
    const metadata = await sharp(imagePath).metadata();
    const result = { width: metadata.width, height: metadata.height };
    imageDimensionCache.set(imagePath, result);
    return result;
  } catch {
    return {};
  }
}

/** 根据 public 路径或绝对路径获取图片尺寸。 */
export async function getImageDimensionsFromSrc(src: string): Promise<{ width?: number; height?: number }> {
  if (!src.startsWith('/')) return {};
  const imagePath = path.join(process.cwd(), 'public', src);
  return getImageDimensions(imagePath);
}

/** 清理 Markdown 正文，用于生成搜索索引。 */
export function cleanBodyForSearch(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, ' ')       // 代码块
    .replace(/`[^`]*`/g, ' ')               // 行内代码
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ') // 图片
    .replace(/\[[^\]]*\]\([^)]+\)/g, '$1') // 链接保留文字
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/m, '') // frontmatter
    .replace(/<\/?[^>]+(>|$)/g, ' ')        // HTML 标签
    .replace(/https?:\/\/\S+/g, ' ')        // URL
    .replace(/[#*~>_|=\-]/g, ' ')           // Markdown 语法字符
    .replace(/\s+/g, ' ')                   // 合并空白
    .trim();
}

export function getPostDisplayTitle(post: CollectionEntry<'posts'>): string {
  const { type, title, author, linkUrl } = post.data;
  if (title) return title;
  if (type === 'quote' && author) return `来自 ${author} 的引用`;
  if (type === 'note') {
    const body = post.body || '';
    const html = marked.parse(body, { async: false, gfm: true }) as string;
    const text = stripHtmlTags(html).replace(/\s+/g, ' ').trim();
    if (text) {
      return text.length > 30 ? text.slice(0, 30) + '…' : text;
    }
    return '笔记';
  }
  if (type === 'link' || type === 'release') {
    if (linkUrl) {
      try {
        const url = new URL(linkUrl);
        return url.hostname.replace(/^www\./, '');
      } catch {
        return linkUrl;
      }
    }
    return type === 'release' ? '发布' : '链接';
  }
  return post.id;
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

export function formatTime(date: Date | string | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatDateTimeChinese(date: Date | string | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}时${minutes}分`;
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
  // Convert headings to styled preview paragraphs while keeping their text content
  return html
    .replace(/<\/(h[1-6])>/gi, '</p>')
    .replace(/<h[1-6](\s[^>]*)?>/gi, '<p class="preview-heading">')
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

    // Skip horizontal rules in preview
    if (/^-{3,}$|^\*{3,}$/.test(realBlock)) {
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
          // Lists have already been rendered to proper HTML; truncating their
          // plain-text content and re-parsing it would lose the list markup.
          const trimmedHtml = html.trim();
          const isListBlock = trimmedHtml.startsWith('<ul>') || trimmedHtml.startsWith('<ol>');
          if (isListBlock) {
            previewBlocks.push(html);
          } else {
            const truncatedText = truncateAtSentenceBoundary(text, remaining);
            if (truncatedText.length > 0) {
              const truncatedHtml = marked.parse(truncatedText, { async: false, gfm: true }) as string;
              previewBlocks.push(sanitizePreviewHtml(truncatedHtml));
            }
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

export function renderCardExcerpt(
  body: string | undefined,
  maxChars = 600
): string {
  return renderPreview(body, maxChars);
}

export function generateExcerpt(body: string | undefined, maxChars = 320): string {
  const preview = renderPreview(body, maxChars);
  if (!preview) return '';
  const text = stripHtmlTags(preview);
  return text.length > maxChars ? text.slice(0, maxChars).trim() + '…' : text;
}
