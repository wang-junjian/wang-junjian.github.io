type PostData = Array<{ id: string; title: string; date: string; excerpt: string }>;

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
let postsData: PostData = [];

// Get posts data from data attribute
function getPostsData(): PostData {
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

// Initialize elements and event listeners
function init() {
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

  // Search functionality
  if (searchInput) {
    // Remove existing listener if any
    searchInput.removeEventListener('input', handleSearch);
    searchInput.addEventListener('input', handleSearch);
  }

  // Random post functionality
  if (randomPostBtn) {
    randomPostBtn.removeEventListener('click', handleRandomPost);
    randomPostBtn.addEventListener('click', handleRandomPost);

    // Find initial random index
    if (randomPostTitle && postsData.length > 0) {
      const initialTitle = randomPostTitle.textContent;
      currentRandomIndex = postsData.findIndex(p => p.title === initialTitle);
      if (currentRandomIndex === -1) currentRandomIndex = getRandomIndex();
    }
  }
}

function handleSearch() {
  if (!searchInput || !postItems || !postCount || !postsContainer || !noResults) return;

  const query = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  postItems.forEach((item) => {
    const title = item.dataset.title || '';
    const excerpt = item.dataset.excerpt || '';
    const matches = query === '' || title.includes(query) || excerpt.includes(query);

    item.style.display = matches ? 'flex' : 'none';
    if (matches) visibleCount++;
  });

  postCount.textContent = query === ''
    ? `${totalPosts} 篇`
    : `${visibleCount} / ${totalPosts} 篇`;

  if (query !== '' && visibleCount === 0) {
    postsContainer.classList.add('hidden');
    noResults.classList.remove('hidden');
  } else {
    postsContainer.classList.remove('hidden');
    noResults.classList.add('hidden');
  }
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

  // Add exit animation
  randomPostCard.style.opacity = '0';
  randomPostCard.style.transform = 'translateY(-5px)';

  setTimeout(() => {
    // Get new random post
    currentRandomIndex = getRandomIndex();
    const randomPost = postsData[currentRandomIndex];

    // Update content
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

    // Add enter animation
    randomPostCard.style.opacity = '1';
    randomPostCard.style.transform = 'translateY(0)';
  }, 200);
}

function handleRandomPost() {
  if (!randomPostBtn) return;

  // Add spin animation
  randomPostBtn.classList.add('random-spin');

  // Update random post
  updateRandomPost();

  // Remove spin animation after it completes
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
  if (existingStyle) return; // Already injected

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

// Initialize on page load
injectStyles();
init();

// Re-initialize when Turbo loads a page
document.addEventListener('turbo:load', init);
document.addEventListener('turbo:render', init);
