import orchestrator from "tests/orchestrator.js";
import password from "models/password";
import { version as uuidVersion } from "uuid";
import session from "models/session.js";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user: ", () => {
    test("With incorrect `email` but correct `password`", async () => {
      await orchestrator.createUser({
        password: "correct-password",
      });

      const response2 = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email.incorrect@daniel.com",
          password: "correct-password",
        }),
      });

      expect(response2.status).toBe(401);

      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Incorrect username/password",
        action: "Check the infomation and try it again!",
        status_code: 401,
      });
    });

    test("With correct `email` but incorrect `password`", async () => {
      await orchestrator.createUser({
        email: "correct_email@gmail.com",
        password: "correct-password",
      });

      const response2 = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "correct_email@gmail.com",
          password: "incorrect-password",
        }),
      });

      expect(response2.status).toBe(401);

      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Incorrect username/password",
        action: "Check the infomation and try it again!",
        status_code: 401,
      });
    });

    test("With incorrect `email` but incorrect `password`", async () => {
      await orchestrator.createUser({});

      const response2 = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "incorrect_email@gmail.com",
          password: "incorrect-password",
        }),
      });

      expect(response2.status).toBe(401);

      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Incorrect username/password",
        action: "Check the infomation and try it again!",
        status_code: 401,
      });
    });

    test("With correct `email` but correct `password`", async () => {
      const createdUser = await orchestrator.createUser({
        email: "tudo.correto@gmail.com",
        password: "tudocorreto",
      });

      const response2 = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "tudo.correto@gmail.com",
          password: "tudocorreto",
        }),
      });

      expect(response2.status).toBe(201);

      const responseBody = await response2.json();
      const correctPassMatch = await password.compare(
        "tudocorreto",
        createdUser.password,
      );

      expect(correctPassMatch).toBe(true);
      expect(responseBody).toEqual({
        id: expect.any(String),
        token: expect.any(String),
        user_id: createdUser.id,
        expires_at: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);

      expect(responseBody.token).toHaveLength(96);

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();

      const createdAt = new Date(responseBody.created_at);
      const expiresAt = new Date(responseBody.expires_at);

      createdAt.setMilliseconds(0);
      expiresAt.setMilliseconds(0);

      expect(expiresAt - createdAt).toBe(session.getExpiration());

      const parserSetCookie = setCookieParser(
        response2.headers.get("set-cookie"),
        {
          map: true,
        },
      );

      expect(parserSetCookie.session_id).toEqual({
        name: "session_id",
        value: responseBody.token,
        path: "/",
        maxAge: session.getExpiration() / 1000,
        expires: new Date(
          Math.floor(Date.parse(responseBody.expires_at) / 1000) * 1000,
        ),
        httpOnly: true,
        sameSite: "Lax",
      });
    });
  });
});
