// Posts data will be injected from the page
declare const postsData: Array<{ id: string; title: string }>;

const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const postsContainer = document.getElementById('postsContainer') as HTMLDivElement;
const noResults = document.getElementById('noResults') as HTMLDivElement;
const postItems = document.querySelectorAll<HTMLElement>('.post-item');
const postCount = document.getElementById('postCount') as HTMLSpanElement;
const randomPostBtn = document.getElementById('randomPostBtn') as HTMLButtonElement;
const totalPosts = postItems.length;

// Search functionality
if (searchInput) {
  searchInput.addEventListener('input', () => {
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
  });
}

// Random post functionality
if (randomPostBtn && typeof postsData !== 'undefined' && postsData.length > 0) {
  randomPostBtn.addEventListener('click', () => {
    // Disable button during animation
    randomPostBtn.disabled = true;
    randomPostBtn.style.cursor = 'wait';

    // Add spin animation class
    randomPostBtn.classList.add('random-spin');

    // Get random index
    const randomIndex = Math.floor(Math.random() * postsData.length);
    const randomPost = postsData[randomIndex];

    // Navigate after animation completes
    setTimeout(() => {
      window.location.href = `/posts/${randomPost.id}`;
    }, 500);
  });
}

// Add enhanced animations via style injection
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes randomSpin {
      0% {
        transform: rotate(0deg) scale(1);
      }
      50% {
        transform: rotate(180deg) scale(1.15);
      }
      100% {
        transform: rotate(360deg) scale(1);
      }
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.4);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(230, 57, 70, 0);
      }
    }

    .random-spin span:first-child {
      animation: randomSpin 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    #randomPostBtn:hover {
      animation: pulse 2s infinite;
    }
  `;
  document.head.appendChild(style);
}
