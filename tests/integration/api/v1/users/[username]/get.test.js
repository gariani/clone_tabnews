import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user: ", () => {
    test("With exact case match", async () => {
      await orchestrator.createUser({
        username: "SameCase",
        email: "SameCase@gmail.com",
        password: "test",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/SameCase",
      );

      const body = await response.json();
      expect(body).toEqual({
        id: body.id,
        username: "SameCase",
        email: "SameCase@gmail.com",
        password: body.password,
        created_at: body.created_at,
        updated_at: body.updated_at,
      });
    });

    test("With case mismatch", async () => {
      await orchestrator.createUser({
        username: "DifferentCase",
        email: "DifferentCase@gmail.com",
        password: "test",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/differentcase",
      );

      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        id: body.id,
        username: "DifferentCase",
        email: "DifferentCase@gmail.com",
        password: body.password,
        created_at: body.created_at,
        updated_at: body.updated_at,
      });
    });

    test("Non-existent user", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/NotExists",
      );

      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        name: "NotFoundError",
        message: "Username not found",
        action: "Try another one",
        status_code: 404,
      });
    });
  });
});
