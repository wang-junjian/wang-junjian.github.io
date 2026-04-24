document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const postsContainer = document.getElementById('postsContainer');
  const noResults = document.getElementById('noResults');
  const postItems = document.querySelectorAll('.post-item');
  const postCount = document.getElementById('postCount');
  const totalPosts = postItems.length;

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    postItems.forEach((item) => {
      const title = item.dataset.title;
      const excerpt = item.dataset.excerpt;
      const matches = query === '' || title.includes(query) || excerpt.includes(query);

      if (matches) {
        item.style.display = 'flex';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (query === '') {
      postCount.textContent = totalPosts + ' 篇';
    } else {
      postCount.textContent = visibleCount + ' / ' + totalPosts + ' 篇';
    }

    if (query !== '' && visibleCount === 0) {
      postsContainer.classList.add('hidden');
      noResults.classList.remove('hidden');
    } else {
      postsContainer.classList.remove('hidden');
      noResults.classList.add('hidden');
    }
  });
});
