import { ValidationError as ValidationError } from "infra/errors.js";
import database from "infra/database.js";
import password from "models/password.js";

async function create(userInputValues) {
  await validateField("username", userInputValues.username);
  await validateField("email", userInputValues.email);
  const hash = await hashPassword(userInputValues);

  userInputValues.password = hash;

  return await runInsertQuery(userInputValues);
}

async function hashPassword(userInputValues) {
  return password.hash(userInputValues.password);
}

async function validateField(field, value) {
  if (field == "" || value == "") {
    throw new ValidationError({
      message: `${field} field is mandatory`,
      action: `please provide value to ${field}`,
    });
  }

  if (await checkAlreadyExists(field, value)) {
    throw new ValidationError({
      message: `${field} already in use`,
      action: `provide another ${field}`,
    });
  }
}

async function checkAlreadyExists(field, value) {
  const result = await database.query({
    text: `SELECT COUNT(${field}) FROM users WHERE LOWER(${field}) = LOWER($1);`,
    values: [value],
  });

  const found = Number(result.rows[0].count);
  return found > 0;
}

async function runInsertQuery(userInputValues) {
  const results = await database.query({
    text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
    values: [
      userInputValues.username,
      userInputValues.email,
      userInputValues.password,
    ],
  });

  return results.rows[0];
}

async function findOneByUsername(userInputValues) {
  const result = await database.query({
    text: "SELECT * FROM users WHERE LOWER(username) = LOWER($1)",
    values: [userInputValues],
  });

  if (result.rowCount > 0) {
    return result.rows[0];
  }

  return null;
}

const user = {
  create,
  findOneByUsername,
};

export default user;
