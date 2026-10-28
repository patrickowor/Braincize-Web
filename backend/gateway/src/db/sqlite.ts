import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { faqSeed, researchSeed } from "./seed";
import {
  AlreadyExistsError,
  EmailTakenError,
  type Category,
  type Database,
  type FaqItem,
  type ModelRecord,
  type ResearchArticle,
  type User,
} from "./types";

/** Append-only. `PRAGMA user_version` records how many have run. */
const MIGRATIONS = [
  `CREATE TABLE users (
     id TEXT PRIMARY KEY,
     first_name TEXT NOT NULL,
     last_name TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE COLLATE NOCASE,
     password_hash TEXT NOT NULL,
     created_at INTEGER NOT NULL
   );
   CREATE TABLE contact_messages (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     address TEXT NOT NULL,
     phone TEXT NOT NULL,
     message TEXT NOT NULL,
     created_at INTEGER NOT NULL
   );
   CREATE TABLE newsletter_subscribers (
     email TEXT PRIMARY KEY COLLATE NOCASE,
     created_at INTEGER NOT NULL
   );
   CREATE TABLE faq_items (
     id TEXT PRIMARY KEY,
     question TEXT NOT NULL,
     answer TEXT,
     position INTEGER NOT NULL
   );
   CREATE TABLE research_articles (
     id TEXT PRIMARY KEY,
     title TEXT NOT NULL,
     href TEXT,
     position INTEGER NOT NULL
   );`,
  `CREATE TABLE categories (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT NOT NULL,
     icon TEXT,
     input_label TEXT,
     position INTEGER NOT NULL,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL
   );
   CREATE TABLE models (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     version TEXT,
     type TEXT,
     description TEXT NOT NULL,
     category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
     url TEXT NOT NULL,
     body_mode TEXT NOT NULL,
     file_field TEXT,
     accepts TEXT NOT NULL,
     headers TEXT NOT NULL,
     insecure_tls INTEGER NOT NULL,
     timeout_ms INTEGER,
     internal INTEGER NOT NULL,
     enabled INTEGER NOT NULL,
     responses TEXT NOT NULL,
     position INTEGER NOT NULL,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL
   );
   CREATE INDEX models_category ON models (category_id, position);`,
];

type Row = Record<string, unknown>;

const toUser = (row: Row): User => ({
  id: row.id as string,
  firstName: row.first_name as string,
  lastName: row.last_name as string,
  email: row.email as string,
  passwordHash: row.password_hash as string,
  createdAt: row.created_at as number,
});

const toFaq = (row: Row): FaqItem => ({
  id: row.id as string,
  question: row.question as string,
  ...(row.answer ? { answer: row.answer as string } : {}),
});

const toArticle = (row: Row): ResearchArticle => ({
  id: row.id as string,
  title: row.title as string,
  ...(row.href ? { href: row.href as string } : {}),
});

const toCategory = (row: Row): Category => ({
  id: row.id as string,
  name: row.name as string,
  description: row.description as string,
  icon: (row.icon as string | null) ?? null,
  inputLabel: (row.input_label as string | null) ?? null,
  position: row.position as number,
  createdAt: row.created_at as number,
  updatedAt: row.updated_at as number,
});

const toModel = (row: Row): ModelRecord => ({
  id: row.id as string,
  name: row.name as string,
  version: (row.version as string | null) ?? null,
  type: (row.type as string | null) ?? null,
  description: row.description as string,
  categoryId: (row.category_id as string | null) ?? null,
  url: row.url as string,
  bodyMode: row.body_mode as ModelRecord["bodyMode"],
  fileField: (row.file_field as string | null) ?? null,
  accepts: JSON.parse(row.accepts as string),
  headers: JSON.parse(row.headers as string),
  insecureTls: row.insecure_tls === 1,
  timeoutMs: (row.timeout_ms as number | null) ?? null,
  internal: row.internal === 1,
  enabled: row.enabled === 1,
  responses: JSON.parse(row.responses as string),
  position: row.position as number,
  createdAt: row.created_at as number,
  updatedAt: row.updated_at as number,
});

const isUniqueViolation = (error: unknown) => error instanceof Error && error.message.includes("UNIQUE constraint failed");

function writeModel(db: DatabaseSync, mode: "INSERT" | "UPDATE", m: ModelRecord) {
  const values = [
    m.name, m.version, m.type, m.description, m.categoryId, m.url, m.bodyMode, m.fileField,
    JSON.stringify(m.accepts), JSON.stringify(m.headers), m.insecureTls ? 1 : 0, m.timeoutMs,
    m.internal ? 1 : 0, m.enabled ? 1 : 0, JSON.stringify(m.responses), m.position,
  ];
  if (mode === "INSERT") {
    db.prepare(
      `INSERT INTO models (name, version, type, description, category_id, url, body_mode, file_field, accepts, headers,
         insecure_tls, timeout_ms, internal, enabled, responses, position, id, created_at, updated_at)
       VALUES (${"?, ".repeat(18)}?)`,
    ).run(...values, m.id, m.createdAt, m.updatedAt);
  } else {
    db.prepare(
      `UPDATE models SET name = ?, version = ?, type = ?, description = ?, category_id = ?, url = ?, body_mode = ?,
         file_field = ?, accepts = ?, headers = ?, insecure_tls = ?, timeout_ms = ?, internal = ?, enabled = ?,
         responses = ?, position = ?, updated_at = ? WHERE id = ?`,
    ).run(...values, m.updatedAt, m.id);
  }
}

function migrate(db: DatabaseSync) {
  const current = (db.prepare("PRAGMA user_version").get() as { user_version: number }).user_version;
  for (let version = current; version < MIGRATIONS.length; version++) {
    db.exec("BEGIN");
    try {
      db.exec(MIGRATIONS[version]!);
      db.exec(`PRAGMA user_version = ${version + 1}`);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}

function seed(db: DatabaseSync) {
  const empty = (table: string) => (db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }).n === 0;
  if (empty("faq_items")) {
    const insert = db.prepare("INSERT INTO faq_items (id, question, answer, position) VALUES (?, ?, ?, ?)");
    faqSeed.forEach((item, position) => insert.run(item.id, item.question, item.answer ?? null, position));
  }
  if (empty("research_articles")) {
    const insert = db.prepare("INSERT INTO research_articles (id, title, href, position) VALUES (?, ?, ?, ?)");
    researchSeed.forEach((item, position) => insert.run(item.id, item.title, item.href ?? null, position));
  }
}

export function openSqlite(file: string): Database {
  if (file !== ":memory:") mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  migrate(db);
  seed(db);

  return {
    users: {
      async create(user) {
        const createdAt = Date.now();
        try {
          db.prepare(
            "INSERT INTO users (id, first_name, last_name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)",
          ).run(user.id, user.firstName, user.lastName, user.email, user.passwordHash, createdAt);
        } catch (error) {
          if (error instanceof Error && error.message.includes("UNIQUE constraint failed: users.email")) {
            throw new EmailTakenError();
          }
          throw error;
        }
        return { ...user, createdAt };
      },
      async findByEmail(email) {
        const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
        return row ? toUser(row) : null;
      },
      async findById(id) {
        const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
        return row ? toUser(row) : null;
      },
    },
    contact: {
      async create(message) {
        db.prepare(
          "INSERT INTO contact_messages (id, name, email, address, phone, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ).run(randomUUID(), message.name, message.email, message.address, message.phone, message.message, Date.now());
      },
    },
    newsletter: {
      async subscribe(email) {
        db.prepare("INSERT OR IGNORE INTO newsletter_subscribers (email, created_at) VALUES (?, ?)").run(email, Date.now());
      },
    },
    faq: {
      async list() {
        return db.prepare("SELECT * FROM faq_items ORDER BY position").all().map(toFaq);
      },
    },
    research: {
      async list() {
        return db.prepare("SELECT * FROM research_articles ORDER BY position").all().map(toArticle);
      },
      async find(id) {
        const row = db.prepare("SELECT * FROM research_articles WHERE id = ?").get(id);
        return row ? toArticle(row) : null;
      },
    },
    categories: {
      async list() {
        return db.prepare("SELECT * FROM categories ORDER BY position, id").all().map(toCategory);
      },
      async find(id) {
        const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
        return row ? toCategory(row) : null;
      },
      async create(category) {
        const now = Date.now();
        const position = category.position ?? nextPosition("categories");
        try {
          db.prepare(
            "INSERT INTO categories (id, name, description, icon, input_label, position, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          ).run(category.id, category.name, category.description, category.icon, category.inputLabel, position, now, now);
        } catch (error) {
          if (isUniqueViolation(error)) throw new AlreadyExistsError("A category with this id");
          throw error;
        }
        return { ...category, position, createdAt: now, updatedAt: now };
      },
      async update(id, patch) {
        const current = db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
        if (!current) return null;
        const next = { ...toCategory(current), ...patch, updatedAt: Date.now() };
        db.prepare("UPDATE categories SET name = ?, description = ?, icon = ?, input_label = ?, position = ?, updated_at = ? WHERE id = ?").run(
          next.name, next.description, next.icon, next.inputLabel, next.position, next.updatedAt, id,
        );
        return next;
      },
      async delete(id) {
        return Number(db.prepare("DELETE FROM categories WHERE id = ?").run(id).changes) > 0;
      },
    },
    models: {
      async list(filter = {}) {
        const where: string[] = [];
        const args: string[] = [];
        if (filter.categoryId) {
          where.push("category_id = ?");
          args.push(filter.categoryId);
        }
        if (!filter.includeDisabled) where.push("enabled = 1");
        if (!filter.includeInternal) where.push("internal = 0");
        const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
        return db.prepare(`SELECT * FROM models ${clause} ORDER BY position, id`).all(...args).map(toModel);
      },
      async find(id) {
        const row = db.prepare("SELECT * FROM models WHERE id = ?").get(id);
        return row ? toModel(row) : null;
      },
      async create(model) {
        const now = Date.now();
        const created: ModelRecord = { ...model, position: model.position ?? nextPosition("models"), createdAt: now, updatedAt: now };
        try {
          writeModel(db, "INSERT", created);
        } catch (error) {
          if (isUniqueViolation(error)) throw new AlreadyExistsError("A model with this id");
          throw error;
        }
        return created;
      },
      async update(id, patch) {
        const current = db.prepare("SELECT * FROM models WHERE id = ?").get(id);
        if (!current) return null;
        const next: ModelRecord = { ...toModel(current), ...patch, updatedAt: Date.now() };
        writeModel(db, "UPDATE", next);
        return next;
      },
      async delete(id) {
        return Number(db.prepare("DELETE FROM models WHERE id = ?").run(id).changes) > 0;
      },
      async setCategoryModels(categoryId, modelIds) {
        db.exec("BEGIN");
        try {
          db.prepare("UPDATE models SET category_id = NULL WHERE category_id = ?").run(categoryId);
          const attach = db.prepare("UPDATE models SET category_id = ?, position = ?, updated_at = ? WHERE id = ?");
          modelIds.forEach((modelId, position) => attach.run(categoryId, position, Date.now(), modelId));
          db.exec("COMMIT");
        } catch (error) {
          db.exec("ROLLBACK");
          throw error;
        }
      },
    },
    close: () => db.close(),
  };

  function nextPosition(table: "categories" | "models") {
    return (db.prepare(`SELECT COALESCE(MAX(position), -1) + 1 AS next FROM ${table}`).get() as { next: number }).next;
  }
}
