import type { Config } from "../config";
import { openSqlite } from "./sqlite";
import type { Database } from "./types";

/** The single place that picks the database. Swap the implementation here when SQLite is outgrown. */
export function openDatabase(config: Pick<Config, "sqlitePath">): Database {
  return openSqlite(config.sqlitePath);
}

export type { Database } from "./types";
