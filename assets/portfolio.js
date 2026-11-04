(() => {
  const dialog = document.getElementById('project-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const title = document.getElementById('project-dialog-title');
  const preview = document.getElementById('project-dialog-preview');
  const description = document.getElementById('project-dialog-description');
  const action = document.getElementById('project-dialog-action');
  const close = dialog.querySelector('.project-dialog-close');
  let lastTrigger = null;

  document.querySelectorAll('[data-project-preview]').forEach(card => {
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-controls', 'project-dialog');
    card.setAttribute('aria-expanded', 'false');
    card.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      lastTrigger = card;
      card.setAttribute('aria-expanded', 'true');
      title.textContent = card.querySelector('h3')?.textContent.trim() || 'Project preview';
      description.textContent = card.querySelector('.project-body p')?.textContent.trim() || '';
      action.href = card.href;
      action.textContent = card.querySelector('.project-link')?.textContent.trim() || 'OPEN PROJECT';
      preview.replaceChildren();
      const source = card.querySelector('.preview');
      const image = source?.querySelector('img');
      if (image) {
        const clone = document.createElement('img');
        clone.src = image.currentSrc || image.src;
        clone.alt = image.alt || `${title.textContent} preview`;
        preview.append(clone);
      } else if (source) {
        const word = source.querySelector('.word');
        if (word) preview.append(word.cloneNode(true));
      }
      dialog.showModal();
      close.focus();
    });
  });

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    lastTrigger?.setAttribute('aria-expanded', 'false');
    lastTrigger?.focus();
  });
})();


/* Load the third-party Instagram feed only when its section is approaching view. */
(() => {
  const profiles = document.getElementById('profiles');
  const feed = profiles?.querySelector('.elfsight-app-98e8718e-55d3-4a64-b2e2-5cb889d6aeec');
  if (!profiles || !feed) return;

  let loaded = false;
  const loadFeed = () => {
    if (loaded) return;
    loaded = true;
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.head.appendChild(script);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        loadFeed();
      }
    }, { rootMargin: '320px 0px' });
    observer.observe(profiles);
  } else {
    loadFeed();
  }
})();
