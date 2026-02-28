export const STORAGE_KEYS = {
  ASSETS: 'wpm_assets',
  PROPERTIES: 'wpm_properties',
  MORTGAGES: 'wpm_mortgages',
  SIMULATOR: 'wpm_simulator',
} as const;

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, data: unknown): void {
  localStorage.setItem(key, JSON.stringify(data));
}
