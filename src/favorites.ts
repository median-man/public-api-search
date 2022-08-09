/** local storage key for favorites array. Exported for testing only. Consider
 * this symbol to be private. */
export const SK_FAVORITES = "favorites";
const favorites = new Set<string>();

// initialize favorites
const storedFavorites: Array<string> | null = JSON.parse(
  localStorage.getItem(SK_FAVORITES) || "null"
);
storedFavorites?.forEach((f) => favorites.add(f));

function saveFavorites() {
  localStorage.setItem(SK_FAVORITES, JSON.stringify(Array.from(favorites)));
}

export function add(apiLink: string) {
  favorites.add(apiLink);
  saveFavorites();
}

export function remove(apiLink: string) {
  favorites.delete(apiLink);
  saveFavorites();
}

export function has(apiLink: string) {
  return favorites.has(apiLink);
}
