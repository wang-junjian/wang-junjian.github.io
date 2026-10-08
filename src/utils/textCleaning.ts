/**
 * 剥离 Markdown 语法，保留可读文本。六条替换的顺序固定且有依赖：
 * 代码块先于行内代码（防 ``` 被行内规则切碎），HTML 标签先于任何会
 * 吃掉 `>` 的字符替换（否则未闭合标签匹配不到）。
 */
export function stripMarkdownSyntax(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, ' ')       // 代码块
    .replace(/`[^`]*`/g, ' ')               // 行内代码
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')   // 图片
    .replace(/\[([^\]]*)\]\([^)]+\)/g, '$1') // 链接保留文字（捕获组必需：无捕获组时 $1 是字面文本）
    .replace(/<\/?[^>]+(>|$)/g, ' ')        // HTML 标签
    .replace(/https?:\/\/\S+/g, ' ');       // URL
}

/** 清理 Markdown 正文，用于生成搜索索引。 */
export function cleanBodyForSearch(body: string): string {
  return stripMarkdownSyntax(
    body.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/m, '') // frontmatter
  )
    .replace(/[#*~>_|=\-]/g, ' ')           // Markdown 语法字符
    .replace(/\s+/g, ' ')                   // 合并空白
    .trim();
}

export function calculateReadingTime(body: string | undefined): number {
  if (!body) return 0;
  const text = stripMarkdownSyntax(body);

  // Count Chinese characters
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  // Count English words
  const englishWords = (text.replace(/[一-鿿]/g, ' ').match(/\b[a-zA-Z0-9_]+\b/g) || []).length;

  // ~300 Chinese chars/min or ~200 English words/min; blend them
  const minutes = chineseChars / 300 + englishWords / 200;
  return Math.max(1, Math.round(minutes));
}
