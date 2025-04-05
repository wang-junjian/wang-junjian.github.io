// 确保所有博客图片都适应容器
document.addEventListener('DOMContentLoaded', function() {
  const postImages = document.querySelectorAll('.post-content img');
  
  postImages.forEach(img => {
    // 移除可能影响大小的内联样式
    img.style.width = '';
    img.style.height = '';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '20px auto';
    
    // 如果图片非常大，限制高度
    if (img.naturalWidth > 800) {
      img.style.maxHeight = '80vh';
      img.style.objectFit = 'contain';
    }
  });
});