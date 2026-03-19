import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function m(request, response) {
  let migrations;

  if (request.method === "GET") {
    migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    response.status(200).json(migrations);
  }

  if (request.method === "POST") {
    migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: false,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    response.status(200).json(migrations);
  }

  response.status(405).end();
}
