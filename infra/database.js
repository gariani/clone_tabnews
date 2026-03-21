import { Client } from "pg";

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
    console.log(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function queryWithParam(queryObject, values) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject, values);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await client.end();
  }
}

function getSSLValues() {
  return process.env.APP_ENV === "development" ? false : true;
}

export default {
  query,
  queryWithParam,
  getNewClient,
};
