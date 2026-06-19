import Fuse from 'fuse.js';

type SearchItem = {
  id: string;
  title: string;
  date: string;
  formattedDate: string;
  excerpt: string;
  categories: string[];
  tags: string[];
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
let originalPostsHtml = '';
let allPostsCount = 0;

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
        { name: 'categories', weight: 0.1 },
        { name: 'tags', weight: 0.1 },
        { name: 'body', weight: 0.25 },
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

function generateSearchExcerpt(item: SearchItem, maxChars = 320): string {
  if (item.excerpt) return item.excerpt;
  if (!item.body) return '';
  const text = item.body.replace(/\s+/g, ' ').trim();
  return text.length > maxChars ? text.slice(0, maxChars).trim() + '…' : text;
}

function renderSearchResultItem(item: SearchItem, index: number): string {
  const href = `/posts/${encodeURIComponent(item.id)}`;
  const title = escapeHtml(item.title || item.id);
  const date = formatSearchDate(item.date);
  const excerpt = escapeHtml(generateSearchExcerpt(item, 320));
  const tags = item.tags || [];

  const tagLinks = tags
    .map(
      (tag) =>
        `<a href="/tags#tag-${encodeURIComponent(tag)}" class="entry-tag">${escapeHtml(tag)}</a>`
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
      </div>
      ${tagLinks ? `<div class="entry-tags">${tagLinks}</div>` : ''}
    </article>
  `;
}

function renderSearchResults(results: SearchItem[]): string {
  if (results.length === 0) return '';
  return results.map((item, i) => renderSearchResultItem(item, i)).join('\n');
}

// Initialize elements and event listeners
async function init() {
  searchInput = document.getElementById('searchInput') as HTMLInputElement;
  postsContainer = document.getElementById('postsContainer') as HTMLDivElement;
  noResults = document.getElementById('noResults') as HTMLDivElement;
  postCount = document.getElementById('postCount') as HTMLSpanElement;
  streamFooter = document.querySelector<HTMLElement>('.stream-footer');

  // Only initialize if we're on the index page
  if (!searchInput || !postsContainer) return;

  // Backup the original stream HTML so we can restore it when the search is cleared
  if (!originalPostsHtml) {
    originalPostsHtml = postsContainer.innerHTML;
  }

  // Preload search index in background
  loadSearchIndex();

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
    // Restore the original day-group stream
    postsContainer.innerHTML = originalPostsHtml;
    streamFooter?.classList.remove('hidden');
    postsContainer.classList.remove('hidden');
    noResults.classList.add('hidden');
    if (postCount) postCount.textContent = `${allPostsCount} 篇`;
    return;
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

  streamFooter?.classList.add('hidden');

  if (postCount) postCount.textContent = `${results.length} / ${allPostsCount} 篇`;

  if (results.length === 0) {
    postsContainer.innerHTML = '';
    postsContainer.classList.add('hidden');
    noResults.classList.remove('hidden');
  } else {
    postsContainer.innerHTML = renderSearchResults(results);
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

init();

document.addEventListener('turbo:load', init);
document.addEventListener('turbo:render', init);
