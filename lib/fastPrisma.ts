import prisma from './prisma';

/**
 * Executes a Prisma query with a 250ms fast fallback timeout.
 * If the database connection times out or fails, returns fallbackData immediately.
 */
export async function withFastDb<T>(queryPromise: Promise<T>, fallbackData: T, timeoutMs = 250): Promise<T> {
  const timeoutPromise = new Promise<T>((resolve) => {
    setTimeout(() => resolve(fallbackData), timeoutMs);
  });

  try {
    const result = await Promise.race([queryPromise, timeoutPromise]);
    return result ?? fallbackData;
  } catch (error) {
    return fallbackData;
  }
}
