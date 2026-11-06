(() => {
  const dialog = document.getElementById('project-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const title = document.getElementById('project-dialog-title');
  const preview = document.getElementById('project-dialog-preview');
  const description = document.getElementById('project-dialog-description');
  const action = document.getElementById('project-dialog-action');
  const close = dialog.querySelector('.dialog-close');
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
      title.textContent = card.querySelector('h3, h4')?.textContent.trim() || 'Project preview';
      description.textContent = card.querySelector('p')?.textContent.trim() || '';
      action.href = card.href;
      preview.replaceChildren();
      const image = card.querySelector('.work-image img, .preview img');
      if (image) {
        const clone = document.createElement('img');
        clone.src = image.currentSrc || image.src;
        clone.alt = image.alt || title.textContent + ' preview';
        preview.append(clone);
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