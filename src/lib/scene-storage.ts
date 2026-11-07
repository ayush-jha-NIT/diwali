const STORAGE_KEY = "the-last-spark:chapter:v1";

export function readProgress(): number {
  if (typeof window === "undefined") return 0;
  try {
    const value = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isInteger(value) && value >= 0 && value <= 6 ? value : 0;
  } catch {
    return 0;
  }
}

export function saveProgress(chapter: number) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.min(6, chapter))));
  } catch {
    // Private browsing can disable storage; the experience still works.
  }
}

export function resetProgress() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage is optional.
  }
}
