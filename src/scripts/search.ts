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
let randomPostBtn: HTMLButtonElement | null;
let randomPostCard: HTMLElement | null;
let randomPostLink: HTMLAnchorElement | null;
let randomPostTitle: HTMLHeadingElement | null;
let randomPostExcerpt: HTMLSpanElement | null;
let randomPostDate: HTMLTimeElement | null;
let totalPosts: number;
let currentRandomIndex = -1;
let postsData: Array<{ id: string; title: string; date: string; excerpt: string }> = [];

// Get posts data from data attribute
function getPostsData(): Array<{ id: string; title: string; date: string; excerpt: string }> {
  const section = document.getElementById('randomPostSection');
  if (section) {
    const data = section.getAttribute('data-posts');
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
  }
  return [];
}

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
  postsData = getPostsData();

  searchInput = document.getElementById('searchInput') as HTMLInputElement;
  postsContainer = document.getElementById('postsContainer') as HTMLDivElement;
  noResults = document.getElementById('noResults') as HTMLDivElement;
  postItems = document.querySelectorAll<HTMLElement>('.post-item');
  postCount = document.getElementById('postCount') as HTMLSpanElement;
  randomPostBtn = document.getElementById('randomPostBtn') as HTMLButtonElement;
  randomPostCard = document.getElementById('randomPostCard') as HTMLElement;
  randomPostLink = document.getElementById('randomPostLink') as HTMLAnchorElement;
  randomPostTitle = document.getElementById('randomPostTitle') as HTMLHeadingElement;
  randomPostExcerpt = document.getElementById('randomPostExcerpt') as HTMLSpanElement;
  randomPostDate = document.getElementById('randomPostDate') as HTMLTimeElement;
  totalPosts = postItems ? postItems.length : 0;

  // Only initialize if we're on the index page
  if (!randomPostBtn) return;

  // Preload search index in background
  loadSearchIndex();

  // Focus search input if URL hash is #searchInput
  if (searchInput && window.location.hash === '#searchInput') {
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
  if (searchInput) {
    searchInput.removeEventListener('input', debouncedSearch);
    searchInput.addEventListener('input', debouncedSearch);
  }

  // Random post functionality
  if (randomPostBtn) {
    randomPostBtn.removeEventListener('click', handleRandomPost);
    randomPostBtn.addEventListener('click', handleRandomPost);

    if (randomPostTitle && postsData.length > 0) {
      const initialTitle = randomPostTitle.textContent;
      currentRandomIndex = postsData.findIndex(p => p.title === initialTitle);
      if (currentRandomIndex === -1) currentRandomIndex = getRandomIndex();
    }
  }
}

async function handleSearch() {
  if (!searchInput || !postItems || !postCount || !postsContainer || !noResults) return;

  const query = searchInput.value.trim();

  if (query === '') {
    postItems.forEach((item) => {
      item.style.display = 'flex';
    });
    postsContainer.classList.remove('hidden');
    noResults.classList.add('hidden');
    postCount.textContent = `${totalPosts} 篇`;
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
    item.style.display = matches ? 'flex' : 'none';
    if (matches) visibleCount++;
  });

  postCount.textContent = `${visibleCount} / ${totalPosts} 篇`;

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

// Get a random index different from current
function getRandomIndex(): number {
  if (!postsData || postsData.length === 0) return 0;

  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * postsData.length);
  } while (newIndex === currentRandomIndex && postsData.length > 1);
  return newIndex;
}

// Update random post display with animation
function updateRandomPost() {
  if (!postsData || postsData.length === 0 || !randomPostCard || !randomPostLink || !randomPostTitle || !randomPostDate) return;

  randomPostCard.style.opacity = '0';
  randomPostCard.style.transform = 'translateY(-5px)';

  setTimeout(() => {
    currentRandomIndex = getRandomIndex();
    const randomPost = postsData[currentRandomIndex];

    randomPostLink.href = `/posts/${randomPost.id}`;
    randomPostTitle.textContent = randomPost.title;
    randomPostDate.textContent = randomPost.date;

    if (randomPostExcerpt) {
      if (randomPost.excerpt) {
        randomPostExcerpt.textContent = randomPost.excerpt;
        randomPostExcerpt.style.display = 'inline';
      } else {
        randomPostExcerpt.style.display = 'none';
      }
    }

    randomPostCard.style.opacity = '1';
    randomPostCard.style.transform = 'translateY(0)';
  }, 200);
}

function handleRandomPost() {
  if (!randomPostBtn) return;

  randomPostBtn.classList.add('random-spin');
  updateRandomPost();

  setTimeout(() => {
    if (randomPostBtn) {
      randomPostBtn.classList.remove('random-spin');
    }
  }, 500);
}

// Add enhanced animations via style injection
function injectStyles() {
  if (typeof document === 'undefined') return;

  const existingStyle = document.getElementById('search-styles');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'search-styles';
  style.textContent = `
    @keyframes randomSpin {
      0% {
        transform: rotate(0deg) scale(1);
      }
      50% {
        transform: rotate(180deg) scale(1.3);
      }
      100% {
        transform: rotate(360deg) scale(1);
      }
    }

    .random-spin span:first-child {
      animation: randomSpin 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    #randomPostCard {
      transition: opacity 0.25s ease-out, transform 0.25s ease-out;
    }
  `;
  document.head.appendChild(style);
}

injectStyles();
init();

document.addEventListener('turbo:load', init);
document.addEventListener('turbo:render', init);
