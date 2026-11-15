// Vite's base is / locally and /<repository>/ on GitHub Pages.
export function assetUrl(path) {
  if (!path || !path.startsWith("/")) return path;
  const base = import.meta.env.BASE_URL;
  return path.startsWith(base) && base !== "/"
    ? path
    : `${base}${path.replace(/^\/+/, "")}`;
}
export function assetSrcSet(srcSet) {
  return srcSet
    ?.split(",")
    .map((candidate) => {
      const [path, ...descriptor] = candidate.trim().split(/\s+/);
      return [assetUrl(path), ...descriptor].join(" ");
    })
    .join(", ");
}
