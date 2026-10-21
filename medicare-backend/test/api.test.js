import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}/api`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("GET /api/health returns 200 Healthy status", async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, "healthy");
});

test("GET /api/public/summary returns clinical platform metrics", async () => {
  const res = await fetch(`${baseUrl}/public/summary`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.data.activeDoctors >= 0);
  assert.ok(Array.isArray(data.data.departments));
});

test("GET /api/doctors returns verified physician directory", async () => {
  const res = await fetch(`${baseUrl}/doctors`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.data));
});

test("POST /api/auth/login validates credentials and issues JWT token", async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "patient@medicore.health",
      password: "patient123",
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.data.token);
  assert.equal(data.data.user.email, "patient@medicore.health");
});

test("POST /api/auth/register prevents privilege escalation to admin", async () => {
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Escalation Test",
      email: `test-${Date.now()}@test.com`,
      password: "StrongPassword123",
      role: "admin",
    }),
  });
  // Must reject admin role in public registration
  assert.equal(res.status, 400);
});

test("GET /api/appointments requires authentication (401 Unauthorized)", async () => {
  const res = await fetch(`${baseUrl}/appointments`);
  assert.equal(res.status, 401);
});
