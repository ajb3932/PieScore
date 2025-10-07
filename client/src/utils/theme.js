export function getTheme() {
  const saved = document.cookie
    .split('; ')
    .find(row => row.startsWith('theme='))
    ?.split('=')[1];

  return saved || 'light';
}

export function setTheme(theme) {
  document.cookie = `theme=${theme};max-age=31536000;path=/`; // 1 year

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function initTheme() {
  const theme = getTheme();
  setTheme(theme);
}
