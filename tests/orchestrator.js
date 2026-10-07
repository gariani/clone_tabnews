import retry from "async-retry";
import database from "infra/database.js";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {});

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query(
    "drop schema if exists public cascade; create schema if not exists public;",
  );
}

// async function runPendingMigrations() {
//   await migrator.runPendingMigrations();
// }

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  // runPendingMigrations,
};

export default orchestrator;
