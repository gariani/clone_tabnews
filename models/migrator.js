import { join } from "node:path";
import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";

const migrationsSetup = {
  databaseUrl: process.env.DATABASE_URL,
  dryRun: true,
  dir: join("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    return await migrationRunner({
      ...migrationsSetup,
      dbClient: dbClient,
    });
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    return await migrationRunner({
      ...migrationsSetup,
      dbClient: dbClient,
      dryRun: false,
    });
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
