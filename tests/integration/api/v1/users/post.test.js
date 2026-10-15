import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "daniel",
          email: "danielgrafael@gmail.com",
          password: "test",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      console.log(responseBody);

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "daniel",
        email: "danielgrafael@gmail.com",
        password: "test",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With duplicated `email`", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedemail1",
          email: "duplicateemail1@gmail.com",
          password: "test",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedemail2",
          email: "duplicateemail1@gmail.com",
          password: "test",
        }),
      });

      const result = await response2.json();

      expect(response2.status).toBe(400);
      expect(result).toEqual({
        name: "ValidationError",
        message: "email already in use",
        action: "provide another email",
        status_code: 400,
      });
    });

    test("With duplicated `username`", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedusername",
          email: "nonDuplicatedEmail@gmail.com",
          password: "test",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedusername",
          email: "duplicateemai2@gmail.com",
          password: "test",
        }),
      });

      const result = await response2.json();

      expect(response2.status).toBe(400);
      expect(result).toEqual({
        name: "ValidationError",
        message: "username already in use",
        action: "provide another username",
        status_code: 400,
      });
    });

    test("With empty `username`", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "",
          email: "nonDuplicatedEmail@gmail.com",
          password: "test",
        }),
      });

      expect(response.status).toBe(400);

      const result = await response.json();

      expect(result).toEqual({
        name: "ValidationError",
        message: "username field is mandatory",
        action: "please provide value to username",
        status_code: 400,
      });
    });

    test("With empty `email`", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "username",
          email: "",
          password: "test",
        }),
      });

      expect(response.status).toBe(400);

      const result = await response.json();

      expect(result).toEqual({
        name: "ValidationError",
        message: "email field is mandatory",
        action: "please provide value to email",
        status_code: 400,
      });
    });
  });
});
