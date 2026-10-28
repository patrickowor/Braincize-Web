/**
 * Registers the endpoints of backend/brain.py and backend/braincize.py (and the answers they give) in
 * the database, so the gateway can list and call them.
 *
 *   npm run seed:models               add what is missing, leave existing entries alone
 *   npm run seed:models -- --dry-run  print what would be registered, change nothing
 *   npm run seed:models -- --force    reset existing entries to the values below
 *
 * Reads PYTHON_BRAIN_URL, PYTHON_BRAINCIZE_URL, PYTHON_INSECURE_TLS and SQLITE_PATH from .env.
 */
import { loadConfig } from "../config";
import { openDatabase } from "../db";
import { applyRegistrySeed } from "../registry/apply";
import { pythonRegistrySeed } from "../registry/pythonModels";

async function main() {
  const flags = new Set(process.argv.slice(2));
  // The seed script never signs tokens, so it must not need JWT_SECRET to run.
  const config = loadConfig({ JWT_SECRET: "x".repeat(32), ...process.env });
  const seed = pythonRegistrySeed({
    brainUrl: config.python.brainUrl,
    braincizeUrl: config.python.braincizeUrl,
    insecureTls: config.python.insecureTls,
  });

  for (const category of seed.categories) {
    const members = seed.models.filter((model) => model.categoryId === category.id);
    console.log(`\n${category.name}  [${category.id}]  ${members.length ? "" : "(no models yet)"}`);
    for (const model of members) describe(model);
  }
  const loose = seed.models.filter((model) => !model.categoryId);
  if (loose.length) {
    console.log("\nNot in any category");
    loose.forEach(describe);
  }

  if (flags.has("--dry-run")) {
    console.log("\nDry run: nothing written.");
    return;
  }

  const db = openDatabase(config);
  try {
    const result = await applyRegistrySeed(db, seed, { overwrite: flags.has("--force") });
    console.log(`\nDatabase ${config.sqlitePath}`);
    console.log(`  created: ${result.created.join(", ") || "none"}`);
    console.log(`  updated: ${result.updated.join(", ") || "none"}`);
    console.log(`  left alone (already there, use --force to reset): ${result.skipped.join(", ") || "none"}`);
  } finally {
    db.close();
  }
}

function describe(model: ReturnType<typeof pythonRegistrySeed>["models"][number]) {
  const flags = [model.internal ? "internal" : null, model.insecureTls ? "self-signed TLS ok" : null].filter(Boolean).join(", ");
  console.log(`  ${model.id}  POST ${model.url}  (${model.bodyMode} body, ${model.accepts.join(" ")})${flags ? `  [${flags}]` : ""}`);
  for (const response of model.responses) {
    console.log(`      ${response.when}\n        ${JSON.stringify(response.example)}`);
  }
}

main().catch((error) => {
  console.error("[seed] failed:", error);
  process.exit(1);
});
