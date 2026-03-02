let lastCallTime = 0;

/**
 * Ensures at least `intervalMs` milliseconds between successive calls.
 * Returns a promise that resolves when it is safe to proceed.
 */
export async function waitForRateLimit(intervalMs = 1000): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastCallTime;
  if (elapsed < intervalMs) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs - elapsed));
  }
  lastCallTime = Date.now();
}

/** Reset state — useful for tests */
export function resetRateLimit(): void {
  lastCallTime = 0;
}
