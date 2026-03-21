import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function m(request, response) {
  const dbClient = await database.getNewClient();

  const migrationsSetup = {
    dbClient: dbClient,
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  let pendingMigrations;
  let migratedMigrations;

  if (request.method === "GET") {
    pendingMigrations = await migrationRunner({
      ...migrationsSetup,
      dryRun: true,
    });
    await dbClient.end();
    response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    migratedMigrations = await migrationRunner({
      ...migrationsSetup,
      dryRun: false,
    });
    if (migratedMigrations.length > 0) {
      response.status(201).json(migratedMigrations);
    }
    await dbClient.end();
    response.status(200).json(migratedMigrations);
  }

  response.status(405).end();
}
