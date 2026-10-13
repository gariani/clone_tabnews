import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user: ", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
      });

      const insertUser = await database.query({
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3);",
        values: ["daniel", "danielgrafael@gmail.com", "test"],
      });

      const insertUser2 = await database.query({
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3);",
        values: ["daniel1", "danielgrafael2@gmail.com", "test"],
      });

      const users = await database.query("SELECT * FROM users");
      console.log(users);

      expect(response.status).toBe(201);
    });
  });
});
