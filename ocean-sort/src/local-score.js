const STORAGE_KEY = 'ocean-sort-best-score';

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function readBestScore() {
  const storage = getStorage();

  if (!storage) {
    return 0;
  }

  try {
    const stored = Number(storage.getItem(STORAGE_KEY));
    return Number.isFinite(stored) ? stored : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score) {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(STORAGE_KEY, String(score));
    return true;
  } catch {
    return false;
  }
}

export function clearBestScore() {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
