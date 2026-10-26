/**
 * Runs `worker` over `items` with at most `limit` in flight, preserving order of results.
 * A failing worker never stops the others; handle errors inside `worker`.
 */
export async function runPool<T, R>(items: T[], limit: number, worker: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  const lane = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index], index);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, lane));
  return results;
}
