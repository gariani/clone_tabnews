import { Client } from "pg";
import { ServiceError } from "./errors.js";

async function getNewClient() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();

    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const serviceError = new ServiceError({
      cause: error,
      message: "Connetion failure with Database\\Query",
    });
    throw serviceError;
  } finally {
    if (client) await client?.end();
  }
}

async function queryWithParam(queryObject, values) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject, values);
    return result;
  } catch (error) {
    const serviceError = new ServiceError({
      cause: error,
      message: "Connetion failure with Database\\Query",
    });
    throw serviceError;
  } finally {
    if (client) await client?.end();
  }
}

function getSSLValues() {
  return process.env.APP_ENV === "development" ? false : true;
}

const database = {
  query,
  queryWithParam,
  getNewClient,
};

export default database;
