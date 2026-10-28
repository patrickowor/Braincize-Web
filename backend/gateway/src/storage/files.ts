import { mkdir, readFile, readdir, rm, rmdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Holds uploaded images only until they have been analysed. Keys look like `<batchId>/<itemId>`.
 * Disk today; an S3 implementation only has to satisfy this interface.
 */
export interface FileStorage {
  save(key: string, data: Buffer): Promise<void>;
  read(key: string): Promise<Buffer>;
  remove(key: string): Promise<void>;
  /** Backstop for files orphaned by a crash: deletes batches whose folder is older than `maxAgeMs`. */
  removeOlderThan(maxAgeMs: number): Promise<number>;
}

export function createDiskStorage(root: string): FileStorage {
  const base = path.resolve(root);
  const resolve = (key: string) => {
    const full = path.resolve(base, key);
    if (!full.startsWith(base + path.sep)) throw new Error("Invalid storage key");
    return full;
  };

  return {
    async save(key, data) {
      const file = resolve(key);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, data);
    },
    read: (key) => readFile(resolve(key)),
    async remove(key) {
      const file = resolve(key);
      await rm(file, { force: true });
      await rmdir(path.dirname(file)).catch(() => undefined); // only succeeds once the batch folder is empty
    },
    async removeOlderThan(maxAgeMs) {
      const folders = await readdir(base).catch(() => [] as string[]);
      let removed = 0;
      for (const folder of folders) {
        const full = path.join(base, folder);
        const info = await stat(full).catch(() => null);
        if (info && Date.now() - info.mtimeMs > maxAgeMs) {
          await rm(full, { recursive: true, force: true });
          removed++;
        }
      }
      return removed;
    },
  };
}

export function createMemoryStorage(): FileStorage & { size(): number } {
  const files = new Map<string, Buffer>();
  return {
    async save(key, data) {
      files.set(key, data);
    },
    async read(key) {
      const data = files.get(key);
      if (!data) throw new Error("File not found");
      return data;
    },
    async remove(key) {
      files.delete(key);
    },
    async removeOlderThan() {
      return 0;
    },
    size: () => files.size,
  };
}

/**
 * File types the gateway can verify by content, and therefore the only ones a model may declare in
 * `accepts`. To support another type, add it here and teach `sniffImageType` to recognise it.
 */
export const SUPPORTED_FILE_TYPES = ["image/jpeg", "image/png"] as const;

/** Check the bytes rather than trusting the client's MIME type. */
export function sniffImageType(data: Buffer): (typeof SUPPORTED_FILE_TYPES)[number] | null {
  if (data.length > 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "image/jpeg";
  if (data.length > 8 && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  return null;
}
