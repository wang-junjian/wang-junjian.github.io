document.addEventListener('DOMContentLoaded', () => {
  // Initialize Mermaid
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    });
  }

  // First, process Mermaid diagrams
  const codeElements = document.querySelectorAll('.prose pre code');
  let mermaidCount = 0;

  codeElements.forEach((code) => {
    let isMermaid = false;
    if (code.className && code.className.includes('language-mermaid')) {
      isMermaid = true;
    }

    if (isMermaid && typeof mermaid !== 'undefined') {
      const pre = code.parentElement;
      const mermaidContent = code.textContent || code.innerText || '';

      const diagramDiv = document.createElement('div');
      diagramDiv.className = 'mermaid';
      diagramDiv.style.margin = '2rem 0';
      diagramDiv.style.padding = '1.5rem';
      diagramDiv.style.background = 'var(--white)';
      diagramDiv.style.border = '1px solid var(--border)';
      diagramDiv.style.borderRadius = '0.5rem';
      diagramDiv.textContent = mermaidContent;

      pre.parentNode.insertBefore(diagramDiv, pre);
      pre.style.display = 'none';

      mermaidCount++;
    }
  });

  // Render all mermaid diagrams
  if (mermaidCount > 0 && typeof mermaid !== 'undefined') {
    mermaid.init(undefined, '.mermaid');
  }

  // Apply syntax highlighting to remaining code blocks
  const remainingCodeElements = document.querySelectorAll('.prose pre:not([style*="display: none"]) code');
  remainingCodeElements.forEach((code) => {
    let lang = 'plaintext';
    if (code.className) {
      const match = code.className.match(/language-(\w+)/);
      if (match) {
        lang = match[1];
      }
    }
    code.classList.add('hljs');
    code.classList.add(lang);
    try {
      hljs.highlightElement(code);
    } catch (e) {
      console.warn('Highlight failed:', e);
    }
  });

  // Add copy buttons to code blocks
  const codeBlocks = document.querySelectorAll('.prose pre');

  codeBlocks.forEach((pre) => {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = '复制';
    copyBtn.style.zIndex = '10';

    pre.style.position = 'relative';
    pre.insertBefore(copyBtn, pre.firstChild);

    copyBtn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      let text = '';

      if (code) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = code.innerHTML;
        text = tempDiv.textContent || tempDiv.innerText || '';
      } else {
        text = pre.textContent || '';
      }

      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = '已复制!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyBtn.textContent = '复制';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        copyBtn.textContent = '复制失败';
        setTimeout(() => {
          copyBtn.textContent = '复制';
        }, 2000);
      }
    });
  });
});
