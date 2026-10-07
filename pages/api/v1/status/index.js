import { createRouter } from "next-connect";
import database from "infra/database.js";

import controller from "infra/controllers.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();

  const dbMaxConn = await databaseMaxConnections2();
  const dbVersion = await databaseVersion();
  const dbTotalActiveConn = await databaseActiveConnections();

  const responseBdy = {
    updated_at: updatedAt,
    db_max_conn: dbMaxConn,
    db_total_active_connections: dbTotalActiveConn,
    db_version: dbVersion,
  };

  response.status(200).json(responseBdy);
  return;
}

async function databaseVersion() {
  const result = await database.query("SHOW server_version;");
  return result.rows[0].server_version;
}

async function databaseMaxConnections2() {
  const result = await database.query("SHOW max_connections;");
  return parseInt(result.rows[0].max_connections);
}

async function databaseActiveConnections() {
  const query =
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;";
  const values = [process.env.DB_DATABASE];

  const result = await database.queryWithParam(query, values);
  return result.rows[0].count;
}
