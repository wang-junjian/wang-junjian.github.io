export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const PAGE_SIZE = 20;

export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

/** 解析 rest 参数中的页码（`page/2` → 2），非法或缺失时回退第 1 页。 */
export function parsePageParam(path: string | undefined): number {
  if (!path) return 1;
  const match = path.match(/^page\/(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * 生成分页 rest 参数序列：[undefined, 'page/2', ..., 'page/N']。
 * 调用方映射为自己路由的参数名，如 `paths.map((path) => ({ params: { path } }))`。
 */
export function getPagePaths(totalPages: number): Array<string | undefined> {
  const paths: Array<string | undefined> = [undefined];
  for (let p = 2; p <= totalPages; p++) {
    paths.push(`page/${p}`);
  }
  return paths;
}
