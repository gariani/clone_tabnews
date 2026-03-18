import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    ssl: getSSLValues(),
  });

  try {
    await client.connect();
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
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    ssl: getSSLValues(),
  });

  try {
    await client.connect();
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
  query: query,
  queryWithParam: queryWithParam,
};
