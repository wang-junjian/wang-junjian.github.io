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
let postItems: NodeListOf<HTMLElement> | null;
let postCount: HTMLSpanElement | null;
let dayGroups: NodeListOf<HTMLElement> | null;
let streamFooter: HTMLElement | null;
let totalPosts: number;

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

    indexLoaded = true;
  } catch (err) {
    console.error('Search index load failed:', err);
    searchIndex = [];
  } finally {
    indexLoading = false;
  }

  return searchIndex;
}

function getPostIdFromItem(item: HTMLElement): string | null {
  const link = item.querySelector('a[href^="/posts/"]') as HTMLAnchorElement | null;
  if (!link) return null;
  const match = link.href.match(/\/posts\/([^/]+)$/);
  return match ? match[1] : null;
}

// Initialize elements and event listeners
async function init() {
  searchInput = document.getElementById('searchInput') as HTMLInputElement;
  postsContainer = document.getElementById('postsContainer') as HTMLDivElement;
  noResults = document.getElementById('noResults') as HTMLDivElement;
  postItems = document.querySelectorAll<HTMLElement>('.post-item');
  postCount = document.getElementById('postCount') as HTMLSpanElement;
  dayGroups = document.querySelectorAll<HTMLElement>('.day-group');
  streamFooter = document.querySelector<HTMLElement>('.stream-footer');
  totalPosts = postItems ? postItems.length : 0;

  // Only initialize if we're on the index page
  if (!searchInput) return;

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
  if (!searchInput || !postItems || !postsContainer || !noResults) return;

  const query = searchInput.value.trim();

  if (query === '') {
    postItems.forEach((item) => {
      item.style.display = '';
    });
    dayGroups?.forEach((group) => {
      group.style.display = '';
    });
    streamFooter?.classList.remove('hidden');
    postsContainer.classList.remove('hidden');
    noResults.classList.add('hidden');
    if (postCount) postCount.textContent = `${totalPosts} 篇`;
    return;
  }

  const index = await loadSearchIndex();

  let matchingIds: Set<string>;

  if (fuse && index.length > 0) {
    const results = fuse.search(query);
    matchingIds = new Set(results.map((r) => r.item.id));
  } else {
    // Fallback to simple substring search if index failed to load
    const lowerQuery = query.toLowerCase();
    matchingIds = new Set(
      Array.from(postItems)
        .map((item) => ({ item, id: getPostIdFromItem(item) }))
        .filter(({ item, id }) => {
          if (!id) return false;
          const title = item.dataset.title || '';
          const excerpt = item.dataset.excerpt || '';
          return title.includes(lowerQuery) || excerpt.includes(lowerQuery);
        })
        .map(({ id }) => id as string)
    );
  }

  let visibleCount = 0;
  postItems.forEach((item) => {
    const id = getPostIdFromItem(item);
    const matches = id ? matchingIds.has(id) : false;
    item.style.display = matches ? '' : 'none';
    if (matches) visibleCount++;
  });

  // Hide day groups that have no visible entries
  dayGroups?.forEach((group) => {
    const visibleItems = group.querySelectorAll('.post-item:not([style*="display: none"])');
    group.style.display = visibleItems.length > 0 ? '' : 'none';
  });

  streamFooter?.classList.add('hidden');

  if (postCount) postCount.textContent = `${visibleCount} / ${totalPosts} 篇`;

  if (visibleCount === 0) {
    postsContainer.classList.add('hidden');
    noResults.classList.remove('hidden');
  } else {
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
