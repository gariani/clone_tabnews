import { createRouter } from "next-connect";
import { NotFoundError } from "infra/errors";
import controller from "infra/controllers.js";
import user from "models/user.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userInputValues = request.query.username;
  const result = await user.findOneByUsername(userInputValues);

  if (result) {
    return response.status(200).json(result.username);
  }

  throw new NotFoundError({
    message: "Username not found",
    action: "Try another one",
  });
}
