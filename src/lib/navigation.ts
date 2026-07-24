export function navigateTo(path: string) {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new CustomEvent('navigate', { detail: path }));
}
