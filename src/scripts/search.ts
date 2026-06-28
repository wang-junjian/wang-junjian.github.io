import Fuse from 'fuse.js';

type SearchItem = {
  id: string;
  title: string;
  date: string;
  formattedDate: string;
  excerpt: string;
  tags: string[];
  type: string;
  body: string;
  url: string;
};

let fuse: Fuse<SearchItem> | null = null;
let searchIndex: SearchItem[] = [];
let indexLoading = false;
let indexLoaded = false;

let searchInput: HTMLInputElement | null;
let postsContainer: HTMLDivElement | null;
let noResults: HTMLDivElement | null;
let postCount: HTMLSpanElement | null;
let streamFooter: HTMLElement | null;
let paginationNav: HTMLElement | null;
let originalPostsHtml = '';
const originalPostsHtmlMap = new Map<string, string>();
let allPostsCount = 0;
let typeFilter: string | null = null;
let typeTotalCount = 0;
let yearFilter: number | null = null;
let monthFilter: number | null = null;

const SEARCH_PAGE_SIZE = 20;
let currentSearchPage = 1;
let lastSearchResults: SearchItem[] = [];

async function loadSearchIndex(): Promise<SearchItem[]> {
  if (indexLoaded) return searchIndex;
  if (indexLoading) {
    // Wait for existing load
    return new Promise((resolve) => {
      const check = () => {
        if (indexLoaded) {
          resolve(searchIndex);
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }

  indexLoading = true;
  try {
    const response = await fetch('/search-index.json');
    if (!response.ok) throw new Error('Failed to load search index');
    searchIndex = await response.json();

    fuse = new Fuse(searchIndex, {
      keys: [
        { name: 'title', weight: 0.35 },
        { name: 'excerpt', weight: 0.2 },
        { name: 'tags', weight: 0.1 },
        { name: 'body', weight: 0.35 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      includeScore: false,
      minMatchCharLength: 1,
      useExtendedSearch: true,
    });

    allPostsCount = searchIndex.length;
    indexLoaded = true;
  } catch (err) {
    console.error('Search index load failed:', err);
    searchIndex = [];
  } finally {
    indexLoading = false;
  }

  return searchIndex;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatSearchDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function generateSearchExcerpt(item: SearchItem, maxChars = 120): string {
  const source = (item.excerpt || item.body || '').replace(/\s+/g, ' ').trim();
  return source.length > maxChars ? source.slice(0, maxChars).trim() + '…' : source;
}

function renderSearchResultItem(item: SearchItem, index: number): string {
  const href = `/posts/${encodeURIComponent(item.id)}/`;
  const title = escapeHtml(item.title || item.id);
  const date = formatSearchDate(item.date);
  const excerpt = escapeHtml(generateSearchExcerpt(item));
  const tags = item.tags || [];

  const tagLinks = tags
    .map(
      (tag) =>
        `<a href="/tags/${encodeURIComponent(tag)}/" class="entry-tag">${escapeHtml(tag)}</a>`
    )
    .join('');

  return `
    <article
      class="post-item entry-card"
      style="animation-delay: ${((index % 6) * 0.1).toFixed(1)}s;"
      data-title="${title.toLowerCase()}"
      data-excerpt="${excerpt.toLowerCase()}"
      data-id="${escapeHtml(item.id)}"
    >
      <h3 class="entry-title">
        <a href="${href}">${title}</a>
      </h3>
      ${excerpt ? `<div class="entry-excerpt"><p>${excerpt}</p></div>` : ''}
      <div class="entry-meta">
        ${date ? `<time datetime="${escapeHtml(item.date)}">${date}</time>` : ''}
        ${date && tagLinks ? '<span class="meta-separator" aria-hidden="true">·</span>' : ''}
        ${tagLinks ? `<div class="entry-tags">${tagLinks}</div>` : ''}
      </div>
    </article>
  `;
}

function renderSearchResults(results: SearchItem[]): string {
  if (results.length === 0) return '';
  return results.map((item, i) => renderSearchResultItem(item, i)).join('\n');
}

function renderSearchPagination(currentPage: number, totalPages: number): string {
  if (totalPages <= 1) return '';

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return `
    <nav class="search-pagination py-10 flex items-center justify-center gap-6 text-sm" aria-label="搜索结果分页">
      <button
        type="button"
        class="search-page-prev ${prevDisabled ? 'text-[var(--border)] cursor-not-allowed' : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'} transition-colors"
        data-search-page="${currentPage - 1}"
        ${prevDisabled ? 'disabled' : ''}
      >
        ← 上一页
      </button>

      <span class="text-[var(--text-secondary)] tabular-nums font-sans">
        第 ${currentPage} / ${totalPages} 页
      </span>

      <button
        type="button"
        class="search-page-next ${nextDisabled ? 'text-[var(--border)] cursor-not-allowed' : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'} transition-colors"
        data-search-page="${currentPage + 1}"
        ${nextDisabled ? 'disabled' : ''}
      >
        下一页 →
      </button>
    </nav>
  `;
}

function renderCurrentSearchPage(results: SearchItem[], page: number): string {
  const totalPages = Math.max(1, Math.ceil(results.length / SEARCH_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * SEARCH_PAGE_SIZE;
  const end = start + SEARCH_PAGE_SIZE;
  const pageResults = results.slice(start, end);

  return renderSearchResults(pageResults) + renderSearchPagination(safePage, totalPages);
}

// Initialize elements and event listeners
export async function initSearch() {
  searchInput = document.getElementById('searchInput') as HTMLInputElement;
  postsContainer = document.getElementById('postsContainer') as HTMLDivElement;
  noResults = document.getElementById('noResults') as HTMLDivElement;
  postCount = document.getElementById('postCount') as HTMLSpanElement;
  streamFooter = document.querySelector<HTMLElement>('.stream-footer');
  paginationNav = document.querySelector<HTMLElement>('.pagination-nav');

  // Only initialize if we're on the index page
  if (!searchInput || !postsContainer) return;

  // Backup the original stream HTML so we can restore it when the search is cleared.
  // We keep a per-type backup so Turbo navigation between pages doesn't keep stale HTML.
  const typeFilterAttr = postsContainer.dataset.typeFilter;
  typeFilter = typeFilterAttr || null;
  const yearFilterAttr = postsContainer.dataset.yearFilter;
  yearFilter = yearFilterAttr ? parseInt(yearFilterAttr, 10) : null;
  const monthFilterAttr = postsContainer.dataset.monthFilter;
  monthFilter = monthFilterAttr ? parseInt(monthFilterAttr, 10) : null;
  const backupKey = `${typeFilter || 'all'}-${yearFilter || ''}-${monthFilter || ''}`;

  if (!searchInput.value.trim()) {
    originalPostsHtmlMap.set(backupKey, postsContainer.innerHTML);
    originalPostsHtml = postsContainer.innerHTML;
  } else if (!originalPostsHtmlMap.has(backupKey)) {
    originalPostsHtmlMap.set(backupKey, postsContainer.innerHTML);
  }

  const typeTotalAttr = postsContainer.dataset.typeTotal;
  typeTotalCount = typeTotalAttr ? parseInt(typeTotalAttr, 10) : allPostsCount;

  // Focus search input if URL hash is #searchInput
  if (window.location.hash === '#searchInput') {
    searchInput.focus();
  }

  // Global / shortcut to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      searchInput?.focus();
    }
  });

  // Search functionality
  searchInput.removeEventListener('input', debouncedSearch);
  searchInput.addEventListener('input', debouncedSearch);

  // Enter key in search input
  searchInput.removeEventListener('keydown', handleSearchKeydown);
  searchInput.addEventListener('keydown', handleSearchKeydown);

  // Pagination clicks inside search results (event delegation)
  postsContainer.removeEventListener('click', handleSearchPaginationClick);
  postsContainer.addEventListener('click', handleSearchPaginationClick);
}

function handleSearchPaginationClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const button = target.closest('[data-search-page]') as HTMLButtonElement | null;
  if (!button || button.disabled) return;

  const pageAttr = button.dataset.searchPage;
  if (!pageAttr) return;

  const newPage = parseInt(pageAttr, 10);
  if (isNaN(newPage) || newPage < 1) return;

  e.preventDefault();
  currentSearchPage = newPage;
  if (postsContainer) {
    postsContainer.innerHTML = renderCurrentSearchPage(lastSearchResults, currentSearchPage);
    postsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function handleSearchKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSearch();
  }
}

async function handleSearch() {
  if (!searchInput || !postsContainer || !noResults) return;

  const query = searchInput.value.trim();

  if (query === '') {
    const backupKey = `${typeFilter || 'all'}-${yearFilter || ''}-${monthFilter || ''}`;
    const backupHtml = originalPostsHtmlMap.get(backupKey) || originalPostsHtml;
    // Restore the original day-group stream
    postsContainer.innerHTML = backupHtml;
    streamFooter?.classList.remove('hidden');
    postsContainer.classList.remove('hidden');
    noResults.classList.add('hidden');
    paginationNav?.classList.remove('hidden');
    if (postCount) postCount.textContent = `${typeTotalCount || allPostsCount} 篇`;
    return;
  }

  if (!indexLoaded && !indexLoading) {
    postsContainer.innerHTML = `
      <p class="text-center py-8 text-[var(--text-secondary)]">
        正在加载搜索索引，请稍候…
      </p>
    `;
    postsContainer.classList.remove('hidden');
    noResults.classList.add('hidden');
    streamFooter?.classList.add('hidden');
    paginationNav?.classList.add('hidden');
  }

  const index = await loadSearchIndex();

  let results: SearchItem[] = [];

  if (fuse && index.length > 0) {
    results = fuse.search(query).map((r) => r.item);
  } else {
    // Fallback to simple substring search if index failed to load
    const lowerQuery = query.toLowerCase();
    results = index.filter((item) => {
      const title = item.title?.toLowerCase() || '';
      const excerpt = item.excerpt?.toLowerCase() || '';
      const body = item.body?.toLowerCase() || '';
      return title.includes(lowerQuery) || excerpt.includes(lowerQuery) || body.includes(lowerQuery);
    });
  }

  // Apply type filter when on a type-specific page
  if (typeFilter && results.length > 0) {
    results = results.filter((item) => item.type === typeFilter);
  }

  // Apply year/month filter when on a year/month archive page
  if (yearFilter !== null && results.length > 0) {
    results = results.filter((item) => {
      if (!item.date) return false;
      const date = new Date(item.date);
      const matchesYear = date.getFullYear() === yearFilter;
      const matchesMonth = monthFilter === null || date.getMonth() + 1 === monthFilter;
      return matchesYear && matchesMonth;
    });
  }

  streamFooter?.classList.add('hidden');
  paginationNav?.classList.add('hidden');

  if (postCount) postCount.textContent = `${results.length} / ${typeTotalCount || allPostsCount} 篇`;

  if (results.length === 0) {
    postsContainer.innerHTML = '';
    postsContainer.classList.add('hidden');
    noResults.classList.remove('hidden');
  } else {
    currentSearchPage = 1;
    lastSearchResults = results;
    postsContainer.innerHTML = renderCurrentSearchPage(results, currentSearchPage);
    postsContainer.classList.remove('hidden');
    noResults.classList.add('hidden');
  }
}

let searchTimeout: number | null = null;

function debouncedSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = window.setTimeout(() => {
    handleSearch();
  }, 150);
}

export { debouncedSearch as handleSearchInput };
