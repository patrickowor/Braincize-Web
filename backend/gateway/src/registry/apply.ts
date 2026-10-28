import type { Database } from "../db/types";
import type { RegistrySeed } from "./pythonModels";

export interface ApplyResult {
  created: string[];
  updated: string[];
  skipped: string[];
}

/**
 * Writes a seed into the database. Without `overwrite`, anything that already exists is left alone, so
 * running it again never undoes edits made through the API. With `overwrite`, existing entries are
 * reset to the seed (their category membership and position included).
 */
export async function applyRegistrySeed(db: Database, seed: RegistrySeed, { overwrite = false } = {}): Promise<ApplyResult> {
  const result: ApplyResult = { created: [], updated: [], skipped: [] };

  for (const category of seed.categories) {
    const label = `category:${category.id}`;
    if (!(await db.categories.find(category.id))) {
      await db.categories.create(category);
      result.created.push(label);
    } else if (overwrite) {
      const { id: _id, ...fields } = category;
      await db.categories.update(category.id, fields);
      result.updated.push(label);
    } else {
      result.skipped.push(label);
    }
  }

  for (const model of seed.models) {
    const label = `model:${model.id}`;
    if (!(await db.models.find(model.id))) {
      await db.models.create(model);
      result.created.push(label);
    } else if (overwrite) {
      const { id: _id, ...fields } = model;
      await db.models.update(model.id, fields);
      result.updated.push(label);
    } else {
      result.skipped.push(label);
    }
  }
  return result;
}
