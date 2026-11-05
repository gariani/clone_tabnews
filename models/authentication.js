import user from "models/user.js";
import password from "models/password.js";
import { UnauthorizedError } from "infra/errors.js";

async function getAuthenticateUser(providedEmail, providedPassword) {
  const storedUser = await findUserEmail(providedEmail);

  await validatePassword(providedPassword, storedUser.password);

  return storedUser;
}

async function findUserEmail(providedEmail) {
  try {
    const found = await user.findOneByEmail(providedEmail);

    if (!found) {
      throw new UnauthorizedError({
        message: "Incorrect username/password",
        action: "Check the information and try again!",
      });
    }

    return found;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    throw error;
  }
}

async function validatePassword(providedPassword, storedUserPassword) {
  const correctPasswordMatch = await password.compare(
    providedPassword,
    storedUserPassword,
  );

  if (!correctPasswordMatch) {
    throw new UnauthorizedError({
      message: "Incorrect username/password",
      action: "Check the information and try again!",
    });
  }
}

const authentication = {
  getAuthenticateUser,
};

export default authentication;
