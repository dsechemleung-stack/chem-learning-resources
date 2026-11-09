// ── Common Script for All Subpages ──
// Automatically injects "Back to Index" button with consistent styling

(function() {
  // Don't inject on index page
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    return;
  }

  // Create back button
  const backBtn = document.createElement('a');
  backBtn.href = 'index.html';
  backBtn.className = 'auto-back-button';
  backBtn.textContent = '← Back to Index';
  backBtn.setAttribute('aria-label', 'Back to index page');

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .auto-back-button {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 9999;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: rgba(10, 26, 24, 0.85);
      border: 1.5px solid rgba(197, 215, 181, 0.5);
      border-radius: 10px;
      color: rgba(197, 215, 181, 0.95);
      text-decoration: none;
      font-family: 'Quicksand', -apple-system, sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
      transition: all 0.2s ease;
    }
    .auto-back-button:hover {
      background: rgba(197, 215, 181, 0.15);
      border-color: rgba(197, 215, 181, 0.8);
      color: #fff;
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
    }
    .auto-back-button:focus-visible {
      outline: none;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(197, 215, 181, 0.4);
    }
    @media (max-width: 600px) {
      .auto-back-button {
        top: 12px;
        left: 12px;
        padding: 6px 12px;
        font-size: 12px;
      }
    }
  `;

  // Inject into head
  document.head.appendChild(style);

  // Inject button at the start of body
  document.body.insertBefore(backBtn, document.body.firstChild);
})();
