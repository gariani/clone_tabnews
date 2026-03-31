import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdated = new Date(responseBody.updated_at).toISOString();

  expect(responseBody.updated_at).toEqual(parsedUpdated);
});

test("GET to /api/v1/databaseVersion should return 16.0", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  const responseBoby = await response.json();
  expect(responseBoby.db_version).toEqual("16.0");
});

test("GET to /api/v1/status should return -1", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();

  expect(responseBody.db_max_conn).toEqual(100);
});

test("GET to /api/v1/status should return 0", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();

  expect(responseBody.db_total_active_connections).toEqual(1);
});

// test.only("GET to /api/v1/status should return 1", async () => {
//   const response = await fetch("http://localhost:3000/api/v1/status");
// });
