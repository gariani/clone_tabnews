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
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "SameCase",
          email: "SameCase@gmail.com",
          password: "test",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/SameCase",
      );

      const body2 = await response2.json();
      expect(body2).toEqual("SameCase");
    });

    test("With case mismatch", async () => {
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/differentOne",
      );

      const body3 = await response2.json();
      console.log(body3);

      expect(body3.status_code).toBe(404);
      expect(body3).toEqual({
        name: "NotFoundError",
        message: "Username not found",
        action: "Try another one",
        status_code: 404,
      });
    });
  });
});
