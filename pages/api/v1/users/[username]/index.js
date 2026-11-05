import { createRouter } from "next-connect";
import { NotFoundError, AlreadyExistsError } from "infra/errors";
import controller from "infra/controllers.js";
import user from "models/user.js";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userInputValues = request.query.username;
  const result = await user.findOneByUsername(userInputValues);

  if (result) {
    return response.status(200).json(result);
  }

  throw new NotFoundError({
    message: "Username not found",
    action: "Try another one",
  });
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);

  if (!userFound) {
    throw new NotFoundError({
      message: "Username not found",
      action: "Try another one",
    });
  }

  const userInputValues = request.body;

  if ("username" in userInputValues) {
    userFound.username = userInputValues.username;
    await user.validateField("username", userInputValues.username);
  }

  if ("email" in userInputValues) {
    userFound.email = userInputValues.email;
    await user.validateField("email", userInputValues.email);
  }

  if ("password" in userInputValues) {
    userFound.password = await user.hashPassword(userInputValues);
  }

  const updatedUser = await user.update(userFound);

  if (updatedUser) return response.status(201).json(updatedUser);
}
