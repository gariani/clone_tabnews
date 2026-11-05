import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user: ", () => {
    test("With nonexistent 'username'", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/NonExistentUser",
        {
          method: "PATCH",
        },
      );

      const body = await response.json();

      expect(body.status_code).toBe(404);
      expect(body).toEqual({
        name: "NotFoundError",
        message: "Username not found",
        action: "Try another one",
        status_code: 404,
      });
    });

    test("With existent 'username'", async () => {
      const user1 = await orchestrator.createUser({
        username: "user1",
      });

      const user2 = await orchestrator.createUser({
        username: "user2",
      });

      const user3Response = await fetch(
        `http://localhost:3000/api/v1/users/${user1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user2.username,
          }),
        },
      );

      expect(user3Response.status).toBe(400);

      const body3 = await user3Response.json();
      expect(body3).toEqual({
        name: "ValidationError",
        message: "username already in use",
        action: "provide another username",
        status_code: 400,
      });
    });

    test("With existent 'email'", async () => {
      const user3 = await orchestrator.createUser({
        username: "user3",
        email: "user3@gmail.com",
      });

      const user4 = await orchestrator.createUser({
        username: "user4",
        email: "user4@gmail.com",
      });

      const user3Response = await fetch(
        `http://localhost:3000/api/v1/users/${user4.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user3.email,
          }),
        },
      );

      expect(user3Response.status).toBe(400);

      const body3 = await user3Response.json();
      expect(body3).toEqual({
        name: "ValidationError",
        message: "email already in use",
        action: "provide another email",
        status_code: 400,
      });
    });

    test("With non existent 'email'", async () => {
      const user5 = await orchestrator.createUser({
        email: "user5@gmail.com",
      });

      const user3Response = await fetch(
        `http://localhost:3000/api/v1/users/${user5.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "user6@gmail.com",
          }),
        },
      );

      expect(user3Response.status).toBe(201);

      const response3Body = await user3Response.json();

      expect(uuidVersion(response3Body.id)).toBe(4);
      expect(Date.parse(response3Body.created_at)).not.toBeNaN();
      expect(Date.parse(response3Body.updated_at)).not.toBeNaN();

      expect(response3Body.updated_at > response3Body.created_at).toBe(true);
    });

    test("With new 'password'", async () => {
      await orchestrator.createUser({
        username: "newpassworduser1",
        email: "newpassworduser1@gmail.com",
      });

      const user3Response = await fetch(
        "http://localhost:3000/api/v1/users/newpassworduser1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: "newpassworduser2",
          }),
        },
      );

      expect(user3Response.status).toBe(201);

      const response3Body = await user3Response.json();

      expect(response3Body).toEqual({
        id: response3Body.id,
        username: "newpassworduser1",
        email: "newpassworduser1@gmail.com",
        password: response3Body.password,
        created_at: response3Body.created_at,
        updated_at: response3Body.updated_at,
      });

      expect(uuidVersion(response3Body.id)).toBe(4);
      expect(Date.parse(response3Body.created_at)).not.toBeNaN();
      expect(Date.parse(response3Body.updated_at)).not.toBeNaN();

      expect(response3Body.updated_at > response3Body.created_at).toBe(true);

      const userInDatabase = await user.findOneByUsername("newpassworduser1");
      const correctPassMatch = await password.compare(
        "newpassworduser2",
        userInDatabase.password,
      );
      expect(correctPassMatch).toBe(true);

      const incorrectPassword = await password.compare(
        "newpassworduser1",
        userInDatabase.password,
      );
      expect(incorrectPassword).toBe(false);
    });
  });
});
