const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const postsContainer = document.getElementById('postsContainer') as HTMLDivElement;
const noResults = document.getElementById('noResults') as HTMLDivElement;
const postItems = document.querySelectorAll<HTMLElement>('.post-item');
const postCount = document.getElementById('postCount') as HTMLSpanElement;
const totalPosts = postItems.length;

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
