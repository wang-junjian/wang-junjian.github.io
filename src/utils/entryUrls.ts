/**
 * 条目 URL 的唯一事实源。全站任何「文章链接」都必须从这里派生，
 * 不得在各处手写模板字符串。URL 为扁平结构（年份目录会被剥掉）：
 * - Markdown 文章页：/posts/<id>/
 * - HTML 文章独立页：/posts/<id>.html
 * - Markdown 源文件：/posts/<id>.md
 */

/** Markdown 文章页 URL（/posts/<id>/）。 */
export function getPostUrl(id: string): string {
  return `/posts/${id}/`;
}

/** HTML 文章独立页 URL（/posts/<id>.html）。 */
export function getHtmlPostUrl(id: string): string {
  return `/posts/${id}.html`;
}

/** Markdown 源文件 URL（/posts/<id>.md）。 */
export function getPostSourceUrl(id: string): string {
  return `/posts/${id}.md`;
}

/**
 * URL 是否指向 HTML 独立页。
 * 此类页面是全量文档而非 Astro 页面，链接必须绕过 Turbo 局部导航。
 */
export function isHtmlUrl(url: string): boolean {
  return url.endsWith('.html');
}
