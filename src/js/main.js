document.addEventListener('DOMContentLoaded', () => {
  console.log('Hydrogen Browser initialized!');

  window.addEventListener('error', (e) => {
    console.error('Browser error:', e.message);
  });

  const iframe = document.getElementById('browser-iframe');
  iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
});
