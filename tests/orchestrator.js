import retry from "async-retry";
import database from "infra/database.js";
import migrator from "models/migrator.js";
import users from "models/user.js";
import session from "models/session.js";
import { randomUUID } from "node:crypto";

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

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userData) {
  return await users.create({
    username: userData.username || `test-${randomUUID()}`.slice(0, 30),
    email: userData.email || `test-${randomUUID()}@example.com`.slice(0, 254),
    password: userData.password || "standard_password".slice(0, 60),
  });
}

async function createSession(userId) {
  return await session.create(userId);
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  createSession,
};

export default orchestrator;
