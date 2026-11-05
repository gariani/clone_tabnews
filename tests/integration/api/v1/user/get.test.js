import orchestrator from "tests/orchestrator.js";
import session from "models/session.js";
import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/user", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const createUser = await orchestrator.createUser({
        username: "UserWithValidSession",
      });

      const sessionObject = await orchestrator.createSession(createUser.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        created_at: responseBody.created_at,
        email: responseBody.email,
        id: responseBody.id,
        password: responseBody.password,
        updated_at: responseBody.updated_at,
        username: responseBody.username,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      //Renew Cookie
      const renewedSessionObject = await session.findOneValidByToken(
        sessionObject.token,
      );

      expect(
        renewedSessionObject.expires_at > sessionObject.expires_at,
      ).toEqual(true);
      expect(
        renewedSessionObject.updated_at > sessionObject.updated_at,
      ).toEqual(true);

      //Set-Cookie
      const parserSetCookie = setCookieParser(
        response.headers.get("set-cookie"),
        {
          map: true,
        },
      );

      expect(parserSetCookie.session_id).toEqual({
        name: "session_id",
        value: sessionObject.token,
        path: "/",
        maxAge: session.getExpiration() / 1000,
        httpOnly: true,
        sameSite: "Lax",
        expires: expect.any(Date),
      });
    });

    test("With nonexistent session", async () => {
      const nonexistent =
        "83842cbc93a51bfb2f358fa392a1798fba9ac97d51bd75b125878d4ae8d42670c99632931075a9b86c185b13d4e38c29";

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          cookie: `session_id=${nonexistent}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Try to log in again!",
        message: "Invalid session",
        name: "UnauthorizedError",
        status_code: 401,
      });
    });

    test("With expired session", async () => {
      jest.useFakeTimers({ now: new Date() - session.getExpiration() });

      const createUser = await orchestrator.createUser({
        username: "UserWithExpiredSession",
      });

      const sessionObject = await orchestrator.createSession(createUser.id);

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Try to log in again!",
        message: "Invalid session",
        name: "UnauthorizedError",
        status_code: 401,
      });
    });

    test("With session about to be invalid", async () => {
      const extraTime = 1000; // 1 second;
      jest.useFakeTimers({
        now: new Date(Date.now() - session.getExpiration() + extraTime),
      });
      const createdUser = await orchestrator.createUser({
        username: "SessionAboutToBeInvalid",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: "SessionAboutToBeInvalid",
        email: createdUser.email,
        password: createdUser.password,
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      // Session renewal assertions
      const renewedSessionObject = await session.findOneValidByToken(
        sessionObject.token,
      );

      expect(
        renewedSessionObject.expires_at > sessionObject.expires_at,
      ).toEqual(true);

      expect(
        renewedSessionObject.updated_at > sessionObject.updated_at,
      ).toEqual(true);

      //Set-cookie assertions
      const parsedSetCookie = setCookieParser(response, { map: true });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: sessionObject.token,
        maxAge: session.getExpiration() / 1000,
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        expires: expect.any(Date),
      });
    });
  });
});
