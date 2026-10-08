import { marked } from 'marked';
import katex from 'katex';

/** 匹配行内数学公式 `$...$` 和块级数学公式 `$$...$$`。 */
export const MATH_REGEX = /(?<!\$)\$[^$\n]+?\$(?!\$)|\$\$[\s\S]+?\$\$/;

/** 判断一组文章中是否有任何一篇包含数学公式，用于决定是否加载 KaTeX CSS。 */
export function needsKatex(posts: Array<{ body?: string }>): boolean {
  return posts.some((post) => MATH_REGEX.test(post.body || ''));
}

function sanitizePreviewHtml(html: string): string {
  // Convert headings to styled preview paragraphs while keeping their text content
  return html
    .replace(/<\/(h[1-6])>/gi, '</p>')
    .replace(/<h[1-6](\s[^>]*)?>/gi, '<p class="preview-heading">')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function protectCodeBlocks(md: string): { text: string; placeholders: string[] } {
  const placeholders: string[] = [];
  const text = md.replace(/(```[\s\S]*?```|`[^`]+`)/g, (match) => {
    placeholders.push(match);
    return `\x00CODE${placeholders.length - 1}\x00`;
  });
  return { text, placeholders };
}

function restoreCodeBlocks(text: string, placeholders: string[]): string {
  return text.replace(/\x00CODE(\d+)\x00/g, (_, i) => placeholders[parseInt(i, 10)]);
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

function renderPreview(body: string | undefined, maxChars = 600): string {
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
    const isMermaidBlock = isCodeBlock && /^```mermaid\b/.test(realBlock);
    const isImageBlock = /^!\[/.test(realBlock);
    const isTableBlock = /^\|.*\|/m.test(realBlock) && /^\|?[\s\-:|]+\|?\s*$/m.test(realBlock);

    // Include Mermaid diagrams in excerpts but do not truncate them and do not
    // count their characters against the preview budget. Truncated diagrams
    // cause "Syntax error in text" when Mermaid tries to render them.
    let processedBlock = realBlock;
    if (isCodeBlock && !isMermaidBlock) {
      processedBlock = truncateCodeBlock(realBlock, 15);
    }

    const html = renderMarkdownBlock(processedBlock);
    const text = stripHtmlTags(html);
    // Mermaid blocks are included but do not consume the excerpt budget.
    const blockLength = isMermaidBlock ? 0 : text.length;

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
