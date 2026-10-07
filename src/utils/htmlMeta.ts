/** 解析 HTML 文档 <head> 中 <meta name="..."> 的 content 值（两种属性顺序均支持）。 */
export function metaContent(raw: string, name: string): string | undefined {
  const direct =
    raw.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i')) ||
    raw.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["'][^>]*>`, 'i'));
  return direct ? direct[1].trim() : undefined;
}

/** 提取 HTML 文档的 <title> 文本。 */
export function titleContent(raw: string): string | undefined {
  const match = raw.match(/<title[^>]*>\s*([\s\S]*?)\s*<\/title>/i);
  return match ? match[1].trim() : undefined;
}
