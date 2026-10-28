import { Router, type Request } from "express";
import { isAdmin, requireAdmin, requireAuth, type Authenticator } from "../auth/authenticate";
import { AlreadyExistsError, type Category, type Database, type ModelRecord } from "../db/types";
import { HttpError } from "../errors";
import { categoryInput, categoryModelsInput, categoryPatch, mergeModelPatch, modelInput, modelPatch } from "../registry/schemas";

interface Deps {
  db: Database;
  authenticate: Authenticator;
  config: { adminEmails: string[] };
}

/** What any signed-in user may see of a model: enough to pick it and to check files against it. */
const publicModel = (model: ModelRecord) => ({
  id: model.id,
  name: model.name,
  version: model.version,
  type: model.type,
  description: model.description,
  categoryId: model.categoryId,
  accepts: model.accepts,
  position: model.position,
});

const categoryView = (category: Category, modelCount: number) => ({
  id: category.id,
  name: category.name,
  description: category.description,
  icon: category.icon,
  inputLabel: category.inputLabel,
  position: category.position,
  modelCount,
});

/**
 * Categories and the models attached to them.
 *
 * Any signed-in user can read (admins see full model details: url, headers, disabled and internal
 * models). Writes need an admin, i.e. an email listed in ADMIN_EMAILS.
 *
 *   GET    /categories                 PUT    /categories/:id/models   { modelIds: [...] }  replaces the list
 *   GET    /categories/:id             POST   /categories             PATCH/DELETE /categories/:id
 *   GET    /categories/:id/models      POST   /models                 PATCH/DELETE /models/:id
 *   GET    /models[?category=<id>]     GET    /models/:id
 */
export function registryRouter({ db, authenticate, config }: Deps) {
  const router = Router();
  const guard = [requireAuth(authenticate)];
  const adminOnly = [...guard, requireAdmin(db, config.adminEmails)];

  async function callerIsAdmin(request: Request) {
    const user = await db.users.findById(request.auth!.userId);
    return Boolean(user && isAdmin(config.adminEmails, user.email));
  }

  /** Models the caller may see; admins also get disabled and internal ones. */
  const visibleModels = (admin: boolean, categoryId?: string) =>
    db.models.list({ categoryId, includeDisabled: admin, includeInternal: admin });
  const modelView = (admin: boolean) => (model: ModelRecord) => (admin ? model : publicModel(model));

  async function requireCategory(id: string) {
    const category = await db.categories.find(id);
    if (!category) throw new HttpError(404, "Category not found.");
    return category;
  }

  async function requireModel(id: string, admin: boolean) {
    const model = await db.models.find(id);
    if (!model || (!admin && (model.internal || !model.enabled))) throw new HttpError(404, "Model not found.");
    return model;
  }

  /* ───────────── categories ───────────── */

  router.get("/categories", ...guard, async (request, response) => {
    const admin = await callerIsAdmin(request);
    const counts = new Map<string, number>();
    for (const model of await visibleModels(admin)) {
      if (model.categoryId) counts.set(model.categoryId, (counts.get(model.categoryId) ?? 0) + 1);
    }
    response.json((await db.categories.list()).map((category) => categoryView(category, counts.get(category.id) ?? 0)));
  });

  router.get("/categories/:id", ...guard, async (request, response) => {
    const admin = await callerIsAdmin(request);
    const category = await requireCategory(String(request.params.id));
    const models = await visibleModels(admin, category.id);
    response.json({ ...categoryView(category, models.length), models: models.map(modelView(admin)) });
  });

  router.get("/categories/:id/models", ...guard, async (request, response) => {
    const admin = await callerIsAdmin(request);
    const category = await requireCategory(String(request.params.id));
    response.json((await visibleModels(admin, category.id)).map(modelView(admin)));
  });

  router.post("/categories", ...adminOnly, async (request, response) => {
    try {
      const category = await db.categories.create(categoryInput.parse(request.body));
      response.status(201).json(categoryView(category, 0));
    } catch (error) {
      if (error instanceof AlreadyExistsError) throw new HttpError(409, error.message);
      throw error;
    }
  });

  router.patch("/categories/:id", ...adminOnly, async (request, response) => {
    const id = String(request.params.id);
    const updated = await db.categories.update(id, categoryPatch.parse(request.body));
    if (!updated) throw new HttpError(404, "Category not found.");
    response.json(categoryView(updated, (await visibleModels(true, id)).length));
  });

  router.delete("/categories/:id", ...adminOnly, async (request, response) => {
    const id = String(request.params.id);
    await requireCategory(id);
    if ((await db.models.list({ categoryId: id, includeDisabled: true, includeInternal: true })).length) {
      throw new HttpError(409, "This category still has models. Move or delete them first.");
    }
    await db.categories.delete(id);
    response.status(204).end();
  });

  /** Replaces the category's model list: listed models are attached in the given order, the rest are detached. */
  router.put("/categories/:id/models", ...adminOnly, async (request, response) => {
    const category = await requireCategory(String(request.params.id));
    const { modelIds } = categoryModelsInput.parse(request.body);
    if (new Set(modelIds).size !== modelIds.length) throw new HttpError(400, "A model is listed twice.");
    const missing: string[] = [];
    for (const modelId of modelIds) if (!(await db.models.find(modelId))) missing.push(modelId);
    if (missing.length) throw new HttpError(400, `Unknown models: ${missing.join(", ")}`, { missing });

    await db.models.setCategoryModels(category.id, modelIds);
    const models = await visibleModels(true, category.id);
    response.json({ ...categoryView(category, models.length), models });
  });

  /* ───────────── models ───────────── */

  router.get("/models", ...guard, async (request, response) => {
    const admin = await callerIsAdmin(request);
    const category = typeof request.query.category === "string" ? request.query.category : undefined;
    response.json((await visibleModels(admin, category)).map(modelView(admin)));
  });

  router.get("/models/:id", ...guard, async (request, response) => {
    const admin = await callerIsAdmin(request);
    response.json(modelView(admin)(await requireModel(String(request.params.id), admin)));
  });

  const requireKnownCategory = async (categoryId: string | null | undefined) => {
    if (categoryId && !(await db.categories.find(categoryId))) throw new HttpError(400, `Unknown category: ${categoryId}`);
  };

  router.post("/models", ...adminOnly, async (request, response) => {
    const model = modelInput.parse(request.body);
    await requireKnownCategory(model.categoryId);
    try {
      response.status(201).json(await db.models.create(model));
    } catch (error) {
      if (error instanceof AlreadyExistsError) throw new HttpError(409, error.message);
      throw error;
    }
  });

  router.patch("/models/:id", ...adminOnly, async (request, response) => {
    const id = String(request.params.id);
    const current = await db.models.find(id);
    if (!current) throw new HttpError(404, "Model not found.");
    const { id: _id, ...merged } = mergeModelPatch(current, modelPatch.parse(request.body));
    await requireKnownCategory(merged.categoryId);
    response.json(await db.models.update(id, { ...merged, position: merged.position ?? current.position }));
  });

  router.delete("/models/:id", ...adminOnly, async (request, response) => {
    if (!(await db.models.delete(String(request.params.id)))) throw new HttpError(404, "Model not found.");
    response.status(204).end();
  });

  return router;
}
