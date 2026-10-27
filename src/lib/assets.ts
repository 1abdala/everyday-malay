/** Resolve public asset paths against Vite's configured deployment base. */
export function appAssetPath(path: string, baseUrl = import.meta.env.BASE_URL): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || /^(?:data|blob):/i.test(path)) return path;
  return `${baseUrl}${path.replace(/^\/+/, '')}`;
}
