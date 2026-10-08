import { getHtmlPosts, toStreamEntry, type StreamEntry } from './htmlPosts';

/**
 * 条目源模块：Markdown 与 HTML 文章合并后的全量列表。
 *
 * 契约：返回值按日期降序，调用方可直接过滤/切片（保序），无需再排序。
 *
 * 与 htmlPosts.ts 分层：htmlPosts.ts 是纯 FS 扫描（Astro 配置上下文安全，
 * 供 astro.config.mjs 使用）；本模块依赖 astro:content，仅供页面与端点。
 * 生产构建下模块级缓存（构建期每个页面的 getStaticPaths + frontmatter
 * 只全量扫描一次）；dev 模式每次重扫，posts/ 改动即时可见。
 */
let cache: StreamEntry[] | null = null;

export async function getMergedPosts(): Promise<StreamEntry[]> {
  if (cache) return cache;
  const { getCollection } = await import('astro:content');
  const mdPosts = await getCollection('posts');
  const htmlEntries = getHtmlPosts().map(toStreamEntry);
  const merged: StreamEntry[] = [...mdPosts, ...htmlEntries].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
  if (import.meta.env.PROD) cache = merged;
  return merged;
}
