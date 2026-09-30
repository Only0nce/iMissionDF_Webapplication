(() => {
  'use strict';

  const STORAGE_KEY = 'theme';
  const VALID_THEMES = new Set(['light', 'dark', 'auto']);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const getStoredTheme = () => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return VALID_THEMES.has(value) ? value : null;
    } catch (_) {
      return null;
    }
  };

  const getPreferredTheme = () => getStoredTheme() || 'auto';
  const resolveTheme = theme => theme === 'auto' ? (mediaQuery.matches ? 'dark' : 'light') : theme;

  const setStoredTheme = theme => {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
  };

  const themeIcon = resolvedTheme => resolvedTheme === 'dark'
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1.25a1 1 0 1 1 2 0V21a1 1 0 0 1-1 1Zm0-17.75a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1.25a1 1 0 0 1-1 1ZM3 13H1.75a1 1 0 1 1 0-2H3a1 1 0 1 1 0 2Zm19.25 0H21a1 1 0 1 1 0-2h1.25a1 1 0 1 1 0 2ZM5.64 6.64a1 1 0 0 1-.7-.29l-.89-.88a1 1 0 1 1 1.42-1.42l.88.89a1 1 0 0 1-.71 1.7Zm13.71 13.71a1 1 0 0 1-.7-.29l-.89-.88a1 1 0 1 1 1.42-1.42l.88.89a1 1 0 0 1-.71 1.7Zm-13.71 0a1 1 0 0 1-.71-1.7l.89-.89a1 1 0 1 1 1.41 1.42l-.88.88a1 1 0 0 1-.71.29ZM18.47 6.64a1 1 0 0 1-.71-1.7l.89-.89a1 1 0 1 1 1.41 1.42l-.88.88a1 1 0 0 1-.71.29Z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 15.3A8.5 8.5 0 0 1 8.7 3.3 8.5 8.5 0 1 0 20.7 15.3ZM12 22a10 10 0 0 1-1.2-19.93 1 1 0 0 1 .78 1.76A6.5 6.5 0 0 0 20.17 12.4a1 1 0 0 1 1.76.78A10.02 10.02 0 0 1 12 22Z"/></svg>';

  const updateToggle = resolvedTheme => {
    const button = document.getElementById('app-theme-toggle');
    if (!button) return;
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    button.innerHTML = themeIcon(resolvedTheme);
    button.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    button.setAttribute('title', `Switch to ${nextTheme} mode`);
    button.dataset.resolvedTheme = resolvedTheme;
  };

  const applyTheme = (theme, options = {}) => {
    const normalized = VALID_THEMES.has(theme) ? theme : 'auto';
    const resolved = resolveTheme(normalized);
    const previous = document.documentElement.getAttribute('data-bs-theme');

    document.documentElement.setAttribute('data-bs-theme', resolved);
    document.documentElement.dataset.themePreference = normalized;

    if (options.persist) setStoredTheme(normalized);
    updateToggle(resolved);

    if (previous !== resolved || options.forceEvent) {
      window.dispatchEvent(new CustomEvent('app-theme-change', {
        detail: { theme: normalized, resolvedTheme: resolved }
      }));
    }
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-bs-theme') || resolveTheme(getPreferredTheme());
    applyTheme(current === 'dark' ? 'light' : 'dark', { persist: true, forceEvent: true });
  };

  const mountToggle = () => {
    if (document.getElementById('app-theme-toggle')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'app-theme-toggle';
    button.className = 'app-theme-toggle';
    button.addEventListener('click', toggleTheme);

    const header = document.querySelector('header.navbar');
    if (header) {
      header.classList.add('app-theme-host');
      header.appendChild(button);
    } else {
      button.classList.add('app-theme-toggle--floating');
      document.body.appendChild(button);
    }

    updateToggle(document.documentElement.getAttribute('data-bs-theme') || resolveTheme(getPreferredTheme()));
  };

  // Apply before first paint when this script is loaded in <head>.
  applyTheme(getPreferredTheme());

  mediaQuery.addEventListener('change', () => {
    if (getPreferredTheme() === 'auto') applyTheme('auto', { forceEvent: true });
  });

  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY) applyTheme(getPreferredTheme(), { forceEvent: true });
  });

  window.AppTheme = Object.freeze({
    getStoredTheme,
    getPreferredTheme,
    resolveTheme,
    applyTheme,
    toggleTheme
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountToggle, { once: true });
  } else {
    mountToggle();
  }
})();
