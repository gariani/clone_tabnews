import { createRouter } from "next-connect";
import { ValidationError } from "infra/errors";
import controller from "infra/controllers.js";
import user from "models/user.js";

const router = createRouter();

// router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

// async function getHandler(request, response) {
//   const pendingMigrations = await migrator.listPendingMigrations();
//   response.status(200).json(pendingMigrations);
// }

async function postHandler(request, response) {
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);

  return response.status(201).json(newUser);
}
